import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface GlossaryTerm {
  source: string
  target: string
}

interface TranslateRequest {
  text: string
  source_lang?: string | null
  target_lang: string
  tone?: string
  glossary?: GlossaryTerm[]
}

// Simple in-memory storage for demo purposes
// In production, use Redis, database, or persistent storage
const dailyUsageTracker = new Map<string, { date: string; charactersUsed: number }>()

function getUserIpHash(request: NextRequest): string {
  // Get IP address for tracking (in production, use user ID)
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1"
  return Buffer.from(ip).toString('base64').substring(0, 10) // Simple hash for demo
}

function checkAndUpdateDailyUsage(userHash: string, characterCount: number): { canUseFree: boolean; dailyCharactersUsed: number; remainingFreeCharacters: number } {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  const userUsage = dailyUsageTracker.get(userHash)
  const DAILY_FREE_LIMIT = 600
  
  if (!userUsage || userUsage.date !== today) {
    // New day or new user
    const newUsage = characterCount
    dailyUsageTracker.set(userHash, { date: today, charactersUsed: newUsage })
    return { 
      canUseFree: newUsage <= DAILY_FREE_LIMIT, 
      dailyCharactersUsed: newUsage,
      remainingFreeCharacters: Math.max(0, DAILY_FREE_LIMIT - newUsage)
    }
  } else {
    // Same day, add to existing usage
    const newTotalUsage = userUsage.charactersUsed + characterCount
    userUsage.charactersUsed = newTotalUsage
    dailyUsageTracker.set(userHash, userUsage)
    return { 
      canUseFree: newTotalUsage <= DAILY_FREE_LIMIT, 
      dailyCharactersUsed: newTotalUsage,
      remainingFreeCharacters: Math.max(0, DAILY_FREE_LIMIT - newTotalUsage)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json()
    const { text, source_lang, target_lang, tone, glossary } = body

    if (!text || !target_lang) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      )
    }

    // Check if Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    // Calculate credits and check free usage
    const characterCount = text.length
    const userHash = getUserIpHash(request)
    const { canUseFree, dailyCharactersUsed, remainingFreeCharacters } = checkAndUpdateDailyUsage(userHash, characterCount)
    
    // Determine if translation is free
    const isFree = canUseFree
    const creditsUsed = isFree ? 0 : Math.ceil(characterCount / 700)

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Map language codes to full names for better prompting
    const languageMap: { [key: string]: string } = {
      "EN": "English",
      "ES": "Spanish", 
      "FR": "French",
      "DE": "German",
      "IT": "Italian",
      "PT": "Portuguese",
      "RU": "Russian",
      "JA": "Japanese",
      "KO": "Korean",
      "ZH": "Chinese",
      "AR": "Arabic",
      "HI": "Hindi",
      "TR": "Turkish",
      "PL": "Polish",
      "NL": "Dutch",
      "SV": "Swedish",
      "DA": "Danish",
      "NO": "Norwegian",
      "FI": "Finnish"
    }

    const targetLanguageName = languageMap[target_lang] || target_lang
    const sourceLanguageName = source_lang && source_lang !== "auto" ? languageMap[source_lang] : null

    // Build the translation prompt based on tone and context
    let prompt = ""
    
    if (sourceLanguageName) {
      prompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}`
    } else {
      prompt = `Translate the following text to ${targetLanguageName}`
    }

    // Add tone instructions
    if (tone && tone !== "default") {
      switch (tone) {
        case "formal":
          prompt += " using a formal and professional tone"
          break
        case "informal":
          prompt += " using a casual and informal tone"
          break
        case "business":
          prompt += " using a business and corporate tone"
          break
        case "friendly":
          prompt += " using a warm and friendly tone"
          break
      }
    }

    // Add glossary instructions if provided
    if (glossary && glossary.length > 0) {
      prompt += `\n\nIMPORTANT - Use these specific glossary translations:
${glossary.map(term => `- "${term.source}" must be translated as "${term.target}"`).join('\n')}`
    }

    prompt += `. 

Important instructions:
- Provide ONLY the translated text, no explanations or additional commentary
- Maintain the original meaning and context
- Preserve formatting like line breaks and punctuation
- If the source language is unclear, detect it automatically
- Ensure the translation sounds natural in ${targetLanguageName}${glossary && glossary.length > 0 ? '\n- STRICTLY follow the glossary terms provided above for consistent translations' : ''}

Text to translate:
${text}`

    try {
      // Generate translation using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const translatedText = response.text()

      // Clean up the response (remove any unwanted formatting)
      const cleanTranslation = translatedText.trim()

      // Estimate source language if auto-detect was used
      let detectedLanguage = source_lang
      if (!source_lang || source_lang === "auto") {
        // Use a simple detection prompt
        const detectPrompt = `What language is this text written in? Respond with only the 2-letter language code (e.g., EN, ES, FR, etc.): "${text}"`
        const detectResult = await model.generateContent(detectPrompt)
        const detectResponse = await detectResult.response
        detectedLanguage = detectResponse.text().trim().toUpperCase()
      }

      return NextResponse.json({
        translated_text: cleanTranslation,
        detected_source_language: detectedLanguage,
        characters_used: characterCount,
        credits_used: creditsUsed,
        tone_applied: tone || "default",
        glossary_terms_used: glossary?.length || 0,
        model_used: "gemini-1.5-flash",
        api_provider: "Google Gemini AI",
        // Free usage tracking
        is_free: isFree,
        free_reason: isFree ? "daily_free_usage" : null,
        daily_usage_count: dailyCharactersUsed,
        remaining_free_characters: remainingFreeCharacters
      })

    } catch (geminiError) {
      console.error("Gemini API error:", geminiError)
      
      if (geminiError instanceof Error) {
        if (geminiError.message.includes("API_KEY_INVALID")) {
          return NextResponse.json(
            { error: "Invalid Gemini API key" },
            { status: 403 }
          )
        } else if (geminiError.message.includes("QUOTA_EXCEEDED")) {
          return NextResponse.json(
            { error: "Gemini API quota exceeded. Please try again later." },
            { status: 429 }
          )
        }
      }
      
      return NextResponse.json(
        { error: "Translation service temporarily unavailable" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from "next/server"

interface TranslateRequest {
  text: string
  source_lang?: string | null
  target_lang: string
  tone?: string
}

interface DeepLRequestBody {
  text: string[]
  target_lang: string
  source_lang?: string
  formality?: "more" | "less"
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json()
    const { text, source_lang, target_lang, tone } = body

    if (!text || !target_lang) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      )
    }

    // Check if DeepL API key is configured
    const deeplApiKey = process.env.DEEPL_API_KEY
    if (!deeplApiKey) {
      return NextResponse.json(
        { error: "DeepL API key not configured" },
        { status: 500 }
      )
    }

    // Determine API endpoint based on key type
    // Free accounts use api-free.deepl.com, Pro accounts use api.deepl.com
    // Free API keys end with :fx, Pro keys are UUID format without :fx
    const isFreeAccount = deeplApiKey.endsWith(":fx") // Free keys end with :fx
    const baseUrl = isFreeAccount 
      ? "https://api-free.deepl.com/v2" 
      : "https://api.deepl.com/v2"

    // Prepare the request body for DeepL API
    const deeplRequestBody: DeepLRequestBody = {
      text: [text],
      target_lang: target_lang,
    }

    // Add source language if specified (auto-detect if null)
    if (source_lang) {
      deeplRequestBody.source_lang = source_lang
    }

    // Map tone to DeepL formality parameter
    if (tone && tone !== "default") {
      switch (tone) {
        case "formal":
        case "business":
          deeplRequestBody.formality = "more"
          break
        case "informal":
        case "friendly":
          deeplRequestBody.formality = "less"
          break
      }
    }

    // Make request to DeepL API
    const formData = new URLSearchParams()
    formData.append('text', text)
    formData.append('target_lang', target_lang)
    
    if (source_lang) {
      formData.append('source_lang', source_lang)
    }
    
    if (deeplRequestBody.formality) {
      formData.append('formality', deeplRequestBody.formality)
    }

    const deeplResponse = await fetch(`${baseUrl}/translate`, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${deeplApiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })

    if (!deeplResponse.ok) {
      const errorText = await deeplResponse.text()
      console.error("DeepL API error:", errorText)
      
      if (deeplResponse.status === 403) {
        return NextResponse.json(
          { error: "Invalid API key or quota exceeded" },
          { status: 403 }
        )
      } else if (deeplResponse.status === 456) {
        return NextResponse.json(
          { error: "Quota exceeded. Please try again later." },
          { status: 456 }
        )
      } else {
        return NextResponse.json(
          { error: "Translation service temporarily unavailable" },
          { status: 500 }
        )
      }
    }

    const deeplData = await deeplResponse.json()
    
    if (!deeplData.translations || deeplData.translations.length === 0) {
      return NextResponse.json(
        { error: "No translation returned from service" },
        { status: 500 }
      )
    }

    const translatedText = deeplData.translations[0].text
    const detectedLanguage = deeplData.translations[0].detected_source_language

    return NextResponse.json({
      translated_text: translatedText,
      detected_source_language: detectedLanguage,
      characters_used: text.length,
      credits_used: Math.ceil(text.length / 700),
      tone_applied: tone || "default",
      api_endpoint_used: baseUrl
    })

  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
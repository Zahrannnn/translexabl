import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sourceLang = formData.get('source_lang') as string
    const targetLang = formData.get('target_lang') as string
    const tone = formData.get('tone') as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!targetLang) {
      return NextResponse.json({ error: "Target language is required" }, { status: 400 })
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
    const isFreeAccount = deeplApiKey.endsWith(":fx")
    const baseUrl = isFreeAccount 
      ? "https://api-free.deepl.com/v2" 
      : "https://api.deepl.com/v2"

    // Step 1: Upload document to DeepL
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('target_lang', targetLang)
    
    if (sourceLang && sourceLang !== "auto") {
      uploadFormData.append('source_lang', sourceLang)
    }

    // Map tone to DeepL formality parameter
    if (tone && tone !== "default") {
      switch (tone) {
        case "formal":
        case "business":
          uploadFormData.append('formality', 'more')
          break
        case "informal":
        case "friendly":
          uploadFormData.append('formality', 'less')
          break
      }
    }

    console.log("Uploading document to DeepL...")
    const uploadResponse = await fetch(`${baseUrl}/document`, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${deeplApiKey}`,
      },
      body: uploadFormData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error("DeepL document upload error:", errorText)
      throw new Error("Document upload failed")
    }

    const uploadData = await uploadResponse.json()
    const { document_id, document_key } = uploadData

    console.log("Document uploaded, checking status...")

    // Step 2: Poll for translation completion
    let translationComplete = false
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max (5 second intervals)
    let statusData: any

    while (!translationComplete && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
      
      const statusResponse = await fetch(`${baseUrl}/document/${document_id}`, {
        method: "POST",
        headers: {
          "Authorization": `DeepL-Auth-Key ${deeplApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_key: document_key
        }),
      })

      if (!statusResponse.ok) {
        throw new Error("Failed to check translation status")
      }

      statusData = await statusResponse.json()
      console.log("Translation status:", statusData.status)

      if (statusData.status === "done") {
        translationComplete = true
      } else if (statusData.status === "error") {
        throw new Error(statusData.message || "Translation failed")
      }

      attempts++
    }

    if (!translationComplete) {
      throw new Error("Translation timeout - please try again")
    }

    // Step 3: Download the translated document
    console.log("Downloading translated document...")
    const downloadResponse = await fetch(`${baseUrl}/document/${document_id}/result`, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${deeplApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document_key: document_key
      }),
    })

    if (!downloadResponse.ok) {
      throw new Error("Failed to download translated document")
    }

    // Save the translated document
    const translatedBuffer = await downloadResponse.arrayBuffer()
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const fileId = Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    const originalFileName = file.name
    const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const translatedFileName = `translated_${sanitizedFileName}`
    const translatedFilePath = path.join(uploadDir, `${fileId}_${translatedFileName}`)

    // Save the translated document
    await writeFile(translatedFilePath, Buffer.from(translatedBuffer))

    // Calculate credits used (from status response)
    // DeepL has minimum billing of 50,000 characters per document
    const MINIMUM_CHARACTERS_PER_DOCUMENT = 50000
    const actualCharacters = statusData.billed_characters || MINIMUM_CHARACTERS_PER_DOCUMENT
    const creditsUsed = Math.ceil(actualCharacters / 700)
    const estimatedPages = Math.ceil(actualCharacters / 2000)

    return NextResponse.json({
      success: true,
      file_id: fileId,
      original_filename: originalFileName,
      translated_filename: translatedFileName,
      file_format: path.extname(file.name).replace('.', '').toUpperCase(),
      characters_translated: statusData.billed_characters || 0,
      credits_used: creditsUsed,
      pages_translated: estimatedPages,
      detected_source_language: statusData.detected_source_language || sourceLang,
      target_language: targetLang,
      tone_applied: tone || "default",
      translation_preview: "Document successfully translated with DeepL API",
      download_url: `/api/download-translated/${fileId}`,
      deepl_document_id: document_id
    })

  } catch (error) {
    console.error("Document translation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Document translation failed" },
      { status: 500 }
    )
  }
} 
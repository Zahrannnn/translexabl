import { NextRequest, NextResponse } from "next/server"
import { translatedFilesStore } from "@/lib/file-store"

// Constants for DeepL API
const DEEPL_PRO_ENDPOINT = "https://api.deepl.com/v2"
const POLL_INTERVAL = 2000 // 2 seconds between status checks
const MAX_POLL_TIME = 300000 // 5 minutes timeout
const MIN_CHARS_PER_DOC = 50000 // DeepL minimum billing per document
const CHARS_PER_CREDIT = 700 // Characters per credit

// Content type mapping
const CONTENT_TYPES = {
  'pdf': 'application/pdf',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'doc': 'application/msword',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'txt': 'text/plain',
  'srt': 'text/plain',
  'html': 'text/html',
  'htm': 'text/html'
} as const

// DeepL API response types
interface DeepLDocumentUploadResponse {
  document_id: string
  document_key: string
}

interface DeepLDocumentStatusResponse {
  document_id: string
  status: 'queued' | 'translating' | 'done' | 'error'
  seconds_remaining?: number
  billed_characters?: number
  detected_source_language?: string
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validate request and API key
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sourceLang = formData.get('source_lang') as string
    const targetLang = formData.get('target_lang') as string
    const tone = formData.get('tone') as string

    if (!file || !targetLang) {
      return NextResponse.json(
        { error: !file ? "No file uploaded" : "Target language is required" },
        { status: 400 }
      )
    }

    const deeplApiKey = process.env.DEEPL_API_KEY
    if (!deeplApiKey) {
      return NextResponse.json({ error: "DeepL API key not configured" }, { status: 500 })
    }

    // 2. Configure API endpoint and upload document
    const baseUrl = deeplApiKey.endsWith(":fx") ? DEEPL_PRO_ENDPOINT : DEEPL_PRO_ENDPOINT
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('target_lang', targetLang)
    
    if (sourceLang && sourceLang !== "auto") {
      uploadFormData.append('source_lang', sourceLang)
    }
    
    if (tone && tone !== "default") {
      uploadFormData.append('formality', ['formal', 'business'].includes(tone) ? 'more' : 'less')
    }

    const uploadResponse = await fetch(`${baseUrl}/document`, {
      method: "POST",
      headers: { "Authorization": `DeepL-Auth-Key ${deeplApiKey}` },
      body: uploadFormData,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Document upload failed: ${await uploadResponse.text()}`)
    }

    // 3. Poll for translation completion
    const { document_id, document_key } = await uploadResponse.json() as DeepLDocumentUploadResponse
    const startTime = Date.now()
    let statusData: DeepLDocumentStatusResponse | null = null

    while (Date.now() - startTime < MAX_POLL_TIME) {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))
      
      const statusResponse = await fetch(`${baseUrl}/document/${document_id}`, {
        method: "POST",
        headers: {
          "Authorization": `DeepL-Auth-Key ${deeplApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document_key }),
      })

      if (!statusResponse.ok) {
        throw new Error("Failed to check translation status")
      }

      statusData = await statusResponse.json() as DeepLDocumentStatusResponse
      if (statusData.status === "done") break
      if (statusData.status === "error") {
        throw new Error(statusData.message || "Translation failed")
      }
    }

    if (!statusData || statusData.status !== "done") {
      throw new Error("Translation timeout - please try again")
    }

    // 4. Download and store translated document
    const downloadResponse = await fetch(`${baseUrl}/document/${document_id}/result`, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${deeplApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document_key }),
    })

    if (!downloadResponse.ok) {
      throw new Error("Failed to download translated document")
    }

    const translatedBuffer = await downloadResponse.arrayBuffer()
    const fileId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const originalFileName = file.name
    const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const translatedFileName = `translated_${sanitizedFileName}`
    const fileExtension = originalFileName.toLowerCase().split('.').pop() || ''
    
    // Store translated file in memory
    translatedFilesStore.set(fileId, {
      buffer: Buffer.from(translatedBuffer),
      filename: translatedFileName,
      contentType: CONTENT_TYPES[fileExtension as keyof typeof CONTENT_TYPES] || 'application/octet-stream',
      originalFileName
    })

    // 5. Calculate usage and return response
    const actualCharacters = statusData.billed_characters || MIN_CHARS_PER_DOC
    const creditsUsed = Math.ceil(actualCharacters / CHARS_PER_CREDIT)
    const estimatedPages = Math.ceil(actualCharacters / 2000)

    return NextResponse.json({
      success: true,
      file_id: fileId,
      original_filename: originalFileName,
      translated_filename: translatedFileName,
      file_format: fileExtension.toUpperCase(),
      characters_translated: actualCharacters,
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
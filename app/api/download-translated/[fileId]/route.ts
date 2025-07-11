import { NextRequest, NextResponse } from "next/server"
import { readFile, readdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { fileId } = await params

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'uploads')
    
    // Find the translated file - it should start with the fileId and have "translated_" prefix
    const files = await readdir(uploadsDir)
    const translatedFile = files.find((file: string) => 
      file.startsWith(`${fileId}_translated_`)
    )

    if (!translatedFile) {
      return NextResponse.json({ error: "Translated file not found" }, { status: 404 })
    }

    const filePath = path.join(uploadsDir, translatedFile)
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read the file buffer
    const fileBuffer = await readFile(filePath)
    
    // Get the original filename (remove the fileId prefix)
    const originalName = translatedFile.replace(`${fileId}_translated_`, '')
    const originalExt = path.extname(originalName).toLowerCase()
    
    // Since we're now using DeepL's actual document translation API,
    // the files maintain their original format with proper translation
    let downloadName = originalName
    let contentType = 'application/octet-stream'
    
    // Set appropriate content type based on file extension
    switch (originalExt) {
      case '.txt':
      case '.srt':
        contentType = 'text/plain; charset=utf-8'
        break
      case '.pdf':
        contentType = 'application/pdf'
        break
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        break
      case '.doc':
        contentType = 'application/msword'
        break
      case '.pptx':
        contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        break
      case '.xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
      case '.html':
      case '.htm':
        contentType = 'text/html; charset=utf-8'
        break
      case '.xlf':
      case '.xliff':
        contentType = 'application/xliff+xml'
        break
      default:
        contentType = 'application/octet-stream'
    }

    // Return the file as a download with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(downloadName)}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    })

  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    )
  }
} 
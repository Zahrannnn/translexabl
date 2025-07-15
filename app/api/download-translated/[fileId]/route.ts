import { NextRequest, NextResponse } from "next/server"
import { translatedFilesStore } from "@/lib/file-store"

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

    // Get the file from the shared in-memory store
    const fileData = translatedFilesStore.get(fileId)
    
    if (!fileData) {
      console.log(`File ${fileId} not found in store. Store size: ${translatedFilesStore.size()}`)
      return NextResponse.json({ 
        error: "Translated file not found or has expired. Please translate the document again." 
      }, { status: 404 })
    }

    const { buffer, filename, contentType, originalFileName } = fileData
    console.log(`Serving file ${fileId}: ${filename} (${buffer.length} bytes)`)
    
    // Return the file as a download with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': buffer.length.toString(),
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
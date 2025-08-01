import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: blogId } = await params
    
    console.log(`Proxying request for blog post ${blogId} to backend API...`)
    
    // Use the public blog endpoint for individual posts
    const response = await fetch(`https://translatex-production-fb26.up.railway.app/api/blogs/${blogId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    console.log('Backend response status:', response.status)
    console.log('Backend response ok:', response.ok)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { message: 'Blog post not found' },
          { status: 404 }
        )
      }
      
      const errorText = await response.text()
      console.error('Backend API error:', errorText)
      return NextResponse.json(
        { message: errorText || 'Failed to fetch blog post' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Backend returned blog post:', data)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Blog post proxy error:', error)
    
    // Check if it's a connection error
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { message: 'Backend API server is not running' },
        { status: 503 }
      )
    }
    
    // Return mock data for development/testing
    const { id: blogId } = await params
    const mockPost = {
      id: parseInt(blogId),
      title: "Mock Blog Post - API Connection Error",
      content: `<h2>API Connection Error</h2><p>This is a mock blog post displayed when the backend API is unavailable. The actual content would come from your backend API.</p><p>Blog ID: ${blogId}</p><p>Please check your backend API connection and try again.</p>`,
      summary: "This is a mock blog post displayed when the API is unavailable. Check the console for error details.",
      author: "System",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["test", "mock", "error"],
      category: "System",
      published: true
    }
    
    return NextResponse.json(mockPost, { status: 200 })
  }
} 
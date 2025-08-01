import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Proxying request to backend API...')
    
    // Use the public blogs endpoint instead of admin endpoint
    const response = await fetch('http://translatex-production-fb26.up.railway.app/api/blogs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    console.log('Backend response status:', response.status)
    console.log('Backend response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error:', errorText)
      return NextResponse.json(
        { message: errorText || 'Failed to fetch blog posts' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Backend returned:', data.length, 'blog posts')
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Blog posts proxy error:', error)
    
    // Check if it's a connection error
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { message: 'Backend API server is not running on localhost:8085' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error - backend API unavailable' },
      { status: 500 }
    )
  }
} 
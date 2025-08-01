import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch('http://translatex-production-fb26.up.railway.app/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.text()
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data || 'Email verification failed' },
        { status: response.status }
      )
    }

    // Try to parse as JSON, fallback to text
    let responseData
    try {
      responseData = JSON.parse(data)
    } catch {
      responseData = { message: 'Email verified successfully' }
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Email verification proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 
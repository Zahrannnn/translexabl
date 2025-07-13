import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch('http://localhost:8085/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.text()
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data || 'Registration failed' },
        { status: response.status }
      )
    }

    // Try to parse as JSON, fallback to text
    let responseData
    try {
      responseData = JSON.parse(data)
    } catch {
      responseData = { message: 'Registration successful' }
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Registration proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 
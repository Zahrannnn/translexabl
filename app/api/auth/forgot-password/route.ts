import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { email } = body
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Sending verification code to:', email)

    // Make request to backend API without authentication (similar to register/verify-email)
    const response = await fetch(`https://translatex-production-fb26.up.railway.app/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.text()
    console.log('Backend response status:', response.status)
    console.log('Backend response data:', data)
    
    if (!response.ok) {
      let errorMessage = 'Failed to send verification code'
      try {
        const errorData = JSON.parse(data)
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = data || errorMessage
      }
      
      console.error('Backend error:', errorMessage)
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      )
    }

    // Parse successful response
    let responseData
    try {
      responseData = JSON.parse(data)
    } catch {
      // If response is not JSON, assume success
      responseData = { message: 'Verification code sent successfully' }
    }

    console.log('Success response:', responseData)
    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Forgot password proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 
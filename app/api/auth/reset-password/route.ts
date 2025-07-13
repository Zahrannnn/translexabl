import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get the access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token not found. Please login first.' },
        { status: 401 }
      )
    }

    // Validate required fields
    const { email, code, newPassword } = body
    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { message: 'Email, code, and new password are required' },
        { status: 400 }
      )
    }

    // Make request to backend API
    const response = await fetch('https://translatex-production.up.railway.app/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        code,
        newPassword
      }),
    })

    const data = await response.text()
    
    if (!response.ok) {
      let errorMessage = 'Password reset failed'
      try {
        const errorData = JSON.parse(data)
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = data || errorMessage
      }
      
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
      responseData = { message: 'Password reset successful' }
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Reset password proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 
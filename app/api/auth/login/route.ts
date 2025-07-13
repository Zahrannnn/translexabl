import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Transform the request body to match backend expectations
    const backendBody = {
      emailOrUsername: body.email, // Backend expects emailOrUsername field
      password: body.password
    }
    
    const response = await fetch('https://translatex-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendBody),
    })

    const data = await response.text()
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data || 'Login failed' },
        { status: response.status }
      )
    }

    // Parse the successful response
    let responseData
    try {
      responseData = JSON.parse(data)
    } catch {
      return NextResponse.json(
        { message: 'Invalid response from server' },
        { status: 500 }
      )
    }

    // Create the response
    const loginResponse = NextResponse.json({
      success: true,
      user: {
        userId: responseData.userId,
        username: responseData.username,
        email: responseData.email,
        role: responseData.role
      }
    }, { status: 200 })

    // Set secure HTTP-only cookies for tokens
    
    // Set access token (expires in 1 hour)
    loginResponse.cookies.set('accessToken', responseData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    })

    // Set refresh token (expires in 7 days)
    loginResponse.cookies.set('refreshToken', responseData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    // Set user info in a readable cookie (for client-side access)
    loginResponse.cookies.set('user', JSON.stringify({
      userId: responseData.userId,
      username: responseData.username,
      email: responseData.email,
      role: responseData.role
    }), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return loginResponse
  } catch (error) {
    console.error('Login proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 
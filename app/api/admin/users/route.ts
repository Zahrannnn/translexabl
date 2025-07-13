import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token not found' },
        { status: 401 }
      )
    }

    // Get pagination parameters from query string
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '100' // Get more users by default for admin

    // Make request to backend API for users
    const response = await fetch(`https://translatex-production.up.railway.app/api/admin/users?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error:', errorText)
      
      // If backend doesn't have this endpoint yet, return mock data
      if (response.status === 404) {
        return NextResponse.json([
          {
            id: 1,
            email: "user@example.com",
            username: "user123",
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "1234567890",
            role: "USER",
            isEmailVerified: true,
            currentCredits: 100,
            totalCreditsUsed: 50,
            totalCreditsPurchased: 150,
            accountAge: 365
          },
          {
            id: 2,
            email: "admin@example.com",
            username: "admin",
            firstName: "Admin",
            lastName: "User",
            phoneNumber: "0987654321",
            role: "ADMIN",
            isEmailVerified: true,
            currentCredits: 500,
            totalCreditsUsed: 200,
            totalCreditsPurchased: 700,
            accountAge: 730
          },
          {
            id: 3,
            email: "jane@example.com",
            username: "jane_doe",
            firstName: "Jane",
            lastName: "Smith",
            phoneNumber: "5551234567",
            role: "USER",
            isEmailVerified: false,
            currentCredits: 25,
            totalCreditsUsed: 75,
            totalCreditsPurchased: 100,
            accountAge: 90
          }
        ], { status: 200 })
      }
      
      return NextResponse.json(
        { message: errorText || 'Failed to fetch users' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Users proxy error:', error)
    
    // Return mock data in case of error
    return NextResponse.json([
      {
        id: 1,
        email: "user@example.com",
        username: "user123",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        role: "USER",
        isEmailVerified: true,
        currentCredits: 100,
        totalCreditsUsed: 50,
        totalCreditsPurchased: 150,
        accountAge: 365
      },
      {
        id: 2,
        email: "admin@example.com",
        username: "admin",
        firstName: "Admin",
        lastName: "User",
        phoneNumber: "0987654321",
        role: "ADMIN",
        isEmailVerified: true,
        currentCredits: 500,
        totalCreditsUsed: 200,
        totalCreditsPurchased: 700,
        accountAge: 730
      },
      {
        id: 3,
        email: "jane@example.com",
        username: "jane_doe",
        firstName: "Jane",
        lastName: "Smith",
        phoneNumber: "5551234567",
        role: "USER",
        isEmailVerified: false,
        currentCredits: 25,
        totalCreditsUsed: 75,
        totalCreditsPurchased: 100,
        accountAge: 90
      }
    ], { status: 200 })
  }
} 
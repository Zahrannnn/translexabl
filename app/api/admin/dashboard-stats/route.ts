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

    // Make request to backend API for dashboard stats
    const response = await fetch('https://translatex-production.up.railway.app/api/admin/dashboard', {
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
        return NextResponse.json({
          totalUsers: 100,
          totalCreditsSold: 10000,
          totalCreditsUsed: 8000,
          totalPayments: 200,
          totalBlogs: 50
        }, { status: 200 })
      }
      
      return NextResponse.json(
        { message: errorText || 'Failed to fetch dashboard stats' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Dashboard stats proxy error:', error)
    
    // Return mock data in case of error
    return NextResponse.json({
      totalUsers: 100,
      totalCreditsSold: 10000,
      totalCreditsUsed: 8000,
      totalPayments: 200,
      totalBlogs: 50
    }, { status: 200 })
  }
} 
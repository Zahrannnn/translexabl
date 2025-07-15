import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tid: string }> }
) {
  try {
    // Await params as required by Next.js
    const { tid } = await params
    
    console.log('Requesting transaction details for ID:', tid)
    
    // Get the access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value

    if (!accessToken) {
      console.log('No access token found')
      return NextResponse.json(
        { error: 'Access token not found' },
        { status: 401 }
      )
    }

    // Make request to external API
    const externalUrl = `https://translatex-production.up.railway.app/api/transactions/${tid}`
    console.log('Making request to:', externalUrl)
    
    const response = await fetch(externalUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('External API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('External API error:', errorText)
      
      // Try to parse the error response
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.error?.includes('Query did not return a unique result')) {
          return NextResponse.json(
            { 
              error: 'Multiple transactions found with this ID. This may be a database issue.',
              details: errorData.error 
            },
            { status: 400 }
          )
        }
      } catch (parseError) {
        // If we can't parse the error, fall back to generic message
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch transaction details',
          details: errorText 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('External API response data:', JSON.stringify(data, null, 2))
    
    // Validate that the returned transaction ID matches the requested one
    if (data.success && data.data && data.data.transactionId !== tid) {
      console.error('Transaction ID mismatch:', {
        requested: tid,
        returned: data.data.transactionId
      })
      return NextResponse.json(
        { 
          error: 'Transaction ID mismatch',
          details: `Requested transaction ${tid} but API returned transaction ${data.data.transactionId}. This may indicate a database issue.`,
          requestedId: tid,
          returnedId: data.data.transactionId
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Transaction details API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
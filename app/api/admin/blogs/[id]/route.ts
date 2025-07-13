import { NextRequest, NextResponse } from 'next/server'

// Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token not found' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id: blogId } = await params

    const response = await fetch(`https://translatex-production.up.railway.app/api/admin/blogs/${blogId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error:', errorText)
      return NextResponse.json(
        { message: errorText || 'Failed to update blog' },
        { status: response.status }
      )
    }

    // Try to parse as JSON, but handle plain text responses
    const contentType = response.headers.get('content-type')
    let data
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      // Handle plain text response
      const textResponse = await response.text()
      data = { message: textResponse || 'Blog updated successfully' }
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Update blog proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token not found' },
        { status: 401 }
      )
    }

    const { id: blogId } = await params

    const response = await fetch(`https://translatex-production.up.railway.app/api/admin/blogs/${blogId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error:', errorText)
      return NextResponse.json(
        { message: errorText || 'Failed to delete blog' },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete blog proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 
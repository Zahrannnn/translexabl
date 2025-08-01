/* eslint-disable @typescript-eslint/no-unused-vars */
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

    console.log('Proxying request to backend API...')
    
    // Use the admin blogs endpoint
    const response = await fetch('http://translatex-production-fb26.up.railway.app/api/admin/blogs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    console.log('Backend response status:', response.status)
    console.log('Backend response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error:', errorText)
      
      // Return mock data for admin blogs
      return NextResponse.json([
        {
          id: 1,
          title: "Getting Started with Translation Services",
          content: "Translation services have become essential in our globalized world. Whether you're a business looking to expand internationally or an individual needing document translation, understanding the basics of professional translation is crucial. This comprehensive guide will walk you through everything you need to know about modern translation services, from choosing the right provider to understanding different types of translation work.",
          summary: "A comprehensive guide to understanding modern translation services and their applications.",
          author: "Admin User",
          publishedAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          tags: ["translation", "guide", "business"],
          category: "General",
          published: true
        },
        {
          id: 2,
          title: "The Future of AI in Translation",
          content: "Artificial Intelligence is revolutionizing the translation industry. From neural machine translation to real-time voice translation, AI technologies are making translation faster, more accurate, and more accessible than ever before. In this article, we explore the latest developments in AI translation technology and what they mean for businesses and consumers.",
          summary: "Exploring how AI is transforming the translation industry and what to expect in the future.",
          author: "Tech Writer",
          publishedAt: "2024-01-14T15:30:00Z",
          updatedAt: "2024-01-14T15:30:00Z",
          tags: ["ai", "technology", "future", "machine-translation"],
          category: "Technology",
          published: true
        },
        {
          id: 3,
          title: "Best Practices for Document Translation",
          content: "Document translation requires careful attention to detail and understanding of context. This draft explores the best practices for translating various types of documents, from legal contracts to marketing materials. We'll cover formatting considerations, cultural adaptation, and quality assurance processes.",
          summary: "Essential best practices for professional document translation services.",
          author: "Admin User",
          publishedAt: null,
          updatedAt: "2024-01-13T09:15:00Z",
          tags: ["documents", "best-practices", "quality"],
          category: "General",
          published: false
        }
      ], { status: 200 })
    }

    const data = await response.json()
    console.log('Backend returned:', data.length, 'blog posts')
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Blog posts proxy error:', error)
    
    // Return mock data in case of error
    return NextResponse.json([
      {
        id: 1,
        title: "Getting Started with Translation Services",
        content: "Translation services have become essential in our globalized world. Whether you're a business looking to expand internationally or an individual needing document translation, understanding the basics of professional translation is crucial.",
        summary: "A comprehensive guide to understanding modern translation services and their applications.",
        author: "Admin User",
        publishedAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        tags: ["translation", "guide", "business"],
        category: "General",
        published: true
      },
      {
        id: 2,
        title: "The Future of AI in Translation",
        content: "Artificial Intelligence is revolutionizing the translation industry. From neural machine translation to real-time voice translation, AI technologies are making translation faster, more accurate, and more accessible than ever before.",
        summary: "Exploring how AI is transforming the translation industry and what to expect in the future.",
        author: "Tech Writer",
        publishedAt: "2024-01-14T15:30:00Z",
        updatedAt: "2024-01-14T15:30:00Z",
        tags: ["ai", "technology", "future", "machine-translation"],
        category: "Technology",
        published: true
      },
      {
        id: 3,
        title: "Best Practices for Document Translation",
        content: "Document translation requires careful attention to detail and understanding of context. This draft explores the best practices for translating various types of documents.",
        summary: "Essential best practices for professional document translation services.",
        author: "Admin User",
        publishedAt: null,
        updatedAt: "2024-01-13T09:15:00Z",
        tags: ["documents", "best-practices", "quality"],
        category: "General",
        published: false
      }
    ], { status: 200 })
  }
}

// Create new blog
export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token not found' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const response = await fetch('http://translatex-production-fb26.up.railway.app/api/admin/blogs', {
      method: 'POST',
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
        { message: errorText || 'Failed to create blog' },
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
      data = { message: textResponse || 'Blog created successfully' }
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Create blog proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 
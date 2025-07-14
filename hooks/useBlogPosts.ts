import { useQuery } from '@tanstack/react-query'

export interface BlogPost {
  id: number
  title: string
  content: string
  summary: string
  author: string
  publishedAt: string | null
  updatedAt: string
  tags: string[]
  category: string
  published: boolean
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
  console.log('Fetching blog posts from API proxy...')
  
  const response = await fetch('/api/blogs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
  
  console.log('Proxy response status:', response.status)
  console.log('Proxy response ok:', response.ok)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || `Failed to fetch blog posts: ${response.status}`)
  }
  
  const data = await response.json()
  console.log('Fetched blog posts:', data)
  console.log('Number of posts:', data.length)
  
  return data
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    retryDelay: 1000,
    // Fallback to mock data on error
    placeholderData: () => [
      {
        id: 1,
        title: "API Connection Error - Mock Data",
        content: "This is mock content to test the UI when the API is unavailable. The actual content would come from your backend API.",
        summary: "This is a mock blog post displayed when the API is unavailable. Check the console for error details.",
        author: "System",
        publishedAt: null,
        updatedAt: new Date().toISOString(),
        tags: ["test", "mock"],
        category: "System",
        published: false
      }
    ]
  })
} 
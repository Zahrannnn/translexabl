import { useQuery } from '@tanstack/react-query'
import { BlogPost } from './useBlogPosts'

async function fetchBlogPost(id: string): Promise<BlogPost | null> {
  try {
    console.log(`Fetching blog post ${id} from API proxy...`)
    
    const response = await fetch(`/api/blogs/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    console.log('Proxy response status:', response.status)
    console.log('Proxy response ok:', response.ok)
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to fetch blog post: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Fetched blog post:', data)
    
    return data
  } catch (error) {
    console.error('Error fetching blog post:', error)
    throw error
  }
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => fetchBlogPost(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: !!id, // Only run query if id exists
    // Provide fallback data for development/testing
    placeholderData: () => ({
      id: parseInt(id),
      title: "Loading Blog Post...",
      content: "Please wait while we load the blog post content.",
      summary: "Loading blog post summary...",
      author: "Loading...",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["loading"],
      category: "Loading",
      published: true
    })
  })
} 
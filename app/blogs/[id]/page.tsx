/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  User,
  Tag,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { useBlogPost } from "@/hooks/useBlogPost"
import { useBlogPosts } from "@/hooks/useBlogPosts"
import { useMemo, useEffect, useState } from "react"

// Related posts function
function getRelatedPosts(currentPostId: number, currentCategory: string, allPosts: any[]) {
  return allPosts
    .filter(post => post.id !== currentPostId && post.category === currentCategory && post.published)
    .slice(0, 3)
}

// Helper function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Helper function to format date
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Draft'
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  
  // Handle async params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    resolveParams()
  }, [params])
  
  const { data: post, isLoading, error, refetch, isFetching } = useBlogPost(id || '')
  const { data: allPosts = [] } = useBlogPosts()
  
  const relatedPosts = useMemo(() => {
    if (!post || !allPosts.length) return []
    return getRelatedPosts(post.id, post.category, allPosts)
  }, [post, allPosts])

  const readTime = useMemo(() => {
    if (!post) return ''
    return calculateReadTime(post.content)
  }, [post])

  // Show loading while resolving params
  if (!id) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error ? 'Failed to load the blog post.' : 'The blog post you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/blogs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
              {error && (
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/5 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="py-6 border-b border-border/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/blogs" className="hover:text-primary transition-colors">Blog</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{post.category}</span>
            </div>
            
            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Category and Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight max-w-4xl mx-auto">
              {post.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {post.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center space-x-1 bg-muted/50 text-muted-foreground px-3 py-1 rounded-full text-sm">
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="modern-card">
            <CardContent className="p-8 lg:p-12">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:gradient-text prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Related Articles</h2>
              <p className="text-muted-foreground text-lg">
                More insights from the {post.category} category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="modern-card hover-lift overflow-hidden rounded-2xl border-0 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {relatedPost.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(relatedPost.publishedAt || relatedPost.updatedAt)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-3">
                      {relatedPost.summary}
                    </CardDescription>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">{relatedPost.author}</p>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" asChild className="p-2 hover:bg-primary/10 rounded-full">
                        <Link href={`/blogs/${relatedPost.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="py-12 border-t border-border/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild className="flex items-center space-x-2">
              <Link href="/blogs">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Blog</span>
              </Link>
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Enjoyed this article? Share it with your network!
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Published {formatDate(post.publishedAt || post.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 
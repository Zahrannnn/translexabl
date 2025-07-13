import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  User,
  Tag,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"


interface BlogPost {
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

// Fetch blog post from API
async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`http://localhost:8085/api/blogs/${id}`, {
      cache: 'no-store' 
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Fetch all blog posts for related posts
async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('http://localhost:8085/api/blogs', {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Related posts function
function getRelatedPosts(currentPostId: number, currentCategory: string, allPosts: BlogPost[]) {
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPost(id)
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title: `${post.title} | TransleXable Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPost(id)
  
  if (!post) {
    notFound()
  }

  const allPosts = await getAllBlogPosts()
  const relatedPosts = getRelatedPosts(post.id, post.category, allPosts)
  const readTime = calculateReadTime(post.content)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/5 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="py-6 border-b border-border/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blogs" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{post.category}</span>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <article className="flex-1">
        <header className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Category and meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                {post.publishedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{readTime}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Summary */}
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                {post.summary}
              </p>

              {/* Author and actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-border/20">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{post.author}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated {formatDate(post.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                 
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <div 
              className="article-content text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border/20">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Button key={tag} variant="outline" size="sm" className="rounded-full hover-lift">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-16">
            <Card className="modern-card rounded-2xl border-0 p-8">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">About {post.author}</h3>
                  <p className="text-primary font-medium mb-4">
                    Content creator and translation expert sharing insights about language technology and global communication.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="mt-16 flex justify-between items-center">
            <Button variant="outline" asChild className="modern-card hover-lift">
              <Link href="/blogs" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>All Articles</span>
              </Link>
            </Button>

           
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Related Articles</h2>
              <p className="text-muted-foreground text-lg">
                Continue exploring insights in {post.category.toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="modern-card hover-lift overflow-hidden rounded-2xl border-0 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {relatedPost.category}
                      </span>
                      {relatedPost.publishedAt && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{calculateReadTime(relatedPost.content)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-2">
                      {relatedPost.summary}
                    </CardDescription>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <p className="text-xs font-medium">{relatedPost.author}</p>
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

            <div className="text-center mt-12">
              <Button variant="outline" asChild className="modern-card border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-3 rounded-xl hover-lift">
                <Link href="/blogs">View All Articles</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 
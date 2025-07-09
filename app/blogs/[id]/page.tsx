import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  User,
  Tag,
  Share2,
  MessageCircle,
  Heart,
  Eye,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock blog data - in a real app, this would come from an API or database
const blogPosts = [
  {
    id: "1",
    title: "The Future of AI-Powered Translation: Trends to Watch in 2025",
    excerpt: "Explore the cutting-edge developments in artificial intelligence that are revolutionizing the translation industry and what they mean for businesses worldwide.",
    content: `
      <h2>Introduction</h2>
      <p>AI translation technology has come a long way from simple word-for-word substitutions. As we move into 2025, we're witnessing unprecedented advancements that are reshaping how businesses and individuals communicate across language barriers.</p>
      
      <h2>The Evolution of Neural Machine Translation</h2>
      <p>Neural Machine Translation (NMT) has fundamentally changed the translation landscape. Unlike traditional statistical methods, NMT systems use deep learning to understand context, nuance, and cultural subtleties that were previously impossible for machines to grasp.</p>
      
      <blockquote>
        "The future of translation lies not in replacing human translators, but in empowering them with AI tools that enhance accuracy and efficiency." - Dr. Sarah Chen, Lead AI Researcher
      </blockquote>
      
      <h2>Key Trends Shaping 2025</h2>
      <h3>1. Real-time Conversational Translation</h3>
      <p>We're moving beyond text-based translation to real-time speech translation that preserves tone, emotion, and cultural context. This technology is particularly revolutionary for global business meetings and international negotiations.</p>
      
      <h3>2. Domain-Specific AI Models</h3>
      <p>Specialized AI models trained on specific industries (legal, medical, technical) are achieving near-human accuracy levels. These models understand industry jargon, regulatory requirements, and professional standards.</p>
      
      <h3>3. Multimodal Translation</h3>
      <p>Future translation systems will process text, images, audio, and video simultaneously, providing comprehensive understanding of multimedia content.</p>
      
      <h2>The Business Impact</h2>
      <p>For businesses, these advancements mean:</p>
      <ul>
        <li>Faster time-to-market for global products</li>
        <li>Reduced translation costs without sacrificing quality</li>
        <li>Enhanced customer experience across different markets</li>
        <li>More efficient international collaboration</li>
      </ul>
      
      <h2>Challenges and Considerations</h2>
      <p>Despite the remarkable progress, challenges remain. Cultural sensitivity, regional dialects, and the nuanced nature of human communication still require careful consideration and often human oversight.</p>
      
      <h2>Conclusion</h2>
      <p>The future of AI-powered translation is bright, with technology becoming increasingly sophisticated while remaining accessible to businesses of all sizes. The key is finding the right balance between automation and human expertise.</p>
    `,
    author: "Sarah Chen",
    authorBio: "Sarah is a leading expert in artificial intelligence and machine learning with over 15 years of experience in language technology research. She holds a PhD in Computational Linguistics from MIT.",
    publishedAt: "2024-03-15",
    readTime: "8 min read",
    category: "Technology",
    tags: ["AI", "Machine Learning", "Translation Technology", "Neural Networks", "Future Tech"],
    featured: true,
    views: "12.5k",
    likes: "324",
    comments: "45"
  },
  {
    id: "2", 
    title: "How to Choose the Right Translation Tone for Your Business",
    excerpt: "Learn how to select the perfect tone for your translations - whether formal, informal, business, or friendly - to match your brand voice and audience expectations.",
    content: `
      <h2>Understanding Translation Tone</h2>
      <p>The tone of your translations can make or break your international communications. It's not just about converting words from one language to another – it's about conveying the right emotion, professionalism level, and brand personality that resonates with your target audience.</p>
      
      <h2>The Four Primary Translation Tones</h2>
      <h3>1. Formal Tone</h3>
      <p>Best suited for:</p>
      <ul>
        <li>Legal documents and contracts</li>
        <li>Government communications</li>
        <li>Academic papers and research</li>
        <li>Corporate announcements</li>
      </ul>
      
      <h3>2. Business Tone</h3>
      <p>Ideal for:</p>
      <ul>
        <li>Professional emails and correspondence</li>
        <li>Product documentation</li>
        <li>Company presentations</li>
        <li>Business proposals</li>
      </ul>
      
      <h3>3. Friendly Tone</h3>
      <p>Perfect for:</p>
      <ul>
        <li>Customer service communications</li>
        <li>Social media content</li>
        <li>Marketing materials</li>
        <li>Newsletter content</li>
      </ul>
      
      <h3>4. Informal Tone</h3>
      <p>Great for:</p>
      <ul>
        <li>Blog posts and articles</li>
        <li>Internal team communications</li>
        <li>Community forums</li>
        <li>Casual marketing campaigns</li>
      </ul>
      
      <h2>Cultural Considerations</h2>
      <p>Different cultures have varying expectations for communication styles. What might be considered friendly in one culture could be perceived as unprofessional in another. Always research your target market's communication preferences.</p>
      
      <h2>Best Practices for Tone Selection</h2>
      <ol>
        <li><strong>Know your audience:</strong> Research cultural communication norms</li>
        <li><strong>Maintain consistency:</strong> Use the same tone across all materials</li>
        <li><strong>Test and iterate:</strong> Gather feedback from native speakers</li>
        <li><strong>Consider context:</strong> The same content might need different tones for different platforms</li>
      </ol>
    `,
    author: "Marcus Rodriguez",
    authorBio: "Marcus has been working in professional translation for over 12 years, specializing in business communications and cultural adaptation for global brands.",
    publishedAt: "2024-03-12",
    readTime: "6 min read",
    category: "Best Practices",
    tags: ["Business", "Tone", "Communication", "Cultural Adaptation"],
    featured: false,
    views: "8.2k",
    likes: "156",
    comments: "23"
  }
]

// Related posts function
function getRelatedPosts(currentPostId: string, currentCategory: string) {
  return blogPosts
    .filter(post => post.id !== currentPostId && post.category === currentCategory)
    .slice(0, 3)
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = blogPosts.find(p => p.id === params.id)
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title: `${post.title} | TransleXable Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find(p => p.id === params.id)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.id, post.category)

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
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author and actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-border/20">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{post.author}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="modern-card hover-lift">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
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

          {/* Author Bio */}
          <div className="mt-16">
            <Card className="modern-card rounded-2xl border-0 p-8">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">About {post.author}</h3>
                  <p className="text-primary font-medium mb-4">{post.authorBio}</p>
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

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Share this article:</span>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/10 rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
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
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-2">
                      {relatedPost.excerpt}
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
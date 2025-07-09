import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  TrendingUp,
  User,
  Search
} from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Blog - TransleXable | Translation Insights & Tips",
  description: "Discover the latest insights on translation technology, AI-powered translation tips, and industry best practices from the TransleXable team.",
}

export default function BlogsPage() {
  // Mock blog data - in a real app, this would come from an API or CMS
  const blogPosts = [
    {
      id: "1",
      title: "The Future of AI-Powered Translation: Trends to Watch in 2025",
      excerpt: "Explore the cutting-edge developments in artificial intelligence that are revolutionizing the translation industry and what they mean for businesses worldwide.",
      content: "AI translation technology has come a long way from simple word-for-word substitutions...",
      author: "Sarah Chen",
      publishedAt: "2024-03-15",
      readTime: "8 min read",
      category: "Technology",
      tags: ["AI", "Machine Learning", "Translation Technology"],
      featured: true
    },
    {
      id: "2", 
      title: "How to Choose the Right Translation Tone for Your Business",
      excerpt: "Learn how to select the perfect tone for your translations - whether formal, informal, business, or friendly - to match your brand voice and audience expectations.",
      content: "The tone of your translations can make or break your international communications...",
      author: "Marcus Rodriguez",
      publishedAt: "2024-03-12",
      readTime: "6 min read",
      category: "Best Practices",
      tags: ["Business", "Tone", "Communication"],
      featured: false
    },
    {
      id: "3",
      title: "Document Translation Best Practices for Enterprise Teams",
      excerpt: "Discover proven strategies for managing large-scale document translations, maintaining consistency, and ensuring quality across your organization.",
      content: "Enterprise document translation requires a systematic approach...",
      author: "Emily Watson",
      publishedAt: "2024-03-10",
      readTime: "10 min read",
      category: "Enterprise",
      tags: ["Enterprise", "Document Translation", "Workflow"],
      featured: false
    },
    {
      id: "4",
      title: "The ROI of Professional Translation: A Data-Driven Analysis",
      excerpt: "Uncover the measurable business impact of investing in professional translation services with real case studies and performance metrics.",
      content: "Professional translation is more than just converting words from one language to another...",
      author: "David Kim",
      publishedAt: "2024-03-08",
      readTime: "7 min read",
      category: "Business",
      tags: ["ROI", "Business Value", "Analytics"],
      featured: false
    },
    {
      id: "5",
      title: "Breaking Language Barriers: Success Stories from Global Startups",
      excerpt: "Read inspiring stories of how innovative startups used translation technology to expand internationally and connect with global audiences.",
      content: "In today's interconnected world, language should never be a barrier to business success...",
      author: "Lisa Park",
      publishedAt: "2024-03-05",
      readTime: "9 min read",
      category: "Case Studies",
      tags: ["Startups", "Global Expansion", "Success Stories"],
      featured: false
    },
    {
      id: "6",
      title: "Understanding Translation Quality: Human vs AI vs Hybrid Approaches",
      excerpt: "Compare different translation methodologies and learn when to use human translators, AI systems, or hybrid approaches for optimal results.",
      content: "The translation landscape offers multiple approaches, each with distinct advantages...",
      author: "Professor James Liu",
      publishedAt: "2024-03-03",
      readTime: "12 min read",
      category: "Technology",
      tags: ["Quality Assurance", "AI vs Human", "Translation Methods"],
      featured: false
    }
  ]

  const categories = ["All", "Technology", "Best Practices", "Enterprise", "Business", "Case Studies"]
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 modern-card rounded-full px-6 py-3 shadow-glow">
              <BookOpen className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold">Translation Insights</span>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Translation{" "}
                <span className="gradient-text">Knowledge Hub</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover expert insights, best practices, and the latest trends in AI-powered translation technology.
              </p>
            </div>

            {/* Search and filter section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl modern-card border-0 bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === "All" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full px-4 py-2 text-xs font-medium modern-card hover-lift"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 modern-card rounded-full px-4 py-2 mb-6">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Featured Article</span>
            </div>
          </div>

          <Card className="modern-card hover-lift overflow-hidden rounded-3xl border-0 group">
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full font-medium">
                    Featured
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{featuredPost.author}</p>
                    </div>
                  </div>

                  <Button asChild className="btn-primary-enhanced rounded-xl hover-lift">
                    <Link href={`/blogs/${featuredPost.id}`} className="flex items-center space-x-2">
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest Articles</h2>
          <p className="text-muted-foreground text-lg">
            Explore our comprehensive collection of translation insights and expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="modern-card hover-lift overflow-hidden rounded-2xl border-0 group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </CardDescription>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{post.author}</p>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" asChild className="p-2 hover:bg-primary/10 rounded-full">
                    <Link href={`/blogs/${post.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="bg-muted/50 text-muted-foreground px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="modern-card border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-3 rounded-xl hover-lift">
            Load More Articles
          </Button>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="modern-card p-12 rounded-3xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Stay Updated with Translation Insights
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the latest articles, tips, and industry updates delivered straight to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl modern-card border-0 bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button className="btn-primary-enhanced px-6 py-3 rounded-xl">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 
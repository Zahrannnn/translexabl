'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  User,
  Search,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useBlogPosts } from "@/hooks/useBlogPosts"
import { useTranslations } from "next-intl"

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Draft'
  
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export default function BlogsPage() {
  const t = useTranslations('blogs')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const { data: blogPosts = [], isLoading, error, refetch, isFetching } = useBlogPosts()

  // Get unique categories from the fetched posts
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(blogPosts.map(post => post.category)))]
  }, [blogPosts])

  // Filter posts based on search query and selected category
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [blogPosts, searchQuery, selectedCategory])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      </div>
    )
  }

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
              <span className="text-sm font-semibold">{t('hero.badge')}</span>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                {t('hero.titleStart')}{" "}
                <span className="gradient-text">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            {/* Search and filter section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl modern-card border-0 bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === selectedCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
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

      {/* Blog Posts Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('latestArticles')}</h2>
            <p className="text-muted-foreground text-lg">
              {searchQuery || selectedCategory !== 'All' ? (
                <>
                  {filteredPosts.length} {t(filteredPosts.length !== 1 ? 'resultsFound' : 'resultFound')}
                  {searchQuery && ` ${t('search.for')} "${searchQuery}"`}
                  {selectedCategory !== 'All' && ` ${t('search.in')} ${selectedCategory}`}
                </>
              ) : (
                t('exploreCollection')
              )}
            </p>
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
            {isFetching ? t('refreshing') : t('refresh')}
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">
              {t('error.loadFailed')}
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => refetch()}
                className="ml-2 h-auto p-0 text-destructive underline"
              >
                {t('error.tryAgain')}
              </Button>
            </p>
          </div>
        )}

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="modern-card hover-lift overflow-hidden rounded-2xl border-0 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{calculateReadTime(post.content)}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.summary}
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
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            {searchQuery || selectedCategory !== 'All' ? (
              <>
                <h3 className="text-xl font-semibold mb-2">{t('noArticlesFound')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('noMatchingArticles')}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                  }}
                  className="rounded-xl"
                >
                  {t('clearFilters')}
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">{t('noBlogPosts')}</h3>
                <p className="text-muted-foreground">
                  {t('noPostsAvailable')}
                </p>
              </>
            )}
          </div>
        )}

        {/* Load More Button - Only show if there are posts */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="modern-card border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-3 rounded-xl hover-lift">
              {t('loadMore')}
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="modern-card p-12 rounded-3xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {t('newsletter.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('newsletter.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('newsletter.emailPlaceholder')}
                className="flex-1 px-4 py-3 rounded-xl modern-card border-0 bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button className="btn-primary-enhanced px-6 py-3 rounded-xl">
                {t('newsletter.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 
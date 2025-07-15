"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  ArrowLeft, 
  Search, 
  Plus, 
  Edit,
  Trash2,

  Calendar,
  User,
  Filter,
  X
} from "lucide-react"
import Link from "next/link"

interface UserInfo {
  userId: number
  username: string
  email: string
  role: string
}

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

interface BlogFormData {
  title: string
  content: string
  summary: string
  author: string
  tags: string[]
  category: string
  isPublished?: boolean
}

export default function AdminBlogsPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter] = useState<string>("ALL")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [blogFormData, setBlogFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    summary: "",
    author: "",
    tags: [],
    category: "General"
  })
  const [tagsInput, setTagsInput] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const getUserFromCookie = () => {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
      
      if (userCookie) {
        try {
          const userValue = userCookie.split('=')[1]
          const userData = JSON.parse(decodeURIComponent(userValue))
          
          if (userData.role !== 'ADMIN') {
            router.push('/dashboard')
            return
          }
          
          setUser(userData)
        } catch (error) {
          console.error('Error parsing user cookie:', error)
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }

    getUserFromCookie()
    fetchBlogs()
  }, [router])

  useEffect(() => {
    // Filter blogs based on search term and status filter
    let filtered = blogs

    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(blog => {
        if (statusFilter === "published") return blog.published
        if (statusFilter === "draft") return !blog.published
        return false
      })
    }

    setFilteredBlogs(filtered)
  }, [blogs, searchTerm, statusFilter])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs')
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }
      const data = await response.json()
      setBlogs(data)
      setFilteredBlogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBlog = () => {
    setShowCreateModal(true)
    setBlogFormData({
      title: "",
      content: "",
      summary: "",
      author: user?.username || "",
      tags: [],
      category: "General"
    })
    setTagsInput("")
  }

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog)
    setBlogFormData({
      title: blog.title,
      content: blog.content,
      summary: blog.summary,
      author: blog.author,
      tags: blog.tags,
      category: blog.category,
      isPublished: blog.published
    })
    setTagsInput(blog.tags.join(", "))
  }

  const handleSubmitBlog = async (isPublished: boolean = false) => {
    setIsSubmitting(true)
    try {
      const tagsArray = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag)
      
      const submitData = {
        ...blogFormData,
        tags: tagsArray,
        isPublished
      }

      const url = editingBlog ? `/api/admin/blogs/${editingBlog.id}` : '/api/admin/blogs'
      const method = editingBlog ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingBlog ? 'update' : 'create'} blog`)
      }

      // Refresh blogs list
      await fetchBlogs()
      setShowCreateModal(false)
      setEditingBlog(null)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editingBlog ? 'update' : 'create'} blog`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBlog = async (blogId: number) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete blog')
      }

      // Refresh blogs list
      await fetchBlogs()
      setDeleteId(null)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }



  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingBlog(null)
    setBlogFormData({
      title: "",
      content: "",
      summary: "",
      author: "",
      tags: [],
      category: "General"
    })
    setTagsInput("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 mt-10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-indigo-600" />
                Blog Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create, edit, and manage blog posts
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Posts: {filteredBlogs.length}
            </div>
            <Button onClick={handleCreateBlog}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search blogs by title, content, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
             
            </div>
          </CardContent>
        </Card>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>{blog.author}</span>
                    </div>
                  </div>
               
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {blog.summary || truncateContent(blog.content)}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(blog.publishedAt || blog.updatedAt)}</span>
                  </div>
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {blog.category}
                  </div>
                </div>
                
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{blog.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditBlog(blog)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                 
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setDeleteId(blog.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== "ALL" 
                ? "Try adjusting your search or filters" 
                : "Get started by creating your first blog post"}
            </p>
            {(!searchTerm && statusFilter === "ALL") && (
              <Button onClick={handleCreateBlog}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        )}

        {/* Create/Edit Blog Modal */}
        {(showCreateModal || editingBlog) && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <Input
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({...blogFormData, title: e.target.value})}
                    placeholder="Enter blog title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Summary
                  </label>
                  <textarea
                    value={blogFormData.summary}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBlogFormData({...blogFormData, summary: e.target.value})}
                    placeholder="Enter blog summary"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    value={blogFormData.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBlogFormData({...blogFormData, content: e.target.value})}
                    placeholder="Enter blog content"
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Author
                    </label>
                    <Input
                      value={blogFormData.author}
                      onChange={(e) => setBlogFormData({...blogFormData, author: e.target.value})}
                      placeholder="Enter author name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="blog-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      id="blog-category"
                      value={blogFormData.category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBlogFormData({...blogFormData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="General">General</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Translation">Translation</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSubmitBlog(false)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Saving...' : 'Save '}
                </Button>
               
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Confirm Delete
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this blog post? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteId(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                 
                  onClick={() => handleDeleteBlog(deleteId)}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Post'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
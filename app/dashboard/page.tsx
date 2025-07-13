"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, LogOut } from "lucide-react"
import Link from "next/link"

interface UserInfo {
  userId: number
  username: string
  email: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get user info from cookie
    const getUserFromCookie = () => {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
      
      if (userCookie) {
        try {
          const userValue = userCookie.split('=')[1]
          const userData = JSON.parse(decodeURIComponent(userValue))
          setUser(userData)
        } catch (error) {
          console.error('Error parsing user cookie:', error)
          router.push('/login')
        }
      } else {
        // No user cookie found, redirect to login
        router.push('/login')
      }
      setIsLoading(false)
    }

    getUserFromCookie()
  }, [router])

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Redirect to login regardless of API call result
      router.push('/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen  p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>
                Your account details and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-lg">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="text-lg">{user.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="text-lg capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Link 
                    href="/profile" 
                    className="w-full"
                  >
                    <Button className="w-full" variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Welcome to TranslexABL</CardTitle>
              <CardDescription>
                Your translation platform is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You can now access all translation features including text translation, document upload, and more.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link className="w-full" href="/translate">
                    <Button className="w-full">
                      Start Translating
                    </Button>
                  </Link>
                  <Link className="w-full" href="/history">
                    <Button className="w-full" variant="outline">
                      View History
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
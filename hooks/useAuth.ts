import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromCookie, notifyAuthStateChange } from '@/lib/auth-utils'

export interface UserInfo {
  userId: number
  username: string
  email: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuthStatus = () => {
    try {
      const userData = getUserFromCookie()
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial auth check
    checkAuthStatus()

    // Listen for auth changes
    const handleAuthChange = () => {
      setTimeout(() => {
        checkAuthStatus()
      }, 100)
    }

    window.addEventListener('authStateChanged', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    // Periodic check as fallback
    const interval = setInterval(checkAuthStatus, 30000)

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      notifyAuthStateChange()
      router.push('/login')
    }
  }

  const requireAuth = () => {
    if (!user && !isLoading) {
      router.push('/login')
      return false
    }
    return !!user
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    requireAuth,
    refreshAuth: checkAuthStatus
  }
} 
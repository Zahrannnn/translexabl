"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { Menu, X, Sparkles, Zap, User, LogOut, Settings, Shield, ChevronDown, FileText, File, Sparkles as SparklesIcon, Receipt } from "lucide-react"
import { getUserFromCookie, notifyAuthStateChange } from "@/lib/auth-utils"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import Link from "next/link"
import { useTranslation } from "@/hooks/useTranslation"

interface UserInfo {
  userId: number
  username: string
  email: string
  role: string
}

// Define a translation function type
type TranslationFunction = (key: string) => string;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const router = useRouter()
  
  // Handle potential context errors
  let t: TranslationFunction = (key: string) => {
    // Default translations as fallback
    const defaults: Record<string, string> = {
      home: 'Home',
      pricing: 'Pricing',
      blogs: 'Blogs',
      about: 'About',
      dashboard: 'Dashboard',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      logout: 'Logout'
    }
    return defaults[key] || key
  }
  
  try {
    const translation = useTranslation('navigation')
    t = translation.t
  } catch (error) {
    console.error('Error loading translation context:', error)
  }

  // Function to check user authentication from cookie
  const checkAuthStatus = () => {
    const userData = getUserFromCookie()
    setUser(userData)
  }

  useEffect(() => {
    // Check initial auth status
    checkAuthStatus()

    // Listen for custom auth events
    const handleAuthChange = () => {
      // Small delay to ensure cookie is set
      setTimeout(() => {
        checkAuthStatus()
      }, 100)
    }

    // Add event listeners for auth changes
    window.addEventListener('authStateChanged', handleAuthChange)
    window.addEventListener('storage', handleAuthChange) // For cross-tab support

    // Periodic check as fallback (every 30 seconds)
    const interval = setInterval(() => {
      checkAuthStatus()
    }, 30000)

    // Cleanup event listeners and interval
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      setUser(null)
      
      // Notify other components about auth state change
      notifyAuthStateChange()
      
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if API call fails
      setUser(null)
      
      // Notify other components about auth state change
      notifyAuthStateChange()
      
      router.push('/login')
    }
  }

  const navItems = [
    { name: t('home'), href: "/" },
    { name: t('pricing'), href: "/pricing" },
    { name: t('blogs'), href: "/blogs" },
    { name: t('about'), href: "/about" },
  ]

  const translationItems = [
    { name: "Text Translation", href: "/translate-txt", icon: <FileText className="h-4 w-4" /> },
    { name: "Document Translation", href: "/translate-docs", icon: <File className="h-4 w-4" /> },
    { name: "Free Translation", href: "/test-translate-gemini", icon: <SparklesIcon className="h-4 w-4" /> },
  ]

  return (
    <nav className="sticky top-6 z-50 modern-card border-b border-border/20 backdrop-blur-xl w-[90%] mx-auto py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover-lift group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">TransleXable</span>
              <span className="text-xs text-muted-foreground -mt-1">AI Translation</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className=" hover:text-white text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
            
            {/* Translations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group">
                <span>Translations</span>
                <ChevronDown className="h-4 w-4" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full rounded-full" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {translationItems.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => router.push(item.href)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {user ? (
              // User is logged in - show user menu
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <div className="bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    {t('profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <Settings className="h-4 w-4 mr-2" />
                    {t('dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/history')}>
                    <Receipt className="h-4 w-4 mr-2" />
                    Transaction History
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // User is not logged in - show login/register buttons
              <>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-300 hover-lift"
                >
                  <Link href="/login">{t('login')}</Link>
                </Button>
                <Button 
                  asChild 
                  className="btn-primary-enhanced text-sm px-6 py-2 h-auto rounded-lg shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/register" className="flex items-center space-x-2">
                    <span>{t('register')}</span>
                    <Zap className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Switcher for Mobile */}
            <LanguageSwitcher />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="modern-card p-2 hover:bg-primary/10"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 modern-card mt-2 rounded-2xl border border-border/20 shadow-lg shadow-primary/10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Translations Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-foreground mb-2">Translations</div>
                {translationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="pt-4 space-y-3 border-t border-border/20">
                {user ? (
                  // User is logged in - show user menu items
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Signed in as <span className="font-medium text-foreground">{user.username}</span>
                    </div>
                    <Button 
                      variant="default" 
                      asChild 
                      className="w-full justify-start text-left rounded-xl bg-indigo-500"
                    >
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        {t('profile')}
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      asChild 
                      className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary rounded-xl"
                    >
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Settings className="h-4 w-4 mr-2" />
                        {t('dashboard')}
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      asChild 
                      className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary rounded-xl"
                    >
                      <Link href="/history" onClick={() => setIsOpen(false)}>
                        <Receipt className="h-4 w-4 mr-2" />
                        Transaction History
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsOpen(false)
                        handleLogout()
                      }}
                      className="w-full justify-start text-left hover:bg-red-50 hover:text-red-600 rounded-xl"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('logout')}
                    </Button>
                  </>
                ) : (
                  // User is not logged in - show login/register buttons
                  <>
                    <Button 
                      variant="ghost" 
                      asChild 
                      className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary rounded-xl"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        {t('login')}
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      className="w-full btn-primary-enhanced rounded-xl shadow-glow"
                    >
                      <Link 
                        href="/register" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center space-x-2"
                      >
                        <span>{t('register')}</span>
                        <Zap className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 
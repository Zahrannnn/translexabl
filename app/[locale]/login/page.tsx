"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { notifyAuthStateChange } from "@/lib/auth-utils"
import { useTranslations } from "next-intl"

function LoginContent() {
  const t = useTranslations('login')
  const tCommon = useTranslations('common')
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user came from email verification
    const verified = searchParams.get('verified')
    if (verified === 'true') {
      setShowVerificationSuccess(true)
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowVerificationSuccess(false)
      }, 500)
    }
  }, [searchParams])

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value)
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = t('errors.default')
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        setError(errorMessage)
        return
      }

      // Login successful - redirect to dashboard
      // Dispatch custom event to notify navbar and other components
      notifyAuthStateChange()
      
      router.push("/")
      
    } catch (error) {
      console.error("Login error:", error)
      setError(t('errors.network'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('title')}</CardTitle>
          <CardDescription className="text-center">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showVerificationSuccess && (
            <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                {t('emailVerified')}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{error.includes("credentials") ? t('errors.invalidCredentials') : error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('form.emailPlaceholder')}
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('form.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('form.passwordPlaceholder')}
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                  aria-label={t('form.togglePassword')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label={t('form.rememberMe')}
                />
                <Label htmlFor="remember" className="text-sm">
                  {t('form.rememberMe')}
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('form.signingIn') : t('form.signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('noAccount')}{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                {t('signUp')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingFallback() {
  const t = useTranslations('login')
  const tCommon = useTranslations('common')
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('title')}</CardTitle>
          <CardDescription className="text-center">
            {tCommon('loading')}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  )
} 
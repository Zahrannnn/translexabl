"use client"

import { useState, useEffect, Suspense } from "react"
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield, AlertCircle, CheckCircle } from "lucide-react"

function VerifyEmailContent() {
  const t = useTranslations('verifyEmail')
  const tCommon = useTranslations('common')
  
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get email from URL params if passed from registration
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setCode(value)
    }
    if (error) setError("")
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!email) {
      setError(t('errors.enterEmail'))
      return
    }

    if (!code || code.length !== 6) {
      setError(t('errors.enterValidCode'))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = t('errors.verificationFailed')
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        setError(errorMessage)
        return
      }

      setSuccess(true)
      
      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/login?verified=true")
      }, 2000)
    } catch (error) {
      console.error("Verification error:", error)
      setError(t('errors.networkError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError(t('errors.enterEmailFirst'))
      return
    }

    // Since there's no resend endpoint, show a message to the user
    alert(t('resend.message'))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t('title')}</CardTitle>
          <CardDescription className="text-center">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                {t('success.message')}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.emailAddress')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('form.enterEmail')}
                  value={email}
                  onChange={handleEmailChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">{t('form.verificationCode')}</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  type="text"
                  placeholder={t('form.enterCode')}
                  value={code}
                  onChange={handleCodeChange}
                  className="pl-10 text-center text-lg tracking-wider"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || success}
            >
              {isLoading ? t('form.verifying') : t('form.verifyEmail')}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {t('help.didntReceive')}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={!email}
                className="w-full"
              >
                {t('help.getHelp')}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('help.alreadyVerified')}{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  {t('help.signIn')}
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            Loading...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  )
} 
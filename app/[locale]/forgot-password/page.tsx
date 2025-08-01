"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock, Key } from "lucide-react"
import { useTranslations } from "next-intl"

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword')
  
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email')
  const [error, setError] = useState("")

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch(`http://translatex-production-fb26.up.railway.app/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const textResponse = await response.text()
      let data
      try {
        data = JSON.parse(textResponse)
      } catch {
        // If JSON parsing fails, treat as plain text message
        data = { message: textResponse }
      }

      if (!response.ok) {
        setError(data.message || t('errors.sendCode'))
        return
      }

      setStep('code')
    } catch (error) {
      console.error('Forgot password error:', error)
      setError(t('errors.network'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError(t('errors.passwordMismatch'))
      return
    }

    if (newPassword.length < 8) {
      setError(t('errors.passwordLength'))
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch('http://translatex-production-fb26.up.railway.app/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      })

      const textResponse = await response.text()
      let data
      try {
        data = JSON.parse(textResponse)
      } catch {
        // If JSON parsing fails, treat as plain text message
        data = { message: textResponse }
      }

      if (!response.ok) {
        setError(data.message || t('errors.resetPassword'))
        return
      }

      setStep('success')
    } catch (error) {
      console.error('Reset password error:', error)
      setError(t('errors.network'))
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">{t('success.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('success.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <Link
                href="/login"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('backToLogin')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'code') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">{t('code.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('code.description', { email })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t('code.resetCode')}</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="code"
                    type="text"
                    placeholder={t('code.resetCodePlaceholder')}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value)
                      if (error) setError("")
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('code.newPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder={t('code.newPasswordPlaceholder')}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      if (error) setError("")
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('code.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t('code.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (error) setError("")
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t('code.resetting') : t('code.resetPassword')}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>{t('code.noCode')}</p>
                <button
                  onClick={() => {
                    setStep('email')
                    setError("")
                    setCode("")
                    setNewPassword("")
                    setConfirmPassword("")
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {t('code.tryAgain')}
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <Link
                  href="/login"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {t('backToLogin')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t('email.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('email.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email.emailAddress')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email.emailPlaceholder')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError("")
                  }}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('email.sending') : t('email.sendResetCode')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('backToLogin')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
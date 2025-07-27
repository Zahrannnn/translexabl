"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Coins,
  Lock,
  Shield,
  Eye,
  EyeOff,
  KeyRound,
  X
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

interface UserProfile {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
  currentCredits: number
  reservedCredits: number
  availableCredits: number
  totalCreditsUsed: number
  totalCreditsPurchased: number
  accountAge: number
  emailVerified: boolean
}

export default function ProfilePage() {
  const t = useTranslations('profile')
  const tCommon = useTranslations('common')
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [resetPasswordStep, setResetPasswordStep] = useState<'send-code' | 'reset-password'>('send-code')
  const [resetPasswordData, setResetPasswordData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isResetLoading, setIsResetLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized, redirect to login
            router.push('/login')
            return
          }
          throw new Error(t('errors.fetchFailed'))
        }

        const data = await response.json()
        setProfile(data)
        // Pre-fill email in reset password form
        setResetPasswordData(prev => ({
          ...prev,
          email: data.email
        }))
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.loadFailed'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router, t])

  const handleResetPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setResetPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (resetError) setResetError("")
  }

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    setIsSendingCode(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetPasswordData.email
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResetError(data.message || t('resetPassword.errors.sendCode'))
        return
      }

      setCodeSent(true)
      setResetPasswordStep('reset-password')
    } catch (error) {
      console.error('Send verification code error:', error)
      setResetError(t('resetPassword.errors.network'))
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    setResetSuccess(false)

    // Validate passwords match
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setResetError(t('resetPassword.errors.passwordMismatch'))
      return
    }

    // Validate password length
    if (resetPasswordData.newPassword.length < 6) {
      setResetError(t('resetPassword.errors.passwordLength'))
      return
    }

    // Validate code length
    if (resetPasswordData.code.length !== 6) {
      setResetError(t('resetPassword.errors.codeLength'))
      return
    }

    setIsResetLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetPasswordData.email,
          code: resetPasswordData.code,
          newPassword: resetPasswordData.newPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResetError(data.message || t('resetPassword.errors.resetFailed'))
        return
      }

      setResetSuccess(true)
      
      // Reset form after successful reset
      setTimeout(() => {
        setShowResetPasswordModal(false)
        setResetPasswordData({
          email: profile?.email || "",
          code: "",
          newPassword: "",
          confirmPassword: ""
        })
        setResetSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Reset password error:', error)
      setResetError(t('resetPassword.errors.network'))
    } finally {
      setIsResetLoading(false)
    }
  }

  const handleCloseResetModal = () => {
    setShowResetPasswordModal(false)
    setResetPasswordStep('send-code')
    setResetPasswordData({
      email: profile?.email || "",
      code: "",
      newPassword: "",
      confirmPassword: ""
    })
    setResetError("")
    setResetSuccess(false)
    setCodeSent(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              {tCommon('error')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToDashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
        
          
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-200">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-600">@{profile.username}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('personalInfo.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {profile.emailVerified ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t('personalInfo.verified')}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        {t('personalInfo.notVerified')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="font-medium">{profile.phoneNumber}</p>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{t('personalInfo.accountAge')}</p>
                  <p className="text-sm text-gray-600">{profile.accountAge} {t('personalInfo.days')}</p>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t('credits.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Coins className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-600">{profile.currentCredits}</p>
                  <p className="text-sm text-gray-600">{t('credits.current')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

       
        <div className="mt-8 flex flex-1 w-full gap-4 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500"
            onClick={() => setShowResetPasswordModal(true)}
          >
            <KeyRound className="h-4 w-4" />
            {t('resetPassword.button')}
          </Button>
        </div>
        {/* Reset Password Modal */}
        {showResetPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader className="relative">
                <button
                  onClick={handleCloseResetModal}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {resetPasswordStep === 'send-code' 
                    ? t('resetPassword.sendCode.title') 
                    : t('resetPassword.resetPassword.title')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {resetPasswordStep === 'send-code' 
                    ? t('resetPassword.sendCode.description')
                    : t('resetPassword.resetPassword.description')
                  }
                </p>
              </CardHeader>
              <CardContent>
                {resetSuccess ? (
                  <div className="flex flex-col items-center py-6">
                    <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold text-green-600 mb-2">{t('resetPassword.success.title')}</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {t('resetPassword.success.description')}
                    </p>
                  </div>
                ) : resetPasswordStep === 'send-code' ? (
                  <form onSubmit={handleSendVerificationCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">{t('resetPassword.sendCode.emailLabel')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          name="email"
                          type="email"
                          placeholder={t('resetPassword.sendCode.emailPlaceholder')}
                          value={resetPasswordData.email}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {resetError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <XCircle className="h-4 w-4" />
                        {resetError}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseResetModal}
                        className="flex-1"
                      >
                        {tCommon('cancel')}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSendingCode || !resetPasswordData.email}
                      >
                        {isSendingCode ? t('resetPassword.sendCode.sending') : t('resetPassword.sendCode.send')}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">{t('resetPassword.resetPassword.emailLabel')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          name="email"
                          type="email"
                          placeholder={t('resetPassword.resetPassword.emailPlaceholder')}
                          value={resetPasswordData.email}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10"
                          disabled
                        />
                      </div>
                      {codeSent && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {t('resetPassword.resetPassword.codeSent')}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-code">{t('resetPassword.resetPassword.codeLabel')}</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-code"
                          name="code"
                          type="text"
                          placeholder={t('resetPassword.resetPassword.codePlaceholder')}
                          value={resetPasswordData.code}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10 text-center text-lg tracking-widest"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-newPassword">{t('resetPassword.resetPassword.newPasswordLabel')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-newPassword"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('resetPassword.resetPassword.newPasswordPlaceholder')}
                          value={resetPasswordData.newPassword}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          aria-label={t('resetPassword.resetPassword.togglePassword')}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-confirmPassword">{t('resetPassword.resetPassword.confirmPasswordLabel')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t('resetPassword.resetPassword.confirmPasswordPlaceholder')}
                          value={resetPasswordData.confirmPassword}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          aria-label={t('resetPassword.resetPassword.toggleConfirmPassword')}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {resetError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <XCircle className="h-4 w-4" />
                        {resetError}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setResetPasswordStep('send-code')}
                        className="flex-1"
                      >
                        {t('resetPassword.resetPassword.back')}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isResetLoading || resetPasswordData.code.length !== 6 || resetPasswordData.newPassword !== resetPasswordData.confirmPassword}
                      >
                        {isResetLoading ? t('resetPassword.resetPassword.resetting') : t('resetPassword.resetPassword.reset')}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 
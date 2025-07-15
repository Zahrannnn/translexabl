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
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setProfile(data)
        // Pre-fill email in reset password form
        setResetPasswordData(prev => ({
          ...prev,
          email: data.email
        }))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

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
        setResetError(data.message || 'Failed to send verification code')
        return
      }

      setCodeSent(true)
      setResetPasswordStep('reset-password')
    } catch (error) {
      console.error('Send verification code error:', error)
      setResetError('Network error. Please try again.')
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
      setResetError("Passwords do not match")
      return
    }

    // Validate password length
    if (resetPasswordData.newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long")
      return
    }

    // Validate code length
    if (resetPasswordData.code.length !== 6) {
      setResetError("Verification code must be 6 digits")
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
        setResetError(data.message || 'Password reset failed')
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
      setResetError('Network error. Please try again.')
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
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
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
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
                Personal Information
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
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Verified
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
                  <p className="font-medium">Account Age</p>
                  <p className="text-sm text-gray-600">{profile.accountAge} days</p>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Credits Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Coins className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-600">{profile.currentCredits}</p>
                  <p className="text-sm text-gray-600">Current Credits</p>
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
            Reset Password
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
                  {resetPasswordStep === 'send-code' ? 'Send Verification Code' : 'Reset Password'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {resetPasswordStep === 'send-code' 
                    ? 'Enter your email address to receive a verification code.'
                    : 'Enter the verification code sent to your email and your new password.'
                  }
                </p>
              </CardHeader>
              <CardContent>
                {resetSuccess ? (
                  <div className="flex flex-col items-center py-6">
                    <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Password Reset Successfully!</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Your password has been reset successfully. You can now use your new password to sign in.
                    </p>
                  </div>
                ) : resetPasswordStep === 'send-code' ? (
                  <form onSubmit={handleSendVerificationCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
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
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSendingCode || !resetPasswordData.email}
                      >
                        {isSendingCode ? "Sending..." : "Send Code"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={resetPasswordData.email}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10"
                          disabled
                        />
                      </div>
                      {codeSent && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verification code sent to your email
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-code">Verification Code</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-code"
                          name="code"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={resetPasswordData.code}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10 text-center text-lg tracking-widest"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-newPassword"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={resetPasswordData.newPassword}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={resetPasswordData.confirmPassword}
                          onChange={handleResetPasswordInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle confirm password visibility"
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
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isResetLoading || resetPasswordData.code.length !== 6 || resetPasswordData.newPassword !== resetPasswordData.confirmPassword}
                      >
                        {isResetLoading ? "Resetting..." : "Reset Password"}
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
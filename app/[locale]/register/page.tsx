"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"

// Zod validation schema
const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^0\d{10}$/, "Please enter a valid phone number"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof registerSchema>
type FieldErrors = Partial<Record<keyof FormData, string>>

export default function RegisterPage() {
  const t = useTranslations('register')
  const tCommon = useTranslations('common')
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear general error when user starts typing
    if (error) setError("")
    // Clear field-specific error when user starts typing
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateField = (fieldName: keyof FormData, value: string) => {
    try {
      const fieldSchema = registerSchema.shape[fieldName]
      if (fieldName === 'confirmPassword') {
        // For confirmPassword, we need to validate against the entire object
        registerSchema.parse(formData)
      } else {
        fieldSchema.parse(value)
      }
      // Clear error if validation passes
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }))
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.issues[0]?.message || t('errors.invalidInput')
        setFieldErrors(prev => ({
          ...prev,
          [fieldName]: errorMessage
        }))
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    validateField(name as keyof FormData, value)
  }

  const validateForm = (): boolean => {
    try {
      registerSchema.parse(formData)
      setFieldErrors({})
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: FieldErrors = {}
        err.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormData
          if (field && !errors[field]) {
            errors[field] = issue.message
          }
        })
        setFieldErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setFieldErrors({}) // Clear any existing field errors
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare the request body (excluding confirmPassword)
      const requestBody = {
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = t('errors.default')
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
          
          // Handle specific field validation errors from backend
          if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already')) {
            setFieldErrors(prev => ({
              ...prev,
              email: t('errors.emailExists')
            }))
            return
          }
          
          if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('already')) {
            setFieldErrors(prev => ({
              ...prev,
              username: t('errors.usernameExists')
            }))
            return
          }
          
          // Handle cases where the message mentions both email and username exist
          if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('username')) {
            if (errorMessage.toLowerCase().includes('already')) {
              setFieldErrors(prev => ({
                ...prev,
                email: t('errors.emailExists'),
                username: t('errors.usernameExists')
              }))
              return
            }
          }
          
          // Handle other specific validation errors that might come from backend
          if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('invalid')) {
            setFieldErrors(prev => ({
              ...prev,
              email: t('errors.invalidEmail')
            }))
            return
          }
          
          if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('invalid')) {
            setFieldErrors(prev => ({
              ...prev,
              username: t('errors.invalidUsername')
            }))
            return
          }
          
          if (errorMessage.toLowerCase().includes('password') && errorMessage.toLowerCase().includes('weak')) {
            setFieldErrors(prev => ({
              ...prev,
              password: t('errors.weakPassword')
            }))
            return
          }
          
          // If no specific field error is detected, show as general error
          setError(errorMessage)
          
        } catch {
          // If response is not JSON, use the text or default message
          errorMessage = errorText || errorMessage
          setError(errorMessage)
        }
        
        return
      }

      // Registration successful
      setSuccess(true)
      
      // Redirect to verify email page with email parameter
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      setError(t('errors.network'))
    } finally {
      setIsLoading(false)
    }
  }

  const getInputClassName = (fieldName: keyof FormData, baseClassName: string = "") => {
    const hasError = fieldErrors[fieldName]
    return `${baseClassName} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`
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
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                {error}
              </span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                {t('success')}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('form.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClassName('email', 'pl-10')}
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">{t('form.username')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={t('form.usernamePlaceholder')}
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClassName('username', 'pl-10')}
                  required
                />
              </div>
              {fieldErrors.username && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('form.firstName')}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder={t('form.firstNamePlaceholder')}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClassName('firstName')}
                  required
                />
                {fieldErrors.firstName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('form.lastName')}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder={t('form.lastNamePlaceholder')}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClassName('lastName')}
                  required
                />
                {fieldErrors.lastName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('form.phoneNumber')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder={t('form.phoneNumberPlaceholder')}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClassName('phoneNumber', 'pl-10')}
                  required
                />
              </div>
              {fieldErrors.phoneNumber && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.phoneNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('form.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('form.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClassName('password', 'pl-10 pr-10')}
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
              {fieldErrors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('form.confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('form.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClassName('confirmPassword', 'pl-10 pr-10')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                  aria-label={t('form.toggleConfirmPassword')}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || success}
            >
              {isLoading ? t('form.creating') : t('form.create')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('haveAccount')}{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
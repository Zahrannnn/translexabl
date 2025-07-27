"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Languages, 
  ArrowRight, 
  Copy, 
  Loader2, 
  CheckCircle,
  Globe,
  Sparkles,
  AlertCircle,
  CreditCard,
  User,
  FileText
} from "lucide-react"
import Link from "next/link"

// Add user interface
interface UserInfo {
  userId: number
  username: string
  email: string
  role: string
}

// Add user profile interface for credits
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

export default function TestTranslatePage() {
  const t = useTranslations('translateTxt')
  
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("ES")
  const [tone, setTone] = useState("default")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [estimatedCredits, setEstimatedCredits] = useState(0)
  
  // Add user state
  const [user, setUser] = useState<UserInfo | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [creditUpdateTrigger, setCreditUpdateTrigger] = useState(0) // Force re-render after credit changes
  const [isDeductingCredits, setIsDeductingCredits] = useState(false) // Show when credits are being deducted

  const languages = [
    { code: "auto", name: "Auto-detect" },
    { code: "EN", name: "English" },
    { code: "ES", name: "Spanish" },
    { code: "FR", name: "French" },
    { code: "DE", name: "German" },
    { code: "IT", name: "Italian" },
    { code: "PT", name: "Portuguese" },
    { code: "RU", name: "Russian" },
    { code: "JA", name: "Japanese" },
    { code: "KO", name: "Korean" },
    { code: "ZH", name: "Chinese" },
    { code: "AR", name: "Arabic" },
    { code: "HI", name: "Hindi" },
    { code: "TR", name: "Turkish" },
    { code: "PL", name: "Polish" },
    { code: "NL", name: "Dutch" },
    { code: "SV", name: "Swedish" },
    { code: "DA", name: "Danish" },
    { code: "NO", name: "Norwegian" },
    { code: "FI", name: "Finnish" }
  ]

  const tones = [
    { value: "default", label: "Default", description: "Standard translation" },
    { value: "formal", label: "Formal", description: "Professional and respectful" },
    { value: "informal", label: "Informal", description: "Casual and friendly" },
    { value: "business", label: "Business", description: "Corporate and professional" },
    { value: "friendly", label: "Friendly", description: "Warm and approachable" }
  ]

  // Get user info from cookie and fetch profile on component mount
  useEffect(() => {
    const getUserFromCookie = () => {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
      
      if (userCookie) {
        try {
          const userValue = userCookie.split('=')[1]
          const userData = JSON.parse(decodeURIComponent(userValue))
          setUser(userData)
          
          // Fetch user profile for credits info
          fetchUserProfile()
        } catch (error) {
          console.error('Error parsing user cookie:', error)
          setUser(null)
        }
      }
    }

    getUserFromCookie()
  }, [])

  // Watch for credit updates to ensure UI re-renders
  useEffect(() => {
    if (creditUpdateTrigger > 0) {
      console.log(`🔄 Credit update trigger fired: ${creditUpdateTrigger}`)
    }
  }, [creditUpdateTrigger])

  // Fetch user profile for credits information
  const fetchUserProfile = async () => {
    setIsLoadingProfile(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Failed to fetch user profile:', response.statusText)
        return
      }

      const profileData = await response.json()
      setProfile(profileData)
      
      console.log('User profile loaded:', {
        credits: profileData.currentCredits,
        availableCredits: profileData.availableCredits,
        email: profileData.email
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Function to deduct credits after successful translation
  const deductCredits = async (userId: number, amount: number) => {
    setIsDeductingCredits(true) // Set to true when credits are being deducted
    try {
      console.log(`💳 Attempting to deduct ${amount} credits from user ${userId}...`)
      
      const response = await fetch('https://translatex-production.up.railway.app/api/credits/deduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          amount: amount
        }),
      })

      if (response.ok) {
        // Try to parse as JSON, but handle non-JSON responses
        let result;
        const contentType = response.headers.get('content-type');
        const responseText = await response.text();
        
        console.log('Credit deduction response:', {
          status: response.status,
          contentType,
          body: responseText
        });
        
        if (contentType && contentType.includes('application/json')) {
          try {
            result = JSON.parse(responseText);
          } catch (parseError) {
            console.warn('Failed to parse JSON response:', parseError);
            result = { message: responseText };
          }
        } else {
          // Non-JSON response, treat as success message
          result = { message: responseText };
        }
        
        console.log(`✅ Successfully deducted ${amount} credits from user ${userId}:`, result)
        
        // Immediately update the profile state with optimistic update
        if (profile) {
          const updatedProfile = {
            ...profile,
            currentCredits: Math.max(0, profile.currentCredits - amount),
            availableCredits: Math.max(0, profile.availableCredits - amount)
          }
          setProfile(updatedProfile)
          console.log(`💳 Updated profile with new credits: ${updatedProfile.currentCredits}`)
        }
        
        // Force a re-render and then fetch fresh data from server
        setCreditUpdateTrigger(prev => prev + 1)
        
        // Also refresh from server to ensure accuracy
        setTimeout(async () => {
          await fetchUserProfile()
        }, 100)
        
        return result
      } else {
        const errorText = await response.text()
        console.error('❌ Failed to deduct credits:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          userId,
          amount,
          headers: Object.fromEntries(response.headers.entries())
        })
        
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

    } catch (error) {
      console.error('❌ Failed to deduct credits from user:', error)
      throw error
    } finally {
      setIsDeductingCredits(false) // Set to false after deduction attempt
    }
  }

  // Calculate estimated credits (1 credit = 700 characters)
  const calculateCredits = (text: string) => {
    return Math.ceil(text.length / 700)
  }

  // Update estimated credits when text changes
  const handleTextChange = (text: string) => {
    setSourceText(text)
    setEstimatedCredits(calculateCredits(text))
    setError("")
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate")
      return
    }

    if (!user) {
      setError("Please login to use translation services")
      return
    }

    // Check if user has enough credits
    if (profile && profile.currentCredits < estimatedCredits) {
      setError(`Insufficient credits. You need ${estimatedCredits} credits but only have ${profile.currentCredits} available.`)
      return
    }

    setIsTranslating(true)
    setError("")
    setTranslatedText("") // Clear any previous translation
    
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sourceText,
          source_lang: sourceLang === "auto" ? null : sourceLang,
          target_lang: targetLang,
          tone: tone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Translation failed")
      }

      // Store the translation temporarily - only show it if credit deduction succeeds
      const translationResult = data.translated_text;
      
      // Deduct credits first - only show translation if this succeeds
      try {
        await deductCredits(user.userId, estimatedCredits)
        console.log(`✅ Translation successful and ${estimatedCredits} credits deducted`)
        
        // Only set the translated text if credit deduction was successful
        setTranslatedText(translationResult)
        setError("")
        
      } catch (creditError) {
        console.error('❌ Translation succeeded but failed to deduct credits:', creditError)
        
        // Don't show the translation if credit deduction failed
        setTranslatedText("")
        setError(`Credit deduction failed. Translation not displayed. Error: ${creditError instanceof Error ? creditError.message : 'Unknown error'}`)
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed")
      setTranslatedText("") // Clear translation on error
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopy = async () => {
    if (translatedText) {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Languages className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
              {t('title')}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>
        <div className="flex justify-center mb-8">
            <Card className="modern-card">
              <CardContent className="py-3">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center space-x-2"
                  >
                    <Link href="/translate-docs">
                      <FileText className="h-4 w-4" />
                      <span>{t('navigation.docsTranslation')}</span>
                    </Link>
                  </Button>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex items-center space-x-2 text-sm font-medium text-primary">
                    <FileText className="h-4 w-4" />
                    <span>{t('navigation.textTranslation')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        {/* User Status and Credits Info */}
        {user ? (
          <div className="max-w-6xl mx-auto mb-8">
            <Card className="modern-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('userStatus.welcome', { username: user.username })}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    {isLoadingProfile || isDeductingCredits ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          {isDeductingCredits ? 'Updating credits...' : 'Loading credits...'}
                        </span>
                      </div>
                    ) : profile ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium">Current Credits: {profile.currentCredits}</span>
                        </div>
                        
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unable to load credit info</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto mb-8">
            <Alert className="modern-card border-orange-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-orange-600">
                ⚠️ Please login to use translation services and see your credit balance
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Source Text Panel */}
          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>{t('sourceText.title')}</span>
              </CardTitle>
              <CardDescription>
                {t('sourceText.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('sourceText.sourceLanguage')}</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    aria-label={t('sourceText.sourceLanguage')}
                    className="w-full p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('sourceText.targetLanguage')}</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    aria-label="Target Language"
                    className="w-full p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    {languages.filter(lang => lang.code !== "auto").map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Translation Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  aria-label="Translation Tone"
                  className="w-full p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                >
                  {tones.map((toneOption) => (
                    <option key={toneOption.value} value={toneOption.value}>
                      {toneOption.label} - {toneOption.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Text to Translate</label>
                <textarea
                  value={sourceText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Enter your text here..."
                  className="w-full h-40 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors resize-none"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{sourceText.length} characters</span>
                  <span className={`font-medium ${
                    profile && profile.currentCredits < estimatedCredits 
                      ? 'text-destructive' 
                      : 'text-primary'
                  }`}>
                    ~{estimatedCredits} credits
                  </span>
                </div>
                {/* Credit warning */}
                {profile && profile.currentCredits < estimatedCredits && estimatedCredits > 0 && (
                  <div className="flex items-center space-x-2 text-destructive text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Insufficient credits (need {estimatedCredits}, have {profile.currentCredits})</span>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Translate Button */}
              <Button 
                onClick={handleTranslate}
                disabled={
                  isTranslating || 
                  !sourceText.trim() || 
                  !user || 
                  (profile !== null && profile.currentCredits < estimatedCredits)
                }
                className="w-full btn-primary-enhanced text-lg py-3 h-auto rounded-xl shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Translate Text ({estimatedCredits} credits)
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Translation Result Panel */}
          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Languages className="h-5 w-5 text-accent" />
                <span>Translation Result</span>
              </CardTitle>
              <CardDescription>
                Your translated text will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Result Display */}
              <div className="min-h-[300px] p-4 rounded-lg border border-border bg-muted/30 relative">
                {translatedText ? (
                  <>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {translatedText}
                    </p>
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 hover:bg-primary/10"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Languages className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Translation will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Translation Info */}
              {translatedText && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Characters translated:</span>
                    <span className="font-medium">{translatedText.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Credits used:</span>
                    <span className="font-medium text-primary">{estimatedCredits}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Translation direction:</span>
                    <span className="font-medium">
                      {languages.find(l => l.code === sourceLang)?.name} → {languages.find(l => l.code === targetLang)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tone applied:</span>
                    <span className="font-medium">{tones.find(t => t.value === tone)?.label}</span>
                  </div>
                  {/* Show updated credit balance after translation */}
                  {profile && (
                    <div className="flex items-center justify-between text-sm border-t pt-3">
                      <span className="text-muted-foreground">Remaining credits:</span>
                      <span className="font-medium text-accent">{profile.currentCredits}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Info */}
        <div className="mt-16 text-center">
          <Card className="modern-card max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>DeepL API Pro Integration</CardTitle>
              <CardDescription>
                This test page demonstrates the full translation workflow with advanced features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Languages className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Auto Language Detection</h3>
                  <p className="text-sm text-muted-foreground">Automatically detect source language for seamless translation</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Tone Selection</h3>
                  <p className="text-sm text-muted-foreground">Choose from formal, informal, business, or friendly tones</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Credit System</h3>
                  <p className="text-sm text-muted-foreground">Real-time credit calculation and automatic deduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Purchase CTA */}
        {user && profile && profile.currentCredits < 10 && (
          <div className="mt-12 text-center">
            <Card className="modern-card max-w-2xl mx-auto border-primary/20">
              <CardContent className="py-8">
                <div className="space-y-4">
                  <CreditCard className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Running Low on Credits?</h3>
                  <p className="text-muted-foreground">
                    You have {profile.currentCredits} credits remaining. Purchase more to continue translating.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/pricing'}
                    className="btn-primary-enhanced px-8 py-3 rounded-xl shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Purchase Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 
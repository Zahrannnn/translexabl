/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Upload, 
  Download, 
  Loader2, 
  CheckCircle,
  Sparkles,
  AlertCircle,
  File,
  X,
  CreditCard,
  User,
} from "lucide-react"
import Link from "next/link"

interface UploadedFile {
  file: File
  id: string
  preview?: string
}

interface TranslationResult {
  originalFileName: string
  fileId: string
  characters_translated: number
  credits_used: number
  pages_translated?: number
  file_format: string
  translated_filename?: string
  file_id?: string
  error?: string
}

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

export default function TestTranslateDocsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("ES")
  const [tone, setTone] = useState("default")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState("")
  const [translationResults, setTranslationResults] = useState<TranslationResult[]>([])
  const [estimatedCredits, setEstimatedCredits] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  const supportedFormats = [
    { ext: ".pdf", type: "application/pdf", icon: FileText, name: "PDF Documents" },
    { ext: ".docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", icon: FileText, name: "Word Documents (DOCX)" },
    { ext: ".doc", type: "application/msword", icon: FileText, name: "Word Documents (DOC)" },
    { ext: ".pptx", type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", icon: FileText, name: "PowerPoint (PPTX)" },
    { ext: ".xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", icon: FileText, name: "Excel (XLSX)" },
    { ext: ".html", type: "text/html", icon: FileText, name: "HTML Documents" },
    { ext: ".txt", type: "text/plain", icon: File, name: "Text Files" },
    { ext: ".srt", type: "text/srt", icon: File, name: "Subtitle Files" }
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

  // Function to deduct credits after successful document translation
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

  // Helper function to calculate credits from files
  const calculateCreditsFromFiles = (files: UploadedFile[]) => {
    // DeepL has a MINIMUM billing of 50,000 characters per document
    // regardless of actual file content size
    const MINIMUM_CHARACTERS_PER_DOCUMENT = 50000
    const CHARACTERS_PER_CREDIT = 700
    
    // Each document is billed for minimum 50,000 characters
    const totalEstimatedChars = files.length * MINIMUM_CHARACTERS_PER_DOCUMENT
    
    return Math.ceil(totalEstimatedChars / CHARACTERS_PER_CREDIT)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = supportedFormats.some(format => 
        file.type === format.type || file.name.toLowerCase().endsWith(format.ext)
      )
      return isValidType && file.size <= 50 * 1024 * 1024 // 50MB limit
    })

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('text/') ? 'text-preview' : undefined
    }))

    const allFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(allFiles)
    
    // Update credit estimation using helper function
    setEstimatedCredits(calculateCreditsFromFiles(allFiles))
    setError("")
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId)
    setUploadedFiles(updatedFiles)
    
    // Recalculate credits after file removal
    setEstimatedCredits(calculateCreditsFromFiles(updatedFiles))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const isValidType = supportedFormats.some(format => 
        file.type === format.type || file.name.toLowerCase().endsWith(format.ext)
      )
      return isValidType && file.size <= 50 * 1024 * 1024
    })

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }))

    const allFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(allFiles)
    
    // Update credit estimation for dropped files
    setEstimatedCredits(calculateCreditsFromFiles(allFiles))
    setError("")
  }

  const handleTranslateDocuments = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one document")
      return
    }

    if (!user) {
      setError("Please login to use document translation services")
      return
    }

    // Check if user has enough credits
    if (profile && profile.currentCredits < estimatedCredits) {
      setError(`Insufficient credits. You need ${estimatedCredits} credits but only have ${profile.currentCredits} available.`)
      return
    }

    setIsTranslating(true)
    setError("")
    setTranslationResults([]) // Clear any previous results

    try {
      const results: TranslationResult[] = []
      let totalCreditsUsed = 0
      
      for (const uploadedFile of uploadedFiles) {
        const formData = new FormData()
        formData.append('file', uploadedFile.file)
        formData.append('source_lang', sourceLang === "auto" ? "" : sourceLang)
        formData.append('target_lang', targetLang)
        formData.append('tone', tone)

        const response = await fetch("/api/translate-document", {
          method: "POST",
          body: formData,
        })

        const data: TranslationResult = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Translation failed for ${uploadedFile.file.name}`)
        }

        results.push({
          ...data,
          originalFileName: uploadedFile.file.name,
          fileId: uploadedFile.id
        })

        // Track total credits used
        totalCreditsUsed += data.credits_used || 0
      }

      // Store translation results temporarily - only show them if credit deduction succeeds
      const translationResultsTemp = results

      // Deduct credits first - only show translation results if this succeeds
      try {
        await deductCredits(user.userId, totalCreditsUsed)
        console.log(`✅ Document translation successful and ${totalCreditsUsed} credits deducted`)
        
        // Only set the translation results if credit deduction was successful
        setTranslationResults(translationResultsTemp)
        setError("")
        
      } catch (creditError) {
        console.error('❌ Document translation succeeded but failed to deduct credits:', creditError)
        
        // Don't show the translation results if credit deduction failed
        setTranslationResults([])
        setError(`Credit deduction failed. Document translation not displayed. Error: ${creditError instanceof Error ? creditError.message : 'Unknown error'}`)
      }

    } catch (error) {
      console.error('Document translation error:', error)
      setError(error instanceof Error ? error.message : "Document translation failed")
      setTranslationResults([]) // Clear results on error
    } finally {
      setIsTranslating(false)
    }
  }

  const downloadTranslatedFile = async (result: TranslationResult) => {
    try {
      const response = await fetch(`/api/download-translated/${result.file_id}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.translated_filename || `translated_${result.originalFileName}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      setError("Failed to download translated file")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
              Document Translations
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Translate PDF, DOCX, PPTX, and SRT files 
          </p>
        </div>
        <div>
          {/* Navigation Links */}
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
                    <Link href="/translate-txt">
                      <FileText className="h-4 w-4" />
                      <span>Text Translation</span>
                    </Link>
                  </Button>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex items-center space-x-2 text-sm font-medium text-primary">
                    <FileText className="h-4 w-4" />
                    <span>Document Translation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Status and Credits Info */}
        {user ? (
          <div className="max-w-6xl mx-auto mb-8">
            <Card className="modern-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">Welcome, {user.username}</span>
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
            <Card className="modern-card border-orange-200">
              <CardContent className="py-4">
                <div className="flex items-center space-x-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>⚠️ Please login to use document translation services and see your credit balance</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Large Documents & Human Translation Info */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="modern-card border-blue-200 bg-blue-50/50 dark:bg-blue-950/30">
            <CardContent className="py-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Need Help with Large Documents or Human Translation?
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mb-2">
                    For documents larger than our standard limits or when you need professional human translation services, 
                    we're here to help with custom solutions.
                  </p>
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-300">
                    <span className="text-sm font-medium">Contact us on WhatsApp:</span>
                    <a 
                      href="https://wa.me/201092088922" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Panel */}
          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <span>Upload Documents</span>
              </CardTitle>
              <CardDescription>
                Upload PDF, DOCX, PPTX, or SRT files for translation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Source Language</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    aria-label="Source Language"
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
                  <label className="block text-sm font-medium mb-2">Target Language</label>
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

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-8 text-center transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Drop files here or click to upload</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports PDF, DOCX, DOC, PPTX, XLSX, HTML, TXT, SRT files up to 50MB each
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.pptx,.xlsx,.html,.htm,.txt,.srt,.xlf,.xliff"
                onChange={handleFileUpload}
                aria-label="Upload document files"
                className="hidden"
              />

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
                  {uploadedFiles.map((uploadedFile) => (
                    <div key={uploadedFile.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{uploadedFile.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(uploadedFile.file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadedFile.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated credits: ~{estimatedCredits} (minimum 72 per document)</span>
                  </div>
                  {/* Credit warning */}
                  {profile && profile.currentCredits < estimatedCredits && estimatedCredits > 0 && (
                    <div className="flex items-center space-x-2 text-destructive text-sm mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Insufficient credits (need {estimatedCredits}, have {profile.currentCredits})</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Translate Button */}
              <Button 
                onClick={handleTranslateDocuments}
                disabled={
                  isTranslating || 
                  uploadedFiles.length === 0 || 
                  !user || 
                  (profile !== null && profile.currentCredits < estimatedCredits)
                }
                className="w-full btn-primary-enhanced text-lg py-3 h-auto rounded-xl shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Translating Documents...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Translate Documents ({estimatedCredits} credits - 72 min per doc)
                    <FileText className="h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-accent" />
                <span>Translation Results</span>
              </CardTitle>
              <CardDescription>
                Your translated documents will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Results Display */}
              <div className="min-h-[400px]">
                {translationResults.length > 0 ? (
                  <div className="space-y-4">
                    {translationResults.map((result, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">{result.originalFileName}</p>
                              <p className="text-sm text-muted-foreground">
                                {result.characters_translated} characters translated
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => downloadTranslatedFile(result)}
                            size="sm"
                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Credits used:</span>
                            <span className="font-medium ml-2">{result.credits_used}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Pages:</span>
                            <span className="font-medium ml-2">{result.pages_translated || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Format:</span>
                            <span className="font-medium ml-2">{result.file_format}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium ml-2 text-green-600">Complete</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Translated documents will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supported Formats Info */}
        <div className="mt-16 text-center">
          <Card className="modern-card max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Supported Document Formats</CardTitle>
              <CardDescription>
                Upload and translate various document types with formatting preservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {supportedFormats.map((format, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <format.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{format.name}</h3>
                    <p className="text-sm text-muted-foreground">{format.ext.toUpperCase()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                 
                  <strong className="text-red-500 font-bold text-2xl"> Important:</strong> You will be charged a minimum of 50,000 characters per document 
                  (approximately 72 credits) regardless of actual file content size. This means even a small 
                  1-page PDF will be charged as if it contains 50,000 characters. 
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Purchase CTA */}
        {user && profile && profile.currentCredits < 50 && (
          <div className="mt-12 text-center">
            <Card className="modern-card max-w-2xl mx-auto border-primary/20">
              <CardContent className="py-8">
                <div className="space-y-4">
                  <CreditCard className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Running Low on Credits?</h3>
                  <p className="text-muted-foreground">
                    You have {profile.currentCredits} credits remaining. Document translation typically requires more credits. Purchase more to continue translating documents.
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
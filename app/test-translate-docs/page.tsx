"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Upload, 
  Download, 
  Loader2, 
  CheckCircle,
  Globe,
  Sparkles,
  AlertCircle,
  File,
  X,
  Eye
} from "lucide-react"

interface UploadedFile {
  file: File
  id: string
  preview?: string
}

export default function TestTranslateDocsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("ES")
  const [tone, setTone] = useState("default")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState("")
  const [translationResults, setTranslationResults] = useState<any[]>([])
  const [estimatedCredits, setEstimatedCredits] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    setUploadedFiles(prev => [...prev, ...newFiles])
    
    // Estimate credits (rough estimate: 1000 chars per page for docs)
    const totalEstimatedChars = validFiles.reduce((acc, file) => {
      const estimatedPages = Math.ceil(file.size / (1024 * 50)) // Rough estimate
      return acc + (estimatedPages * 1000)
    }, 0)
    
    setEstimatedCredits(Math.ceil(totalEstimatedChars / 700))
    setError("")
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
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

    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleTranslateDocuments = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one document")
      return
    }

    setIsTranslating(true)
    setError("")
    setTranslationResults([])

    try {
      const results = []
      
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

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Translation failed for ${uploadedFile.file.name}`)
        }

        results.push({
          ...data,
          originalFileName: uploadedFile.file.name,
          fileId: uploadedFile.id
        })
      }

      setTranslationResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document translation failed")
    } finally {
      setIsTranslating(false)
    }
  }

  const downloadTranslatedFile = async (result: any) => {
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
    } catch (err) {
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
              Document Translation Test
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test document translation for PDF, DOCX, PPTX, and SRT files using DeepL API
          </p>
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
                    <span>Estimated credits: ~{estimatedCredits}</span>
                  </div>
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
                disabled={isTranslating || uploadedFiles.length === 0}
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
                    Translate Documents
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
                  <strong>Note:</strong> Documents are translated using DeepL's professional document translation API, 
                  which preserves original formatting and structure. Processing time varies by document size and complexity.
                  Minimum billing of 50,000 characters applies to PDF, DOCX, DOC, PPTX, and XLSX files.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
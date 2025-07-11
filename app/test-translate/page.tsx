"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Languages, 
  ArrowRight, 
  Copy, 
  Loader2, 
  CheckCircle,
  Globe,
  Sparkles,
  AlertCircle
} from "lucide-react"

export default function TestTranslatePage() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("ES")
  const [tone, setTone] = useState("default")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [estimatedCredits, setEstimatedCredits] = useState(0)

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

    setIsTranslating(true)
    setError("")
    
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

      setTranslatedText(data.translated_text)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed")
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
              Translation Test
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test the DeepL API Pro integration with tone selection and real-time translation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Source Text Panel */}
          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Source Text</span>
              </CardTitle>
              <CardDescription>
                Enter the text you want to translate
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
                  <span>~{estimatedCredits} credits</span>
                </div>
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
                disabled={isTranslating || !sourceText.trim()}
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
                    Translate Text
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
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Credit Estimation</h3>
                  <p className="text-sm text-muted-foreground">Real-time credit calculation before translation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
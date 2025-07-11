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
  AlertCircle,
  Brain,
  Zap,
  Star,
  Plus,
  X,
  BookOpen,
  Trash2
} from "lucide-react"

interface GlossaryTerm {
  id: string
  source: string
  target: string
}

export default function TestTranslateGeminiPage() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("ES")
  const [tone, setTone] = useState("default")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [estimatedCredits, setEstimatedCredits] = useState(0)
  const [translationInfo, setTranslationInfo] = useState<any>(null)
  
  // Glossary state
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([])
  const [newSourceTerm, setNewSourceTerm] = useState("")
  const [newTargetTerm, setNewTargetTerm] = useState("")
  const [showGlossary, setShowGlossary] = useState(false)

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
    { value: "default", label: "Default", description: "Standard translation", icon: Globe },
    { value: "formal", label: "Formal", description: "Professional and respectful", icon: Star },
    { value: "informal", label: "Informal", description: "Casual and friendly", icon: Sparkles },
    { value: "business", label: "Business", description: "Corporate and professional", icon: Brain },
    { value: "friendly", label: "Friendly", description: "Warm and approachable", icon: CheckCircle }
  ]

  // Calculate estimated credits (1 credit = 700 characters, but free if < 600 characters)
  const calculateCredits = (text: string) => {
    if (text.length < 600) {
      return 0 // Free for texts under 600 characters
    }
    return Math.ceil(text.length / 700)
  }

  // Update estimated credits when text changes
  const handleTextChange = (text: string) => {
    setSourceText(text)
    setEstimatedCredits(calculateCredits(text))
    setError("")
  }

  // Glossary functions
  const addGlossaryTerm = () => {
    if (newSourceTerm.trim() && newTargetTerm.trim()) {
      const newTerm: GlossaryTerm = {
        id: Math.random().toString(36).substr(2, 9),
        source: newSourceTerm.trim(),
        target: newTargetTerm.trim()
      }
      setGlossaryTerms(prev => [...prev, newTerm])
      setNewSourceTerm("")
      setNewTargetTerm("")
    }
  }

  const removeGlossaryTerm = (id: string) => {
    setGlossaryTerms(prev => prev.filter(term => term.id !== id))
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate")
      return
    }

    setIsTranslating(true)
    setError("")
    
    try {
      const response = await fetch("/api/translate-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sourceText,
          source_lang: sourceLang === "auto" ? null : sourceLang,
          target_lang: targetLang,
          tone: tone,
          glossary: glossaryTerms.map(term => ({ source: term.source, target: term.target }))
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Translation failed")
      }

      setTranslatedText(data.translated_text)
      setTranslationInfo(data)
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
              Gemini AI Translation Test
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test text translation powered by Google's Gemini AI with advanced reasoning, natural language understanding, and custom glossary support.
            <span className="text-green-600 font-medium block mt-2">✨ Free: Under 600 characters or 3 translations daily!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Panel */}
          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>AI-Powered Translation</span>
              </CardTitle>
              <CardDescription>
                Enter your text and let Gemini AI provide intelligent translations with custom glossary support
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

              {/* Tone Selection with Enhanced UI */}
              <div>
                <label className="block text-sm font-medium mb-3">Translation Tone</label>
                <div className="grid grid-cols-1 gap-2">
                  {tones.map((toneOption) => {
                    const IconComponent = toneOption.icon
                    return (
                      <div key={toneOption.value}>
                        <input
                          type="radio"
                          id={toneOption.value}
                          name="tone"
                          value={toneOption.value}
                          checked={tone === toneOption.value}
                          onChange={(e) => setTone(e.target.value)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={toneOption.value}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                            tone === toneOption.value 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-border bg-card'
                          }`}
                        >
                          <IconComponent className={`h-4 w-4 ${tone === toneOption.value ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${tone === toneOption.value ? 'text-primary' : ''}`}>
                                {toneOption.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{toneOption.description}</p>
                          </div>
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Glossary Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium">Custom Glossary ({glossaryTerms.length} terms)</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGlossary(!showGlossary)}
                    className="flex items-center space-x-1"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{showGlossary ? 'Hide' : 'Show'} Glossary</span>
                  </Button>
                </div>
                
                {showGlossary && (
                  <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/30">
                    {/* Add new term */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Source term"
                        value={newSourceTerm}
                        onChange={(e) => setNewSourceTerm(e.target.value)}
                        className="p-2 text-sm rounded border border-border bg-card"
                        onKeyPress={(e) => e.key === 'Enter' && addGlossaryTerm()}
                      />
                      <div className="flex space-x-1">
                        <input
                          type="text"
                          placeholder="Target translation"
                          value={newTargetTerm}
                          onChange={(e) => setNewTargetTerm(e.target.value)}
                          className="flex-1 p-2 text-sm rounded border border-border bg-card"
                          onKeyPress={(e) => e.key === 'Enter' && addGlossaryTerm()}
                        />
                        <Button
                          size="sm"
                          onClick={addGlossaryTerm}
                          disabled={!newSourceTerm.trim() || !newTargetTerm.trim()}
                          className="px-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Existing terms */}
                    {glossaryTerms.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {glossaryTerms.map((term) => (
                          <div key={term.id} className="flex items-center justify-between p-2 bg-card rounded border">
                            <div className="flex-1 text-sm">
                              <span className="font-medium">{term.source}</span>
                              <span className="text-muted-foreground mx-2">→</span>
                              <span>{term.target}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGlossaryTerm(term.id)}
                              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {glossaryTerms.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No glossary terms added. Add terms above for consistent translations.
                      </p>
                    )}
                  </div>
                )}
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
                  <div className="flex items-center space-x-2">
                    {sourceText.length < 600 ? (
                      <span className="text-green-600 font-medium">FREE (under 600 chars)</span>
                    ) : (
                      <span>~{estimatedCredits} credits</span>
                    )}
                  </div>
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
                    Translating with Gemini AI...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    Translate with Gemini
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
                <span>Gemini Translation Result</span>
              </CardTitle>
              <CardDescription>
                AI-powered translation with context understanding and glossary support
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
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Gemini AI translation will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Translation Info */}
              {translationInfo && (
                <div className="space-y-4">
                  {/* Free Usage Status */}
                  {translationInfo.is_free && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {translationInfo.free_reason === "under_600_characters" 
                            ? "FREE - Text under 600 characters" 
                            : `FREE - Daily usage (${translationInfo.daily_usage_count}/3)`}
                        </span>
                      </div>
                      {translationInfo.free_reason === "daily_free_usage" && (
                        <p className="text-xs text-green-700 mt-1">
                          {translationInfo.remaining_free_translations} free translations remaining today
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Translation Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <span className="text-muted-foreground">Detected Language:</span>
                      <div className="font-medium">{translationInfo.detected_source_language || 'N/A'}</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <span className="text-muted-foreground">Credits Used:</span>
                      <div className="font-medium flex items-center space-x-1">
                        <span>{translationInfo.credits_used}</span>
                        {translationInfo.is_free && <span className="text-green-600 text-xs">(FREE)</span>}
                      </div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <span className="text-muted-foreground">Characters:</span>
                      <div className="font-medium">{translationInfo.characters_used}</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <span className="text-muted-foreground">Tone Applied:</span>
                      <div className="font-medium capitalize">{translationInfo.tone_applied}</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <span className="text-muted-foreground">Glossary Terms:</span>
                      <div className="font-medium">{translationInfo.glossary_terms_used || 0}</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <span className="text-muted-foreground">Daily Usage:</span>
                      <div className="font-medium">{translationInfo.daily_usage_count}/3 free</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 text-center">
          <Card className="modern-card max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Google Gemini AI Translation Features</CardTitle>
              <CardDescription>
                Experience next-generation AI translation with advanced reasoning capabilities and custom glossary support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Advanced Reasoning</h3>
                  <p className="text-sm text-muted-foreground">Gemini understands context and nuance for more accurate translations</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Languages className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Natural Language Understanding</h3>
                  <p className="text-sm text-muted-foreground">AI-powered comprehension of idioms, cultural references, and context</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Intelligent Tone Adaptation</h3>
                  <p className="text-sm text-muted-foreground">Adapts translation style based on your selected tone and context</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Custom Glossary Support</h3>
                  <p className="text-sm text-muted-foreground">Define specific term translations for consistent, domain-specific results</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Gemini AI provides state-of-the-art translation with reasoning capabilities and custom glossary support. 
                  Requires a Google AI API key. Translations are optimized for natural language understanding and cultural context.
                </p>
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>🎉 Free Usage:</strong> Translations under 600 characters are always free! Plus, enjoy 3 free translations daily regardless of length.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
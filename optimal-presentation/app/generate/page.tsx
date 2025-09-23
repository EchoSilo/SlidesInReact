"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Sparkles, ArrowRight, Settings, FileText, Users, Target, AlertCircle, CheckCircle, Home } from "lucide-react"
import { GenerationRequest, GenerationResponse } from "@/lib/types"
import { ApiConnectionIndicator } from "@/components/ApiConnectionIndicator"
import { useApiConnection } from "@/hooks/useApiConnection"
import Link from 'next/link'

const presentationTypes = [
  { id: "business", label: "Business Proposal", description: "Strategic business presentations with value propositions" },
  { id: "technical", label: "Technical Framework", description: "Technical architecture and implementation details" },
  { id: "process", label: "Process Improvement", description: "Workflow optimization and process design" },
  { id: "transformation", label: "Transformation", description: "Organizational change and transformation initiatives" },
  { id: "capacity", label: "Capacity Management", description: "Resource allocation and capacity planning" },
  { id: "custom", label: "Custom", description: "Tailored presentation based on your specific needs" }
]

const slideCountOptions = [
  { value: "5", label: "5 slides - Executive Summary" },
  { value: "8", label: "8 slides - Standard Presentation" },
  { value: "12", label: "12 slides - Detailed Overview" },
  { value: "15", label: "15 slides - Comprehensive" },
  { value: "18", label: "18 slides - Deep Dive" }
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [presentationType, setPresentationType] = useState("")
  const [slideCount, setSlideCount] = useState("8")
  const [audience, setAudience] = useState("")
  const [tone, setTone] = useState("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { isConnected, hasApiKey } = useApiConnection()

  const handleGenerate = async () => {
    if (!prompt.trim() || !presentationType) {
      setError("Please provide a prompt and select a presentation type")
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuccess(null)

    try {
      // Get the stored API key
      const storedApiKey = localStorage.getItem('anthropic_api_key')

      const request: GenerationRequest & { apiKey?: string } = {
        prompt: prompt.trim(),
        presentation_type: presentationType,
        slide_count: parseInt(slideCount),
        audience: audience.trim() || undefined,
        tone,
        apiKey: storedApiKey || undefined
      }

      console.log("Generating presentation with:", request)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const result: GenerationResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred')
      }

      if (!result.presentation) {
        throw new Error('No presentation data received')
      }

      // Store the generated presentation in localStorage for Phase 3
      localStorage.setItem('generatedPresentation', JSON.stringify(result.presentation))

      setSuccess(`Successfully generated "${result.presentation.title}" with ${result.presentation.slides.length} slides!`)

      // Redirect to preview page to view the generated presentation
      setTimeout(() => {
        window.location.href = "/preview"
      }, 2000)

    } catch (error) {
      console.error("Generation error:", error)
      setError(error instanceof Error ? error.message : "Error generating presentation. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-6 max-w-5xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4 mr-2" />
                Hub
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">
              Generate Presentation
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ApiConnectionIndicator showText={true} />
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Generation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 border border-gray-200 shadow-sm">
              <div className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-3">
                  <Label htmlFor="prompt" className="text-base font-medium text-foreground">
                    What presentation do you want to create?
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g., Create a capacity management framework for technology teams, or design a digital transformation strategy for financial services..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] text-base resize-none"
                  />
                </div>

                {/* Presentation Type */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground">
                    Presentation Type
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {presentationTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={`p-3 cursor-pointer transition-all border ${
                          presentationType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => setPresentationType(type.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            presentationType === type.id ? "bg-primary" : "bg-gray-300"
                          }`} />
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground text-sm">
                              {type.label}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Configuration Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Slide Count */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Slides
                    </Label>
                    <Select value={slideCount} onValueChange={setSlideCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {slideCountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tone */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Tone
                    </Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium text-foreground">
                    Target Audience <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="audience"
                    placeholder="e.g., C-Level Executives, Engineering Teams, Board Members"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Status Messages */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || !presentationType || !isConnected}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Presentation
                    </>
                  )}
                </Button>

                {!isConnected && (
                  <p className="text-xs text-orange-600 text-center mt-2">
                    Configure your API key in Settings to generate presentations
                  </p>
                )}
              </div>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <Card className="p-4 border border-gray-200 shadow-sm">
              <h3 className="font-medium text-foreground mb-3 text-sm">What you'll get</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">AI-Generated Content</p>
                    <p className="text-xs text-muted-foreground">Professional slides with tailored messaging</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Smart Structure</p>
                    <p className="text-xs text-muted-foreground">Optimized layout for your presentation type</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Export Ready</p>
                    <p className="text-xs text-muted-foreground">Download as PNG or PPTX instantly</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-4 border border-gray-200 shadow-sm">
              <h3 className="font-medium text-foreground mb-3 text-sm">Tips for better results</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Be specific about your goals and key messages</p>
                <p>• Mention your target audience</p>
                <p>• Include context about your industry or use case</p>
                <p>• Specify any data or examples you want included</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
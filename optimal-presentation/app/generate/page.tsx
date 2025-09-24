"use client"

import { useState, useRef } from "react"
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
import { ProgressModal, ProgressMessage } from "@/components/ui/progress-modal"
import { ProgressSimulator } from "@/lib/progress-steps"
import Link from 'next/link'

const presentationTypes = [
  { id: "business", label: "Business Proposal", description: "Strategic business presentations with value propositions" },
  { id: "technical", label: "Technical Framework", description: "Technical architecture and implementation details" },
  { id: "process", label: "Process Improvement", description: "Workflow optimization and process design" },
  { id: "transformation", label: "Transformation", description: "Organizational change and transformation initiatives" },
  { id: "pov", label: "Point of View (POV)", description: "Strategic perspective and thought leadership on industry trends" },
  { id: "custom", label: "Custom", description: "Tailored presentation based on your specific needs" }
]

const presentationScopes = [
  { id: "executive", label: "Executive Summary", description: "High-level overview for senior leadership" },
  { id: "standard", label: "Standard Presentation", description: "Balanced coverage of key topics" },
  { id: "detailed", label: "Detailed Overview", description: "Thorough exploration of main concepts" },
  { id: "comprehensive", label: "Comprehensive", description: "In-depth analysis with supporting details" },
  { id: "deep_dive", label: "Deep Dive", description: "Exhaustive coverage with extensive detail" }
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [presentationType, setPresentationType] = useState("")
  const [slideCount, setSlideCount] = useState("8")
  const [presentationScope, setPresentationScope] = useState("")
  const [audience, setAudience] = useState("")
  const [tone, setTone] = useState("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [progressMessages, setProgressMessages] = useState<ProgressMessage[]>([])
  const [showProgressModal, setShowProgressModal] = useState(false)
  const progressSimulatorRef = useRef<ProgressSimulator | null>(null)

  const { isConnected, hasApiKey } = useApiConnection()

  const handleGenerate = async () => {
    if (!prompt.trim() || !presentationType || !presentationScope) {
      setError("Please provide a prompt, select a presentation type, and choose a presentation scope")
      return
    }

    if (!slideCount || parseInt(slideCount) < 3 || parseInt(slideCount) > 30) {
      setError("Please enter a valid number of slides between 3 and 30")
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuccess(null)
    setProgressMessages([])
    setShowProgressModal(true)

    // Initialize progress simulator
    progressSimulatorRef.current = new ProgressSimulator(
      (message) => {
        console.log('📨 [FRONTEND] Received progress message:', message)
        setProgressMessages(prev => {
          const filtered = prev.filter(m => m.id !== message.id)
          const updated = [...filtered, message]
          console.log('📋 [FRONTEND] Updated progress messages:', updated)
          return updated
        })
      },
      () => {
        console.log('🏁 [FRONTEND] Progress simulation complete')
        // Progress simulation complete - the actual API call should be finishing around now
      },
      (errorMsg) => {
        console.log('❌ [FRONTEND] Progress simulation error:', errorMsg)
        setError(errorMsg)
        setIsGenerating(false)
      }
    )

    // Start progress simulation
    console.log('🚀 [FRONTEND] Starting progress simulation')
    progressSimulatorRef.current.start()

    // Frontend workflow logging
    const workflowStart = Date.now()
    console.log("🚀 [FRONTEND] Starting presentation generation workflow", {
      timestamp: new Date().toISOString(),
      presentation_type: presentationType,
      presentation_scope: presentationScope,
      slide_count: slideCount,
      audience: audience || 'not specified',
      tone: tone,
      prompt_length: prompt.length
    })

    try {
      // Get the stored API key
      const storedApiKey = localStorage.getItem('anthropic_api_key')
      console.log("🔑 [FRONTEND] API key retrieval", {
        hasStoredKey: !!storedApiKey,
        keySource: storedApiKey ? 'localStorage' : 'none'
      })

      const request: GenerationRequest & { apiKey?: string; presentation_scope?: string } = {
        prompt: prompt.trim(),
        presentation_type: presentationType,
        presentation_scope: presentationScope,
        slide_count: parseInt(slideCount),
        audience: audience.trim() || undefined,
        tone,
        apiKey: storedApiKey || undefined
      }

      console.log("📤 [FRONTEND] Sending request to API", {
        timestamp: new Date().toISOString(),
        endpoint: '/api/generate',
        method: 'POST',
        request_size: JSON.stringify(request).length
      })

      const apiCallStart = Date.now()
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const apiCallDuration = Date.now() - apiCallStart
      console.log("📥 [FRONTEND] Received API response", {
        timestamp: new Date().toISOString(),
        status: response.status,
        duration_ms: apiCallDuration,
        response_ok: response.ok
      })

      const result: GenerationResponse & { workflowLogs?: string } = await response.json()

      // Log the backend workflow logs if available
      if (result.workflowLogs) {
        console.log("📊 [BACKEND] Workflow logs received:", JSON.parse(result.workflowLogs))
        // Store the logs for potential debugging
        localStorage.setItem('lastGenerationLogs', result.workflowLogs)
      }

      // Log file path for complete untruncated logs
      if (result.debugInfo?.logFilePath) {
        console.log("📁 [BACKEND] Complete logs saved to file:", result.debugInfo.logFilePath)
        console.log("🔗 [BACKEND] View complete logs at: /api/logs/" + result.generation_id)
        // Store log file info
        localStorage.setItem('lastLogFilePath', result.debugInfo.logFilePath)
        localStorage.setItem('lastGenerationId', result.generation_id)
      }

      if (!result.success) {
        console.log("❌ [FRONTEND] API returned error", { error: result.error })
        throw new Error(result.error || 'Unknown error occurred')
      }

      if (!result.presentation) {
        console.log("❌ [FRONTEND] No presentation data in response")
        throw new Error('No presentation data received')
      }

      console.log("✅ [FRONTEND] Presentation generated successfully", {
        timestamp: new Date().toISOString(),
        title: result.presentation.title,
        slides_count: result.presentation.slides.length,
        generation_id: result.generation_id
      })

      // Store the generated presentation in localStorage for Phase 3
      localStorage.setItem('generatedPresentation', JSON.stringify(result.presentation))

      setSuccess(`Successfully generated "${result.presentation.title}" with ${result.presentation.slides.length} slides!`)

      const totalWorkflowDuration = Date.now() - workflowStart
      console.log("🎉 [FRONTEND] Complete workflow finished", {
        timestamp: new Date().toISOString(),
        total_duration_ms: totalWorkflowDuration,
        api_call_duration_ms: apiCallDuration,
        redirect_in_ms: 3000
      })

      // Clean up progress simulator
      if (progressSimulatorRef.current) {
        progressSimulatorRef.current.cleanup()
      }

      // Redirect to preview page to view the generated presentation
      setTimeout(() => {
        console.log("🔄 [FRONTEND] Redirecting to preview page")
        setShowProgressModal(false)
        window.location.href = "/preview"
      }, 3000)

    } catch (error) {
      const errorDuration = Date.now() - workflowStart
      console.error("💥 [FRONTEND] Generation workflow failed", {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        duration_ms: errorDuration
      })
      setError(error instanceof Error ? error.message : "Error generating presentation. Please try again.")

      // Clean up progress simulator on error
      if (progressSimulatorRef.current) {
        progressSimulatorRef.current.cleanup()
      }
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
                  <Select value={presentationType} onValueChange={setPresentationType}>
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select presentation type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {presentationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Slides */}
                <div className="space-y-3">
                  <Label htmlFor="slideCount" className="text-base font-medium text-foreground">
                    Number of Slides
                  </Label>
                  <Input
                    id="slideCount"
                    type="number"
                    min="3"
                    max="30"
                    placeholder="8"
                    value={slideCount}
                    onChange={(e) => setSlideCount(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Presentation Scope */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground">
                    Presentation Scope
                  </Label>
                  <Select value={presentationScope} onValueChange={setPresentationScope}>
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select presentation scope..." />
                    </SelectTrigger>
                    <SelectContent>
                      {presentationScopes.map((scope) => (
                        <SelectItem key={scope.id} value={scope.id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{scope.label}</span>
                            <span className="text-xs text-muted-foreground">{scope.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Configuration Grid */}
                <div className="grid grid-cols-2 gap-4">
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

                  {/* Audience */}
                  <div className="space-y-2">
                    <Label htmlFor="audience-grid" className="text-sm font-medium text-foreground">
                      Target Audience <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="audience-grid"
                      placeholder="e.g., C-Level Executives"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="text-sm"
                    />
                  </div>
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
                  disabled={isGenerating || !prompt.trim() || !presentationType || !presentationScope || !slideCount || !isConnected}
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

        {/* Progress Modal */}
        <ProgressModal
          open={showProgressModal}
          onOpenChange={(open) => {
            if (!open && !isGenerating) {
              setShowProgressModal(false)
              setProgressMessages([])
            }
          }}
          title="Generating Your Presentation"
          messages={progressMessages}
          isComplete={!!success && !isGenerating}
          error={error}
        />
      </div>
    </div>
  )
}
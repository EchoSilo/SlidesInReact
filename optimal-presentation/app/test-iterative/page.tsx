'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, Play, Download } from 'lucide-react'
import { IterativeProgressModal } from '@/components/IterativeProgressModal'

export default function TestIterativePage() {
  const [prompt, setPrompt] = useState('Create a presentation about implementing a capacity management framework for enterprise resource planning')
  const [presentationType, setPresentationType] = useState('business')
  const [slideCount, setSlideCount] = useState('8')
  const [audience, setAudience] = useState('Executive leadership team')
  const [tone, setTone] = useState('professional')
  const [apiKey, setApiKey] = useState('')
  const [useStreaming, setUseStreaming] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const [showProgress, setShowProgress] = useState(false)

  const handleGenerateIterative = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (useStreaming) {
        // Use Server-Sent Events for streaming
        setShowProgress(true)

        const sse = new EventSource('/api/generate-iterative?' + new URLSearchParams({
          streamProgress: 'true'
        }))

        setEventSource(sse)

        sse.addEventListener('complete', (event) => {
          const data = JSON.parse(event.data)
          setResult(data)
          setLoading(false)
          setShowProgress(false)
          sse.close()
        })

        sse.addEventListener('error', (event: any) => {
          if (event.data) {
            const data = JSON.parse(event.data)
            setError(data.error || 'Generation failed')
          } else {
            setError('Connection lost')
          }
          setLoading(false)
          setShowProgress(false)
          sse.close()
        })

        // Send the request to start generation
        const response = await fetch('/api/generate-iterative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            presentation_type: presentationType,
            slide_count: slideCount,
            audience,
            tone,
            apiKey: apiKey || undefined,
            streamProgress: true
          })
        })

        if (!response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to start generation')
        }

      } else {
        // Regular non-streaming request
        const response = await fetch('/api/generate-iterative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            presentation_type: presentationType,
            slide_count: slideCount,
            audience,
            tone,
            apiKey: apiKey || undefined,
            streamProgress: false
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate presentation')
        }

        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      if (!useStreaming) {
        setLoading(false)
      }
    }
  }

  const downloadPresentation = () => {
    if (!result?.presentation) return

    const dataStr = JSON.stringify(result.presentation, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const exportFileDefaultName = `presentation-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Test Iterative Generation</h1>
      <p className="text-gray-600 mb-6">
        Phase 2: Generate presentations slide-by-slide with real-time progress
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Settings</CardTitle>
            <CardDescription>Configure iterative generation parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Presentation Type</Label>
                <Select value={presentationType} onValueChange={setPresentationType}>
                  <SelectTrigger id="type" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="process">Process</SelectItem>
                    <SelectItem value="transformation">Transformation</SelectItem>
                    <SelectItem value="pov">Point of View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="slides">Slide Count</Label>
                <Select value={slideCount} onValueChange={setSlideCount}>
                  <SelectTrigger id="slides" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 slides</SelectItem>
                    <SelectItem value="8">8 slides</SelectItem>
                    <SelectItem value="10">10 slides</SelectItem>
                    <SelectItem value="12">12 slides</SelectItem>
                    <SelectItem value="15">15 slides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <input
                id="audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="mt-1">
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

            <div>
              <Label htmlFor="apiKey">API Key (optional)</Label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Uses server key if not provided"
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="streaming"
                checked={useStreaming}
                onCheckedChange={setUseStreaming}
              />
              <Label htmlFor="streaming">
                Enable real-time progress streaming
              </Label>
            </div>

            <Button
              onClick={handleGenerateIterative}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Generate Presentation
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Results</CardTitle>
            <CardDescription>
              {result && (
                <span className="text-green-600">
                  Successfully generated {result.presentation?.slides?.length || 0} slides
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* Presentation Info */}
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="font-semibold">{result.presentation?.title}</h3>
                  <p className="text-sm text-gray-600">{result.presentation?.subtitle}</p>
                </div>

                {/* Validation Scores */}
                {result.validationScores && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium mb-2">Quality Scores</h4>
                    <div className="text-sm space-y-1">
                      <div>Outline: {result.validationScores.outline}/100</div>
                      <div>
                        Slides Average:{' '}
                        {Math.round(
                          result.validationScores.slides.reduce((a: number, b: number) => a + b, 0) /
                          result.validationScores.slides.length
                        )}/100
                      </div>
                      <div className="font-medium">
                        Overall: {result.validationScores.overall}/100
                      </div>
                    </div>
                  </div>
                )}

                {/* Token Usage */}
                {result.tokensUsed && (
                  <div className="p-3 bg-green-50 rounded-md">
                    <h4 className="font-medium mb-2">Token Usage</h4>
                    <div className="text-sm space-y-1">
                      <div>Outline: {result.tokensUsed.outline}</div>
                      <div>Slides: {result.tokensUsed.slides}</div>
                      <div>Validation: {result.tokensUsed.validation}</div>
                      <div className="font-medium">Total: {result.tokensUsed.total}</div>
                    </div>
                  </div>
                )}

                {/* Generation Time */}
                {result.generationTime && (
                  <div className="p-3 bg-yellow-50 rounded-md">
                    <h4 className="font-medium mb-2">Generation Time</h4>
                    <div className="text-sm">
                      Total: {(result.generationTime.total / 1000).toFixed(1)} seconds
                    </div>
                  </div>
                )}

                {/* Download Button */}
                <Button onClick={downloadPresentation} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Presentation JSON
                </Button>

                {/* Errors if any */}
                {result.errors && result.errors.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-md">
                    <h4 className="font-medium mb-2 text-red-700">Warnings</h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      {result.errors.map((err: string, idx: number) => (
                        <li key={idx}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No presentation generated yet. Click "Generate Presentation" to start.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Modal */}
      <IterativeProgressModal
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        eventSource={eventSource}
        showDetails={true}
      />

      {/* Raw JSON (for debugging) */}
      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Raw Generation Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

export default function TestOutlinePage() {
  const [prompt, setPrompt] = useState('Create a presentation about implementing a capacity management framework for enterprise resource planning')
  const [presentationType, setPresentationType] = useState('business')
  const [slideCount, setSlideCount] = useState('12')
  const [audience, setAudience] = useState('Executive leadership team')
  const [tone, setTone] = useState('professional')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateOutline = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          presentation_type: presentationType,
          slide_count: slideCount,
          audience,
          tone,
          apiKey: apiKey || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate outline')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Test Outline Generation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Outline Generation Request</CardTitle>
            <CardDescription>Phase 1 of iterative generation</CardDescription>
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

            <Button
              onClick={handleGenerateOutline}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Outline...
                </>
              ) : (
                'Generate Outline'
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
            <CardTitle>Generated Outline</CardTitle>
            <CardDescription>
              {result && `Validation Score: ${result.validationScore || 'N/A'}/100`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* Outline Metadata */}
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="font-semibold">{result.outline?.title}</h3>
                  <p className="text-sm text-gray-600">{result.outline?.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Framework: {result.outline?.metadata?.framework} |
                    Est. Tokens: {result.outline?.estimatedTotalTokens}
                  </p>
                </div>

                {/* Slide List */}
                <div className="space-y-2">
                  <h4 className="font-medium">Slides:</h4>
                  {result.outline?.slides?.map((slide: any, index: number) => (
                    <div key={index} className="p-2 border rounded text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">#{slide.slideNumber}</span>
                          <span className="ml-2 text-gray-600">{slide.type}</span>
                          <div className="font-medium mt-1">{slide.title}</div>
                          <div className="text-xs text-gray-500">{slide.purpose}</div>
                        </div>
                        <span className="text-xs text-gray-400">
                          ~{slide.estimatedTokens} tokens
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Validation Feedback */}
                {result.validationFeedback && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium mb-2">Validation Feedback</h4>
                    <div className="text-sm space-y-1">
                      <div>Framework: {result.validationFeedback.frameworkAlignment?.score}/100</div>
                      <div>Flow: {result.validationFeedback.logicalFlow?.score}/100</div>
                      <div>Audience: {result.validationFeedback.audienceSuitability?.score}/100</div>
                      <div>Complete: {result.validationFeedback.completeness?.score}/100</div>
                    </div>
                  </div>
                )}

                {/* Processing Time */}
                <div className="text-xs text-gray-500">
                  Generated in {result.processingTime}ms | ID: {result.generation_id}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No outline generated yet. Click "Generate Outline" to start.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raw JSON Output (for debugging) */}
      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Raw JSON Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
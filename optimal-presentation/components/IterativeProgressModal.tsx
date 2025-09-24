'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ProgressUpdate {
  phase: 'outline' | 'slides' | 'validation' | 'complete'
  currentStep: string
  slideNumber?: number
  totalSlides?: number
  percentComplete: number
  message: string
  validationScore?: number
  estimatedTimeRemaining?: number
}

interface IterativeProgressModalProps {
  isOpen: boolean
  onClose?: () => void
  eventSource?: EventSource | null
  showDetails?: boolean
}

export function IterativeProgressModal({
  isOpen,
  onClose,
  eventSource,
  showDetails = true
}: IterativeProgressModalProps) {
  const [progress, setProgress] = useState<ProgressUpdate>({
    phase: 'outline',
    currentStep: 'Initializing...',
    percentComplete: 0,
    message: 'Starting presentation generation...'
  })
  const [slideProgress, setSlideProgress] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!eventSource) return

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (event.type === 'progress') {
          setProgress(data)

          // Track individual slide progress
          if (data.slideNumber && data.totalSlides) {
            const newSlideProgress = [...slideProgress]
            newSlideProgress[data.slideNumber - 1] = 100
            setSlideProgress(newSlideProgress)
          }
        } else if (event.type === 'complete') {
          setIsComplete(true)
          setProgress({
            ...progress,
            phase: 'complete',
            percentComplete: 100,
            message: 'Presentation generated successfully!'
          })
        } else if (event.type === 'error') {
          setError(data.error || 'An error occurred during generation')
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error:', err)
      setError('Connection lost. Generation may still be in progress.')
    }

    return () => {
      if (eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close()
      }
    }
  }, [eventSource])

  const getPhaseIcon = (phase: string) => {
    if (progress.phase === phase) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    }
    if (getPhaseOrder(progress.phase) > getPhaseOrder(phase)) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    return <Circle className="w-4 h-4 text-gray-300" />
  }

  const getPhaseOrder = (phase: string): number => {
    const order = { 'outline': 1, 'slides': 2, 'validation': 3, 'complete': 4 }
    return order[phase as keyof typeof order] || 0
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generating Presentation</DialogTitle>
          <DialogDescription>
            Using iterative generation for optimal quality
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{progress.message}</span>
              <span>{progress.percentComplete}%</span>
            </div>
            <Progress value={progress.percentComplete} className="h-2" />
          </div>

          {/* Phase Indicators */}
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-2">
              {getPhaseIcon('outline')}
              <span className={progress.phase === 'outline' ? 'font-medium' : 'text-gray-500'}>
                Outline
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {getPhaseIcon('slides')}
              <span className={progress.phase === 'slides' ? 'font-medium' : 'text-gray-500'}>
                Slides
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {getPhaseIcon('validation')}
              <span className={progress.phase === 'validation' ? 'font-medium' : 'text-gray-500'}>
                Validation
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {getPhaseIcon('complete')}
              <span className={progress.phase === 'complete' ? 'font-medium' : 'text-gray-500'}>
                Complete
              </span>
            </div>
          </div>

          {/* Slide Generation Details */}
          {progress.phase === 'slides' && progress.totalSlides && showDetails && (
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm font-medium mb-2">
                  Generating Slide {progress.slideNumber} of {progress.totalSlides}
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {Array.from({ length: progress.totalSlides }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded ${
                        i < (progress.slideNumber || 0) - 1
                          ? 'bg-green-500'
                          : i === (progress.slideNumber || 0) - 1
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-gray-200'
                      }`}
                      title={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Step Details */}
          {showDetails && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{progress.currentStep}</div>
                    {progress.validationScore !== undefined && (
                      <div className="text-xs text-gray-500 mt-1">
                        Quality Score: {progress.validationScore}/100
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completion Message */}
          {isComplete && !error && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div className="text-sm text-green-700">
                    Presentation generated successfully!
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
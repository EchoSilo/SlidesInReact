/**
 * React hook for tracking generation and validation progress
 * Phase 4: System Integration - Day 2
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { PresentationData } from '@/lib/types'

// Progress event interface matching streaming API
export interface GenerationProgressEvent {
  type: 'progress' | 'complete' | 'error'
  stage: 'initializing' | 'generating' | 'generated' | 'validating' | 'refining' | 'completed' | 'failed'
  progress: number // 0-100
  message: string
  generationId: string
  presentation?: PresentationData
  validationResults?: {
    initialScore: number
    finalScore: number
    improvement: number
    roundsCompleted: number
    targetAchieved: boolean
    frameworkUsed: string
  }
  refinementProgress?: {
    currentRound: number
    totalRounds: number
    currentScore?: number
    targetScore: number
  }
  error?: string
}

// Hook state interface
export interface GenerationProgressState {
  isGenerating: boolean
  isValidating: boolean
  progress: number
  stage: string
  message: string
  currentRound?: number
  totalRounds?: number
  currentScore?: number
  targetScore?: number
  presentation?: PresentationData
  validationResults?: GenerationProgressEvent['validationResults']
  error?: string
  generationId?: string
}

// Generation request configuration
export interface GenerationConfig {
  prompt: string
  presentation_type: string
  slide_count: number
  audience?: string
  tone?: string
  useValidation?: boolean
  validationConfig?: {
    targetQualityScore?: number
    maxRefinementRounds?: number
    minimumImprovement?: number
  }
  apiKey?: string
}

/**
 * Hook for managing generation progress with optional validation
 */
export function useGenerationProgress() {
  const [state, setState] = useState<GenerationProgressState>({
    isGenerating: false,
    isValidating: false,
    progress: 0,
    stage: 'idle',
    message: 'Ready to generate'
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  /**
   * Start generation with optional validation
   */
  const startGeneration = useCallback(async (config: GenerationConfig): Promise<PresentationData | null> => {
    // Cancel any existing generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Reset state
    setState({
      isGenerating: true,
      isValidating: false,
      progress: 0,
      stage: 'initializing',
      message: 'Starting generation...',
      error: undefined,
      presentation: undefined,
      validationResults: undefined
    })

    try {
      // Decide whether to use streaming or regular API
      if (config.useValidation) {
        return await startStreamingGeneration(config)
      } else {
        return await startRegularGeneration(config)
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        isValidating: false,
        stage: 'failed',
        error: error instanceof Error ? error.message : 'Generation failed',
        message: 'Generation failed'
      }))
      throw error
    }
  }, [])

  /**
   * Start streaming generation with progress updates
   */
  const startStreamingGeneration = useCallback(async (config: GenerationConfig): Promise<PresentationData | null> => {
    return new Promise((resolve, reject) => {
      // Create EventSource for streaming
      const eventSource = new EventSource('/api/generate/stream', {
        // Note: EventSource doesn't support POST, so we'll use a different approach
      })

      // Actually, let's use fetch with streaming instead
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      fetch('/api/generate/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
        signal: abortController.signal
      })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body reader available')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            buffer += decoder.decode(value, { stream: true })

            // Process complete SSE messages
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const eventData: GenerationProgressEvent = JSON.parse(line.slice(6))
                  handleProgressEvent(eventData, resolve, reject)
                } catch (parseError) {
                  console.warn('Failed to parse SSE data:', parseError)
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          setState(prev => ({
            ...prev,
            isGenerating: false,
            isValidating: false,
            stage: 'failed',
            error: error.message,
            message: 'Connection failed'
          }))
          reject(error)
        }
      })
    })
  }, [])

  /**
   * Handle progress events from streaming
   */
  const handleProgressEvent = useCallback((
    event: GenerationProgressEvent,
    resolve: (value: PresentationData | null) => void,
    reject: (error: Error) => void
  ) => {
    setState(prev => ({
      ...prev,
      progress: event.progress,
      stage: event.stage,
      message: event.message,
      generationId: event.generationId,
      isValidating: event.stage === 'validating' || event.stage === 'refining',
      currentRound: event.refinementProgress?.currentRound,
      totalRounds: event.refinementProgress?.totalRounds,
      currentScore: event.refinementProgress?.currentScore,
      targetScore: event.refinementProgress?.targetScore
    }))

    if (event.type === 'complete') {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        isValidating: false,
        presentation: event.presentation,
        validationResults: event.validationResults
      }))
      resolve(event.presentation || null)
    } else if (event.type === 'error') {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        isValidating: false,
        error: event.error,
        stage: 'failed'
      }))
      reject(new Error(event.error || 'Unknown error'))
    }
  }, [])

  /**
   * Start regular (non-streaming) generation
   */
  const startRegularGeneration = useCallback(async (config: GenerationConfig): Promise<PresentationData | null> => {
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setState(prev => ({
      ...prev,
      stage: 'generating',
      message: 'Generating presentation...',
      progress: 50
    }))

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
      signal: abortController.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Generation failed')
    }

    setState(prev => ({
      ...prev,
      isGenerating: false,
      stage: 'completed',
      message: 'Generation completed successfully',
      progress: 100,
      presentation: result.presentation,
      validationResults: result.validationResults
    }))

    return result.presentation
  }, [])

  /**
   * Cancel current generation
   */
  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    setState(prev => ({
      ...prev,
      isGenerating: false,
      isValidating: false,
      stage: 'cancelled',
      message: 'Generation cancelled',
      error: 'Generation was cancelled by user'
    }))
  }, [])

  /**
   * Reset state to initial
   */
  const resetProgress = useCallback(() => {
    setState({
      isGenerating: false,
      isValidating: false,
      progress: 0,
      stage: 'idle',
      message: 'Ready to generate',
      error: undefined,
      presentation: undefined,
      validationResults: undefined
    })
  }, [])

  /**
   * Get formatted progress message
   */
  const getProgressMessage = useCallback(() => {
    if (state.error) {
      return `Error: ${state.error}`
    }

    if (state.isValidating && state.currentRound && state.totalRounds) {
      return `${state.message} (Round ${state.currentRound}/${state.totalRounds})`
    }

    return state.message
  }, [state])

  /**
   * Get quality improvement info
   */
  const getQualityInfo = useCallback(() => {
    if (!state.validationResults) return null

    return {
      initialScore: state.validationResults.initialScore,
      finalScore: state.validationResults.finalScore,
      improvement: state.validationResults.improvement,
      targetAchieved: state.validationResults.targetAchieved,
      frameworkUsed: state.validationResults.frameworkUsed
    }
  }, [state.validationResults])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return {
    // State
    ...state,

    // Actions
    startGeneration,
    cancelGeneration,
    resetProgress,

    // Computed values
    progressMessage: getProgressMessage(),
    qualityInfo: getQualityInfo(),

    // Status flags
    canCancel: state.isGenerating || state.isValidating,
    isComplete: state.stage === 'completed',
    hasError: !!state.error,
    hasPresentation: !!state.presentation,
    hasValidationResults: !!state.validationResults
  }
}
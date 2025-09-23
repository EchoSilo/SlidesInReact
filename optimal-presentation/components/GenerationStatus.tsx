/**
 * Minimal progress UI component for generation and validation
 * Phase 4: System Integration - Day 2
 */

'use client'

import React from 'react'
import { useGenerationProgress } from '@/hooks/useGenerationProgress'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface GenerationStatusProps {
  onCancel?: () => void
  onComplete?: () => void
  className?: string
  showDetails?: boolean
}

/**
 * Minimal generation status component
 */
export function GenerationStatus({
  onCancel,
  onComplete,
  className = '',
  showDetails = false
}: GenerationStatusProps) {
  const {
    isGenerating,
    isValidating,
    progress,
    stage,
    progressMessage,
    currentRound,
    totalRounds,
    currentScore,
    targetScore,
    qualityInfo,
    hasError,
    isComplete,
    canCancel,
    cancelGeneration
  } = useGenerationProgress()

  // Don't render if not generating
  if (!isGenerating && !isValidating && !isComplete && !hasError) {
    return null
  }

  const handleCancel = () => {
    cancelGeneration()
    onCancel?.()
  }

  const handleComplete = () => {
    onComplete?.()
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardContent className="p-4 space-y-3">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasError ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : isComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            )}

            <span className="text-sm font-medium">
              {hasError ? 'Error' : isComplete ? 'Complete' : 'Processing'}
            </span>
          </div>

          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {!hasError && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}%</span>
              {currentRound && totalRounds && (
                <span>Round {currentRound}/{totalRounds}</span>
              )}
            </div>
          </div>
        )}

        {/* Status Message */}
        <div className="text-sm text-muted-foreground">
          {progressMessage}
        </div>

        {/* Validation Progress Details */}
        {showDetails && isValidating && currentScore && targetScore && (
          <div className="space-y-2 p-2 bg-muted/50 rounded-md">
            <div className="text-xs font-medium">Quality Progress</div>
            <div className="flex justify-between text-xs">
              <span>Current: {currentScore}/100</span>
              <span>Target: {targetScore}/100</span>
            </div>
            <Progress
              value={(currentScore / targetScore) * 100}
              className="h-1"
            />
          </div>
        )}

        {/* Completion Results */}
        {isComplete && qualityInfo && (
          <div className="space-y-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-800 dark:text-green-200">
                Quality Improved
              </span>
              {qualityInfo.targetAchieved && (
                <span className="text-xs px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                  Target Achieved
                </span>
              )}
            </div>

            <div className="text-xs text-green-700 dark:text-green-300">
              {qualityInfo.initialScore} → {qualityInfo.finalScore}
              <span className="font-medium"> (+{qualityInfo.improvement} points)</span>
            </div>

            {qualityInfo.frameworkUsed && (
              <div className="text-xs text-green-600 dark:text-green-400">
                Framework: {qualityInfo.frameworkUsed.toUpperCase()}
              </div>
            )}

            {onComplete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleComplete}
                className="w-full mt-2 h-7 text-xs"
              >
                View Results
              </Button>
            )}
          </div>
        )}

        {/* Error Display */}
        {hasError && (
          <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
            <div className="text-xs text-red-800 dark:text-red-200">
              Generation failed. The basic presentation has been preserved.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Compact inline generation status
 */
export function InlineGenerationStatus({
  className = ''
}: {
  className?: string
}) {
  const {
    isGenerating,
    isValidating,
    progress,
    progressMessage,
    currentRound,
    totalRounds,
    hasError,
    isComplete,
    canCancel,
    cancelGeneration
  } = useGenerationProgress()

  // Don't render if not active
  if (!isGenerating && !isValidating && !isComplete && !hasError) {
    return null
  }

  return (
    <div className={`flex items-center space-x-3 p-2 bg-muted/50 rounded-md ${className}`}>
      {/* Status Icon */}
      {hasError ? (
        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
      ) : isComplete ? (
        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
      )}

      {/* Progress Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {progressMessage}
        </div>

        {!hasError && (
          <div className="flex items-center space-x-2 mt-1">
            <Progress value={progress} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {Math.round(progress)}%
            </span>
            {currentRound && totalRounds && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {currentRound}/{totalRounds}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Cancel Button */}
      {canCancel && (
        <Button
          variant="ghost"
          size="sm"
          onClick={cancelGeneration}
          className="h-6 w-6 p-0 flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

/**
 * Generation status badge for minimal display
 */
export function GenerationStatusBadge({
  onClick,
  className = ''
}: {
  onClick?: () => void
  className?: string
}) {
  const {
    isGenerating,
    isValidating,
    progress,
    currentRound,
    totalRounds,
    hasError,
    isComplete
  } = useGenerationProgress()

  // Don't render if not active
  if (!isGenerating && !isValidating && !isComplete && !hasError) {
    return null
  }

  const getStatusText = () => {
    if (hasError) return 'Error'
    if (isComplete) return 'Complete'
    if (isValidating && currentRound && totalRounds) return `Round ${currentRound}/${totalRounds}`
    return `${Math.round(progress)}%`
  }

  const getStatusColor = () => {
    if (hasError) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    if (isComplete) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors hover:opacity-80 ${getStatusColor()} ${className}`}
    >
      {!hasError && !isComplete && (
        <Loader2 className="h-3 w-3 animate-spin" />
      )}
      <span>{getStatusText()}</span>
    </button>
  )
}
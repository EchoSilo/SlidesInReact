"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react"

export type ErrorType = 'network' | 'api' | 'validation' | 'unknown'

interface ErrorDisplayProps {
  type: ErrorType
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ type, message, onRetry, className }: ErrorDisplayProps) {
  const getErrorConfig = (errorType: ErrorType) => {
    switch (errorType) {
      case 'network':
        return {
          icon: WifiOff,
          color: 'red',
          title: 'Connection Error',
          suggestion: 'Check your internet connection and try again.'
        }
      case 'api':
        return {
          icon: AlertCircle,
          color: 'orange',
          title: 'API Error',
          suggestion: 'There was an issue with the AI service. Please try again.'
        }
      case 'validation':
        return {
          icon: AlertCircle,
          color: 'yellow',
          title: 'Invalid Request',
          suggestion: 'Please check your input and try a different approach.'
        }
      default:
        return {
          icon: AlertCircle,
          color: 'red',
          title: 'Unexpected Error',
          suggestion: 'Something went wrong. Please try again.'
        }
    }
  }

  const config = getErrorConfig(type)
  const Icon = config.icon

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg border",
      config.color === 'red' && "bg-red-50 border-red-200",
      config.color === 'orange' && "bg-orange-50 border-orange-200",
      config.color === 'yellow' && "bg-yellow-50 border-yellow-200",
      className
    )}>
      <Icon className={cn(
        "w-5 h-5 mt-0.5 flex-shrink-0",
        config.color === 'red' && "text-red-600",
        config.color === 'orange' && "text-orange-600",
        config.color === 'yellow' && "text-yellow-600"
      )} />

      <div className="flex-1 space-y-2">
        <div>
          <h4 className={cn(
            "font-medium text-sm",
            config.color === 'red' && "text-red-800",
            config.color === 'orange' && "text-orange-800",
            config.color === 'yellow' && "text-yellow-800"
          )}>
            {config.title}
          </h4>
          <p className={cn(
            "text-sm mt-1",
            config.color === 'red' && "text-red-700",
            config.color === 'orange' && "text-orange-700",
            config.color === 'yellow' && "text-yellow-700"
          )}>
            {message}
          </p>
          <p className={cn(
            "text-xs mt-1",
            config.color === 'red' && "text-red-600",
            config.color === 'orange' && "text-orange-600",
            config.color === 'yellow' && "text-yellow-600"
          )}>
            {config.suggestion}
          </p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className={cn(
              "text-xs",
              config.color === 'red' && "border-red-300 text-red-700 hover:bg-red-100",
              config.color === 'orange' && "border-orange-300 text-orange-700 hover:bg-orange-100",
              config.color === 'yellow' && "border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            )}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

interface ConnectionStatusProps {
  isConnected: boolean
  className?: string
}

export function ConnectionStatus({ isConnected, className }: ConnectionStatusProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 rounded-full text-xs",
      isConnected
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700",
      className
    )}>
      {isConnected ? (
        <Wifi className="w-3 h-3" />
      ) : (
        <WifiOff className="w-3 h-3" />
      )}
      <span>{isConnected ? 'Connected' : 'Offline'}</span>
    </div>
  )
}

interface RetryButtonProps {
  onRetry: () => void
  isRetrying?: boolean
  disabled?: boolean
  className?: string
}

export function RetryButton({
  onRetry,
  isRetrying = false,
  disabled = false,
  className
}: RetryButtonProps) {
  return (
    <Button
      onClick={onRetry}
      disabled={disabled || isRetrying}
      size="sm"
      variant="outline"
      className={cn("text-xs", className)}
    >
      <RefreshCw className={cn("w-3 h-3 mr-1", isRetrying && "animate-spin")} />
      {isRetrying ? 'Retrying...' : 'Retry'}
    </Button>
  )
}
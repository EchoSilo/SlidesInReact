"use client"

import { useApiConnection } from '@/hooks/useApiConnection'
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'

interface ApiConnectionIndicatorProps {
  showText?: boolean
}

export function ApiConnectionIndicator({ showText = true }: ApiConnectionIndicatorProps) {
  const { isConnected, isValidating, error, hasApiKey } = useApiConnection()

  const getStatusIcon = () => {
    if (isValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    }
    if (isConnected) {
      return <div className="w-3 h-3 bg-green-500 rounded-full" />
    }
    if (error || hasApiKey) {
      return <div className="w-3 h-3 bg-red-500 rounded-full" />
    }
    return <div className="w-3 h-3 bg-orange-500 rounded-full" />
  }

  const getStatusText = () => {
    if (isValidating) return 'Connecting...'
    if (isConnected) return 'Connected'
    if (error) return 'Connection failed'
    if (!hasApiKey) return 'Not configured'
    return 'Disconnected'
  }

  return (
    <div className="flex items-center gap-2">
      {getStatusIcon()}
      {showText && (
        <span className="text-sm text-muted-foreground">
          {getStatusText()}
        </span>
      )}
    </div>
  )
}
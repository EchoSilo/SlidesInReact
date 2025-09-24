"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Loader2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ProgressMessage {
  id: string
  type: 'info' | 'success' | 'error' | 'warning'
  title: string
  description?: string
  timestamp: number
  status: 'pending' | 'active' | 'complete' | 'error'
}

interface ProgressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  messages: ProgressMessage[]
  isComplete?: boolean
  error?: string | null
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
}

const getStatusIcon = (message: ProgressMessage) => {
  if (message.status === 'complete') {
    return CheckCircle
  }
  if (message.status === 'error') {
    return AlertCircle
  }
  if (message.status === 'active') {
    return Loader2
  }
  return iconMap[message.type] || Info
}

const getStatusColor = (message: ProgressMessage) => {
  if (message.status === 'complete') {
    return 'text-green-500'
  }
  if (message.status === 'error') {
    return 'text-red-500'
  }
  if (message.status === 'active') {
    return 'text-blue-500'
  }
  return 'text-gray-400'
}

export function ProgressModal({
  open,
  onOpenChange,
  title = "Generating Presentation",
  messages,
  isComplete = false,
  error = null
}: ProgressModalProps) {
  const [visibleMessages, setVisibleMessages] = useState<ProgressMessage[]>([])

  useEffect(() => {
    // Keep only the last 3-4 messages visible for the sliding effect
    const recentMessages = messages.slice(-4)
    setVisibleMessages(recentMessages)
  }, [messages])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[80vh] flex flex-col"
        showCloseButton={isComplete || !!error}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!isComplete && !error && (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            )}
            {isComplete && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {error && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Error State */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success State */}
          {isComplete && !error && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex-shrink-0">
              <p className="text-green-700 text-sm">
                Presentation generated successfully! Redirecting to preview...
              </p>
            </div>
          )}

          {/* Progress Messages Container */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 relative overflow-hidden rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="absolute inset-0 flex flex-col justify-end p-2">
                <div className="space-y-2">
                  {visibleMessages.map((message, index) => {
                    const Icon = getStatusIcon(message)
                    const isLatest = index === visibleMessages.length - 1
                    const isSecondLatest = index === visibleMessages.length - 2

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded-md border transition-all duration-300 ease-out transform",
                          isLatest && "bg-white border-blue-200 shadow-sm translate-y-0 opacity-100 scale-100",
                          isSecondLatest && "bg-white/80 border-gray-200 -translate-y-1 opacity-80 scale-98",
                          !isLatest && !isSecondLatest && "bg-white/60 border-gray-100 -translate-y-2 opacity-60 scale-95"
                        )}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon
                            className={cn(
                              "w-3.5 h-3.5",
                              getStatusColor(message),
                              message.status === 'active' && "animate-spin"
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium leading-tight",
                            isLatest ? "text-gray-900" : "text-gray-600"
                          )}>
                            {message.title}
                          </p>
                          {message.description && (
                            <p className={cn(
                              "text-xs mt-0.5 leading-tight",
                              isLatest ? "text-gray-600" : "text-gray-500"
                            )}>
                              {message.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            {!isComplete && !error && (
              <div className="flex items-center justify-center pt-3 flex-shrink-0">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                      style={{
                        animationDelay: `${i * 200}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
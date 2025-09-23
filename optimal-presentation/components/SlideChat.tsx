"use client"

import { useState, useEffect, useRef } from 'react'
import { SlideData } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Send, Bot, User, Lightbulb, Sparkles, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'
import { useSlideChat } from '@/hooks/useSlideChat'
import { analyzeEditIntent } from '@/lib/slideParser'
import { ProcessingIndicator } from '@/components/ui/loading'
import { ErrorDisplay, ConnectionStatus } from '@/components/ui/error-handling'
import { SmartInput } from '@/components/ui/command-suggestions'

// Helper function to get slide icon based on layout
function getSlideIcon(layout: string): string {
  switch (layout) {
    case 'title-only':
      return '📄'
    case 'title-content':
      return '📝'
    case 'bullet-list':
      return '📋'
    case 'two-column':
      return '📊'
    case 'three-column':
      return '📈'
    case 'metrics':
      return '📉'
    case 'diagram':
      return '🔗'
    case 'centered':
      return '🎯'
    default:
      return '📄'
  }
}

interface SlideChatProps {
  slides: SlideData[]
  currentSlideIndex: number
  onSlideUpdate: (slideIndex: number, updatedSlide: SlideData) => void
  onSlideChange?: (slideIndex: number) => void
  onSlideAdd?: (newSlide: SlideData, position: number) => void
  className?: string
}

export function SlideChat({ slides, currentSlideIndex, onSlideUpdate, onSlideChange, onSlideAdd, className }: SlideChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use the slide chat hook
  const {
    messages,
    isProcessing,
    sendMessage,
    switchToSlide,
    addSystemMessage,
    retryLastMessage,
    isConnected
  } = useSlideChat({
    slides,
    currentSlideIndex,
    onSlideUpdate,
    onSlideChange,
    onSlideAdd
  })

  // Get current slide
  const currentSlide = slides[currentSlideIndex]

  // Initialize with welcome message when slide changes
  useEffect(() => {
    if (messages.length === 0 && currentSlide) {
      addSystemMessage(`Hi! I'm here to help you edit slide ${currentSlideIndex + 1}: "${currentSlide.title}". What would you like to change?`)
    }
  }, [currentSlide?.id, currentSlideIndex, currentSlide?.title, messages.length, addSystemMessage])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Get contextual suggestions based on slide type and layout
  const getQuickSuggestions = () => {
    return analyzeEditIntent(input || '', currentSlide?.layout || 'title-content')
  }

  // Handle slide selection from dropdown
  const handleSlideChange = (value: string) => {
    const slideIndex = parseInt(value)
    switchToSlide(slideIndex)
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const message = input.trim()
    setInput('')

    await sendMessage(message)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }


  return (
    <Card className={`flex flex-col h-full border border-gray-200 shadow-sm ${className || ''}`}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">Slide Editor</h3>
            <ConnectionStatus isConnected={isConnected} />
          </div>

          {/* Slide Selector */}
          <div className="flex items-center gap-2 mt-1">
            <Select value={currentSlideIndex.toString()} onValueChange={handleSlideChange}>
              <SelectTrigger className="h-6 text-xs bg-white border-gray-200 hover:border-primary/50">
                <SelectValue>
                  <span className="flex items-center gap-1">
                    <span>📄</span>
                    <span>Slide {currentSlideIndex + 1}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{currentSlide?.layout}</span>
                  </span>
                </SelectValue>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                {slides.map((slide, index) => (
                  <SelectItem key={slide.id || index} value={index.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{getSlideIcon(slide.layout)}</span>
                      <span className="font-medium">Slide {index + 1}:</span>
                      <span className="truncate max-w-[200px]">{slide.title}</span>
                      <span className="text-muted-foreground text-xs">({slide.layout})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-purple-500" />
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            // Handle loading messages
            if (message.type === 'loading') {
              return (
                <div key={message.id} className="flex justify-center">
                  <ProcessingIndicator message={message.content} />
                </div>
              )
            }

            // Handle error messages
            if (message.type === 'error') {
              return (
                <div key={message.id}>
                  <ErrorDisplay
                    type={message.errorType || 'unknown'}
                    message={message.content}
                    onRetry={message.canRetry ? message.retryAction : undefined}
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )
            }

            // Handle regular messages
            return (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-primary'
                    : message.type === 'system'
                    ? message.content.includes('✅') ? 'bg-green-100' : message.content.includes('❌') ? 'bg-red-100' : 'bg-orange-100'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-3 h-3 text-white" />
                  ) : message.type === 'system' ? (
                    message.content.includes('✅') ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : message.content.includes('❌') ? (
                      <AlertCircle className="w-3 h-3 text-red-600" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-orange-600" />
                    )
                  ) : (
                    <Bot className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[85%] ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : message.type === 'system'
                        ? message.content.includes('✅')
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : message.content.includes('❌')
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-gray-50 text-foreground border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-muted-foreground">Quick suggestions:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {getQuickSuggestions().map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSuggestion(suggestion)}
              className="text-xs h-7 px-3 bg-white hover:bg-primary/5 hover:border-primary/30"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <SmartInput
              value={input}
              onChange={setInput}
              onSubmit={handleSend}
              currentSlide={currentSlide}
              placeholder="Type your editing request..."
              disabled={isProcessing}
              className="text-sm"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            size="sm"
            className="px-3"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Try: "Add a bullet about ROI", "Make the title shorter", "Include key metrics"
        </p>
      </div>
    </Card>
  )
}
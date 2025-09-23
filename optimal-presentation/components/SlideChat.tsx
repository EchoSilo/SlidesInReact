"use client"

import { useState, useEffect, useRef } from 'react'
import { SlideData } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Lightbulb, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { useSlideChat } from '@/hooks/useSlideChat'
import { analyzeEditIntent } from '@/lib/slideParser'

interface SlideChatProps {
  slide: SlideData
  slideIndex: number
  onSlideUpdate: (updatedSlide: SlideData) => void
  className?: string
}

export function SlideChat({ slide, slideIndex, onSlideUpdate, className }: SlideChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use the slide chat hook
  const {
    messages,
    isProcessing,
    sendMessage,
    addSystemMessage
  } = useSlideChat({
    slide,
    slideIndex,
    onSlideUpdate
  })

  // Initialize with welcome message when slide changes
  useEffect(() => {
    if (messages.length === 0) {
      addSystemMessage(`Hi! I'm here to help you edit slide ${slideIndex + 1}: "${slide.title}". What would you like to change?`)
    }
  }, [slide.id, slideIndex, slide.title, messages.length, addSystemMessage])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Get contextual suggestions based on slide type and layout
  const getQuickSuggestions = () => {
    return analyzeEditIntent(input || '', slide.layout)
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className={`flex flex-col h-full border border-gray-200 shadow-sm ${className || ''}`}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Slide Editor</h3>
          <p className="text-sm text-muted-foreground">
            Editing slide {slideIndex + 1} • {slide.layout}
          </p>
        </div>
        <Sparkles className="w-5 h-5 text-purple-500" />
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
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
          ))}
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
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your editing request..."
            disabled={isProcessing}
            className="flex-1 text-sm"
          />
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
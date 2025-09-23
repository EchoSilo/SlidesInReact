"use client"

import { useState, useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, Lightbulb, Sparkles } from 'lucide-react'
import { CommandTemplate, CommandSuggestion, getCommandSuggestions, getCategoryIcon, getContextualSuggestions } from '@/lib/commandTemplates'
import { SlideData } from '@/lib/types'

interface CommandSuggestionsProps {
  input: string
  currentSlide?: SlideData
  onSuggestionSelect: (suggestion: string) => void
  onInputChange: (value: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  className?: string
}

export function CommandSuggestions({
  input,
  currentSlide,
  onSuggestionSelect,
  onInputChange,
  isOpen,
  onOpenChange,
  className
}: CommandSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<CommandSuggestion[]>([])
  const [contextualSuggestions, setContextualSuggestions] = useState<CommandTemplate[]>([])

  // Update suggestions when input changes
  useEffect(() => {
    const newSuggestions = getCommandSuggestions(input, currentSlide, 5)
    setSuggestions(newSuggestions)

    // Get contextual suggestions for current slide
    const contextual = getContextualSuggestions(currentSlide)
    setContextualSuggestions(contextual)
  }, [input, currentSlide])

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSelect(suggestion)
    onOpenChange(false)
  }

  const hasInputSuggestions = suggestions.length > 0
  const hasContextualSuggestions = contextualSuggestions.length > 0

  if (!isOpen) {
    return null
  }

  return (
    <div className={cn(
      "absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg border shadow-lg z-50 max-h-80 overflow-y-auto",
      className
    )}>
      {hasInputSuggestions && (
        <div>
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Command Suggestions</span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.template.id}
                onClick={() => handleSuggestionClick(suggestion.template.example)}
                className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 text-left border-b last:border-b-0"
              >
                <span className="text-lg mt-0.5">
                  {getCategoryIcon(suggestion.template.category)}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {suggestion.template.example}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.template.description}
                  </p>
                  {suggestion.matchedKeywords.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {suggestion.matchedKeywords.slice(0, 3).map(keyword => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {hasInputSuggestions && hasContextualSuggestions && (
        <div className="border-t" />
      )}

      {hasContextualSuggestions && (
        <div>
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Suggestions for {currentSlide?.layout} slide</span>
          </div>
          <div className="max-h-32 overflow-y-auto">
            {contextualSuggestions.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSuggestionClick(template.example)}
                className="w-full flex items-start gap-3 p-2 hover:bg-gray-50 text-left border-b last:border-b-0"
              >
                <span className="text-sm mt-0.5">
                  {getCategoryIcon(template.category)}
                </span>
                <div className="flex-1">
                  <span className="text-sm">
                    {template.example}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!hasInputSuggestions && !hasContextualSuggestions && input.length >= 2 && (
        <div className="flex items-center gap-2 px-3 py-4 text-center">
          <span className="text-sm text-muted-foreground">
            No matching commands found. Try typing "create", "change", or "add"
          </span>
        </div>
      )}

      {input.length < 2 && (
        <div className="px-3 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Try these commands:</span>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleSuggestionClick('Create a benefits slide after this one')}
              className="block w-full text-left text-sm p-2 rounded hover:bg-gray-100"
            >
              Create a benefits slide after this one
            </button>
            <button
              onClick={() => handleSuggestionClick('Change this slide layout to two-column format')}
              className="block w-full text-left text-sm p-2 rounded hover:bg-gray-100"
            >
              Change this slide layout to two-column format
            </button>
            <button
              onClick={() => handleSuggestionClick('Add a chart to visualize the key metrics')}
              className="block w-full text-left text-sm p-2 rounded hover:bg-gray-100"
            >
              Add a chart to visualize the key metrics
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface SmartInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  currentSlide?: SlideData
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SmartInput({
  value,
  onChange,
  onSubmit,
  currentSlide,
  placeholder = "Type your editing request...",
  disabled = false,
  className
}: SmartInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (newValue: string) => {
    onChange(newValue)

    // Show suggestions when user starts typing
    if (newValue.length > 0 && !showSuggestions) {
      setShowSuggestions(true)
    }
  }

  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSubmit()
        setShowSuggestions(false)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    } else if (e.key === 'ArrowUp' && !showSuggestions) {
      e.preventDefault()
      setShowSuggestions(true)
    }
  }

  const handleFocus = () => {
    if (value.length === 0) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  return (
    <div className="relative">
      <CommandSuggestions
        input={value}
        currentSlide={currentSlide}
        onSuggestionSelect={handleSuggestionSelect}
        onInputChange={handleInputChange}
        isOpen={showSuggestions}
        onOpenChange={setShowSuggestions}
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />

      {!disabled && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className={cn("w-3 h-3 transition-transform", showSuggestions && "rotate-180")} />
          </Button>
        </div>
      )}
    </div>
  )
}
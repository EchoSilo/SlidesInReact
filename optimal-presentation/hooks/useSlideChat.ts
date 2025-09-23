import { useState, useCallback, useRef } from 'react'
import { SlideData } from '@/lib/types'
import { processSlideEdit, generateChangeSummary, EditRequest, AdvancedCommand } from '@/lib/slideParser'

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface UseSlideChatProps {
  slides: SlideData[]
  currentSlideIndex: number
  onSlideUpdate: (slideIndex: number, updatedSlide: SlideData) => void
  onSlideChange?: (slideIndex: number) => void
  onSlideAdd?: (newSlide: SlideData, position: number) => void
}

export interface UseSlideChatReturn {
  messages: ChatMessage[]
  isProcessing: boolean
  currentSlideIndex: number
  sendMessage: (message: string) => Promise<void>
  switchToSlide: (slideIndex: number) => void
  clearMessages: () => void
  clearSlideMessages: (slideIndex: number) => void
  addSystemMessage: (content: string) => void
}

export function useSlideChat({
  slides,
  currentSlideIndex,
  onSlideUpdate,
  onSlideChange,
  onSlideAdd
}: UseSlideChatProps): UseSlideChatReturn {
  // Store chat messages per slide
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const messageIdCounter = useRef(0)

  // Get current slide data
  const currentSlide = slides[currentSlideIndex]
  const currentSlideId = currentSlide?.id || `slide-${currentSlideIndex}`

  // Get messages for current slide
  const messages = chatHistory[currentSlideId] || []

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    messageIdCounter.current += 1
    return `msg-${currentSlideIndex}-${messageIdCounter.current}-${Date.now()}`
  }, [currentSlideIndex])

  // Add a message to the current slide's chat
  const addMessage = useCallback((
    type: ChatMessage['type'],
    content: string
  ): ChatMessage => {
    const message: ChatMessage = {
      id: generateMessageId(),
      type,
      content,
      timestamp: new Date()
    }

    setChatHistory(prev => ({
      ...prev,
      [currentSlideId]: [...(prev[currentSlideId] || []), message]
    }))
    return message
  }, [generateMessageId, currentSlideId])

  // Add system message (public method)
  const addSystemMessage = useCallback((content: string) => {
    addMessage('system', content)
  }, [addMessage])

  // Remove a specific message from current slide
  const removeMessage = useCallback((messageId: string) => {
    setChatHistory(prev => ({
      ...prev,
      [currentSlideId]: (prev[currentSlideId] || []).filter(msg => msg.id !== messageId)
    }))
  }, [currentSlideId])

  // Clear all messages for current slide
  const clearMessages = useCallback(() => {
    setChatHistory(prev => ({
      ...prev,
      [currentSlideId]: []
    }))
  }, [currentSlideId])

  // Clear messages for a specific slide
  const clearSlideMessages = useCallback((slideIndex: number) => {
    const slideId = slides[slideIndex]?.id || `slide-${slideIndex}`
    setChatHistory(prev => ({
      ...prev,
      [slideId]: []
    }))
  }, [slides])

  // Switch to a different slide
  const switchToSlide = useCallback((slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < slides.length) {
      onSlideChange?.(slideIndex)
    }
  }, [slides.length, onSlideChange])

  // Send a user message and process it
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isProcessing) {
      return
    }

    try {
      setIsProcessing(true)

      // Add user message
      addMessage('user', userMessage.trim())

      // Add thinking message
      const thinkingMessage = addMessage('system', '🤔 Analyzing your request...')

      // Get API key from localStorage
      const apiKey = localStorage.getItem('anthropic_api_key')
      if (!apiKey) {
        removeMessage(thinkingMessage.id)
        addMessage('assistant', 'API key not found. Please configure your Anthropic API key in Settings.')
        return
      }

      // Prepare edit request with slides array for advanced commands
      const editRequest: EditRequest & { slides?: SlideData[] } = {
        message: userMessage.trim(),
        slide: currentSlide,
        slideIndex: currentSlideIndex,
        slides: slides
      }

      // Process the edit
      const result = await processSlideEdit(editRequest, apiKey)

      // Remove thinking message
      removeMessage(thinkingMessage.id)

      if (result.success) {
        // Handle slide creation (advanced command)
        if (result.newSlide && result.command) {
          const { newSlide, command } = result

          // Calculate insertion position
          let insertPosition = currentSlideIndex + 1
          if (command.parameters.position === 'before') {
            insertPosition = currentSlideIndex
          } else if (command.parameters.position === 'end') {
            insertPosition = slides.length
          }

          // Add the new slide if callback is provided
          if (onSlideAdd) {
            onSlideAdd(newSlide, insertPosition)

            // Add success message with instructions
            const successContent = `✅ ${result.explanation}\n\n🆕 Navigate to the new slide to see your content!`
            addMessage('assistant', successContent)
          } else {
            addMessage('assistant', `✅ ${result.explanation}\n\n⚠️ Slide creation requires additional setup.`)
          }

        }
        // Handle slide updates (standard editing or layout changes)
        else if (result.updatedSlide || result.updates) {
          const finalSlide = result.updatedSlide || { ...currentSlide, ...result.updates }

          // Generate change summary for content updates
          let successContent = `✅ ${result.explanation}`

          if (result.updatedSlide) {
            const changeSummary = generateChangeSummary(currentSlide, result.updatedSlide)
            successContent += `\n\n📝 Changes: ${changeSummary}`
          } else if (result.command) {
            successContent += `\n\n🔄 ${result.command.type.replace('_', ' ').toUpperCase()} completed`
          }

          // Update the slide
          onSlideUpdate(currentSlideIndex, finalSlide)
          addMessage('assistant', successContent)

        } else {
          addMessage('assistant', `✅ ${result.explanation || 'Command processed successfully'}`)
        }

      } else {
        // Add error message
        const errorContent = result.error || 'Sorry, I couldn\'t process your request. Please try rephrasing it.'
        addMessage('assistant', `❌ ${errorContent}`)
      }

    } catch (error) {
      console.error('Chat message processing error:', error)

      // Remove any thinking messages from current slide
      setChatHistory(prev => ({
        ...prev,
        [currentSlideId]: (prev[currentSlideId] || []).filter(msg => !msg.content.includes('🤔'))
      }))

      // Add error message
      addMessage('assistant', '❌ An unexpected error occurred. Please try again.')

    } finally {
      setIsProcessing(false)
    }
  }, [currentSlide, currentSlideIndex, onSlideUpdate, isProcessing, addMessage, removeMessage])

  return {
    messages,
    isProcessing,
    currentSlideIndex,
    sendMessage,
    switchToSlide,
    clearMessages,
    clearSlideMessages,
    addSystemMessage
  }
}
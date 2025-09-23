import { useState, useCallback, useRef } from 'react'
import { SlideData } from '@/lib/types'
import { processSlideEdit, generateChangeSummary, EditRequest } from '@/lib/slideParser'

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface UseSlideChatProps {
  slide: SlideData
  slideIndex: number
  onSlideUpdate: (updatedSlide: SlideData) => void
}

export interface UseSlideChatReturn {
  messages: ChatMessage[]
  isProcessing: boolean
  sendMessage: (message: string) => Promise<void>
  clearMessages: () => void
  addSystemMessage: (content: string) => void
}

export function useSlideChat({
  slide,
  slideIndex,
  onSlideUpdate
}: UseSlideChatProps): UseSlideChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const messageIdCounter = useRef(0)

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    messageIdCounter.current += 1
    return `msg-${slideIndex}-${messageIdCounter.current}-${Date.now()}`
  }, [slideIndex])

  // Add a message to the chat
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

    setMessages(prev => [...prev, message])
    return message
  }, [generateMessageId])

  // Add system message (public method)
  const addSystemMessage = useCallback((content: string) => {
    addMessage('system', content)
  }, [addMessage])

  // Remove a specific message
  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }, [])

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

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

      // Prepare edit request
      const editRequest: EditRequest = {
        message: userMessage.trim(),
        slide,
        slideIndex
      }

      // Process the edit
      const result = await processSlideEdit(editRequest, apiKey)

      // Remove thinking message
      removeMessage(thinkingMessage.id)

      if (result.success && result.updatedSlide) {
        // Generate change summary
        const changeSummary = generateChangeSummary(slide, result.updatedSlide)

        // Update the slide
        onSlideUpdate(result.updatedSlide)

        // Add success message
        const successContent = result.explanation
          ? `✅ ${result.explanation}\n\n📝 Changes: ${changeSummary}`
          : `✅ ${changeSummary}`

        addMessage('assistant', successContent)

      } else {
        // Add error message
        const errorContent = result.error || 'Sorry, I couldn\'t process your request. Please try rephrasing it.'
        addMessage('assistant', `❌ ${errorContent}`)
      }

    } catch (error) {
      console.error('Chat message processing error:', error)

      // Remove any thinking messages
      setMessages(prev => prev.filter(msg => !msg.content.includes('🤔')))

      // Add error message
      addMessage('assistant', '❌ An unexpected error occurred. Please try again.')

    } finally {
      setIsProcessing(false)
    }
  }, [slide, slideIndex, onSlideUpdate, isProcessing, addMessage, removeMessage])

  return {
    messages,
    isProcessing,
    sendMessage,
    clearMessages,
    addSystemMessage
  }
}
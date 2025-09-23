"use client"

import { useState, useEffect } from 'react'

interface ApiConnectionState {
  isConnected: boolean
  isValidating: boolean
  error: string | null
  apiKey: string
  lastValidated: string | null
}

export function useApiConnection() {
  const [state, setState] = useState<ApiConnectionState>({
    isConnected: false,
    isValidating: false,
    error: null,
    apiKey: '',
    lastValidated: null
  })

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('anthropic_api_key')
    const lastValidated = localStorage.getItem('api_last_validated')

    if (storedKey) {
      setState(prev => ({
        ...prev,
        apiKey: storedKey,
        lastValidated
      }))

      // Auto-validate if we have a stored key and it was validated recently (within 1 hour)
      const oneHourAgo = Date.now() - 60 * 60 * 1000
      const lastValidatedTime = lastValidated ? new Date(lastValidated).getTime() : 0

      if (lastValidatedTime > oneHourAgo) {
        setState(prev => ({ ...prev, isConnected: true }))
      } else if (storedKey.trim()) {
        validateApiKey(storedKey, false) // Silent validation
      }
    }
  }, [])

  const validateApiKey = async (key: string, showErrors: boolean = true) => {
    setState(prev => ({ ...prev, isValidating: true, error: null }))

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      })

      const result = await response.json()

      if (result.valid) {
        // Store the key and validation time
        localStorage.setItem('anthropic_api_key', key)
        localStorage.setItem('api_last_validated', new Date().toISOString())

        setState(prev => ({
          ...prev,
          isConnected: true,
          apiKey: key,
          error: null,
          lastValidated: new Date().toISOString()
        }))

        return { success: true, message: result.message }
      } else {
        if (showErrors) {
          setState(prev => ({
            ...prev,
            isConnected: false,
            error: result.error
          }))
        }

        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Failed to validate API key. Please check your internet connection.'

      if (showErrors) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          error: errorMessage
        }))
      }

      return { success: false, error: errorMessage }
    } finally {
      setState(prev => ({ ...prev, isValidating: false }))
    }
  }

  const setApiKey = async (key: string) => {
    if (!key.trim()) {
      setState(prev => ({
        ...prev,
        apiKey: '',
        isConnected: false,
        error: 'API key is required'
      }))
      localStorage.removeItem('anthropic_api_key')
      localStorage.removeItem('api_last_validated')
      return { success: false, error: 'API key is required' }
    }

    const result = await validateApiKey(key, true)
    return result
  }

  const clearApiKey = () => {
    localStorage.removeItem('anthropic_api_key')
    localStorage.removeItem('api_last_validated')
    setState({
      isConnected: false,
      isValidating: false,
      error: null,
      apiKey: '',
      lastValidated: null
    })
  }

  const testConnection = async () => {
    if (!state.apiKey) {
      setState(prev => ({ ...prev, error: 'No API key configured' }))
      return { success: false, error: 'No API key configured' }
    }

    return await validateApiKey(state.apiKey, true)
  }

  return {
    ...state,
    setApiKey,
    clearApiKey,
    testConnection,
    hasApiKey: !!state.apiKey.trim(),
    isRecentlyValidated: state.lastValidated ?
      (Date.now() - new Date(state.lastValidated).getTime()) < 60 * 60 * 1000 : false
  }
}
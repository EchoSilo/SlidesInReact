"use client"

import { useState } from 'react'
import { useApiConnection } from '@/hooks/useApiConnection'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckCircle,
  XCircle,
  Loader2,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'

interface ApiConnectionStatusProps {
  compact?: boolean
  showManagement?: boolean
}

export function ApiConnectionStatus({ compact = false, showManagement = false }: ApiConnectionStatusProps) {
  const {
    isConnected,
    isValidating,
    error,
    apiKey,
    lastValidated,
    hasApiKey,
    isRecentlyValidated,
    setApiKey,
    clearApiKey,
    testConnection
  } = useApiConnection()

  const [showKey, setShowKey] = useState(false)
  const [inputKey, setInputKey] = useState('')
  const [isExpanded, setIsExpanded] = useState(!hasApiKey || !!error)

  const handleSaveKey = async () => {
    const result = await setApiKey(inputKey)
    if (result.success) {
      setInputKey('')
      setIsExpanded(false)
    }
  }

  const handleTestConnection = async () => {
    await testConnection()
  }

  const getStatusIcon = () => {
    if (isValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    }
    if (isConnected) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    if (error) {
      return <XCircle className="w-4 h-4 text-red-500" />
    }
    if (!hasApiKey) {
      return <AlertTriangle className="w-4 h-4 text-orange-500" />
    }
    return <XCircle className="w-4 h-4 text-gray-400" />
  }

  const getStatusText = () => {
    if (isValidating) return 'Validating...'
    if (isConnected) return 'Connected to Claude API'
    if (error) return error
    if (!hasApiKey) return 'API key not configured'
    return 'Disconnected'
  }

  const getStatusColor = () => {
    if (isConnected) return 'text-green-600'
    if (error) return 'text-red-600'
    if (!hasApiKey) return 'text-orange-600'
    return 'text-gray-600'
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={`text-sm ${getStatusColor()}`}>
          {isConnected ? 'API Connected' : 'API Disconnected'}
        </span>
        {showManagement && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className={`font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </p>
              {lastValidated && isConnected && (
                <p className="text-xs text-muted-foreground">
                  Last validated: {new Date(lastValidated).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasApiKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isValidating}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Test
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {isExpanded ? 'Hide' : 'Manage'}
            </Button>
          </div>
        </div>

        {/* Management Interface */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label htmlFor="api-key" className="text-sm font-medium">
                Anthropic API Key
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Get your API key from{' '}
                <a
                  href="https://console.anthropic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  console.anthropic.com
                </a>
              </p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="api-key"
                    type={showKey ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  onClick={handleSaveKey}
                  disabled={!inputKey.trim() || isValidating}
                >
                  {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </div>

            {hasApiKey && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current API Key</p>
                  <p className="text-xs text-muted-foreground">
                    {showKey ? apiKey : '•'.repeat(20) + apiKey.slice(-8)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearApiKey}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            )}

            {/* Security Note */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Security:</strong> Your API key is stored locally in your browser
                and is never sent to our servers except for direct API calls to Anthropic.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
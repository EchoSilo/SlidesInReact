"use client"

import { ApiConnectionStatus } from '@/components/ApiConnectionStatus'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-lg text-muted-foreground">
              Configure your AI presentation generator
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Hub
              </Button>
            </Link>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* API Configuration */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              API Configuration
            </h2>
            <ApiConnectionStatus showManagement={true} />
          </div>

          {/* About */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              About AI Presentation Generator
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                This application uses Anthropic's Claude AI to generate professional
                presentations based on your prompts. Your presentations are created
                dynamically and can be edited in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Features</h4>
                  <ul className="space-y-1">
                    <li>• AI-powered content generation</li>
                    <li>• Real-time slide editing</li>
                    <li>• Multiple presentation types</li>
                    <li>• PNG and PPTX export</li>
                    <li>• Local data storage</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Privacy</h4>
                  <ul className="space-y-1">
                    <li>• API key stored locally only</li>
                    <li>• No server-side key storage</li>
                    <li>• Direct API communication</li>
                    <li>• Presentations saved in browser</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-foreground mb-2">Getting Started</h4>
                <ol className="space-y-1">
                  <li>1. Get an API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">console.anthropic.com</a></li>
                  <li>2. Enter your API key in the configuration above</li>
                  <li>3. Navigate to "Generate New Presentation" to create your first presentation</li>
                  <li>4. Use the preview page to edit and export your presentations</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Data Management
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Your presentations and settings are stored locally in your browser.
                  This data includes generated presentations, API configuration, and user preferences.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const data = {
                        presentations: localStorage.getItem('generatedPresentation'),
                        apiKey: localStorage.getItem('anthropic_api_key'),
                        lastValidated: localStorage.getItem('api_last_validated')
                      }

                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = `presentation-backup-${new Date().toISOString().split('T')[0]}.json`
                      link.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    Export Data
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('This will clear all your local data including presentations and API key. Are you sure?')) {
                        localStorage.clear()
                        window.location.reload()
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
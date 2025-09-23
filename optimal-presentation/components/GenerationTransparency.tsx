/**
 * User-facing transparency component for presentation generation
 * Shows framework selection, LLM interactions, fallbacks, and quality metrics
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ChevronDown,
  ChevronRight,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  MessageSquare,
  RefreshCw
} from 'lucide-react'

interface TransparencyData {
  frameworkAnalysis?: {
    selectedFramework: string
    confidence: number
    rationale: string
  }
  generationInsights?: {
    modelUsed: string
    promptType: string
    responseLength: number
    processingTime: number
  }
  fallbacksUsed?: Array<{
    component: string
    reason: string
    impact: string
  }>
  qualityMetrics?: {
    contentQuality: number
    validationMethod: string
    improvementAchieved: number
  }
  recommendations?: string[]
}

interface GenerationTransparencyProps {
  transparencyData?: TransparencyData
  processingTime?: number
  className?: string
}

const ImpactBadge: React.FC<{ impact: string }> = ({ impact }) => {
  const config = {
    none: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    minor: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
    moderate: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
    significant: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  }

  const { color, icon: Icon } = config[impact as keyof typeof config] || config.minor

  return (
    <Badge variant="outline" className={`${color} border-0`}>
      <Icon className="w-3 h-3 mr-1" />
      {impact}
    </Badge>
  )
}

const FrameworkAnalysisCard: React.FC<{ analysis: TransparencyData['frameworkAnalysis'] }> = ({ analysis }) => {
  if (!analysis) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-4 h-4 text-blue-600" />
          Framework Selection
        </CardTitle>
        <CardDescription>
          How we chose the optimal presentation structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-lg">{analysis.selectedFramework}</span>
            <p className="text-sm text-muted-foreground">Selected Framework</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Progress value={analysis.confidence} className="w-16 h-2" />
              <span className="text-sm font-medium">{analysis.confidence}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
        </div>
        <Alert>
          <AlertDescription className="text-sm">
            <strong>Why {analysis.selectedFramework}?</strong> {analysis.rationale}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

const GenerationInsightsCard: React.FC<{ insights: TransparencyData['generationInsights'] }> = ({ insights }) => {
  if (!insights) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="w-4 h-4 text-purple-600" />
          AI Generation Details
        </CardTitle>
        <CardDescription>
          How your presentation was created
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{insights.modelUsed}</span>
            </div>
            <p className="text-xs text-muted-foreground">AI Model Used</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{insights.processingTime}ms</span>
            </div>
            <p className="text-xs text-muted-foreground">Generation Time</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">{insights.responseLength.toLocaleString()} characters</span>
            <p className="text-xs text-muted-foreground">Content Generated</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium capitalize">{insights.promptType.replace('-', ' ')}</span>
            <p className="text-xs text-muted-foreground">Generation Type</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const FallbacksCard: React.FC<{ fallbacks: TransparencyData['fallbacksUsed'] }> = ({ fallbacks }) => {
  if (!fallbacks || fallbacks.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <RefreshCw className="w-4 h-4 text-orange-600" />
          Backup Methods Used
        </CardTitle>
        <CardDescription>
          Alternative approaches that were automatically applied
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fallbacks.map((fallback, index) => (
            <div key={index} className="border-l-2 border-orange-200 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm capitalize">{fallback.component.replace('-', ' ')}</span>
                <ImpactBadge impact={fallback.impact} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                <strong>Issue:</strong> {fallback.reason}
              </p>
            </div>
          ))}
        </div>
        <Alert className="mt-3">
          <AlertDescription className="text-xs">
            These backup methods ensure your presentation is generated even when optimal approaches encounter issues.
            The system automatically uses the best available alternative.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

const QualityMetricsCard: React.FC<{ metrics: TransparencyData['qualityMetrics'] }> = ({ metrics }) => {
  if (!metrics) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Content Quality Analysis
        </CardTitle>
        <CardDescription>
          How we validated and improved your presentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Content Quality Score</span>
            <span className="text-lg font-bold">{metrics.contentQuality}/100</span>
          </div>
          <Progress value={metrics.contentQuality} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium capitalize">{metrics.validationMethod.replace('-', ' ')}</span>
            <p className="text-xs text-muted-foreground">Validation Method</p>
          </div>
          <div>
            <span className="text-sm font-medium">+{metrics.improvementAchieved} points</span>
            <p className="text-xs text-muted-foreground">Quality Improvement</p>
          </div>
        </div>

        {metrics.improvementAchieved > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Your presentation was automatically improved by {metrics.improvementAchieved} quality points
              through our validation system.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

const RecommendationsCard: React.FC<{ recommendations: string[] }> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle className="w-4 h-4 text-green-600" />
          Suggestions for Better Results
        </CardTitle>
        <CardDescription>
          Tips to improve future presentation generations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export const GenerationTransparency: React.FC<GenerationTransparencyProps> = ({
  transparencyData,
  processingTime,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!transparencyData) {
    return null
  }

  const hasSignificantFallbacks = transparencyData.fallbacksUsed?.some(f =>
    f.impact === 'moderate' || f.impact === 'significant'
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Banner */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Generation Complete</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {transparencyData.frameworkAnalysis && (
                  <span>Framework: {transparencyData.frameworkAnalysis.selectedFramework}</span>
                )}
                {processingTime && (
                  <span>Time: {processingTime}ms</span>
                )}
                {transparencyData.fallbacksUsed && transparencyData.fallbacksUsed.length > 0 && (
                  <span className={hasSignificantFallbacks ? 'text-orange-600' : 'text-green-600'}>
                    {transparencyData.fallbacksUsed.length} backup method{transparencyData.fallbacksUsed.length !== 1 ? 's' : ''} used
                  </span>
                )}
              </div>
            </div>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  {isExpanded ? (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Show Details
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FrameworkAnalysisCard analysis={transparencyData.frameworkAnalysis} />
            <GenerationInsightsCard insights={transparencyData.generationInsights} />
            <QualityMetricsCard metrics={transparencyData.qualityMetrics} />
            <FallbacksCard fallbacks={transparencyData.fallbacksUsed} />
          </div>
          <RecommendationsCard recommendations={transparencyData.recommendations} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default GenerationTransparency
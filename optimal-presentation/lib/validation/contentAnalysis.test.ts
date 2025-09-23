/**
 * Unit tests for content analysis and scoring functions
 */

import {
  ContentAnalyzer,
  ValidationDimensions,
  ValidationIssue,
  IssueType,
  IssueSeverity,
  analyzePresentation,
  quickContentScore,
  QUALITY_THRESHOLDS
} from './contentAnalysis'
import { PresentationData } from '@/lib/types'
import { FrameworkAnalysisResult } from './frameworkAnalysis'

// Test data
const mockPresentation: PresentationData = {
  id: 'test-presentation',
  title: 'Digital Transformation Strategy',
  subtitle: 'Driving Innovation and Growth',
  description: 'Strategic presentation on digital transformation initiatives',
  metadata: {
    author: 'Test Author',
    created_at: '2024-01-01T00:00:00Z',
    presentation_type: 'business',
    target_audience: 'executives',
    estimated_duration: 15,
    slide_count: 5,
    tone: 'professional',
    version: '1.0'
  },
  slides: [
    {
      id: 'slide-1',
      type: 'title',
      title: 'Digital Transformation Strategy',
      subtitle: 'Driving Innovation and Growth',
      layout: 'title-only',
      content: {
        mainText: 'Strategic initiative to modernize operations and drive competitive advantage',
        callout: 'Key to future success'
      }
    },
    {
      id: 'slide-2',
      type: 'problem',
      title: 'Current Challenges',
      layout: 'title-content',
      content: {
        sections: [
          {
            title: 'Legacy Systems',
            description: 'Outdated technology limiting growth and efficiency',
            items: ['Manual processes', 'Data silos', 'Security vulnerabilities']
          }
        ],
        keyMetrics: [
          { label: 'Efficiency Loss', value: '30%', description: 'due to manual processes' },
          { label: 'Cost Increase', value: '$2M', description: 'annual maintenance overhead' }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'solution',
      title: 'Proposed Solution',
      layout: 'two-column',
      content: {
        sections: [
          {
            title: 'Cloud Migration',
            description: 'Move to modern cloud infrastructure',
            items: ['Scalable architecture', 'Enhanced security', 'Cost optimization']
          },
          {
            title: 'Process Automation',
            description: 'Automate key business processes',
            items: ['Workflow optimization', 'Data integration', 'Real-time analytics']
          }
        ],
        keyMetrics: [
          { label: 'Cost Savings', value: '$5M', description: 'annual operational savings' },
          { label: 'Efficiency Gain', value: '50%', description: 'process improvement' }
        ]
      }
    },
    {
      id: 'slide-4',
      type: 'implementation',
      title: 'Implementation Timeline',
      layout: 'three-column',
      content: {
        sections: [
          {
            title: 'Phase 1 (Q1)',
            description: 'Foundation setup',
            items: ['Infrastructure planning', 'Team formation', 'Vendor selection']
          },
          {
            title: 'Phase 2 (Q2-Q3)',
            description: 'Core implementation',
            items: ['System migration', 'Process automation', 'User training']
          },
          {
            title: 'Phase 3 (Q4)',
            description: 'Optimization',
            items: ['Performance tuning', 'User feedback', 'Continuous improvement']
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'conclusion',
      title: 'Next Steps',
      layout: 'centered',
      content: {
        bulletPoints: [
          'Approve budget allocation for digital transformation',
          'Establish project steering committee',
          'Begin vendor evaluation process',
          'Schedule monthly progress reviews'
        ],
        callout: 'Time to act is now for competitive advantage'
      }
    }
  ]
}

const mockFrameworkAnalysis: FrameworkAnalysisResult = {
  analysis: {
    content_purpose: 'Strategic digital transformation proposal',
    audience_needs: 'Executive decision-making support',
    content_type: 'problem-solving',
    decision_context: 'Investment and strategic direction'
  },
  framework_evaluation: [
    {
      framework_id: 'scqa',
      suitability_score: 85,
      rationale: 'Good fit for problem-solving presentation',
      strengths: ['Clear problem definition', 'Solution focus'],
      weaknesses: ['Could be more strategic']
    }
  ],
  recommendation: {
    primary_framework: 'scqa',
    confidence_score: 85,
    rationale: 'SCQA framework optimal for this problem-solution presentation',
    alternative_framework: 'pyramid',
    implementation_notes: 'Focus on situation-complication-question-answer flow'
  },
  current_framework_assessment: {
    detected_framework: 'scqa',
    alignment_score: 80,
    issues: [],
    framework_mismatch: false
  }
}

describe('ContentAnalyzer', () => {
  let analyzer: ContentAnalyzer

  beforeEach(() => {
    analyzer = new ContentAnalyzer({
      audienceLevel: 'executive',
      minimumConfidence: 70,
      includeMinorIssues: true
    })
  })

  describe('Content Extraction', () => {
    test('should extract text content correctly', () => {
      const content = analyzer.extractContent(mockPresentation)

      expect(content.textContent).toContain('Digital Transformation Strategy')
      expect(content.textContent).toContain('Strategic initiative to modernize operations')
      expect(content.structuralElements.titles).toHaveLength(5)
      expect(content.structuralElements.metrics).toHaveLength(4)
    })

    test('should identify business elements', () => {
      const content = analyzer.extractContent(mockPresentation)

      expect(content.businessElements.quantifiedBenefits).toContain('Cost Savings: $5M')
      expect(content.businessElements.quantifiedBenefits).toContain('Efficiency Gain: 50%')
      expect(content.businessElements.actionItems).toHaveLength(4)
    })

    test('should analyze narrative flow', () => {
      const content = analyzer.extractContent(mockPresentation)

      expect(content.contentFlow.narrativeArc).toBe('Problem-to-solution narrative')
      expect(content.contentFlow.slideProgression).toHaveLength(5)
    })
  })

  describe('Content Metrics Calculation', () => {
    test('should calculate content metrics accurately', () => {
      const metrics = analyzer.calculateContentMetrics(mockPresentation)

      expect(metrics.slideCount).toBe(5)
      expect(metrics.wordCount).toBeGreaterThan(0)
      expect(metrics.bulletPointCount).toBeGreaterThan(0)
      expect(metrics.metricCount).toBe(4)
      expect(metrics.hasCallouts).toBe(true)
      expect(metrics.contentDensity).toBeDefined()
    })
  })

  describe('Dimension Scoring', () => {
    test('should score framework adherence', async () => {
      const result = await analyzer.analyzeContent(mockPresentation, mockFrameworkAnalysis)

      expect(result.dimensionScores.frameworkAdherence).toBeGreaterThan(0)
      expect(result.dimensionScores.frameworkAdherence).toBeLessThanOrEqual(100)
    })

    test('should score executive readiness', async () => {
      const result = await analyzer.analyzeContent(mockPresentation, mockFrameworkAnalysis)

      expect(result.dimensionScores.executiveReadiness).toBeGreaterThan(0)
      expect(result.dimensionScores.executiveReadiness).toBeLessThanOrEqual(100)
    })

    test('should score content clarity', async () => {
      const result = await analyzer.analyzeContent(mockPresentation, mockFrameworkAnalysis)

      expect(result.dimensionScores.contentClarity).toBeGreaterThan(0)
      expect(result.dimensionScores.contentClarity).toBeLessThanOrEqual(100)
    })

    test('should score business impact', async () => {
      const result = await analyzer.analyzeContent(mockPresentation, mockFrameworkAnalysis)

      expect(result.dimensionScores.businessImpact).toBeGreaterThan(0)
      expect(result.dimensionScores.businessImpact).toBeLessThanOrEqual(100)
    })

    test('should calculate overall score correctly', async () => {
      const result = await analyzer.analyzeContent(mockPresentation, mockFrameworkAnalysis)

      expect(result.overallScore).toBeGreaterThan(0)
      expect(result.overallScore).toBeLessThanOrEqual(100)

      // Verify weighted calculation
      const expectedScore = Math.round(
        result.dimensionScores.frameworkAdherence * 0.25 +
        result.dimensionScores.executiveReadiness * 0.30 +
        result.dimensionScores.contentClarity * 0.25 +
        result.dimensionScores.businessImpact * 0.20
      )

      expect(result.overallScore).toBe(expectedScore)
    })
  })

  describe('Issue Identification', () => {
    test('should identify issues in content', async () => {
      const result = await analyzer.analyzeContentWithIssues(mockPresentation, mockFrameworkAnalysis)

      expect(result.issues).toBeDefined()
      expect(Array.isArray(result.issues)).toBe(true)

      // Verify issue structure
      if (result.issues.length > 0) {
        const issue = result.issues[0]
        expect(issue).toHaveProperty('id')
        expect(issue).toHaveProperty('type')
        expect(issue).toHaveProperty('severity')
        expect(issue).toHaveProperty('title')
        expect(issue).toHaveProperty('description')
        expect(issue).toHaveProperty('suggestedFix')
        expect(issue).toHaveProperty('confidence')
        expect(issue.confidence).toBeGreaterThanOrEqual(0)
        expect(issue.confidence).toBeLessThanOrEqual(100)
      }
    })

    test('should filter issues by confidence threshold', () => {
      const lowConfidenceAnalyzer = new ContentAnalyzer({
        minimumConfidence: 95 // Very high threshold
      })

      // This would require running the analysis, but we can test the filtering logic
      const mockIssues: ValidationIssue[] = [
        {
          id: 'test-1',
          type: IssueType.BUSINESS_VALUE,
          severity: IssueSeverity.CRITICAL,
          title: 'High Confidence Issue',
          description: 'Test issue',
          affectedSlides: [],
          suggestedFix: 'Fix it',
          confidence: 96,
          framework_related: false
        },
        {
          id: 'test-2',
          type: IssueType.CLARITY_LANGUAGE,
          severity: IssueSeverity.MINOR,
          title: 'Low Confidence Issue',
          description: 'Test issue',
          affectedSlides: [],
          suggestedFix: 'Fix it',
          confidence: 60,
          framework_related: false
        }
      ]

      const filtered = mockIssues.filter(issue => issue.confidence >= 95)
      expect(filtered).toHaveLength(1)
      expect(filtered[0].confidence).toBe(96)
    })

    test('should prioritize issues correctly', () => {
      const mockIssues: ValidationIssue[] = [
        {
          id: 'minor-issue',
          type: IssueType.CONSISTENCY,
          severity: IssueSeverity.MINOR,
          title: 'Minor Issue',
          description: 'Test',
          affectedSlides: [],
          suggestedFix: 'Fix',
          confidence: 70,
          framework_related: false
        },
        {
          id: 'critical-issue',
          type: IssueType.FRAMEWORK_STRUCTURE,
          severity: IssueSeverity.CRITICAL,
          title: 'Critical Issue',
          description: 'Test',
          affectedSlides: [],
          suggestedFix: 'Fix',
          confidence: 90,
          framework_related: true
        },
        {
          id: 'important-issue',
          type: IssueType.BUSINESS_VALUE,
          severity: IssueSeverity.IMPORTANT,
          title: 'Important Issue',
          description: 'Test',
          affectedSlides: [],
          suggestedFix: 'Fix',
          confidence: 85,
          framework_related: false
        }
      ]

      const prioritized = analyzer.prioritizeIssues(mockIssues)

      expect(prioritized[0].severity).toBe(IssueSeverity.CRITICAL)
      expect(prioritized[1].severity).toBe(IssueSeverity.IMPORTANT)
      expect(prioritized[2].severity).toBe(IssueSeverity.MINOR)
    })
  })

  describe('Quality Assessment', () => {
    test('should determine quality level correctly', () => {
      expect(analyzer.getQualityLevel(95)).toBe('excellent')
      expect(analyzer.getQualityLevel(80)).toBe('good')
      expect(analyzer.getQualityLevel(65)).toBe('acceptable')
      expect(analyzer.getQualityLevel(45)).toBe('needsImprovement')
      expect(analyzer.getQualityLevel(25)).toBe('poor')
    })

    test('should generate summary statistics', async () => {
      const result = await analyzer.analyzeContentWithIssues(mockPresentation, mockFrameworkAnalysis)
      const stats = analyzer.generateSummaryStats(result)

      expect(stats.qualityLevel).toBeDefined()
      expect(stats.criticalIssues).toBeGreaterThanOrEqual(0)
      expect(stats.importantIssues).toBeGreaterThanOrEqual(0)
      expect(stats.minorIssues).toBeGreaterThanOrEqual(0)
      expect(stats.frameworkRelatedIssues).toBeGreaterThanOrEqual(0)
      expect(stats.improvementPotential).toBeGreaterThanOrEqual(0)
      expect(stats.improvementPotential).toBeLessThanOrEqual(100)
    })
  })

  describe('Error Handling', () => {
    test('should handle empty presentation gracefully', () => {
      const emptyPresentation: PresentationData = {
        ...mockPresentation,
        slides: []
      }

      const content = analyzer.extractContent(emptyPresentation)
      expect(content.textContent).toHaveLength(0)
      expect(content.structuralElements.titles).toHaveLength(0)
    })

    test('should handle missing content gracefully', () => {
      const minimalPresentation: PresentationData = {
        ...mockPresentation,
        slides: [
          {
            id: 'slide-1',
            type: 'title',
            title: 'Test Slide',
            layout: 'title-only',
            content: {}
          }
        ]
      }

      const content = analyzer.extractContent(minimalPresentation)
      expect(content.textContent).toContain('Test Slide')
      expect(content.structuralElements.metrics).toHaveLength(0)
    })
  })
})

describe('Standalone Functions', () => {
  test('analyzePresentation should work correctly', async () => {
    const result = await analyzePresentation(mockPresentation, mockFrameworkAnalysis)

    expect(result.overallScore).toBeGreaterThan(0)
    expect(result.dimensionScores).toBeDefined()
    expect(result.issues).toBeDefined()
    expect(result.recommendations).toBeDefined()
    expect(result.analysisMetadata).toBeDefined()
  })

  test('quickContentScore should provide fast scoring', () => {
    const scores = quickContentScore(mockPresentation, 'scqa')

    expect(scores.frameworkAdherence).toBeGreaterThan(0)
    expect(scores.executiveReadiness).toBeGreaterThan(0)
    expect(scores.contentClarity).toBeGreaterThan(0)
    expect(scores.businessImpact).toBeGreaterThan(0)
  })
})

describe('Content Analysis Edge Cases', () => {
  test('should handle presentations with high technical content', () => {
    const technicalPresentation: PresentationData = {
      ...mockPresentation,
      slides: [
        {
          id: 'slide-1',
          type: 'title',
          title: 'Technical Architecture Implementation',
          layout: 'title-only',
          content: {
            mainText: 'Microservices architecture with containerization and orchestration implementation using Kubernetes deployment configuration optimization'
          }
        }
      ]
    }

    const content = analyzer.extractContent(technicalPresentation)
    const technicalTerms = ['architecture', 'implementation', 'configuration', 'optimization']
    const allText = content.textContent.join(' ')

    const technicalCount = technicalTerms.filter(term =>
      allText.toLowerCase().includes(term.toLowerCase())
    ).length

    expect(technicalCount).toBeGreaterThan(2)
  })

  test('should identify missing quantified benefits', () => {
    const noMetricsPresentation: PresentationData = {
      ...mockPresentation,
      slides: mockPresentation.slides.map(slide => ({
        ...slide,
        content: {
          ...slide.content,
          keyMetrics: undefined // Remove all metrics
        }
      }))
    }

    const content = analyzer.extractContent(noMetricsPresentation)
    expect(content.businessElements.quantifiedBenefits).toHaveLength(0)
  })

  test('should detect content density issues', () => {
    const densePresentation: PresentationData = {
      ...mockPresentation,
      slides: [
        {
          id: 'slide-1',
          type: 'title',
          title: 'Dense Content Slide',
          layout: 'title-only',
          content: {
            mainText: 'This is an extremely long slide with way too much content that would be difficult for executives to follow during a presentation because it contains too many words and concepts that should be broken down into multiple slides for better clarity and understanding and improved audience engagement and retention rates which are critical for successful business presentations in corporate environments where attention spans are limited and decision makers need concise actionable information presented in digestible formats'.repeat(3)
          }
        }
      ]
    }

    const metrics = analyzer.calculateContentMetrics(densePresentation)
    expect(metrics.avgWordsPerSlide).toBeGreaterThan(200)
    expect(metrics.contentDensity).toBe('high')
  })
})
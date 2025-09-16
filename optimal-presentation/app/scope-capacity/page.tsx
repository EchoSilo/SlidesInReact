"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  CheckCircle,
  TrendingUp,
  Download,
  Users,
  Calendar,
  Building2,
  Eye,
  Zap,
  Shield,
  Lightbulb,
  ArrowRight,
  Clock,
  FileText,
  Layers,
  Settings,
  Play,
  Users2,
  Rocket,
  Star,
  Award
} from "lucide-react"
import { toPng } from 'html-to-image'

const slides = [
  {
    id: "title",
    title: "Technology Capacity Management",
    subtitle: "Consolidated Scope & Resource Planning Framework",
    tagline: "Transforming Technology Delivery Through Unified Visibility & Strategic Resource Allocation",
    type: "title",
  },
  {
    id: "problem",
    title: "Current Challenge",
    subtitle: "Fragmented Visibility Across Technology Initiatives",
    type: "problem",
    content: {
      description: "Organizations struggle with scattered technology initiatives, unclear resource allocation, and limited visibility into capacity constraints.",
      challenges: [
        {
          icon: Eye,
          title: "Limited Scope Visibility",
          description: "No consolidated view of all technology initiatives across teams and departments",
          impact: "Duplicate efforts and missed opportunities"
        },
        {
          icon: Users,
          title: "Resource Allocation Gaps",
          description: "Unclear resource utilization and availability across the organization",
          impact: "Overcommitment and underutilization"
        },
        {
          icon: Target,
          title: "Prioritization Challenges",
          description: "Lack of unified framework for prioritizing competing initiatives",
          impact: "Strategic misalignment and delayed delivery"
        },
        {
          icon: BarChart3,
          title: "Capacity Planning Issues",
          description: "Insufficient insight into team capacity and bottlenecks",
          impact: "Unrealistic commitments and burnout"
        }
      ]
    },
  },
  {
    id: "solution",
    title: "Proposed Solution",
    subtitle: "Integrated Capacity Management Framework",
    type: "solution",
    content: {
      description: "A comprehensive framework that provides unified visibility, strategic resource allocation, and data-driven decision making across all technology initiatives.",
      components: [
        {
          icon: Eye,
          title: "Consolidated Scope Dashboard",
          description: "Single view of all technology initiatives, dependencies, and progress",
          features: ["Real-time initiative tracking", "Dependency visualization", "Progress monitoring"]
        },
        {
          icon: Users,
          title: "Resource Allocation Engine",
          description: "Intelligent resource planning and allocation across teams and projects",
          features: ["Skill-based matching", "Capacity optimization", "Conflict resolution"]
        },
        {
          icon: Target,
          title: "Strategic Prioritization Matrix",
          description: "Framework for evaluating and prioritizing initiatives based on strategic value",
          features: ["Multi-criteria scoring", "Strategic alignment", "Risk assessment"]
        },
        {
          icon: BarChart3,
          title: "Capacity Planning Tools",
          description: "Advanced analytics for capacity forecasting and bottleneck identification",
          features: ["Predictive analytics", "Scenario planning", "Bottleneck analysis"]
        }
      ]
    },
  },
  {
    id: "benefits",
    title: "Key Benefits",
    subtitle: "Transformational Impact on Technology Delivery",
    type: "benefits",
    content: {
      benefits: [
        {
          icon: Eye,
          title: "Complete Visibility",
          description: "100% transparency into all technology initiatives and dependencies",
          metrics: "Eliminates blind spots"
        },
        {
          icon: Zap,
          title: "Optimized Resources",
          description: "25-40% improvement in resource utilization through intelligent allocation",
          metrics: "Higher productivity"
        },
        {
          icon: Target,
          title: "Strategic Alignment",
          description: "Ensures all technology investments support business priorities",
          metrics: "Better ROI"
        },
        {
          icon: TrendingUp,
          title: "Faster Delivery",
          description: "Reduced time-to-market through better coordination and planning",
          metrics: "Accelerated outcomes"
        },
        {
          icon: Shield,
          title: "Risk Mitigation",
          description: "Early identification and resolution of capacity constraints",
          metrics: "Fewer delays"
        },
        {
          icon: CheckCircle,
          title: "Predictable Outcomes",
          description: "Data-driven decisions lead to more reliable delivery commitments",
          metrics: "Improved success rates"
        }
      ]
    },
  },
  {
    id: "implementation",
    title: "Implementation Approach",
    subtitle: "Phased Rollout for Maximum Success",
    type: "implementation",
    content: {
      description: "A structured three-phase approach ensuring smooth adoption and sustainable transformation.",
      phases: [
        {
          number: "01",
          icon: Play,
          title: "Foundation Setup",
          duration: "Weeks 1-4",
          activities: [
            "Establish scope inventory and baseline",
            "Configure initial dashboards and workflows",
            "Train core team members",
            "Pilot with select high-priority initiatives"
          ]
        },
        {
          number: "02",
          icon: TrendingUp,
          title: "Expansion & Optimization",
          duration: "Weeks 5-12",
          activities: [
            "Roll out to additional teams and departments",
            "Refine processes based on pilot feedback",
            "Implement advanced analytics and reporting",
            "Establish governance and review cycles"
          ]
        },
        {
          number: "03",
          icon: Star,
          title: "Maturity & Excellence",
          duration: "Weeks 13-24",
          activities: [
            "Achieve full organizational adoption",
            "Optimize for continuous improvement",
            "Develop predictive capabilities",
            "Establish center of excellence"
          ]
        }
      ]
    },
  }
]

export default function ScopeCapacityPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const exportSlideAsPNG = async () => {
    setIsExporting(true)
    try {
      const slideElement = document.getElementById("current-slide")
      if (!slideElement) return

      const rect = slideElement.getBoundingClientRect()

      const dataUrl = await toPng(slideElement, {
        quality: 1.0,
        pixelRatio: 2,
        width: rect.width + 10,
        height: rect.height + 10,
        backgroundColor: '#ffffff',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '5px',
          padding: '0'
        }
      })

      const link = document.createElement("a")
      link.download = `scope-capacity-slide-${currentSlide + 1}-${slides[currentSlide].id}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error exporting slide:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const slide = slides[currentSlide]

  const renderSlideContent = () => {
    switch (slide.type) {
      case "title":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-700 to-blue-500"></div>

            <div className="mb-8">
              <Target className="w-20 h-20 text-primary mx-auto mb-8" />
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              {slide.title}
            </h1>

            <p className="text-2xl lg:text-3xl text-muted-foreground max-w-5xl text-balance mb-4">
              {slide.subtitle}
            </p>

            <p className="text-lg lg:text-xl text-muted-foreground/80 italic max-w-4xl text-balance">
              {slide.tagline}
            </p>

            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
        )

      case "problem":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="mb-8 bg-red-50 rounded-lg p-6 border border-red-200">
              <p className="text-lg text-red-800 leading-relaxed">
                {slide.content?.description}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {slide.content?.challenges?.map((challenge: any, index: number) => {
                const IconComponent = challenge.icon;
                return (
                  <Card key={index} className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <div className="flex flex-col space-y-4">
                      <div className="bg-red-100 p-4 rounded-xl w-fit">
                        <IconComponent className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-red-800 mb-3">
                          {challenge.title}
                        </h3>
                        <p className="text-base text-red-700 leading-relaxed mb-4">
                          {challenge.description}
                        </p>
                        <div className="bg-red-200/50 px-4 py-2 rounded-full">
                          <span className="text-sm font-medium text-red-800">
                            ⚠ {challenge.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )

      case "solution":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="mb-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
              <p className="text-lg text-blue-800 leading-relaxed">
                {slide.content?.description}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {slide.content?.components?.map((component: any, index: number) => {
                const IconComponent = component.icon;
                return (
                  <Card key={index} className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex flex-col space-y-4">
                      <div className="bg-blue-100 p-4 rounded-xl w-fit">
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-blue-800 mb-3">
                          {component.title}
                        </h3>
                        <p className="text-base text-blue-700 leading-relaxed mb-4">
                          {component.description}
                        </p>
                        <div className="space-y-2">
                          {component.features?.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )

      case "benefits":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slide.content?.benefits?.map((benefit: any, index: number) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="bg-green-50 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="bg-green-100 p-4 rounded-xl">
                        <IconComponent className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-green-700 leading-relaxed mb-3">
                          {benefit.description}
                        </p>
                        <div className="bg-green-200 px-3 py-1 rounded-full">
                          <span className="text-xs font-medium text-green-800">
                            {benefit.metrics}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )

      case "implementation":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="mb-8 bg-primary/5 rounded-lg p-6 border border-primary/20">
              <p className="text-lg text-foreground leading-relaxed">
                {slide.content?.description}
              </p>
            </div>

            <div className="flex-1 space-y-6">
              {slide.content?.phases?.map((phase: any, index: number) => {
                const IconComponent = phase.icon;
                return (
                  <Card key={index} className="p-6 bg-white border border-gray-200">
                    <div className="flex items-start gap-6">
                      <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                        {phase.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent className="w-6 h-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">{phase.title}</h3>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                            {phase.duration}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {phase.activities?.map((activity: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-screen flex flex-col">
        <div className="flex-1 p-12">
          <div id="current-slide" className="w-full h-full max-w-7xl mx-auto bg-background">
            {renderSlideContent()}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-muted/30 border-t border-border">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportSlideAsPNG}
              disabled={isExporting}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export PNG"}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 bg-transparent"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute top-6 right-6 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  )
}
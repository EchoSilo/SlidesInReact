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
  AlertTriangle,
  TrendingUp,
  Download,
} from "lucide-react"
import html2canvas from "html2canvas"

const slides = [
  {
    id: "title",
    title: "Scope & Capacity Planning",
    subtitle: "Transforming Technology Delivery Through Strategic Resource Management",
    type: "title",
  },
  {
    id: "problem",
    title: "The Challenge We Face",
    subtitle: "Why Scope Consolidation is Critical",
    type: "content",
    content: {
      points: [
        "Fragmented roadmaps across multiple teams and products",
        "No consolidated view of organizational scope and priorities",
        "CTO lacks visibility into true capacity and resource allocation",
        "Competing initiatives without clear prioritization framework",
        "Resource conflicts discovered too late in the planning cycle",
      ],
      visual: "problem",
    },
  },
  {
    id: "solution",
    title: "Our Strategic Approach",
    subtitle: "Consolidated Scope Management Framework",
    type: "content",
    content: {
      points: [
        "Single consolidated scope spreadsheet for all initiatives",
        "Standardized scope items with clear definitions and ownership",
        "Resource allocation mapping with percentage-based time tracking",
        "Month-by-month capacity planning and demand forecasting",
        "Cross-team dependency identification and management",
      ],
      visual: "solution",
    },
  },
  {
    id: "process",
    title: "Implementation Process",
    subtitle: "From Fragmentation to Clarity",
    type: "process",
    content: {
      steps: [
        { title: "Scope Consolidation", desc: "Gather all initiatives and scope items into unified view" },
        { title: "Resource Mapping", desc: "Assign people and teams to specific scope items" },
        { title: "Time Allocation", desc: "Define percentage-based monthly time commitments" },
        { title: "Capacity Analysis", desc: "Identify bottlenecks and resource conflicts" },
        { title: "Demand Planning", desc: "Forecast future capacity needs and team scaling" },
      ],
    },
  },
  {
    id: "benefits",
    title: "Strategic Advantages",
    subtitle: "What This Approach Delivers",
    type: "content",
    content: {
      points: [
        "Complete visibility into organizational capacity and utilization",
        "Data-driven decision making for resource allocation",
        "Early identification of capacity constraints and bottlenecks",
        "Improved cross-team coordination and dependency management",
        "Strategic planning capability with predictable delivery timelines",
      ],
      visual: "benefits",
    },
  },
  {
    id: "next-steps",
    title: "Next Steps",
    subtitle: "Moving Forward Together",
    type: "action",
    content: {
      actions: [
        "Conduct scope consolidation workshop with key stakeholders",
        "Implement standardized tracking framework across teams",
        "Establish monthly capacity planning review cycles",
        "Deploy resource allocation dashboard for real-time visibility",
      ],
    },
  },
]

export default function Presentation() {
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

      const canvas = await html2canvas(slideElement, {
        width: 1920,
        height: 1080,
        scale: 1,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      })

      const link = document.createElement("a")
      link.download = `slide-${currentSlide + 1}-${slide.id}.png`
      link.href = canvas.toDataURL("image/png")
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
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-8">
              <Target className="w-16 h-16 text-primary mx-auto mb-6" />
            </div>
            <h1 className="text-6xl font-bold text-foreground mb-6 text-balance">{slide.title}</h1>
            <p className="text-2xl text-muted-foreground max-w-4xl text-balance">{slide.subtitle}</p>
          </div>
        )

      case "content":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {slide.content?.points?.map((point, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-lg leading-relaxed text-foreground">{point}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center">
                {slide.content?.visual === "problem" && (
                  <div className="relative">
                    <AlertTriangle className="w-32 h-32 text-destructive" />
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                      <span className="text-destructive-foreground font-bold">!</span>
                    </div>
                  </div>
                )}
                {slide.content?.visual === "solution" && (
                  <div className="relative">
                    <BarChart3 className="w-32 h-32 text-primary" />
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                )}
                {slide.content?.visual === "benefits" && (
                  <div className="relative">
                    <TrendingUp className="w-32 h-32 text-secondary" />
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-secondary-foreground font-bold">+</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "process":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1 flex items-center">
              <div className="grid grid-cols-5 gap-6 w-full">
                {slide.content?.steps?.map((step, index) => (
                  <div key={index} className="text-center">
                    <Card className="p-6 h-32 flex flex-col justify-center mb-4 bg-card border-border">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-sm text-card-foreground text-balance">{step.title}</h3>
                    </Card>
                    <p className="text-xs text-muted-foreground text-balance leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "action":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-3xl space-y-8">
                {slide.content?.actions?.map((action, index) => (
                  <Card key={index} className="p-6 bg-card border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-lg text-card-foreground text-balance">{action}</p>
                    </div>
                  </Card>
                ))}

                <div className="text-center pt-8">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Let's Begin Implementation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Slide Container - 16:9 Aspect Ratio */}
      <div className="w-full h-screen flex flex-col">
        {/* Main Slide Area */}
        <div className="flex-1 p-12">
          <div id="current-slide" className="w-full h-full max-w-7xl mx-auto bg-background">
            {renderSlideContent()}
          </div>
        </div>

        {/* Navigation Controls */}
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

          {/* Slide Indicators */}
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

        {/* Slide Counter */}
        <div className="absolute top-6 right-6 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  )
}

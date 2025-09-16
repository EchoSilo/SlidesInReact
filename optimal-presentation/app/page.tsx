"use client"

import Link from "next/link"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Target,
  Rocket,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Building2,
  ArrowRight,
  Download,
  FileDown,
  FileImage,
  FileText
} from "lucide-react"

const presentations = [
  {
    id: "scope-capacity",
    title: "Scope & Capacity Management Framework",
    subtitle: "Unified Visibility & Strategic Resource Allocation",
    description: "Complete framework for technology capacity management with consolidated scope visibility, resource allocation, and strategic planning tools.",
    route: "/scope-capacity",
    icon: Target,
    color: "blue",
    features: [
      "Consolidated scope dashboard and visibility",
      "Resource allocation engine and optimization",
      "Strategic prioritization matrix",
      "Capacity planning and bottleneck analysis",
      "Phased implementation approach"
    ],
    audience: "CTO, Engineering Leaders, Program Managers",
    duration: "~5 slides",
    status: "Core Framework"
  },
  {
    id: "capacity",
    title: "Consolidated Scope & Capacity Management",
    subtitle: "Transforming Technology Delivery Through Strategic Resource Management",
    description: "Comprehensive framework for managing technology initiatives, resource allocation, and capacity planning across your organization.",
    route: "/capacity",
    icon: BarChart3,
    color: "indigo",
    features: [
      "Complete scope visibility across all teams",
      "Resource allocation optimization",
      "Capacity planning and bottleneck analysis",
      "Prioritization frameworks",
      "Implementation roadmaps"
    ],
    audience: "CTO, Engineering Leaders, Program Managers",
    duration: "~18 slides",
    status: "Framework Implementation"
  },
  {
    id: "opmodel",
    title: "Technology Program Management Operating Model",
    subtitle: "Lightweight Framework for Small Financial Services Organizations",
    description: "Strategic operating model designed specifically for financial services organizations to accelerate delivery through better coordination.",
    route: "/opmodel",
    icon: Building2,
    color: "green",
    features: [
      "Tailored for financial services context",
      "Lightweight governance structure",
      "Cross-functional coordination models",
      "Risk and compliance integration",
      "Scalable delivery processes"
    ],
    audience: "Senior Leadership, Operations Teams",
    duration: "~15 slides",
    status: "Operating Model Design"
  },
  {
    id: "extension",
    title: "Accelerating Your Transformation Journey",
    subtitle: "Implementation Partnership Proposal",
    description: "Contract extension proposal outlining the path from framework development to successful organizational transformation.",
    route: "/extension",
    icon: Rocket,
    color: "purple",
    features: [
      "3-phase implementation roadmap",
      "Team expansion justification",
      "Success metrics and measurement",
      "Flexible engagement options",
      "Value proposition and outcomes"
    ],
    audience: "C-Level, Board Members, Decision Makers",
    duration: "~15 slides",
    status: "Partnership Proposal"
  }
]

export default function PresentationHub() {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPPTX = async () => {
    setIsExporting(true)
    try {
      // Placeholder for PPTX export functionality
      // In a real implementation, you would use a library like pptxgenjs
      console.log("Exporting presentations to PPTX...")

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create a dummy download (in real implementation, this would be actual PPTX)
      const link = document.createElement("a")
      link.download = "technology-transformation-presentations.pptx"
      link.href = "#" // In real implementation, this would be the PPTX blob URL

      alert("PPTX export functionality would be implemented here using libraries like pptxgenjs")
    } catch (error) {
      console.error("Error exporting to PPTX:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportPresentationToPNG = async (presentationRoute: string, presentationTitle: string) => {
    setIsExporting(true)
    try {
      // Open the presentation in a new window to capture all slides
      const presentationWindow = window.open(presentationRoute, '_blank')
      if (!presentationWindow) {
        alert('Please allow popups to export presentations')
        return
      }

      // Wait for the presentation to load
      await new Promise(resolve => setTimeout(resolve, 3000))

      // In a real implementation, you would capture all slides
      // For now, we'll simulate the process
      console.log(`Exporting ${presentationTitle} to PNG...`)

      // Close the popup window
      presentationWindow.close()

      // Simulate download
      alert(`PNG export for "${presentationTitle}" would capture all slides individually. Implementation requires slide capture functionality.`)
    } catch (error) {
      console.error("Error exporting to PNG:", error)
      alert("Error exporting presentation")
    } finally {
      setIsExporting(false)
    }
  }

  const exportPresentationToPPTX = async (presentationRoute: string, presentationTitle: string) => {
    setIsExporting(true)
    try {
      console.log(`Exporting ${presentationTitle} to PPTX...`)

      // Simulate PPTX export process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real implementation, you would use pptxgenjs or similar
      alert(`PPTX export for "${presentationTitle}" would generate a PowerPoint file. Implementation requires pptxgenjs library integration.`)
    } catch (error) {
      console.error("Error exporting to PPTX:", error)
      alert("Error exporting presentation")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Technology Transformation
          </h1>
          <h2 className="text-3xl font-semibold text-primary mb-4">
            Presentation Hub
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Comprehensive presentation suite for technology organization assessment,
            framework development, and implementation planning
          </p>

          {/* Export Actions */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={exportToPPTX}
              disabled={isExporting}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-base font-semibold flex items-center gap-3"
            >
              <FileDown className="w-5 h-5" />
              {isExporting ? "Exporting..." : "Export All to PPTX"}
            </Button>
          </div>
        </div>

        {/* Presentations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {presentations.map((presentation, index) => {
            const IconComponent = presentation.icon;
            return (
              <Card
                key={presentation.id}
                className="p-6 bg-white border-2 border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-primary/50 flex flex-col h-full"
              >
                <div className="flex flex-col h-full space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <div className="bg-primary/10 p-4 rounded-xl w-fit mx-auto mb-4">
                      <IconComponent className="w-10 h-10 text-primary" />
                    </div>

                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3 w-fit mx-auto">
                      {presentation.status}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                      {presentation.title}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3 text-center">
                      {presentation.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      {presentation.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-3 text-sm">Key Features</h4>
                    <ul className="space-y-2">
                      {presentation.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                      {presentation.features.length > 3 && (
                        <li className="text-xs text-muted-foreground italic">
                          +{presentation.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 text-center border-t pt-4">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {presentation.audience.split(',')[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {presentation.duration}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="space-y-3">
                    <Link href={presentation.route} className="block">
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        View Presentation
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-semibold flex items-center justify-center gap-1"
                        disabled={isExporting}
                        onClick={() => exportPresentationToPNG(presentation.route, presentation.title)}
                      >
                        <FileImage className="w-3 h-3" />
                        Export PNG
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-semibold flex items-center justify-center gap-1"
                        disabled={isExporting}
                        onClick={() => exportPresentationToPPTX(presentation.route, presentation.title)}
                      >
                        <FileText className="w-3 h-3" />
                        Export PPTX
                      </Button>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {index === 0 ? "5" : index === 1 ? "18" : index === 2 ? "15" : "15"}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Slides
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Complete Technology Transformation Suite
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              From initial assessment through framework development to successful implementation,
              this presentation suite provides a comprehensive view of your technology organization transformation journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-foreground">Assessment</h4>
                <p className="text-sm text-muted-foreground">Current state analysis</p>
              </div>
              <div className="space-y-2">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-foreground">Framework</h4>
                <p className="text-sm text-muted-foreground">Strategic design</p>
              </div>
              <div className="space-y-2">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-foreground">Implementation</h4>
                <p className="text-sm text-muted-foreground">Transformation execution</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
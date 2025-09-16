"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Presentation,
  Target,
  FileText,
  ArrowRight,
  ChevronRight,
  Rocket
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  const presentations = [
    {
      id: "opmodel",
      title: "Operating Model Presentation",
      description: "Comprehensive operating model framework and implementation strategy",
      icon: Presentation,
      href: "/opmodel",
      color: "blue"
    },
    {
      id: "capacity",
      title: "Capacity Management Framework",
      description: "Consolidated scope and capacity management for technology delivery",
      icon: Target,
      href: "/capacity",
      color: "green"
    },
    {
      id: "intake",
      title: "Intake Process Framework",
      description: "Strategic intake framework with smart routing and enhanced stakeholder experience",
      icon: FileText,
      href: "/intake",
      color: "purple"
    },
    {
      id: "extension",
      title: "Accelerating Your Transformation Journey",
      description: "Implementation partnership proposal for contract extension and organizational transformation",
      icon: Rocket,
      href: "/extension",
      color: "orange"
    }
  ]

  console.log('Presentations array:', presentations)
  console.log('Presentations count:', presentations.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Presentation Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access all strategic presentations from a single location. Choose a presentation below to get started.
          </p>
        </div>

        {/* Presentation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {presentations.map((presentation) => {
            const Icon = presentation.icon
            return (
              <Card
                key={presentation.id}
                className={`hover:shadow-xl transition-all duration-300 ${
                  presentation.comingSoon ? 'opacity-60' : 'hover:-translate-y-1'
                }`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${
                    presentation.color === 'blue' ? 'bg-blue-100' :
                    presentation.color === 'green' ? 'bg-green-100' :
                    presentation.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  } flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${
                      presentation.color === 'blue' ? 'text-blue-600' :
                      presentation.color === 'green' ? 'text-green-600' :
                      presentation.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl mb-2">
                    {presentation.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {presentation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {presentation.comingSoon ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  ) : (
                    <Link href={presentation.href} className="block">
                      <Button
                        className="w-full group"
                        variant="default"
                      >
                        View Presentation
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-lg p-8 max-w-3xl mx-auto border">
            <h2 className="text-2xl font-semibold mb-4">Quick Navigation Tips</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>• Use arrow keys or navigation buttons to move between slides</p>
              <p>• Click slide indicators to jump to specific slides</p>
              <p>• Export slides as PNG images using the export button</p>
              <p>• Press ESC to return to the presentation hub</p>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="fixed bottom-4 right-4 bg-card rounded-lg shadow-lg p-3 border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}
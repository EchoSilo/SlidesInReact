"use client"

import { useState, useEffect } from "react"
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
  Award,
  MapPin,
  Compass,
  Map,
  Route,
} from "lucide-react"
import { toPng } from 'html-to-image'
import JSZip from 'jszip'

const slides = [
  {
    id: "title",
    title: "Extending Our Partnership",
    subtitle: "From Framework to Execution",
    tagline: "Implementation Proposal",
    type: "title",
  },
  {
    id: "phase-complete",
    title: "Phase 1 Complete",
    subtitle: "Assessment & Framework Development",
    type: "phase-complete",
    content: {
      completed: [
        {
          icon: Eye,
          title: "Comprehensive Assessment",
          description: "Technology organization analysis, process evaluation, capability mapping"
        },
        {
          icon: Target,
          title: "Strategic Frameworks",
          description: "Operating model, capacity planning, resource allocation, prioritization methodology"
        },
        {
          icon: Map,
          title: "Implementation Roadmap",
          description: "Clear recommendations and improvement opportunities identified"
        }
      ],
      transition: "The frameworks are ready. Now it's time to make them operational."
    },
  },
  {
    id: "implementation-choice",
    title: "The Implementation Reality",
    subtitle: "You Now Face a Choice",
    type: "implementation-choice",
    content: {
      paths: [
        {
          title: "Self-Implementation Path",
          timeline: "18-24 months",
          challenges: [
            "Internal resource constraints",
            "Competing priorities",
            "Adoption resistance",
            "Knowledge gaps"
          ],
          icon: Clock
        },
        {
          title: "Guided Implementation Path",
          timeline: "6-12 months",
          advantages: [
            "Dedicated expertise",
            "Proven methodology",
            "Risk mitigation",
            "Accelerated adoption"
          ],
          icon: Rocket
        }
      ]
    },
  },
  {
    id: "engagement-comparison",
    title: "Engagement Options",
    subtitle: "What You Get at Each Stage",
    type: "comparison-table",
    content: {
      options: [
        {
          duration: "2 Months",
          status: "Completed ✓",
          deliverables: [
            "Organizational assessment",
            "Framework development",
            "Strategic recommendations",
            "Implementation roadmap"
          ],
          outcome: "Foundation built"
        },
        {
          duration: "+4 Months (6 total)",
          status: "Option 1",
          deliverables: [
            "Pilot implementation",
            "Process refinement",
            "Team expansion",
            "Knowledge transfer"
          ],
          outcome: "Operational frameworks"
        },
        {
          duration: "+10 Months (12 total)",
          status: "Option 2",
          deliverables: [
            "Full organizational rollout",
            "Embedded capabilities",
            "Self-sustaining operations",
            "Continuous improvement"
          ],
          outcome: "Transformed organization"
        }
      ]
    },
  },
  {
    id: "implementation-approach",
    title: "Our Implementation Approach",
    subtitle: "Three Phases to Operational Excellence",
    type: "approach",
    content: {
      phases: [
        {
          number: "1",
          title: "Foundation",
          duration: "Months 1-3",
          focus: "Pilot teams, early wins, baseline metrics",
          icon: Play
        },
        {
          number: "2",
          title: "Expansion",
          duration: "Months 4-6",
          focus: "Scale to multiple teams, refine processes",
          icon: TrendingUp
        },
        {
          number: "3",
          title: "Embedding",
          duration: "Months 7-12",
          focus: "Organization-wide adoption, self-sufficiency",
          icon: Building2
        }
      ]
    },
  },
  {
    id: "success-outcomes",
    title: "What Success Looks Like",
    subtitle: "Organizational Capabilities You'll Gain",
    type: "outcomes",
    content: {
      capabilities: [
        {
          icon: Eye,
          title: "Complete Visibility",
          description: "All initiatives, dependencies, and capacity in one view"
        },
        {
          icon: Target,
          title: "Strategic Alignment",
          description: "Technology investments directly tied to business priorities"
        },
        {
          icon: Shield,
          title: "Predictable Delivery",
          description: "Consistent execution with clear accountability"
        },
        {
          icon: TrendingUp,
          title: "Continuous Improvement",
          description: "Self-sustaining optimization processes"
        }
      ]
    },
  },
  {
    id: "next-steps",
    title: "Recommended Next Steps",
    subtitle: "Moving from Framework to Execution",
    type: "next-steps",
    content: {
      decision: "Select your engagement model based on organizational readiness and desired timeline",
      steps: [
        {
          number: "1",
          title: "Confirm Engagement Model",
          description: "6-month or 12-month partnership",
          icon: Calendar
        },
        {
          number: "2",
          title: "Identify Pilot Teams",
          description: "Select initial implementation targets",
          icon: Users
        },
        {
          number: "3",
          title: "Begin Implementation",
          description: "Start within 2 weeks to maintain momentum",
          icon: Rocket
        }
      ],
      cta: "Let's operationalize your frameworks."
    },
  },
]

export default function ExtensionPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [pptxReady, setPptxReady] = useState(false)

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
      link.download = `extension-slide-${currentSlide + 1}-${slides[currentSlide].id}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error exporting slide:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAllSlidesAsPNG = async () => {
    setIsExporting(true)
    try {
      const slideElement = document.getElementById("current-slide")
      if (!slideElement) return

      const zip = new JSZip()
      const originalSlide = currentSlide

      for (let i = 0; i < slides.length; i++) {
        setCurrentSlide(i)
        await new Promise(resolve => setTimeout(resolve, 300))

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

        // Convert data URL to blob and add to ZIP
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        zip.file(`extension-slide-${i + 1}-${slides[i].id}.png`, blob)
      }

      // Restore original slide
      setCurrentSlide(originalSlide)

      // Generate ZIP file and download
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement("a")
      link.download = "extension-slides.zip"
      link.href = URL.createObjectURL(zipBlob)
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("Error exporting all slides:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAllSlidesAsPPTX = async () => {
    setIsExporting(true)
    console.log('🚀 Starting PPTX export process...')
    console.log('📊 Total slides to export:', slides.length)

    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        throw new Error('PPTX export only works on the client side')
      }

      console.log('📦 Importing pptxgenjs library...')
      const pptxModule = await import('pptxgenjs')
      const PptxGenJS = pptxModule.default
      console.log('✅ pptxgenjs library imported successfully')

      console.log('🏗️ Creating new PPTX presentation...')
      const pptx = new PptxGenJS()

      pptx.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 })
      pptx.layout = 'LAYOUT_16x9'
      console.log('📐 Layout configured: 16:9 aspect ratio')

      // Process all slides without changing the current slide view
      console.log('🔄 Processing slides...')
      for (let i = 0; i < slides.length; i++) {
        console.log(`📄 Processing slide ${i + 1}/${slides.length}: ${slides[i].id} (${slides[i].type})`)

        try {
          const slide = pptx.addSlide()
          const currentSlideData = slides[i]
          console.log(`  ✅ Slide ${i + 1} created successfully`)

          // Add slide content based on slide type
          if (currentSlideData.type === "title") {
            console.log(`  📝 Adding title slide content...`)
            slide.addText(currentSlideData.title, {
              x: 0.5, y: 2, w: 9, h: 1.5,
              fontSize: 44, bold: true, align: 'center',
              color: '363636'
            })
            slide.addText(currentSlideData.subtitle, {
              x: 0.5, y: 3.5, w: 9, h: 0.8,
              fontSize: 24, align: 'center',
              color: '666666'
            })
            if (currentSlideData.tagline) {
              slide.addText(currentSlideData.tagline, {
                x: 0.5, y: 4.3, w: 9, h: 0.6,
                fontSize: 18, italic: true, align: 'center',
                color: '888888'
              })
            }
          } else {
            console.log(`  📝 Adding ${currentSlideData.type} slide content...`)
            // Add title and subtitle for all slides
            slide.addText(currentSlideData.title, {
              x: 0.5, y: 0.3, w: 9, h: 0.8,
              fontSize: 28, bold: true,
              color: '363636'
            })
            slide.addText(currentSlideData.subtitle, {
              x: 0.5, y: 1.1, w: 9, h: 0.6,
              fontSize: 16,
              color: '666666'
            })

            // Add content based on slide structure
            if (currentSlideData.content) {
              let yPos = 1.9
              let itemCount = 0

              // Handle description
              if (currentSlideData.content.description) {
                slide.addText(currentSlideData.content.description, {
                  x: 0.5, y: yPos, w: 9, h: 0.6,
                  fontSize: 12,
                  color: '444444'
                })
                yPos += 0.8
                itemCount++
              }

              // Handle different content structures
              const contentArrays = [
                currentSlideData.content.achievements,
                currentSlideData.content.benefits,
                currentSlideData.content.outcomes,
                currentSlideData.content.steps,
                currentSlideData.content.strengths,
                currentSlideData.content.insights,
                currentSlideData.content.objectives,
                currentSlideData.content.activities,
                currentSlideData.content.roles,
                currentSlideData.content.categories,
                currentSlideData.content.phases,
                currentSlideData.content.options
              ].filter(Boolean)

              // Process each content array
              contentArrays.forEach((items) => {
                if (items && items.length > 0) {
                  items.forEach((item: any, index: number) => {
                    if (yPos > 5) return // Don't exceed slide bounds

                    let text = ''
                    if (typeof item === 'string') {
                      text = `• ${item}`
                    } else if (item.title && item.description) {
                      text = `• ${item.title}: ${item.description}`
                    } else if (item.title) {
                      text = `• ${item.title}`
                    } else if (item.description) {
                      text = `• ${item.description}`
                    }

                    if (text) {
                      slide.addText(text, {
                        x: 0.5, y: yPos, w: 9, h: 0.3,
                        fontSize: 11,
                        color: '444444'
                      })
                      yPos += 0.35
                      itemCount++
                    }
                  })
                }
              })

              // Handle special content types
              if (currentSlideData.content.question) {
                slide.addText(`"${currentSlideData.content.question}"`, {
                  x: 0.5, y: yPos, w: 9, h: 0.8,
                  fontSize: 14, italic: true,
                  color: '2563EB'
                })
                yPos += 1
                itemCount++
              }

              if (currentSlideData.content.vision) {
                slide.addText(currentSlideData.content.vision, {
                  x: 0.5, y: yPos, w: 9, h: 1,
                  fontSize: 12, italic: true,
                  color: '444444'
                })
                yPos += 1.2
                itemCount++
              }

              if (currentSlideData.content.reality) {
                slide.addText(currentSlideData.content.reality, {
                  x: 0.5, y: yPos, w: 9, h: 0.8,
                  fontSize: 12,
                  color: '444444'
                })
                itemCount++
              }

              if (currentSlideData.content.closing) {
                slide.addText(currentSlideData.content.closing, {
                  x: 0.5, y: yPos, w: 9, h: 1,
                  fontSize: 12, italic: true,
                  color: '444444'
                })
                itemCount++
              }

              if (currentSlideData.content.cta) {
                slide.addText(currentSlideData.content.cta, {
                  x: 0.5, y: yPos + 1.2, w: 9, h: 0.6,
                  fontSize: 16, bold: true, align: 'center',
                  color: '2563EB'
                })
                itemCount++
              }

              console.log(`    📋 Added ${itemCount} content items to slide ${i + 1}`)
            }
          }
          console.log(`  ✅ Slide ${i + 1} content added successfully`)
        } catch (slideError) {
          console.error(`❌ Error processing slide ${i + 1}:`, slideError)
          throw slideError
        }
      }

      console.log('🎯 All slides processed successfully!')
      console.log('💾 Generating PPTX file...')

      // Generate and download the PPTX file
      await pptx.writeFile({
        fileName: "Extension-Implementation-Partnership"
      })

      console.log('🎉 PPTX export completed successfully!')
      alert(`Successfully exported ${slides.length} slides to PPTX!`)

    } catch (error) {
      console.error("❌ Error exporting to PPTX:", error)
      alert(`Error exporting to PPTX: ${error.message}. Check console for details.`)
    } finally {
      setIsExporting(false)
      console.log('🏁 Export process finished')
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
              <Rocket className="w-20 h-20 text-primary mx-auto mb-8" />
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              {slide.title}
            </h1>

            <p className="text-2xl lg:text-3xl text-muted-foreground max-w-5xl text-balance mb-4">
              {slide.subtitle}
            </p>

            <p className="text-lg lg:text-xl text-muted-foreground/80 italic max-w-3xl text-balance">
              {slide.tagline}
            </p>

            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
        )

      case "phase-complete":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">{slide.title}</h1>
              <p className="text-xl text-muted-foreground">{slide.subtitle}</p>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {slide.content?.completed?.map((item: any, index: number) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={index} className="p-6 bg-white border-2 border-gray-200">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="bg-green-100 p-4 rounded-xl">
                          <IconComponent className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-auto p-8 bg-primary/5 border-l-4 border-primary rounded-lg">
                <p className="text-xl font-semibold text-foreground text-center">
                  {slide.content?.transition}
                </p>
              </div>
            </div>
          </div>
        )

      case "implementation-choice":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">{slide.title}</h1>
              <p className="text-xl text-muted-foreground">{slide.subtitle}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              {slide.content?.paths?.map((path: any, index: number) => {
                const IconComponent = path.icon;
                const items = path.challenges || path.advantages;
                const isGuided = index === 1;
                return (
                  <Card key={index} className={`p-8 ${isGuided ? 'border-2 border-primary bg-primary/5' : 'border border-gray-300 bg-gray-50'}`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-xl ${isGuided ? 'bg-primary/20' : 'bg-gray-200'}`}>
                          <IconComponent className={`w-8 h-8 ${isGuided ? 'text-primary' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-foreground">{path.title}</h3>
                          <p className="text-lg text-muted-foreground">{path.timeline}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {items?.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${isGuided ? 'bg-primary' : 'bg-gray-400'}`} />
                            <span className="text-base text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )

      case "comparison-table":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">{slide.title}</h1>
              <p className="text-xl text-muted-foreground">{slide.subtitle}</p>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-3 gap-6 h-full">
                {slide.content?.options?.map((option: any, index: number) => {
                  const isCompleted = index === 0;
                  const isRecommended = index === 2;
                  return (
                    <Card key={index} className={`p-6 flex flex-col ${
                      isCompleted ? 'bg-green-50 border-2 border-green-500' :
                      isRecommended ? 'bg-primary/5 border-2 border-primary' :
                      'bg-white border border-gray-300'
                    }`}>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-foreground">{option.duration}</h3>
                          {isRecommended && <Star className="w-6 h-6 text-primary" />}
                        </div>
                        <p className={`text-sm font-semibold ${
                          isCompleted ? 'text-green-600' : 'text-muted-foreground'
                        }`}>{option.status}</p>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-3">Deliverables:</h4>
                        <ul className="space-y-2">
                          {option.deliverables?.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                isCompleted ? 'text-green-600' : 'text-primary'
                              }`} />
                              <span className="text-sm text-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-semibold text-foreground">Outcome:</p>
                        <p className="text-lg font-bold text-primary">{option.outcome}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )

      case "approach":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">{slide.title}</h1>
              <p className="text-xl text-muted-foreground">{slide.subtitle}</p>
            </div>

            <div className="flex-1 flex items-center">
              <div className="grid grid-cols-3 gap-8 w-full">
                {slide.content?.phases?.map((phase: any, index: number) => {
                  const IconComponent = phase.icon;
                  return (
                    <div key={index} className="relative">
                      <Card className="p-8 h-full bg-white border-2 border-gray-200 hover:border-primary transition-colors">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                            {phase.number}
                          </div>
                          <IconComponent className="w-10 h-10 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">{phase.title}</h3>
                          <p className="text-sm text-muted-foreground">{phase.duration}</p>
                          <div className="pt-4 border-t w-full">
                            <p className="text-base text-foreground">{phase.focus}</p>
                          </div>
                        </div>
                      </Card>
                      {index < 2 && (
                        <ArrowRight className="absolute top-1/2 -right-4 w-8 h-8 text-primary/50 transform -translate-y-1/2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )

      case "outcomes":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">{slide.title}</h1>
              <p className="text-xl text-muted-foreground">{slide.subtitle}</p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              {slide.content?.capabilities?.map((capability: any, index: number) => {
                const IconComponent = capability.icon;
                return (
                  <Card key={index} className="p-8 bg-white border-2 border-gray-200 hover:border-primary transition-colors">
                    <div className="flex items-start gap-6">
                      <div className="bg-primary/10 p-4 rounded-xl flex-shrink-0">
                        <IconComponent className="w-10 h-10 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-foreground mb-3">
                          {capability.title}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {capability.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )


      case "next-steps":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">{slide.title}</h1>
              <p className="text-xl text-muted-foreground">{slide.subtitle}</p>
            </div>

            {slide.content?.decision && (
              <div className="mb-8 p-6 bg-primary/5 border-l-4 border-primary rounded-lg">
                <p className="text-lg font-semibold text-foreground">
                  {slide.content.decision}
                </p>
              </div>
            )}

            <div className="flex-1 grid grid-cols-3 gap-6 mb-8">
              {slide.content?.steps?.map((step: any, index: number) => {
                const IconComponent = step.icon;
                return (
                  <Card key={index} className="p-6 bg-white border-2 border-gray-200 hover:border-primary transition-colors">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
                        {step.number}
                      </div>
                      <IconComponent className="w-10 h-10 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="text-center p-8 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg">
              <h2 className="text-3xl font-bold">{slide.content?.cta}</h2>
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

            <Button
              variant="outline"
              size="sm"
              onClick={exportAllSlidesAsPNG}
              disabled={isExporting}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Creating ZIP..." : "Export ZIP"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportAllSlidesAsPPTX}
              disabled={isExporting}
              className="flex items-center gap-2 bg-transparent"
            >
              <FileText className="w-4 h-4" />
              {isExporting ? "Exporting PPTX..." : "Export PPTX"}
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
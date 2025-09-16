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
  Users,
  Calendar,
  Building,
  Eye,
  Zap,
  Shield,
  Lightbulb,
  ArrowUp,
  DollarSign,
  Database,
  Users2,
  Network,
  Clock,
  FileText,
  Layers,
  Settings,
  Play,
} from "lucide-react"
import { toPng } from 'html-to-image'
import JSZip from 'jszip'

const slides = [
  {
    id: "title",
    title: "Consolidated Scope & Capacity Management",
    subtitle: "Transforming Technology Delivery Through Strategic Resource Management",
    tagline: "Bringing Visibility and Control to Technology Delivery",
    type: "title",
  },
  {
    id: "challenge",
    title: "The Current Challenge",
    subtitle: "What We Discovered Through Organizational Analysis",
    type: "challenge",
    content: {
      metrics: [
        { number: "~140", label: "Total Technology Staff", icon: Users, color: "blue" },
        { number: "~24", label: "Executing Developers", icon: Building, color: "orange" },
        { number: "~8", label: "Delivery Squads", icon: Target, color: "green" },
        { number: "~15", label: "Active Initiatives", icon: Calendar, color: "red" },
      ],
      problems: [
        {
          icon: AlertTriangle,
          title: "Fragmented Roadmaps",
          description: "Every squad creates independent roadmaps with no consolidated view for CTO leadership",
        },
        {
          icon: Users,
          title: "Resource Allocation Blindness", 
          description: "No visibility into true capacity utilization across teams and initiatives",
        },
        {
          icon: Building,
          title: "Organizational Silos",
          description: "DevOps and Data teams becoming bottlenecks due to unclear cross-team demand",
        },
        {
          icon: Calendar,
          title: "Reactive Planning",
          description: "Teams struggling to balance BAU work with strategic initiatives like CRD and Cloud Migration",
        },
      ],
    },
  },
  {
    id: "why-matters",
    title: "Why Consolidated Scope Management?",
    subtitle: "The Foundation for Strategic Technology Leadership",
    type: "strategic",
    content: {
      benefits: [
        {
          icon: Eye,
          title: "Complete Visibility",
          description: "See ALL technology initiatives in one place",
          impact: "100% scope transparency"
        },
        {
          icon: Zap,
          title: "Resource Optimization", 
          description: "Identify over/under allocation across teams",
          impact: "20-30% efficiency gain"
        },
        {
          icon: Shield,
          title: "Risk Mitigation",
          description: "Track cross-team dependencies and bottlenecks",
          impact: "Proactive issue resolution"
        },
        {
          icon: Target,
          title: "Strategic Alignment",
          description: "Ensure resources align with business priorities",
          impact: "Enhanced ROI delivery"
        },
        {
          icon: Lightbulb,
          title: "Proactive Planning",
          description: "Forecast capacity needs before crises emerge",
          impact: "Data-driven decisions"
        },
        {
          icon: ArrowUp,
          title: "Delivery Excellence",
          description: "Move from reactive firefighting to strategic execution",
          impact: "Predictable outcomes"
        },
      ],
    },
  },
  {
    id: "solution-approach",
    title: "Three-Phase Solution Framework",
    subtitle: "From Fragmentation to Strategic Clarity",
    type: "process",
    content: {
      steps: [
        { 
          number: "01",
          icon: Database,
          title: "Scope Consolidation", 
          desc: "Catalog ALL initiatives across teams",
          details: ["Current work items", "Planned initiatives", "Future roadmap", "Dependencies"]
        },
        { 
          number: "02",
          icon: Users2,
          title: "Resource Mapping", 
          desc: "Assign people and allocations",
          details: ["Team assignments", "Individual capacity", "Skill requirements", "Cross-team needs"]
        },
        { 
          number: "03",
          icon: BarChart3,
          title: "Capacity Analysis", 
          desc: "Calculate utilization and identify gaps",
          details: ["Monthly allocations", "Bottleneck analysis", "Demand forecasting", "Optimization opportunities"]
        },
      ],
    },
  },
  {
    id: "scope-consolidation",
    title: "Phase 1: Consolidated Scope Spreadsheet",
    subtitle: "Single Source of Truth for All Technology Work",
    type: "detailed",
    content: {
      description: "Create a comprehensive registry of every initiative across the technology organization",
      table: {
        headers: ["Initiative ID", "Name", "Squad", "Type", "Priority", "Status", "Timeline", "Dependencies"],
        rows: [
          ["CRD-001", "CRD Cloud Migration", "Trading", "Strategic", "Critical", "Active", "Q2-Q4 2025", "Data, DevOps"],
          ["MOD-002", "Casper Modernization", "Equity PM", "Strategic", "High", "Planning", "Q1-Q3 2025", "DevOps"],
          ["BAU-003", "Compliance Updates", "Compliance", "BAU", "Medium", "Ongoing", "Continuous", "None"],
          ["CLD-004", "AWS Migration", "DevOps", "Strategic", "Critical", "Active", "Q1-Q4 2025", "All Squads"],
          ["DAT-005", "GDAP Implementation", "Data", "Strategic", "High", "Planning", "Q2-Q3 2025", "Trading, DevOps"]
        ]
      },
      benefits: [
        "Complete visibility for CTO and leadership team",
        "Clear prioritization framework aligned with business objectives",
        "Dependency tracking prevents bottlenecks",
        "Strategic vs tactical work distinction"
      ]
    },
  },
  {
    id: "resource-mapping",
    title: "Phase 2: Resource Allocation Matrix",
    subtitle: "Mapping People to Initiatives with Capacity Planning",
    type: "allocation",
    content: {
      description: "Define percentage-based time allocations across initiatives by quarter",
      allocations: [
        {
          resource: "Senior Dev A",
          squad: "Trading",
          quarters: {
            "Q1 2025": "CRD: 80%, BAU: 20%",
            "Q2 2025": "CRD: 60%, Cloud: 40%", 
            "Q3 2025": "Cloud: 100%",
            "Q4 2025": "Cloud: 80%, BAU: 20%"
          }
        },
        {
          resource: "PM Lead B",
          squad: "Equity PM",
          quarters: {
            "Q1 2025": "Casper: 100%",
            "Q2 2025": "Casper: 70%, CRD: 30%",
            "Q3 2025": "Cloud: 50%, BAU: 50%",
            "Q4 2025": "Cloud: 100%"
          }
        },
        {
          resource: "Data Eng C",
          squad: "Data",
          quarters: {
            "Q1 2025": "CRD: 40%, GDAP: 60%",
            "Q2 2025": "GDAP: 80%, BAU: 20%",
            "Q3 2025": "Cloud: 100%",
            "Q4 2025": "Cloud: 100%"
          }
        }
      ],
      insights: [
        { type: "over", label: "Over-allocated (>100%)", color: "red" },
        { type: "optimal", label: "Optimal (80-100%)", color: "green" },
        { type: "under", label: "Under-utilized (<80%)", color: "blue" }
      ]
    },
  },
  {
    id: "capacity-analysis",
    title: "Phase 3: Capacity Dashboard & Analytics",
    subtitle: "Real-time Visibility into Team Utilization and Bottlenecks",
    type: "dashboard",
    content: {
      metrics: [
        { label: "Total Initiatives", value: "47", trend: "↑", color: "blue" },
        { label: "Active Resources", value: "24", trend: "→", color: "green" },
        { label: "Avg Utilization", value: "118%", trend: "⚠", color: "orange" },
        { label: "Dependencies", value: "23", trend: "↑", color: "purple" }
      ],
      squadAnalysis: [
        { squad: "Trading", capacity: 110, color: "blue" },
        { squad: "Equity PM", capacity: 105, color: "green" },
        { squad: "Compliance", capacity: 78, color: "orange" },
        { squad: "Data", capacity: 140, color: "red" }
      ],
      insights: [
        "Data team at 140% capacity - critical bottleneck requiring immediate attention",
        "Trading and Equity PM squads slightly over-allocated for Q2 planning",
        "23 cross-team dependencies creating coordination complexity",
        "Need 3-4 additional developers for cloud migration timeline"
      ]
    },
  },
  {
    id: "capacity-management-actions",
    title: "Capacity Management Action Plan",
    subtitle: "Identifying Issues and Taking Strategic Action",
    type: "capacity-actions",
    content: {
      description: "Transform capacity insights into actionable management decisions",
      issues: [
        "Over-allocated resources (>100%)",
        "Under-utilized resources (<70%)",
        "Skills gaps and bottlenecks",
        "Conflicting resource demands",
        "Unbalanced team workloads"
      ],
      actions: [
        "Rebalance team allocations",
        "Prioritize initiatives based on capacity",
        "Identify resource expansion needs",
        "Adjust timelines to match capacity",
        "Cross-train team members for flexibility"
      ]
    }
  },
  {
    id: "phase-1-roadmap",
    title: "Phase 1 Roadmap: Foundation Building",
    subtitle: "Weeks 1-3: Scope Discovery, Repository & Resource Mapping",
    type: "timeline",
    content: {
      phases: [
        {
          phase: "Week 1",
          duration: "1 week",
          title: "Scope Discovery",
          icon: FileText,
          activities: [
            "Interview squad leads across all teams",
            "Catalog current work in progress",
            "Identify planned initiatives and roadmaps",
            "Document dependencies and blockers"
          ]
        },
        {
          phase: "Week 2",
          duration: "1 week",
          title: "Build Repository",
          icon: Database,
          activities: [
            "Create consolidated scope spreadsheet",
            "Establish prioritization framework",
            "Implement naming conventions",
            "Build unified scope database"
          ]
        },
        {
          phase: "Week 3",
          duration: "1 week",
          title: "Resource Mapping",
          icon: Users2,
          activities: [
            "Map people to initiatives",
            "Define percentage-based allocations",
            "Document skills and capabilities",
            "Identify cross-team dependencies"
          ]
        }
      ]
    },
  },
  {
    id: "phase-2-roadmap",
    title: "Phase 2 Roadmap: Analysis & Implementation",
    subtitle: "Weeks 3-6: Capacity Analysis, Dashboard Deploy & Optimization",
    type: "timeline",
    content: {
      phases: [
        {
          phase: "Week 3-4",
          duration: "2 weeks",
          title: "Capacity Analysis",
          icon: BarChart3,
          activities: [
            "Calculate team utilization rates",
            "Identify capacity gaps and bottlenecks",
            "Analyze over/under allocation patterns",
            "Generate capacity insights report"
          ]
        },
        {
          phase: "Week 3-6",
          duration: "4 weeks",
          title: "Dashboard Deploy",
          icon: Settings,
          activities: [
            "Design Power BI dashboard mockups",
            "Build real-time capacity monitors",
            "Implement alerting for over-allocation",
            "Deploy live capacity dashboard"
          ]
        },
        {
          phase: "Ongoing",
          duration: "Continuous",
          title: "Process Optimization",
          icon: Play,
          activities: [
            "Weekly capacity reviews",
            "Quarterly strategic alignment",
            "Continuous process refinement",
            "Organizational learning integration"
          ]
        }
      ]
    },
  },
  {
    id: "prioritization-need",
    title: "The Prioritization Challenge",
    subtitle: "Turning Scope Visibility into Strategic Decision Making",
    type: "strategic",
    content: {
      description: "Once we have complete scope visibility, the critical next step is objective prioritization",
      benefits: [
        {
          icon: AlertTriangle,
          title: "The Problem",
          description: "Multiple initiatives across teams with subjective \"high/medium/low\" priorities",
          impact: "Competing for the same limited resources"
        },
        {
          icon: Target,
          title: "The Need",
          description: "Objective, data-driven framework to rank initiatives consistently",
          impact: "Clear resource allocation decisions"
        },
        {
          icon: TrendingUp,
          title: "The Opportunity",
          description: "Battle-tested prioritization that unifies value, effort, and strategic alignment",
          impact: "Maximize ROI and strategic impact"
        },
        {
          icon: Users,
          title: "The Stakeholders",
          description: "PMs, Engineering, and Leadership aligned on what gets built when",
          impact: "End the priority debates"
        },
        {
          icon: Clock,
          title: "The Timing",
          description: "Phase 1 scope discovery creates the perfect moment to implement",
          impact: "Transform fuzzy features into ranked backlog"
        },
        {
          icon: DollarSign,
          title: "The Value",
          description: "Convert subjective opinions into objective business value scores",
          impact: "Data-driven portfolio management"
        }
      ]
    }
  },
  {
    id: "prioritization-framework",
    title: "The 9+1 Question Framework",
    subtitle: "Core Components of Feature Value Scoring",
    type: "framework",
    content: {
      description: "A battle-tested approach to turn fuzzy feature value into objective prioritization scores",
      coreQuestions: [
        { category: "Revenue uplift", weight: 15, description: "Incremental revenue from new sales, conversion, ARPU, upsell" },
        { category: "Cost reduction", weight: 15, description: "Cost/time savings from hours saved, rework avoided, infrastructure" },
        { category: "Risk reduction", weight: 15, description: "Lower security/compliance/fraud/outage exposure and tail risks" },
        { category: "Customer value", weight: 15, description: "User impact depth and breadth (retention, NPS, activation)" }
      ],
      strategicQuestions: [
        { category: "Strategic alignment", weight: 10, description: "Movement on top-3 company/portfolio OKRs this quarter/half" },
        { category: "Time criticality", weight: 10, description: "Deadline/seasonality/competitor factors that make delay expensive" },
        { category: "Enabler value", weight: 8, description: "Unlocks other high-value epics or creates capability platform" },
        { category: "Data advantage", weight: 6, description: "Creates unique data, improves models, reduces uncertainty" },
        { category: "Compliance", weight: 6, description: "Legally/regulatorily required or critical to operations" }
      ],
      multipliers: [
        { name: "Longevity", range: "0.5x - 2.0x", description: "Short campaign (0.5x) to multi-year durable value (2.0x)" },
        { name: "Confidence", range: "0.5x - 1.0x", description: "Certainty in inputs based on evidence and experiments" }
      ]
    }
  },
  {
    id: "framework-scoring",
    title: "Framework Scoring Guidelines",
    subtitle: "Practical Anchoring for Consistent Prioritization",
    type: "scoring",
    content: {
      description: "Concrete thresholds and examples to make scoring objective and consistent",
      formula: "OVS = (Raw Score × Longevity × Confidence) | Priority = OVS / Effort",
      guidelines: [
        { category: "Revenue", example: "Map annual uplift: 1: <$50k, 3: $200-500k, 5: >$2M" },
        { category: "Cost", example: "Hours saved/year × fully-loaded rate via your thresholds" },
        { category: "Risk", example: "Expected loss = probability × impact scored on loss bands" },
        { category: "Customer value", example: "Reach (how many) × depth (experience improvement)" },
        { category: "Enabler", example: "Count/size of unblocked initiatives; higher if ≥2 high-OVS epics" },
        { category: "Time criticality", example: "Higher if missing window kills most value (launch, season)" },
        { category: "Compliance", example: "If mandated, schedule regardless—still score for transparency" }
      ]
    }
  },
  {
    id: "framework-implementation",
    title: "Framework Implementation Approach",
    subtitle: "Practical Steps to Objective Prioritization",
    type: "implementation",
    content: {
      description: "How to implement the 9+1 framework as an aspirational tool for better decision making",
      steps: [
        {
          phase: "1. Score Setup",
          title: "Establish Scoring Thresholds",
          icon: Settings,
          details: [
            "Define dollar thresholds for your organization (e.g., Revenue: 1=$<50k, 3=$200-500k, 5=>$2M)",
            "Create effort estimation bands (points or person-days)",
            "Customize weights to match your strategic priorities",
            "Set up Excel scorecard or integrate with Jira/ADO"
          ]
        },
        {
          phase: "2. Team Training",
          title: "Calibrate Scoring Consistency",
          icon: Users,
          details: [
            "Train PMs and stakeholders on scoring criteria",
            "Run calibration exercises with sample initiatives",
            "Establish confidence level guidelines",
            "Create quick reference guides for each category"
          ]
        },
        {
          phase: "3. Pilot Implementation",
          title: "Test with Current Initiatives",
          icon: Target,
          details: [
            "Score existing high-priority initiatives as baseline",
            "Compare framework results with current priorities",
            "Refine thresholds and weights based on results",
            "Build confidence in the methodology"
          ]
        },
        {
          phase: "4. Full Deployment",
          title: "Integrate with Planning Cycles",
          icon: Calendar,
          details: [
            "Require 9+1 scoring for all new initiatives",
            "Use OVS (Objective Value Score) for portfolio discussions",
            "Apply WSJF-like Priority = OVS/Effort for backlog ranking",
            "Review and recalibrate quarterly"
          ]
        }
      ]
    }
  },
  {
    id: "expected-outcomes",
    title: "Expected Outcomes & ROI",
    subtitle: "Measurable Impact on Technology Delivery Excellence",
    type: "outcomes",
    content: {
      outcomes: [
        { title: "Complete Visibility", metric: "Full scope transparency", desc: "Every initiative visible to leadership in real-time", icon: Eye },
        { title: "Resource Optimization", metric: "Eliminated waste", desc: "End over-allocation and identify underutilized capacity", icon: Zap },
        { title: "Faster Planning", metric: "Data-driven decisions", desc: "Resource allocation based on facts, not assumptions", icon: Clock },
        { title: "Risk Reduction", metric: "Early warning system", desc: "Proactive identification of delivery risks and bottlenecks", icon: Shield },
        { title: "Strategic Alignment", metric: "Priority-driven allocation", desc: "Resources focused on highest-value business initiatives", icon: Target },
        { title: "Delivery Predictability", metric: "Improved success rates", desc: "Better project outcomes through realistic capacity planning", icon: CheckCircle }
      ]
    },
  },
  {
    id: "next-steps",
    title: "Next Steps & Call to Action",
    subtitle: "Moving Forward with Strategic Technology Transformation",
    type: "action",
    content: {
      actions: [
        "Approve consolidated scope management approach and allocate program resources",
        "Designate dedicated program manager to lead implementation and ongoing process",
        "Commit squad leads to participate in scope discovery workshops and weekly updates",
        "Establish monthly capacity planning review cycles integrated with strategic planning"
      ]
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

      // Get the actual dimensions of the slide content
      const rect = slideElement.getBoundingClientRect()

      const dataUrl = await toPng(slideElement, {
        quality: 1.0,
        pixelRatio: 2,
        // Use actual content dimensions with 5px buffer on all sides
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
      link.download = `slide-${currentSlide + 1}-${slides[currentSlide].id}.png`
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
        zip.file(`capacity-slide-${i + 1}-${slides[i].id}.png`, blob)
      }

      // Restore original slide
      setCurrentSlide(originalSlide)

      // Generate ZIP file and download
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement("a")
      link.download = "capacity-slides.zip"
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
                currentSlideData.content.options,
                currentSlideData.content.metrics,
                currentSlideData.content.challenges,
                currentSlideData.content.impacts,
                currentSlideData.content.solutions
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
                    } else if (item.label) {
                      text = `• ${item.label}`
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
        fileName: "Capacity-Management-Framework"
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
            {/* Top accent line */}
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
            
            <p className="text-lg lg:text-xl text-muted-foreground/80 italic max-w-3xl text-balance">
              {slide.tagline}
            </p>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
        )

      case "challenge":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {slide.content?.metrics?.map((metric: any, index: number) => {
                const IconComponent = metric.icon;
                return (
                  <Card key={index} className={`p-6 text-center border-2 border-${metric.color}-200 bg-${metric.color}-50/30`}>
                    <div className="flex flex-col items-center">
                      <IconComponent className={`w-8 h-8 text-${metric.color}-600 mb-3`} />
                      <div className={`text-5xl font-bold text-${metric.color}-600 mb-2`}>
                        {metric.number}
                      </div>
                      <div className="text-base text-muted-foreground font-medium">
                        {metric.label}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Problems Section */}
            <div className="flex-1">
              <h3 className="text-3xl font-semibold text-foreground mb-6">Key Organizational Challenges</h3>
              <div className="grid grid-cols-2 gap-6">
                {slide.content?.problems?.map((problem: any, index: number) => {
                  const IconComponent = problem.icon;
                  return (
                    <div key={index} className="bg-destructive/5 p-6 rounded-xl border border-destructive/20">
                      <div className="flex items-start gap-4">
                        <div className="bg-destructive/10 p-3 rounded-lg flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-foreground mb-2">
                            {problem.title}
                          </h4>
                          <p className="text-muted-foreground text-base leading-relaxed">
                            {problem.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Impact Statement */}
            <div className="mt-8 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-center text-destructive font-medium">
                <strong>Impact:</strong> Technology delivery operating with 17% executing capacity, creating delivery risks and strategic misalignment
              </p>
            </div>
          </div>
        )

      case "strategic":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1 flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {slide.content?.benefits?.map((benefit: any, index: number) => {
                  const IconComponent = benefit.icon;
                  return (
                    <Card key={index} className="bg-primary/5 p-8 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-200 h-full">
                      <div className="flex flex-col items-center text-center space-y-6 h-full justify-between">
                        <div className="bg-primary/10 p-5 rounded-xl">
                          <IconComponent className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-3">
                            {benefit.title}
                          </h3>
                          <p className="text-base text-muted-foreground leading-relaxed mb-4">
                            {benefit.description}
                          </p>
                          <div className="bg-accent/20 px-4 py-2 rounded-full">
                            <span className="text-sm font-medium text-green-800 font-semibold">
                              {benefit.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Bottom Strategic Statement */}
            <div className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-success/5 border border-primary/20 rounded-xl">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Strategic Impact for Technology Leadership
                </h3>
                <p className="text-lg text-muted-foreground">
                  Transform from reactive management to proactive, data-driven technology strategy execution
                </p>
              </div>
            </div>
          </div>
        )

      case "process":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1 flex items-center">
              <div className="grid grid-cols-3 gap-12 w-full">
                {slide.content?.steps?.map((step: any, index: number) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={index} className="relative">
                      <Card className="p-8 h-56 flex flex-col justify-center mb-6 bg-card border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex flex-col items-center text-center space-y-6">
                          <div className="bg-primary/10 p-4 rounded-lg">
                            <IconComponent className="w-12 h-12 text-primary" />
                          </div>
                          <div className="bg-primary/10 px-4 py-2 rounded-full">
                            <span className="text-lg font-bold text-primary">{step.number}</span>
                          </div>
                          <h3 className="font-semibold text-xl text-card-foreground text-balance leading-tight">{step.title}</h3>
                        </div>
                      </Card>
                      <div className="text-center px-2">
                        <p className="text-base text-muted-foreground text-balance leading-relaxed mb-4 font-medium">{step.desc}</p>
                        <div className="space-y-2 flex flex-col items-center">
                          <div className="space-y-2">
                            {step.details?.map((detail: string, idx: number) => (
                              <div key={idx} className="flex items-center text-sm text-muted-foreground/90">
                                <div className="w-2 h-2 bg-primary/60 rounded-full mr-3 flex-shrink-0"></div>
                                <span>{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {index < 2 && (
                        <div className="absolute top-28 -right-6 text-4xl text-primary/70 font-bold">→</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )

      case "detailed":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            {/* Enhanced section with icon + structured content from MagicPatterns */}
            <div className="mb-6 bg-primary/5 rounded-lg p-6 border border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-lg text-foreground mb-3">
                    A <strong>single source of truth</strong> containing all initiatives across the technology organization:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 text-base text-muted-foreground">
                    <li>Current work in progress</li>
                    <li>Upcoming initiatives</li>
                    <li>Future planned work</li>
                    <li>Cross-team dependencies</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="overflow-x-auto mb-6 flex-1">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-blue-700 text-white">
                      {slide.content?.table?.headers?.map((header: string, idx: number) => (
                        <th key={idx} className="border border-blue-600 px-4 py-3 text-base font-semibold">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slide.content?.table?.rows?.map((row: string[], rowIdx: number) => (
                      <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-blue-50/30" : "bg-white"}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className={`border px-4 py-3 text-base text-center ${
                            cellIdx === 4 && cell === "Critical" ? "text-red-600 font-bold" :
                            cellIdx === 4 && cell === "High" ? "text-orange-600 font-bold" : ""
                          }`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="font-bold text-primary mb-3">Key Benefits:</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {slide.content?.benefits?.map((benefit: string, idx: number) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-primary mr-2 text-sm">•</span>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "allocation":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            {/* Enhanced narrative section inspired by MagicPatterns Step 2 */}
            <div className="mb-6 bg-primary/5 rounded-lg p-6 border border-primary/20">
              <h3 className="text-xl font-semibold text-primary mb-4">Mapping People to Initiatives with Capacity Planning</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                    <Users2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-foreground mb-2">
                      For each initiative in the consolidated scope, assign specific resources:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                      <li>Team members assigned to each initiative</li>
                      <li>Roles and responsibilities</li>
                      <li>Required skill sets and expertise</li>
                      <li>Primary and backup resource assignments</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-foreground mb-2">
                      Define percentage-based time allocations by quarter:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                      <li>Quarterly allocation percentages for each resource</li>
                      <li>Time tracking across multiple initiatives</li>
                      <li>Accounting for BAU work and meetings</li>
                      <li>Long-term capacity planning (6-12 months)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="overflow-x-auto mb-6 flex-1">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-green-700 text-white">
                      <th className="border px-4 py-3 text-base font-semibold">Resource</th>
                      <th className="border px-4 py-3 text-base font-semibold">Squad</th>
                      <th className="border px-4 py-3 text-base font-semibold">Q1 2025</th>
                      <th className="border px-4 py-3 text-base font-semibold">Q2 2025</th>
                      <th className="border px-4 py-3 text-base font-semibold">Q3 2025</th>
                      <th className="border px-4 py-3 text-base font-semibold">Q4 2025</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slide.content?.allocations?.map((allocation: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-green-50/30" : "bg-white"}>
                        <td className="border px-4 py-3 text-base font-semibold">{allocation.resource}</td>
                        <td className="border px-4 py-3 text-base">{allocation.squad}</td>
                        {Object.values(allocation.quarters).map((quarter: any, qIdx: number) => (
                          <td key={qIdx} className="border px-4 py-3 text-sm whitespace-pre-line text-center">{quarter}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-around items-center bg-muted/30 rounded-lg p-4">
                <h3 className="font-bold text-foreground">Capacity Indicators:</h3>
                {slide.content?.insights?.map((insight: any, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <div className={`w-4 h-4 bg-${insight.color}-500 mr-2 rounded`}></div>
                    <span className="text-base">{insight.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "dashboard":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              {slide.content?.metrics?.map((metric: any, idx: number) => (
                <Card key={idx} className={`p-4 text-center border-2 border-${metric.color}-200 bg-${metric.color}-50/30`}>
                  <div className={`text-4xl font-bold text-${metric.color}-600 mb-1`}>
                    {metric.value} <span className="text-xl">{metric.trend}</span>
                  </div>
                  <div className="text-base text-muted-foreground">{metric.label}</div>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-6 flex-1">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-bold text-lg text-foreground mb-4">Squad Capacity Analysis</h3>
                <div className="space-y-4">
                  {slide.content?.squadAnalysis?.map((squad: any, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-24 text-base font-medium">{squad.squad}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative mx-4">
                        <div 
                          className={`bg-${squad.color}-500 h-6 rounded-full flex items-center justify-end pr-2`}
                          style={{width: `${Math.min(squad.capacity, 150) / 1.5}%`}}
                        >
                          <span className="text-white text-xs font-bold drop-shadow-sm">{squad.capacity}%</span>
                        </div>
                        <div className="absolute left-2/3 top-0 h-full w-0.5 bg-gray-800"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-bold text-lg text-orange-600 mb-4">Critical Insights</h3>
                <ul className="space-y-3 text-base">
                  {slide.content?.insights?.map((insight: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )

      case "capacity-actions":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance mb-4">{slide.subtitle}</p>
              <p className="text-muted-foreground">{slide.content?.description}</p>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-8 h-full">
                {/* Capacity Issues to Identify */}
                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                  <div className="flex items-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-800">
                      Capacity Issues to Identify
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {slide.content?.issues?.map((issue: string, idx: number) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-red-700 leading-relaxed">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capacity Management Actions */}
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center mb-6">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800">
                      Capacity Management Actions
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {slide.content?.actions?.map((action: string, idx: number) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-green-700 leading-relaxed">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Statement */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-primary/20 rounded-xl">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Proactive Capacity Management
                </h3>
                <p className="text-muted-foreground">
                  Transform from reactive firefighting to strategic, data-driven capacity optimization
                </p>
              </div>
            </div>
          </div>
        )

      case "timeline":
        return (
          <div className="h-full flex flex-col">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">{slide.subtitle}</p>
            </div>

            <div className="space-y-6 flex-1">
              {slide.content?.phases?.map((phase: any, index: number) => {
                const IconComponent = phase.icon;
                return (
                  <div key={index} className="relative">
                    {index < slide.content?.phases?.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-12 bg-border"></div>
                    )}

                    <div className="flex gap-6 items-start">
                      <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1 bg-card border border-border/50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                              {phase.phase}
                            </span>
                            <h3 className="text-xl font-semibold text-foreground">
                              {phase.title}
                            </h3>
                          </div>
                          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {phase.duration}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {phase.activities?.map((activity: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <ArrowUp className="w-4 h-4 text-accent mt-0.5 shrink-0 rotate-45" />
                              <span className="text-sm text-muted-foreground">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  {slide.id === "phase-1-roadmap" ? (
                    <>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Phase 1 Foundation: 3 weeks to consolidated scope
                      </h3>
                      <p className="text-muted-foreground">
                        Establishing the data foundation for strategic capacity management
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Phase 2 Implementation: Weeks 3-6 for full deployment
                      </h3>
                      <p className="text-muted-foreground">
                        Analysis, dashboard deployment, and continuous optimization process
                      </p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {slide.id === "phase-1-roadmap" ? "3" : "3-6"}
                  </div>
                  <div className="text-sm text-muted-foreground">weeks</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "framework":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance mb-2">{slide.subtitle}</p>
              <p className="text-muted-foreground text-sm">{slide.content?.description}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Core Value Questions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  Core Value Questions (60%)
                </h3>
                <div className="space-y-2">
                  {slide.content?.coreQuestions?.map((question: any, idx: number) => (
                    <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-green-800 text-sm">{question.category}</h4>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          {question.weight}
                        </span>
                      </div>
                      <p className="text-xs text-green-700 leading-tight">{question.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Questions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Target className="w-5 h-5 text-blue-600 mr-2" />
                  Strategic Questions (40%)
                </h3>
                <div className="space-y-2">
                  {slide.content?.strategicQuestions?.map((question: any, idx: number) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-blue-800 text-sm">{question.category}</h4>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                          {question.weight}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 leading-tight">{question.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Multipliers */}
            <div className="mt-4 bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Multipliers (Applied After Scoring)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slide.content?.multipliers?.map((multiplier: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-primary/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-primary">{multiplier.name}</span>
                      <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">{multiplier.range}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">{multiplier.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center p-3 bg-white rounded-lg border border-primary/10">
                <h4 className="text-sm font-semibold text-foreground mb-1">Final Formula</h4>
                <p className="text-primary font-mono">OVS = Raw Score × Longevity × Confidence</p>
                <p className="text-muted-foreground text-xs mt-1">Priority = OVS / Effort</p>
              </div>
            </div>
          </div>
        )

      case "scoring":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance mb-4">{slide.subtitle}</p>
              <p className="text-muted-foreground">{slide.content?.description}</p>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {slide.content?.guidelines?.map((guideline: any, idx: number) => (
                  <div key={idx} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start gap-4">
                    <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-yellow-700 font-bold text-sm">0-5</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">{guideline.category}</h4>
                      <p className="text-sm text-yellow-700">{guideline.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-primary/5 to-green/5 rounded-lg p-6 border border-primary/20">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Scoring Formula
                </h3>
                <div className="bg-white p-4 rounded-lg border border-primary/10 inline-block">
                  <p className="text-primary font-mono text-xl mb-2">{slide.content?.formula}</p>
                  <p className="text-sm text-muted-foreground">Score each question 0-5, apply weights, then multiply by confidence and longevity</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "implementation":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance mb-4">{slide.subtitle}</p>
              <p className="text-muted-foreground">{slide.content?.description}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {slide.content?.steps?.map((step: any, idx: number) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="bg-card border border-border/50 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                          {step.phase}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground mt-1">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {step.details?.map((detail: string, detailIdx: number) => (
                        <div key={detailIdx} className="flex items-start gap-2">
                          <ArrowUp className="w-4 h-4 text-accent mt-0.5 shrink-0 rotate-45" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-primary/20 rounded-xl">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aspirational Implementation
                </h3>
                <p className="text-muted-foreground">
                  This framework can be customized and integrated into your existing planning processes as teams are ready
                </p>
              </div>
            </div>
          </div>
        )

      case "outcomes":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              {slide.content?.outcomes?.map((outcome: any, idx: number) => {
                const IconComponent = outcome.icon;
                return (
                  <Card key={idx} className="bg-success/5 p-6 rounded-xl border border-success/20 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="bg-success/10 p-4 rounded-xl">
                        <IconComponent className="w-8 h-8 text-success" />
                      </div>
                      <div>
                        <h3 className="font-bold text-success text-center mb-2">{outcome.title}</h3>
                        <div className="text-2xl font-bold text-primary text-center mb-2">{outcome.metric}</div>
                        <p className="text-sm text-muted-foreground text-center">{outcome.desc}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-success/5 to-primary/5 border border-success/20 rounded-xl">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Bottom Line Impact
                </h3>
                <p className="text-muted-foreground">
                  Transform technology delivery from reactive firefighting to proactive, strategic execution with measurable outcomes
                </p>
              </div>
            </div>
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
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting PPTX..." : "Export PPTX"}
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

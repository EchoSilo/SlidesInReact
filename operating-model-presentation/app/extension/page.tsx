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
  Award,
  Growth,
  MapPin,
  Compass,
  Map,
  Route,
} from "lucide-react"
import { toPng } from 'html-to-image'

const slides = [
  {
    id: "title",
    title: "Accelerating Your Transformation Journey",
    subtitle: "Implementation Partnership Proposal",
    tagline: "From Framework to Flourishing Operations",
    type: "title",
  },
  {
    id: "momentum",
    title: "Building on Our Strong Foundation",
    subtitle: "What We've Accomplished Together",
    type: "momentum",
    content: {
      achievements: [
        {
          icon: Eye,
          title: "Organizational Assessment",
          description: "Comprehensive analysis of your technology organization, processes, and culture",
          impact: "Clear visibility into current state"
        },
        {
          icon: Target,
          title: "Strategic Frameworks",
          description: "Operating model, capacity planning, resource allocation, and prioritization frameworks",
          impact: "Blueprint for transformation"
        },
        {
          icon: Settings,
          title: "Process Optimization",
          description: "Jira configuration improvements and workflow recommendations",
          impact: "Enhanced operational efficiency"
        },
        {
          icon: Map,
          title: "Strategic Roadmap",
          description: "Clear path forward with identified improvement opportunities",
          impact: "Direction for sustainable growth"
        },
      ],
    },
  },
  {
    id: "evolution-question",
    title: "The Natural Next Question",
    subtitle: "Unlocking Your Organization's Full Potential",
    type: "evolution",
    content: {
      question: "What would it look like if your organization could fully realize the potential of these frameworks?",
      context: "You've invested in building the foundation. Now imagine the possibilities when these frameworks become your everyday reality.",
      benefits: [
        "Teams naturally collaborating across traditional boundaries",
        "Resource decisions backed by real data and clear visibility",
        "Strategic priorities flowing seamlessly into daily execution",
        "Continuous improvement becoming part of your organizational DNA"
      ]
    },
  },
  {
    id: "current-position",
    title: "Where We Are Today",
    subtitle: "Recognizing Your Current Position",
    type: "current-state",
    content: {
      description: "Your organization is in an excellent position, having completed a thorough assessment and framework development phase.",
      strengths: [
        {
          icon: Award,
          title: "Strong Assessment Foundation",
          description: "Comprehensive understanding of current capabilities and opportunities"
        },
        {
          icon: Building2,
          title: "Committed Leadership",
          description: "Leadership team engaged and invested in transformation"
        },
        {
          icon: Users,
          title: "Talented Teams",
          description: "Skilled professionals ready to embrace new ways of working"
        },
        {
          icon: Compass,
          title: "Clear Direction",
          description: "Well-defined frameworks providing guidance for the future"
        }
      ],
      reality: "Like many successful organizations, you now face the natural challenge: How do you bridge the gap between having great frameworks and seeing them flourish in daily operations?"
    },
  },
  {
    id: "implementation-reality",
    title: "From Strategy to Execution",
    subtitle: "The Implementation Journey Ahead",
    type: "implementation-gap",
    content: {
      description: "The most successful transformations happen when organizations have dedicated support during the critical implementation phase.",
      insights: [
        {
          icon: Growth,
          title: "The Opportunity",
          description: "This is where the real transformation happens - when frameworks become living, breathing parts of your organization",
          impact: "Maximum return on your assessment investment"
        },
        {
          icon: Clock,
          title: "The Timing",
          description: "You're at the perfect moment - foundation built, team engaged, and ready to move forward",
          impact: "Strike while momentum is high"
        },
        {
          icon: Rocket,
          title: "The Catalyst",
          description: "With guided implementation, you can accelerate adoption and ensure sustainable change",
          impact: "Faster time to value realization"
        }
      ]
    },
  },
  {
    id: "vision",
    title: "Your Organization's Future State",
    subtitle: "What Success Looks Like in 12 Months",
    type: "vision",
    content: {
      vision: "Imagine your technology organization operating with complete visibility, predictable delivery, and strategic alignment - where every resource decision is data-driven and every initiative clearly contributes to business objectives.",
      outcomes: [
        {
          icon: Eye,
          title: "Complete Transparency",
          description: "Real-time visibility into all initiatives, capacity, and dependencies",
          metrics: "100% scope transparency"
        },
        {
          icon: Zap,
          title: "Optimized Resources",
          description: "Right people, right projects, right time - every time",
          metrics: "25-40% efficiency gains"
        },
        {
          icon: Target,
          title: "Strategic Alignment",
          description: "Every technology investment directly supporting business priorities",
          metrics: "Clear ROI tracking"
        },
        {
          icon: CheckCircle,
          title: "Predictable Delivery",
          description: "Commitments made with confidence and delivered consistently",
          metrics: "Improved success rates"
        },
        {
          icon: TrendingUp,
          title: "Continuous Growth",
          description: "Self-improving organization with built-in learning cycles",
          metrics: "Sustainable excellence"
        },
        {
          icon: Shield,
          title: "Proactive Management",
          description: "Issues identified and resolved before they become problems",
          metrics: "Risk mitigation"
        }
      ]
    },
  },
  {
    id: "partnership-journey",
    title: "The Guided Implementation Journey",
    subtitle: "Three Phases to Transformation Excellence",
    type: "roadmap-overview",
    content: {
      description: "A structured approach to ensure successful adoption of your new frameworks",
      phases: [
        {
          number: "01",
          icon: Play,
          title: "Foundation & Pilot",
          duration: "Months 1-3",
          focus: "Launch, Learn, Refine",
          color: "blue"
        },
        {
          number: "02",
          icon: Growth,
          title: "Scale & Optimize",
          duration: "Months 4-6",
          focus: "Expand, Improve, Embed",
          color: "green"
        },
        {
          number: "03",
          icon: Star,
          title: "Excellence & Sustainability",
          duration: "Months 7-12",
          focus: "Master, Sustain, Evolve",
          color: "purple"
        }
      ]
    },
  },
  {
    id: "phase-1",
    title: "Phase 1: Foundation & Pilot Launch",
    subtitle: "Months 1-3: Building Momentum with Early Wins",
    type: "phase-detail",
    content: {
      description: "Start with focused pilots to demonstrate value and build organizational confidence",
      objectives: [
        "Launch intake pilot program with immediate impact",
        "Begin operating model adoption with one high-visibility team",
        "Establish measurement baselines for future improvement",
        "Train initial champions who will drive broader adoption"
      ],
      activities: [
        {
          icon: Target,
          title: "Pilot Selection",
          description: "Choose optimal teams and processes for initial implementation",
          timeline: "Week 1-2"
        },
        {
          icon: Rocket,
          title: "Pilot Launch",
          description: "Roll out frameworks with dedicated support and monitoring",
          timeline: "Week 3-8"
        },
        {
          icon: BarChart3,
          title: "Early Measurement",
          description: "Capture baseline metrics and early success indicators",
          timeline: "Week 6-12"
        },
        {
          icon: Users2,
          title: "Champion Development",
          description: "Train and support internal advocates for change",
          timeline: "Ongoing"
        }
      ],
      outcomes: [
        "Proven framework value with measurable early wins",
        "Organizational confidence in the transformation approach",
        "Internal champions ready to support broader rollout",
        "Refined processes based on real-world feedback"
      ]
    },
  },
  {
    id: "phase-2",
    title: "Phase 2: Scale & Refine",
    subtitle: "Months 4-6: Expanding Success Across The Organization",
    type: "phase-detail",
    content: {
      description: "Build on pilot success to expand frameworks to additional teams while continuously improving",
      objectives: [
        "Expand successful pilots to additional teams and departments",
        "Refine frameworks based on real-world feedback and lessons learned",
        "Build internal capability and develop more change champions",
        "Address adoption challenges and resistance patterns"
      ],
      activities: [
        {
          icon: Growth,
          title: "Controlled Expansion",
          description: "Systematically roll out to new teams with proven approaches",
          timeline: "Month 4-5"
        },
        {
          icon: Settings,
          title: "Framework Refinement",
          description: "Optimize processes based on operational experience",
          timeline: "Month 4-6"
        },
        {
          icon: Users,
          title: "Capability Building",
          description: "Develop internal expertise and support networks",
          timeline: "Month 5-6"
        },
        {
          icon: Shield,
          title: "Challenge Resolution",
          description: "Proactively address adoption barriers and resistance",
          timeline: "Ongoing"
        }
      ],
      outcomes: [
        "Multiple teams successfully operating with new frameworks",
        "Optimized processes that fit your organizational culture",
        "Strong internal capability to support ongoing adoption",
        "Clear patterns for addressing implementation challenges"
      ]
    },
  },
  {
    id: "phase-3",
    title: "Phase 3: Maturity & Sustainability",
    subtitle: "Months 7-12: Achieving Excellence and Self-Sufficiency",
    type: "phase-detail",
    content: {
      description: "Complete organizational transformation with self-sustaining improvement processes",
      objectives: [
        "Achieve full organizational rollout of all frameworks",
        "Transfer complete ownership and expertise to internal teams",
        "Establish continuous improvement processes and cycles",
        "Measure and report comprehensive transformation outcomes"
      ],
      activities: [
        {
          icon: Building2,
          title: "Organization-wide Rollout",
          description: "Complete deployment across all technology teams",
          timeline: "Month 7-9"
        },
        {
          icon: Users2,
          title: "Knowledge Transfer",
          description: "Ensure internal teams can fully manage and evolve frameworks",
          timeline: "Month 8-10"
        },
        {
          icon: TrendingUp,
          title: "Continuous Improvement",
          description: "Establish ongoing optimization and learning cycles",
          timeline: "Month 10-12"
        },
        {
          icon: Award,
          title: "Outcome Measurement",
          description: "Comprehensive assessment of transformation impact",
          timeline: "Month 11-12"
        }
      ],
      outcomes: [
        "Self-sustaining operating model with internal champions",
        "Mature capacity planning capabilities embedded in culture",
        "Data-driven prioritization and resource allocation as standard practice",
        "Measurable improvement in delivery effectiveness and strategic alignment"
      ]
    },
  },
  {
    id: "team-enhancement",
    title: "Expanding Our Capacity to Serve You Better",
    subtitle: "Enhanced Team Structure for Implementation Success",
    type: "team-structure",
    content: {
      description: "To ensure comprehensive support during implementation, we'll expand our team with specialized capabilities",
      reasoning: "Implementation success requires dedicated focus on multiple workstreams simultaneously. By expanding our team, we ensure nothing falls through the cracks while maintaining the quality and attention you deserve.",
      roles: [
        {
          icon: Users,
          title: "Senior Implementation Consultant",
          description: "Strategic guidance, stakeholder alignment, and overall program leadership",
          responsibilities: [
            "Guide framework adoption and organizational change",
            "Facilitate leadership alignment and decision-making",
            "Ensure strategic coherence across all implementation activities",
            "Transfer knowledge and build internal capabilities"
          ]
        },
        {
          icon: FileText,
          title: "Documentation & Process Specialist",
          description: "Ensure comprehensive documentation and process standardization",
          responsibilities: [
            "Create and maintain implementation documentation",
            "Standardize processes and capture lessons learned",
            "Support training material development and delivery",
            "Manage meeting notes, action items, and follow-up"
          ]
        },
        {
          icon: Users2,
          title: "Change Management Support",
          description: "Focus on adoption, training, and organizational development",
          responsibilities: [
            "Facilitate workshops and training sessions",
            "Support change champion development",
            "Manage communication and stakeholder engagement",
            "Monitor adoption metrics and address resistance"
          ]
        }
      ],
      benefits: [
        "Dedicated bandwidth for all aspects of implementation",
        "Comprehensive support without overwhelming your internal teams",
        "Faster knowledge transfer and capability building",
        "Reduced risk of implementation gaps or delays"
      ]
    },
  },
  {
    id: "success-metrics",
    title: "Measuring Our Shared Success",
    subtitle: "How We'll Track Progress and Demonstrate Value",
    type: "metrics",
    content: {
      description: "Success will be measured through both quantitative improvements and qualitative organizational development",
      categories: [
        {
          icon: Eye,
          title: "Visibility & Transparency",
          metrics: [
            "100% of technology initiatives captured in consolidated view",
            "Real-time capacity utilization reporting across all teams",
            "Clear dependency tracking and bottleneck identification",
            "Leadership dashboard providing strategic oversight"
          ]
        },
        {
          icon: Zap,
          title: "Operational Efficiency",
          metrics: [
            "25-40% improvement in resource utilization effectiveness",
            "Reduced time from idea to implementation for priority initiatives",
            "Decreased administrative overhead in planning and reporting",
            "Faster decision-making through improved data availability"
          ]
        },
        {
          icon: Target,
          title: "Strategic Alignment",
          metrics: [
            "Clear linkage between technology investments and business priorities",
            "Improved predictability in delivery timelines and outcomes",
            "Enhanced ability to adapt priorities based on changing needs",
            "Better cross-team collaboration and coordination"
          ]
        },
        {
          icon: TrendingUp,
          title: "Organizational Maturity",
          metrics: [
            "Internal champions capable of managing frameworks independently",
            "Established continuous improvement processes and cycles",
            "Cultural shift toward data-driven decision making",
            "Self-sustaining capability for ongoing optimization"
          ]
        }
      ]
    },
  },
  {
    id: "investment-value",
    title: "Partnership Investment Overview",
    subtitle: "Flexible Engagement Options for Your Success",
    type: "investment",
    content: {
      description: "We offer flexible engagement models to match your organizational needs and timeline preferences",
      options: [
        {
          duration: "6 Month Partnership",
          icon: Calendar,
          focus: "Foundation + Scale",
          phases: "Phases 1 & 2",
          deliverables: [
            "Complete pilot implementation and organizational learning",
            "Expanded rollout to multiple teams with refined processes",
            "Strong internal capability development",
            "Clear path for independent Phase 3 execution"
          ],
          ideal: "Organizations ready to move quickly with strong internal change management capability"
        },
        {
          duration: "12 Month Partnership",
          icon: Star,
          focus: "Complete Transformation",
          phases: "Phases 1, 2 & 3",
          deliverables: [
            "Full organizational transformation with comprehensive support",
            "Complete knowledge transfer and internal capability building",
            "Self-sustaining continuous improvement processes",
            "Measurable outcome validation and optimization"
          ],
          ideal: "Organizations seeking comprehensive transformation with full support through maturity"
        }
      ],
      value: [
        "Maximizes return on your assessment investment",
        "Reduces risk of implementation gaps or failures",
        "Accelerates time to value realization",
        "Builds sustainable internal capability for ongoing success"
      ]
    },
  },
  {
    id: "next-steps",
    title: "Your Path to Implementation Excellence",
    subtitle: "Ready to Transform Your Technology Organization?",
    type: "next-steps",
    content: {
      description: "The foundation has been laid. Your team is engaged. The frameworks are ready. Now is the perfect time to move from planning to transformation.",
      steps: [
        {
          number: "01",
          icon: Calendar,
          title: "Choose Your Partnership Duration",
          description: "Select the 6-month or 12-month option that best fits your timeline and internal capabilities"
        },
        {
          number: "02",
          icon: Users,
          title: "Finalize Team Structure",
          description: "Confirm internal champions and designate dedicated program management resources"
        },
        {
          number: "03",
          icon: Target,
          title: "Launch Foundation Phase",
          description: "Begin with pilot selection and initial framework implementation within 2 weeks"
        }
      ],
      closing: "Your organization has already demonstrated commitment to excellence by investing in assessment and framework development. Let's complete this transformation together and realize the full potential of your technology organization.",
      cta: "Ready to begin your implementation journey?"
    },
  },
]

export default function ExtensionPresentation() {
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

        const link = document.createElement("a")
        link.download = `extension-slide-${i + 1}-${slides[i].id}.png`
        link.href = dataUrl
        link.click()

        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error("Error exporting all slides:", error)
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

      case "momentum":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              {slide.content?.achievements?.map((achievement: any, index: number) => {
                const IconComponent = achievement.icon;
                return (
                  <Card key={index} className="bg-green-50 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col space-y-4">
                      <div className="bg-green-100 p-4 rounded-xl w-fit">
                        <IconComponent className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-green-800 mb-3">
                          {achievement.title}
                        </h3>
                        <p className="text-base text-green-700 leading-relaxed mb-4">
                          {achievement.description}
                        </p>
                        <div className="bg-green-200/50 px-4 py-2 rounded-full">
                          <span className="text-sm font-medium text-green-800">
                            ✓ {achievement.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 p-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Solid Foundation Established
                </h3>
                <p className="text-lg text-muted-foreground">
                  Your investment in assessment and framework development has created an excellent platform for transformation success
                </p>
              </div>
            </div>
          </div>
        )

      case "evolution":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1 flex items-center">
              <div className="max-w-5xl mx-auto text-center space-y-12">
                <div className="bg-primary/5 p-12 rounded-2xl border border-primary/20">
                  <h2 className="text-3xl font-semibold text-primary mb-8 italic">
                    "{slide.content?.question}"
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    {slide.content?.context}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {slide.content?.benefits?.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200">
                      <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-lg text-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "current-state":
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

            <div className="flex-1 grid grid-cols-2 gap-6 mb-8">
              {slide.content?.strengths?.map((strength: any, index: number) => {
                const IconComponent = strength.icon;
                return (
                  <Card key={index} className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          {strength.title}
                        </h3>
                        <p className="text-base text-blue-700">
                          {strength.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="p-6 bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20 rounded-xl">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {slide.content?.reality}
              </p>
            </div>
          </div>
        )

      case "implementation-gap":
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
              {slide.content?.insights?.map((insight: any, index: number) => {
                const IconComponent = insight.icon;
                return (
                  <Card key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-6">
                      <div className="bg-primary/10 p-4 rounded-xl flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          {insight.title}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed mb-4">
                          {insight.description}
                        </p>
                        <div className="bg-primary/5 px-4 py-2 rounded-full inline-block">
                          <span className="text-sm font-medium text-primary">
                            → {insight.impact}
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

      case "vision":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="mb-8 bg-gradient-to-r from-primary/5 to-purple-50 rounded-lg p-8 border border-primary/20">
              <p className="text-xl text-foreground leading-relaxed italic">
                {slide.content?.vision}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slide.content?.outcomes?.map((outcome: any, index: number) => {
                const IconComponent = outcome.icon;
                return (
                  <Card key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="bg-primary/10 p-4 rounded-xl">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {outcome.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {outcome.description}
                        </p>
                        <div className="bg-green-100 px-3 py-1 rounded-full">
                          <span className="text-xs font-medium text-green-800">
                            {outcome.metrics}
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

      case "roadmap-overview":
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

            <div className="flex-1 flex items-center">
              <div className="grid grid-cols-3 gap-12 w-full">
                {slide.content?.phases?.map((phase: any, index: number) => {
                  const IconComponent = phase.icon;
                  return (
                    <div key={index} className="relative text-center">
                      <Card className={`p-8 h-64 flex flex-col justify-center mb-6 bg-${phase.color}-50 border-2 border-${phase.color}-200 shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="flex flex-col items-center space-y-6">
                          <div className={`bg-${phase.color}-100 p-5 rounded-xl`}>
                            <IconComponent className={`w-12 h-12 text-${phase.color}-600`} />
                          </div>
                          <div className={`bg-${phase.color}-600 text-white px-4 py-2 rounded-full`}>
                            <span className="text-lg font-bold">{phase.number}</span>
                          </div>
                          <h3 className="font-semibold text-xl text-foreground text-balance leading-tight">{phase.title}</h3>
                        </div>
                      </Card>
                      <div className="space-y-2">
                        <p className="text-base font-medium text-foreground">{phase.duration}</p>
                        <p className="text-sm text-muted-foreground">{phase.focus}</p>
                      </div>
                      {index < 2 && (
                        <div className="absolute top-32 -right-6 text-4xl text-primary/70 font-bold">→</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )

      case "phase-detail":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="mb-6 bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-base text-foreground leading-relaxed">
                {slide.content?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Key Objectives</h3>
                <div className="space-y-3">
                  {slide.content?.objectives?.map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-800">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Key Activities</h3>
                <div className="space-y-3">
                  {slide.content?.activities?.map((activity: any, index: number) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm mb-1">{activity.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">{activity.timeline}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Expected Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {slide.content?.outcomes?.map((outcome: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "team-structure":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="mb-6 bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-base text-foreground leading-relaxed mb-3">
                {slide.content?.description}
              </p>
              <p className="text-sm text-muted-foreground italic">
                {slide.content?.reasoning}
              </p>
            </div>

            <div className="flex-1 space-y-4">
              {slide.content?.roles?.map((role: any, index: number) => {
                const IconComponent = role.icon;
                return (
                  <Card key={index} className="p-6 bg-white border border-gray-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {role.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-14">
                      {role.responsibilities?.map((responsibility: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-muted-foreground">{responsibility}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Enhanced Team Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {slide.content?.benefits?.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "metrics":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="mb-6 bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-base text-foreground leading-relaxed">
                {slide.content?.description}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {slide.content?.categories?.map((category: any, index: number) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="p-6 bg-white border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.title}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {category.metrics?.map((metric: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )

      case "investment":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="mb-6 bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-base text-foreground leading-relaxed">
                {slide.content?.description}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {slide.content?.options?.map((option: any, index: number) => {
                const IconComponent = option.icon;
                return (
                  <Card key={index} className="p-8 bg-white border-2 border-primary/20 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-primary/10 p-4 rounded-xl">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{option.duration}</h3>
                        <p className="text-sm text-muted-foreground">{option.focus} • {option.phases}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Key Deliverables</h4>
                      <div className="space-y-2">
                        {option.deliverables?.map((deliverable: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Ideal For</h4>
                      <p className="text-sm text-muted-foreground">{option.ideal}</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 text-center">Partnership Value</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {slide.content?.value?.map((benefit: string, index: number) => (
                  <div key={index} className="text-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm text-green-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "next-steps":
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

            <div className="flex-1 space-y-6 mb-8">
              {slide.content?.steps?.map((step: any, index: number) => {
                const IconComponent = step.icon;
                return (
                  <Card key={index} className="p-6 bg-white border border-gray-200">
                    <div className="flex items-start gap-6">
                      <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent className="w-6 h-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                        </div>
                        <p className="text-base text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-8 border border-primary/20">
                <p className="text-lg text-foreground leading-relaxed text-center italic">
                  {slide.content?.closing}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-white rounded-lg p-8 inline-block">
                  <h3 className="text-2xl font-bold mb-4">{slide.content?.cta}</h3>
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
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
              {isExporting ? "Exporting All..." : "Export All PNG"}
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
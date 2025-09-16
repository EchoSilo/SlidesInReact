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
  Cog,
  Gauge,
  HeartHandshake,
  Workflow,
  GitBranch,
  Rocket,
  Activity,
  Sparkles,
  Star,
  Filter,
} from "lucide-react"
import { toPng } from 'html-to-image'
import { usePptxExport } from '@/hooks/usePptxExport'

const slides = [
  {
    id: "title",
    title: "Technology Program Management Operating Model",
    subtitle: "Lightweight Framework for Small Financial Services Organizations",
    tagline: "Accelerating Delivery Through Strategic Coordination",
    type: "title",
  },
  {
    id: "current-challenge",
    title: "The Coordination Challenge",
    subtitle: "Small Technology Organizations Need Coordination, Not Bureaucracy",
    type: "challenge",
    content: {
      metrics: [
        { number: "135", label: "Total People", icon: Users, color: "blue" },
        { number: "8", label: "Delivery Teams", icon: Building, color: "orange" },
        { number: "0", label: "Current PMO", icon: Target, color: "red" },
        { number: "High", label: "Matrix Complexity", icon: Network, color: "purple" },
      ],
      problems: [
        {
          icon: AlertTriangle,
          title: "Coordination Chaos",
          description: "Teams don't know what others are working on, creating dependencies and conflicts",
        },
        {
          icon: Users,
          title: "Resource Allocation Blindness",
          description: "No visibility into who's available when, leading to over-allocation and burnout",
        },
        {
          icon: Shield,
          title: "Regulatory Risk",
          description: "Audit findings and compliance requirements not systematically managed across projects",
        },
        {
          icon: Calendar,
          title: "Reactive Planning",
          description: "Leadership making decisions without full visibility into delivery pipeline and capacity",
        },
      ],
    },
  },
  {
    id: "operating-model-overview",
    title: "Lightweight Operating Model Framework",
    subtitle: "Essential Coordination Without the Overhead",
    type: "framework-overview",
    content: {
      areas: [
        {
          icon: Eye,
          title: "Resource Visibility & Allocation",
          description: "Simple capacity dashboard and weekly resource coordination",
          impact: "Know who's working on what"
        },
        {
          icon: Workflow,
          title: "Delivery Coordination",
          description: "Bi-weekly cross-team dependency check-ins and delivery tracking",
          impact: "Prevent blockers and conflicts"
        },
        {
          icon: Rocket,
          title: "Strategic Alignment",
          description: "OVS-based fast-track prioritization and monthly leadership sync",
          impact: "Accelerate high-value work"
        },
        {
          icon: Shield,
          title: "Compliance & Risk Management",
          description: "Mandatory regulatory checkpoints and audit findings management",
          impact: "Stay audit-ready always"
        },
      ],
    },
  },
  {
    id: "resource-coordination",
    title: "Resource Visibility & Allocation",
    subtitle: "Essential Coordination Area #1",
    type: "detailed-area",
    content: {
      description: "Get basic visibility into who's working on what and when they're available",
      components: [
        {
          icon: Gauge,
          title: "Simple Capacity Dashboard",
          description: "Visual overview of team allocations and availability",
          details: ["Current project assignments", "Upcoming availability", "Skill/expertise mapping", "Capacity utilization rates"]
        },
        {
          icon: Users,
          title: "Weekly Resource Huddle",
          description: "15-minute check-in with team leads",
          details: ["Resource conflicts", "Upcoming needs", "Availability changes", "Critical dependencies"]
        },
        {
          icon: Star,
          title: "Priority Fast-Track Process",
          description: "Top 3 rule using existing OVS framework",
          details: ["High-OVS projects get priority", "Clear resource allocation", "Fast decision pipeline", "Minimal approval layers"]
        }
      ],
      benefits: [
        "End resource conflicts before they start",
        "Speed up high-value project resource allocation",
        "Leadership visibility without heavy reporting",
        "Teams know priorities and can plan accordingly"
      ]
    },
  },
  {
    id: "delivery-coordination",
    title: "Delivery Coordination",
    subtitle: "Essential Coordination Area #2",
    type: "detailed-area",
    content: {
      description: "Prevent delivery blockers and keep projects moving without heavy process",
      components: [
        {
          icon: GitBranch,
          title: "Bi-weekly Dependency Check-ins",
          description: "Cross-team coordination meetings",
          details: ["Identify upcoming dependencies", "Resolve current blockers", "Plan handoffs and integrations", "Share delivery timelines"]
        },
        {
          icon: Activity,
          title: "Simple Delivery Dashboard",
          description: "What's shipping when across all teams",
          details: ["Current sprint progress", "Upcoming release timeline", "Dependency status", "Risk indicators"]
        },
        {
          icon: CheckCircle,
          title: "Shared Definition of Done",
          description: "Consistent quality standards across teams",
          details: ["Security review requirements", "Documentation standards", "Testing criteria", "Compliance checkpoints"]
        }
      ],
      benefits: [
        "Teams coordinate without constant meetings",
        "Dependencies identified before they become blockers",
        "Consistent delivery quality across teams",
        "Predictable delivery timelines"
      ]
    },
  },
  {
    id: "strategic-alignment",
    title: "Strategic Alignment (Fast-Track Focus)",
    subtitle: "Essential Coordination Area #3",
    type: "detailed-area",
    content: {
      description: "Use OVS framework to accelerate high-value work through the system",
      components: [
        {
          icon: Zap,
          title: "OVS Fast-Lane Process",
          description: "5-minute assessment to fast-track high-value work",
          details: ["Auto-approve high-scoring projects", "Priority resource allocation", "Streamlined decision making", "Minimal bureaucracy"]
        },
        {
          icon: Rocket,
          title: "Acceleration Pathway",
          description: "Speed up delivery of strategic initiatives",
          details: ["Impact Brief (one-slide pitch)", "30-second elevator test", "Go/No-Go speed gates", "Weekly decision clinic"]
        },
        {
          icon: TrendingUp,
          title: "Monthly Leadership Sync",
          description: "Priority pipeline and roadblock removal",
          details: ["Review delivery pipeline", "Resource rebalancing", "Priority adjustments", "Bottleneck elimination"]
        }
      ],
      benefits: [
        "High-value projects get fast-tracked",
        "Decisions made in days, not weeks",
        "Teams spend time building, not justifying",
        "Strategic work flows with minimal friction"
      ]
    },
  },
  {
    id: "compliance-risk",
    title: "Regulatory Compliance & Risk Management",
    subtitle: "Essential Coordination Area #4 (Non-Negotiable)",
    type: "detailed-area",
    content: {
      description: "Maintain audit readiness while keeping process lightweight for financial services",
      components: [
        {
          icon: Shield,
          title: "Weekly Risk & Compliance Checkpoint",
          description: "30-minute mandatory review",
          details: ["Audit findings status", "Compliance risks in active projects", "Regulatory blockers escalation", "SOX requirements tracking"]
        },
        {
          icon: FileText,
          title: "Monthly Compliance Review Board",
          description: "45-minute formal governance",
          details: ["External audit remediation", "Regulatory change impact", "Project risk register updates", "Documentation reviews"]
        },
        {
          icon: AlertTriangle,
          title: "Risk-Based Project Gates",
          description: "Compliance checkpoints at each release",
          details: ["Mandatory compliance risk assessment", "Security review requirements", "Data governance validation", "Regulatory evidence gathering"]
        }
      ],
      benefits: [
        "Zero critical audit findings aging >30 days",
        "Continuous regulatory readiness",
        "Risk-based resource allocation",
        "Proactive compliance management"
      ]
    },
  },
  {
    id: "governance-structure",
    title: "Lightweight Governance Structure",
    subtitle: "Minimal Overhead, Maximum Coordination",
    type: "governance",
    content: {
      rhythms: [
        {
          frequency: "Weekly",
          duration: "30 min",
          meeting: "Team Lead Standup",
          focus: "Dependencies & blockers only",
          icon: Users,
          color: "blue"
        },
        {
          frequency: "Weekly",
          duration: "30 min",
          meeting: "Risk & Compliance Checkpoint",
          focus: "Audit findings & regulatory risks",
          icon: Shield,
          color: "red"
        },
        {
          frequency: "Bi-weekly",
          duration: "45 min",
          meeting: "Cross-Team Dependencies",
          focus: "Delivery coordination",
          icon: GitBranch,
          color: "green"
        },
        {
          frequency: "Monthly",
          duration: "60 min",
          meeting: "Leadership Pipeline Review",
          focus: "Priority & resource decisions",
          icon: Rocket,
          color: "purple"
        },
        {
          frequency: "Monthly",
          duration: "45 min",
          meeting: "Compliance Review Board",
          focus: "Regulatory oversight",
          icon: FileText,
          color: "orange"
        },
        {
          frequency: "Quarterly",
          duration: "2 hours",
          meeting: "Strategic Planning",
          focus: "Roadmap & capacity alignment",
          icon: Target,
          color: "cyan"
        }
      ]
    },
  },
  {
    id: "phased-implementation",
    title: "Phased Implementation Approach",
    subtitle: "Start Light, Add Sophistication Where Pain Points Emerge",
    type: "timeline",
    content: {
      phases: [
        {
          phase: "Phase 1: Foundation (0-3 months)",
          title: "Essential Coordination",
          icon: Building,
          activities: [
            "Deploy capacity management framework",
            "Establish weekly team lead standup",
            "Implement basic delivery tracking",
            "Set up compliance checkpoint process"
          ],
          outcome: "Basic visibility and coordination working"
        },
        {
          phase: "Phase 2: Optimization (3-6 months)",
          title: "Process Maturity",
          icon: Cog,
          activities: [
            "Add OVS fast-track prioritization",
            "Enhance delivery dashboard capabilities",
            "Mature compliance review processes",
            "Implement cross-team dependency tracking"
          ],
          outcome: "Sophisticated coordination where needed"
        },
        {
          phase: "Phase 3: Excellence (6-18 months)",
          title: "Continuous Improvement",
          icon: Sparkles,
          activities: [
            "Automate repetitive coordination tasks",
            "Add predictive analytics capabilities",
            "Implement advanced resource optimization",
            "Build organizational learning loops"
          ],
          outcome: "Self-optimizing operating model"
        }
      ]
    },
  },
  {
    id: "compliance-specifics",
    title: "Financial Services Compliance Integration",
    subtitle: "Non-Negotiable Requirements Built Into the Operating Model",
    type: "compliance-detail",
    content: {
      requirements: [
        {
          category: "Audit Findings Management",
          icon: AlertTriangle,
          description: "Centralized tracker with ownership and remediation planning",
          process: "Weekly status review → Monthly board escalation → Quarterly audit readiness"
        },
        {
          category: "Risk-Based Project Classification",
          icon: Filter,
          description: "High/Medium/Low risk categorization drives process intensity",
          process: "Risk assessment at initiation → Ongoing monitoring → Compliance gates"
        },
        {
          category: "Regulatory Change Management",
          icon: FileText,
          description: "Impact assessment and documentation requirements",
          process: "Change identification → Impact analysis → Implementation tracking"
        },
        {
          category: "Security & Data Governance",
          icon: Shield,
          description: "Mandatory reviews for customer data and regulated systems",
          process: "Design review → Implementation validation → Ongoing monitoring"
        }
      ],
      capacityTax: [
        { risk: "High Risk Projects", allocation: "15-20%", examples: "Customer data, trading systems" },
        { risk: "Medium Risk Projects", allocation: "10%", examples: "Internal tools accessing regulated data" },
        { risk: "Low Risk Projects", allocation: "5%", examples: "Developer tools, analytics" }
      ]
    },
  },
  {
    id: "success-metrics",
    title: "Success Indicators",
    subtitle: "How We Know the Operating Model is Working",
    type: "metrics",
    content: {
      coordination: [
        { metric: "Teams know what others are working on", target: "100%", current: "~30%" },
        { metric: "Resource conflicts resolved quickly", target: "<24 hrs", current: "~1 week" },
        { metric: "Leadership visibility into delivery pipeline", target: "Real-time", current: "Monthly" },
        { metric: "Engineer time on coordination overhead", target: "<5%", current: "~15%" }
      ],
      compliance: [
        { metric: "Critical audit findings aging >30 days", target: "0", current: "Unknown" },
        { metric: "Compliance checkpoint completion", target: "100%", current: "Ad-hoc" },
        { metric: "Average finding remediation time", target: "<2 weeks", current: "Unknown" },
        { metric: "Regulatory readiness", target: "Continuous", current: "Reactive" }
      ],
      acceleration: [
        { metric: "High-OVS project resource allocation speed", target: "Same day", current: "~2 weeks" },
        { metric: "Decision cycle time", target: "Days", current: "Weeks" },
        { metric: "Project approval pipeline speed", target: "50% faster", current: "Baseline" },
        { metric: "Strategic initiative delivery predictability", target: "90%", current: "~60%" }
      ]
    },
  },
  {
    id: "what-not-to-do",
    title: "What NOT to Do",
    subtitle: "Avoiding the Bureaucracy Trap",
    type: "anti-patterns",
    content: {
      avoids: [
        {
          icon: AlertTriangle,
          title: "Complex Governance Committees",
          description: "Multiple approval layers that slow down delivery",
          instead: "Single decision maker for resource conflicts"
        },
        {
          icon: FileText,
          title: "Heavy Documentation Requirements",
          description: "Detailed process docs nobody reads or follows",
          instead: "Simple templates and checklists"
        },
        {
          icon: Layers,
          title: "Multiple Approval Layers",
          description: "Everything needs 3+ sign-offs before proceeding",
          instead: "OVS-based auto-approval thresholds"
        },
        {
          icon: BarChart3,
          title: "Extensive Reporting Frameworks",
          description: "Weekly status reports that don't drive decisions",
          instead: "Exception-based escalation only"
        },
        {
          icon: Building,
          title: "Formal PMO Structure",
          description: "Dedicated program office with multiple roles",
          instead: "Distributed coordination across team leads"
        },
        {
          icon: Clock,
          title: "Long Planning Cycles",
          description: "Quarterly planning marathons with detailed estimates",
          instead: "Monthly priority adjustments and capacity rebalancing"
        }
      ],
      principle: "Add process friction only when coordination pain exceeds process overhead"
    },
  },
  {
    id: "expected-outcomes",
    title: "Expected Outcomes",
    subtitle: "Measurable Impact for Small Technology Organizations",
    type: "outcomes",
    content: {
      outcomes: [
        { title: "Coordination Efficiency", metric: "50% reduction in meetings", desc: "Teams coordinate through structured touchpoints, not constant meetings", icon: Clock },
        { title: "Resource Optimization", metric: "20% capacity improvement", desc: "Better allocation prevents over/under utilization", icon: Gauge },
        { title: "Decision Velocity", metric: "3x faster approvals", desc: "OVS fast-track eliminates approval bottlenecks", icon: Zap },
        { title: "Regulatory Confidence", metric: "100% audit readiness", desc: "Continuous compliance management prevents surprises", icon: Shield },
        { title: "Delivery Predictability", metric: "90% on-time delivery", desc: "Proactive dependency management and realistic planning", icon: Target },
        { title: "Strategic Focus", metric: "80% time on value work", desc: "Less coordination overhead, more building", icon: Rocket }
      ]
    },
  },
  {
    id: "next-steps",
    title: "Next Steps & Implementation",
    subtitle: "Getting Started with Lightweight Operating Model",
    type: "action",
    content: {
      actions: [
        "Approve lightweight operating model approach and designate coordination lead",
        "Establish weekly team lead standup and compliance checkpoint cadence",
        "Deploy basic capacity visibility dashboard using existing capacity framework",
        "Implement OVS fast-track process for high-priority project acceleration",
        "Set up monthly leadership pipeline review integrated with strategic planning"
      ]
    },
  },
]

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const { exportToPPTX, isReady: pptxReady } = usePptxExport()

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
        link.download = `slide-${i + 1}-${slides[i].id}.png`
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

  const exportAllSlidesAsPPTX = async () => {
    if (!pptxReady) {
      alert("PowerPoint export is still loading. Please try again in a moment.")
      return
    }

    setIsExporting(true)
    try {
      // Prepare slide data for export - extract only text content
      const slideData = slides.map((slide) => {
        let contentText = '';

        if (slide.content) {
          // Extract text content based on slide type
          if (slide.content.problems) {
            contentText = slide.content.problems.map((p: any) =>
              `• ${p.title}: ${p.description}`
            ).join('\n');
          } else if (slide.content.areas) {
            contentText = slide.content.areas.map((a: any) =>
              `• ${a.title}: ${a.description} (${a.impact})`
            ).join('\n');
          } else if (slide.content.steps) {
            contentText = slide.content.steps.map((s: any) =>
              `${s.number || ''} ${s.title}: ${s.description || ''}`
            ).join('\n');
          } else if (slide.content.actions) {
            contentText = slide.content.actions.join('\n• ');
          }
        }

        return {
          title: slide.title || '',
          subtitle: slide.subtitle || slide.tagline || '',
          content: contentText
        };
      });

      await exportToPPTX(
        slideData,
        'Operating-Model-Presentation.pptx',
        'Operating Model Presentation'
      )
    } catch (error) {
      console.error("Error exporting PPTX:", error)
      alert("Error exporting to PowerPoint. Please try again.")
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
              <Cog className="w-20 h-20 text-primary mx-auto mb-8" />
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

      case "challenge":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
              {slide.content?.metrics?.map((metric: any, index: number) => {
                const IconComponent = metric.icon;
                return (
                  <Card key={index} className={`p-6 text-center border-2 border-${metric.color}-200 bg-${metric.color}-50/30`}>
                    <div className="flex flex-col items-center">
                      <IconComponent className={`w-8 h-8 text-${metric.color}-600 mb-3`} />
                      <div className={`text-4xl font-bold text-${metric.color}-600 mb-2`}>
                        {metric.number}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {metric.label}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Key Coordination Challenges</h3>
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
                          <h4 className="text-lg font-semibold text-foreground mb-2">
                            {problem.title}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {problem.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-center text-destructive font-medium">
                <strong>Result:</strong> Small organizations need coordination mechanisms that don't become bureaucratic overhead
              </p>
            </div>
          </div>
        )

      case "framework-overview":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-xl text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {slide.content?.areas?.map((area: any, index: number) => {
                  const IconComponent = area.icon;
                  return (
                    <Card key={index} className="bg-primary/5 p-8 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-200">
                      <div className="flex flex-col space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-4 rounded-xl">
                            <IconComponent className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {area.title}
                          </h3>
                        </div>
                        <div>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {area.description}
                          </p>
                          <div className="bg-accent/20 px-4 py-2 rounded-lg">
                            <span className="text-sm font-medium text-green-800">
                              → {area.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-success/5 border border-primary/20 rounded-xl">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Key Principle
                </h3>
                <p className="text-muted-foreground">
                  <strong>Minimum Viable Coordination:</strong> Add process friction only when coordination pain exceeds process overhead
                </p>
              </div>
            </div>
          </div>
        )

      case "detailed-area":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance mb-4">{slide.subtitle}</p>
              <p className="text-muted-foreground">{slide.content?.description}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {slide.content?.components?.map((component: any, idx: number) => {
                const IconComponent = component.icon;
                return (
                  <div key={idx} className="bg-card border border-border/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {component.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {component.description}
                    </p>
                    <div className="space-y-2">
                      {component.details?.map((detail: string, detailIdx: number) => (
                        <div key={detailIdx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
        )

      case "governance":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              {slide.content?.rhythms?.map((rhythm: any, idx: number) => {
                const IconComponent = rhythm.icon;
                return (
                  <Card key={idx} className={`p-6 border-2 border-${rhythm.color}-200 bg-${rhythm.color}-50/30 hover:shadow-lg transition-all`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`bg-${rhythm.color}-100 p-3 rounded-xl`}>
                          <IconComponent className={`w-6 h-6 text-${rhythm.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-bold text-${rhythm.color}-600 bg-${rhythm.color}-100 px-2 py-1 rounded-full inline-block mb-1`}>
                            {rhythm.frequency}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {rhythm.duration}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {rhythm.meeting}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {rhythm.focus}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Total Weekly Coordination Time
                </h3>
                <div className="text-3xl font-bold text-primary mb-2">
                  ~2 hours per week
                </div>
                <p className="text-muted-foreground">
                  Structured coordination that prevents hours of reactive meetings and conflicts
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
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto text-balance">{slide.subtitle}</p>
            </div>

            <div className="space-y-8 flex-1">
              {slide.content?.phases?.map((phase: any, index: number) => {
                const IconComponent = phase.icon;
                return (
                  <div key={index} className="relative">
                    {index < slide.content?.phases?.length - 1 && (
                      <div className="absolute left-6 top-20 w-0.5 h-16 bg-border"></div>
                    )}

                    <div className="flex gap-6 items-start">
                      <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1 bg-card border border-border/50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">
                              {phase.phase}
                            </span>
                            <h3 className="text-xl font-semibold text-foreground mt-2">
                              {phase.title}
                            </h3>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {phase.activities?.map((activity: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <ArrowUp className="w-4 h-4 text-accent mt-0.5 shrink-0 rotate-45" />
                              <span className="text-sm text-muted-foreground">{activity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                          <span className="text-sm font-semibold text-accent">Outcome: </span>
                          <span className="text-sm text-muted-foreground">{phase.outcome}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )

      case "compliance-detail":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-1">
              {slide.content?.requirements?.map((req: any, idx: number) => {
                const IconComponent = req.icon;
                return (
                  <div key={idx} className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-red-100 p-3 rounded-xl">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-red-800">
                        {req.category}
                      </h3>
                    </div>
                    <p className="text-sm text-red-700 mb-3 leading-relaxed">
                      {req.description}
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-red-100">
                      <span className="text-xs font-semibold text-red-600">Process: </span>
                      <span className="text-xs text-red-700">{req.process}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h3 className="font-bold text-orange-800 mb-3">Compliance Capacity Tax (Built into Resource Planning):</h3>
              <div className="grid grid-cols-3 gap-4">
                {slide.content?.capacityTax?.map((tax: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-orange-100 text-center">
                    <div className="text-sm font-semibold text-orange-800 mb-1">{tax.risk}</div>
                    <div className="text-lg font-bold text-orange-600 mb-1">{tax.allocation}</div>
                    <div className="text-xs text-orange-600">{tax.examples}</div>
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
              <p className="text-lg text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Network className="w-5 h-5 mr-2" />
                  Coordination
                </h3>
                <div className="space-y-4">
                  {slide.content?.coordination?.map((metric: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-blue-100">
                      <div className="text-sm font-medium text-blue-800 mb-1">{metric.metric}</div>
                      <div className="flex justify-between">
                        <span className="text-xs text-blue-600">Current: {metric.current}</span>
                        <span className="text-xs font-bold text-blue-700">Target: {metric.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Compliance
                </h3>
                <div className="space-y-4">
                  {slide.content?.compliance?.map((metric: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-red-100">
                      <div className="text-sm font-medium text-red-800 mb-1">{metric.metric}</div>
                      <div className="flex justify-between">
                        <span className="text-xs text-red-600">Current: {metric.current}</span>
                        <span className="text-xs font-bold text-red-700">Target: {metric.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Acceleration
                </h3>
                <div className="space-y-4">
                  {slide.content?.acceleration?.map((metric: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-green-100">
                      <div className="text-sm font-medium text-green-800 mb-1">{metric.metric}</div>
                      <div className="flex justify-between">
                        <span className="text-xs text-green-600">Current: {metric.current}</span>
                        <span className="text-xs font-bold text-green-700">Target: {metric.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "anti-patterns":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg text-muted-foreground text-balance">{slide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 mb-6">
              {slide.content?.avoids?.map((avoid: any, idx: number) => {
                const IconComponent = avoid.icon;
                return (
                  <div key={idx} className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <IconComponent className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-base font-semibold text-red-800">
                        ❌ {avoid.title}
                      </h3>
                    </div>
                    <p className="text-xs text-red-700 mb-3 leading-relaxed">
                      {avoid.description}
                    </p>
                    <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                      <span className="text-xs font-semibold text-green-700">✓ Instead: </span>
                      <span className="text-xs text-green-600">{avoid.instead}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Core Operating Principle
                </h3>
                <p className="text-primary font-medium text-lg">
                  {slide.content?.principle}
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
                  Transform small technology organizations from coordination chaos to strategic execution
                </p>
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
              <div className="max-w-4xl space-y-6">
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
                    Let's Start with Foundation Phase
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
              {isExporting ? "Exporting All..." : "Export All"}
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
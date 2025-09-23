import { GenerationRequest } from './types'
import { Framework } from './validation/supportedFrameworks'

export const SYSTEM_PROMPT = `You are an expert presentation designer and business consultant. You create professional, engaging presentations for business and technical audiences.

Your task is to generate structured slide content based on user requirements. Always respond with valid JSON matching the PresentationData schema.

Key principles:
- Keep slides focused and digestible
- Use clear, actionable language
- Include relevant business value
- Structure content logically following the specified framework
- Adapt tone to audience
- Include speaker notes for complex slides`

export const PRESENTATION_TYPE_PROMPTS = {
  business: {
    focus: "Business value, ROI, strategic alignment, stakeholder benefits",
    tone: "Professional, persuasive, executive-focused"
  },
  technical: {
    focus: "Architecture, implementation details, technical feasibility, standards",
    tone: "Detailed, technical, solution-oriented"
  },
  process: {
    focus: "Workflow optimization, efficiency gains, process improvements",
    tone: "Process-focused, improvement-oriented, systematic"
  },
  transformation: {
    focus: "Organizational change, strategy, transformation roadmap, change management",
    tone: "Strategic, visionary, change-focused"
  },
  capacity: {
    focus: "Resource allocation, capacity planning, optimization, strategic prioritization",
    tone: "Analytical, strategic, resource-focused"
  },
  custom: {
    focus: "Tailored to specific requirements and context",
    tone: "Adapted to audience and purpose"
  }
}

export const TONE_MODIFIERS = {
  professional: "Formal business language, executive-ready, polished",
  conversational: "Engaging, approachable, discussion-friendly",
  technical: "Precise, detailed, technically accurate",
  executive: "High-level, strategic, decision-focused"
}

/**
 * Generate framework-specific system prompt
 */
function generateFrameworkPrompt(framework: Framework): string {
  const frameworkStructure = framework.structure
    .map(step => `- ${step.step}: ${step.description}`)
    .join('\n')

  return `
SELECTED FRAMEWORK: ${framework.name.toUpperCase()}
Framework Description: ${framework.description}

Framework Structure:
${frameworkStructure}

This framework is optimal for: ${framework.bestFor.join(', ')}
Key characteristics: ${framework.characteristics.join(', ')}

SLIDE MAPPING GUIDANCE:
- Target slide count: ${framework.slideMappings.typical_slide_count}
- Recommended sequence: ${framework.slideMappings.slide_sequence.join(' → ')}
- Content focus per slide type: ${Object.entries(framework.slideMappings.content_focus)
    .map(([type, focus]) => `${type}: ${focus}`)
    .join('; ')}

IMPLEMENTATION INSTRUCTIONS:
Structure the entire presentation to follow the ${framework.name} framework progression.
Each slide should contribute to the overall ${framework.name} narrative flow.
Ensure logical progression from ${framework.structure[0].step} through to ${framework.structure[framework.structure.length - 1].step}.`
}

export function generatePrompt(request: GenerationRequest, selectedFramework?: Framework): string {
  const typeConfig = PRESENTATION_TYPE_PROMPTS[request.presentation_type as keyof typeof PRESENTATION_TYPE_PROMPTS]
  const toneConfig = TONE_MODIFIERS[request.tone as keyof typeof TONE_MODIFIERS]

  // Generate framework-specific guidance, defaulting to SCQA if none provided
  const frameworkGuidance = selectedFramework
    ? generateFrameworkPrompt(selectedFramework)
    : `
SELECTED FRAMEWORK: SCQA (DEFAULT)
Framework Description: Situation-Complication-Question-Answer framework for problem-solving presentations

Framework Structure:
- Situation: Establish current context and environment
- Complication: Identify the core problem or challenge
- Question: Frame the critical question that needs answering
- Answer: Provide your solution or recommendation

IMPLEMENTATION INSTRUCTIONS:
Structure the presentation to follow the SCQA progression for optimal problem-solving flow.`

  return `${SYSTEM_PROMPT}

${frameworkGuidance}

PRESENTATION REQUIREMENTS:
- Type: ${request.presentation_type}
- Focus: ${typeConfig.focus}
- Structure: ${typeConfig.structure}
- Tone: ${toneConfig}
- Slide Count: ${request.slide_count}
- Target Audience: ${request.audience || 'General business audience'}

USER PROMPT:
"${request.prompt}"

Generate a ${request.slide_count}-slide presentation that addresses the user's prompt.

CONTENT CREATION GUIDELINES:
- Apply the selected framework structure across the presentation arc
- Lead each slide with the main point, support with reasoning and examples
- Ensure logical progression following the framework's sequence
- Include quantifiable examples and business metrics where relevant
- Make each slide contribute meaningfully to the overall framework narrative

IMPORTANT: Respond ONLY with valid JSON matching this exact structure:
{
  "id": "unique-presentation-id",
  "title": "Presentation Title",
  "subtitle": "Compelling Subtitle",
  "description": "Brief description of the presentation",
  "metadata": {
    "author": "AI Generated",
    "created_at": "${new Date().toISOString()}",
    "presentation_type": "${request.presentation_type}",
    "target_audience": "${request.audience || 'General business audience'}",
    "estimated_duration": ${Math.ceil(parseInt(request.slide_count) * 2.5)},
    "slide_count": ${request.slide_count},
    "tone": "${request.tone}",
    "version": "1.0"
  },
  "slides": [
    // Array of slide objects following these detailed schemas:

    // TITLE SLIDE (layout: "title-only")
    {
      "id": "slide-1",
      "type": "title",
      "title": "Main Presentation Title",
      "subtitle": "Compelling Subtitle",
      "layout": "title-only",
      "content": {
        "mainText": "Additional context or value proposition",
        "callout": "Strategic insight or key message"
      },
      "metadata": {
        "speaker_notes": "Opening remarks and context setting",
        "duration_minutes": 2,
        "audience_level": "executive"
      }
    },

    // PROBLEM SLIDE (layout: "title-content")
    {
      "id": "slide-2",
      "type": "problem",
      "title": "Current Challenges",
      "layout": "title-content",
      "content": {
        "sections": [
          {
            "title": "Resource Visibility Gap",
            "description": "Teams lack unified view of capacity allocation",
            "items": ["No centralized resource tracking", "Disconnected planning tools", "Manual coordination overhead"]
          },
          {
            "title": "Strategic Misalignment",
            "description": "Initiatives don't align with business priorities",
            "items": ["Unclear priorities", "Competing objectives", "Resource conflicts"]
          }
        ],
        "keyMetrics": [
          {"label": "Teams with visibility issues", "value": "78%", "description": "struggle with resource planning", "trend": "down"},
          {"label": "Project delays due to resource conflicts", "value": "45%", "description": "experience timeline impacts", "trend": "up"}
        ],
        "callout": "Critical insight: Resource conflicts are the #1 cause of project delays"
      },
      "metadata": {
        "speaker_notes": "Emphasize business impact and pain points",
        "duration_minutes": 3
      }
    },

    // SOLUTION SLIDE (layout: "two-column")
    {
      "id": "slide-3",
      "type": "solution",
      "title": "Unified Capacity Management Solution",
      "layout": "two-column",
      "content": {
        "sections": [
          {
            "title": "Consolidated Scope Registry",
            "description": "Create a single source capturing every initiative across all teams",
            "items": ["All current work", "Planned initiatives", "Future roadmap items"],
            "highlight": true
          },
          {
            "title": "Resource Mapping",
            "description": "Assign people and skills to each scope item with clear ownership",
            "items": ["Team assignments", "Individual allocations", "Skill requirements"]
          },
          {
            "title": "Capacity Planning",
            "description": "Define monthly percentage allocations for each resource",
            "items": ["Time allocation %", "Capacity constraints", "Over/under allocation visibility"]
          },
          {
            "title": "Cross-Team Dependencies",
            "description": "Track demand for matrix resources and external dependencies",
            "items": ["Matrix team needs", "Skill dependencies", "Resource sharing"]
          }
        ],
        "keyMetrics": [
          {"label": "Resource utilization improvement", "value": "35%", "description": "through optimized allocation", "trend": "up"},
          {"label": "Planning time reduction", "value": "60%", "description": "with automated insights", "trend": "up"}
        ]
      }
    },

    // FRAMEWORK SLIDE (layout: "diagram")
    {
      "id": "slide-4",
      "type": "framework",
      "title": "Implementation Framework",
      "layout": "diagram",
      "content": {
        "diagram": {
          "type": "process",
          "elements": [
            {
              "id": "assess",
              "label": "Assess",
              "description": "Current state analysis",
              "style": "primary",
              "connections": ["design"]
            },
            {
              "id": "design",
              "label": "Design",
              "description": "Framework architecture",
              "style": "primary",
              "connections": ["implement"]
            },
            {
              "id": "implement",
              "label": "Implement",
              "description": "Rollout and adoption",
              "style": "primary",
              "connections": ["optimize"]
            },
            {
              "id": "optimize",
              "label": "Optimize",
              "description": "Continuous improvement",
              "style": "accent"
            }
          ]
        },
        "sections": [
          {
            "title": "Phase 1: Foundation",
            "description": "Establish core framework components",
            "items": ["Scope registry setup", "Resource mapping", "Initial capacity planning"]
          }
        ]
      }
    },

    // BENEFITS SLIDE (layout: "metrics")
    {
      "id": "slide-5",
      "type": "benefits",
      "title": "Expected Benefits & ROI",
      "layout": "metrics",
      "content": {
        "keyMetrics": [
          {"label": "Resource utilization", "value": "+35%", "description": "through optimized allocation", "trend": "up"},
          {"label": "Project delivery time", "value": "-25%", "description": "with better planning", "trend": "down"},
          {"label": "Planning efficiency", "value": "+60%", "description": "automated insights", "trend": "up"},
          {"label": "Resource conflicts", "value": "-70%", "description": "proactive identification", "trend": "down"}
        ],
        "sections": [
          {
            "title": "Strategic Benefits",
            "description": "Long-term organizational improvements",
            "items": ["Better strategic alignment", "Improved team collaboration", "Data-driven decisions"]
          },
          {
            "title": "Operational Benefits",
            "description": "Day-to-day efficiency gains",
            "items": ["Reduced planning overhead", "Faster resource allocation", "Clear accountability"]
          }
        ],
        "callout": "ROI achieved within 6 months through improved resource efficiency"
      }
    },

    // IMPLEMENTATION SLIDE (layout: "three-column")
    {
      "id": "slide-6",
      "type": "implementation",
      "title": "Implementation Roadmap",
      "layout": "three-column",
      "content": {
        "sections": [
          {
            "title": "Phase 1: Foundation (Months 1-2)",
            "description": "Establish core components",
            "items": ["Scope registry creation", "Resource mapping", "Basic capacity planning", "Team onboarding"]
          },
          {
            "title": "Phase 2: Integration (Months 3-4)",
            "description": "Connect systems and processes",
            "items": ["Tool integrations", "Automated reporting", "Cross-team workflows", "Training programs"]
          },
          {
            "title": "Phase 3: Optimization (Months 5-6)",
            "description": "Refine and enhance",
            "items": ["Process optimization", "Advanced analytics", "Continuous improvement", "Best practice sharing"]
          }
        ],
        "keyMetrics": [
          {"label": "Implementation timeline", "value": "6 months", "description": "end-to-end deployment"},
          {"label": "Team training", "value": "2 weeks", "description": "per team onboarding"}
        ]
      }
    },

    // CONCLUSION SLIDE (layout: "centered")
    {
      "id": "slide-7",
      "type": "conclusion",
      "title": "Next Steps & Recommendations",
      "layout": "centered",
      "content": {
        "bulletPoints": [
          "Approve framework implementation plan",
          "Assign dedicated project team",
          "Begin Phase 1 scope registry development",
          "Schedule weekly progress reviews",
          "Plan team training sessions"
        ],
        "callout": "Success depends on leadership commitment and cross-team collaboration",
        "quote": "Effective capacity management is the foundation of strategic execution"
      },
      "metadata": {
        "speaker_notes": "Emphasize urgency and clear next steps",
        "duration_minutes": 2
      }
    }
  ]
}

Make each slide compelling and actionable. Include speaker notes for complex concepts. Use appropriate slide types and layouts for the content.`
}

export const SLIDE_TYPE_TEMPLATES = {
  title: {
    layout: "title-only",
    required_fields: ["title", "subtitle"],
    optional_fields: ["mainText"]
  },
  agenda: {
    layout: "bullet-list",
    required_fields: ["title", "bulletPoints"],
    optional_fields: ["subtitle"]
  },
  problem: {
    layout: "title-content",
    required_fields: ["title", "sections"],
    optional_fields: ["keyMetrics", "callout"]
  },
  solution: {
    layout: "two-column",
    required_fields: ["title", "sections"],
    optional_fields: ["keyMetrics", "diagram"]
  },
  framework: {
    layout: "diagram",
    required_fields: ["title", "diagram"],
    optional_fields: ["sections", "callout"]
  },
  implementation: {
    layout: "three-column",
    required_fields: ["title", "sections"],
    optional_fields: ["timeline", "keyMetrics"]
  },
  benefits: {
    layout: "metrics",
    required_fields: ["title", "keyMetrics"],
    optional_fields: ["sections", "callout"]
  },
  timeline: {
    layout: "diagram",
    required_fields: ["title", "diagram"],
    optional_fields: ["sections"]
  },
  conclusion: {
    layout: "centered",
    required_fields: ["title", "bulletPoints"],
    optional_fields: ["callout", "quote"]
  }
}
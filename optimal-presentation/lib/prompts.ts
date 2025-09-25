import { GenerationRequest } from './types'
import { Framework } from './validation/supportedFrameworks'
import { OutlineGenerationRequest, SlideOutline, PresentationOutline } from './types/outline'

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
  pov: {
    focus: "Strategic perspective, thought leadership, industry insights, informed opinion",
    tone: "Authoritative, insightful, forward-thinking"
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

  return `You are an expert presentation designer. Create a ${request.slide_count}-slide presentation with these requirements:

CONTENT REQUIREMENTS:
- Topic: ${request.prompt}
- Type: ${request.presentation_type} (${typeConfig.focus})
- Tone: ${toneConfig}
- Audience: ${request.audience || 'General business audience'}

CRITICAL: Respond with ONLY valid JSON. No markdown, no extra text, no comments.

Required JSON structure:
{
  "id": "pres-${Date.now()}",
  "title": "Presentation Title",
  "subtitle": "Subtitle",
  "description": "Brief description",
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
    {
      "id": "slide-1",
      "type": "title",
      "title": "Title",
      "subtitle": "Subtitle",
      "layout": "title-only",
      "content": {
        "mainText": "Main message",
        "callout": "Key insight",
        "sections": [
          {
            "title": "Section Title",
            "description": "Section description",
            "items": ["Item 1", "Item 2", "Item 3"]
          }
        ],
        "keyMetrics": [
          {
            "label": "Metric name",
            "value": "Metric value",
            "description": "Metric description",
            "trend": "up/down/stable"
          }
        ],
        "bulletPoints": ["Point 1", "Point 2"],
        "quote": "Inspiring quote",
        "chart": {
          "type": "bar/line/area/pie/donut",
          "data": [{"name": "Item 1", "value": 100}],
          "config": {"value": {"label": "Sales", "color": "#8884d8"}},
          "title": "Chart Title",
          "description": "Chart description"
        },
        "table": {
          "headers": ["Column 1", "Column 2"],
          "rows": [["Row 1 Col 1", "Row 1 Col 2"]],
          "title": "Table Title",
          "description": "Table description",
          "highlight": [0]
        },
        "timeline": {
          "events": [
            {
              "id": "event-1",
              "title": "Event Title",
              "description": "Event description",
              "date": "Q1 2024",
              "status": "completed/current/upcoming"
            }
          ],
          "title": "Timeline Title",
          "description": "Timeline description",
          "orientation": "horizontal/vertical"
        }
      },
      "metadata": {
        "speaker_notes": "Notes",
        "duration_minutes": 2,
        "audience_level": "executive"
      }
    }
  ]
}

Each slide needs: id, type, title, layout, content, metadata.
Example slide types: title, problem, solution, benefits, implementation, conclusion, chart, table, etc
Example layouts: title-only, title-content, two-column, three-column, centered, metrics, chart, table, timeline, circle, diamond, etc

Return valid JSON only.`
}

/**
 * Generate a prompt for creating a presentation outline
 * This is Phase 1 of the iterative generation approach
 */
export function generateOutlinePrompt(
  request: OutlineGenerationRequest,
  framework: Framework
): string {
  const frameworkStructure = framework.structure
    .map(step => `- ${step.step}: ${step.description}`)
    .join('\n')

  const typeConfig = PRESENTATION_TYPE_PROMPTS[request.presentation_type as keyof typeof PRESENTATION_TYPE_PROMPTS]

  return `You are a presentation structure expert. Create a detailed outline without full content.

REQUIREMENTS:
- Topic: ${request.prompt}
- Type: ${request.presentation_type} (Focus: ${typeConfig?.focus || 'General business focus'})
- Slides: ${request.slide_count}
- Audience: ${request.audience || 'General business audience'}
- Tone: ${request.tone || 'professional'}

FRAMEWORK: ${framework.name.toUpperCase()}
${framework.description}

Structure:
${frameworkStructure}

Generate a presentation outline following the ${framework.name} framework.
Each slide should have a clear purpose in the narrative flow.

CRITICAL: Return ONLY valid JSON, no markdown or extra text.

{
  "id": "outline-${Date.now()}",
  "title": "Clear, compelling title",
  "subtitle": "Supporting subtitle",
  "description": "Brief presentation description",
  "metadata": {
    "author": "AI Generated",
    "created_at": "${new Date().toISOString()}",
    "presentation_type": "${request.presentation_type}",
    "target_audience": "${request.audience || 'General business audience'}",
    "estimated_duration": ${Math.ceil(parseInt(request.slide_count) * 2.5)},
    "slide_count": ${request.slide_count},
    "tone": "${request.tone || 'professional'}",
    "framework": "${framework.name}",
    "version": "1.0"
  },
  "slides": [
    {
      "slideNumber": 1,
      "type": "title/problem/solution/benefits/implementation/framework/timeline/conclusion",
      "title": "Specific slide title",
      "purpose": "What this slide achieves",
      "keyPoints": ["Main point 1", "Main point 2"],
      "frameworkAlignment": "How it fits ${framework.name}"
    }
  ],
  "frameworkStructure": {
    "framework": "${framework.name}",
    "flowDescription": "How slides follow the framework",
    "narrativeArc": "Overall story progression"
  }
}`
}

/**
 * Generate a prompt for creating a single slide
 * This is Phase 2 of the iterative generation approach
 */
export function generateSlidePrompt(
  slideInfo: SlideOutline,
  presentationContext: PresentationOutline,
  previousSlides?: any[]
): string {
  const slideTemplate = SLIDE_TYPE_TEMPLATES[slideInfo.type as keyof typeof SLIDE_TYPE_TEMPLATES]

  let contextSummary = ''
  if (previousSlides && previousSlides.length > 0) {
    const recentSlides = previousSlides.slice(-2) // Last 2 slides for context
    contextSummary = `\n\nPREVIOUS SLIDES CONTEXT:
${recentSlides.map(s => `- Slide ${s.id}: ${s.title}`).join('\n')}`
  }

  return `Generate slide ${slideInfo.slideNumber} of ${presentationContext.metadata.slide_count}.

PRESENTATION CONTEXT:
Title: ${presentationContext.title}
Framework: ${presentationContext.metadata.framework}
Audience: ${presentationContext.metadata.target_audience}

CURRENT SLIDE:
Number: ${slideInfo.slideNumber}
Type: ${slideInfo.type}
Title: ${slideInfo.title}
Purpose: ${slideInfo.purpose}
Key Points: ${slideInfo.keyPoints?.join(', ') || 'N/A'}
Framework Alignment: ${slideInfo.frameworkAlignment}${contextSummary}

Generate ONLY this slide's JSON following the ${slideInfo.type} structure.
Include appropriate content based on the slide's purpose and type.

CRITICAL: Return ONLY the slide JSON object, not the full presentation.

{
  "id": "slide-${slideInfo.slideNumber}",
  "type": "${slideInfo.type}",
  "title": "${slideInfo.title}",
  "layout": "${slideTemplate?.layout || 'title-content'}",
  "content": {
    // Add appropriate content fields for ${slideInfo.type} slide
  },
  "metadata": {
    "speaker_notes": "Notes for presenting this slide",
    "duration_minutes": 2,
    "audience_level": "executive"
  }
}`
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
    layout: "timeline",
    required_fields: ["title", "timeline"],
    optional_fields: ["sections", "keyMetrics"]
  },
  benefits: {
    layout: "metrics",
    required_fields: ["title", "keyMetrics"],
    optional_fields: ["sections", "callout"]
  },
  timeline: {
    layout: "timeline",
    required_fields: ["title", "timeline"],
    optional_fields: ["sections"]
  },
  conclusion: {
    layout: "centered",
    required_fields: ["title", "bulletPoints"],
    optional_fields: ["callout", "quote"]
  },
  chart: {
    layout: "chart",
    required_fields: ["title", "chart"],
    optional_fields: ["subtitle", "callout"]
  },
  table: {
    layout: "table",
    required_fields: ["title", "table"],
    optional_fields: ["subtitle", "callout"]
  },
  circle: {
    layout: "circle",
    required_fields: ["title", "mainText"],
    optional_fields: ["sections", "callout", "quote"]
  },
  diamond: {
    layout: "diamond",
    required_fields: ["title", "mainText"],
    optional_fields: ["sections", "callout", "quote"]
  }
}
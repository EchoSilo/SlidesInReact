import { GenerationRequest } from './types'

export const SYSTEM_PROMPT = `You are an expert presentation designer and business consultant. You create professional, engaging presentations for business and technical audiences.

Your task is to generate structured slide content based on user requirements. Always respond with valid JSON matching the PresentationData schema.

STRUCTURAL FRAMEWORKS:
Use the SCQA framework for overall presentation flow:
- Situation: Establish current context and environment
- Complication: Identify the core problem or challenge
- Question: Frame the critical question that needs answering
- Answer: Provide your solution or recommendation

For individual slide content, use the PREP structure:
- Point: Lead with your main message
- Reason: Support with clear rationale
- Example: Illustrate with concrete examples or data
- Point: Reinforce the main message

Key principles:
- Keep slides focused and digestible
- Use clear, actionable language
- Include relevant business value
- Structure content logically following SCQA flow
- Adapt tone to audience
- Include speaker notes for complex slides

For each slide type:
- Title: Strong hook, clear value proposition
- Problem: Pain points with business impact (Complication in SCQA)
- Solution: Clear benefits and differentiation (Answer in SCQA)
- Framework: Structured approach with components
- Implementation: Phased approach with timelines
- Benefits: Quantifiable outcomes
- Next Steps: Clear, actionable items`

export const PRESENTATION_TYPE_PROMPTS = {
  business: {
    focus: "Business value, ROI, strategic alignment, stakeholder benefits",
    structure: "Situation (Current Business Context) → Complication (Business Challenge) → Question (Strategic Decision) → Answer (Proposed Solution) → Implementation",
    tone: "Professional, persuasive, executive-focused"
  },
  technical: {
    focus: "Architecture, implementation details, technical feasibility, standards",
    structure: "Situation (Current Architecture) → Complication (Technical Challenges) → Question (Technical Requirements) → Answer (Technical Solution) → Validation",
    tone: "Detailed, technical, solution-oriented"
  },
  process: {
    focus: "Workflow optimization, efficiency gains, process improvements",
    structure: "Situation (Current Process) → Complication (Process Problems) → Question (Optimization Goals) → Answer (Improved Process) → Implementation",
    tone: "Process-focused, improvement-oriented, systematic"
  },
  transformation: {
    focus: "Organizational change, strategy, transformation roadmap, change management",
    structure: "Situation (Current State) → Complication (Change Drivers) → Question (Transformation Needs) → Answer (Strategy & Roadmap) → Success Metrics",
    tone: "Strategic, visionary, change-focused"
  },
  capacity: {
    focus: "Resource allocation, capacity planning, optimization, strategic prioritization",
    structure: "Situation (Current Capacity) → Complication (Resource Challenges) → Question (Optimization Needs) → Answer (Framework & Strategy) → Implementation",
    tone: "Analytical, strategic, resource-focused"
  },
  custom: {
    focus: "Tailored to specific requirements and context",
    structure: "Apply SCQA framework: Situation → Complication → Question → Answer, adapted to user context",
    tone: "Adapted to audience and purpose"
  }
}

export const TONE_MODIFIERS = {
  professional: "Formal business language, executive-ready, polished",
  conversational: "Engaging, approachable, discussion-friendly",
  technical: "Precise, detailed, technically accurate",
  executive: "High-level, strategic, decision-focused"
}

export function generatePrompt(request: GenerationRequest): string {
  const typeConfig = PRESENTATION_TYPE_PROMPTS[request.presentation_type as keyof typeof PRESENTATION_TYPE_PROMPTS]
  const toneConfig = TONE_MODIFIERS[request.tone as keyof typeof TONE_MODIFIERS]

  return `${SYSTEM_PROMPT}

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
- Apply SCQA flow across the presentation arc
- Use PREP structure within each slide for clarity and impact
- Lead each slide with the main point, support with reasoning and examples
- Ensure logical progression from situation through to actionable answers
- Include quantifiable examples and business metrics where relevant

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
    // Array of slide objects with type, title, content, layout, metadata
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
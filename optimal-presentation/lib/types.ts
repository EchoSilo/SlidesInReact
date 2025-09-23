export interface SlideData {
  id: string
  type: SlideType
  title: string
  subtitle?: string
  content: SlideContent
  layout: SlideLayout
  metadata?: SlideMetadata
}

export type SlideType =
  | "title"
  | "agenda"
  | "problem"
  | "solution"
  | "framework"
  | "implementation"
  | "benefits"
  | "timeline"
  | "team"
  | "next-steps"
  | "conclusion"
  | "custom"

export interface SlideContent {
  mainText?: string
  bulletPoints?: string[]
  sections?: Section[]
  keyMetrics?: KeyMetric[]
  diagram?: DiagramData
  quote?: string
  callout?: string
}

export interface Section {
  title: string
  description: string
  items?: string[]
  highlight?: boolean
}

export interface KeyMetric {
  label: string
  value: string
  description?: string
  trend?: "up" | "down" | "stable"
}

export interface DiagramData {
  type: "flow" | "hierarchy" | "process" | "comparison"
  elements: DiagramElement[]
}

export interface DiagramElement {
  id: string
  label: string
  description?: string
  position?: { x: number; y: number }
  connections?: string[]
  style?: "primary" | "secondary" | "accent" | "warning"
}

export type SlideLayout =
  | "title-only"
  | "title-content"
  | "two-column"
  | "three-column"
  | "bullet-list"
  | "centered"
  | "diagram"
  | "metrics"
  | "quote"

export interface SlideMetadata {
  speaker_notes?: string
  duration_minutes?: number
  audience_level?: "executive" | "technical" | "general"
  importance?: "critical" | "important" | "supporting"
}

export interface PresentationData {
  id: string
  title: string
  subtitle: string
  description: string
  metadata: PresentationMetadata
  slides: SlideData[]
}

export interface PresentationMetadata {
  author?: string
  created_at: string
  presentation_type: string
  target_audience: string
  estimated_duration: number
  slide_count: number
  tone: string
  version: string
}

export interface GenerationRequest {
  prompt: string
  presentation_type: string
  slide_count: number
  audience?: string
  tone: string
}

export interface GenerationResponse {
  success: boolean
  presentation?: PresentationData
  error?: string
  generation_id: string
}
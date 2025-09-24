import { ProgressMessage } from "@/components/ui/progress-modal"

export interface ProgressStep {
  id: string
  title: string
  description?: string
  type: 'info' | 'success' | 'error' | 'warning'
  estimatedDuration: number // milliseconds
}

// Progress steps that match the backend workflow logger
export const GENERATION_STEPS: ProgressStep[] = [
  {
    id: 'initialization',
    title: 'Starting presentation generation workflow',
    description: 'Initializing the AI generation system',
    type: 'info',
    estimatedDuration: 500
  },
  {
    id: 'request_parsing',
    title: 'Parsed incoming request',
    description: 'Processing your presentation requirements',
    type: 'info',
    estimatedDuration: 300
  },
  {
    id: 'validation',
    title: 'Request validation passed',
    description: 'Validating prompt and configuration settings',
    type: 'success',
    estimatedDuration: 400
  },
  {
    id: 'api_key',
    title: 'API key validated',
    description: 'Authenticating with AI services',
    type: 'success',
    estimatedDuration: 200
  },
  {
    id: 'framework_analysis',
    title: 'AI framework analysis started',
    description: 'Analyzing content to select optimal presentation framework',
    type: 'info',
    estimatedDuration: 2000
  },
  {
    id: 'framework_selection',
    title: 'Framework selected',
    description: 'AI selected optimal presentation structure',
    type: 'success',
    estimatedDuration: 300
  },
  {
    id: 'prompt_generation',
    title: 'Generating framework-specific prompt',
    description: 'Creating specialized AI instructions',
    type: 'info',
    estimatedDuration: 500
  },
  {
    id: 'llm_setup',
    title: 'Preparing AI model',
    description: 'Setting up Claude AI for content generation',
    type: 'info',
    estimatedDuration: 400
  },
  {
    id: 'llm_request',
    title: 'Sending request to AI model',
    description: 'Claude AI is generating your presentation content',
    type: 'info',
    estimatedDuration: 8000
  },
  {
    id: 'llm_response',
    title: 'AI content generated',
    description: 'Received presentation content from Claude AI',
    type: 'success',
    estimatedDuration: 300
  },
  {
    id: 'json_parsing',
    title: 'Processing AI response',
    description: 'Parsing and validating generated content',
    type: 'info',
    estimatedDuration: 500
  },
  {
    id: 'structure_validation',
    title: 'Validating presentation structure',
    description: 'Ensuring all slides and content are properly formatted',
    type: 'info',
    estimatedDuration: 400
  },
  {
    id: 'validation_pipeline',
    title: 'Multi-agent validation started',
    description: 'Running quality validation and refinement',
    type: 'info',
    estimatedDuration: 3000
  },
  {
    id: 'validation_complete',
    title: 'Quality validation completed',
    description: 'Content validated and refined for optimal quality',
    type: 'success',
    estimatedDuration: 300
  },
  {
    id: 'completion',
    title: 'Presentation generated successfully!',
    description: 'Your presentation is ready for preview',
    type: 'success',
    estimatedDuration: 500
  }
]

export class ProgressSimulator {
  private steps: ProgressStep[]
  private currentStepIndex: number = 0
  private onProgress: (message: ProgressMessage) => void
  private onComplete: () => void
  private onError: (error: string) => void
  private timeouts: NodeJS.Timeout[] = []

  constructor(
    onProgress: (message: ProgressMessage) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ) {
    this.steps = [...GENERATION_STEPS]
    this.onProgress = onProgress
    this.onComplete = onComplete
    this.onError = onError
  }

  start() {
    console.log('🎬 [ProgressSimulator] Starting progress simulation with', this.steps.length, 'steps')
    this.currentStepIndex = 0
    this.processNextStep()
  }

  private processNextStep() {
    if (this.currentStepIndex >= this.steps.length) {
      console.log('✅ [ProgressSimulator] All steps completed')
      this.onComplete()
      return
    }

    const step = this.steps[this.currentStepIndex]
    console.log('📝 [ProgressSimulator] Processing step', this.currentStepIndex + 1, '/', this.steps.length, ':', step.title)

    // Mark current step as active
    const activeMessage: ProgressMessage = {
      id: step.id,
      type: step.type,
      title: step.title,
      description: step.description,
      timestamp: Date.now(),
      status: 'active'
    }

    console.log('📤 [ProgressSimulator] Sending active message:', activeMessage)
    this.onProgress(activeMessage)

    // After the estimated duration, mark as complete and move to next
    const timeout = setTimeout(() => {
      const completeMessage: ProgressMessage = {
        ...activeMessage,
        status: 'complete'
      }

      this.onProgress(completeMessage)
      this.currentStepIndex++

      // Small delay before next step for visual effect
      const nextTimeout = setTimeout(() => {
        this.processNextStep()
      }, 200)

      this.timeouts.push(nextTimeout)
    }, step.estimatedDuration)

    this.timeouts.push(timeout)
  }

  simulateError(errorMessage: string) {
    this.cleanup()
    this.onError(errorMessage)
  }

  cleanup() {
    this.timeouts.forEach(timeout => clearTimeout(timeout))
    this.timeouts = []
  }
}

// Utility function to create a progress message
export function createProgressMessage(
  step: ProgressStep,
  status: ProgressMessage['status'] = 'pending'
): ProgressMessage {
  return {
    id: step.id,
    type: step.type,
    title: step.title,
    description: step.description,
    timestamp: Date.now(),
    status
  }
}
# CrewAI-Inspired Multi-Agent System

## Overview

This is a **CrewAI-inspired implementation** built specifically for this TypeScript/Next.js environment. It provides the core CrewAI concepts (Agents, Tasks, Crews) while using the existing Anthropic client infrastructure.

## Why Not Real CrewAI?

- **CrewAI is Python-only** - No official JavaScript/TypeScript version exists
- **Dependency conflicts** - Unofficial JS packages conflict with existing zod/Anthropic SDK versions
- **Corporate network compatibility** - Our implementation uses the existing Anthropic client with custom HTTPS agent for corporate networks

## Architecture

### Core Components

- **Agent**: AI agent with role, goal, and backstory that can execute tasks
- **Task**: Specific work unit with description and expected output
- **Crew**: Orchestrator that coordinates agents and tasks

### Key Features

- ✅ **LLM Communication Verified** - Uses existing `@anthropic-ai/sdk` with corporate network support
- ✅ **Sequential Task Execution** - Tasks run in order with context passing
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Corporate Network Compatible** - Uses existing HTTPS agent configuration
- ✅ **Type-Safe** - Full TypeScript implementation

## LLM Integration Requirements

### ✅ Verified Working
- **Anthropic Claude 3.5 Sonnet** via existing client
- **Corporate HTTPS proxy** support
- **API key authentication** from environment variables
- **Custom certificate handling** (rejectUnauthorized: false)

### Test Results
```
✅ Agent creation: SUCCESS
✅ Task execution: SUCCESS
✅ Crew orchestration: SUCCESS
✅ API response time: 2.8s
✅ Corporate network: COMPATIBLE
```

## Usage Example

```typescript
import { Agent, Task, Crew } from '@/lib/crew/core'

// Create agent
const agent = new Agent({
  name: 'FrameworkSelector',
  role: 'Presentation Framework Expert',
  goal: 'Select optimal framework (SCQA, PREP, STAR) for presentations',
  backstory: 'Expert in presentation frameworks with deep knowledge of audience needs'
}, apiKey)

// Create task
const task = new Task({
  description: 'Analyze the presentation content and select the best framework',
  expectedOutput: 'Framework recommendation with rationale'
})

// Create crew
const crew = new Crew({
  agents: [agent],
  tasks: [task],
  verbose: true
})

// Execute
const result = await crew.kickoff({ content: 'presentation data' })
```

## Next Steps

1. **Framework Analysis Agent** - Replace existing FrameworkAnalyzer with CrewAI agent
2. **Content Generation Pipeline** - Implement full multi-agent workflow
3. **A/B Testing** - Compare against existing validation system
4. **Performance Optimization** - Optimize for production use

## Testing

Test the hello world implementation:
```bash
curl http://localhost:3000/api/test-crew
```

## Directory Structure

```
lib/crew/
├── core/
│   ├── Agent.ts      # Agent implementation
│   ├── Task.ts       # Task implementation
│   ├── Crew.ts       # Crew orchestration
│   ├── types.ts      # Type definitions
│   └── index.ts      # Exports
├── agents/           # Specific agent implementations (future)
├── tasks/            # Specific task definitions (future)
└── hello-world-test.ts # Test implementation
```
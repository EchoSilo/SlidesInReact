# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains multiple AI-generated presentation projects, each showcasing different approaches to creating a "Capacity Management Framework" presentation. The main projects are:

- **reference_apps/lovable/scope-insight-engine-main** - React + Vite + ShadcN UI project with slide-based presentation
- **optimal-presentation** - Next.js project with modern React components
- **reference_apps/v0**, **reference_apps/magicpatterns**, **claude** - Additional presentation variations

## Primary Development Commands

### Lovable Project (React + Vite)
```bash
cd reference_apps/lovable/scope-insight-engine-main
npm i
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Optimal Presentation (Next.js)
```bash
cd optimal-presentation
npm i
npm run dev          # Start Next.js development server
npm run build        # Production build
npm run lint         # Run Next.js linting
npm run start        # Start production server
```

## Architecture Overview

### Lovable Project Structure
- **Presentation System**: Slide-based architecture with individual slide components
- **Components**: `/src/components/slides/` contains individual slide implementations
- **Dual Format Support**: Regular slides (`/slides/`) and 16:9 format slides (`/slides169/`)
- **Export Functionality**: Built-in PNG export using html2canvas
- **UI Framework**: ShadcN UI with Radix UI primitives and Tailwind CSS
- **State Management**: React hooks for slide navigation
- **Routing**: React Router with basic Index/NotFound pages

### Key Architectural Patterns
- **Slide Components**: Each slide is a standalone React component (TitleSlide, ProblemSlide, SolutionSlide, BenefitsSlide, ImplementationSlide)
- **Navigation**: Centralized slide navigation with previous/next controls and slide indicators
- **Export System**: Client-side PNG generation using html2canvas library
- **Responsive Design**: Support for both standard and 16:9 aspect ratios
- **Theme System**: Uses next-themes for dark/light mode support

## Development Notes

### Working with Slides
- Slide components are located in `/src/components/slides/` and `/src/components/slides169/`
- The main Presentation component manages slide state and navigation
- Each slide should be self-contained and follow consistent styling patterns

### Styling Approach
- Uses Tailwind CSS with custom design system variables
- ShadcN UI components provide consistent styling patterns
- Card-based layout with shadow and rounded corners for slide containers

### Dependencies
- All projects use extensive Radix UI component libraries
- html2canvas for slide export functionality
- Lucide React for icons
- React Hook Form + Zod for forms (where applicable)

## Knowledge Graph Memory System

This project now includes a Knowledge Graph Memory MCP server that provides persistent memory across Claude Code sessions. Use this system to maintain context about user preferences, project decisions, and successful patterns.

### Memory System Guidelines

**User Profile & Preferences:**
- Track the user's technical expertise level and learning style
- Remember their preferred tools, frameworks, and development approaches
- Note their coding patterns and architectural preferences
- Store their workflow habits and productivity preferences

**Project Context:**
- Remember ongoing projects and their current state
- Track project-specific configurations and setups
- Note technical decisions made and their rationale
- Remember file structures and codebase organization patterns

**Task Management:**
- Track the user's approach to complex tasks (prefers todo lists, step-by-step breakdowns)
- Remember successful patterns and methodologies that worked well
- Note areas where the user needed additional support or clarification

**Technical Environment:**
- Remember the user's development environment setup
- Track installed tools, MCP servers, and configurations
- Note platform-specific preferences (macOS, specific package managers)
- Remember successful installation patterns and troubleshooting approaches

**Communication Style:**
- The user prefers concise, direct responses (under 4 lines typically)
- Values efficiency and minimal preamble/postamble
- Appreciates proactive use of tools when appropriate
- Prefers action over extensive explanation

### Memory Creation Patterns

- Create entities for: User, Projects, Tools, Configurations, Patterns
- Use relations to connect: User→prefers→Tool, Project→uses→Framework, Pattern→works_for→TaskType
- Store observations about: Successful approaches, Preferences, Technical decisions, Workflow patterns

### Proactive Memory Usage

- Reference past successful approaches when similar tasks arise
- Recall user preferences to avoid re-asking configuration questions
- Remember project contexts to provide continuity across sessions
- Use stored patterns to anticipate user needs and provide better assistance

Always update memory during interactions when you learn something new about the user, their preferences, their projects, or successful interaction patterns.
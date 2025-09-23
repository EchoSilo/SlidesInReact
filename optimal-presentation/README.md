# SLIDES IN REACT

Interactive Next.js presentation app with advanced export capabilities for capacity management, operational models, and strategic insights.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4+-38B2AC?style=flat-square&logo=tailwind-css)

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## ✨ Features

- **Interactive Presentations**: Slide-based presentation system with smooth navigation
- **Multiple Export Formats**:
  - PNG export using `html-to-image` library
  - PowerPoint (PPTX) export via `pptxgenjs`
- **Professional UI**: Built with ShadcN UI components and Radix primitives
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Theme Support**: Dark/light mode with `next-themes`
- **Multiple Presentation Types**:
  - Capacity Management Framework
  - Operational Models & Strategy
  - Scope Insights & Analytics

## 📦 Export Libraries

- **`html-to-image`** - High-quality PNG/JPEG slide exports with DOM-to-canvas conversion
- **`pptxgenjs`** - PowerPoint presentation generation with native PPTX format support
- **`html2canvas`** - Alternative canvas-based image export for compatibility

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: ShadcN UI + Radix UI primitives
- **Icons**: Lucide React icon library
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation
- **Analytics**: Vercel Analytics integration

## 📁 Project Structure

```
app/
├── components/          # Reusable UI components
├── capacity/           # Capacity management presentation
├── extension/          # Extension strategy presentation
├── scope-capacity/     # Scope insights presentation
├── opmodel/           # Operational model presentation
└── page.tsx           # Main presentation dashboard
```

## 🔧 Development Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Production build
npm run lint       # ESLint code linting
npm run start      # Start production server
```

## 🎯 Key Components

- **Slide Navigation**: Previous/next controls with slide indicators
- **Export System**: Client-side PNG and PPTX generation
- **Theme System**: Consistent dark/light mode across all presentations
- **Responsive Layout**: Card-based design with proper spacing and shadows
- **Form Handling**: Robust form validation with error handling

## 📊 Presentation Content

Each presentation includes:
- Executive summary slides
- Problem statement and analysis
- Solution frameworks and methodologies
- Implementation roadmaps
- Benefits and ROI analysis
- Interactive charts and visualizations

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
cd optimal-presentation
docker-compose up --build
```

### Using Docker Directly
```bash
cd optimal-presentation
docker build -t slides-in-react .
docker run -p 3000:3000 slides-in-react
```

The application will be available at `http://localhost:3000`

## 🚀 Traditional Deployment

Built for easy deployment on Vercel, Netlify, or any Node.js hosting platform:

```bash
npm run build
npm run start
```

## 📄 License

Private project for capacity management framework demonstrations.
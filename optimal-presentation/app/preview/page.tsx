"use client"

import { useState, useEffect } from 'react'
import { usePresentationData } from '@/hooks/usePresentationData'
import { DynamicSlide } from '@/components/dynamic-slides/DynamicSlide'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  X,
  Download,
  FileDown,
  FileImage,
  Plus,
  Trash2,
  Copy,
  Home
} from 'lucide-react'
import Link from 'next/link'
import { exportToPNG, exportToPPTX } from '@/lib/exportUtils'
import { ApiConnectionIndicator } from '@/components/ApiConnectionIndicator'

export default function PreviewPage() {
  const {
    presentation,
    currentSlide,
    currentSlideIndex,
    isEditing,
    hasUnsavedChanges,
    setIsEditing,
    updateSlide,
    updatePresentation,
    addSlide,
    removeSlide,
    duplicateSlide,
    goToSlide,
    nextSlide,
    previousSlide,
    saveChanges,
    discardChanges,
    isFirstSlide,
    isLastSlide,
    totalSlides
  } = usePresentationData()

  const [isExporting, setIsExporting] = useState(false)

  if (!presentation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Presentation Found</h1>
          <p className="text-muted-foreground mb-6">
            Generate a presentation first or check if your data is available.
          </p>
          <div className="space-x-4">
            <Link href="/generate">
              <Button className="bg-primary hover:bg-primary/90">
                Generate New Presentation
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Back to Hub
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const handleExport = async (format: 'png' | 'pptx') => {
    setIsExporting(true)
    try {
      if (format === 'png') {
        // Export current slide as PNG
        const slideElement = document.getElementById('current-slide')
        if (slideElement) {
          const filename = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-slide-${currentSlideIndex + 1}.png`
          await exportToPNG(slideElement, filename)
        }
      } else {
        // Export complete presentation to PPTX
        await exportToPPTX(presentation)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert(`${format.toUpperCase()} export failed. Please try again.`)
    } finally {
      setIsExporting(false)
    }
  }

  const createNewSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      type: 'custom' as const,
      title: 'New Slide',
      content: {
        mainText: 'Add your content here...'
      },
      layout: 'title-content' as const
    }
    addSlide(newSlide, currentSlideIndex + 1)
    goToSlide(currentSlideIndex + 1)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4 mr-2" />
                Hub
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {presentation.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {presentation.subtitle}
              </p>
            </div>
            {hasUnsavedChanges && (
              <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">
                Unsaved changes
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ApiConnectionIndicator showText={false} />

            {hasUnsavedChanges && (
              <div className="flex gap-1">
                <Button onClick={saveChanges} size="sm" variant="ghost">
                  <Save className="w-4 h-4" />
                </Button>
                <Button onClick={discardChanges} size="sm" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "ghost"}
              size="sm"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              {isEditing ? 'Exit Edit' : 'Edit'}
            </Button>

            <div className="flex gap-1">
              <Button
                onClick={() => handleExport('png')}
                disabled={isExporting}
                variant="ghost"
                size="sm"
              >
                <FileImage className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleExport('pptx')}
                disabled={isExporting}
                variant="ghost"
                size="sm"
              >
                <FileDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Slide Thumbnails */}
          <div className="col-span-3">
            <Card className="p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground text-sm">
                  {totalSlides} slides
                </h3>
                {isEditing && (
                  <Button
                    onClick={createNewSlide}
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                )}
              </div>

              <div className="space-y-1">
                {presentation.slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`group relative p-2 rounded cursor-pointer transition-all ${
                      index === currentSlideIndex
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => goToSlide(index)}
                  >
                    <div className="text-xs font-medium text-foreground mb-1 truncate">
                      {index + 1}. {slide.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {slide.layout}
                    </div>

                    {isEditing && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateSlide(index)
                          }}
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </Button>
                        {totalSlides > 1 && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSlide(index)
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Current Slide */}
          <div className="col-span-9 space-y-4">
            <Card className="p-0 overflow-hidden border border-gray-200 shadow-sm">
              <div
                id="current-slide"
                className="aspect-video bg-white"
                style={{ minHeight: '600px' }}
              >
                {currentSlide && (
                  <DynamicSlide
                    slide={currentSlide}
                    isEditing={isEditing}
                    onEdit={updateSlide}
                    className="h-full"
                  />
                )}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={previousSlide}
                disabled={isFirstSlide}
                variant="ghost"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {currentSlideIndex + 1} of {totalSlides}
                </span>
                <div className="flex gap-1">
                  {presentation.slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentSlideIndex
                          ? 'bg-primary'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={nextSlide}
                disabled={isLastSlide}
                variant="ghost"
                size="sm"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
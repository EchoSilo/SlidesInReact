"use client"

import { useState, useEffect } from 'react'
import { usePresentationData } from '@/hooks/usePresentationData'
import { DynamicSlide } from '@/components/dynamic-slides/DynamicSlide'
import { SlideChat } from '@/components/SlideChat'
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
  Home,
  MessageCircle,
  X as CloseIcon,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight
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
  const [showChat, setShowChat] = useState(true) // Default to true for Replit-style
  const [showNav, setShowNav] = useState(true) // Default to true for navigation panel
  const [navWidth, setNavWidth] = useState(250) // Default nav width
  const [chatWidth, setChatWidth] = useState(400) // Default chat width

  // Load panel preferences from localStorage
  useEffect(() => {
    const savedShowChat = localStorage.getItem('showChat')
    const savedShowNav = localStorage.getItem('showNav')
    if (savedShowChat !== null) setShowChat(savedShowChat === 'true')
    if (savedShowNav !== null) setShowNav(savedShowNav === 'true')
  }, [])

  // Save panel preferences to localStorage
  useEffect(() => {
    localStorage.setItem('showChat', showChat.toString())
    localStorage.setItem('showNav', showNav.toString())
  }, [showChat, showNav])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B: Toggle navigation
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setShowNav(prev => !prev)
      }
      // Ctrl/Cmd + K: Toggle chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowChat(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        const slideElement = document.getElementById('current-slide')
        if (slideElement) {
          const filename = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-slide-${currentSlideIndex + 1}.png`
          await exportToPNG(slideElement, filename)
        }
      } else {
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
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Slim Header - 3rem height like Replit */}
      <header className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="h-8">
              <Home className="w-4 h-4 mr-2" />
              Hub
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowNav(!showNav)}
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              title={`${showNav ? 'Hide' : 'Show'} navigation (Ctrl+B)`}
            >
              {showNav ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </Button>

            <span className="text-sm font-medium text-foreground">
              {presentation.title}
            </span>

            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                Unsaved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ApiConnectionIndicator showText={false} />

          {hasUnsavedChanges && (
            <>
              <Button onClick={saveChanges} size="sm" variant="ghost" className="h-8">
                <Save className="w-4 h-4" />
              </Button>
              <Button onClick={discardChanges} size="sm" variant="ghost" className="h-8">
                <X className="w-4 h-4" />
              </Button>
            </>
          )}

          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "default" : "ghost"}
            size="sm"
            className="h-8"
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
              className="h-8"
            >
              <FileImage className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleExport('pptx')}
              disabled={isExporting}
              variant="ghost"
              size="sm"
              className="h-8"
            >
              <FileDown className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={() => setShowChat(!showChat)}
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            title={`${showChat ? 'Hide' : 'Show'} chat (Ctrl+K)`}
          >
            {showChat ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content Area - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Slide Navigator */}
        <div
          className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ${
            showNav ? 'w-[250px]' : 'w-0'
          } overflow-hidden`}
        >
          <div className="p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                {totalSlides} slides
              </h3>
              {isEditing && (
                <Button
                  onClick={createNewSlide}
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {presentation.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`group relative p-2 rounded cursor-pointer transition-all ${
                    index === currentSlideIndex
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">
                        {index + 1}. {slide.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {slide.layout}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateSlide(index)
                          }}
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                        >
                          <Copy className="w-3 h-3" />
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
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Main Presentation Area */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full p-0 overflow-hidden border border-gray-200 shadow-sm bg-white">
              <div
                id="current-slide"
                className="h-full"
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
          </div>

          {/* Navigation Controls */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <Button
                onClick={previousSlide}
                disabled={isFirstSlide}
                variant="ghost"
                size="sm"
                className="h-8"
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
                className="h-8"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Assistant */}
        {presentation.slides && (
          <div
            className={`border-l border-gray-200 bg-white transition-all duration-300 ${
              showChat ? 'w-[400px]' : 'w-0'
            } overflow-hidden`}
          >
            <SlideChat
              slides={presentation.slides}
              currentSlideIndex={currentSlideIndex}
              onSlideUpdate={(slideIndex, updatedSlide) => {
                updateSlide(updatedSlide)
              }}
              onSlideChange={(slideIndex) => {
                goToSlide(slideIndex)
              }}
              onSlideAdd={(newSlide, position) => {
                addSlide(newSlide, position)
                goToSlide(position)
              }}
              className="h-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}
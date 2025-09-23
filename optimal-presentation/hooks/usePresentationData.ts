"use client"

import { useState, useEffect } from 'react'
import { PresentationData, SlideData } from '@/lib/types'

export function usePresentationData(initialData?: PresentationData) {
  const [presentation, setPresentation] = useState<PresentationData | null>(initialData || null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load from localStorage if no initial data
  useEffect(() => {
    if (!initialData) {
      const stored = localStorage.getItem('generatedPresentation')
      if (stored) {
        try {
          const parsedPresentation = JSON.parse(stored)
          setPresentation(parsedPresentation)
        } catch (error) {
          console.error('Error parsing stored presentation:', error)
        }
      }
    }
  }, [initialData])

  // Save to localStorage whenever presentation changes
  useEffect(() => {
    if (presentation && hasUnsavedChanges) {
      localStorage.setItem('generatedPresentation', JSON.stringify(presentation))
      localStorage.setItem('presentationLastModified', new Date().toISOString())
    }
  }, [presentation, hasUnsavedChanges])

  const updateSlide = (updatedSlide: SlideData) => {
    if (!presentation) return

    const updatedSlides = [...presentation.slides]
    updatedSlides[currentSlideIndex] = updatedSlide

    setPresentation({
      ...presentation,
      slides: updatedSlides
    })
    setHasUnsavedChanges(true)
  }

  const updatePresentation = (updates: Partial<PresentationData>) => {
    if (!presentation) return

    setPresentation({
      ...presentation,
      ...updates
    })
    setHasUnsavedChanges(true)
  }

  const addSlide = (newSlide: SlideData, insertAt?: number) => {
    if (!presentation) return

    const position = insertAt ?? presentation.slides.length
    const updatedSlides = [...presentation.slides]
    updatedSlides.splice(position, 0, newSlide)

    setPresentation({
      ...presentation,
      slides: updatedSlides,
      metadata: {
        ...presentation.metadata,
        slide_count: updatedSlides.length
      }
    })
    setHasUnsavedChanges(true)
  }

  const removeSlide = (slideIndex: number) => {
    if (!presentation || presentation.slides.length <= 1) return

    const updatedSlides = presentation.slides.filter((_, index) => index !== slideIndex)

    setPresentation({
      ...presentation,
      slides: updatedSlides,
      metadata: {
        ...presentation.metadata,
        slide_count: updatedSlides.length
      }
    })

    // Adjust current slide index if necessary
    if (currentSlideIndex >= updatedSlides.length) {
      setCurrentSlideIndex(updatedSlides.length - 1)
    }

    setHasUnsavedChanges(true)
  }

  const duplicateSlide = (slideIndex: number) => {
    if (!presentation) return

    const slideToClone = presentation.slides[slideIndex]
    const clonedSlide: SlideData = {
      ...slideToClone,
      id: `${slideToClone.id}-copy-${Date.now()}`,
      title: `${slideToClone.title} (Copy)`
    }

    addSlide(clonedSlide, slideIndex + 1)
  }

  const goToSlide = (index: number) => {
    if (!presentation) return

    const clampedIndex = Math.max(0, Math.min(index, presentation.slides.length - 1))
    setCurrentSlideIndex(clampedIndex)
  }

  const nextSlide = () => {
    if (!presentation) return
    goToSlide(currentSlideIndex + 1)
  }

  const previousSlide = () => {
    if (!presentation) return
    goToSlide(currentSlideIndex - 1)
  }

  const saveChanges = () => {
    if (presentation) {
      localStorage.setItem('generatedPresentation', JSON.stringify(presentation))
      localStorage.setItem('presentationLastModified', new Date().toISOString())
      setHasUnsavedChanges(false)
    }
  }

  const discardChanges = () => {
    const stored = localStorage.getItem('generatedPresentation')
    if (stored) {
      try {
        const parsedPresentation = JSON.parse(stored)
        setPresentation(parsedPresentation)
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Error restoring presentation:', error)
      }
    }
  }

  const resetPresentation = () => {
    setPresentation(null)
    setCurrentSlideIndex(0)
    setIsEditing(false)
    setHasUnsavedChanges(false)
    localStorage.removeItem('generatedPresentation')
    localStorage.removeItem('presentationLastModified')
  }

  const currentSlide = presentation?.slides[currentSlideIndex] || null

  return {
    // State
    presentation,
    currentSlide,
    currentSlideIndex,
    isEditing,
    hasUnsavedChanges,

    // Actions
    setPresentation,
    setIsEditing,
    updateSlide,
    updatePresentation,
    addSlide,
    removeSlide,
    duplicateSlide,

    // Navigation
    goToSlide,
    nextSlide,
    previousSlide,

    // Persistence
    saveChanges,
    discardChanges,
    resetPresentation,

    // Computed
    isFirstSlide: currentSlideIndex === 0,
    isLastSlide: currentSlideIndex === (presentation?.slides.length || 0) - 1,
    totalSlides: presentation?.slides.length || 0
  }
}
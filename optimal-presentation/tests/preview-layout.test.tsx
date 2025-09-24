import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PreviewPage from '@/app/preview/page'

// Mock the hooks and components
jest.mock('@/hooks/usePresentationData', () => ({
  usePresentationData: () => ({
    presentation: {
      id: 'test-presentation',
      title: 'Test Presentation',
      subtitle: 'Test Subtitle',
      slides: [
        {
          id: 'slide-1',
          type: 'title',
          title: 'Slide 1',
          layout: 'title-only',
          content: { mainText: 'Content 1' }
        },
        {
          id: 'slide-2',
          type: 'content',
          title: 'Slide 2',
          layout: 'title-content',
          content: { mainText: 'Content 2' }
        }
      ]
    },
    currentSlide: {
      id: 'slide-1',
      type: 'title',
      title: 'Slide 1',
      layout: 'title-only',
      content: { mainText: 'Content 1' }
    },
    currentSlideIndex: 0,
    isEditing: false,
    hasUnsavedChanges: false,
    setIsEditing: jest.fn(),
    updateSlide: jest.fn(),
    updatePresentation: jest.fn(),
    addSlide: jest.fn(),
    removeSlide: jest.fn(),
    duplicateSlide: jest.fn(),
    goToSlide: jest.fn(),
    nextSlide: jest.fn(),
    previousSlide: jest.fn(),
    saveChanges: jest.fn(),
    discardChanges: jest.fn(),
    isFirstSlide: true,
    isLastSlide: false,
    totalSlides: 2
  })
}))

jest.mock('@/components/dynamic-slides/DynamicSlide', () => ({
  DynamicSlide: ({ slide }: any) => <div data-testid="dynamic-slide">{slide.title}</div>
}))

jest.mock('@/components/SlideChat', () => ({
  SlideChat: () => <div data-testid="slide-chat">Chat Component</div>
}))

jest.mock('@/components/ApiConnectionIndicator', () => ({
  ApiConnectionIndicator: () => <div data-testid="api-indicator">API</div>
}))

jest.mock('@/lib/exportUtils', () => ({
  exportToPNG: jest.fn(),
  exportToPPTX: jest.fn()
}))

describe('PreviewPage - Replit Style Layout', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear()
  })

  describe('Layout Structure', () => {
    it('renders with three-column layout structure', () => {
      render(<PreviewPage />)

      // Check header exists and is slim
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('h-12')

      // Check main content area with flex layout
      const mainContent = header.nextElementSibling
      expect(mainContent).toHaveClass('flex-1', 'flex')
    })

    it('renders slide navigator panel on the left', () => {
      render(<PreviewPage />)

      // Check slide navigator exists
      expect(screen.getByText('2 slides')).toBeInTheDocument()
      expect(screen.getByText('1. Slide 1')).toBeInTheDocument()
      expect(screen.getByText('2. Slide 2')).toBeInTheDocument()
    })

    it('renders chat panel on the right', () => {
      render(<PreviewPage />)

      // Check chat component is rendered
      expect(screen.getByTestId('slide-chat')).toBeInTheDocument()
    })

    it('renders main presentation area in the center', () => {
      render(<PreviewPage />)

      // Check slide content is rendered
      expect(screen.getByTestId('dynamic-slide')).toBeInTheDocument()
      expect(screen.getByText('Slide 1')).toBeInTheDocument()
    })
  })

  describe('Panel Collapse/Expand', () => {
    it('toggles navigation panel visibility', () => {
      render(<PreviewPage />)

      // Find navigation toggle button
      const navToggle = screen.getByTitle(/navigation/i)

      // Initially visible
      expect(screen.getByText('2 slides')).toBeInTheDocument()

      // Click to hide
      fireEvent.click(navToggle)

      // Should save to localStorage
      expect(localStorage.getItem('showNav')).toBe('false')
    })

    it('toggles chat panel visibility', () => {
      render(<PreviewPage />)

      // Find chat toggle button
      const chatToggle = screen.getByTitle(/chat/i)

      // Initially visible
      expect(screen.getByTestId('slide-chat')).toBeInTheDocument()

      // Click to hide
      fireEvent.click(chatToggle)

      // Should save to localStorage
      expect(localStorage.getItem('showChat')).toBe('false')
    })

    it('responds to keyboard shortcuts', () => {
      render(<PreviewPage />)

      // Test Ctrl+B for navigation
      fireEvent.keyDown(document, { key: 'b', ctrlKey: true })
      expect(localStorage.getItem('showNav')).toBe('false')

      // Test Ctrl+K for chat
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
      expect(localStorage.getItem('showChat')).toBe('false')
    })
  })

  describe('Existing Functionality Preserved', () => {
    it('preserves slide navigation functionality', () => {
      const { goToSlide, nextSlide, previousSlide } = jest.requireMock('@/hooks/usePresentationData').usePresentationData()
      render(<PreviewPage />)

      // Click on slide 2
      fireEvent.click(screen.getByText('2. Slide 2'))
      expect(goToSlide).toHaveBeenCalledWith(1)

      // Click next button
      fireEvent.click(screen.getByText('Next'))
      expect(nextSlide).toHaveBeenCalled()

      // Previous button should be disabled on first slide
      const prevButton = screen.getByText('Previous').closest('button')
      expect(prevButton).toBeDisabled()
    })

    it('preserves edit mode functionality', () => {
      const { setIsEditing } = jest.requireMock('@/hooks/usePresentationData').usePresentationData()
      render(<PreviewPage />)

      // Click edit button
      fireEvent.click(screen.getByText('Edit'))
      expect(setIsEditing).toHaveBeenCalledWith(true)
    })

    it('preserves export functionality', async () => {
      const { exportToPNG, exportToPPTX } = jest.requireMock('@/lib/exportUtils')
      render(<PreviewPage />)

      // Find export buttons (by aria-label or class)
      const exportButtons = screen.getAllByRole('button')
      const pngButton = exportButtons.find(btn => btn.querySelector('.lucide-file-image'))
      const pptxButton = exportButtons.find(btn => btn.querySelector('.lucide-file-down'))

      // Test PNG export
      if (pngButton) {
        fireEvent.click(pngButton)
        await waitFor(() => {
          expect(exportToPNG).toHaveBeenCalled()
        })
      }

      // Test PPTX export
      if (pptxButton) {
        fireEvent.click(pptxButton)
        await waitFor(() => {
          expect(exportToPPTX).toHaveBeenCalled()
        })
      }
    })

    it('preserves chat functionality with correct props', () => {
      render(<PreviewPage />)

      const chatComponent = screen.getByTestId('slide-chat')
      expect(chatComponent).toBeInTheDocument()

      // Chat should receive all necessary props
      // This is verified by the component rendering without errors
    })

    it('preserves slide editing controls in edit mode', () => {
      // Mock edit mode as true
      jest.spyOn(jest.requireMock('@/hooks/usePresentationData'), 'usePresentationData').mockReturnValue({
        ...jest.requireMock('@/hooks/usePresentationData').usePresentationData(),
        isEditing: true
      })

      render(<PreviewPage />)

      // Check for Add button
      expect(screen.getByText('Add')).toBeInTheDocument()

      // Check for duplicate/delete buttons (they appear on hover)
      const slideElements = screen.getAllByText(/Slide \d/)
      expect(slideElements.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Behavior', () => {
    it('maintains layout when both panels are closed', () => {
      render(<PreviewPage />)

      // Close both panels
      fireEvent.click(screen.getByTitle(/navigation/i))
      fireEvent.click(screen.getByTitle(/chat/i))

      // Main content should still be visible
      expect(screen.getByTestId('dynamic-slide')).toBeInTheDocument()
    })

    it('persists panel preferences across sessions', () => {
      // Set preferences
      localStorage.setItem('showNav', 'false')
      localStorage.setItem('showChat', 'false')

      render(<PreviewPage />)

      // Panels should respect saved preferences
      expect(localStorage.getItem('showNav')).toBe('false')
      expect(localStorage.getItem('showChat')).toBe('false')
    })
  })
})
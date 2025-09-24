import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { EditableSections } from './EditableSections'

interface DiamondSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function DiamondSlide({ slide, isEditing, onEdit }: DiamondSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <EditableText
          text={slide.title}
          className="text-4xl font-bold text-foreground mb-3"
          isEditing={isEditing}
          onEdit={handleTitleEdit}
          placeholder="Enter slide title..."
        />

        {slide.subtitle && (
          <EditableText
            text={slide.subtitle}
            className="text-lg text-muted-foreground"
            isEditing={isEditing}
            onEdit={handleSubtitleEdit}
            placeholder="Enter subtitle..."
          />
        )}
      </div>

      {/* Diamond Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Outer Diamond Container */}
          <div className="w-80 h-80 transform rotate-45 bg-gradient-to-br from-primary/10 to-primary/30 border-4 border-primary/40 flex items-center justify-center">
            {/* Inner Content Container - Counter-rotated */}
            <div className="w-56 h-56 transform -rotate-45 flex flex-col items-center justify-center text-center p-6">
              {/* Main Text */}
              {slide.content?.mainText && (
                <EditableText
                  text={slide.content.mainText}
                  className="text-xl font-bold text-foreground mb-4"
                  isEditing={isEditing}
                  onEdit={(value) => {
                    if (!onEdit) return
                    onEdit({
                      ...slide,
                      content: { ...slide.content, mainText: value }
                    })
                  }}
                  placeholder="Enter main text..."
                  multiline
                />
              )}

              {/* Sections in Diamond */}
              {slide.content?.sections && slide.content.sections.length > 0 && (
                <div className="space-y-2">
                  <EditableSections
                    sections={slide.content.sections}
                    isEditing={isEditing}
                    onEdit={(sections) => {
                      if (!onEdit) return
                      onEdit({
                        ...slide,
                        content: { ...slide.content, sections }
                      })
                    }}
                    className="text-xs"
                  />
                </div>
              )}

              {/* Callout */}
              {slide.content?.callout && (
                <div className="mt-3 p-2 bg-white/20 rounded backdrop-blur-sm">
                  <EditableText
                    text={slide.content.callout}
                    className="text-xs font-semibold text-foreground/90"
                    isEditing={isEditing}
                    onEdit={(value) => {
                      if (!onEdit) return
                      onEdit({
                        ...slide,
                        content: { ...slide.content, callout: value }
                      })
                    }}
                    placeholder="Enter callout text..."
                    multiline
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      {slide.content?.quote && (
        <div className="mt-8 text-center">
          <EditableText
            text={slide.content.quote}
            className="text-lg italic text-muted-foreground"
            isEditing={isEditing}
            onEdit={(value) => {
              if (!onEdit) return
              onEdit({
                ...slide,
                content: { ...slide.content, quote: value }
              })
            }}
            placeholder="Enter inspirational quote..."
            multiline
          />
        </div>
      )}
    </div>
  )
}
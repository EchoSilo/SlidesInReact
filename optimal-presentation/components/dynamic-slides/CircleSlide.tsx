import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { EditableSections } from './EditableSections'

interface CircleSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function CircleSlide({ slide, isEditing, onEdit }: CircleSlideProps) {
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

      {/* Circle Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-primary/30 border-4 border-primary/40 flex flex-col items-center justify-center p-8 text-center">
          {/* Main Text */}
          {slide.content?.mainText && (
            <EditableText
              text={slide.content.mainText}
              className="text-2xl font-bold text-foreground mb-4"
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

          {/* Sections in Circle */}
          {slide.content?.sections && slide.content.sections.length > 0 && (
            <div className="space-y-3">
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
                className="text-sm"
              />
            </div>
          )}

          {/* Callout */}
          {slide.content?.callout && (
            <div className="mt-4 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <EditableText
                text={slide.content.callout}
                className="text-sm font-semibold text-foreground/90"
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
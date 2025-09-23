import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { EditableSections } from './EditableSections'

interface ContentSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function ContentSlide({ slide, isEditing, onEdit }: ContentSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  const handleMainTextEdit = (value: string) => {
    if (!onEdit) return
    onEdit({
      ...slide,
      content: { ...slide.content, mainText: value }
    })
  }

  const handleSectionsEdit = (sections: any[]) => {
    if (!onEdit) return
    onEdit({
      ...slide,
      content: { ...slide.content, sections }
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <EditableText
          text={slide.title}
          className="text-5xl font-bold text-foreground mb-3"
          isEditing={isEditing}
          onEdit={handleTitleEdit}
          placeholder="Enter slide title..."
        />

        {slide.subtitle && (
          <EditableText
            text={slide.subtitle}
            className="text-xl text-muted-foreground"
            isEditing={isEditing}
            onEdit={handleSubtitleEdit}
            placeholder="Enter subtitle..."
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {slide.content?.mainText && (
          <div className="mb-6">
            <EditableText
              text={slide.content.mainText}
              className="text-lg text-foreground leading-relaxed"
              isEditing={isEditing}
              onEdit={handleMainTextEdit}
              placeholder="Enter main content..."
              multiline
            />
          </div>
        )}

        {slide.content?.sections && (
          <EditableSections
            sections={slide.content.sections}
            isEditing={isEditing}
            onEdit={handleSectionsEdit}
          />
        )}
      </div>

      {/* Footer Callout */}
      {slide.content?.callout && (
        <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/40">
          <EditableText
            text={slide.content.callout}
            className="text-center text-foreground font-medium"
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
  )
}
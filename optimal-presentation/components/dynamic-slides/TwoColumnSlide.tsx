import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { EditableSections } from './EditableSections'

interface TwoColumnSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function TwoColumnSlide({ slide, isEditing, onEdit }: TwoColumnSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  const handleSectionsEdit = (sections: any[]) => {
    if (!onEdit) return
    onEdit({
      ...slide,
      content: { ...slide.content, sections }
    })
  }

  const leftSections = slide.content?.sections?.slice(0, Math.ceil((slide.content?.sections?.length || 0) / 2)) || []
  const rightSections = slide.content?.sections?.slice(Math.ceil((slide.content?.sections?.length || 0) / 2)) || []

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
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

      {/* Two Column Content */}
      <div className="flex-1 grid grid-cols-2 gap-8">
        <div>
          <EditableSections
            sections={leftSections}
            isEditing={isEditing}
            onEdit={(newLeftSections) => {
              const allSections = [...newLeftSections, ...rightSections]
              handleSectionsEdit(allSections)
            }}
          />
        </div>
        <div>
          <EditableSections
            sections={rightSections}
            isEditing={isEditing}
            onEdit={(newRightSections) => {
              const allSections = [...leftSections, ...newRightSections]
              handleSectionsEdit(allSections)
            }}
          />
        </div>
      </div>

      {/* Footer Callout */}
      {slide.content?.callout && (
        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <EditableText
            text={slide.content.callout}
            className="text-center text-primary/80 font-semibold"
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
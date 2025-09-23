import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { EditableBulletList } from './EditableBulletList'

interface BulletListSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function BulletListSlide({ slide, isEditing, onEdit }: BulletListSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  const handleBulletPointsEdit = (bulletPoints: string[]) => {
    if (!onEdit) return
    onEdit({
      ...slide,
      content: { ...slide.content, bulletPoints }
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <EditableText
          text={slide.title}
          className="text-5xl font-bold text-foreground mb-4"
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

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {slide.content?.bulletPoints && (
            <EditableBulletList
              items={slide.content.bulletPoints}
              isEditing={isEditing}
              onEdit={handleBulletPointsEdit}
              className="space-y-4"
              itemClassName="text-xl text-foreground flex items-start gap-4"
            />
          )}
        </div>
      </div>

      {/* Footer Callout */}
      {slide.content?.callout && (
        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <EditableText
            text={slide.content.callout}
            className="text-center text-primary/80 font-semibold text-base"
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
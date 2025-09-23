import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { EditableBulletList } from './EditableBulletList'

interface CenteredSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function CenteredSlide({ slide, isEditing, onEdit }: CenteredSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleBulletPointsEdit = (bulletPoints: string[]) => {
    if (!onEdit) return
    onEdit({
      ...slide,
      content: { ...slide.content, bulletPoints }
    })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
      <div className="space-y-4">
        <EditableText
          text={slide.title}
          className="text-5xl font-bold text-foreground"
          isEditing={isEditing}
          onEdit={handleTitleEdit}
          placeholder="Enter slide title..."
        />
      </div>

      {slide.content?.bulletPoints && (
        <div className="max-w-3xl">
          <EditableBulletList
            items={slide.content.bulletPoints}
            isEditing={isEditing}
            onEdit={handleBulletPointsEdit}
            className="space-y-4 text-center"
            itemClassName="text-xl text-foreground flex items-center justify-center gap-4"
          />
        </div>
      )}

      {slide.content?.quote && (
        <div className="max-w-4xl mt-8 p-6 bg-muted/30 rounded-xl border border-border/40">
          <EditableText
            text={slide.content.quote}
            className="text-2xl italic text-foreground/80"
            isEditing={isEditing}
            onEdit={(value) => {
              if (!onEdit) return
              onEdit({
                ...slide,
                content: { ...slide.content, quote: value }
              })
            }}
            placeholder="Enter quote..."
            multiline
          />
        </div>
      )}

      {slide.content?.callout && (
        <div className="max-w-4xl p-4 bg-primary/10 rounded-xl border border-primary/30">
          <EditableText
            text={slide.content.callout}
            className="text-lg font-semibold text-primary"
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
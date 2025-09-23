import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'

interface TitleSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function TitleSlide({ slide, isEditing, onEdit }: TitleSlideProps) {
  const handleEdit = (field: string, value: string) => {
    if (!onEdit) return

    const updatedSlide = { ...slide }
    if (field === 'title') {
      updatedSlide.title = value
    } else if (field === 'subtitle') {
      updatedSlide.subtitle = value
    } else if (field === 'mainText') {
      updatedSlide.content = { ...updatedSlide.content, mainText: value }
    }

    onEdit(updatedSlide)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="space-y-4">
        <EditableText
          text={slide.title}
          className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent leading-tight"
          isEditing={isEditing}
          onEdit={(value) => handleEdit('title', value)}
          placeholder="Enter presentation title..."
        />

        <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>

        {slide.subtitle && (
          <EditableText
            text={slide.subtitle}
            className="text-3xl text-foreground/80 font-light"
            isEditing={isEditing}
            onEdit={(value) => handleEdit('subtitle', value)}
            placeholder="Enter subtitle..."
          />
        )}
      </div>

      {slide.content?.mainText && (
        <div className="mt-8">
          <EditableText
            text={slide.content.mainText}
            className="text-xl text-muted-foreground"
            isEditing={isEditing}
            onEdit={(value) => handleEdit('mainText', value)}
            placeholder="Enter additional content..."
            multiline
          />
        </div>
      )}

      {slide.content?.callout && (
        <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border/30">
          <EditableText
            text={slide.content.callout}
            className="text-base text-muted-foreground"
            isEditing={isEditing}
            onEdit={(value) => {
              if (!onEdit) return
              const updatedSlide = {
                ...slide,
                content: { ...slide.content, callout: value }
              }
              onEdit(updatedSlide)
            }}
            placeholder="Enter callout text..."
            multiline
          />
        </div>
      )}
    </div>
  )
}
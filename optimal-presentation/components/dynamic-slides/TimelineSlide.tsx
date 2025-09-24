import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { CheckCircle, Circle, Clock } from 'lucide-react'

interface TimelineSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function TimelineSlide({ slide, isEditing, onEdit }: TimelineSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  const handleEventEdit = (index: number, field: string, value: string) => {
    if (!onEdit || !slide.content?.timeline) return
    const updatedEvents = [...slide.content.timeline.events]
    updatedEvents[index] = { ...updatedEvents[index], [field]: value }
    onEdit({
      ...slide,
      content: {
        ...slide.content,
        timeline: { ...slide.content.timeline, events: updatedEvents }
      }
    })
  }

  const getStatusIcon = (status?: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500 fill-green-100" />
      case 'current':
        return <Clock className="w-6 h-6 text-blue-500 fill-blue-100" />
      case 'upcoming':
        return <Circle className="w-6 h-6 text-gray-400" />
      default:
        return <Circle className="w-6 h-6 text-gray-400" />
    }
  }

  const isHorizontal = slide.content?.timeline?.orientation !== 'vertical'

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <EditableText
          text={slide.title}
          className="text-4xl font-bold text-foreground mb-3"
          isEditing={isEditing}
          onEdit={handleTitleEdit}
          placeholder="Enter timeline title..."
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

      {/* Timeline */}
      <div className="flex-1 flex items-center justify-center">
        {slide.content?.timeline && (
          <div className={`${isHorizontal ? 'flex items-center space-x-8 overflow-x-auto w-full' : 'space-y-8'} p-4`}>
            {slide.content.timeline.events.map((event, index) => (
              <div key={event.id} className={`relative ${isHorizontal ? 'flex-shrink-0' : ''}`}>
                {/* Timeline Line */}
                {index < slide.content.timeline!.events.length - 1 && (
                  <div className={`absolute ${
                    isHorizontal
                      ? 'top-1/2 left-full w-8 h-0.5 bg-border transform -translate-y-1/2'
                      : 'top-full left-1/2 w-0.5 h-8 bg-border transform -translate-x-1/2'
                  }`} />
                )}

                {/* Event Item */}
                <div className={`${isHorizontal ? 'w-64' : 'flex items-start space-x-4'}`}>
                  {/* Status Icon */}
                  <div className={`${isHorizontal ? 'flex justify-center mb-4' : 'flex-shrink-0 mt-1'}`}>
                    {getStatusIcon(event.status)}
                  </div>

                  {/* Event Content */}
                  <div className={`${isHorizontal ? 'text-center' : 'flex-1'}`}>
                    {/* Date */}
                    {event.date && (
                      <EditableText
                        text={event.date}
                        className="text-sm text-muted-foreground font-medium mb-2"
                        isEditing={isEditing}
                        onEdit={(value) => handleEventEdit(index, 'date', value)}
                        placeholder="Enter date..."
                      />
                    )}

                    {/* Title */}
                    <EditableText
                      text={event.title}
                      className="text-lg font-semibold text-foreground mb-2"
                      isEditing={isEditing}
                      onEdit={(value) => handleEventEdit(index, 'title', value)}
                      placeholder="Enter event title..."
                    />

                    {/* Description */}
                    {event.description && (
                      <EditableText
                        text={event.description}
                        className="text-sm text-muted-foreground"
                        isEditing={isEditing}
                        onEdit={(value) => handleEventEdit(index, 'description', value)}
                        placeholder="Enter description..."
                        multiline
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Description */}
      {slide.content?.timeline?.description && (
        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <EditableText
            text={slide.content.timeline.description}
            className="text-center text-primary/80 font-semibold"
            isEditing={isEditing}
            onEdit={(value) => {
              if (!onEdit || !slide.content?.timeline) return
              onEdit({
                ...slide,
                content: {
                  ...slide.content,
                  timeline: { ...slide.content.timeline, description: value }
                }
              })
            }}
            placeholder="Enter timeline description..."
            multiline
          />
        </div>
      )}
    </div>
  )
}
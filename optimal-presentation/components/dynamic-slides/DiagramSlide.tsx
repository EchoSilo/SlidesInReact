import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { ArrowRight, Target, Database, TrendingUp } from 'lucide-react'

interface DiagramSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function DiagramSlide({ slide, isEditing, onEdit }: DiagramSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  // Simple diagram rendering - can be enhanced for different diagram types
  const renderDiagram = () => {
    if (!slide.content?.diagram) return null

    const { elements } = slide.content.diagram
    
    // For now, render as a horizontal flow
    return (
      <div className="flex items-center justify-center gap-6 my-8">
        {elements.map((element, index) => (
          <div key={element.id} className="flex items-center gap-4">
            <div className={`p-6 rounded-xl border-2 text-center min-w-[200px] ${
              element.style === 'primary' ? 'bg-primary/10 border-primary/30' :
              element.style === 'secondary' ? 'bg-blue-500/10 border-blue-500/30' :
              element.style === 'accent' ? 'bg-green-500/10 border-green-500/30' :
              'bg-muted/30 border-border/40'
            }`}>
              <div className="flex justify-center mb-3">
                {element.style === 'primary' && <Database className="w-8 h-8 text-primary" />}
                {element.style === 'secondary' && <Target className="w-8 h-8 text-blue-600" />}
                {element.style === 'accent' && <TrendingUp className="w-8 h-8 text-green-600" />}
              </div>
              <EditableText
                text={element.label}
                className="font-semibold text-foreground mb-2"
                isEditing={isEditing}
                onEdit={(value) => {
                  if (!onEdit) return
                  const updatedElements = [...elements]
                  updatedElements[index] = { ...element, label: value }
                  onEdit({
                    ...slide,
                    content: {
                      ...slide.content,
                      diagram: { ...slide.content.diagram!, elements: updatedElements }
                    }
                  })
                }}
                placeholder="Element label..."
              />
              {element.description && (
                <EditableText
                  text={element.description}
                  className="text-sm text-foreground/80"
                  isEditing={isEditing}
                  onEdit={(value) => {
                    if (!onEdit) return
                    const updatedElements = [...elements]
                    updatedElements[index] = { ...element, description: value }
                    onEdit({
                      ...slide,
                      content: {
                        ...slide.content,
                        diagram: { ...slide.content.diagram!, elements: updatedElements }
                      }
                    })
                  }}
                  placeholder="Element description..."
                  multiline
                />
              )}
            </div>
            {index < elements.length - 1 && (
              <div className="flex flex-col items-center">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-foreground/70 mt-1">enables</span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

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

      {/* Diagram */}
      <div className="flex-1 flex items-center justify-center">
        {renderDiagram()}
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
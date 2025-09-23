import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricsSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function MetricsSlide({ slide, isEditing, onEdit }: MetricsSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  const handleMetricEdit = (index: number, field: string, value: string) => {
    if (!onEdit || !slide.content?.keyMetrics) return
    
    const updatedMetrics = [...slide.content.keyMetrics]
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value }
    
    onEdit({
      ...slide,
      content: { ...slide.content, keyMetrics: updatedMetrics }
    })
  }

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />
      case 'stable':
        return <Minus className="w-5 h-5 text-blue-500" />
      default:
        return null
    }
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

      {/* Metrics Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {slide.content?.keyMetrics?.map((metric, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <EditableText
                  text={metric.value}
                  className="text-3xl font-bold text-primary"
                  isEditing={isEditing}
                  onEdit={(value) => handleMetricEdit(index, 'value', value)}
                  placeholder="Value..."
                />
                {getTrendIcon(metric.trend)}
              </div>
              
              <EditableText
                text={metric.label}
                className="text-lg font-semibold text-foreground mb-2"
                isEditing={isEditing}
                onEdit={(value) => handleMetricEdit(index, 'label', value)}
                placeholder="Metric label..."
              />
              
              {metric.description && (
                <EditableText
                  text={metric.description}
                  className="text-sm text-muted-foreground"
                  isEditing={isEditing}
                  onEdit={(value) => handleMetricEdit(index, 'description', value)}
                  placeholder="Description..."
                  multiline
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Callout */}
      {slide.content?.callout && (
        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
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
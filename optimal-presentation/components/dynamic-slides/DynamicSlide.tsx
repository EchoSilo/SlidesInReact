import { SlideData } from '@/lib/types'
import { TitleSlide } from './TitleSlide'
import { ContentSlide } from './ContentSlide'
import { DiagramSlide } from './DiagramSlide'
import { MetricsSlide } from './MetricsSlide'
import { BulletListSlide } from './BulletListSlide'
import { TwoColumnSlide } from './TwoColumnSlide'
import { CenteredSlide } from './CenteredSlide'

interface DynamicSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
  className?: string
}

export function DynamicSlide({ slide, isEditing = false, onEdit, className }: DynamicSlideProps) {
  const baseClasses = "w-full h-full flex flex-col p-8 bg-gradient-to-br from-white to-gray-50"
  const combinedClasses = `${baseClasses} ${className || ''}`

  const renderSlideContent = () => {
    switch (slide.layout) {
      case "title-only":
        return <TitleSlide slide={slide} isEditing={isEditing} onEdit={onEdit} />

      case "title-content":
        return <ContentSlide slide={slide} isEditing={isEditing} onEdit={onEdit} />

      case "two-column":
        return <TwoColumnSlide slide={slide} isEditing={isEditing} onEdit={onEdit} />

      case "bullet-list":
        return <BulletListSlide slide={slide} isEditing={isEditing} onEdit={onEdit} />

      case "centered":
        return <CenteredSlide slide={slide} isEditing={isEditing} onEdit={onEdit} />

      case "diagram":
        return <DiagramSlide slide={slide} isEditing={isEditing} onEdit={onEdit} />

      case "metrics":
        return <MetricsSlide slide={slide} isEditing={isEditing} onEdit={onEdit} />

      default:
        return <ContentSlide slide={slide} isEditing={isEditing} onEdit={onEdit} />
    }
  }

  return (
    <div className={combinedClasses}>
      {renderSlideContent()}
    </div>
  )
}
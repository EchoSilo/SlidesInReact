"use client"

import { useState } from 'react'
import { Section } from '@/lib/types'
import { EditableText } from './EditableText'
import { EditableBulletList } from './EditableBulletList'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface EditableSectionsProps {
  sections: Section[]
  isEditing?: boolean
  onEdit?: (sections: Section[]) => void
  className?: string
}

export function EditableSections({
  sections,
  isEditing = false,
  onEdit,
  className = ''
}: EditableSectionsProps) {
  const [localSections, setLocalSections] = useState(sections)

  const handleSectionEdit = (index: number, field: keyof Section, value: any) => {
    const newSections = [...localSections]
    newSections[index] = { ...newSections[index], [field]: value }
    setLocalSections(newSections)
    onEdit?.(newSections)
  }

  const handleAddSection = () => {
    const newSection: Section = {
      title: 'New Section',
      description: 'Section description',
      items: []
    }
    const newSections = [...localSections, newSection]
    setLocalSections(newSections)
    onEdit?.(newSections)
  }

  const handleRemoveSection = (index: number) => {
    const newSections = localSections.filter((_, i) => i !== index)
    setLocalSections(newSections)
    onEdit?.(newSections)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {localSections.map((section, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl border group ${
            section.highlight
              ? 'bg-primary/5 border-primary/30'
              : 'bg-muted/30 border-border/40'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <EditableText
                text={section.title}
                className="text-xl font-semibold text-foreground mb-2"
                isEditing={isEditing}
                onEdit={(value) => handleSectionEdit(index, 'title', value)}
                placeholder="Section title..."
              />
              <EditableText
                text={section.description}
                className="text-foreground/80"
                isEditing={isEditing}
                onEdit={(value) => handleSectionEdit(index, 'description', value)}
                placeholder="Section description..."
                multiline
              />
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSection(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {section.items && section.items.length > 0 && (
            <EditableBulletList
              items={section.items}
              isEditing={isEditing}
              onEdit={(items) => handleSectionEdit(index, 'items', items)}
              className="mt-4"
              itemClassName="text-sm text-foreground/90 flex items-start gap-3"
            />
          )}
        </div>
      ))}

      {isEditing && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleAddSection}
            className="flex items-center gap-2 text-primary border-primary/30 hover:bg-primary/5"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </Button>
        </div>
      )}
    </div>
  )
}
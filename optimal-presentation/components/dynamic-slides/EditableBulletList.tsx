"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EditableText } from './EditableText'
import { Plus, X } from 'lucide-react'

interface EditableBulletListProps {
  items: string[]
  isEditing?: boolean
  onEdit?: (items: string[]) => void
  className?: string
  itemClassName?: string
}

export function EditableBulletList({
  items,
  isEditing = false,
  onEdit,
  className = '',
  itemClassName = ''
}: EditableBulletListProps) {
  const [localItems, setLocalItems] = useState(items)

  const handleItemEdit = (index: number, value: string) => {
    const newItems = [...localItems]
    newItems[index] = value
    setLocalItems(newItems)
    onEdit?.(newItems)
  }

  const handleAddItem = () => {
    const newItems = [...localItems, 'New bullet point']
    setLocalItems(newItems)
    onEdit?.(newItems)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = localItems.filter((_, i) => i !== index)
    setLocalItems(newItems)
    onEdit?.(newItems)
  }

  return (
    <div className={className}>
      {localItems.map((item, index) => (
        <div key={index} className={`${itemClassName} group`}>
          <div className="w-3 h-3 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
          <div className="flex-1 flex items-center gap-2">
            <EditableText
              text={item}
              className="flex-1"
              isEditing={isEditing}
              onEdit={(value) => handleItemEdit(index, value)}
              placeholder="Enter bullet point..."
            />
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="flex items-center gap-2 text-primary border-primary/30 hover:bg-primary/5"
          >
            <Plus className="w-4 h-4" />
            Add Bullet Point
          </Button>
        </div>
      )}
    </div>
  )
}
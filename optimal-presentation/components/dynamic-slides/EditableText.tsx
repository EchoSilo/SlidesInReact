"use client"

import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface EditableTextProps {
  text: string
  className?: string
  isEditing?: boolean
  onEdit?: (value: string) => void
  placeholder?: string
  multiline?: boolean
}

export function EditableText({
  text,
  className = '',
  isEditing = false,
  onEdit,
  placeholder = 'Enter text...',
  multiline = false
}: EditableTextProps) {
  const [localText, setLocalText] = useState(text || '')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setLocalText(text || '')
  }, [text])

  const handleChange = (value: string) => {
    setLocalText(value)
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (onEdit && localText !== text) {
      onEdit(localText)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setLocalText(text)
      inputRef.current?.blur()
    }
  }

  if (isEditing) {
    const baseInputClasses = `${className} bg-transparent border-2 border-dashed border-primary/30 rounded-md px-2 py-1 resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`

    if (multiline) {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localText}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={baseInputClasses}
          rows={Math.max(2, Math.ceil(localText.length / 80))}
        />
      )
    }

    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={localText}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={baseInputClasses}
      />
    )
  }

  // Display mode
  if (multiline) {
    return (
      <div className={className}>
        {(text || '').split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    )
  }

  return <div className={className}>{text || ''}</div>
}
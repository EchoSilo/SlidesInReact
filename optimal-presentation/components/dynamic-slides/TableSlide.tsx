import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface TableSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function TableSlide({ slide, isEditing, onEdit }: TableSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  const handleHeaderEdit = (index: number, value: string) => {
    if (!onEdit || !slide.content?.table) return
    const updatedHeaders = [...slide.content.table.headers]
    updatedHeaders[index] = value
    onEdit({
      ...slide,
      content: {
        ...slide.content,
        table: { ...slide.content.table, headers: updatedHeaders }
      }
    })
  }

  const handleCellEdit = (rowIndex: number, cellIndex: number, value: string) => {
    if (!onEdit || !slide.content?.table) return
    const updatedRows = [...slide.content.table.rows]
    updatedRows[rowIndex] = [...updatedRows[rowIndex]]
    updatedRows[rowIndex][cellIndex] = value
    onEdit({
      ...slide,
      content: {
        ...slide.content,
        table: { ...slide.content.table, rows: updatedRows }
      }
    })
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
          placeholder="Enter table title..."
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

      {/* Table */}
      <div className="flex-1 flex flex-col justify-center">
        {slide.content?.table && (
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {slide.content.table.headers.map((header, index) => (
                    <TableHead key={index} className="font-semibold">
                      <EditableText
                        text={header}
                        className="font-semibold text-foreground"
                        isEditing={isEditing}
                        onEdit={(value) => handleHeaderEdit(index, value)}
                        placeholder={`Header ${index + 1}...`}
                      />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {slide.content.table.rows.map((row, rowIndex) => {
                  const isHighlighted = slide.content?.table?.highlight?.includes(rowIndex)
                  return (
                    <TableRow
                      key={rowIndex}
                      className={isHighlighted ? "bg-primary/5 border-primary/20" : ""}
                    >
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <EditableText
                            text={cell}
                            className={isHighlighted ? "font-medium text-primary" : ""}
                            isEditing={isEditing}
                            onEdit={(value) => handleCellEdit(rowIndex, cellIndex, value)}
                            placeholder={`Cell ${rowIndex + 1}.${cellIndex + 1}...`}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Footer Description */}
      {slide.content?.table?.description && (
        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <EditableText
            text={slide.content.table.description}
            className="text-center text-primary/80 font-semibold"
            isEditing={isEditing}
            onEdit={(value) => {
              if (!onEdit || !slide.content?.table) return
              onEdit({
                ...slide,
                content: {
                  ...slide.content,
                  table: { ...slide.content.table, description: value }
                }
              })
            }}
            placeholder="Enter table description..."
            multiline
          />
        </div>
      )}
    </div>
  )
}
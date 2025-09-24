import { SlideData } from '@/lib/types'
import { EditableText } from './EditableText'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, Area, AreaChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'

interface ChartSlideProps {
  slide: SlideData
  isEditing?: boolean
  onEdit?: (slide: SlideData) => void
}

export function ChartSlide({ slide, isEditing, onEdit }: ChartSlideProps) {
  const handleTitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, title: value })
  }

  const handleSubtitleEdit = (value: string) => {
    if (!onEdit) return
    onEdit({ ...slide, subtitle: value })
  }

  const renderChart = () => {
    if (!slide.content?.chart) return null

    const { type, data, config } = slide.content.chart
    const chartConfig = Object.keys(config).reduce((acc, key) => {
      acc[key] = {
        label: config[key].label || key,
        color: config[key].color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
      }
      return acc
    }, {} as any)

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    }

    switch (type) {
      case 'bar':
        return (
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(config).map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={config[key].color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )

      case 'line':
        return (
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(config).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={config[key].color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )

      case 'area':
        return (
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(config).map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={config[key].color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`}
                  fill={config[key].color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        )

      case 'pie':
      case 'donut':
        const COLORS = Object.values(config).map(c => c.color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`)
        return (
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                innerRadius={type === 'donut' ? 60 : 0}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        )

      default:
        return (
          <div className="flex items-center justify-center h-40 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Chart type "{type}" not supported yet</p>
          </div>
        )
    }
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
          placeholder="Enter chart title..."
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

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center">
        {renderChart()}
      </div>

      {/* Footer Description */}
      {slide.content?.chart?.description && (
        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <EditableText
            text={slide.content.chart.description}
            className="text-center text-primary/80 font-semibold"
            isEditing={isEditing}
            onEdit={(value) => {
              if (!onEdit || !slide.content?.chart) return
              onEdit({
                ...slide,
                content: {
                  ...slide.content,
                  chart: { ...slide.content.chart, description: value }
                }
              })
            }}
            placeholder="Enter chart description..."
            multiline
          />
        </div>
      )}
    </div>
  )
}
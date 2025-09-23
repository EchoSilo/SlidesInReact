import { PresentationData } from './types'

export async function exportToPNG(slideElement: HTMLElement, filename: string): Promise<void> {
  try {
    const html2canvas = (await import('html2canvas')).default

    const canvas = await html2canvas(slideElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      height: slideElement.scrollHeight,
      width: slideElement.scrollWidth
    })

    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('PNG export error:', error)
    throw new Error('Failed to export PNG')
  }
}

export async function exportToPPTX(presentation: PresentationData): Promise<void> {
  try {
    const PptxGenJSModule = await import('pptxgenjs')
    const pptx = new PptxGenJSModule.default()

    // Set up 16:9 layout
    pptx.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 })
    pptx.layout = 'LAYOUT_16x9'

    // Add each slide
    presentation.slides.forEach((slideData, index) => {
      const slide = pptx.addSlide()

      // Add title
      slide.addText(slideData.title, {
        x: 0.5, y: 0.3, w: 9, h: 0.8,
        fontSize: 32, bold: true,
        color: '363636'
      })

      // Add subtitle if present
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 0.5, y: 1.1, w: 9, h: 0.6,
          fontSize: 18,
          color: '666666'
        })
      }

      // Add content based on slide type
      let yPosition = slideData.subtitle ? 1.8 : 1.4

      if (slideData.content?.mainText) {
        slide.addText(slideData.content.mainText, {
          x: 0.5, y: yPosition, w: 9, h: 0.8,
          fontSize: 14,
          color: '444444'
        })
        yPosition += 1
      }

      if (slideData.content?.bulletPoints) {
        slideData.content.bulletPoints.forEach((bullet, bulletIndex) => {
          slide.addText(`• ${bullet}`, {
            x: 0.5, y: yPosition + (bulletIndex * 0.4), w: 9, h: 0.3,
            fontSize: 12,
            color: '444444'
          })
        })
        yPosition += slideData.content.bulletPoints.length * 0.4
      }

      if (slideData.content?.sections) {
        slideData.content.sections.forEach((section, sectionIndex) => {
          slide.addText(section.title, {
            x: 0.5, y: yPosition, w: 9, h: 0.4,
            fontSize: 14, bold: true,
            color: '363636'
          })
          yPosition += 0.4

          slide.addText(section.description, {
            x: 0.5, y: yPosition, w: 9, h: 0.4,
            fontSize: 12,
            color: '444444'
          })
          yPosition += 0.5

          if (section.items) {
            section.items.forEach((item, itemIndex) => {
              slide.addText(`  • ${item}`, {
                x: 0.7, y: yPosition + (itemIndex * 0.3), w: 8.5, h: 0.25,
                fontSize: 10,
                color: '555555'
              })
            })
            yPosition += section.items.length * 0.3 + 0.3
          }
        })
      }

      if (slideData.content?.keyMetrics) {
        slideData.content.keyMetrics.forEach((metric, metricIndex) => {
          const xPos = 0.5 + (metricIndex % 3) * 3
          const yPos = yPosition + Math.floor(metricIndex / 3) * 1.2

          slide.addText(metric.value, {
            x: xPos, y: yPos, w: 2.5, h: 0.5,
            fontSize: 20, bold: true,
            color: '007acc',
            align: 'center'
          })

          slide.addText(metric.label, {
            x: xPos, y: yPos + 0.5, w: 2.5, h: 0.4,
            fontSize: 12, bold: true,
            color: '363636',
            align: 'center'
          })

          if (metric.description) {
            slide.addText(metric.description, {
              x: xPos, y: yPos + 0.9, w: 2.5, h: 0.3,
              fontSize: 9,
              color: '666666',
              align: 'center'
            })
          }
        })
      }

      if (slideData.content?.callout) {
        slide.addText(slideData.content.callout, {
          x: 0.5, y: 4.5, w: 9, h: 0.8,
          fontSize: 12, italic: true,
          color: '007acc',
          align: 'center'
        })
      }
    })

    // Generate and download
    await pptx.writeFile({
      fileName: `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`
    })

  } catch (error) {
    console.error('PPTX export error:', error)
    throw new Error('Failed to export PPTX')
  }
}

export async function exportAllSlidesPNG(presentation: PresentationData): Promise<void> {
  const slides = document.querySelectorAll('[data-slide-index]')

  for (let i = 0; i < slides.length; i++) {
    const slideElement = slides[i] as HTMLElement
    const filename = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-slide-${i + 1}.png`

    try {
      await exportToPNG(slideElement, filename)
      // Add a small delay between exports
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`Failed to export slide ${i + 1}:`, error)
    }
  }
}
import { useEffect, useState } from 'react';

export function usePptxExport() {
  const [PptxGenJS, setPptxGenJS] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load PptxGenJS from CDN to avoid SSR issues
    if (typeof window !== 'undefined' && !window.PptxGenJS) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        setPptxGenJS(() => window.PptxGenJS);
      };
      script.onerror = () => {
        console.error('Failed to load PptxGenJS from CDN');
      };
      document.body.appendChild(script);
    } else if (typeof window !== 'undefined' && window.PptxGenJS) {
      // @ts-ignore
      setPptxGenJS(() => window.PptxGenJS);
    }
  }, []);

  const exportToPPTX = async (
    slides: any[],
    fileName: string = 'presentation.pptx',
    title: string = 'Presentation'
  ) => {
    if (!PptxGenJS) {
      console.error('PptxGenJS not loaded yet');
      return;
    }

    setIsLoading(true);
    try {
      const pptx = new PptxGenJS();

      // Set presentation properties
      pptx.title = title;
      pptx.layout = 'LAYOUT_16x9';

      // Add slides based on the slide data
      slides.forEach((slideData) => {
        const slide = pptx.addSlide();

        // Add title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.5,
            w: '90%',
            h: 1.5,
            fontSize: 36,
            bold: true,
            color: '363636',
            align: 'center'
          });
        }

        // Add subtitle
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.5,
            y: 2,
            w: '90%',
            h: 1,
            fontSize: 24,
            color: '666666',
            align: 'center'
          });
        }

        // Add content as bullet points if available
        if (slideData.content) {
          const contentText = typeof slideData.content === 'string'
            ? slideData.content
            : JSON.stringify(slideData.content, null, 2);

          slide.addText(contentText, {
            x: 0.5,
            y: 3.5,
            w: '90%',
            h: 4,
            fontSize: 14,
            color: '363636',
            align: 'left'
          });
        }
      });

      // Save the presentation
      await pptx.writeFile({ fileName });

    } catch (error) {
      console.error('Error exporting PPTX:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    exportToPPTX,
    isReady: !!PptxGenJS,
    isLoading
  };
}
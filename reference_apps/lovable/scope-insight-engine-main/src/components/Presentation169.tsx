import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import html2canvas from "html2canvas";
import TitleSlide169 from "./slides169/TitleSlide169";
import ProblemSlide169 from "./slides169/ProblemSlide169";
import SolutionSlide169 from "./slides169/SolutionSlide169";
import BenefitsSlide169 from "./slides169/BenefitsSlide169";
import ImplementationSlide169 from "./slides169/ImplementationSlide169";

const slides = [
  { id: 1, component: TitleSlide169, title: "Capacity Management Framework" },
  { id: 2, component: ProblemSlide169, title: "Current Challenge" },
  { id: 3, component: SolutionSlide169, title: "Proposed Solution" },
  { id: 4, component: BenefitsSlide169, title: "Key Benefits" },
  { id: 5, component: ImplementationSlide169, title: "Implementation Approach" },
];

const Presentation169 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const exportSlideAsPNG = async () => {
    const slideElement = document.getElementById('slide-content-169');
    if (slideElement) {
      const canvas = await html2canvas(slideElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `slide-${currentSlide + 1}-${slides[currentSlide].title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8">
      <div className="container mx-auto px-4">
        {/* 16:9 Aspect Ratio Slide Container */}
        <div className="relative mx-auto max-w-7xl">
          <div className="aspect-video bg-card rounded-xl shadow-[--shadow-elevated] overflow-hidden" id="slide-content-169">
            <div className="w-full h-full p-12">
              <CurrentSlideComponent />
            </div>
          </div>
          
          {/* Export Button */}
          <Button
            variant="outline"
            onClick={exportSlideAsPNG}
            className="absolute top-4 right-4 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PNG
          </Button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6 max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {/* Slide indicators */}
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-primary scale-125"
                    : "bg-muted hover:bg-muted-foreground/20"
                }`}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Slide counter and title */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {currentSlide + 1} of {slides.length} • {slides[currentSlide].title}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            16:9 Aspect Ratio • PowerPoint Compatible
          </p>
        </div>
      </div>
    </div>
  );
};

export default Presentation169;
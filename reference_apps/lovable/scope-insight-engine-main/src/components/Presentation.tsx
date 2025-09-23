import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import html2canvas from "html2canvas";
import TitleSlide from "./slides/TitleSlide";
import ProblemSlide from "./slides/ProblemSlide";
import SolutionSlide from "./slides/SolutionSlide";
import BenefitsSlide from "./slides/BenefitsSlide";
import ImplementationSlide from "./slides/ImplementationSlide";

const slides = [
  { id: 1, component: TitleSlide, title: "Capacity Management Framework" },
  { id: 2, component: ProblemSlide, title: "Current Challenge" },
  { id: 3, component: SolutionSlide, title: "Proposed Solution" },
  { id: 4, component: BenefitsSlide, title: "Key Benefits" },
  { id: 5, component: ImplementationSlide, title: "Implementation Approach" },
];

const Presentation = () => {
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
    const slideElement = document.getElementById('slide-content');
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Main slide area */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          <div className="relative bg-card rounded-xl shadow-[--shadow-elevated] min-h-[600px] p-8" id="slide-content">
            <CurrentSlideComponent />
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

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
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
        </div>
      </div>
    </div>
  );
};

export default Presentation;
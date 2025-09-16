import React, { useState } from 'react';
import { TitleSlide } from './slides/TitleSlide';
import { ProblemStatementSlide } from './slides/ProblemStatementSlide';
import { SolutionOverviewSlide } from './slides/SolutionOverviewSlide';
import { ResourceAllocationSlide } from './slides/ResourceAllocationSlide';
import { CapacityManagementSlide } from './slides/CapacityManagementSlide';
import { DemandManagementSlide } from './slides/DemandManagementSlide';
import { BenefitsSlide } from './slides/BenefitsSlide';
import { NextStepsSlide } from './slides/NextStepsSlide';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export const Presentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [<TitleSlide key="title" />, <ProblemStatementSlide key="problem" />, <SolutionOverviewSlide key="solution" />, <ResourceAllocationSlide key="resources" />, <CapacityManagementSlide key="capacity" />, <DemandManagementSlide key="demand" />, <BenefitsSlide key="benefits" />, <NextStepsSlide key="next" />];
  const goToPreviousSlide = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
  };
  const goToNextSlide = () => {
    setCurrentSlide(prev => prev < slides.length - 1 ? prev + 1 : prev);
  };
  return <div className="w-full min-h-screen flex flex-col items-center justify-center relative py-4 px-2">
      <div className="w-full max-w-5xl aspect-[16/9] bg-white shadow-lg rounded-md overflow-hidden relative">
        {slides[currentSlide]}
      </div>
      <div className="flex items-center justify-between w-full max-w-5xl mt-4">
        <button onClick={goToPreviousSlide} disabled={currentSlide === 0} className={`flex items-center px-4 py-2 rounded-md ${currentSlide === 0 ? 'text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          <ChevronLeftIcon size={20} className="mr-1" />
          Previous
        </button>
        <div className="text-gray-700">
          Slide {currentSlide + 1} of {slides.length}
        </div>
        <button onClick={goToNextSlide} disabled={currentSlide === slides.length - 1} className={`flex items-center px-4 py-2 rounded-md ${currentSlide === slides.length - 1 ? 'text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          Next
          <ChevronRightIcon size={20} className="ml-1" />
        </button>
      </div>
    </div>;
};
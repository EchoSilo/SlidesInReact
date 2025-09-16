import React from 'react';
import { ClipboardCheckIcon, ArrowRightIcon } from 'lucide-react';
export const NextStepsSlide: React.FC = () => {
  return <div className="w-full h-full flex flex-col p-8 bg-white">
      <div className="bg-blue-600 text-white py-2 px-6 rounded-t-md">
        <h2 className="text-2xl font-bold">Implementation Roadmap</h2>
      </div>
      <div className="flex-1 p-4 border-2 border-t-0 border-gray-200 rounded-b-md overflow-hidden">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
            Next Steps for the CTO Organization
          </h3>
          <div className="space-y-3">
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <div className="text-blue-600 font-bold text-xl">1</div>
              </div>
              <div>
                <h4 className="text-base font-medium mb-0.5">
                  Create Scope Template
                </h4>
                <p className="text-gray-700 text-sm">
                  Develop the consolidated scope spreadsheet template with all
                  required fields and share with team leads.
                </p>
                <div className="mt-1 text-xs text-blue-600 font-medium">
                  Timeframe: 1-2 weeks
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <div className="text-blue-600 font-bold text-xl">2</div>
              </div>
              <div>
                <h4 className="text-base font-medium mb-0.5">
                  Initial Data Collection
                </h4>
                <p className="text-gray-700 text-sm">
                  Have each team populate their current and planned initiatives,
                  including resource requirements.
                </p>
                <div className="mt-1 text-xs text-blue-600 font-medium">
                  Timeframe: 2-3 weeks
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <div className="text-blue-600 font-bold text-xl">3</div>
              </div>
              <div>
                <h4 className="text-base font-medium mb-0.5">
                  Resource Allocation Planning
                </h4>
                <p className="text-gray-700 text-sm">
                  Map team members to initiatives and define monthly allocation
                  percentages for the next 6-12 months.
                </p>
                <div className="mt-1 text-xs text-blue-600 font-medium">
                  Timeframe: 2-3 weeks
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <div className="text-blue-600 font-bold text-xl">4</div>
              </div>
              <div>
                <h4 className="text-base font-medium mb-0.5">
                  Capacity Analysis & Adjustment
                </h4>
                <p className="text-gray-700 text-sm">
                  Review initial data, identify capacity issues, and make
                  adjustments to allocations and timelines.
                </p>
                <div className="mt-1 text-xs text-blue-600 font-medium">
                  Timeframe: 2 weeks
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <div className="text-blue-600 font-bold text-xl">5</div>
              </div>
              <div>
                <h4 className="text-base font-medium mb-0.5">
                  Ongoing Management Process
                </h4>
                <p className="text-gray-700 text-sm">
                  Establish regular review cadence and update process to
                  maintain accuracy of the capacity management tool.
                </p>
                <div className="mt-1 text-xs text-blue-600 font-medium">
                  Timeframe: Continuous
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 bg-gray-100 p-3 rounded-md flex items-center">
          <ClipboardCheckIcon size={24} className="text-blue-600 mr-3" />
          <div>
            <h4 className="text-base font-medium mb-0.5">Ready to Begin?</h4>
            <p className="text-sm">
              Let's schedule a kickoff workshop with key stakeholders to align
              on the approach and begin implementation.
            </p>
          </div>
          <ArrowRightIcon size={20} className="text-blue-600 ml-auto" />
        </div>
      </div>
    </div>;
};
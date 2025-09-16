import React from 'react';
import { TableIcon, ListIcon, LayersIcon } from 'lucide-react';
export const SolutionOverviewSlide: React.FC = () => {
  return <div className="w-full h-full flex flex-col p-8 bg-white">
      <div className="bg-blue-600 text-white py-2 px-6 rounded-t-md">
        <h2 className="text-2xl font-bold">
          Proposed Solution: Consolidated Scope Management
        </h2>
      </div>
      <div className="flex-1 p-4 border-2 border-t-0 border-gray-200 rounded-b-md overflow-hidden">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
            Step 1: Create a Consolidated Scope Spreadsheet
          </h3>
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-3">
              <TableIcon size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm">
                A single source of truth containing{' '}
                <strong>all initiatives</strong> across the technology
                organization:
              </p>
              <ul className="list-disc ml-6 mt-1 text-sm">
                <li>Current work in progress</li>
                <li>Upcoming initiatives</li>
                <li>Future planned work</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-md mb-4">
            <h4 className="font-semibold mb-2 text-sm">
              Key Information to Capture:
            </h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center">
                <ListIcon size={16} className="text-blue-600 mr-1" />
                <span>Initiative name</span>
              </div>
              <div className="flex items-center">
                <ListIcon size={16} className="text-blue-600 mr-1" />
                <span>Business priority</span>
              </div>
              <div className="flex items-center">
                <ListIcon size={16} className="text-blue-600 mr-1" />
                <span>Product area</span>
              </div>
              <div className="flex items-center">
                <ListIcon size={16} className="text-blue-600 mr-1" />
                <span>Timeline</span>
              </div>
              <div className="flex items-center">
                <ListIcon size={16} className="text-blue-600 mr-1" />
                <span>Dependencies</span>
              </div>
              <div className="flex items-center">
                <ListIcon size={16} className="text-blue-600 mr-1" />
                <span>Expected outcomes</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <LayersIcon size={20} className="text-blue-600 mr-2" />
            <p className="text-sm font-medium">
              This creates visibility and transparency across all technology
              initiatives for the CTO and leadership team.
            </p>
          </div>
        </div>
      </div>
    </div>;
};
import React from 'react';
import { ArrowRightIcon, NetworkIcon, ShuffleIcon } from 'lucide-react';
export const DemandManagementSlide: React.FC = () => {
  return <div className="w-full h-full flex flex-col p-8 bg-white">
      <div className="bg-blue-600 text-white py-2 px-6 rounded-t-md">
        <h2 className="text-2xl font-bold">
          Step 4: Cross-Team Demand Management
        </h2>
      </div>
      <div className="flex-1 p-4 border-2 border-t-0 border-gray-200 rounded-b-md overflow-hidden">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
            Tracking Cross-Functional Dependencies
          </h3>
          <div className="flex items-start mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-3">
              <NetworkIcon size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm">
                Track cross-team demands and dependencies in the consolidated
                spreadsheet:
              </p>
              <ul className="list-disc ml-6 mt-1 space-y-1 text-sm">
                <li>Skills or expertise needed from other teams</li>
                <li>Time requirements for supporting teams</li>
                <li>Timeline dependencies between teams</li>
                <li>Required approvals or reviews</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-md mb-4">
            <h4 className="font-semibold mb-2 text-sm">
              Cross-Team Demand Visualization
            </h4>
            <div className="relative h-48 bg-white p-2 border rounded-md">
              <div className="absolute top-4 left-4 w-28 h-16 bg-blue-100 border border-blue-400 rounded p-1 text-center flex flex-col justify-center">
                <div className="font-medium text-sm">Frontend Team</div>
                <div className="text-xs text-gray-500">4 Engineers</div>
              </div>
              <div className="absolute top-4 right-4 w-28 h-16 bg-green-100 border border-green-400 rounded p-1 text-center flex flex-col justify-center">
                <div className="font-medium text-sm">Backend Team</div>
                <div className="text-xs text-gray-500">5 Engineers</div>
              </div>
              <div className="absolute bottom-4 left-4 w-28 h-16 bg-purple-100 border border-purple-400 rounded p-1 text-center flex flex-col justify-center">
                <div className="font-medium text-sm">QA Team</div>
                <div className="text-xs text-gray-500">3 Engineers</div>
              </div>
              <div className="absolute bottom-4 right-4 w-28 h-16 bg-yellow-100 border border-yellow-400 rounded p-1 text-center flex flex-col justify-center">
                <div className="font-medium text-sm">DevOps Team</div>
                <div className="text-xs text-gray-500">2 Engineers</div>
              </div>
              {/* Arrows */}
              <div className="absolute top-12 left-[136px] w-[calc(100%-272px)] h-0 border-t-2 border-dashed border-gray-400 flex justify-center items-center">
                <div className="bg-white px-1 -mt-2 text-xs">30% demand</div>
                <ArrowRightIcon size={12} className="absolute right-0 -mt-1.5 text-gray-400" />
              </div>
              <div className="absolute top-[76px] left-[76px] h-[calc(100%-152px)] w-0 border-l-2 border-dashed border-gray-400 flex justify-center items-center">
                <div className="bg-white px-1 -ml-10 text-xs">20% demand</div>
                <ArrowRightIcon size={12} className="absolute bottom-0 rotate-90 -ml-1.5 text-gray-400" />
              </div>
              <div className="absolute top-[76px] right-[76px] h-[calc(100%-152px)] w-0 border-l-2 border-dashed border-gray-400 flex justify-center items-center">
                <div className="bg-white px-1 -ml-10 text-xs">40% demand</div>
                <ArrowRightIcon size={12} className="absolute top-0 rotate-270 -ml-1.5 text-gray-400" />
              </div>
              <div className="absolute bottom-12 left-[136px] w-[calc(100%-272px)] h-0 border-t-2 border-dashed border-gray-400 flex justify-center items-center">
                <div className="bg-white px-1 -mt-2 text-xs">15% demand</div>
                <ArrowRightIcon size={12} className="absolute right-0 -mt-1.5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-full mr-3">
              <ShuffleIcon size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">
                Benefits of Cross-Team Demand Tracking:
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  <span>Identify bottleneck teams with high demand</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  <span>Forecast resource needs across the organization</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  <span>
                    Prioritize cross-team requests based on strategic importance
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  <span>
                    Align delivery expectations with available capacity
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
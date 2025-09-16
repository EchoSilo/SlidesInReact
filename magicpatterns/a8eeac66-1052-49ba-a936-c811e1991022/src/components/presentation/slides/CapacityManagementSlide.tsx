import React from 'react';
import { BarChartIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
export const CapacityManagementSlide: React.FC = () => {
  return <div className="w-full h-full flex flex-col p-8 bg-white">
      <div className="bg-blue-600 text-white py-2 px-6 rounded-t-md">
        <h2 className="text-2xl font-bold">
          Step 3: Capacity Management & Analysis
        </h2>
      </div>
      <div className="flex-1 p-4 border-2 border-t-0 border-gray-200 rounded-b-md overflow-hidden">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
            Visualizing Capacity Constraints
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white shadow-md rounded-md p-3">
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertTriangleIcon size={16} className="text-red-500 mr-2" />
                <span>Capacity Issues to Identify</span>
              </h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Over-allocated resources (&gt;100%)</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Under-utilized resources (&lt;70%)</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Skills gaps and bottlenecks</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Conflicting resource demands</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Unbalanced team workloads</span>
                </li>
              </ul>
            </div>
            <div className="bg-white shadow-md rounded-md p-3">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircleIcon size={16} className="text-green-500 mr-2" />
                <span>Capacity Management Actions</span>
              </h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Rebalance team allocations</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Prioritize initiatives based on capacity</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Identify resource expansion needs</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Adjust timelines to match capacity</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Cross-train team members for flexibility</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-md">
            <h4 className="font-semibold flex items-center mb-2 text-sm">
              <BarChartIcon size={16} className="text-blue-600 mr-2" />
              <span>Capacity Analysis by Team and Product Area</span>
            </h4>
            <div className="flex space-x-4">
              <div className="w-1/2 h-24 bg-white p-2 rounded border">
                <div className="text-xs text-gray-600 mb-1">
                  Team Allocation Overview
                </div>
                <div className="flex items-end h-12 space-x-4">
                  <div className="h-full w-8 bg-blue-200 relative">
                    <div className="absolute bottom-0 w-full bg-blue-600 h-[70%]"></div>
                    <div className="absolute -bottom-5 w-full text-center text-xs">
                      Team A
                    </div>
                  </div>
                  <div className="h-full w-8 bg-blue-200 relative">
                    <div className="absolute bottom-0 w-full bg-red-500 h-[110%]"></div>
                    <div className="absolute -bottom-5 w-full text-center text-xs">
                      Team B
                    </div>
                  </div>
                  <div className="h-full w-8 bg-blue-200 relative">
                    <div className="absolute bottom-0 w-full bg-blue-600 h-[85%]"></div>
                    <div className="absolute -bottom-5 w-full text-center text-xs">
                      Team C
                    </div>
                  </div>
                  <div className="h-full w-8 bg-blue-200 relative">
                    <div className="absolute bottom-0 w-full bg-green-500 h-[60%]"></div>
                    <div className="absolute -bottom-5 w-full text-center text-xs">
                      Team D
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 h-24 bg-white p-2 rounded border">
                <div className="text-xs text-gray-600 mb-1">
                  Product Area Capacity
                </div>
                <div className="flex items-end h-12 space-x-4">
                  <div className="h-full w-8 bg-gray-200 relative">
                    <div className="absolute bottom-0 w-full bg-purple-500 h-[90%]"></div>
                    <div className="absolute -bottom-5 w-full text-center text-xs">
                      Area 1
                    </div>
                  </div>
                  <div className="h-full w-8 bg-gray-200 relative">
                    <div className="absolute bottom-0 w-full bg-purple-500 h-[75%]"></div>
                    <div className="absolute -bottom-5 w-full text-center text-xs">
                      Area 2
                    </div>
                  </div>
                  <div className="h-full w-8 bg-gray-200 relative">
                    <div className="absolute bottom-0 w-full bg-red-500 h-[105%]"></div>
                    <div className="absolute -bottom-5 w-full text-center text-xs">
                      Area 3
                    </div>
                  </div>
                  <div className="h-full w-8 bg-gray-200 relative">
                    <div className="absolute bottom-0 w-full bg-purple-500 h-[65%]"></div>
                    <div className="absolute -bottom-5 w-full text-center text-xs">
                      Area 4
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
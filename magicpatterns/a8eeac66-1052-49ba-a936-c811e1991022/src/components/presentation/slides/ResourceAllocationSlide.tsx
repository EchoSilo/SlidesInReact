import React from 'react';
import { UsersIcon, CalendarIcon, PercentIcon } from 'lucide-react';
export const ResourceAllocationSlide: React.FC = () => {
  return <div className="w-full h-full flex flex-col p-8 bg-white">
      <div className="bg-blue-600 text-white py-2 px-6 rounded-t-md">
        <h2 className="text-2xl font-bold">
          Step 2: Resource Allocation Framework
        </h2>
      </div>
      <div className="flex-1 p-4 border-2 border-t-0 border-gray-200 rounded-b-md overflow-hidden">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
            Mapping Resources to Scope
          </h3>
          <div className="flex items-start mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-3">
              <UsersIcon size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm mb-1">
                For each initiative in the consolidated scope spreadsheet,
                identify:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Team members assigned to the initiative</li>
                <li>Roles and responsibilities</li>
                <li>Required skill sets</li>
                <li>Primary and secondary resources</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-3">
              <PercentIcon size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm mb-1">Define allocation percentages:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Monthly allocation percentages for each resource</li>
                <li>Time tracking across multiple initiatives</li>
                <li>Accounting for non-project time (meetings, admin, etc.)</li>
                <li>Long-term allocation planning (6-12 months)</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <h4 className="font-semibold flex items-center mb-2 text-sm">
            <CalendarIcon size={16} className="text-green-600 mr-2" />
            <span>Sample Monthly Resource Allocation View:</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-2 py-1 text-left">Team Member</th>
                  <th className="px-2 py-1 text-left">Initiative A</th>
                  <th className="px-2 py-1 text-left">Initiative B</th>
                  <th className="px-2 py-1 text-left">Initiative C</th>
                  <th className="px-2 py-1 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-2 py-1 font-medium">Developer 1</td>
                  <td className="px-2 py-1">50%</td>
                  <td className="px-2 py-1">25%</td>
                  <td className="px-2 py-1">15%</td>
                  <td className="px-2 py-1">90%</td>
                </tr>
                <tr className="border-b bg-yellow-50">
                  <td className="px-2 py-1 font-medium">Developer 2</td>
                  <td className="px-2 py-1">40%</td>
                  <td className="px-2 py-1">40%</td>
                  <td className="px-2 py-1">30%</td>
                  <td className="px-2 py-1 text-red-600 font-bold">110%</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-medium">Designer</td>
                  <td className="px-2 py-1">20%</td>
                  <td className="px-2 py-1">30%</td>
                  <td className="px-2 py-1">20%</td>
                  <td className="px-2 py-1">70%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};
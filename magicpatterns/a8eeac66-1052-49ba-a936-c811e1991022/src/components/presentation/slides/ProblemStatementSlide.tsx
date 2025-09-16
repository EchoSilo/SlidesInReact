import React from 'react';
export const ProblemStatementSlide: React.FC = () => {
  return <div className="w-full h-full flex flex-col p-8 bg-white">
      <div className="bg-blue-600 text-white py-2 px-6 rounded-t-md">
        <h2 className="text-2xl font-bold">
          Current Challenges in Scope Management
        </h2>
      </div>
      <div className="flex-1 p-4 border-2 border-t-0 border-gray-200 rounded-b-md overflow-hidden">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
            The Problem:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm">
                !
              </div>
              <span className="text-sm">
                Decentralized roadmaps and backlogs across multiple teams
              </span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm">
                !
              </div>
              <span className="text-sm">
                No consolidated view of scope for executive leadership
              </span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm">
                !
              </div>
              <span className="text-sm">
                Limited visibility into resource allocation across initiatives
              </span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm">
                !
              </div>
              <span className="text-sm">
                Difficulty identifying capacity constraints and bottlenecks
              </span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm">
                !
              </div>
              <span className="text-sm">
                Reactive rather than proactive resource planning
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-4 bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
          <p className="text-sm italic">
            "Without a holistic view of scope and capacity, technology
            organizations struggle to deliver consistently and efficiently."
          </p>
        </div>
      </div>
    </div>;
};
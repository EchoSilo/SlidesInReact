import React from 'react';
import { CheckCircleIcon, TrendingUpIcon, EyeIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';
export const BenefitsSlide: React.FC = () => {
  return <div className="w-full h-full flex flex-col p-8 bg-white">
      <div className="bg-blue-600 text-white py-2 px-6 rounded-t-md">
        <h2 className="text-2xl font-bold">Key Benefits & Advantages</h2>
      </div>
      <div className="flex-1 p-4 border-2 border-t-0 border-gray-200 rounded-b-md overflow-hidden">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white shadow-md rounded-md p-3">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-2 rounded-full mr-2">
                <EyeIcon size={18} className="text-blue-600" />
              </div>
              <h3 className="text-base font-semibold">Enhanced Visibility</h3>
            </div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>
                  Complete view of all initiatives for CTO and leadership
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>Transparency into resource allocation across teams</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>
                  Early identification of capacity issues and bottlenecks
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-white shadow-md rounded-md p-3">
            <div className="flex items-center mb-2">
              <div className="bg-green-100 p-2 rounded-full mr-2">
                <TrendingUpIcon size={18} className="text-green-600" />
              </div>
              <h3 className="text-base font-semibold">Improved Planning</h3>
            </div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>Data-driven resource allocation decisions</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>Proactive capacity planning and forecasting</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>
                  Strategic alignment of initiatives with available resources
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-white shadow-md rounded-md p-3">
            <div className="flex items-center mb-2">
              <div className="bg-purple-100 p-2 rounded-full mr-2">
                <CalendarIcon size={18} className="text-purple-600" />
              </div>
              <h3 className="text-base font-semibold">Optimized Delivery</h3>
            </div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>Balanced workloads across teams and individuals</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>Reduced context-switching and multitasking</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>Improved predictability in delivery timelines</span>
              </li>
            </ul>
          </div>
          <div className="bg-white shadow-md rounded-md p-3">
            <div className="flex items-center mb-2">
              <div className="bg-yellow-100 p-2 rounded-full mr-2">
                <DollarSignIcon size={18} className="text-yellow-600" />
              </div>
              <h3 className="text-base font-semibold">Business Impact</h3>
            </div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>
                  Increased ROI through optimized resource utilization
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>More accurate budget and headcount planning</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon size={14} className="text-green-500 mr-1 mt-0.5" />
                <span>
                  Better alignment between technology delivery and business
                  goals
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-800">
            "By implementing this consolidated capacity management approach, the
            technology organization will move from reactive firefighting to
            strategic delivery planning, significantly improving execution and
            outcomes."
          </p>
        </div>
      </div>
    </div>;
};
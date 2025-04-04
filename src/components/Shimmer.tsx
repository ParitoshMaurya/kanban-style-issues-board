import React from 'react';

interface ShimmerProps {
  count?: number;
}

export const Shimmer: React.FC<ShimmerProps> = ({ count = 3 }) => {
  return (
    <div data-testid="shimmer-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-2 p-3 rounded-md shadow-sm border border-gray-200 bg-white overflow-hidden relative">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]">
            <div className="h-full w-[200%] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>
          
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 relative"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-2 relative"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-100 rounded w-1/4 relative"></div>
            <div className="flex gap-2">
              <div className="h-4 bg-gray-100 rounded w-4 relative"></div>
              <div className="h-4 bg-gray-100 rounded w-4 relative"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 
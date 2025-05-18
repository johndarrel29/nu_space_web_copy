import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ActivitySkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full max-w-md mx-auto mb-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
        >
          {/* Image Section with Badge */}
          <div className="relative h-40 w-full">
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full w-16">
              <Skeleton height={20} />
            </div>
            <Skeleton className="h-full w-full object-cover" />
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton height={20} width="60%" />
              <Skeleton height={20} width="20%" />
            </div>

            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="80%" />

            <div className="flex justify-between text-sm pt-2">
              <Skeleton height={16} width="40%" />
              <Skeleton height={16} width="30%" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ActivitySkeleton;

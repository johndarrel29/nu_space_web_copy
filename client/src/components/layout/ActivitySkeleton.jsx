import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Ensure the skeleton styles are imported

function ActivitySkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0 rounded-lg p-2 w-full max-w-sm mx-auto bg-white hover:bg-gray-200 cursor-pointer">
      {/* Skeleton for the image */}
      <div className="w-full md:w-2/5">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      {/* Skeleton for the text */}
      <div className="w-full md:w-3/5 flex flex-col space-y-2">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>
    </div>
  );
}

export default ActivitySkeleton;
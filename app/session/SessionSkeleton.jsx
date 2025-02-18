import React from 'react';

const SessionSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 mr-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-24 h-9 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-9 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default SessionSkeleton;
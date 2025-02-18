import React from 'react';

const SessionDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Details Tab */}
          <div className="space-y-6">
            <div>
              <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-6"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Tab */}
          <div className="hidden">
            <div className="rounded-md border">
              <div className="relative overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      {[...Array(4)].map((_, index) => (
                        <th key={index} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-gray-200">
                        {[...Array(4)].map((_, colIndex) => (
                          <td key={colIndex} className="px-4 py-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Tab */}
          <div className="hidden">
            <div className="rounded-md border">
              <div className="relative overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      {[...Array(3)].map((_, index) => (
                        <th key={index} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-gray-200">
                        {[...Array(3)].map((_, colIndex) => (
                          <td key={colIndex} className="px-4 py-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsSkeleton;
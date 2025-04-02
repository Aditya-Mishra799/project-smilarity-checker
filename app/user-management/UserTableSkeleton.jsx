const UserTableSkeleton = () => {
    return (
      <div className="w-full max-w-4xl overflow-x-auto animate-pulse">
        <h2 className="text-lg font-thin text-center my-4 text-slate-400 tracking-wider">
          Loading Users...
        </h2>
        <table className="min-w-full border-gray-300 mb-4">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400 text-base font-medium">
                Name
              </th>
              <th className="px-4 py-2 text-left text-gray-400 text-base font-medium">
                Email
              </th>
              <th className="px-4 py-2 text-left text-gray-400 text-base font-medium">
                Role
              </th>
              <th className="px-4 py-2 text-left text-gray-400 text-base font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <tr className="border-b" key={index}>
                <td className="px-4 py-2">
                  <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default UserTableSkeleton;
  
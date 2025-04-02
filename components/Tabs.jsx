"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Tabs = ({ tabs, currentTab }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tab) => {
    const basePath = pathname.substring(0, pathname.lastIndexOf("/"));
    const newPath = `${basePath}/${tab}`;
    router.push(newPath, { scroll: false });
  };

  const activeTab = tabs.find(tab => tab.key === currentTab);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-start border-b border-gray-300 overflow-x-auto">
        {tabs.map(({ label, key, Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 
              ${
                key === currentTab
                  ? "border-indigo-500 text-indigo-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-indigo-500"
              }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="mt-6 p-6 bg-white shadow rounded-lg">
        {activeTab?.component ? activeTab.component : <p className="text-gray-500">No content available</p>}
      </div>
    </div>
  );
};

export default Tabs;

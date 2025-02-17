import React, { useEffect, useRef } from "react";
import NavLinks from "./NavLinks";
import Logo from "./Logo"; // Assuming you have a Logo component
import { X } from "lucide-react"; // Import close icon from lucide-react

const Sidebar = ({ isOpen, toggleSidebar, user, setSidebarOpen }) => {
  const sideBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sideBarRef.current && !sideBarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleSidebar]);

  return (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-10 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:hidden`}
    >
      <div className="w-72 bg-white h-full shadow-lg p-4 z-20" ref={sideBarRef}>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 shadow-sm">
          <Logo />
          <button
            className="p-2 text-gray-700 rounded-md hover:bg-gray-200"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>
        <NavLinks user={user} />
      </div>
    </div>
  );
};

export default Sidebar;

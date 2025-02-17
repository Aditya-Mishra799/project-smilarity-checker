"use client"
import React, { useState } from 'react';
import Logo from './header/Logo';
import NavLinks from './header/NavLinks';
import Sidebar from './header/Sidebar';
import { Menu, X } from 'lucide-react'; // Importing hamburger and close icons

const Navbar = ({user}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <Logo />
        <button
          className="lg:hidden p-2 text-gray-700 rounded-md hover:bg-gray-200 transition-transform duration-300"
          onClick={toggleSidebar}
        >
          <div className={`transform ${isSidebarOpen ? 'rotate-180' : ''}`}>
            {isSidebarOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </div>
        </button>
        <div className="hidden lg:flex gap-4">
          <NavLinks user={user} />
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} user={user} setSidebarOpen = {setSidebarOpen} />
    </nav>
  );
};

export default Navbar;

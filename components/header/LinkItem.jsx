import Link from "next/link";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const LinkItem = ({ link }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isHovered, setHovered] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`flex items-center justify-between gap-2 text-gray-700 hover:text-blue-600 ${
          link.innerComponent ? "cursor-pointer" : ""
        }  
        mb-3 border-b border-gray-100  p-4 lg:mb-0 lg:pb-0 lg:border-b-0 lg:mr-2 lg:w-max`}
        onClick={link.innerComponent ? toggleDropdown : null}
      >
        {/* Main link */}
        <Link
          href={link?.href || "#"}
          className={`flex items-center gap-2 ${
            !link.innerComponent && "w-full"
          } t font-medium tracking-wider text-pretty text-base`}
        >
          {link.icon}
          {link.title}
        </Link>

        {/* Toggle Button */}
        {link.innerComponent && (
          <button
            className={`transform transition-transform ${
              isDropdownOpen || isHovered ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDown size={18} />
          </button>
        )}
      </div>

      {/* Dropdown Content */}
      <div className= {`absolute top-3/4 mt-2 z-10 bg-white shadow-lg rounded-md  group-hover:block ${isDropdownOpen ? "block" : ""} hidden`}>
        {link.innerComponent}
      </div>
    </div>
  );
};

export default LinkItem;

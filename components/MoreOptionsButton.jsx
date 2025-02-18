import React, { useState, useEffect } from 'react';
import { MoreVertical, Trash, Edit2 } from 'lucide-react';


const MoreOptionsButton = ({
  actions,
  disabled = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClickOutside = (e) => {
    setShowDropdown(false);
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  if (disabled || actions.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <MoreVertical size={18} className="text-gray-500" />
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-48 z-10">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setShowDropdown(false);
              }}
              className={`w-full px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2
                ${action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoreOptionsButton;
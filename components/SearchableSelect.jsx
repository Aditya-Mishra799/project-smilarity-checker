import { escapeRegExp } from "@/utils/basicUtils";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Label from "./Label";

const SearchableSelect = ({
  label,
  options,
  name,
  value = "",
  onChange,
  onBlur,
  placeholder,
  error,
  ref : inputRef,
  ...props
}) => {
  const [searchText, setSearchText] = useState(""); // Text typed in the input
  // const [selectedOption, setSelectedOption] = useState(""); // Currently selected option
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // For keyboard navigation

  const dropdownRef = useRef(null); // Reference to the dropdown container
  const selectRef = useRef(null);

  // Filter options based on the search term
  const filteredOptions = useMemo(() => {
    if (searchText.trim()) {
      const regex = new RegExp(`^${escapeRegExp(searchText.trim())}`, "i");
      return options.filter((option) => regex.test(option));
    }
    return options;
  }, [options, searchText]);

  // Handle option selection
  const handleOptionSelect = (selectedOption) => {
    onChange(selectedOption);
    setSearchText(""); // Clear search text
    setIsDropdownOpen(false); // Close dropdown
    setHighlightedIndex(-1); // Reset highlighted index
    onBlur()
  };

  // Scroll to the highlighted option when navigating with Arrow keys
  useEffect(() => {
    if (dropdownRef.current && highlightedIndex >= 0) {
      const optionElement = dropdownRef.current.children[highlightedIndex];
      if (optionElement) {
        optionElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) return;

    if (e.key === "ArrowDown") {
      // Highlight the next option
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Highlight the previous option
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      // Select the highlighted option or the option in the search text
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleOptionSelect(filteredOptions[highlightedIndex]);
      } else if (searchText.trim() && filteredOptions.length > 0) {
        handleOptionSelect(filteredOptions[0]); // Select the first option if no highlight
      }

      // Only clear the search text if an option was selected
      if (value || highlightedIndex >= 0) {
        setSearchText(""); // Clear search text if a valid selection was made
        setIsDropdownOpen(false); // Close dropdown
        onBlur()
      }
    } else if (e.key === "Escape") {
      // Close the dropdown
      setIsDropdownOpen(false);
      onBlur()
    }
  };



  useEffect(() => {
    const closeDropDown = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setSearchText("")
        onBlur()
      }
    };
    document.addEventListener("mousedown", closeDropDown);
    return () => {
      document.removeEventListener("mousedown", closeDropDown);
    };
  }, []);

  return (
    <div
      className="flex flex-col gap-2 w-full"
      onDoubleClick={() => {
        if (value) {
          onChange("");
          setIsDropdownOpen(true);
        }
      }}
    >
      <Label label={label} htmlFor={name}/>
      <div ref={selectRef}>
        <div className="relative">
          {/* Input Field */}
          <input
            placeholder={placeholder}
            value={value || searchText} 
            onChange={(e) => setSearchText(e.target.value)}
            readOnly={Boolean(value)} 
            name={name}
            id={name}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsDropdownOpen(true)} 
            className={`px-4 py-2 rounded-md border w-full ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent`}
            ref = {inputRef}
            {...props}
          />

          {/* Dropdown */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute w-full top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-40 overflow-y-auto overflow-x-hidden text-ellipsis"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option}
                    className={`px-4 py-2 cursor-pointer ${
                      index === highlightedIndex
                        ? "bg-slate-200"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => handleOptionSelect(option)} // Select option on click
                    onMouseEnter={() => setHighlightedIndex(index)} // Highlight on hover
                    onMouseLeave={() => setHighlightedIndex(-1)} // Remove highlight on mouse leave
                  >
                    {option}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No options found</div>
              )}
            </div>
          )}

          {/* Clear Selection Button */}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(""); // Clear selected option
                setIsDropdownOpen(true); // Reopen dropdown
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchableSelect;

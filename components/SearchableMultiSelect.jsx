"use client";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { escapeRegExp } from "@/utils/basicUtils";
import Label from "./Label";

const SearchableMultiSelect = ({
  label,
  options,
  name,
  value = [],
  onChange,
  onBlur,
  placeholder = "Select options...",
  error,
  ref: inputRef,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(""); // Search input value
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // For keyboard navigation

  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  // Filter available options based on search input
  const filteredOptions = useMemo(() => {
    const availableOptions = options.filter(
      (option) => !value.includes(option)
    );

    if (inputValue.trim()) {
      const regex = new RegExp(`^${escapeRegExp(inputValue.trim())}`, "i");
      return availableOptions.filter((option) => regex.test(option));
    }

    return availableOptions;
  }, [options, inputValue, value]);

  // Handle option selection
  const handleSelectOption = (option) => {
    onChange([...value, option]);
    setInputValue("");
  };

  // Remove selected item
  const handleRemoveItem = (item) => {
    onChange(value.filter((selected) => selected !== item));
  };

  // Scroll to highlighted option when navigating with keys
  useEffect(() => {
    if (dropdownRef.current && highlightedIndex >= 0) {
      const optionElement = dropdownRef.current.children[highlightedIndex];
      if (optionElement) {
        optionElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        onBlur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 w-fit">
      <Label label={label} htmlFor={name} />
      <div className="relative" ref={selectRef}>
        {/* Input Field */}
        <div
          className={`flex flex-wrap items-center gap-2 px-2 py-1 border rounded-md focus-within:ring-2 ${
            error
              ? "border-red-500 ring-red-300"
              : "border-gray-300 focus-within:ring-slate-500"
          } ${className}`}
        >
          {value.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1 px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-sm"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemoveItem(item)}
                className="text-slate-500 hover:text-gray-700"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </div>
          ))}
          <input
            type="text"
            id={name}
            name={name}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={onBlur}
            ref={inputRef}
            className="flex-grow focus:outline-none"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-controls={`${name}-dropdown`}
            {...props}
          />
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <ul
            ref={dropdownRef}
            id={`${name}-dropdown`}
            className="absolute mt-1 max-h-40 w-full overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10"
            aria-live="polite"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option}
                  className={`px-4 py-2 cursor-pointer ${
                    index === highlightedIndex
                      ? "bg-slate-200 text-slate-800"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No options found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchableMultiSelect;

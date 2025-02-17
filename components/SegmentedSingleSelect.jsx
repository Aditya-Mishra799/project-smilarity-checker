import React from "react";
import Label from "./Label";

const SegmentedSingleSelect = ({
  name,
  onChange,
  value,
  onBlur,
  ref,
  error,
  label,
  options,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-max">
      <Label label={label} htmlFor={name}/>
      <div
        className="w-full border border-gray-300 rounded-md overflow-x-auto flex justify-center items-center text-sm"
        ref={ref}
        role="radiogroup"
        aria-labelledby={label}
      >
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            onBlur={onBlur}
            type="button"
            role="radio"
            aria-checked={value === option}
            className={`flex-shrink-0 whitespace-nowrap w-auto  text-center cursor-pointer px-2 py-2 transition-colors focus:outline-none ${
              value === option
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-800"
            } ${index === 0 ? "rounded-l-md" : ""} ${
              index === options.length - 1 ? "rounded-r-md" : ""
            } ${
              value !== option ? "hover:bg-gray-100 hover:text-slate-900" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedSingleSelect;

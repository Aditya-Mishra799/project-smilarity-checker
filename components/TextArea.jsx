import React from "react";
import Label from "./Label";

const TextArea = ({
  name,
  onChange,
  ref,
  onBlur,
  value,
  className = "",
  error = null,
  label,
  placeholder = "Enter text here...",
  rows = 4,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
       <Label label={label} htmlFor={name}/>
      <textarea
        id={name}
        name={name}
        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 
          ${
            error
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:border-slate-400"
          }
          text-slate-800 placeholder-gray-500
          shadow-sm focus:ring-0 focus:bg-white hover:shadow-md resize-none ${className}`}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        ref={ref}
        {...props}
      ></textarea>
    </div>
  );
};

export default TextArea;

"use client";
import React from "react";

const Slider = ({
  label = "Select Value",
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`w-fit ${className}`}
    >
      {/* Label */}
      {label && (
        <label >{label}</label>
      )}

      {/* Value Display */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400">{min}</span>
        <span className="text-sm text-white bg-slate-700 px-4 py-1.5 rounded-lg shadow-md">
          {value}
        </span>
        <span className="text-sm text-gray-400">{max}</span>
      </div>

      {/* Slider Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer transition-all duration-300
          accent-slate-400 hover:accent-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
        {...props}
      />
    </div>
  );
};

export default Slider;

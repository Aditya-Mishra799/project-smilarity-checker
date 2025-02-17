"use client";
import React from "react";
import Label from "./Label";

const PercentageInput = ({ label, name, value, onChange, className = "" }) => {
  const handleChange = (e) => {
    let val = e.target.value;
    if (val === "") {
      onChange("");
      return;
    }
    val = Math.min(100, Math.max(0, Number(val)));
    onChange(val);
  };

  return (
    <div className="flex flex-col w-full">
      <Label label={label} htmlFor={name} />
      <div className="relative flex items-center">
        <input
          id={name}
          name={name}
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          className={`px-4 py-2 rounded-md border w-full border-gray-300 focus:outline-none focus:border-slate-700 ${className}`}
        />
        <span className="absolute right-3 text-gray-500">%</span>
      </div>
    </div>
  );
};

export default PercentageInput;

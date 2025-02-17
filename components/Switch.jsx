"use client";
import React from "react";
import Label from "./Label";

const Switch = ({ label, name, value, onChange, className = "" }) => {
  return (
    <div className="flex flex-col w-full">
      <Label label={label} htmlFor={name} />
      <div className="relative flex items-center mt-2">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 
          ${value ? "bg-slate-700" : "bg-gray-300"}`}
          onClick={() => onChange(!value)}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 
            ${value ? "translate-x-6" : "translate-x-0"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Switch;

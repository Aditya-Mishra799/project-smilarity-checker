"use client"
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons
import Label from "./Label";

const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  error,
  className = "",
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle visibility

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle password visibility
  };

  return (
    <div className="flex flex-col w-full">
      <Label label={label} htmlFor={name}/>
      <div className="relative flex items-center">
        <input
          id={name}
          name={name}
          type={isPasswordVisible ? "text" : type} // Toggle between password and text type
          placeholder={placeholder}
          className={`px-4 py-2 rounded-md border w-full ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none  focus:border-slate-700 ${type === "password" ? "pr-10" : ""}
           ${className} `}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-label="Toggle password visibility"
          >
            {isPasswordVisible ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;

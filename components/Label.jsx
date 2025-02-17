import React from "react";

const Label = ({ label, htmlFor, className = "", ...props }) => {
  return (
    <>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`text-gray-700 text-[0.9em] font-medium mb-1 tracking-wide ${className}`}
          {...props}
        >
          {label}
        </label>
      )}
    </>
  );
};

export default Label;

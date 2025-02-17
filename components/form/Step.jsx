"use client";
import React from "react";
import ControlFormField from "./ControlFormField";

const Step = ({ fields }) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-wrap gap-4 lg:gap-6">
      {fields.map((field) => {
        const {fullWidth, ...fieldProps} = field
        return (
        <div
          key={field.name}
          className={`${
            fullWidth ? "w-full"
              : "w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
          } flex-shrink-0`}
        >
          <ControlFormField {...fieldProps} />
        </div>
      )})}
    </div>
  );
};

export default Step;

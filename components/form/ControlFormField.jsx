import React from "react";
import { useController } from "react-hook-form";

const ControlFormField = ({
  name,
  control,
  rules,
  component: Component,
  defaultValue = "",
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });
  return (
    <div className="flex flex-col">
      <Component {...field} {...props} error={error} />
      {error && (
        <span className="text-red-500 text-sm mt-1">{error.message}</span>
      )}
    </div>
  );
};

export default ControlFormField;

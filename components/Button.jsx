import React from "react";
import { Loader2 } from "lucide-react"; // For the loader icon
import clsx from "clsx";

const Button = ({
  onClick,
  disabled,
  loading,
  children,
  loadingText = "Submitting...",
  className = "",
  error = false,
  type = "button",
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type = {type}
      {...rest}
      className={clsx(
        "relative flex items-center justify-center px-4 py-2 text-base font-medium rounded-md transition-transform duration-300 focus:outline-none",
        "border border-transparent shadow-sm",
        "hover:shadow-lg hover:scale-105",
        disabled
          ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
          : error
          ? "bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300"
          : "bg-gradient-to-r from-slate-900 via-gray-800 to-neutral-900 text-white hover:bg-gradient-to-bl",
        loading && "opacity-70",
        className
      )}
    >
      {/* Loader with transition */}
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin w-5 h-5" size = {12}/>
          { loadingText && (<span className="text-sm">{loadingText}</span>) }
        </div>
      ) : (
        <>{children}</>
      )}

      {/* Gradient background animation */}
      {!loading && !disabled && !error && (
        <span
          className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-gray-800 via-slate-700 to-gray-900 opacity-90"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default Button;

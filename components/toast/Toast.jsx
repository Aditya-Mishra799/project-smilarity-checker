import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useToast } from "./ToastProvider";

const Toast = ({ id, type = "default", content }) => {
  const { removeToast } = useToast();

  const typeStyles = {
    success: "bg-green-100 text-green-800 border-green-400",
    error: "bg-red-100 text-red-800 border-red-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    default: "bg-gray-100 text-gray-800 border-gray-400",
    info: "bg-slate-800 text-white"
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 text-xs tracking-wide
      rounded-lg shadow-md w-[300px] md:w-[350px] max-w-full mb-4
      transition-all duration-300 ease-in-out transform opacity-100 translate-y-0
      ${typeStyles[type]} 
      animate-fade-in`}
    >
      <div>{content}</div>
      <button
        className="ml-4 text-slate-100 hover:text-gray-200 hover:scale-110"
        onClick={() => removeToast(id)}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;

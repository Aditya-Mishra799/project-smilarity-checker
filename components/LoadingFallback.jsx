import React from "react";
import { Loader2 } from "lucide-react";

const LoadingFallback = ({ message = "Loading...", fullPage = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full h-full gap-4  animate-pulse ${fullPage ? "w-screen h-screen": ""}`}>
      <Loader2 className="w-10 h-10 text-slate-800 animate-spin " />
      <p className="text-lg font-medium text-slate-700">{message}</p>
    </div>
  );
};

export default LoadingFallback;

import React from "react";
import { Frown } from "lucide-react"; // Import the Frown icon from Lucide
import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <Frown className="w-12 h-12 text-slate-500 mb-4 mx-auto" />
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          Oops! The page you are looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="text-slate-800 bg-slate-200 hover:bg-slate-300 py-2 px-4 rounded-md transition duration-300 ease-in-out"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Custom404;

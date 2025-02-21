import { HousePlus, Notebook } from "lucide-react";
import Image from "next/image";
import React from "react";
import icon from "@/public/favicon.png"

const Logo = () => {
  return (
    <div className="flex gap-2 items-center">
      <h1 className="text-base font-bold tracking-wider uppercase text-gray-800 sm:text-xl md:text-2xl">
        Project Manager
      </h1>
      {/* <Notebook className="w-6 h-6 text-indigo-500 md:w-8 md:h-8" /> */}

      <Image src={icon} alt="logo" width={26} height={26} />
    </div>
  );
};

export default Logo;

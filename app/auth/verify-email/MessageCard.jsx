import React from "react";
import Warn from "@/public/warn.svg";
import CheckList from "@/public/checklist.svg";
import Image from "next/image";
import Link from "next/link";

const MessageCard = ({ success = true, message = "" }) => {
  return (
    <div className="bg-white p-8 shadow-lg rounded text-center  flex items-center flex-col gap-4 lg:w-96">
      {!success ? (
        <Image src={Warn} alt="Warning" width={200}/>
      ) : (
        <Image src={CheckList} alt="verified" width={200}/>
      )}
      {message && <p className={`tracking-wide text-gray-600 ${success ? "text-green-500": "text-red-400"}`}>{message}</p>}
      {success && <Link className= "bg-slate-800 text-white rounded-md px-4 py-2 w-full" href = "/auth/signin">Login</Link>}
    </div>
  );
};

export default MessageCard;

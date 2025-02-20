import { User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const ProfileMenu = ({ user }) => {
  if (!user) {
    return null; // Return nothing if the user object is not provided
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-md w-64">
      {/* User Info */}
      <Link className="flex items-center gap-3 mb-4" href={"/profile"}>
      {user?.image ? <img
          src={user?.image}
          alt="User Avatar"
          className="w-12 h-12 rounded-full border-2 border-blue-500"
        />:  <User className=" text-gray-400 rounded-full border-2 border-blue-500" size = {36} />}
        <div>
          <p className="text-gray-800 font-semibold text-base">{user.name}</p>
          <p className="text-gray-500 text-xs tracking-wide">{user.email}</p>
        </div>
      </Link>

      {/* Links */}
      <div className="space-y-2 text-sm">
        <Link
          href="/session/upsert"
          className="block text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Create Session
        </Link>
        <button
          href="/logout"
          className="block text-red-500 hover:text-red-700 font-medium transition"
          onClick={()=>signOut({ callbackUrl: '/', redirect:true })}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;

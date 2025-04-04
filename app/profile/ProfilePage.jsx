"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FileImage, Loader2, Upload, User } from "lucide-react";
import { useToast } from "@/components/toast/ToastProvider";
import { updateProfileImage } from "@/server-actions/userProfileActions";
import axios from "axios";

const ProfilePage = ({ initialData }) => {
  const { data: session, update } = useSession();
  const { addToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState(initialData);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <label
                className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                htmlFor="profile-image"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <FileImage className="w-5 h-5 text-white" />
                )}
              </label>
              <input
                type="file"
                id="profile-image"
                className="hidden"
                accept="image/*"
                onChange={()=> {}}
                disabled={isUploading}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {session?.user?.name}
              </h1>
              <p className="text-gray-600 mb-4">{session?.user?.email}</p>
              <p className="text-gray-600 mb-4"><span className="font-semibold">Role:</span> {session?.user?.role}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Activity Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData?.totalProjects || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData?.activeSessions || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Project Status
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Accepted</span>
                  <span className="text-green-600 font-semibold">
                    {profileData?.acceptedProjects || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="text-yellow-600 font-semibold">
                    {profileData?.pendingProjects || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rejected</span>
                  <span className="text-red-600 font-semibold">
                    {profileData?.rejectedProjects || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
"use client";

import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useSession } from "next-auth/react";
import {
  Users,
  FolderGit,
  Info,
  Upload,
  MoreVertical,
  Trash,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { DataTable } from "./DataTable";
import { useToast } from "@/components/toast/ToastProvider";
import {
  getSessionProjects,
  getSessionUsers,
  updateSessionCoAdmin,
  removeProject,
} from "@/server-actions/sessionDetailsAction";
import SessionDetailsSkeleton from "./SessionDetailsSkeleton";
import Link from "next/link";

const SessionDetailsPage = ({ id, session, userAccess }) => {
  const { data: sessionData } = useSession();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [projectsPage, setProjectsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectsPagination, setProjectsPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
  });
  const [usersPagination, setUsersPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
  });

  const fetchProjects = async (page) => {
    setIsLoading(true);
    try {
      const response = await getSessionProjects(session._id, page);
      console.log(response);
      if (response.success) {
        setProjects(response.data.projects);
        setProjectsPagination(response.data.pagination);
      }
    } catch (error) {
      addToast("error", "Failed to fetch projects");
    }
    setIsLoading(false);
  };

  const fetchUsers = async (page) => {
    setIsLoading(true);
    try {
      const response = await getSessionUsers(session._id, page);
      if (response.success) {
        setUsers(response.data.users);
        setUsersPagination(response.data.pagination);
      }
    } catch (error) {
      addToast("error", "Failed to fetch users");
    }
    setIsLoading(false);
  };

  const handleRemoveProject = async (projectId) => {
    try {
      const response = await removeProject(projectId, session._id);
      if (response.success) {
        addToast("success", "Project removed successfully");
        fetchProjects(projectsPage);
      } else {
        addToast("error", response.error || "Failed to remove project");
      }
    } catch (error) {
      addToast("error", "Failed to remove project");
    }
  };

  const handleCoAdminUpdate = async (userId, action) => {
    try {
      const response = await updateSessionCoAdmin(session._id, userId, action);
      if (response.success) {
        addToast(
          "success",
          `Co-admin ${action === "add" ? "added" : "removed"} successfully`
        );
        // Refresh the session details
        window.location.reload();
      } else {
        addToast("error", response.error || `Failed to ${action} co-admin`);
      }
    } catch (error) {
      addToast("error", `Failed to ${action} co-admin`);
    }
  };

  const projectColumns = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.status === "accepted"
              ? "bg-green-100 text-green-700"
              : row.original.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Creator",
      accessorKey: "creator.name",
    },
    {
      header: "Actions",
      cell: ({ row }) =>
        userAccess.hasAdminAccess && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRemoveProject(row.original._id)}
              className="p-1 hover:bg-red-50 rounded-full text-red-600"
            >
              <Trash size={16} />
            </button>
          </div>
        ),
    },
  ];

  const userColumns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Actions",
      cell: ({ row }) =>
        userAccess.isCreator && (
          <div className="flex items-center gap-2">
            {session.coAdmins.some(
              (admin) => admin._id === row.original._id
            ) ? (
              <button
                onClick={() => handleCoAdminUpdate(row.original._id, "remove")}
                className="p-1 hover:bg-red-50 rounded-full text-red-600"
              >
                <UserMinus size={16} />
              </button>
            ) : (
              <button
                onClick={() => handleCoAdminUpdate(row.original._id, "add")}
                className="p-1 hover:bg-green-50 rounded-full text-green-600"
              >
                <UserPlus size={16} />
              </button>
            )}
          </div>
        ),
    },
  ];

  if (!session) {
    return <SessionDetailsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.name}
              </h1>
              <p className="text-gray-600 mt-1">{session.description}</p>
            </div>
            <div className="flex items-center gap-4">
              {userAccess.hasAdminAccess && (
                <Link href={`/session/${id}/bulk-add`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Link>
              )}
              <Link href={`/session/${id}/project`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add Project
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Status</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {session.status}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Threshold</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {session.threshold}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">
                Created By
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {session.creator.name}
              </div>
            </div>
          </div>
        </div>

        <Tabs
          selectedIndex={activeTab}
          onSelect={(index) => {
            setActiveTab(index);
            if (index === 1 && projects.length === 0) {
              fetchProjects(1);
            } else if (index === 2 && users.length === 0) {
              fetchUsers(1);
            }
          }}
        >
          <TabList className="flex border-b border-gray-200">
            <Tab
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
              selectedClassName="text-indigo-600 border-b-2 border-indigo-500"
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Details
              </div>
            </Tab>
            <Tab
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
              selectedClassName="text-indigo-600 border-b-2 border-indigo-500"
            >
              <div className="flex items-center gap-2">
                <FolderGit className="h-4 w-4" />
                Projects
              </div>
            </Tab>
            <Tab
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
              selectedClassName="text-indigo-600 border-b-2 border-indigo-500"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </div>
            </Tab>
          </TabList>

          <div className="p-6">
            <TabPanel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Session Information
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Description
                      </h4>
                      <p className="mt-2 text-sm text-gray-900">
                        {session.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Co-Admins
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {session.coAdmins.map((admin) => (
                          <li
                            key={admin._id}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-900">
                              {admin.name}
                            </span>
                            {userAccess.isCreator && (
                              <button
                                onClick={() =>
                                  handleCoAdminUpdate(admin._id, "remove")
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <UserMinus size={16} />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <DataTable
                data={projects}
                columns={projectColumns}
                isLoading={isLoading}
                pagination={{
                  page: projectsPagination.page,
                  pages: projectsPagination.pages,
                  total: projectsPagination.total,
                  onPageChange: (page) => {
                    setProjectsPage(page);
                    fetchProjects(page);
                  },
                }}
              />
            </TabPanel>

            <TabPanel>
              <DataTable
                data={users}
                columns={userColumns}
                isLoading={isLoading}
                pagination={{
                  page: usersPagination.page,
                  pages: usersPagination.pages,
                  total: usersPagination.total,
                  onPageChange: (page) => {
                    setUsersPage(page);
                    fetchUsers(page);
                  },
                }}
              />
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SessionDetailsPage;

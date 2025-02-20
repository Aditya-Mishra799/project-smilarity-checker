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
  Edit,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { DataTable } from "./DataTable";
import { useToast } from "@/components/toast/ToastProvider";
import {
  getSessionProjects,
  getSessionUsers,
  updateSessionCoAdmin,
  removeProject,
  exportProjectsCSV,
} from "@/server-actions/sessionDetailsAction";
import SessionDetailsSkeleton from "./SessionDetailsSkeleton";
import Link from "next/link";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import AddCoAdminModal from "./AddCoAdminModal";
import Button from "@/components/Button";

const SessionDetailsPage = ({ id, session, userAccess }) => {
  const { data: sessionData } = useSession();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    data: null,
  });

  const [projectsPage, setProjectsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandDesciption, setExpandDescirption] = useState(false);
  const [projectsPagination, setProjectsPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
  });
  const [isAddCoAdminDialogOpen, setIsAddCoAdminDialogOpen] = useState(false);
  const [usersPagination, setUsersPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
  });
  // Filters state
  const [projectFilters, setProjectFilters] = useState({
    search: "",
    status: "all",
  });

  const fetchProjects = async (page, filters = {}) => {
    setIsLoading(true);
    try {
      const response = await getSessionProjects(session._id, page, 10, filters);
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
        fetchProjects(projectsPage, projectFilters);
        setConfirmDialog({ isOpen: false, type: null, data: null });
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
        window.location.reload();
      } else {
        addToast("error", response.error || `Failed to ${action} co-admin`);
      }
    } catch (error) {
      addToast("error", `Failed to ${action} co-admin`);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsLoading(true);
      const response = await exportProjectsCSV(session._id);
      if (response.success) {
        // Convert to CSV
        const csvContent = [
          Object.keys(response.data[0]).join(","),
          ...response.data.map((row) =>
            Object.values(row)
              .map((value) => `"${String(value).replace(/"/g, '""')}"`)
              .join(",")
          ),
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `session_${session._id}_projects.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast("success", "Projects exported successfully");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      addToast("error", "Failed to export projects");
    } finally {
      setIsLoading(false);
    }
  };

  const projectColumns = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <Link
          href={`/session/${session._id}/project/${row.original._id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {row.original.title}
        </Link>
      ),
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {(userAccess.hasAdminAccess || userAccess.isCreator) && (
            <Link
              href={`/session/${session._id}/project/upsert?projectId=${row.original._id}`}
              className="p-1 hover:bg-blue-50 rounded-full text-blue-600"
            >
              <Edit size={16} />
            </Link>
          )}
          {userAccess.hasAdminAccess && (
            <button
              onClick={() =>
                setConfirmDialog({
                  isOpen: true,
                  type: "removeProject",
                  data: row.original._id,
                })
              }
              className="p-1 hover:bg-red-50 rounded-full text-red-600"
            >
              <Trash size={16} />
            </button>
          )}
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
                onClick={() =>
                  setConfirmDialog({
                    isOpen: true,
                    type: "removeCoAdmin",
                    data: row.original._id,
                  })
                }
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
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.name}
              </h1>
              <p
                className={`text-gray-600 mt-1 ${
                  expandDesciption ? "" : "line-clamp-3"
                } hover:line-clamp-none`}
                onClick = {()=>setExpandDescirption(prev => !prev)}
              >
                {session.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              {userAccess.hasAdminAccess && (
                <Link
                  href={`/session/${id}/bulk-upload`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto justify-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Link>
              )}
              <Link
                href={`/session/${id}/project`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto justify-center"
              >
                Add Project
              </Link>
              {userAccess.isCreator && (
                <Link
                  href={`/session/upsert?id=${id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full md:w-auto justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Session
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">
                Auto Reject
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {session.autoReject ? "On" : "Off"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">
                Created On
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {new Date(session.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        <Tabs
          selectedIndex={activeTab}
          onSelect={(index) => {
            setActiveTab(index);
            if (index === 1 && projects.length === 0) {
              fetchProjects(1, projectFilters);
            } else if (index === 2 && users.length === 0) {
              fetchUsers(1);
            }
          }}
        >
          <TabList className="flex border-b border-gray-200 overflow-x-auto">
            <Tab
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer whitespace-nowrap"
              selectedClassName="text-indigo-600 border-b-2 border-indigo-500"
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Details
              </div>
            </Tab>
            <Tab
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer whitespace-nowrap"
              selectedClassName="text-indigo-600 border-b-2 border-indigo-500"
            >
              <div className="flex items-center gap-2">
                <FolderGit className="h-4 w-4" />
                Projects
              </div>
            </Tab>
            <Tab
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer whitespace-nowrap"
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 ">
                      Co-Adminis
                    </h3>
                    {userAccess.isCreator && (
                      <Button
                        onClick={() => setIsAddCoAdminDialogOpen(true)}
                        className={"text-xs flex gap-2"}
                      >
                        Add Co-Admin
                        <UserPlus className="text-xs" size={14} />
                      </Button>
                    )}
                  </div>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            {userAccess.isCreator && (
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {session.coAdmins.map((admin) => (
                            <tr key={admin._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {admin.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {admin.email}
                                </div>
                              </td>
                              {userAccess.isCreator && (
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <button
                                    onClick={() =>
                                      setConfirmDialog({
                                        isOpen: true,
                                        type: "removeCoAdmin",
                                        data: admin._id,
                                      })
                                    }
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <UserMinus size={20} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                          {session.coAdmins.length === 0 && (
                            <tr>
                              <td
                                colSpan={userAccess.isCreator ? 3 : 2}
                                className="px-6 py-4 text-center text-sm text-gray-500"
                              >
                                No co-administrators assigned
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={projectFilters.search}
                        onChange={(e) => {
                          setProjectFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }));
                          fetchProjects(1, {
                            ...projectFilters,
                            search: e.target.value,
                          });
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <select
                      value={projectFilters.status}
                      onChange={(e) => {
                        setProjectFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }));
                        fetchProjects(1, {
                          ...projectFilters,
                          status: e.target.value,
                        });
                      }}
                      className="w-full sm:w-auto pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      onClick={handleExportCSV}
                      disabled={isLoading || projects.length === 0}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
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
                        fetchProjects(page, projectFilters);
                      },
                    }}
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="overflow-x-auto">
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
              </div>
            </TabPanel>
          </div>
        </Tabs>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({ isOpen: false, type: null, data: null })
        }
        onConfirm={() => {
          if (confirmDialog.type === "removeProject") {
            handleRemoveProject(confirmDialog.data);
          } else if (confirmDialog.type === "removeCoAdmin") {
            handleCoAdminUpdate(confirmDialog.data, "remove");
          }
        }}
        title={
          confirmDialog.type === "removeProject"
            ? "Remove Project"
            : "Remove Co-Admin"
        }
        message={
          confirmDialog.type === "removeProject"
            ? "Are you sure you want to remove this project? This action cannot be undone."
            : "Are you sure you want to remove this co-administrator? They will lose administrative access to this session."
        }
        type="danger"
      />
      <AddCoAdminModal
        isOpen={isAddCoAdminDialogOpen}
        onClose={() => setIsAddCoAdminDialogOpen(false)}
        sessionId={id}
      />
    </div>
  );
};

export default SessionDetailsPage;

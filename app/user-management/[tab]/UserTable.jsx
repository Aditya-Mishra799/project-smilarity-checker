"use client";
import { useToast } from "@/components/toast/ToastProvider";
import useApiHandler from "@/hooks/useApiHandler";
import {
  changeUserRole,
  getUsers,
} from "@/server-actions/userManagementActions";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import NotFound from "@/public/not-found.svg";
import Image from "next/image";

const limitOptions = [5, 10, 20, 30, 50];
const UserTable = ({ type, limit = 20, page = 1 }) => {
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);
  const [query, setQuery] = useState("");
  const [paginationData, setPaginationData] = useState({
    limit: limit,
    page: page,
    totalPages: 0,
    totalDocuments: 0,
  });
  const { addToast } = useToast();
  const [selectedUser, setSelectedUser] = useState(null);
  const fetchUsers = useApiHandler(async () => {
    try {
      const response = await getUsers(
        paginationData.page,
        paginationData.limit,
        query,
        type
      );
      if (!response.success) throw new Error(response.message);
      setUsers(response.data.users);
      setPaginationData((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalDocuments: response.data.totalPages,
      }));
    } catch (error) {
      addToast("error", error.message || "Failed to fetch users");
    }
  });
  const handleRoleChange = useApiHandler(async (userId, role) => {
    try {
      setSelectedUser(userId);
      const response = await changeUserRole(userId, role);
      if (!response.success) throw new Error(response.message);
      setReload((prev) => !prev);
      addToast("success", response.message || "Changed user role successfully");
    } catch (error) {
      addToast("error", error.message || "Failed to chnage user role.");
    } finally {
      setSelectedUser(null);
    }
  });
  useEffect(() => {
    let timer = setTimeout(fetchUsers.execute, 300);
    return () => clearTimeout(timer);
  }, [reload, paginationData.limit, paginationData.page, query]);

  const skeleton = (
    <>
      {[...Array(8)].map((_, index) => (
        <tr className="border-b animate-pulse" key={index}>
          <td className="px-4 py-2">
            <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-8 w-20 bg-gray-300 rounded-md"></div>
          </td>
        </tr>
      ))}
    </>
  );
  const NotFoundPlaceHolder = (
    <div className="w-full mt-4 flex flex-col justify-center items-center text-center">
      <Image src={NotFound} alt="Not-found" width={200} />
      <span className="text-slate-600 mt-4"> No users found !!! </span>
    </div>
  );
  return (
    <div className="w-full">
      <div className="w-full max-auto max-w-4xl overflow-x-auto">
        {users.length === 0 && !fetchUsers.apiState.loading && query === "" ? (
          NotFoundPlaceHolder
        ) : (
          <>
            {paginationData.totalPages > 0 && (
              <h2 className="text-lg font-normal text-center my-4 text-slate-700 tracking-wider">
                Page {paginationData.page} of {paginationData.totalPages}
              </h2>
            )}
            <div className="flex justify-between gap-4 mb-4 mx-4">
              <input
                className="w-full flex-4 border border-indigo-600 px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-0 mt-4"
                placeholder="Search by Email or Name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <table className="min-w-full  border-gray-300 mb-4">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 text-base font-medium">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 text-base font-medium">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 text-base font-medium">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 text-base font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchUsers.apiState.loading
                  ? skeleton
                  : users.length > 0 &&
                    users.map(({ name, email, role, _id }) => (
                      <tr className="border-b" key={_id}>
                        <td className="w-fit text-nowrap px-4 py-2 text-sm font-normal tracking-wide">
                          {name}
                        </td>
                        <td className="w-fit text-nowrap px-4 py-2 text-xs font-normal tracking-wide">
                          {email}
                        </td>
                        <td className="w-fit text-nowrap px-4 py-2 text-xs font-normal tracking-wide">
                          {role}
                        </td>
                        <td className="w-fit text-nowrap px-4 py-2 text-xs font-normal tracking-wide">
                          {selectedUser && selectedUser === _id ? (
                            <span className="bg-gray-50 text-gray-700 px-2 py-1 flex items-center  gap-2 text-xs w-full">
                              Updating <Loader2 className="animate-spin" />
                            </span>
                          ) : (
                            <button
                              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                                type === "revoke"
                                  ? "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                  : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                              } disabled:bg-gray-100 disabled:text-gray-600`}
                              onClick={() =>
                                handleRoleChange.execute(
                                  _id,
                                  type === "revoke" ? "student" : "admin"
                                )
                              }
                              disabled={handleRoleChange.apiState.loading}
                            >
                              {type === "revoke" ? (
                                <ShieldX size={18} />
                              ) : (
                                <ShieldCheck size={18} />
                              )}
                              {type === "revoke"
                                ? "Revoke Admin"
                                : "Make Admin"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <div className="w-full flex justify-between mt-4">
        <div className="flex gap-4 justify-between">
          <button
            className="bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white px-2 py-1 disabled:bg-gray-500"
            disabled={
              paginationData.page === 1 ||
              fetchUsers.apiState.loading ||
              paginationData.totalPages == 0 ||
              handleRoleChange.apiState.loading
            }
            onClick={(e) =>
              setPaginationData((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            <ChevronLeft />
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white px-2 py-1 disabled:bg-gray-500"
            disabled={
              paginationData.page === paginationData.totalPages ||
              fetchUsers.apiState.loading ||
              paginationData.totalPages == 0 ||
              handleRoleChange.apiState.loading
            }
            onClick={(e) =>
              setPaginationData((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            <ChevronRight />
          </button>
        </div>
        <div className="flex gap-2 text-base items-center">
          <label htmlFor="limit" className="text-base font-normal">
            Show:
          </label>
          <select
            id="limit"
            name="limit"
            className="outline-none border border-indigo-500 rounded text-sm font-normal disabled:bg-gray-200 disabled:border-gray-700 disabled:cursor-not-allowed"
            value={paginationData.limit}
            disabled={
              fetchUsers.apiState.loading ||
              paginationData.totalPages == 0 ||
              handleRoleChange.apiState.loading
            }
            onChange={(e) =>
              setPaginationData((prev) => ({
                ...prev,
                limit: e.target.value,
                page: 1,
              }))
            }
          >
            {limitOptions.map((value) => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserTable;

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import Button from "@/components/Button";
import { useToast } from "@/components/toast/ToastProvider";
import useApiHandler from "@/hooks/useApiHandler";
import {
  addBulkCoAdmins,
  getUsersNotInSession,
} from "@/server-actions/sessionDetailsAction";

const AddCoAdminModal = ({
  isOpen,
  onClose,
  sessionId,
}) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const pageSize = 20;
  const { addToast } = useToast();

  const addCoAdminsHandler = useApiHandler(async () => {
    if (selectedUsers.length === 0) {
      addToast("error", "Please select at least one user");
      return;
    }
    const response = await addBulkCoAdmins(sessionId, selectedUsers);
    if (response.success) {
      addToast("success", "Co-admins added successfully");
      onClose();
      window.location.reload();
    } else {
      addToast("error", response.error || "Failed to add co-admins");
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getUsersNotInSession(
          sessionId,
          searchTerm,
          1,
          10
        );
        if (response.success) {
          setUsers(response.data.users);
          setTotalPages(response.data.pagination.totalPages);
          setHasNextPage(response.data.pagination.hasNextPage);
          setHasPrevPage(response.data.pagination.hasPrevPage);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
        fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Co-Administrators</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="font-medium mb-2">
            Selected Users ({selectedUsers.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((userId) => {
              const user = users.find((u) => u._id === userId);
              return user ? (
                <div
                  key={user._id}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() =>
                      setSelectedUsers((prev) =>
                        prev.filter((id) => id !== user._id)
                      )
                    }
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto border rounded-lg">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : users.length > 0 ? (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => {
                            setSelectedUsers((prev) =>
                              prev.includes(user._id)
                                ? prev.filter((id) => id !== user._id)
                                : [...prev, user._id]
                            );
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center pt-2 px-1 border-t bg-gray-50">
                <button
                  disabled={!hasPrevPage}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className={`px-4 py-2 text-sm font-medium ${
                    hasPrevPage
                      ? "text-indigo-600 hover:underline"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={!hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className={`px-4 py-2 text-sm font-medium ${
                    hasNextPage
                      ? "text-indigo-600 hover:underline"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "No users found" : "Start typing to search users"}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            onClick={onClose}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={addCoAdminsHandler.execute}
            loading={addCoAdminsHandler.apiState.loading}
          >
            Add Selected Users
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCoAdminModal;

import Button from "@/components/Button";
import { useToast } from "@/components/toast/ToastProvider";
import useApiHandler from "@/hooks/useApiHandler";
import { Trash, MoreHorizontal, MoreVertical } from "lucide-react"; // 'MoreHorizontal' for options button
import React, { useState } from "react";

const SessionCard = (props) => {
  const { name, description, threshold, status, createdAt, _id } = props;
  const creationDate = new Date(createdAt);
  const { addToast } = useToast();
  const [showOptions, setShowOptions] = useState(false); // Track options visibility

  // Format the creation date
  const formattedCreationDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(creationDate);

  // Delete session handler
  const handleDeleteSession = useApiHandler(async () => {
    try {
      const deleteResponse = await deleteSession(_id);
      if (!deleteResponse?.success) {
        throw new Error(deleteResponse?.message || "Some error occurred");
      }
      addToast("info", deleteResponse?.message || "Session deleted successfully.");
      onDelete(_id); // Callback to remove the session from the list
    } catch (error) {
      addToast("error", error?.message || "Some error occurred");
    }
  });

  return (
    <div className="bg-white text-black shadow-lg rounded-lg p-6 max-w-lg  my-4 border border-gray-200 relative">
      {/* Options button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => setShowOptions(!showOptions)}
      >
        <MoreVertical size={20} />
      </button>

      {/* Options dropdown */}
      {showOptions && (
        <div className="absolute top-8 right-2 bg-white shadow-lg rounded-md border border-gray-200 w-32 py-2">
          <button
            onClick={handleDeleteSession.execute}
            className="w-full text-left px-4 py-1 text-sm text-red-600 hover:bg-red-100 rounded-md"
          >
            <Trash size={16} /> Delete
          </button>
        </div>
      )}

      <h3 className="font-semibold text-xl mb-2 text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <p>Threshold: {threshold}%</p>
        <p>Status: <span className={`font-semibold ${status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{status}</span></p>
      </div>
      <p className="text-xs text-gray-500 mb-2">Created on: {formattedCreationDate}</p>
    </div>
  );
};

export default SessionCard;

"use client";
import React, { useState } from "react";
import {
  Trash,
  Edit2,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Activity,
} from "lucide-react";
import { useToast } from "@/components/toast/ToastProvider";
import useApiHandler from "@/hooks/useApiHandler";
import MoreOptionsButton from "@/components/MoreOptionsButton";
import { useSession } from "next-auth/react";
import Link from "next/link";

const SessionCard = ({
  name,
  description,
  threshold,
  status,
  createdAt,
  _id,
  creator,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const { data, status: authStatus } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToast } = useToast();
  const creationDate = new Date(createdAt);
  const isOwner = data?.user?.id === creator;

  const formattedCreationDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(creationDate);

  const handleDeleteSession = useApiHandler(async () => {
    try {
      const deleteResponse = await deleteSession(_id);
      if (!deleteResponse?.success) {
        throw new Error(deleteResponse?.message || "Some error occurred");
      }
      addToast(
        "info",
        deleteResponse?.message || "Session deleted successfully."
      );
      onDelete?.(_id);
    } catch (error) {
      addToast("error", error?.message || "Some error occurred");
    }
  });

  const moreOptions = [
    ...(isOwner && onUpdate
      ? [
          {
            label: "Edit Session",
            icon: <Edit2 size={16} />,
            onClick: () => onUpdate(_id),
          },
        ]
      : []),
    ...(isOwner && onDelete
      ? [
          {
            label: "Delete Session",
            icon: <Trash size={16} />,
            onClick: handleDeleteSession.execute,
            variant: "danger",
          },
        ]
      : []),
  ];

  return (
    <div
      className={`group bg-white transition-all duration-300 text-black rounded-xl border border-gray-200 shadow-sm hover:shadow-md relative overflow-hidden ${
        isExpanded ? "ring-2 ring-indigo-100" : "hover:bg-gray-50"
      }`}
    >
      {/* Status indicator strip */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${
          status === "active" ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 mr-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {name}
            </h3>
            <p
              className={`text-sm text-gray-600 ${
                isExpanded ? "" : "line-clamp-2"
              }`}
            >
              {description}
            </p>
          </div>

          <div className="flex items-start gap-2">
            {isOwner && moreOptions.length > 0 && (
              <MoreOptionsButton actions={moreOptions} disabled={!isOwner} />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <Target size={16} className="text-indigo-500" />
              <span className="text-gray-600">Acceptance Threshold:</span>
              <span className="font-medium text-gray-900">{threshold}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity
                size={16}
                className={
                  status === "active" ? "text-green-500" : "text-red-500"
                }
              />
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  status === "active"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {status}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between">
            <Link
              href={`/session/${_id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
            >
              <span>View</span>
              <ExternalLink size={14} className="ml-1" />
            </Link>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="space-y-4">
            <div className="flex gap-2 flex-col md:flex-row">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Session Details
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-600 flex items-center gap-2 flex-wrap ">
                    <span className="w-24">Session ID:</span>
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {_id}
                    </code>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Time Information
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-600">
                    <span className="block text-xs text-gray-500">Created</span>
                    {formattedCreationDate}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionCard;

"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Edit2, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/toast/ToastProvider";
import useApiHandler from "@/hooks/useApiHandler";
import { updateProjectStatus } from "@/server-actions/projectActions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import SimilarProjectsSection from "./SimilarProjectsSection";
import axios from "axios";
import Input from "@/components/Input";
import Slider from "@/components/Slider";
import LoadingFallback from "@/components/LoadingFallback";

const ProjectDetails = ({ project, userAccess }) => {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: null,
  });
  const [similarProjects, setSimilarProjects] = useState([]);
  const [maxSimilarity, setMaxSimilarity] = useState(0);
  const [similarityCount, setSimilarityCount] = useState(10);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  const handleStatusUpdate = useApiHandler(async (newStatus) => {
    try {
      const response = await updateProjectStatus(project._id, newStatus);
      if (response.success) {
        addToast("success", `Project ${newStatus} successfully`);
        window.location.reload();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      addToast("error", error.message || "Failed to update project status");
    }
  });

  const fetchSimilarProjects = async () => {
    setIsLoadingSimilar(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_SIMILARITY_API_ENDPOINT_BASE_URL;
      const response = await axios.get(
        `${apiUrl}/get_similar_projects/${project._id}/${similarityCount}`
      );
      setSimilarProjects(response.data);
      if (response.data.length > 0) {
        setMaxSimilarity(response.data[0].cosineSimilarity * 100);
      }
    } catch (error) {
      addToast("error", "Failed to fetch similar projects");
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchSimilarProjects();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [similarityCount, project._id]);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[project.status]
                  }`}
                >
                  {project.status}
                </span>
                {maxSimilarity > 0 && (
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      maxSimilarity <= 20
                        ? "bg-green-500 text-white"
                        : maxSimilarity <= 50
                        ? "bg-yellow-400 text-black"
                        : maxSimilarity <= 80
                        ? "bg-orange-500 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    <AlertTriangle size={16} />
                    Max Similarity: {maxSimilarity.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 self-end md:self-start">
              {userAccess.hasAdminAccess && project.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        action: "accepted",
                      })
                    }
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    disabled={handleStatusUpdate.apiState.loading}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        action: "rejected",
                      })
                    }
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    disabled={handleStatusUpdate.apiState.loading}
                  >
                    <XCircle size={20} />
                  </button>
                </>
              )}

              {userAccess.canEdit && (
                <Link
                  href={`/session/${project.sessionId}/project/upsert?projectId=${project._id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Edit2 size={20} />
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Abstract
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {project.abstract}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Creator Information
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span>{" "}
                    {project?.creator?.name || "Session Admin (Past Year)"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {project?.creator?.email || "Session Admin (Past Year)"}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Project Details
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(project.createdAt)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <Slider
            value={similarityCount}
            onChange={(e) => setSimilarityCount(e.target.value)}
            label={"Limit"}
            min={1}
            max={20}
          />
        </div>
        {isLoadingSimilar ? (
          <LoadingFallback />
        ) : (
          <SimilarProjectsSection
            projects={similarProjects}
            sessionId={project.sessionId}
          />
        )}
      </div>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, action: null })}
        onConfirm={() => {
          handleStatusUpdate.execute(confirmDialog.action);
          setConfirmDialog({ isOpen: false, action: null });
        }}
        title={`${
          confirmDialog.action === "accepted" ? "Accept" : "Reject"
        } Project`}
        message={`Are you sure you want to ${confirmDialog.action} this project? This action cannot be undone.`}
        type={confirmDialog.action === "accepted" ? "success" : "danger"}
      />
    </div>
  );
};

export default ProjectDetails;

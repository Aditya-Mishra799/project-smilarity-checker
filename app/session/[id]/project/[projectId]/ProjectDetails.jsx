'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Edit2, Eye, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/toast/ToastProvider';
import useApiHandler from '@/hooks/useApiHandler';
import { updateProjectStatus } from '@/server-actions/projectActions';

const ProjectDetails = ({ project, userAccess }) => {
  const { data: session } = useSession();
  const { addToast } = useToast();

  const handleStatusUpdate = useApiHandler(async (newStatus) => {
    try {
      const response = await updateProjectStatus(project._id, newStatus);
      if (response.success) {
        addToast('success', `Project ${newStatus} successfully`);
        window.location.reload();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to update project status');
    }
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {project.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>
            
            <div className="flex gap-2">
              {userAccess.hasAdminAccess && project.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate.execute('accepted')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    disabled={handleStatusUpdate.apiState.loading}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate.execute('rejected')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    disabled={handleStatusUpdate.apiState.loading}
                  >
                    <XCircle size={20} />
                  </button>
                </>
              )}
              
              {userAccess.canEdit && (
                <Link
                  href={`/session/${project.sessionId}/project?projectId=${project._id}`}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Creator Information
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span>{' '}
                    {project.creator.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{' '}
                    {project.creator.email}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Project Details
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <span className="font-medium">Created:</span>{' '}
                    {formatDate(project.createdAt)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Last Updated:</span>{' '}
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
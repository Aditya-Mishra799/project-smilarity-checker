import React from 'react';
import Link from 'next/link';

const SimilarProjectsSection = ({ projects, sessionId }) => {
  return (
    <div className="space-y-4 ">
      <h3 className="text-lg font-semibold text-gray-800">Similar Projects</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project._id}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Link
              href={`/session/${sessionId}/project/${project._id}`}
              className="block"
            >
              <h4 className="text-sm font-medium text-gray-900 mb-2 hover:text-indigo-600 text-wrap break-words md:text-base">
                {project.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2 md:text-sm">
                {project.abstract}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Similarity: {(project.cosineSimilarity * 100).toFixed(2)}%
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProjectsSection;
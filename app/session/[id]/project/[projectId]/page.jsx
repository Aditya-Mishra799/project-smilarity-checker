import React from 'react';
import ProjectDetails from './ProjectDetails';
import { getProjectDetails } from '@/server-actions/projectActions';
import { notFound } from 'next/navigation';

const ProjectPage = async ({ params }) => {
  const projectId = (await params).projectId;
  const response = await getProjectDetails(projectId)
  if (!response.success) {
    return notFound();
  }

  return <ProjectDetails {...response.data} />;
};

export default ProjectPage;
import AttachSessionDetails from "@/components/AttachSessionDetails";
import { getProjectDetails } from "@/server-actions/projectActions";
import { notFound } from "next/navigation";
import React from "react";
import CreateOrUpadateProject from "./CreateOrUpadateProject";

const page = async ({ params, searchParams }) => {
  const projectId = (await searchParams).projectId;
  const id = (await params).id;
  if(!id || id === ""){
    return notFound
  }
  let defaultValues = {};
  if (projectId && projectId != "") {
    const response = await getProjectDetails(projectId);
    if (!response.success) {
      return notFound();
    }
    defaultValues = {
      title: response.data.project.title,
      abstract: response.data.project.abstract,
    };
  }

  return (
    <div>
      <AttachSessionDetails
        id={id}
        projectId={projectId}
        Component={CreateOrUpadateProject}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default page;

"use client";
import React, { useState } from "react";
import Step from "@/components/form/Step";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastProvider";
import Button from "@/components/Button";
import { createSession, updateSession } from "@/server-actions/sessionAction";
import useApiHandler from "@/hooks/useApiHandler";
import SuccessMessage from "@/components/SuccessMessage";
import projectFormSchema from "@/FormValidationSchema/projectFormSchema";
import axios from "axios";

const inputForm = [
  {
    name: "title",
    label: "Project Title",
    type: "text",
    component: Input,
    fullWidth: true,
  },
  {
    name: "abstract",
    label: "Abstract",
    type: "text",
    component: TextArea,
    className: "max-w-[400px]",
    cols: 60,
    rows: 8,
    defaultValue: "",
    fullWidth: true,
  },
];

const CreateOrUpadateProject = ({
  id,
  projectId: initialProjectId,
  user,
  defaultValues,
}) => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitted, setSubmitted] = useState(false);
  const [projectId, setProjectId] = useState(initialProjectId);

  const methods = useForm({
    resolver: zodResolver(projectFormSchema),
    mode: "onBlur",
    defaultValues: defaultValues,
  });
  const createOrUpdateSession = useApiHandler(async (data) => {
    const apiUrl = process.env.NEXT_PUBLIC_SIMILARITY_API_ENDPOINT_BASE_URL;
    try {
      let response;
      if (projectId) {
        response = await updateSession(projectId, data);
      } else {
        const body = {
          ...data,
          session_id: id,
          creator_id: user.id,
        };
        response = await axios.post(`${apiUrl}/add_project`, body, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!projectId) {
          setProjectId(response.data.projectId);
        }
      }
      setSubmitted(true);
      addToast("info", response.message || "Form Submitted Successfully");
    } catch (error) {
      console.error(error);
      addToast(
        "error",
        error.message || "Some error occurred while processing the session."
      );
    }
  });
  const handleFormSubmit = async (data) => {
    await createOrUpdateSession.execute(data);
  };
  if (isSubmitted) {
    return (
      <SuccessMessage
        message={"Submitted form sucessfully."}
        link={`/session/${id}/project/${projectId}`}
        label={"Got to Project"}
      />
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleFormSubmit)}
          className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl"
        >
          <h1 className="text-2xl font-medium text-gray-800 mb-6 tracking-wide text-center">
            {projectId ? "Update" : "Create New"} Project
          </h1>
          <Step fields={inputForm} />
          <Button
            type="submit"
            className="w-full mt-6"
            loading={createOrUpdateSession.apiState.loading}
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateOrUpadateProject;

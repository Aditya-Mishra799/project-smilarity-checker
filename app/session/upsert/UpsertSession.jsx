"use client";
import React, { useEffect, useState } from "react";
import Step from "@/components/form/Step";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastProvider";
import Switch from "@/components/Switch";
import PercentageInput from "@/components/PercentageInput";
import Button from "@/components/Button";
import sessionFormSchema from "@/FormValidationSchema/sessionFormSchema";
import { createSession, updateSession } from "@/server-actions/sessionAction";
import useApiHandler from "@/hooks/useApiHandler";
import SuccessMessage from "@/components/SuccessMessage";
import SearchableSelect from "@/components/SearchableSelect";

const inputForm = [
  {
    name: "name",
    label: "Session Name",
    type: "text",
    component: Input,
    fullWidth: true,
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    component: TextArea,
    className: "max-w-[400px]",
    cols: 60,
    rows: 8,
    defaultValue: "",
    fullWidth: true,
  },
  {
    name: "autoReject",
    label: "Auto Reject",
    component: Switch,
    defaultValue: true,
  },
  {
    name: "status",
    label: "Status",
    component: SearchableSelect,
    options: ['active', 'inactive', 'closed'],
    defaultValue: "active",
  },
  {
    name: "threshold",
    label: "Acceptance Threshold",
    type: "number",
    component: PercentageInput,
    defaultValue: 60,
    fullWidth : true,
  },
];

const UpsertSession = ({ id, user, defaultValue }) => {
  const { addToast } = useToast();
  const [isSubmitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState(id);
  // console.log(defaultValue)
  const methods = useForm({
    resolver: zodResolver(sessionFormSchema),
    mode: "onBlur",
    defaultValues: defaultValue,
  });
  const createOrUpdateSession = useApiHandler(async (data) => {
    try {
      let response;
      if (id) {
        response = await updateSession(id, data);
      } else {
        response = await createSession( data );
      }
      if (response.success) {
        setSubmitted(true);
        if (!sessionId) {
          setSessionId(response.data.sessionId);
        }
        addToast("info", response.message || "Form Submitted Successfully");
        methods.reset();
      } else {
        addToast(
          "error",
          response.message || "An error occurred. Please try again."
        );
      }
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
        link={`/session/${sessionId}`}
        label={"Go to Session"}
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
            {id ? "Update" : "Create New"} Session
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

export default UpsertSession;

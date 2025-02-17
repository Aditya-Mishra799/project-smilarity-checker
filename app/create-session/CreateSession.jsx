"use client";
import React from "react";
import Step from "@/components/form/Step";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastProvider";

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
    name: "threshold",
    label: "Acceptance Threshold",
    type: "number",
    component: Input,
    defaultValue: "0",
  },
];

const CreateListingForm = ({ id, user }) => {
  const router = useRouter();
  const { addToast } = useToast();
  const methods = useForm({
    // resolver: zodResolver(stepsData[currentStep].schema),
    mode: "onBlur",
  });

  const handleSaveForm = async (currentPage, pageData, title) => {
    try {
      const res = await axios.post("/api/forms/save", {
        id: id,
        userId: user.id,
        currentPage: currentPage,
        pageData: pageData,
        title: title,
        type: "listing",
      });
      addToast("info", "Form saved successfully, you can submit within 2 days");
      if (res.data?.redirectUrl) {
        router.push(res.data?.redirectUrl);
      }
    } catch (error) {
      addToast("error", "Error while auto-saving form, try again!");
      console.error(error);
    }
  };
  const fetchCurrentPageData = async () => {
    try {
      if (id !== "new") {
        const res = await axios.get(`/api/forms/${id}`, {});
        addToast(
          "info",
          "Your data has been auto-saved. You can continue where you left off."
        );
        return {
          pageData: res.data.pageData,
          currentPage: res?.data.currentPage,
        };
      }
      return { pageData: {}, currentPage: -1 };
    } catch (error) {
      console.error(error);
      addToast("error", "Error while loading auto-saved form data");
      return { pageData: {}, currentPage: -1 }; // Consistent return structure
    }
  };
  const handleFormSubmit = async (data) => {
    try {
      console.log(data)
    } catch (error) {
      console.error(error)
    }
    finally{
      
    }
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleFormSubmit)}
          className="max-w-3xl mx-auto p-4  lg:p-8 bg-white shadow-lg  rounded-lg md:max-w-[500px] lg:max-w-[600px] pt-8"
        >
          <Step fields={inputForm} />
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateListingForm;

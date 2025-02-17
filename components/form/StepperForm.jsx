"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProgressBar from "./ProgressBar";
import Button from "../Button";

const StepperForm = ({
  stepsData = [],
  handleSaveForm,
  titleField,
  fetchCurrentPageData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm({
    resolver: zodResolver(stepsData[currentStep].schema),
    mode: "onBlur",
  });

  const isLastStep = currentStep === stepsData.length - 1;

  useEffect(() => {
    const fetchDefaultValues = async () => {
      const { pageData, currentPage } = await fetchCurrentPageData();
      methods.reset(pageData);
      setCurrentStep(Math.min(currentPage + 1, stepsData.length - 1) || 0);
    };
    fetchDefaultValues();
  }, []);

  useEffect(()=>{

  }, [])

  
  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const values = methods.getValues();
      const isValid = await methods.trigger();
      if (isValid) {
        await handleSaveForm(currentStep, values, values[titleField] || "");
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error)
    }
    finally{
      setIsLoading(false)
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0)); 
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true)
    try {
      const values = methods.getValues();
      await handleSaveForm(currentStep, values, values[titleField] || "");
      setCurrentStep(0);
    } catch (error) {
      console.error(error)
    }
    finally{
      setIsLoading(false)
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleFormSubmit)}
        className="max-w-3xl mx-auto p-4  lg:p-8 bg-white shadow-lg  rounded-lg md:max-w-[500px] lg:max-w-[600px] pt-8"
      >
        {/* Progress Bar */}
        <ProgressBar
          steps={stepsData}
          currentStep={currentStep}
          completedSteps={[...Array(currentStep).keys()]}
        />

        {/* Step Title */}
        <h2 className="text-xl font-base text-gray-800 text-center mt-8">
          {stepsData[currentStep].title}
        </h2>

        {/* Step Content */}
        <div className="my-8 flex flex-wrap gap-2 justify-stretch  items-center w-fit mx-auto h-full">
          {stepsData[currentStep].page}
        </div>

        {/* Notes */}
        <p className="text-sm text-gray-500">{stepsData[currentStep].note}</p>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          {/* Back Button */}
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            type="button"
            className="bg-gray-300 hover:bg-gray-400"
          >
            Back
          </Button>

          {/* Next or Submit Button */}
          {isLastStep ? (
            <Button type="submit">Submit</Button>
          ) : (
            <Button onClick={handleNext} type="button" loading = {isLoading}>
              Next
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default StepperForm;

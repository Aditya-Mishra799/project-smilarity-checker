"use client";
import Button from "@/components/Button";
import Step from "@/components/form/Step";
import { RegisterFormValidationSchema } from "@/FormValidationSchema/RegisterUser";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { RegisterFormInputs } from "../formInput";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import EmailSent from "@/public/mail-sent.svg";
import { useToast } from "@/components/toast/ToastProvider";
import useApiHandler from "@/hooks/useApiHandler";

const RegisterForm = () => {
  const methods = useForm({
    mode: "onBlur",
    resolver: zodResolver(RegisterFormValidationSchema),
  });
  const { addToast } = useToast();
  const [submmitted, setSubmitted] = useState(false);
  const signUpUser = useApiHandler(async (data) => {
    try {
      const response = await axios.post("/api/auth/signup", data);
      setSubmitted(true);
      addToast("info", "Email verifiction link has been sent.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        addToast(
          "error",
          "Some error occurred while registering please try again."
        );
      } else
        addToast(
          "error",
          error.message ||
            "Some error occurred while registering please try again."
        );
    }
  });
  const handleFormSubmit = async (data) => {
    await signUpUser.execute(data);
  };
  const submitSuccessMessage = (
    <div className="flex flex-col gap-6 justify-center items-center text-center p-2">
      <Image src={EmailSent} alt="Email Sent" width={150} />
      <div className="gap-2">
        <h3 className="font-base tracking-wide text-gray-700 text-sm">
          Email verification Link Sent successfully
        </h3>
        <p className="text-sm text-gray-500">Please verify your email</p>
      </div>
      <Link
        href={"/auth/signin"}
        className="bg-slate-800 px-4 py-1 rounded text-white hover:bg-gray-900"
      >
        Login
      </Link>
    </div>
  );
  return (
    <div className="bg-white px-6 py-8 rounded-md shadow-lg  max-w-[350px] md:max-w-[400px] lg:max-w-[420px] lg:px-12 lg:py-12">
      {submmitted ? (
        submitSuccessMessage
      ) : (
        <>
          <h1 className="text-center font-base text-2xl tracking-wider mb-2">
            Sign Up
          </h1>
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-4"
              onSubmit={methods.handleSubmit(handleFormSubmit)}
            >
              <Step fields={RegisterFormInputs} />
              <Button
                type="submit"
                className="mt-4 mx-2"
                loading={signUpUser.apiState.loading}
              >
                Submit
              </Button>
              <p className="text-sm text-slate-600 text-center ">
                Already an user?{" "}
                <Link
                  href={"/auth/signin"}
                  className="underline font-base tracking-wide hover:text-slate-700"
                >
                  <strong>Login</strong>
                </Link>{" "}
                here
              </p>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
};

export default RegisterForm;

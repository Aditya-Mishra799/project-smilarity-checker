"use client";
import Button from "@/components/Button";
import Step from "@/components/form/Step";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { LoginFormInputs, RegisterFormInputs } from "../formInput";
import { LoginFormValidationSchema } from "@/FormValidationSchema/LoginUser";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/toast/ToastProvider";


const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const {addToast} = useToast()
  const error = searchParams.get("error");
  const errorMessages = {
    CredentialsSignin: "Invalid email or password, make sure your email is verified",
    AccessDenied: "Access denied. Please check your credentials and make sure your email is verified",
    Configuration: "There was a configuration error. Please try again later.",
    default: "An unknown error occurred. Please try again.",
  };
  useEffect(()=> {
    if(error){
      addToast("error", errorMessages[error])
    }
  }, [])
 
  const methods = useForm({
    mode: "onBlur",
    resolver: zodResolver(LoginFormValidationSchema),
  });

  const handleFormSubmit = async (data) => {
    try {
      const resp = await signIn("credentials", { ...data, callbackUrl });
      methods.reset();
    } catch (error) {
      console.log("Error during login:", error);
    }
  };
  return (
    <div className="bg-white px-6 py-8 rounded-md shadow-lg  max-w-[350px] md:max-w-[400px] lg:max-w-[420px] lg:px-12 lg:py-12">
      <h1 className="text-center font-base text-2xl tracking-wider mb-2">
        Log In
      </h1>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4"
          onSubmit={methods.handleSubmit(handleFormSubmit)}
        >
          <Step fields={LoginFormInputs} />
          <Button type="submit" className="mt-4 mx-2">
            Submit
          </Button>
          <p className="text-sm text-slate-600 text-center ">
            New user?{" "}
            <Link
              href={"/auth/signup"}
              className="underline font-base tracking-wide hover:text-slate-700"
            >
              <strong>Register</strong>
            </Link>{" "}
            here
          </p>
        </form>
      </FormProvider>
    </div>
  );
};

export default LoginForm;

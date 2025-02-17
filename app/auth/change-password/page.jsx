"use client";
import Button from "@/components/Button";
import ErrorLabel from "@/components/form/ErrorLabel";
import Input from "@/components/Input";
import { changePassword } from "@/server-actions/changePasswordActions";
import { useActionState } from "react";

const page = () => {
  const [state, formAction, isPending] = useActionState(changePassword, {
    password: "",
    confirmPassword: "",
    token : "token12344",
  });
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="bg-white rounded-md px-8 py-6 shadow-md w-96 lg:min-w-sm">
        <h1 className="text-lg tracking-wide mb-4 text-center text-gray-600">
          Reset your password
        </h1>
        <form
          action={formAction}
          className="space-y-4 flex flex-col items-center"
        >
          <div className="w-full">
            <Input label={"Password"} name="password" type="password"/>
            <ErrorLabel
              message={state?.error ? state?.error["password"] : ""}
            />
          </div>
          <div className="w-full">
            <Input label={"Confirm Password"} name="confirmPassword" type="password" />
            <ErrorLabel
              message={state?.error ? state?.error["confirmPassword"] : ""}
            />
          </div>
          <Button
            formAction={formAction}
            type="submit"
            loading={isPending}
            className="w-full mt-4"
          >
            {" "}
            Submit{" "}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default page;

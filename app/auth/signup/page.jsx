import LoadingFallback from "@/components/LoadingFallback";
import { Suspense } from "react";
import SecureFromServer from "../SecureFromServer";
import RegisterForm from "./RegisterForm";

const SignUpPage = () => {
  return (
    <SecureFromServer>
    <div className="w-full h-full grid place-items-center pt-4">
      <Suspense fallback={<LoadingFallback fullPage/>}>
        <RegisterForm />
      </Suspense>
    </div>
    </SecureFromServer>
  );
};

export default SignUpPage;

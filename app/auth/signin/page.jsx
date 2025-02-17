import LoadingFallback from "@/components/LoadingFallback";
import { Suspense } from "react";
import SecureFromServer from "../SecureFromServer";
import LoginForm from "./LoginForm";

const SignInPage = async () => {
  return (
    <SecureFromServer>
    <div className="w-full h-full grid place-items-center pt-4">
      <Suspense fallback={<LoadingFallback fullPage />}>
        <LoginForm />
      </Suspense>
    </div>
    </SecureFromServer>
  );
};

export default SignInPage;

import Link from "next/link";
import Button from "./Button";

const SuccessMessage = ({ message, link, label }) => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl text-center">
          <h1 className="text-2xl font-medium text-green-600 mb-6">Success!</h1>
          <p className="text-gray-800 mb-6">{message}</p>
          <Link
            href = {link}
            className="w-full mt-6 bg-slate-800 rounded-md px-4 py-2 text-white"
          >
            {label}
          </Link>
        </div>
      </div>
    );
  };
export default SuccessMessage
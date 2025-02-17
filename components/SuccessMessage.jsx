import Button from "./Button";

const SuccessMessage = ({ message }) => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl text-center">
          <h1 className="text-2xl font-medium text-green-600 mb-6">Success!</h1>
          <p className="text-gray-800 mb-6">{message}</p>
          <Button
            onClick={() => window.location.reload()} // Or redirect to another page
            className="w-full mt-6"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  };
export default SuccessMessage
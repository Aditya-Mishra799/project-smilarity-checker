import React, { useEffect, useRef, useState } from "react";

const ProgressBar = ({ steps, currentStep, completedSteps }) => {
  const pointsRef = useRef([]);
  const [progressBarLen, setProgressBarLen] = useState(0);
  const [progressFillLen, setProgressFillLen] = useState(0);
  const setPointsRef = (point) => {
    if (point && !pointsRef.current.includes(point)) {
      pointsRef.current.push(point);
    }
  };

  useEffect(() => {
    const resizeProgressBar = () => {
      if (pointsRef.current.length > 1) {
        const start = pointsRef.current[0];
        const end = pointsRef.current.at(-1);

        const rect1 = start.getBoundingClientRect();
        const rect2 = end.getBoundingClientRect();
        const progressBarLength = rect2.left - rect1.left;
        setProgressBarLen(progressBarLength);

        // If the current step is greater than 0 and less than total steps, calculate progress fill length
        if (currentStep > 0 && currentStep < steps.length) {
          const currentPoint = pointsRef.current[currentStep];
          const rect3 = currentPoint.getBoundingClientRect();
          const fillingLength = rect3.left - rect1.left + rect3.width / 2;
          setProgressFillLen(fillingLength);
        }
        else if(currentStep === 0){
          setProgressFillLen(0)
        }
      }
    };
    resizeProgressBar(); 

    window.addEventListener("resize", resizeProgressBar);
    return () => window.removeEventListener("resize", resizeProgressBar); // Cleanup on unmount
  }, [currentStep, steps.length, completedSteps]); 
  return (
    <div className="relative w-full mt-4">
      {/* Progress bar */}
      <div
        className="relative h-1 bg-gray-300"
        style={{ width: `${progressBarLen}px` }} // Dynamically set progress bar width
      >
        {/* Progress fill */}
        <div
          className="absolute h-1 bg-slate-600"
          style={{ width: `${progressFillLen}px` }} // Dynamically set progress fill width
        />
      </div>

      {/* Step circles */}
      <div className="absolute flex justify-between items-center w-full top-1/2 transform -translate-y-1/2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center justify-center relative"
            ref={setPointsRef} // Set the ref for each step
          >
            {/* Step Circle */}
           
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full  text-xs 
                ${completedSteps.includes(index) ? "bg-slate-600" : "bg-gray-300"} 
                ${index === currentStep ? "border-2 border-gray-500" : ""} ${completedSteps.includes(index) ? "text-white" : "text-black"}`}
            >
                {step.icon}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;

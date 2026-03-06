import React from "react";

const LoginSignupProgress = ({ currentStep }) => {
  // Define total steps (0 -> 1 -> 2 = 3 stages but 2 "steps" for UI)
  const totalSteps = 2;

  // Map current step to percentage
  const getProgress = () => {
    if (currentStep === 0) return 0; // Before selecting any option
    if (currentStep === 1) return 50; // After selecting student/teacher/panel
    if (currentStep === 2) return 100; // On main signup form
    return 0;
  };

  const progress = getProgress();

  return (
    <div className="space-y-4 mb-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoginSignupProgress;

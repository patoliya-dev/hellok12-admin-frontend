import React from "react";
import Icon from "../../../../components/AppIcon";

const Stepper = ({ steps, currentStep, onStepClick }) => {
  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="flex items-center justify-between w-[500px]">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            onClick={() => onStepClick(step.id)}
            className={`flex items-center space-x-2 cursor-pointer transition-smooth ${
              getStepStatus(step.id) === "completed"
                ? "text-success"
                : getStepStatus(step.id) === "current"
                  ? "text-primary"
                  : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-smooth ${
                getStepStatus(step.id) === "completed"
                  ? "bg-success text-white"
                  : getStepStatus(step.id) === "current"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {getStepStatus(step.id) === "completed" ? (
                <Icon name="Check" size={16} />
              ) : (
                step.id
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{step.title}</p>
            </div>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 transition-smooth ${
                getStepStatus(step.id) === "completed"
                  ? "bg-success"
                  : "bg-border"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;

import React, { useState } from "react";
import AccountInfoStep from "./components/AccountInfoStep";
import OTPVerificationStep from "./components/OTPVerificationStep";
import NewPasswordStep from "./components/NewPasswordStep";
import SuccessStep from "./components/SuccessStep";
import TrustSignals from "../login/components/TrustSignals";
import logo from "../../../assets/logo.svg";

const PasswordReset = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resetData, setResetData] = useState({});

  const totalSteps = 3;

  const handleStepNext = (stepData) => {
    setResetData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps + 1));
  };

  const handleStepBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountInfoStep onNext={handleStepNext} />;
      case 2:
        return (
          <OTPVerificationStep
            verificationInfo={resetData}
            onNext={handleStepNext}
            onBack={handleStepBack}
          />
        );
      case 3:
        return (
          <NewPasswordStep
            verificationInfo={resetData}
            onNext={handleStepNext}
            onBack={handleStepBack}
          />
        );
      case 4:
        return <SuccessStep resetInfo={resetData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-auth-bg bg-cover bg-center">
      <main className="pt-16">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center">
              <img src={logo} alt="Company Logo" className="mx-auto" />
            </div>

            {/* Step Content */}
            <div className="bg-surface rounded-2xl shadow-elevated border border-border p-6 md:p-8">
              {renderCurrentStep()}
            </div>

            {/* Trust Indicators */}
            <TrustSignals />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PasswordReset;

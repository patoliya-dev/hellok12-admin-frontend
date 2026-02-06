import React, { useState, useEffect } from "react";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/AppIcon";

const VerificationStep = ({ formData }) => {
  const [emailTimer, setEmailTimer] = useState(0);
  const [smsTimer, setSmsTimer] = useState(0);

  useEffect(() => {
    let emailInterval;
    let smsInterval;

    if (emailTimer > 0) {
      emailInterval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    }

    if (smsTimer > 0) {
      smsInterval = setInterval(() => {
        setSmsTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(emailInterval);
      clearInterval(smsInterval);
    };
  }, [emailTimer, smsTimer]);

  // const handleInputChange = (field) => (e) => {
  //   const value = e.target.value.replace(/\D/g, '').slice(0, 6);
  //   onChange(field, value);
  // };

  // const handleResendEmail = () => {
  //   onResendOTP('email');
  //   setEmailTimer(60);
  // };

  // const handleResendSMS = () => {
  //   onResendOTP('sms');
  //   setSmsTimer(60);
  // };

  // const formatTime = (seconds) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs.toString().padStart(2, '0')}`;
  // };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Verify Your Account
        </h1>
        <p className="text-muted-foreground">
          We've sent verification link to secure your account
        </p>
      </div>

      {/* Email Verification */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <div className="flex text-center items-center space-x-3">
          <p className="text-sm text-muted-foreground">
            Please verify your email address by clicking the link send to{" "}
            {formData.email}
          </p>
        </div>
        <Button type="submit" variant="default" fullWidth className="h-12">
          Resend Verification Email
        </Button>
      </div>
    </div>
  );
};

export default VerificationStep;

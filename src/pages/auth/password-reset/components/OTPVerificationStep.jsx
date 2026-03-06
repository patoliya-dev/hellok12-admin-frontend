import React, { useState, useEffect, useRef } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  verifyResetCode,
} from "../../../../reducers/auth/authThunks";
import {
  selectForgotPasswordStatus,
  selectVerifyResetCodeError,
  selectVerifyResetCodeStatus,
} from "../../../../reducers/auth/authSelectors";

const OTPVerificationStep = ({ verificationInfo, onNext, onBack }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // selectors
  const forgotPasswordStatus = useSelector(selectForgotPasswordStatus); // 'idle' | 'loading' | 'succeeded' | 'failed'
  const verifyResetCodeError = useSelector(selectVerifyResetCodeError);
  const verifyResetCodeStatus = useSelector(selectVerifyResetCodeStatus);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus on the next empty field or last field
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    const resultAction = await dispatch(
      verifyResetCode({
        email: verificationInfo.contact,
        code: otpString,
      }),
    );

    if (verifyResetCode.fulfilled.match(resultAction)) {
      onNext({ ...verificationInfo, otp: otpString });
    } else {
      // Clear OTP on failure
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    await dispatch(forgotPassword({ email: verificationInfo.contact }));
    setTimeLeft(180);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setCanResend(false);
  };

  const getContactDisplay = () => {
    const contact = verificationInfo.contact;
    if (
      verificationInfo.verificationMethod === "email" ||
      verificationInfo.verificationMethod === "backup_email"
    ) {
      return contact.replace(/(.{2})(.*)(@.*)/, "$1***$3");
    } else {
      return contact.replace(/(\+?\d{2})(\d*)(\d{4})/, "$1***$3");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-left mb-8">
        <Button
          variant="default"
          onClick={onBack}
          iconName="ChevronLeft"
          iconPosition="left"
          className="p-0 bg-transparent text-foreground hover:bg-muted/80"
        >
          Back
        </Button>
        {/* <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="MessageSquare" size={24} color="var(--color-warning)" />
        </div> */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Enter Verification Code
        </h1>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">
            {getContactDisplay()}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Verification Code
          </label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 transition-smooth
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  ${
                    verifyResetCodeError
                      ? "border-error bg-error/5 text-error"
                      : "border-border bg-input text-foreground hover:border-primary/50"
                  }
                `}
                autoComplete="one-time-code"
              />
            ))}
          </div>
          {verifyResetCodeError && (
            <div className="flex items-center space-x-2 text-sm text-error">
              <Icon name="AlertCircle" size={14} />
              <span>{verifyResetCodeError}</span>
            </div>
          )}
        </div>

        {/* Timer and Resend */}
        <div className="text-center space-y-3">
          {timeLeft > 0 ? (
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>Code expires in {formatTime(timeLeft)}</span>
            </div>
          ) : (
            <div className="text-sm text-error">
              Verification code has expired
            </div>
          )}

          <div>
            {canResend || timeLeft === 0 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                loading={forgotPasswordStatus === "loading"}
                iconName="RefreshCw"
                iconPosition="left"
              >
                {forgotPasswordStatus === "loading"
                  ? "Sending..."
                  : "Resend Code"}
              </Button>
            ) : (
              <span className="text-sm text-muted-foreground">
                Resend available in {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            loading={verifyResetCodeStatus === "loading"}
            disabled={
              otp.join("").length !== 6 || verifyResetCodeStatus === "loading"
            }
            fullWidth
            iconName="Check"
            iconPosition="right"
          >
            {verifyResetCodeStatus === "loading" ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerificationStep;

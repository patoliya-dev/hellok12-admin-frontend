import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../../../reducers/auth/authThunks";
import Icon from "../../../../components/AppIcon";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

const NewPasswordStep = ({ verificationInfo, onNext, onBack }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { id: "length", text: "At least 8 characters", regex: /.{8,}/ },
    { id: "uppercase", text: "One uppercase letter", regex: /[A-Z]/ },
    { id: "lowercase", text: "One lowercase letter", regex: /[a-z]/ },
    { id: "number", text: "One number", regex: /\d/ },
    {
      id: "special",
      text: "One special character",
      regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
  ];

  const getPasswordStrength = () => {
    const metRequirements = passwordRequirements.filter((req) =>
      req.regex.test(password),
    );
    const strength = metRequirements.length;

    if (strength < 2)
      return { level: "weak", color: "text-error", bg: "bg-error" };
    if (strength < 4)
      return { level: "medium", color: "text-warning", bg: "bg-warning" };
    return { level: "strong", color: "text-success", bg: "bg-success" };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const unmetRequirements = passwordRequirements.filter(
        (req) => !req.regex.test(password),
      );
      if (unmetRequirements.length > 0) {
        newErrors.password = "Password does not meet all requirements";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const resultAction = await dispatch(
        resetPassword({
          email: verificationInfo.contact,
          code: verificationInfo.otp,
          newPassword: password,
        }),
      );

      if (resetPassword.fulfilled.match(resultAction)) {
        // Success → move to next step or show success message
        onNext({ ...verificationInfo, newPassword: password });
      } else {
        const errorMessage =
          resultAction.payload?.error ||
          resultAction.error?.message ||
          "Password reset failed";
        setErrors({ general: errorMessage });
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const strengthInfo = getPasswordStrength();

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
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Set a Password
        </h1>
        <p className="text-muted-foreground">
          Your previous password has been reset. Please set a new password for
          your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="New Password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthInfo.bg}`}
                    style={{
                      width: `${(passwordRequirements.filter((req) => req.regex.test(password)).length / passwordRequirements.length) * 100}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium capitalize ${strengthInfo.color}`}
                >
                  {strengthInfo.level}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="flex items-center space-x-2">
            <Icon
              name={password === confirmPassword ? "CheckCircle" : "XCircle"}
              size={14}
              color={
                password === confirmPassword
                  ? "var(--color-success)"
                  : "var(--color-error)"
              }
            />
            <span
              className={`text-xs ${password === confirmPassword ? "text-success" : "text-error"}`}
            >
              {password === confirmPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            loading={loading}
            fullWidth
            iconName="Check"
            iconPosition="right"
          >
            {loading ? "Updating Password..." : "Set Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewPasswordStep;

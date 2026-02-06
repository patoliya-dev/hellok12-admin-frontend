import React, { useState } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../../../reducers/auth/authThunks";
import {
  selectForgotPasswordError,
  selectForgotPasswordStatus,
} from "../../../../reducers/auth/authSelectors";

const AccountInfoStep = ({ onNext }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  // selectors
  const forgotPasswordError = useSelector(selectForgotPasswordError);
  const forgotPasswordStatus = useSelector(selectForgotPasswordStatus);

  const backToLogin = () => {
    navigate("/login"); // Redirect to /login
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const resultAction = await dispatch(forgotPassword({ email }));

    if (forgotPassword.fulfilled.match(resultAction)) {
      // Success → move to next step
      onNext({
        contactMethod: "email",
        contact: email,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-left mb-8">
        <Button
          variant="default"
          onClick={backToLogin}
          iconName="ChevronLeft"
          iconPosition="left"
          className="p-0 bg-transparent text-foreground hover:bg-muted/80"
        >
          Back to Login
        </Button>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground">
          Don’t worry, happens to all of us. Enter your email below to recover
          your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Input */}
        <Input
          type="email"
          label="Email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
          className="w-full"
        />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            loading={forgotPasswordStatus === "loading"}
            fullWidth
          >
            {forgotPasswordStatus === "loading" ? "Verifying..." : "Submit"}
          </Button>
        </div>
      </form>
      {forgotPasswordError && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm text-error">{forgotPasswordError}</p>
        </div>
      )}
    </div>
  );
};

export default AccountInfoStep;

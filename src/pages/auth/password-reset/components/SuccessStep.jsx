import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";

const SuccessStep = () => {
  const navigator = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect to login
          navigator("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect]);

  const handleManualRedirect = () => {
    navigator("/login");
  };

  const handleStayOnPage = () => {
    setAutoRedirect(false);
    setCountdown(0);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Password Reset Successful!
        </h1>
        <p className="text-muted-foreground">
          Your password has been successfully updated. You can now sign in with
          your new password.
        </p>
      </div>

      {/* Auto Redirect Notice */}
      {autoRedirect && countdown > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="Info" size={16} color="var(--color-primary)" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">
                Auto Redirect
              </div>
              <div className="text-sm text-muted-foreground">
                Redirecting to login page in {countdown} seconds...
              </div>
            </div>
            <button
              onClick={handleStayOnPage}
              className="text-xs text-primary hover:text-primary/80 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 mb-8">
        <Button
          variant="default"
          onClick={handleManualRedirect}
          fullWidth
          iconName="LogIn"
          iconPosition="right"
        >
          Continue to Login
        </Button>
      </div>
    </div>
  );
};

export default SuccessStep;

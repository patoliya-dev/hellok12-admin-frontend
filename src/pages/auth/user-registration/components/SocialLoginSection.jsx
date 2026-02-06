import React from "react";
import Button from "../../../components/ui/Button";

const SocialLoginSection = ({ onSocialLogin }) => {
  const handleGoogleLogin = () => {
    onSocialLogin("google");
  };

  const handleFacebookLogin = () => {
    onSocialLogin("facebook");
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Quick Registration
        </h3>
        <p className="text-sm text-muted-foreground">
          Sign up with your social account
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          fullWidth
          iconName="Chrome"
          iconPosition="left"
          onClick={handleGoogleLogin}
          className="h-12"
        >
          Continue with Google
        </Button>

        <Button
          variant="outline"
          fullWidth
          iconName="Facebook"
          iconPosition="left"
          onClick={handleFacebookLogin}
          className="h-12"
        >
          Continue with Facebook
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-surface text-muted-foreground">
            Or register with email
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginSection;

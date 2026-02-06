import React from "react";
import Button from "../../../../components/ui/Button";

const SocialLoginSection = ({ onGoogleLogin, onFacebookLogin, isLoading }) => {
  return (
    <div className="mt-6 space-y-3 mb-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-surface text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onGoogleLogin}
          disabled={isLoading}
          className="w-full"
          iconName="Chrome"
          iconPosition="left"
          iconSize={18}
        >
          Google
        </Button>

        <Button
          variant="outline"
          onClick={onFacebookLogin}
          disabled={isLoading}
          className="w-full"
          iconName="Facebook"
          iconPosition="left"
          iconSize={18}
        >
          Facebook
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginSection;

import React from "react";
import Icon from "../../../../components/AppIcon";

const TrustSignals = () => {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <span>Privacy Policy</span>
        </div>

        <Icon name="Dot" size={20} />

        <div className="flex items-center space-x-1">
          <span>Terms of Service</span>
        </div>

        <Icon name="Dot" size={20} />

        <div className="flex items-center space-x-1">
          <span>Support</span>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} />
          <span>Secure Access</span>
        </div>

        <Icon name="Dot" size={20} />

        <div className="flex items-center space-x-1">
          <span>© 2025 HelloK12</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;

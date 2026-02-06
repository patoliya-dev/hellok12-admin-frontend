import React from "react";
import Icon from "../../../components/AppIcon";

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: "Shield",
      title: "Secure & Encrypted",
      description: "Your data is protected with bank-level security",
    },
    {
      icon: "Lock",
      title: "Privacy Protected",
      description: "We never share your personal information",
    },
    {
      icon: "Award",
      title: "Trusted by Schools",
      description: "Used by over 1,000+ educational institutions",
    },
  ];

  return (
    <div className="hidden lg:block">
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Why Choose EduPortal?
        </h3>

        <div className="space-y-4">
          {trustFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon
                  name={feature.icon}
                  size={16}
                  color="var(--color-primary)"
                />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={16} color="var(--color-success)" />
              <span className="text-sm font-medium text-foreground">50K+</span>
              <span className="text-xs text-muted-foreground">
                Active Users
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={16} color="var(--color-warning)" />
              <span className="text-sm font-medium text-foreground">4.9</span>
              <span className="text-xs text-muted-foreground">Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;

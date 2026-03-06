// PageHeader.jsx
import React from "react";
import Button from "./Button";

const PageHeader = ({
  title,
  description,
  isButton = false,
  buttonTitle,
  onButtonClick,
  studentCount,
  ...props
}) => {
  return (
    <section className="my-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            {description && (
              <p className="text-brand-gray-500">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          {studentCount !== undefined && (
            <div className="px-6 py-4 min-w-[120px]">
              <div className="text-4xl font-bold text-foreground mb-1">
                {studentCount}
              </div>
              <div className="text-sm text-brand-gray-500">Total Students</div>
            </div>
          )}
          {isButton && (
            <Button {...props} onClick={onButtonClick}>
              {buttonTitle}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;

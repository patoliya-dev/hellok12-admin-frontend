import React from "react";
import RoleSelectionCard from "./RoleSelectionCard";

const BasicInfoStep = ({ formData, errors, onRoleSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-[10px]">
        {["student/parent", "teacher", "school"].map((role) => (
          <RoleSelectionCard
            key={role}
            role={role}
            isSelected={formData.role === role}
            onSelect={onRoleSelect}
          />
        ))}
      </div>
      {errors.role && <p className="text-sm text-error mt-2">{errors.role}</p>}
    </div>
  );
};

export default BasicInfoStep;

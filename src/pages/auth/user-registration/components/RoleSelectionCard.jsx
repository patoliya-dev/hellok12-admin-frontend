import React from "react";
import {
  TeacherIcon,
  SchoolIcon,
  StudentParentIcon,
} from "../../../../components/icons";

const RoleSelectionCard = ({ role, isSelected, onSelect }) => {
  const roleConfig = {
    "student/parent": {
      icon: StudentParentIcon,
      title: "Student/Parent",
      description: "Join classes, track progress, and learn with games",
    },
    teacher: {
      icon: TeacherIcon,
      title: "Teacher",
      description: "Teach students, manage schedule, and earn income",
    },
    school: {
      icon: SchoolIcon,
      title: "School",
      description: "Manage school operations, teachers, and students",
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;
  return (
    <div
      onClick={() => onSelect(role)}
      className={`
        w-[127px] relative p-[15px] rounded-[5px] border-2 cursor-pointer transition-smooth hover:shadow-elevated
        ${
          isSelected
            ? "border-primary bg-primary/5 shadow-subtle"
            : "border-border bg-surface hover:border-primary/50"
        }
      `}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {Icon && <Icon selected={isSelected} />}
        <div>
          <h3
            className={`text-xs font-semibold ${
              isSelected ? "text-primary" : "text-foreground"
            }`}
          >
            {config.title}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionCard;

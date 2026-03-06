import React from "react";
import Icon from "../../../../components/AppIcon";

const LessonStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: "bg-warning/10 text-warning border-warning/20",
          icon: "Clock",
          label: "Pending",
        };
      case "confirmed":
        return {
          color: "bg-success/10 text-success border-success/20",
          icon: "CheckCircle",
          label: "Confirmed",
        };
      case "completed":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: "Check",
          label: "Completed",
        };
      case "group":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: "Users",
          label: "Group",
        };
      case "1-on-1":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: "User",
          label: "1-on-1",
        };
      case "cancelled":
        return {
          color: "bg-error/10 text-error border-error/20",
          icon: "XCircle",
          label: "Cancelled",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          icon: "Circle",
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config?.color}`}
    >
      <Icon name={config?.icon} size={12} />
      {config?.label}
    </span>
  );
};

export default LessonStatusBadge;

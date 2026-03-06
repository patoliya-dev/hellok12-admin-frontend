import Button from "components/ui/Button";
import React from "react";

const ActionMenu = ({
  className = "",
  data,
  setOpenMenuId,
  onEdit,
  // onDuplicate,
  // onDelete,
  // onActive,
}) => {
  const actions = [
    {
      label: "View",
      icon: "Eye",
      color: "",
      onClick: onEdit,
    },
    // {
    //   label: "Duplicate",
    //   icon: "Copy",
    //   color: "",
    //   onClick: (data) => onDuplicate(data),
    // },
    // {
    //   label: "Remove",
    //   icon: "Trash",
    //   color: "text-error",
    //   onClick: onDelete,
    // },
    // {
    //   label: "Active",
    //   icon: "CircleCheckBig",
    //   color: "text-green-600",
    //   onClick: onActive,
    // },
  ];

  return (
    <div className={`w-36 ${className}`}>
      {actions.map((action, index) => {
        const disabled = action.label === "Active" && data.status === "active";
        return (
          <div key={index} className="flex items-center">
            <Button
              variant="ghost"
              iconName={action.icon}
              className={`!justify-start w-full ${action.color} ${disabled ? "disabled:cursor-not-allowed opacity-50" : ""}`}
              onClick={() => {
                action.onClick(data);
                setOpenMenuId(null); // optional: close menu after action
              }}
              disabled={disabled}
            >
              {action.label}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ActionMenu;

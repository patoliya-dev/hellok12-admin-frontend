import React from "react";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import { capitalize } from "../../../../utils/utils";

const StudentCard = ({
  student,
  onSelect,
  isSelected,
  onStatusChange,
  // eslint-disable-next-line no-unused-vars
  onProfileRequest,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-500";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-500";
      case "inactive":
        return "bg-red-100 text-red-600 border-red-500";
      default:
        return "bg-gray-100 text-gray-600 border-gray-500";
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleQuickAction = (action, e) => {
    e?.stopPropagation();
    onStatusChange(student?.id, action);
  };

  return (
    <div
      className={`p-4 bg-card border border-border rounded-lg cursor-pointer transition-smooth hover:shadow-soft ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(student)}
    >
      <div className="flex items-start justify-between">
        {/* Left Section - Profile & Info */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <Image
              src={student?.avatar}
              alt={student?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          {/* Student Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-brand-gray-800 truncate">
              {student?.name}
            </h3>
            <p className="text-sm text-brand-gray-500 truncate">
              {student?.email}
            </p>
            {student?.location && (
              <div className="flex items-center space-x-1 text-sm text-brand-gray-500 mt-2">
                <Icon name="MapPin" size={14} />
                <span className="truncate">{student?.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Status & Rating */}
        <div className="flex flex-col gap-5 space-y-2 ml-4 flex-shrink-0">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              student?.status,
            )}`}
          >
            {capitalize(student?.status)}
          </span>
          {student?.age && (
            <div className="flex items-center space-x-1">
              Age: {student?.age || 0}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;

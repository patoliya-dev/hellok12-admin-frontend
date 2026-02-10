import React from "react";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";
import { capitalize, getLanguageName } from "../../../../utils/utils";

const TeacherCard = ({
  teacher,
  onSelect,
  isSelected,
  onStatusChange,
  onProfileRequest,
  getFullLocationName,
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

  const handleQuickAction = (action, e) => {
    e?.stopPropagation();
    onStatusChange(teacher?._id, action);
  };

  const profileInComplete =
    !teacher?.teacherProfile ||
    !teacher?.teacherProfile?.teachingLanguages?.length ||
    !teacher?.teacherProfile?.location?.country ||
    !teacher?.teacherProfile?.yearsOfExperience;

  if (profileInComplete) {
    return (
      <div
        className={`p-4 bg-card border border-border rounded-lg cursor-pointer transition-smooth hover:shadow-soft ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => onSelect(teacher)}
      >
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
            <div className="relative">
              <Image
                src={teacher?.avatar}
                alt={teacher?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
                  teacher?.availabilityStatus === "online"
                    ? "bg-success"
                    : "bg-muted"
                }`}
              ></div>
            </div>

            <div className="flex-1 min-w-0 mt-2 sm:mt-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-brand-gray-800 truncate">
                    {teacher?.name}
                  </h3>
                  <p className="text-sm text-brand-gray-500">
                    {teacher?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <span
            className={`hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
              teacher?.status,
            )}`}
          >
            {capitalize(teacher?.status)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mt-8">
          <Button
            size="sm"
            iconName="Send"
            iconPosition="right"
            iconSize="15"
            onClick={onProfileRequest}
          >
            Request Teacher To Update Profile
          </Button>
          {teacher?.status === "pending" && (
            <div className="flex space-x-2 mt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => handleQuickAction("reject", e)}
                iconName="X"
                iconPosition="left"
              >
                Reject
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={(e) => handleQuickAction("approve", e)}
                iconName="Check"
                iconPosition="left"
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-card border border-border rounded-lg cursor-pointer transition-smooth hover:shadow-soft ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(teacher)}
    >
      <div className="flex flex-col sm:flex-row items-start sm:space-x-4">
        <div className="relative">
          <Image
            src={teacher?.avatar}
            alt={teacher?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
              teacher?.availabilityStatus === "online"
                ? "bg-success"
                : "bg-muted"
            }`}
          ></div>
        </div>

        <div className="flex-1 min-w-0 mt-2 sm:mt-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-brand-gray-800 truncate">
                {teacher?.name}
              </h3>
              <p className="text-sm text-brand-gray-500">{teacher?.email}</p>
            </div>
            <span
              className={`hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                teacher?.status,
              )}`}
            >
              {capitalize(teacher?.status)}
            </span>
          </div>

          <span
            className={`my-2 inline-flex sm:hidden items-center px-3.5 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
              teacher?.status,
            )}`}
          >
            {capitalize(teacher?.status)}
          </span>

          <div className="mt-2">
            {teacher?.teacherProfile?.teachingLanguages?.length && (
              <div className="flex items-center space-x-2 text-sm text-brand-gray-500">
                <Icon name="Languages" size={14} />
                <span>
                  {teacher.teacherProfile.teachingLanguages
                    .map((language) => getLanguageName(language))
                    .join(", ")}
                </span>
              </div>
            )}
            {teacher?.teacherProfile?.location && (
              <div className="flex items-center space-x-2 text-sm text-brand-gray-500 mt-1">
                <Icon name="MapPin" size={14} />
                <span className="text-brand-gray-500">
                  {getFullLocationName(teacher.teacherProfile.location)}
                </span>
              </div>
            )}
            {(teacher?.teacherProfile?.yearsOfExperience ||
              teacher?.teacherProfile?.yearsOfExperience === 0) && (
              <div className="flex items-center space-x-2 text-sm text-brand-gray-500 mt-1">
                <Icon name="Clock" size={14} />
                <span>
                  {teacher.teacherProfile.yearsOfExperience} years experience
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center space-x-2 mt-3">
              {teacher?.teacherProfile?.teachingMode === "IN_PERSON" && (
                <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                  Onsite
                </span>
              )}
              {teacher?.teacherProfile?.teachingMode === "ONLINE" && (
                <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                  Online
                </span>
              )}
              {/* {teacher?.teacherProfile?.onsite && (
                <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                  {teacher?.travelDistance}km radius
                </span>
              )} */}
            </div>
            {teacher?.status === "pending" && (
              <div className="flex space-x-2 mt-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => handleQuickAction("reject", e)}
                  iconName="X"
                  iconPosition="left"
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={(e) => handleQuickAction("approve", e)}
                  iconName="Check"
                  iconPosition="left"
                >
                  Approve
                </Button>
              </div>
            )}
            {teacher?.status !== "pending" && (
              <div className="flex items-center space-x-2">
                <Image src="/assets/images/yellow_star.svg" alt="Star" />
                <span className="ml-1 text-sm text-brand-gray-800">
                  {teacher?.stats?.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;

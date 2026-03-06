import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";
import { capitalize, getLanguageName } from "../../../../utils/utils";

const TeacherProfile = ({ teacher, onClose, getFullLocationName }) => {
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

  const contactInfo = [
    { label: "Full Name", value: teacher?.name },
    { label: "Email", value: teacher?.email },
    { label: "Phone", value: teacher?.phone },
    {
      label: "Address",
      value: getFullLocationName(teacher?.teacherProfile?.location),
    },
  ];

  const statistics = [
    {
      label: "Total Lessons",
      value: teacher?.stats?.totalLessons,
      color: "text-primary",
    },
    {
      label: "Students Taught",
      value: teacher?.stats?.totalStudents,
      color: "text-secondary",
    },
    {
      label: "Average Rating",
      value: teacher?.stats?.rating,
      color: "text-warning",
    },
  ];

  if (!teacher) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div>
          <Icon
            name="Users"
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h3 className="text-lg font-medium text-card-foreground mb-2">
            Select a Teacher
          </h3>
          <p className="text-muted-foreground">
            Choose a teacher from the list to view their profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-card-foreground">
          Teacher Profile
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:space-x-6">
            <div className="relative">
              <Image
                src={teacher?.avatar}
                alt={teacher?.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card ${
                  teacher?.availabilityStatus === "online"
                    ? "bg-success"
                    : "bg-muted"
                }`}
              ></div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-2xl font-semibold text-brand-gray-800">
                    {teacher?.name}
                  </h3>
                  <p className="text-[16px] text-brand-gray-500">
                    {teacher?.email}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                    teacher?.status,
                  )}`}
                >
                  {capitalize(teacher?.status)}
                </span>
              </div>

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
                {/* {teacher?.availability?.onsite && (
                  <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                    {teacher?.travelDistance}km radius
                  </span>
                )} */}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-brand-gray-800 mb-4">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo?.map((info, index) => (
                <div key={index}>
                  <h5 className="text-sm font-medium text-brand-gray-500">
                    {info.label}
                  </h5>
                  <p className="text-brand-gray-800 text-[16px]">
                    {info.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Languages & Specialization */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-card-foreground mb-4">
              Languages & Specialization
            </h4>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mt-2">
                {teacher?.teacherProfile?.teachingLanguages?.map(
                  (language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full"
                    >
                      {getLanguageName(language)}
                    </span>
                  ),
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Bio
                </label>
                <p className="text-card-foreground mt-2">
                  {teacher?.teacherProfile?.aboutYou}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Experience
                </label>
                <p className="text-card-foreground mt-2">
                  {teacher?.teacherProfile?.yearsOfExperience ?? "—"} years
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-card-foreground mb-4">
              Teaching Statistics
            </h4>
            <div className="flex flex-wrap justify-around items-center gap-2">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <h6 className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </h6>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

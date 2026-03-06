import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";
import { capitalize, getLanguageName } from "../../../../utils/utils";

const StudentProfile = ({ student, onClose }) => {
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
    { label: "Full Name", value: student?.name },
    { label: "Email", value: student?.email },
    { label: "Phone", value: student?.phone },
    { label: "Address", value: student?.address },
  ];

  // eslint-disable-next-line no-unused-vars
  const statistics = [
    {
      label: "Total Lessons",
      value: student?.stats?.totalLessons,
      color: "text-primary",
    },
    {
      label: "Students Taught",
      value: student?.stats?.totalStudents,
      color: "text-secondary",
    },
    {
      label: "Average Rating",
      value: student?.stats?.rating,
      color: "text-warning",
    },
  ];

  if (!student) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div>
          <Icon
            name="Users"
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h3 className="text-lg font-medium text-card-foreground mb-2">
            Select a student
          </h3>
          <p className="text-muted-foreground">
            Choose a student from the list to view their profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-card-foreground">
          Student Profile
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:space-x-6">
            <div className="relative">
              <Image
                src={student?.avatar}
                alt={student?.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-2xl font-semibold text-brand-gray-800">
                    {student?.name}
                  </h3>
                  <p className="text-[16px] text-brand-gray-500">
                    {student?.email}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                    student?.status,
                  )}`}
                >
                  {capitalize(student?.status)}
                </span>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                {student?.availability?.onsite && (
                  <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                    Onsite
                  </span>
                )}
                {student?.availability?.online && (
                  <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                    Online
                  </span>
                )}
                {student?.availability?.onsite && (
                  <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                    {student?.travelDistance}km radius
                  </span>
                )}
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

          {/* Student Details */}
          <div className="bg-muted rounded-lg p-4">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Age
                </label>
                <p className="text-card-foreground mt-2 text-base">
                  {student?.age || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Gender
                </label>
                <p className="text-card-foreground mt-2 text-base">
                  {capitalize(student?.gender) || "Male"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Languages
              </label>
              <p className="text-card-foreground mt-2 text-base">
                {student?.languages?.map(getLanguageName)?.join(", ") ||
                  "English"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

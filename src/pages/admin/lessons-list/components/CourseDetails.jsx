import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";
import { capitalize } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { formatDateForDateInput } from "../../../../utils/formatters";
import { MapPin } from "lucide-react";

const CourseDetails = ({ course, lessonCount, role }) => {
  const navigate = useNavigate();
  const getCourseModeBadge = (mode) => {
    const isInPerson = mode === "in-person";
    const isOnline = mode === "online";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          isInPerson
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {isOnline ? (
          <Image
            src={"/assets/images/video-camera.svg"}
            className="mr-1 w-4 h-4"
          />
        ) : (
          <MapPin size={12} className="mr-1" />
        )}
        {isInPerson ? "In-Person" : "Online Course"}
      </span>
    );
  };

  const getTrailBadge = () => (
    <span className="inline-flex items-center text-xs font-medium text-success">
      <Icon name={"Play"} size={12} className="mr-1" />
      Trial Available
    </span>
  );

  const handleEditCourse = () => {
    navigate(
      `/${role === "super_admin" ? "admin" : role}/view-course/${course?._id}`,
    );
  };

  return (
    <section className="my-8 bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-start md:justify-between mb-4 gap-4 md:gap-0">
        <div>
          <h2 className="text-h3 font-bold text-brand-gray-800 mb-2">
            {course?.title}
          </h2>
          <p className="text-sm lg:text-[16px] text-brand-gray-500 md:max-w-md lg:max-w-xl xl:max-w-4xl line-clamp-3">
            {course?.description}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="Eye"
          onClick={handleEditCourse}
        >
          View Course
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-6 mb-6">
        {getCourseModeBadge(course?.mode)}
        <span className="text-[12px] text-[#7C3AED] font-medium">
          {capitalize(course?.languageCode)}
        </span>

        {course?.isTrialAvailable && getTrailBadge()}
      </div>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
        <div className="flex items-center gap-14">
          {["Lessons", "Price"].map((item, index) => (
            <div key={index}>
              <h4 className="text-h4 font-bold text-brand-gray-800">
                {index === 0 ? lessonCount : "$" + course?.price}
              </h4>
              <p className="text-xs text-brand-gray-500">
                {index === 1 ? "Course " + item : item}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 md:gap-10">
          {["Max Capacity", "Start Date", "End Date"].map((item, index) => (
            <div
              key={index}
              className={`${
                index === 0 ? "pr-6 xl:pr-10 border-r border-[#CECECE]" : ""
              }`}
            >
              <h4 className="text-sm font-medium text-brand-gray-800">
                {item}
              </h4>
              <p className="text-[16px] text-brand-gray-500">
                {index === 0
                  ? course?.studentCapacity + " students"
                  : index === 1
                    ? formatDateForDateInput(course?.startDate)
                    : formatDateForDateInput(course?.endDate)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;

import TeacherCard from "./TeacherCard";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Pagination from "components/ui/Pagination";

const TeacherSection = ({
  teacherData,
  selectedTeacher,
  onSelect,
  onStatusChange,
  onInviteTeacher,
  onProfileRequest,
  getFullLocationName,
  ...props
}) => {
  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Teacher Cards */}
      <div className="p-4">
        {teacherData?.length > 0 ? (
          <div className="space-y-4">
            {teacherData?.map((teacher) => (
              <TeacherCard
                key={teacher?._id}
                teacher={teacher}
                getFullLocationName={getFullLocationName}
                onSelect={onSelect}
                isSelected={selectedTeacher?._id === teacher?._id}
                onStatusChange={onStatusChange}
                onProfileRequest={onProfileRequest}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon
              name="Users"
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              No teachers found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or invite new teachers
            </p>
            <Button
              variant="default"
              onClick={onInviteTeacher}
              iconName="UserPlus"
              iconPosition="left"
            >
              Invite Teacher
            </Button>
          </div>
        )}
      </div>
      <Pagination {...props} />
    </div>
  );
};

export default TeacherSection;

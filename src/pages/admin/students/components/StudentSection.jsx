import StudentCard from "./StudentCard";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Pagination from "components/ui/Pagination";

const StudentSection = ({
  studentData,
  selectedStudent,
  onSelect,
  onStatusChange,
  onInviteStudent,
  onProfileRequest,
  ...props
}) => {
  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Student Cards */}
      <div className="p-4">
        {studentData?.length > 0 ? (
          <div className="space-y-4">
            {studentData?.map((student) => (
              <StudentCard
                key={student?.id}
                student={student}
                onSelect={onSelect}
                isSelected={selectedStudent?.id === student?.id}
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
              No students found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or invite new students
            </p>
            <Button
              variant="default"
              onClick={onInviteStudent}
              iconName="UserPlus"
              iconPosition="left"
            >
              Invite Student
            </Button>
          </div>
        )}
      </div>
      <Pagination {...props} />
    </div>
  );
};

export default StudentSection;

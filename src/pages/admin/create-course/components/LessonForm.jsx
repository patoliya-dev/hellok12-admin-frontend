import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import Input from "components/ui/Input";
import DeleteModal from "components/ui/DeleteModal";
import { errorToast, successToast } from "../../../../utils/utils";
import WeeklySchedule from "../../../../components/ui/WeeklySchedule";
import DurationRange from "components/ui/DurationRange";
import { schoolService } from "../../../../services/school/school.service";
import Select from "components/ui/Select";

const LessonFormInstance = ({
  index,
  formData,
  // handleInputChange,
  errors,
  showAddButton,
  onAddLesson,
  onDeleteLesson,
  mode,
  teachers,
  disabled = false,
}) => {
  const { user } = useSelector((s) => s.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex justify-between">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-white">
          {index}
        </div>
        {index !== 1 && !disabled && (
          <Icon
            name="Trash2"
            size={24}
            className="text-error cursor-pointer"
            onClick={() => {
              const hasContent =
                formData?.title?.trim() && formData?.description?.trim();

              if (mode === "edit" && hasContent) {
                // setShowDeleteModal(true);
              } else {
                onDeleteLesson();
              }
            }}
          />
        )}
      </div>
      <div className="px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Lesson Title"
            type="text"
            placeholder="Enter lesson title"
            value={formData?.title}
            required
            error={errors?.title}
            // onChange={(e) => handleInputChange("title", e?.target?.value)}
            disabled={disabled}
          />
          {user.role === "super_admin" && (
            <Select
              label="Assign Teacher"
              placeholder="Select a teacher"
              options={teachers}
              value={formData?.assignedTeacher || ""}
              // onChange={(value) => handleInputChange("assignedTeacher", value)}
              error={errors?.assignedTeacher}
              disabled={disabled}
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Description <span className="text-error">*</span>
          </label>
          <textarea
            className={`w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-50 ${
              errors?.description &&
              "border-destructive focus-visible:ring-destructive"
            }`}
            placeholder="Describe what students will learn in this lesson"
            value={formData?.description || ""}
            required
            // onChange={(e) => handleInputChange("description", e.target.value)}
            disabled={disabled}
          />

          {errors?.description && (
            <p className="text-sm text-destructive">{errors?.description}</p>
          )}
        </div>

        <WeeklySchedule
          formData={formData}
          // handleInputChange={(field, value) => handleInputChange(field, value)}
          errors={errors?.schedule || {}}
          teacherId={formData?.assignedTeacher}
          onTeacherRequired={() => errorToast("Please select a teacher first")}
          disabled={disabled}
        />

        <DurationRange
          formData={formData}
          // handleInputChange={(field, value) => handleInputChange(field, value)}
          error={errors?.schedule?.duration}
          disabled={disabled}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <Checkbox
            label="Trial Available"
            description="Allow students to book trial lessons for this lesson"
            checked={!!formData.isTrialAvailable}
            // onChange={(e) =>
            //   handleInputChange("isTrialAvailable", e.target.checked)
            // }
            disabled={disabled}
          />

          {formData?.isTrialAvailable && (
            <Input
              label="Trial Capacity"
              placeholder="Enter number of trial lesson spots"
              type="number"
              min="1"
              value={formData?.trialCapacity}
              // onChange={(e) =>
              //   handleInputChange("trialCapacity", e?.target?.value)
              // }
              required={formData?.isTrialAvailable}
              error={errors?.trialCapacity}
              disabled={disabled}
            />
          )}
        </div>

        {/* <Checkbox
          label="Curriculum-Aligned Games"
          description="Allow curriculum-aligned games for this lesson"
          checked={!!formData.isCurriculumGames}
          onChange={(e) =>
            handleInputChange("isCurriculumGames", e.target.checked)
          }
        /> */}
      </div>

      {showAddButton && !disabled && (
        <div className="flex justify-center mt-4">
          <Button
            size="lg"
            iconName="Plus"
            onClick={onAddLesson}
            disabled={disabled}
          >
            Add More Lesson
          </Button>
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          type="lesson"
          onConfirm={() => {
            onDeleteLesson();
            setShowDeleteModal(false);
            successToast("Lesson removed successfully!");
          }}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default function LessonForm({
  formData,
  errors,
  addLesson,
  removeLesson,
  mode,
}) {
  const [teachers, setTeachers] = useState([]);

  // Fetch teachers from API on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await schoolService.getTeachers();
        // Map API response to { value, label } format for Select component
        const teacherOptions = (response.teachers || []).map((teacher) => ({
          value: teacher._id || teacher.id,
          label:
            teacher.name ||
            `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim(),
        }));
        setTeachers(teacherOptions);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
        setTeachers([]);
      }
    };

    fetchTeachers();
  }, []);

  return formData?.lessons.map((lesson, index) => (
    <div key={index}>
      <LessonFormInstance
        index={index + 1}
        formData={lesson}
        errors={errors.lessons?.[index] || {}}
        // handleInputChange={(field, value) =>
        //   handleInputChange(field, value, index)
        // }
        onAddLesson={() => addLesson(index)}
        onDeleteLesson={() => removeLesson(index)}
        showAddButton={index === formData.lessons.length - 1}
        teachers={teachers}
        mode={mode}
        disabled={true}
      />
      {index !== formData?.lessons.length - 1 && <hr className="!my-8" />}
    </div>
  ));
}

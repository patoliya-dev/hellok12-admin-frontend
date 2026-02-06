import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Standard for unique IDs
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select";
import Icon from "../../../../components/AppIcon";
import { Checkbox } from "../../../../components/ui/Checkbox";
import Button from "../../../../components/ui/Button";
import {
  validatePhone,
  validatePassword,
  validateEmail,
  validateName,
} from "../../../../utils/validation";

const RoleSpecificStep = ({ formData, errors, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [realTimeErrors, setRealTimeErrors] = useState({});

  // Ensure at least one child exists for parent
  useEffect(() => {
    if (
      formData.userType === "parent" &&
      (!formData.children || formData.children.length === 0)
    ) {
      onChange("children", [{ id: uuidv4(), name: "", age: "", gender: "" }]);
    }
  }, [formData.userType, formData.children, onChange]);

  const handleInputChange = (field, value, childId = null) => {
    if (field === "children" && childId) {
      const updatedChildren = (formData.children || []).map((child) =>
        child.id === childId ? { ...child, ...value } : child,
      );
      onChange("children", updatedChildren);

      // Clear child errors dynamically
      Object.keys(value).forEach((key) => {
        const errorKey = `${key}_${childId}`;
        if (errors[errorKey]) {
          // Use a callback to clear specific child error
          onChange("clearError", errorKey);
        }
      });
    } else {
      onChange(field, value);

      // Real-time validation
      let error = "";
      switch (field) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "phone":
          error = validatePhone(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        case "confirmPassword":
          if (value !== formData.password) {
            error = "Passwords do not match";
          }
          break;
        default:
          break;
      }

      // Update real-time errors
      setRealTimeErrors((prev) => ({
        ...prev,
        [field]: error,
      }));

      // Clear server errors when user starts typing
      if (errors[field]) {
        onChange("clearError", field);
      }
    }
  };

  const addChild = () => {
    const updatedChildren = [
      ...(formData.children || []),
      { id: uuidv4(), name: "", age: "", gender: "" },
    ];
    onChange("children", updatedChildren);
  };

  const deleteChild = (childId) => {
    if ((formData.children || []).length <= 1) return;
    const updatedChildren = formData.children.filter(
      (child) => child.id !== childId,
    );
    onChange("children", updatedChildren);
  };

  const userTypeOptions = [
    { value: "student", label: "Student" },
    { value: "parent", label: "Parent" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const renderPasswordField = (
    label,
    value,
    show,
    setShow,
    onChangeHandler,
    error,
  ) => (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        label={label}
        placeholder={label}
        value={value || ""}
        onChange={onChangeHandler}
        error={error}
        required
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition"
      >
        <Icon name={show ? "EyeOff" : "Eye"} size={16} />
      </button>
    </div>
  );

  const renderCommonFields = () => (
    <div className="space-y-4">
      {/* Student/Parent Selection */}
      {formData.role === "student/parent" && (
        <Select
          options={userTypeOptions}
          value={formData.userType || "student"}
          onChange={(value) => handleInputChange("userType", value)}
          error={errors.userType}
          required
        />
      )}

      <div className="text-left">
        <h5 className="text-sm font-bold text-foreground">
          {formData.role === "student/parent" && formData.userType === "parent"
            ? "Parent / Guardian Information"
            : formData.role === "teacher"
              ? "Teacher Information"
              : formData.role === "school"
                ? "School Information"
                : "Student Information"}
        </h5>
      </div>

      {/* Basic Inputs */}
      {formData.role === "school" && (
        <Input
          label="School Name"
          type="text"
          placeholder="Enter a school name"
          value={formData.schoolName || ""}
          onChange={(e) => handleInputChange("schoolName", e.target.value)}
          error={errors.name || realTimeErrors.schoolName}
          required
        />
      )}
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your name"
        value={formData.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        error={errors.name || realTimeErrors.name}
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone || ""}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        error={errors.phone || realTimeErrors.phone}
        required
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={errors.email || realTimeErrors.email}
        required
      />

      {/* Password Fields */}
      {renderPasswordField(
        "Password",
        formData.password,
        showPassword,
        setShowPassword,
        (e) => handleInputChange("password", e.target.value),
        errors.password || realTimeErrors.password,
      )}
      {renderPasswordField(
        "Confirm Password",
        formData.confirmPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        (e) => handleInputChange("confirmPassword", e.target.value),
        errors.confirmPassword || realTimeErrors.confirmPassword,
      )}

      {/* Children for Parent */}
      {formData.userType === "parent" && formData.role === "student/parent" && (
        <div>
          {formData.children?.map((child, i) => (
            <div
              key={child.id}
              className="space-y-2 mt-2 pt-5 border-t border-gray-200"
            >
              <div
                className={`grid ${i === 0 ? "grid-cols-2" : "grid-cols-1"} gap-4`}
              >
                {i === 0 && (
                  <div className="text-left">
                    <h5 className="text-sm font-bold text-foreground">
                      Student Information
                    </h5>
                  </div>
                )}
                {formData.children.length > 1 && (
                  <div className="flex items-center justify-end gap-2">
                    <Icon
                      name="GraduationCap"
                      size={20}
                      className="text-primary"
                    />
                    <span className="text-sm text-primary">Child {i + 1}</span>
                    <span className="border-r border-black/13 h-5 mx-2"></span>
                    <button
                      type="button"
                      onClick={() => deleteChild(child.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Icon name="Trash2" size={20} />
                    </button>
                  </div>
                )}
              </div>

              <Input
                label="Name"
                placeholder="Enter student name"
                value={child.name || ""}
                required
                error={errors[`name_${child.id}`]}
                onChange={(e) =>
                  handleInputChange(
                    "children",
                    { name: e.target.value },
                    child.id,
                  )
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  placeholder="Enter student age"
                  value={child.age || ""}
                  required
                  error={errors[`age_${child.id}`]}
                  onChange={(e) =>
                    handleInputChange(
                      "children",
                      { age: e.target.value },
                      child.id,
                    )
                  }
                />
                <Select
                  label="Gender"
                  options={genderOptions}
                  value={child.gender || ""}
                  required
                  error={errors[`gender_${child.id}`]}
                  onChange={(value) =>
                    handleInputChange("children", { gender: value }, child.id)
                  }
                />
              </div>
            </div>
          ))}

          <div className="text-center">
            <Button
              variant="default"
              onClick={addChild}
              iconName="Plus"
              iconPosition="left"
              className="w-auto mt-6 mr-2 bg-card text-primary hover:bg-card/80 border border-primary"
            >
              Add Student
            </Button>
          </div>
        </div>
      )}

      {/* Checkboxes */}
      <div className="flex flex-col gap-2 mt-4">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={!!formData.termsAccepted}
          required
          error={errors.termsAccepted}
          onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
        />
        <Checkbox
          label="I would like to receive marketing communications"
          checked={!!formData.marketingConsent}
          onChange={(e) =>
            handleInputChange("marketingConsent", e.target.checked)
          }
        />
      </div>
    </div>
  );

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "student/parent":
      case "teacher":
      case "school":
        return renderCommonFields();
      default:
        return null;
    }
  };

  return <div className="space-y-6 mb-6">{renderRoleSpecificFields()}</div>;
};

export default RoleSpecificStep;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import { successToast, errorToast } from "../../../../utils/utils";
import {
  fetchTeachers,
  inviteSchoolTeacher,
} from "../../../../reducers/superAdmin/superAdminThunks";

const InviteTeacherModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "Test Test",
    message: `Welcome to SchoolHub! We'd love to have you join our teaching team.\n\nYou'll be able to:\n• Create and manage your teaching profile\n• Set your availability and rates\n• Connect with students in your area\n• Track your earnings and lessons\n\nClick the link below to get started!`,
    languages: ["en", "es"],
    sendWelcomeEmail: true,
    setAsActive: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await dispatch(
        inviteSchoolTeacher({
          email: formData.email,
          message: formData.message,
          role: "teacher",
        }),
      ).unwrap();
      dispatch(fetchTeachers());

      // Reset form
      setFormData({
        email: "",
        name: "Test Test",
        message: `Welcome to SchoolHub! We'd love to have you join our teaching team.\n\nYou'll be able to:\n• Create and manage your teaching profile\n• Set your availability and rates\n• Connect with students in your area\n• Track your earnings and lessons\n\nClick the link below to get started!`,
        languages: ["en", "es"],
        sendWelcomeEmail: true,
        setAsActive: false,
      });
      setErrors({});
      onClose();
      successToast("Invitation sent successfully!");
      onSuccess && onSuccess();
    } catch (error) {
      errorToast(error?.message || error?.error || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Invite New Teacher
              </h2>
              <p className="text-sm text-muted-foreground">
                Send an invitation to join your school
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col max-h-[calc(90vh-80px)]"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg text-brand-gray-800 font-semibold">
                Basic Information
              </h3>

              <Input
                label="Teacher Email"
                type="email"
                placeholder="Enter teacher email id"
                value={formData?.email}
                onChange={(e) => handleInputChange("email", e?.target?.value)}
                error={errors?.email}
                required
              />
            </div>

            {/* Invitation Message */}
            <div className="space-y-4">
              <h3 className="text-lg text-brand-gray-800 font-semibold">
                Invitation Message
              </h3>

              <div>
                <label className="text-sm font-medium text-brand-gray-800 mb-2 block">
                  Custom Message
                </label>
                <textarea
                  className="w-full p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-brand-gray-800"
                  rows={6}
                  value={formData?.message}
                  onChange={(e) =>
                    handleInputChange("message", e?.target?.value)
                  }
                  placeholder="Write a personalized invitation message..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Send"
              iconPosition="left"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteTeacherModal;

// src/pages/school/manage-students/components/InviteStudentModal.jsx
import React, { useCallback, useMemo, useState } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { successToast, errorToast } from "../../../../utils/utils";
import { inviteStudent } from "reducers/superAdmin/superAdminThunks";
import { selectReq } from "reducers/superAdmin/superAdminSlice";

const DEFAULT_MESSAGE = `Welcome to HelloK12! We'd love to have you join our platform.

You'll be able to:
• Access your lessons and schedule
• Message your teachers
• Track your learning progress

Click the link below to get started!`;

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(String(email || "").trim());

const InviteStudentModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const req = useSelector(selectReq("inviteStudent"));

  const [formData, setFormData] = useState({
    email: "",
    message: DEFAULT_MESSAGE,
  });
  const [errors, setErrors] = useState({});

  const loading = req.status === "loading";

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev?.[field] ? { ...prev, [field]: "" } : prev));
  }, []);

  const validateForm = useCallback(() => {
    const next = {};
    const email = String(formData?.email || "").trim();

    if (!email) next.email = "Email is required";
    else if (!isValidEmail(email))
      next.email = "Please enter a valid email address";

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData?.email]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!validateForm()) return;

      try {
        await dispatch(
          inviteStudent({
            email: String(formData.email).trim(),
            message: formData.message,
          }),
        ).unwrap();

        setFormData({ email: "", message: DEFAULT_MESSAGE });
        setErrors({});
        onClose?.();
        successToast("Invitation sent successfully!");
        onSuccess?.();
      } catch (err) {
        errorToast(err?.message || err?.error || "Failed to send invitation");
      }
    },
    [dispatch, formData, onClose, onSuccess, validateForm],
  );

  // Optional: surface server error near submit
  const submitError = useMemo(
    () => (req.status === "failed" ? req.error : null),
    [req],
  );

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
                Invite New Student
              </h2>
              <p className="text-sm text-muted-foreground">
                Send an invitation to join your school
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={loading}
          >
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
                label="Student Email"
                type="email"
                placeholder="Enter student email id"
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

            {submitError ? (
              <p className="text-sm text-destructive">{submitError}</p>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
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

export default InviteStudentModal;

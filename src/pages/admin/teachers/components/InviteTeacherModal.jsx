import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import { successToast, errorToast } from "../../../../utils/utils";

import { inviteTeacher } from "reducers/superAdmin/superAdminThunks";
import { selectReq } from "reducers/superAdmin/superAdminSlice";

const DEFAULT_MESSAGE = `Welcome to HelloK12! We'd love to have you join our teaching community.

You'll be able to:
• Create and manage your teaching profile
• Set your availability and rates
• Connect with students
• Track your earnings and lessons

Click the link below to get started!`;

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(String(email || "").trim());

const InviteTeacherModal = ({
  isOpen,
  onClose,
  onSuccess,
  teacherType = "school", // school | independent
  schoolOptions = [{ value: "all", label: "Select school" }],
}) => {
  const dispatch = useDispatch();

  const req = useSelector(selectReq("inviteTeacher"));
  const loading = req?.status === "loading";

  const [formData, setFormData] = useState({
    email: "",
    message: DEFAULT_MESSAGE,
    school: "all",
  });
  const [errors, setErrors] = useState({});

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

    if (teacherType === "school") {
      if (!formData.school || formData.school === "all") {
        next.school = "School is required";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData, teacherType]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!validateForm()) return;

      try {
        const payload = {
          email: String(formData.email).trim(),
          message: formData.message,
          teacherType,
          schoolId: teacherType === "school" ? formData.school : undefined,
        };

        await dispatch(inviteTeacher(payload)).unwrap();

        setFormData({ email: "", message: DEFAULT_MESSAGE, school: "all" });
        setErrors({});
        onClose?.();
        successToast("Invitation sent successfully!");
        onSuccess?.();
      } catch (err) {
        errorToast(err?.message || err?.error || "Failed to send invitation");
      }
    },
    [dispatch, formData, validateForm, teacherType, onClose, onSuccess],
  );

  const submitError = useMemo(
    () => (req?.status === "failed" ? req?.error : null),
    [req],
  );

  if (!isOpen) return null;

  const title =
    teacherType === "school"
      ? "Invite School Teacher"
      : "Invite Independent Teacher";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Send an invitation to join HelloK12
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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col max-h-[calc(90vh-80px)]"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

              {teacherType === "school" ? (
                <Select
                  label="School"
                  options={schoolOptions}
                  value={formData?.school ?? "all"}
                  onChange={(v) => handleInputChange("school", v)}
                  error={errors?.school}
                  className="w-full"
                />
              ) : null}
            </div>

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

              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}
            </div>
          </div>

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

export default InviteTeacherModal;

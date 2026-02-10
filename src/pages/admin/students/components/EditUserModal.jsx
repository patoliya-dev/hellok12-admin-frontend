import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "components/ui/Modal";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import { languageOptions } from "../../../../utils/utils";
import Image from "components/AppImage";
import Icon from "components/AppIcon";

const genderOptions = [
  { value: "", label: "Select gender..." },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const findSchoolLabel = (schoolOptions, schoolId) => {
  if (!schoolId) return "";
  const found = (schoolOptions || []).find(
    (o) => String(o.value) === String(schoolId),
  );
  return found?.label || "";
};

const EditUserModal = ({
  isOpen,
  onClose,
  entity = "students", // "students" | "parents"
  user = null,
  schoolOptions = [{ value: "all", label: "All Schools" }],
  onSave,
  saving = false,
}) => {
  const isStudent = entity === "students";

  const initial = useMemo(() => {
    if (!user) return null;

    const profile = user.profile || {};
    const schoolId = user.school || profile.school || ""; // in case
    const schoolName = findSchoolLabel(schoolOptions, schoolId);

    return {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || profile.phone || "",
      address: profile.address || "",
      age: isStudent ? (profile.age ?? "") : "",
      gender: isStudent ? (profile.gender ?? "") : "",
      languages: toArray(profile.languages),
      // display-only (no edit)
      schoolId,
      schoolName,
      profileImage: user?.profileImage?.url || "",
    };
  }, [user, isStudent, schoolOptions]);

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (() => {
      setForm(initial);
      setErrors({});
    })();
  }, [initial]);

  const setField = useCallback((k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => (p?.[k] ? { ...p, [k]: "" } : p));
  }, []);

  const validate = useCallback(() => {
    const next = {};
    if (!String(form?.name || "").trim()) next.name = "Name is required";

    if (isStudent) {
      const age = form?.age;
      if (age !== "" && age !== null && age !== undefined) {
        const n = Number(age);
        if (!Number.isFinite(n) || n < 0)
          next.age = "Age must be a valid number";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form, isStudent]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!validate()) return;

      // IMPORTANT:
      // - Do NOT include school in payload (school is read-only here)
      const payload = {
        name: String(form.name || "").trim(),
        phone: String(form.phone || "").trim(),
        profile: {
          address: String(form.address || "").trim(),
          languages: toArray(form.languages).filter(Boolean),
          ...(isStudent
            ? {
                age: form.age === "" ? null : Number(form.age),
                gender: form.gender || null,
              }
            : {}),
        },
      };

      await onSave?.(payload);
    },
    [form, onSave, validate, isStudent],
  );

  if (!isOpen || !user || !form) return null;

  return (
    <Modal
      title={isStudent ? "Student Profile" : "Parent Profile"}
      onClose={onClose}
      width="max-w-4xl w-full"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Profile Photo (view-only for now)
              <div className="mt-2 w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-border">
                {form?.profileImage ? (
                  <Image
                    src={form.profileImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      name="User"
                      size={48}
                      className="text-muted-foreground"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* <button
              type="button"
              className="text-primary text-sm flex items-center gap-2"
              disabled
              title="Profile photo update not enabled yet"
            >
              ✎ Edit Profile
            </button> */}
          </div>

          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            error={errors.name}
          />

          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />

          <Input label="Email Address" value={form.email} disabled />
          <Input label="Password" value={"**************"} disabled />

          <div className="md:col-span-2">
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
            />
          </div>

          {isStudent ? (
            <>
              <Input
                label="Age"
                value={form.age}
                onChange={(e) => setField("age", e.target.value)}
                error={errors.age}
              />

              <Select
                label="Gender"
                value={form.gender}
                options={genderOptions}
                onChange={(v) => setField("gender", v)}
              />

              <Select
                label="Languages"
                value={form.languages?.[0] ?? ""}
                options={[
                  { value: "", label: "Select language..." },
                  ...languageOptions,
                ]}
                searchable
                onChange={(v) => setField("languages", v ? [v] : [])}
              />

              {/* School name only (disabled input) */}
              {form.schoolName && (
                <div className="md:col-span-2">
                  <Input
                    label="School"
                    value={form.schoolName || "—"}
                    disabled
                  />
                </div>
              )}
            </>
          ) : (
            <Select
              label="Languages"
              value={form.languages?.[0] ?? ""}
              options={[
                { value: "", label: "Select language..." },
                ...languageOptions,
              ]}
              searchable
              onChange={(v) => setField("languages", v ? [v] : [])}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-10">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={saving}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;

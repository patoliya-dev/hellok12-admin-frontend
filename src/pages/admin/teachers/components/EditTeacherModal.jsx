import React, { useCallback, useEffect, useMemo, useState } from "react";

import Modal from "components/ui/Modal";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Image from "components/AppImage";
import Icon from "components/AppIcon";

import { languageOptions } from "../../../../utils/utils";

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const isPositiveNumberOrBlank = (v) => {
  if (v === "" || v === null || v === undefined) return true;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0;
};

const findSchoolLabel = (schoolOptions, schoolId) => {
  if (!schoolId) return "";
  const found = (schoolOptions || []).find(
    (o) => String(o.value) === String(schoolId),
  );
  return found?.label || "";
};

const EditTeacherModal = ({
  isOpen,
  onClose,
  teacher = null,
  schoolOptions = [{ value: "all", label: "All Schools" }],
  onSave,
  saving = false,
}) => {
  const initial = useMemo(() => {
    if (!teacher) return null;

    const profile = teacher.profile || {};
    const schoolId = teacher.school || profile.school || "";
    const schoolName = findSchoolLabel(schoolOptions, schoolId);

    return {
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || profile.phone || "",
      address: profile.address || "",
      languages: toArray(profile.languages),
      experience: profile.experience ?? "",
      schoolId,
      schoolName,
      profileImage: teacher?.profileImage?.url || "",
      isSchoolTeacher: Boolean(schoolId),
    };
  }, [teacher, schoolOptions]);

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
    if (!isPositiveNumberOrBlank(form?.experience))
      next.experience = "Experience must be a valid number";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!validate()) return;

      const payload = {
        name: String(form.name || "").trim(),
        phone: String(form.phone || "").trim(),
        profile: {
          address: String(form.address || "").trim(),
          languages: toArray(form.languages).filter(Boolean),
          experience: form.experience === "" ? null : Number(form.experience),
        },
      };

      await onSave?.(payload);
    },
    [form, onSave, validate],
  );

  if (!isOpen || !teacher || !form) return null;

  return (
    <Modal title="Teacher Profile" onClose={onClose} width="max-w-4xl w-full">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Profile Photo
              <div className="mt-2 w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-border">
                {form.profileImage ? (
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
          <Input label="Password" value="**************" disabled />

          <div className="md:col-span-2">
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
            />
          </div>

          <Input
            label="Years of Experience"
            value={form.experience}
            onChange={(e) => setField("experience", e.target.value)}
            error={errors.experience}
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

          {form.isSchoolTeacher && form.schoolName ? (
            <div className="md:col-span-2">
              <Input label="School" value={form.schoolName || "—"} disabled />
            </div>
          ) : null}
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

export default EditTeacherModal;

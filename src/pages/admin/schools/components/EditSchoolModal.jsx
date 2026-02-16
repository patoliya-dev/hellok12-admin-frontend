import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "components/ui/Modal";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Image from "components/AppImage";
import Icon from "components/AppIcon";

const toStr = (v) => (v === null || v === undefined ? "" : String(v));
const clean = (v) => toStr(v).trim();

const normalizeAddresses = (school) => {
  const p = school?.profile || {};
  const arr = Array.isArray(p.addresses)
    ? p.addresses.filter(Boolean).map(toStr)
    : [];
  const a1 = clean(p.address || p.address1);
  const a2 = clean(p.address2);

  const merged = [...arr];
  if (a1 && !merged.includes(a1)) merged.unshift(a1);
  if (a2 && !merged.includes(a2)) merged.push(a2);

  // Always render at least 2 address fields like screenshot
  if (merged.length === 0) return ["", ""];
  if (merged.length === 1) return [merged[0], ""];
  return merged;
};

const EditSchoolModal = ({
  isOpen,
  onClose,
  school,
  onSave,
  saving = false,
}) => {
  const initial = useMemo(() => {
    if (!school) return null;
    const p = school.profile || {};

    return {
      // UI fields (match screenshot)
      schoolLogo: school?.profileImage?.url || "",
      schoolName: clean(p.schoolName || school.name),
      adminFullName: clean(school.name), // Admin Full Name
      phone: clean(school.phone || p.phone),
      email: clean(school.email),
      website: clean(p.website),
      passwordMasked: "***************",
      description: clean(p.description),
      addresses: normalizeAddresses(school),
    };
  }, [school]);

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (() => {
      setForm(initial);
      setErrors({});
    })();
  }, [initial]);

  const setField = useCallback((k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => (prev?.[k] ? { ...prev, [k]: "" } : prev));
  }, []);

  const setAddress = useCallback((idx, v) => {
    setForm((prev) => {
      const next = Array.isArray(prev.addresses) ? [...prev.addresses] : [];
      next[idx] = v;
      return { ...prev, addresses: next };
    });
  }, []);

  const addAddress = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      addresses: [...(prev.addresses || []), ""],
    }));
  }, []);

  const removeAddress = useCallback((idx) => {
    setForm((prev) => {
      const next = [...(prev.addresses || [])];
      next.splice(idx, 1);
      // keep at least 2 inputs visible
      while (next.length < 2) next.push("");
      return { ...prev, addresses: next };
    });
  }, []);

  const validate = useCallback(() => {
    const next = {};
    if (!clean(form?.schoolName)) next.schoolName = "School name is required";
    if (!clean(form?.description)) next.description = "Description is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!validate()) return;

      const addresses = (form.addresses || [])
        .map((x) => clean(x))
        .filter(Boolean);

      // Backward compatible payload:
      // - user.name = admin full name (read-only in UI)
      // - user.phone editable
      // - profile.schoolName, profile.website, profile.description
      // - profile.address/address2 maintained for legacy
      // - profile.addresses for scalable multi-address
      const payload = {
        phone: clean(form.phone),
        profile: {
          schoolName: clean(form.schoolName),
          website: clean(form.website),
          description: clean(form.description),
          addresses,
          address: addresses?.[0] || "",
          address2: addresses?.[1] || "",
        },
      };

      await onSave?.(payload);
    },
    [form, onSave, validate],
  );

  if (!isOpen || !school || !form) return null;

  return (
    <Modal title="School Profile" onClose={onClose} width="max-w-5xl w-full">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="bg-card border border-border rounded-lg">
          {/* Header row inside card */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <Icon name="School" size={18} className="text-primary" />
              <h3 className="text-base font-semibold text-card-foreground">
                School Information
              </h3>
            </div>
            <div className="text-sm text-muted-foreground">Edit Profile</div>
          </div>

          <div className="p-6">
            {/* Logo */}
            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-2">
                School Logo
              </div>
              <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border border-border">
                {form.schoolLogo ? (
                  <Image
                    src={form.schoolLogo}
                    alt="School logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      name="School"
                      size={28}
                      className="text-muted-foreground"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input
                label="School Name"
                value={form.schoolName}
                onChange={(e) => setField("schoolName", e.target.value)}
                error={errors.schoolName}
                required
              />

              <Input
                label="Admin Full Name"
                value={form.adminFullName}
                disabled
              />

              <Input
                label="Phone Number"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />

              <Input label="Email Address" value={form.email} disabled />

              <Input
                label="Website"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
              />

              <Input label="Password" value={form.passwordMasked} disabled />

              <div className="md:col-span-3">
                <Input
                  label="Description *"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  error={errors.description}
                />
              </div>

              {/* Addresses (exact UI: Address 1, Address 2 + Add More Address + delete icon) */}
              {(form.addresses || []).map((addr, idx) => (
                <div key={idx} className="md:col-span-3 flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      label={`Address ${idx + 1}`}
                      value={addr}
                      onChange={(e) => setAddress(idx, e.target.value)}
                    />
                  </div>

                  {/* show delete only for Address 2+ (like screenshot feel) */}
                  {idx >= 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mb-1"
                      onClick={() => removeAddress(idx)}
                      disabled={saving}
                      title="Remove address"
                    >
                      <Icon
                        name="Trash2"
                        size={16}
                        className="text-destructive"
                      />
                    </Button>
                  ) : (
                    <div className="w-10" />
                  )}
                </div>
              ))}

              <div className="md:col-span-3 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAddress}
                  disabled={saving}
                >
                  <Icon name="Plus" size={16} />
                  <span className="ml-2">Add More Address</span>
                </Button>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 mt-8">
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
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditSchoolModal;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Loader from "components/ui/Loader";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Icon from "components/AppIcon";
import Image from "components/AppImage";

import {
  fetchSchoolDetails,
  updateUser,
} from "reducers/superAdmin/superAdminThunks";
import {
  selectReq,
  selectSchoolDetails,
  selectSchoolSummary,
} from "reducers/superAdmin/superAdminSlice";
import { successToast, errorToast } from "../../../../utils/utils";

const StatCard = ({ icon, iconBg, value, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon name={icon} size={22} className="text-white" />
        </div>
        <div className="text-left">
          <div className="text-2xl font-semibold text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
      <Icon name="ArrowRight" size={18} className="text-primary" />
    </button>
  );
};

const toMoney = (n) => {
  const num = Number(n || 0);
  if (!Number.isFinite(num)) return "$0";

  return num.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const SchoolDetails = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const school = useSelector(selectSchoolDetails);
  const summary = useSelector(selectSchoolSummary);

  const req = useSelector(selectReq("fetchSchoolDetails"));
  const loading = req?.status === "loading";

  const updateReq = useSelector(selectReq("updateUser"));
  const saving = updateReq?.status === "loading";

  const [editMode, setEditMode] = useState(false);

  const initialForm = useMemo(() => {
    const profile = school?.profile || {};

    const addresses = Array.isArray(profile?.addresses)
      ? profile.addresses.filter((x) => String(x || "").trim() !== "")
      : [];

    const merged =
      addresses.length > 0
        ? addresses
        : [profile?.address1, profile?.address2, profile?.address].filter((x) =>
            String(x || "").trim(),
          );

    return {
      schoolName: profile.schoolName || school?.name || "",
      adminFullName: school?.name || "",
      phone: school?.phone || profile.phone || "",
      email: school?.email || "",
      website: profile.website || "",
      password: "*************",
      description: profile.description || "",
      addresses: merged.length > 0 ? merged : [""],
      logo: school?.profileImage?.url || "",
    };
  }, [school]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!schoolId) return;
    dispatch(fetchSchoolDetails({ schoolId }));
  }, [dispatch, schoolId]);

  useEffect(() => {
    (() => {
      setForm(initialForm);
      setErrors({});
      setEditMode(false);
    })();
  }, [initialForm]);

  const setField = useCallback((k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => (p?.[k] ? { ...p, [k]: "" } : p));
  }, []);

  const setAddress = useCallback((idx, v) => {
    setForm((p) => {
      const next = [...(p.addresses || [])];
      next[idx] = v;
      return { ...p, addresses: next };
    });
  }, []);

  const removeAddress = useCallback((idx) => {
    setForm((p) => {
      const prev = Array.isArray(p.addresses) ? p.addresses : [""];
      if (prev.length <= 1) return { ...p, addresses: [""] };

      const next = [...prev];
      next.splice(idx, 1);
      return { ...p, addresses: next.length ? next : [""] };
    });
  }, []);

  const addAddress = useCallback(() => {
    setForm((p) => {
      const prev = Array.isArray(p.addresses) ? p.addresses : [""];
      return { ...p, addresses: [...prev, ""] };
    });
  }, []);

  // keep this memo so we don't depend on "school" object in callbacks
  const schoolProfileSnapshot = useMemo(() => {
    // this is the latest profile coming from API/store
    return school?.profile || {};
  }, [school]);

  const validateForm = useCallback((draft) => {
    const next = {};
    if (!String(draft?.schoolName || "").trim())
      next.schoolName = "School name is required";
    if (!String(draft?.description || "").trim())
      next.description = "Description is required";
    return next;
  }, []);

  const onSave = useCallback(async () => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const payload = {
        name: String(form.adminFullName || "").trim(),
        phone: String(form.phone || "").trim(),
        profile: {
          ...schoolProfileSnapshot,
          schoolName: String(form.schoolName || "").trim(),
          website: String(form.website || "").trim(),
          description: String(form.description || "").trim(),
          addresses: (form.addresses || [])
            .map((x) => String(x || "").trim())
            .filter(Boolean),
        },
      };

      await dispatch(updateUser({ userId: schoolId, payload })).unwrap();

      successToast("School updated");
      setEditMode(false);
      dispatch(fetchSchoolDetails({ schoolId }));
    } catch (e) {
      errorToast(e?.message || e?.error || "Failed to update school");
    }
  }, [dispatch, form, schoolId, schoolProfileSnapshot, validateForm]);

  const schoolTitle = form?.schoolName || "School";

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        {/* breadcrumb (matches image) */}
        <div className="text-sm text-muted-foreground mt-6">
          <button
            className="hover:underline"
            onClick={() => navigate("/admin/schools")}
          >
            Manage Schools
          </button>
          <span className="mx-2">{">"}</span>
          <span className="text-foreground">{schoolTitle}</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {/* header row */}
            <div className="mt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center">
                {form.logo ? (
                  <Image
                    src={form.logo}
                    alt={schoolTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon
                    name="Building2"
                    size={24}
                    className="text-muted-foreground"
                  />
                )}
              </div>

              <div>
                <div className="text-3xl font-semibold text-foreground">
                  {schoolTitle}
                </div>
                <div className="text-muted-foreground">
                  Manage and oversee all school across the platform
                </div>
              </div>
            </div>

            {/* stat cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                icon="Users"
                iconBg="bg-blue-600"
                value={summary?.totalTeachers ?? 0}
                label="Total Teachers"
                onClick={() => navigate(`/admin/teachers?school=${schoolId}`)}
              />
              <StatCard
                icon="GraduationCap"
                iconBg="bg-emerald-600"
                value={summary?.totalStudents ?? 0}
                label="Total Students"
                onClick={() => navigate(`/admin/students?school=${schoolId}`)}
              />
              <StatCard
                icon="BookOpen"
                iconBg="bg-amber-500"
                value={summary?.totalCourses ?? 0}
                label="Total Courses"
                onClick={() => navigate(`/admin/courses?school=${schoolId}`)}
              />
              <StatCard
                icon="DollarSign"
                iconBg="bg-green-600"
                value={toMoney(summary?.totalRevenue ?? 0)}
                label="Total Revenue"
                onClick={() => navigate(`/admin/earning?school=${schoolId}`)}
              />
            </div>

            {/* School Information card */}
            <section className="mt-10 bg-card border border-border rounded-xl overflow-hidden">
              {/* header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={18} className="text-primary" />
                  <div className="font-semibold text-foreground">
                    School Information
                  </div>
                </div>

                {!editMode ? (
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground flex items-center gap-2 hover:underline"
                    onClick={() => setEditMode(true)}
                  >
                    <Icon name="Pencil" size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      disabled={saving}
                      onClick={() => {
                        setEditMode(false);
                        setForm(initialForm);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button loading={saving} disabled={saving} onClick={onSave}>
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {/* body */}
              <div className="p-6">
                <div className="text-sm text-muted-foreground mb-2">
                  School Logo
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center">
                  {form.logo ? (
                    <Image
                      src={form.logo}
                      alt="School Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon
                      name="School"
                      size={24}
                      className="text-muted-foreground"
                    />
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="School Name"
                    value={form.schoolName}
                    onChange={(e) => setField("schoolName", e.target.value)}
                    disabled={!editMode}
                    error={errors.schoolName}
                  />
                  <Input
                    label="Admin Full Name"
                    value={form.adminFullName}
                    onChange={(e) => setField("adminFullName", e.target.value)}
                    disabled={!editMode}
                  />
                  <Input
                    label="Phone Number"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    disabled={!editMode}
                  />

                  <Input label="Email Address" value={form.email} disabled />
                  <Input
                    label="Website"
                    value={form.website}
                    onChange={(e) => setField("website", e.target.value)}
                    disabled={!editMode}
                  />
                  <Input label="Password" value={form.password} disabled />
                </div>

                <div className="mt-6">
                  <label className="text-sm font-medium text-foreground">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={[
                      "mt-2 w-full p-3 border border-border rounded-lg resize-none text-sm",
                      "bg-background focus:ring-2 focus:ring-primary focus:border-transparent",
                      !editMode ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                    rows={3}
                    value={form.description}
                    disabled={!editMode}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Enter your description"
                  />
                  {errors.description ? (
                    <p className="text-xs text-destructive mt-1">
                      {errors.description}
                    </p>
                  ) : null}
                </div>

                {/* Addresses like image */}
                <div className="mt-8 space-y-5">
                  {(form.addresses || []).map((addr, idx) => {
                    const label = `Address ${idx + 1}`;
                    return (
                      <div key={`addr-${idx}`} className="relative">
                        <Input
                          label={label}
                          value={addr}
                          onChange={(e) => setAddress(idx, e.target.value)}
                          disabled={!editMode}
                        />
                        {editMode && idx > 0 ? (
                          <button
                            type="button"
                            onClick={() => removeAddress(idx)}
                            className="absolute right-2 top-[38px] p-2 rounded-md hover:bg-muted text-red-500"
                            title="Remove"
                          >
                            <Icon name="Trash2" size={18} />
                          </button>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={addAddress}
                      disabled={!editMode}
                      className="gap-2"
                    >
                      <Icon name="Plus" size={16} />
                      Add More Address
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default SchoolDetails;

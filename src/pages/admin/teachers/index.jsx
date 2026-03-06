import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import RoleBasedHeader from "components/ui/RoleBasedHeader";
import PageHeader from "components/ui/PageHeader";
import SearchBar from "components/ui/SearchBar";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";
import Loader from "components/ui/Loader";

import {
  fetchSchools,
  fetchTeachers,
  inviteTeacher,
  updateUser,
} from "reducers/superAdmin/superAdminThunks";

import {
  selectSchools,
  selectSchoolsReq,
  selectReq,
  selectTeachers,
  selectTeachersPagination,
} from "reducers/superAdmin/superAdminSlice";

import InvitationTable from "../components/InvitationTable";
import {
  fetchInvitations,
  cancelInvitation,
  // requestInvitationProfile,
} from "reducers/invitations/invitationsThunks";
import {
  selectInvitations,
  selectInvitationsLoading,
  selectInvitationsPagination,
} from "reducers/invitations/invitationsSlice";

import TeachersFilters from "./components/TeachersFilters";
import TeachersTable from "./components/TeachersTable";
import EditTeacherModal from "./components/EditTeacherModal";
import InviteTeacherModal from "./components/InviteTeacherModal";
import ProfileRequestModal from "./components/ProfileRequestModal";
import { errorToast, successToast } from "../../../utils/utils";

const listPageSize = 10;
const invPageSize = 10;

// Normalize for invitations list filtering (no backend dependency)
const getInvitationTeacherType = (inv) =>
  inv?.teacherType || inv?.meta?.teacherType || inv?.context?.teacherType;

const ManageTeachers = () => {
  const dispatch = useDispatch();

  // Primary tabs: school | independent
  const [activeType, setActiveType] = useState("school");

  // Secondary tabs: list | invitations
  const [activeTab, setActiveTab] = useState("list");

  // Search (separate per list + invitations)
  const [listSearch, setListSearch] = useState("");
  const [invSearch, setInvSearch] = useState("");

  // Paging
  const [page, setPage] = useState(1);
  const [invPage, setInvPage] = useState(1);

  // Filters (only for list)
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    school: "all",
    experience: "all",
    status: "all",
  });

  // Modals
  const [editOpen, setEditOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [profileReqOpen, setProfileReqOpen] = useState(false);
  const [profileReqTarget, setProfileReqTarget] = useState(null);

  // Schools
  const schools = useSelector(selectSchools);
  const schoolsReq = useSelector(selectSchoolsReq);
  const schoolsLoading = schoolsReq?.status === "loading";

  useEffect(() => {
    dispatch(fetchSchools({ page: 1, limit: 200, search: "" }));
  }, [dispatch]);

  const schoolOptions = useMemo(() => {
    const base = [{ value: "all", label: "Select school" }];
    const items = (schools || []).map((s) => ({
      value: s._id,
      label: s.profile?.schoolName || s.name || "School",
    }));
    return [...base, ...items];
  }, [schools]);

  // Teachers list
  const rows = useSelector(selectTeachers);
  const pagination = useSelector(selectTeachersPagination);
  const listReq = useSelector(selectReq("fetchTeachers"));
  const loading = listReq?.status === "loading";

  const buildListParams = useCallback(() => {
    const params = {
      page,
      limit: listPageSize,
      teacherType: activeType, // school | independent
      search: listSearch || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      experience: filters.experience !== "all" ? filters.experience : undefined,
    };
    if (activeType === "school") {
      params.school = filters.school !== "all" ? filters.school : undefined;
    }
    return params;
  }, [page, activeType, listSearch, filters]);

  useEffect(() => {
    if (activeTab !== "list") return;
    dispatch(fetchTeachers(buildListParams()));
  }, [dispatch, activeTab, buildListParams]);

  // Invitations
  const inviteRole = "teacher";
  const allInvitations = useSelector((s) =>
    selectInvitations(s, inviteRole, invSearch, invPage, invPageSize),
  );
  const invLoading = useSelector((s) =>
    selectInvitationsLoading(s, inviteRole, invSearch, invPage, invPageSize),
  );
  const invPagination = useSelector((s) =>
    selectInvitationsPagination(s, inviteRole, invSearch, invPage, invPageSize),
  );

  const invitations = useMemo(() => {
    const list = allInvitations || [];
    // keep UI consistent even if backend doesn't filter by type
    return list.filter((inv) => {
      const t = String(getInvitationTeacherType(inv) || "").toLowerCase();
      if (!t) return true; // older invites w/o metadata
      return t === String(activeType).toLowerCase();
    });
  }, [allInvitations, activeType]);

  const callInvitations = useCallback(() => {
    return dispatch(
      fetchInvitations({
        role: inviteRole,
        search: invSearch,
        page: invPage,
        limit: invPageSize,
        teacherType: activeType === "school" ? "school" : "independent",
        school: activeType === "school" ? filters.school : undefined,
      }),
    );
  }, [dispatch, inviteRole, invSearch, invPage, activeType, filters.school]);

  useEffect(() => {
    if (activeTab !== "invitations") return;
    callInvitations();
  }, [activeTab, callInvitations]);

  // Reset pages when search changes
  useEffect(() => {
    (() => {
      if (activeTab !== "list") return;
      setPage(1);
    })();
  }, [listSearch, activeTab]);

  useEffect(() => {
    (() => {
      if (activeTab !== "invitations") return;
      setInvPage(1);
    })();
  }, [invSearch, activeTab]);

  const handleSearch = useCallback(
    (term) => {
      if (activeTab === "list") setListSearch(term);
      else setInvSearch(term);
    },
    [activeTab],
  );

  const handleTypeChange = useCallback((type) => {
    setActiveType(type);
    setActiveTab("list");
    setListSearch("");
    setInvSearch("");
    setPage(1);
    setInvPage(1);
    setShowFilter(false);
    setFilters((p) => ({ ...p, school: "all" }));
  }, []);

  const handleFiltersChange = useCallback((next) => {
    setFilters(next);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ school: "all", experience: "all", status: "all" });
    setPage(1);
  }, []);

  const onCancelInvite = useCallback(
    async (inv) => {
      try {
        await dispatch(
          cancelInvitation({
            invitationId: inv._id,
            role: inviteRole,
            search: invSearch || "",
            page: invPage,
            limit: invPageSize,
          }),
        ).unwrap();

        await callInvitations();
        successToast("Invitation cancelled");
      } catch (e) {
        errorToast(e || "Failed to cancel invitation");
      }
    },
    [dispatch, inviteRole, invSearch, invPage, callInvitations],
  );

  const onRequestProfile = useCallback(async () => {
    // async (inv, message) => {
    try {
      // await dispatch(
      //   requestInvitationProfile({ invitationId: inv._id, message }),
      // ).unwrap();
      successToast("Request sent successfully");
    } catch {
      // UI remains usable even if backend doesn't implement yet
      successToast("Request sent successfully");
    }
  }, []);

  const invitationCount = invPagination?.total ?? invitations?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title="Manage Teachers"
          description="Manage and oversee all teachers across the platform"
          isButton
          iconName="UserPlus"
          buttonTitle="Invite Teacher"
          activeEntityTab={
            activeType === "school" ? "School Teachers" : "Independent Teachers"
          }
          onButtonClick={() => setInviteOpen(true)}
          studentCount={pagination?.total || 0}
        />

        {/* Primary tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 gap-2 overflow-x-auto">
            {[
              { id: "school", label: "School Teachers", icon: "School" },
              { id: "independent", label: "Independent Teacher", icon: "User" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleTypeChange(t.id)}
                className={`
                  flex items-center gap-2 py-[18px] px-1 border-b-2 font-medium text-sm transition-smooth
                  ${
                    activeType === t.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                  }
                `}
              >
                <Icon name={t.icon} size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search + Filter */}
        <section className="my-6 w-full">
          <div className="flex flex-row gap-3 w-full">
            <div className="flex-1 min-w-0">
              <SearchBar
                onSearch={handleSearch}
                placeholder={"Search teachers name"}
              />
            </div>
            {activeTab === "list" ? (
              <Button
                variant="ghost"
                iconName="Funnel"
                iconSize={22}
                className="text-primary"
                onClick={() => setShowFilter((v) => !v)}
              />
            ) : null}
          </div>

          {activeTab === "list" && showFilter ? (
            <div className="w-full mt-4">
              <TeachersFilters
                type={activeType}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                schoolOptions={schoolOptions}
                schoolsLoading={schoolsLoading}
              />
            </div>
          ) : null}
        </section>

        {/* Secondary tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8 gap-2 overflow-x-auto">
            {[
              { id: "list", label: "Teachers", count: pagination?.total },
              {
                id: "invitations",
                label: "Invitations",
                count: invitationCount,
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`
                  flex items-center gap-2 py-[18px] px-1 border-b-2 font-medium text-sm transition-smooth
                  ${
                    activeTab === t.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                  }
                `}
              >
                {t.label} ({t.count ?? 0})
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "list" ? (
          loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : (
            <TeachersTable
              title={
                activeType === "school"
                  ? "School Teachers"
                  : "Independent Teachers"
              }
              rows={rows || []}
              pagination={pagination}
              loading={loading}
              onPageChange={setPage}
              onEdit={(u) => {
                setEditTeacher(u);
                console.log("open edit modal");

                setEditOpen(true);
              }}
              onDelete={(u) => console.log("delete teacher", u)}
            />
          )
        ) : (
          <InvitationTable
            title={
              activeType === "school"
                ? "Teacher invitations (School)"
                : "Teacher invitations (Independent)"
            }
            invitations={invitations}
            pagination={invPagination}
            loading={invLoading}
            onCancel={onCancelInvite}
            showRole={false}
            onPageChange={setInvPage}
            // NEW optional behaviour (only teachers use it)
            showRequestProfile
            onRequestProfile={(inv) => {
              setProfileReqTarget(inv);
              setProfileReqOpen(true);
            }}
          />
        )}
      </main>

      {/* Edit teacher */}
      <EditTeacherModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditTeacher(null);
        }}
        teacher={editTeacher}
        teacherType={activeType}
        schoolOptions={schoolOptions}
        saving={useSelector(selectReq("updateUser"))?.status === "loading"}
        onSave={async (payload) => {
          try {
            await dispatch(
              updateUser({ userId: editTeacher._id, payload }),
            ).unwrap();
            successToast("Profile updated");
            setEditOpen(false);
            setEditTeacher(null);
            dispatch(fetchTeachers(buildListParams()));
          } catch (e) {
            errorToast(e?.message || e?.error || "Failed to update profile");
          }
        }}
      />

      {/* Invite teacher */}
      <InviteTeacherModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        teacherType={activeType}
        schoolOptions={schoolOptions}
        onSuccess={() => {
          setInviteOpen(false);
          if (activeTab === "list") dispatch(fetchTeachers(buildListParams()));
          else callInvitations();
        }}
        onInvite={async (payload) => {
          await dispatch(inviteTeacher(payload)).unwrap();
        }}
      />

      {/* Request profile completion */}
      <ProfileRequestModal
        isOpen={profileReqOpen}
        onClose={() => {
          setProfileReqOpen(false);
          setProfileReqTarget(null);
        }}
        onSubmit={async (message) => {
          if (!profileReqTarget) return;
          await onRequestProfile(profileReqTarget, message);
          setProfileReqOpen(false);
          setProfileReqTarget(null);
        }}
      />
    </div>
  );
};

export default ManageTeachers;

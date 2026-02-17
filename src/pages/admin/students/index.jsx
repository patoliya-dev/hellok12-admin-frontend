import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/ui/Button";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import PageHeader from "../../../components/ui/PageHeader";
import Icon from "../../../components/AppIcon";
import ProfileRequestModal from "./components/ProfileRequestModal";
import InviteStudentModal from "./components/InviteStudentModal"; // we’ll make it generic below
import SearchBar from "../../../components/ui/SearchBar";
import Loader from "../../../components/ui/Loader";
import { successToast, errorToast } from "../../../utils/utils";

import {
  fetchStudents,
  fetchSchools,
  fetchParents,
  updateUser,
} from "reducers/superAdmin/superAdminThunks";
import {
  selectStudents,
  selectStudentsPagination,
  selectSchools,
  selectSchoolsReq,
  selectReq,
  selectParents,
  selectParentsPagination,
} from "reducers/superAdmin/superAdminSlice";

import InvitationTable from "../components/InvitationTable";
import {
  fetchInvitations,
  cancelInvitation,
} from "reducers/invitations/invitationsThunks";
import {
  selectInvitations,
  selectInvitationsLoading,
  selectInvitationsPagination,
} from "reducers/invitations/invitationsSlice";

import Filters from "./components/Filters";
import UsersTable from "./components/UsersTable";
import EditUserModal from "./components/EditUserModal";

const listPageSize = 10;
const invPageSize = 10;

const ManageStudents = () => {
  const dispatch = useDispatch();

  // Entity Tabs: students | parents
  const [activeEntityTab, setActiveEntityTab] = useState("students");

  // Secondary Tabs: list | invitations
  const [activeTab, setActiveTab] = useState("list");

  const [currentPage, setCurrentPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProfileRequestModal, setShowProfileRequestModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Search (separate per list + invitations)
  const [listSearch, setListSearch] = useState("");
  const [invSearch, setInvSearch] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [invPage, setInvPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    school: "all",
    language: "",
    ageRange: "",
    status: "all",
  });

  // Schools for school dropdown
  const schools = useSelector(selectSchools);
  const schoolsReq = useSelector(selectSchoolsReq);
  const schoolsLoading = schoolsReq?.status === "loading";

  useEffect(() => {
    dispatch(fetchSchools({ page: 1, limit: 200, search: "" }));
  }, [dispatch]);

  const schoolOptions = useMemo(() => {
    const base = [{ value: "all", label: "All Schools" }];
    const items = (schools || []).map((s) => ({
      value: s._id,
      label: s.profile?.schoolName || s.name || "School",
    }));
    return [...base, ...items];
  }, [schools]);

  // Data: students/parents (same slice)
  const rawStudents = useSelector(selectStudents);
  const studentsPagination = useSelector(selectStudentsPagination);

  const rawParents = useSelector(selectParents);
  const parentsPagination = useSelector(selectParentsPagination);

  const rawList = activeEntityTab === "students" ? rawStudents : rawParents;
  const pagination =
    activeEntityTab === "students" ? studentsPagination : parentsPagination;

  // Loading request depends on active entity
  const fetchReq = useSelector(
    selectReq(
      activeEntityTab === "students" ? "fetchStudents" : "fetchParents",
    ),
  );
  const loading = fetchReq.status === "loading";

  const callList = useCallback(() => {
    const commonParams = {
      page: currentPage,
      limit: listPageSize,
      search: listSearch || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      school: filters.school !== "all" ? filters.school : undefined,
      language: filters.language || undefined,
      ...(activeEntityTab === "students"
        ? { ageRange: filters.ageRange || undefined }
        : {}), // Parents don't use ageRange by default
    };

    dispatch(
      activeEntityTab === "students"
        ? fetchStudents(commonParams)
        : fetchParents(commonParams),
    );
  }, [dispatch, activeEntityTab, currentPage, filters, listSearch]);

  // Build list API params
  const buildListParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: listPageSize,
      search: listSearch || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      school: filters.school !== "all" ? filters.school : undefined,
      language: filters.language || undefined,
    };

    // Only students use ageRange
    if (activeEntityTab === "students") {
      params.ageRange = filters.ageRange || undefined;
    }

    return params;
  }, [activeEntityTab, currentPage, listSearch, filters]);

  // Fetch list when entity/list params change AND list tab is active
  useEffect(() => {
    if (activeTab !== "list") return;
    const params = buildListParams();

    dispatch(
      activeEntityTab === "students"
        ? fetchStudents(params)
        : fetchParents(params),
    );
  }, [dispatch, activeEntityTab, activeTab, buildListParams]);

  useEffect(() => {
    (() => {
      if (!(activeEntityTab === "students" && activeTab === "list")) {
        setShowFilter(false);
        setFilters({
          school: "all",
          language: "",
          ageRange: "",
          status: "all",
        });
      }
    })();
  }, [activeEntityTab, activeTab]);

  // Invitations: separated by entity role
  const inviteRole = activeEntityTab === "students" ? "student" : "parent";

  const invitations = useSelector((s) =>
    selectInvitations(s, inviteRole, invSearch, invPage, invPageSize),
  );
  const invLoading = useSelector((s) =>
    selectInvitationsLoading(s, inviteRole, invSearch, invPage, invPageSize),
  );
  const invPagination = useSelector((s) =>
    selectInvitationsPagination(s, inviteRole, invSearch, invPage, invPageSize),
  );

  const callInvitations = useCallback(() => {
    return dispatch(
      fetchInvitations({
        role: inviteRole,
        search: invSearch,
        page: invPage,
        limit: invPageSize,
      }),
    );
  }, [dispatch, inviteRole, invSearch, invPage]);

  useEffect(() => {
    if (activeTab !== "invitations") return;
    callInvitations();
  }, [activeTab, callInvitations]);

  // Reset pages when search changes
  useEffect(() => {
    (() => {
      if (activeTab !== "list") return;
      setCurrentPage(1);
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

  const handleEntityTabChange = useCallback((id) => {
    setActiveEntityTab(id);
    setActiveTab("list");
    setCurrentPage(1);
    setInvPage(1);
    setListSearch("");
    setInvSearch("");
    // setSelectedStudent(null);
    setShowFilter(false);
  }, []);

  const handleInviteModalOpen = useCallback(() => {
    setShowInviteModal((v) => !v);
  }, []);

  const handleFiltersChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ school: "all", language: "", ageRange: "", status: "all" });
    setCurrentPage(1);
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

        if (activeTab === "invitations") await callInvitations();
        successToast("Invitation cancelled");
      } catch (e) {
        errorToast(e || "Failed to cancel invitation");
      }
    },
    [dispatch, inviteRole, invSearch, invPage, activeTab, callInvitations],
  );

  const invitationTotalCount = invPagination?.total ?? invitations?.length ?? 0;

  const headerTitle =
    activeEntityTab === "students" ? "Manage Students" : "Manage Parents";
  const headerDesc =
    activeEntityTab === "students"
      ? "Manage and oversee all students across the platform"
      : "Manage and oversee all parents across the platform";
  const inviteBtnLabel =
    activeEntityTab === "students" ? "Invite Students" : "Invite Parent";

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title={headerTitle}
          description={headerDesc}
          isButton
          iconName="UserPlus"
          buttonTitle={inviteBtnLabel}
          onButtonClick={handleInviteModalOpen}
          studentCount={pagination?.total || 0}
          activeEntityTab={activeEntityTab}
        />

        {/* MAIN ENTITY TABS */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 gap-2 overflow-x-auto">
            {[
              {
                id: "students",
                label: "Manage Students",
                icon: "GraduationCap",
              },
              { id: "parents", label: "Manage Parents", icon: "User" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  handleEntityTabChange(t.id);
                }}
                className={`
                            flex items-center gap-2 space-x-2 py-[18px] px-1 border-b-2 font-medium text-sm transition-smooth
                            ${
                              activeEntityTab === t.id
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
                placeholder={"Search students name"}
              />
            </div>
            {activeEntityTab === "students" && activeTab === "list" && (
              <Button
                variant="ghost"
                iconName="Funnel"
                iconSize={22}
                className="text-primary"
                onClick={() => setShowFilter((v) => !v)}
              />
            )}
          </div>

          {activeEntityTab === "students" &&
            activeTab === "list" &&
            showFilter && (
              <div className="w-full mt-3">
                <Filters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  schoolOptions={schoolOptions}
                  schoolsLoading={schoolsLoading}
                  // Hide age range for parents (UI + API)
                  showAgeRange={activeEntityTab === "students"}
                />
              </div>
            )}
        </section>

        {/* LIST / INVITATIONS TABS */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8 gap-2 overflow-x-auto">
            {[
              {
                id: "list",
                label: activeEntityTab === "students" ? "Students" : "Parents",
                count: pagination?.total,
              },
              {
                id: "invitations",
                label: "Invitations",
                count: invitationTotalCount,
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                }}
                className={`
                            flex items-center gap-2 space-x-2 py-[18px] px-1 border-b-2 font-medium text-sm transition-smooth
                            ${
                              activeTab === t.id
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                            }
                          `}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : activeTab === "list" ? (
          <section className="grid grid-cols-1">
            <UsersTable
              title={activeEntityTab === "students" ? "Students" : "Parents"}
              subtitle={`Manage and oversee all ${activeEntityTab} across the platform`}
              entity={activeEntityTab}
              rows={rawList || []} // IMPORTANT: pass raw API items (contains profileImage)
              pagination={pagination}
              loading={loading}
              onPageChange={setCurrentPage}
              onEdit={(u) => {
                setEditUser(u);
                setEditOpen(true);
              }}
              onDelete={(u) => {
                // keep existing flow - just wire later
                console.log("delete", u);
              }}
            />
            <EditUserModal
              isOpen={editOpen}
              onClose={() => {
                setEditOpen(false);
                setEditUser(null);
              }}
              entity={activeEntityTab}
              user={editUser}
              schoolOptions={schoolOptions}
              // saving={useSelector(selectReq("updateUser"))?.status === "loading"} // if you do updateUser thunk
              onSave={async (payload) => {
                try {
                  await dispatch(
                    updateUser({
                      userId: editUser._id,
                      entity: activeEntityTab, // optional
                      payload,
                    }),
                  ).unwrap();
                  successToast("Profile updated");
                  setEditOpen(false);
                  setEditUser(null);
                  callList();
                } catch (e) {
                  errorToast(
                    e?.message || e?.error || "Failed to update profile",
                  );
                }
              }}
            />
          </section>
        ) : (
          <section className="grid grid-cols-1">
            <InvitationTable
              title={
                activeEntityTab === "students"
                  ? "Student invitations"
                  : "Parent invitations"
              }
              invitations={invitations}
              pagination={invPagination}
              loading={invLoading}
              onCancel={onCancelInvite}
              showRole={false}
              onPageChange={setInvPage}
            />
          </section>
        )}
      </main>

      {/* Invite modal should invite based on activeEntityTab */}
      <InviteStudentModal
        isOpen={showInviteModal}
        onClose={handleInviteModalOpen}
        entityType={activeEntityTab} // NEW PROP
        onSuccess={() => {
          setShowSuccessModal(true);
          if (activeTab === "list") {
            // re-fetch list
            const params = buildListParams();
            dispatch(
              activeEntityTab === "students"
                ? fetchStudents(params)
                : fetchParents(params),
            );
          } else {
            callInvitations();
          }
        }}
      />

      <ProfileRequestModal
        isOpen={showProfileRequestModal}
        onClose={() => setShowProfileRequestModal(false)}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-card rounded-lg max-w-md text-center shadow-elevation-3 p-4">
            <div className="flex justify-end">
              <Icon
                name={"X"}
                size={30}
                className="text-brand-gray-800 hover:cursor-pointer"
                onClick={() => setShowSuccessModal(false)}
              />
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="Check" size={64} color="white" />
              </div>
              <p className="text-h4 font-medium text-brand-gray-800 px-10 mb-6">
                Your invitation was sent successfully
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;

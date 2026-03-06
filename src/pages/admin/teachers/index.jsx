import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import PageHeader from "components/ui/PageHeader";
import Card from "../dashboard/components/Card";
import Filters from "./components/Filters";
import TeacherSection from "./components/TeacherSection";
import TeacherProfile from "./components/TeacherProfile";
import InviteTeacherModal from "./components/InviteTeacherModal";
import ProfileRequestModal from "./components/ProfileRequestModal";
import Icon from "components/AppIcon";
import Loader from "components/ui/Loader";
import { successToast, errorToast } from "../../../utils/utils";

import {
  fetchTeachers,
  approveRejectSchoolTeacher,
} from "../../../reducers/superAdmin/superAdminThunks";
import {
  selectTeachers,
  selectTeachersSummary,
  selectReq,
} from "../../../reducers/superAdmin/superAdminSlice";
import InvitationTable from "../components/InvitationTable";
import {
  cancelInvitation,
  fetchInvitations,
} from "reducers/invitations/invitationsThunks";
import {
  selectInvitations,
  selectInvitationsLoading,
  selectInvitationsPagination,
} from "reducers/invitations/invitationsSlice";
import { State } from "country-state-city";

import SearchBar from "../../../components/ui/SearchBar";

const teachersPerPage = 10;
const invPageSize = 10;

const getFullLocationName = (location) => {
  if (!location) return "";
  const { country, state, city } = location;
  const stateName = state
    ? State.getStateByCodeAndCountry(state, country)?.name
    : "";
  const cityName = city || "";
  return [cityName, stateName].filter(Boolean).join(", ");
};

const ManageTeachers = () => {
  const dispatch = useDispatch();

  const teachers = useSelector(selectTeachers);
  const summary = useSelector(selectTeachersSummary);
  const fetchReq = useSelector(selectReq("fetchTeachers"));

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProfileRequestModal, setShowProfileRequestModal] = useState(false);
  const [activeTab, setActiveTab] = useState("teachers");

  const [filters, setFilters] = useState({
    status: "all",
    language: "",
    availability: "all",
    experience: "all",
  });

  // Tab-specific search
  const [teacherSearch, setTeacherSearch] = useState("");
  const [invSearch, setInvSearch] = useState("");

  // Invitations pagination
  const [invPage, setInvPage] = useState(1);

  // selectors must include search (slice key = role:status:search)
  const invitations = useSelector((s) =>
    selectInvitations(s, "teacher", invSearch, invPage, invPageSize),
  );
  const invLoading = useSelector((s) =>
    selectInvitationsLoading(s, "teacher", invSearch, invPage, invPageSize),
  );
  const invPagination = useSelector((s) =>
    selectInvitationsPagination(s, "teacher", invSearch, invPage, invPageSize),
  );

  const callInvitations = useCallback(() => {
    return dispatch(
      fetchInvitations({
        role: "teacher",
        search: invSearch,
        page: invPage,
        limit: invPageSize,
      }),
    );
  }, [dispatch, invSearch, invPage]);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  // Only fetch invitations when invitations tab active
  useEffect(() => {
    if (activeTab !== "invitations") return;
    callInvitations();
  }, [activeTab, callInvitations]);

  // When invitation search changes on invitations tab: reset page to 1
  useEffect(() => {
    (() => {
      if (activeTab !== "invitations") return;
      setInvPage(1);
    })();
  }, [invSearch, activeTab]);

  // Teachers search is client-side; reset page on teacher search change
  useEffect(() => {
    (() => {
      if (activeTab !== "teachers") return;
      setCurrentPage(1);
    })();
  }, [teacherSearch, activeTab]);

  // UX-only: when switching tabs, clear selection to avoid weird right-pane on small screens
  useEffect(() => {
    (() => {
      if (activeTab !== "teachers") setSelectedTeacher(null);
    })();
  }, [activeTab]);

  const onCancelInvite = useCallback(
    async (inv) => {
      try {
        await dispatch(
          cancelInvitation({
            invitationId: inv._id,
            role: "teacher",
            search: invSearch,
            page: invPage,
            limit: invPageSize,
          }),
        ).unwrap();

        // refetch current view for correct totals
        if (activeTab === "invitations") await callInvitations();
        successToast("Invitation cancelled");
      } catch (e) {
        errorToast(e || "Failed to cancel invitation");
      }
    },
    [dispatch, invSearch, invPage, callInvitations, activeTab],
  );

  const handleFilterChange = (field, value) => {
    setFilters((p) => ({ ...p, [field]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      language: "",
      availability: "all",
      experience: "all",
    });
    setCurrentPage(1);
  };

  const filteredTeachers = useMemo(() => {
    const q = String(teacherSearch || "")
      .trim()
      .toLowerCase();

    return (teachers || []).filter((teacher) => {
      const profile = teacher?.teacherProfile || {};

      const matchesStatus =
        filters.status === "all" || teacher?.status === filters.status;

      const matchesLanguage =
        !filters.language ||
        (profile?.teachingLanguages || []).some((lang) =>
          lang.toLowerCase().includes(filters.language.toLowerCase()),
        );

      const exp = Number(profile?.yearsOfExperience || 0);
      const matchesExperience =
        filters.experience === "all" ||
        (filters.experience === "0-2" && exp <= 2) ||
        (filters.experience === "3-5" && exp >= 3 && exp <= 5) ||
        (filters.experience === "5+" && exp > 5);

      const matchesMode =
        filters.availability === "all" ||
        profile?.teachingMode ===
          (filters.availability === "online" ? "ONLINE" : "IN_PERSON");

      const matchesSearch =
        !q ||
        String(teacher?.name || "")
          .toLowerCase()
          .includes(q) ||
        String(teacher?.email || "")
          .toLowerCase()
          .includes(q);

      return (
        matchesStatus &&
        matchesLanguage &&
        matchesExperience &&
        matchesMode &&
        matchesSearch
      );
    });
  }, [teachers, filters, teacherSearch]);

  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  const startIndex = (currentPage - 1) * teachersPerPage;
  const paginatedTeachers = filteredTeachers.slice(
    startIndex,
    startIndex + teachersPerPage,
  );

  const handleStatusChange = async (teacherId, action) => {
    try {
      const apiAction = action === "approve" ? "approve" : "reject";
      await dispatch(
        approveRejectSchoolTeacher({ teacherId, action: apiAction }),
      ).unwrap();
      successToast("Teacher status updated successfully!");
      dispatch(fetchTeachers());
    } catch (e) {
      errorToast(e?.message || e?.error || "Failed to update teacher status");
    }
  };

  const cardData = [
    {
      title: "Total Teachers",
      count: summary?.total ?? teachers?.length ?? 0,
      icon: "Users",
      bgColor: "bg-brand-blue",
    },
    {
      title: "Active",
      count: summary?.active ?? 0,
      icon: "CircleCheckBig",
      bgColor: "bg-success",
    },
    {
      title: "Pending",
      count: summary?.pending ?? 0,
      icon: "Clock4",
      bgColor: "bg-accent",
    },
    {
      title: "Languages",
      count: summary?.languages ?? 0,
      icon: "Languages",
      bgColor: "bg-[#059669]",
    },
  ];

  const invitationTotalCount = invPagination?.total ?? invitations?.length ?? 0;

  // Tab-aware search handler
  const handleSearch = useCallback(
    (term) => {
      if (activeTab === "teachers") {
        setTeacherSearch(term);
        setCurrentPage(1);
      } else {
        setInvSearch(term);
        setInvPage(1);
      }
    },
    [activeTab],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title="Manage Teachers"
          description="Manage your teaching staff and handle teacher invitations"
          isButton
          iconName="UserPlus"
          buttonTitle="Invite Teacher"
          onButtonClick={() => setShowInviteModal((v) => !v)}
        />

        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cardData?.map((card, idx) => (
              <Card key={idx} cardData={card} />
            ))}
          </div>
        </section>

        {activeTab === "teachers" && (
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            onChangeFilters={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Responsive: keep desktop width, allow full width on small */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="w-full lg:w-[59%]">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {fetchReq.status === "loading" ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="bg-card border border-border rounded-lg p-4 mb-6 flex gap-3 overflow-x-auto">
              {[
                {
                  id: "teachers",
                  label: "Teachers",
                  count: filteredTeachers?.length,
                },
                {
                  id: "invitations",
                  label: "Invitations",
                  count: invitationTotalCount,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`px-4 py-2 rounded ${
                    activeTab === t.id ? "bg-primary text-white" : "bg-muted"
                  }`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {activeTab === "teachers" && (
              <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
                {/* Teacher List */}
                <>
                  <TeacherSection
                    teacherData={paginatedTeachers}
                    selectedTeacher={selectedTeacher}
                    onSelect={setSelectedTeacher}
                    getFullLocationName={getFullLocationName}
                    onStatusChange={handleStatusChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredTeachers.length}
                    onPageChange={setCurrentPage}
                    pageSize={teachersPerPage}
                    onInviteTeacher={() => setShowInviteModal((v) => !v)}
                    onProfileRequest={() =>
                      setShowProfileRequestModal((v) => !v)
                    }
                  />

                  {/* Responsive: keep desktop height, allow natural height on small */}
                  <div className="bg-card border border-border rounded-lg h-auto xl:h-[800px]">
                    <TeacherProfile
                      getFullLocationName={getFullLocationName}
                      teacher={selectedTeacher}
                      onClose={() => setSelectedTeacher(null)}
                    />
                  </div>
                </>
              </section>
            )}

            {activeTab === "invitations" && (
              <section className="grid grid-cols-1 xl:grid-cols-1">
                <InvitationTable
                  title="Teacher invitations"
                  invitations={invitations}
                  pagination={invPagination}
                  loading={invLoading}
                  onCancel={onCancelInvite}
                  showRole={false}
                  onPageChange={setInvPage}
                />
              </section>
            )}
          </>
        )}
      </main>

      <InviteTeacherModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal((v) => !v)}
        onSuccess={() => {
          setShowSuccessModal(true);
          dispatch(fetchTeachers());
        }}
      />

      <ProfileRequestModal
        isOpen={showProfileRequestModal}
        onClose={() => setShowProfileRequestModal((v) => !v)}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-card rounded-lg max-w-md text-center shadow-elevation-3 p-4">
            <div className="flex justify-end">
              <Icon
                name="X"
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

export default ManageTeachers;

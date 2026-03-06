import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/ui/Button";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import PageHeader from "../../../components/ui/PageHeader";
import StudentSection from "./components/StudentSection";
import StudentProfile from "./components/StudentProfile";
import Icon from "../../../components/AppIcon";
import ProfileRequestModal from "./components/ProfileRequestModal";
import InviteStudentModal from "./components/InviteStudentModal";
import SearchBar from "../../../components/ui/SearchBar";
import Loader from "../../../components/ui/Loader";
import { successToast, errorToast } from "../../../utils/utils";

import {
  fetchStudents,
  fetchSchools,
} from "reducers/superAdmin/superAdminThunks";
import {
  selectStudents,
  selectStudentsPagination,
  selectSchools,
  selectSchoolsReq,
  selectReq,
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

const studentsPerPage = 10;
const invPageSize = 10;

const ManageStudents = () => {
  const dispatch = useDispatch();

  const rawStudents = useSelector(selectStudents);
  const pagination = useSelector(selectStudentsPagination);
  const fetchReq = useSelector(selectReq("fetchStudents"));
  const loading = fetchReq.status === "loading";

  // schools
  const schools = useSelector(selectSchools);
  const schoolsReq = useSelector(selectSchoolsReq);
  const schoolsLoading = schoolsReq?.status === "loading";

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProfileRequestModal, setShowProfileRequestModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [activeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("students");

  // separate search per tab
  const [studentSearch, setStudentSearch] = useState("");
  const [invSearch, setInvSearch] = useState("");
  const [invPage, setInvPage] = useState(1);

  const [filters, setFilters] = useState({
    school: "all",
    language: "",
    ageRange: "",
    status: "all",
  });

  const invitations = useSelector((s) =>
    selectInvitations(s, "student", invSearch, invPage, invPageSize),
  );
  const invLoading = useSelector((s) =>
    selectInvitationsLoading(s, "student", invSearch, invPage, invPageSize),
  );
  const invPagination = useSelector((s) =>
    selectInvitationsPagination(s, "student", invSearch, invPage, invPageSize),
  );

  // Fetch schools list for school filter (super_admin)
  useEffect(() => {
    dispatch(fetchSchools({ page: 1, limit: 200, search: "" }));
  }, [dispatch]);

  const callStudents = useCallback(() => {
    dispatch(
      fetchStudents({
        page: currentPage,
        limit: studentsPerPage,
        search: studentSearch || undefined,

        status: filters.status !== "all" ? filters.status : undefined,
        language: filters.language || undefined,
        ageRange: filters.ageRange || undefined,
        school: filters.school !== "all" ? filters.school : undefined,
      }),
    );
  }, [dispatch, currentPage, studentSearch, filters]);

  const callInvitations = useCallback(() => {
    return dispatch(
      fetchInvitations({
        role: "student",
        search: invSearch,
        page: invPage,
        limit: invPageSize,
      }),
    );
  }, [dispatch, invSearch, invPage]);

  useEffect(() => {
    callStudents();
  }, [callStudents]);

  useEffect(() => {
    if (activeTab !== "invitations") return;
    callInvitations();
  }, [activeTab, callInvitations]);

  useEffect(() => {
    (() => {
      if (activeTab !== "students") return;
      setCurrentPage(1);
    })();
  }, [studentSearch, activeTab]);

  useEffect(() => {
    (() => {
      if (activeTab !== "invitations") return;
      setInvPage(1);
    })();
  }, [invSearch, activeTab]);

  useEffect(() => {
    (() => {
      if (activeTab !== "students") setSelectedStudent(null);
    })();
  }, [activeTab]);

  const schoolOptions = useMemo(() => {
    const base = [{ value: "all", label: "All Schools" }];
    const items = (schools || []).map((s) => ({
      value: s._id,
      label: s.profile?.schoolName || s.name || "School",
    }));
    return [...base, ...items];
  }, [schools]);

  const students = useMemo(() => {
    return (rawStudents || []).map((student) => ({
      id: student._id,
      _id: student._id,
      name: student.name,
      email: student.email,
      phone: student.profile?.phone || "",
      address: student.profile?.address || "",
      avatar: student.profileImage?.url || "",
      status: student.status,
      languages: student.profile?.languages || [],
      age: student.profile?.age || "",
      gender: student.profile?.gender || "",
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      isSchoolStudent: true,
      location: student.profile?.location || "",
    }));
  }, [rawStudents]);

  const filteredStudents = useMemo(() => {
    if (activeFilter === "all") return students;
    return students.filter((s) => s.isSchoolStudent);
  }, [students, activeFilter]);

  const handleSearch = useCallback(
    (term) => {
      if (activeTab === "students") {
        setStudentSearch(term);
        setCurrentPage(1);
      } else {
        setInvSearch(term);
        setInvPage(1);
      }
    },
    [activeTab],
  );

  const handleStudentSelect = useCallback((student) => {
    setSelectedStudent(student);
  }, []);

  const handleStatusChange = useCallback(
    (studentId, action) => {
      let newStatus;
      switch (action) {
        case "approve":
          newStatus = "active";
          break;
        case "reject":
          newStatus = "inactive";
          break;
        default:
          return;
      }

      if (
        selectedStudent?.id === studentId ||
        selectedStudent?._id === studentId
      ) {
        setSelectedStudent((prev) =>
          prev ? { ...prev, status: newStatus } : prev,
        );
      }

      successToast("Student status updated successfully!");
    },
    [selectedStudent],
  );

  const handleInviteModalOpen = useCallback(() => {
    setShowInviteModal((v) => !v);
  }, []);

  const handleSuccessModal = useCallback(() => {
    setShowSuccessModal((v) => !v);
    if (activeTab === "students") callStudents();
    else callInvitations();
  }, [activeTab, callStudents, callInvitations]);

  const handleProfileRequestModal = useCallback(() => {
    setShowProfileRequestModal((v) => !v);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const onCancelInvite = useCallback(
    async (inv) => {
      try {
        await dispatch(
          cancelInvitation({
            invitationId: inv._id,
            role: "student",
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
    [dispatch, invSearch, invPage, callInvitations, activeTab],
  );

  const handleFilterClick = () => setShowFilter((v) => !v);

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ school: "all", language: "", ageRange: "", status: "all" });
    setCurrentPage(1);
  };

  const invitationTotalCount = invPagination?.total ?? invitations?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title="Manage Students"
          description="Manage your students and handle student invitations"
          isButton
          iconName="UserPlus"
          buttonTitle="Invite Student"
          onButtonClick={handleInviteModalOpen}
          studentCount={pagination?.total || 0}
        />

        <div className="mb-10">
          {/* Search + Filter in one full-width row */}
          <section className="w-full">
            <div className="w-full flex items-center gap-3">
              {/* If SearchBar doesn't accept className, wrapper still forces full width */}
              <div className="w-full">
                <SearchBar onSearch={handleSearch} />
              </div>

              <Button
                variant="ghost"
                iconName="Funnel"
                iconSize={22}
                className="text-primary shrink-0"
                onClick={handleFilterClick}
                aria-label="Open filters"
              />
            </div>

            {/* Full-width Filters */}
            {showFilter && (
              <div className="w-full mt-4">
                <Filters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  schoolOptions={schoolOptions}
                  schoolsLoading={schoolsLoading}
                />
              </div>
            )}
          </section>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="bg-card border border-border rounded-lg p-4 mb-6 flex gap-3 overflow-x-auto">
              {[
                { id: "students", label: "Students", count: pagination?.total },
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

            {activeTab === "students" && (
              <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
                <StudentSection
                  studentData={filteredStudents}
                  selectedStudent={selectedStudent}
                  onSelect={handleStudentSelect}
                  onStatusChange={handleStatusChange}
                  currentPage={pagination?.page || currentPage}
                  totalPages={pagination?.pages || 1}
                  totalItems={pagination?.total || 0}
                  onPageChange={handlePageChange}
                  pageSize={studentsPerPage}
                  onInviteStudent={handleInviteModalOpen}
                  onProfileRequest={handleProfileRequestModal}
                />

                <div className="bg-card border border-border rounded-lg h-auto xl:h-[600px]">
                  <StudentProfile
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                  />
                </div>
              </section>
            )}

            {activeTab === "invitations" && (
              <section className="grid grid-cols-1">
                <InvitationTable
                  title="Student invitations"
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

      <InviteStudentModal
        isOpen={showInviteModal}
        onClose={handleInviteModalOpen}
        onSuccess={() => {
          setShowSuccessModal(true);
          if (activeTab === "students") callStudents();
          else callInvitations();
        }}
      />

      <ProfileRequestModal
        isOpen={showProfileRequestModal}
        onClose={handleProfileRequestModal}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-card rounded-lg max-w-md text-center shadow-elevation-3 p-4">
            <div className="flex justify-end">
              <Icon
                name={"X"}
                size={30}
                className="text-brand-gray-800 hover:cursor-pointer"
                onClick={handleSuccessModal}
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

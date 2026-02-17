import { useEffect, useState } from "react";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import LessonFilters from "./components/LessonFilters";
import LessonTable from "./components/LessonTable";
import LessonPagination from "./components/LessonPagination";
import Icon from "components/AppIcon";
import GroupedStudents from "./components/GroupedStudents";
import { getManageLessons } from "../../../services/lessons/lesson.service";
import PageLoaderOverlay from "components/ui/PageLoaderOverlay";

const ManageLessons = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    status: "all",
    studentName: "",
    dateRange: { start: "", end: "" },
  });
  const [showModal, setShowModal] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const transformLessonData = (apiLesson) => {
    return {
      id: apiLesson?._id,
      date: apiLesson?.dateTime?.date,
      time: apiLesson?.dateTime?.time,
      studentName: apiLesson?.student?.name,
      studentAge: apiLesson?.student?.age,
      subject: apiLesson?.subject?.name,
      duration: apiLesson?.duration,
      status: apiLesson?.status.toLowerCase(),
      type: apiLesson?.subject?.mode,
      courseType: apiLesson?.courseType,
      students: apiLesson?.student || [],
    };
  };

  const fetchLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (filters.status !== "all") {
        params.status = filters.status.toUpperCase();
      }
      if (filters.studentName) {
        params.studentName = filters.studentName;
      }
      if (filters.dateRange.start) {
        params.startDate = filters.dateRange.start;
      }
      if (filters.dateRange.end) {
        params.endDate = filters.dateRange.end;
      }

      if (sortConfig.key === "date") {
        params.sortBy = "dateTime";
      } else {
        params.sortBy = sortConfig.key;
      }
      params.sortOrder = sortConfig.direction;

      const response = await getManageLessons(params);
      if (response.success) {
        const transformedLessons =
          response.data.lessons.map(transformLessonData);
        setLessons(transformedLessons);
        setPagination(response.data.pagination);
        setPendingCount(response.data.pendingCount || 0);
      }
    } catch (err) {
      setError(err.message || "Failed to load lessons");
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lessons on mount and when dependencies change
  useEffect(() => {
    fetchLessons();
  }, [currentPage, sortConfig, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig?.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowModal = (id) => {
    const foundLesson = lessons?.find((s) => s?.id === id);
    setLesson(foundLesson);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLesson(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page loader */}
      <PageLoaderOverlay show={loading} label="Loading lessons…" />
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Manage Lessons
              </h1>
              <p className="text-muted-foreground">
                Manage your teaching lessons and student bookings
              </p>
            </div>

            {/* Pending Sessions Alert */}
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning border border-warning/20 rounded-lg mt-4 sm:mt-0">
                <Icon name="Clock" size={16} />
                <span className="text-sm font-medium">
                  {pendingCount} lesson
                  {pendingCount > 1 ? "s" : ""} pending
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Filters */}
        <LessonFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        <>
          {/* Lessons Table */}
          <LessonTable
            sessions={lessons}
            onSort={handleSort}
            sortConfig={sortConfig}
            onShowModal={handleShowModal}
          />

          {/* Pagination */}
          <LessonPagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      </main>

      {showModal && (
        <GroupedStudents
          students={lesson?.students}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageLessons;

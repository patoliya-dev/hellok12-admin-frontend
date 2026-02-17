import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Breadcrumb from "components/ui/Breadcrumb";
import Button from "components/ui/Button";
import CourseDetails from "./components/CourseDetails";
import Icon from "components/AppIcon";
import DateRangePicker from "components/ui/DateRangePicker";
import LessonsTable from "./components/LessonTable";
import { fetchCourseWithLessons as fetchCourseWithLessonsThunk } from "../../../reducers/courses/courseThunks";
import {
  duplicateLesson as duplicateLessonThunk,
  // removeLesson as removeLessonThunk,
} from "../../../reducers/lessons/lessonThunks";
import PageLoaderOverlay from "components/ui/PageLoaderOverlay";
import { selectPageLoading } from "../../../reducers/ui/pageLoaderSlice";
import {
  resetCourseDetail,
  updateLocalLessons,
} from "reducers/courses/courseSlice";
import { errorToast, successToast } from "../../../utils/utils";
import { selectAuthUser } from "reducers/auth/authSelectors";

const LessonsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);
  const role = authUser.role;
  const { courseId } = useParams();

  // Redux state (centralized, used instead of local lessons list)
  const {
    course = {},
    items: lessons = [],
    pagination,
    // loading,
  } = useSelector((s) => s.courseDetail);
  const pageLoading = useSelector(selectPageLoading);

  // local UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "desc",
  });
  const [breadCrumbData, setBreadCrumbData] = useState([
    {
      label: "Manage Courses",
      path: `/${role === "super_admin" ? "admin" : role}/courses`,
    },
    { label: "Lessons List", path: "#", current: true },
  ]);

  // Combine all params into one dependency object for API fetch
  const itemsPerPage = 10;
  const fetchLessons = useCallback(
    async (page = pagination?.page || 1, opts = {}) => {
      const params = {
        page,
        limit: pagination?.limit || itemsPerPage,
        search: searchTerm || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        sortKey: sortConfig.key,
        sortDirection: sortConfig.direction,
        ...opts,
      };

      await dispatch(
        fetchCourseWithLessonsThunk({ id: courseId, params }),
      ).unwrap();
    },
    [dispatch, courseId, filters, searchTerm, sortConfig, pagination],
  );

  // Initial load
  useEffect(() => {
    fetchLessons(1);
    return () => {
      dispatch(resetCourseDetail());
    };
  }, [courseId]);

  // Update breadcrumb when course changes
  useEffect(() => {
    if (course?.title) {
      setBreadCrumbData([
        {
          label: "View Courses",
          path: `/${role === "super_admin" ? "admin" : role}/courses`,
        },
        { label: course.title, path: "#", current: true },
      ]);
    }
  }, [course]);

  // Filters / search: refetch on change
  useEffect(() => {
    fetchLessons(1);
  }, [filters, searchTerm, sortConfig]);

  const handleFiltersChange = (newFilters) => setFilters(newFilters);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page) => {
    fetchLessons(page);
  };

  const handleDeleteLesson = (lessonId) => {
    // update Redux state without API refetch
    const updated = lessons.filter((l) => l._id !== lessonId);
    dispatch({
      type: "courseDetail/updateLocalLessons",
      payload: updated,
    });
  };

  const handleDuplicateLesson = async (lesson) => {
    try {
      const duplicated = await dispatch(
        duplicateLessonThunk(lesson._id),
      ).unwrap();
      // prepend into courseDetail.items for instant UI update
      dispatch(updateLocalLessons([duplicated, ...lessons]));
      successToast("Lesson duplicated successfully!");
    } catch (e) {
      errorToast(e?.error || "Failed to duplicate lesson");
    }
  };

  // const handleCreateLesson = () =>
  //   navigate(`/${role === "super_admin" ? "admin" : role}/create-lesson/${courseId}`);
  const handleEditLesson = () =>
    navigate(
      `/${role === "super_admin" ? "admin" : role}/view-lesson/${courseId}`,
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Page loader */}
      <PageLoaderOverlay show={pageLoading} label="Loading courses…" />
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        {/* Breadcrumb & CTA */}
        <section className="my-8 flex flex-col gap-y-6 md:gap-y-0 md:flex-row md:justify-between md:items-center">
          <Breadcrumb customPath={breadCrumbData} />
          {/* <Button size="sm" iconName="Plus" onClick={handleCreateLesson}>
            Create New Lesson
          </Button> */}
        </section>

        {/* Course summary */}
        <CourseDetails
          role={role}
          course={course}
          lessonCount={lessons?.length}
        />

        {/* Search + Filters */}
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="relative md:w-[65%] lg:w-[70%] xl:w-[80%]">
              <Icon
                name="Search"
                size={16}
                color="var(--color-muted-foreground)"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search lessons by name, description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full"
              />
            </div>
            <DateRangePicker onChange={handleFiltersChange} />
          </div>
        </section>

        {/* Table */}
        <LessonsTable
          onSort={handleSort}
          sortConfig={sortConfig}
          currentPage={pagination?.page}
          totalPages={pagination?.pages}
          totalItems={pagination?.total}
          onPageChange={handlePageChange}
          onEdit={handleEditLesson}
          onDuplicate={handleDuplicateLesson}
          onDelete={handleDeleteLesson}
        />
      </main>
    </div>
  );
};

export default LessonsList;

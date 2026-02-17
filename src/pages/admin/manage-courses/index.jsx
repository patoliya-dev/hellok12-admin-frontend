import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "components/ui/Button";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Icon from "components/AppIcon";
import CourseFilter from "./components/CourseFilter";
import CourseTable from "./components/CourseTable";

import {
  fetchCourses,
  removeCourse,
  duplicateCourse,
} from "../../../reducers/courses/courseThunks";

import PageLoaderOverlay from "components/ui/PageLoaderOverlay";
import { selectPageLoading } from "../../../reducers/ui/pageLoaderSlice";
import { selectAuthUser } from "reducers/auth/authSelectors";

const ITEMS_PER_PAGE = 10;

const parsePriceRange = (priceRange) => {
  if (!priceRange || typeof priceRange !== "string")
    return [undefined, undefined];
  if (!priceRange.includes("-")) return [undefined, undefined];

  const [minStr, maxStr] = priceRange.split("-").map((v) => v.trim());
  const min = Number(minStr);
  const max = Number(maxStr);

  return [
    Number.isFinite(min) ? min : undefined,
    Number.isFinite(max) ? max : undefined,
  ];
};

const parseTrial = (v) => {
  if (v === "yes") return true;
  if (v === "no") return false;
  return undefined;
};

const ManageCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pageLoading = useSelector(selectPageLoading);
  const authUser = useSelector(selectAuthUser);

  const {
    items: courses,
    pagination,
    loading,
    error,
  } = useSelector((state) => state.courseList);

  // ---------------------------
  // Local UI state
  // ---------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    language: "",
    status: "",
    priceRange: "",
    isTrialAvailable: "",
    dateRange: { start: "", end: "" },
  });

  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "Asc",
  });

  const [currentPage, setCurrentPage] = useState(1);

  // ---------------------------
  // Derived: role + role-safe routes
  // ---------------------------
  const role = authUser?.role;

  const courseRoutes = useMemo(() => {
    return {
      manage: `/${role === "super_admin" ? "admin" : role}/manage-courses`,
      create: `/${role === "super_admin" ? "admin" : role}/create-course`,
      edit: (id) =>
        `/${role === "super_admin" ? "admin" : role}/view-course/${id}`,
    };
  }, [role]);

  // ---------------------------
  // Derived: counts (no extra state needed)
  // ---------------------------
  const courseCount = useMemo(() => {
    const list = Array.isArray(courses) ? courses : [];
    const total = list.length;
    const active = list.reduce((acc, c) => {
      const s = c?.status;
      return String(s || "").toLowerCase() === "active" ? acc + 1 : acc;
    }, 0);

    return [
      { label: "Total Courses", count: total },
      { label: "Active Courses", count: active },
    ];
  }, [courses]);

  // ---------------------------
  // Derived: backend query params
  // ---------------------------
  const queryParams = useMemo(() => {
    const isTrialAvailable = parseTrial(filters.isTrialAvailable);
    const [priceMin, priceMax] = parsePriceRange(filters.priceRange);

    const sortBy =
      sortConfig?.key && sortConfig?.direction
        ? `${sortConfig.key}${sortConfig.direction}`
        : "newest";

    return {
      search: searchTerm || undefined,
      language: filters.language || undefined,
      status: filters.status || undefined,
      isTrialAvailable,
      priceMin,
      priceMax,
      dateFrom: filters.dateRange?.start || undefined,
      dateTo: filters.dateRange?.end || undefined,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sortBy,
    };
  }, [searchTerm, filters, sortConfig, currentPage]);

  // Fetch courses
  useEffect(() => {
    dispatch(fetchCourses(queryParams));
  }, [dispatch, queryParams]);

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleFilterClick = useCallback(() => {
    setShowFilter((v) => !v);
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "Asc" ? "Desc" : "Asc",
    }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleEditCourse = useCallback(
    (course) => {
      const id = course?._id;
      if (!id) return;
      navigate(courseRoutes.edit(id));
    },
    [navigate, courseRoutes],
  );

  const handleDuplicateCourse = useCallback(
    async (course) => {
      const id = course?._id;
      if (!id) return;

      await dispatch(duplicateCourse(id));
      // Re-fetch same page with same filters/sort/search
      dispatch(fetchCourses(queryParams));
    },
    [dispatch, queryParams],
  );

  const handleDeleteCourse = useCallback(
    async (courseId) => {
      if (!courseId) return;

      await dispatch(removeCourse(courseId));
      dispatch(fetchCourses(queryParams));
    },
    [dispatch, queryParams],
  );

  // const handleCreateCourseClick = useCallback(() => {
  //   navigate(courseRoutes.create);
  // }, [navigate, courseRoutes]);

  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Page loader */}
      <PageLoaderOverlay show={pageLoading} label="Loading courses…" />
      {/* Header */}
      <RoleBasedHeader />

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        {/* Top Section */}
        <section className="my-8 flex flex-col gap-y-6 lg:gap-y-0 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Courses & Lessons
            </h1>
            <p className="text-muted-foreground">View Courses and Lessons.</p>
          </div>

          <div className="flex items-center gap-x-12 flex-wrap lg:flex-nowrap gap-y-4">
            {courseCount.map((item, index) => (
              <div
                key={item.label}
                className={
                  index !== courseCount.length - 1
                    ? "pr-6 xl:pr-16 border-r border-[#CECECE]"
                    : ""
                }
              >
                <h3 className="text-2xl font-bold text-brand-gray-800">
                  {item.count}
                </h3>
                <span className="text-sm text-brand-gray-500">
                  {item.label}
                </span>
              </div>
            ))}

            {/* <Button size="sm" iconName="Plus" onClick={handleCreateCourseClick}>
              Create New Course
            </Button> */}
          </div>
        </section>

        {/* Search */}
        <section className="my-8">
          <div className="flex flex-row gap-3">
            <div className="relative w-full">
              <Icon
                name="Search"
                size={16}
                color="var(--color-muted-foreground)"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search courses by name, description, or teacher..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full"
              />
            </div>

            <Button
              variant="ghost"
              iconName="Funnel"
              iconSize={22}
              className="text-primary"
              onClick={handleFilterClick}
            />
          </div>
        </section>

        {/* Filters */}
        {showFilter && (
          <CourseFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        )}

        {/* Table */}
        <CourseTable
          onSort={handleSort}
          role={role}
          sortConfig={sortConfig}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onEdit={handleEditCourse}
          onDuplicate={handleDuplicateCourse}
          onDelete={handleDeleteCourse}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
};

export default ManageCourses;

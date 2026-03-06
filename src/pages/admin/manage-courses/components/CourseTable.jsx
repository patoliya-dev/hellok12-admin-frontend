import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Icon from "components/AppIcon";
import Pagination from "components/ui/Pagination";
import ActionMenu from "./ActionMenu";
import SmartMenuPortal from "components/ui/SmartMenuPortal";
import DeleteModal from "components/ui/DeleteModal";

import { getLanguageName, successToast } from "../../../../utils/utils";
import { updateLocalCourse } from "reducers/courses/courseSlice";
import { updateCourse as updateCourseThunk } from "reducers/courses/courseThunks";

const STATUS_CONFIG = {
  active: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-500",
    label: "Active",
  },
  draft: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-500",
    label: "Draft",
  },
  archived: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-500",
    label: "Archived",
  },
  full: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-500",
    label: "Full",
  },
};

const normalizeStatus = (status) => String(status || "").toLowerCase();

const CourseTable = ({
  onSort,
  sortConfig,
  currentPage,
  role,
  totalPages,
  totalItems,
  onPageChange,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector((s) => s.courseList.items || []);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null); // DOMRect
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // HTMLElement
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState(null);

  // -------------------------
  // Helpers
  // -------------------------
  const closeMenu = useCallback(() => {
    setOpenMenuId(null);
    setMenuAnchor(null);
    setMenuAnchorEl(null);
  }, []);

  const getSortIcon = useCallback(
    (column) => {
      if (sortConfig?.key !== column) {
        return (
          <Icon
            name="ArrowUpDown"
            size={14}
            className="text-muted-foreground"
          />
        );
      }

      return sortConfig?.direction === "Asc" ? (
        <Icon name="ArrowUp" size={14} className="text-primary" />
      ) : (
        <Icon name="ArrowDown" size={14} className="text-primary" />
      );
    },
    [sortConfig],
  );

  const renderStatusBadge = useCallback((status) => {
    const key = normalizeStatus(status);
    const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.draft;

    return (
      <span
        className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium border ${cfg.border} ${cfg.bg} ${cfg.text}`}
      >
        {cfg.label}
      </span>
    );
  }, []);

  const handleNavigate = useCallback(
    (id) => {
      if (!id) return;
      navigate(`/${role === "super_admin" ? "admin" : role}/lessons/${id}`);
      closeMenu();
    },
    [navigate, role, closeMenu],
  );

  const toggleMenu = useCallback(
    (courseId, e) => {
      if (!courseId) return;

      // Clicking the same row action closes it
      if (openMenuId === courseId) {
        closeMenu();
        return;
      }

      const el = e?.currentTarget || null;
      const rect = el?.getBoundingClientRect?.() || null;

      setMenuAnchor(rect);
      setMenuAnchorEl(el);
      setOpenMenuId(courseId);
    },
    [openMenuId, closeMenu],
  );

  const handleActiveCourse = useCallback(
    async (course) => {
      const id = course?._id;
      if (!id) return;

      const currentStatus = normalizeStatus(course?.status);
      const nextStatus = currentStatus === "active" ? "draft" : "active";

      await dispatch(
        updateCourseThunk({
          id,
          patch: { status: nextStatus },
        }),
      ).unwrap();

      // Keep your existing optimistic list update behavior
      const next = (Array.isArray(data) ? data : []).map((x) =>
        x?._id === id ? { ...x, status: nextStatus } : x,
      );
      dispatch(updateLocalCourse(next));

      successToast(
        `Course ${
          currentStatus === "active" ? "moved to draft" : "activated"
        } successfully!`,
      );
    },
    [dispatch, data],
  );

  const requestDelete = useCallback(
    (courseId) => {
      if (!courseId) return;
      setDeleteCourseId(courseId);
      closeMenu();
      setShowDeleteModal(true);
    },
    [closeMenu],
  );

  const confirmDelete = useCallback(() => {
    if (!deleteCourseId) return;

    onDelete?.(deleteCourseId);
    setDeleteCourseId(null);
    setShowDeleteModal(false);
    successToast("Course deleted successfully!");
  }, [deleteCourseId, onDelete]);

  const cancelDelete = useCallback(() => {
    setDeleteCourseId(null);
    setShowDeleteModal(false);
  }, []);

  // Keep table rendering stable
  const hasData = Array.isArray(data) && data.length > 0;

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  return (
    <section className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort?.("title")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Course Title
                  {getSortIcon("title")}
                </button>
              </th>

              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort?.("languageCode")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Language
                  {getSortIcon("languageCode")}
                </button>
              </th>

              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">
                  Students
                </span>
              </th>

              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort?.("price")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Price
                  {getSortIcon("price")}
                </button>
              </th>

              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort?.("status")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Status
                  {getSortIcon("status")}
                </button>
              </th>

              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((course) => (
              <tr
                key={course?._id}
                className="border-t border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Icon
                      name="BookOpen"
                      size={20}
                      className="text-primary flex-shrink-0"
                    />
                    <div>
                      <div
                        className="font-medium text-foreground hover:cursor-pointer line-clamp-1 hover:text-primary transition-smooth w-[300px]"
                        onClick={() => handleNavigate(course?._id)}
                      >
                        {course?.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {/* {course?.lessonCount} lessons */}
                        {course?.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">
                    {getLanguageName(course?.languageCode)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">
                    {`${course?.enrolledCount}/${course?.studentCapacity}`}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">
                    ${course?.price}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {renderStatusBadge(course?.status)}
                </td>

                <td className="relative px-6 py-4">
                  <Icon
                    name="MoreVertical"
                    size={20}
                    className="text-muted-foreground cursor-pointer"
                    onClick={(e) => toggleMenu(course?._id, e)}
                  />

                  {openMenuId === course?._id && menuAnchor && (
                    <SmartMenuPortal
                      anchorRect={menuAnchor}
                      anchorEl={menuAnchorEl}
                      onClose={closeMenu}
                    >
                      <ActionMenu
                        data={course}
                        setOpenMenuId={closeMenu}
                        onEdit={onEdit}
                        onDuplicate={onDuplicate}
                        onDelete={() => requestDelete(course?._id)}
                        onActive={(lesson) => handleActiveCourse(lesson)}
                      />
                    </SmartMenuPortal>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hasData && (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Icon
            name="Calendar"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No courses found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={onPageChange}
        listType="courses"
      />

      {showDeleteModal && (
        <DeleteModal
          type="course"
          onConfirm={confirmDelete}
          onClose={cancelDelete}
        />
      )}
    </section>
  );
};

export default CourseTable;

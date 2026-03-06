import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Icon from "components/AppIcon";
import Pagination from "components/ui/Pagination";
import ActionMenu from "../../manage-courses/components/ActionMenu";
import { capitalize, errorToast, successToast } from "../../../../utils/utils";
import DeleteModal from "components/ui/DeleteModal";
import {
  updateLesson as updateLessonThunk,
  removeLesson as removeLessonThunk,
} from "reducers/lessons/lessonThunks";
import { updateLocalLessons } from "reducers/courses/courseSlice";
import SmartMenuPortal from "components/ui/SmartMenuPortal";

const LessonsTable = ({
  onSort,
  sortConfig,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onEdit,
  onDuplicate,
  // onDelete,
}) => {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.courseDetail.items || []);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLessonId, setDeleteLessonId] = useState(null);

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return (
        <Icon
          name="ArrowUpDown"
          size={14}
          className="text-muted-foreground flex-shrink-0"
        />
      );
    }
    return sortConfig?.direction === "asc" ? (
      <Icon name="ArrowUp" size={14} className="text-primary flex-shrink-0" />
    ) : (
      <Icon name="ArrowDown" size={14} className="text-primary flex-shrink-0" />
    );
  };

  const formatDateTime = (dateString) => {
    const dateObj = new Date(dateString);
    return {
      date: dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      time: dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getStatus = (status) => {
    const isActive = status === "active";
    return (
      <div className="flex items-center gap-2">
        {isActive ? (
          <Icon name="CheckCircle" size={16} className="text-green-600" />
        ) : (
          <Icon name="Clock" size={16} className="text-warning" />
        )}
        <span
          className={`text-xs font-medium ${
            isActive ? "text-green-600" : "text-warning"
          }`}
        >
          {capitalize(status)}
        </span>
      </div>
    );
  };

  const toggleMenu = (lessonId, e) => {
    if (openMenuId === lessonId) {
      setOpenMenuId(null);
      setMenuAnchor(null);
      setMenuAnchorEl(null);
      return;
    }
    const el = e?.currentTarget || null;
    const rect = el?.getBoundingClientRect?.();
    if (rect) setMenuAnchor(rect);
    setMenuAnchorEl(el);
    setOpenMenuId(lessonId);
  };

  const isTrialAvailable = () => (
    <div className="space-y-1 w-[150px]">
      <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#DDF2FF] text-[#009DFF]">
        <Icon name={"Gift"} size={16} className="mr-1" />
        Trial Lesson
      </span>
    </div>
  );

  const handleActiveLesson = async (lesson) => {
    await dispatch(
      updateLessonThunk({
        lessonId: lesson?._id,
        patch: { status: lesson?.status === "active" ? "draft" : "active" },
      }),
    ).unwrap();
    const next = data.map((x) =>
      x._id === lesson._id
        ? { ...x, status: lesson.status === "active" ? "draft" : "active" }
        : x,
    );
    dispatch(updateLocalLessons(next));
    successToast(
      `Lesson ${
        lesson?.status === "active" ? "moved to draft" : "activated"
      } successfully!`,
    );
  };

  return (
    <section className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Scrollable table for md+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("title")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Lesson Title
                  {getSortIcon("title")}
                </button>
              </th>
              <th className="px-6 py-4 text-left"></th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("createdAt")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Date & Time
                  {getSortIcon("createdAt")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("status")}
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
            {data?.map((lesson, index) => (
              <tr
                key={lesson?._id + index}
                className="border-t border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Icon
                      name="BookOpen"
                      size={20}
                      className="text-primary flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-brand-gray-800 w-[250px] line-clamp-1">
                        {lesson?.title}
                      </div>
                      <p className="text-sm lg:text-[16px] text-brand-gray-500 md:max-w-md lg:max-w-xl xl:max-w-4xl line-clamp-3">
                        {lesson?.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {lesson?.isTrialAvailable && isTrialAvailable()}
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const { date } = formatDateTime(lesson?.schedule?.date);
                    return (
                      <div className="md:w-[150px] xl:w-auto">
                        <div className="font-medium text-foreground">
                          {date}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {lesson?.schedule?.time}
                        </div>
                      </div>
                    );
                  })()}
                </td>
                <td className="px-6 py-4">{getStatus(lesson?.status)}</td>
                <td className="px-6 py-4">
                  <Icon
                    name="MoreVertical"
                    size={20}
                    className="text-muted-foreground cursor-pointer"
                    onClick={(e) => toggleMenu(lesson?._id, e)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {openMenuId && menuAnchor && (
          <SmartMenuPortal
            anchorRect={menuAnchor}
            anchorEl={menuAnchorEl}
            onClose={() => {
              setOpenMenuId(null);
              setMenuAnchor(null);
              setMenuAnchorEl(null);
            }}
          >
            <ActionMenu
              data={data.find((d) => d._id === openMenuId)}
              setOpenMenuId={() => {
                setOpenMenuId(null);
                setMenuAnchor(null);
              }}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={() => {
                setDeleteLessonId(openMenuId);
                setOpenMenuId(null);
                setMenuAnchor(null);
                handleDeleteModal();
              }}
              onActive={(lesson) => handleActiveLesson(lesson)}
            />
          </SmartMenuPortal>
        )}
      </div>

      {/* Mobile-friendly card layout */}
      <div className="md:hidden divide-y divide-border">
        {data?.map((lesson) => {
          const { date, time } = formatDateTime(lesson?.createdAt);
          return (
            <div key={lesson?._id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Icon
                    name="BookOpen"
                    size={20}
                    className="text-primary flex-shrink-0"
                  />
                  <div>
                    <div className="font-medium text-brand-gray-800 line-clamp-1">
                      {lesson?.title}
                    </div>
                    <p className="text-sm lg:text-[16px] text-brand-gray-500 md:max-w-md lg:max-w-xl xl:max-w-4xl line-clamp-3">
                      {lesson?.description}
                    </p>
                  </div>
                </div>

                <Icon
                  name="MoreVertical"
                  size={18}
                  className="text-muted-foreground cursor-pointer flex-shrink-0"
                  onClick={(e) => toggleMenu(lesson?._id, e)}
                />
              </div>

              <div className="mt-3 flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  <span className="block font-medium text-foreground mb-2">
                    {date}
                  </span>
                  <span>{time}</span>
                </div>
                <div>{getStatus(lesson?.status)}</div>
              </div>

              {lesson?.isTrialAvailable && (
                <div className="mt-4">{isTrialAvailable()}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <Icon
            name="Calendar"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No lessons found
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
        listType="lessons"
      />

      {showDeleteModal && (
        <DeleteModal
          type="lesson"
          onConfirm={async () => {
            try {
              const res = await dispatch(
                removeLessonThunk(deleteLessonId),
              ).unwrap();
              const removedId = res?.lessonId || res?.removed?._id;
              const next = data.filter((x) => x._id !== removedId);
              dispatch(updateLocalLessons(next));
              successToast("Lesson deleted successfully!");
            } catch (e) {
              errorToast(e?.message || "Failed to delete lesson");
            } finally {
              setDeleteLessonId(null);
              handleDeleteModal();
            }
          }}
          onClose={() => {
            setDeleteLessonId(null);
            handleDeleteModal();
          }}
        />
      )}
    </section>
  );
};

export default LessonsTable;

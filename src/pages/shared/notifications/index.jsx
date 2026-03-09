import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Icon from "components/AppIcon";
import Pagination from "components/ui/Pagination";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  selectNotifications,
  selectNotificationUnreadCount,
  selectNotificationsLoading,
  selectNotificationsPagination,
} from "reducers/notifications/notificationsSlice";
import { resolveNotificationDeepLink } from "../../../utils/notificationRoutes";
import {
  getDiffFieldPreview,
  getDiffPreview,
  hasNotificationDiff,
} from "../../../utils/notificationDiff";
import NotificationDetailsPanel from "../../../components/ui/NotificationDetailsPanel";

const typeOptions = [
  "",
  "INVITATION_CREATED",
  "INVITATION_ACCEPTED",
  "INVITATION_REJECTED",
  "COURSE_UPDATED",
  "COURSE_PURCHASED",
  "BOOKING_CONFIRMED",
  "PAYMENT_STATUS_UPDATED",
  "LESSON_SCHEDULED",
  "LESSON_UPDATED",
  "LESSON_CANCELLED",
  "TEACHER_ASSIGNED",
  "TEACHER_REMOVED",
  "ADMIN_ACTION",
  "SCHOOL_CUSTOM_MESSAGE",
];

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectNotificationUnreadCount);
  const loading = useSelector(selectNotificationsLoading);
  const pagination = useSelector(selectNotificationsPagination);

  const [tab, setTab] = useState("all");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const query = useMemo(
    () => ({
      page,
      limit: 20,
      unread: tab === "unread" ? true : undefined,
      type: type || undefined,
    }),
    [page, tab, type],
  );

  useEffect(() => {
    dispatch(fetchNotifications(query));
  }, [dispatch, query]);

  const onOpen = async (notification) => {
    if (!notification?.isRead) {
      await dispatch(markNotificationRead(notification._id));
    }

    if (hasNotificationDiff(notification)) {
      setExpandedId((prev) =>
        prev === notification._id ? null : notification._id,
      );
      return;
    }

    const target = resolveNotificationDeepLink(notification);
    if (target) navigate(target);
  };

  const onViewTarget = (notification) => {
    const target = resolveNotificationDeepLink(notification);
    if (target) navigate(target);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="px-4 md:px-8 pt-24 pb-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              Unread: {unreadCount}
            </p>
          </div>

          <button
            className="px-3 py-2 rounded-md text-sm border border-border hover:bg-muted"
            onClick={() => dispatch(markAllNotificationsRead({}))}
          >
            Mark all as read
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${tab === "all" ? "bg-primary text-white" : "bg-muted"}`}
            onClick={() => {
              setTab("all");
              setPage(1);
            }}
          >
            All
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${tab === "unread" ? "bg-primary text-white" : "bg-muted"}`}
            onClick={() => {
              setTab("unread");
              setPage(1);
            }}
          >
            Unread
          </button>
          <select
            className="ml-2 px-3 py-1.5 border border-border rounded-md bg-surface"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
          >
            {typeOptions.map((item) => (
              <option value={item} key={item || "all-types"}>
                {item || "All types"}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((id) => (
              <div
                key={id}
                className="h-16 rounded-md bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-md border border-border p-6 text-center text-muted-foreground">
            No notifications found.
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden bg-surface">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/40 ${!item.isRead ? "bg-primary/5" : ""}`}
                onClick={() => onOpen(item)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.message}
                    </p>
                    {hasNotificationDiff(item) ? (
                      <p className="text-xs text-primary mt-1">
                        {(() => {
                          const fieldPreview = getDiffFieldPreview(item, 3);
                          const preview = getDiffPreview(item, 5);
                          return `${item?.type?.startsWith("COURSE") ? "Course updated" : "Lesson updated"}: ${
                            fieldPreview.text || "fields changed"
                          }${fieldPreview.more > 0 ? ` +${fieldPreview.more}` : ""} (${preview.total})`;
                        })()}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!item.isRead ? (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    ) : null}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewTarget(item);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Open notification target"
                    >
                      <Icon name="ExternalLink" size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeNotification(item._id));
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Delete notification"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                {expandedId === item._id ? (
                  <NotificationDetailsPanel
                    notification={item}
                    onViewTarget={onViewTarget}
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Pagination
            currentPage={pagination.page || 1}
            totalPages={pagination.pages || 1}
            totalItems={pagination.total || 0}
            pageSize={pagination.limit || 20}
            listType="notifications"
            onPageChange={(nextPage) => {
              if (nextPage < 1 || nextPage > (pagination.pages || 1)) return;
              setPage(nextPage);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;

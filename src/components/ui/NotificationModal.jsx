import { useState } from "react";
import Button from "./Button";
import {
  getDiffFieldPreview,
  getDiffPreview,
  hasNotificationDiff,
} from "../../utils/notificationDiff";
import NotificationDetailsPanel from "./NotificationDetailsPanel";

const NotificationModal = ({
  notifications = [],
  loading = false,
  unreadCount = 0,
  handleNotificationClick,
  handleMarkAllRead,
  handleViewAll,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="absolute -right-12 sm:right-0 top-full mt-2 w-72 sm:w-96 bg-popover border border-border rounded-lg shadow-elevation-3 animate-slide-down z-50">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        {unreadCount > 0 ? (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-primary hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-2">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="h-14 rounded-md bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground text-center">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted transition-smooth ${
                !notification.isRead ? "bg-accent/5" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-muted-foreground text-xs mt-1">
                    {notification.message}
                  </p>
                  {hasNotificationDiff(notification) ? (
                    <p className="text-xs text-primary mt-1">
                      {(() => {
                        const fieldPreview = getDiffFieldPreview(
                          notification,
                          3,
                        );
                        const preview = getDiffPreview(notification, 5);
                        return `${notification?.type?.startsWith("COURSE") ? "Course updated" : "Lesson updated"}: ${
                          fieldPreview.text || "fields changed"
                        }${fieldPreview.more > 0 ? ` +${fieldPreview.more}` : ""} (${preview.total})`;
                      })()}
                    </p>
                  ) : null}
                  <span className="text-muted-foreground text-xs mt-2 block">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notification.isRead ? (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                ) : null}
              </div>
              {hasNotificationDiff(notification) ? (
                <div className="mt-2">
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId((prev) =>
                        prev === notification._id ? null : notification._id,
                      );
                    }}
                  >
                    {expandedId === notification._id
                      ? "Hide details"
                      : "Show details"}
                  </button>
                  {expandedId === notification._id ? (
                    <NotificationDetailsPanel
                      notification={notification}
                      onViewTarget={handleNotificationClick}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={handleViewAll}
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationModal;

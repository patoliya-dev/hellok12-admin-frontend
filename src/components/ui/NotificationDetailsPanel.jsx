import Button from "./Button";
import {
  formatDiffValue,
  getDiffActorLabel,
  getNotificationDiff,
  truncateDiffValue,
} from "../../utils/notificationDiff";

const NotificationDetailsPanel = ({ notification, onViewTarget }) => {
  const diff = getNotificationDiff(notification);
  const visibleDiff = diff.slice(0, 5);
  const hiddenCount = Math.max(0, diff.length - visibleDiff.length);
  const actorLabel = getDiffActorLabel(notification);
  const changedAt =
    notification?.metadata?.changedAt || notification?.createdAt;

  if (!diff.length) return null;

  return (
    <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
      <div className="flex flex-col gap-1 mb-2">
        <p className="text-xs font-semibold text-foreground">Updated fields</p>
        <p className="text-xs text-muted-foreground">
          By {actorLabel} • {new Date(changedAt).toLocaleString()}
        </p>
      </div>

      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {visibleDiff.map((entry, index) => {
          const beforeText = formatDiffValue(entry?.before);
          const afterText = formatDiffValue(entry?.after);
          return (
            <div key={`${entry?.field || "diff"}-${index}`} className="text-xs">
              <p className="font-medium text-foreground">
                {entry?.label || entry?.field || "Field"}
              </p>
              <p
                className="text-muted-foreground"
                title={`Before: ${beforeText}`}
              >
                Before: {truncateDiffValue(beforeText, 90)}
              </p>
              <p className="text-foreground" title={`After: ${afterText}`}>
                After: {truncateDiffValue(afterText, 90)}
              </p>
            </div>
          );
        })}
        {hiddenCount > 0 ? (
          <p className="text-xs text-muted-foreground">
            +{hiddenCount} more fields
          </p>
        ) : null}
      </div>

      <div className="mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewTarget?.(notification);
          }}
        >
          View Course/Lesson
        </Button>
      </div>
    </div>
  );
};

export default NotificationDetailsPanel;

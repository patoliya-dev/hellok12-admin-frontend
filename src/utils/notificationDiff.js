export const getNotificationDiff = (notification) => {
  const diff = notification?.metadata?.diff;
  return Array.isArray(diff) ? diff : [];
};

export const getDiffPreview = (notification, limit = 5) => {
  const diff = getNotificationDiff(notification);
  return {
    total: diff.length,
    items: diff.slice(0, limit),
    more: Math.max(0, diff.length - limit),
  };
};

export const getDiffFieldPreview = (notification, limit = 3) => {
  const diff = getNotificationDiff(notification);
  const labels = diff
    .map((entry) => String(entry?.label || entry?.field || "").trim())
    .filter(Boolean);
  const uniqueLabels = [...new Set(labels)];
  const shown = uniqueLabels.slice(0, limit);
  const more = Math.max(0, uniqueLabels.length - shown.length);
  return {
    text: shown.join(", "),
    more,
    total: uniqueLabels.length,
  };
};

export const hasNotificationDiff = (notification) =>
  getNotificationDiff(notification).length > 0;

export const getDiffActorLabel = (notification) => {
  const actor = notification?.metadata?.actor;
  if (!actor) return "System";
  const role = actor?.role ? String(actor.role).replaceAll("_", " ") : "";
  const displayName = actor?.displayName || "";
  if (displayName && role) return `${displayName} (${role})`;
  return displayName || role || "System";
};

export const formatDiffValue = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "object") {
    if (typeof value.label === "string" && value.label.trim()) {
      return value.label;
    }
    if (typeof value.raw === "string" && value.raw.trim()) {
      return value.raw;
    }
    return JSON.stringify(value);
  }

  return String(value);
};

export const truncateDiffValue = (value, max = 80) => {
  const text = formatDiffValue(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
};

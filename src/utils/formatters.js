import {
  format,
  formatDistanceToNowStrict,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export const formatLessonTime = (date) => {
  return format(new Date(date), "hh:mm a");
};

export const formatLessonDate = (date, formatStr = "dd MMM yyyy") => {
  return format(new Date(date), formatStr);
};

export const getCountdown = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  if (date < now) return "Started";

  const days = differenceInDays(date, now);
  const hours = differenceInHours(date, now) % 24;
  const minutes =
    Math.floor((date.getTime() - now.getTime()) / (1000 * 60)) % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return formatDistanceToNowStrict(date, { unit: "minute" });
};

// FE utils (put anywhere you keep helpers)
export const formatDateForDateInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  // Use UTC parts to avoid TZ shifting the day
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // <-- "YYYY-MM-DD"
};

export const isoAtStartOfDayUTC = (yyyy_mm_dd) => {
  if (!yyyy_mm_dd) return null;
  // Store as 00:00:00Z so it round-trips cleanly
  return new Date(`${yyyy_mm_dd}T00:00:00.000Z`).toISOString();
};

export function getUserTimezone(authUser) {
  // Prefer explicit timezone from the logged-in user profile (if you store it).
  // If not available, fallback to browser-detected tz.
  if (authUser?.timezone) return authUser.timezone;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Ensures provided timeZone is valid for Intl APIs.
 * Falls back to UTC if invalid.
 */
export function safeTimeZone(timeZone) {
  const tz = timeZone || "UTC";
  try {
    // This throws RangeError if timeZone is invalid
    Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date());
    return tz;
  } catch {
    return "UTC";
  }
}

/**
 * For when you already have a Date instance (not an ISO string).
 * Example: formatDateObjToTZ(new Date(course.startDate), tz, { month: 'long' })
 */
export function formatDateObjToTZ(dateObj, timeZone, opts = {}) {
  if (!dateObj) return "";
  const tz = safeTimeZone(timeZone);

  const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (Number.isNaN(date.getTime())) return "";

  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...opts,
  };

  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: tz }).format(
    date,
  );
}

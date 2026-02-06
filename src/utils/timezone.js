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

export function formatTimeToTZ(isoString, timeZone, opts = {}) {
  if (!isoString) return "";
  const tz = safeTimeZone(timeZone);

  // isoString should be a full ISO with timezone (Z). e.g. "2025-12-03T11:30:00.000Z"
  const date = isoString instanceof Date ? isoString : new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...opts,
    timeZone: tz,
  });
}

export function formatDateToTZ(isoString, timeZone, opts = {}) {
  if (!isoString) return "";
  const tz = safeTimeZone(timeZone);

  const date = new Date(isoString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  };

  return date.toLocaleDateString(undefined, { ...options, timeZone: tz });
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

/**
 * Convenience: formats full date-time in a single call.
 */
export function formatDateTimeToTZ(isoString, timeZone, opts = {}) {
  if (!isoString) return "";
  const tz = safeTimeZone(timeZone);
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...opts,
  };

  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: tz }).format(
    date,
  );
}

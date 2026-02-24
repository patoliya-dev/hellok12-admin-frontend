export function resolveNotificationDeepLink(notification) {
  const explicit = notification?.metadata?.deepLink;
  if (explicit && typeof explicit === "object" && explicit.route)
    return explicit.route;
  if (typeof explicit === "string" && explicit.trim()) return explicit;

  if (
    notification?.type === "COURSE_UPDATED" ||
    notification?.type?.startsWith("LESSON")
  ) {
    return "/admin/courses";
  }

  if (
    notification?.type?.includes("TEACHER") ||
    notification?.type?.includes("INVITATION")
  ) {
    return "/admin/teachers";
  }

  if (
    notification?.type?.includes("PAYMENT") ||
    notification?.type === "COURSE_PURCHASED"
  ) {
    return "/admin/earning";
  }

  return "/admin/notifications";
}

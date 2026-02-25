export const isAdmin = (u) => u?.role === "super_admin";

export const isSchoolTeacher = (u) =>
  u?.role === "teacher" && Boolean(u?.schoolId);

/**
 * Course management permission (single source of truth)
 * - Admin can manage
 * - School can manage
 * - Independent teacher can manage
 * - School teacher cannot manage
 */
export const canManageCourses = (u) => isAdmin(u);

export const isTeacher = (u) => u?.role === "teacher";
export const isSchool = (u) => u?.role === "school";
export const isAdmin = (u) => u?.role === "super_admin";

export const isSchoolTeacher = (u) =>
  u?.role === "teacher" && Boolean(u?.schoolId);

export const isIndependentTeacher = (u) =>
  u?.role === "teacher" && !u?.schoolId;

/**
 * Course management permission (single source of truth)
 * - Admin can manage
 * - School can manage
 * - Independent teacher can manage
 * - School teacher cannot manage
 */
export const canManageCourses = (u) =>
  isAdmin(u) || isSchool(u) || isIndependentTeacher(u);

/**
 * Useful when you need "teacher area only" access.
 * School teachers are still teachers for most teacher features,
 * but NOT for course management.
 */
export const canAccessTeacherArea = (u) => isTeacher(u);
export const canAccessSchoolArea = (u) => isSchool(u) || isAdmin(u);

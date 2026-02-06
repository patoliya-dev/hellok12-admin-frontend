import api from "../../utils/axiosInstance";

/**
 * Extract best error message from axios error.
 */
const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

/**
 * Generic GET helper that returns response.data
 * Supports AbortController via config.signal (axios v1 supports it).
 */
const get = async (url, config = {}, fallbackMessage) => {
  try {
    const res = await api.get(url, config);
    return res.data;
  } catch (error) {
    console.error(`GET ${url} error:`, error);
    throw new Error(getApiErrorMessage(error, fallbackMessage));
  }
};

export const getDashboardData = async ({ signal } = {}) => {
  // returns: { success, data: { lessons: [...] } }
  return get("/lessons/dashboard", { signal }, "Failed to load dashboard data");
};

export const getCalendarData = async (month, year, { signal } = {}) => {
  // returns: createSuccessResponse(data, ...) -> { success, data: { monthOverview, stats } }
  const res = await get(
    "/lessons/calendar",
    { params: { month, year }, signal },
    "Failed to load calendar data",
  );
  return res?.data; // keep backward compatibility with your existing callers
};

export const getSchoolCalendarData = async (
  month,
  year,
  teacherId = "all",
  { signal } = {},
) => {
  const res = await get(
    "/lessons/calendar",
    { params: { month, year, teacherId }, signal },
    "Failed to load calendar data",
  );
  return res?.data;
};

export const getManageLessons = async (params = {}, { signal } = {}) => {
  // returns: { success, data: ... }
  return get("/lessons/list", { params, signal }, "Failed to load lessons");
};

export const getLessonsForStudent = async ({ studentId, signal } = {}) => {
  if (!studentId) throw new Error("studentId is required");
  return get(
    `/lessons/getLessonsForStudent/${studentId}`,
    { signal },
    "Failed to load student lessons",
  );
};

export const getStudentCalendarData = async (
  studentId,
  month,
  year,
  { signal } = {},
) => {
  if (!studentId) throw new Error("studentId is required");
  const res = await get(
    `/lessons/students/${studentId}/calendar`,
    { params: { month, year }, signal },
    "Failed to load calendar data",
  );
  return res?.data;
};

export const getCoursesForStudent = async (studentId, { signal } = {}) => {
  if (!studentId) throw new Error("studentId is required");
  return get(
    `/lessons/courses/${studentId}`,
    { signal },
    "Failed to load courses",
  );
};

export const getStudentLessons = async (
  studentId,
  params = {},
  { signal } = {},
) => {
  if (!studentId) throw new Error("studentId is required");
  return get(
    `/lessons/studentLessons/${studentId}`,
    { params, signal },
    "Failed to load lessons",
  );
};

export const getSchoolLessons = async (params = {}, { signal } = {}) => {
  const res = await api.get("/lessons/schoolLessons", { params, signal });
  return res.data;
};

// School-owned courses for dropdown
export const getCoursesForSchool = async ({
  status = "active",
  signal,
} = {}) => {
  const res = await api.get("/courses/school/courses", {
    params: { status },
    signal,
  });
  return res.data;
};

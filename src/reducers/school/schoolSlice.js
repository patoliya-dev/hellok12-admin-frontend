import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import {
  fetchSchoolTeachers,
  inviteSchoolTeacher,
  approveRejectSchoolTeacher,
  fetchSchoolStudents,
  inviteSchoolStudent,
} from "./schoolThunks";

const allThunks = [
  fetchSchoolTeachers,
  inviteSchoolTeacher,
  approveRejectSchoolTeacher,
  fetchSchoolStudents,
  inviteSchoolStudent,
];

const initialState = {
  teachers: [],
  teachersSummary: { total: 0, active: 0, pending: 0, inactive: 0 },
  students: [],
  studentsPagination: { total: 0, page: 1, limit: 10, pages: 1 },

  requests: {
    fetchSchoolTeachers: { status: "idle", error: null },
    inviteSchoolTeacher: { status: "idle", error: null },
    approveRejectSchoolTeacher: { status: "idle", error: null },

    fetchSchoolStudents: { status: "idle", error: null },
    inviteSchoolStudent: { status: "idle", error: null },
  },
};

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    clearSchoolErrors: (state) => {
      Object.keys(state.requests).forEach((k) => {
        state.requests[k].error = null;
      });
    },
  },
  extraReducers: (builder) => {
    // Teachers
    builder.addCase(fetchSchoolTeachers.fulfilled, (state, action) => {
      const payload = action.payload || {};
      state.teachers = payload?.teachers || payload?.data?.teachers || [];
      state.teachersSummary =
        payload?.summary || payload?.data?.summary || state.teachersSummary;
    });

    // Students
    builder.addCase(fetchSchoolStudents.fulfilled, (state, action) => {
      const payload = action.payload || {};
      // expected: { success, data: { students, pagination } } OR flattened
      const data = payload?.data || payload;
      state.students = data?.students || [];
      state.studentsPagination = data?.pagination || state.studentsPagination;
    });

    // Generic request matchers
    builder
      .addMatcher(isPending(...allThunks), (state, action) => {
        const key = action.type.split("/")[1];
        if (state.requests[key]) {
          state.requests[key].status = "loading";
          state.requests[key].error = null;
        }
      })
      .addMatcher(isFulfilled(...allThunks), (state, action) => {
        const key = action.type.split("/")[1];
        if (state.requests[key]) {
          state.requests[key].status = "succeeded";
          state.requests[key].error = null;
        }
      })
      .addMatcher(isRejected(...allThunks), (state, action) => {
        const key = action.type.split("/")[1];
        if (state.requests[key]) {
          state.requests[key].status = "failed";
          const payload = action.payload;
          state.requests[key].error =
            payload?.message ||
            payload?.error ||
            (typeof payload === "string" ? payload : action.error?.message) ||
            "Request failed";
        }
      });
  },
});

export const { clearSchoolErrors } = schoolSlice.actions;

// Selectors
export const selectSchoolTeachers = (s) => s.school?.teachers || [];
export const selectSchoolTeachersSummary = (s) =>
  s.school?.teachersSummary || {};
export const selectSchoolStudents = (s) => s.school?.students || [];
export const selectSchoolStudentsPagination = (s) =>
  s.school?.studentsPagination || {};

export const selectSchoolReq = (key) => (s) =>
  s.school?.requests?.[key] || { status: "idle", error: null };

export default schoolSlice.reducer;

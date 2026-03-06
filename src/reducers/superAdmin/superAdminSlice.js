import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import {
  fetchTeachers,
  inviteTeacher,
  approveRejectSchoolTeacher,
  fetchStudents,
  inviteStudent,
  fetchSchools,
  fetchParents,
} from "./superAdminThunks";

const allThunks = [
  fetchTeachers,
  inviteTeacher,
  approveRejectSchoolTeacher,
  fetchStudents,
  inviteStudent,
];

const initialState = {
  teachers: [],
  teachersSummary: { total: 0, active: 0, pending: 0, inactive: 0 },
  students: [],
  studentsPagination: { total: 0, page: 1, limit: 10, pages: 1 },
  schools: [],
  schoolsPagination: { total: 0, page: 1, limit: 10, pages: 1 },
  parents: [],
  parentsPagination: { total: 0, page: 1, limit: 10, pages: 1 },

  // teachers: [],
  teachersPagination: null,

  requests: {
    fetchTeachers: { status: "idle", error: null },
    inviteTeacher: { status: "idle", error: null },
    approveRejectSchoolTeacher: { status: "idle", error: null },

    fetchStudents: { status: "idle", error: null },
    inviteStudent: { status: "idle", error: null },
    fetchSchools: { status: "idle", error: null },
    fetchParents: { status: "idle", error: null },

    updateUser: { status: "idle", error: null },
  },
};

const schoolSlice = createSlice({
  name: "superAdmin",
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
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.requests.fetchTeachers = { status: "loading" };
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.requests.fetchTeachers = { status: "success" };

        state.teachers = action.payload?.teachers || [];
        state.teachersPagination = action.payload?.pagination || null;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.requests.fetchTeachers = {
          status: "failed",
          error: action.payload || null,
        };
      });

    // Students
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      const payload = action.payload || {};
      // expected: { success, data: { students, pagination } } OR flattened
      const data = payload?.data || payload;
      state.students = data?.students || [];
      state.studentsPagination = data?.pagination || state.studentsPagination;
    });

    builder.addCase(fetchParents.fulfilled, (state, action) => {
      const payload = action.payload || {};
      const data = payload?.data || payload;
      state.parents = data?.parents || [];
      state.parentsPagination = data?.pagination || state.parentsPagination;
    });

    builder.addCase(fetchSchools.fulfilled, (state, action) => {
      const payload = action.payload || {};
      const data = payload?.data ? payload.data : payload;
      state.schools = data?.schools || [];
      state.schoolsPagination = data?.pagination || state.schoolsPagination;
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
export const selectTeachers = (s) => s.superAdmin.teachers;
export const selectTeachersPagination = (s) => s.superAdmin.teachersPagination;

export const selectStudents = (s) => s.superAdmin?.students || [];
export const selectStudentsPagination = (s) =>
  s.superAdmin?.studentsPagination || {};

export const selectParents = (s) => s.superAdmin?.parents || [];
export const selectParentsPagination = (s) =>
  s.superAdmin?.parentsPagination || {};

export const selectReq = (key) => (s) =>
  s.superAdmin?.requests?.[key] || { status: "idle", error: null };

export const selectSchools = (s) => s.superAdmin?.schools || [];
export const selectSchoolsReq = (s) =>
  s.superAdmin?.requests?.fetchSchools || { status: "idle", error: null };

export default schoolSlice.reducer;

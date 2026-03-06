import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCourses,
  fetchCourse,
  fetchCourseWithLessons,
  createCourse,
  updateCourse,
  removeCourse,
  duplicateCourse,
} from "./courseThunks";

const listInit = {
  items: [],
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  loading: false,
  error: null,
  filters: { page: 1, limit: 10, sort: "newest" },
};
const detailInit = { byId: {}, loading: false, error: null };

export const courseListSlice = createSlice({
  name: "courseList",
  initialState: listInit,
  reducers: {
    setCourseFilters(s, { payload }) {
      s.filters = { ...s.filters, ...payload };
    },
    resetCourseList(s) {
      Object.assign(s, listInit);
    },
    updateLocalCourse(s, { payload }) {
      s.items = payload;
      s.pagination = { ...s.pagination, total: payload.length };
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCourses.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchCourses.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload.items || [];
        s.pagination = payload.pagination || s.pagination;
        s.filters = payload._filters || s.filters;
      })
      .addCase(fetchCourses.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || "Failed to load courses";
      })
      .addCase(removeCourse.fulfilled, () => {})
      .addCase(duplicateCourse.fulfilled, () => {});
  },
});

export const courseDetailSlice = createSlice({
  name: "courseDetail",
  initialState: detailInit,
  reducers: {
    resetCourseDetail(s) {
      Object.assign(s, detailInit);
    },
    updateLocalLessons(s, { payload }) {
      s.items = payload;
      s.pagination = { ...s.pagination, total: payload.length };
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCourse.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchCourse.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.byId[payload._id] = payload;
      })
      .addCase(fetchCourse.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || "Failed to load course";
      })
      .addCase(fetchCourseWithLessons.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCourseWithLessons.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.course = payload.course || {};
        s.items = payload.items || [];
        s.pagination = payload.pagination || s.pagination;
        s.filters = payload._filters || s.filters;
      })
      .addCase(fetchCourseWithLessons.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || "Failed to load course";
      })
      .addCase(updateCourse.fulfilled, (s, { payload }) => {
        s.byId[payload._id] = payload;
      })
      .addCase(createCourse.fulfilled, (s, { payload }) => {
        s.byId[payload._id] = payload;
      });
  },
});

export const { setCourseFilters, resetCourseList, updateLocalCourse } =
  courseListSlice.actions;
export const { resetCourseDetail, updateLocalLessons } =
  courseDetailSlice.actions;

export default {
  courseList: courseListSlice.reducer,
  courseDetail: courseDetailSlice.reducer,
};

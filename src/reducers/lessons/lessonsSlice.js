import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLessonsByCourse,
  fetchLesson,
  updateLesson,
  createLessons,
  updateLessons,
  removeLesson,
  duplicateLesson,
} from "./lessonThunks";

const initByCourse = {};
const initDetail = { byId: {}, loading: false, error: null };
const initCreate = { loading: false, error: null, fieldErrors: null };

const lessonsSlice = createSlice({
  name: "lessons",
  initialState: {
    byCourse: initByCourse,
    detail: initDetail,
    create: initCreate,
  },
  reducers: {
    clearCreateError(state) {
      state.create = { ...initCreate };
    },
  },
  extraReducers: (b) => {
    b
      // list by course
      .addCase(fetchLessonsByCourse.pending, (s, a) => {
        const id = a.meta.arg.courseId;
        s.byCourse[id] ??= {
          items: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 },
          loading: false,
          error: null,
          filters: { page: 1, limit: 50 },
        };
        s.byCourse[id].loading = true;
        s.byCourse[id].error = null;
      })
      .addCase(fetchLessonsByCourse.fulfilled, (s, { payload }) => {
        const { courseId, payload: data, filters } = payload;
        s.byCourse[courseId] = {
          items: data.items,
          pagination: data.pagination,
          loading: false,
          error: null,
          filters,
        };
      })
      .addCase(fetchLessonsByCourse.rejected, (s, { meta, payload }) => {
        const id = meta.arg.courseId;
        s.byCourse[id].loading = false;
        s.byCourse[id].error = payload?.message || "Failed to load lessons";
      })

      // detail
      .addCase(fetchLesson.pending, (s) => {
        s.detail.loading = true;
        s.detail.error = null;
      })
      .addCase(fetchLesson.fulfilled, (s, { payload }) => {
        s.detail.loading = false;
        s.detail.byId[payload._id] = payload;
      })
      .addCase(fetchLesson.rejected, (s, { payload }) => {
        s.detail.loading = false;
        s.detail.error = payload?.message || "Failed to load lesson";
      })

      // update single
      .addCase(updateLesson.fulfilled, (s, { payload }) => {
        s.detail.byId[payload._id] = payload;
      })

      // bulk update
      .addCase(updateLessons.pending, (s) => {
        s.create.loading = true;
        s.create.error = null;
        s.create.fieldErrors = null;
      })
      .addCase(updateLessons.fulfilled, (s) => {
        s.create = { ...initCreate };
      })
      .addCase(updateLessons.rejected, (s, { payload }) => {
        s.create.loading = false;
        s.create.error = payload?.message || "Failed to update lessons";
        s.create.fieldErrors = payload?.details?.fields || null;
      })

      // bulk create (for Step-2 submit)
      .addCase(createLessons.pending, (s) => {
        s.create.loading = true;
        s.create.error = null;
        s.create.fieldErrors = null;
      })
      .addCase(createLessons.fulfilled, (s) => {
        s.create = { ...initCreate };
      })
      .addCase(createLessons.rejected, (s, { payload }) => {
        s.create.loading = false;
        s.create.error = payload?.message || "Failed to create lessons";
        s.create.fieldErrors = payload?.details?.fields || null;
      })

      // remove single lesson (keep byCourse list in sync if present)
      .addCase(removeLesson.fulfilled, (s, { payload }) => {
        const id = payload?.lessonId || payload?.removed?._id;
        // prune from any cached course listing
        Object.values(s.byCourse).forEach((bucket) => {
          if (!bucket?.items) return;
          bucket.items = bucket.items.filter((x) => x._id !== id);
          // optional: adjust pagination.total if you keep it client-side
          if (bucket.pagination?.total > 0) bucket.pagination.total -= 1;
        });
      })

      // duplicate single lesson (prepend into any cached course listing)
      .addCase(duplicateLesson.fulfilled, (s, { payload }) => {
        const lesson = payload;
        const cid = lesson?.courseId;
        if (cid && s.byCourse[cid]?.items) {
          s.byCourse[cid].items = [lesson, ...s.byCourse[cid].items];
          if (s.byCourse[cid].pagination?.total >= 0)
            s.byCourse[cid].pagination.total += 1;
        }
      });
  },
});

export const { clearCreateError } = lessonsSlice.actions;
export default lessonsSlice.reducer;

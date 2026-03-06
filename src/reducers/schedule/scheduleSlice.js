import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSchedule,
  saveSchedule,
  fetchSlotsForDate,
  updateDateSlots,
  validateLessonSlot,
  fetchSlotsForMonth,
} from "./scheduleThunks";

const initialState = {
  loading: false,
  error: null,
  schedule: null,
  // slotsByDate: {},
  slotsByMonth: {},
  validation: null,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    clearValidation(state) {
      state.validation = null;
    },
    clearMonth(state, action) {
      const month = action.payload;
      if (month && state.slotsByMonth) delete state.slotsByMonth[month];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.schedule = payload;
      })
      .addCase(fetchSchedule.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message;
      })

      .addCase(saveSchedule.fulfilled, (s, { payload }) => {
        s.schedule = payload;
      })

      .addCase(fetchSlotsForDate.fulfilled, (s, { payload }) => {
        const { date, month, slots } = payload || {};
        if (!month) return;
        s.slotsByMonth[month] = s.slotsByMonth[month] || {
          monthlyWeekly: {},
          overrides: {},
          slotsByDate: {},
          fetchedAt: null,
        };
        s.slotsByMonth[month].slotsByDate = {
          ...(s.slotsByMonth[month].slotsByDate || {}),
          [date]: Array.isArray(slots) ? slots : [],
        };
        s.slotsByMonth[month].fetchedAt = Date.now();
      })

      .addCase(fetchSlotsForMonth.fulfilled, (s, { payload }) => {
        const { month, monthlyWeekly, overrides, slotsByDate } = payload || {};
        if (!month) return;
        s.slotsByMonth[month] = {
          monthlyWeekly: monthlyWeekly || {},
          overrides: overrides || {},
          slotsByDate: slotsByDate || {},
          fetchedAt: Date.now(),
        };
      })

      .addCase(updateDateSlots.fulfilled, (s, { payload }) => {
        const { date, slots } = payload || {};
        if (!date) return;
        const month = String(date).slice(0, 7);
        s.slotsByMonth[month] = s.slotsByMonth[month] || {
          monthlyWeekly: {},
          overrides: {},
          slotsByDate: {},
          fetchedAt: null,
        };
        s.slotsByMonth[month].slotsByDate = {
          ...(s.slotsByMonth[month].slotsByDate || {}),
          [date]: Array.isArray(slots) ? slots : [],
        };
        s.slotsByMonth[month].fetchedAt = Date.now();
      })

      .addCase(validateLessonSlot.fulfilled, (s, { payload }) => {
        s.validation = payload;
      });
  },
});

export const { clearValidation } = scheduleSlice.actions;
export default scheduleSlice.reducer;

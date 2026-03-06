import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./scheduleApi";

export const fetchSchedule = createAsyncThunk(
  "schedule/fetch",
  async (teacherId, { rejectWithValue }) => {
    try {
      const { data } = await api.getTeacherSchedule(teacherId);
      if (!data.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  },
);

export const saveSchedule = createAsyncThunk(
  "schedule/save",
  async ({ teacherId, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.upsertTeacherSchedule(teacherId, body);
      if (!data.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Save failed" });
    }
  },
);

export const fetchSlotsForDate = createAsyncThunk(
  "schedule/fetchSlotsForDate",
  async ({ teacherId, date, month }, { rejectWithValue }) => {
    try {
      // pass month optionally - backend may use it for caching or ignore it
      const { data } = await api.getSlotsForDate(teacherId, date, month);
      if (!data.success) return rejectWithValue(data);
      const monthKey = month || (date ? String(date).slice(0, 7) : null);
      return { date, month: monthKey, slots: data.data.slots };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Slots fetch failed" },
      );
    }
  },
);

// Optional: fetch whole month (recommended)
export const fetchSlotsForMonth = createAsyncThunk(
  "schedule/fetchSlotsForMonth",
  async ({ teacherId, month }, { rejectWithValue }) => {
    try {
      const { data } = await api.getSlotsForMonth(teacherId, month);
      if (!data.success) return rejectWithValue(data);
      // data.data expected: { month, weekly, overrides, slotsByDate? }
      return {
        month: data.data.month,
        monthlyWeekly: data.data.weekly || {},
        overrides: data.data.overrides || {},
        slotsByDate: data.data.slotsByDate || {},
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Month fetch failed" },
      );
    }
  },
);

export const updateDateSlots = createAsyncThunk(
  "schedule/updateDateSlots",
  async ({ teacherId, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.patchDateSlots(teacherId, body);
      if (!data.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Update date slots failed" },
      );
    }
  },
);

export const validateLessonSlot = createAsyncThunk(
  "schedule/validateLesson",
  async ({ teacherId, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.validateLessonSlot(teacherId, body);
      return data.data; // { ok: true/false, reasons: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Validation failed" },
      );
    }
  },
);

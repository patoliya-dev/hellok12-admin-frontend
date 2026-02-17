import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./lessonApi";
import { normalizeErr } from "../../features/shared/apiTypes";

export const fetchLessonsByCourse = createAsyncThunk(
  "lessons/byCourse",
  async ({ courseId, filters }, { rejectWithValue }) => {
    try {
      const { data } = await api.listByCourse(courseId, filters);
      if (!data?.success) return rejectWithValue(data);
      return { courseId, payload: data.data, filters };
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const fetchLesson = createAsyncThunk(
  "lessons/detail",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.getLesson(id);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const createLessons = createAsyncThunk(
  "lessons/bulkCreate",
  async ({ courseId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.createLessons(courseId, payload);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const updateLessons = createAsyncThunk(
  "lessons/bulkUpdate",
  async ({ courseId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateLessons(courseId, payload);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const updateLesson = createAsyncThunk(
  "lessons/update",
  async ({ lessonId, patch }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateLesson(lessonId, patch);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const removeLesson = createAsyncThunk(
  "lessons/delete",
  async (lessonId, { rejectWithValue }) => {
    try {
      const { data } = await api.deleteLesson(lessonId);
      if (!data?.success) return rejectWithValue(data);
      return { lessonId, data: data.data };
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const duplicateLesson = createAsyncThunk(
  "lessons/duplicate",
  async (lessonId, { rejectWithValue }) => {
    try {
      const { data } = await api.duplicateLesson(lessonId);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

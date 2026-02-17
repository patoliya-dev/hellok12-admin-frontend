import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./courseApi";
import { normalizeErr } from "../../features/shared/apiTypes";

export const fetchCourses = createAsyncThunk(
  "courses/list",
  async (filters, { rejectWithValue }) => {
    try {
      const { data } = await api.listCourses(filters);
      if (!data?.success) return rejectWithValue(data);
      return { ...data.data, _filters: filters };
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const fetchCourse = createAsyncThunk(
  "courses/detail",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.getCourse(id);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const createCourse = createAsyncThunk(
  "courses/create",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.createCourse(body);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const updateCourse = createAsyncThunk(
  "courses/update",
  async ({ id, patch }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateCourse(id, patch);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const removeCourse = createAsyncThunk(
  "courses/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.deleteCourse(id);
      if (!data?.success) return rejectWithValue(data);
      return { id, data: data.data };
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const duplicateCourse = createAsyncThunk(
  "courses/duplicate",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.duplicateCourse(id);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

export const fetchCourseWithLessons = createAsyncThunk(
  "courses/detail/with/lessons",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const { data } = await api.getCourseWithLessons(id, params);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  },
);

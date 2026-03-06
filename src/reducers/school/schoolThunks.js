import { createAsyncThunk } from "@reduxjs/toolkit";
import { schoolService } from "../../services/school/school.service";

// Teachers
export const fetchSchoolTeachers = createAsyncThunk(
  "school/fetchSchoolTeachers",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await schoolService.getTeachers(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const inviteSchoolTeacher = createAsyncThunk(
  "school/inviteSchoolTeacher",
  async ({ email, message }, { rejectWithValue }) => {
    try {
      return await schoolService.inviteTeacher({ email, message });
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const approveRejectSchoolTeacher = createAsyncThunk(
  "school/approveRejectSchoolTeacher",
  async ({ teacherId, action }, { rejectWithValue }) => {
    try {
      return await schoolService.approveRejectTeacher({ teacherId, action });
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// Students
export const fetchSchoolStudents = createAsyncThunk(
  "school/fetchSchoolStudents",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await schoolService.getStudents(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const inviteSchoolStudent = createAsyncThunk(
  "school/inviteSchoolStudent",
  async ({ email, message }, { rejectWithValue }) => {
    try {
      return await schoolService.inviteStudent({ email, message });
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

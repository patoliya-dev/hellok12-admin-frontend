import { createAsyncThunk } from "@reduxjs/toolkit";
import { invitationService } from "../../services/invitations/invitation.service";
import { superAdminService } from "../../services/superAdmin/superAdmin.service";

// Teachers
export const fetchTeachers = createAsyncThunk(
  "school/fetchTeachers",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await invitationService.getTeachers(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const inviteSchoolTeacher = createAsyncThunk(
  "school/inviteSchoolTeacher",
  async ({ email, message }, { rejectWithValue }) => {
    try {
      return await invitationService.inviteTeacher({ email, message });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const approveRejectSchoolTeacher = createAsyncThunk(
  "school/approveRejectSchoolTeacher",
  async ({ teacherId, action }, { rejectWithValue }) => {
    try {
      return await invitationService.approveRejectTeacher({
        teacherId,
        action,
      });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

// Students
export const fetchStudents = createAsyncThunk(
  "school/fetchStudents",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await invitationService.getStudents(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const inviteStudent = createAsyncThunk(
  "school/inviteStudent",
  async ({ email, message }, { rejectWithValue }) => {
    try {
      return await invitationService.inviteStudent({ email, message });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const fetchSchools = createAsyncThunk(
  "superAdmin/fetchSchools",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await superAdminService.getSchools(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

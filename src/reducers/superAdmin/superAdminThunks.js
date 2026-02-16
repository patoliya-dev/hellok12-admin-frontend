import { createAsyncThunk } from "@reduxjs/toolkit";
import { invitationService } from "../../services/invitations/invitation.service";
import { superAdminService } from "../../services/superAdmin/superAdmin.service";

// Teachers
export const inviteTeacher = createAsyncThunk(
  "superAdmin/inviteTeacher",
  async ({ email, message, schoolId }, { rejectWithValue }) => {
    try {
      return await invitationService.inviteTeacher({
        email,
        message,
        schoolId,
      });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const requestTeacherProfileCompletion = createAsyncThunk(
  "superAdmin/requestTeacherProfileCompletion",
  async ({ invitationId, message } = {}, { rejectWithValue }) => {
    try {
      return await invitationService.requestInvitationProfile(invitationId, {
        message,
      });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const approveRejectSchoolTeacher = createAsyncThunk(
  "superAdmin/approveRejectSchoolTeacher",
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
  "superAdmin/fetchStudents",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await invitationService.getStudents(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const fetchParents = createAsyncThunk(
  "superAdmin/fetchParents",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await superAdminService.getParents(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const inviteStudent = createAsyncThunk(
  "superAdmin/inviteStudent",
  async ({ email, message }, { rejectWithValue }) => {
    try {
      return await invitationService.inviteStudent({ email, message });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const inviteParent = createAsyncThunk(
  "superAdmin/inviteParent",
  async ({ email, message }, { rejectWithValue }) => {
    try {
      return await invitationService.inviteParent({ email, message });
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

export const fetchTeachers = createAsyncThunk(
  "superAdmin/fetchTeachers",
  async (params, { rejectWithValue }) => {
    try {
      const res = await superAdminService.getTeachers(params);
      return res;
    } catch (e) {
      return rejectWithValue(e?.response?.data || e?.message || "Failed");
    }
  },
);

export const updateUser = createAsyncThunk(
  "superAdmin/updateUser",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      return await superAdminService.updateUser(userId, payload);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const inviteSchool = createAsyncThunk(
  "superAdmin/inviteSchool",
  async ({ email, message }, { rejectWithValue }) => {
    try {
      const res = await superAdminService.inviteSchool({ email, message });
      return res?.data || res;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.message || e?.message || "Invite failed",
      );
    }
  },
);

export const fetchSchoolDetails = createAsyncThunk(
  "superAdmin/fetchSchoolDetails",
  async ({ schoolId }, { rejectWithValue }) => {
    try {
      return await superAdminService.getSchoolDetails(schoolId);
    } catch (e) {
      return rejectWithValue(
        e?.message || e?.error || "Failed to fetch school details",
      );
    }
  },
);

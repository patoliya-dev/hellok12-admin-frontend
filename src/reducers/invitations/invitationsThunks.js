import { createAsyncThunk } from "@reduxjs/toolkit";
import { invitationService } from "../../services/invitations/invitation.service";

export const fetchInvitations = createAsyncThunk(
  "invitations/fetch",
  async (
    { role, search = "", page = 1, limit = 10, teacherType = "" },
    { rejectWithValue },
  ) => {
    try {
      const res = await invitationService.getInvitations({
        role,
        search,
        page,
        limit,
        teacherType,
      });
      // res should be: { invitations, pagination }
      return { role, search, page, limit, ...res };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to fetch invitations",
      );
    }
  },
);

export const cancelInvitation = createAsyncThunk(
  "invitations/cancel",
  async (
    { invitationId, role, search = "", page = 1, limit = 10 },
    { rejectWithValue },
  ) => {
    try {
      await invitationService.cancelInvitation(invitationId);
      return { invitationId, role, search, page, limit };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to cancel invitation",
      );
    }
  },
);

export const validateInvitation = createAsyncThunk(
  "invitations/validateInvitation",
  async ({ inviteId, ticket }, { rejectWithValue }) => {
    try {
      return await invitationService.validate({ inviteId, ticket });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const acceptInvitation = createAsyncThunk(
  "invitations/acceptInvitation",
  async ({ inviteId, ticket, fullName, password }, { rejectWithValue }) => {
    try {
      return await invitationService.accept({
        inviteId,
        ticket,
        fullName,
        password,
      });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

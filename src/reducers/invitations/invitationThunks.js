import { createAsyncThunk } from "@reduxjs/toolkit";
import { invitationService } from "../../services/invitations/invitation.service";

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

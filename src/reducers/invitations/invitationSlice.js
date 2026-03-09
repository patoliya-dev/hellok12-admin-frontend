import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { validateInvitation, acceptInvitation } from "./invitationThunks";

const allThunks = [validateInvitation, acceptInvitation];

const initialState = {
  invite: null, // validated invitation payload
  requests: {
    validateInvitation: { status: "idle", error: null },
    acceptInvitation: { status: "idle", error: null },
  },
};

const invitationSlice = createSlice({
  name: "invitations",
  initialState,
  reducers: {
    clearInvitationState: (state) => {
      state.invite = null;
      Object.keys(state.requests).forEach((k) => {
        state.requests[k] = { status: "idle", error: null };
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validateInvitation.fulfilled, (state, action) => {
      state.invite =
        action.payload?.invite ||
        action.payload?.data?.invite ||
        action.payload;
    });

    builder
      .addMatcher(isPending(...allThunks), (state, action) => {
        const key = action.type.split("/")[1];
        if (state.requests[key]) {
          state.requests[key].status = "loading";
          state.requests[key].error = null;
        }
      })
      .addMatcher(isFulfilled(...allThunks), (state, action) => {
        const key = action.type.split("/")[1];
        if (state.requests[key]) {
          state.requests[key].status = "succeeded";
          state.requests[key].error = null;
        }
      })
      .addMatcher(isRejected(...allThunks), (state, action) => {
        const key = action.type.split("/")[1];
        if (state.requests[key]) {
          state.requests[key].status = "failed";
          const payload = action.payload;
          state.requests[key].error =
            payload?.error ||
            payload?.message ||
            (typeof payload === "string" ? payload : action.error?.message) ||
            "Request failed";
        }
      });
  },
});

export const { clearInvitationState } = invitationSlice.actions;

export const selectInvite = (s) => s.invitations?.invite || null;
export const selectInvitationReq = (key) => (s) =>
  s.invitations?.requests?.[key] || { status: "idle", error: null };

export default invitationSlice.reducer;

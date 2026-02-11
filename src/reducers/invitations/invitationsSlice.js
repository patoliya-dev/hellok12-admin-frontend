import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import {
  fetchInvitations,
  cancelInvitation,
  validateInvitation,
  acceptInvitation,
} from "./invitationsThunks";

const allThunks = [validateInvitation, acceptInvitation];

const initialState = {
  byKey: {}, // key => invitations[]
  paginationByKey: {}, // key => pagination
  loadingByKey: {},
  errorByKey: {},
  invite: null, // validated invitation payload
  requests: {
    validateInvitation: { status: "idle", error: null },
    acceptInvitation: { status: "idle", error: null },
  },
};

const normRole = (v) =>
  String(v || "")
    .trim()
    .toUpperCase() || "ALL";
const normSearchKey = (v) =>
  String(v || "")
    .trim()
    .toLowerCase() || "ALL";
const normPage = (v) => {
  const n = parseInt(String(v || "1"), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};
const normLimit = (v) => {
  const n = parseInt(String(v || "10"), 10);
  if (!Number.isFinite(n) || n <= 0) return 10;
  return Math.min(100, n);
};

// include pagination in key to avoid overwriting caches
const keyOf = (role, search, page, limit) =>
  `${normRole(role)}:${normSearchKey(search)}:${normPage(page)}:${normLimit(
    limit,
  )}`;

const normalizeInvitationStatus = (v) =>
  String(v || "")
    .trim()
    .toUpperCase();

const slice = createSlice({
  name: "invitations",
  initialState,
  reducers: {
    // optional utility if you ever want to clear old cached pages for role/search
    // not required for correctness
    clearInvitationCacheForQuery: (state, action) => {
      const { role, search } = action.payload || {};
      const r = normRole(role);
      const s = normSearchKey(search);
      const prefix = `${r}:${s}:`;

      Object.keys(state.byKey).forEach((k) => {
        if (k.startsWith(prefix)) {
          delete state.byKey[k];
          delete state.paginationByKey[k];
          delete state.loadingByKey[k];
          delete state.errorByKey[k];
        }
      });
    },
    clearInvitationState: (state) => {
      state.invite = null;
      Object.keys(state.requests).forEach((k) => {
        state.requests[k] = { status: "idle", error: null };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvitations.pending, (state, action) => {
        const { role, search, page, limit } = action.meta.arg || {};
        const k = keyOf(role, search, page, limit);
        state.loadingByKey[k] = true;
        state.errorByKey[k] = null;
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        const { role, search, page, limit } = action.payload || {};
        const k = keyOf(role, search, page, limit);

        const invitations = (action.payload?.invitations || []).map((inv) => ({
          ...inv,
          status: normalizeInvitationStatus(inv.status),
        }));

        state.byKey[k] = invitations;
        state.paginationByKey[k] = action.payload?.pagination || null;
        state.loadingByKey[k] = false;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        const { role, search, page, limit } = action.meta.arg || {};
        const k = keyOf(role, search, page, limit);
        state.loadingByKey[k] = false;
        state.errorByKey[k] = action.payload || action.error?.message || null;
      })
      .addCase(cancelInvitation.fulfilled, (state, action) => {
        const { invitationId, role, search, page, limit } =
          action.payload || {};
        const k = keyOf(role, search, page, limit);

        const list = state.byKey[k] || [];
        state.byKey[k] = list.map((inv) =>
          String(inv._id) === String(invitationId)
            ? { ...inv, status: "CANCELLED" }
            : inv,
        );
      });

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

export const { clearInvitationCacheForQuery } = slice.actions;
export const { clearInvitationState } = slice.actions;

export const selectInvite = (s) => s.invitations?.invite || null;
export const selectInvitationReq = (key) => (s) =>
  s.invitations?.requests?.[key] || { status: "idle", error: null };

export default slice.reducer;

// Selectors
export const selectInvitations = (
  state,
  role,
  search,
  page = 1,
  limit = 10,
) => {
  const k = keyOf(role, search, page, limit);

  return state.invitations?.byKey?.[k] || [];
};

export const selectInvitationsLoading = (
  state,
  role,
  search,
  page = 1,
  limit = 10,
) => {
  const k = keyOf(role, search, page, limit);
  return Boolean(state.invitations?.loadingByKey?.[k]);
};

export const selectInvitationsPagination = (
  state,
  role,
  search,
  page = 1,
  limit = 10,
) => {
  const k = keyOf(role, search, page, limit);
  return state.invitations?.paginationByKey?.[k] || null;
};

export const selectInvitationsError = (
  state,
  role,
  search,
  page = 1,
  limit = 10,
) => {
  const k = keyOf(role, search, page, limit);
  return state.invitations?.errorByKey?.[k] || null;
};

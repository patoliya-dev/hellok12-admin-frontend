import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import {
  loginUser,
  signupUser,
  verifyEmail,
  refreshToken,
  logoutUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "./authThunks";
import { fetchCurrentUser } from "./authThunks";

import {
  setAccessToken,
  setCurrentUser,
  getCurrentUser,
  getAccessToken,
  clearAuthStorage,
} from "../../utils/storage";

// Define all thunks in an array for matchers
const allThunks = [
  loginUser,
  signupUser,
  verifyEmail,
  refreshToken,
  logoutUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  fetchCurrentUser,
];

const initialState = {
  user: getCurrentUser(),
  accessToken: getAccessToken(),
  requests: {
    loginUser: { status: "idle", error: null },
    signupUser: { status: "idle", error: null },
    verifyEmail: { status: "idle", error: null },
    refreshToken: { status: "idle", error: null },
    logoutUser: { status: "idle", error: null },
    forgotPassword: { status: "idle", error: null },
    verifyResetCode: { status: "idle", error: null },
    resetPassword: { status: "idle", error: null },
    fetchCurrentUser: { status: "idle", error: null },
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      clearAuthStorage();
      // reset all request states
      Object.keys(state.requests).forEach((key) => {
        state.requests[key] = { status: "idle", error: null };
      });
    },
    clearError: (state, action) => {
      const key = action.payload; // pass thunk key like 'loginUser'
      if (key && state.requests[key]) {
        state.requests[key].error = null;
      }
    },
    setAuthFromExternal: (state, action) => {
      const payload = action.payload || {};
      state.user = payload.user ?? state.user;
      state.accessToken = payload.accessToken ?? state.accessToken;

      if (payload.accessToken) setAccessToken(payload.accessToken);
      if (payload.user) setCurrentUser(payload.user);
    },
  },
  extraReducers: (builder) => {
    // Login & Signup store user/token
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.user = payload.user ?? state.user;
        state.accessToken = payload.accessToken ?? state.accessToken;
        if (payload.accessToken) setAccessToken(payload.accessToken);
        if (payload.user) setCurrentUser(payload.user);
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.user = payload.user ?? state.user;
        state.accessToken = payload.accessToken ?? state.accessToken;
        if (payload.accessToken) setAccessToken(payload.accessToken);
        if (payload.user) setCurrentUser(payload.user);
      })

      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.accessToken = payload.accessToken ?? state.accessToken;
        if (payload.accessToken) setAccessToken(payload.accessToken);
        if (payload.user) {
          state.user = payload.user;
          setCurrentUser(payload.user);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        clearAuthStorage();
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        clearAuthStorage();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        clearAuthStorage();
      });

    // Fetch current user
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      const user = action.payload;
      if (user) {
        state.user = user;
        setCurrentUser(user);
      }
    });

    // Generic matchers for all requests
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
            payload?.message ||
            payload?.error ||
            (typeof payload === "string" ? payload : action.error?.message) ||
            "Request failed";
        }
      });
  },
});

export const { logout, clearError, setAuthFromExternal } = authSlice.actions;
export default authSlice.reducer;

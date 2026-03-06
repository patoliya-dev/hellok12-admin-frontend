import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

// login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials, {
        skipRefresh: true,
      });

      if (data.success) {
        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        };
      }

      return data; // expected { accessToken, user }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/signup", formData);

      if (data.success) {
        return {
          user: data.data.user,
          userId: data.data.userId,
          requiresEmailVerification: data.data.requiresEmailVerification,
        };
      }

      return data;
    } catch (err) {
      // Enhanced error handling for validation errors
      if (err.response?.status === 400 && err.response?.data?.errors) {
        return rejectWithValue({
          message: err.response.data.message || "Validation failed",
          errors: err.response.data.errors,
        });
      }

      const errorMessage =
        err.response?.data?.message || err.response?.data?.error || err.message;
      return rejectWithValue(errorMessage);
    }
  },
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/auth/verify-email?token=${token}`);

      if (data.success) {
        return {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      }

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Verification failed",
      );
    }
  },
);

// refresh (manual refresh call if needed)
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/auth/refresh",
        {},
        { withCredentials: true },
      );
      return data; // { accessToken, user? }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// logout (call backend to revoke refresh token if present)
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // best-effort call; if no backend, remove client side state in reducer
      await api.post("/auth/logout");
      return true;
    } catch (err) {
      // still allow client to clear state
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// forgot password - send code
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/forgot-password", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// verify reset password code
export const verifyResetCode = createAsyncThunk(
  "auth/verifyResetCode",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/verify-reset-code", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/reset-password", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Fetch current authenticated user (common profile fetch)
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      // Normalize common shapes: { data: user } or { user }
      return data?.data || data?.user || data || null;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Change password thunk
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch("/auth/changePassword", {
        currentPassword: oldPassword,
        newPassword,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to change password",
      );
    }
  },
);

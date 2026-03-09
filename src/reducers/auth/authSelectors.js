import { getUserTimezone } from "../../utils/timezone";

export const selectAuthUser = (state) => state.auth.user;

// generic request status/error selector
export const selectRequestStatus = (key) => (state) =>
  state.auth.requests[key]?.status || "idle";

export const selectRequestError = (key) => (state) =>
  state.auth.requests[key]?.error || null;

// convenience selectors for common flows
export const selectLoginStatus = selectRequestStatus("loginUser");
export const selectLoginError = selectRequestError("loginUser");

export const selectSignupStatus = selectRequestStatus("signupUser");
export const selectSignupError = selectRequestError("signupUser");

export const selectForgotPasswordStatus = selectRequestStatus("forgotPassword");
export const selectForgotPasswordError = selectRequestError("forgotPassword");

export const selectVerifyResetCodeStatus =
  selectRequestStatus("verifyResetCode");
export const selectVerifyResetCodeError = selectRequestError("verifyResetCode");

export const selectVerifyEmailStatus = selectRequestStatus("verifyEmail");
export const selectVerifyEmailError = selectRequestError("verifyEmail");

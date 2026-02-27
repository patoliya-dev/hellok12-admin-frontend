import { createAsyncThunk } from "@reduxjs/toolkit";
import { payoutService } from "../../services/payouts/payout.service";

const toErrorPayload = (e) =>
  e?.response?.data || e?.message || "Request failed";

export const fetchPayouts = createAsyncThunk(
  "payouts/fetchPayouts",
  async (params, { rejectWithValue }) => {
    try {
      return await payoutService.list(params);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const fetchPayoutDetail = createAsyncThunk(
  "payouts/fetchPayoutDetail",
  async (id, { rejectWithValue }) => {
    try {
      return await payoutService.getById(id);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const previewPayout = createAsyncThunk(
  "payouts/previewPayout",
  async (payload, { rejectWithValue }) => {
    try {
      return await payoutService.preview(payload);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const createPayout = createAsyncThunk(
  "payouts/createPayout",
  async (payload, { rejectWithValue }) => {
    try {
      return await payoutService.create(payload);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const approvePayout = createAsyncThunk(
  "payouts/approvePayout",
  async (id, { rejectWithValue }) => {
    try {
      return await payoutService.approve(id);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const markPayoutPaid = createAsyncThunk(
  "payouts/markPayoutPaid",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await payoutService.markPaid(id, payload);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const cancelPayout = createAsyncThunk(
  "payouts/cancelPayout",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await payoutService.cancel(id, payload);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const verifyPayoutAccount = createAsyncThunk(
  "payouts/verifyPayoutAccount",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await payoutService.verifyPayoutAccount(id, payload || {});
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const rejectPayoutAccount = createAsyncThunk(
  "payouts/rejectPayoutAccount",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await payoutService.rejectPayoutAccount(id, payload);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

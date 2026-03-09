import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFinancialSummary,
  fetchFinancialTrend,
  fetchFinancialPayouts,
  fetchFinancialRevenue,
  fetchFinancialCommission,
} from "../../services/financial/financial.service";

const centsToDollars = (value) => Number(value || 0) / 100;

/**
 * Normalizes heterogeneous API list payloads into one reducer contract.
 * Backend endpoints currently return slightly different list keys (`rows`, `items`, `records`, etc.).
 */
const normalizeTablePayload = (payload) => {
  if (Array.isArray(payload)) {
    return { rows: payload, pagination: null };
  }

  const data =
    payload?.data && typeof payload.data === "object"
      ? payload.data
      : payload || {};

  const rows =
    data?.rows ||
    data?.items ||
    data?.results ||
    data?.list ||
    data?.records ||
    data?.revenue ||
    data?.commission ||
    data?.payouts ||
    [];

  const pagination =
    data?.pagination ||
    data?.meta?.pagination ||
    (data?.page || data?.pages || data?.total
      ? {
          page: data?.page || 1,
          limit: data?.limit || 10,
          total: data?.total || 0,
          pages: data?.pages || data?.totalPages || 1,
        }
      : null);

  return {
    rows: Array.isArray(rows) ? rows : [],
    pagination,
  };
};

export const getFinancialSummary = createAsyncThunk(
  "financial/summary",
  async ({ period = "weekly" } = {}, { rejectWithValue }) => {
    try {
      const res = await fetchFinancialSummary(period);
      return { period, data: res.data?.data };
    } catch (e) {
      return rejectWithValue(e?.response?.data || e?.message);
    }
  },
);

export const getFinancialTrend = createAsyncThunk(
  "financial/trend",
  async ({ tab, period }, { rejectWithValue }) => {
    try {
      const res = await fetchFinancialTrend({ tab, period });
      return { tab, period, data: res.data?.data };
    } catch (e) {
      return rejectWithValue(e?.response?.data || e?.message);
    }
  },
);

export const getPayouts = createAsyncThunk(
  "financial/payouts",
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetchFinancialPayouts(params);
      const normalized = normalizeTablePayload(res.data?.data);
      const rows = (normalized?.rows || []).map((row) => ({
        ...row,
        instructorName:
          row?.instructorName ||
          row?.payeeName ||
          row?.payeeId?.name ||
          row?.payeeId?.email ||
          "—",
        // Payout table "Net Amount" always represents payout cash-out amount in dollars.
        amount:
          row?.netAmount !== undefined
            ? centsToDollars(row?.netAmount)
            : row?.amount !== undefined
              ? centsToDollars(row?.amount)
              : 0,
        transactionId:
          row?.transactionId ||
          row?.paymentRef ||
          (row?._id
            ? `PAYOUT-${String(row._id).slice(-6).toUpperCase()}`
            : "—"),
        downloadUrl: row?.downloadUrl || null,
      }));
      return { ...normalized, rows };
    } catch (e) {
      return rejectWithValue(e?.response?.data || e?.message);
    }
  },
);

export const getRevenue = createAsyncThunk(
  "financial/revenue",
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetchFinancialRevenue(params);
      return normalizeTablePayload(res.data?.data);
    } catch (e) {
      return rejectWithValue(e?.response?.data || e?.message);
    }
  },
);

export const getCommission = createAsyncThunk(
  "financial/commission",
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetchFinancialCommission(params);
      return normalizeTablePayload(res.data?.data);
    } catch (e) {
      return rejectWithValue(e?.response?.data || e?.message);
    }
  },
);

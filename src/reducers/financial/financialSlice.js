import { createSlice } from "@reduxjs/toolkit";
import {
  getFinancialSummary,
  getFinancialTrend,
  getPayouts,
  getRevenue,
  getCommission,
} from "./financialThunks";

const initialState = {
  // Summary is cached by period so tab switching does not trigger unnecessary reloads.
  summaryByPeriod: {
    weekly: null,
    monthly: null,
    yearly: null,
  },
  trend: {
    tab: "payout",
    period: "weekly",
    dataPoints: [],
  },
  payout: { rows: [], pagination: null },
  revenue: { rows: [], pagination: null },
  commission: { rows: [], pagination: null },
  req: {},
};

const setReq = (state, key, status, error = null) => {
  state.req[key] = { status, error };
};

const slice = createSlice({
  name: "financial",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      // summary
      .addCase(getFinancialSummary.pending, (s) =>
        setReq(s, "summary", "loading"),
      )
      .addCase(getFinancialSummary.fulfilled, (s, a) => {
        setReq(s, "summary", "succeeded");
        const period = a.payload?.period || "weekly";
        s.summaryByPeriod[period] = a.payload?.data || null;
      })
      .addCase(getFinancialSummary.rejected, (s, a) =>
        setReq(s, "summary", "failed", a.payload),
      )

      // trend
      .addCase(getFinancialTrend.pending, (s) => setReq(s, "trend", "loading"))
      .addCase(getFinancialTrend.fulfilled, (s, a) => {
        setReq(s, "trend", "succeeded");
        s.trend.tab = a.payload.tab;
        s.trend.period = a.payload.period;
        s.trend.dataPoints = a.payload.data?.dataPoints || [];
      })
      .addCase(getFinancialTrend.rejected, (s, a) =>
        setReq(s, "trend", "failed", a.payload),
      )

      // payouts
      .addCase(getPayouts.pending, (s) => setReq(s, "payouts", "loading"))
      .addCase(getPayouts.fulfilled, (s, a) => {
        setReq(s, "payouts", "succeeded");
        s.payout = a.payload;
      })
      .addCase(getPayouts.rejected, (s, a) =>
        setReq(s, "payouts", "failed", a.payload),
      )

      // revenue
      .addCase(getRevenue.pending, (s) => setReq(s, "revenue", "loading"))
      .addCase(getRevenue.fulfilled, (s, a) => {
        setReq(s, "revenue", "succeeded");
        s.revenue = a.payload;
      })
      .addCase(getRevenue.rejected, (s, a) =>
        setReq(s, "revenue", "failed", a.payload),
      )

      // commission
      .addCase(getCommission.pending, (s) => setReq(s, "commission", "loading"))
      .addCase(getCommission.fulfilled, (s, a) => {
        setReq(s, "commission", "succeeded");
        s.commission = a.payload;
      })
      .addCase(getCommission.rejected, (s, a) =>
        setReq(s, "commission", "failed", a.payload),
      );
  },
});

export const selectFinancialReq = (k) => (s) => s.financial.req?.[k];
export const selectFinancialSummaryByPeriod = (period) => (s) =>
  s.financial.summaryByPeriod?.[period] || null;
export const selectFinancialSummary = (s) =>
  s.financial.summaryByPeriod?.[s.financial.trend.period] || null;
export const selectFinancialTrend = (s) => s.financial.trend;

export const selectPayout = (s) => s.financial.payout;
export const selectRevenue = (s) => s.financial.revenue;
export const selectCommission = (s) => s.financial.commission;

export default slice.reducer;

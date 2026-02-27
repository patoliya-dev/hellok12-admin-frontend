import api from "../../utils/axiosInstance";

// Keep endpoint mapping centralized so UI components stay presentation-only.
export const fetchFinancialSummary = (period = "weekly") =>
  api.get("/admin/financial/summary", { params: { period } });

export const fetchFinancialTrend = ({ tab, period }) =>
  api.get("/admin/financial/trend", { params: { tab, period } });

export const fetchFinancialPayouts = (params) =>
  api.get("/admin/payouts", { params });

export const fetchFinancialRevenue = (params) =>
  api.get("/admin/financial/revenue", { params });

export const fetchFinancialCommission = (params) =>
  api.get("/admin/financial/commission", { params });

export const fetchFinancialRevenueReport = (courseId, params = {}) =>
  api.get(`/admin/financial/revenue/${courseId}/download`, {
    params,
    responseType: "blob",
  });

export const fetchFinancialCommissionReport = (courseId, params = {}) =>
  api.get(`/admin/financial/commission/${courseId}/download`, {
    params,
    responseType: "blob",
  });

export const fetchFinancialPayoutReport = (payoutId) =>
  api.get(`/admin/payouts/${payoutId}/download`, {
    responseType: "blob",
  });

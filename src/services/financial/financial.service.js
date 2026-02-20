import api from "../../utils/axiosInstance";

export const fetchFinancialSummary = (period = "weekly") =>
  api.get("/admin/financial/summary", { params: { period } });

export const fetchFinancialTrend = ({ tab, period }) =>
  api.get("/admin/financial/trend", { params: { tab, period } });

export const fetchFinancialPayouts = (params) =>
  api.get("/admin/financial/payouts", { params });

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

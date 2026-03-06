// src/services/dashboard/schoolDashboard.service.js
import api from "../../utils/axiosInstance";

const toApiError = (error, fallbackMessage) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage;

  const err = new Error(message);
  err.status = error?.response?.status;
  err.data = error?.response?.data;
  return err;
};

export const schoolDashboardService = {
  async getMetrics(options = {}) {
    try {
      const res = await api.get("/dashboard/school/metrics", {
        signal: options.signal,
      });
      return res.data; // { success, data }
    } catch (e) {
      throw toApiError(e, "Failed to load school metrics");
    }
  },
};

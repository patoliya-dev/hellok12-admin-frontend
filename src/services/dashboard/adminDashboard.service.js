import api from "../../utils/axiosInstance";

const unwrap = (res) => {
  const payload = res?.data;
  if (payload?.success && payload?.data !== undefined) return payload.data;
  return payload?.data ?? payload ?? {};
};

export const adminDashboardService = {
  async getOverview(params = {}) {
    const res = await api.get("/admin/dashboard/overview", { params });
    return unwrap(res);
  },
};


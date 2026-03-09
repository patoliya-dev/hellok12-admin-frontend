import api from "../../utils/axiosInstance";

const unwrap = (res) => {
  if (!res) return res;
  if (res.success !== undefined && res.data !== undefined) return res.data;
  if (res.data !== undefined) return res.data;
  return res;
};

export const payoutService = {
  preview: async (payload) => {
    const { data } = await api.post("/admin/payouts/preview", payload);
    return unwrap(data);
  },

  create: async (payload) => {
    const { data } = await api.post("/admin/payouts", payload);
    return unwrap(data);
  },

  list: async (params = {}) => {
    const { data } = await api.get("/admin/payouts", { params });
    return unwrap(data);
  },

  getById: async (id) => {
    const { data } = await api.get(`/admin/payouts/${id}`);
    return unwrap(data);
  },

  approve: async (id) => {
    const { data } = await api.patch(`/admin/payouts/${id}/approve`);
    return unwrap(data);
  },

  markPaid: async (id, payload) => {
    const { data } = await api.patch(`/admin/payouts/${id}/mark-paid`, payload);
    return unwrap(data);
  },

  cancel: async (id, payload = {}) => {
    const { data } = await api.patch(`/admin/payouts/${id}/cancel`, payload);
    return unwrap(data);
  },

  verifyPayoutAccount: async (id, payload = {}) => {
    const { data } = await api.patch(
      `/admin/payout-accounts/${id}/verify`,
      payload,
    );
    return unwrap(data);
  },

  rejectPayoutAccount: async (id, payload) => {
    const { data } = await api.patch(
      `/admin/payout-accounts/${id}/reject`,
      payload,
    );
    return unwrap(data);
  },
};

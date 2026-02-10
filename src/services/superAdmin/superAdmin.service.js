import api from "../../utils/axiosInstance";

const unwrap = (res) => {
  // supports: { success, data: {...} } OR { data: {...} } OR flattened {...}
  if (!res) return res;
  if (res.success !== undefined && res.data !== undefined) return res.data;
  if (res.data !== undefined) return res.data;
  return res;
};

export const superAdminService = {
  getSchools: async (params = {}) => {
    try {
      const { data } = await api.get(`/admin/schools`, { params });
      return unwrap(data); // expected: { schools, pagination }
    } catch (error) {
      throw error?.response?.data || { message: error.message };
    }
  },

  getParents: async (params = {}) => {
    const { data } = await api.get(`/admin/parents`, { params });
    return data?.data || data;
  },

  updateUser: async (userId, payload) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}`, payload);
      return data?.data?.data || data?.data || data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },
};

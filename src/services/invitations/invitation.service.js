import api from "../../utils/axiosInstance";

/**
 * Public invitation APIs (no auth required)
 * Backend endpoints expected:
 * - GET  /invitations/validate?inviteId=...&ticket=...
 * - POST /invitations/accept { inviteId, ticket, ...optional profile fields }
 */
export const invitationService = {
  validate: async ({ inviteId, ticket }) => {
    try {
      const { data } = await api.get(`/invitations/validate`, {
        params: { inviteId, ticket },
      });
      return data?.data || data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },

  accept: async ({ inviteId, ticket, fullName, password }) => {
    try {
      const { data } = await api.post(`/invitations/accept`, {
        inviteId,
        ticket,
        fullName,
        password,
      });
      return data?.data || data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },
};

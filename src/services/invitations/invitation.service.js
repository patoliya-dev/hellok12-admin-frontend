import api from "../../utils/axiosInstance";

/**
 * Public invitation APIs (no auth required)
 * Backend endpoints expected:
 * - GET  /invitations/validate?inviteId=...&ticket=...
 * - POST /invitations/accept { inviteId, ticket, ...optional profile fields }
 */
export const invitationService = {
  /**
   * Get all teachers for a school
   */
  getTeachers: async () => {
    try {
      const { data } = await api.get(`/school/teachers`);
      return data;
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Invite a teacher to the school
   * @param {Object} inviteData - { email, schoolId, message }
   */
  inviteTeacher: async ({ email, message, schoolId }) => {
    try {
      const { data } = await api.post("/school/teacher/invite", {
        email,
        message,
        schoolId,
      });
      return data?.data || data;
    } catch (error) {
      console.error("Failed to invite teacher:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Admin: send a reminder/request to complete profile for a given invitation.
   * Backend should implement this endpoint.
   */
  requestInvitationProfile: async (invitationId, payload = {}) => {
    try {
      const { data } = await api.post(
        `/school/invitations/${invitationId}/request-profile`,
        payload,
      );
      return data?.data?.data || data?.data || data;
    } catch (error) {
      console.error("Failed to request invitation profile:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  approveRejectTeacher: async ({ teacherId, action }) => {
    try {
      const { data } = await api.post(
        `/school/teachers/${teacherId}/approval`,
        { action },
      );
      return data?.data || data;
    } catch (error) {
      console.error("Failed to approve/reject teacher:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Get all students for a school with pagination
   * @param {Object} params - { page, limit, search, status }
   */
  getStudents: async (params = {}) => {
    try {
      const { data } = await api.get(`/school/students`, { params });
      return data;
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Invite a student to the school
   * @param {Object} inviteData - { email, schoolId, message }
   */
  inviteStudent: async ({ email, message }) => {
    try {
      const { data } = await api.post("/school/student/invite", {
        email,
        message,
      });
      return data?.data || data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },
  /**
   * Invite a student to the hellok12
   * @param {Object} inviteData - { email, schoolId, message }
   */
  inviteParent: async ({ email, message }) => {
    try {
      const { data } = await api.post("/school/parent/invite", {
        email,
        message,
      });
      return data?.data || data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },
  /**
   * Get upcoming lessons for a school
   * @param {Object} params - { limit }
   */
  // getUpcomingLessons: async (params = {}) => {
  //   try {
  //     const queryParams = new URLSearchParams();
  //     if (params.limit) queryParams.append("limit", params.limit);

  //     const queryString = queryParams.toString();
  //     const url = `/school/upcoming-lessons${
  //       queryString ? `?${queryString}` : ""
  //     }`;

  //     const { data } = await api.get(url);
  //     return data?.data?.data || data?.data || data;
  //   } catch (error) {
  //     console.error("Failed to fetch upcoming lessons:", error);
  //     throw error.response?.data || { error: error.message };
  //   }
  // },

  getUpcomingLessons: async ({ limit = 3, days = 7, signal } = {}) => {
    try {
      const { data } = await api.get("/lessons/upcoming", {
        params: { limit, days },
        signal,
      });
      return data?.data?.data || data?.data || data;
    } catch (error) {
      console.error("Failed to fetch upcoming lessons:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  getInvitations: async ({
    role,
    teacherType,
    status,
    search,
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      const params = new URLSearchParams();
      if (role) params.set("role", role);
      if (teacherType) params.set("teacherType", teacherType);
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await api.get(`/school/invitations?${params.toString()}`);
      // assuming createSuccessResponse => { data: { invitations, pagination } }
      return res?.data?.data;
    } catch (error) {
      console.error("Failed to get invitations:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  cancelInvitation: async (invitationId) => {
    try {
      const { data } = await api.post(
        `/school/invitations/${invitationId}/cancel`,
      );
      return data?.data?.data || data?.data || data;
    } catch (error) {
      console.error("Failed to cancel invitation:", error);
      throw error.response?.data || { error: error.message };
    }
  },
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

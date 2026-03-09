import api from "../../utils/axiosInstance";

export const getNotifications = async (params = {}) => {
  const { data } = await api.get("/notifications", { params });
  return data?.data || { items: [], total: 0, page: 1, limit: 20, pages: 1 };
};

export const getUnreadNotificationCount = async () => {
  const { data } = await api.get("/notifications/unread-count");
  return Number(data?.data?.unreadCount || 0);
};

export const markNotificationAsRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data?.data || null;
};

export const markAllNotificationsAsRead = async (payload = {}) => {
  const { data } = await api.patch("/notifications/read-all", payload);
  return Number(data?.data?.modifiedCount || 0);
};

export const deleteNotificationById = async (id) => {
  const { data } = await api.delete(`/notifications/${id}`);
  return !!data?.data?.removed;
};

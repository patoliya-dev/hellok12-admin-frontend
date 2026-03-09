import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
} from "../../services/notifications/notification.service";

const initialState = {
  items: [],
  unreadCount: 0,
  pagination: { total: 0, page: 1, limit: 20, pages: 1 },
  loadingList: false,
  loadingUnreadCount: false,
  mutating: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getNotifications(params);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to fetch notifications",
      );
    }
  },
);

export const fetchNotificationUnreadCount = createAsyncThunk(
  "notifications/fetchNotificationUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      return await getUnreadNotificationCount();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch unread notification count",
      );
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      return await markNotificationAsRead(id);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to mark notification as read",
      );
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (payload = {}, { rejectWithValue }) => {
    try {
      return await markAllNotificationsAsRead(payload);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to mark all notifications as read",
      );
    }
  },
);

export const removeNotification = createAsyncThunk(
  "notifications/removeNotification",
  async (id, { rejectWithValue }) => {
    try {
      await deleteNotificationById(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to delete notification",
      );
    }
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload?.items || [];
        state.pagination = {
          total: Number(action.payload?.total || 0),
          page: Number(action.payload?.page || 1),
          limit: Number(action.payload?.limit || 20),
          pages: Number(action.payload?.pages || 1),
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload || action.error?.message || "Failed to fetch notifications";
      })
      .addCase(fetchNotificationUnreadCount.pending, (state) => {
        state.loadingUnreadCount = true;
      })
      .addCase(fetchNotificationUnreadCount.fulfilled, (state, action) => {
        state.loadingUnreadCount = false;
        state.unreadCount = Number(action.payload || 0);
      })
      .addCase(fetchNotificationUnreadCount.rejected, (state, action) => {
        state.loadingUnreadCount = false;
        state.error =
          action.payload || action.error?.message || "Failed to fetch unread notification count";
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated?._id) return;

        const found = state.items.find((item) => item._id === updated._id);
        if (found && !found.isRead) {
          found.isRead = true;
          found.readAt = updated.readAt || new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        const modifiedCount = Number(action.payload || 0);
        if (modifiedCount > 0) {
          state.items = state.items.map((item) => ({
            ...item,
            isRead: true,
            readAt: item.readAt || new Date().toISOString(),
          }));
          state.unreadCount = 0;
        }
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        const id = action.payload;
        const existing = state.items.find((item) => item._id === id);
        if (existing && !existing.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter((item) => item._id !== id);
      });
  },
});

export const selectNotifications = (state) => state.notifications.items;
export const selectNotificationUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.loadingList;
export const selectNotificationsPagination = (state) => state.notifications.pagination;

export default notificationsSlice.reducer;

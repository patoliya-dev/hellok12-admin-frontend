import axios from "axios";
import { getAccessToken, setAccessToken, clearAuthStorage } from "./storage";

// Base URL from env
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || "/api";

/**
 * List of endpoints to exclude from triggering token refresh logic.
 * Add any other auth-related endpoints here to prevent refresh in those calls.
 */
const EXCLUDED_URLS_FOR_REFRESH = ["/auth/login", "/auth/refresh-token"];

/**
 * Axios instance for API calls with token refresh handling.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // for httpOnly cookie refresh token
  headers: { "Content-Type": "application/json" },
});

/**
 * Attach access token to request headers
 */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Attach user's timezone (always up-to-date, real-time)
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g., "Asia/Kolkata"
    if (timezone) {
      config.headers["x-timezone"] = timezone;
    }
  } catch {
    // Safari incognito or rare cases - safe fallback
    config.headers["x-timezone"] = "UTC";
  }

  return config;
});

/**
 * Queue for pending requests while refreshing token
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/**
 * Response interceptor: handle 401 errors and attempt token refresh
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // Check for skipRefresh flag in request config
    if (originalRequest.skipRefresh) {
      return Promise.reject(error);
    }

    // Exclude requests to certain URLs (like login, refresh) from refresh logic
    if (
      EXCLUDED_URLS_FOR_REFRESH.some((url) =>
        originalRequest.url?.includes(url),
      )
    ) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized for retry logic and refresh flow
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
        const newToken = refreshResponse.data?.accessToken;
        if (!newToken) {
          throw new Error("No access token in refresh response");
        }
        setAccessToken(newToken);
        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthStorage();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

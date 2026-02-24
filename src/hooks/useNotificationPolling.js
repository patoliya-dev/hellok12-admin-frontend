import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchNotificationUnreadCount } from "../reducers/notifications/notificationsSlice";

const BASE_INTERVAL_MS = 45 * 1000;
const MAX_INTERVAL_MS = 5 * 60 * 1000;

export default function useNotificationPolling(enabled = true) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return undefined;

    let stopped = false;
    let timerId = null;
    let failureCount = 0;

    const schedule = (delayMs) => {
      if (stopped) return;
      timerId = window.setTimeout(tick, delayMs);
    };

    const tick = async () => {
      if (stopped) return;

      if (document.visibilityState !== "visible") {
        schedule(15 * 1000);
        return;
      }

      try {
        await dispatch(fetchNotificationUnreadCount()).unwrap();
        failureCount = 0;
        schedule(BASE_INTERVAL_MS);
      } catch {
        failureCount += 1;
        const delay = Math.min(BASE_INTERVAL_MS * 2 ** failureCount, MAX_INTERVAL_MS);
        schedule(delay);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        dispatch(fetchNotificationUnreadCount());
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    dispatch(fetchNotificationUnreadCount());
    schedule(BASE_INTERVAL_MS);

    return () => {
      stopped = true;
      if (timerId) window.clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dispatch, enabled]);
}

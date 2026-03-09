// FE utils (put anywhere you keep helpers)
export const formatDateForDateInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  // Use UTC parts to avoid TZ shifting the day
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // <-- "YYYY-MM-DD"
};

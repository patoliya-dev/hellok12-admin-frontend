export function normalizeToHHMM24(time) {
  if (!time || typeof time !== "string") return null;
  const t = time.trim();

  // 24h: allow "9:00" or "09:00" or "23:59"
  const re24 = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  const m24 = t.match(re24);
  if (m24) {
    const hh = String(Number(m24[1])).padStart(2, "0");
    const mm = m24[2];
    return `${hh}:${mm}`;
  }

  // 12h: "9:00 AM", "09:00 pm", "12:30 PM"
  const re12 = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i;
  const m12 = t.match(re12);
  if (m12) {
    let hh = Number(m12[1]);
    const mm = m12[2];
    const ampm = m12[3].toUpperCase();
    if (ampm === "AM" && hh === 12) hh = 0;
    if (ampm === "PM" && hh !== 12) hh += 12;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }

  return null;
}

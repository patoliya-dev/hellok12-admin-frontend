export function normalizeTime12h(input) {
  if (input == null) return undefined;
  let s = String(input).trim();
  if (s === "") return "12:00 PM";
  s = s.toUpperCase().replace(/\s+/g, " ");

  const m24 = s.match(/^(\d{1,2}):([0-5]\d)$/);
  if (m24) {
    let h = parseInt(m24[1], 10),
      m = parseInt(m24[2], 10);
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
  }

  const mHour = s.match(/^(\d{1,2})\s*(AM|PM)$/);
  if (mHour) {
    let h = parseInt(mHour[1], 10);
    const suffix = mHour[2];
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:00 ${suffix}`;
  }

  const mWeird = s.match(/^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/);
  if (mWeird) {
    let h = parseInt(mWeird[1], 10),
      m = parseInt(mWeird[2], 10);
    const suffix = mWeird[3];
    if (h > 12) h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
  }
  return s; // already OK or schema will reject
}

export const pad = (n) => String(n).padStart(2, "0");

export const toISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

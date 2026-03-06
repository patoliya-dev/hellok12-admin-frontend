import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import ISO6391 from "iso-639-1";

export const successToast = (message) => {
  toast.success(message, {
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const infoToast = (message) => {
  toast.info(message, {
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function titleCase(label) {
  return (
    label?.charAt(0)?.toUpperCase() +
    label
      ?.slice(1)
      ?.split(/(?=[A-Z])/)
      ?.join("")
  );
}

export const copyToClipboard = (text) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  successToast("Copied to clipboard!");
};

export const getAllCountries = () => {
  const countries = Country.getAllCountries();
  return countries?.map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));
};

export const getAllStates = (country) => {
  const states = State.getStatesOfCountry(country);
  return states?.map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));
};

export const getAllCities = (country, state) => {
  const cities = City.getCitiesOfState(country, state);
  return cities?.map((city) => ({
    label: city.name,
    value: city.name,
  }));
};

export const languageOptions = ISO6391.getAllCodes().map((code) => ({
  value: code,
  label: ISO6391.getName(code),
}));

export const getLanguageName = (code) => {
  return ISO6391.getName(code);
};

// utils/objectPath.js
export function setIn(obj, path, value) {
  const segs = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = clone;

  for (let i = 0; i < segs.length; i++) {
    const key = segs[i];
    const isLast = i === segs.length - 1;
    if (isLast) {
      cur[key] = value;
      break;
    }
    const nextKey = segs[i + 1];
    const shouldBeArray = /^\d+$/.test(nextKey); // next is an index
    const existing = cur[key];

    if (existing === undefined) {
      cur[key] = shouldBeArray ? [] : {};
    } else {
      cur[key] = Array.isArray(existing) ? [...existing] : { ...existing };
    }
    cur = cur[key];
  }
  return clone;
}

export function getIn(obj, path, fallback = undefined) {
  if (!obj) return fallback;
  const segs = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  let cur = obj;
  for (const k of segs) {
    if (cur == null) return fallback;
    cur = cur[k];
  }
  return cur === undefined ? fallback : cur;
}

export function to12hTime(input) {
  if (!input) return "";
  let s = String(input).trim().toUpperCase().replace(/\s+/g, " ");
  const ampmGiven = s.includes("AM") || s.includes("PM");
  const hhmm = s.replace(/AM|PM/g, "").trim();
  let [hStr, mStr = "00"] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10);
  if (isNaN(h) || h < 0 || h > 23) h = 0;
  if (isNaN(m) || m < 0 || m > 59) m = 0;

  if (!ampmGiven) {
    const suffix = h >= 12 ? "PM" : "AM";
    const twelve = h % 12 || 12;
    return `${String(twelve).padStart(2, "0")}:${String(m).padStart(
      2,
      "0",
    )} ${suffix}`;
  } else {
    const isPM = s.includes("PM");
    if (h === 0) h = 12;
    if (h > 12) h = h % 12;
    const hh = String(h || 12).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${hh}:${mm} ${isPM ? "PM" : "AM"}`;
  }
}

export const safeParseArray = (s) => {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

// body.lessons.0.schedule.date -> lessons[0].schedule.date
export const toBracketPath = (p) =>
  String(p || "")
    .replace(/^body\./, "")
    .replace(/\.([0-9]+)(?=\.|$)/g, "[$1]");

export const buildQueryParams = (filters, pagination) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === "" || value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      params.append(key, JSON.stringify(value));
    } else if (typeof value === "boolean") {
      params.append(key, String(value));
    } else {
      params.append(key, value);
    }
  });

  params.append("limit", pagination.limit);
  params.append("offset", pagination.offset);

  return params.toString();
};

export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

/**
 * Safe one-line address formatter.
 * Works with:
 * - your manual address object { line1, line2, city, state, postalCode, country }
 * - partial objects
 * - string address (fallback)
 */
export function formatAddressOneLine(address) {
  if (!address) return "";

  // If someone passes string (old flow)
  if (typeof address === "string") {
    return address.trim();
  }

  const parts = [];

  const line1 = String(address.line1 || "").trim();
  const line2 = String(address.line2 || "").trim();

  const city = String(address.city || "").trim();
  const state = String(address.state || "").trim();
  const postalCode = String(address.postalCode || "").trim();
  const country = String(address.country || "").trim();

  // Prefer common human-readable ordering
  if (line1) parts.push(line1);
  if (line2) parts.push(line2);

  const cityStateZip = [city, state, postalCode]
    .filter(Boolean)
    .join(", ")
    .replace(/,\s*,/g, ",");
  if (cityStateZip) parts.push(cityStateZip);

  if (country) parts.push(country);

  return parts.filter(Boolean).join(", ");
}

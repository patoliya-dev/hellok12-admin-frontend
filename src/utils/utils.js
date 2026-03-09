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

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
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

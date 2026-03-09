export const isOk = (res) => res?.success === true;

export const normalizeErr = (err) => {
  const http = err?.response?.status ?? 0;
  const body = err?.response?.data;
  if (body?.success === false) {
    return {
      http,
      code: body.error || body.message || "UNKNOWN",
      message: body.error || body.message || "Request failed",
      details: body.details || null,
    };
  }
  return { http, code: "UNKNOWN", message: err?.message || "Request failed" };
};

export const cleanParams = (obj = {}) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );

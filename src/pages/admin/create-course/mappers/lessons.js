import { normalizeToHHMM24 } from "../../../../utils/time24h";
import { normalizeTime12h } from "../../../../utils/time12h";
import { formatDateForDateInput } from "../../../../utils/formatters";

// ---------- internal helpers ----------
const normalizeDateOnly = (value) => {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value.slice(0, 10);
  return "";
};

const normalizeTimeTo24 = (val) => {
  if (!val) return "";
  const s = String(val).trim();
  if (!s) return "";
  return normalizeToHHMM24(s) || s; // if already 24h, keep it
};

const normalizeTeacherId = (v) => {
  if (!v) return "";
  return String(v);
};

// Map BE -> UI
export function mapLessonFromApi(l) {
  return {
    _id: l?._id,
    title: l?.title || "",
    description: l?.description || "",
    assignedTeacher: normalizeTeacherId(l?.teacherId || ""),
    isTrialAvailable: !!l?.isTrialAvailable,
    trialCapacity: l?.trialCapacity ?? "",
    order: typeof l?.order === "number" ? l.order : undefined,
    schedule: {
      // Keep UI always "YYYY-MM-DD"
      date: l?.schedule?.date ? String(l.schedule.date).slice(0, 10) : "",
      // Keep as-is (could be 12h or 24h depending on BE); UI can display either
      time: l?.schedule?.time || "",
      duration: l?.schedule?.duration ?? 60,
    },
  };
}

// Map UI -> BE (create)
export function mapLessonToCreatePayload(l) {
  // schedule.date expected from input[type=date] => "YYYY-MM-DD"
  const date =
    typeof l?.schedule?.date === "string"
      ? l.schedule.date
      : l?.schedule?.date
        ? formatDateForDateInput(l.schedule.date)
        : undefined;

  // Prefer sending 24h to BE for consistency
  const timeRaw = l?.schedule?.time || "";
  const time24 = normalizeTimeTo24(timeRaw) || undefined;

  return {
    title: (l?.title || "").trim(),
    description: (l?.description || "").trim() || undefined,
    isTrialAvailable: !!l?.isTrialAvailable,
    trialCapacity: l?.isTrialAvailable
      ? Number(l?.trialCapacity || 0)
      : undefined,
    order: typeof l?.order === "number" ? l.order : undefined,
    schedule: {
      date,
      time: time24,
      duration: Number(l?.schedule?.duration || 60),
    },
    // aligned with BE
    teacherId: l?.assignedTeacher ? String(l.assignedTeacher) : undefined,
  };
}

// Build partial update for a single lesson (send only changed fields)
export function buildPartialUpdate(oldL, newL) {
  const patch = { lessonId: String(oldL._id) };

  // ---------- Teacher diff (REQUIRED for BE recompute teachers) ----------
  const oldTeacher = normalizeTeacherId(
    oldL?.assignedTeacher || oldL?.teacherId || "",
  );

  const newTeacher = normalizeTeacherId(newL?.assignedTeacher || "");

  if (newTeacher && newTeacher !== oldTeacher) {
    patch.teacherId = newTeacher;
  }

  // ---------- Scalars ----------
  const oldTitle = (oldL?.title || "").trim();
  const newTitle = (newL?.title || "").trim();
  if (newTitle !== oldTitle) patch.title = newTitle;

  const oldDesc = (oldL?.description || "").trim();
  const newDesc = (newL?.description || "").trim();
  if (newDesc !== oldDesc) patch.description = newDesc; // allow empty string if user cleared

  if (!!newL?.isTrialAvailable !== !!oldL?.isTrialAvailable) {
    patch.isTrialAvailable = !!newL?.isTrialAvailable;
  }

  const newCap = newL?.isTrialAvailable
    ? Number(newL?.trialCapacity || 0)
    : undefined;
  const oldCap = oldL?.isTrialAvailable
    ? Number(oldL?.trialCapacity || 0)
    : undefined;
  if (newCap !== oldCap) patch.trialCapacity = newCap;

  if (typeof newL?.order === "number" && newL.order !== oldL?.order) {
    patch.order = newL.order;
  }

  // ---------- Schedule diff (NO Date objects; avoid TZ drift) ----------
  const sOld = oldL?.schedule || {};
  const sNew = newL?.schedule || {};

  const schedulePatch = {};

  const oldDateStr = normalizeDateOnly(sOld.date);
  const newDateStr = normalizeDateOnly(sNew.date);

  if (newDateStr && newDateStr !== oldDateStr) {
    // send string "YYYY-MM-DD" (BE expects this)
    schedulePatch.date = newDateStr;
  }

  // Compare time semantically in 24h
  const oldTime24 = normalizeTimeTo24(sOld.time || "");
  const newTimeInput = sNew.time || "";

  // UI might store 12h; normalize to 24h for compare + payload
  const newTime12 =
    normalizeTime12h(newTimeInput) || String(newTimeInput).trim();
  const newTime24 = normalizeTimeTo24(newTime12);

  if (newTime24 && newTime24 !== oldTime24) {
    // send 24h to BE (stable)
    schedulePatch.time = newTime24;
  }

  const oldDur = Number(sOld.duration || 0);
  const newDur = Number(sNew.duration || 0);
  if (newDur && newDur !== oldDur) {
    schedulePatch.duration = newDur;
  }

  if (Object.keys(schedulePatch).length) {
    patch.schedule = schedulePatch;
  }

  // If nothing changed (only lessonId exists), return null so we filter it out
  return Object.keys(patch).length > 1 ? patch : null;
}

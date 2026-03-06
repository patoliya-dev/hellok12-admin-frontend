import { setIn } from "../../../../utils/utils";

export function applyLessonApiErrorsToForm(fields, setErrors) {
  if (!Array.isArray(fields) || !fields.length) return;

  setErrors((prev) => {
    let next = { ...(prev || {}) };

    for (const f of fields) {
      if (!f?.path || !f?.message) continue;

      // Strip "body." and convert ".<number>" to "[<number>]"
      let p = String(f.path)
        .replace(/^body\./, "")
        .replace(/\.([0-9]+)(?=\.|$)/g, "[$1]");

      // Example: "lessons[0].schedule.date"
      next = setIn(next, p, f.message);
    }
    return next;
  });
}

// body.updates.0.schedule.time -> updates[0] -> find lessonId -> find formIndex -> lessons[formIndex].schedule.time
export function applyUpdateApiErrorsToForm(
  fields,
  lastSubmittedUpdates,
  currentLessons,
  setErrors,
) {
  if (
    !Array.isArray(fields) ||
    !fields.length ||
    !Array.isArray(lastSubmittedUpdates)
  )
    return;

  const byLessonIdToFormIndex = new Map();
  currentLessons.forEach((l, idx) => {
    if (l._id) byLessonIdToFormIndex.set(String(l._id), idx);
  });

  setErrors((prev) => {
    let next = { ...(prev || {}) };

    for (const f of fields) {
      const rawPath = String(f.path || "");
      if (!rawPath.startsWith("body.updates.")) continue;

      // Extract update index
      const m = rawPath.match(/^body\.updates\.(\d+)\.(.+)$/);
      if (!m) continue;

      const updIdx = Number(m[1]);
      const tail = m[2]; // e.g., "schedule.time"

      const u = lastSubmittedUpdates[updIdx];
      if (!u?.lessonId) continue;

      const formIdx = byLessonIdToFormIndex.get(String(u.lessonId));
      if (formIdx === undefined) continue;

      const formPath = `lessons[${formIdx}].${tail}`;
      next = setIn(next, formPath, f.message || "Invalid value");
    }

    return next;
  });
}

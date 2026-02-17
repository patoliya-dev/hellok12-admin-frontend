// Diff original vs current UI lessons
// Caller passes buildPartialUpdate(old, next) to avoid import cycles.
export function buildLessonMutations(
  original = [],
  current = [],
  buildPartialUpdate,
) {
  const byId = new Map(
    original.filter((x) => x?._id).map((x) => [String(x._id), x]),
  );

  const deletes = [];
  const updates = [];
  const creates = [];

  const currentIds = new Set(
    current.filter((x) => x?._id).map((x) => String(x._id)),
  );

  // Detect deletions
  for (const o of original) {
    if (o?._id && !currentIds.has(String(o._id))) {
      deletes.push(String(o._id));
    }
  }

  // Detect creates & updates
  for (const n of current) {
    if (!n?._id) {
      creates.push(n);
      continue;
    }

    const old = byId.get(String(n._id));
    if (!old || typeof buildPartialUpdate !== "function") continue;

    const patch = buildPartialUpdate(old, n);
    if (patch) updates.push(patch);
  }

  return { creates, updates, deletes };
}

/**
 * @typedef {Object} RoleData
 * @property {string} role
 * @property {string} [userType]
 */

/** Allowed tabs */
const ALLOWED_TABS = ["signin", "signup"];

/** Allowed roles */
const ALLOWED_ROLES = ["student/parent", "teacher"];

/** Allowed userTypes */
const ALLOWED_USER_TYPES = ["student", "parent"];

/**
 * Parse and validate the URL hash string for tab, role, and userType.
 * Expected format: "tab|role|userType" where role and userType optional.
 * Returns an object with tab and optional roleData, or default safe values.
 *
 * @param {string} hash
 * @returns {{ tab: string, roleData: RoleData|null }}
 */
export function parseAuthHash(hash) {
  if (!hash) {
    return { tab: "signin", roleData: null };
  }

  const parts = hash.replace(/^#/, "").split("|");
  const tab = ALLOWED_TABS.includes(parts[0]) ? parts[0] : "signin";

  let roleData = null;
  if (tab === "signup") {
    const role = parts[1];
    const userType = parts[2];
    if (ALLOWED_ROLES.includes(role)) {
      roleData = { role };
      if (role === "student/parent" && ALLOWED_USER_TYPES.includes(userType)) {
        roleData.userType = userType;
      }
    }
  }

  return { tab, roleData };
}

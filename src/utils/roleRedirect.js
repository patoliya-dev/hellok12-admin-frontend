export const getDefaultRedirectForUser = (user) => {
  const role = user?.role;

  if (role === "super_admin") return "/admin/dashboard";
  if (role === "school") return "/school/dashboard";
  if (role === "teacher") return "/teacher/dashboard";
  return "/";
};

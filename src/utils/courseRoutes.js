export const getManageCoursesRoute = (role) => {
  switch (role) {
    case "admin":
      return {
        base: "/admin/courses",
        children: [
          "/admin/create-course",
          "/admin/view-course",
          "/admin/create-lesson",
          "/admin/view-lesson",
          "/admin/lessons/",
        ],
      };

    default:
      return null;
  }
};

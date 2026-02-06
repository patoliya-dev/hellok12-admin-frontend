export const getManageCoursesRoute = (role) => {
  switch (role) {
    case "teacher":
      return {
        base: "/teacher/manage-courses",
        children: [
          "/teacher/create-course",
          "/teacher/edit-course",
          "/teacher/create-lesson",
          "/teacher/edit-lesson",
          "/teacher/lessons/",
        ],
      };

    case "school":
      return {
        base: "/school/manage-courses",
        children: [
          "/school/create-course",
          "/school/edit-course",
          "/school/create-lesson",
          "/school/edit-lesson",
          "/school/lessons/",
        ],
      };

    default:
      return null;
  }
};

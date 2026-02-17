const commonBreadCrumbData = {
  add: [
    { label: "Manage Courses", path: "/admin/courses" },
    { label: "Create New Course", path: "#", current: true },
  ],
  edit: [
    { label: "Courses", path: "/admin/courses" },
    { label: "View Course", path: "#", current: true },
  ],
};

const steps = [
  { id: 1, title: "Course Info" },
  { id: 2, title: "Lesson Info" },
];

const lessonTypeOptions = [
  { value: "1-on-1", label: "1-on-1" },
  { value: "group", label: "Group" },
];

const lessonModeOptions = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-Person" },
];

export { commonBreadCrumbData, steps, lessonTypeOptions, lessonModeOptions };

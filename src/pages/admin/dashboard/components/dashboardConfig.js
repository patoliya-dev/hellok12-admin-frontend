export const CARD_CONFIG = [
  {
    key: "totalSchools",
    title: "Total Schools",
    icon: "School",
    iconBg: "#1D4ED8",
  },
  {
    key: "totalTeachers",
    title: "Total Teachers",
    icon: "Users",
    iconBg: "#6366F1",
  },
  {
    key: "totalStudents",
    title: "Total Students",
    icon: "GraduationCap",
    iconBg: "#10B981",
  },
  {
    key: "totalCourses",
    title: "Total Courses",
    icon: "BookCheck",
    iconBg: "#65A30D",
  },
];

export const QUICK_ACTIONS = [
  {
    title: "Add Student",
    subtitle: "Register new student",
    icon: "UserPlus",
    iconBg: "#1D4ED8",
    to: "/admin/students",
  },
  {
    title: "Add Teacher",
    subtitle: "Onboard new instructor",
    icon: "GraduationCap",
    iconBg: "#6366F1",
    to: "/admin/teachers",
  },
  {
    title: "Add School",
    subtitle: "Partner with institution",
    icon: "Building2",
    iconBg: "#10B981",
    to: "/admin/schools",
  },
  {
    title: "View Course",
    subtitle: "View course content",
    icon: "NotebookPen",
    iconBg: "#D97706",
    to: "/admin/courses",
  },
];

export const defaultOverview = {
  cards: {
    totalSchools: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
  },
  charts: {
    schoolTeachersGrowth: [],
    independentTeachersGrowth: [],
    studentRegistrationGrowth: [],
  },
  trends: {
    studentRegistration: {
      deltaPercentage: 0,
      direction: "up",
    },
  },
};


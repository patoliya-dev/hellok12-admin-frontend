import { Routes, Route } from "react-router-dom";

import NotFound from "../pages/NotFound";
// import SchoolLessons from "../pages/school/lessons";
// import ScheduledLessons from "../pages/school/scheduled-lessons";
// import ManageTeachers from "../pages/school/manage-teachers";
import SchoolDashboard from "../pages/school/dashboard";
// import ManageStudents from "../pages/school/manage-students";
// import Earnings from "../pages/school/earnings";
// import ProfileAccountSettings from "../pages/school/profile-settings";

// import ManageCourses from "../pages/teacher/manage-courses";
// import CreateCourse from "../pages/teacher/create-course";
// import LessonsList from "../pages/teacher/lessons-list";

// import ProtectedRoute from "../components/ProtectedRoute";
// import { canManageCourses } from "../utils/authz";

const SchoolRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<SchoolDashboard />} />
      {/* <Route path="/lessons" element={<SchoolLessons />} /> */}
      {/* <Route path="/scheduled-lessons" element={<ScheduledLessons />} /> */}
      {/* <Route path="/manage-teachers" element={<ManageTeachers />} />
      <Route path="/manage-students" element={<ManageStudents />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/profile-settings" element={<ProfileAccountSettings />} /> */}

      {/* Course Management: School allowed */}
      {/* <Route
        element={
          <ProtectedRoute
            allow={canManageCourses}
            redirectTo="/admin/dashboard"
          />
        }
      >
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/edit-course/:courseId" element={<CreateCourse />} />
        <Route path="/edit-lesson/:courseId" element={<CreateCourse />} />
        <Route path="/create-lesson/:courseId" element={<CreateCourse />} />
        <Route path="/lessons/:courseId" element={<LessonsList />} />
      </Route> */}

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SchoolRoutes;

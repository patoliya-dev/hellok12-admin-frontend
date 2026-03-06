import { Routes, Route } from "react-router-dom";

import NotFound from "../pages/NotFound";
import SchoolDashboard from "../pages/admin/dashboard";
import Students from "../pages/admin/students";
import Teachers from "../pages/admin/teachers";
import Schools from "../pages/admin/schools";
import SchoolDetails from "../pages/admin/schools/components/SchoolDetails";
import AdminFinancial from "../pages/admin/financial";

import ManageCourses from "../pages/admin/manage-courses";
import CreateCourse from "../pages/admin/create-course";
import LessonsList from "../pages/admin/lessons-list";

import ProtectedRoute from "../components/ProtectedRoute";
import { canManageCourses } from "../utils/authz";

const SchoolRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<SchoolDashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/schools" element={<Schools />} />
      <Route path="/schools/:schoolId" element={<SchoolDetails />} />
      <Route path="/earning" element={<AdminFinancial />} />

      {/* Course Management: Admin allowed */}
      <Route
        element={
          <ProtectedRoute
            allow={canManageCourses}
            redirectTo="/admin/dashboard"
          />
        }
      >
        <Route path="/courses" element={<ManageCourses />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/view-course/:courseId" element={<CreateCourse />} />
        <Route path="/view-lesson/:courseId" element={<CreateCourse />} />
        <Route path="/create-lesson/:courseId" element={<CreateCourse />} />
        <Route path="/lessons/:courseId" element={<LessonsList />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SchoolRoutes;

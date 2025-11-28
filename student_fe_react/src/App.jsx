import { Routes, Route, Navigate } from "react-router-dom";

// Student imports
import MainLayout from "./modules/student/layouts/MainLayout.jsx";
import DashboardPage from "./modules/student/pages/DashboardPage.jsx";
import ProgramRegisterPage from "./modules/student/pages/ProgramRegisterPage.jsx";
import LibraryPage from "./modules/student/pages/LibraryPage.jsx";
import EventsPage from "./modules/student/pages/EventsPage.jsx";
import CommunityPage from "./modules/student/pages/CommunityPage.jsx";
import HistoryPage from "./modules/student/pages/HistoryPage.jsx";
import ConsultationRequestPage from "./modules/student/pages/ConsultationRequestPage.jsx";
import MyConsultationsPage from "./modules/student/pages/MyConsultationsPage.jsx";

// Tutor imports
import TutorMainLayout from "./modules/tutor/layouts/TutorMainLayout.jsx";
import TutorDashboardPage from "./modules/tutor/pages/TutorDashboardPage.jsx";
import TutorCoursesPage from "./modules/tutor/pages/TutorCoursesPage.jsx";
import TutorCourseDetailPage from "./modules/tutor/pages/TutorCourseDetailPage.jsx";
import TutorLibraryPage from "./modules/tutor/pages/TutorLibraryPage.jsx";
import TutorNotificationsPage from "./modules/tutor/pages/TutorNotificationsPage.jsx";

function App() {
  return (
    <Routes>
      {/* Redirect từ gốc về student */}
      <Route path="/" element={<Navigate to="/student/register" replace />} />

      {/* Layout sinh viên */}
      <Route path="/student" element={<MainLayout />}>
        {/* khi vào /student thì nhảy về /student/register */}
        <Route index element={<Navigate to="register" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="register" element={<ProgramRegisterPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route
          path="consultations/request"
          element={<ConsultationRequestPage />}
        />
        <Route path="consultations" element={<MyConsultationsPage />} />
      </Route>

      {/* Layout Tutor */}
      <Route path="/tutor" element={<TutorMainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TutorDashboardPage />} />
        <Route path="courses" element={<TutorCoursesPage />} />
        <Route path="courses/:courseId" element={<TutorCourseDetailPage />} />
        <Route path="library" element={<TutorLibraryPage />} />
        <Route path="notifications" element={<TutorNotificationsPage />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-2">
                404 - Không tìm thấy trang
              </h1>
              <p className="text-slate-500">
                Vui lòng kiểm tra lại đường dẫn (URL).
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;


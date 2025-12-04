import { Routes, Route, Navigate } from "react-router-dom";

// Import trang Login mới tạo
import Login from "./Login/Login.jsx";

// Student imports...
import StudentLayout from "./modules/student/layouts/StudentLayout.jsx";
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
// PDT imports...
import PDTLayout from "./modules/pdt/layouts/PDTLayout.jsx";
import PDTHomepage from "./modules/pdt/pages/PDTHomepage.jsx";
import PDTAnalytics from "./modules/pdt/pages/PDTAnalytics.jsx";
import PDTRedistribution from "./modules/pdt/pages/PDTRedistribution.jsx";
import PDTFeedback from "./modules/pdt/pages/PDTFeedback.jsx";

function App() {
  return (
    <Routes>
      {/* Trang chủ là trang Login */}
      <Route path="/" element={<Login />} />

      {/* Student routes */}
      <Route path="/student" element={<StudentLayout />}>
        {/* Khi login thành công sẽ nhảy vào dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="register" element={<ProgramRegisterPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="consultations/request" element={<ConsultationRequestPage />} />
        <Route path="consultations" element={<MyConsultationsPage />} />
      </Route>

      {/* PDT routes */}
      <Route path="/pdt" element={<PDTLayout />}>
        <Route index element={<Navigate to="homepage" replace />} />
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
        <Route path="consultations/request" element={<ConsultationRequestPage />} />
        <Route path="consultations" element={<MyConsultationsPage />} />
      </Route>

      {/* PDT routes */}
      <Route path="/pdt" element={<PDTLayout />}>
        <Route index element={<Navigate to="/pdt/homepage" replace />} />
        <Route path="homepage" element={<PDTHomepage />} />
        <Route path="analytics" element={<PDTAnalytics />} />
        <Route path="redistribution" element={<PDTRedistribution />} />
        <Route path="feedback" element={<PDTFeedback />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
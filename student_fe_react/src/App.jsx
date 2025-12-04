import { Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import MainLayout from "./modules/student/layouts/MainLayout.jsx";
import LoginPage from "./modules/auth/pages/LoginPage.jsx";

import DashboardPage from "./modules/student/pages/DashboardPage.jsx";
import ProgramRegisterPage from "./modules/student/pages/ProgramRegisterPage.jsx";
import ConsultationRequestPage from "./modules/student/pages/ConsultationRequestPage.jsx";
import LibraryPage from "./modules/student/pages/LibraryPage.jsx";
import EventsPage from "./modules/student/pages/EventsPage.jsx";
import CommunityPage from "./modules/student/pages/CommunityPage.jsx";
import HistoryPage from "./modules/student/pages/HistoryPage.jsx";
import ProfilePage from "./modules/student/pages/ProfilePage.jsx";

// Tutor imports - Only backend-supported pages
import TutorMainLayout from "./modules/tutor/layouts/TutorMainLayout.jsx";
import TutorDashboardPage from "./modules/tutor/pages/TutorDashboardPage.jsx";
import TutorSessionsPage from "./modules/tutor/pages/TutorSessionsPage.jsx";
import TutorRatingsPage from "./modules/tutor/pages/TutorRatingsPage.jsx";
import TutorFeedbacksPage from "./modules/tutor/pages/TutorFeedbacksPage.jsx";

// PDT imports
import PDTLayout from "./modules/pdt/layouts/PDTLayout.jsx";
import PDTHomepage from "./modules/pdt/pages/PDTHomepage.jsx";
import PDTAnalytics from "./modules/pdt/pages/PDTAnalytics.jsx";
import PDTRedistribution from "./modules/pdt/pages/PDTRedistribution.jsx";
import PDTFeedback from "./modules/pdt/pages/PDTFeedback.jsx";

// Component to handle Auth Callback (token from URL)
function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("bkarch_jwt", token);
      navigate("/student/dashboard");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <div className="min-h-screen flex items-center justify-center">Processing login...</div>;
}

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Backend might redirect to /dashboard?token=... catch it here */}
      <Route path="/dashboard" element={<AuthCallback />} />

      {/* Redirect root to student */}
      <Route path="/" element={<Navigate to="/student/register" replace />} />

      {/* Student routes */}
      <Route path="/student" element={<MainLayout />}>
        <Route index element={<Navigate to="register" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="register" element={<ProgramRegisterPage />} />
        <Route path="consultation" element={<ConsultationRequestPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Layout Tutor - Only backend-supported routes */}
      <Route path="/tutor" element={<TutorMainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TutorDashboardPage />} />
        <Route path="sessions" element={<TutorSessionsPage />} />
        <Route path="ratings" element={<TutorRatingsPage />} />
        <Route path="feedbacks" element={<TutorFeedbacksPage />} />
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

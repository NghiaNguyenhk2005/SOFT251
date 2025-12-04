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

      {/* Redirect từ gốc về student */}
      <Route path="/" element={<Navigate to="/student/register" replace />} />

      {/* Layout sinh viên */}
      <Route path="/student" element={<MainLayout />}>
        {/* khi vào /student thì nhảy về /student/register */}
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


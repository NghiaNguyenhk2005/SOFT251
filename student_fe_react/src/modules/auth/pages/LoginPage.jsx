import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if token is in URL (callback from backend)
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("bkarch_jwt", token);
      navigate("/student/dashboard");
    }
  }, [searchParams, navigate]);

  const handleLogin = () => {
    // Redirect to Backend Auth Endpoint
    // Backend is running on localhost:4000
    window.location.href = "http://localhost:4000/api/v1/auth/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Đăng nhập</h1>
        <p className="text-slate-600 mb-8">
          Hệ thống quản lý Tutor - Sinh viên
        </p>
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>Đăng nhập với HCMUT SSO</span>
        </button>

        <div className="mt-6 text-xs text-slate-400">
          Dành cho sinh viên và giảng viên trường ĐH Bách Khoa TP.HCM
        </div>
      </div>
    </div>
  );
}

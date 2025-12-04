import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../../api/studentApi";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data.data || data); // Adjust based on API response structure
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Không thể tải thông tin cá nhân");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-slate-500">Không tìm thấy thông tin cá nhân</div>;
  }

  // Assuming profile structure based on typical User/Student models
  // user: { fullName, email, ... }, student: { mssv, major, ... }
  // Or flattened. Let's assume a structure and adjust if needed.
  const user = profile.user || profile; 
  const studentInfo = profile.student || {};

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Hồ sơ cá nhân</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-3xl font-bold">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.fullName || "N/A"}</h2>
              <p className="text-slate-500">{user.email || "N/A"}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-violet-50 text-violet-700 text-sm font-medium rounded-full">
                Sinh viên
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-slate-500">Mã số sinh viên</dt>
                <dd className="mt-1 text-lg text-slate-900">{studentInfo.mssv || profile.mssv || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Khoa</dt>
                <dd className="mt-1 text-lg text-slate-900">{studentInfo.major || profile.major || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Niên khóa</dt>
                <dd className="mt-1 text-lg text-slate-900">{studentInfo.enrollmentYear || profile.enrollmentYear || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Trạng thái</dt>
                <dd className="mt-1 text-lg text-slate-900">{user.status || "Active"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

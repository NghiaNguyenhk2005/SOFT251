import { useEffect, useRef, useState } from "react";
import { User, LogOut, Mail, Phone, MapPin, BookOpen, Users, CheckCircle, XCircle, FileText } from "lucide-react";
import { useTutorProfile } from "../../../contexts/TutorContext";

export default function ProfileDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const { tutorProfile, loading } = useTutorProfile();
  const [showProfile, setShowProfile] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
        setShowProfile(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleBackToMenu = () => {
    setShowProfile(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bkarch_jwt');
    window.location.href = '/';
  };

  if (!isOpen) return null;

  const user = tutorProfile?.userId || {};

  // Show full profile view
  if (showProfile) {
    return (
      <div
        ref={dropdownRef}
        className="absolute right-0 top-full mt-2 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-slate-200 z-50"
      >
        {/* Back button */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-2">
          <button
            onClick={handleBackToMenu}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Quay lại
          </button>
          <h3 className="font-semibold text-slate-900 flex-1">Thông tin cá nhân</h3>
        </div>

        {/* Profile Content */}
        <div className="p-4">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-white">
                {user.fullName?.charAt(0) || 'T'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user.fullName || 'Tutor'}</h3>
            <p className="text-sm text-slate-600">{user.faculty || 'Không có thông tin'}</p>
            <p className="text-xs text-slate-500 mt-1">Mã CB: {user.hcmutId || 'N/A'}</p>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-5 h-5 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900 truncate">{user.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Phone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Số điện thoại</p>
                <p className="text-sm font-medium text-slate-900">{user.phoneNumber || tutorProfile?.phoneNumber || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Mã cán bộ</p>
                <p className="text-sm font-medium text-slate-900">{user.hcmutId || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Khoa</p>
                <p className="text-sm font-medium text-slate-900 truncate">{user.faculty || 'Không có thông tin'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Vai trò</p>
                <p className="text-sm font-medium text-slate-900">{user.role || 'TUTOR'}</p>
              </div>
            </div>

            {tutorProfile?.bio && (
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Giới thiệu</p>
                  <p className="text-sm text-slate-900">{tutorProfile.bio}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Users className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Số sinh viên tối đa</p>
                <p className="text-sm font-medium text-slate-900">{tutorProfile?.maxStudents || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              {tutorProfile?.isAcceptingStudents ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-xs text-slate-500">Trạng thái nhận sinh viên</p>
                <p className={`text-sm font-medium ${tutorProfile?.isAcceptingStudents ? 'text-green-600' : 'text-red-600'}`}>
                  {tutorProfile?.isAcceptingStudents ? 'Đang nhận' : 'Không nhận'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Users className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Tổng số sinh viên</p>
                <p className="text-sm font-medium text-slate-900">{tutorProfile?.stats?.totalStudents || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Số môn học</p>
                <p className="text-sm font-medium text-slate-900">{tutorProfile?.subjectIds?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show simple menu
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
    >
      {/* User Info */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-white">
              {user.fullName?.charAt(0) || 'T'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 truncate">
              {user.fullName || 'Tutor'}
            </h4>
            <p className="text-sm text-slate-500 truncate">
              {user.email || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={handleViewProfile}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Xem thông tin cá nhân</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

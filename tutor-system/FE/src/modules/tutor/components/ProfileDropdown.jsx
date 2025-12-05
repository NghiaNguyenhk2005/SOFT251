import { useEffect, useRef, useState } from "react";
import { User, Mail, Phone, LogOut, X, Star, Users, BookOpen, Award } from "lucide-react";
import { useTutorProfile } from "../../../contexts/TutorContext";
import { getTutorSessions } from "../../../services/tutorSessionService";
import { getTutorFeedbacks } from "../../../services/tutorFeedbackService";

export default function ProfileDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const { tutorProfile, loading } = useTutorProfile();
  const [realTimeStats, setRealTimeStats] = useState(null);

  // Calculate real-time stats when dropdown opens
  useEffect(() => {
    if (isOpen && tutorProfile) {
      calculateRealTimeStats();
    }
  }, [isOpen, tutorProfile]);

  const calculateRealTimeStats = async () => {
    try {
      const [sessions, feedbacks] = await Promise.all([
        getTutorSessions(),
        getTutorFeedbacks()
      ]);

      // Calculate unique students
      const uniqueStudents = new Set();
      sessions.forEach(session => {
        if (session.participants) {
          session.participants.forEach(p => {
            const studentId = p.studentId?._id || p.studentId;
            if (studentId) uniqueStudents.add(studentId);
          });
        }
      });

      // Calculate average rating
      const avgRating = feedbacks.length > 0
        ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length
        : 0;

      setRealTimeStats({
        averageRating: avgRating,
        totalReviews: feedbacks.length,
        totalStudents: uniqueStudents.size,
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === 'COMPLETED').length
      });
    } catch (error) {
      console.error('Error calculating real-time stats:', error);
      // Fallback to profile stats
      setRealTimeStats(tutorProfile?.stats || null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div
        ref={dropdownRef}
        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
      >
        <div className="p-6 text-center text-sm text-slate-500">
          Đang tải...
        </div>
      </div>
    );
  }

  const user = tutorProfile?.userId || {};
  // Use real-time stats if available, fallback to profile stats
  const stats = realTimeStats || tutorProfile?.stats || {};

  return (
      <div
        ref={dropdownRef}
        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-visible"
      >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-blue-50">
        <h3 className="font-semibold text-slate-900">Thông tin cá nhân</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/50 transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="p-4">
        {/* Avatar and Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-xl font-bold text-white">
              {user.fullName?.charAt(0) || 'T'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg text-slate-900 truncate">
              {user.fullName || 'Tutor'}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {user.hcmutId || 'N/A'}
            </p>
            {user.faculty && (
              <p className="text-xs text-sky-600 truncate font-medium">
                {user.faculty}
              </p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-900">Đánh giá</span>
              </div>
              <p className="text-lg font-bold text-yellow-900">
                {stats.averageRating?.toFixed(1) || '0.0'} ⭐
              </p>
              <p className="text-[10px] text-yellow-700">
                {stats.totalReviews || 0} lượt đánh giá
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">Sinh viên</span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {stats.totalStudents || 0}
              </p>
              <p className="text-[10px] text-blue-700">
                Tối đa: {tutorProfile?.maxStudents || 200}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-900">Buổi học</span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {stats.totalSessions || 0}
              </p>
              <p className="text-[10px] text-green-700">
                Hoàn thành: {stats.completedSessions || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">Môn dạy</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {tutorProfile?.subjectIds?.length || 0}
              </p>
              <p className="text-[10px] text-purple-700">
                {tutorProfile?.isAcceptingStudents ? '✅ Đang nhận SV' : '🔒 Tạm ngưng'}
              </p>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-4 bg-slate-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700 truncate text-xs">{user.email || 'N/A'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700 text-xs">{user.hcmutId || 'N/A'}</span>
          </div>

          {user.phoneNumber && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-700 text-xs">{user.phoneNumber}</span>
            </div>
          )}

          {user.faculty && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-700 text-xs">{user.faculty}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {tutorProfile?.bio && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-medium text-blue-900 mb-1">💬 Giới thiệu</p>
            <p className="text-xs text-blue-800 line-clamp-3">
              {tutorProfile.bio}
            </p>
          </div>
        )}

        {/* Subjects */}
        {tutorProfile?.subjectIds && tutorProfile.subjectIds.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-700 mb-2">📚 Môn dạy:</p>
            <div className="flex flex-wrap gap-1.5">
              {tutorProfile.subjectIds.map((subject, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-md border border-sky-200"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Logout */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

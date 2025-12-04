import { User, Mail, Award, BookOpen, Star, Users, Phone, MapPin } from "lucide-react";
import { useTutorProfile } from "../../../contexts/TutorContext";

export default function TutorProfilePage() {
  const { tutorProfile, loading } = useTutorProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  const user = tutorProfile?.userId || {};

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Thông tin cá nhân</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-32"></div>
        
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-start -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user.fullName?.charAt(0) || 'T'}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.fullName || 'Tutor'}</h2>
            <p className="text-slate-600">{user.faculty || 'Không có thông tin'}</p>
            <p className="text-sm text-slate-500 mt-1">Mã CB: {user.hcmutId || 'N/A'}</p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-5 h-5 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900 truncate">{user.email || 'N/A'}</p>
              </div>
            </div>

            {user.phoneNumber && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Điện thoại</p>
                  <p className="text-sm font-medium text-slate-900">{user.phoneNumber}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Vai trò</p>
                <p className="text-sm font-medium text-slate-900">{user.role || 'TUTOR'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Trạng thái</p>
                <p className="text-sm font-medium text-green-600">
                  {tutorProfile?.isAcceptingStudents ? '✅ Đang nhận SV' : '🔒 Tạm ngưng'}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {tutorProfile?.bio && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Giới thiệu
              </h3>
              <p className="text-sm text-blue-800">{tutorProfile.bio}</p>
            </div>
          )}

          {/* Subjects */}
          {tutorProfile?.subjectIds && tutorProfile.subjectIds.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Môn dạy
              </h3>
              <div className="flex flex-wrap gap-2">
                {tutorProfile.subjectIds.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-sky-100 text-sky-700 text-sm font-medium rounded-lg border border-sky-200"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info from Backend */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Thông tin bổ sung</h3>
        
        <div className="space-y-4">
          {/* Max Students */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Số sinh viên tối đa</p>
                <p className="text-xs text-slate-500">Giới hạn sinh viên có thể nhận</p>
              </div>
            </div>
            <span className="text-lg font-bold text-sky-600">
              {tutorProfile?.maxStudents || 200}
            </span>
          </div>

          {/* Accepting Students Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Trạng thái nhận sinh viên</p>
                <p className="text-xs text-slate-500">Có đang nhận sinh viên mới không</p>
              </div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              tutorProfile?.isAcceptingStudents 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {tutorProfile?.isAcceptingStudents ? '✅ Đang nhận' : '🔒 Tạm ngưng'}
            </span>
          </div>

          {/* Account Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Trạng thái tài khoản</p>
                <p className="text-xs text-slate-500">Tình trạng hoạt động</p>
              </div>
            </div>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
              {user.status || 'ACTIVE'}
            </span>
          </div>

          {/* Created Date */}
          {tutorProfile?.createdAt && (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Ngày tạo tài khoản</p>
                  <p className="text-xs text-slate-500">Thời gian tham gia hệ thống</p>
                </div>
              </div>
              <span className="text-sm text-slate-600">
                {new Date(tutorProfile.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}

          {/* Last Updated */}
          {tutorProfile?.updatedAt && (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Cập nhật lần cuối</p>
                  <p className="text-xs text-slate-500">Thời gian chỉnh sửa thông tin</p>
                </div>
              </div>
              <span className="text-sm text-slate-600">
                {new Date(tutorProfile.updatedAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

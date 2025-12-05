import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Video, X, Filter, Trash2, CheckCircle } from "lucide-react";
import { getTutorSessions, getSessionStats, cancelSession, completeSession } from "../../../services/tutorSessionService";

const STATUS_COLORS = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  SCHEDULED: "Đã lên lịch",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export default function TutorSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [stats, setStats] = useState({ total: 0, scheduled: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (filterStatus === "ALL") {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(s => s.status === filterStatus));
    }
  }, [filterStatus, sessions]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsData, statsData] = await Promise.all([
        getTutorSessions(),
        getSessionStats()
      ]);
      setSessions(sessionsData);
      setFilteredSessions(sessionsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelSession = async (sessionId) => {
    if (!confirm('Bạn có chắc muốn hủy buổi học này?')) {
      return;
    }

    try {
      await cancelSession(sessionId);
      // Reload data to reflect changes
      loadData();
      // Close modal if open
      setSelectedSession(null);
    } catch (error) {
      console.error('Error cancelling session:', error);
      alert('Lỗi khi hủy buổi học. Vui lòng thử lại.');
    }
  };

  const handleCompleteSession = async (sessionId) => {
    if (!confirm('Xác nhận hoàn thành buổi học này?')) {
      return;
    }

    try {
      await completeSession(sessionId);
      // Reload data to reflect changes
      loadData();
      // Close modal if open
      setSelectedSession(null);
    } catch (error) {
      console.error('Error completing session:', error);
      alert('Lỗi khi hoàn thành buổi học. Vui lòng thử lại.');
    }
  };

  return (
    <div className="py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Buổi học của tôi
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Quản lý tất cả các buổi học, tư vấn và sự kiện của bạn.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-slate-600">Tổng số buổi</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-blue-600">Đã lên lịch</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{stats.scheduled}</div>
        </div>
        <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-green-600">Hoàn thành</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</div>
        </div>
        <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-red-600">Đã hủy</div>
          <div className="text-2xl font-bold text-red-900 mt-1">{stats.cancelled}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Lọc theo:</span>
          <div className="flex gap-2 flex-wrap">
            {["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filterStatus === status
                    ? "bg-sky-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status === "ALL" ? "Tất cả" : STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Đang tải...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            Không có buổi học nào.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{session.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${STATUS_COLORS[session.status]}`}>
                        {STATUS_LABELS[session.status]}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{session.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(session.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{session.participantCount} người tham gia</span>
                      </div>
                      {session.meetLink && (
                        <div className="flex items-center gap-1 text-sky-600">
                          <Video className="w-4 h-4" />
                          <span>Online</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onCancel={handleCancelSession}
          onComplete={handleCompleteSession}
        />
      )}
    </div>
  );
}

// Session Detail Modal
function SessionDetailModal({ session, onClose, onCancel, onComplete }) {
  const canCancel = session.status === 'SCHEDULED';
  const canComplete = session.status === 'SCHEDULED' || session.status === 'IN_PROGRESS';
  const durationHours = session.duration ? Math.floor(session.duration / 60) : 0;
  const durationMins = session.duration ? session.duration % 60 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">{session.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${STATUS_COLORS[session.status]}`}>
                {STATUS_LABELS[session.status]}
              </span>
              {session.hasReport && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                  ✓ Đã có báo cáo
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          {session.description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span>📝</span> Mô tả
              </h4>
              <p className="text-sm text-blue-800">{session.description}</p>
            </div>
          )}

          {/* Time & Duration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-slate-500 mb-1 uppercase">Bắt đầu</h4>
              <p className="text-sm font-medium text-slate-900">
                {new Date(session.startTime).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-slate-500 mb-1 uppercase">Kết thúc</h4>
              <p className="text-sm font-medium text-slate-900">
                {new Date(session.endTime).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-purple-700 mb-1 uppercase">Thời lượng</h4>
              <p className="text-sm font-bold text-purple-900">
                {durationHours > 0 && `${durationHours}h `}
                {durationMins > 0 && `${durationMins}m`}
                {!session.duration && 'N/A'}
              </p>
            </div>
          </div>

          {/* Location & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">📍 Địa điểm</h4>
              <p className="text-sm text-slate-600 bg-slate-50 rounded p-2">{session.location}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">💻 Hình thức</h4>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                session.sessionType === 'ONLINE' 
                  ? 'bg-sky-100 text-sky-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {session.sessionType === 'ONLINE' ? '🌐 Online' : '🏫 Offline'}
              </span>
            </div>
          </div>

          {/* Meet Link */}
          {session.meetLink && (
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-sky-900 mb-2">🔗 Link tham gia</h4>
              <a
                href={session.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sky-600 hover:text-sky-800 hover:underline break-all"
              >
                {session.meetLink}
              </a>
            </div>
          )}

          {/* Participants */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              👥 Danh sách sinh viên ({session.participantCount || session.participants?.length || 0})
            </h4>
            {session.participants && session.participants.length > 0 ? (
              <div className="space-y-2">
                {session.participants.map((participant, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                        {participant.fullName?.charAt(0) || (idx + 1)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {participant.fullName || participant.email || `Sinh viên ${idx + 1}`}
                        </p>
                        {participant.registeredAt && (
                          <p className="text-xs text-slate-500">
                            Đăng ký: {new Date(participant.registeredAt).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                      </div>
                    </div>
                    {participant.attended !== undefined && (
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        participant.attended 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {participant.attended ? '✓ Có mặt' : '○ Vắng'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm bg-slate-50 rounded-lg">
                Chưa có sinh viên nào đăng ký
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex gap-2">
            {canComplete && (
              <button
                onClick={() => onComplete(session.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Hoàn thành
              </button>
            )}
            {!session.hasReport && session.status === 'COMPLETED' && (
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                title="Tạo báo cáo cho buổi học này"
              >
                📄 Tạo báo cáo
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => onCancel(session.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hủy buổi học
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

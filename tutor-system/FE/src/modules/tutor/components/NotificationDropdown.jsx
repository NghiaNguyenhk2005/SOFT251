import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, ExternalLink, CheckCheck } from "lucide-react";
import { fetchTutorNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../../../services/tutorNotificationService";

const iconMap = {
  request: "bg-blue-100 text-blue-600",
  cancellation: "bg-red-100 text-red-600",
  feedback: "bg-green-100 text-green-600",
  reminder: "bg-amber-100 text-amber-600",
};

const typeLabels = {
  'APPOINTMENT_CREATED': '📅 Lịch hẹn mới',
  'APPOINTMENT_CONFIRMED': '✅ Lịch hẹn xác nhận',
  'APPOINTMENT_REJECTED': '❌ Lịch hẹn từ chối',
  'APPOINTMENT_CANCELLED': '🚫 Lịch hẹn hủy',
  'SESSION_CREATED': '📚 Buổi học mới',
  'SESSION_UPDATED': '🔄 Buổi học cập nhật',
  'SESSION_CANCELLED': '⛔ Buổi học hủy',
  'EVALUATION_RECEIVED': '⭐ Đánh giá mới',
  'SCHEDULE_REMINDER': '⏰ Nhắc lịch',
  'SYSTEM_ANNOUNCEMENT': '📢 Thông báo hệ thống',
};

export default function NotificationDropdown({ isOpen, onClose, unreadCount }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchTutorNotifications()
        .then((data) => {
          // Show first 10 notifications in dropdown
          setNotifications(data.slice(0, 10));
        })
        .catch((err) => console.error("Lỗi khi tải thông báo:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

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

  const handleNotificationClick = async (notif) => {
    // Mark as read when clicked
    if (!notif.read) {
      try {
        await markNotificationAsRead(notif.id);
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notif.id ? { ...n, read: true, readAt: new Date().toISOString() } : n)
        );
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }

    // Navigate to related resource if available
    if (notif.relatedId && notif.relatedType) {
      onClose();
      if (notif.relatedType === 'Session') {
        navigate('/tutor/sessions');
      } else if (notif.relatedType === 'Feedback') {
        navigate('/tutor/feedbacks');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!confirm('Đánh dấu tất cả thông báo là đã đọc?')) {
      return;
    }

    try {
      await markAllNotificationsAsRead();
      // Update all local notifications to read
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
      );
      alert('Đã đánh dấu tất cả thông báo là đã đọc!');
      // Refresh parent to update unread count
      onClose();
    } catch (error) {
      console.error('Error marking all as read:', error);
      alert('Lỗi khi đánh dấu thông báo. Vui lòng thử lại.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-[500px] flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-blue-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900">
            Thông báo 
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-sky-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/50 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        {/* Mark All as Read Button */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 bg-white hover:bg-sky-50 rounded-md transition-colors border border-sky-200"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">
            Đang tải...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Không có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                  !notif.read ? "bg-sky-50/50 border-l-2 border-l-sky-500" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      iconMap[notif.type] || iconMap.reminder
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Type badge */}
                    {notif.backendType && typeLabels[notif.backendType] && (
                      <span className="inline-block text-[10px] font-medium text-slate-500 mb-1">
                        {typeLabels[notif.backendType]}
                      </span>
                    )}
                    
                    <p className="font-semibold text-sm text-slate-800 line-clamp-1">
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                      {notif.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[11px] text-slate-400">
                        {notif.time}
                      </p>
                      {notif.readAt && (
                        <span className="text-[10px] text-green-600">
                          ✓ Đã đọc
                        </span>
                      )}
                      {notif.relatedId && (
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </div>
                  {!notif.read && (
                    <div
                      className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"
                      title="Chưa đọc"
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { fetchTutorNotifications } from "../../../services/tutorNotificationService";

const iconMap = {
  request: "bg-blue-100 text-blue-600",
  cancellation: "bg-red-100 text-red-600",
  feedback: "bg-green-100 text-green-600",
  reminder: "bg-amber-100 text-amber-600",
};

export default function TutorNotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchTutorNotifications()
      .then(setNotifications)
      .catch((err) => console.error("Lỗi khi tải thông báo:", err));
  }, []);

  return (
    <div className="py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Thông báo
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Tất cả các cập nhật quan trọng về lịch dạy, yêu cầu và đánh giá sẽ
          được hiển thị ở đây.
        </p>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm max-w-3xl mx-auto">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Tất cả thông báo</h2>
            <button className="text-xs font-medium text-sky-600 hover:underline">Đánh dấu tất cả đã đọc</button>
        </div>
        <div className="divide-y divide-slate-200">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 flex items-start gap-4 ${!notif.read ? 'bg-sky-50/50' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${iconMap[notif.type] || iconMap.reminder}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">{notif.description}</p>
                <p className="text-[11px] text-slate-400 mt-1.5">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5" title="Chưa đọc"></div>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-500">Bạn không có thông báo nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
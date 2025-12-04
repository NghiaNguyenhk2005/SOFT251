import { useState, useEffect } from "react";
import { ChevronDown, LogOut, User, Menu, Bell, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProfile, fetchNotifications, markNotificationAsRead } from "../../../api/studentApi";

export default function Header({ onMenuClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotiDropdownOpen, setIsNotiDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile()
      .then((data) => {
        const profile = data.data || data;
        setUserProfile(profile);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      });

    // Function to fetch notifications
    const loadNotifications = () => {
      fetchNotifications().then(response => {
        // Handle different response structures (pagination vs array)
        const list = Array.isArray(response) ? response : (response.data?.docs || response.data || []);
        
        // Merge with local state to preserve optimistic updates if backend is slow
        setNotifications(prevNotifications => {
          // If we have no previous notifications, just use the new list
          if (prevNotifications.length === 0) return list;

          // Map over the new list and preserve 'isRead: true' from local state if the backend still says false
          return list.map(newItem => {
            const localItem = prevNotifications.find(p => p._id === newItem._id);
            if (localItem && localItem.isRead && !newItem.isRead) {
              return { ...newItem, isRead: true };
            }
            return newItem;
          });
        });
      });
    };

    // Initial load
    loadNotifications();

    // Poll every 5 seconds to keep notifications updated
    const intervalId = setInterval(loadNotifications, 5000);

    // Listen for custom event to trigger immediate refresh
    const handleRefresh = () => loadNotifications();
    window.addEventListener('refreshNotifications', handleRefresh);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('refreshNotifications', handleRefresh);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bkarch_jwt");
    navigate("/login");
  };

  const handleNotificationClick = async (noti) => {
    setSelectedNotification(noti);
    setIsNotiDropdownOpen(false);

    if (!noti.isRead) {
      // Optimistic update: Mark as read locally
      const updatedList = notifications.map(n => 
        n._id === noti._id ? { ...n, isRead: true } : n
      );
      setNotifications(updatedList);
      
      // Call API to mark as read
      try {
        await markNotificationAsRead(noti._id);
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  const displayName = userProfile?.user?.fullName || "Sinh viên";
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <header className="h-16 bg-[#00B5F1] flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm">
        {/* Left: Menu button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 -ml-2 text-white hover:bg-white/10 rounded-md"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Right: User Profile & Notifications */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              className="p-2 text-white hover:bg-white/10 rounded-full relative"
              onClick={() => setIsNotiDropdownOpen(!isNotiDropdownOpen)}
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotiDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-slate-100 py-1 z-50 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-100 font-semibold text-slate-700 flex justify-between items-center">
                  <span>Thông báo</span>
                  <span className="text-xs text-slate-500">{unreadCount} chưa đọc</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500 text-center">
                      Không có thông báo mới
                    </div>
                  ) : (
                    notifications.map((noti) => (
                      <div 
                        key={noti._id || noti.id} 
                        onClick={() => handleNotificationClick(noti)}
                        className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${!noti.isRead ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="text-sm font-medium text-slate-800">{noti.title}</div>
                        <div className="text-xs text-slate-600 mt-1 line-clamp-2">{noti.message}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {noti.createdAt ? new Date(noti.createdAt).toLocaleString('vi-VN') : (noti.time || 'Vừa xong')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-white/10 py-1.5 px-2 rounded-md transition-colors"
            >
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-white">
                  {displayName}
                </div>
              </div>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00B5F1] font-bold">
                {displayName.charAt(0)}
              </div>
              <ChevronDown className="w-4 h-4 text-white" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-100 py-1 z-50">
                <Link
                  to="/student/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Chi tiết thông báo</h3>
              <button 
                onClick={() => setSelectedNotification(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-[#00B5F1] mb-3">{selectedNotification.title}</h4>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">
                {selectedNotification.message}
              </p>
              <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-4">
                <span>
                  {selectedNotification.createdAt ? new Date(selectedNotification.createdAt).toLocaleString('vi-VN') : (selectedNotification.time || 'Vừa xong')}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  Đã đọc
                </span>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from "react";
import { ChevronDown, LogOut, User, Menu, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProfile, fetchNotifications } from "../../../api/studentApi";

export default function Header({ onMenuClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotiDropdownOpen, setIsNotiDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile()
      .then((data) => {
        // API returns { success: true, data: { user: { fullName: ... }, ... } }
        // or sometimes directly the data object depending on interceptor/service
        // Based on controller: data.user.fullName
        const profile = data.data || data;
        setUserProfile(profile);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      });

    // Fetch notifications
    fetchNotifications().then(data => setNotifications(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bkarch_jwt");
    navigate("/login");
  };

  const displayName = userProfile?.user?.fullName || "Sinh viên";
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
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
              <div className="px-4 py-2 border-b border-slate-100 font-semibold text-slate-700">
                Thông báo
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500 text-center">
                    Không có thông báo mới
                  </div>
                ) : (
                  notifications.map((noti) => (
                    <div key={noti.id} className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 ${!noti.isRead ? 'bg-blue-50/30' : ''}`}>
                      <div className="text-sm font-medium text-slate-800">{noti.title}</div>
                      <div className="text-xs text-slate-600 mt-1">{noti.message}</div>
                      <div className="text-xs text-slate-400 mt-1">{noti.time}</div>
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
  );
}

import { useState, useEffect } from "react";
import { Menu, ChevronDown, Bell } from "lucide-react";
import { useTutorProfile } from "../../../contexts/TutorContext";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { getUnreadNotificationsCount } from "../../../services/tutorNotificationService";

export default function TutorHeader({ onToggleSidebar }) {
  const { tutorProfile, loading } = useTutorProfile();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get tutor name from profile
  const tutorName = loading 
    ? "Loading..." 
    : tutorProfile?.userId?.fullName || "Tutor";

  useEffect(() => {
    // Fetch unread notification count
    const loadUnreadCount = async () => {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    };
    loadUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsProfileOpen(false); // Close profile when opening notifications
    
    // Refresh unread count when closing dropdown
    if (isNotificationOpen) {
      refreshUnreadCount();
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationOpen(false); // Close notifications when opening profile
  };

  const refreshUnreadCount = async () => {
    const count = await getUnreadNotificationsCount();
    setUnreadCount(count);
  };

  return (
    <header className="h-16 w-full bg-sky-500 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Nút menu bên trái */}
      <button
        className="inline-flex items-center justify-center p-2 rounded md:p-2.5 hover:bg-sky-400/70"
        onClick={onToggleSidebar}
        title="Toggle Menu"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>
      
      {/* Spacer để đẩy các item bên phải qua phải trên desktop */}
      <div className="hidden lg:block flex-1" />

      {/* Các item bên phải */}
      <div className="flex items-center gap-4">
        {/* Notification Dropdown */}
        <div className="relative">
          <button 
            onClick={toggleNotificationDropdown}
            className="relative p-2 rounded-full hover:bg-sky-400/70 transition-colors"
            title="Xem thông báo"
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-sky-500"></span>
            )}
          </button>
          
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => {
              setIsNotificationOpen(false);
              refreshUnreadCount(); // Refresh count when closing
            }}
            unreadCount={unreadCount}
          />
        </div>

        {/* Profile Dropdown */}
        <div className="relative overflow-visible">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center gap-2 text-sm md:text-base text-white font-medium px-3 py-1.5 rounded-md hover:bg-sky-400/70 transition-colors"
          >
            <span>{tutorName}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
          />
        </div>
                    
      </div>
    </header>
  );
}

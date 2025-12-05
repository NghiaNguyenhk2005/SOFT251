import { NavLink } from "react-router-dom";
import { Calendar, Star, Users, MessageCircle } from "lucide-react";

const menuItems = [
  {
    label: "Lịch dạy",
    to: "/tutor/dashboard",
    icon: Calendar,
  },
  {
    label: "Buổi học",
    to: "/tutor/sessions",
    icon: Users,
  },
  {
    label: "Đánh giá sinh viên",
    to: "/tutor/ratings",
    icon: Star,
  },
  {
    label: "Đánh giá của tôi",
    to: "/tutor/feedbacks",
    icon: MessageCircle,
  },
];

export default function TutorSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay - chỉ hiện trên mobile khi sidebar mở */}
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar - có thể ẩn/hiện trên cả desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200
          transform transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
            BK
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-slate-900">
              Tutor Portal
            </span>
            <span className="text-xs text-slate-500">By Arch7</span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-sky-100 text-sky-900"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }
              `
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

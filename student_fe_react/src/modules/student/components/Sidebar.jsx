import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Đăng kí tutor",
    to: "/student/register",
  },
  {
    label: "Đặt lịch tư vấn",
    to: "/student/consultation",
  },
  {
    label: "Lịch của tôi",
    to: "/student/dashboard",
  },
  {
    label: "Đánh giá buổi học",
    to: "/student/history",
  },
  {
    label: "Chia sẻ tài liệu",
    to: "/student/library",
  },
  {
    label: "Sự kiện / Seminar",
    to: "/student/events",
  },
  {
    label: "Tham gia cộng đồng trực tuyến",
    to: "/student/community",
  },
];


export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay - hiển thị khi sidebar mở */}
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar chính */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200
          transform transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + tên app */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            BK
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-slate-900">
              BK Tutor
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
                block px-4 py-2.5 rounded-md text-sm font-medium
                ${
                  isActive
                    ? "bg-slate-200 text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }
              `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

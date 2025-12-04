// src/modules/student/components/Header.jsx
import React, { useState } from "react";
import { Menu, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ onToggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin lưu trữ nếu cần (ví dụ: localStorage.removeItem('savedUsername'))
    // Chuyển hướng về trang đăng nhập
    navigate("/");
  };

  return (
    <header className="h-14 md:h-16 w-full bg-sky-400 flex items-center justify-between px-4 md:px-6 relative z-30 shadow-sm">
      {/* Nút menu bên trái */}
      <button
        className="inline-flex items-center justify-center p-2 rounded md:p-2.5 hover:bg-sky-300/70 transition-colors"
        onClick={onToggleSidebar}
      >
        <Menu className="w-6 h-6 text-slate-900" />
      </button>

      {/* Khu vực Tên sinh viên & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 text-sm md:text-base text-slate-900 font-medium hover:opacity-80 transition-opacity focus:outline-none"
        >
          <span>Nguyễn Đắc Nghĩa</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Menu thả xuống */}
        {showDropdown && (
          <>
            {/* Lớp nền trong suốt để click ra ngoài thì đóng menu */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
              <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-400 uppercase font-bold">
                Tài khoản
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
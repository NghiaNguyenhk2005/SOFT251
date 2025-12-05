import React, { useState } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ title }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý đăng xuất: xóa token, clear storage nếu cần
    // localStorage.removeItem('savedUsername'); 
    navigate("/"); // Quay về trang Login
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm relative z-30">
      {/* Bên trái: Tiêu đề trang */}
      <h1 className="text-lg md:text-xl font-semibold text-slate-800">
        {title || "BKArch"}
      </h1>

      {/* Bên phải: Thông tin User & Menu Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
        >
          {/* Tên người dùng */}
          <div className="text-right hidden md:block">
            <span className="block text-sm font-medium text-slate-700">Phòng Đào Tạo</span>
            <span className="block text-xs text-slate-500">Quản trị viên</span>
          </div>
          
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
            <User className="w-5 h-5 text-slate-600" />
          </div>

          {/* Mũi tên nhỏ */}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
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
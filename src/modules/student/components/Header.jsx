import { Menu, ChevronDown } from "lucide-react";

export default function Header({ onToggleSidebar }) {
  return (
    <header className="h-14 md:h-16 w-full bg-sky-400 flex items-center justify-between px-4 md:px-6">
      {/* Nút menu bên trái */}
      <button
        className="inline-flex items-center justify-center p-2 rounded md:p-2.5 hover:bg-sky-300/70"
        onClick={onToggleSidebar}
      >
        <Menu className="w-5 h-5 text-slate-900" />
      </button>

      {/* Tên sinh viên bên phải */}
      <div className="flex items-center gap-1 text-sm md:text-base text-slate-900 font-medium">
        <span>Nguyễn Đắc Nghĩa</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </header>
  );
}

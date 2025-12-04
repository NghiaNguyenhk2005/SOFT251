import { Menu, ChevronDown, Bell } from "lucide-react";

export default function TutorHeader({ onToggleSidebar }) {
  return (
    <header className="h-16 w-full bg-sky-500 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Nút menu bên trái (chỉ hiện trên mobile) */}
      <button
        className="inline-flex items-center justify-center p-2 rounded md:p-2.5 hover:bg-sky-400/70 lg:hidden"
        onClick={onToggleSidebar}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>
      
      {/* Spacer để đẩy các item bên phải qua phải trên desktop */}
      <div className="hidden lg:block flex-1" />

      {/* Các item bên phải */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-sky-400/70">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-sky-500"></span>
        </button>

        <div className="flex items-center gap-2 text-sm md:text-base text-white font-medium">
          <span>ThS. Mai Đức Trung</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}

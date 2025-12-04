import { User } from "lucide-react";

export default function Topbar({ title }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Left: Title */}
      <h1 className="text-lg md:text-xl font-semibold text-slate-800">
        {title || "BKArch"}
      </h1>

      {/* Right: Something else (user info) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Phòng Đào Tạo</span>
        <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
}
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TutorSidebar from "../components/TutorSidebar.jsx";
import TutorHeader from "../components/TutorHeader.jsx";

export default function TutorMainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar - cố định trên desktop, toggle trên mobile */}
      <TutorSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Phần nội dung chính */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <TutorHeader onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Nội dung từng trang của tutor sẽ render ở đây */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

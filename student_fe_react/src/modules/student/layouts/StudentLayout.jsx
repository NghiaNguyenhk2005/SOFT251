import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { ToastProvider } from "../components/ToastProvider.jsx";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar bên trái */}
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

        {/* Phần bên phải: header + nội dung */}
        <div className="flex-1 flex flex-col">
          <Header onMenuClick={handleToggleSidebar} />

          <main className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              {/* Nội dung từng trang sẽ hiện ở đây */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

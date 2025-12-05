import { useState } from "react";
import { Outlet } from "react-router-dom";
import TutorSidebar from "../components/TutorSidebar.jsx";
import TutorHeader from "../components/TutorHeader.jsx";
import { TutorProvider, useTutorProfile } from "../../../contexts/TutorContext.jsx";
import { useAuthToken } from "../../../hooks/useAuthToken.js";

function TutorLayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open
  const { reload } = useTutorProfile();

  // Automatically capture token from URL (after CAS login redirect)
  // and reload profile when token is received
  useAuthToken((token) => {
    console.log('🔄 Token received, reloading tutor profile...');
    reload();
  });

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    // Chỉ close trên mobile khi click overlay
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar - có thể ẩn/hiện */}
      <TutorSidebar 
        isOpen={sidebarOpen} 
        onClose={handleCloseSidebar}
      />

      {/* Phần nội dung chính - dịch chuyển theo sidebar */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-200 ${
          sidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'
        }`}
      >
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

export default function TutorMainLayout() {
  return (
    <TutorProvider>
      <TutorLayoutContent />
    </TutorProvider>
  );
}

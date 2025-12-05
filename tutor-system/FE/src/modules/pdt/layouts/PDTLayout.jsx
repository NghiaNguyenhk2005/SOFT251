import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function PDTLayout() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header/>

        {/* Content area */}
        <main className="flex-1 px-4 py-6 md:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
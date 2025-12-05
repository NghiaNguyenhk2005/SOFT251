import DashboardCard from "../components/DashboardCard";

export default function PDTDashboardPage() {
  const reports = [
    { id: 1, metric: "Hiệu quả chương trình", value: "85%" },
    { id: 2, metric: "Nguồn lực phân bổ", value: "90%" },
    { id: 3, metric: "Mức độ hài lòng người dùng", value: "88%" },
    { id: 4, metric: "Số lượng phản hồi tích cực", value: "120+" },
  ];

  return (
    <div className="bg-slate-50 flex flex-col">
      <main className="flex-1 px-4 py-6 md:px-6 flex flex-col items-center">
        {/* Big Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 text-center">
          Hệ thống hỗ trợ chương trình Tutor
        </h1>

        {/* Detailed dashboard content first */}
        <div className="space-y-6 w-full max-w-7xl mb-10">
          {/* Cards with metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold">{r.metric}</h2>
                <p className="mt-2 text-3xl font-bold text-indigo-600">{r.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard cards row */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Báo cáo tổng quan"
            description="Xem báo cáo hệ thống"
            icon="📊"
            link="/pdt/analytics"
            className="h-[250px] md:h-[300px] flex flex-col items-center justify-center text-center 
                       bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg"
          />
          <DashboardCard
            title="Phản hồi từ người dùng"
            description="Xem ý kiến đóng góp"
            icon="💬"
            link="/pdt/feedback"
            className="h-[250px] md:h-[300px] flex flex-col items-center justify-center text-center 
                       bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg shadow-lg"
          />
          <DashboardCard
            title="Phân bổ lại nguồn lực"
            description="Xem lịch sử phân bổ"
            icon="🔄"
            link="/pdt/redistribution"
            className="h-[250px] md:h-[300px] flex flex-col items-center justify-center text-center 
                       bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg"
          />
        </div>
      </main>
    </div>
  );
}
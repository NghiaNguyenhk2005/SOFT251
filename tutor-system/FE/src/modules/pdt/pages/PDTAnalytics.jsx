import GoBackButton from "../components/GoBackBTN";
import LineChartDemo from "../components/charts/LineChartDemo";
import PieChartDemo from "../components/charts/PieChartDemo";
import BarChartDemo from "../components/charts/BarChartDemo";
import { getStudentGrowthData, getFacultyData, getTutorData } from "../services/analyticService";

export default function PDTAnalytics() {
  const studentGrowthData = getStudentGrowthData();
  const facultyData = getFacultyData();
  const tutorData = getTutorData();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 p-8 space-y-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Thống kê các số liệu về chương trình Tutor
          </h2>
          <GoBackButton />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg h-96">
          <LineChartDemo data={studentGrowthData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg h-96">
          <PieChartDemo data={facultyData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg h-[700px]">
          <BarChartDemo data={tutorData} />
        </div>
      </main>
    </div>
  );
}
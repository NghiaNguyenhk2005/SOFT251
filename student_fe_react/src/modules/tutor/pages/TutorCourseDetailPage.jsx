import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTutorCourseDetails } from "../../../services/tutorCourseDetailService";
import { ChevronLeft, Users, BookOpen, Bell, UserCheck } from "lucide-react";

const TABS = [
  { id: 'sessions', label: 'Buổi học', icon: BookOpen },
  { id: 'requests', label: 'Yêu cầu', icon: Bell },
  { id: 'students', label: 'Danh sách SV', icon: Users },
];

export default function TutorCourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions');

  useEffect(() => {
    setLoading(true);
    fetchTutorCourseDetails(courseId)
      .then(setCourse)
      .catch((err) => console.error("Lỗi khi tải chi tiết môn học:", err))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return <div className="text-center py-20">Đang tải chi tiết môn học...</div>;
  }

  if (!course) {
    return <div className="text-center py-20 text-red-500">Không tìm thấy thông tin môn học.</div>;
  }

  return (
    <div className="py-6 md:py-8">
      {/* Back link and Header */}
      <div className="mb-6">
        <Link to="/tutor/courses" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-2">
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại danh sách môn học</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{course.name}</h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">{course.description}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'requests' && course.requests.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600">{course.requests.length}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'sessions' && <SessionsTab sessions={course.sessions} />}
        {activeTab === 'requests' && <RequestsTab requests={course.requests} />}
        {activeTab === 'students' && <StudentsTab students={course.students} />}
      </div>
    </div>
  );
}

// --- Tab Components ---

const SessionsTab = ({ sessions }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-slate-800">Danh sách buổi học</h3>
    {sessions.map(session => (
      <div key={session.id} className="bg-white p-4 border border-slate-200 rounded-lg flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-900">{session.title}</p>
          <p className="text-xs text-slate-500 mt-1">{session.date}  |  {session.time}  |  {session.location}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${session.status === 'Đã diễn ra' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'}`}>{session.status}</span>
            <button className="text-xs font-medium text-sky-600 hover:underline">Quản lý</button>
        </div>
      </div>
    ))}
  </div>
);

const RequestsTab = ({ requests }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Yêu cầu từ sinh viên</h3>
        {requests.map(req => (
            <div key={req.id} className="bg-white p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold">{req.studentName} <span className="font-normal text-slate-500">({req.studentId})</span></p>
                        <p className="text-xs text-slate-500 mt-1">Yêu cầu lúc: {req.requestDate}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600">Từ chối</button>
                        <button className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600">Chấp nhận</button>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-800"><span className="font-medium">Chủ đề:</span> {req.topic}</p>
                    <p className="text-sm text-slate-600 mt-1"><span className="font-medium">Ghi chú:</span> {req.note}</p>
                </div>
            </div>
        ))}
        {requests.length === 0 && <p className="text-sm text-slate-500">Không có yêu cầu nào.</p>}
    </div>
);

const StudentsTab = ({ students }) => (
    <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Danh sách sinh viên</h3>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Họ và tên</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">MSSV</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Email</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Ngày tham gia</th>
                        <th className="px-4 py-2 text-right font-semibold text-slate-600"></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, idx) => (
                        <tr key={student.id} className={`border-t border-slate-200 ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                            <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                            <td className="px-4 py-3 text-slate-600">{student.studentId}</td>
                            <td className="px-4 py-3 text-slate-600">{student.email}</td>
                            <td className="px-4 py-3 text-slate-600">{student.joinDate}</td>
                            <td className="px-4 py-3 text-right">
                                <button className="flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:underline">
                                    <UserCheck className="w-3.5 h-3.5" />
                                    Đánh giá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
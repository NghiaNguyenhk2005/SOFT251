import { useState, useEffect } from 'react';
import { Star, Users, Calendar, Clock, BookOpen, Edit, CheckCircle, Search, Filter } from 'lucide-react';
import { 
  getCompletedSessions, 
  getSessionEvaluations, 
  createTutorEvaluation,
  updateTutorEvaluation 
} from '../../../services/evaluationService.js';

// Modal for evaluation
const EvaluationModal = ({ student, session, onClose, onSave }) => {
  const [score, setScore] = useState(student.evaluationScore || '');
  const [attendance, setAttendance] = useState(student.attendance?.toLowerCase() || 'present');
  const [participation, setParticipation] = useState(3);
  const [comments, setComments] = useState(student.comment || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      studentId: student.id,
      score: parseFloat(score),
      attendance,
      participation,
      comments
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">
            {student.hasEvaluation ? 'Sửa đánh giá' : 'Đánh giá sinh viên'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {student.fullName} - MSSV: {student.studentId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Session info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">{session.subjectName}</p>
            <p className="text-xs text-blue-700 mt-1">
              {session.date} • {session.startTime} - {session.endTime}
            </p>
          </div>

          {/* Attendance */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Điểm danh <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAttendance('present')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                  attendance === 'present'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Có mặt
              </button>
              <button
                type="button"
                onClick={() => setAttendance('late')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                  attendance === 'late'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Đi muộn
              </button>
              <button
                type="button"
                onClick={() => setAttendance('absent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                  attendance === 'absent'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Vắng mặt
              </button>
            </div>
          </div>

          {/* Participation */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mức độ tham gia <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setParticipation(level)}
                  className={`w-10 h-10 rounded-md text-sm font-medium transition-all border ${
                    participation === level
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              1 = Rất thấp, 5 = Rất cao
            </p>
          </div>

          {/* Score */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Điểm đánh giá (0-10) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập điểm (ví dụ: 8.5)"
              required
            />
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nhận xét
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Nhập nhận xét về sinh viên (không bắt buộc)..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {student.hasEvaluation ? 'Cập nhật' : 'Lưu đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Session table component
const SessionTable = ({ session, onEvaluate }) => {
  const evaluatedCount = session.students.filter(s => s.hasEvaluation).length;
  const totalStudents = session.students.length;
  const completionRate = (evaluatedCount / totalStudents * 100).toFixed(0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Session header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold">{session.subjectName}</h3>
            <p className="text-sm text-blue-100 mt-1">Mã môn: {session.subjectCode}</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg px-3 py-1 inline-block">
              <p className="text-xs font-medium">Đã đánh giá</p>
              <p className="text-xl font-bold">{evaluatedCount}/{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{session.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{session.startTime} - {session.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{session.location}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-blue-100 mt-1">{completionRate}% hoàn thành</p>
        </div>
      </div>

      {/* Students table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                MSSV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Họ và tên
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Điểm đánh giá
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {session.students.map((student, index) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-slate-700">{student.studentId}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {student.fullName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{student.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {student.hasEvaluation ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                      <Star className="w-4 h-4 fill-current" />
                      {student.evaluationScore}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">Chưa đánh giá</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {student.hasEvaluation ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Đã đánh giá
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      Chưa hoàn thành
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onEvaluate(student, session)}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      student.hasEvaluation
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {student.hasEvaluation ? (
                      <>
                        <Edit className="w-4 h-4" />
                        Sửa
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" />
                        Đánh giá
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function StudentEvaluationPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const completedSessions = await getCompletedSessions();
      
      // Transform backend data to component format
      const formattedSessions = await Promise.all(
        completedSessions.map(async (session) => {
          // Fetch evaluations for this session
          let evaluations = [];
          try {
            evaluations = await getSessionEvaluations(session._id);
          } catch (err) {
            console.warn('Could not fetch evaluations for session:', session._id);
          }
          
          // Format date
          const sessionDate = new Date(session.startTime);
          const dateStr = sessionDate.toISOString().split('T')[0]; // YYYY-MM-DD
          
          // Format time
          const startTime = new Date(session.startTime).toLocaleTimeString('en-GB', { 
            hour: '2-digit', minute: '2-digit' 
          });
          const endTime = new Date(session.endTime).toLocaleTimeString('en-GB', { 
            hour: '2-digit', minute: '2-digit' 
          });
          
          // Map participants to students with evaluation status
          const students = (session.participants || []).map(participant => {
            // Find evaluation for this student
            const evaluation = evaluations.find(
              ev => ev.studentId?._id === participant.studentId?._id || ev.studentId === participant.studentId?._id
            );
            
            return {
              id: participant.studentId?._id,
              studentId: participant.studentId?.studentId || participant.studentId?.mssv || 'N/A',
              fullName: participant.studentId?.userId?.fullName || participant.studentId?.fullName || 'Unknown',
              evaluationScore: evaluation?.progressScore || null,
              hasEvaluation: !!evaluation,
              evaluationId: evaluation?._id,
              attendance: evaluation?.attendanceStatus,
              comment: evaluation?.comment
            };
          });
          
          return {
            id: session._id,
            subjectName: session.title || 'Unnamed Session',
            subjectCode: session.subjectCode || 'N/A',
            date: dateStr,
            startTime,
            endTime,
            location: session.location || 'N/A',
            students
          };
        })
      );
      
      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      alert('Không thể tải dữ liệu buổi học. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = (student, session) => {
    setSelectedStudent(student);
    setSelectedSession(session);
  };

  const handleSaveEvaluation = async (evaluationData) => {
    try {
      console.log('💾 Saving evaluation:', evaluationData);
      
      // Prepare API payload
      const payload = {
        sessionId: selectedSession.id,
        studentId: evaluationData.studentId,
        attendanceStatus: evaluationData.attendance.toUpperCase(), // PRESENT, LATE, ABSENT
        progressScore: evaluationData.score,
        comment: evaluationData.comments || ''
      };
      
      // Check if updating or creating
      if (selectedStudent.evaluationId) {
        // Update existing evaluation
        await updateTutorEvaluation(selectedStudent.evaluationId, payload);
      } else {
        // Create new evaluation
        await createTutorEvaluation(payload);
      }
      
      alert('✅ Đánh giá đã được lưu thành công!');
      
      // Refresh sessions to get updated data
      await fetchSessions();
    } catch (error) {
      console.error('❌ Error saving evaluation:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      alert(`❌ Không thể lưu đánh giá: ${errorMsg}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setSelectedSession(null);
  };

  // Get unique subjects for filter
  const uniqueSubjects = [...new Set(sessions.map(s => s.subjectCode))];
  
  // Filter sessions based on search and subject
  const filteredSessions = sessions.map(session => {
    // Filter students by search query (name or student ID)
    const filteredStudents = session.students.filter(student => {
      const matchesSearch = searchQuery === '' || 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    
    return {
      ...session,
      students: filteredStudents
    };
  }).filter(session => {
    // Filter by subject
    const matchesSubject = selectedSubject === 'all' || session.subjectCode === selectedSubject;
    // Only show sessions that have students after filtering
    const hasStudents = session.students.length > 0;
    return matchesSubject && hasStudents;
  });

  const totalSessions = filteredSessions.length;
  const totalStudents = filteredSessions.reduce((sum, s) => sum + s.students.length, 0);
  const evaluatedStudents = filteredSessions.reduce((sum, s) => 
    sum + s.students.filter(st => st.hasEvaluation).length, 0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Đánh giá sinh viên</h1>
        <p className="text-slate-600 mt-2">Quản lý và đánh giá sinh viên trong các buổi học đã hoàn thành</p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tổng buổi học</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalSessions}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tổng sinh viên</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Đã đánh giá</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {evaluatedStudents}/{totalStudents}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {totalStudents > 0 ? ((evaluatedStudents / totalStudents) * 100).toFixed(0) : 0}% hoàn thành
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search by student name or ID */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc MSSV sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter by subject */}
          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">Tất cả môn học</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Results count */}
        {(searchQuery || selectedSubject !== 'all') && (
          <div className="mt-3 text-sm text-slate-600">
            Tìm thấy <span className="font-semibold">{totalStudents}</span> sinh viên trong <span className="font-semibold">{totalSessions}</span> buổi học
          </div>
        )}
      </div>

      {/* Sessions list */}
      <div className="space-y-6">
        {filteredSessions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">
              {sessions.length === 0 
                ? 'Chưa có buổi học nào để đánh giá' 
                : 'Không tìm thấy kết quả phù hợp'}
            </p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <SessionTable
              key={session.id}
              session={session}
              onEvaluate={handleEvaluate}
            />
          ))
        )}
      </div>

      {/* Evaluation modal */}
      {selectedStudent && selectedSession && (
        <EvaluationModal
          student={selectedStudent}
          session={selectedSession}
          onClose={handleCloseModal}
          onSave={handleSaveEvaluation}
        />
      )}
    </div>
  );
}

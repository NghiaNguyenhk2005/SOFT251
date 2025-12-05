import { useState, useEffect } from "react";
import { Star, Search, X, BookOpen } from "lucide-react";
import { getTutorSessions } from "../../../services/tutorSessionService";
import { evaluateStudent } from "../../../services/tutorEvaluationService";

export default function TutorRatingsPage() {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load completed sessions and extract students
  useEffect(() => {
    loadStudentsFromSessions();
  }, []);

  const loadStudentsFromSessions = async () => {
    setLoading(true);
    try {
      // Get all completed sessions
      const allSessions = await getTutorSessions({ status: 'COMPLETED' });
      setSessions(allSessions);
      
      // Extract unique students from sessions
      const studentMap = new Map();
      
      allSessions.forEach(session => {
        if (session.participants && session.participants.length > 0) {
          session.participants.forEach(participant => {
            const studentId = participant.studentId?._id || participant.studentId;
            if (studentId && !studentMap.has(studentId)) {
              studentMap.set(studentId, {
                id: studentId,
                name: participant.fullName || participant.studentId?.fullName || 'Sinh viên',
                studentId: participant.studentId?.hcmutId || 'N/A',
                email: participant.email || participant.studentId?.email || '',
                sessionsCount: 1,
                lastSession: session.title,
                lastSessionDate: session.startTime,
                sessionIds: [session.id],
              });
            } else if (studentId) {
              const existing = studentMap.get(studentId);
              existing.sessionsCount += 1;
              existing.sessionIds.push(session.id);
              // Update last session if more recent
              if (new Date(session.startTime) > new Date(existing.lastSessionDate)) {
                existing.lastSession = session.title;
                existing.lastSessionDate = session.startTime;
              }
            }
          });
        }
      });
      
      setStudents(Array.from(studentMap.values()));
    } catch (error) {
      console.error("Error loading students from sessions:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.includes(searchQuery);
    return matchesSearch;
  });

  const openRatingModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const handleSaveRating = async (ratingData) => {
    try {
      await evaluateStudent(ratingData);
      alert('Đã đánh giá sinh viên thành công!');
      closeModal();
    } catch (error) {
      console.error('Error saving rating:', error);
      alert('Lỗi khi đánh giá sinh viên. Vui lòng thử lại.');
    }
  };

  return (
    <div className="py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Đánh giá sinh viên
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Đánh giá sinh viên đã tham gia các buổi học đã hoàn thành.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc MSSV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-sm text-slate-600 mb-1">Tổng sinh viên</div>
          <div className="text-2xl font-bold text-slate-900">{students.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-sm text-slate-600 mb-1">Buổi học hoàn thành</div>
          <div className="text-2xl font-bold text-green-600">{sessions.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-sm text-slate-600 mb-1">Đang hiển thị</div>
          <div className="text-2xl font-bold text-sky-600">{filteredStudents.length}</div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Đang tải danh sách sinh viên...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {searchQuery ? 'Không tìm thấy sinh viên phù hợp' : 'Chưa có sinh viên nào tham gia buổi học'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Sinh viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    MSSV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Buổi học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Buổi gần nhất
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {student.sessionsCount} buổi
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{student.lastSession}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(student.lastSessionDate).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openRatingModal(student)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                      >
                        <Star className="w-4 h-4" />
                        Đánh giá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {isModalOpen && selectedStudent && (
        <RatingModal
          student={selectedStudent}
          sessions={sessions.filter(s => selectedStudent.sessionIds.includes(s.id))}
          onClose={closeModal}
          onSave={handleSaveRating}
        />
      )}
    </div>
  );
}

// Rating Modal Component
function RatingModal({ student, sessions, onClose, onSave }) {
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!selectedSessionId) {
      alert('Vui lòng chọn buổi học');
      return;
    }

    setSubmitting(true);
    
    try {
      // Call API to save evaluation to database
      const ratingData = {
        sessionId: selectedSessionId,
        studentId: student.id,
        content: comment,
      };
      
      await onSave(ratingData);
    } catch (error) {
      console.error('Failed to save evaluation:', error);
      alert('Lỗi khi lưu đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentValue) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || currentValue)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-blue-50 sticky top-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Đánh giá sinh viên
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {student.name.charAt(0)}
              </div>
              <p className="text-sm text-slate-600">
                {student.name} • {student.studentId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/50"
            disabled={submitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Session Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              📚 Chọn buổi học
            </label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              required
              disabled={submitting}
            >
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} - {new Date(session.startTime).toLocaleDateString('vi-VN')}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Sinh viên đã tham gia {sessions.length} buổi học
            </p>
          </div>

          {/* Rating Stars (Display only - not used in backend) */}
          <div className="text-center bg-slate-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              ⭐ Đánh giá trực quan
            </label>
            <div className="flex justify-center">
              {renderStars(rating)}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              (Chỉ để tham khảo, không lưu vào hệ thống)
            </p>
            {rating > 0 && (
              <p className="mt-2 text-2xl font-bold text-amber-500">
                {rating}.0 / 5.0
              </p>
            )}
          </div>

          {/* Comment (This is what gets saved) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              💬 Nhận xét *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              placeholder="Nhập nhận xét chi tiết về sinh viên trong buổi học này...
              
Ví dụ:
- Sinh viên rất tích cực và chủ động trong buổi học
- Cần cải thiện kỹ năng giải quyết vấn đề
- Đã hiểu rõ các khái niệm cơ bản"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              disabled={submitting}
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              ℹ️ Nhận xét này sẽ được lưu vào hệ thống
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={submitting || !comment.trim()}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  Lưu đánh giá
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

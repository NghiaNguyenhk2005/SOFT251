import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User, BookOpen, CheckCircle, Trash2 } from "lucide-react";
import { fetchMyRegistrations, fetchTutorSessions, bookSession, cancelRegistration } from "../../../api/studentApi";

export default function ConsultationRequestPage() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoadingRegs, setIsLoadingRegs] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [bookingSessionId, setBookingSessionId] = useState(null);

  // 1. Load danh sách đăng ký (Tutor + Môn)
  useEffect(() => {
    setIsLoadingRegs(true);
    fetchMyRegistrations({ status: 'ACTIVE' })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setRegistrations(list);
      })
      .catch((err) => {
        console.error("Lỗi tải danh sách đăng ký:", err);
      })
      .finally(() => setIsLoadingRegs(false));
  }, []);

  // 2. Khi chọn 1 đăng ký -> Load lịch (sessions) của Tutor đó
  useEffect(() => {
    if (!selectedRegistration) {
      setSessions([]);
      return;
    }

    setIsLoadingSessions(true);
    // selectedRegistration có tutorId và subjectId
    // API fetchTutorSessions cần tutorId
    const tutorId = selectedRegistration.tutorId?._id || selectedRegistration.tutorId;
    
    fetchTutorSessions(tutorId)
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        // Filter sessions that match the subject? Or show all?
        // Usually show all, but maybe highlight the subject ones.
        // For now show all available (SCHEDULED)
        setSessions(list.filter(s => s.status === 'SCHEDULED'));
      })
      .catch((err) => {
        console.error("Lỗi tải lịch tutor:", err);
        setSessions([]);
      })
      .finally(() => setIsLoadingSessions(false));
  }, [selectedRegistration]);

  const handleBookSession = async (session) => {
    if (!window.confirm(`Bạn muốn đặt lịch buổi "${session.title}"?`)) return;

    setBookingSessionId(session._id || session.id);
    try {
      await bookSession(session._id || session.id);
      alert("Đặt lịch thành công!");
      // Refresh list to remove booked session or update status
      setSessions(prev => prev.filter(s => (s._id || s.id) !== (session._id || session.id)));
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      alert("Đặt lịch thất bại. Có thể lịch đã bị trùng hoặc đầy.");
    } finally {
      setBookingSessionId(null);
    }
  };

  const handleCancelRegistration = async (e, regId) => {
    e.stopPropagation(); // Prevent selecting the registration when clicking delete
    if (!window.confirm("Bạn có chắc chắn muốn hủy đăng ký môn này không?")) return;

    try {
      await cancelRegistration(regId);
      alert("Hủy đăng ký thành công!");
      // Remove from list
      setRegistrations(prev => prev.filter(r => r._id !== regId));
      if (selectedRegistration?._id === regId) {
        setSelectedRegistration(null);
      }
    } catch (error) {
      console.error("Lỗi hủy đăng ký:", error);
      alert("Hủy đăng ký thất bại.");
    }
  };

  return (
    <div className="py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Đặt lịch tư vấn
        </h1>
        <p className="mt-2 text-slate-600">
          Chọn tutor và môn học bạn đã đăng ký, sau đó chọn lịch phù hợp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Danh sách Tutor đã đăng ký */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Môn đã đăng ký
          </h2>
          
          {isLoadingRegs ? (
            <div className="text-slate-500 text-sm">Đang tải...</div>
          ) : registrations.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded text-sm text-slate-500">
              Bạn chưa đăng ký tutor nào. Vui lòng qua trang "Đăng kí tutor" để đăng ký trước.
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg) => {
                const isSelected = selectedRegistration?._id === reg._id;
                return (
                  <div
                    key={reg._id}
                    onClick={() => setSelectedRegistration(reg)}
                    className={`cursor-pointer p-4 rounded border transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-medium text-slate-900">
                      {reg.subjectId}
                    </div>
                    <div className="text-sm text-slate-600 mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {reg.tutor?.userId?.fullName || "Unknown Tutor"}
                      </div>
                      <button
                        onClick={(e) => handleCancelRegistration(e, reg._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hủy đăng ký"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cột phải: Danh sách lịch (Sessions) */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Lịch tư vấn
          </h2>

          {!selectedRegistration ? (
            <div className="h-40 flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded text-slate-500">
              Chọn một môn học bên trái để xem lịch.
            </div>
          ) : isLoadingSessions ? (
            <div className="text-center py-8 text-slate-500">Đang tải lịch...</div>
          ) : sessions.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded text-center text-slate-500">
              Hiện tại tutor chưa có lịch trống nào cho môn này.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sessions.map((session) => (
                <div
                  key={session._id || session.id}
                  className="bg-white border border-slate-200 rounded p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {session.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>
                        {new Date(session.startTime).toLocaleDateString()} • {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{session.location || "Online"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookSession(session)}
                    disabled={bookingSessionId === (session._id || session.id)}
                    className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {bookingSessionId === (session._id || session.id) ? "Đang xử lý..." : "Đặt lịch ngay"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

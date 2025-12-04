import { useEffect, useMemo, useState, useRef } from "react";
import { Calendar, Clock, MapPin, Link2, X, Trash2, AlertTriangle } from "lucide-react";
import { fetchMySessions, cancelSessionBooking } from "../../../api/studentApi";
import { useToast } from "../components/ToastProvider";

// Cấu hình lưới giờ: 0h -> 23h (cả ngày)
const START_HOUR = 0;
const END_HOUR = 23;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);

// Chiều cao mỗi slot 1 giờ (px)
const SLOT_HEIGHT = 52;
const MIN_EVENT_HEIGHT = 44;

// Giờ mặc định scroll tới khi load (5h sáng)
const DEFAULT_SCROLL_HOUR = 5;

// Thứ trong tuần, BẮT ĐẦU từ MON
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper: Get current week range (Mon-Sun)
function getCurrentWeekRange() {
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sun, 1=Mon, ...
  
  // Calculate Monday of current week
  // If Sunday (0), subtract 6 days. If Mon (1), subtract 0. If Tue (2), subtract 1...
  const diffToMon = currentDay === 0 ? 6 : currentDay - 1;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMon);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return { monday, sunday };
}

// Helper: Generate day numbers for the current week
function getCurrentWeekDayNumbers() {
  const { monday } = getCurrentWeekRange();
  const map = {};
  
  DAYS.forEach((day, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    map[day] = d.getDate();
  });
  
  return map;
}

function formatHourLabel(h) {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
}

// "10:00 - 13:00" -> [10, 13]
function parseTimeRangeToDecimal(timeRange) {
  if (!timeRange) return [START_HOUR, START_HOUR + 1];

  const [startStr, endStr] = timeRange.split("-");
  const parse = (str) => {
    const match = str.trim().match(/(\d{1,2}):(\d{2})/);
    if (!match) return START_HOUR;
    const hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    return hour + minute / 60;
  };

  const start = parse(startStr);
  const end = endStr ? parse(endStr) : start + 1;
  return [start, end];
}

// "Mon, Jan 11, 2050" -> "Mon"
function getDayKeyFromDateString(dateStr) {
  if (!dateStr) return "Mon";
  const firstPart = dateStr.split(",")[0].trim(); // "Mon"
  const key = firstPart.slice(0, 3);
  return DAYS.includes(key) ? key : "Mon";
}

// "Mon, Jan 11, 2050" -> 11
function getDayNumberFromDateString(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.getDate();
}

export default function DashboardPage() {
  const { addToast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  
  // Cancel Confirmation State
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMySessions();
      // Transform API data to UI format
      const rawList = Array.isArray(data) ? data : data.data || [];
      
      const transformed = rawList.map(item => {
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);
        
        // Format date: "Thu, Dec 04, 2025"
        const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const dateStr = start.toLocaleDateString('en-US', dateOptions);

        // Format time: "10:00 - 12:00"
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const startStr = start.toLocaleTimeString('en-US', timeOptions);
        const endStr = end.toLocaleTimeString('en-US', timeOptions);
        
        return {
          id: item._id || item.id,
          sessionId: item.sessionId?._id || item.sessionId, // Handle populated or flat
          subjectName: item.title || item.subjectId || "No Title",
          tutorName: item.tutorId?.userId?.fullName || "Unknown Tutor",
          date: dateStr,
          timeRange: `${startStr} - ${endStr}`,
          location: item.location || "N/A",
          meetLink: item.meetLink,
          status: item.status
        };
      });
      
      setSessions(transformed);
    } catch (err) {
      console.error("Lỗi khi tải lịch học:", err);
      setError("Không tải được lịch học");
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Scroll tới giờ mặc định (5h) khi component mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollTo = (DEFAULT_SCROLL_HOUR - START_HOUR) * SLOT_HEIGHT;
      scrollContainerRef.current.scrollTop = scrollTo;
    }
  }, []);

  // Gom buổi học theo ngày
  const sessionsByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((d) => {
      map[d] = [];
    });

    sessions.forEach((session) => {
      const dayKey = getDayKeyFromDateString(session.date);
      if (!map[dayKey]) map[dayKey] = [];
      map[dayKey].push(session);
    });

    return map;
  }, [sessions]);

  // Lấy số ngày (11, 12, 13...) cho từng cột - dùng default nếu không có data
  const dayNumberMap = useMemo(() => {
    return getCurrentWeekDayNumbers();
  }, []);

  // Calculate header date range string
  const weekRangeString = useMemo(() => {
    const { monday, sunday } = getCurrentWeekRange();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${monday.toLocaleDateString('en-US', options)} - ${sunday.toLocaleDateString('en-US', options)}`;
  }, []);

  const handleCancelSession = async () => {
    if (!selectedSession) return;
    setIsCancelling(true);
    try {
      await cancelSessionBooking(selectedSession.id); // Use booking ID
      // Remove from state
      setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
      setSelectedSession(null);
      setShowCancelConfirm(false);
      addToast("Hủy lịch thành công.", "success");
    } catch (err) {
      console.error("Lỗi khi hủy lịch:", err);
      addToast("Không thể hủy lịch. Vui lòng thử lại.", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Đang tải lịch...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="py-6 md:py-8 h-[calc(100vh-100px)] flex flex-col">
      {/* Tiêu đề trang */}
      <div className="mb-4 md:mb-6 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Lịch của tôi
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Xem tổng quan các buổi học/tutor trong tuần. Bấm vào từng buổi trong
          lịch để xem thông tin chi tiết.
        </p>
      </div>

      {/* Card lịch tuần - có chiều cao cố định, scroll bên trong */}
      <div className="border border-slate-300 bg-white flex-1 flex flex-col overflow-hidden">
        {/* Header - cố định */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-300 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-900" />
            <span className="text-sm md:text-base font-semibold text-slate-900">
              Tuần này
            </span>
          </div>
          <span className="text-xs md:text-sm text-slate-500">
            {weekRangeString}
          </span>
        </div>

        {/* Header ngày - cố định */}
        <div className="flex border-b border-slate-300 flex-shrink-0 header-row-scroll" style={{ scrollbarGutter: 'stable', overflowY: 'scroll' }}>
          {/* Cột giờ header (trống) */}
          <div className="w-16 md:w-20 flex-shrink-0 border-r border-slate-300 bg-slate-50" />
          
          {/* 7 cột ngày - dùng flex với width bằng nhau */}
          <div className="flex-1 flex">
            {DAYS.map((day, idx) => {
              const num = dayNumberMap[day];
              return (
                <div
                  key={day}
                  className={`flex-1 px-2 py-3 flex flex-col items-center justify-center bg-slate-50 ${
                    idx < 6 ? 'border-r border-slate-300' : ''
                  }`}
                >
                  <div className="text-[11px] md:text-xs font-semibold text-slate-500 tracking-wide uppercase">
                    {day}
                  </div>
                  <div className="mt-0.5 text-base md:text-lg font-bold text-slate-800">
                    {num}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body lịch - SCROLL BÊN TRONG KHUNG NÀY */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto"
          style={{ minHeight: 0, scrollbarGutter: 'stable', overflowY: 'scroll' }}
        >
          <div className="min-w-[900px] flex">
            {/* Cột giờ bên trái */}
            <div className="w-16 md:w-20 flex-shrink-0 border-r border-slate-300 bg-slate-50">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-slate-200 flex items-start justify-end pr-2 pt-1"
                  style={{ height: SLOT_HEIGHT }}
                >
                  <span className="text-[10px] md:text-xs text-slate-500">
                    {formatHourLabel(hour)}
                  </span>
                </div>
              ))}
            </div>

            {/* 7 cột ngày - dùng flex với width bằng nhau */}
            <div className="flex-1 flex">
              {DAYS.map((day, dayIdx) => {
                const daySessions = sessionsByDay[day] || [];

                return (
                  <div
                    key={day}
                    className={`flex-1 relative ${dayIdx < 6 ? 'border-r border-slate-300' : ''}`}
                    style={{ height: HOURS.length * SLOT_HEIGHT }}
                  >
                    {/* Lưới giờ nền */}
                    {HOURS.map((hour, idx) => (
                      <div
                        key={hour}
                        className="absolute left-0 right-0 border-b border-slate-200"
                        style={{
                          top: idx * SLOT_HEIGHT,
                          height: SLOT_HEIGHT,
                        }}
                      />
                    ))}

                    {/* Các block buổi học */}
                    {daySessions.map((session) => {
                      const [startDecRaw, endDecRaw] =
                        parseTimeRangeToDecimal(session.timeRange);

                      const startDec = Math.max(
                        START_HOUR,
                        Math.min(END_HOUR, startDecRaw)
                      );
                      const endDec = Math.max(
                        startDec,
                        Math.min(END_HOUR + 1, endDecRaw || startDec + 1)
                      );

                      const top = (startDec - START_HOUR) * SLOT_HEIGHT + 2;
                      const height = Math.max(
                        (endDec - startDec) * SLOT_HEIGHT - 4,
                        MIN_EVENT_HEIGHT
                      );

                      return (
                        <button
                          key={session.id}
                          type="button"
                          onClick={() => setSelectedSession(session)}
                          className="absolute left-1 right-1 rounded border-l-4 border-l-blue-400 bg-blue-50/70 hover:bg-blue-100/80 transition-colors text-left px-2 py-1.5 overflow-hidden"
                          style={{ top, height }}
                        >
                          <div className="text-xs font-semibold text-blue-600 line-clamp-2">
                            {session.subjectName}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {session.tutorName}
                          </div>
                          <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{session.timeRange}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal chi tiết buổi học */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md mx-4 rounded-md shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                {selectedSession.subjectName}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedSession(null);
                  setShowCancelConfirm(false);
                }}
                className="p-1 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="px-4 md:px-5 py-4 space-y-3 text-sm text-slate-800">
              <div>
                <div className="text-xs text-slate-500 mb-0.5">
                  Giảng viên / Tutor
                </div>
                <div>{selectedSession.tutorName}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-0.5">Thời gian</div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedSession.date}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-slate-800">
                  <Clock className="w-4 h-4" />
                  <span>{selectedSession.timeRange}</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-0.5">Hình thức</div>
                <div className="flex items-center gap-2 text-slate-800">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedSession.location}</span>
                </div>
              </div>

              {selectedSession.meetLink && (
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">
                    Link Google Meet
                  </div>
                  <a
                    href={selectedSession.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-2 text-xs md:text-sm text-blue-700 hover:underline break-all"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>{selectedSession.meetLink}</span>
                  </a>
                </div>
              )}

              {/* Nút Hủy lịch */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                {!showCancelConfirm ? (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hủy lịch
                  </button>
                ) : (
                  <div className="bg-red-50 p-3 rounded">
                    <div className="flex items-start gap-2 text-red-700 mb-3">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <p className="text-sm">Bạn có chắc chắn muốn hủy lịch này không?</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelSession}
                        disabled={isCancelling}
                        className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        {isCancelling ? "Đang hủy..." : "Xác nhận hủy"}
                      </button>
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        disabled={isCancelling}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50"
                      >
                        Quay lại
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState, useRef } from "react";
import { Calendar, Clock, MapPin, Users, Plus, X, Link2 } from "lucide-react";
import { 
  fetchTutorCalendarEvents,
  createTutorSession,
  createTutorAvailability,
  MOCK_COURSES,
  MOCK_SESSION_TYPES,
  MOCK_LOCATIONS
} from "../../../services/tutorCalendarService";

// --- Calendar Configuration ---
const START_HOUR = 7;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
const SLOT_HEIGHT = 60;
const MIN_EVENT_HEIGHT = 52;
const DEFAULT_SCROLL_HOUR = 8;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_DAY_NUMBERS = { Mon: 11, Tue: 12, Wed: 13, Thu: 14, Fri: 15, Sat: 16, Sun: 17 };

// --- Helper Functions ---
const formatHourLabel = (h) => (h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`);

const parseTimeRangeToDecimal = (timeRange) => {
  if (!timeRange) return [START_HOUR, START_HOUR + 1];
  const [startStr, endStr] = timeRange.split("-");
  const parse = (str) => {
    const match = str.trim().match(/(\d{1,2}):(\d{2})/);
    if (!match) return START_HOUR;
    return parseInt(match[1], 10) + parseInt(match[2], 10) / 60;
  };
  return [parse(startStr), endStr ? parse(endStr) : parse(startStr) + 1];
};

const getDayKeyFromDateString = (dateStr) => {
  if (!dateStr) return "Mon";
  const key = dateStr.split(",")[0].trim().slice(0, 3);
  return DAYS.includes(key) ? key : "Mon";
};

const getDayNumberFromDateString = (dateStr) => {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d.getDate();
};

// --- Event Components ---
const SessionEvent = ({ event, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute left-1 right-1 rounded border-l-4 border-l-blue-500 bg-blue-50/80 hover:bg-blue-100/90 transition-colors text-left px-2 py-1 overflow-hidden"
  >
    <div className="text-xs font-semibold text-blue-700 line-clamp-1">{event.subjectName}</div>
    <div className="text-[11px] text-slate-600 line-clamp-1 flex items-center gap-1.5 mt-0.5">
      <Users className="w-3 h-3 flex-shrink-0" /> {event.studentCount} SV
    </div>
    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{event.timeRange}</div>
  </button>
);

const AvailabilityEvent = ({ event, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute left-1 right-1 rounded border-l-4 border-l-green-500 bg-green-50/80 hover:bg-green-100/90 transition-colors text-left px-2 py-1 overflow-hidden"
  >
    <div className="text-xs font-semibold text-green-700 line-clamp-1">Lịch rảnh</div>
    <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{event.location}</div>
    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{event.timeRange}</div>
  </button>
);

const PendingRequestEvent = ({ event, onClick }) => (
    <button
    type="button"
    onClick={onClick}
    className="absolute left-1 right-1 rounded border-l-4 border-l-amber-500 bg-amber-50/80 hover:bg-amber-100/90 transition-colors text-left px-2 py-1 overflow-hidden"
  >
    <div className="text-xs font-semibold text-amber-700 line-clamp-1">Yêu cầu mới</div>
    <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{event.subjectName}</div>
    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{event.timeRange}</div>
  </button>
)

// --- Main Component ---
export default function TutorDashboardPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(null); // null, 'session', 'availability'
  const scrollContainerRef = useRef(null);

  const refreshEvents = () => {
    fetchTutorCalendarEvents()
      .then(setEvents)
      .catch((err) => console.error("Lỗi khi tải lịch:", err));
  };

  useEffect(() => {
    refreshEvents();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = (DEFAULT_SCROLL_HOUR - START_HOUR) * SLOT_HEIGHT;
    }
  }, []);

  const eventsByDay = useMemo(() => {
    const map = DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
    events.forEach((event) => {
      const dayKey = getDayKeyFromDateString(event.date);
      if (map[dayKey]) map[dayKey].push(event);
    });
    return map;
  }, [events]);

  const dayNumberMap = useMemo(() => {
    const map = { ...DEFAULT_DAY_NUMBERS };
    events.forEach((event) => {
      const key = getDayKeyFromDateString(event.date);
      const num = getDayNumberFromDateString(event.date);
      if (num) map[key] = num;
    });
    return map;
  }, [events]);

  const handleEventClick = (event) => setSelectedEvent(event);
  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(null);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex-shrink-0 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Lịch dạy</h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Quản lý lịch rảnh, buổi học và các yêu cầu tư vấn.
          </p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsModalOpen('availability')} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-50">
                <Plus className="w-4 h-4" /> Thêm lịch rảnh
            </button>
            <button onClick={() => setIsModalOpen('session')} className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white text-sm font-medium rounded-md hover:bg-sky-600">
                <Plus className="w-4 h-4" /> Thêm buổi học
            </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="border border-slate-200 bg-white flex-1 flex flex-col overflow-hidden rounded-lg shadow-sm">
        <div className="flex border-b border-slate-200 flex-shrink-0" style={{ scrollbarGutter: 'stable', overflowY: 'scroll' }}>
          <div className="w-16 md:w-20 flex-shrink-0 border-r border-slate-200" />
          <div className="flex-1 grid grid-cols-7">
            {DAYS.map((day) => (
              <div key={day} className="px-2 py-2.5 flex flex-col items-center justify-center border-r border-slate-200 last:border-r-0">
                <div className="text-[11px] md:text-xs font-semibold text-slate-500 uppercase">{day}</div>
                <div className="mt-0.5 text-base md:text-lg font-bold text-slate-800">{dayNumberMap[day]}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
          <div className="min-w-[900px] flex">
            <div className="w-16 md:w-20 flex-shrink-0 border-r border-slate-200">
              {HOURS.map((hour) => (
                <div key={hour} className="border-b border-slate-200 flex items-start justify-end pr-2 pt-1" style={{ height: SLOT_HEIGHT }}>
                  <span className="text-[10px] md:text-xs text-slate-400 -translate-y-1.5">{formatHourLabel(hour)}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7">
              {DAYS.map((day) => (
                <div key={day} className="relative border-r border-slate-200 last:border-r-0">
                  {HOURS.map((_, idx) => <div key={idx} className="border-b border-slate-200" style={{ height: SLOT_HEIGHT }} />)}
                  {eventsByDay[day].map((event) => {
                    const [startDec, endDec] = parseTimeRangeToDecimal(event.timeRange);
                    const top = (startDec - START_HOUR) * SLOT_HEIGHT + 2;
                    const height = Math.max((endDec - startDec) * SLOT_HEIGHT - 4, MIN_EVENT_HEIGHT);
                    
                    if (event.type === 'session' && event.status === 'scheduled') {
                      return <SessionEvent key={event.id} event={event} onClick={() => handleEventClick(event)} style={{ top, height }} />;
                    }
                    if (event.type === 'availability') {
                      return <AvailabilityEvent key={event.id} event={event} onClick={() => handleEventClick(event)} style={{ top, height }} />;
                    }
                    if (event.status === 'pending_request') {
                        return <PendingRequestEvent key={event.id} event={event} onClick={() => handleEventClick(event)} style={{ top, height }} />
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={closeModal} />}
      {isModalOpen === 'session' && <AddSessionModal onClose={closeModal} onSave={refreshEvents} />}
      {isModalOpen === 'availability' && <AddAvailabilityModal onClose={closeModal} onSave={refreshEvents} />}
    </div>
  );
}

// --- Modal Components ---
const Modal = ({ children, title, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X className="w-4 h-4" /></button>
      </div>
      {children}
    </div>
  </div>
);

const EventDetailModal = ({ event, onClose }) => (
  <Modal title="Chi tiết" onClose={onClose}>
    <div className="p-4 md:p-5 space-y-3 text-sm">
      <p><span className="font-semibold">Loại:</span> {event.type}</p>
      <p><span className="font-semibold">Môn học:</span> {event.subjectName || 'N/A'}</p>
      <p><span className="font-semibold">Thời gian:</span> {event.date}, {event.timeRange}</p>
      <p><span className="font-semibold">Địa điểm:</span> {event.location}</p>
      {event.meetLink && <p><span className="font-semibold">Link:</span> <a href={event.meetLink} className="text-blue-600 hover:underline">{event.meetLink}</a></p>}
      <div className="pt-2 flex justify-end gap-2">
        {event.status === 'pending_request' && (
            <>
                <button className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600">Từ chối</button>
                <button className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-md hover:bg-green-600">Chấp nhận</button>
            </>
        )}
        <button onClick={onClose} className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200">Đóng</button>
      </div>
    </div>
  </Modal>
);

const AddSessionModal = ({ onClose, onSave }) => {
    const [courseId, setCourseId] = useState('');
    const [date, setDate] = useState('2050-01-15');
    const [startTime, setStartTime] = useState('09:30');
    const [endTime, setEndTime] = useState('11:00');
    const [location, setLocation] = useState('Online');
    const [sessionType, setSessionType] = useState('Nhóm');
    const [studentCount, setStudentCount] = useState(25);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sessionData = {
            subjectName: MOCK_COURSES.find(c => c.id === courseId)?.name,
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            timeRange: `${startTime} - ${endTime}`,
            location,
            studentCount,
        };
        await createTutorSession(sessionData);
        onSave();
        onClose();
    };

    return (
        <Modal title="Thêm buổi học" onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
                {/* Form fields */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Môn học</label>
                    <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white">
                        <option value="">-- Chọn môn --</option>
                        {MOCK_COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Ngày</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Bắt đầu</label>
                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Kết thúc</label>
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Địa điểm</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white">
                        {MOCK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200">Hủy</button>
                    <button type="submit" className="px-4 py-1.5 text-xs bg-sky-500 text-white rounded-md hover:bg-sky-600">Lưu</button>
                </div>
            </form>
        </Modal>
    );
};

const AddAvailabilityModal = ({ onClose, onSave }) => {
    const [date, setDate] = useState('2050-01-13');
    const [startTime, setStartTime] = useState('14:00');
    const [endTime, setEndTime] = useState('17:00');
    const [location, setLocation] = useState('Online');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const availabilityData = {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            timeRange: `${startTime} - ${endTime}`,
            location,
        };
        await createTutorAvailability(availabilityData);
        onSave();
        onClose();
    };

    return (
        <Modal title="Thêm lịch rảnh" onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Ngày</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Từ</label>
                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Đến</label>
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5" />
                    </div>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Hình thức</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white">
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Online / Offline">Linh hoạt</option>
                    </select>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200">Hủy</button>
                    <button type="submit" className="px-4 py-1.5 text-xs bg-sky-500 text-white rounded-md hover:bg-sky-600">Lưu</button>
                </div>
            </form>
        </Modal>
    );
};
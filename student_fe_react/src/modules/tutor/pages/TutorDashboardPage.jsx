import { useEffect, useMemo, useState, useRef } from "react";
import { Calendar, Clock, MapPin, Users, Plus, X, Link2 } from "lucide-react";
import { 
  fetchTutorCalendarEvents,
  createTutorSession,
  createTutorAvailability,
  deleteAvailability,
  updateAvailability,
  cancelSession,
  MOCK_COURSES,
  MOCK_SESSION_TYPES,
  MOCK_LOCATIONS
} from "../../../services/tutorCalendarService";
import { api } from "../../../utils/api.js";

// --- Calendar Configuration ---
const START_HOUR = 7;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
const SLOT_HEIGHT = 60;
const MIN_EVENT_HEIGHT = 52;
const DEFAULT_SCROLL_HOUR = 8;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// --- Helper Functions ---
// Get current week range (Mon-Sun)
function getCurrentWeekRange() {
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sun, 1=Mon, ...
  
  // Calculate Monday of current week
  const diffToMon = currentDay === 0 ? 6 : currentDay - 1;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMon);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return { monday, sunday };
}

// Generate day numbers for the current week
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
const SessionEvent = ({ event, onClick, style }) => (
  <button
    type="button"
    onClick={onClick}
    style={style}
    className="absolute left-1 right-1 rounded border-l-4 border-l-4 border-l-blue-400 bg-blue-50/70 hover:bg-blue-100/80 transition-colors text-left px-2 py-1.5 overflow-hidden"
  >
    <div className="text-xs font-semibold text-blue-600 line-clamp-2">{event.subjectName}</div>
    <div className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1.5 mt-0.5">
      <Users className="w-3 h-3 flex-shrink-0" /> {event.studentCount}/{event.maxStudents || 10}
    </div>
    <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
      <Clock className="w-3 h-3" />
      <span>{event.timeRange}</span>
    </div>
  </button>
);

const AvailabilityEvent = ({ event, onClick, style, onResizeStart, isResizing }) => {
  const handleResizeTop = (e) => {
    e.stopPropagation();
    onResizeStart(event, 'top', e);
  };

  const handleResizeBottom = (e) => {
    e.stopPropagation();
    onResizeStart(event, 'bottom', e);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`absolute left-1 right-1 rounded border-l-4 border-l-green-400 text-left px-2 py-1.5 overflow-hidden group ${
        isResizing 
          ? 'bg-green-200/90 shadow-lg z-50' 
          : 'bg-green-50/70 hover:bg-green-100/80 transition-colors'
      }`}
    >
      {/* Top resize handle */}
      <div
        onMouseDown={handleResizeTop}
        className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Kéo để điều chỉnh giờ bắt đầu"
      />

      <div className="text-xs font-semibold text-green-600 line-clamp-1">Lịch rảnh</div>
      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{event.location}</div>
      <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{event.timeRange}</span>
      </div>

      {/* Bottom resize handle */}
      <div
        onMouseDown={handleResizeBottom}
        className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Kéo để điều chỉnh giờ kết thúc"
      />
    </button>
  );
};

const PendingRequestEvent = ({ event, onClick, style }) => (
    <button
    type="button"
    onClick={onClick}
    style={style}
    className="absolute left-1 right-1 rounded border-l-4 border-l-amber-400 bg-amber-50/70 hover:bg-amber-100/80 transition-colors text-left px-2 py-1.5 overflow-hidden"
  >
    <div className="text-xs font-semibold text-amber-600 line-clamp-1">Yêu cầu mới</div>
    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{event.subjectName}</div>
    <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
      <Clock className="w-3 h-3" />
      <span>{event.timeRange}</span>
    </div>
  </button>
)

// --- Main Component ---
export default function TutorDashboardPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(null); // null, 'session', 'availability'
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [quickCreateData, setQuickCreateData] = useState(null);
  const [resizingEvent, setResizingEvent] = useState(null); // { event, edge: 'top'|'bottom', originalY, originalTime }
  const [tutorSubjects, setTutorSubjects] = useState([]);
  const scrollContainerRef = useRef(null);

  const refreshEvents = () => {
    // Only fetch events if we have an auth token
    const token = localStorage.getItem('bkarch_jwt');
    if (!token) {
      console.warn('No auth token found. Skipping calendar events fetch.');
      return;
    }

    fetchTutorCalendarEvents()
      .then(events => {
        console.log('📅 Calendar received events:', events);
        setEvents(events);
      })
      .catch((err) => console.error("Lỗi khi tải lịch:", err));
  };

  useEffect(() => {
    refreshEvents();
    
    // Fetch tutor profile to get subjects
    const fetchTutorProfile = async () => {
      try {
        const response = await api.get('/tutors/me');
        if (response.success && response.data) {
          setTutorSubjects(response.data.subjectIds || []);
        }
      } catch (err) {
        console.error('Failed to fetch tutor profile:', err);
      }
    };
    fetchTutorProfile();
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = (DEFAULT_SCROLL_HOUR - START_HOUR) * SLOT_HEIGHT;
    }
    
    // Auto refresh every 5 minutes
    const interval = setInterval(refreshEvents, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const eventsByDay = useMemo(() => {
    const map = DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
    
    console.log('🔍 Processing events. Total events:', events.length);
    
    events.forEach((event) => {
      const dayKey = getDayKeyFromDateString(event.date);
      console.log(`🗓️ Event "${event.subjectName || event.type}": date="${event.date}", dayKey="${dayKey}", type="${event.type}", status="${event.status}"`);
      
      if (map[dayKey]) {
        map[dayKey].push(event);
        console.log(`  ✅ Added to ${dayKey}`);
      } else {
        console.log(`  ⚠️ dayKey "${dayKey}" not found in map`);
      }
    });
    
    console.log('📊 EventsByDay summary:');
    DAYS.forEach(day => {
      console.log(`  ${day}: ${map[day].length} events`);
    });
    
    return map;
  }, [events]);

  const dayNumberMap = useMemo(() => {
    return getCurrentWeekDayNumbers();
  }, []);

  // Calculate header date range string
  const weekRangeString = useMemo(() => {
    const { monday, sunday } = getCurrentWeekRange();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    console.log('📅 Current week:', monday.toISOString(), 'to', sunday.toISOString());
    return `${monday.toLocaleDateString('en-US', options)} - ${sunday.toLocaleDateString('en-US', options)}`;
  }, []);

  const handleEventClick = (event) => setSelectedEvent(event);
  
  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(null);
    setEditingAvailability(null);
    setQuickCreateData(null);
  };

  const handleEditAvailability = (event) => {
    setEditingAvailability(event);
    setIsModalOpen('edit-availability');
  };

  const handleDeleteAvailability = async (event, reason) => {
    try {
      console.log('🗑️ Cancelling event:', event.id, 'Type:', event.type, 'Reason:', reason);
      
      if (event.type === 'availability') {
        await deleteAvailability(event.id, reason);
        console.log('✅ Availability deleted');
      } else if (event.type === 'session') {
        await cancelSession(event.id, reason);
        console.log('✅ Session cancelled');
      }
      
      const successMsg = reason 
        ? `✅ Hủy thành công!\nLý do: ${reason}`
        : '✅ Hủy thành công!';
      alert(successMsg);
      refreshEvents();
    } catch (error) {
      console.error('❌ Error cancelling:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      alert(`❌ Không thể hủy: ${errorMsg}`);
      throw error;
    }
  };

  const handleEmptySlotClick = (day, hour, e) => {
    // Don't trigger if clicking on an event
    if (e.target.closest('button')) return;

    // Calculate date from day
    const { monday } = getCurrentWeekRange();
    const dayIndex = DAYS.indexOf(day);
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + dayIndex);

    // Format date as YYYY-MM-DD (local timezone, không dùng toISOString)
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dayNum = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;

    // Round hour to ensure it's on the hour
    const startHour = Math.floor(hour);
    const startTime = `${String(startHour).padStart(2, '0')}:00`;
    const endTime = `${String(startHour + 1).padStart(2, '0')}:00`;

    console.log('📍 Creating new availability:', { day, dayName: DAYS[dayIndex], date: dateStr, startTime, endTime });

    // Pre-fill modal and open it
    setQuickCreateData({ date: dateStr, startTime, endTime });
    setIsModalOpen('availability');
  };

  const handleConvertToSession = (availabilityEvent) => {
    console.log('🔄 Converting availability to session:', availabilityEvent);
    
    // Parse date from "Mon, Dec 5, 2025" format
    const dateParts = availabilityEvent.date.split(', ');
    const [month, day, year] = [dateParts[1].split(' ')[0], dateParts[1].split(' ')[1], dateParts[2]];
    const monthMap = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', 
                       Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
    const dateStr = `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
    
    const [startTime, endTime] = availabilityEvent.timeRange.split(' - ');
    
    // Set prefill data for session modal
    setQuickCreateData({ 
      date: dateStr, 
      startTime, 
      endTime,
      availabilityId: availabilityEvent.id  // Keep reference to delete after
    });
    setIsModalOpen('session');
  };

  // Expose handler to EventDetailModal
  useEffect(() => {
    window.convertAvailabilityToSession = handleConvertToSession;
    return () => {
      delete window.convertAvailabilityToSession;
    };
  }, []);

  const handleResizeStart = (event, edge, mouseEvent) => {
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();

    console.log('🔧 Resize start:', event.id, edge);

    const [startTime, endTime] = event.timeRange.split(' - ');
    setResizingEvent({
      event,
      edge,
      originalY: mouseEvent.clientY,
      originalStartTime: startTime,
      originalEndTime: endTime,
    });
  };

  const handleResizeMove = (e) => {
    if (!resizingEvent) return;

    const deltaY = e.clientY - resizingEvent.originalY;
    const deltaHours = Math.round(deltaY / SLOT_HEIGHT); // Snap to hours

    if (deltaHours === 0) return;

    const [startHour, startMin] = resizingEvent.originalStartTime.split(':').map(Number);
    const [endHour, endMin] = resizingEvent.originalEndTime.split(':').map(Number);

    let newStartHour = startHour;
    let newEndHour = endHour;

    if (resizingEvent.edge === 'top') {
      newStartHour = Math.max(START_HOUR, Math.min(endHour - 1, startHour + deltaHours));
    } else {
      newEndHour = Math.max(startHour + 1, Math.min(END_HOUR, endHour + deltaHours));
    }

    // Update event in state
    const newStartTime = `${String(newStartHour).padStart(2, '0')}:00`;
    const newEndTime = `${String(newEndHour).padStart(2, '0')}:00`;

    setEvents(prev => prev.map(evt => {
      if (evt.id === resizingEvent.event.id) {
        return { ...evt, timeRange: `${newStartTime} - ${newEndTime}` };
      }
      return evt;
    }));
  };

  const handleResizeEnd = async () => {
    if (!resizingEvent) return;

    console.log('✅ Resize end:', resizingEvent.event.id);

    // Find updated event
    const updatedEvent = events.find(e => e.id === resizingEvent.event.id);
    if (!updatedEvent) {
      setResizingEvent(null);
      return;
    }

    const [newStartTime, newEndTime] = updatedEvent.timeRange.split(' - ');

    // Check if actually changed
    if (newStartTime === resizingEvent.originalStartTime && newEndTime === resizingEvent.originalEndTime) {
      console.log('⏭️ No change detected, skipping API call');
      setResizingEvent(null);
      return;
    }

    // Call API to update
    try {
      console.log('📡 Updating availability via API:', {
        id: updatedEvent.id,
        startTime: newStartTime,
        endTime: newEndTime,
      });

      await updateAvailability(updatedEvent.id, {
        startTime: newStartTime,
        endTime: newEndTime,
      });

      console.log('✅ API update successful');
      alert(`✅ Đã cập nhật thời gian: ${newStartTime} - ${newEndTime}`);
      
      // Refresh to get latest data from backend
      refreshEvents();
    } catch (error) {
      console.error('❌ Error updating availability:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      alert(`❌ Không thể cập nhật: ${errorMsg}`);
      
      // Revert to original on error
      refreshEvents();
    }

    setResizingEvent(null);
  };

  // Add global mouse event listeners for resize
  useEffect(() => {
    if (resizingEvent) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingEvent, events]);

  return (
    <div className={`min-h-screen flex flex-col ${resizingEvent ? 'select-none' : ''}`}>
      {/* Resize overlay */}
      {resizingEvent && (
        <div className="fixed inset-0 z-40 cursor-ns-resize" />
      )}

      {/* Header */}
      <div className="mb-4 md:mb-6 flex-shrink-0 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Lịch dạy</h1>
          <p className="mt-1 text-sm text-slate-600">
            {weekRangeString}
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
      <div className="border border-slate-300 bg-white mb-6">
        {/* Header bar with week range */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-300">
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

        {/* Day headers */}
        <div className="flex border-b border-slate-300">
          <div className="w-16 md:w-20 flex-shrink-0 border-r border-slate-300 bg-slate-50" />
          <div className="flex-1 flex">
            {DAYS.map((day, idx) => (
              <div key={day} className={`flex-1 px-2 py-3 flex flex-col items-center justify-center bg-slate-50 ${
                idx < 6 ? 'border-r border-slate-300' : ''
              }`}>
                <div className="text-[11px] md:text-xs font-semibold text-slate-500 tracking-wide uppercase">{day}</div>
                <div className="mt-0.5 text-base md:text-lg font-bold text-slate-800">{dayNumberMap[day]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar body */}
        <div ref={scrollContainerRef} className="overflow-x-auto">
          <div className="min-w-[900px] flex">
            <div className="w-16 md:w-20 flex-shrink-0 border-r border-slate-300 bg-slate-50">
              {HOURS.map((hour) => (
                <div key={hour} className="border-b border-slate-200 flex items-start justify-end pr-2 pt-1" style={{ height: SLOT_HEIGHT }}>
                  <span className="text-[10px] md:text-xs text-slate-500">{formatHourLabel(hour)}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 flex">
              {DAYS.map((day, dayIdx) => (
                <div key={day} className={`flex-1 relative ${dayIdx < 6 ? 'border-r border-slate-300' : ''}`} style={{ height: HOURS.length * SLOT_HEIGHT }}>
                  {/* Grid lines - clickable */}
                  {HOURS.map((hour, idx) => (
                    <div 
                      key={hour} 
                      onClick={(e) => handleEmptySlotClick(day, hour, e)}
                      className="absolute left-0 right-0 border-b border-slate-200 cursor-pointer hover:bg-blue-50/30 transition-colors group" 
                      style={{
                        top: idx * SLOT_HEIGHT,
                        height: SLOT_HEIGHT,
                      }}
                    >
                      {/* Hint text on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs text-blue-600 font-medium">+ Tạo lịch rảnh</span>
                      </div>
                    </div>
                  ))}

                  {/* Events */}
                  {eventsByDay[day].map((event) => {
                    const [startDec, endDec] = parseTimeRangeToDecimal(event.timeRange);
                    const top = (startDec - START_HOUR) * SLOT_HEIGHT + 2;
                    const height = Math.max((endDec - startDec) * SLOT_HEIGHT - 4, MIN_EVENT_HEIGHT);
                    
                    if (event.type === 'session' && (event.status === 'scheduled' || event.status === 'SCHEDULED')) {
                      return <SessionEvent key={event.id} event={event} onClick={() => handleEventClick(event)} style={{ top: `${top}px`, height: `${height}px` }} />;
                    }
                    if (event.type === 'availability' && (event.status === 'available' || event.status === 'AVAILABLE')) {
                      return <AvailabilityEvent 
                        key={event.id} 
                        event={event} 
                        onClick={() => handleEventClick(event)} 
                        onResizeStart={handleResizeStart} 
                        isResizing={resizingEvent?.event?.id === event.id}
                        style={{ top: `${top}px`, height: `${height}px` }} 
                      />;
                    }
                    if (event.status === 'pending_request' || event.status === 'PENDING_REQUEST') {
                        return <PendingRequestEvent key={event.id} event={event} onClick={() => handleEventClick(event)} style={{ top: `${top}px`, height: `${height}px` }} />
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
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={closeModal} onEdit={handleEditAvailability} onDelete={handleDeleteAvailability} />}
      {isModalOpen === 'session' && <AddSessionModal onClose={closeModal} onSave={refreshEvents} prefillData={quickCreateData} tutorSubjects={tutorSubjects} />}
      {isModalOpen === 'availability' && <AddAvailabilityModal onClose={closeModal} onSave={refreshEvents} prefillData={quickCreateData} />}
      {isModalOpen === 'edit-availability' && <EditAvailabilityModal event={editingAvailability} onClose={closeModal} onSave={refreshEvents} />}
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

const EventDetailModal = ({ event, onClose, onEdit, onDelete }) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      // Reason is optional, pass empty string if not provided
      await onDelete(event, cancelReason.trim() || '');
      onClose();
    } catch (error) {
      console.error('Error cancelling:', error);
      alert('Không thể hủy. Vui lòng thử lại.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (showCancelDialog) {
    return (
      <Modal title="Xác nhận hủy" onClose={() => setShowCancelDialog(false)}>
        <div className="p-4 md:p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Lưu ý:</strong> Bạn đang hủy {event.type === 'availability' ? 'lịch rảnh' : 'buổi học'} vào <strong>{event.date}</strong> lúc <strong>{event.timeRange}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lý do hủy <span className="text-slate-400">(không bắt buộc)</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Nhập lý do hủy (nếu có)..."
              disabled={isCancelling}
            />
            <p className="mt-1 text-xs text-slate-500">
              {event.type === 'session' && 'Nếu có lý do, sinh viên sẽ nhận được thông báo.'}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowCancelDialog(false)} 
              className="px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200"
              disabled={isCancelling}
            >
              Quay lại
            </button>
            <button 
              onClick={handleCancel}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
              disabled={isCancelling}
            >
              {isCancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Thông tin chi tiết" onClose={onClose}>
      <div className="p-4 md:p-5">
        {/* Event Type Badge */}
        <div className="mb-4">
          {event.type === 'availability' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              📅 Lịch rảnh
            </span>
          )}
          {event.type === 'session' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              📚 Buổi học
            </span>
          )}
          {event.status === 'pending_request' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              ⏳ Yêu cầu chờ duyệt
            </span>
          )}
        </div>

        {/* Event Info */}
        <div className="space-y-3 text-sm">
          {event.subjectName && (
            <div className="flex items-start gap-3">
              <span className="text-slate-500 min-w-[80px]">Môn học:</span>
              <span className="font-medium text-slate-900">{event.subjectName}</span>
            </div>
          )}
          
          <div className="flex items-start gap-3">
            <span className="text-slate-500 min-w-[80px]">Ngày:</span>
            <span className="font-medium text-slate-900">{event.date}</span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-slate-500 min-w-[80px]">Thời gian:</span>
            <span className="font-medium text-slate-900 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {event.timeRange}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-slate-500 min-w-[80px]">Địa điểm:</span>
            <span className="font-medium text-slate-900 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.location}
            </span>
          </div>

          {event.studentCount !== undefined && event.studentCount > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-slate-500 min-w-[80px]">Số SV:</span>
              <span className="font-medium text-slate-900 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.studentCount} sinh viên
              </span>
            </div>
          )}

          {event.meetLink && (
            <div className="flex items-start gap-3">
              <span className="text-slate-500 min-w-[80px]">Link:</span>
              <a 
                href={event.meetLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline flex items-center gap-1"
              >
                <Link2 className="w-4 h-4" />
                Tham gia meeting
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-2 flex-wrap">
          {event.type === 'availability' && (
            <>
              <button 
                onClick={() => { onClose(); onEdit(event); }} 
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                ✏️ Chỉnh sửa
              </button>
              <button 
                onClick={() => {
                  onClose();
                  // Open convert to session modal with prefilled data
                  if (window.convertAvailabilityToSession) {
                    window.convertAvailabilityToSession(event);
                  }
                }}
                className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                📚 Mở buổi học
              </button>
              <button 
                onClick={() => setShowCancelDialog(true)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                🗑️ Hủy lịch
              </button>
            </>
          )}
          
          {event.type === 'session' && (
            <button 
              onClick={() => setShowCancelDialog(true)}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              ❌ Hủy buổi học
            </button>
          )}

          {event.status === 'pending_request' && (
            <>
              <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                ❌ Từ chối
              </button>
              <button className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                ✅ Chấp nhận
              </button>
            </>
          )}
          
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};

const AddSessionModal = ({ onClose, onSave, prefillData, tutorSubjects = [] }) => {
    const [courseId, setCourseId] = useState('');
    const [date, setDate] = useState(prefillData?.date || new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState(prefillData?.startTime || '09:00');
    const [endTime, setEndTime] = useState(prefillData?.endTime || '11:00');
    const [location, setLocation] = useState('Online');
    const [meetLink, setMeetLink] = useState('');
    const [sessionType, setSessionType] = useState('Nhóm');
    const [studentCount, setStudentCount] = useState(25);
    
    // Generate hour options (7:00 - 21:00)
    const timeOptions = Array.from({ length: 15 }, (_, i) => {
        const hour = (7 + i).toString().padStart(2, '0');
        return `${hour}:00`;
    });
    
    // Use tutor's subjects directly (from tutor profile)
    // tutorSubjects is array of subject objects: [{ _id, name, code }, ...]
    const availableCourses = tutorSubjects;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!courseId) {
            alert('Vui lòng nhập môn học');
            return;
        }
        
        // Combine date with time
        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);
        
        // Validate meeting link for online sessions
        if (location === 'Online' && !meetLink.trim()) {
            alert('⚠️ Vui lòng nhập link meeting cho buổi học Online');
            return;
        }
        
        const sessionData = {
            subjectName: courseId, // subjectId is the name (e.g., "CNPM_101")
            subjectId: courseId,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            location: location === 'Online' ? meetLink : location,
            meetLink: location === 'Online' ? meetLink : undefined,
            maxStudents: parseInt(studentCount) || 1,
        };
        
        console.log('📤 Creating session with data:', sessionData);
        
        try {
            // Create session first
            await createTutorSession(sessionData);
            
            // If this was converted from availability, delete the availability slot
            if (prefillData?.availabilityId) {
                console.log('🔄 Deleting original availability:', prefillData.availabilityId);
                try {
                    await deleteAvailability(prefillData.availabilityId, 'Đã chuyển thành buổi học');
                    console.log('✅ Availability deleted after session creation');
                } catch (err) {
                    console.error('⚠️ Warning: Could not delete availability:', err);
                    // Don't fail the whole operation if deletion fails
                }
            }
            
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to create session:', error);
            console.error('Error details:', error.response || error);
            if (error.message?.includes('conflicts')) {
                alert('Thời gian này đã có buổi học hoặc lịch rảnh khác. Vui lòng chọn thời gian khác.');
            } else {
                const errorMsg = error.data?.message || error.message || 'Vui lòng thử lại';
                alert(`Lỗi khi tạo buổi học: ${errorMsg}`);
            }
        }
    };

    const modalTitle = prefillData?.availabilityId 
        ? `Mở buổi học từ lịch rảnh - ${new Date(prefillData.date).toLocaleDateString('vi-VN')}`
        : 'Thêm buổi học';

    return (
        <Modal title={modalTitle} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
                {prefillData?.availabilityId && (
                    <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2">
                        <p className="text-xs text-green-800">
                            ✅ <strong>Chuyển đổi:</strong> Lịch rảnh sẽ được thay thế bằng buổi học này sau khi lưu
                        </p>
                    </div>
                )}
                {/* Form fields */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Môn học</label>
                    <input 
                        type="text" 
                        value={courseId} 
                        onChange={e => setCourseId(e.target.value)} 
                        placeholder="Nhập tên môn học"
                        className="w-full border border-slate-300 rounded-md px-2 py-1.5"
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Ngày</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Bắt đầu</label>
                        <select value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white">
                            {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Kết thúc</label>
                        <select value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white">
                            {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Địa điểm</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white">
                        {MOCK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
                
                {location === 'Online' && (
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Link Meeting <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            value={meetLink}
                            onChange={e => setMeetLink(e.target.value)}
                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">Nhập link Google Meet, Zoom, hoặc nền tảng khác</p>
                    </div>
                )}
                
                <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200">Hủy</button>
                    <button type="submit" className="px-4 py-1.5 text-xs bg-sky-500 text-white rounded-md hover:bg-sky-600">Lưu</button>
                </div>
            </form>
        </Modal>
    );
};

const AddAvailabilityModal = ({ onClose, onSave, prefillData }) => {
    const [date, setDate] = useState(prefillData?.date || new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState(prefillData?.startTime || '14:00');
    const [endTime, setEndTime] = useState(prefillData?.endTime || '17:00');
    const [location, setLocation] = useState('Online');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate hourly format (HH:00)
        const startHour = startTime.split(':')[0];
        const endHour = endTime.split(':')[0];
        const startMinutes = startTime.split(':')[1];
        const endMinutes = endTime.split(':')[1];

        if (startMinutes !== '00' || endMinutes !== '00') {
            setError('⚠️ Thời gian phải là giờ tròn (ví dụ: 09:00, 14:00)');
            return;
        }

        if (parseInt(endHour) <= parseInt(startHour)) {
            setError('⚠️ Thời gian kết thúc phải lớn hơn thời gian bắt đầu ít nhất 1 giờ');
            return;
        }

        const availabilityData = {
            date,
            startTime,
            endTime,
            location,
        };
        try {
            await createTutorAvailability(availabilityData);
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to create availability:', error);
            const errorMsg = error?.response?.data?.message || error?.message || 'Lỗi khi tạo lịch rảnh';
            setError(`❌ ${errorMsg}`);
        }
    };

    const modalTitle = prefillData 
        ? `Tạo lịch rảnh - ${new Date(prefillData.date).toLocaleDateString('vi-VN')} ${prefillData.startTime}`
        : 'Thêm lịch rảnh';

    return (
        <Modal title={modalTitle} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
                {prefillData && (
                    <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2">
                        <p className="text-xs text-green-800">
                            ✅ <strong>Tạo nhanh:</strong> Đã chọn {new Date(prefillData.date).toLocaleDateString('vi-VN', { weekday: 'long' })}, {prefillData.startTime} - {prefillData.endTime}
                        </p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Ngày</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)} 
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Từ giờ</label>
                        <select 
                            value={startTime} 
                            onChange={e => setStartTime(e.target.value)} 
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white"
                            required
                        >
                            {Array.from({length: 15}, (_, i) => i + 7).map(hour => {
                                const timeStr = `${String(hour).padStart(2, '0')}:00`;
                                return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Đến giờ</label>
                        <select 
                            value={endTime} 
                            onChange={e => setEndTime(e.target.value)} 
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white"
                            required
                        >
                            {Array.from({length: 15}, (_, i) => i + 7).map(hour => {
                                const timeStr = `${String(hour).padStart(2, '0')}:00`;
                                return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200">Hủy</button>
                    <button type="submit" className="px-4 py-1.5 text-xs bg-sky-500 text-white rounded-md hover:bg-sky-600">Lưu</button>
                </div>
            </form>
        </Modal>
    );
};

const EditAvailabilityModal = ({ event, onClose, onSave }) => {
    // Parse time range "09:00 - 11:00" to get start and end times
    const parseTime = (timeRange) => {
        if (!timeRange) return ['09:00', '17:00'];
        const parts = timeRange.split('-').map(t => t.trim());
        return [parts[0] || '09:00', parts[1] || '17:00'];
    };

    const [startTime, endTime] = parseTime(event?.timeRange);
    const [newStartTime, setNewStartTime] = useState(startTime);
    const [newEndTime, setNewEndTime] = useState(endTime);
    const [location, setLocation] = useState(event?.location || 'Online');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const { api } = await import('../../../utils/api.js');
            await api.put(`/schedules/availability/${event.id}`, {
                startTime: newStartTime,
                endTime: newEndTime,
                location
            });
            alert('Đã cập nhật lịch rảnh thành công!');
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to update availability:', error);
            alert('Lỗi khi cập nhật lịch rảnh. Vui lòng thử lại.');
        }
    };

    return (
        <Modal title="Chỉnh sửa lịch rảnh" onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Từ</label>
                        <input 
                            type="time" 
                            value={newStartTime} 
                            onChange={e => setNewStartTime(e.target.value)} 
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Đến</label>
                        <input 
                            type="time" 
                            value={newEndTime} 
                            onChange={e => setNewEndTime(e.target.value)} 
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5" 
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Địa điểm</label>
                    <select 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        className="w-full border border-slate-300 rounded-md px-2 py-1.5 bg-white"
                    >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Online / Offline">Linh hoạt</option>
                    </select>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-xs text-blue-800">
                        💡 <strong>Thông tin:</strong> {event?.date} - Bạn đang chỉnh sửa thời gian và địa điểm của lịch rảnh này.
                    </p>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit" 
                        className="px-4 py-1.5 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </Modal>
    );
};

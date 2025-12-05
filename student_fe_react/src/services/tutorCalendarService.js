// src/services/tutorCalendarService.js
import { api } from '../utils/api.js';
import { MOCK_COURSES, MOCK_CALENDAR_EVENTS } from './mockData.js';

// Enable/disable mock data
const USE_MOCK_DATA = false;

// Export courses for form dropdowns
export { MOCK_COURSES };

export const MOCK_SESSION_TYPES = ['ONLINE', 'OFFLINE'];
export const MOCK_LOCATIONS = ['Online', 'Phòng B4-201', 'Phòng H1-101', 'Thư viện'];

/**
 * Delete/Cancel availability slot
 * @param {string} availabilityId - Availability ID
 * @param {string} reason - Cancellation reason (optional)
 */
export async function deleteAvailability(availabilityId, reason) {
  console.log('📡 [deleteAvailability] Calling API:', {
    url: `/schedules/availability/${availabilityId}`,
    reason: reason || '(no reason)',
    hasToken: !!localStorage.getItem('bkarch_jwt')
  });
  
  try {
    const response = await api.delete(`/schedules/availability/${availabilityId}`, {
      data: reason ? { reason } : {}
    });
    
    console.log('✅ [deleteAvailability] API Response:', response);
    return response.data || response;
  } catch (error) {
    console.error('❌ [deleteAvailability] API Error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      data: error.data
    });
    throw error;
  }
}

/**
 * Update availability time
 * @param {string} availabilityId - Availability ID
 * @param {Object} updates - { startTime, endTime, ... }
 */
export async function updateAvailability(availabilityId, updates) {
  try {
    const response = await api.put(`/schedules/availability/${availabilityId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
}

/**
 * Cancel session
 * @param {string} sessionId - Session ID
 * @param {string} reason - Cancellation reason (optional)
 */
export async function cancelSession(sessionId, reason) {
  console.log('📡 [cancelSession] Calling API:', {
    url: `/sessions/${sessionId}`,
    reason: reason || '(no reason)',
    hasToken: !!localStorage.getItem('bkarch_jwt')
  });
  
  try {
    const response = await api.delete(`/sessions/${sessionId}`, {
      data: reason ? { reason } : {}
    });
    
    console.log('✅ [cancelSession] API Response:', response);
    return response.data || response;
  } catch (error) {
    console.error('❌ [cancelSession] API Error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      data: error.data
    });
    throw error;
  }
}

/**
 * Helper function to format backend session/availability data to calendar event format
 */
function formatSessionToCalendarEvent(session) {
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  
  // Format date: "Mon, Dec 5, 2025"
  const date = startTime.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  // Format time manually to ensure HH:mm format
  const formatTime = (d) => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;
  
  const formatted = {
    id: session._id,
    type: 'session',
    subjectName: session.title,
    studentCount: session.participants?.length || 0,
    maxStudents: session.maxParticipants || 10,
    date,
    timeRange,
    location: session.location,
    meetLink: session.sessionType === 'ONLINE' ? session.location : '',
    status: session.status?.toLowerCase() || 'scheduled',
  };
  
  console.log(`🔄 Formatted session "${session.title}": startTime=${session.startTime}, date=${date}, status=${formatted.status}`);
  
  return formatted;
}

function formatAvailabilityToCalendarEvent(availability) {
  // Get current week's date for the specified dayOfWeek
  const today = new Date();
  const currentDay = today.getDay(); // 0-6
  const targetDay = availability.dayOfWeek; // 0-6
  
  // Calculate difference in days
  let diff = targetDay - currentDay;
  if (diff < 0) diff += 7; // If target day is earlier in the week, go to next week
  
  // Create date for this week's occurrence of the dayOfWeek
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  
  // Format date: "Mon, Dec 11, 2025"
  const date = targetDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  return {
    id: availability._id,
    type: 'availability',
    date,
    timeRange: `${availability.startTime} - ${availability.endTime}`,
    location: 'Linh hoạt',
    status: 'available',
  };
}

/**
 * Fetch all calendar events for the tutor (sessions + availability)
 */
export async function fetchTutorCalendarEvents() {
  // Check if user is authenticated before making API calls
  const token = localStorage.getItem('bkarch_jwt');
  
  // Use mock data if enabled or no token
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK calendar events data');
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CALENDAR_EVENTS), 500);
    });
  }

  try {
    // Fetch both sessions and availability (only active ones)
    const [sessionsResponse, availabilityResponse] = await Promise.all([
      api.get('/sessions/upcoming?limit=100'),
      api.get('/schedules/availability/me?isActive=true')
    ]);

    const sessions = sessionsResponse?.data?.data || sessionsResponse?.data || [];
    const availabilities = availabilityResponse?.data?.data || availabilityResponse?.data || [];

    console.log('📊 Fetched sessions:', sessions.length, 'availabilities:', availabilities.length);

    // Format sessions
    const sessionEvents = Array.isArray(sessions) ? sessions.map(formatSessionToCalendarEvent) : [];
    
    // Format availability slots - FILTER ONLY ACTIVE ONES
    const activeAvailabilities = Array.isArray(availabilities) 
      ? availabilities.filter(a => a.isActive !== false)  // Only show active slots
      : [];
    const availabilityEvents = activeAvailabilities.map(formatAvailabilityToCalendarEvent);

    console.log('✅ Formatted:', sessionEvents.length, 'sessions,', availabilityEvents.length, 'availabilities');

    // Combine both
    return [...sessionEvents, ...availabilityEvents];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    // Return empty array on error to prevent breaking the UI
    return [];
  }
}

/**
 * Create a new session (UC-11)
 * Endpoint: POST /api/v1/sessions
 * @param {Object} sessionData - Session details
 * @returns {Promise<Object>} - Created session
 */
export async function createTutorSession(sessionData) {
  const token = localStorage.getItem('bkarch_jwt');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK - create session');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: 'session_' + Date.now(),
            ...sessionData,
            status: 'SCHEDULED',
            participants: [],
            createdAt: new Date().toISOString()
          }
        });
      }, 500);
    });
  }
  
  // Parse dates - accept both old format (date + startTime) and new format (ISO strings)
  let start, end;
  if (sessionData.startTime && sessionData.startTime.includes('T')) {
    // New format: ISO strings
    start = new Date(sessionData.startTime);
    end = new Date(sessionData.endTime);
  } else {
    // Old format: date + time strings
    start = new Date(`${sessionData.date}T${sessionData.startTime}`);
    end = new Date(`${sessionData.date}T${sessionData.endTime}`);
  }
  
  const duration = Math.round((end - start) / 60000);

  // Transform frontend format to backend format
  const payload = {
    title: sessionData.subjectName,
    subjectId: sessionData.subjectId || 'UNKNOWN',
    description: sessionData.description || '',
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    sessionType: sessionData.location === 'Online' ? 'ONLINE' : 'OFFLINE',
    location: sessionData.location === 'Online' ? 'Online' : sessionData.location,
    maxStudents: sessionData.maxStudents || 10,
  };

  // BR-003: ONLINE needs meetingLink
  if (payload.sessionType === 'ONLINE' && sessionData.meetLink) {
    payload.meetingLink = sessionData.meetLink;
  }

  // Validate BR-002: Duration >= 60 minutes
  if (duration < 60) {
    throw new Error('Duration must be at least 60 minutes (BR-002)');
  }

  try {
    console.log('📤 Sending session payload to backend:', payload);
    const response = await api.post('/sessions', payload);
    console.log('✅ Session created:', response);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating session:', error);
    console.error('Payload was:', payload);
    throw error;
  }
}

/**
 * Create a new availability slot
 * Note: This endpoint might not exist yet in backend
 * @param {Object} availabilityData - Availability details
 * @returns {Promise<Object>} - Created availability
 */
export async function createTutorAvailability(availabilityData) {
  const token = localStorage.getItem('bkarch_jwt');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK - create availability');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: 'avail_' + Date.now(),
            ...availabilityData,
            isActive: true,
            createdAt: new Date().toISOString()
          }
        });
      }, 500);
    });
  }
  
  try {
    const date = new Date(availabilityData.date);
    const dayOfWeek = date.getDay(); // 0-6 (0=Sunday, 6=Saturday)

    // BR-001: Backend requires hourly format (HH:00)
    // Extract hour from time and format as HH:00
    const formatToHourly = (time) => {
      const hour = time.split(':')[0];
      return `${hour.padStart(2, '0')}:00`;
    };

    const payload = {
      dayOfWeek,
      startTime: formatToHourly(availabilityData.startTime || '09:00'),
      endTime: formatToHourly(availabilityData.endTime || '17:00'),
      isActive: true,
    };

    // Validate hourly format
    if (payload.startTime === payload.endTime) {
      throw new Error('Thời gian bắt đầu và kết thúc phải khác nhau (tối thiểu 1 giờ)');
    }

    // POST /api/v1/schedules/availability
    const response = await api.post('/schedules/availability', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating availability:', error);
    throw error;
  }
}

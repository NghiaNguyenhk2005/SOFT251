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
 * Helper function to format backend session/availability data to calendar event format
 */
function formatSessionToCalendarEvent(session) {
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  
  // Format date: "Mon, Jan 11, 2050"
  const date = startTime.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  // Format time range: "09:00 - 10:30"
  const formatTime = (d) => d.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
  const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;
  
  return {
    id: session._id,
    type: 'session',
    subjectName: session.title,
    studentCount: session.participants?.length || 0,
    date,
    timeRange,
    location: session.location,
    meetLink: session.meetLink || '',
    status: session.status.toLowerCase(),
  };
}

function formatAvailabilityToCalendarEvent(availability) {
  // Assuming availability has dayOfWeek, startTime, endTime
  // For now, we'll use a placeholder date based on dayOfWeek
  const dayMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  const day = dayMap[availability.dayOfWeek] || 'Mon';
  
  return {
    id: availability._id,
    type: 'availability',
    date: `${day}, Jan 11, 2050`, // Placeholder - you may need to calculate actual dates
    timeRange: `${availability.startTime} - ${availability.endTime}`,
    location: availability.location || 'Online / Offline',
    status: 'available',
  };
}

/**
 * Fetch all calendar events for the tutor (sessions + availability)
 */
export async function fetchTutorCalendarEvents() {
  // Check if user is authenticated before making API calls
  const token = localStorage.getItem('authToken');
  
  // Use mock data if enabled or no token
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK calendar events data');
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CALENDAR_EVENTS), 500);
    });
  }

  try {
    // Fetch both sessions and availability
    const [sessionsResponse, availabilityResponse] = await Promise.all([
      api.get('/tutors/me/sessions?limit=100'),
      api.get('/tutors/me') // Get profile which may include availability
    ]);

    const sessions = sessionsResponse.data || [];
    const events = sessions.map(formatSessionToCalendarEvent);

    // Note: Availability endpoint might need to be added to backend
    // For now, returning only sessions
    return events;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

/**
 * Create a new session (UC-11)
 * Endpoint: POST /api/v1/sessions
 * @param {Object} sessionData - Session details
 * @returns {Promise<Object>} - Created session
 */
export async function createTutorSession(sessionData) {
  const token = localStorage.getItem('authToken');
  
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
  
  try {
    // Calculate duration in minutes
    const start = new Date(`${sessionData.date}T${sessionData.startTime}`);
    const end = new Date(`${sessionData.date}T${sessionData.endTime}`);
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
    };

    // BR-003: ONLINE needs meetingLink
    if (payload.sessionType === 'ONLINE' && sessionData.meetLink) {
      payload.meetingLink = sessionData.meetLink;
    }

    // Validate BR-002: Duration >= 60 minutes
    if (duration < 60) {
      throw new Error('Duration must be at least 60 minutes (BR-002)');
    }

    const response = await api.post('/sessions', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
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
  const token = localStorage.getItem('authToken');
  
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
    const dayOfWeek = date.getDay(); // 0-6

    const payload = {
      dayOfWeek,
      startTime: availabilityData.startTime || '09:00',
      endTime: availabilityData.endTime || '17:00',
      location: availabilityData.location,
      isActive: true,
    };

    // POST /api/v1/schedules/availability
    const response = await api.post('/schedules/availability', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating availability:', error);
    throw error;
  }
}

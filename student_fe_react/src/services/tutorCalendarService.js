// src/services/tutorCalendarService.js

// Mock data for tutor's calendar
const MOCK_TUTOR_SESSIONS = [
  {
    id: 1,
    type: 'session', // 'session' or 'availability'
    subjectName: "Công nghệ phần mềm",
    studentCount: 15,
    date: "Mon, Jan 11, 2050",
    timeRange: "13:30 - 15:00",
    location: "Online (Google Meet)",
    meetLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
  },
  {
    id: 2,
    type: 'availability',
    date: "Mon, Jan 11, 2050",
    timeRange: "10:00 - 12:00",
    location: "Online / Offline",
    status: "available",
  },
  {
    id: 3,
    type: 'session',
    subjectName: "Cấu trúc dữ liệu",
    studentCount: 1,
    date: "Tue, Jan 12, 2050",
    timeRange: "09:00 - 10:30",
    location: "Phòng B4-201",
    meetLink: "",
    status: "pending_request", // A session requested by a student
  },
  {
    id: 4,
    type: 'availability',
    date: "Wed, Jan 13, 2050",
    timeRange: "14:00 - 17:00",
    location: "Online",
    status: "available",
  },
    {
    id: 5,
    type: 'session',
    subjectName: "Kỹ thuật lập trình",
    studentCount: 25,
    date: "Fri, Jan 15, 2050",
    timeRange: "09:30 - 11:00",
    location: "Phòng H1-101",
    meetLink: "",
    status: "scheduled",
  },
];

// Mock data for creating new sessions/availability
export const MOCK_COURSES = [
    { id: 'CO3001', name: 'Công nghệ phần mềm' },
    { id: 'CO3002', name: 'Cấu trúc dữ liệu và giải thuật' },
    { id: 'CO3003', name: 'Kỹ thuật lập trình' },
];

export const MOCK_SESSION_TYPES = ['Nhóm', '1-1'];
export const MOCK_LOCATIONS = ['Online', 'Phòng B4-201', 'Phòng H1-101', 'Thư viện'];


// Fetch all calendar events for the tutor
export function fetchTutorCalendarEvents() {
  return Promise.resolve(MOCK_TUTOR_SESSIONS);
}

// Add a new session (mock)
export function createTutorSession(sessionData) {
  const newSession = {
    id: Date.now(),
    type: 'session',
    status: 'scheduled',
    ...sessionData,
  };
  MOCK_TUTOR_SESSIONS.push(newSession);
  console.log("Created new session:", newSession);
  return Promise.resolve(newSession);
}

// Add a new availability slot (mock)
export function createTutorAvailability(availabilityData) {
    const newAvailability = {
    id: Date.now(),
    type: 'availability',
    status: 'available',
    ...availabilityData,
  };
  MOCK_TUTOR_SESSIONS.push(newAvailability);
  console.log("Created new availability:", newAvailability);
  return Promise.resolve(newAvailability);
}

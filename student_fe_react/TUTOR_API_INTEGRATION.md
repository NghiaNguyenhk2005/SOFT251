# Tutor Feature - Backend API Integration

This document describes the integration between the frontend tutor feature and the backend API.

## Overview

The tutor frontend pages have been connected to the backend API endpoints. All service files have been updated to make real HTTP requests instead of using mock data.

## Configuration

### Environment Variables

Create a `.env` file in the root of the frontend project:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Authentication

The API utility automatically includes the JWT token from `localStorage` in all requests:
- Token key: `authToken`
- Header: `Authorization: Bearer <token>`

To set the auth token:
```javascript
localStorage.setItem('authToken', 'your-jwt-token');
```

## API Integration

### 1. Tutor Profile & Search (`tutorService.js`)

**Endpoints:**
- `GET /tutors/search` - Search tutors by criteria
- `GET /tutors/:id` - Get tutor details by ID
- `GET /tutors/by-hcmut-id/:hcmutId` - Get tutor by HCMUT ID
- `GET /tutors/:tutorId/availability` - Get tutor availability
- `GET /tutors/me` - Get my tutor profile
- `GET /tutors/me/sessions` - Get my sessions
- `GET /tutors/me/feedbacks` - Get my feedbacks

**Functions:**
```javascript
import { searchTutors, getTutorById, getMyTutorProfile, getMySessions, getMyFeedbacks } from '../services/tutorService.js';

// Search tutors
const result = await searchTutors({ 
  subjectId: 'CO3001', 
  minRating: 4.0,
  page: 1,
  limit: 20 
});

// Get my profile
const profile = await getMyTutorProfile();

// Get my sessions
const sessions = await getMySessions({ 
  status: 'SCHEDULED',
  page: 1,
  limit: 10 
});
```

### 2. Calendar & Sessions (`tutorCalendarService.js`)

**Endpoints:**
- `GET /tutors/me/sessions` - Fetch calendar events (sessions)
- `POST /sessions` - Create new session (TODO: backend endpoint)
- `POST /availability` - Create availability slot (TODO: backend endpoint)

**Functions:**
```javascript
import { fetchTutorCalendarEvents, createTutorSession, createTutorAvailability } from '../services/tutorCalendarService.js';

// Fetch calendar events
const events = await fetchTutorCalendarEvents();

// Create session
const session = await createTutorSession({
  subjectName: 'Công nghệ phần mềm',
  subjectId: 'CO3001',
  date: '2050-01-15',
  startTime: '09:30',
  endTime: '11:00',
  location: 'Online'
});
```

### 3. Courses (`tutorCourseService.js`)

**Endpoints:**
- `GET /tutors/me` - Get tutor profile
- `GET /tutors/me/sessions` - Get sessions to calculate course stats

**Functions:**
```javascript
import { fetchTutorCourses } from '../services/tutorCourseService.js';

// Fetch courses (derived from sessions)
const courses = await fetchTutorCourses();
// Returns: [{ id, name, studentCount, sessionCount, description, imageUrl }]
```

### 4. Course Details (`tutorCourseDetailService.js`)

**Endpoints:**
- `GET /tutors/me/sessions` - Get sessions for specific course

**Functions:**
```javascript
import { fetchTutorCourseDetails } from '../services/tutorCourseDetailService.js';

// Fetch course details
const courseDetails = await fetchTutorCourseDetails('CO3001');
// Returns: { id, name, description, sessions, requests, students }
```

### 5. Notifications (`tutorNotificationService.js`)

**Endpoints:**
- `GET /tutors/me` - Get tutor profile
- `GET /notifications` - Fetch notifications
- `PATCH /notifications/:id/read` - Mark notification as read
- `PATCH /notifications/read-all` - Mark all as read

**Functions:**
```javascript
import { fetchTutorNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/tutorNotificationService.js';

// Fetch notifications
const notifications = await fetchTutorNotifications();

// Mark as read
await markNotificationAsRead(notificationId);

// Mark all as read
await markAllNotificationsAsRead();
```

## Data Flow

### Backend to Frontend Mapping

**TutorSession (Backend) → Calendar Event (Frontend)**
```javascript
{
  _id: "...",
  tutorId: "...",
  title: "Công nghệ phần mềm - Buổi 1",
  subjectId: "CO3001",
  startTime: "2050-01-15T09:30:00Z",
  endTime: "2050-01-15T11:00:00Z",
  location: "Online",
  participants: [...],
  status: "SCHEDULED"
}
// ↓ Transformed to ↓
{
  id: "...",
  type: "session",
  subjectName: "Công nghệ phần mềm - Buổi 1",
  studentCount: 15,
  date: "Mon, Jan 15, 2050",
  timeRange: "09:30 - 11:00",
  location: "Online",
  status: "scheduled"
}
```

## TODO: Backend Endpoints to Implement

The following endpoints are referenced but not yet implemented in the backend:

1. **Session Management**
   - `POST /api/v1/sessions` - Create new session
   - `PATCH /api/v1/sessions/:id/cancel` - Cancel session
   - `PATCH /api/v1/sessions/:id/reschedule` - Reschedule session

2. **Availability Management**
   - `POST /api/v1/availability` - Create availability slot
   - `GET /api/v1/tutors/me/availability` - Get my availability slots
   - `DELETE /api/v1/availability/:id` - Delete availability slot

3. **Request Management**
   - `PATCH /api/v1/requests/:id/approve` - Approve consultation request
   - `PATCH /api/v1/requests/:id/reject` - Reject consultation request

4. **Student Evaluation**
   - `POST /api/v1/students/:id/evaluate` - Submit student evaluation

## Error Handling

All service functions throw errors that can be caught:

```javascript
try {
  const sessions = await getMySessions();
} catch (error) {
  if (error.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.status === 403) {
    // Forbidden - user doesn't have permission
  } else if (error.status === 404) {
    // Not found
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

## Testing

To test the integration:

1. **Start the backend:**
   ```bash
   cd tutor-system-backend
   npm install
   npm start
   ```

2. **Start the frontend:**
   ```bash
   cd student_fe_react
   npm install
   npm run dev
   ```

3. **Set authentication token:**
   - Open browser console
   - Run: `localStorage.setItem('authToken', 'your-jwt-token')`
   - Or implement a login page to get the token

4. **Navigate to tutor pages:**
   - Dashboard: `http://localhost:5173/tutor/dashboard`
   - Courses: `http://localhost:5173/tutor/courses`
   - Notifications: `http://localhost:5173/tutor/notifications`

## Notes

- The API utility file is located at `src/utils/api.js`
- All service files use named exports
- Mock data constants (like `MOCK_COURSES`, `MOCK_LOCATIONS`) are kept for form dropdowns
- The backend must be running on `http://localhost:3000` (or set `VITE_API_BASE_URL`)
- Ensure CORS is properly configured in the backend to allow frontend origin

## Migration from Mock Data

The following files were updated from mock implementations to real API calls:

1. ✅ `src/services/tutorService.js`
2. ✅ `src/services/tutorCalendarService.js`
3. ✅ `src/services/tutorCourseService.js`
4. ✅ `src/services/tutorCourseDetailService.js`
5. ✅ `src/services/tutorNotificationService.js`

The UI pages remain unchanged and work with the new API integration seamlessly.

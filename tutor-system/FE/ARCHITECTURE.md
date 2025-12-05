# Tutor Feature - Frontend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                    http://localhost:5173                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP Requests
                                │ JWT Auth Header
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API (Express)                       │
│                    http://localhost:3000/api/v1                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ MongoDB Queries
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                          │
│                    mongodb://localhost:27017                     │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Structure

```
student_fe_react/
│
├── src/
│   ├── utils/
│   │   └── api.js                      ← API utility (NEW)
│   │
│   ├── services/                       ← API service layer
│   │   ├── tutorService.js            ← Tutor profile & search (UPDATED)
│   │   ├── tutorCalendarService.js    ← Calendar & sessions (UPDATED)
│   │   ├── tutorCourseService.js      ← Courses list (UPDATED)
│   │   ├── tutorCourseDetailService.js ← Course details (UPDATED)
│   │   └── tutorNotificationService.js ← Notifications (UPDATED)
│   │
│   └── modules/tutor/
│       ├── pages/
│       │   ├── TutorDashboardPage.jsx     ← Calendar view (minor update)
│       │   ├── TutorCoursesPage.jsx       ← Courses list
│       │   ├── TutorCourseDetailPage.jsx  ← Course detail
│       │   └── TutorNotificationsPage.jsx ← Notifications
│       │
│       ├── components/
│       │   ├── TutorHeader.jsx
│       │   └── TutorSidebar.jsx
│       │
│       └── layouts/
│           └── TutorMainLayout.jsx
│
├── .env.example                        ← Environment config (NEW)
├── TUTOR_API_INTEGRATION.md           ← Documentation (NEW)
└── ARCHITECTURE.md                     ← This file (NEW)
```

## Data Flow

### Example: Loading Tutor Dashboard

```
┌──────────────┐
│   Browser    │
│  User visits │
│  /tutor/     │
│  dashboard   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│  TutorDashboardPage.jsx             │
│                                     │
│  useEffect(() => {                  │
│    fetchTutorCalendarEvents()       │
│      .then(setEvents)               │
│  }, [])                             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  tutorCalendarService.js            │
│                                     │
│  export async function              │
│  fetchTutorCalendarEvents() {       │
│    const response = await           │
│      api.get('/tutors/me/sessions') │
│    return transformData(response)   │
│  }                                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  utils/api.js                       │
│                                     │
│  export const api = {               │
│    get: (endpoint) =>               │
│      fetch(BASE_URL + endpoint, {   │
│        headers: {                   │
│          'Authorization':           │
│            `Bearer ${token}`        │
│        }                            │
│      })                             │
│  }                                  │
└──────┬──────────────────────────────┘
       │
       │ HTTP Request
       │ GET /api/v1/tutors/me/sessions
       │ Authorization: Bearer <token>
       │
       ▼
┌─────────────────────────────────────┐
│  Backend API                        │
│  tutor.routes.js                    │
│                                     │
│  router.get(                        │
│    '/me/sessions',                  │
│    authMiddleware,                  │
│    roleMiddleware(['TUTOR']),       │
│    tutorController.getMySessions    │
│  )                                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend Controller                 │
│  tutor.controller.js                │
│                                     │
│  getMySessions = async (req, res) => {│
│    const tutor = await              │
│      Tutor.findOne({                │
│        userId: req.userId            │
│      })                             │
│    const sessions = await           │
│      TutorSession.find({            │
│        tutorId: tutor._id           │
│      })                             │
│    res.json({ data: sessions })     │
│  }                                  │
└──────┬──────────────────────────────┘
       │
       │ MongoDB Query
       │
       ▼
┌─────────────────────────────────────┐
│  MongoDB Database                   │
│                                     │
│  Collections:                       │
│  - users                            │
│  - tutors                           │
│  - tutorsessions                    │
│  - notifications                    │
└──────┬──────────────────────────────┘
       │
       │ Response Data
       │
       ▼
┌─────────────────────────────────────┐
│  Browser - Calendar Rendered        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Mon  Tue  Wed  Thu  Fri    │   │
│  ├─────────────────────────────┤   │
│  │  [Session] [Session]        │   │
│  │  [Available]                │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## API Utility Pattern

### Centralized API Handler

```javascript
// src/utils/api.js

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = {
  get: (endpoint) => fetchAPI(endpoint, { method: 'GET' }),
  post: (endpoint, body) => fetchAPI(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => fetchAPI(endpoint, { method: 'PUT', body }),
  patch: (endpoint, body) => fetchAPI(endpoint, { method: 'PATCH', body }),
  delete: (endpoint) => fetchAPI(endpoint, { method: 'DELETE' })
};
```

### Service Layer Pattern

```javascript
// src/services/tutorService.js

import { api } from '../utils/api.js';

export async function getMySessions(filters) {
  const queryParams = new URLSearchParams(filters);
  const endpoint = `/tutors/me/sessions?${queryParams}`;
  const response = await api.get(endpoint);
  return response;
}
```

### Component Usage Pattern

```javascript
// src/modules/tutor/pages/TutorDashboardPage.jsx

import { fetchTutorCalendarEvents } from '../../../services/tutorCalendarService';

export default function TutorDashboardPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTutorCalendarEvents()
      .then(setEvents)
      .catch(console.error);
  }, []);

  return <Calendar events={events} />;
}
```

## Authentication Flow

```
┌─────────────┐
│   Login     │
│   Page      │  (To be implemented)
└──────┬──────┘
       │
       │ POST /api/v1/auth/login
       │ { email, password }
       │
       ▼
┌─────────────────────────────────────┐
│  Backend Auth Service               │
│                                     │
│  - Verify credentials               │
│  - Generate JWT token               │
│  - Return token to frontend         │
└──────┬──────────────────────────────┘
       │
       │ Response: { token: "eyJhbG..." }
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend Auth Handler              │
│                                     │
│  localStorage.setItem(              │
│    'authToken',                     │
│    response.token                   │
│  )                                  │
└──────┬──────────────────────────────┘
       │
       │ All subsequent requests include:
       │ Authorization: Bearer eyJhbG...
       │
       ▼
┌─────────────────────────────────────┐
│  Protected API Endpoints            │
│                                     │
│  authMiddleware verifies token      │
│  roleMiddleware checks permissions  │
└─────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────┐
│  Component calls    │
│  API service        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Service function   │
│  throws error       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  API Utility catches error          │
│                                     │
│  - Network error → APIError(0)      │
│  - 401 Unauthorized → APIError(401) │
│  - 403 Forbidden → APIError(403)    │
│  - 404 Not Found → APIError(404)    │
│  - 500 Server Error → APIError(500) │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Component catches error            │
│                                     │
│  try {                              │
│    await apiCall()                  │
│  } catch (error) {                  │
│    if (error.status === 401) {      │
│      // Redirect to login           │
│    } else {                         │
│      // Show error message          │
│    }                                │
│  }                                  │
└─────────────────────────────────────┘
```

## Performance Optimizations

1. **Pagination:** All list endpoints support pagination
2. **Lazy Loading:** Components fetch data only when needed
3. **Caching:** Browser caches API responses (can add React Query later)
4. **Minimal Requests:** Combine related data in single API call where possible

## Security

1. **JWT Authentication:** All requests require valid token
2. **HTTPS:** Use HTTPS in production
3. **CORS:** Backend restricts allowed origins
4. **Role-Based Access:** Middleware checks user role
5. **Input Validation:** Both frontend and backend validate inputs

## Deployment Considerations

### Frontend
- Build: `npm run build`
- Deploy to: Vercel, Netlify, or static hosting
- Set environment variable: `VITE_API_BASE_URL=https://api.production.com/api/v1`

### Backend
- Deploy to: Heroku, Railway, AWS, etc.
- Set environment variables from `.env.example`
- Enable CORS for frontend origin
- Use MongoDB Atlas for database

## Future Improvements

1. **Add React Query:** Better caching and state management
2. **Add Loading States:** Skeleton screens while loading
3. **Add Optimistic Updates:** Update UI before API confirms
4. **Add WebSocket:** Real-time notifications
5. **Add Error Boundaries:** Better error handling in React
6. **Add TypeScript:** Type safety across the app
7. **Add Unit Tests:** Test services and components
8. **Add E2E Tests:** Test complete user flows

# CAS SSO Client (Phase 2)

React frontend client implementing CAS (Central Authentication Service) SSO flow.

## Architecture

```
User → Client (3000) → CAS Server (5000) → Validates → Redirects back → Client
```

## CAS Flow Implementation

1. **User visits protected route** (`/dashboard`)
2. **ProtectedRoute** checks `AuthContext` - no user found
3. **Browser redirects** to CAS server: `http://localhost:5000/auth/login?service=http://localhost:3000/auth/callback`
4. **User logs in** on CAS server (separate page)
5. **CAS server redirects back** to: `http://localhost:3000/auth/callback?ticket=ST-xxxxx`
6. **AuthCallback component** validates ticket with CAS server
7. **User info saved** to AuthContext
8. **Redirect to** `/dashboard` - now authenticated ✓

## File Structure

```
client/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx              # Entry point (wraps with BrowserRouter + AuthProvider)
    ├── App.jsx               # Route definitions
    ├── index.css             # Basic styling
    ├── api.js                # Axios instance (withCredentials: true)
    ├── context/
    │   └── AuthContext.jsx   # Global auth state + session check
    ├── components/
    │   └── ProtectedRoute.jsx # Route guard (redirects to CAS if not authenticated)
    └── pages/
        ├── Home.jsx          # Landing page
        ├── Dashboard.jsx     # Protected page
        └── AuthCallback.jsx  # Ticket validation handler
```

## Key Features

### `api.js`
```javascript
withCredentials: true  // CRITICAL: sends session cookies cross-origin
```

### `AuthContext.jsx`
- Provides `user`, `isLoading`, `login()`, `logout()`
- Checks existing session on mount (`/auth/check-session`)

### `ProtectedRoute.jsx`
- Redirects to CAS server if not authenticated
- Full browser redirect: `window.location.href = casLoginUrl`

### `AuthCallback.jsx`
- Extracts `ticket` from URL query params
- Validates ticket: `POST /auth/validate`
- Saves user and redirects to `/dashboard`

## Setup & Run

1. **Install dependencies**
```bash
cd client
npm install
```

2. **Start dev server**
```bash
npm run dev
```

Client runs on `http://localhost:3000`

## Prerequisites

- CAS Server must be running on `http://localhost:5000`
- MongoDB must be accessible for session storage
- At least one user must exist in the database

## Testing the Flow

1. Open `http://localhost:3000`
2. Click "Login (via CAS)"
3. Browser redirects to CAS server login page
4. Enter credentials (e.g., username/password from server DB)
5. CAS validates and redirects back with ticket
6. Client validates ticket and shows dashboard

## Important Notes

- **withCredentials: true** is essential for session cookies
- **Service URL** must match exactly in all CAS calls
- **Tickets are one-time use** - validated once, then invalidated
- **Sessions persist** via cookies - refresh keeps you logged in

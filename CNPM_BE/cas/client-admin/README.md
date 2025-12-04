# CAS SSO - Admin Client

Second client application demonstrating Single Sign-On capabilities.

## Overview

This is the **Admin Client** (port 3001) - part of a multi-client SSO demo. When you login on the Main Client (port 3000), you're automatically authenticated here without entering credentials again.

## Key Features

- ✅ **Automatic SSO Login** - No password prompt if already authenticated
- ✅ **Shared Session** - Same CAS session across all clients
- ✅ **Protected Routes** - Route guard with CAS redirect
- ✅ **Purple Admin Theme** - Distinct visual identity
- ✅ **Session Persistence** - Stays logged in across refreshes

## Run Standalone

```bash
cd client-admin
npm install
npm run dev
```

Runs on `http://localhost:3001`

## Prerequisites

- CAS Server running on port 5000
- MongoDB with active session store
- (Optional) Main Client on port 3000 to test SSO

## Testing SSO

1. **Login on Main Client** (port 3000)
2. **Open this Admin Client** (port 3001)
3. **Notice**: Already logged in! No password needed! 🎉

## Configuration

### Port
```javascript
// vite.config.js
server: {
  port: 3001
}
```

### Service URLs
All callback URLs use port 3001:
```javascript
const serviceUrl = 'http://localhost:3001/auth/callback';
```

### API Configuration
```javascript
// src/api.js
baseURL: 'http://localhost:5000',
withCredentials: true  // Essential for shared cookies
```

## File Structure

```
client-admin/
├── src/
│   ├── context/AuthContext.jsx    # Session check on mount
│   ├── components/ProtectedRoute.jsx  # CAS redirect
│   ├── pages/
│   │   ├── Home.jsx               # Admin landing
│   │   ├── Dashboard.jsx          # Admin dashboard
│   │   └── AuthCallback.jsx       # Ticket validator
│   ├── api.js                     # Axios config
│   └── index.css                  # Purple theme
├── vite.config.js                 # Port 3001
└── package.json
```

## Routes

- `/` - Admin home page
- `/auth/callback` - CAS ticket validation
- `/dashboard` - Protected admin dashboard

## SSO Flow

```
1. User opens http://localhost:3001
2. AuthContext checks session via GET /auth/check-session
3. If session exists → Auto-login! ✓
4. If no session → Redirect to CAS login
5. After login → Ticket validation → Dashboard
```

## Differences from Main Client

| Feature | Main Client | Admin Client |
|---------|-------------|--------------|
| Port | 3000 | 3001 |
| Theme | Blue | Purple |
| Badge | None | "ADMIN CLIENT" |
| Title | "CAS SSO Demo" | "Admin Portal" |

## Environment

No additional environment variables needed - uses same CAS server as main client.

## Troubleshooting

**Not auto-logging in?**
- Check `withCredentials: true` in api.js
- Verify server allows port 3001 in CORS
- Check cookies in DevTools (connect.sid)

**Port conflict?**
```bash
lsof -ti:3001 | xargs kill -9
```

**Session not shared?**
- Ensure same baseURL: `http://localhost:5000`
- Check server CORS includes both ports
- Verify MongoDB session store is working

## See Also

- `SSO_DEMO.md` - Complete SSO testing guide
- `README.md` - Main project documentation
- `client/` - Main client implementation

---

**This client demonstrates the power of CAS SSO - login once, authenticated everywhere! 🚀**

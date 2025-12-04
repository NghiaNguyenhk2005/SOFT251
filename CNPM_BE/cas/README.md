# CAS SSO System - Complete Implementation

A full-stack Single Sign-On (SSO) system implementing the CAS (Central Authentication Service) protocol.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│  Main Client    │ ◄─────► │   CAS Server     │ ◄─────► │   MongoDB    │
│  (Port 3000)    │         │   (Port 5001)    │         │  (Port 27017)│
└─────────────────┘         │                  │         │              │
                            │  - Auth Routes   │         │  - Users     │
┌─────────────────┐         │  - Session Mgmt  │ ◄─────► │  - Sessions  │
│  Admin Client   │ ◄─────► │  - Ticket Store  │         │              │
│  (Port 3001)    │         │    (In-Memory)   │         └──────────────┘
└─────────────────┘         │                  │         
                            └──────────────────┘
     
     🎯 SSO: Login once, authenticated on both clients!
```

## 📋 Project Structure

```
cas/
├── server/              # CAS Server (Backend) - Phase 1
│   ├── config/
│   │   └── db.js       # MongoDB connection
│   ├── models/
│   │   └── user.model.js  # User schema with password hashing
│   ├── routes/
│   │   └── auth.js     # Auth endpoints (login, validate, check-session, logout)
│   ├── public/
│   │   └── login.html  # Login form UI
│   ├── ticketStore.js  # In-memory ticket management
│   ├── server.js       # Express server entry point
│   ├── seed.js         # Database seeder for test user
│   ├── package.json
│   └── .env.example
│
├── client/              # React Client (Frontend) - Phase 2
│   └── ... (Main client on port 3000)
│
└── client-admin/        # Admin Client (SSO Demo) - Phase 3
    └── ... (Admin client on port 3001)
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── components/
    │   │   └── ProtectedRoute.jsx  # Route guard
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── AuthCallback.jsx  # Ticket validation handler
    │   ├── api.js       # Axios instance
    │   ├── App.jsx      # Route definitions
    │   └── main.jsx     # Entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔐 CAS Authentication Flow

### Detailed Step-by-Step Process

1. **User visits protected route** 
   - User navigates to `http://localhost:3000/dashboard`
   - `ProtectedRoute` component checks `AuthContext`

2. **No authentication detected**
   - `AuthContext.user` is `null`
   - `ProtectedRoute` triggers redirect to CAS server

3. **Browser redirects to CAS login**
   ```
   http://localhost:5000/login?service=http://localhost:3000/auth/callback
   ```
   - User sees server-side login form (`/server/public/login.html`)

4. **User submits credentials**
   - POST request to `/auth/login`
   - Server validates username/password against MongoDB
   - Server creates session (stored in MongoDB via `connect-mongo`)

5. **Server issues Service Ticket (ST)**
   - One-time-use ticket created: `ST-xxxxxxxx`
   - Ticket stored in-memory with 1-minute TTL
   - Server returns redirect URL with ticket

6. **Browser redirects back to client**
   ```
   http://localhost:3000/auth/callback?ticket=ST-xxxxxxxx
   ```

7. **Client validates ticket**
   - `AuthCallback` component extracts ticket from URL
   - POST request to `/auth/validate` (server-to-server)
   - Server validates ticket and returns user info
   - **Ticket is invalidated** (one-time-use)

8. **User authenticated**
   - User data saved to `AuthContext`
   - Client redirects to `/dashboard`
   - User is now authenticated!

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB running locally or via Docker

### Option 1: Local MongoDB

```bash
# Start MongoDB
mongod --dbpath /path/to/data
```

### Option 2: Docker MongoDB

```bash
docker run -d -p 27017:27017 --name cas-mongo mongo:latest
```

### Setup Server

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default values work for local setup)
# For local MongoDB, change MONGO_URI to:
# MONGO_URI=mongodb://localhost:27017/cas-sso-db

# Create test user
npm run seed

# Start server
npm run dev
```

Server runs on `http://localhost:5000`

### Setup Client

```bash
cd client

# Install dependencies
npm install

# Start client
npm run dev
```

Client runs on `http://localhost:3000`

### Setup Admin Client (Optional - SSO Demo)

```bash
cd client-admin

# Install dependencies
npm install

# Start admin client
npm run dev
```

Admin client runs on `http://localhost:3001`

## 🎉 Multi-Client SSO Demo

**NEW!** A second client demonstrates true Single Sign-On:

1. Login on Main Client (`http://localhost:3000`)
2. Open Admin Client (`http://localhost:3001`)
3. **You're already logged in!** No password needed! 🚀

See `SSO_DEMO.md` for comprehensive testing scenarios.

## 🧪 Testing the System

### 1. Create Test User (if not done)

```bash
cd server
npm run seed
```

Output:
```
✓ Test user created successfully!
---
Username: testuser
Password: password123
Email: testuser@example.com
```

### 2. Test the Flow

1. Open browser: `http://localhost:3000`
2. Click **"Login (via CAS)"**
3. Browser redirects to CAS server login page
4. Enter credentials:
   - Username: `testuser`
   - Password: `password123`
5. Click **"Sign In"**
6. Redirected back to client with ticket
7. Dashboard appears with user info

### 3. Test Session Persistence

1. Refresh the page - you should stay logged in
2. Open new tab to `http://localhost:3000` - already logged in
3. Click **"Logout"** to clear session

## 📡 API Endpoints

### Server (http://localhost:5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/login` | Serves login HTML form |
| POST | `/auth/login` | Authenticates user, returns redirect with ticket |
| POST | `/auth/validate` | Validates ticket (server-to-server) |
| GET | `/auth/check-session` | Checks if session exists |
| POST | `/auth/logout` | Destroys session |

### Client Routes (http://localhost:3000)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/auth/callback` | AuthCallback | Ticket validation handler |
| `/dashboard` | Dashboard | Protected page (requires auth) |

## 🔑 Key Implementation Details

### Server

**Ticket Management** (`ticketStore.js`)
- In-memory `Map` storage (Phase 1 simplification)
- Tickets prefixed with `ST-` (Service Ticket)
- 1-minute TTL
- One-time-use (invalidated after validation)

**Session Management** (`server.js`)
- `express-session` with `connect-mongo` store
- Sessions persist in MongoDB
- Cookies sent with `httpOnly` flag
- 24-hour session duration

**Password Security** (`user.model.js`)
- `bcryptjs` hashing (10 rounds)
- Pre-save hook for automatic hashing
- `comparePassword` method for validation

### Client

**Critical Axios Configuration** (`api.js`)
```javascript
withCredentials: true  // Essential for cross-origin cookies
```

**Auth Context** (`AuthContext.jsx`)
- Global state management
- Session check on mount
- Login/logout functions

**Protected Routes** (`ProtectedRoute.jsx`)
- Checks authentication status
- Triggers CAS redirect if not authenticated
- Full page redirect: `window.location.href`

**Ticket Validation** (`AuthCallback.jsx`)
- Extracts ticket from URL
- Server-side validation
- Updates auth context
- Redirects to dashboard

## 🛠️ Environment Variables

### Server `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cas-sso-db
SESSION_SECRET=your_very_secret_key_here
CLIENT_REDIRECT_URL=http://localhost:3000/dashboard
```

## 📝 Important Notes

### Security Considerations

1. **withCredentials: true** - Required for cookies in cross-origin requests
2. **Service URL matching** - Must be exact in all CAS calls
3. **One-time tickets** - Prevents replay attacks
4. **Password hashing** - Never store plain text passwords
5. **Session secrets** - Use strong secrets in production
6. **HTTPS in production** - Set `secure: true` for cookies

### Common Issues

**CORS Errors**
- Ensure server allows client origin: `http://localhost:3000`
- Check `withCredentials: true` in axios config

**Session not persisting**
- Verify MongoDB is running
- Check `MONGO_URI` in `.env`
- Ensure cookies are enabled in browser

**Login redirects back to login**
- Check MongoDB has user data
- Verify password is correct
- Check server logs for errors

**Ticket validation fails**
- Tickets expire after 1 minute
- Tickets are one-time-use
- Check `service` parameter matches exactly

## 🔮 Future Enhancements (Phase 3+)

- [ ] Persistent ticket storage (Redis/Database) for production
- [ ] HTTPS support
- [ ] Multiple client applications
- [ ] Ticket-Granting Tickets (TGT)
- [ ] Service registry
- [ ] Logout propagation across services
- [ ] OAuth2/OIDC integration
- [ ] Admin dashboard
- [ ] Audit logging
- [ ] Rate limiting
- [ ] 2FA support

## 📚 Technologies Used

### Backend
- Express.js - Web framework
- MongoDB - Database for users and sessions
- Mongoose - ODM
- express-session - Session management
- connect-mongo - MongoDB session store
- bcryptjs - Password hashing
- cors - Cross-origin resource sharing

### Frontend
- React 18 - UI library
- Vite - Build tool
- React Router v6 - Routing
- Axios - HTTP client
- Context API - State management

## 📄 License

MIT

## 👥 Contributing

This is a learning/demo project. Feel free to fork and experiment!

---

**Built with ❤️ as a CAS SSO implementation demo**

# HCMUT Datacore Service

Centralized database service for HCMUT student and staff information.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   ```

3. **Start the service:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## Features

- **Auto-initialization:** On startup, automatically reads `users.json` from workspace and populates database
- **Smart classification:** Automatically classifies users as Student/Lecturer/Researcher/Staff based on username pattern
- **Idempotent:** Safe to restart - uses upsert to avoid duplicates

## API Endpoints

### 1. Health Check
```
GET /api/health
```
Check if service is running.

### 2. Sync All Users
```
GET /api/users/sync
```
Returns all users in database (for syncing with main backend).

### 3. Get User Profile
```
GET /api/users/profile/:id
```
Get user by `student_id`, `staff_id`, or `username`.

**Examples:**
- `/api/users/profile/2312345` (student_id)
- `/api/users/profile/004123` (staff_id)
- `/api/users/profile/nam.nguyen` (username)

## User Classification Rules

The system automatically classifies users based on username:

1. **Students (STU):** Username contains dot (e.g., `nam.nguyen`)
   - Gets `student_id` (format: 23xxxxx)
   - `major` = "KHMT"

2. **Department Staff (STA):** Short abbreviation (e.g., `cse`, `pctsv`, `pdt`)
   - Gets `staff_id` (random 6 digits)
   - `department` = null

3. **Lecturers/Researchers (LEC/RES):** Regular names (e.g., `tungnguyen`)
   - Gets `staff_id` (format: 004xxx)
   - `department` = "KHMT"

## Database Schema

**User Model:**
- `username` - Unique identifier (links to CAS)
- `email` - User email
- `full_name` - Formatted full name
- `user_type` - Enum: ['STU', 'LEC', 'RES', 'STA']
- `student_id` - 7 digits (students only)
- `staff_id` - 6 digits (staff/lecturers)
- `faculty` - Default: "Khoa KH & KT Máy tính"
- `department` - For staff (default: "KHMT")
- `major` - For students (default: "KHMT")

## Environment Variables

```env
PORT=8001
MONGO_URI=mongodb://localhost:27017/hcmut_datacore
NODE_ENV=development
```

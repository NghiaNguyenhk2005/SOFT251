# HCMUT Datacore Service - Complete Setup Guide

## 📁 Project Structure

```
datacore/
├── .env                           # Environment configuration
├── package.json                   # Dependencies
├── README.md                      # Documentation
├── .gitignore                     # Git ignore rules
└── src/
    ├── server.js                  # Main entry point
    ├── models/
    │   └── User.js               # Mongoose User schema
    ├── controllers/
    │   └── userController.js     # Request handlers
    ├── routes/
    │   └── api.js                # API endpoints
    ├── utils/
    │   └── initDB.js             # Auto-initialization logic
    └── data/
        └── datacore_users.json   # Pre-transformed user data
```

## 🎯 Data Transformation Logic

### Input Source
Raw user list from CAS system:
```
['pctsv', 'pdt', 'cse', 'hung', 'dung', 'thao', 'lan', 
 'an.nguyen', 'binh.tran', 'chi.le', 'duy.pham', 'em.hoang', 
 'giang.vo', 'hoa.phan', 'kien.bui', 'linh.do', 'minh.ngo']
```

### Transformation Rules

#### 1️⃣ Department Staff (STA)
**Usernames:** `pctsv`, `pdt`, `cse`
**Transformation:**
- `user_type`: "STA"
- `staff_id`: "STA001", "STA002", "STA003"
- `full_name`: Uppercase (e.g., "PCTSV")
- `department`: null
- `student_id`: null
- `major`: null

**Example:**
```json
{
  "username": "pctsv",
  "email": "pctsv@hcmut.edu.vn",
  "full_name": "PCTSV",
  "user_type": "STA",
  "staff_id": "STA001",
  "faculty": "Khoa KH & KT Máy tính"
}
```

#### 2️⃣ Lecturers (LEC)
**Usernames:** `hung`, `dung`, `thao`, `lan`
**Transformation:**
- `user_type`: "LEC"
- `staff_id`: "004001", "004002", "004003", "004004"
- `full_name`: "Giảng viên [Name]" (e.g., "Giảng viên Hùng")
- `department`: "KHMT"
- `student_id`: null
- `major`: null

**Example:**
```json
{
  "username": "hung",
  "email": "hung@hcmut.edu.vn",
  "full_name": "Giảng viên Hùng",
  "user_type": "LEC",
  "staff_id": "004001",
  "department": "KHMT",
  "faculty": "Khoa KH & KT Máy tính"
}
```

#### 3️⃣ Students (STU)
**Usernames:** `an.nguyen`, `binh.tran`, `chi.le`, etc. (with dots)
**Transformation:**
- `user_type`: "STU"
- `student_id`: "2301001", "2301002", "2301003", etc.
- `full_name`: Convert "firstname.lastname" to "Lastname Firstname" (Vietnamese format)
  - `an.nguyen` → "Nguyễn An"
  - `binh.tran` → "Trần Bình"
- `major`: "KHMT"
- `staff_id`: null
- `department`: null

**Example:**
```json
{
  "username": "an.nguyen",
  "email": "an.nguyen@hcmut.edu.vn",
  "full_name": "Nguyễn An",
  "user_type": "STU",
  "student_id": "2301001",
  "major": "KHMT",
  "faculty": "Khoa KH & KT Máy tính"
}
```

## 🚀 How to Run

### 1. Start MongoDB
```bash
# Make sure MongoDB is running
mongod --dbpath=/path/to/data
```

### 2. Install Dependencies
```bash
cd datacore
npm install
```

### 3. Start Service
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Expected Output:
```
✓ MongoDB connected successfully

🔄 Starting database initialization...

✓ Loaded 17 users from datacore_users.json

📥 Importing users into database...

✓ Database initialization completed!

Summary:
  - New users created: 17
  - Existing users updated: 0
  - Total users in DB: 17

User Type Distribution:
  - Staff: 3
  - Lecturers: 4
  - Students: 10

═══════════════════════════════════════════
  🚀 HCMUT DATACORE SERVICE
═══════════════════════════════════════════
  Port: 8001
  Environment: development
  API Base: http://localhost:8001/api
───────────────────────────────────────────
  Endpoints:
  • GET  /api/health
  • GET  /api/users/sync
  • GET  /api/users/profile/:id
═══════════════════════════════════════════
```

## 📡 API Usage Examples

### 1. Health Check
```bash
curl http://localhost:8001/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "HCMUT Datacore API is running",
  "timestamp": "2025-11-27T10:30:00.000Z"
}
```

### 2. Sync All Users
```bash
curl http://localhost:8001/api/users/sync
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "count": 17,
  "data": [
    {
      "_id": "...",
      "username": "pctsv",
      "email": "pctsv@hcmut.edu.vn",
      "full_name": "PCTSV",
      "user_type": "STA",
      "staff_id": "STA001",
      "faculty": "Khoa KH & KT Máy tính",
      "createdAt": "...",
      "updatedAt": "..."
    },
    // ... more users
  ]
}
```

### 3. Get User Profile by Student ID
```bash
curl http://localhost:8001/api/users/profile/2301001
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "...",
    "username": "an.nguyen",
    "email": "an.nguyen@hcmut.edu.vn",
    "full_name": "Nguyễn An",
    "user_type": "STU",
    "student_id": "2301001",
    "major": "KHMT",
    "faculty": "Khoa KH & KT Máy tính",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 4. Get User Profile by Staff ID
```bash
curl http://localhost:8001/api/users/profile/004001
```

### 5. Get User Profile by Username
```bash
curl http://localhost:8001/api/users/profile/hung
```

## 🔍 Database Schema

**Collection:** `users`

| Field | Type | Description | Required | Unique |
|-------|------|-------------|----------|--------|
| username | String | CAS login username | ✅ | ✅ |
| email | String | HCMUT email | ✅ | ❌ |
| full_name | String | Formatted full name | ✅ | ❌ |
| user_type | String | STU/LEC/RES/STA | ✅ | ❌ |
| student_id | String | 7-digit ID (23xxxxx) | ❌ | ✅ (sparse) |
| staff_id | String | 6-digit ID (004xxx or STAxxx) | ❌ | ✅ (sparse) |
| faculty | String | Faculty name | ✅ | ❌ |
| department | String | Department code (KHMT) | ❌ | ❌ |
| major | String | Major code (KHMT) | ❌ | ❌ |

## 📊 Sample Data Summary

After initialization, the database contains:

- **3 Staff (STA):** PCTSV, PDT, CSE
- **4 Lecturers (LEC):** Hùng, Dũng, Thảo, Lan
- **10 Students (STU):** Nguyễn An, Trần Bình, Lê Chi, Phạm Duy, Hoàng Em, Võ Giang, Phan Hoa, Bùi Kiên, Đỗ Linh, Ngô Minh

**Total: 17 users**

## 🔄 Integration with Main Backend

The main Tutor System backend can sync with Datacore:

```javascript
// In main backend
const syncDatacore = async () => {
  const response = await fetch('http://localhost:8001/api/users/sync');
  const { data } = await response.json();
  
  // Process users
  for (const user of data) {
    // Create or update user in main system
    await User.findOneAndUpdate(
      { username: user.username },
      {
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type,
        // ... other fields
      },
      { upsert: true }
    );
  }
};
```

## ⚠️ Important Notes

1. **Idempotent Design:** Safe to restart - uses upsert to avoid duplicates
2. **Pre-transformed Data:** `datacore_users.json` contains ready-to-use data
3. **Auto-initialization:** Runs on every server start, but skips if data exists
4. **Sparse Indexes:** `student_id` and `staff_id` use sparse unique indexes (allow nulls)
5. **Port:** Default 8001 (configurable via .env)

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod --dbpath=/path/to/data`
- Check MONGO_URI in `.env`

### Data Not Loading
- Verify `src/data/datacore_users.json` exists
- Check file permissions
- Review logs for specific errors

### Duplicate Key Errors
- Drop the database: `use hcmut_datacore; db.dropDatabase()`
- Restart the service

## 📝 Environment Variables

```env
PORT=8001
MONGO_URI=mongodb://localhost:27017/hcmut_datacore
NODE_ENV=development
```

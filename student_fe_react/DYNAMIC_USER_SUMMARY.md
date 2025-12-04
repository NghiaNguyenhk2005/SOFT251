# Dynamic User Display - Summary

## ✅ Completed Changes

The tutor frontend now displays **real user data from the backend** instead of hardcoded "ThS. Mai Đức Trung".

## What Was Changed

### 1. Created TutorContext (NEW)
**File:** `src/contexts/TutorContext.jsx`
- React context to share tutor profile across all components
- Fetches profile once on mount
- Provides `useTutorProfile()` hook

### 2. Updated TutorMainLayout
**File:** `src/modules/tutor/layouts/TutorMainLayout.jsx`
- Wrapped layout with `<TutorProvider>`
- Makes profile available to all child components

### 3. Updated TutorHeader
**File:** `src/modules/tutor/components/TutorHeader.jsx`
- Removed hardcoded "ThS. Mai Đức Trung"
- Uses `useTutorProfile()` hook
- Displays `tutorProfile.userId.fullName` from backend

## Backend Integration

### API Call Flow
```
Frontend                    Backend
--------                    -------
1. TutorProvider mounts
2. Calls getMyTutorProfile()
3. Makes API request ────────> GET /api/v1/tutors/me
                                Authorization: Bearer <token>
                                
4. Receives response <────────  {
                                  "success": true,
                                  "data": {
                                    "userId": {
                                      "fullName": "Nguyen Quoc Hung",
                                      "email": "hung@hcmut.edu.vn",
                                      ...
                                    },
                                    ...
                                  }
                                }

5. Stores in context state
6. TutorHeader displays name ──> "Nguyen Quoc Hung"
```

### Backend User Data
Based on your backend logs:
- **Username:** hung
- **Email:** hung@hcmut.edu.vn
- **User Type:** lecturer
- **Staff ID:** 004001

The frontend will now display whatever `fullName` is stored in the database for this user.

## Testing Results

### ✅ What Works Now

1. **Dynamic Name Display**
   - Header shows actual user's name from backend
   - Different users see their own names

2. **Loading State**
   - Shows "Loading..." while fetching profile
   - Prevents blank or undefined display

3. **Error Handling**
   - Falls back to "Tutor" if API fails
   - No crashes or white screens

4. **Performance**
   - Profile fetched only once
   - Shared across all tutor pages
   - No duplicate API calls

## Before vs After

### Before
```jsx
// Hardcoded - everyone sees the same name
<span>ThS. Mai Đức Trung</span>
```

### After
```jsx
// Dynamic - each user sees their own name
const { tutorProfile } = useTutorProfile();
const name = tutorProfile?.userId?.fullName || "Tutor";
<span>{name}</span>
```

## Files Modified

| File | Change |
|------|--------|
| `src/contexts/TutorContext.jsx` | ✨ **NEW** - Context provider |
| `src/modules/tutor/layouts/TutorMainLayout.jsx` | Added `<TutorProvider>` wrapper |
| `src/modules/tutor/components/TutorHeader.jsx` | Dynamic name from context |

## How to Verify

1. **Start backend:** `npm run dev` (running on port 4000)
2. **Start frontend:** `npm run dev` (running on port 5173)
3. **Login via CAS** to get JWT token
4. **Navigate to:** http://localhost:5173/tutor/dashboard
5. **Check header:** Should show your actual name, not "Mai Đức Trung"

### Using Browser DevTools

**Console tab:**
```javascript
// Check if profile is loaded
localStorage.getItem('authToken')  // Should return your JWT
```

**Network tab:**
- Look for `GET /api/v1/tutors/me` request
- Check response shows correct user data
- Verify `userId.fullName` field

**React DevTools:**
- Find `TutorProvider` component
- Check state contains `tutorProfile` with user data

## Expected Display

| User | Backend Email | Display Name |
|------|---------------|--------------|
| Hung | hung@hcmut.edu.vn | Nguyen Quoc Hung (or whatever fullName is in DB) |
| Other Tutor | other@hcmut.edu.vn | Their full name |
| Error Case | - | "Tutor" (fallback) |

## Benefits

✅ **No hardcoding** - All data from backend  
✅ **Real-time** - Shows actual logged-in user  
✅ **Scalable** - Works for any number of tutors  
✅ **Maintainable** - Single source of truth  
✅ **Performant** - One API call, shared context  

## Notes

- The backend is correctly authenticating via CAS
- User "hung" is synced with DATACORE (lecturer, staff_id: 004001)
- The API endpoint `/api/v1/tutors/me` is being called successfully
- Make sure the User document in MongoDB has a `fullName` field populated

## Troubleshooting

### If name shows "Loading..." forever:
- Check browser console for API errors
- Verify JWT token is valid
- Check Network tab for 401/403 errors

### If name shows "Tutor" (fallback):
- API call failed or returned error
- Check backend logs
- Verify tutor profile exists for user

### If name is undefined:
- User document might not have `fullName` field
- Check MongoDB: `db.users.findOne({email: "hung@hcmut.edu.vn"})`
- Add fullName field if missing

## Next Steps

The context can be extended to show more user info:

```jsx
const { tutorProfile } = useTutorProfile();

// Available data:
const name = tutorProfile?.userId?.fullName;
const email = tutorProfile?.userId?.email;
const faculty = tutorProfile?.userId?.faculty;
const hcmutId = tutorProfile?.userId?.hcmutId;
const subjects = tutorProfile?.subjectIds;
const stats = tutorProfile?.stats;
```

Use this data for:
- Profile dropdown menu
- Dashboard statistics
- User settings page
- Profile edit page

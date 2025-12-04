# Compatibility Fix - Student Module

## Issue
The student module (`ProgramRegisterPage.jsx`) was importing `fetchTutors()` function from `tutorService.js`, but this function was removed during the API integration refactor.

## Error Message
```
[ERROR] No matching export in "src/services/tutorService.js" for import "fetchTutors"

src/modules/student/pages/ProgramRegisterPage.jsx:3:9:
  3 │ import { fetchTutors } from "../../../services/tutorService";
```

## Solution
Added a legacy compatibility function `fetchTutors()` that wraps the new `searchTutors()` function:

```javascript
/**
 * Fetch tutors (legacy function for student module compatibility)
 * @returns {Promise<Array>} - List of tutors
 */
export async function fetchTutors() {
  const response = await searchTutors({ limit: 100 });
  return response.data || [];
}
```

## Why This Approach?
- **No changes to student module** - As requested, no modifications to student-related code
- **Backward compatibility** - Existing student pages continue to work
- **Forward compatibility** - New tutor pages use the improved API functions
- **Clean migration path** - Student module can be updated later to use `searchTutors()`

## File Modified
- `student_fe_react/src/services/tutorService.js` - Added `fetchTutors()` function

## Verification
✅ All exports from `tutorService.js`:
- `searchTutors()`
- `getTutorById()`
- `getTutorByHcmutId()`
- `getTutorAvailability()`
- `getTutorAvailabilityByHcmutId()`
- `getMyTutorProfile()`
- `getMySessions()`
- `getMyFeedbacks()`
- `fetchTutors()` ← Legacy function for student module

## Status
✅ **Fixed** - Application should now run without errors

You can now start the dev server:
```bash
npm run dev
```

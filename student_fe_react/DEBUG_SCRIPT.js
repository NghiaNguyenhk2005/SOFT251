// ===============================================
// DEBUG SCRIPT - Copy paste vào Browser Console
// ===============================================

console.log('🔍 Starting debug...\n');

// 1. Check Token
const token = localStorage.getItem('authToken');
console.log('1️⃣ TOKEN CHECK:');
if (token) {
  console.log('✅ Token exists:', token.substring(0, 50) + '...');
} else {
  console.log('❌ No token in localStorage');
  console.log('👉 You need to login first: http://localhost:4000/api/v1/auth/login');
}

console.log('\n');

// 2. Check API URL
console.log('2️⃣ API URL CHECK:');
console.log('Frontend expects:', 'http://localhost:4000/api/v1');
console.log('Or from .env:', import.meta.env.VITE_API_BASE_URL || 'Not set');

console.log('\n');

// 3. Test Backend Connection
console.log('3️⃣ BACKEND CONNECTION TEST:');
fetch('http://localhost:4000/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend reachable:', d))
  .catch(e => console.log('❌ Backend NOT reachable:', e.message));

console.log('\n');

// 4. Test /tutors/me API (if have token)
if (token) {
  console.log('4️⃣ TESTING /tutors/me API:');
  fetch('http://localhost:4000/api/v1/tutors/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(async response => {
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok && data.data?.userId?.fullName) {
      console.log('✅ SUCCESS! Name from API:', data.data.userId.fullName);
      console.log('👉 If header still shows "Tutor", check React DevTools for TutorContext state');
    } else if (response.status === 404) {
      console.log('❌ Tutor profile not found');
      console.log('👉 User might not be a tutor, or Tutor document missing in DB');
    } else if (response.status === 401) {
      console.log('❌ Unauthorized - Token invalid or expired');
      console.log('👉 Login again: http://localhost:4000/api/v1/auth/login');
    } else {
      console.log('⚠️ Unexpected response');
    }
  })
  .catch(e => console.log('❌ API Error:', e.message));
} else {
  console.log('4️⃣ SKIPPING /tutors/me test (no token)');
  console.log('👉 Login first at: http://localhost:4000/api/v1/auth/login');
}

console.log('\n📋 WHAT TO DO NEXT:\n');
if (!token) {
  console.log('1. Go to: http://localhost:4000/api/v1/auth/login');
  console.log('2. Login with CAS (username: hung)');
  console.log('3. You will be redirected back with token');
  console.log('4. Token will be saved automatically');
  console.log('5. Run this script again to verify');
} else {
  console.log('1. Check the API response above');
  console.log('2. If API returns fullName, check React DevTools:');
  console.log('   - Find TutorProvider component');
  console.log('   - Check tutorProfile state');
  console.log('3. If state is correct but UI wrong, check TutorHeader component');
}

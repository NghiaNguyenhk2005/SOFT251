// src/services/tutorService.js
import { api } from '../utils/api.js';

const USE_MOCK_DATA = false;

/**
 * Get tutor's own profile
 * @returns {Promise<Object>} - Tutor profile data
 */
export async function getMyTutorProfile() {
  const token = localStorage.getItem('bkarch_jwt');
  
  console.log('🔍 Checking token:', token ? 'Token exists' : 'No token found');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK tutor profile data (USE_MOCK_DATA:', USE_MOCK_DATA, ', has token:', !!token, ')');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: 'tutor123',
          userId: {
            _id: 'user123',
            fullName: 'Mock Tutor',
            email: 'tutor@hcmut.edu.vn',
          },
          specializations: ['Computer Science', 'Programming'],
          bio: 'Experienced tutor in computer science',
          availability: [],
          rating: 4.5,
          totalSessions: 50,
        });
      }, 500);
    });
  }

  try {
    console.log('📡 Fetching tutor profile from API: /tutors/me');
    const response = await api.get('/tutors/me');
    console.log('✅ Tutor profile from API:', response.data);
    const profile = response.data?.data || response.data;
    console.log('✅ Parsed profile:', profile);
    return profile;
  } catch (error) {
    console.error('❌ Error fetching tutor profile:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Update tutor profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated tutor profile
 */
export async function updateTutorProfile(profileData) {
  const token = localStorage.getItem('bkarch_jwt');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK update tutor profile');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...profileData, _id: 'tutor123' });
      }, 500);
    });
  }

  try {
    const response = await api.put('/tutors/me', profileData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error updating tutor profile:', error);
    throw error;
  }
}

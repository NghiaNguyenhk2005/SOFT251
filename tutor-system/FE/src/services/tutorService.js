// src/services/tutorService.js
import { api } from '../utils/api.js';
import { MOCK_TUTOR_PROFILE } from './mockData.js';

// Enable/disable mock data
const USE_MOCK_DATA = false;

/**
 * Search tutors by criteria
 * @param {Object} criteria - Search criteria (subjectId, type, minRating, etc.)
 * @returns {Promise<Object>} - Paginated tutor list
 */
export async function searchTutors(criteria = {}) {
  const queryParams = new URLSearchParams();
  
  if (criteria.subjectId) queryParams.append('subjectId', criteria.subjectId);
  if (criteria.type) queryParams.append('type', criteria.type);
  if (criteria.minRating) queryParams.append('minRating', criteria.minRating);
  if (criteria.isAcceptingStudents !== undefined) {
    queryParams.append('isAcceptingStudents', criteria.isAcceptingStudents);
  }
  if (criteria.page) queryParams.append('page', criteria.page);
  if (criteria.limit) queryParams.append('limit', criteria.limit);

  const queryString = queryParams.toString();
  const endpoint = `/tutors/search${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(endpoint);
  return response;
}

/**
 * Get tutor details by ID
 * @param {string} tutorId - Tutor MongoDB ObjectId
 * @returns {Promise<Object>} - Tutor details
 */
export async function getTutorById(tutorId) {
  const response = await api.get(`/tutors/${tutorId}`);
  return response.data;
}

/**
 * Get tutor by HCMUT ID (staff_id/maCB)
 * @param {string} hcmutId - HCMUT staff ID
 * @returns {Promise<Object>} - Tutor details
 */
export async function getTutorByHcmutId(hcmutId) {
  const response = await api.get(`/tutors/by-hcmut-id/${hcmutId}`);
  return response.data;
}

/**
 * Get tutor availability by tutor ID
 * @param {string} tutorId - Tutor MongoDB ObjectId
 * @returns {Promise<Array>} - Availability slots
 */
export async function getTutorAvailability(tutorId) {
  const response = await api.get(`/tutors/${tutorId}/availability`);
  return response.data;
}

/**
 * Get tutor availability by HCMUT ID
 * @param {string} hcmutId - HCMUT staff ID
 * @returns {Promise<Array>} - Availability slots
 */
export async function getTutorAvailabilityByHcmutId(hcmutId) {
  const response = await api.get(`/tutors/by-hcmut-id/${hcmutId}/availability`);
  return response.data;
}

/**
 * Get my tutor profile (for logged-in tutor) - WITH MOCK DATA SUPPORT
 * @returns {Promise<Object>} - My tutor profile
 */
export async function getMyTutorProfile() {
  // Use mock data if enabled or no token
  const token = localStorage.getItem('authToken');
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK tutor profile data');
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TUTOR_PROFILE), 500);
    });
  }

  try {
    const response = await api.get('/tutors/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    throw error;
  }
}

/**
 * Get my sessions as a tutor
 * @param {Object} filters - Filter options (status, startDate, endDate, page, limit)
 * @returns {Promise<Object>} - Paginated sessions
 */
export async function getMySessions(filters = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.page) queryParams.append('page', filters.page);
  if (filters.limit) queryParams.append('limit', filters.limit);

  const queryString = queryParams.toString();
  const endpoint = `/tutors/me/sessions${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(endpoint);
  return response;
}

/**
 * Get my feedbacks as a tutor
 * @param {Object} filters - Filter options (page, limit)
 * @returns {Promise<Object>} - Paginated feedbacks
 */
export async function getMyFeedbacks(filters = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.page) queryParams.append('page', filters.page);
  if (filters.limit) queryParams.append('limit', filters.limit);

  const queryString = queryParams.toString();
  const endpoint = `/tutors/me/feedbacks${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(endpoint);
  return response;
}

/**
 * Fetch tutors (legacy function for student module compatibility)
 * @returns {Promise<Array>} - List of tutors
 */
export async function fetchTutors() {
  const response = await searchTutors({ limit: 100 });
  return response.data || [];
}

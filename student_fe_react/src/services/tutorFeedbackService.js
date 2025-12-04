// src/services/tutorFeedbackService.js
import { api } from '../utils/api.js';
import { MOCK_FEEDBACKS } from './mockData.js';

// Enable/disable mock data
const USE_MOCK_DATA = true;

/**
 * Get feedbacks received by tutor (UC-22)
 * @returns {Promise<Array>} - List of feedbacks
 */
export async function getTutorFeedbacks() {
  // Check if user is authenticated
  const token = localStorage.getItem('authToken');
  
  // Use mock data if enabled or no token
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK feedbacks data');
    return new Promise((resolve) => {
      setTimeout(() => {
        const formatted = MOCK_FEEDBACKS.map(feedback => ({
          id: feedback._id,
          studentName: feedback.studentId?.fullName || 'Ẩn danh',
          studentId: feedback.studentId?.hcmutId || 'N/A',
          sessionTitle: feedback.sessionId?.title || 'N/A',
          rating: feedback.rating || 0,
          comment: feedback.comment || '',
          date: new Date(feedback.createdAt).toLocaleDateString('vi-VN'),
          timestamp: feedback.createdAt,
        }));
        resolve(formatted);
      }, 500);
    });
  }

  try {
    const response = await api.get('/tutors/me/feedbacks');
    const feedbacks = response.data || [];
    
    // Transform backend format to frontend format
    return feedbacks.map(feedback => ({
      id: feedback._id,
      studentName: feedback.studentId?.fullName || 'Ẩn danh',
      studentId: feedback.studentId?.hcmutId || 'N/A',
      sessionTitle: feedback.sessionId?.title || 'N/A',
      rating: feedback.rating || 0,
      comment: feedback.comment || '',
      date: new Date(feedback.createdAt).toLocaleDateString('vi-VN'),
      timestamp: feedback.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching tutor feedbacks:', error);
    return [];
  }
}

/**
 * Get tutor statistics from feedbacks
 * @param {Array} feedbacks - Optional: provide feedbacks to calculate stats from
 * @returns {Promise<Object>} - Statistics object
 */
export async function getTutorFeedbackStats(feedbacks = null) {
  // If feedbacks are provided, calculate from them
  if (feedbacks) {
    if (feedbacks.length === 0) {
      return {
        averageRating: 0,
        totalFeedbacks: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = totalRating / feedbacks.length;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach(fb => {
      const rating = Math.round(fb.rating);
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating]++;
      }
    });

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalFeedbacks: feedbacks.length,
      ratingDistribution
    };
  }

  // Otherwise fetch feedbacks first
  const token = localStorage.getItem('authToken');
  if (!token && !USE_MOCK_DATA) {
    return {
      averageRating: 0,
      totalFeedbacks: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  try {
    const fetchedFeedbacks = await getTutorFeedbacks();
    
    if (fetchedFeedbacks.length === 0) {
      return {
        averageRating: 0,
        totalFeedbacks: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalRating = fetchedFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = totalRating / fetchedFeedbacks.length;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    fetchedFeedbacks.forEach(fb => {
      const rating = Math.round(fb.rating);
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating]++;
      }
    });

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalFeedbacks: fetchedFeedbacks.length,
      ratingDistribution
    };
  } catch (error) {
    console.error('Error calculating feedback stats:', error);
    return {
      averageRating: 0,
      totalFeedbacks: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
}

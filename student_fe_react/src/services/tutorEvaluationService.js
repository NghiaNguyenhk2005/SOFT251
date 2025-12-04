// src/services/tutorEvaluationService.js
import { api } from '../utils/api.js';

// Enable/disable mock data
const USE_MOCK_DATA = false;

/**
 * Tutor evaluates a student (UC-27)
 * Endpoint: POST /api/v1/evaluations/tutor
 * @param {Object} data - Evaluation data
 * @returns {Promise<Object>}
 */
export async function evaluateStudent(data) {
  const token = localStorage.getItem('bkarch_jwt');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK - evaluate student');
    console.log('💾 Saving to database (mock):', {
      studentId: data.studentId,
      rating: Math.round(data.rating),
      comment: data.comment
    });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Đánh giá đã được lưu thành công',
          data: {
            _id: 'eval_' + Date.now(),
            sessionId: data.sessionId,
            studentId: data.studentId,
            tutorId: 'tutor123',
            rating: Math.round(data.rating),
            content: data.comment,
            createdAt: new Date().toISOString()
          }
        });
      }, 500);
    });
  }

  try {
    console.log('💾 Saving evaluation to database via API...');
    const response = await api.post('/evaluations/tutor', {
      sessionId: data.sessionId,
      studentId: data.studentId,
      rating: Math.round(data.rating), // Must be integer 1-5 (BR-010)
      content: data.comment // Backend uses "content" not "comment"
    });
    console.log('✅ Evaluation saved successfully');
    return response;
  } catch (error) {
    console.error('❌ Error evaluating student:', error);
    throw error;
  }
}

/**
 * Get evaluations for a specific session
 * Endpoint: GET /api/v1/evaluations/session/:sessionId
 * @param {string} sessionId
 * @returns {Promise<Object>}
 */
export async function getSessionEvaluations(sessionId) {
  const token = localStorage.getItem('bkarch_jwt');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK - session evaluations');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          studentFeedbacks: [],
          tutorFeedbacks: []
        });
      }, 300);
    });
  }

  try {
    const response = await api.get(`/evaluations/session/${sessionId}`);
    return response.data || { studentFeedbacks: [], tutorFeedbacks: [] };
  } catch (error) {
    console.error('Error fetching session evaluations:', error);
    return { studentFeedbacks: [], tutorFeedbacks: [] };
  }
}

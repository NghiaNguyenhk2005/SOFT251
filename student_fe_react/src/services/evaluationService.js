import { api } from '../utils/api.js';

/**
 * Get completed sessions for evaluation
 * Uses /sessions/upcoming with past date range and COMPLETED status
 */
export async function getCompletedSessions() {
  try {
    // Get sessions from past 90 days that are completed
    const now = new Date();
    const past90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const future30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const response = await api.get(
      `/sessions/upcoming?startDate=${past90Days.toISOString()}&endDate=${future30Days.toISOString()}`
    );
    
    const allSessions = response?.data?.data || response?.data || [];
    
    // Filter only COMPLETED sessions
    const completedSessions = allSessions.filter(
      session => session.status === 'COMPLETED'
    );
    
    console.log('✅ Fetched completed sessions:', completedSessions.length);
    return completedSessions;
  } catch (error) {
    console.error('❌ Error fetching completed sessions:', error);
    throw error;
  }
}

/**
 * Get evaluations for a specific session
 * @param {string} sessionId - Session ID
 */
export async function getSessionEvaluations(sessionId) {
  try {
    const response = await api.get(`/evaluations/session/${sessionId}`);
    const data = response?.data?.data || response?.data || {};
    // Return tutorFeedbacks array for the Tutor view
    return data.tutorFeedbacks || [];
  } catch (error) {
    console.error('❌ Error fetching session evaluations:', error);
    throw error;
  }
}

/**
 * Create tutor evaluation for student
 * @param {Object} evaluationData
 * @param {string} evaluationData.sessionId
 * @param {string} evaluationData.studentId
 * @param {string} evaluationData.attendanceStatus - PRESENT, LATE, ABSENT
 * @param {number} evaluationData.progressScore - 0-10
 * @param {string} evaluationData.comment
 */
export async function createTutorEvaluation(evaluationData) {
  try {
    console.log('📡 Creating tutor evaluation:', evaluationData);
    
    const response = await api.post('/evaluations/tutor', evaluationData);
    
    console.log('✅ Evaluation created:', response);
    return response?.data || response;
  } catch (error) {
    console.error('❌ Error creating evaluation:', error);
    throw error;
  }
}

/**
 * Update tutor evaluation
 * @param {string} evaluationId
 * @param {Object} updates
 */
export async function updateTutorEvaluation(evaluationId, updates) {
  try {
    console.log('📡 Updating evaluation:', evaluationId, updates);
    
    const response = await api.put(`/evaluations/tutor/${evaluationId}`, updates);
    
    console.log('✅ Evaluation updated:', response);
    return response?.data || response;
  } catch (error) {
    console.error('❌ Error updating evaluation:', error);
    throw error;
  }
}

/**
 * Get feedbacks received by tutor (from students)
 */
export async function getTutorFeedbacks() {
  try {
    const response = await api.get('/evaluations/tutor/feedbacks');
    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error('❌ Error fetching tutor feedbacks:', error);
    throw error;
  }
}

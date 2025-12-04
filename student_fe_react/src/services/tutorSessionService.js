// src/services/tutorSessionService.js
import { api } from '../utils/api.js';
import { MOCK_SESSIONS } from './mockData.js';

// Enable/disable mock data
const USE_MOCK_DATA = false;

/**
 * Get all sessions for the tutor (UC-21)
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - List of sessions
 */
export async function getTutorSessions(params = {}) {
  const token = localStorage.getItem('bkarch_jwt');
  
  // Use mock data if enabled or no token
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK sessions data');
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredSessions = [...MOCK_SESSIONS];
        
        // Apply status filter if provided
        if (params.status) {
          filteredSessions = filteredSessions.filter(s => s.status === params.status);
        }
        
        const formatted = filteredSessions.map(session => ({
          id: session._id,
          title: session.title,
          description: session.description,
          startTime: session.startTime,
          endTime: session.endTime,
          duration: session.duration,
          sessionType: session.sessionType,
          location: session.location,
          meetLink: session.meetLink,
          status: session.status,
          participants: session.participants || [],
          participantCount: session.participants?.length || 0,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        }));
        
        resolve(formatted);
      }, 500);
    });
  }

  try {
    const queryParams = new URLSearchParams({
      limit: params.limit || 50,
      ...(params.status && { status: params.status }),
      ...(params.fromDate && { fromDate: params.fromDate }),
      ...(params.toDate && { toDate: params.toDate }),
    }).toString();

    const response = await api.get(`/tutors/me/sessions?${queryParams}`);
    const sessions = response.data || [];
    
    return sessions.map(session => ({
      id: session._id,
      title: session.title,
      description: session.description,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      sessionType: session.sessionType,
      location: session.location,
      meetLink: session.meetLink,
      status: session.status,
      participants: session.participants || [],
      participantCount: session.participants?.length || 0,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching tutor sessions:', error);
    return [];
  }
}

/**
 * Get session statistics
 * @returns {Promise<Object>} - Session statistics
 */
export async function getSessionStats() {
  const token = localStorage.getItem('bkarch_jwt');
  if (!token) {
    return {
      total: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };
  }

  try {
    const sessions = await getTutorSessions({ limit: 1000 });
    
    const stats = {
      total: sessions.length,
      scheduled: sessions.filter(s => s.status === 'SCHEDULED').length,
      completed: sessions.filter(s => s.status === 'COMPLETED').length,
      cancelled: sessions.filter(s => s.status === 'CANCELLED').length,
    };

    return stats;
  } catch (error) {
    console.error('Error calculating session stats:', error);
    return {
      total: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };
  }
}

/**
 * Cancel a session (UC-15)
 * Endpoint: DELETE /api/v1/sessions/:id
 * @param {string} sessionId - Session ID
 * @param {string} reason - Cancellation reason (optional)
 * @returns {Promise<Object>}
 */
export async function cancelSession(sessionId, reason) {
  const token = localStorage.getItem('bkarch_jwt');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK - cancel session');
    return Promise.resolve({ 
      success: true, 
      message: 'Session cancelled successfully' 
    });
  }
  
  try {
    // Backend uses DELETE method, not PATCH
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling session:', error);
    throw error;
  }
}

/**
 * Get upcoming sessions
 * Endpoint: GET /api/v1/sessions/upcoming
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>}
 */
export async function getUpcomingSessions(params = {}) {
  const token = localStorage.getItem('bkarch_jwt');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK - upcoming sessions');
    const now = new Date();
    const upcoming = MOCK_SESSIONS.filter(s => {
      return new Date(s.startTime) > now && s.status === 'SCHEDULED';
    });
    return Promise.resolve(upcoming);
  }
  
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/sessions/upcoming?${queryParams}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    return [];
  }
}

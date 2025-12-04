import apiClient from './client';

// --- User / Profile ---
export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get('/students/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Registration (Tutor & Subject) ---

// Register with a tutor for a subject: POST /registrations
export const registerWithTutor = async (tutorId, subjectId) => {
  try {
    const response = await apiClient.post('/registrations', { tutorId, subjectId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get my registrations: GET /registrations/me
export const fetchMyRegistrations = async (params = {}) => {
  try {
    const response = await apiClient.get('/registrations/me', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel registration: DELETE /registrations/{id}
export const cancelRegistration = async (registrationId) => {
  try {
    const response = await apiClient.delete(`/registrations/${registrationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Tutor Registration ---

// Calls GET /tutors/search
export const fetchAvailableTutors = async (params = {}) => {
  try {
    const response = await apiClient.get('/tutors/search', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get sessions created by a tutor (slots)
// GET /students/tutors/{tutorId}/sessions
export const fetchTutorSessions = async (tutorId) => {
  try {
    const response = await apiClient.get(`/students/tutors/${tutorId}/sessions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Book a session: POST /students/sessions/book
export const bookSession = async (sessionId) => {
  try {
    const response = await apiClient.post('/students/sessions/book', { sessionId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Schedule / Dashboard ---

// GET /students/me/sessions
export const fetchMySessions = async (params = {}) => {
  try {
    const response = await apiClient.get('/students/me/sessions', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel booking: DELETE /students/sessions/{id}/book
export const cancelSessionBooking = async (sessionId) => {
  try {
    const response = await apiClient.delete(`/students/sessions/${sessionId}/book`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- History / Feedback ---

// Fetch completed sessions for history
export const fetchHistorySessions = async () => {
  try {
    // Assuming backend supports filtering by status or we filter on client
    // TODO: Check if backend supports ?status=COMPLETED
    const response = await apiClient.get('/students/me/sessions');
    // Client-side filter if needed, but ideally backend handles it
    return response.data; 
  } catch (error) {
    throw error;
  }
};

// Submit feedback: POST /evaluations/student
export const submitSessionRating = async (payload) => {
  try {
    // Payload: { sessionId, tutorId, rating, content }
    const response = await apiClient.post('/evaluations/student', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

import axios from 'axios';

// --- Documents ---
export const fetchDocuments = async () => {
  try {
    // Library Service is on port 3002
    const response = await axios.get('http://localhost:3002/api/resources');
    return response.data.data; // API returns { success: true, data: [...] }
  } catch (error) {
    console.error("Error fetching documents:", error);
    // Fallback to empty list or throw
    return [];
  }
};

// --- Community ---
export const fetchCommunities = async () => {
  try {
    // Mock data
    return [
      { id: 1, name: "CLB Tin học", description: "Chia sẻ kiến thức lập trình", memberCount: 120, facebookUrl: "#", imageUrl: "https://via.placeholder.com/150" }
    ];
  } catch (error) {
    throw error;
  }
};

// --- Events ---
export const fetchEvents = async () => {
  try {
    // Mock data
    return [
      { id: 1, title: "Seminar AI", date: "2023-11-20", description: "Intro to AI", location: "Hall A" },
      { id: 2, title: "Career Talk", date: "2023-12-01", description: "Job opportunities", location: "Hall B" }
    ];
  } catch (error) {
    throw error;
  }
};

// --- Notifications ---
export const fetchNotifications = async () => {
  try {
    // Mock data for notifications
    return [
      { 
        id: 1, 
        title: "Thay đổi lịch học", 
        message: "Lịch học môn CNPM tuần này đã được dời sang thứ 6.", 
        time: "2 giờ trước",
        isRead: false 
      },
      { 
        id: 2, 
        title: "Nhắc nhở đánh giá", 
        message: "Bạn chưa hoàn thành đánh giá cho buổi học trước.", 
        time: "1 ngày trước",
        isRead: false 
      },
      { 
        id: 3, 
        title: "Thông báo hệ thống", 
        message: "Hệ thống sẽ bảo trì vào cuối tuần này.", 
        time: "2 ngày trước",
        isRead: true 
      }
    ];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};



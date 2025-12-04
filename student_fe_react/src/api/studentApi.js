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

// Get current user info with role
export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
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
      { 
        id: 1, 
        name: "K23 – HCMUT Community", 
        description: "Cộng đồng sinh viên K23 Đại học Bách Khoa - ĐHQG TP.HCM", 
        memberCount: "Group", 
        facebookUrl: "https://www.facebook.com/groups/hcmut.k23/?locale=vi_VN", 
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/HCMUT_official_logo.png" 
      },
      { 
        id: 2, 
        name: "Sinh viên Đại học Bách Khoa – HCMUT", 
        description: "Group chính thức dành cho sinh viên Bách Khoa trao đổi học tập và đời sống.", 
        memberCount: "Group", 
        facebookUrl: "https://www.facebook.com/groups/2725023304306622?locale=vi_VN", 
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/HCMUT_official_logo.png" 
      },
      { 
        id: 3, 
        name: "Trường Đại học Bách khoa - ĐH Quốc gia TP.HCM", 
        description: "Trang thông tin chính thức của trường Đại học Bách Khoa.", 
        memberCount: "Page", 
        facebookUrl: "https://www.facebook.com/truongdhbachkhoa", 
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/HCMUT_official_logo.png" 
      }
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
      { 
        id: 1, 
        title: "Seminar: Trí tuệ nhân tạo trong Y tế", 
        date: "2025-12-28", 
        description: "Hội thảo chuyên đề về ứng dụng AI trong chẩn đoán và điều trị y khoa. Diễn giả: TS. Nguyễn Văn An - Chuyên gia AI từ Google.", 
        location: "Hội trường H6 - Đại học Bách Khoa" 
      },
      { 
        id: 2, 
        title: "Career Talk: Định hướng nghề nghiệp IT", 
        date: "2026-01-15", 
        description: "Gặp gỡ các nhà tuyển dụng từ FPT, VNG, Viettel. Cơ hội phỏng vấn thử và nhận offer thực tập ngay tại sự kiện.", 
        location: "Hội trường H1 - Đại học Bách Khoa" 
      },
      { 
        id: 3, 
        title: "Workshop: Kỹ năng mềm cho sinh viên", 
        date: "2026-02-10", 
        description: "Rèn luyện kỹ năng giao tiếp, thuyết trình và làm việc nhóm. Workshop tương tác với các hoạt động thực tế.", 
        location: "Hội trường B4 - Đại học Bách Khoa" 
      }
    ];
  } catch (error) {
    throw error;
  }
};

// --- Notifications ---
export const fetchNotifications = async (params = {}) => {
  try {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { data: [] };
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return { data: { unreadCount: 0 } };
  }
};



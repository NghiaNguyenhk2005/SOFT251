// src/services/tutorNotificationService.js
import { api } from '../utils/api.js';
import { MOCK_NOTIFICATIONS } from './mockData.js';

// Enable/disable mock data
const USE_MOCK_DATA = true;

/**
 * Fetch tutor notifications
 * @returns {Promise<Array>} - List of notifications
 */
export async function fetchTutorNotifications() {
  // Check if user is authenticated before making API calls
  const token = localStorage.getItem('authToken');
  
  // Use mock data if enabled or no token
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK notifications data');
    return new Promise((resolve) => {
      setTimeout(() => {
        const formatted = MOCK_NOTIFICATIONS.map(notif => {
          // Determine notification type based on content
          let type = 'reminder';
          if (notif.message?.includes('yêu cầu') || notif.message?.includes('request')) {
            type = 'request';
          } else if (notif.message?.includes('hủy') || notif.message?.includes('cancel')) {
            type = 'cancellation';
          } else if (notif.message?.includes('đánh giá') || notif.message?.includes('feedback')) {
            type = 'feedback';
          }

          // Calculate relative time
          const createdAt = new Date(notif.createdAt);
          const now = new Date();
          const diffMs = now - createdAt;
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          let timeStr = 'Vừa xong';
          if (diffMins < 1) {
            timeStr = 'Vừa xong';
          } else if (diffMins < 60) {
            timeStr = `${diffMins} phút trước`;
          } else if (diffHours < 24) {
            timeStr = `${diffHours} giờ trước`;
          } else if (diffDays === 1) {
            timeStr = 'Hôm qua';
          } else {
            timeStr = `${diffDays} ngày trước`;
          }

          return {
            id: notif._id,
            type,
            title: notif.title || 'Thông báo',
            description: notif.message,
            time: timeStr,
            read: notif.isRead,
          };
        });
        resolve(formatted);
      }, 300);
    });
  }

  try {
    // Get tutor profile to get userId
    const profileResponse = await api.get('/tutors/me');
    const tutorProfile = profileResponse.data;
    
    // Fetch notifications from backend
    const notificationsResponse = await api.get('/notifications?limit=50');
    const notifications = notificationsResponse.data || [];

    // Transform backend format to frontend format
    const formattedNotifications = notifications.map(notif => {
      // Map backend type to frontend icon type
      let iconType = 'reminder';
      if (notif.type?.includes('APPOINTMENT') || notif.type?.includes('SESSION')) {
        if (notif.type?.includes('CANCEL')) {
          iconType = 'cancellation';
        } else if (notif.type?.includes('CREATED') || notif.type?.includes('CONFIRMED')) {
          iconType = 'request';
        }
      } else if (notif.type?.includes('EVALUATION') || notif.type?.includes('FEEDBACK')) {
        iconType = 'feedback';
      }

      // Calculate relative time
      const createdAt = new Date(notif.createdAt);
      const now = new Date();
      const diffMs = now - createdAt;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeStr = 'Vừa xong';
      if (diffMins < 60) {
        timeStr = `${diffMins} phút trước`;
      } else if (diffHours < 24) {
        timeStr = `${diffHours} giờ trước`;
      } else if (diffDays === 1) {
        timeStr = 'Hôm qua';
      } else {
        timeStr = `${diffDays} ngày trước`;
      }

      return {
        id: notif._id,
        type: iconType,
        backendType: notif.type,
        title: notif.title || 'Thông báo',
        description: notif.message,
        time: timeStr,
        read: notif.isRead,
        readAt: notif.readAt,
        relatedId: notif.relatedId,
        relatedType: notif.relatedType,
        createdAt: notif.createdAt,
      };
    });

    return formattedNotifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Get unread notifications count
 * Endpoint: GET /api/v1/notifications/unread-count
 * @returns {Promise<number>}
 */
export async function getUnreadNotificationsCount() {
  const token = localStorage.getItem('authToken');
  
  if (USE_MOCK_DATA || !token) {
    // Count unread from mock data
    const unread = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
    return Promise.resolve(unread);
  }
  
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data?.unreadCount || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

/**
 * Mark notification as read
 * Endpoint: PUT /api/v1/notifications/:id/read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>}
 */
export async function markNotificationAsRead(notificationId) {
  const token = localStorage.getItem('authToken');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK - mark notification as read:', notificationId);
    // Update mock data
    const notif = MOCK_NOTIFICATIONS.find(n => n._id === notificationId);
    if (notif) {
      notif.isRead = true;
    }
    return Promise.resolve({ success: true });
  }
  
  try {
    console.log('💾 Marking notification as read:', notificationId);
    const response = await api.put(`/notifications/${notificationId}/read`);
    console.log('✅ Notification marked as read');
    return response.data;
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 * Endpoint: PUT /api/v1/notifications/read-all
 * @returns {Promise<Object>}
 */
export async function markAllNotificationsAsRead() {
  const token = localStorage.getItem('authToken');
  
  if (USE_MOCK_DATA || !token) {
    console.log('📦 Using MOCK - mark all as read');
    // Update all mock notifications
    MOCK_NOTIFICATIONS.forEach(n => n.isRead = true);
    return Promise.resolve({ 
      success: true, 
      modifiedCount: MOCK_NOTIFICATIONS.length 
    });
  }
  
  try {
    console.log('💾 Marking all notifications as read');
    const response = await api.put('/notifications/read-all');
    console.log('✅ All notifications marked as read');
    return response.data;
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    throw error;
  }
}

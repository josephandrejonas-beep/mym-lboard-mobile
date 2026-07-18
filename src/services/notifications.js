import apiService from './api';

export const notificationsService = {
  getNotifications: async () => {
    const response = await apiService.get('/api/notifications');
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiService.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await apiService.delete(`/api/notifications/${notificationId}`);
    return response.data;
  },
};

export default notificationsService;

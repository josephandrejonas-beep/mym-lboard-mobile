import apiService from './api';

export const loadsService = {
  getLoads: async () => {
    const response = await apiService.get('/api/loads');
    return response.data;
  },

  getLoadDetails: async (loadId) => {
    const response = await apiService.get(`/api/loads/${loadId}`);
    return response.data;
  },

  updateLoadStatus: async (loadId, status) => {
    const response = await apiService.put(`/api/loads/${loadId}/status`, {
      status: status,
    });
    return response.data;
  },
};

export default loadsService;

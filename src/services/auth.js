import apiService from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  register: async (fullName, phoneNumber, email) => {
    const response = await apiService.post('/api/auth/register', {
      full_name: fullName,
      phone_number: phoneNumber,
      email: email,
    });
    return response.data;
  },

  sendOTP: async (phoneNumber) => {
    const response = await apiService.post('/api/auth/send-otp', {
      phone_number: phoneNumber,
    });
    return response.data;
  },

  verifyOTP: async (phoneNumber, otp) => {
    const response = await apiService.post('/api/auth/verify-otp', {
      phone_number: phoneNumber,
      otp: otp,
    });
    
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.driver));
    }
    
    return response.data;
  },

  logout: async () => {
    await apiService.post('/api/auth/logout');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  isLoggedIn: async () => {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },

  getStoredUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;

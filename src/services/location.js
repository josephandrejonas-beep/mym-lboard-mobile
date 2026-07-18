import Geolocation from '@react-native-community/geolocation';
import apiService from './api';

export const locationService = {
  watchLocation: (callback, errorCallback) => {
    return Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        callback({ latitude, longitude });
      },
      (error) => errorCallback(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  },

  stopWatchingLocation: (watchId) => {
    Geolocation.clearWatch(watchId);
  },

  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  },

  updateLocation: async (latitude, longitude, zipCode) => {
    const response = await apiService.put('/api/drivers/location', {
      latitude,
      longitude,
      zip_code: zipCode,
    });
    return response.data;
  },

  getLocation: async () => {
    const response = await apiService.get('/api/drivers/location');
    return response.data;
  },
};

export default locationService;

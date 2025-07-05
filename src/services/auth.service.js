import axios from 'axios';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests if available
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await axios.post(
          'http://localhost:5000/api/users/refresh-token',
          {refreshToken},
        );

        const {accessToken} = response.data;

        // Store the new tokens
        await AsyncStorage.setItem('accessToken', accessToken);
        // await AsyncStorage.setItem('refreshToken', newRefreshToken);

        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, log the user out
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        // You might want to redirect to login screen here
        throw error;
      }
    }

    return Promise.reject(error);
  },
);

// Auth API calls
export const authApi = {
  // Register user
  register: async userData => {
    try {
      const response = await api.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed';
      Alert.alert('Error', errorMessage);
      throw errorMessage;
    }
  },

  // Login user
  login: async credentials => {
    try {
      const response = await api.post('/api/users/login', credentials);
      // Store tokens in AsyncStorage
      if (response.data.accessToken) {
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      Alert.alert('Error', errorMessage);
      throw errorMessage;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/api/users/logout');
      // Clear tokens from AsyncStorage
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const response = await api.get('/api/users/check-auth');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Authentication check failed';
    }
  },
};

export default api;

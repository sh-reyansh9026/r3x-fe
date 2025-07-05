import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../services/navigationService'; // ✅ Using navigation ref

const API_BASE_URL = "http://192.168.198.27:5000"; // Replace with your backend IP
// const API_BASE_URL = "http://192.168.104.27:5000"; // Replace with your backend IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token in Authorization header
api.interceptors.request.use(
  async (config) => {
    // Skip for login/register requests to avoid circular dependencies
    if (config.url.includes('/users/login') || config.url.includes('/users/register')) {
      return config;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Ensure token is properly formatted (remove any quotes if present)
        const cleanToken = token.replace(/^"|"$/g, '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // If this is a refresh token request, don't retry
      if (originalRequest.url.includes('refresh-token')) {
        // Clear tokens and redirect to login
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        navigate('Login'); // ✅ using navigationRef
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // If we've already tried to refresh the token, don't retry
      if (originalRequest._retry) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        navigate('Login'); // ✅ using navigationRef
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Mark request as retried
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/api/users/refresh-token`,
          { refreshToken: refreshToken.replace(/^"|"$/g, '') },
          { skipAuthRefresh: true } // Add this to prevent infinite loops
        );

        const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token received');
        }

        // Store the new token
        await AsyncStorage.setItem('authToken', newAccessToken);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens on refresh failure
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        // Redirect to login
        navigate('Login'); // ✅ using navigationRef
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    // Handle other error statuses
    if (error.response) {
      const { status, data } = error.response;

      // Handle 403 Forbidden
      if (status === 403) {
        return Promise.reject(new Error(data.message || 'You do not have permission to perform this action'));
      }

      // Handle 404 Not Found
      if (status === 404) {
        return Promise.reject(new Error('The requested resource was not found'));
      }

      // Handle 500 Internal Server Error
      if (status >= 500) {
        return Promise.reject(new Error('A server error occurred. Please try again later.'));
      }

      // Handle validation errors (422)
      if (status === 422 && data.errors) {
        const errorMessage = Object.values(data.errors)
          .flat()
          .join('\n');
        return Promise.reject(new Error(errorMessage));
      }

      // Handle other error messages from the server
      if (data.message) {
        return Promise.reject(new Error(data.message));
      }
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    }

    // Default error
    return Promise.reject(error);
  }
);

export default api;

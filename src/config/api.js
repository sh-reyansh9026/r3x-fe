import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../services/navigationService';
import { Alert } from 'react-native';

const API_BASE_URL = "http://172.22.14.144:5000"; // backend ip

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle FormData
api.interceptors.request.use(
  async (config) => {
    // If the data is FormData, remove the Content-Type header
    // to let the browser set it with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Add auth token if it exists
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, '')}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, '')}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, redirect to login
          await AsyncStorage.clear();
          // You might want to redirect to login screen here
          navigate('Login');
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(`${API_BASE_URL}/api/users/refresh-token`, {
          refreshToken: refreshToken.replace(/"/g, ''),
          user: await AsyncStorage.getItem('user'),
        });

        console.log(response.data);
        const { access, refresh } = response.data;


        // Save new tokens
        await AsyncStorage.setItem('accessToken', access.token);
        await AsyncStorage.setItem('refreshToken', refresh.token);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${access.token}`;
        
        // Retry the original request
        console.log("Retrying original request...", api(originalRequest));
        return api(originalRequest);
      } catch (error) {
        // If refresh fails, clear storage and redirect to login
        await AsyncStorage.clear();
        navigate('Login');
        // You might want to redirect to login screen here
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
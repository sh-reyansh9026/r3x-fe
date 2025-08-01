import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base URL

const API = 'http://192.168.198.27:5000';

export const login = async (email, password) => {
  const res = await axios.post(`${API}/api/users/login`, { email, password });
  await AsyncStorage.setItem('accessToken', res.data.access.token);
  await AsyncStorage.setItem('refreshToken', res.data.refresh.token);
  return res.data;
};

export const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const res = await axios.post(`${API}/refresh`, { refreshToken });
  return res.data;
};

export const logout = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  await axios.post(`${API}/logout`, { refreshToken });
  await AsyncStorage.clear();
};
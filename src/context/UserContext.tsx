import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

interface User {
  _id: string;
  name: string;
  email: string;
  isBuyer: boolean;
  token?: string;
  refreshToken?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, isBuyer: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/users/login', { email, password });
      const { user: userData, token, refreshToken } = response.data;
      
      // Store tokens securely
      await AsyncStorage.setItem('authToken', token);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
      
      // Update user state
      setUser({
        ...userData,
        token,
        refreshToken
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, isBuyer: boolean) => {
    try {
      const response = await api.post('/api/users/register', { 
        name, 
        email, 
        password, 
        isBuyer 
      });
      
      const { user: userData, token, refreshToken } = response.data;
      
      // Store tokens securely
      await AsyncStorage.setItem('authToken', token);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
      
      // Update user state
      setUser({
        ...userData,
        token,
        refreshToken
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear tokens
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };
  
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return false;
      
      // Optionally validate token with backend
      const response = await api.get('/api/users/me');
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      await logout();
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      checkAuth 
    }}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 
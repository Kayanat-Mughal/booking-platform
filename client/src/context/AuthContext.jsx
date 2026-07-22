import React, { createContext, useEffect, useState, useContext } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/api/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔵 AuthContext: login called with:', email);
      const response = await api.post('/api/auth/login', { email, password });
      console.log('🟢 AuthContext: login response:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('🔴 AuthContext: login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔵 AuthContext: register called with:', userData.email);
      const response = await api.post('/api/auth/register', userData);
      console.log('🟢 AuthContext: register response:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('🔴 AuthContext: register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
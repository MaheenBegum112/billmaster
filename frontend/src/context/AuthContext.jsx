import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('billmaster_token');
    const savedUser = localStorage.getItem('billmaster_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('billmaster_token');
        localStorage.removeItem('billmaster_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { token, id, name, role } = response.data;

    const userData = { id, name, email, role };
    setToken(token);
    setUser(userData);

    localStorage.setItem('billmaster_token', token);
    localStorage.setItem('billmaster_user', JSON.stringify(userData));

    return userData;
  };

  const signup = async (data) => {
    const response = await authApi.signup(data);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('billmaster_token');
    localStorage.removeItem('billmaster_user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isCashier = user?.role === 'CASHIER';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      isAdmin,
      isCashier,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

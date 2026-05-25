import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('gardenToken');
    const storedUser  = localStorage.getItem('gardenUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('gardenToken', data.token);
    localStorage.setItem('gardenUser', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    }));
    setToken(data.token);
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
    return data;
  };

  const register = async (info) => {
    const data = await authService.register(info);
    localStorage.setItem('gardenToken', data.token);
    localStorage.setItem('gardenUser', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    }));
    setToken(data.token);
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('gardenToken');
    localStorage.removeItem('gardenUser');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export default AuthContext;

import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cat_token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cat_user') || 'null');
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('cat_token', data.token);
    localStorage.setItem('cat_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await api.register(name, email, password);
    localStorage.setItem('cat_token', data.token);
    localStorage.setItem('cat_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cat_token');
    localStorage.removeItem('cat_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

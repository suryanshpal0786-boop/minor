import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, password: string, confirmPassword?: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (fullName: string, email?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('truthlens_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('truthlens_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('truthlens_token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('truthlens_user', JSON.stringify(res.data.user));
      }
    } catch {
      localStorage.removeItem('truthlens_token');
      localStorage.removeItem('truthlens_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: loggedUser } = res.data;
    localStorage.setItem('truthlens_token', newToken);
    localStorage.setItem('truthlens_user', JSON.stringify(loggedUser));
    setToken(newToken);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword?: string
  ): Promise<User> => {
    const res = await api.post('/auth/register', {
      fullName,
      email,
      password,
      confirmPassword,
    });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('truthlens_token', newToken);
    localStorage.setItem('truthlens_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('truthlens_token');
    localStorage.removeItem('truthlens_user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  const updateProfile = async (fullName: string, email?: string) => {
    const res = await api.put('/auth/profile', { fullName, email });
    if (res.data.success && res.data.user) {
      setUser((prev) => (prev ? { ...prev, ...res.data.user } : res.data.user));
      localStorage.setItem('truthlens_user', JSON.stringify({ ...user, ...res.data.user }));
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

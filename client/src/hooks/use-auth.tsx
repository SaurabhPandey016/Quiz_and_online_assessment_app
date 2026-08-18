'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from '@/types/api.types';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (payload: Record<string, string>) => Promise<User>;
  register: (payload: Record<string, string>) => Promise<User>;
  logout: (redirectPath?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    if (initialCheckDone.current) return;

    async function checkSession() {
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data.status === 'success') {
          setUser(res.data.data.user);
        }
      } catch {
        // Not logged in or error - either way, no user session
        setUser(null);
      } finally {
        initialCheckDone.current = true;
        setLoading(false);
      }
    }
    
    checkSession();
  }, []);

  const login = async (payload: Record<string, string>): Promise<User> => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', payload);
      const userData: User = res.data.data.user;
      setUser(userData);
      return userData;
    } catch (error: any) {
      setUser(null);
      throw new Error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: Record<string, string>): Promise<User> => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', payload);
      const userData: User = res.data.data.user;
      setUser(null);
      return userData;
    } catch (error: any) {
      setUser(null);
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirectPath = '/login') => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Logout endpoint error is OK - user is still logged out locally
    } finally {
      setUser(null);
      window.location.href = redirectPath;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

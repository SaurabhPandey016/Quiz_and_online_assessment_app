'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from '@/types/api.types';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (payload: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use a reference pointer to guarantee this check only ever triggers ONCE on page boot
  const initialCheckDone = useRef(false);

  useEffect(() => {
    // If the check has already run once, stop immediately. Prevent login page interference.
    if (initialCheckDone.current) return;

    async function checkSession() {
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data.status === 'success') {
          setUser(res.data.data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        initialCheckDone.current = true; // Mark checking phase as absolute dead/complete
        setLoading(false);
      }
    }
    
    checkSession();
  }, []);

  const login = async (payload: Record<string, string>) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', payload);
      setUser(res.data.data.user);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn("Logout endpoint bypassed.");
    } finally {
      setUser(null);
      // Clean reload to login page resets all state reference markers
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be nested within an explicit AuthProvider container');
  return context;
}

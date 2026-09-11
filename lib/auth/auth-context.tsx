'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/auth';
import { PREDEFINED_USERS } from './mock-users';

const AuthContext = createContext<AuthState | undefined>(undefined);

const AUTH_STORAGE_KEY = 'msme_auth_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email && parsed.role) {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.warn('Could not read auth session from storage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const matched = PREDEFINED_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === cleanPassword
    );

    if (!matched) {
      return {
        success: false,
        error: 'Invalid credentials. Please verify your corporate email and password.',
      };
    }

    const authUser: User = {
      id: matched.id,
      email: matched.email,
      name: matched.name,
      role: matched.role,
      designation: matched.designation,
      branch: matched.branch,
    };

    setUser(authUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    } catch (err) {
      console.warn('Failed to save session:', err);
    }

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear session:', err);
    }
  }, []);

  const value: AuthState = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}

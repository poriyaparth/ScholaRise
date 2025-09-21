
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { mockUsers, User } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (role: 'student' | 'admin') => void;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking for a logged-in user from a session
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isStudentPage = pathname.startsWith('/student');
    const isAdminPage = pathname.startsWith('/admin');

    if (!user) {
      if (isStudentPage || isAdminPage) {
        router.push('/login');
      }
    } else {
      if (isAuthPage) {
        if (user.role === 'student') router.push('/student/dashboard');
        if (user.role === 'admin') router.push('/admin/dashboard');
      }
      if (user.role === 'student' && isAdminPage) {
        router.push('/student/dashboard');
      }
      if (user.role === 'admin' && isStudentPage) {
        router.push('/admin/dashboard');
      }
    }
  }, [user, pathname, router, loading]);

  const login = (role: 'student' | 'admin') => {
    const userToLogin = mockUsers[role];
    setUser(userToLogin);
    sessionStorage.setItem('user', JSON.stringify(userToLogin));
    if (role === 'student') {
      router.push('/student/dashboard');
    } else {
      router.push('/admin/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/');
  };

  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const value = { user, login, logout, updateUserProfile, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

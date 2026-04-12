'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiClient.getMe();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      if (response.success) {
        setUser(response.data.user);
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    router.push('/admin/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
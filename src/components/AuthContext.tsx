// components/AuthContext.tsx
'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from './api'; // same api instance you used in RN

// Define interfaces for your data
interface UserProfile {
  profile_type?: string;
  is_subscribed?: boolean;
  // Add other user properties as needed
}

interface ProfileData {
  user?: UserProfile;
  notificationCount?: number;
  // Add other profile properties as needed
}

interface AuthContextType {
  authToken: string | null;
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
  notificationCount: number;
  isSubscribed: boolean;
  isInstitution: boolean;
  isAuthenticated: boolean;
  saveToken: (token: string) => Promise<void>;
  logout: () => void;
  fetchProfileData: () => Promise<void>;
  updateNotificationCount: (count: number) => void;
  updateSubscriptionStatus: (status: boolean) => void;
}

// Create context with proper typing
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isInstitution, setIsInstitution] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch profile
  const fetchProfileData = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const response = await api.get('/profile', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setProfileData(response.data);
      setIsInstitution(response.data.user?.profile_type === 'institution');
      setIsSubscribed(response.data.user?.is_subscribed || false);
      setNotificationCount(response.data.notificationCount || 0);
      setError(null);
    } catch (e: any) {
      console.error('Failed to fetch profile data', e);
      setError('Failed to fetch profile data');
      if (e.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Load token from cookies on mount
  useEffect(() => {
    const savedToken = Cookies.get('authToken');
    if (savedToken) {
      setAuthToken(savedToken);
    }
    setLoading(false);
  }, []);

  // Save token to cookies
  const saveToken = async (token: string) => {
    try {
      Cookies.set('authToken', token, { expires: 7 });
      setAuthToken(token);
      await fetchProfileData();
    } catch (e: any) {
      console.error('Failed to save token', e);
      setError('Failed to save token');
    }
  };

  // Logout
  const logout = () => {
    Cookies.remove('authToken');
    setAuthToken(null);
    setProfileData(null);
    setNotificationCount(0);
    setIsInstitution(false);
    setIsSubscribed(false);
  };

  // Helpers
  const updateNotificationCount = (count: number) => {
    setNotificationCount(count);
  };

  const updateSubscriptionStatus = (status: boolean) => {
    setIsSubscribed(status);
    if (profileData) {
      setProfileData({
        ...profileData,
        user: {
          ...profileData.user,
          is_subscribed: status,
        },
      });
    }
  };

  // Refetch profile when token changes
  useEffect(() => {
    if (authToken) {
      fetchProfileData();
    }
  }, [authToken, fetchProfileData]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        profileData,
        loading,
        error,
        notificationCount,
        isSubscribed,
        isInstitution,
        isAuthenticated: !!authToken,
        saveToken,
        logout,
        fetchProfileData,
        updateNotificationCount,
        updateSubscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
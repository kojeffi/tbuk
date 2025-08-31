'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import api from './api'; // same api instance you used in RN

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    } catch (e) {
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
  const saveToken = async (token) => {
    try {
      Cookies.set('authToken', token, { expires: 7 });
      setAuthToken(token);
      await fetchProfileData();
    } catch (e) {
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
  const updateNotificationCount = (count) => {
    setNotificationCount(count);
  };

  const updateSubscriptionStatus = (status) => {
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

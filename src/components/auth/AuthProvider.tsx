'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { loginSuccess, logout } from '@/store/slices/authSlice';
import { useGetProfileQuery } from '@/store/services/authApi';
import Cookies from 'js-cookie';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    const accessToken = Cookies.get('accessToken');
    setToken(accessToken || null);
    console.log('🔐 AuthProvider - Token found:', !!accessToken);
    console.log('🔐 AuthProvider - Redux auth state:', { isAuthenticated, hasUser: !!user });
  }, [isAuthenticated, user]);

  // Only fetch profile if we have token but no user in Redux
  const shouldFetchProfile = isClient && token && !isAuthenticated;

  const { 
    data: profileData, 
    isSuccess, 
    isLoading, 
    error,
    isError 
  } = useGetProfileQuery(undefined, {
    skip: !shouldFetchProfile,
  });

  console.log('🔐 AuthProvider - Profile query:', { 
    shouldFetchProfile,
    isLoading,
    isSuccess,
    isError,
    error
  });

  // Handle authentication logic
  useEffect(() => {
    if (!isClient) return;

    // Case 1: Have token and successful profile fetch
    if (token && isSuccess && profileData?.success) {
      console.log('🔐 ✅ Setting user from API:', profileData.data);
      dispatch(loginSuccess(profileData.data));
    } 
    // Case 2: Have token but API failed with auth error
    else if (token && isError && error && 'status' in error && (error.status === 401 || error.status === 403)) {
      console.log('🔐 ❌ Token expired, logging out');
      Cookies.remove('accessToken');
      dispatch(logout());
      setToken(null);
    } 
    // Case 3: No token but have Redux auth state (inconsistent state)
    else if (!token && isAuthenticated) {
      console.log('🔐 🔄 No token but auth state exists, clearing auth');
      dispatch(logout());
    }
    // Case 4: Have token and Redis auth state (normal case)
    else if (token && isAuthenticated) {
      console.log('🔐 ✅ Using persisted auth state');
    }
    // Case 5: No token and no auth state (logged out)
    else if (!token && !isAuthenticated) {
      console.log('🔐 ℹ️ User is logged out');
    }
  }, [token, isSuccess, isError, profileData, dispatch, isClient, error, isAuthenticated]);

  // Show loading only when fetching profile
  if (shouldFetchProfile && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
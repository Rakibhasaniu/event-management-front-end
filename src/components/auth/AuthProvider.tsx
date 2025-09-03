'use client';

import { useEffect, ReactNode } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginSuccess } from '@/store/slices/authSlice';
import { useGetProfileQuery } from '@/store/services/authApi';
import Cookies from 'js-cookie';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const token = typeof window !== 'undefined' ? Cookies.get('accessToken') : null;
  
  console.log('🔐 AuthProvider - Token found:', !!token);
  
  const { data: profileData, isSuccess, isLoading, error } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  console.log('🔐 AuthProvider - Profile query:', { 
    data: profileData, 
    isSuccess, 
    isLoading, 
    error 
  });

  useEffect(() => {
    if (isSuccess && profileData?.success) {
      console.log('🔐 AuthProvider - Setting user in Redux:', profileData.data);
      dispatch(loginSuccess(profileData.data));
    }
  }, [isSuccess, profileData, dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
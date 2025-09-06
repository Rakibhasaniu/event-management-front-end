// store/services/authApi.ts
import { ApiErrorResponse, ApiResponse, AuthResponse } from '@/theme/types/auth';
import { User } from '@/theme/types/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: 'admin' | 'user';
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
    dateOfBirth?: string;
  };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'https://ggg-topaz.vercel.app'}/api/v1`,
    prepareHeaders: (headers) => {
      const token = Cookies.get('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth', 'Profile'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'Profile'],
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => {
        return response.data;
      },
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'Profile'],
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => {
        return response.data;
      },
    }),
    
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),
    
    // Profile endpoints
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => '/users/profile',
      providesTags: ['Profile'],
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => {
        return response.data;
      },
    }),
    
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => {
        return response.data;
      },
    }),
    
    changePassword: builder.mutation<ApiResponse<void>, { oldPassword: string; newPassword: string }>({
      query: (passwordData) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
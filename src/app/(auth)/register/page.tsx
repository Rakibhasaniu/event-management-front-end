/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterMutation } from '@/store/services/authApi';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginSuccess } from '@/store/slices/authSlice';
import { addNotification } from '@/store/slices/uiSlice';
import Cookies from 'js-cookie';

// Updated schema to match backend validation
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerMutation, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Transform data to match backend expectations
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        // Only include profile if firstName or lastName is provided
        ...(data.firstName || data.lastName ? {
          profile: {
            firstName: data.firstName,
            lastName: data.lastName,
          }
        } : {})
      };
      const result = await registerMutation(registerData).unwrap();
      
      if (result.success) {
        // Backend now automatically logs in user after registration
        // Store access token and user data
        Cookies.set('accessToken', result.data.accessToken);
        
        const userData = result.data.user;
        dispatch(loginSuccess(userData));
        Cookies.set('user', JSON.stringify(userData));
        
        dispatch(addNotification({
          type: 'success',
          message: 'Registration successful! You are now logged in.',
        }));
        
        // Redirect based on role or to dashboard
        if (userData.role === 'admin') {
          router.push('/');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      dispatch(addNotification({
        type: 'error',
        message: err.data?.message || 'Registration failed',
      }));
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(error as any)?.data?.message || 'Registration failed'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 ,mb:2}}>
            <div className="flex flex-col gap-4">
              {/* Required Name Field */}
              <TextField
                {...register('name')}
                fullWidth
                label="Full Name *"
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder="e.g., John Doe"
              />
              
              {/* Optional Profile Fields */}
             
              
              {/* Required Email Field */}
              <TextField
                {...register('email')}
                fullWidth
                label="Email *"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="e.g., john@example.com"
                autoComplete="email"
              />
              
              {/* Required Password Field */}
              <TextField
                {...register('password')}
                fullWidth
                type="password"
                label="Password *"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="new-password"
              />
              
             
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>

          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Button variant="text" onClick={() => router.push('/login')}>
              Login here
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
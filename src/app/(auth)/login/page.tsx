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
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { useLoginMutation } from '@/store/services/authApi';
import { loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { addNotification } from '@/store/slices/uiSlice';
import Cookies from 'js-cookie';

// Updated schema to match backend validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [loginMutation] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation(data).unwrap();
      if (result.success) {
        Cookies.set('accessToken', result.data.accessToken);
        const userData = result.data.user;

        dispatch(loginSuccess(userData));
        Cookies.set('user', JSON.stringify(userData));
        
        dispatch(addNotification({
          type: 'success',
          message: 'Login successful!',
        }));
        
        // Redirect based on role or to dashboard
        if (userData.role === 'admin') {
          router.push('/');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      const errorMessage = err.data?.message || 'Login failed';
      
      dispatch(loginFailure(errorMessage));
      dispatch(addNotification({
        type: 'error',
        message: errorMessage,
      }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              placeholder="e.g., rakib@gmail.com"
              autoComplete="email"
            />
            <TextField
              {...register('password')}
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>

          <Typography variant="body2" align="center">
            Don&apost have an account?{' '}
            <Button variant="text" onClick={() => router.push('/register')}>
              Register here
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
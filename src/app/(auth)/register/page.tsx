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
import { addNotification } from '@/store/slices/uiSlice';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
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
      const registerData = {
        email: data.email,
        password: data.password,
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      };

      console.log('🚀 Attempting registration with data:', registerData);
      const result = await registerMutation(registerData).unwrap();
      console.log('✅ Registration result:', result);
      
      if (result.success) {
        dispatch(addNotification({
          type: 'success',
          message: 'Registration successful! Please login.',
        }));
        router.push('/login');
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

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            {/* Using Flex Layout instead of Grid */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <TextField
                  {...register('firstName')}
                  fullWidth
                  label="First Name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
                <TextField
                  {...register('lastName')}
                  fullWidth
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </div>
              
              <TextField
                {...register('email')}
                fullWidth
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              
              <TextField
                {...register('password')}
                fullWidth
                type="password"
                label="Password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              
              <TextField
                {...register('phone')}
                fullWidth
                label="Phone (Optional)"
                error={!!errors.phone}
                helperText={errors.phone?.message}
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
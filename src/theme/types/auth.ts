import { User } from "./user";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorSources?: Array<{
    path: string;
    message: string;
  }>;
  stack?: string;
}

// Auth Response Types
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    needsPasswordChange: boolean;
    user: User;
  };
}
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  needsPasswordChange: boolean; 
}
export interface JWTPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}
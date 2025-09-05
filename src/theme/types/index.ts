
import { Event } from "./event";
import { User } from "./user";


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string; 
  email: string;
  password: string;
  role?: 'admin' | 'user'; 
  phone?: string; 
  address?: string; 
  profile?: { 
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
    dateOfBirth?: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
    dateOfBirth?: string;
  };
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  loading: {
    global: boolean;
    auth: boolean;
    events: boolean;
  };
}


export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  autoClose?: boolean;
  duration?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams {
  search?: string;
  category?: string;
  status?: string;
  role?: string;
}

export interface QueryParams extends PaginationParams, SearchParams {
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface UserManagementData {
  status: 'active' | 'blocked';
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  activeUsers: number;
  upcomingEvents: number;
  recentRegistrations: User[];
  popularEvents: Event[];
}

export interface EventStats {
  totalAttendees: number;
  rsvpBreakdown: {
    attending: number;
    maybe: number;
    not_attending: number;
  };
  attendeeGrowth: Array<{
    date: string;
    count: number;
  }>;
}

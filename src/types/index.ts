// User Types

import { Event } from "./event";
import { User } from "./user";



// Form Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string; // Required name field
  email: string;
  password: string;
  role?: 'admin' | 'user'; // Made optional with specific types
  phone?: string; // Added optional phone
  address?: string; // Added optional address
  profile?: { // Made profile optional
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

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Conference' | 'Workshop' | 'Meetup' | 'Seminar' | 'Other';
  maxAttendees?: number;
  isPublic?: boolean;
  tags?: string[];
  imageUrl?: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  category?: 'Conference' | 'Workshop' | 'Meetup' | 'Seminar' | 'Other';
  maxAttendees?: number;
  isPublic?: boolean;
  tags?: string[];
  imageUrl?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

// Redux State Types

export interface EventState {
  events: Event[];
  userEvents: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  filters: EventFilters;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface EventFilters {
  searchTerm: string;
  category: string;
  status: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  tags?: string[];
  page: number;
  limit: number;
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

// Utility Types
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

// Admin specific types
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

// Event management types
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

// User Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Conference' | 'Workshop' | 'Meetup' | 'Seminar' | 'Other';
  createdBy: string;
  attendees: Attendee[];
  maxAttendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendee {
  userId: string;
  rsvpStatus: 'attending' | 'maybe' | 'not_attending';
  rsvpDate: string;
}

// API Response Types
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

// Form Types
export interface LoginCredentials {
  id: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxAttendees?: number;
  isPublic?: boolean;
  tags?: string[];
  imageUrl?: string;
}

// Redux State Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

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
  page: number;
  limit: number;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "./user";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Conference' | 'Workshop' | 'Meetup' | 'Seminar' | 'Other';
  attendees: any;
  maxAttendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
   createdBy?: {
    id: string;
    name?: string;
    email?: string;
  };
}

export interface Attendee {
  userId: string;
  rsvpStatus: 'attending' | 'maybe' | 'not_attending';
  rsvpDate: string;
  userDetails?: User;
}

export interface EditEventModalProps {
  open: boolean;
  eventId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export type EventCategory = 'Conference' | 'Workshop' | 'Meetup' | 'Seminar' | 'Other';
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


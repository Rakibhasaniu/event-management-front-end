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

export interface EditEventModalProps {
  open: boolean;
  eventId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export type EventCategory = 'Conference' | 'Workshop' | 'Meetup' | 'Seminar' | 'Other';

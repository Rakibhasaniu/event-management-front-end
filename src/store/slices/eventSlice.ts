/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, EventFilters, EventState } from '@/theme/types/event';

const initialState: EventState = {
  events: [],
  userEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    category: 'AllCategory',
    status: 'allstatus',
    page: 1,
    limit: 9,
  },
  meta: {
    page: 1,
    limit: 9,
    total: 0,
    totalPage: 0,
  },
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setEvents: (state, action: PayloadAction<{ events: Event[]; meta: any }>) => {
      state.events = action.payload.events;
      state.meta = action.payload.meta;
      state.loading = false;
      state.error = null;
    },
    setUserEvents: (state, action: PayloadAction<{ events: Event[]; meta: any }>) => {
      state.userEvents = action.payload.events;
      state.loading = false;
      state.error = null;
    },
    setCurrentEvent: (state, action: PayloadAction<Event | null>) => {
      state.currentEvent = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.unshift(action.payload);
      state.userEvents.unshift(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
      const userIndex = state.userEvents.findIndex(event => event.id === action.payload.id);
      if (userIndex !== -1) {
        state.userEvents[userIndex] = action.payload;
      }
      if (state.currentEvent?.id === action.payload.id) {
        state.currentEvent = action.payload;
      }
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      state.userEvents = state.userEvents.filter(event => event.id !== action.payload);
      if (state.currentEvent?.id === action.payload) {
        state.currentEvent = null;
      }
    },
    updateFilters: (state, action: PayloadAction<Partial<EventFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateEventRSVP: (state, action: PayloadAction<{ eventId: string; attendees: any[] }>) => {
      const { eventId, attendees } = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === eventId);
      if (eventIndex !== -1) {
        state.events[eventIndex].attendees = attendees;
      }
      if (state.currentEvent?.id === eventId) {
        state.currentEvent.attendees = attendees;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setEvents,
  setUserEvents,
  setCurrentEvent,
  addEvent,
  updateEvent,
  removeEvent,
  updateFilters,
  resetFilters,
  updateEventRSVP,
} = eventSlice.actions;

export default eventSlice.reducer;
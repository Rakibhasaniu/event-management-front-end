import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Notification } from '@/theme/types';

const initialState: UIState = {
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  loading: {
    global: false,
    auth: false,
    events: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLoading: (state, action: PayloadAction<{ key: 'global' | 'auth' | 'events'; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.auth = action.payload;
    },
    setEventsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.events = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setLoading,
  setGlobalLoading,
  setAuthLoading,
  setEventsLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
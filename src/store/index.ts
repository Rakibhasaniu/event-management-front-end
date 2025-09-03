/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSlice from './slices/authSlice';
import eventSlice from './slices/eventSlice';
import uiSlice from './slices/uiSlice';
import { authApi } from './services/authApi';
import { eventApi } from './services/eventApi';

// Custom middleware to log all actions
const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.log('🎬 Action dispatched:', action.type);
  console.log('🎬 Action payload:', action.payload);
  console.log('🎬 State before:', store.getState());
  
  const result = next(action);
  
  console.log('🎬 State after:', store.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventSlice,
    ui: uiSlice,
    [authApi.reducerPath]: authApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(authApi.middleware)
      .concat(eventApi.middleware)
      .concat(loggerMiddleware), // Add logger middleware
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
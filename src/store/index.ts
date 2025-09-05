/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import eventSlice from './slices/eventSlice';
import uiSlice from './slices/uiSlice';
import { authApi } from './services/authApi';
import { eventApi } from './services/eventApi';

// Custom middleware to log all actions
const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  return result;
};

// Persist config - only persist auth and events, not UI state
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'events'], // Only persist these slices
  blacklist: ['ui', authApi.reducerPath, eventApi.reducerPath], // Don't persist UI and API cache
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  events: eventSlice,
  ui: uiSlice,
  [authApi.reducerPath]: authApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'persist/PERSIST',
          'persist/REHYDRATE'
        ],
      },
    })
      .concat(authApi.middleware)
      .concat(eventApi.middleware)
      .concat(loggerMiddleware),
});

setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
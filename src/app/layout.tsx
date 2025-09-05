'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';
import { store, persistor } from '@/store';
import { theme } from '@/theme/theme';
import AuthProvider from '@/components/auth/AuthProvider';
import Navbar from '@/components/layout/Navbar';

const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={<LoadingComponent />} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthProvider>
                <Navbar />
                {children}
                <Toaster position="top-right" />
              </AuthProvider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
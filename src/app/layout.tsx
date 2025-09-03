'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { theme } from '@/theme/theme';
import AuthProvider from '@/components/auth/AuthProvider';
import Navbar from '@/components/layout/Navbar';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
              <CssBaseline />
              <AuthProvider>
                <Navbar />
                {children}
                <Toaster position="top-right" />
              </AuthProvider>
            {/* </LocalizationProvider> */}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
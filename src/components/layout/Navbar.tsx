'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Badge,
} from '@mui/material';
import {
  Event as EventIcon,
  AccountCircle,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Notifications,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';

const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { notifications } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    router.push('/');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <EventIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Event Manager
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => router.push('/')}
            startIcon={<DashboardIcon />}
          >
            Events
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={() => router.push('/events/create')}
                startIcon={<AddIcon />}
              >
                Create Event
              </Button>
              <Button
                color="inherit"
                onClick={() => router.push('/events/my-events')}
              >
                My Events
              </Button>
              
              <IconButton color="inherit">
                <Badge badgeContent={notifications.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {user?.role === 'admin' && (
                  <Chip label="Admin" color="secondary" size="small" />
                )}
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user?.profile?.firstName?.[0] || <AccountCircle />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { router.push('/profile'); handleClose(); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => router.push('/register')}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
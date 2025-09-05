'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Event as EventIcon,
  AccountCircle,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Notifications,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';

const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { notifications } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const handleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  // Mobile menu content
  const mobileMenu = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItemButton>
        </ListItem>

        {isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/events/create')}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Event" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/my-events')}>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="My Events" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/profile')}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>

            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {!isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/login')}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/register')}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <EventIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Event Manager
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
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
                    onClick={() => router.push('/my-events')}
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
                        {user?.name?.[0] || <AccountCircle />}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                     
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
          )}

          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="end"
              onClick={handleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenu}
      >
        {mobileMenu}
      </Drawer>
    </>
  );
};

export default Navbar;
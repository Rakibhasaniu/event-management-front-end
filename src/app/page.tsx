/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Fab,
  Alert,
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { useGetEventsQuery, useRsvpEventMutation } from '@/store/services/eventApi';
import { setEvents, updateFilters, updateEventRSVP } from '@/store/slices/eventSlice';
import { addNotification } from '@/store/slices/uiSlice';
import EventCard from '@/components/events/EventCard';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { events, filters, meta } = useAppSelector((state) => state.events);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const { data: eventsData, isLoading, refetch, error } = useGetEventsQuery(filters);
  const [rsvpMutation] = useRsvpEventMutation();
  console.log("🚀 ~ HomePage ~ rsvpMutation:", rsvpMutation)

  useEffect(() => {
    if (eventsData?.success) {
      dispatch(setEvents(eventsData.data));
    }
  }, [eventsData, dispatch]);

  const handleFilterChange = (key: string, value: any) => {
    dispatch(updateFilters({
      [key]: value,
      page: key !== 'page' ? 1 : value,
    }));
  };

  const handleRSVP = async (eventId: string, status: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const result = await rsvpMutation({ id: eventId, rsvpStatus: status }).unwrap();
      if (result.success) {
        dispatch(updateEventRSVP({
          eventId,
          attendees: result.data.attendees,
        }));
        dispatch(addNotification({
          type: 'success',
          message: 'RSVP updated successfully!',
        }));
        refetch();
      }
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error.data?.message || 'RSVP failed',
      }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Discover Events
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          API Error: {JSON.stringify(error)}
        </Alert>
      )}

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          alignItems: 'center' 
        }}>
          {/* Search Field */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 40%' } }}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Box>

          {/* Category Filter */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="AllCategory">All Categories</MenuItem>
                <MenuItem value="Conference">Conference</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
                <MenuItem value="Meetup">Meetup</MenuItem>
                <MenuItem value="Seminar">Seminar</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Status Filter */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="allstatus">All Status</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Events Content */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : !events || events.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search filters
          </Typography>
        </Box>
      ) : (
        <>
          {/* Events Grid using CSS Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 3,
            mb: 4
          }}>
            {events.map((event: any) => (
              <Box key={event.id}>
                <EventCard
                  event={event}
                  onRSVP={handleRSVP}
                  showActions={true}
                />
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={meta.totalPage}
                page={meta.page}
                onChange={(_, page) => handleFilterChange('page', page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      {isAuthenticated && (
        <Fab
          color="primary"
          aria-label="create event"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => router.push('/events/create')}
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
}
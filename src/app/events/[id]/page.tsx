/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  LocationOn,
  Person,
  People,
  Category,
  Edit,
  Delete,
  Share,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  useGetEventQuery,
  useDeleteEventMutation,
  useRsvpEventMutation 
} from '@/store/services/eventApi';
import { addNotification } from '@/store/slices/uiSlice';
import EditEventModal from '@/components/events/EditEventModal';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming': return 'primary';
    case 'ongoing': return 'success';
    case 'completed': return 'default';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Conference': return 'primary';
    case 'Workshop': return 'secondary';
    case 'Meetup': return 'success';
    case 'Seminar': return 'info';
    default: return 'default';
  }
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const eventId = params.id as string;
  
  // Local state
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rsvpDialog, setRsvpDialog] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('attending');
  const [editModal, setEditModal] = useState(false);

  // API hooks
  const { data: eventData, isLoading, error, refetch } = useGetEventQuery(eventId);
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [rsvpEvent, { isLoading: isRsvping }] = useRsvpEventMutation();

  const event = eventData?.data;
  const isOwner = user && event && event.createdBy?.id === user.id;
  
  // Get user's current RSVP status
  const userRsvp = event?.attendees?.find((attendee: any) => attendee.userId === user?.id);
  const currentRsvpStatus = userRsvp ? userRsvp.rsvpStatus : 'not_attending';

  const handleDeleteEvent = async () => {
    try {
      const result = await deleteEvent(eventId).unwrap();
      
      if (result.success) {
        dispatch(addNotification({
          type: 'success',
          message: 'Event deleted successfully!',
        }));
        router.push('/my-events');
      }
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error.data?.message || 'Failed to delete event',
      }));
    }
    setDeleteDialog(false);
  };

  const handleRsvp = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const result = await rsvpEvent({
        id: eventId,
        rsvpStatus,
      }).unwrap();

      if (result.success) {
        dispatch(addNotification({
          type: 'success',
          message: `RSVP updated to ${rsvpStatus}!`,
        }));
        refetch();
      }
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error.data?.message || 'Failed to update RSVP',
      }));
    }
    setRsvpDialog(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        });
      } catch (error) {
        
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      dispatch(addNotification({
        type: 'success',
        message: 'Event link copied to clipboard!',
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>
        
        <Alert severity="error">
          {error ? 'Failed to load event details' : 'Event not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Events
      </Button>

      {/* Main Layout using Box with flexbox */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4 
      }}>
        {/* Main Event Details - 8/12 width equivalent */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 0%' } }}>
          <Card sx={{ mb: 3 }}>
            {event.imageUrl && (
              <Box
                component="img"
                src={event.imageUrl}
                alt={event.title}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                }}
              />
            )}
            
            <CardContent>
              {/* Header with Title and Status */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                mb: 2,
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {event.title}
                </Typography>
                <Chip
                  label={event.status}
                  color={getStatusColor(event.status)}
                  variant="filled"
                />
              </Box>

              {/* Event Meta Information */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap', 
                gap: 2, 
                mb: 3 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(event.date)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category color="action" />
                  <Chip
                    label={event.category}
                    color={getCategoryColor(event.category)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Description */}
              <Typography variant="h6" gutterBottom>
                About This Event
              </Typography>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {event.tags.map((tag: string, index: number) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar - 4/12 width equivalent */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0%' } }}>
          {/* Action Buttons */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              
              {isOwner ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditModal(true)}
                    fullWidth
                  >
                    Edit Event
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialog(true)}
                    fullWidth
                  >
                    Delete Event
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {event.isPublic && (
                    <Button
                      variant="contained"
                      color={currentRsvpStatus === 'attending' ? 'success' : 'primary'}
                      onClick={() => setRsvpDialog(true)}
                      fullWidth
                    >
                      {currentRsvpStatus === 'attending' ? 'Update RSVP' : 'RSVP to Event'}
                    </Button>
                  )}
                  
                  {currentRsvpStatus && currentRsvpStatus !== 'not_attending' && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      Your RSVP: {currentRsvpStatus}
                    </Typography>
                  )}
                </Box>
              )}
              
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShare}
                fullWidth
                sx={{ mt: 2 }}
              >
                Share Event
              </Button>
            </CardContent>
          </Card>

          {/* Event Organizer */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Organizer
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {event.createdBy?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.createdBy?.email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Attendees Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendees
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <People color="action" />
                <Typography variant="body1">
                  {event.attendees?.length || 0} attending
                  {event.maxAttendees && ` / ${event.maxAttendees} max`}
                </Typography>
              </Box>

              {event.attendees && event.attendees.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Who's going:
                  </Typography>
                  {event.attendees.slice(0, 5).map((attendee: any, index: number) => {
                    // Fallback display since userDetails is missing from GET API
                    const userName = attendee.userDetails?.name || `User ${attendee.userId.split('-')[1]}`;
                    const userInitial = userName.charAt(0).toUpperCase();
                    
                    return (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {userInitial}
                        </Avatar>
                        <Typography variant="body2">
                          {userName}
                        </Typography>
                        <Chip
                          label={attendee.rsvpStatus}
                          size="small"
                          color={attendee.rsvpStatus === 'attending' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    );
                  })}
                  
                  {event.attendees.length > 5 && (
                    <Typography variant="body2" color="text.secondary">
                      +{event.attendees.length - 5} more
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Edit Event Modal */}
      <EditEventModal
        open={editModal}
        eventId={eventId}
        onClose={() => setEditModal(false)}
        onSuccess={() => {
          setEditModal(false);
          refetch();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{event.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteEvent}
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* RSVP Dialog */}
      <Dialog open={rsvpDialog} onClose={() => setRsvpDialog(false)}>
        <DialogTitle>RSVP to Event</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Please select your attendance status for "{event.title}":
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>RSVP Status</InputLabel>
            <Select
              value={rsvpStatus}
              label="RSVP Status"
              onChange={(e) => setRsvpStatus(e.target.value)}
            >
              <MenuItem value="attending">Attending</MenuItem>
              <MenuItem value="maybe">Maybe</MenuItem>
              <MenuItem value="not_attending">Not Attending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRsvpDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRsvp}
            variant="contained"
            disabled={isRsvping}
          >
            {isRsvping ? <CircularProgress size={20} /> : 'Update RSVP'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
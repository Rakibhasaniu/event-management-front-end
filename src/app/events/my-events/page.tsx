/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Search, Add, Edit, Delete, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  useGetUserEventsQuery,
  useDeleteEventMutation 
} from '@/store/services/eventApi';
import { addNotification } from '@/store/slices/uiSlice';
import { setUserEvents } from '@/store/slices/eventSlice';
import EventCard from '@/components/events/EventCard';
import EditEventModal from '@/components/events/EditEventModal';

export default function MyEventsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { userEvents } = useAppSelector((state) => state.events);
  
  // Local state for filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'allstatus',
    page: 1,
    limit: 6,
  });

  // Edit modal state
  const [editModal, setEditModal] = useState({
    open: false,
    eventId: '',
  });

  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    eventId: '',
    eventTitle: '',
  });

  // API hooks
  const { data: eventsData, isLoading, refetch, error } = useGetUserEventsQuery(filters);
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  // Update Redux store when data changes
  useEffect(() => {
    if (eventsData?.success && eventsData.data) {
      dispatch(setUserEvents(eventsData?.data));
    }
  }, [eventsData, dispatch]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value,
    }));
  };

  const handleEditEvent = (eventId: string) => {
    setEditModal({
      open: true,
      eventId,
    });
  };

  // Add these missing functions:
  const handleEditModalClose = () => {
    setEditModal({
      open: false,
      eventId: '',
    });
  };

  const handleEditSuccess = () => {
    refetch(); // Refresh the events list after successful edit
    handleEditModalClose();
  };

  const handleDeleteClick = (eventId: string, eventTitle: string) => {
    setDeleteDialog({
      open: true,
      eventId,
      eventTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteEvent(deleteDialog.eventId).unwrap();
      
      if (result.success) {
        dispatch(addNotification({
          type: 'success',
          message: 'Event deleted successfully!',
        }));
        refetch();
      }
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error.data?.message || 'Failed to delete event',
      }));
    } finally {
      setDeleteDialog({ open: false, eventId: '', eventTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, eventId: '', eventTitle: '' });
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Get events and meta from API response
  const events = eventsData?.data?.events || [];
  const meta = eventsData?.data?.meta;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom align="center">
          My Events
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary">
          Manage events you&aposve created
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load events: {JSON.stringify(error)}
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
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
            <TextField
              fullWidth
              placeholder="Search my events..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Box>

          {/* Status Filter */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
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

          {/* Items per page */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
            <FormControl fullWidth>
              <InputLabel>Per Page</InputLabel>
              <Select
                value={filters.limit}
                label="Per Page"
                onChange={(e) => handleFilterChange('limit', e.target.value)}
              >
                <MenuItem value={6}>6 per page</MenuItem>
                <MenuItem value={12}>12 per page</MenuItem>
                <MenuItem value={24}>24 per page</MenuItem>
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
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filters.searchTerm || filters.status !== 'allstatus' 
              ? 'Try adjusting your search filters' 
              : 'You haven\'t created any events yet'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/events/create')}
          >
            Create Your First Event
          </Button>
        </Box>
      ) : (
        <>
          {/* Events Grid */}
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
              <Box key={event.id} sx={{ position: 'relative' }}>
                <EventCard
                  event={event}
                  onRSVP={() => {}} // Not applicable for own events
                  showActions={false} // Don't show RSVP actions
                />
                
                {/* Action buttons overlay */}
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1,
                }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => handleEditEvent(event.id)}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteClick(event.id, event.title)}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    Delete
                  </Button>
                </Box>
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
      <Fab
        color="primary"
        aria-label="create event"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => router.push('/events/create')}
      >
        <Add />
      </Fab>

      {/* Edit Event Modal */}
      <EditEventModal
        open={editModal.open}
        eventId={editModal.eventId}
        onClose={handleEditModalClose}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Event
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete &quot{deleteDialog.eventTitle}&quot? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
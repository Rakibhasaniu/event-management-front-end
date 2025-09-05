/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  useGetEventQuery,
  useUpdateEventMutation 
} from '@/store/services/eventApi';
import { addNotification } from '@/store/slices/uiSlice';
import { EditEventModalProps, EventCategory } from '@/theme/types/event';




const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  eventId,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  
  const { data: eventData, isLoading: isLoadingEvent, error: eventError } = useGetEventQuery(eventId, {
    skip: !eventId || !open
  });
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Conference' as EventCategory,
    maxAttendees: '',
    isPublic: true,
    tags: [] as string[],
    imageUrl: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Conference',
        maxAttendees: '',
        isPublic: true,
        tags: [],
        imageUrl: '',
      });
      setErrors({});
      setTagInput('');
    }
  }, [open]);

  // Populate form when event data loads
  useEffect(() => {
    if (eventData?.success && eventData.data && open) {
      const event = eventData.data;
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        category: event.category || 'Conference',
        maxAttendees: event.maxAttendees ? event.maxAttendees.toString() : '',
        isPublic: event.isPublic ?? true,
        tags: event.tags || [],
        imageUrl: event.imageUrl || '',
      });
    }
  }, [eventData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Category is required';

    // Validate date is in the future
    if (formData.date) {
      const eventDate = new Date(formData.date);
      const now = new Date();
      if (eventDate <= now) {
        newErrors.date = 'Event date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const eventData = {
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
      };
console.log("eventData",eventData)
      const result = await updateEvent({ 
        id: eventId, 
        data: eventData 
      }).unwrap();

      if (result.success) {
        dispatch(addNotification({
          type: 'success',
          message: 'Event updated successfully!',
        }));
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Failed to update event';
      dispatch(addNotification({
        type: 'error',
        message: errorMessage,
      }));
      
      // Set form errors if available
      if (error.data?.errorSources) {
        const formErrors: Record<string, string> = {};
        error.data.errorSources.forEach((source: any) => {
          formErrors[source.path] = source.message;
        });
        setErrors(formErrors);
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle 
  sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    fontSize: '1.25rem', // Adjust font size if needed
    fontWeight: 600
  }}
>
  Edit Event
  <IconButton onClick={onClose}>
    <CloseIcon />
  </IconButton>
</DialogTitle>

      <DialogContent dividers>
        {/* Loading State */}
        {isLoadingEvent && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {eventError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load event data. Please try again.
          </Alert>
        )}

        {/* Form */}
        {!isLoadingEvent && !eventError && (
          <Box component="form" onSubmit={handleSubmit}>
            {/* Form Grid Layout */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}>
              {/* Title - Full width */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Box>

              {/* Description - Full width */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={3}
                  required
                />
              </Box>

              {/* Date - Half width on sm+ */}
              <Box>
                <TextField
                  fullWidth
                  label="Event Date & Time"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleInputChange}
                  error={!!errors.date}
                  helperText={errors.date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Box>

              {/* Location - Half width on sm+ */}
              <Box>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  error={!!errors.location}
                  helperText={errors.location}
                  required
                />
              </Box>

              {/* Category - Half width on sm+ */}
              <Box>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleSelectChange}
                    required
                  >
                    <MenuItem value="Conference">Conference</MenuItem>
                    <MenuItem value="Workshop">Workshop</MenuItem>
                    <MenuItem value="Meetup">Meetup</MenuItem>
                    <MenuItem value="Seminar">Seminar</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              {/* Max Attendees - Half width on sm+ */}
              <Box>
                <TextField
                  fullWidth
                  label="Maximum Attendees"
                  name="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 1 }
                  }}
                  helperText="Leave empty for unlimited attendees"
                />
              </Box>

              {/* Image URL - Full width */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  helperText="Optional: URL for event image"
                />
              </Box>

              {/* Public Switch - Full width */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleSwitchChange}
                    />
                  }
                  label="Public Event"
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {formData.isPublic 
                    ? 'This event will be visible to all users' 
                    : 'This event will be private (only invited users can see it)'}
                </Typography>
              </Box>

              {/* Tags - Full width */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleAddTag}>
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Press Enter or click + to add tags"
                />
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      deleteIcon={<DeleteIcon />}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          disabled={isUpdating || isLoadingEvent}
          sx={{ minWidth: 120 }}
        >
          {isUpdating ? <CircularProgress size={20} /> : 'Update Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventModal;
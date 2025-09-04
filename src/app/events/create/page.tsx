/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ArrowBack } from '@mui/icons-material';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useCreateEventMutation } from '@/store/services/eventApi';
import { addNotification } from '@/store/slices/uiSlice';
import Link from 'next/link';

const CreateEventPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Conference',
    maxAttendees: '',
    isPublic: true,
    tags: [] as string[],
    imageUrl: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

      const result = await createEvent(eventData).unwrap();

      if (result.success) {
        dispatch(addNotification({
          type: 'success',
          message: 'Event created successfully!',
        }));
        router.push('/events/my-events');
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Failed to create event';
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          component={Link}
          href="/events"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Event
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                rows={4}
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
              <Box>
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

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => router.push('/events')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Event'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateEventPage;
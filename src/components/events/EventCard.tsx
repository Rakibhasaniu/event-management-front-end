/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  Person,
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Event } from '@/types';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onRSVP?: (eventId: string, status: string) => void;
  showActions?: boolean;
  isOwner?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onRSVP,
  showActions = true,
  isOwner = false,
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    router.push(`/events/${event.id}`);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Conference: 'primary',
      Workshop: 'secondary',
      Meetup: 'success',
      Seminar: 'warning',
      Other: 'info',
    };
    return colors[category as keyof typeof colors] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'success',
      ongoing: 'warning',
      completed: 'info',
      cancelled: 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
      onClick={handleCardClick}
    >
      {event.imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={event.imageUrl}
          alt={event.title}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {event.title}
          </Typography>
          {isOwner && (
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          )}
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => { router.push(`/events/${event.id}`); handleClose(); }}>
            <Visibility sx={{ mr: 1 }} fontSize="small" />
            View
          </MenuItem>
          <MenuItem onClick={() => { onEdit?.(event); handleClose(); }}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => { onDelete?.(event.id); handleClose(); }}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
             Delete
          </MenuItem>
        </Menu>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description.length > 150
            ? `${event.description.substring(0, 150)}...`
            : event.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Schedule sx={{ mr: 1, fontSize: 18 }} color="action" />
            <Typography variant="body2">
              {format(new Date(event.date), 'MMM dd, yyyy - HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ mr: 1, fontSize: 18 }} color="action" />
            <Typography variant="body2">{event.location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, fontSize: 18 }} color="action" />
            <Typography variant="body2">
              {event.attendees?.length || 0}
              {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attendees
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={event.category}
            color={getCategoryColor(event.category) as any}
            size="small"
          />
          <Chip
            label={event.status}
            color={getStatusColor(event.status) as any}
            size="small"
            variant="outlined"
          />
          {!event.isPublic && (
            <Chip label="Private" color="warning" size="small" />
          )}
        </Box>

        {event.tags && event.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {event.tags.slice(0, 3).map((tag: string, index: number) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
            {event.tags.length > 3 && (
              <Chip label={`+${event.tags.length - 3} more`} size="small" variant="outlined" />
            )}
          </Box>
        )}
      </CardContent>

      {showActions && !isOwner && event.isPublic && event.status === 'upcoming' && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              onRSVP?.(event.id, 'attending');
            }}
          >
            RSVP
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default EventCard;
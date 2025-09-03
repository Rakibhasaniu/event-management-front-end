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
  Delete
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  status: string;
  isPublic: boolean;
  imageUrl?: string;
  attendees?: any[];
  maxAttendees?: number;
  tags?: string[];
  createdBy?: string;
}

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  isOwner?: boolean;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onRSVP?: (eventId: string, status: string) => void;
  onClick?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  showActions = false,
  isOwner = false,
  onEdit,
  onDelete,
  onRSVP,
  onClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(event.id);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(event.id);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      conference: 'primary',
      workshop: 'secondary',
      meeting: 'success',
      social: 'warning',
      other: 'info',
    };
    return colors[category.toLowerCase()] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      upcoming: 'success',
      ongoing: 'warning',
      completed: 'default',
      cancelled: 'error',
    };
    return colors[status.toLowerCase()] || 'default';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 6 } : {},
        transition: 'box-shadow 0.3s ease-in-out',
      }}
      onClick={() => onClick?.(event.id)}
    >
      {event.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={event.imageUrl}
          alt={event.title}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', flex: 1 }}>
            {event.title}
          </Typography>
          
          {showActions && isOwner && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ ml: 1 }}
            >
              <MoreVert />
            </IconButton>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleEdit}>
            <Edit sx={{ mr: 1, fontSize: 18 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <Delete sx={{ mr: 1, fontSize: 18 }} />
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
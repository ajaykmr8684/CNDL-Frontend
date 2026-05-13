import React, { useEffect, useRef } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function NotificationFeed({ notifications }) {
  const reversedNotifications = [...notifications].reverse();
  const listRef = useRef(null);
  
  // Auto-scroll to the latest notification
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [notifications]);
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        transition: 'transform 0.3s ease',
        borderTop: '3px solid',
        borderColor: 'secondary.main',
      }}
    >
      <Box sx={{ 
        p: 1, 
        px: 3,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <NotificationsIcon sx={{ color: 'secondary.main' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Latest Updates
          </Typography>
        </Box>
        
        <Chip 
          label={`${notifications.length} notifications`} 
          size="small" 
          sx={{
            backgroundColor: 'rgba(190, 24, 93, 0.1)',
            color: 'secondary.main',
            fontWeight: 500
          }}
        />
      </Box>
      
      <Box
        sx={{
          overflow: 'hidden',
          maxHeight: '64px',
          px: 3,
          pb: 1,
        }}
      >
        {reversedNotifications.length > 0 ? (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              animation: 'fadeIn 0.5s ease',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              '@keyframes fadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 }
              }
            }}
          >
            {reversedNotifications[0]}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontStyle: 'italic',
              color: 'text.secondary'
            }}
          >
            No notifications yet
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default NotificationFeed;
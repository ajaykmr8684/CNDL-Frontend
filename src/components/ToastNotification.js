import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

function ToastNotification({ notifications }) {
  const [visibleNotification, setVisibleNotification] = useState(null);
  
  // Monitor for new notifications and immediately display the latest one
  useEffect(() => {
    if (notifications.length === 0) return;
    
    // Get the latest notification
    const latestNotification = notifications[notifications.length - 1];
    
    // Create notification object with ID
    const newNotification = {
      id: `notification-${Date.now()}`,
      message: latestNotification,
      timestamp: Date.now()
    };
    
    // Set as the visible notification, replacing any existing one
    setVisibleNotification(newNotification);
    
    // Auto-dismiss after 5 seconds
    const timeoutId = setTimeout(() => {
      setVisibleNotification(null);
    }, 5000); // 5 seconds
    
    // Clean up timeout if component unmounts or new notification arrives
    return () => clearTimeout(timeoutId);
    
  }, [notifications]);
  
  // Close notification manually
  const handleClose = () => {
    setVisibleNotification(null);
  };
  
  if (!visibleNotification) return null;
  
  return (
    <Fade in={Boolean(visibleNotification)}>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 2000,
          maxWidth: '350px',
          width: 'calc(100% - 32px)',
        }}
      >
        <Alert
          severity="info"
          icon={<NotificationsIcon fontSize="inherit" />}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderLeft: '3px solid',
            borderColor: 'secondary.main',
            display: 'flex', 
            alignItems: 'center'
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {visibleNotification.message}
          </Typography>
        </Alert>
      </Box>
    </Fade>
  );
}

export default ToastNotification;
// src/components/AccessDenied.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const AccessDenied = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="80vh"
    >
      <Paper 
        elevation={3} 
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <LockIcon 
          color="error" 
          sx={{ fontSize: 60, mb: 2 }} 
        />
        
        <Typography variant="h4" gutterBottom fontWeight="bold" color="error">
          Access Denied
        </Typography>
        
        <Typography variant="body1" paragraph>
          You do not have permission to access this page. This area is restricted
          to specific IP addresses only.
        </Typography>
        
        <Typography variant="body2" paragraph color="text.secondary">
          If you believe you should have access, please contact the system administrator.
        </Typography>
        
        <Button 
          component={Link} 
          to="/live" 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          Return to Live View
        </Button>
      </Paper>
    </Box>
  );
};

export default AccessDenied;
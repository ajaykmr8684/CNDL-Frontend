// src/components/IpProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

/**
 * A component that restricts access to routes based on IP address
 * Children components are only rendered if the user's IP is in the allowlist
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const IpProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkIpAccess = async () => {
      try {
        // Call your backend endpoint that checks IP
        const response = await fetch(`${API_URL}/api/check-ip-access`);
        const data = await response.json();
        setIsAllowed(data.allowed);
        setLoading(false);
      } catch (error) {
        console.error('Error checking IP access:', error);
        setIsAllowed(false);
        setLoading(false);
      }
    };

    checkIpAccess();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return isAllowed ? children : <Navigate to="/access-denied" />;
};

export default IpProtectedRoute;

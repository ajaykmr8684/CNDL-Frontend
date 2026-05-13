import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function PageHeader({ title, subtitle, icon }) {
  return (
    <Box mb={4} mt={1}>
      <Box display="flex" alignItems="center" gap={1.5} mb={1}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundImage: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            backgroundImage: 'linear-gradient(45deg, #0f172a, #475569)',
            backgroundSize: '100%',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ 
        width: '60px',
        height: '4px',
        borderRadius: '2px',
        backgroundImage: 'linear-gradient(to right, #1e40af, #3b82f6)',
        mb: 3
      }} />
    </Box>
  );
}

export default PageHeader;
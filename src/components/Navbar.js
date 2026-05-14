import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // If your icon is in 'public/icons/my-icon.svg' for example
  // Just reference it with the path relative to the public folder
  const iconPath = 'image.png'; // Update this path to match your file location
  
  return (
    <AppBar position="static" elevation={0} sx={{ 
      backgroundColor: 'white', 
      borderBottom: 'none',
      position: 'relative',
      boxShadow: '0 1px 0 0 rgba(0,0,0,0.06), 0 2px 8px rgba(30, 64, 175, 0.07)',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '3px',
        backgroundImage: 'linear-gradient(to right, #1e40af, #3b82f6, #be185d)',
      }
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img 
              src={iconPath} 
              alt="Nokia CNPL Logo" 
              style={{ 
                height: '70px',  // Adjust size as needed
                width: 'auto',
                marginRight: '8px' 
              }} 
            />
            <Typography variant="h6" noWrap component="div" sx={{ 
              color: 'text.primary', 
              fontWeight: 700,
              backgroundImage: 'linear-gradient(45deg, #1e40af, #3b82f6)',
              backgroundSize: '100%',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              CNDL
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              component={RouterLink} 
              to="/live"
              sx={{ 
                fontWeight: isActive('/live') ? 700 : 500,
                position: 'relative',
                '&::after': isActive('/live') ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '5px',
                  left: '20%',
                  width: '60%',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: 'primary.main',
                } : {}
              }}
            >
              Live View
            </Button>
            <Button 
              component={RouterLink} 
              to="/bid"
              sx={{ 
                fontWeight: isActive('/bid') ? 700 : 500,
                position: 'relative',
                '&::after': isActive('/bid') ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '5px',
                  left: '20%',
                  width: '60%',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: 'primary.main',
                } : {}
              }}
            >
              Place Bid
            </Button>
            <Button 
              component={RouterLink} 
              to="/sold"
              sx={{ 
                fontWeight: isActive('/sold') ? 700 : 500,
                position: 'relative',
                '&::after': isActive('/sold') ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '5px',
                  left: '20%',
                  width: '60%',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: 'primary.main',
                } : {}
              }}
            >
              Admin
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;

import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItemButton, ListItemText, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GavelIcon from '@mui/icons-material/Gavel';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const iconPath = 'image.png';

  const navLinks = [
    { label: 'Live View', path: '/live' },
    { label: 'Place Bid', path: '/bid' },
    { label: 'Admin', path: '/sold' },
  ];

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
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Logo + Title */}
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img
              src={iconPath}
              alt="CNDL Logo"
              style={{ height: '48px', width: 'auto', marginRight: '8px' }}
            />
            <Typography variant="h6" noWrap component="div" sx={{
              color: 'text.primary',
              fontWeight: 700,
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              backgroundImage: 'linear-gradient(45deg, #1e40af, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Cobra League
            </Typography>
          </Box>

          {/* Desktop nav buttons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            {navLinks.map(({ label, path }) => (
              <Button
                key={path}
                component={RouterLink}
                to={path}
                sx={{
                  fontWeight: isActive(path) ? 700 : 500,
                  position: 'relative',
                  '&::after': isActive(path) ? {
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
                {label}
              </Button>
            ))}
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            sx={{ display: { xs: 'flex', sm: 'none' }, color: '#1e40af' }}
            onClick={() => setDrawerOpen(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 220 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 2 }}>
          <GavelIcon sx={{ color: '#1e40af' }} />
          <Typography fontWeight={700} sx={{ color: '#1e40af' }}>Cobra League</Typography>
        </Box>
        <Divider />
        <List>
          {navLinks.map(({ label, path }) => (
            <ListItemButton
              key={path}
              selected={isActive(path)}
              onClick={() => { navigate(path); setDrawerOpen(false); }}
              sx={{ '&.Mui-selected': { backgroundColor: 'rgba(30,64,175,0.08)', fontWeight: 700 } }}
            >
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontWeight: isActive(path) ? 700 : 500 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;

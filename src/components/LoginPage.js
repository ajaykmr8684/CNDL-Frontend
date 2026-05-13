import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, InputAdornment,
  IconButton, Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GavelIcon from '@mui/icons-material/Gavel';

const CREDENTIALS = { username: 'admin', password: 'admin@admin' };

export const isAuthenticated = () => sessionStorage.getItem('auction_auth') === 'true';

export const login = (username, password) => {
  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    sessionStorage.setItem('auction_auth', 'true');
    return true;
  }
  return false;
};

export const logout = () => sessionStorage.removeItem('auction_auth');

function LoginPage({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      onSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #eef2ff 0%, #f8fafc 45%, #f0f9ff 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 380,
          p: 4,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 20px 40px rgba(30,64,175,0.1)',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundImage: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
              mb: 2,
            }}
          >
            <GavelIcon fontSize="large" />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{
            backgroundImage: 'linear-gradient(45deg, #0f172a, #1e40af)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Nokia CNPL
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Sign in to access the auction controls
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            margin="normal"
            autoComplete="username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              py: 1.4,
              backgroundImage: 'linear-gradient(to right, #1e40af, #3b82f6)',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                backgroundImage: 'linear-gradient(to right, #1e3a8a, #2563eb)',
              },
            }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginPage;

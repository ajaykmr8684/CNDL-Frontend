import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LiveView from './pages/LiveView';
import BidView from './pages/BidView';
import SoldView from './pages/SoldView';
import { AuctionProvider } from './context/AuctionContext';
import Navbar from './components/Navbar';
import IpProtectedRoute from './components/IpProtectedRoute';
import AuthProtectedRoute from './components/AuthProtectedRoute';
import AccessDenied from './components/AccessDenied';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e40af', // deeper blue
      light: '#3b82f6',
      dark: '#1e3a8a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#be185d', // vibrant pink
      light: '#ec4899',
      dark: '#9d174d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#16a34a',
    },
    warning: {
      main: '#ea580c',
    },
    error: {
      main: '#dc2626',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(to right, #1e40af, #3b82f6)',
        },
        containedSecondary: {
          backgroundImage: 'linear-gradient(to right, #be185d, #ec4899)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1e40af',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(241, 245, 249, 0.8)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#1e293b',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#94a3b8',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuctionProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <div className="content-container" style={{ paddingTop: '5px' }}>
              <Routes>
                <Route path="/live" element={<LiveView />} />
                
                {/* IP + Auth protected routes */}
                <Route 
                  path="/bid" 
                  element={
                    <AuthProtectedRoute>
                      <IpProtectedRoute>
                        <BidView />
                      </IpProtectedRoute>
                    </AuthProtectedRoute>
                  } 
                />
                <Route 
                  path="/sold" 
                  element={
                    <AuthProtectedRoute>
                      <IpProtectedRoute>
                        <SoldView />
                      </IpProtectedRoute>
                    </AuthProtectedRoute>
                  } 
                />
                
                {/* Access denied page */}
                <Route path="/access-denied" element={<AccessDenied />} />
                
                <Route path="/" element={<Navigate to="/live" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuctionProvider>
    </ThemeProvider>
  );
}

export default App;
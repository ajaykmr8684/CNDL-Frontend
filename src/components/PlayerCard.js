import React from 'react';
import { Paper, Typography, Box, Avatar, Chip, Grid, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function PlayerCard({ 
  title, 
  player, 
  bid, 
  teams, 
  primaryColor, 
  gradientColors, 
  showBid, 
  emptyMessage 
}) {
  return (
    <Paper elevation={0} sx={{ 
      p: 3, 
      height: '100%', 
      borderRadius: 2, 
      border: '1px solid rgba(0, 0, 0, 0.08)',
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 20px -10px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '4px',
        backgroundImage: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`,
      }} />
      
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      
      {player ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {player.photoUrl ? (
              <Avatar 
                src={player.photoUrl}
                alt={player.name}
                onError={(e) => { e.target.src = ''; }}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  border: '3px solid white',
                  bgcolor: primaryColor,
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                }}
              >
                {player.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
            ) : (
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: primaryColor,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                border: '3px solid white'
              }}>
                {player.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
            )}
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                mb: 0.5, 
                fontWeight: 600,
                backgroundImage: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]})`,
                backgroundSize: '100%',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {player.name}
              </Typography>
              
              <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                <Chip 
                  label={player.playerType} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    fontWeight: 500,
                    borderRadius: '4px'
                  }}
                />
                <Chip 
                  label={`Class : ${player.tier}`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: `rgba(${player.tier === 1 ? '21, 128, 61' : player.tier === 2 ? '180, 83, 9' : '185, 28, 28'}, 0.1)`,
                    color: player.tier === 1 ? '#15803d' : player.tier === 2 ? '#b45309' : '#b91c1c',
                    fontWeight: 500,
                    borderRadius: '4px'
                  }}
                />
                {player.lastYearTeam && (
                  <Chip 
                    icon={<AccessTimeIcon fontSize="small" />}
                    label={`${player.lastYearTeam}`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      color: '#4f46e5',
                      fontWeight: 500,
                      borderRadius: '4px'
                    }}
                  />
                )}
              </Box>
              
              {player.runs !== undefined && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Career Runs:</strong> {player.runs}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Grid container spacing={2}>
            {player.battingStat && (
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 1.5, 
                  backgroundColor: 'rgba(241, 245, 249, 0.7)',
                  border: '1px solid rgba(203, 213, 225, 0.3)',
                  height: '100%'
                }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Batting
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {player.battingStat}
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {player.bowlingStat && (
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 1.5, 
                  backgroundColor: 'rgba(241, 245, 249, 0.7)',
                  border: '1px solid rgba(203, 213, 225, 0.3)',
                  height: '100%'
                }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Bowling
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {player.bowlingStat}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          
          {showBid && (
            <Box sx={{ 
              mt: 1, 
              p: 1.5, 
              borderRadius: 1.5, 
              backgroundColor: 'rgba(241, 245, 249, 0.7)',
              border: '1px solid rgba(203, 213, 225, 0.3)'
            }}>
              {bid ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Highest Bid:
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                    <Typography 
                      component="span" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'secondary.main',
                        fontSize: '1.1rem'
                      }}
                    >
                      {formatToINR(bid.amount)}
                    </Typography>
                    <Chip 
                      label={teams.find(team => team.id === bid.teamId)?.name || 'Unknown Team'} 
                      size="small"
                      sx={{ 
                        backgroundColor: 'secondary.light',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  No bids yet
                </Typography>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 120,
          backgroundColor: 'rgba(241, 245, 249, 0.5)',
          borderRadius: 2,
          border: '1px dashed rgba(0, 0, 0, 0.1)'
        }}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <PersonIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

const formatToINR = (amount) => {
  if (amount === null) return "R";
  if (amount >= 1_00_00_000) return `${(amount / 1_00_00_000).toFixed(2)} Cr`;
  if (amount >= 1_00_000) return `${(amount / 1_00_000).toFixed(2)} L`;
  return amount.toString();
};

export default PlayerCard;

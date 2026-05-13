import React from 'react';
import { 
  Box, 
  Typography, 
  Drawer, 
  Divider, 
  Avatar, 
  Chip, 
  IconButton, 
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import GavelIcon from '@mui/icons-material/Gavel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function PlayerSidePanel({ open, onClose, currentPlayer, nextPlayer, highestBid, teams }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: { xs: '85%', sm: 400 },
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: 0,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', 
        p: 2,
        backgroundColor: 'primary.main',
        color: 'white',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Auction Live View
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Current Player */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          fontWeight: 600,
          mb: 2,
          color: 'primary.main'
        }}>
          <GavelIcon />
          Current Player
        </Typography>

        {currentPlayer ? (
          <PlayerDisplay 
            player={currentPlayer} 
            bid={highestBid} 
            teams={teams} 
            primaryColor="primary.main"
            gradientColors={['#1e40af', '#3b82f6']}
            showBid={true}
          />
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
                Auction completed or not started
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Next Player */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          fontWeight: 600,
          mb: 2,
          color: 'secondary.main'
        }}>
          <AccessTimeIcon />
          Next Player
        </Typography>

        {nextPlayer ? (
          <PlayerDisplay 
            player={nextPlayer} 
            primaryColor="secondary.main"
            gradientColors={['#be185d', '#ec4899']}
            showBid={false}
          />
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
                {currentPlayer ? "Last player in auction" : "Auction completed or not started"}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

function PlayerDisplay({ player, bid, teams, primaryColor, gradientColors, showBid }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {player.photoUrl ? (
          <Avatar 
            src={player.photoUrl}
            alt={player.name}
            sx={{ 
              width: 80, 
              height: 80, 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              border: '3px solid white'
            }}
          />
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
              label={`Tier ${player.tier}`} 
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
      
      {showBid && bid && (
        <Box sx={{ 
          mt: 1, 
          p: 1.5, 
          borderRadius: 1.5, 
          backgroundColor: 'rgba(241, 245, 249, 0.7)',
          border: '1px solid rgba(203, 213, 225, 0.3)'
        }}>
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
                {bid.amount}
              </Typography>
              <Chip 
                label={teams?.find(team => team.id === bid.teamId)?.name || 'Unknown Team'} 
                size="small"
                sx={{ 
                  backgroundColor: 'secondary.light',
                  color: 'white',
                  fontWeight: 500
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default PlayerSidePanel;
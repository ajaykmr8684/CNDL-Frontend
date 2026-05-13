import React, { useState } from 'react';
import { Box, Grid, Typography, Card, Avatar, Chip, ToggleButtonGroup, ToggleButton, Divider, Badge } from '@mui/material';
import { useAuction } from '../context/AuctionContext';
import TeamTable from '../components/TeamTable';
import ToastNotification from '../components/ToastNotification';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GavelIcon from '@mui/icons-material/Gavel';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import FlagIcon from '@mui/icons-material/Flag';

// Enhanced CompactPlayerCard
function CompactPlayerCard({ player, title, primaryColor, highestBid, teams, isNextPlayer = false }) {
  if (!player) return (
    <Box sx={{
      p: 1.5,
      backgroundColor: 'rgba(241, 245, 249, 0.7)',
      borderRadius: 2,
      border: '1px dashed rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <Typography variant="body2" color="text.secondary">
        {title} not available
      </Typography>
    </Box>
  );

  const formatToINR = (amount) => {
    if (amount === null) return "R";
    if (amount >= 1_00_00_000) return `${(amount / 1_00_00_000).toFixed(2)} Cr`;
    if (amount >= 1_00_000) return `${(amount / 1_00_000).toFixed(2)} L`;
    return amount.toString();
  };
  
  // Get tier colors
  const getTierColor = (tier) => {
    switch(tier) {
      case 1: return { bg: 'rgba(16, 185, 129, 0.1)', text: '#047857', border: 'rgba(16, 185, 129, 0.3)' };
      case 2: return { bg: 'rgba(245, 158, 11, 0.1)', text: '#b45309', border: 'rgba(245, 158, 11, 0.3)' };
      case 3: return { bg: 'rgba(239, 68, 68, 0.1)', text: '#b91c1c', border: 'rgba(239, 68, 68, 0.3)' };
      default: return { bg: 'rgba(75, 85, 99, 0.1)', text: '#4b5563', border: 'rgba(75, 85, 99, 0.3)' };
    }
  };
  
  const tierColor = getTierColor(player.tier);

  // Mock nationality (since it's not in the original data)
  const nationality = "Indian"; // Default value, replace with actual data if available
  
  // Parse batting and bowling stats
  const parseBattingStats = (battingStat) => {
    if (!battingStat) return { runs: '-', average: '-', strikeRate: '-' };
    const parts = battingStat.split(',');
    return {
      runs: parts[0] || '-',
      average: parts[1] || '-',
      strikeRate: parts[2] || '-'
    };
  };
  
  const parseBowlingStats = (bowlingStat) => {
    if (!bowlingStat) return { wickets: '-', economy: '-', strikeRate: '-' };
    const parts = bowlingStat.split(',');
    return {
      wickets: parts[0] || '-',
      economy: parts[1] || '-',
      strikeRate: parts[2] || '-' 
    };
  };
  
  const battingStats = parseBattingStats(player.battingStat);
  const bowlingStats = parseBowlingStats(player.bowlingStat);

  return (
    <Card elevation={2} sx={{
      height: '100%',
      borderRadius: 2,
      overflow: 'hidden',
      borderLeft: '5px solid',
      borderColor: primaryColor,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Card Header - Now more compact */}
      <Box sx={{
        px: 1.5,
        py: 0.6, // Reduced padding
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        background: primaryColor === 'primary.main' ? 'linear-gradient(to right, #e0f2fe, #f0f9ff)' : 'linear-gradient(to right, #fef2f2, #fff1f2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {title === "Current Player" ? (
            <GavelIcon sx={{ 
              fontSize: '0.8rem', // Smaller icon
              color: '#0369a1',
              animation: 'pulse 1.5s infinite'
            }} />
          ) : (
            <AccessTimeIcon sx={{ fontSize: '0.8rem', color: '#be123c' }} />
          )}
          <Typography variant="subtitle2" sx={{
            fontWeight: 600,
            color: title === "Current Player" ? '#0369a1' : '#be123c',
            fontSize: '0.7rem', // Smaller text
            letterSpacing: '0.01em'
          }}>
            {title.toUpperCase()}
          </Typography>
        </Box>
        
        {/* Moved Class tier badge here */}
        <Chip
          label={`Class ${player.tier}`}
          size="small"
          icon={<EmojiEventsIcon style={{ fontSize: '0.65rem' }} />}
          sx={{
            height: 18, // Smaller height
            fontSize: '0.6rem', // Smaller font
            backgroundColor: tierColor.bg,
            color: tierColor.text,
            fontWeight: 600,
            border: `1px solid ${tierColor.border}`,
            '& .MuiChip-icon': {
              color: tierColor.text
            }
          }}
        />
      </Box>

      {/* Card Body */}
      <Box sx={{
        display: 'flex',
        p: 0,
        flex: 1
      }}>
        {/* Player Photo Column - Adjusted sizes */}
        <Box sx={{ 
          width: isNextPlayer ? '35%' : '60%', // Reduced width for current player 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'rgba(249, 250, 251, 0.8)',
          borderRight: '1px solid rgba(0,0,0,0.03)'
        }}>
          <Avatar
            src={player.photoUrl || ''}
            alt={player.name}
            sx={{
              width: isNextPlayer ? 120 : 280, // Significantly reduced sizes
              height: isNextPlayer ? 120 : 280, // Significantly reduced sizes
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '3px solid white',
              backgroundColor: 'rgba(0,0,0,0.04)',
              mb: 1
            }}
          >
            {!player.photoUrl && player.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          
          <Typography variant="subtitle1" sx={{
            fontWeight: 700,
            fontSize: isNextPlayer ? '0.8rem' : '0.9rem', // Smaller text
            textAlign: 'center',
            px: 1,
            color: '#111827'
          }}>
            {player.name}
          </Typography>
          
          <Box sx={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: 0.5, 
  mt: 0.2 // Reduced margin
}}>
  <img 
    src="/india-flag.svg" // Adjust filename if needed
    alt="Indian Flag" 
    style={{ 
      width: '16px', 
      height: 'auto',
      verticalAlign: 'middle'
    }} 
  />
  <Typography variant="caption" sx={{ 
    color: 'text.secondary',
    fontWeight: 500,
    fontSize: '0.65rem' // Smaller font
  }}>
    {nationality}
  </Typography>
</Box>
          
          <Chip
            label={player.playerType}
            size="small"
            sx={{
              mt: 0.8, // Reduced margin
              height: 20, // Smaller height
              fontSize: '0.65rem', // Smaller font
              backgroundColor: 'rgba(0,0,0,0.05)',
              fontWeight: 600,
              color: '#4b5563'
            }}
          />
          
          {!isNextPlayer && player.lastYearTeam && (
            <Chip
              label={`Last Year: ${player.lastYearTeam}`}
              size="small"
              sx={{
                mt: 0.8, // Reduced margin
                height: 18, // Smaller height
                fontSize: '0.6rem', // Smaller font
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                color: '#4f46e5',
                fontWeight: 500,
                border: '1px solid rgba(79, 70, 229, 0.2)'
              }}
            />
          )}
        </Box>
        
        {/* Player Details Column - Adjusted sizes */}
        <Box sx={{ 
          width: isNextPlayer ? '65%' : '60%', // Increased width for better proportion
          p: 1, // Reduced padding
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Stats Section - Simplified for Next Player */}
          {(!isNextPlayer || (isNextPlayer && (player.battingStat || player.bowlingStat))) && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ 
                color: 'text.secondary',
                fontSize: '0.7rem', // Smaller font
                mb: 0.5, // Reduced margin
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.03em'
              }}>
                Player Stats
              </Typography>
              
              <Grid container spacing={0.8}> {/* Reduced spacing */}
                {player.battingStat && (
                  <Grid item xs={6}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      p: 0.7, // Reduced padding
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      borderRadius: 1,
                      border: '1px solid rgba(37, 99, 235, 0.15)'
                    }}>
                      <Typography variant="caption" sx={{ 
                        fontSize: '0.6rem', // Smaller font
                        color: 'text.secondary',
                        mb: 0.2 // Reduced margin
                      }}>
                        Batting
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SportsCricketIcon sx={{ fontSize: '0.8rem', color: '#2563eb' }} />
                        <Typography sx={{ 
                          fontSize: '0.7rem', // Smaller font
                          fontWeight: 700, 
                          color: '#2563eb' 
                        }}>
                          {player.battingStat}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                {player.bowlingStat && (
                  <Grid item xs={6}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      p: 0.7, // Reduced padding
                      backgroundColor: 'rgba(139, 92, 246, 0.08)',
                      borderRadius: 1,
                      border: '1px solid rgba(139, 92, 246, 0.15)'
                    }}>
                      <Typography variant="caption" sx={{ 
                        fontSize: '0.6rem', // Smaller font
                        color: 'text.secondary',
                        mb: 0.2 // Reduced margin
                      }}>
                        Bowling
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SportsHandballIcon sx={{ fontSize: '0.8rem', color: '#8b5cf6' }} />
                        <Typography sx={{ 
                          fontSize: '0.7rem', // Smaller font
                          fontWeight: 700, 
                          color: '#8b5cf6' 
                        }}>
                          {player.bowlingStat}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          
          {/* Additional Player Info - Reduced for Next Player */}
          <Box sx={{ mb: 0.8 }}> {/* Reduced margin */}
            <Typography variant="subtitle2" sx={{ 
              color: 'text.secondary',
              fontSize: '0.7rem', // Smaller font
              mb: 0.5, // Reduced margin
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em'
            }}>
              Details
            </Typography>
            
            <Grid container spacing={0.3}> {/* Reduced spacing */}
              {/* Base Price - Show for both */}
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 0.5, // Reduced padding
                  display: 'flex', 
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                    Base Price
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                    {formatToINR(player.basePrice || 50_00_000)}
                  </Typography>
                </Box>
              </Grid>
              
              {/* Only show detailed stats for Current Player */}
              {!isNextPlayer && (
                <>
                  {/* Batting Stats Breakdown */}
                  {player.battingStat && (
                    <>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 0.5, // Reduced padding
                          display: 'flex', 
                          justifyContent: 'space-between',
                          borderBottom: '1px dashed rgba(0,0,0,0.1)'
                        }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            Runs
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                            {battingStats.runs}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 0.5, // Reduced padding
                          display: 'flex', 
                          justifyContent: 'space-between',
                          borderBottom: '1px dashed rgba(0,0,0,0.1)'
                        }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            Bat Avg
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                            {battingStats.average}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 0.5, // Reduced padding
                          display: 'flex', 
                          justifyContent: 'space-between',
                          borderBottom: '1px dashed rgba(0,0,0,0.1)'
                        }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            Bat SR
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                            {battingStats.strikeRate}
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                  
                  {/* Bowling Stats Breakdown */}
                  {player.bowlingStat && (
                    <>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 0.5, // Reduced padding
                          display: 'flex', 
                          justifyContent: 'space-between',
                          borderBottom: '1px dashed rgba(0,0,0,0.1)'
                        }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            Wickets
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                            {bowlingStats.wickets}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 0.5, // Reduced padding 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          borderBottom: '1px dashed rgba(0,0,0,0.1)'
                        }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            Economy
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                            {bowlingStats.economy}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 0.5, // Reduced padding
                          display: 'flex', 
                          justifyContent: 'space-between'
                        }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            Bowl SR
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                            {bowlingStats.strikeRate}
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                </>
              )}

              {/* For next player, just show player type if not shown previously */}
              {isNextPlayer && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 0.5, // Reduced padding
                    display: 'flex', 
                    justifyContent: 'space-between',
                    borderBottom: '1px dashed rgba(0,0,0,0.1)'
                  }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                      Player Type
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                      {player.playerType}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
          
          {/* Bid Information - Only for Current Player */}
          {title === "Current Player" && highestBid && (
            <Box sx={{
              mt: 'auto',
              p: 0.8, // Reduced padding
              borderRadius: 1,
              backgroundColor: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.6rem', // Smaller font
                  display: 'block'
                }}>
                  Highest Bid
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: '#92400e',
                  fontSize: '1rem', // Smaller font
                  lineHeight: 1.2
                }}>
                  {formatToINR(highestBid.amount)}
                </Typography>
              </Box>
              
              <Chip
                label={teams?.find(team => team.id === highestBid.teamId)?.name || 'Unknown'}
                size="small"
                sx={{
                  height: 22, // Smaller height
                  fontSize: '0.65rem', // Smaller font
                  backgroundColor: 'rgba(245,158,11,0.9)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
}

function LiveView() {
  const { auctionState, teams } = useAuction();
  const { currentPlayer, nextPlayer, highestBid, notifications } = auctionState;
  const [viewMode, setViewMode] = useState('compact');

  return (
    <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3, lg: 4 } }}>
      <ToastNotification notifications={notifications} />

      {/* View Toggle */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, value) => value && setViewMode(value)}
          color="primary"
          size="small"
          sx={{
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 2,
            overflow: 'hidden',
            '& .MuiToggleButton-root': {
              px: 1.5,
              py: 0.7,
              border: 'none',
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
              },
            },
          }}
        >
          <ToggleButton value="full" aria-label="Full View">
            <ViewStreamIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography sx={{ fontSize: '0.75rem', display: { xs: 'none', sm: 'block' } }}></Typography>
          </ToggleButton>
          <ToggleButton value="compact" aria-label="Compact View">
            <ViewModuleIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography sx={{ fontSize: '0.75rem', display: { xs: 'none', sm: 'block' } }}></Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'compact' ? (
        <Box sx={{ 
          display: 'flex', 
          height: 'calc(100vh - 48px)', 
          gap: 2,
          pt: 3 // Reduced top padding further
        }}>
          {/* Left 45%: Vertical Stack of Player Cards with 60-40 proportion */}
          <Box sx={{ width: '45%', height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}> {/* Reduced gap */}
            {/* Current Player - 60% of the stack */}
            <Box sx={{ flex: 6 }}>
              <CompactPlayerCard
                player={currentPlayer}
                title="Current Player"
                primaryColor="primary.main"
                highestBid={highestBid}
                teams={teams}
                isNextPlayer={false}
              />
            </Box>
            {/* Next Player - 40% of the stack */}
            <Box sx={{ flex: 4 }}>
              <CompactPlayerCard
                player={nextPlayer}
                title="Next Player"
                primaryColor="secondary.main"
                isNextPlayer={true}
              />
            </Box>
          </Box>

          {/* Right 55%: Team Table */}
          <Box sx={{
            height: 'calc(100vh - 48px - 24px)', // Adjusted height to match container height minus padding
            width: '55%',
            overflow: 'auto',
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.05)',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <TeamTable teams={teams} />
          </Box>
        </Box>
      ) : (
        <Box>
          {/* Full view layout - Unchanged */}
          <Box sx={{
            height: 'calc(100vh - 48px)',
            minHeight: '550px',
            width: '100%',
            overflow: 'auto',
            pt: 3 // Reduced padding top
          }}>
            <TeamTable teams={teams} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

// Add this keyframe animation to your CSS
const cssKeyframes = `
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
`;

export default LiveView;
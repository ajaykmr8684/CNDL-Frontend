import React from 'react';
import { Box, Typography, Avatar, Tooltip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function TeamTable({ teams }) {
  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const maxPlayers = Math.max(18, ...sortedTeams.map(team => team.players?.length || 0));

  // Constants for budget calculations
  const MIN_PLAYERS_REQUIRED = 14;
  const MIN_PLAYER_BASE_PRICE = 100000; // 1L (Tier-2 base)
  const MAX_TEAM_BUDGET = 5000000; // 50L

  // Calculate maximum bid a team can place while maintaining ability to complete squad
  const calculateMaxBid = (team) => {
    if (!team || !team.players) return 0;

    const currentSquadSize = team.players.length;
    const remainingPlayersNeeded = MIN_PLAYERS_REQUIRED - currentSquadSize;
    
    // If team already has 11+ players, they can bid their full wallet balance
    if (remainingPlayersNeeded <= 0) {
      return team.walletBalance;
    }

    // Calculate minimum budget needed for remaining players (excluding current bid)
    const minBudgetForRemainingPlayers = (remainingPlayersNeeded - 1) * MIN_PLAYER_BASE_PRICE;
    
    // Maximum they can bid on current player
    const maxBid = team.walletBalance - minBudgetForRemainingPlayers;
    
    return Math.max(0, maxBid);
  };

  // Modified function to ensure newest players are always in the first column
  const processTeamPlayers = (team) => {
    if (!team.players || team.players.length === 0) return Array(maxPlayers).fill(null);
    
    // Create a result array filled with nulls
    const result = Array(maxPlayers).fill(null);
    
    // Sort players by newness
    // First, separate retained players (R) from newly bought players
    const retainedPlayers = team.players.filter(player => !player.soldAmount || player.soldAmount === 'R');
    const boughtPlayers = team.players.filter(player => player.soldAmount && player.soldAmount !== 'R');
    
    // Reverse bought players to get newest first
    const newestBoughtPlayersFirst = [...boughtPlayers].reverse();
    
    // First, place all the bought players from left to right
    for (let i = 0; i < newestBoughtPlayersFirst.length && i < maxPlayers; i++) {
      result[i] = newestBoughtPlayersFirst[i];
    }
    
    // Then, place retained players in remaining slots
    let nextAvailableSlot = newestBoughtPlayersFirst.length;
    for (let i = 0; i < retainedPlayers.length && nextAvailableSlot < maxPlayers; i++) {
      result[nextAvailableSlot] = retainedPlayers[i];
      nextAvailableSlot++;
    }
    
    return result;
  };

  return (
    <Box sx={{
      backgroundColor: '#ffffff',
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      overflow: 'auto',
      maxWidth: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e0e7ef'
    }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `minmax(130px, auto) repeat(${maxPlayers}, 72px)`,
          sm: `minmax(160px, auto) repeat(${maxPlayers}, 90px)`,
          md: `minmax(200px, auto) repeat(${maxPlayers}, 120px)`,
        },
        minWidth: {
          xs: 130 + maxPlayers * 72,
          sm: 160 + maxPlayers * 90,
          md: 10 * 120 + 200,
        },
        flexGrow: 1
      }}>
        {/* Top-left corner cell */}
        <Box sx={{
          backgroundColor: '#f0f4f8',
          borderBottom: '1px solid #e0e7ef',
          borderRight: '1px solid #e0e7ef',
          p: 1.5,
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: { xs: '36px', sm: '44px', md: '56px' },
          boxSizing: 'border-box'
        }}>
          <Typography variant="subtitle2" sx={{
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Teams / Players
          </Typography>
        </Box>

        {/* Column headers */}
        {Array.from({ length: maxPlayers }).map((_, index) => (
          <Box key={`player-col-${index}`} sx={{
            backgroundColor: '#f0f4f8',
            borderBottom: '1px solid #e0e7ef',
            borderRight: index < maxPlayers - 1 ? '1px solid #e0e7ef' : 'none',
            p: { xs: 0.5, md: 1.5 },
            position: 'sticky',
            top: 0,
            zIndex: 2,
            height: { xs: '36px', sm: '44px', md: '56px' },
            boxSizing: 'border-box'
          }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{
              fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
              textAlign: 'center',
              color: '#2c3e50'
            }}>
              {index + 1}
            </Typography>
          </Box>
        ))}

        {/* Team rows */}
        {sortedTeams.map((team, teamIndex) => {
          const evenRow = teamIndex % 2 === 0;
          const processedPlayers = processTeamPlayers(team);
          const maxBid = calculateMaxBid(team);
          const currentSquadSize = team.players?.length || 0;
          const remainingPlayersNeeded = Math.max(0, MIN_PLAYERS_REQUIRED - currentSquadSize);

          return (
            <React.Fragment key={team.id}>
              {/* Team info */}
              <Box sx={{
                borderBottom: '1px solid #e0e7ef',
                borderRight: '1px solid #e0e7ef',
                backgroundColor: evenRow ? 'rgba(236, 240, 245, 0.7)' : '#fff',
                p: { xs: 0.75, sm: 1, md: 1.5 },
                position: 'sticky',
                left: 0,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                height: { xs: '72px', sm: '86px', md: '100px' },
                boxSizing: 'border-box'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, md: 1.5 } }}>
                  <Avatar sx={{
                    bgcolor: 'primary.main',
                    width: { xs: 24, sm: 30, md: 36 },
                    height: { xs: 24, sm: 30, md: 36 },
                    fontSize: { xs: '0.7rem', md: '1rem' },
                    fontWeight: 'bold',
                    display: { xs: 'none', sm: 'flex' },
                  }}>
                    {team.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Tooltip title={team.name} placement="top">
                      <Typography variant="subtitle1" fontWeight="600" sx={{
                      fontSize: { xs: '0.7rem', sm: '0.82rem', md: '0.95rem' },
                        color: '#1a365d',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: { xs: 90, sm: 120, md: 150 }
                      }}>
                        {team.name}
                      </Typography>
                    </Tooltip>
                    <Tooltip title={team.owners?.[0]?.name || "Unknown Owner"} placement="top">
                      <Typography variant="caption" sx={{
                        fontSize: { xs: '0.6rem', md: '0.75rem' },
                        color: '#4a5568',
                        lineHeight: 1.2,
                        display: { xs: 'none', sm: 'block' },
                      }}>
                        {team.owners?.[0]?.name || "Unknown"}
                      </Typography>
                    </Tooltip>
                    
                    {/* Wallet Balance */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccountBalanceWalletIcon sx={{
                        fontSize: 14,
                        mr: 0.5,
                        color: team.walletBalance > 3000000 ? '#16a34a' :   // > 30L → green
                              team.walletBalance > 500000 ? '#d97706' :      // > 5L → amber
                              '#94a3b8'                                        // ≤ 5L → muted
                      }} />
                      <Typography variant="caption" sx={{
                        fontSize: { xs: '0.65rem', md: '0.8rem' },
                        fontWeight: 600,
                        color: team.walletBalance > 3000000 ? '#16a34a' :
                              team.walletBalance > 500000 ? '#d97706' :
                              '#94a3b8'
                      }}>
                        {formatToINR(team.walletBalance)}
                      </Typography>
                    </Box>

                    {/* Max Bid */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.25 }}>
                      <TrendingUpIcon sx={{
                        fontSize: 14,
                        mr: 0.5,
                        color: maxBid > 1000000 ? '#0284c7' :    // > 10L → blue
                              maxBid > 100000 ? '#d97706' :        // > 1L → amber (can still bid)
                              '#94a3b8'                             // ≤ 1L → muted
                      }} />
                      <Typography variant="caption" sx={{
                        fontSize: { xs: '0.6rem', md: '0.75rem' },
                        fontWeight: 600,
                        color: maxBid > 1000000 ? '#0284c7' :
                              maxBid > 100000 ? '#d97706' :
                              '#94a3b8'
                      }}>
                        Max: {formatToINR(maxBid)}
                      </Typography>
                    </Box>

                    {/* Squad Status */}
                    {currentSquadSize < MIN_PLAYERS_REQUIRED && (
                      <Typography variant="caption" sx={{
                        fontSize: { xs: '0.55rem', md: '0.7rem' },
                        color: 'text.secondary',
                        mt: 0.25,
                        display: { xs: 'none', sm: 'block' },
                      }}>
                        Need {remainingPlayersNeeded} more
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Players */}
              {processedPlayers.map((player, playerIndex) => (
                <Box key={`${team.id}-player-${playerIndex}`} sx={{
                  borderBottom: '1px solid #e0e7ef',
                  borderRight: playerIndex < maxPlayers - 1 ? '1px solid #e0e7ef' : 'none',
                  backgroundColor: evenRow ? 'rgba(236, 240, 245, 0.3)' : '#fff',
                  p: { xs: 0.5, md: 1.25 },
                  height: { xs: '72px', sm: '86px', md: '100px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}>
                  {player ? (
                    <Tooltip title={`${player.name} (${player.playerType}) - ${formatToINR(player.soldAmount)}`} placement="top">
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', width: '100%', mb: 0.5 }}>
                          <Box sx={{
                            mr: 0.75,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: { xs: 16, md: 20 },
                            height: { xs: 16, md: 20 },
                            borderRadius: '50%',
                            backgroundColor: getPlayerTypeColor(player.playerType),
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          }}>
                            {getPlayerTypeIcon(player.playerType)}
                          </Box>
                          <Typography variant="body2" sx={{
                            fontSize: { xs: '0.65rem', sm: '0.72rem', md: '0.8rem' },
                            fontWeight: 500,
                            color: '#2c3e50',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.2
                          }}>
                            {player.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{
                          fontSize: { xs: '0.6rem', md: '0.75rem' },
                          color: '#4a5568',
                          fontWeight: 600,
                          textAlign: 'right',
                          width: '100%',
                          backgroundColor: 'rgba(242, 242, 242, 0.5)',
                          borderRadius: 0.5,
                          px: 0.75,
                          py: 0.25
                        }}>
                          {formatToINR(player.soldAmount)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    <Typography variant="caption" sx={{
                      width: '100%',
                      textAlign: 'center',
                      color: 'text.disabled',
                      fontSize: '0.75rem'
                    }}>
                      —
                    </Typography>
                  )}
                </Box>
              ))}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}

const formatToINR = (amount) => {
  if (amount === null || amount === undefined) return "R";
  if (amount === 'R') return "R"; // Handle case where amount is already "R"
  if (amount >= 1_00_00_000) return `${(amount / 1_00_00_000).toFixed(2)} Cr`;
  if (amount >= 1_00_000) return `${(amount / 1_00_000).toFixed(2)} L`;
  return amount.toLocaleString('en-IN');
};

function getPlayerTypeIcon(playerType) {
  const type = playerType?.toLowerCase() || '';
  switch (type) {
    case 'batsman': return <SportsCricketIcon sx={{ fontSize: 14, color: '#fff' }} />;
    case 'bowler': return <SportsBaseballIcon sx={{ fontSize: 14, color: '#fff' }} />;
    case 'all-rounder': return <SportsCricketIcon sx={{ fontSize: 14, color: '#fff' }} />;
    case 'wicket-keeper': return <CatchingPokemonIcon sx={{ fontSize: 14, color: '#fff' }} />;
    default: return <SportsCricketIcon sx={{ fontSize: 14, color: '#fff' }} />;
  }
}

function getPlayerTypeColor(playerType) {
  const type = playerType?.toLowerCase() || '';
  switch (type) {
    case 'batsman': return '#ed8936';
    case 'bowler': return '#4299e1';
    case 'all-rounder': return '#4299e1';
    case 'wicket-keeper': return '#e53e3e';
    default: return '#718096';
  }
}

export default TeamTable;

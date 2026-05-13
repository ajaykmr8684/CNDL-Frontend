import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container, Typography, Paper, Box,
  Snackbar, Alert, Fade, Button, Grid, Chip
} from '@mui/material';
import { useAuction } from '../context/AuctionContext';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PlayerCard from '../components/PlayerCard';
import PageHeader from '../components/PageHeader';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


function BidView() {
  const { auctionState, teams, placeBid, loading } = useAuction();
  const { currentPlayer, highestBid, basePrice, stepUpAmount } = auctionState;

  const [currentBidAmount, setCurrentBidAmount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingTeamId, setAnimatingTeamId] = useState(null);
  const [bidInfo, setBidInfo] = useState({ basePrice: 0, stepUpAmount: 0, currentAmount: 0, tier: '' });
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  // Constants for budget calculations
  const MIN_PLAYERS_REQUIRED = 11;
  const MIN_PLAYER_BASE_PRICE = 20000000; // 2 Cr
  const MAX_TEAM_BUDGET = 400000000; // 40 Cr

  // Memoized currency formatter
  const formatCurrency = useCallback((amount) => {
    if (amount === null || amount === undefined) return "₹0";
    if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
    if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)} L`;
    return `₹${amount}`;
  }, []);

  // Memoized max bid calculation
  const teamMaxBids = useMemo(() => {
    const maxBids = {};
    teams.forEach(team => {
      if (!team || !team.players) {
        maxBids[team.id] = 0;
        return;
      }

      const currentSquadSize = team.players.length;
      const remainingPlayersNeeded = MIN_PLAYERS_REQUIRED - currentSquadSize;
      
      if (remainingPlayersNeeded <= 0) {
        maxBids[team.id] = team.walletBalance;
      } else {
        const minBudgetForRemainingPlayers = (remainingPlayersNeeded - 1) * MIN_PLAYER_BASE_PRICE;
        maxBids[team.id] = Math.max(0, team.walletBalance - minBudgetForRemainingPlayers);
      }
    });
    return maxBids;
  }, [teams]);

  // Check if team can afford the current bid amount
  const canTeamAffordBid = useCallback((team) => {
    return currentBidAmount <= (teamMaxBids[team.id] || 0);
  }, [currentBidAmount, teamMaxBids]);

  // Debounced fetch for bid amount
  const fetchCurrentBidAmount = useCallback(async () => {
    if (!currentPlayer) return;
    
    try {
      const response = await fetch(`${API_URL}/api/auction/current-bid-amount`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      setCurrentBidAmount(data.amount);
      setBidInfo({
        basePrice: data.basePrice || 0,
        stepUpAmount: data.stepUpAmount || 0,
        currentAmount: data.amount || 0,
        tier: data.tier || ''
      });
    } catch (error) {
      console.error('Error fetching current bid amount:', error);
    }
  }, [currentPlayer]);

  // Optimized bid handler with debouncing
  const handleBid = useCallback(async (teamId) => {
    if (isPlacingBid) return; // Prevent double-clicks
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    const bidAmount = currentBidAmount;

    // Quick validation before API call
    if (team.walletBalance < bidAmount) {
      setError(`${team.name} doesn't have enough balance (${formatCurrency(team.walletBalance)})`);
      return;
    }

    if (!canTeamAffordBid(team)) {
      const maxBid = teamMaxBids[team.id];
      setError(`${team.name} cannot bid ${formatCurrency(bidAmount)}. Maximum allowed: ${formatCurrency(maxBid)} (need to reserve budget for remaining players)`);
      return;
    }

    setIsPlacingBid(true);
    setAnimatingTeamId(teamId);
    setIsAnimating(true);

    try {
      // Optimized API call - send minimal data
      const response = await fetch(`${API_URL}/api/auction/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result) {
        setSuccess(`${team.name} bid ${formatCurrency(bidAmount)} successfully!`);
        setError('');
        // Don't fetch bid amount immediately - let WebSocket update handle it
        // This reduces unnecessary API calls
      } else {
        setError('Failed to place bid. Please try again.');
      }
    } catch (error) {
      setError('Failed to place bid: ' + (error.message || 'Unknown error'));
    } finally {
      setIsPlacingBid(false);
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatingTeamId(null);
      }, 800);
    }
  }, [teams, currentBidAmount, canTeamAffordBid, teamMaxBids, formatCurrency, isPlacingBid]);

  // Effect for fetching bid amount - only when necessary
  useEffect(() => {
    if (currentPlayer) {
      fetchCurrentBidAmount();
    }
  }, [currentPlayer, highestBid, fetchCurrentBidAmount]);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Memoized sorted teams to avoid re-sorting on every render
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => a.name.localeCompare(b.name));
  }, [teams]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 1 }}>
        <Typography>Loading auction data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 1, mb: 1 }}>
      <Fade in timeout={500}>
        <div>
          <PageHeader
            title="Place Your Bid"
            subtitle="Compete for the current player"
            icon={<MonetizationOnIcon fontSize="medium" />}
          />

          {/* Tier Info Banner */}
          {currentPlayer && (
            <Box
              sx={{
                mt: 2,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '8px',
                padding: '8px 16px',
                backgroundColor: '#f0f7ff',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid #e0e7ff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={bidInfo.tier || currentPlayer.tier}
                  color="primary"
                  size="small"
                  sx={{ mr: 2, fontWeight: 'bold' }}
                />
                <Typography variant="body2" color="text.secondary">
                  Base: {formatCurrency(bidInfo.basePrice || basePrice)} | Step: {formatCurrency(bidInfo.stepUpAmount || stepUpAmount)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" fontWeight="bold" color="primary.main">
                  Your bid: {formatCurrency(currentBidAmount)}
                  {highestBid ? ` (+${formatCurrency(bidInfo.stepUpAmount || stepUpAmount)})` : " (starting price)"}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Main Content */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Player Card */}
            <Paper elevation={2} sx={{ width: '40%', p: 2, borderRadius: 2 }}>
              <PlayerCard
                title="Current Player"
                player={currentPlayer}
                bid={highestBid}
                teams={teams}
                primaryColor="primary.main"
                gradientColors={['#1e40af', '#3b82f6']}
                showBid
                emptyMessage="Auction completed or not started"
              />
            </Paper>

            {/* Team Bid Buttons */}
            <Paper elevation={2} sx={{ width: '60%', p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalAtmIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Choose a team to place bid ({formatCurrency(currentBidAmount)})
                </Typography>
              </Box>

              <Grid container spacing={1.5}>
                {sortedTeams.map((team) => {
                  const canAfford = canTeamAffordBid(team);
                  const maxBid = teamMaxBids[team.id] || 0;
                  const isAnimatingThis = isAnimating && animatingTeamId === team.id;
                  const currentSquadSize = team.players?.length || 0;
                  const remainingPlayersNeeded = Math.max(0, MIN_PLAYERS_REQUIRED - currentSquadSize);
                  
                  return (
                    <Grid item xs={6} sm={4} md={3} key={team.id}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleBid(team.id)}
                        disabled={!currentPlayer || isPlacingBid || !canAfford}
                        sx={{
                          py: 1,
                          px: 1.5,
                          height: '100%',
                          borderRadius: 1.5,
                          textTransform: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundImage: canAfford
                            ? 'linear-gradient(135deg, #1e40af, #3b82f6)'
                            : 'linear-gradient(135deg, #991b1b, #ef4444)',
                          opacity: canAfford ? 1 : 0.75,
                          boxShadow: canAfford ? '0 4px 10px rgba(30,64,175,0.35)' : '0 2px 6px rgba(153,27,27,0.3)',
                          '&:hover:not(:disabled)': {
                            backgroundImage: canAfford
                              ? 'linear-gradient(135deg, #1e3a8a, #2563eb)'
                              : 'linear-gradient(135deg, #7f1d1d, #dc2626)',
                          },
                          '&.Mui-disabled': {
                            backgroundImage: canAfford
                              ? 'linear-gradient(135deg, #1e40af, #3b82f6)'
                              : 'linear-gradient(135deg, #991b1b, #ef4444)',
                            opacity: canAfford ? 0.5 : 0.65,
                            color: 'white',
                          },
                          '&::after': isAnimatingThis ? {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                            animation: 'bidAnimation 0.8s ease',
                          } : {}
                        }}
                      >
                        <Typography fontWeight="bold" noWrap sx={{ color: 'white', fontSize: '0.85rem' }}>
                          {team.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.72rem' }}>
                          Balance: {formatCurrency(team.walletBalance)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.68rem' }}>
                          Max: {formatCurrency(maxBid)}
                        </Typography>
                        {remainingPlayersNeeded > 0 && (
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>
                            Need {remainingPlayersNeeded} more
                          </Typography>
                        )}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Box>

          {/* Snackbar Notifications */}
          <Snackbar
            open={!!error || !!success}
            autoHideDuration={5000}
            onClose={() => { setError(''); setSuccess(''); }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity={error ? 'error' : 'success'} 
              variant="filled"
              sx={{ width: '100%' }}
            >
              {error || success}
            </Alert>
          </Snackbar>
        </div>
      </Fade>
    </Container>
  );
}

export default BidView;

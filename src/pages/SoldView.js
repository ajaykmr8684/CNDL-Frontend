import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Grid, Button, Box, Alert, Fade, Grow, Zoom,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, TextField, IconButton, Chip
} from '@mui/material';
import { useAuction } from '../context/AuctionContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GavelIcon from '@mui/icons-material/Gavel';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import PlayerCard from '../components/PlayerCard';
import PageHeader from '../components/PageHeader';
import PlayerManagementDialog from '../components/PlayerManagementDialog';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function SoldView() {
  const { auctionState, teams, sellPlayer, markUnsold } = useAuction();
  const { currentPlayer, highestBid } = auctionState;
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSelling, setIsSelling] = useState(false);
  const [isUnselling, setIsUnselling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [displayBid, setDisplayBid] = useState(highestBid);
  
  // States for edit functionality
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedTeamId, setEditedTeamId] = useState('');
  const [editedAmount, setEditedAmount] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  // Add this with your other useState declarations
const [isPlayerManagementOpen, setIsPlayerManagementOpen] = useState(false);

  // States for re-auction functionality
  const [isReAuctionOpen, setIsReAuctionOpen] = useState(false);
  const [isStartingReAuction, setIsStartingReAuction] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);

  // Check authorization and fetch player data on component mount
  useEffect(() => {
    checkIpAccess();
    fetchPlayerData();
  }, []);

  // This effect updates the displayed bid when the current player changes
  useEffect(() => {
    setDisplayBid(highestBid);
    
    if (highestBid) {
      setEditedTeamId(highestBid.teamId);
      setEditedAmount(highestBid.amount.toString());
    } else {
      setEditedTeamId('');
      setEditedAmount('');
    }
  }, [currentPlayer, highestBid]);

  const checkIpAccess = async () => {
    try {
      const response = await fetch(`${API_URL}/api/check-ip-access`);
      const data = await response.json();
      setIsAuthorized(data.allowed);
    } catch (error) {
      console.error('Error checking IP access:', error);
      setIsAuthorized(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  // Add these functions with your other handlers
const handleOpenPlayerManagement = () => {
  setIsPlayerManagementOpen(true);
};

const handleClosePlayerManagement = () => {
  setIsPlayerManagementOpen(false);
};

const handlePlayerUpdate = () => {
  // Refresh auction state and player data when a player is updated
  fetchPlayerData();
  // You might also want to refresh the auction context if needed
};

  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auction/export-players`);
      if (response.ok) {
        const data = await response.json();
        setAllPlayers(data);
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };

  const handleSell = async () => {
    if (!currentPlayer) {
      setError('No player to sell');
      return;
    }
    
    if (!displayBid) {
      setError('No bids placed for this player');
      return;
    }
    
    setIsSelling(true);
    
    const result = await sellPlayer(displayBid.teamId, Number(displayBid.amount));
    if (result) {
      setMessage(`Player ${result.name} sold successfully to ${teams.find(team => team.id === result.soldToTeamId)?.name} for ${result.soldAmount}`);
      setError('');
      setDisplayBid(null);
      // Refresh player data after selling
      fetchPlayerData();
    } else {
      setError('Failed to sell player. Please try again.');
    }
    
    setTimeout(() => {
      setIsSelling(false);
    }, 1000);
  };

  const handleUnsold = async () => {
    if (!currentPlayer) {
      setError('No player to mark as unsold');
      return;
    }
    
    setIsUnselling(true);
    
    const result = await markUnsold();
    if (result) {
      setMessage(`Player ${result.name} marked as unsold`);
      setError('');
      setDisplayBid(null);
      // Refresh player data after marking unsold
      fetchPlayerData();
    } else {
      setError('Failed to mark player as unsold. Please try again.');
    }
    
    setTimeout(() => {
      setIsUnselling(false);
    }, 1000);
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const response = await fetch(`${API_URL}/api/auction/export-players`);
      if (!response.ok) throw new Error('Failed to fetch player data');
      const players = await response.json();

      // ── Sheet 1: Team Summary ─────────────────────────────────────────────
      // Build a map teamId -> team info
      const teamMap = {};
      teams.forEach(t => { teamMap[t.id] = t; });

      // Group sold players by team (exclude default/pre-assigned ones with soldAmount===0)
      const byTeam = {};
      teams.forEach(t => { byTeam[t.id] = []; });
      players.forEach(p => {
        if (p.sold && p.soldToTeamId && p.soldAmount > 0) {
          if (!byTeam[p.soldToTeamId]) byTeam[p.soldToTeamId] = [];
          byTeam[p.soldToTeamId].push(p);
        }
      });

      const summaryRows = [['Team', 'Owner', 'Players Bought', 'Total Spent (₹)', 'Wallet Remaining (₹)']];
      teams.forEach(t => {
        const tPlayers = byTeam[t.id] || [];
        const spent = tPlayers.reduce((s, p) => s + (p.soldAmount || 0), 0);
        summaryRows.push([
          t.name,
          t.owners?.[0]?.name || 'Unknown',
          tPlayers.length,
          spent,
          t.walletBalance
        ]);
      });

      // ── Sheet 2: Player Details ────────────────────────────────────────────
      const soldPlayers = players
        .filter(p => p.sold && p.soldAmount > 0)
        .sort((a, b) => (a.soldToTeamId || 0) - (b.soldToTeamId || 0));

      const unsoldList = players.filter(p => !p.sold || p.soldAmount === 0 || p.soldAmount === null);

      const detailHeaders = ['#', 'Player Name', 'Type', 'Tier', 'Team', 'Sold Amount (₹)', 'Batting', 'Bowling'];
      const detailRows = [detailHeaders];
      soldPlayers.forEach((p, i) => {
        detailRows.push([
          i + 1,
          p.name,
          p.playerType,
          p.tier,
          teamMap[p.soldToTeamId]?.name || 'Unknown',
          p.soldAmount,
          p.battingStat || '',
          p.bowlingStat || ''
        ]);
      });

      // ── Sheet 3: Unsold Players ───────────────────────────────────────────
      const unsoldHeaders = ['#', 'Player Name', 'Type', 'Tier', 'Batting', 'Bowling'];
      const unsoldRows = [unsoldHeaders];
      unsoldList.forEach((p, i) => {
        unsoldRows.push([i + 1, p.name, p.playerType, p.tier, p.battingStat || '', p.bowlingStat || '']);
      });

      // ── Sheet 4: Per-Team rosters ─────────────────────────────────────────
      const rosterRows = [];
      teams.forEach((t, idx) => {
        const tPlayers = byTeam[t.id] || [];
        const owner = t.owners?.[0]?.name || 'Unknown';
        const spent = tPlayers.reduce((s, p) => s + (p.soldAmount || 0), 0);

        // Team header row
        rosterRows.push([`${t.name}  |  Owner: ${owner}  |  Players: ${tPlayers.length}  |  Spent: ₹${spent.toLocaleString('en-IN')}`, '', '', '', '', '']);
        // Column sub-header
        rosterRows.push(['#', 'Player Name', 'Type', 'Tier', 'Sold Amount (₹)', 'Batting', 'Bowling']);

        if (tPlayers.length === 0) {
          rosterRows.push(['—', 'No players bought', '', '', '', '', '']);
        } else {
          tPlayers.forEach((p, i) => {
            rosterRows.push([i + 1, p.name, p.playerType, p.tier, p.soldAmount, p.battingStat || '', p.bowlingStat || '']);
          });
        }
        // blank separator between teams (skip after last)
        if (idx < teams.length - 1) rosterRows.push(['', '', '', '', '', '', '']);
      });

      // ── Build workbook ────────────────────────────────────────────────────
      const XLSX = window.XLSX;
      if (!XLSX) throw new Error('XLSX library not loaded');

      const wb = XLSX.utils.book_new();

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
      wsSummary['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Team Summary');

      const wsDetail = XLSX.utils.aoa_to_sheet(detailRows);
      wsDetail['!cols'] = [{ wch: 4 }, { wch: 22 }, { wch: 14 }, { wch: 10 }, { wch: 26 }, { wch: 16 }, { wch: 20 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsDetail, 'Sold Players');

      const wsUnsold = XLSX.utils.aoa_to_sheet(unsoldRows);
      wsUnsold['!cols'] = [{ wch: 4 }, { wch: 22 }, { wch: 14 }, { wch: 10 }, { wch: 20 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsUnsold, 'Unsold Players');

      const wsRoster = XLSX.utils.aoa_to_sheet(rosterRows);
      wsRoster['!cols'] = [{ wch: 26 }, { wch: 22 }, { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 20 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsRoster, 'Team Rosters');

      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `cndl-auction-results-${date}.xlsx`);

      setMessage('Excel exported successfully!');
    } catch (err) {
      console.error('Error exporting Excel:', err);
      setError('Failed to export Excel. Please try again.');
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`${API_URL}/api/auction/export-players`);
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }
      
      let data = await response.json();
      
      data = data.sort((a, b) => {
        if (typeof a.id === 'number' && typeof b.id === 'number') {
          return a.id - b.id;
        }
        if (typeof a.id === 'string' && typeof b.id === 'string') {
          const numA = parseInt(a.id.replace(/[^0-9]/g, ''));
          const numB = parseInt(b.id.replace(/[^0-9]/g, ''));
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
        }
        return String(a.id).localeCompare(String(b.id));
      });
      
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `auction-players-${date}.json`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessage('Player data downloaded successfully!');
    } catch (err) {
      console.error('Error downloading player data:', err);
      setError('Failed to download player data. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenEdit = () => {
    if (displayBid) {
      setEditedTeamId(displayBid.teamId);
      setEditedAmount(displayBid.amount.toString());
    }
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!editedTeamId || !editedAmount || isNaN(Number(editedAmount)) || Number(editedAmount) <= 0) {
      setError('Please provide a valid team and amount');
      return;
    }
  
    setIsUpdating(true);
  
    try {
      const response = await fetch(`${API_URL}/api/auction/edit-bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId: editedTeamId,
          amount: Number(editedAmount)
        })
      });
  
      if (response.ok) {
        const updatedBid = await response.json();
        setDisplayBid(updatedBid);
        setIsEditOpen(false);
        setMessage('Bid details updated successfully.');
      } else {
        setError('Failed to update bid. Please try again.');
      }
    } catch (err) {
      console.error('Error updating bid:', err);
      setError('Error: Failed to update bid');
    } finally {
      setIsUpdating(false);
    }
  };

  // Re-auction functionality
  const handleOpenReAuction = () => {
    setIsReAuctionOpen(true);
  };

  const handleCloseReAuction = () => {
    setIsReAuctionOpen(false);
  };

  const handleStartReAuction = async () => {
    setIsStartingReAuction(true);
    
    try {
      const response = await fetch(`${API_URL}/api/auction/re-auction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setMessage(`Re-auction started successfully! ${result.unsoldPlayersCount} unsold players will be auctioned.`);
        setError('');
        setIsReAuctionOpen(false);
        // Refresh player data
        fetchPlayerData();
      } else {
        setError(result.message || 'Failed to start re-auction');
      }
    } catch (err) {
      console.error('Error starting re-auction:', err);
      setError('Failed to start re-auction. Please try again.');
    } finally {
      setIsStartingReAuction(false);
    }
  };

  const getTeamNameById = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  // Calculate unsold players count
  const unsoldPlayers = allPlayers.filter(player => !player.sold);
  const unsoldCount = unsoldPlayers.length;

  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      <Fade in timeout={800}>
        <div>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, mb: 3 }}>
            <PageHeader 
              title="Admin Control" 
              subtitle="Manage the auction process" 
              icon={<AdminPanelSettingsIcon fontSize="large" />}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {isAuthorized && (
                
                <>
                <Button
                  variant="contained"
                  onClick={handleOpenPlayerManagement}
                  startIcon={<ManageAccountsIcon />}
                  disabled={checkingAuth}
                  sx={{
                    height: '42px',
                    backgroundImage: 'linear-gradient(to right, #0369a1, #0ea5e9)',
                    '&:hover': { backgroundImage: 'linear-gradient(to right, #075985, #0284c7)' },
                  }}
                >
                  Manage Players
                </Button>
                <Button
                  variant="contained"
                  onClick={handleOpenReAuction}
                  startIcon={<RefreshIcon />}
                  disabled={checkingAuth || unsoldCount === 0}
                  sx={{
                    height: '42px',
                    backgroundImage: 'linear-gradient(to right, #7c3aed, #a855f7)',
                    '&:hover': { backgroundImage: 'linear-gradient(to right, #6d28d9, #9333ea)' },
                  }}
                >
                  Re-Auction ({unsoldCount})
                </Button>
              </>
              )}
              <Button
                variant="contained"
                onClick={handleExportExcel}
                startIcon={<DownloadIcon />}
                disabled={isExportingExcel}
                sx={{
                  height: '42px',
                  backgroundImage: 'linear-gradient(to right, #b45309, #f59e0b)',
                  '&:hover': { backgroundImage: 'linear-gradient(to right, #92400e, #d97706)' },
                }}
              >
                {isExportingExcel ? 'Exporting...' : 'Export Excel'}
              </Button>
              <Button
                variant="contained"
                onClick={handleDownload}
                startIcon={<DownloadIcon />}
                disabled={isDownloading}
                sx={{
                  height: '42px',
                  backgroundImage: 'linear-gradient(to right, #15803d, #22c55e)',
                  '&:hover': { backgroundImage: 'linear-gradient(to right, #166534, #16a34a)' },
                }}
              >
                {isDownloading ? 'Downloading...' : 'Export JSON'}
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            {/* Player Card on the left */}
            <Grid item xs={12} md={6}>
              <Grow in timeout={1000}>
                <div>
                  <PlayerCard
                    title="Current Player"
                    player={currentPlayer}
                    bid={displayBid}
                    teams={teams}
                    primaryColor="primary.main"
                    gradientColors={['#1e40af', '#3b82f6']}
                    showBid={!!displayBid}
                    emptyMessage="Auction completed or not started"
                  />
                </div>
              </Grow>
            </Grid>
            
            {/* Admin actions on the right */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1200}>
                <Paper elevation={0} sx={{ 
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 2, 
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  backgroundColor: '#ffffff',
                  borderLeft: '5px solid #1e40af'
                }}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <AdminPanelSettingsIcon color="primary" />
                      <Typography variant="h6">Admin Actions</Typography>
                    </Box>
                    
                    {displayBid && (
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          mb: 3,
                          backgroundColor: 'rgba(59, 130, 246, 0.08)', 
                          borderRadius: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Current Highest Bid
                          </Typography>
                          <Typography variant="h6">
                            {getTeamNameById(displayBid.teamId)} - {displayBid.amount}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleOpenEdit}
                          startIcon={<EditIcon />}
                          size="small"
                        >
                          Edit
                        </Button>
                      </Paper>
                    )}
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        onClick={handleSell}
                        disabled={!currentPlayer || !displayBid || isSelling}
                        startIcon={<GavelIcon />}
                        sx={{ 
                          height: 46,
                          position: 'relative',
                          overflow: 'hidden',
                          '&::after': isSelling ? {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'sellAnimation 1s ease',
                            '@keyframes sellAnimation': {
                              '0%': { transform: 'translateX(-100%)' },
                              '100%': { transform: 'translateX(100%)' }
                            }
                          } : {}
                        }}
                      >
                        Sell Player
                      </Button>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        fullWidth
                        onClick={handleUnsold}
                        disabled={!currentPlayer || isUnselling}
                        startIcon={<CancelIcon />}
                        sx={{ 
                          height: 46,
                          position: 'relative',
                          overflow: 'hidden',
                          '&::after': isUnselling ? {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'unsellAnimation 1s ease',
                            '@keyframes unsellAnimation': {
                              '0%': { transform: 'translateX(-100%)' },
                              '100%': { transform: 'translateX(100%)' }
                            }
                          } : {}
                        }}
                      >
                        Mark Unsold
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
          
          {error && (
            <Zoom in timeout={500}>
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  borderLeft: '4px solid #dc2626',
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </Zoom>
          )}
          
          {message && (
            <Zoom in timeout={500}>
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  borderLeft: '4px solid #16a34a',
                }}
                onClose={() => setMessage('')}
              >
                {message}
              </Alert>
            </Zoom>
          )}
          
          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
              Edit Bid Details
              <IconButton
                aria-label="close"
                onClick={handleCloseEdit}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white'
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="team-select-label">Select Team</InputLabel>
                    <Select
                      labelId="team-select-label"
                      id="team-select"
                      value={editedTeamId}
                      label="Select Team"
                      onChange={(e) => setEditedTeamId(e.target.value)}
                    >
                      {teams.map((team) => (
                        <MenuItem key={team.id} value={team.id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bid Amount"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={handleCloseEdit} 
                variant="outlined"
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEdit} 
                variant="contained" 
                color="primary"
                startIcon={<EditIcon />}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Re-Auction Dialog */}
          <Dialog open={isReAuctionOpen} onClose={handleCloseReAuction} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'secondary.main', color: 'white' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <RefreshIcon />
                Start Re-Auction
              </Box>
              <IconButton
                aria-label="close"
                onClick={handleCloseReAuction}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white'
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <WarningIcon color="warning" />
                <Typography variant="h6" color="warning.main">
                  Confirmation Required
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                This will start a new auction round with only the unsold players.
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Unsold players available:
                </Typography>
                <Chip 
                  label={`${unsoldCount} players`} 
                  color={unsoldCount > 0 ? "secondary" : "default"} 
                  size="small" 
                />
              </Box>
              
              {unsoldCount === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No unsold players available for re-auction.
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Warning:</strong> This action will reset the current auction state and start fresh with unsold players only.
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={handleCloseReAuction} 
                variant="outlined"
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStartReAuction} 
                variant="contained" 
                color="secondary"
                startIcon={<RefreshIcon />}
                disabled={isStartingReAuction || unsoldCount === 0}
              >
                {isStartingReAuction ? 'Starting...' : 'Start Re-Auction'}
              </Button>
            </DialogActions>
          </Dialog>
          {/* Player Management Dialog */}
<PlayerManagementDialog
  open={isPlayerManagementOpen}
  onClose={handleClosePlayerManagement}
  teams={teams}
  onPlayerUpdate={handlePlayerUpdate}
/>
        </div>
      </Fade>
    </Container>
  );
}

export default SoldView;

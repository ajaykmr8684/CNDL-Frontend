import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Grid, Typography, Box,
  IconButton, Alert, Chip, FormControlLabel, Switch, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, InputAdornment, Divider, Card, CardContent
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Sports as SportsIcon,
  AttachMoney as MoneyIcon,
  Photo as PhotoIcon
} from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


const PlayerManagementDialog = ({ open, onClose, teams, onPlayerUpdate }) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Edit states
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    sold: false,
    soldToTeamId: '',
    soldAmount: '',
    tier: '',
    playerType: '',
    lastYearTeam: '',
    runs: '',
    battingStat: '',
    bowlingStat: '',
    photoUrl: ''
  });
  const [updating, setUpdating] = useState(false);

  // Fetch players when dialog opens
  useEffect(() => {
    if (open) {
      fetchPlayers();
    }
  }, [open]);

  // Filter players based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.tier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.playerType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
    setPage(0); // Reset to first page when searching
  }, [searchTerm, players]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/players`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
        setFilteredPlayers(data);
      } else if (response.status === 403) {
        setError('Access denied. You are not authorized to manage players.');
      } else {
        setError('Failed to fetch players');
      }
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Error fetching players');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (player) => {
    setEditingPlayer(player);
    setEditForm({
      name: player.name || '',
      sold: player.sold || false,
      soldToTeamId: player.soldToTeamId || '',
      soldAmount: player.soldAmount?.toString() || '',
      tier: player.tier || '',
      playerType: player.playerType || '',
      lastYearTeam: player.lastYearTeam || '',
      runs: player.runs?.toString() || '',
      battingStat: player.battingStat || '',
      bowlingStat: player.bowlingStat || '',
      photoUrl: player.photoUrl || ''
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setEditForm({});
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePlayer = async () => {
    if (!editingPlayer) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      // Prepare the update payload
      const updateData = {
        name: editForm.name,
        sold: editForm.sold,
        soldToTeamId: editForm.sold && editForm.soldToTeamId ? parseInt(editForm.soldToTeamId) : null,
        soldAmount: editForm.sold && editForm.soldAmount ? parseInt(editForm.soldAmount) : null,
        tier: editForm.tier,
        playerType: editForm.playerType,
        lastYearTeam: editForm.lastYearTeam,
        runs: editForm.runs ? parseInt(editForm.runs) : null,
        battingStat: editForm.battingStat,
        bowlingStat: editForm.bowlingStat,
        photoUrl: editForm.photoUrl
      };

      const response = await fetch(`/api/admin/players/${editingPlayer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(`Player ${editForm.name} updated successfully!`);
        setEditingPlayer(null);
        setEditForm({});
        // Refresh the players list
        await fetchPlayers();
        // Notify parent component
        if (onPlayerUpdate) {
          onPlayerUpdate();
        }
      } else {
        setError(result.message || 'Failed to update player');
      }
    } catch (err) {
      console.error('Error updating player:', err);
      setError('Error updating player. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPlayers = filteredPlayers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon />
          Player Management ({players.length} players)
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
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

      <DialogContent sx={{ p: 0 }}>
        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <TextField
            fullWidth
            placeholder="Search players by name, tier, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ m: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Players Table */}
            <TableContainer component={Paper} elevation={0}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Tier</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Team</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPlayers.map((player) => (
                    <TableRow key={player.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {player.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={player.tier || 'N/A'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{player.playerType || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={player.sold ? 'SOLD' : 'UNSOLD'}
                          color={player.sold ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {player.sold && player.soldToTeamId ? getTeamName(player.soldToTeamId) : '-'}
                      </TableCell>
                      <TableCell>
                        {player.sold && player.soldAmount ? `₹${player.soldAmount.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(player)}
                          disabled={editingPlayer?.id === player.id}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredPlayers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </DialogContent>

      {/* Edit Player Dialog */}
      <Dialog open={!!editingPlayer} onClose={handleCancelEdit} maxWidth="lg" fullWidth>
        <DialogTitle 
          sx={{ 
            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative'
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon />
            <Typography variant="h6" component="div">
              Edit Player: {editingPlayer?.name}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleCancelEdit}
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
        
        <DialogContent sx={{ p: 0, bgcolor: '#f8f9fa' }}>
          <Box sx={{ p: 3 }}>
            {/* Basic Information Card */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" color="primary" fontWeight="600">
                    Basic Information
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Player Name"
                      value={editForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Player Type"
                      value={editForm.playerType}
                      onChange={(e) => handleFormChange('playerType', e.target.value)}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tier"
                      value={editForm.tier}
                      onChange={(e) => handleFormChange('tier', e.target.value)}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last Year Team"
                      value={editForm.lastYearTeam}
                      onChange={(e) => handleFormChange('lastYearTeam', e.target.value)}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <SportsIcon color="primary" />
                  <Typography variant="h6" color="primary" fontWeight="600">
                    Player Statistics
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Runs"
                      type="number"
                      value={editForm.runs}
                      onChange={(e) => handleFormChange('runs', e.target.value)}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Batting Stats"
                      value={editForm.battingStat}
                      onChange={(e) => handleFormChange('battingStat', e.target.value)}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Bowling Stats"
                      value={editForm.bowlingStat}
                      onChange={(e) => handleFormChange('bowlingStat', e.target.value)}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Photo Card */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <PhotoIcon color="primary" />
                  <Typography variant="h6" color="primary" fontWeight="600">
                    Photo
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Photo URL"
                      value={editForm.photoUrl}
                      onChange={(e) => handleFormChange('photoUrl', e.target.value)}
                      variant="outlined"
                      placeholder="https://example.com/player-photo.jpg"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Sale Information Card */}
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <MoneyIcon color="primary" />
                  <Typography variant="h6" color="primary" fontWeight="600">
                    Sale Information
                  </Typography>
                </Box>
                
                <Box mb={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editForm.sold}
                        onChange={(e) => handleFormChange('sold', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body1" fontWeight="500">
                        Player Sold
                      </Typography>
                    }
                  />
                </Box>

                {editForm.sold && (
                  <>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl 
                          fullWidth 
                          required
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                          <InputLabel>Sold To Team</InputLabel>
                          <Select
                            value={editForm.soldToTeamId}
                            label="Sold To Team"
                            onChange={(e) => handleFormChange('soldToTeamId', e.target.value)}
                          >
                            {teams.map((team) => (
                              <MenuItem key={team.id} value={team.id}>
                                {team.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Sold Amount"
                          type="number"
                          value={editForm.soldAmount}
                          onChange={(e) => handleFormChange('soldAmount', e.target.value)}
                          required
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </DialogContent>
        
        <DialogActions 
          sx={{ 
            p: 3, 
            bgcolor: '#f8f9fa',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            gap: 2
          }}
        >
          <Button
            onClick={handleCancelEdit}
            variant="outlined"
            startIcon={<CancelIcon />}
            size="large"
            sx={{ 
              borderRadius: 2,
              minWidth: 120,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePlayer}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={updating || !editForm.name}
            size="large"
            sx={{ 
              borderRadius: 2,
              minWidth: 140,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              }
            }}
          >
            {updating ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default PlayerManagementDialog;

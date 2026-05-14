import React, { useState } from 'react';
import { Box, Typography, Card, Avatar, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { useAuction } from '../context/AuctionContext';
import TeamTable from '../components/TeamTable';
import ToastNotification from '../components/ToastNotification';
import GavelIcon from '@mui/icons-material/Gavel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const formatToINR = (amount) => {
  if (amount === null || amount === undefined) return '—';
  if (amount >= 1_00_00_000) return `${(amount / 1_00_00_000).toFixed(2)} Cr`;
  if (amount >= 1_00_000) return `${(amount / 1_00_000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

const TIER_STYLE = {
  'Marque': { bg: 'rgba(16,185,129,0.12)', text: '#065f46', border: 'rgba(16,185,129,0.35)', label: 'Marquee' },
  'Tier-1': { bg: 'rgba(245,158,11,0.12)', text: '#92400e', border: 'rgba(245,158,11,0.35)', label: 'Tier 1' },
  'Tier-2': { bg: 'rgba(239,68,68,0.12)',  text: '#991b1b', border: 'rgba(239,68,68,0.35)',  label: 'Tier 2' },
};
const DEFAULT_TIER = TIER_STYLE['Tier-2'];

const PLAYER_TYPE_COLOR = {
  'batsman':       '#f59e0b',
  'bowler':        '#3b82f6',
  'all-rounder':   '#8b5cf6',
  'wicket-keeper': '#ef4444',
};

function parseStat(stat) {
  if (!stat || stat === 'NA') return null;
  const parts = stat.split(',');
  if (parts.length > 1 || !isNaN(parts[0])) return parts;
  return stat;
}

function CurrentPlayerCard({ player, highestBid, teams }) {
  if (!player) {
    return (
      <Card elevation={3} sx={{ height: '100%', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(0,0,0,0.1)' }}>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <GavelIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">Auction not started or completed</Typography>
        </Box>
      </Card>
    );
  }

  const tier = TIER_STYLE[player.tier] || DEFAULT_TIER;
  const typeColor = PLAYER_TYPE_COLOR[player.playerType?.toLowerCase()] || '#6b7280';
  const battingStat = parseStat(player.battingStat);
  const bowlingStat = parseStat(player.bowlingStat);
  const bidTeam = teams?.find(t => t.id === highestBid?.teamId);

  return (
    <Card elevation={4} sx={{
      height: { xs: 'auto', md: '100%' },
      borderRadius: 3,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(30,64,175,0.1)',
      boxShadow: '0 8px 32px rgba(30,64,175,0.12)',
    }}>
      {/* Header */}
      <Box sx={{
        px: 2, py: 1,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FiberManualRecordIcon sx={{ fontSize: '0.7rem', color: '#4ade80', animation: 'livePulse 1.2s ease-in-out infinite' }} />
          <GavelIcon sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }} />
          <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.8rem', letterSpacing: '0.06em' }}>
            ON THE BLOCK
          </Typography>
        </Box>
        <Chip
          icon={<EmojiEventsIcon style={{ fontSize: '0.7rem', color: tier.text }} />}
          label={tier.label}
          size="small"
          sx={{ height: 22, fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.92)', color: tier.text, border: `1.5px solid ${tier.border}`, fontWeight: 800 }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Photo + name */}
        <Box sx={{
          width: { xs: '40%', sm: '42%', md: '50%', lg: '52%' },
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(160deg, #f8fafc 0%, #eff6ff 100%)',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          p: { xs: 1, sm: 1.5 },
          gap: 1,
        }}>
          <Avatar
            src={player.photoUrl || ''}
            alt={player.name}
            variant="rounded"
            sx={{
              width: '90%',
              height: 'auto',
              aspectRatio: '1 / 1',
              maxWidth: { xs: 140, sm: 200, md: 340, lg: 420 },
              borderRadius: 2.5,
              boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
              border: '3px solid white',
              bgcolor: '#e0e7ff',
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontWeight: 700,
              color: '#3730a3',
              '& img': { objectFit: 'cover', objectPosition: 'top center' },
            }}
          >
            {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </Avatar>

          <Typography sx={{
            fontWeight: 800,
            fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
            textAlign: 'center',
            color: '#0f172a',
            lineHeight: 1.2,
            px: 0.5,
          }}>
            {player.name}
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label={player.playerType}
              size="small"
              sx={{
                height: 18, fontSize: '0.6rem', fontWeight: 700,
                backgroundColor: `${typeColor}22`, color: typeColor,
                border: `1px solid ${typeColor}44`,
              }}
            />
            {player.lastYearTeam && (
              <Chip
                icon={<AccessTimeIcon style={{ fontSize: '0.55rem' }} />}
                label={player.lastYearTeam}
                size="small"
                sx={{ height: 18, fontSize: '0.6rem', backgroundColor: 'rgba(79,70,229,0.08)', color: '#4f46e5', border: '1px solid rgba(79,70,229,0.2)' }}
              />
            )}
          </Box>
        </Box>

        {/* Details */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 1, sm: 1.5 }, gap: 0.8, overflow: 'hidden' }}>

          {/* Base Price */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, py: 0.5, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.03)' }}>
            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Base Price</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e40af' }}>{formatToINR(player.basePrice)}</Typography>
          </Box>

          {/* Batting */}
          {battingStat && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.5, borderRadius: 1, backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)' }}>
              <SportsCricketIcon sx={{ fontSize: '0.85rem', color: '#2563eb', flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Batting</Typography>
                {Array.isArray(battingStat) ? (
                  <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#1d4ed8' }}>
                    {battingStat[0]} runs · {battingStat[1]} avg · {battingStat[2]} SR
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8' }}>{battingStat}</Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Bowling */}
          {bowlingStat && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.5, borderRadius: 1, backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
              <SportsHandballIcon sx={{ fontSize: '0.85rem', color: '#7c3aed', flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Bowling</Typography>
                {Array.isArray(bowlingStat) ? (
                  <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#6d28d9' }}>
                    {bowlingStat[0]} wkts · {bowlingStat[1]} eco · {bowlingStat[2]} SR
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#6d28d9' }}>{bowlingStat}</Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Bid Banner */}
          <Box sx={{ mt: 'auto' }}>
            {highestBid ? (
              <Box sx={{
                px: 1.5, py: 1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1.5px solid #f59e0b',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: '0 2px 8px rgba(245,158,11,0.2)',
              }}>
                <Box>
                  <Typography sx={{ fontSize: '0.55rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Current Bid
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 900, color: '#78350f', lineHeight: 1.1 }}>
                    {formatToINR(highestBid.amount)}
                  </Typography>
                </Box>
                <Chip
                  label={bidTeam?.name || 'Unknown'}
                  size="small"
                  sx={{
                    height: 24, fontSize: '0.65rem', fontWeight: 700,
                    backgroundColor: '#f59e0b', color: 'white',
                    boxShadow: '0 2px 4px rgba(245,158,11,0.4)',
                    maxWidth: 110,
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ px: 1.5, py: 1, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.03)', border: '1px dashed rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontStyle: 'italic' }}>
                  No bids yet — opens at {formatToINR(player.basePrice)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

function NextPlayerCard({ player }) {
  if (!player) {
    return (
      <Card elevation={1} sx={{ borderRadius: 2, border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, minHeight: 80 }}>
        <Typography variant="caption" color="text.secondary">No next player</Typography>
      </Card>
    );
  }

  const tier = TIER_STYLE[player.tier] || DEFAULT_TIER;
  const typeColor = PLAYER_TYPE_COLOR[player.playerType?.toLowerCase()] || '#6b7280';
  const battingStat = parseStat(player.battingStat);
  const bowlingStat = parseStat(player.bowlingStat);

  return (
    <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(190,24,93,0.12)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{
        px: 1.5, py: 0.6,
        background: 'linear-gradient(135deg, #881337 0%, #be185d 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <AccessTimeIcon sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }} />
          <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.7rem', letterSpacing: '0.05em' }}>UP NEXT</Typography>
        </Box>
        <Chip
          label={tier.label}
          size="small"
          sx={{ height: 16, fontSize: '0.55rem', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)' }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.2 }}>
        <Avatar
          src={player.photoUrl || ''}
          alt={player.name}
          variant="rounded"
          sx={{
            width: { xs: 52, sm: 64 }, height: { xs: 52, sm: 64 },
            borderRadius: 1.5, flexShrink: 0,
            border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            bgcolor: '#fce7f3', fontSize: '1rem', fontWeight: 700, color: '#be185d',            '& img': { objectFit: 'cover', objectPosition: 'top center' },          }}
        >
          {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {player.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.3 }}>
            <Chip
              label={player.playerType}
              size="small"
              sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700, backgroundColor: `${typeColor}20`, color: typeColor }}
            />
            {battingStat && !Array.isArray(battingStat) && (
              <Chip label={battingStat} size="small" sx={{ height: 16, fontSize: '0.55rem', backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563eb' }} />
            )}
            {bowlingStat && !Array.isArray(bowlingStat) && (
              <Chip label={bowlingStat} size="small" sx={{ height: 16, fontSize: '0.55rem', backgroundColor: 'rgba(139,92,246,0.08)', color: '#7c3aed' }} />
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Base</Typography>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#be185d' }}>{formatToINR(player.basePrice)}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

function LiveView() {
  const { auctionState, teams } = useAuction();
  const { currentPlayer, nextPlayer, highestBid, notifications } = auctionState;
  const [viewMode, setViewMode] = useState('compact');

  // Navbar height: 64px on sm+, 56px on xs
  const navbarH = { xs: '56px', sm: '64px' };

  return (
    <Box sx={{
      width: '100%',
      height: { xs: 'auto', md: `calc(100vh - 64px)` },
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
      boxSizing: 'border-box',
    }}>
      <ToastNotification notifications={notifications} />

      {/* Toggle bar — in the flow, not absolute */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        py: 0.8,
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        backgroundColor: '#f8fafc',
        flexShrink: 0,
      }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, val) => val && setViewMode(val)}
          size="small"
          sx={{
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderRadius: 2,
            overflow: 'hidden',
            '& .MuiToggleButton-root': {
              px: 2, py: 0.5, border: 'none', gap: 0.5,
              fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary',
              '&.Mui-selected': { backgroundColor: 'primary.main', color: 'white' },
            },
          }}
        >
          <ToggleButton value="compact">
            <ViewModuleIcon sx={{ fontSize: '1rem' }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Players + Table</Box>
          </ToggleButton>
          <ToggleButton value="full">
            <ViewStreamIcon sx={{ fontSize: '1rem' }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Table Only</Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
      {viewMode === 'compact' ? (
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flex: 1,
          gap: { xs: 1.5, md: 2 },
          p: { xs: 1, sm: 1.5, md: 2 },
          overflow: { xs: 'visible', md: 'hidden' },
          minHeight: 0,
        }}>
          {/* Left: Player Cards */}
          <Box sx={{
            width: { xs: '100%', md: '40%' },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, md: 1.5 },
            flexShrink: 0,
            height: { xs: 'auto', md: '100%' },
            minHeight: 0,
          }}>
            {/* Current Player — 70% of left column on desktop */}
            <Box sx={{ flex: { xs: 'none', md: '7 7 0%' }, minHeight: { md: 0 }, display: 'flex', flexDirection: 'column' }}>
              <CurrentPlayerCard player={currentPlayer} highestBid={highestBid} teams={teams} />
            </Box>
            {/* Next Player — 30% of left column on desktop */}
            <Box sx={{ flex: { xs: 'none', md: '3 3 0%' }, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <NextPlayerCard player={nextPlayer} />
            </Box>
          </Box>

          {/* Right: Team Table */}
          <Box sx={{
            flex: 1,
            minHeight: { xs: '60vh', md: 0 },
            overflow: 'auto',
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.06)',
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <TeamTable teams={teams} />
          </Box>
        </Box>
      ) : (
        <Box sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 1, md: 2 },
          minHeight: { xs: '70vh', md: 0 },
        }}>
          <Box sx={{ height: '100%', minHeight: 400, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', backgroundColor: 'white', overflow: 'auto' }}>
            <TeamTable teams={teams} />
          </Box>
        </Box>
      )}

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
      `}</style>
    </Box>
  );
}

export default LiveView;

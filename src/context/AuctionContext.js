import React, { createContext, useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const AuctionContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const useAuction = () => useContext(AuctionContext);

export const AuctionProvider = ({ children }) => {
  const [auctionState, setAuctionState] = useState({
    currentPlayer: null,
    nextPlayer: null,
    currentBids: [],
    highestBid: null,
    notifications: []
  });
  const [teams, setTeams] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  // Connect to WebSocket
  useEffect(() => {
    const sock = new SockJS(`${API_URL}/ws`);
    const client = Stomp.over(sock);
    
    client.connect({}, () => {
      setConnected(true);
      
      // Subscribe to auction updates
      client.subscribe('/topic/auction', (message) => {
        const newState = JSON.parse(message.body);
        setAuctionState(newState);
        
        // Important: Refresh teams data whenever auction state changes
        // This ensures we have the latest team data including sold players
        fetchTeams();
      });
      
      // Subscribe to team updates
      client.subscribe('/topic/teams', (message) => {
        const newTeams = JSON.parse(message.body);
        setTeams(newTeams);
      });
    });
    
    setStompClient(client);
    
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, []);

  // Fetch teams data function
  const fetchTeams = () => {
    fetch(`${API_URL}/api/teams`)
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Error fetching teams:', err));
  };

  // Fetch initial data
  useEffect(() => {
    // Fetch current auction state
    fetch(`${API_URL}/api/auction/current`)
      .then(res => res.json())
      .then(data => setAuctionState(data))
      .catch(err => console.error('Error fetching auction state:', err));
    
    // Fetch teams
    fetchTeams();
  }, []);

  // Place a bid
  const placeBid = async (teamId, amount) => {
    try {
      const response = await fetch(`${API_URL}/api/auction/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, amount }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to place bid');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error placing bid:', error);
      return null;
    }
  };

  // Mark player as sold
  const sellPlayer = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auction/sold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to sell player');
      }
      
      // Refresh teams data after selling a player
      fetchTeams();
      
      return await response.json();
    } catch (error) {
      console.error('Error selling player:', error);
      return null;
    }
  };

  // Mark player as unsold
  const markUnsold = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auction/unsold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark player as unsold');
      }
      
      // Refresh teams data after marking a player as unsold
      fetchTeams();
      
      return await response.json();
    } catch (error) {
      console.error('Error marking player as unsold:', error);
      return null;
    }
  };

  return (
    <AuctionContext.Provider value={{ 
      auctionState, 
      teams, 
      connected, 
      placeBid, 
      sellPlayer, 
      markUnsold 
    }}>
      {children}
    </AuctionContext.Provider>
  );
};
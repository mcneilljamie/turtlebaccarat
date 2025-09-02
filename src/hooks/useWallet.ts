import { useState, useCallback, useEffect } from 'react';
import { WalletState } from '../types/game';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      isConnected: boolean;
      publicKey?: { toString: () => string };
    };
  }
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    balance: 100, // Mock balance for demo
    address: null
  });

  const connectWallet = useCallback(async () => {
    try {
      if (!window.solana) {
        alert('Please install Phantom wallet or another Solana wallet extension');
        return;
      }

      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      
      setWallet({
        connected: true,
        balance: 100, // Mock balance - in production this would fetch real TURTLE token balance
        address: address
      });

      console.log('Wallet connected:', address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
      }
      setWallet({
        connected: false,
        balance: 0,
        address: null
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setWallet(prev => ({
      ...prev,
      balance: Math.max(0, newBalance)
    }));
  }, []);

  // Check if wallet is already connected on load
  useEffect(() => {
    if (window.solana && window.solana.isConnected && window.solana.publicKey) {
      setWallet({
        connected: true,
        balance: 100, // Mock balance
        address: window.solana.publicKey.toString()
      });
    }
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    updateBalance
  };
};
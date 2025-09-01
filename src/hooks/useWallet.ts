import { useState, useCallback } from 'react';
import { WalletState } from '../types/game';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    balance: 0,
    address: null
  });

  const connectWallet = useCallback(async () => {
    // Mock wallet connection - in real implementation, this would integrate with actual wallet
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock wallet data
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      const mockBalance = Math.floor(Math.random() * 100) + 50; // 50-150 TURTLE
      
      setWallet({
        connected: true,
        balance: mockBalance,
        address: mockAddress
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      connected: false,
      balance: 0,
      address: null
    });
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setWallet(prev => ({
      ...prev,
      balance: Math.max(0, newBalance)
    }));
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    updateBalance
  };
};
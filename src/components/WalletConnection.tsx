import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { WalletState } from '../types/game';

interface WalletConnectionProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  wallet,
  onConnect,
  onDisconnect
}) => {
  return (
    <div className="flex items-center gap-4">
      {!wallet.connected ? (
        <button
          onClick={onConnect}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Wallet size={20} />
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="bg-gray-800/80 rounded-xl px-4 py-2 border border-gray-700/50 backdrop-blur-sm">
            <div className="text-emerald-400 text-xs font-medium">Balance</div>
            <div className="text-white text-base font-bold">{wallet.balance} TURTLE</div>
          </div>
          <div className="bg-gray-800/80 rounded-xl px-4 py-2 border border-gray-700/50 backdrop-blur-sm">
            <div className="text-gray-400 text-xs">Wallet</div>
            <div className="text-white text-xs font-mono">
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </div>
          </div>
          <button
            onClick={onDisconnect}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
            title="Disconnect Wallet"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Wallet, LogOut, Zap, Shield } from 'lucide-react';
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
          className="group relative flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-emerald-500/30 hover:border-emerald-400/50 overflow-hidden"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <Wallet size={22} className="group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-lg">Connect Wallet</span>
            <Shield size={18} className="text-emerald-300 group-hover:text-yellow-300 transition-colors duration-300" />
          </div>
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl px-6 py-3 border border-emerald-500/30 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-emerald-400" />
              <div className="text-emerald-400 text-xs font-medium uppercase tracking-wide">Balance</div>
            </div>
            <div className="text-white text-lg font-bold flex items-center gap-1">
              {wallet.balance} 
              <span className="text-emerald-400 text-sm font-medium">TURTLE</span>
              <div className="text-2xl ml-1">🐢</div>
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl px-6 py-3 border border-gray-600/50 backdrop-blur-sm hover:border-gray-500/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wide">Connected</div>
            </div>
            <div className="text-white text-sm font-mono flex items-center gap-2">
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
          
          <button
            onClick={onDisconnect}
            className="group p-3 text-gray-400 hover:text-red-400 transition-all duration-300 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/30"
            title="Disconnect Wallet"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};
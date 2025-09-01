import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Bet, GameState } from '../types/game';

interface BettingInterfaceProps {
  bet: Bet | null;
  onBetChange: (bet: Bet) => void;
  onClearBet: () => void;
  disabled: boolean;
  walletBalance: number;
  gameState: GameState;
  onDeal: () => void;
  canDeal: boolean;
}

export const BettingInterface: React.FC<BettingInterfaceProps> = ({
  bet,
  onBetChange,
  onClearBet,
  disabled,
  walletBalance,
  gameState,
  onDeal,
  canDeal
}) => {
  const betTypes: { type: Bet['type']; label: string; payout: string }[] = [
    { type: 'player', label: 'Player', payout: '1:1' },
    { type: 'banker', label: 'Banker', payout: '1:1' },
    { type: 'tie', label: 'Tie', payout: '8:1' }
  ];

  const adjustBetAmount = (delta: number) => {
    if (!bet) return;
    const newAmount = Math.max(1, Math.min(10, Math.min(bet.amount + delta, walletBalance)));
    onBetChange({ ...bet, amount: newAmount });
  };

  return (
    <div className="space-y-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent mb-2">
          💰 Place Your Bet
        </h3>
        <p className="text-gray-400 text-xs">Min: 1 TURTLE • Max: 10 TURTLE</p>
      </div>

      {/* Bet Type Selection */}
      <div className="grid grid-cols-3 gap-2">
        {betTypes.map(({ type, label, payout }) => (
          <button
            key={type}
            onClick={() => onBetChange({ type, amount: bet?.amount || 1 })}
            disabled={disabled || walletBalance < 1}
            className={`relative p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
              bet?.type === type
                ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
                : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-700/30'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-white font-semibold text-sm">{label}</div>
            <div className="text-emerald-400 text-xs">{payout}</div>
            {bet?.type === type && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            )}
          </button>
        ))}
      </div>

      {/* Bet Amount Controls */}
      {bet && (
        <div className="bg-gray-900/80 rounded-xl p-3 border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Bet Amount</span>
            <span className="text-emerald-400 font-mono text-sm font-bold">{bet.amount} TURTLE</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustBetAmount(-1)}
              disabled={disabled || bet.amount <= 1}
              className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <Minus size={14} />
            </button>
            
            <div className="flex-1 bg-gray-900/80 rounded-lg p-2 text-center border border-emerald-500/30">
              <span className="text-white text-base font-bold">{bet.amount}</span>
              <span className="text-emerald-400 ml-1 text-xs">TURTLE</span>
            </div>
            
            <button
              onClick={() => adjustBetAmount(1)}
              disabled={disabled || bet.amount >= 10 || bet.amount >= walletBalance}
              className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={onClearBet}
              disabled={disabled}
              className="flex-1 py-2 px-3 bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm hover:scale-105"
            >
              Clear
            </button>
            <button
              onClick={() => onBetChange({ ...bet, amount: Math.min(10, walletBalance) })}
              disabled={disabled || walletBalance < 1}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm hover:scale-105"
            >
              Max
            </button>
          </div>
        </div>
      )}

      {/* Deal Cards Button */}
      <div className="mt-4">
        {gameState.gamePhase === 'finished' ? (
          <button
            onClick={onDeal}
            className="w-full px-6 py-3 rounded-xl font-bold transition-all duration-200 transform bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
          >
            🎲 Play Again
          </button>
        ) : (
          <button
            onClick={onDeal}
            disabled={!canDeal}
            className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-200 transform ${
              canDeal
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed backdrop-blur-sm'
            }`}
          >
            {gameState.gamePhase === 'betting' ? '🎲 Deal Cards' : 
             gameState.gamePhase === 'dealing' ? 'Dealing...' :
             gameState.gamePhase === 'revealing' ? 'Revealing...' : '🎲 Play Again'}
          </button>
        )}
      </div>
    </div>
  );
};
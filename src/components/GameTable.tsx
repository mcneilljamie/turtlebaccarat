import React from 'react';
import { Card as CardType, GameState } from '../types/game';
import { Card } from './Card';

interface GameTableProps {
  gameState: GameState;
  onDeal: () => void;
  canDeal: boolean;
}

export const GameTable: React.FC<GameTableProps> = ({
  gameState,
  onDeal,
  canDeal
}) => {
  const { playerCards, bankerCards, playerTotal, bankerTotal, winner, gamePhase } = gameState;

  return (
    <div className="relative">
      {/* Table Background */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
        <div className="absolute inset-6 border-2 border-yellow-500/30 rounded-2xl"></div>
        
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400 rounded-tl-lg"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400 rounded-tr-lg"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400 rounded-bl-lg"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400 rounded-br-lg"></div>
        
        {/* Player Section */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mr-4">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              Player
            </h3>
            <div className={`px-4 py-2 rounded-lg ${
              winner === 'player' ? 'bg-emerald-500 text-white animate-glow' : 'bg-gray-800/80 text-gray-300 backdrop-blur-sm'
            } transition-all duration-300 border border-gray-600`}>
              Total: {playerTotal}
            </div>
          </div>
          <div className="flex gap-3 min-h-[120px] items-center justify-center">
            {playerCards.map((card, index) => (
              <Card
                key={`player-${index}`}
                card={card}
                isRevealed={gamePhase !== 'dealing' || index < 2}
                animationDelay={index * 1200}
              />
            ))}
            {playerCards.length === 0 && (
              <div className="text-gray-500 italic text-center">Cards will appear here</div>
            )}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center mb-8 relative z-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-500/50"></div>
          <div className="px-4 py-2 bg-gray-900/80 rounded-full border border-yellow-500/30 backdrop-blur-sm">
            <span className="text-yellow-400 font-bold text-sm">VS</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-500/50"></div>
        </div>

        {/* Banker Section */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mr-4">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              Banker
            </h3>
            <div className={`px-4 py-2 rounded-lg ${
              winner === 'banker' ? 'bg-emerald-500 text-white animate-glow' : 'bg-gray-800/80 text-gray-300 backdrop-blur-sm'
            } transition-all duration-300 border border-gray-600`}>
              Total: {bankerTotal}
            </div>
          </div>
          <div className="flex gap-3 min-h-[120px] items-center justify-center">
            {bankerCards.map((card, index) => (
              <Card
                key={`banker-${index}`}
                card={card}
                isRevealed={gamePhase !== 'dealing' || index < 2}
                animationDelay={index * 1200 + 600}
              />
            ))}
            {bankerCards.length === 0 && (
              <div className="text-gray-500 italic text-center">Cards will appear here</div>
            )}
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && gamePhase === 'finished' && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-20">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl text-center shadow-2xl border-2 border-yellow-400 backdrop-blur-sm bg-black/20">
              <div className="text-2xl font-bold mb-2">
                {winner === 'tie' ? '🤝 Tie!' : 
                 winner === 'player' ? '🎉 Player Wins!' : '🏦 Banker Wins!'}
              </div>
              <div className="text-emerald-200 text-sm font-medium">
                {winner === 'tie' ? 
                  `Final Score: ${playerTotal} - ${bankerTotal}` :
                  `Winning Hand: ${winner === 'player' ? playerTotal : bankerTotal}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
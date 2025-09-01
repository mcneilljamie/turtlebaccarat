import React, { useState, useEffect } from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  isRevealed: boolean;
  animationDelay?: number;
}

export const Card: React.FC<CardProps> = ({ card, isRevealed, animationDelay = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isRevealed && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
        setHasAnimated(true);
      }, animationDelay);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, animationDelay, hasAnimated]);

  const getSuitColor = (suit: CardType['suit']) => {
    return ['hearts', 'diamonds'].includes(suit) ? 'text-red-500' : 'text-black';
  };

  const getSuitSymbol = (suit: CardType['suit']) => {
    const symbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    };
    return symbols[suit];
  };

  return (
    <div className="relative w-16 h-24 perspective-1000 hover:scale-105 transition-transform duration-200">
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-lg border-2 border-yellow-400 shadow-lg">
          <div className="absolute inset-2 border border-yellow-300/50 rounded-md bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl animate-spin-slow">🐢</div>
          </div>
          <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Card Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-white to-gray-50 rounded-lg border-2 border-gray-300 shadow-lg">
          <div className="absolute top-1 left-1">
            <div className={`text-sm font-bold ${getSuitColor(card.suit)}`}>
              {card.value}
            </div>
            <div className={`text-lg leading-none ${getSuitColor(card.suit)}`}>
              {getSuitSymbol(card.suit)}
            </div>
          </div>
          
          <div className="absolute bottom-1 right-1 rotate-180">
            <div className={`text-sm font-bold ${getSuitColor(card.suit)}`}>
              {card.value}
            </div>
            <div className={`text-lg leading-none ${getSuitColor(card.suit)}`}>
              {getSuitSymbol(card.suit)}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-4xl ${getSuitColor(card.suit)}`}>
              {getSuitSymbol(card.suit)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { GameHistory as GameHistoryType } from '../types/game';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GameHistoryProps {
  history: GameHistoryType[];
}

export const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  return (
    <div></div>
  );
};
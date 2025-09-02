import { useState, useCallback } from 'react';
import { GameState, Bet, GameHistory } from '../types/game';
import { createDeck, calculateHandValue, determineWinner, shouldDrawThirdCard, calculatePayout } from '../utils/gameLogic';

export const useGame = (onBalanceUpdate: (newBalance: number) => void, currentBalance: number) => {
  const [gameState, setGameState] = useState<GameState>({
    playerCards: [],
    bankerCards: [],
    playerTotal: 0,
    bankerTotal: 0,
    winner: null,
    gamePhase: 'betting'
  });

  const [bet, setBet] = useState<Bet | null>(null);
  const [history, setHistory] = useState<GameHistory[]>([]);

  const clearBet = useCallback(() => {
    setBet(null);
  }, []);

  const dealCards = useCallback(async () => {
    if (!bet || gameState.gamePhase !== 'betting') return;

    // TODO: Integrate with Solana smart contract for actual game logic
    // This should call the smart contract's place_bet and reveal functions
    setGameState(prev => ({ ...prev, gamePhase: 'dealing' }));

    console.log('Game logic not yet implemented - needs Solana integration');
  }, [bet, gameState.gamePhase, onBalanceUpdate, currentBalance]);

  const startNewGame = useCallback(() => {
    setGameState({
      playerCards: [],
      bankerCards: [],
      playerTotal: 0,
      bankerTotal: 0,
      winner: null,
      gamePhase: 'betting'
    });
    setBet(null);
  }, []);

  return {
    gameState,
    bet,
    history,
    setBet,
    clearBet,
    dealCards,
    startNewGame
  };
};
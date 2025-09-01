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

    const deck = createDeck();
    setGameState(prev => ({ ...prev, gamePhase: 'dealing' }));

    // Initial two cards for each
    const playerCards = [deck[0], deck[2]];
    const bankerCards = [deck[1], deck[3]];
    
    let currentDeckIndex = 4;

    setGameState(prev => ({
      ...prev,
      playerCards,
      bankerCards,
      playerTotal: calculateHandValue(playerCards),
      bankerTotal: calculateHandValue(bankerCards)
    }));

    // Wait for initial cards animation
    await new Promise(resolve => setTimeout(resolve, 3000));

    let finalPlayerCards = [...playerCards];
    let finalBankerCards = [...bankerCards];

    const playerTotal = calculateHandValue(finalPlayerCards);
    const bankerTotal = calculateHandValue(finalBankerCards);

    // Check for natural win (8 or 9)
    if (playerTotal >= 8 || bankerTotal >= 8) {
      setGameState(prev => ({ ...prev, gamePhase: 'revealing' }));
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      // Determine third card draws
      const { playerDraws, bankerDraws } = shouldDrawThirdCard(playerTotal, bankerTotal, finalPlayerCards, finalBankerCards);

      if (playerDraws) {
        finalPlayerCards.push(deck[currentDeckIndex++]);
        setGameState(prev => ({
          ...prev,
          playerCards: finalPlayerCards,
          playerTotal: calculateHandValue(finalPlayerCards)
        }));
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      if (bankerDraws) {
        finalBankerCards.push(deck[currentDeckIndex++]);
        setGameState(prev => ({
          ...prev,
          bankerCards: finalBankerCards,
          bankerTotal: calculateHandValue(finalBankerCards)
        }));
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setGameState(prev => ({ ...prev, gamePhase: 'revealing' }));
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Determine winner and finish game
    const finalPlayerTotal = calculateHandValue(finalPlayerCards);
    const finalBankerTotal = calculateHandValue(finalBankerCards);
    const winner = determineWinner(finalPlayerTotal, finalBankerTotal);
    
    const payout = calculatePayout(bet.type, bet.amount, winner);
    const result = payout > 0 ? 'win' : 'lose';
    
    // Update balance
    const balanceChange = result === 'win' ? payout - bet.amount : -bet.amount;
    onBalanceUpdate(currentBalance + balanceChange);

    // Add to history
    const gameRecord: GameHistory = {
      id: Date.now().toString(),
      bet,
      result,
      payout: result === 'win' ? payout : 0,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, gameRecord]);

    setGameState(prev => ({
      ...prev,
      winner,
      gamePhase: 'finished'
    }));
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
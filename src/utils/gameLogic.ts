import { Card, GameState } from '../types/game';

export const createDeck = (): Card[] => {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  suits.forEach(suit => {
    values.forEach(value => {
      const numericValue = value === 'A' ? 1 : 
                          ['J', 'Q', 'K'].includes(value) ? 0 : 
                          parseInt(value) || 0;
      deck.push({ suit, value, numericValue });
    });
  });

  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateHandValue = (cards: Card[]): number => {
  const total = cards.reduce((sum, card) => sum + card.numericValue, 0);
  return total % 10;
};

export const determineWinner = (playerTotal: number, bankerTotal: number): 'player' | 'banker' | 'tie' => {
  if (playerTotal > bankerTotal) return 'player';
  if (bankerTotal > playerTotal) return 'banker';
  return 'tie';
};

export const calculatePayout = (betType: 'player' | 'banker' | 'tie', betAmount: number, winner: 'player' | 'banker' | 'tie'): number => {
  if (betType !== winner) return 0;
  
  switch (betType) {
    case 'player':
      return betAmount * 2; // 1:1 payout
    case 'banker':
      return betAmount * 1.95; // 1:1 minus 5% commission
    case 'tie':
      return betAmount * 9; // 8:1 payout
    default:
      return 0;
  }
};

export const shouldDrawThirdCard = (playerTotal: number, bankerTotal: number, playerCards: Card[], bankerCards: Card[]): { playerDraws: boolean; bankerDraws: boolean } => {
  let playerDraws = false;
  let bankerDraws = false;

  // Player draws third card if total is 0-5
  if (playerTotal <= 5) {
    playerDraws = true;
  }

  // Banker drawing rules are more complex
  if (!playerDraws) {
    // If player stands, banker draws on 0-5
    if (bankerTotal <= 5) {
      bankerDraws = true;
    }
  } else {
    // If player drew third card, banker follows complex rules
    const playerThirdCard = playerCards[2]?.numericValue || 0;
    
    if (bankerTotal <= 2) {
      bankerDraws = true;
    } else if (bankerTotal === 3 && playerThirdCard !== 8) {
      bankerDraws = true;
    } else if (bankerTotal === 4 && [2, 3, 4, 5, 6, 7].includes(playerThirdCard)) {
      bankerDraws = true;
    } else if (bankerTotal === 5 && [4, 5, 6, 7].includes(playerThirdCard)) {
      bankerDraws = true;
    } else if (bankerTotal === 6 && [6, 7].includes(playerThirdCard)) {
      bankerDraws = true;
    }
  }

  return { playerDraws, bankerDraws };
};
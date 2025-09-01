export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  numericValue: number;
}

export interface GameState {
  playerCards: Card[];
  bankerCards: Card[];
  playerTotal: number;
  bankerTotal: number;
  winner: 'player' | 'banker' | 'tie' | null;
  gamePhase: 'betting' | 'dealing' | 'revealing' | 'finished';
}

export interface Bet {
  type: 'player' | 'banker' | 'tie';
  amount: number;
}

export interface WalletState {
  connected: boolean;
  balance: number;
  address: string | null;
}

export interface GameHistory {
  id: string;
  bet: Bet;
  result: 'win' | 'lose';
  payout: number;
  timestamp: Date;
}
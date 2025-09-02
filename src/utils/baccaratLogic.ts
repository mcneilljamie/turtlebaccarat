export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Card = { value: number; suit: Suit };
export type Hand = Card[];

export function createDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (let value = 1; value <= 13; value++) {
      deck.push({ value, suit });
    }
  }
  return deck;
}

export function shuffle(deck: Card[], rand: () => number): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function baccaratValue(card: Card): number {
  if (card.value >= 10) return 0;
  return card.value;
}

export function handValue(hand: Hand): number {
  const total = hand.reduce((sum, card) => sum + baccaratValue(card), 0);
  return total % 10;
}

export type Winner = 'player' | 'banker' | 'tie';

export interface BaccaratRoundResult {
  playerHand: Hand;
  bankerHand: Hand;
  winner: Winner;
}

// Implements the simplified Baccarat dealing and third-card rules
export function playBaccaratRound(deck: Card[]): BaccaratRoundResult {
  let playerHand: Hand = [deck[0], deck[2]];
  let bankerHand: Hand = [deck[1], deck[3]];
  let deckIndex = 4;

  // Third card rules (simplified, not covering all edge cases)
  const playerScore = handValue(playerHand);
  const bankerScore = handValue(bankerHand);

  // Player draws third card if playerScore <= 5
  let playerThird: Card | undefined;
  if (playerScore <= 5) {
    playerThird = deck[deckIndex++];
    playerHand.push(playerThird);
  }

  // Banker third card rules
  let bankerThird: Card | undefined;
  if (
    (playerThird === undefined && bankerScore <= 5) ||
    (playerThird && bankerScore <= 2) ||
    (playerThird && bankerScore === 3 && playerThird.value !== 8) ||
    (playerThird && bankerScore === 4 && playerThird.value >= 2 && playerThird.value <= 7) ||
    (playerThird && bankerScore === 5 && playerThird.value >= 4 && playerThird.value <= 7) ||
    (playerThird && bankerScore === 6 && (playerThird.value === 6 || playerThird.value === 7))
  ) {
    bankerThird = deck[deckIndex++];
    bankerHand.push(bankerThird);
  }

  const finalPlayerScore = handValue(playerHand);
  const finalBankerScore = handValue(bankerHand);

  let winner: Winner;
  if (finalPlayerScore > finalBankerScore) winner = 'player';
  else if (finalBankerScore > finalPlayerScore) winner = 'banker';
  else winner = 'tie';

  return { playerHand, bankerHand, winner };
}
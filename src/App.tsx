import React from 'react';
import { WalletConnection } from './components/WalletConnection';
import { BettingInterface } from './components/BettingInterface';
import { GameTable } from './components/GameTable';
import { GameHistory } from './components/GameHistory';
import { useWallet } from './hooks/useWallet';
import { useGame } from './hooks/useGame';

function App() {
  const { wallet, connectWallet, disconnectWallet, updateBalance } = useWallet();
  const { gameState, bet, history, setBet, clearBet, dealCards, startNewGame } = useGame(updateBalance, wallet.balance);

  const canDeal = wallet.connected && bet && bet.amount <= wallet.balance && gameState.gamePhase === 'betting';
  const canBet = wallet.connected && gameState.gamePhase === 'betting';

  const handleDeal = () => {
    if (gameState.gamePhase === 'finished') {
      startNewGame();
    } else {
      dealCards();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
      {/* Header */}
      <header className="relative z-10 p-4 border-b border-gray-700/50 backdrop-blur-sm bg-gradient-to-r from-gray-900/80 to-emerald-900/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="text-3xl">🐢</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Turtle Casino</h1>
              <p className="text-emerald-400 text-sm font-medium">Premium Baccarat Experience</p>
            </div>
          </div>
          <WalletConnection
            wallet={wallet}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Table - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3">
            <GameTable
              gameState={gameState}
              onDeal={handleDeal}
              canDeal={canDeal || gameState.gamePhase === 'finished'}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Betting Interface */}
            <BettingInterface
              bet={bet}
              onBetChange={setBet}
              onClearBet={clearBet}
              disabled={!canBet}
              walletBalance={wallet.balance}
              gameState={gameState}
              onDeal={handleDeal}
              canDeal={canDeal || gameState.gamePhase === 'finished'}
            />

            {/* Game History */}
            <GameHistory history={history} />

            {/* Welcome Message - Now in sidebar */}
            {!wallet.connected && (
              <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                <div className="text-emerald-400 text-lg font-semibold mb-2">
                  Welcome to Turtle Baccarat! 🐢
                </div>
                <p className="text-gray-300 text-sm">
                  Connect your wallet to start playing. Minimum bet is 1 TURTLE, maximum is 10 TURTLE.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-700/50 p-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>🐢 Turtle Baccarat • A premium casino experience • Play responsibly</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract TurtleBaccarat {
    IERC20 public immutable turtleToken;
    uint256 public minBet;
    uint256 public maxBet;

    enum BetType { Player, Banker, Tie }

    struct BetCommitment {
        address player;
        uint256 amount;
        BetType betType;
        bytes32 commitHash;
        bool revealed;
    }

    mapping(address => BetCommitment) public commitments;
    mapping(address => uint256) public contractSeeds;

    event BetPlaced(address indexed player, uint256 amount, BetType betType, bytes32 commitHash);
    event BetRevealed(address indexed player, bytes32 seed, BetType betType, string outcome, uint256 payout);

    constructor(address turtleTokenAddress, uint256 _minBet, uint256 _maxBet) {
        turtleToken = IERC20(turtleTokenAddress);
        minBet = _minBet;
        maxBet = _maxBet;
    }

    function placeBet(uint256 amount, BetType betType, bytes32 commitHash) external {
        require(commitments[msg.sender].player == address(0), "Already committed");
        require(amount >= minBet && amount <= maxBet, "Bet amount out of range");
        require(turtleToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Save contract's own seed for this player (could just be blockhash or random value)
        contractSeeds[msg.sender] = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));

        commitments[msg.sender] = BetCommitment({
            player: msg.sender,
            amount: amount,
            betType: betType,
            commitHash: commitHash,
            revealed: false
        });

        emit BetPlaced(msg.sender, amount, betType, commitHash);
    }

    function reveal(bytes32 seed, BetType betType) external {
        BetCommitment storage commitment = commitments[msg.sender];
        require(commitment.player == msg.sender, "Not your bet");
        require(!commitment.revealed, "Already revealed");
        require(commitment.betType == betType, "Bet type mismatch");
        require(commitment.commitHash == keccak256(abi.encodePacked(seed, betType)), "Commitment mismatch");

        // Combine seeds for shuffle
        uint256 combinedSeed = uint256(keccak256(abi.encodePacked(seed, contractSeeds[msg.sender])));

        // Play game off-chain, verify outcome in frontend, or implement minimal game logic on-chain for full trust.
        // For demo, let's say it's always 'player' win:
        string memory outcome = "player"; // Replace this with actual game logic or verification

        uint256 payout = 0;
        if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("player")) && betType == BetType.Player) {
            payout = commitment.amount * 2;
        } else if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("banker")) && betType == BetType.Banker) {
            payout = (commitment.amount * 195) / 100; // 1.95x for banker
        } else if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("tie")) && betType == BetType.Tie) {
            payout = commitment.amount * 8;
        }

        if (payout > 0) {
            turtleToken.transfer(msg.sender, payout);
        }

        commitment.revealed = true;
        emit BetRevealed(msg.sender, seed, betType, outcome, payout);
    }
}
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};

declare_id!("ReplaceWithYourProgramID11111111111111111111111111111");

#[program]
pub mod turtle_baccarat {
    use super::*;

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        amount: u64,
        bet_type: BetType,
        commit: [u8; 32],
    ) -> Result<()> {
        require!(amount >= ctx.accounts.casino_state.min_bet, ErrorCode::BetTooSmall);
        require!(amount <= ctx.accounts.casino_state.max_bet, ErrorCode::BetTooLarge);

        // Transfer user's TURTLE tokens into vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_ata.to_account_info(),
            to: ctx.accounts.vault_ata.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Record the bet
        let bet = &mut ctx.accounts.bet;
        bet.player = ctx.accounts.user.key();
        bet.amount = amount;
        bet.bet_type = bet_type;
        bet.commitment = commit;
        bet.settled = false;

        Ok(())
    }

    pub fn reveal(
        ctx: Context<Reveal>,
        seed: [u8; 32],
        bet_type: BetType,
        outcome: Outcome,
    ) -> Result<()> {
        let bet = &mut ctx.accounts.bet;
        require!(!bet.settled, ErrorCode::BetAlreadySettled);
        require!(bet.bet_type == bet_type, ErrorCode::BetTypeMismatch);
        require!(bet.commitment == hash_seed(&seed, bet_type), ErrorCode::CommitmentMismatch);

        // Use the casino's stored seed and the revealed seed for randomness (off-chain deck shuffle)
        // The outcome must be provided and verifiable off-chain
        let payout = match (bet.bet_type, outcome) {
            (BetType::Player, Outcome::Player) => bet.amount * 2,
            (BetType::Banker, Outcome::Banker) => bet.amount * 195 / 100, // 1.95x
            (BetType::Tie, Outcome::Tie) => bet.amount * 8,
            _ => 0,
        };

        if payout > 0 {
            // Send payout to player
            let seeds = &[b"vault", ctx.accounts.casino_state.key().as_ref()];
            let bump = ctx.accounts.casino_state.vault_bump;
            let signer = &[&seeds[..], &[bump]];
            let cpi_accounts = Transfer {
                from: ctx.accounts.vault_ata.to_account_info(),
                to: ctx.accounts.user_ata.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                signer,
            );
            token::transfer(cpi_ctx, payout)?;
        }

        bet.settled = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        seeds = [b"vault", casino_state.key().as_ref()],
        bump = casino_state.vault_bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_ata: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub bet: Box<Account<'info, Bet>>,
    #[account()]
    pub casino_state: Box<Account<'info, CasinoState>>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Reveal<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        seeds = [b"vault", casino_state.key().as_ref()],
        bump = casino_state.vault_bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_ata: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub bet: Box<Account<'info, Bet>>,
    #[account()]
    pub casino_state: Box<Account<'info, CasinoState>>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct CasinoState {
    pub owner: Pubkey,
    pub min_bet: u64,
    pub max_bet: u64,
    pub vault_bump: u8,
    pub turtle_mint: Pubkey,
}

#[account]
pub struct Bet {
    pub player: Pubkey,
    pub amount: u64,
    pub bet_type: BetType,
    pub commitment: [u8; 32],
    pub settled: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BetType {
    Player,
    Banker,
    Tie,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Outcome {
    Player,
    Banker,
    Tie,
}

fn hash_seed(seed: &[u8; 32], bet_type: BetType) -> [u8; 32] {
    use anchor_lang::solana_program::hash::{hashv, Hash};
    let bt = match bet_type {
        BetType::Player => b"player",
        BetType::Banker => b"banker",
        BetType::Tie => b"tie",
    };
    let mut data = Vec::with_capacity(32 + bt.len());
    data.extend_from_slice(seed);
    data.extend_from_slice(bt);
    let hash = hashv(&[&data]);
    *hash.as_ref()
}

#[error_code]
pub enum ErrorCode {
    #[msg("Bet is too small")]
    BetTooSmall,
    #[msg("Bet is too large")]
    BetTooLarge,
    #[msg("Bet already settled")]
    BetAlreadySettled,
    #[msg("Commitment doesn't match")]
    CommitmentMismatch,
    #[msg("Bet type mismatch")]
    BetTypeMismatch,
}
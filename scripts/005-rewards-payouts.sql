-- Rewards and payout ledger for NAPIWAS game
-- Run this in Supabase SQL editor before using /api/rewards

CREATE TABLE IF NOT EXISTS reward_wallets (
  wallet_address TEXT PRIMARY KEY,
  pending_napiwas NUMERIC NOT NULL DEFAULT 0,
  total_earned_napiwas NUMERIC NOT NULL DEFAULT 0,
  total_withdrawn_napiwas NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_boss_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  reward_date DATE NOT NULL,
  boss_level INTEGER NOT NULL CHECK (boss_level > 0),
  reward_napiwas NUMERIC NOT NULL CHECK (reward_napiwas >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet_address, reward_date, boss_level)
);

CREATE TABLE IF NOT EXISTS reward_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  mugs_spent BIGINT NOT NULL CHECK (mugs_spent >= 0),
  napiwas_earned NUMERIC NOT NULL CHECK (napiwas_earned >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reward_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  amount_napiwas NUMERIC NOT NULL CHECK (amount_napiwas > 0),
  status TEXT NOT NULL DEFAULT 'completed',
  provider_check_id TEXT,
  provider_check_url TEXT,
  provider_endpoint TEXT,
  provider_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_boss_rewards_wallet_date
  ON daily_boss_rewards (wallet_address, reward_date);

CREATE INDEX IF NOT EXISTS idx_reward_conversions_wallet
  ON reward_conversions (wallet_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reward_payouts_wallet
  ON reward_payouts (wallet_address, created_at DESC);

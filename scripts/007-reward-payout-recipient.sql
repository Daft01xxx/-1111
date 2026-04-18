-- Adds explicit recipient metadata for withdrawal requests.
-- Safe to run multiple times.

ALTER TABLE reward_payouts
  ADD COLUMN IF NOT EXISTS recipient_address TEXT;

ALTER TABLE reward_payouts
  ADD COLUMN IF NOT EXISTS payout_mode TEXT;

CREATE INDEX IF NOT EXISTS idx_reward_payouts_recipient
  ON reward_payouts (recipient_address, created_at DESC);

-- Runtime hardening patch for production Supabase
-- Makes API contracts consistent without local fallback logic

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- daily_checkins route uses wallet_address directly
ALTER TABLE daily_checkins
  ADD COLUMN IF NOT EXISTS wallet_address TEXT;

UPDATE daily_checkins dc
SET wallet_address = u.wallet_address
FROM users u
WHERE dc.user_id = u.id
  AND dc.wallet_address IS NULL
  AND u.wallet_address IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_daily_checkins_wallet
  ON daily_checkins (wallet_address);

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_checkins_wallet_date_unique
  ON daily_checkins (wallet_address, checkin_date)
  WHERE wallet_address IS NOT NULL;

-- music route uses user_unlocks for tracks and future unlockables
CREATE TABLE IF NOT EXISTS user_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  unlock_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(wallet_address, unlock_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_unlocks_wallet
  ON user_unlocks (wallet_address);

CREATE INDEX IF NOT EXISTS idx_user_unlocks_type_item
  ON user_unlocks (unlock_type, item_id);

-- Enforce "only one open match per player" at DB level
CREATE UNIQUE INDEX IF NOT EXISTS idx_pvp_open_creator_unique
  ON pvp_matches (creator_id)
  WHERE creator_id IS NOT NULL
    AND status IN ('waiting', 'pending', 'active', 'in_progress');

CREATE UNIQUE INDEX IF NOT EXISTS idx_pvp_open_opponent_unique
  ON pvp_matches (opponent_id)
  WHERE opponent_id IS NOT NULL
    AND status IN ('waiting', 'pending', 'active', 'in_progress');

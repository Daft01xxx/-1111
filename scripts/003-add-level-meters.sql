-- Add level and meters columns to leaderboard
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS meters INTEGER DEFAULT 0;
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS bosses_defeated INTEGER DEFAULT 0;

-- Add level and meters to users table as well
ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS meters INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bosses_defeated INTEGER DEFAULT 0;

-- Create unlocked_skins and unlocked_tracks tables if not exist
CREATE TABLE IF NOT EXISTS unlocked_skins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  skin_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wallet_address, skin_id)
);

CREATE TABLE IF NOT EXISTS unlocked_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  track_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wallet_address, track_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_unlocked_skins_wallet ON unlocked_skins(wallet_address);
CREATE INDEX IF NOT EXISTS idx_unlocked_tracks_wallet ON unlocked_tracks(wallet_address);

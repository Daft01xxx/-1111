-- NAPIWAS Game Database Schema
-- Run this migration to set up all required tables

-- Users table - stores player data
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE,
  username TEXT,
  napiwas_balance DECIMAL DEFAULT 0,
  multiplier DECIMAL DEFAULT 1.0,
  high_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  bosses_defeated INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  unlocked_skins TEXT[] DEFAULT '{}',
  unlocked_music TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard table - tracks top scores
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  wallet_address TEXT,
  score INTEGER NOT NULL,
  bosses_defeated INTEGER DEFAULT 0,
  game_duration INTEGER DEFAULT 0,
  multiplier_used DECIMAL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily check-ins table
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  streak_count INTEGER DEFAULT 1,
  bonus_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- DEX tasks for daily bonuses
CREATE TABLE IF NOT EXISTS dex_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  icon TEXT,
  bonus_points INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User completed tasks
CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES dex_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- PvP matches table
CREATE TABLE IF NOT EXISTS pvp_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  bet_amount DECIMAL NOT NULL,
  match_type TEXT DEFAULT 'score', -- 'score' or 'boss'
  target_value INTEGER, -- target score or boss count
  creator_score INTEGER,
  opponent_score INTEGER,
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'waiting', -- waiting, active, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Music tracks table
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT,
  file_url TEXT NOT NULL,
  cover_url TEXT,
  unlock_cost INTEGER DEFAULT 0, -- 0 = free
  unlock_type TEXT DEFAULT 'points', -- 'points', 'boss', 'level'
  unlock_requirement INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  telegram_url TEXT,
  twitter_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game settings table (admin configurable)
CREATE TABLE IF NOT EXISTS game_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default game settings
INSERT INTO game_settings (key, value, description) VALUES
  ('multiplier_tiers', '{"tier1": {"min": 0, "max": 99, "multiplier": 1.0}, "tier2": {"min": 100, "max": 499, "multiplier": 1.1}, "tier3": {"min": 500, "max": 999, "multiplier": 1.25}, "tier4": {"min": 1000, "max": 4999, "multiplier": 1.5}, "tier5": {"min": 5000, "max": null, "multiplier": 2.0}}', 'NAPIWAS balance multiplier tiers'),
  ('pvp_house_fee', '0.05', 'PvP betting house fee percentage'),
  ('daily_checkin_rewards', '[10, 25, 50, 75, 100, 150, 250]', 'Daily check-in streak rewards'),
  ('admin_password', '"napiwasadmin2024"', 'Admin panel password')
ON CONFLICT (key) DO NOTHING;

-- Insert default DEX tasks
INSERT INTO dex_tasks (name, description, url, icon, bonus_points) VALUES
  ('DeDust', 'Trade on DeDust DEX', 'https://dedust.io', 'dedust', 100),
  ('STON.fi', 'Trade on STON.fi', 'https://ston.fi', 'stonfi', 100),
  ('GeckoTerminal', 'Check price on GeckoTerminal', 'https://geckoterminal.com', 'gecko', 50),
  ('DexScreener', 'View on DexScreener', 'https://dexscreener.com', 'dexscreener', 50)
ON CONFLICT DO NOTHING;

-- Insert default partner (v0)
INSERT INTO partners (name, description, logo_url, website_url, is_featured, sort_order) VALUES
  ('v0 by Vercel', 'Built with v0 - AI-powered development', '/images/partners/v0.png', 'https://v0.dev', true, 1)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created ON leaderboard(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pvp_status ON pvp_matches(status);

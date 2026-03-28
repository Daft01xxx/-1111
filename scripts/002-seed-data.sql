-- Seed some sample users and leaderboard entries for demonstration
-- First, create some sample users
INSERT INTO users (wallet_address, username, napiwas_balance, level, meters, bosses_defeated, created_at) VALUES
  ('EQA1234567890abcdef1234567890abcdef12345678', 'BeerMaster', 25000, 15, 150000, 5, NOW() - INTERVAL '7 days'),
  ('EQB1234567890abcdef1234567890abcdef12345678', 'FoamKing', 15000, 12, 120000, 4, NOW() - INTERVAL '5 days'),
  ('EQC1234567890abcdef1234567890abcdef12345678', 'HopHunter', 8000, 9, 90000, 3, NOW() - INTERVAL '3 days'),
  ('EQD1234567890abcdef1234567890abcdef12345678', 'MaltWizard', 3000, 6, 60000, 2, NOW() - INTERVAL '2 days'),
  ('EQE1234567890abcdef1234567890abcdef12345678', 'LagerLord', 500, 4, 40000, 1, NOW() - INTERVAL '1 day')
ON CONFLICT (wallet_address) DO NOTHING;

-- Add leaderboard entries
INSERT INTO leaderboard (wallet_address, username, score, level, meters, bosses_defeated, multiplier_used, created_at)
VALUES
  ('EQA1234567890abcdef1234567890abcdef12345678', 'BeerMaster', 125000, 15, 150000, 5, 1.75, NOW() - INTERVAL '1 day'),
  ('EQB1234567890abcdef1234567890abcdef12345678', 'FoamKing', 98500, 12, 120000, 4, 1.5, NOW() - INTERVAL '2 days'),
  ('EQC1234567890abcdef1234567890abcdef12345678', 'HopHunter', 76200, 9, 90000, 3, 1.25, NOW() - INTERVAL '3 days'),
  ('EQD1234567890abcdef1234567890abcdef12345678', 'MaltWizard', 54300, 6, 60000, 2, 1.1, NOW() - INTERVAL '4 days'),
  ('EQE1234567890abcdef1234567890abcdef12345678', 'LagerLord', 32100, 4, 40000, 1, 1.0, NOW() - INTERVAL '5 days');

-- Add more recent entries for "today" tab
INSERT INTO leaderboard (wallet_address, username, score, level, meters, bosses_defeated, multiplier_used, created_at)
VALUES
  ('EQA1234567890abcdef1234567890abcdef12345678', 'BeerMaster', 45000, 15, 45000, 2, 1.75, NOW() - INTERVAL '2 hours'),
  ('EQB1234567890abcdef1234567890abcdef12345678', 'FoamKing', 38000, 12, 38000, 1, 1.5, NOW() - INTERVAL '4 hours'),
  ('EQC1234567890abcdef1234567890abcdef12345678', 'HopHunter', 29000, 9, 29000, 1, 1.25, NOW() - INTERVAL '6 hours');

-- Add partners
INSERT INTO partners (name, logo_url, website_url, description, sort_order, is_active, is_featured) VALUES
  ('v0 by Vercel', '/images/v0-logo.png', 'https://v0.dev', 'AI-powered development platform that helped build NAPIWAS game', 1, true, true),
  ('TON Blockchain', '/images/ton-logo.png', 'https://ton.org', 'The Open Network - the blockchain powering NAPIWAS', 2, true, true),
  ('MOMO', '/images/momo-logo.png', 'https://t.me/momo_token', 'MOMO community - our partner in the TON ecosystem', 3, true, false),
  ('ARNI', '/images/arni-logo.png', 'https://t.me/arni_token', 'ARNI - a friendly meme token project', 4, true, false),
  ('DeDust', '/images/dedust-logo.png', 'https://dedust.io', 'Trade NAPIWAS on DeDust - the premier DEX on TON', 5, true, false),
  ('STON.fi', '/images/stonfi-logo.png', 'https://ston.fi', 'Swap and provide liquidity for NAPIWAS on STON.fi', 6, true, false)
ON CONFLICT DO NOTHING;

-- Add DEX tasks
INSERT INTO dex_tasks (name, description, bonus_points, url, icon, is_active) VALUES
  ('Trade on DeDust', 'Make any trade on DeDust DEX', 500, 'https://dedust.io', 'swap', true),
  ('Add Liquidity DeDust', 'Provide liquidity to NAPIWAS pool on DeDust', 1000, 'https://dedust.io', 'droplet', true),
  ('Trade on STON.fi', 'Make any trade on STON.fi DEX', 500, 'https://ston.fi', 'swap', true),
  ('Add Liquidity STON.fi', 'Provide liquidity to NAPIWAS pool on STON.fi', 1000, 'https://ston.fi', 'droplet', true),
  ('Join Telegram', 'Join NAPIWAS official Telegram group', 200, 'https://t.me/napiwas', 'message', true),
  ('Follow Twitter', 'Follow NAPIWAS on Twitter/X', 200, 'https://twitter.com/napiwas', 'twitter', true)
ON CONFLICT DO NOTHING;

-- Add some music tracks
INSERT INTO music_tracks (title, artist, file_url, cover_url, unlock_type, unlock_requirement, sort_order, is_active) VALUES
  ('Beer O Clock', 'NAPIWAS Band', '/music/beer-oclock.mp3', '/images/track1.jpg', 'free', 0, 1, true),
  ('Foam Party', 'DJ Lager', '/music/foam-party.mp3', '/images/track2.jpg', 'level', 5, 2, true),
  ('Golden Ale Anthem', 'The Hops', '/music/golden-ale.mp3', '/images/track3.jpg', 'level', 10, 3, true),
  ('Midnight Stout', 'Dark Malt', '/music/midnight-stout.mp3', '/images/track4.jpg', 'score', 50000, 4, true),
  ('IPA Dreams', 'Hoppy Days', '/music/ipa-dreams.mp3', '/images/track5.jpg', 'boss', 3, 5, true)
ON CONFLICT DO NOTHING;

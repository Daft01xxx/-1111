-- Seed some sample users and leaderboard entries for demonstration
-- First, create some sample users
INSERT INTO users (wallet_address, username, napiwas_balance, created_at) VALUES
  ('EQA1234567890abcdef1234567890abcdef12345678', 'BeerMaster', 25000, NOW() - INTERVAL '7 days'),
  ('EQB1234567890abcdef1234567890abcdef12345678', 'FoamKing', 15000, NOW() - INTERVAL '5 days'),
  ('EQC1234567890abcdef1234567890abcdef12345678', 'HopHunter', 8000, NOW() - INTERVAL '3 days'),
  ('EQD1234567890abcdef1234567890abcdef12345678', 'MaltWizard', 3000, NOW() - INTERVAL '2 days'),
  ('EQE1234567890abcdef1234567890abcdef12345678', 'LagerLord', 500, NOW() - INTERVAL '1 day')
ON CONFLICT (wallet_address) DO NOTHING;

-- Add leaderboard entries
INSERT INTO leaderboard (user_id, score, level, bosses_defeated, multiplier, created_at)
SELECT 
  id, 
  CASE 
    WHEN username = 'BeerMaster' THEN 125000
    WHEN username = 'FoamKing' THEN 98500
    WHEN username = 'HopHunter' THEN 76200
    WHEN username = 'MaltWizard' THEN 54300
    WHEN username = 'LagerLord' THEN 32100
  END,
  CASE 
    WHEN username = 'BeerMaster' THEN 15
    WHEN username = 'FoamKing' THEN 12
    WHEN username = 'HopHunter' THEN 9
    WHEN username = 'MaltWizard' THEN 6
    WHEN username = 'LagerLord' THEN 4
  END,
  CASE 
    WHEN username = 'BeerMaster' THEN 5
    WHEN username = 'FoamKing' THEN 4
    WHEN username = 'HopHunter' THEN 3
    WHEN username = 'MaltWizard' THEN 2
    WHEN username = 'LagerLord' THEN 1
  END,
  CASE 
    WHEN username = 'BeerMaster' THEN 1.75
    WHEN username = 'FoamKing' THEN 1.5
    WHEN username = 'HopHunter' THEN 1.25
    WHEN username = 'MaltWizard' THEN 1.1
    WHEN username = 'LagerLord' THEN 1.0
  END,
  NOW() - INTERVAL '1 day' * RANDOM() * 7
FROM users 
WHERE username IN ('BeerMaster', 'FoamKing', 'HopHunter', 'MaltWizard', 'LagerLord');

-- Add more recent entries for "today" tab
INSERT INTO leaderboard (user_id, score, level, bosses_defeated, multiplier, created_at)
SELECT 
  id, 
  FLOOR(RANDOM() * 50000 + 10000),
  FLOOR(RANDOM() * 10 + 1),
  FLOOR(RANDOM() * 3),
  1.0 + RANDOM() * 0.5,
  NOW() - INTERVAL '1 hour' * RANDOM() * 12
FROM users 
WHERE username IN ('BeerMaster', 'FoamKing', 'HopHunter')
LIMIT 3;

-- Add partners
INSERT INTO partners (name, logo_url, website_url, description, order_index, is_active) VALUES
  ('v0 by Vercel', '/images/v0-logo.png', 'https://v0.dev', 'AI-powered development platform that helped build NAPIWAS game. Fast, beautiful, and smart.', 1, true),
  ('TON Blockchain', '/images/ton-logo.png', 'https://ton.org', 'The Open Network - the blockchain powering NAPIWAS. Fast, secure, and decentralized.', 2, true),
  ('MOMO', '/images/momo-logo.png', 'https://t.me/momo_token', 'MOMO community - our partner in the TON ecosystem. Strong together!', 3, true),
  ('ARNI', '/images/arni-logo.png', 'https://t.me/arni_token', 'ARNI - a friendly meme token project. Fun times ahead!', 4, true),
  ('DeDust', '/images/dedust-logo.png', 'https://dedust.io', 'Trade NAPIWAS on DeDust - the premier DEX on TON.', 5, true),
  ('STON.fi', '/images/stonfi-logo.png', 'https://ston.fi', 'Swap and provide liquidity for NAPIWAS on STON.fi DEX.', 6, true)
ON CONFLICT DO NOTHING;

-- Add DEX tasks
INSERT INTO dex_tasks (name, description, points, url, platform, is_active) VALUES
  ('Trade on DeDust', 'Make any trade on DeDust DEX', 500, 'https://dedust.io', 'dedust', true),
  ('Add Liquidity on DeDust', 'Provide liquidity to NAPIWAS pool on DeDust', 1000, 'https://dedust.io', 'dedust', true),
  ('Trade on STON.fi', 'Make any trade on STON.fi DEX', 500, 'https://ston.fi', 'stonfi', true),
  ('Add Liquidity on STON.fi', 'Provide liquidity to NAPIWAS pool on STON.fi', 1000, 'https://ston.fi', 'stonfi', true),
  ('Join Telegram', 'Join NAPIWAS official Telegram group', 200, 'https://t.me/napiwas', 'telegram', true),
  ('Follow Twitter', 'Follow NAPIWAS on Twitter/X', 200, 'https://twitter.com/napiwas', 'twitter', true)
ON CONFLICT DO NOTHING;

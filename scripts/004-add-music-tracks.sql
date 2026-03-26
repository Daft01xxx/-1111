-- Add 10 music tracks for the NAPIWAS game
-- These tracks use royalty-free music URLs from various sources

DELETE FROM music_tracks;

INSERT INTO music_tracks (title, artist, url, unlock_score, is_active) VALUES
  ('Neon Dreams', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', 0, true),
  ('Electric Pulse', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b0939c6.mp3', 1000, true),
  ('Cyber Chase', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7342.mp3', 5000, true),
  ('Retro Wave', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', 10000, true),
  ('Pixel Hero', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3', 25000, true),
  ('Boss Battle', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', 50000, true),
  ('Victory March', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b32e02f9.mp3', 75000, true),
  ('Synthwave Night', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3', 100000, true),
  ('Cosmic Journey', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_67bcb0b7ea.mp3', 150000, true),
  ('Ultimate Power', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2023/09/04/audio_c8f48b4424.mp3', 250000, true);

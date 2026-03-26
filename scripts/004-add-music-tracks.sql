-- Add 10 music tracks for the NAPIWAS game
-- Using correct column names: file_url, unlock_type, unlock_requirement

DELETE FROM music_tracks;

INSERT INTO music_tracks (title, artist, file_url, cover_url, unlock_type, unlock_requirement, unlock_cost, sort_order, is_active) VALUES
  ('Neon Dreams', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', '', 'free', 0, 0, 1, true),
  ('Electric Pulse', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b0939c6.mp3', '', 'score', 1000, 0, 2, true),
  ('Cyber Chase', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7342.mp3', '', 'score', 5000, 0, 3, true),
  ('Retro Wave', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', '', 'score', 10000, 0, 4, true),
  ('Pixel Hero', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3', '', 'score', 25000, 0, 5, true),
  ('Boss Battle', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', '', 'score', 50000, 0, 6, true),
  ('Victory March', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b32e02f9.mp3', '', 'score', 75000, 0, 7, true),
  ('Synthwave Night', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3', '', 'score', 100000, 0, 8, true),
  ('Cosmic Journey', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_67bcb0b7ea.mp3', '', 'score', 150000, 0, 9, true),
  ('Ultimate Power', 'NAPIWAS', 'https://cdn.pixabay.com/download/audio/2023/09/04/audio_c8f48b4424.mp3', '', 'score', 250000, 0, 10, true);

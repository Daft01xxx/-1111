'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/store';
import { Trophy, Heart, Play, Pause, RotateCcw, Volume2, VolumeX, ChevronLeft, ChevronRight, Target, Zap, Flame, Star, Info, Beer, Crosshair, Orbit, Sparkles, Snowflake } from 'lucide-react';

// ============================================================================
// ARTERY LEBEDEV INSPIRED DESIGN - Bold, Modern, Playful
// ============================================================================

type GameState = 'menu' | 'info' | 'playing' | 'boss' | 'gameover' | 'paused';
type EntityType = 'cat' | 'goldCat' | 'life' | 'bomb' | 'beerMug' | 'fox' | 'wolf' | 'raccoon' | 'tetris' | 'skillMagnet' | 'skillReflect' | 'skillDouble' | 'skillSlowmo' | 'skillShield' | 'skillKraken' | 'miniNyan' | 'weaponSpread' | 'weaponLaser' | 'weaponChainsaw' | 'weaponMissile' | 'weaponPaw' | 'weaponBeer' | 'weaponIce' | 'guitar' | 'piano' | 'spikeLeft' | 'spikeRight' | 'tunnelTop' | 'tunnelBottom';
type WeaponType = 'standard' | 'spread' | 'laser' | 'chainsaw' | 'missile' | 'paw' | 'beer' | 'ice';
type SkillType = 'magnet' | 'reflect' | 'double' | 'slowmo' | 'shield' | 'kraken';

interface Skill {
  id: SkillType;
  name: string;
  emoji: string;
  color: string;
  duration: number;
}

interface Entity {
  id: number;
  type: EntityType;
  x: number;
  y: number;
  speed: number;
  vx: number;
  vy?: number;
  rotation?: number;
  caught: boolean;
  value: number;
  wobble: number;
  lastHitAt?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape: 'circle' | 'star' | 'square' | 'spark';
}

interface SparkRing {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  color: string;
  width: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
  color: string;
  scale: number;
  rotation: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: WeaponType;
  isEnemy?: boolean;
  // Special properties for advanced weapons
  homingTarget?: { x: number; y: number } | null;
  explosionRadius?: number;
  freezeDuration?: number;
  isFrostProc?: boolean;
  rotation?: number;
}

interface Boss {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  direction: number;
  shootTimer: number;
  moveTimer: number;
  attackPattern: number;
  invulnerable: boolean;
  hitFlash: number;
  type: number; // Boss type (0-6) for different appearances
  color: string; // Boss color theme
  weaponType: 'spread' | 'laser' | 'rapid' | 'homing' | 'wave' | 'chainsaw' | 'furball' | 'notes' | 'strings' | 'pianoStrings' | 'pianoLid' | 'terminatorLaser' | 'cards';
}

type PvpUiMatchType = 'score' | 'bosses';

interface PvpUiSummary {
  status: string;
  matchType: PvpUiMatchType;
  myMetric: number;
  opponentMetric: number | null;
  didWin: boolean | null;
}

interface PvpMatchSnapshot {
  id: string;
  status: string | null;
  match_type: string | null;
  winner_id: string | null;
  creator_id: string | null;
  opponent_id: string | null;
  creator_score: number | null;
  opponent_score: number | null;
  bet_amount: number | null;
}

// ============================================================================
// CONSTANTS - TUNED FOR FUN
// ============================================================================

const BASE_WIDTH = 320;
const BASE_HEIGHT = 420;

// Player
const PLAYER_WIDTH = 44;
const PLAYER_HEIGHT = 50;
const PLAYER_SPEED = 10;

// Entities
const CAT_SIZE = 30;
const GOLD_CAT_SIZE = 26;

// Game Balance
const BASE_SPAWN_RATE = 1600;
const MIN_SPAWN_RATE = 500;
const CAT_FALL_SPEED = 2;
const BOSS_APPEAR_SCORE = 500;
const BOSS_COOLDOWN = 30000; // 30 seconds normal gameplay after boss
const MAX_LIVES = 15;
const BOMB_PENALTY = 100;
const BEER_MUG_DURATION = 5000;
const LOCAL_PVP_MATCHES_KEY = 'napiwas-local-pvp-matches-v1';
const LOCAL_PVP_GUEST_ID_KEY = 'napiwas-pvp-guest-id-v1';
const RUN_UNLOCKED_WEAPONS_KEY = 'napiwas-run-unlocked-weapons-v1';

// Visual Theme - Lebedev Style (Bold, Contrasty)
const THEME = {
  bg: '#0D0D12',
  grid: 'rgba(255, 255, 255, 0.03)',
  gold: '#FFD93D',
  red: '#FF4757',
  green: '#2ED573',
  blue: '#3742FA',
  purple: '#A55EEA',
  orange: '#FF7F50',
  pink: '#FF6B9D',
  cyan: '#00D2D3',
  white: '#FFFFFF',
  dark: '#1E1E2E',
};

// Skills that drop during gameplay - all last 10 seconds
const SKILLS: Record<SkillType, Skill> = {
  magnet: { id: 'magnet', name: 'MAGNET', emoji: '🧲', color: '#00D2D3', duration: 10000 },
  reflect: { id: 'reflect', name: 'REFLECTOR', emoji: '🛡️', color: '#3742FA', duration: 10000 },
  double: { id: 'double', name: 'DOUBLE SHOT', emoji: '🔫', color: '#FF4757', duration: 10000 },
  slowmo: { id: 'slowmo', name: 'TIME WARP', emoji: '⏱️', color: '#A55EEA', duration: 10000 },
  shield: { id: 'shield', name: 'GUARDIAN', emoji: '⛨', color: '#2ED573', duration: 10000 },
  kraken: { id: 'kraken', name: 'KRAKEN', emoji: '🦑', color: '#FF1493', duration: 10000 }
};

const SKILL_TYPES: SkillType[] = ['magnet', 'reflect', 'double', 'slowmo', 'shield', 'kraken'];

// Weapons
const WEAPONS = {
  standard: { name: 'BEER', cooldown: 140, damage: 1, color: '#FFD93D', speed: 14 },
  spread: { name: 'FOAM', cooldown: 260, damage: 1, color: '#FF7F50', speed: 11 },
  laser: { name: 'LASER', cooldown: 380, damage: 3, color: '#FF4757', speed: 22 },
  chainsaw: { name: 'CHAINSAW', cooldown: 200, damage: 2, color: '#FF0000', speed: 18 },
  missile: { name: 'MISSILE', cooldown: 450, damage: 4, color: '#FF6B00', speed: 10, homing: true },
  paw: { name: 'PAW', cooldown: 180, damage: 2, color: '#FF69B4', speed: 12 },
  beer: { name: 'BOTTLE', cooldown: 320, damage: 2, color: '#00AA00', speed: 9, explosive: true },
  ice: { name: 'ICE', cooldown: 400, damage: 1, color: '#00D2D3', speed: 13, freeze: true },
};

const WEAPON_TYPES: WeaponType[] = ['standard', 'spread', 'laser', 'chainsaw', 'missile', 'paw', 'beer', 'ice'];

const UPGRADE_ENTITY_TYPES: EntityType[] = [
  'beerMug',
  'skillMagnet',
  'skillReflect',
  'skillDouble',
  'skillSlowmo',
  'skillShield',
  'skillKraken',
  'weaponSpread',
  'weaponLaser',
  'weaponChainsaw',
  'weaponMissile',
  'weaponPaw',
  'weaponBeer',
  'weaponIce',
];

const PROJECTILE_INTERCEPT_RADIUS: Record<WeaponType, number> = {
  standard: 20,
  spread: 21,
  laser: 22,
  chainsaw: 24,
  missile: 22,
  paw: 21,
  beer: 28,
  ice: 24,
};

const PROJECTILE_INTERCEPT_EVERY = 4; // exactly 1 successful interception per 4 interception attempts

const ULTIMATE_CHARGE_MS = 60000;
const ULTIMATE_DURATION_MS = 5000;
const ULTIMATE_DAMAGE_MULTIPLIER = 3;

const getOrCreateLocalPvpPlayerId = (): string => {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(LOCAL_PVP_GUEST_ID_KEY);
  if (existing) return existing;
  const created = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(LOCAL_PVP_GUEST_ID_KEY, created);
  return created;
};

const readPersistedRunUnlockedWeapons = (): WeaponType[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RUN_UNLOCKED_WEAPONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is WeaponType => typeof entry === 'string' && WEAPON_TYPES.includes(entry as WeaponType)) as WeaponType[];
  } catch {
    return [];
  }
};

const persistRunUnlockedWeapon = (weaponType: WeaponType) => {
  if (typeof window === 'undefined') return;
  try {
    const current = new Set(readPersistedRunUnlockedWeapons());
    current.add(weaponType);
    localStorage.setItem(RUN_UNLOCKED_WEAPONS_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // Ignore storage errors; store unlock still applies.
  }
};

// Sound System with Music
class SoundManager {
  ctx: AudioContext | null = null;
  sfxEnabled = true;
  musicEnabled = true;
  musicElement: HTMLAudioElement | null = null;
  musicVolume = 0.4;
  initialized = false;
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Create music element
      this.musicElement = new Audio('/audio/napiwas-game-main.mp3');
      this.musicElement.loop = true;
      this.musicElement.volume = this.musicVolume;
    }
  }

  setMusicTrack(src: string) {
    if (!this.musicElement || !src) return;
    const wasPlaying = !this.musicElement.paused;
    this.musicElement.pause();
    this.musicElement.src = src;
    this.musicElement.load();
    if (wasPlaying && this.musicEnabled) {
      void this.musicElement.play().catch(() => {});
    }
  }
  
  async init() {
    // Create AudioContext on first user interaction
    if (!this.ctx && typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    
    this.initialized = true;
    
    // Start music if enabled
    if (this.musicEnabled && this.musicElement) {
      this.musicElement.currentTime = 0;
      await this.musicElement.play().catch(() => {});
    }
  }
  
  // SFX toggle
  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }
  
  // Music toggle
  async toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicElement) {
      if (this.musicEnabled) {
        try {
          await this.musicElement.play();
        } catch (e) {
          // Autoplay blocked
        }
      } else {
        this.musicElement.pause();
      }
    }
    return this.musicEnabled;
  }
  
  // Play background music
  async playMusic() {
    if (this.musicElement && this.musicEnabled) {
      this.musicElement.currentTime = 0;
      try {
        await this.musicElement.play();
      } catch (e) {
        // Autoplay blocked, will retry on next interaction
      }
    }
  }
  
  // Stop background music
  stopMusic() {
    if (this.musicElement) {
      this.musicElement.pause();
      this.musicElement.currentTime = 0;
    }
  }
  
  // Pause music (for game over)
  pauseMusic() {
    if (this.musicElement) {
      this.musicElement.pause();
    }
  }
  
  async ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }
  
  playTone(freq: number, duration: number, type: OscillatorType = 'square', vol = 0.12) {
    if (!this.sfxEnabled) return;
    
    // Ensure context exists
    if (!this.ctx) {
      this.ensureContext().then(() => {
        if (this.ctx) this._playToneInternal(freq, duration, type, vol);
      });
      return;
    }
    
    this._playToneInternal(freq, duration, type, vol);
  }
  
  private _playToneInternal(freq: number, duration: number, type: OscillatorType, vol: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
  
  playShoot(type: WeaponType) {
    const freq = type === 'laser' ? 900 : type === 'spread' ? 500 : 700;
    this.playTone(freq, 0.06, 'square', 0.1);
  }
  
  playCatch() {
    this.playTone(600, 0.08, 'sine', 0.12);
    setTimeout(() => this.playTone(800, 0.08, 'sine', 0.1), 40);
  }
  
  playGoldCatch() {
    this.playTone(880, 0.12, 'sine', 0.14);
    setTimeout(() => this.playTone(1100, 0.1, 'sine', 0.12), 60);
  }
  
  playHit() {
    this.playTone(120, 0.25, 'sawtooth', 0.15);
  }
  
  playBossHit() {
    this.playTone(180, 0.12, 'square', 0.14);
  }
  
  playBossDefeat() {
    [523, 659, 783, 1046, 1318].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.25, 'square', 0.1), i * 80);
    });
  }
  
  playLifeUp() {
    this.playTone(523, 0.08, 'sine', 0.1);
    setTimeout(() => this.playTone(659, 0.08, 'sine', 0.1), 60);
    setTimeout(() => this.playTone(783, 0.12, 'sine', 0.1), 120);
  }
  
  playGameOver() {
    [440, 349, 293, 220, 165].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.35, 'sawtooth', 0.15), i * 150);
    });
  }
  
  playPowerUp() {
    this.playTone(660, 0.08, 'square', 0.1);
    setTimeout(() => this.playTone(880, 0.15, 'square', 0.1), 80);
  }
  
  playBonus() {
    this.playTone(700, 0.1, 'sine', 0.12);
    setTimeout(() => this.playTone(900, 0.1, 'sine', 0.1), 50);
  }
}

const soundManager = new SoundManager();

// ============================================================================
// RENDER HELPERS - LEBEDEV STYLE
// ============================================================================

const PLAYER_SKINS: Record<string, { fur: string; furMid: string; furDark: string; eye: string; ring: string }> = {
  orange_cat: { fur: '#FFAA44', furMid: '#E8933A', furDark: '#CC7722', eye: '#4CAF50', ring: '#FFD93D' },
  gray_cat: { fur: '#C6CDD8', furMid: '#9AA5B3', furDark: '#6B7280', eye: '#5EEAD4', ring: '#E5E7EB' },
  black_cat: { fur: '#4B5563', furMid: '#374151', furDark: '#111827', eye: '#FBBF24', ring: '#6B7280' },
  white_cat: { fur: '#F8FAFC', furMid: '#E2E8F0', furDark: '#CBD5E1', eye: '#60A5FA', ring: '#F8FAFC' },
  calico_cat: { fur: '#F59E0B', furMid: '#D97706', furDark: '#92400E', eye: '#34D399', ring: '#F59E0B' },
  siamese_cat: { fur: '#EABF8A', furMid: '#C69E72', furDark: '#8B5E3C', eye: '#60A5FA', ring: '#D6B38B' },
  ginger_ninja: { fur: '#F97316', furMid: '#EA580C', furDark: '#9A3412', eye: '#FDE047', ring: '#F97316' },
  cosmic_cat: { fur: '#A78BFA', furMid: '#8B5CF6', furDark: '#4C1D95', eye: '#22D3EE', ring: '#8B5CF6' },
  golden_emperor: { fur: '#FCD34D', furMid: '#F59E0B', furDark: '#B45309', eye: '#2563EB', ring: '#FCD34D' },
  napiwas_legend: { fur: '#FB923C', furMid: '#F97316', furDark: '#9A3412', eye: '#34D399', ring: '#FB923C' },
}

// Cat Coin Player - Based on the uploaded image
const drawCatCoinPlayer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  weapon: WeaponType,
  wobble: number,
  skinId: string
) => {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(Math.sin(wobble) * 0.05);
  
  const size = Math.min(width, height) * 0.9;
  const weaponColor = weapon === 'laser' ? '#FF4757' : weapon === 'spread' ? '#FF7F50' : '#FFD93D';
  
  // Glow effect based on weapon
  ctx.shadowColor = weaponColor;
  ctx.shadowBlur = 15 + Math.sin(wobble * 3) * 5;
  
  const skin = PLAYER_SKINS[skinId] ?? PLAYER_SKINS.orange_cat;

  // Outer ring (skin accent)
  const ringGrad = ctx.createRadialGradient(0, 0, size * 0.35, 0, 0, size * 0.5);
  ringGrad.addColorStop(0, skin.ring);
  ringGrad.addColorStop(0.7, skin.furMid);
  ringGrad.addColorStop(1, skin.furDark);
  ctx.fillStyle = ringGrad;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner dark background
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2);
  ctx.fill();
  
  // Decorative laurel leaves (simplified)
  ctx.strokeStyle = '#D4AC0D';
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const leafX = Math.cos(angle) * size * 0.38;
    const leafY = Math.sin(angle) * size * 0.38;
    ctx.beginPath();
    ctx.arc(leafX, leafY, 3, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Cat face - orange/ginger
  const faceGrad = ctx.createRadialGradient(-size * 0.08, -size * 0.08, 0, 0, 0, size * 0.28);
  faceGrad.addColorStop(0, skin.fur);
  faceGrad.addColorStop(0.6, skin.furMid);
  faceGrad.addColorStop(1, skin.furDark);
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.02, size * 0.28, size * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // White muzzle/chest
  ctx.fillStyle = '#F5F5F5';
  ctx.beginPath();
  ctx.ellipse(0, size * 0.18, size * 0.18, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Cat ears
  ctx.fillStyle = skin.furMid;
  // Left ear
  ctx.beginPath();
  ctx.moveTo(-size * 0.18, -size * 0.18);
  ctx.lineTo(-size * 0.22, -size * 0.32);
  ctx.lineTo(-size * 0.08, -size * 0.22);
  ctx.closePath();
  ctx.fill();
  // Right ear
  ctx.beginPath();
  ctx.moveTo(size * 0.08, -size * 0.22);
  ctx.lineTo(size * 0.22, -size * 0.32);
  ctx.lineTo(size * 0.18, -size * 0.18);
  ctx.closePath();
  ctx.fill();
  
  // Inner ears (pink)
  ctx.fillStyle = '#FFB6C1';
  ctx.beginPath();
  ctx.moveTo(-size * 0.16, -size * 0.18);
  ctx.lineTo(-size * 0.18, -size * 0.28);
  ctx.lineTo(-size * 0.1, -size * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.1, -size * 0.2);
  ctx.lineTo(size * 0.18, -size * 0.28);
  ctx.lineTo(size * 0.16, -size * 0.18);
  ctx.closePath();
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = skin.eye;
  ctx.shadowColor = skin.eye;
  ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.ellipse(-size * 0.1, -size * 0.05, size * 0.06, size * 0.07, 0, 0, Math.PI * 2);
  ctx.ellipse(size * 0.1, -size * 0.05, size * 0.06, size * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Eye pupils
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(-size * 0.1, -size * 0.05, size * 0.025, size * 0.04, 0, 0, Math.PI * 2);
  ctx.ellipse(size * 0.1, -size * 0.05, size * 0.025, size * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye highlights
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-size * 0.08, -size * 0.07, size * 0.02, 0, Math.PI * 2);
  ctx.arc(size * 0.12, -size * 0.07, size * 0.02, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose (pink)
  ctx.fillStyle = '#FFB6C1';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.02);
  ctx.lineTo(-size * 0.025, size * 0.06);
  ctx.lineTo(size * 0.025, size * 0.06);
  ctx.closePath();
  ctx.fill();
  
  // Whiskers
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-size * 0.15, size * 0.04);
  ctx.lineTo(-size * 0.28, size * 0.02);
  ctx.moveTo(-size * 0.15, size * 0.07);
  ctx.lineTo(-size * 0.28, size * 0.08);
  ctx.moveTo(size * 0.15, size * 0.04);
  ctx.lineTo(size * 0.28, size * 0.02);
  ctx.moveTo(size * 0.15, size * 0.07);
  ctx.lineTo(size * 0.28, size * 0.08);
  ctx.stroke();
  
  // Beer mug at bottom (simplified)
  const mugY = size * 0.28;
  ctx.fillStyle = '#8B4513';
  roundRect(ctx, -size * 0.1, mugY - size * 0.08, size * 0.2, size * 0.16, 3);
  ctx.fill();
  
  // Beer foam
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, -size * 0.08, mugY - size * 0.1, size * 0.16, size * 0.05, 2);
  ctx.fill();
  
  // Beer liquid (golden)
  ctx.fillStyle = '#FFD93D';
  roundRect(ctx, -size * 0.08, mugY - size * 0.04, size * 0.16, size * 0.1, 2);
  ctx.fill();
  
  // Infinity symbol at top (decorative)
  ctx.strokeStyle = '#D4AC0D';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-size * 0.06, -size * 0.32, size * 0.04, 0, Math.PI * 2);
  ctx.arc(size * 0.06, -size * 0.32, size * 0.04, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const drawCat = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isGold: boolean, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble) * 0.08);
  
  const color = isGold ? '#FFD93D' : '#C4A35A';
  const shadow = isGold ? '#D4AC0D' : '#A0824D';
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, size/2 - 2, size/2.2, size/6, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Body
  const bodyGrad = ctx.createRadialGradient(-size/4, -size/4, 0, 0, 0, size/1.5);
  bodyGrad.addColorStop(0, color);
  bodyGrad.addColorStop(1, shadow);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, size/2, size/2.5, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Ears
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.moveTo(-size/3, -size/3);
  ctx.lineTo(-size/2.5, -size/1.6);
  ctx.lineTo(-size/6, -size/2.8);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(size/6, -size/2.8);
  ctx.lineTo(size/2.5, -size/1.6);
  ctx.lineTo(size/3, -size/3);
  ctx.closePath();
  ctx.fill();
  
  // Inner ears
  ctx.fillStyle = '#FF9999';
  ctx.beginPath();
  ctx.moveTo(-size/3.2, -size/3.2);
  ctx.lineTo(-size/2.8, -size/1.8);
  ctx.lineTo(-size/5, -size/3);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(size/5, -size/3);
  ctx.lineTo(size/2.8, -size/1.8);
  ctx.lineTo(size/3.2, -size/3.2);
  ctx.closePath();
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(-size/5, -size/12, 4, 5, 0, 0, Math.PI*2);
  ctx.ellipse(size/5, -size/12, 4, 5, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-size/5 + 1.5, -size/12 - 1.5, 1.5, 0, Math.PI*2);
  ctx.arc(size/5 + 1.5, -size/12 - 1.5, 1.5, 0, Math.PI*2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = '#FF9999';
  ctx.beginPath();
  ctx.moveTo(0, size/20);
  ctx.lineTo(-3, size/8);
  ctx.lineTo(3, size/8);
  ctx.closePath();
  ctx.fill();
  
  // Mouth
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, size/8);
  ctx.quadraticCurveTo(-size/8, size/5, -size/6, size/4);
  ctx.moveTo(0, size/8);
  ctx.quadraticCurveTo(size/8, size/5, size/6, size/4);
  ctx.stroke();
  
  // Whiskers
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-size/3, 0);
  ctx.lineTo(-size/1.3, -size/10);
  ctx.moveTo(-size/3, size/10);
  ctx.lineTo(-size/1.3, size/10);
  ctx.moveTo(size/3, 0);
  ctx.lineTo(size/1.3, -size/10);
  ctx.moveTo(size/3, size/10);
  ctx.lineTo(size/1.3, size/10);
  ctx.stroke();
  
  // Gold sparkle for gold cats
  if (isGold) {
    const sparkleAlpha = (Math.sin(wobble * 3) + 1) / 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
    ctx.beginPath();
    ctx.arc(-size/3, -size/3, 3, 0, Math.PI*2);
    ctx.fill();
    
    ctx.strokeStyle = `rgba(255, 215, 0, ${sparkleAlpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size/3 - 5, -size/3);
    ctx.lineTo(-size/3 + 5, -size/3);
    ctx.moveTo(-size/3, -size/3 - 5);
    ctx.lineTo(-size/3, -size/3 + 5);
    ctx.stroke();
  }
  
  ctx.restore();
};

const drawFox = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble) * 0.1);
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, size/2 - 2, size/2.2, size/6, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Body - orange
  const bodyGrad = ctx.createRadialGradient(-size/4, -size/4, 0, 0, 0, size/1.5);
  bodyGrad.addColorStop(0, '#FF7F50');
  bodyGrad.addColorStop(1, '#E85D04');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, size/2, size/2.5, 0, 0, Math.PI*2);
  ctx.fill();
  
  // White belly
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(0, size/5, size/3.5, size/5, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Pointy ears
  ctx.fillStyle = '#E85D04';
  ctx.beginPath();
  ctx.moveTo(-size/3, -size/3);
  ctx.lineTo(-size/2.2, -size/1.4);
  ctx.lineTo(-size/8, -size/2.5);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(size/8, -size/2.5);
  ctx.lineTo(size/2.2, -size/1.4);
  ctx.lineTo(size/3, -size/3);
  ctx.closePath();
  ctx.fill();
  
  // White ear tips
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-size/3.2, -size/3);
  ctx.lineTo(-size/2.5, -size/1.6);
  ctx.lineTo(-size/6, -size/2.8);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(size/6, -size/2.8);
  ctx.lineTo(size/2.5, -size/1.6);
  ctx.lineTo(size/3.2, -size/3);
  ctx.closePath();
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(-size/5, -size/12, 3.5, 4.5, 0, 0, Math.PI*2);
  ctx.ellipse(size/5, -size/12, 3.5, 4.5, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(0, size/15, 3, 0, Math.PI*2);
  ctx.fill();
  
  // Tail
  ctx.strokeStyle = '#E85D04';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size/2, size/4);
  ctx.quadraticCurveTo(-size, size/3, -size*0.8, 0);
  ctx.stroke();
  
  // White tail tip
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-size*0.85, size/8);
  ctx.lineTo(-size*0.8, 0);
  ctx.stroke();
  
  ctx.restore();
};

const drawWolf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble) * 0.08);
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, size/2 - 2, size/2.2, size/6, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Body - gray
  const bodyGrad = ctx.createRadialGradient(-size/4, -size/4, 0, 0, 0, size/1.5);
  bodyGrad.addColorStop(0, '#A0A0A0');
  bodyGrad.addColorStop(1, '#606060');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, size/2, size/2.5, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Ears
  ctx.fillStyle = '#505050';
  ctx.beginPath();
  ctx.moveTo(-size/3, -size/3);
  ctx.lineTo(-size/2.5, -size/1.5);
  ctx.lineTo(-size/8, -size/2.5);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(size/8, -size/2.5);
  ctx.lineTo(size/2.5, -size/1.5);
  ctx.lineTo(size/3, -size/3);
  ctx.closePath();
  ctx.fill();
  
  // Eyes (glowing)
  ctx.fillStyle = '#00FF88';
  ctx.shadowColor = '#00FF88';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(-size/5, -size/12, 4, 5, 0, 0, Math.PI*2);
  ctx.ellipse(size/5, -size/12, 4, 5, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Pupils
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-size/5, -size/12, 2, 0, Math.PI*2);
  ctx.arc(size/5, -size/12, 2, 0, Math.PI*2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(0, size/15, 3, 0, Math.PI*2);
  ctx.fill();
  
  // Fangs
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-4, size/8);
  ctx.lineTo(-2, size/4);
  ctx.lineTo(0, size/8);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(0, size/8);
  ctx.lineTo(2, size/4);
  ctx.lineTo(4, size/8);
  ctx.fill();
  
  ctx.restore();
};

const drawRaccoon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble) * 0.12);
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, size/2 - 2, size/2.2, size/6, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Body - gray
  const bodyGrad = ctx.createRadialGradient(-size/4, -size/4, 0, 0, 0, size/1.5);
  bodyGrad.addColorStop(0, '#808080');
  bodyGrad.addColorStop(1, '#505050');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, size/2, size/2.5, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Black mask
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(-size/5, -size/12, size/4, size/6, -0.2, 0, Math.PI*2);
  ctx.ellipse(size/5, -size/12, size/4, size/6, 0.2, 0, Math.PI*2);
  ctx.fill();
  
  // Ears
  ctx.fillStyle = '#505050';
  ctx.beginPath();
  ctx.moveTo(-size/3, -size/3);
  ctx.lineTo(-size/2.5, -size/1.5);
  ctx.lineTo(-size/8, -size/2.5);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(size/8, -size/2.5);
  ctx.lineTo(size/2.5, -size/1.5);
  ctx.lineTo(size/3, -size/3);
  ctx.closePath();
  ctx.fill();
  
  // Eyes (in mask)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-size/5, -size/12, 3, 0, Math.PI*2);
  ctx.arc(size/5, -size/12, 3, 0, Math.PI*2);
  ctx.fill();
  
  // Striped tail
  ctx.fillStyle = '#505050';
  ctx.beginPath();
  ctx.ellipse(-size*0.7, size/4, size/4, size/8, -0.3, 0, Math.PI*2);
  ctx.fill();
  
  // Tail stripes
  ctx.fillStyle = '#000000';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(-size*0.7 - i*8, size/4 - i*3, size/10, size/14, -0.3, 0, Math.PI*2);
    ctx.fill();
  }
  
  // Nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(0, size/15, 3, 0, Math.PI*2);
  ctx.fill();
  
  ctx.restore();
};

const drawMiniNyanCat = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number) => {
  ctx.save();
  ctx.translate(x + size/2, y + size/2);
  ctx.rotate(Math.sin(wobble) * 0.1);
  
  const miniSize = size * 0.6;
  const time = Date.now() / 1000;
  
  // Mini rainbow trail (shorter than boss)
  const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#9400D3'];
  for (let i = 0; i < 4; i++) {
    const offset = i * 8;
    const waveY = Math.sin(time * 10 + i * 0.5) * 3;
    ctx.fillStyle = rainbowColors[i % 6];
    ctx.fillRect(-miniSize * 0.6 - offset, -miniSize * 0.15 + waveY, 6, 5);
  }
  
  // Small pop-tart body
  const bodyGrad = ctx.createLinearGradient(-miniSize/3, -miniSize/3, miniSize/3, miniSize/3);
  bodyGrad.addColorStop(0, '#FF69B4');
  bodyGrad.addColorStop(1, '#FF1493');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-miniSize * 0.35, -miniSize * 0.25, miniSize * 0.7, miniSize * 0.5, 2);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Frosting
  ctx.fillStyle = '#FF69B4';
  ctx.beginPath();
  ctx.roundRect(-miniSize * 0.25, -miniSize * 0.15, miniSize * 0.5, miniSize * 0.3, 2);
  ctx.fill();
  
  // Tiny sprinkles
  ctx.fillStyle = '#00FFFF';
  ctx.fillRect(-miniSize * 0.15, -miniSize * 0.08, 2, 2);
  ctx.fillStyle = '#FFFF00';
  ctx.fillRect(miniSize * 0.05, -miniSize * 0.05, 2, 2);
  ctx.fillStyle = '#00FF00';
  ctx.fillRect(-miniSize * 0.05, miniSize * 0.05, 2, 2);
  
  // Cat head (small gray)
  ctx.fillStyle = '#808080';
  ctx.beginPath();
  ctx.arc(miniSize * 0.3, -miniSize * 0.05, miniSize * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Ears
  ctx.fillStyle = '#808080';
  ctx.beginPath();
  ctx.moveTo(miniSize * 0.1, -miniSize * 0.15);
  ctx.lineTo(miniSize * 0.05, -miniSize * 0.35);
  ctx.lineTo(miniSize * 0.2, -miniSize * 0.2);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(miniSize * 0.35, -miniSize * 0.15);
  ctx.lineTo(miniSize * 0.45, -miniSize * 0.35);
  ctx.lineTo(miniSize * 0.4, -miniSize * 0.2);
  ctx.closePath();
  ctx.fill();
  
  // Pink inner ears
  ctx.fillStyle = '#FF9999';
  ctx.beginPath();
  ctx.moveTo(miniSize * 0.12, -miniSize * 0.16);
  ctx.lineTo(miniSize * 0.1, -miniSize * 0.28);
  ctx.lineTo(miniSize * 0.18, -miniSize * 0.18);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(miniSize * 0.38, -miniSize * 0.16);
  ctx.lineTo(miniSize * 0.4, -miniSize * 0.28);
  ctx.lineTo(miniSize * 0.32, -miniSize * 0.18);
  ctx.closePath();
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(miniSize * 0.22, -miniSize * 0.08, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(miniSize * 0.38, -miniSize * 0.08, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(miniSize * 0.23, -miniSize * 0.1, 0.8, 0, Math.PI * 2);
  ctx.arc(miniSize * 0.39, -miniSize * 0.1, 0.8, 0, Math.PI * 2);
  ctx.fill();
  
  // Cheeks
  ctx.fillStyle = '#FF9999';
  ctx.beginPath();
  ctx.arc(miniSize * 0.18, miniSize * 0.02, 2, 0, Math.PI * 2);
  ctx.arc(miniSize * 0.42, miniSize * 0.02, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Animated legs
  const legOffset = Math.sin(time * 15) * 2;
  ctx.fillStyle = '#808080';
  ctx.fillRect(-miniSize * 0.25, miniSize * 0.2 + legOffset, 4, 5);
  ctx.fillRect(-miniSize * 0.05, miniSize * 0.2 - legOffset, 4, 5);
  ctx.fillRect(miniSize * 0.1, miniSize * 0.2 + legOffset, 4, 5);
  
  // Attack indicator - small glow when about to shoot
  if (Math.random() < 0.1) {
    ctx.shadowColor = '#FF6B9D';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(255, 107, 155, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, miniSize * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
};

const drawTetris = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble) * 0.05);
  
  // Glow effect
  ctx.shadowColor = '#00D2D3';
  ctx.shadowBlur = 12;
  
  // Tetris piece (T-shape or random shape)
  const blockSize = size / 4;
  const blocks = [
    {bx: -1, by: 0}, {bx: 0, by: 0}, {bx: 1, by: 0}, // horizontal bar
    {bx: 0, by: -1}, // top center
  ];
  
  // Draw each block
  blocks.forEach(block => {
    const bx = block.bx * blockSize;
    const by = block.by * blockSize;
    
    // Block gradient
    const blockGrad = ctx.createLinearGradient(bx - blockSize/2, by - blockSize/2, bx + blockSize/2, by + blockSize/2);
    blockGrad.addColorStop(0, '#00FFFF');
    blockGrad.addColorStop(0.5, '#00D2D3');
    blockGrad.addColorStop(1, '#008B8B');
    
    ctx.fillStyle = blockGrad;
    ctx.fillRect(bx - blockSize/2, by - blockSize/2, blockSize - 1, blockSize - 1);
    
    // Block border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx - blockSize/2, by - blockSize/2, blockSize - 1, blockSize - 1);
    
    // Inner highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(bx - blockSize/2 + 2, by - blockSize/2 + 2, blockSize/3, blockSize/3);
  });
  
  ctx.shadowBlur = 0;
  ctx.restore();
};

const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  const scale = 1 + Math.sin(wobble * 2) * 0.1;
  ctx.scale(scale, scale);
  
  ctx.fillStyle = '#FF4757';
  ctx.shadowColor = '#FF4757';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, -size / 4);
  ctx.bezierCurveTo(-size / 2, -size / 2, -size / 2, size / 4, 0, size / 2);
  ctx.bezierCurveTo(size / 2, size / 4, size / 2, -size / 2, 0, -size / 4);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.arc(-size/6, -size/6, size/8, 0, Math.PI*2);
  ctx.fill();
  
  ctx.restore();
};

const drawBomb = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble * 3) * 0.15);
  
  // Pulsing effect
  const pulse = 1 + Math.sin(wobble * 4) * 0.08;
  ctx.scale(pulse, pulse);
  
  // Bomb body
  const bombGrad = ctx.createRadialGradient(-size/4, -size/4, 0, 0, 0, size/1.5);
  bombGrad.addColorStop(0, '#333333');
  bombGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bombGrad;
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Red warning ring
  ctx.strokeStyle = `rgba(255, 71, 87, ${0.5 + Math.sin(wobble * 6) * 0.3})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, size / 2 + 3, 0, Math.PI * 2);
  ctx.stroke();
  
  // Spark/fuse
  const sparkOffset = Math.sin(wobble * 8) * 4;
  ctx.fillStyle = '#FFD93D';
  ctx.shadowColor = '#FF4757';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(size / 2 + 4, -size / 2 - 4 + sparkOffset, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Skull
  ctx.fillStyle = '#FF4757';
  ctx.font = `bold ${size * 0.45}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💀', 0, 0);
  
  ctx.restore();
};

const drawBeerMugItem = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble) * 0.1);
  
  const floatY = Math.sin(wobble * 2) * 3;
  ctx.translate(0, floatY);
  
  // Glow
  ctx.shadowColor = '#FFD93D';
  ctx.shadowBlur = 15;
  
  // Mug body
  const mugGrad = ctx.createLinearGradient(-size/2, 0, size/2, 0);
  mugGrad.addColorStop(0, '#8B4513');
  mugGrad.addColorStop(0.5, '#A0522D');
  mugGrad.addColorStop(1, '#8B4513');
  ctx.fillStyle = mugGrad;
  roundRect(ctx, -size / 2, -size / 3, size, size * 0.7, 5);
  ctx.fill();
  
  // Foam
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, -size / 2 + 2, -size / 3 - 6, size - 4, 10, 3);
  ctx.fill();
  
  // Foam bubbles
  ctx.fillStyle = '#FFD93D';
  ctx.beginPath();
  ctx.arc(-size/4, -size/3 - 2, 3, 0, Math.PI*2);
  ctx.arc(size/5, -size/3 - 3, 2, 0, Math.PI*2);
  ctx.arc(0, -size/3 - 1, 2.5, 0, Math.PI*2);
  ctx.fill();
  
  // Handle
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(size / 2 - 2, 0, size / 4, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  
  ctx.shadowBlur = 0;
  
  ctx.restore();
};

const drawSkillItem = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, emoji: string, color: string, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble) * 0.15);
  
  const floatY = Math.sin(wobble * 3) * 4;
  ctx.translate(0, floatY);
  
  // Glow effect
  ctx.shadowColor = color;
  ctx.shadowBlur = 20 + Math.sin(wobble * 4) * 5;
  
  // Background circle
  const bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 1.8);
  bgGrad.addColorStop(0, color);
  bgGrad.addColorStop(1, '#1E1E2E');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Border ring
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.stroke();
  
  // Rotating ring effect
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.5 + Math.sin(wobble * 4) * 0.3;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, size / 1.5 + Math.sin(wobble * 2) * 3, wobble, wobble + Math.PI);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  ctx.shadowBlur = 0;
  
  // Emoji
  ctx.font = `${size * 0.5}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 0, 0);
  
  ctx.restore();
};

// WEAPON PICKUP - Visual indicator for unlockable weapons
const drawWeaponPickup = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, weaponType: WeaponType, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(wobble) * 0.1);
  
  const floatY = Math.sin(wobble * 2) * 3;
  ctx.translate(0, floatY);
  
  const weapon = WEAPONS[weaponType];
  const color = weapon.color;
  
  // Stronger glow for weapon pickups
  ctx.shadowColor = color;
  ctx.shadowBlur = 25 + Math.sin(wobble * 5) * 8;
  
  // Background hexagon shape
  const bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 1.5);
  bgGrad.addColorStop(0, color);
  bgGrad.addColorStop(0.7, '#1E1E2E');
  bgGrad.addColorStop(1, '#0D0D12');
  ctx.fillStyle = bgGrad;
  
  // Draw hexagon
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const hx = Math.cos(angle) * size / 2;
    const hy = Math.sin(angle) * size / 2;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.fill();
  
  // Border
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Inner rotating star effect
  ctx.save();
  ctx.rotate(wobble * 2);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * size / 2.5, Math.sin(angle) * size / 2.5);
  }
  ctx.stroke();
  ctx.restore();
  
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  
  // Weapon icon based on type
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.35}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const iconMap: Record<WeaponType, string> = {
    standard: '🔫',
    spread: '☁️',
    laser: '⚡',
    chainsaw: '🪚',
    missile: '🚀',
    paw: '🐾',
    beer: '🍺',
    ice: '🧊',
  };
  
  ctx.fillText(iconMap[weaponType] || '🔫', 0, 0);
  
  // Weapon name below
  ctx.fillStyle = color;
  ctx.font = `bold ${size * 0.2}px sans-serif`;
  ctx.fillText(weapon.name, 0, size / 2 + 8);
  
  ctx.restore();
};

// GUITAR - Dangerous falling obstacle
const drawGuitar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number, rotation: number = 0) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation + Math.sin(wobble) * 0.1);
  
  const floatY = Math.sin(wobble * 2) * 3;
  ctx.translate(0, floatY);
  
  // Guitar glow
  ctx.shadowColor = '#FF6B00';
  ctx.shadowBlur = 15 + Math.sin(wobble * 5) * 5;
  
  // Guitar body (wood color)
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  // Guitar body shape - hourglass
  ctx.moveTo(-size/3, -size/4);
  ctx.bezierCurveTo(-size/2, -size/4, -size/2, size/4, -size/3, size/4);
  ctx.bezierCurveTo(-size/4, size/3, size/4, size/3, size/3, size/4);
  ctx.bezierCurveTo(size/2, size/4, size/2, -size/4, size/3, -size/4);
  ctx.bezierCurveTo(size/4, -size/3, -size/4, -size/3, -size/3, -size/4);
  ctx.fill();
  
  // Guitar neck
  ctx.fillStyle = '#654321';
  ctx.fillRect(-size/12, -size/1.2, size/6, size/1.5);
  
  // Guitar headstock
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(-size/8, -size/1.2);
  ctx.lineTo(size/8, -size/1.2);
  ctx.lineTo(size/6, -size/1.5);
  ctx.lineTo(-size/6, -size/1.5);
  ctx.closePath();
  ctx.fill();
  
  // Guitar strings
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * size/20, -size/1.4);
    ctx.lineTo(i * size/20, size/4);
    ctx.stroke();
  }
  
  // Sound hole
  ctx.fillStyle = '#2D1810';
  ctx.beginPath();
  ctx.arc(0, -size/20, size/8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  // Warning indicator
  ctx.strokeStyle = '#FF4757';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5 + Math.sin(wobble * 8) * 0.3;
  ctx.beginPath();
  ctx.arc(0, 0, size/1.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  ctx.restore();
};

// PIANO - Dangerous falling obstacle
const drawPiano = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, wobble: number, rotation: number = 0) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation + Math.sin(wobble) * 0.08);
  
  const floatY = Math.sin(wobble * 2) * 3;
  ctx.translate(0, floatY);
  
  // Piano glow
  ctx.shadowColor = '#FF4757';
  ctx.shadowBlur = 15 + Math.sin(wobble * 5) * 5;
  
  // Piano body (black case)
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.roundRect(-size/2, -size/3, size, size/1.5, size/10);
  ctx.fill();
  
  // Piano body gradient
  const bodyGrad = ctx.createLinearGradient(-size/2, -size/3, size/2, size/3);
  bodyGrad.addColorStop(0, '#2a2a2a');
  bodyGrad.addColorStop(0.5, '#1a1a1a');
  bodyGrad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-size/2, -size/3, size, size/1.5, size/10);
  ctx.fill();
  
  // Piano lid (open)
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.moveTo(-size/2, -size/3);
  ctx.lineTo(-size/2.5, -size/0.8);
  ctx.lineTo(size/2.5, -size/0.8);
  ctx.lineTo(size/2, -size/3);
  ctx.closePath();
  ctx.fill();
  
  // Lid highlight
  ctx.strokeStyle = '#444444';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Piano keys (white keys)
  ctx.fillStyle = '#FFFFFF';
  const keyWidth = size / 14;
  const keyHeight = size / 4;
  for (let i = -6; i <= 6; i++) {
    ctx.fillRect(i * keyWidth - keyWidth/2, size/8, keyWidth - 1, keyHeight);
  }
  
  // Black keys
  ctx.fillStyle = '#000000';
  const blackKeyWidth = keyWidth * 0.6;
  const blackKeyHeight = keyHeight * 0.6;
  const blackKeyPositions = [-5, -3, -1, 1, 3, 5];
  blackKeyPositions.forEach(pos => {
    ctx.fillRect(pos * keyWidth - blackKeyWidth/2, size/8, blackKeyWidth, blackKeyHeight);
  });
  
  // Piano legs
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-size/2.2, size/4, size/12, size/4);
  ctx.fillRect(size/2.5, size/4, size/12, size/4);
  
  // Piano pedal
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(0, size/2.2, size/15, size/25, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  // Warning indicator
  ctx.strokeStyle = '#FF4757';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5 + Math.sin(wobble * 8) * 0.3;
  ctx.beginPath();
  ctx.arc(0, 0, size/1.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  ctx.restore();
};

// SPIKE - Deadly spike falling from top (left or right side)
const drawSpike = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isLeft: boolean, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  
  // Rotate spike to point down
  ctx.rotate(Math.PI / 2);
  if (!isLeft) ctx.scale(-1, 1);
  
  // Warning pulse
  const pulse = 0.7 + Math.sin(wobble * 10) * 0.3;
  
  // Spike glow
  ctx.shadowColor = '#FF0000';
  ctx.shadowBlur = 15 * pulse;
  
  // Spike gradient
  const spikeGrad = ctx.createLinearGradient(0, -size/2, 0, size/2);
  spikeGrad.addColorStop(0, '#8B0000');
  spikeGrad.addColorStop(0.5, '#FF0000');
  spikeGrad.addColorStop(1, '#FF4500');
  
  ctx.fillStyle = spikeGrad;
  
  // Draw spike shape (pointing down)
  ctx.beginPath();
  ctx.moveTo(-size/2, -size/3);
  ctx.lineTo(size/2, -size/3);
  ctx.lineTo(size/3, 0);
  ctx.lineTo(size/2, size/3);
  ctx.lineTo(0, size);
  ctx.lineTo(-size/2, size/3);
  ctx.lineTo(-size/3, 0);
  ctx.closePath();
  ctx.fill();
  
  // Spike highlight
  ctx.strokeStyle = '#FF6347';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Inner spike detail
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.5);
  ctx.lineTo(-size/6, size * 0.2);
  ctx.lineTo(size/6, size * 0.2);
  ctx.closePath();
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  // Warning ring
  ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 * pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
};

// TUNNEL WALL - Vertical tunnel walls with gap in middle (falling down)
const drawTunnelWall = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, isLeft: boolean, wobble: number) => {
  ctx.save();
  ctx.translate(x, y);
  
  // Warning pulse
  const pulse = 0.6 + Math.sin(wobble * 6) * 0.4;
  
  // Wall gradient
  const wallGrad = ctx.createLinearGradient(0, 0, width, 0);
  if (isLeft) {
    wallGrad.addColorStop(0, '#1a0033');
    wallGrad.addColorStop(0.5, '#4B0082');
    wallGrad.addColorStop(1, '#9400D3');
  } else {
    wallGrad.addColorStop(0, '#9400D3');
    wallGrad.addColorStop(0.5, '#4B0082');
    wallGrad.addColorStop(1, '#1a0033');
  }
  
  // Main wall
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, width, height);
  
  // Wall border glow
  ctx.shadowColor = '#9D00FF';
  ctx.shadowBlur = 20 * pulse;
  
  // Border
  ctx.strokeStyle = '#FF00FF';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, width, height);
  
  ctx.shadowBlur = 0;
  
  // Decorative pattern on wall
  ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 10; i < height; i += 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
  
  // Warning stripes on edge facing the gap
  const stripeSize = 15;
  const edgeX = isLeft ? width - 5 : 0;
  for (let i = 0; i < height; i += stripeSize * 2) {
    ctx.fillStyle = `rgba(255, 215, 0, ${0.5 * pulse})`;
    ctx.fillRect(edgeX, i, 5, stripeSize);
  }
  
  // Animated arrows pointing to the gap
  const arrowOffset = (Date.now() / 200) % 30;
  ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * pulse})`;
  const arrowX = isLeft ? width - 25 : 20;
  const arrowDir = isLeft ? 1 : -1;
  for (let i = 30; i < height - 30; i += 50) {
    ctx.beginPath();
    ctx.moveTo(arrowX + arrowOffset * arrowDir, i);
    ctx.lineTo(arrowX + (10 + arrowOffset) * arrowDir, i - 8);
    ctx.lineTo(arrowX + (10 + arrowOffset) * arrowDir, i + 8);
    ctx.closePath();
    ctx.fill();
  }
  
  ctx.restore();
};

// MUSIC NOTES - Animated particles when guitar is hit
interface MusicNote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  note: string;
  color: string;
}

// BOSS CONFIGURATIONS - Unique appearances, weapons, and attack patterns
const BOSS_CONFIGS = [
  { 
    name: 'NYAN CAT', 
    color: '#FF6B9D', 
    weapon: 'spread', 
    bodyColor: '#FF69B4', 
    headColor: '#A0A0A0', 
    earColor: '#FFB6C1', 
    eyeColor: '#000000',
    trail: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#9400D3'],
    hasHorn: false,
    hasWings: false,
    glowColor: '#FF6B9D',
    sprinkleColors: ['#00FFFF', '#FFFF00', '#00FF00', '#FF00FF', '#00D2D3']
  },
  { 
    name: 'DEMON CAT', 
    color: '#FF4757', 
    weapon: 'laser', 
    bodyColor: '#8B0000', 
    headColor: '#4A0000', 
    earColor: '#FF0000', 
    eyeColor: '#FF0000',
    trail: ['#FF0000', '#8B0000', '#FF4500', '#8B0000', '#FF0000', '#8B0000'],
    hasHorn: true,
    hasWings: true,
    wingColor: '#4A0000',
    glowColor: '#FF0000',
    sprinkleColors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#DC143C']
  },
  { 
    name: 'CYBER CAT', 
    color: '#00D2D3', 
    weapon: 'rapid', 
    bodyColor: '#008B8B', 
    headColor: '#00FFFF', 
    earColor: '#00CED1', 
    eyeColor: '#00FF00',
    trail: ['#00FFFF', '#00D2D3', '#008B8B', '#00FFFF', '#00D2D3', '#008B8B'],
    hasHorn: false,
    hasWings: false,
    glowColor: '#00FFFF',
    sprinkleColors: ['#FF00FF', '#FFFF00', '#00FF00', '#FF69B4', '#00CED1'],
    hasCircuitLines: true
  },
  { 
    name: 'PHANTOM CAT', 
    color: '#A55EEA', 
    weapon: 'homing', 
    bodyColor: '#4B0082', 
    headColor: '#8A2BE2', 
    earColor: '#DA70D6', 
    eyeColor: '#00FFFF',
    trail: ['#A55EEA', '#8A2BE2', '#4B0082', '#A55EEA', '#8A2BE2', '#4B0082'],
    hasHorn: true,
    hasWings: true,
    wingColor: '#2D004D',
    glowColor: '#A55EEA',
    sprinkleColors: ['#E0FFFF', '#DDA0DD', '#DA70D6', '#BA55D3', '#9932CC'],
    isGhostly: true
  },
  { 
    name: 'GOLD CAT', 
    color: '#FFD93D', 
    weapon: 'wave', 
    bodyColor: '#D4AC0D', 
    headColor: '#FFD700', 
    earColor: '#FFA500', 
    eyeColor: '#FF8C00',
    trail: ['#FFD93D', '#FFA500', '#FF8C00', '#FFD700', '#FFA500', '#FF8C00'],
    hasHorn: false,
    hasWings: true,
    wingColor: '#B8860B',
    glowColor: '#FFD93D',
    sprinkleColors: ['#FFFFFF', '#FFD700', '#FFA500', '#FF8C00', '#FFFFFF'],
    hasCrown: true
  },
  { 
    name: 'GALACTIC CAT', 
    color: '#9D00FF', 
    weapon: 'chainsaw', 
    bodyColor: '#2D004D', 
    headColor: '#4B0082', 
    earColor: '#9400D3', 
    eyeColor: '#FF00FF',
    trail: ['#FF00FF', '#9D00FF', '#4B0082', '#FF00FF', '#9D00FF', '#4B0082'],
    hasHorn: true,
    hasWings: true,
    wingColor: '#1a0033',
    glowColor: '#FF00FF',
    sprinkleColors: ['#FF00FF', '#9D00FF', '#00FFFF', '#FF1493', '#9400D3'],
    isGalactic: true
  },
  { 
    name: 'MEGA GRAND MASTER', 
    color: '#FF1493', 
    weapon: 'furball', 
    bodyColor: '#FF69B4', 
    headColor: '#FFB6C1', 
    earColor: '#FFC0CB', 
    eyeColor: '#00FFFF',
    trail: ['#FF1493', '#FF69B4', '#FFB6C1', '#FF1493', '#FF69B4', '#FFB6C1'],
    hasHorn: false,
    hasWings: false,
    glowColor: '#FF1493',
    sprinkleColors: ['#FF1493', '#FF69B4', '#FFB6C1', '#00FFFF', '#FFFF00'],
    isMegaMaster: true
  },
  { 
    name: 'SUPER GUITAR CAT', 
    color: '#FF6B00', 
    weapon: 'notes', 
    bodyColor: '#8B4513', 
    headColor: '#D2691E', 
    earColor: '#CD853F', 
    eyeColor: '#FF4500',
    trail: ['#FF6B00', '#FFD93D', '#FF8C00', '#FF6B00', '#FFD93D', '#FF8C00'],
    hasHorn: false,
    hasWings: false,
    glowColor: '#FF6B00',
    sprinkleColors: ['#FF6B00', '#FFD93D', '#FF8C00', '#FFA500', '#FFFF00'],
    isGuitarBoss: true
  },
  { 
    name: 'GRAND PIANO CAT', 
    color: '#FF4757', 
    weapon: 'pianoStrings', 
    bodyColor: '#1a1a1a', 
    headColor: '#2a2a2a', 
    earColor: '#FFD93D', 
    eyeColor: '#FF0000',
    trail: ['#FF4757', '#FFD93D', '#FFFFFF', '#FF4757', '#FFD93D', '#FFFFFF'],
    hasHorn: false,
    hasWings: false,
    glowColor: '#FF4757',
    sprinkleColors: ['#FFFFFF', '#000000', '#FFD93D', '#FF4757', '#FFFFFF'],
    isPianoBoss: true
  },
  { 
    name: 'TERMINATOR', 
    color: '#C0C0C0', 
    weapon: 'terminatorLaser', 
    bodyColor: '#4a4a4a', 
    headColor: '#808080', 
    earColor: '#696969', 
    eyeColor: '#FF0000',
    trail: ['#FF0000', '#C0C0C0', '#696969', '#FF0000', '#C0C0C0', '#696969'],
    hasHorn: false,
    hasWings: false,
    glowColor: '#FF0000',
    sprinkleColors: ['#FF0000', '#FF4500', '#C0C0C0', '#FF0000', '#FF4500'],
    isTerminator: true
  },
  { 
    name: 'JOKER CAT', 
    color: '#9400D3', 
    weapon: 'cards', 
    bodyColor: '#4B0082', 
    headColor: '#8A2BE2', 
    earColor: '#FFD700', 
    eyeColor: '#FF1493',
    trail: ['#FF0000', '#FF1493', '#FFD700', '#00FF00', '#0000FF', '#9400D3'],
    hasHorn: false,
    hasWings: false,
    glowColor: '#FFD700',
    sprinkleColors: ['#FF0000', '#FFD700', '#FF1493', '#00FF00', '#0000FF'],
    isJoker: true
  },
];

// NYAN CAT BOSS - Atari Style with different appearances per boss type
const drawNyanCatBoss = (ctx: CanvasRenderingContext2D, boss: Boss, bossesDefeated: number) => {
  const { x, y, health, maxHealth, hitFlash, type } = boss;
  const time = Date.now() / 1000;
  const size = 55;
  const config = BOSS_CONFIGS[type % BOSS_CONFIGS.length];
  
  ctx.save();
  ctx.translate(x, y);
  
  // Flash when hit
  if (hitFlash > 0) {
    const flashAlpha = Math.min(0.45, hitFlash / 12);
    const hitGlow = ctx.createRadialGradient(0, 0, size * 0.3, 0, 0, size * 1.25);
    hitGlow.addColorStop(0, `rgba(250, 204, 21, ${flashAlpha})`);
    hitGlow.addColorStop(0.55, `rgba(253, 224, 71, ${flashAlpha * 0.65})`);
    hitGlow.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = hitGlow;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.25, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Trail (different colors per boss type)
  for (let i = 0; i < 8; i++) {
    const offset = i * 14;
    const waveY = Math.sin(time * 8 + i * 0.5) * 6;
    ctx.fillStyle = config.trail[i % 6];
    ctx.fillRect(-size * 0.8 - offset, -size * 0.25 + waveY, 12, 10);
  }
  
  // Invulnerable glow (color matches boss type)
  if (boss.invulnerable) {
    const glowAlpha = 0.3 + Math.sin(time * 10) * 0.2;
    const gradient = ctx.createRadialGradient(0, 0, size, 0, 0, size + 30);
    gradient.addColorStop(0, `${config.color}${Math.floor(glowAlpha * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size + 30, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Pop-tart body (different color per boss type)
  const bodyGrad = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
  bodyGrad.addColorStop(0, config.bodyColor);
  bodyGrad.addColorStop(1, config.color);
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, -size * 0.5, -size * 0.4, size, size * 0.8, 4);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Frosting (lighter version of body color)
  ctx.fillStyle = config.color;
  roundRect(ctx, -size * 0.4, -size * 0.3, size * 0.8, size * 0.6, 3);
  ctx.fill();
  
  // Sprinkles (unique colors per boss type)
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = config.sprinkleColors[i % 5];
    const sx = -size * 0.3 + (i % 5) * size * 0.13;
    const sy = -size * 0.2 + Math.floor(i / 5) * size * 0.22;
    ctx.fillRect(sx, sy, 4, 4);
  }
  
  // Cat head (different color per boss type)
  const headGrad = ctx.createRadialGradient(size*0.35, -size*0.15, 0, size*0.4, -size*0.1, size*0.4);
  headGrad.addColorStop(0, config.headColor);
  headGrad.addColorStop(1, config.bodyColor);
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(size * 0.4, -size * 0.1, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Ears
  ctx.fillStyle = config.headColor;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, -size * 0.3);
  ctx.lineTo(size * 0.1, -size * 0.65);
  ctx.lineTo(size * 0.35, -size * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(size * 0.5, -size * 0.3);
  ctx.lineTo(size * 0.6, -size * 0.65);
  ctx.lineTo(size * 0.55, -size * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Inner ears (different color per boss type)
  ctx.fillStyle = config.earColor;
  ctx.beginPath();
  ctx.moveTo(size * 0.18, -size * 0.32);
  ctx.lineTo(size * 0.15, -size * 0.55);
  ctx.lineTo(size * 0.28, -size * 0.35);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(size * 0.52, -size * 0.32);
  ctx.lineTo(size * 0.55, -size * 0.55);
  ctx.lineTo(size * 0.45, -size * 0.35);
  ctx.closePath();
  ctx.fill();
  
  // Eyes (different styles per boss type)
  if (type === 1) {
    // Demon cat - angry slanted eyes
    ctx.fillStyle = config.eyeColor;
    ctx.shadowColor = config.eyeColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(size * 0.2, -size * 0.2);
    ctx.lineTo(size * 0.35, -size * 0.1);
    ctx.lineTo(size * 0.2, -size * 0.05);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.6, -size * 0.2);
    ctx.lineTo(size * 0.45, -size * 0.1);
    ctx.lineTo(size * 0.6, -size * 0.05);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (type === 2) {
    // Cyber cat - digital/rectangular eyes
    ctx.fillStyle = config.eyeColor;
    ctx.shadowColor = config.eyeColor;
    ctx.shadowBlur = 10;
    ctx.fillRect(size * 0.22, -size * 0.2, 10, 8);
    ctx.fillRect(size * 0.48, -size * 0.2, 10, 8);
    ctx.shadowBlur = 0;
  } else if (type === 3) {
    // Phantom cat - glowing oval eyes
    ctx.fillStyle = config.eyeColor;
    ctx.shadowColor = config.eyeColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(size * 0.28, -size * 0.15, 5, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.52, -size * 0.15, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (type === 4) {
    // Gold cat - regal eyes with shine
    ctx.fillStyle = config.eyeColor;
    ctx.beginPath();
    ctx.ellipse(size * 0.28, -size * 0.15, 4, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.52, -size * 0.15, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Extra shine for gold cat
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(size * 0.3, -size * 0.18, 2, 0, Math.PI * 2);
    ctx.arc(size * 0.54, -size * 0.18, 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Normal eyes (Nyan Cat)
    ctx.fillStyle = config.eyeColor;
    ctx.beginPath();
    ctx.ellipse(size * 0.28, -size * 0.15, 4, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.52, -size * 0.15, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(size * 0.3, -size * 0.18, 1.5, 0, Math.PI * 2);
    ctx.arc(size * 0.54, -size * 0.18, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Cheeks
  ctx.fillStyle = config.earColor;
  ctx.beginPath();
  ctx.arc(size * 0.22, -size * 0.05, 5, 0, Math.PI * 2);
  ctx.arc(size * 0.58, -size * 0.05, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = config.earColor;
  ctx.beginPath();
  ctx.moveTo(size * 0.4, size * 0.02);
  ctx.lineTo(size * 0.37, size * 0.06);
  ctx.lineTo(size * 0.43, size * 0.06);
  ctx.closePath();
  ctx.fill();
  
  // Mouth (demon cat has fangs)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(size * 0.4, size * 0.06);
  ctx.quadraticCurveTo(size * 0.33, size * 0.12, size * 0.28, size * 0.08);
  ctx.moveTo(size * 0.4, size * 0.06);
  ctx.quadraticCurveTo(size * 0.47, size * 0.12, size * 0.52, size * 0.08);
  ctx.stroke();
  
  // Demon cat fangs
  if (type === 1) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(size * 0.28, size * 0.08);
    ctx.lineTo(size * 0.3, size * 0.15);
    ctx.lineTo(size * 0.32, size * 0.08);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.48, size * 0.08);
    ctx.lineTo(size * 0.5, size * 0.15);
    ctx.lineTo(size * 0.52, size * 0.08);
    ctx.fill();
  }
  
  // Animated legs
  const legOffset = Math.sin(time * 12) * 5;
  ctx.fillStyle = config.headColor;
  ctx.fillRect(-size * 0.4, size * 0.35 + legOffset, 10, 12);
  ctx.fillRect(-size * 0.1, size * 0.35 - legOffset, 10, 12);
  ctx.fillRect(size * 0.15, size * 0.35 + legOffset, 10, 12);
  
  // DEMON CAT - Horns
  if (config.hasHorn && type === 1) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(size * 0.2, -size * 0.45);
    ctx.lineTo(size * 0.15, -size * 0.75);
    ctx.lineTo(size * 0.28, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.6, -size * 0.45);
    ctx.lineTo(size * 0.65, -size * 0.75);
    ctx.lineTo(size * 0.52, -size * 0.5);
    ctx.closePath();
    ctx.fill();
  }
  
  // PHANTOM CAT - Horns (different style)
  if (config.hasHorn && type === 3) {
    ctx.fillStyle = '#DA70D6';
    ctx.beginPath();
    ctx.moveTo(size * 0.22, -size * 0.4);
    ctx.quadraticCurveTo(size * 0.18, -size * 0.7, size * 0.28, -size * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.58, -size * 0.4);
    ctx.quadraticCurveTo(size * 0.62, -size * 0.7, size * 0.48, -size * 0.55);
    ctx.closePath();
    ctx.fill();
  }
  
  // WINGS for Demon, Phantom, and Gold cats
  if (config.hasWings) {
    const wingFlap = Math.sin(time * 15) * 0.3;
    ctx.save();
    ctx.translate(-size * 0.6, -size * 0.1);
    ctx.rotate(wingFlap);
    ctx.fillStyle = config.wingColor || config.bodyColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-size * 0.5, -size * 0.3, -size * 0.4, size * 0.1);
    ctx.quadraticCurveTo(-size * 0.2, size * 0.2, 0, 0);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    
    ctx.save();
    ctx.translate(size * 1.0, -size * 0.1);
    ctx.rotate(-wingFlap);
    ctx.fillStyle = config.wingColor || config.bodyColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.5, -size * 0.3, size * 0.4, size * 0.1);
    ctx.quadraticCurveTo(size * 0.2, size * 0.2, 0, 0);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
  
  // CYBER CAT - Circuit lines
  if (config.hasCircuitLines) {
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 5;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, -size * 0.2 + i * size * 0.15);
      ctx.lineTo(size * 0.4, -size * 0.2 + i * size * 0.15);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
  
  // PHANTOM CAT - Ghostly aura particles
  if (config.isGhostly) {
    for (let i = 0; i < 5; i++) {
      const px = (Math.random() - 0.5) * size * 2;
      const py = (Math.random() - 0.5) * size;
      const alpha = 0.3 + Math.sin(time * 5 + i) * 0.2;
      ctx.fillStyle = `rgba(165, 94, 234, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, 3 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // GOLD CAT - Crown
  if (config.hasCrown) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(size * 0.15, -size * 0.5);
    ctx.lineTo(size * 0.2, -size * 0.7);
    ctx.lineTo(size * 0.3, -size * 0.6);
    ctx.lineTo(size * 0.4, -size * 0.75);
    ctx.lineTo(size * 0.5, -size * 0.6);
    ctx.lineTo(size * 0.6, -size * 0.7);
    ctx.lineTo(size * 0.65, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Crown jewels
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.65, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // GALACTIC CAT - Cosmic aura and chainsaws
  if (config.isGalactic) {
    // Cosmic nebula aura
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2 + time * 0.5;
      const dist = 60 + Math.sin(time * 2 + i * 0.5) * 10;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist * 0.6;
      const alpha = 0.3 + Math.sin(time * 3 + i) * 0.2;
      const starSize = 2 + Math.random() * 3;
      
      ctx.fillStyle = `rgba(157, 0, 255, ${alpha})`;
      ctx.shadowColor = '#FF00FF';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(px, py, starSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    
    // Rotating chainsaws on sides
    const chainsawY = Math.sin(time * 8) * 5;
    const rotation = time * 15;
    
    // Left chainsaw
    ctx.save();
    ctx.translate(-size * 0.9, chainsawY);
    ctx.rotate(rotation);
    
    // Chainsaw blade
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Chainsaw teeth
    ctx.fillStyle = '#FF0000';
    for (let i = 0; i < 8; i++) {
      const toothAngle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(toothAngle) * 12, Math.sin(toothAngle) * 12);
      ctx.lineTo(Math.cos(toothAngle) * 20, Math.sin(toothAngle) * 20);
      ctx.lineTo(Math.cos(toothAngle + 0.2) * 16, Math.sin(toothAngle + 0.2) * 16);
      ctx.fill();
    }
    
    // Sparks from chainsaw
    if (Math.random() < 0.3) {
      ctx.fillStyle = '#FFD700';
      const sparkAngle = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(sparkAngle) * 22, Math.sin(sparkAngle) * 22, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    
    // Right chainsaw
    ctx.save();
    ctx.translate(size * 0.9, -chainsawY);
    ctx.rotate(-rotation);
    
    // Chainsaw blade
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Chainsaw teeth
    ctx.fillStyle = '#FF0000';
    for (let i = 0; i < 8; i++) {
      const toothAngle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(toothAngle) * 12, Math.sin(toothAngle) * 12);
      ctx.lineTo(Math.cos(toothAngle) * 20, Math.sin(toothAngle) * 20);
      ctx.lineTo(Math.cos(toothAngle + 0.2) * 16, Math.sin(toothAngle + 0.2) * 16);
      ctx.fill();
    }
    
    // Sparks from chainsaw
    if (Math.random() < 0.3) {
      ctx.fillStyle = '#FFD700';
      const sparkAngle = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(sparkAngle) * 22, Math.sin(sparkAngle) * 22, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    
    // Galactic horns (larger than demon)
    ctx.fillStyle = '#9400D3';
    ctx.beginPath();
    ctx.moveTo(size * 0.18, -size * 0.4);
    ctx.lineTo(size * 0.12, -size * 0.9);
    ctx.lineTo(size * 0.28, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FF00FF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(size * 0.62, -size * 0.4);
    ctx.lineTo(size * 0.68, -size * 0.9);
    ctx.lineTo(size * 0.52, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  // MEGA GRAND MASTER - Special features
  if (config.isMegaMaster) {
    // Animated bright glow aura
    const glowPulse = 0.5 + Math.sin(time * 8) * 0.3;
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 30 + Math.sin(time * 10) * 10;
    
    // Outer pulsating ring
    for (let i = 0; i < 3; i++) {
      const ringRadius = 70 + i * 15 + Math.sin(time * 5 + i) * 5;
      const alpha = glowPulse * (0.3 - i * 0.1);
      ctx.strokeStyle = `rgba(255, 20, 147, ${alpha})`;
      ctx.lineWidth = 3 - i;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Animated sparks around the boss
    for (let i = 0; i < 12; i++) {
      const sparkAngle = (i / 12) * Math.PI * 2 + time * 3;
      const sparkDist = 80 + Math.sin(time * 8 + i * 0.5) * 15;
      const sparkX = Math.cos(sparkAngle) * sparkDist;
      const sparkY = Math.sin(sparkAngle) * sparkDist * 0.6;
      const sparkSize = 3 + Math.sin(time * 10 + i) * 2;
      
      // Spark glow
      ctx.shadowColor = i % 2 === 0 ? '#FFFF00' : '#FF1493';
      ctx.shadowBlur = 15;
      ctx.fillStyle = i % 2 === 0 ? '#FFFF00' : '#FF1493';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Spark cross
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sparkX - sparkSize * 1.5, sparkY);
      ctx.lineTo(sparkX + sparkSize * 1.5, sparkY);
      ctx.moveTo(sparkX, sparkY - sparkSize * 1.5);
      ctx.lineTo(sparkX, sparkY + sparkSize * 1.5);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    
    // MEGA EARS - Much bigger than normal
    ctx.fillStyle = config.headColor;
    // Left mega ear
    ctx.beginPath();
    ctx.moveTo(size * 0.05, -size * 0.35);
    ctx.lineTo(-size * 0.15, -size * 1.1);
    ctx.lineTo(size * 0.25, -size * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Right mega ear
    ctx.beginPath();
    ctx.moveTo(size * 0.55, -size * 0.35);
    ctx.lineTo(size * 0.75, -size * 1.1);
    ctx.lineTo(size * 0.35, -size * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Inner mega ears
    ctx.fillStyle = config.earColor;
    ctx.beginPath();
    ctx.moveTo(size * 0.1, -size * 0.4);
    ctx.lineTo(-size * 0.05, -size * 0.9);
    ctx.lineTo(size * 0.2, -size * 0.45);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(size * 0.5, -size * 0.4);
    ctx.lineTo(size * 0.65, -size * 0.9);
    ctx.lineTo(size * 0.4, -size * 0.45);
    ctx.closePath();
    ctx.fill();
    
    // WHISKERS - Big animated whiskers
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    const whiskerWiggle = Math.sin(time * 15) * 3;
    
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(size * 0.15, size * 0.05);
    ctx.lineTo(-size * 0.25, size * 0.05 + whiskerWiggle);
    ctx.moveTo(size * 0.15, size * 0.1);
    ctx.lineTo(-size * 0.25, size * 0.15 + whiskerWiggle);
    ctx.moveTo(size * 0.15, size * 0.15);
    ctx.lineTo(-size * 0.25, size * 0.25 + whiskerWiggle);
    ctx.stroke();
    
    // Right whiskers
    ctx.beginPath();
    ctx.moveTo(size * 0.65, size * 0.05);
    ctx.lineTo(size * 1.05, size * 0.05 - whiskerWiggle);
    ctx.moveTo(size * 0.65, size * 0.1);
    ctx.lineTo(size * 1.05, size * 0.15 - whiskerWiggle);
    ctx.moveTo(size * 0.65, size * 0.15);
    ctx.lineTo(size * 1.05, size * 0.25 - whiskerWiggle);
    ctx.stroke();
    
    // WAVING PAWS - Animated cat paws 🐾
    const pawWave = Math.sin(time * 12) * 15;
    
    // Left paw
    ctx.save();
    ctx.translate(-size * 0.7, size * 0.2);
    ctx.rotate((pawWave * Math.PI) / 180);
    
    // Paw pad
    ctx.fillStyle = '#FFB6C1';
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Toe beans
    ctx.fillStyle = '#FF69B4';
    for (let i = 0; i < 3; i++) {
      const beanAngle = ((i - 1) * 0.5);
      const beanX = Math.sin(beanAngle) * 10;
      const beanY = -8 + Math.cos(beanAngle) * 3;
      ctx.beginPath();
      ctx.ellipse(beanX, beanY, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    
    // Right paw (opposite wave)
    ctx.save();
    ctx.translate(size * 0.7, size * 0.2);
    ctx.rotate((-pawWave * Math.PI) / 180);
    
    // Paw pad
    ctx.fillStyle = '#FFB6C1';
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Toe beans
    ctx.fillStyle = '#FF69B4';
    for (let i = 0; i < 3; i++) {
      const beanAngle = ((i - 1) * 0.5);
      const beanX = Math.sin(beanAngle) * 10;
      const beanY = -8 + Math.cos(beanAngle) * 3;
      ctx.beginPath();
      ctx.ellipse(beanX, beanY, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    
    // Crown/Tiara for Grand Master
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size * 0.1, -size * 0.5);
    ctx.lineTo(size * 0.2, -size * 0.85);
    ctx.lineTo(size * 0.3, -size * 0.6);
    ctx.lineTo(size * 0.4, -size * 0.9);
    ctx.lineTo(size * 0.5, -size * 0.6);
    ctx.lineTo(size * 0.6, -size * 0.85);
    ctx.lineTo(size * 0.7, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Crown jewels with sparkle
    const jewelSparkle = 0.5 + Math.sin(time * 10) * 0.5;
    ctx.fillStyle = `rgba(255, 0, 255, ${jewelSparkle})`;
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.75, 4, 0, Math.PI * 2);
    ctx.arc(size * 0.4, -size * 0.8, 5, 0, Math.PI * 2);
    ctx.arc(size * 0.6, -size * 0.75, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // SUPER GUITAR BOSS CAT - Guitar with cat head
  if (config.isGuitarBoss) {
    const guitarSize = size * 1.3;
    const isAngry = boss.hitFlash > 0;
    
    // Guitar body (wooden)
    ctx.fillStyle = '#8B4513';
    ctx.shadowColor = '#FF6B00';
    ctx.shadowBlur = 20 + Math.sin(time * 5) * 5;
    
    // Guitar body shape - hourglass
    ctx.beginPath();
    ctx.moveTo(-guitarSize/3, -guitarSize/4);
    ctx.bezierCurveTo(-guitarSize/1.8, -guitarSize/4, -guitarSize/1.8, guitarSize/4, -guitarSize/3, guitarSize/4);
    ctx.bezierCurveTo(-guitarSize/4, guitarSize/3, guitarSize/4, guitarSize/3, guitarSize/3, guitarSize/4);
    ctx.bezierCurveTo(guitarSize/1.8, guitarSize/4, guitarSize/1.8, -guitarSize/4, guitarSize/3, -guitarSize/4);
    ctx.bezierCurveTo(guitarSize/4, -guitarSize/3, -guitarSize/4, -guitarSize/3, -guitarSize/3, -guitarSize/4);
    ctx.fill();
    
    // Guitar body gradient overlay
    const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, guitarSize/2);
    bodyGrad.addColorStop(0, '#D2691E');
    bodyGrad.addColorStop(0.7, '#8B4513');
    bodyGrad.addColorStop(1, '#5D3A1A');
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Guitar neck
    ctx.fillStyle = '#654321';
    ctx.fillRect(-guitarSize/15, -guitarSize/0.9, guitarSize/7.5, guitarSize/1.5);
    
    // Guitar headstock (cat head shape)
    ctx.save();
    ctx.translate(0, -guitarSize/0.85);
    
    // Cat head
    ctx.fillStyle = isAngry ? '#FF4500' : '#D2691E';
    ctx.shadowColor = '#FF6B00';
    ctx.shadowBlur = 15;
    
    // Head circle
    ctx.beginPath();
    ctx.arc(0, 0, guitarSize/5, 0, Math.PI * 2);
    ctx.fill();
    
    // Cat ears (triangles)
    // Left ear
    ctx.beginPath();
    ctx.moveTo(-guitarSize/6, -guitarSize/8);
    ctx.lineTo(-guitarSize/3, -guitarSize/3);
    ctx.lineTo(-guitarSize/12, -guitarSize/5);
    ctx.closePath();
    ctx.fill();
    
    // Right ear
    ctx.beginPath();
    ctx.moveTo(guitarSize/6, -guitarSize/8);
    ctx.lineTo(guitarSize/3, -guitarSize/3);
    ctx.lineTo(guitarSize/12, -guitarSize/5);
    ctx.closePath();
    ctx.fill();
    
    // Inner ears
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.moveTo(-guitarSize/7, -guitarSize/10);
    ctx.lineTo(-guitarSize/4, -guitarSize/4);
    ctx.lineTo(-guitarSize/10, -guitarSize/6);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(guitarSize/7, -guitarSize/10);
    ctx.lineTo(guitarSize/4, -guitarSize/4);
    ctx.lineTo(guitarSize/10, -guitarSize/6);
    ctx.closePath();
    ctx.fill();
    
    // Eyes - angry when hit
    ctx.fillStyle = isAngry ? '#FF0000' : '#FFD93D';
    ctx.shadowColor = isAngry ? '#FF0000' : '#FFD93D';
    ctx.shadowBlur = 10;
    
    if (isAngry) {
      // Angry slanted eyes
      ctx.beginPath();
      ctx.moveTo(-guitarSize/10, -guitarSize/20);
      ctx.lineTo(-guitarSize/20, guitarSize/30);
      ctx.lineTo(-guitarSize/6, guitarSize/30);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(guitarSize/10, -guitarSize/20);
      ctx.lineTo(guitarSize/20, guitarSize/30);
      ctx.lineTo(guitarSize/6, guitarSize/30);
      ctx.closePath();
      ctx.fill();
    } else {
      // Normal round eyes
      ctx.beginPath();
      ctx.arc(-guitarSize/12, 0, guitarSize/25, 0, Math.PI * 2);
      ctx.arc(guitarSize/12, 0, guitarSize/25, 0, Math.PI * 2);
      ctx.fill();
      
      // Pupils
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-guitarSize/12, 0, guitarSize/50, 0, Math.PI * 2);
      ctx.arc(guitarSize/12, 0, guitarSize/50, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(0, guitarSize/25);
    ctx.lineTo(-guitarSize/40, guitarSize/15);
    ctx.lineTo(guitarSize/40, guitarSize/15);
    ctx.closePath();
    ctx.fill();
    
    // Mouth (frowns when angry)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (isAngry) {
      // Frowning mouth
      ctx.arc(0, guitarSize/10, guitarSize/15, Math.PI * 0.8, Math.PI * 0.2, true);
    } else {
      // Normal mouth
      ctx.arc(0, guitarSize/12, guitarSize/20, 0.2, Math.PI - 0.2);
    }
    ctx.stroke();
    
    // Whiskers
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-guitarSize/8, guitarSize/15);
    ctx.lineTo(-guitarSize/4, guitarSize/12);
    ctx.moveTo(-guitarSize/8, guitarSize/10);
    ctx.lineTo(-guitarSize/4, guitarSize/8);
    ctx.moveTo(guitarSize/8, guitarSize/15);
    ctx.lineTo(guitarSize/4, guitarSize/12);
    ctx.moveTo(guitarSize/8, guitarSize/10);
    ctx.lineTo(guitarSize/4, guitarSize/8);
    ctx.stroke();
    
    // Animated smoke from mouth when angry
    if (isAngry) {
      for (let i = 0; i < 5; i++) {
        const smokeY = guitarSize/8 - (i * 8) - (Date.now() / 50) % 20;
        const smokeX = (Math.sin((Date.now() / 200) + i) * 5);
        const smokeAlpha = 0.8 - (i * 0.15);
        const smokeSize = 3 + i * 2;
        
        ctx.fillStyle = `rgba(100, 100, 100, ${smokeAlpha})`;
        ctx.shadowColor = '#666666';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(smokeX, smokeY, smokeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.shadowBlur = 0;
    ctx.restore();
    
    // Guitar strings
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * guitarSize/25, -guitarSize/0.9);
      ctx.lineTo(i * guitarSize/25, guitarSize/4);
      ctx.stroke();
    }
    
    // Sound hole
    ctx.fillStyle = '#2D1810';
    ctx.beginPath();
    ctx.arc(0, -guitarSize/20, guitarSize/8, 0, Math.PI * 2);
    ctx.fill();
    
    // Musical notes floating around
    const notes = ['♪', '♫', '♬', '♩'];
    for (let i = 0; i < 4; i++) {
      const noteAngle = (i / 4) * Math.PI * 2 + time * 2;
      const noteDist = guitarSize/1.5 + Math.sin(time * 3 + i) * 10;
      const noteX = Math.cos(noteAngle) * noteDist;
      const noteY = Math.sin(noteAngle) * noteDist * 0.5 + Math.sin(time * 5 + i) * 5;
      
      ctx.fillStyle = `hsl(${(time * 50 + i * 60) % 360}, 80%, 60%)`;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.font = `bold ${12 + Math.sin(time * 4 + i) * 3}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(notes[i], noteX, noteY);
    }
    
    ctx.shadowBlur = 0;
  }
  
  // GRAND PIANO CAT BOSS - Giant piano with cat head and piano key teeth
  if (config.isPianoBoss) {
    const pianoSize = size * 1.4;
    const isAngry = boss.hitFlash > 0;
    const lidAngle = Math.sin(time * 3) * 0.15; // Animated lid clapping
    
    // Piano glow
    ctx.shadowColor = '#FF4757';
    ctx.shadowBlur = 25 + Math.sin(time * 4) * 8;
    
    // Piano body (black case)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.roundRect(-pianoSize/2, -pianoSize/4, pianoSize, pianoSize/2, pianoSize/12);
    ctx.fill();
    
    // Piano body gradient
    const bodyGrad = ctx.createLinearGradient(-pianoSize/2, -pianoSize/4, pianoSize/2, pianoSize/4);
    bodyGrad.addColorStop(0, '#1a1a1a');
    bodyGrad.addColorStop(0.5, '#0a0a0a');
    bodyGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-pianoSize/2, -pianoSize/4, pianoSize, pianoSize/2, pianoSize/12);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Animated piano lid (clapping)
    ctx.save();
    ctx.translate(0, -pianoSize/4);
    ctx.rotate(lidAngle);
    
    // Piano lid
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(-pianoSize/2.2, 0);
    ctx.lineTo(-pianoSize/3, -pianoSize/0.7);
    ctx.lineTo(pianoSize/3, -pianoSize/0.7);
    ctx.lineTo(pianoSize/2.2, 0);
    ctx.closePath();
    ctx.fill();
    
    // Lid highlight
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
    
    // Dust and notes flying out from under the lid
    if (Math.abs(lidAngle) > 0.1) {
      for (let i = 0; i < 5; i++) {
        const dustX = (Math.random() - 0.5) * pianoSize;
        const dustY = -pianoSize/4 - Math.random() * 30;
        const dustSize = 2 + Math.random() * 4;
        const dustAlpha = 0.4 + Math.random() * 0.4;
        
        ctx.fillStyle = `rgba(200, 180, 150, ${dustAlpha})`;
        ctx.beginPath();
        ctx.arc(dustX, dustY, dustSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Musical notes from lid
      const notes = ['♪', '♫', '♬', '♩'];
      for (let i = 0; i < 3; i++) {
        const noteX = (Math.random() - 0.5) * pianoSize * 0.8;
        const noteY = -pianoSize/3 - Math.random() * 40;
        ctx.fillStyle = `hsl(${(time * 100 + i * 90) % 360}, 80%, 60%)`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.font = `bold ${14 + Math.sin(time * 6 + i) * 4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(notes[i], noteX, noteY);
      }
    }
    
    ctx.shadowBlur = 0;
    
    // Cat head on top of piano
    ctx.save();
    ctx.translate(0, -pianoSize/0.8);
    
    // Head glow when angry
    if (isAngry) {
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 20;
    }
    
    // Cat head
    ctx.fillStyle = isAngry ? '#330000' : '#1a1a1a';
    ctx.beginPath();
    ctx.arc(0, 0, pianoSize/4, 0, Math.PI * 2);
    ctx.fill();
    
    // Cat ears
    ctx.fillStyle = isAngry ? '#440000' : '#2a2a2a';
    // Left ear
    ctx.beginPath();
    ctx.moveTo(-pianoSize/5, -pianoSize/8);
    ctx.lineTo(-pianoSize/2.5, -pianoSize/2.5);
    ctx.lineTo(-pianoSize/10, -pianoSize/5);
    ctx.closePath();
    ctx.fill();
    
    // Right ear
    ctx.beginPath();
    ctx.moveTo(pianoSize/5, -pianoSize/8);
    ctx.lineTo(pianoSize/2.5, -pianoSize/2.5);
    ctx.lineTo(pianoSize/10, -pianoSize/5);
    ctx.closePath();
    ctx.fill();
    
    // Inner ears
    ctx.fillStyle = '#FFD93D';
    ctx.beginPath();
    ctx.moveTo(-pianoSize/6, -pianoSize/10);
    ctx.lineTo(-pianoSize/3.5, -pianoSize/3.5);
    ctx.lineTo(-pianoSize/12, -pianoSize/6);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(pianoSize/6, -pianoSize/10);
    ctx.lineTo(pianoSize/3.5, -pianoSize/3.5);
    ctx.lineTo(pianoSize/12, -pianoSize/6);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Eyes - glowing red when angry
    ctx.fillStyle = isAngry ? '#FF0000' : '#FFD93D';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = isAngry ? 15 : 8;
    
    ctx.beginPath();
    ctx.arc(-pianoSize/10, -pianoSize/30, pianoSize/20, 0, Math.PI * 2);
    ctx.arc(pianoSize/10, -pianoSize/30, pianoSize/20, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(-pianoSize/10, -pianoSize/30, pianoSize/40, 0, Math.PI * 2);
    ctx.arc(pianoSize/10, -pianoSize/30, pianoSize/40, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(0, pianoSize/40);
    ctx.lineTo(-pianoSize/50, pianoSize/20);
    ctx.lineTo(pianoSize/50, pianoSize/20);
    ctx.closePath();
    ctx.fill();
    
    // Piano key teeth (the highlight feature!)
    const keyWidth = pianoSize/25;
    const keyHeight = pianoSize/12;
    
    // Upper teeth (white keys)
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue; // Gap for nose
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(i * keyWidth - keyWidth/2, pianoSize/15, keyWidth - 1, keyHeight);
      
      // Black key accents
      if (Math.abs(i) % 2 === 1) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(i * keyWidth - keyWidth/4, pianoSize/15, keyWidth/2, keyHeight * 0.5);
      }
    }
    
    // Lower teeth (white keys - bottom row)
    for (let i = -4; i <= 4; i++) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(i * keyWidth, pianoSize/8, keyWidth - 1, keyHeight * 0.8);
    }
    
    // Whiskers
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-pianoSize/6, pianoSize/25);
    ctx.lineTo(-pianoSize/2.5, pianoSize/20);
    ctx.moveTo(-pianoSize/6, pianoSize/15);
    ctx.lineTo(-pianoSize/2.5, pianoSize/10);
    ctx.moveTo(pianoSize/6, pianoSize/25);
    ctx.lineTo(pianoSize/2.5, pianoSize/20);
    ctx.moveTo(pianoSize/6, pianoSize/15);
    ctx.lineTo(pianoSize/2.5, pianoSize/10);
    ctx.stroke();
    
    ctx.restore();
    
    // Piano keys on front
    const frontKeyWidth = pianoSize/16;
    const frontKeyHeight = pianoSize/8;
    
    // White keys
    for (let i = -7; i <= 7; i++) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(i * frontKeyWidth - frontKeyWidth/2, pianoSize/6, frontKeyWidth - 1, frontKeyHeight);
      
      // Key border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(i * frontKeyWidth - frontKeyWidth/2, pianoSize/6, frontKeyWidth - 1, frontKeyHeight);
    }
    
    // Black keys
    const blackKeyPositions = [-6, -4, -2, 2, 4, 6];
    ctx.fillStyle = '#000000';
    blackKeyPositions.forEach(pos => {
      ctx.fillRect(pos * frontKeyWidth - frontKeyWidth/4, pianoSize/6, frontKeyWidth/2, frontKeyHeight * 0.6);
    });
    
    // Piano legs
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-pianoSize/2.5, pianoSize/4, pianoSize/12, pianoSize/4);
    ctx.fillRect(pianoSize/2.8, pianoSize/4, pianoSize/12, pianoSize/4);
    
    // Gold pedals
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(-pianoSize/10, pianoSize/2, pianoSize/15, pianoSize/25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(pianoSize/10, pianoSize/2, pianoSize/15, pianoSize/25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Floating musical notes around boss
    const floatingNotes = ['♪', '♫', '♬', '♩', '♭', '♯'];
    for (let i = 0; i < 6; i++) {
      const noteAngle = (i / 6) * Math.PI * 2 + time * 1.5;
      const noteDist = pianoSize/1.3 + Math.sin(time * 2 + i) * 15;
      const noteX = Math.cos(noteAngle) * noteDist;
      const noteY = Math.sin(noteAngle) * noteDist * 0.4 + Math.sin(time * 4 + i) * 8;
      
      ctx.fillStyle = `hsl(${(time * 60 + i * 60) % 360}, 90%, 65%)`;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.font = `bold ${16 + Math.sin(time * 5 + i) * 5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(floatingNotes[i], noteX, noteY);
    }
    
    ctx.shadowBlur = 0;
  }
  
  // TERMINATOR BOSS - Iron head cat with glowing red eye and laser
  if (config.isTerminator) {
    const termSize = size * 1.3;
    const isCharging = boss.shootTimer < 20; // About to shoot
    
    // Metallic glow
    ctx.shadowColor = isCharging ? '#FF0000' : '#C0C0C0';
    ctx.shadowBlur = isCharging ? 30 + Math.sin(time * 15) * 10 : 15;
    
    // Iron body (metallic rectangle)
    const bodyGrad = ctx.createLinearGradient(-termSize/2, -termSize/3, termSize/2, termSize/3);
    bodyGrad.addColorStop(0, '#696969');
    bodyGrad.addColorStop(0.3, '#A9A9A9');
    bodyGrad.addColorStop(0.5, '#C0C0C0');
    bodyGrad.addColorStop(0.7, '#A9A9A9');
    bodyGrad.addColorStop(1, '#696969');
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(-termSize/2, -termSize/3, termSize, termSize/1.5);
    
    // Body border
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 3;
    ctx.strokeRect(-termSize/2, -termSize/3, termSize, termSize/1.5);
    
    // Mechanical details on body
    ctx.fillStyle = '#404040';
    // Bolts
    const boltPositions = [[-termSize/2.5, -termSize/4], [termSize/2.5, -termSize/4], 
                           [-termSize/2.5, termSize/4], [termSize/2.5, termSize/4]];
    boltPositions.forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fill();
      // Bolt cross
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx - 2, by);
      ctx.lineTo(bx + 2, by);
      ctx.moveTo(bx, by - 2);
      ctx.lineTo(bx, by + 2);
      ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
    
    // Iron cat head
    ctx.save();
    ctx.translate(0, -termSize/0.9);
    
    // Head glow when charging
    if (isCharging) {
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 25 + Math.sin(time * 20) * 10;
    }
    
    // Metallic head
    const headGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, termSize/3);
    headGrad.addColorStop(0, '#808080');
    headGrad.addColorStop(0.7, '#696969');
    headGrad.addColorStop(1, '#404040');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(0, 0, termSize/3, 0, Math.PI * 2);
    ctx.fill();
    
    // Head border
    ctx.strokeStyle = '#202020';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Metal ears (triangular, mechanical)
    ctx.fillStyle = '#696969';
    // Left ear
    ctx.beginPath();
    ctx.moveTo(-termSize/4, -termSize/6);
    ctx.lineTo(-termSize/2.5, -termSize/2);
    ctx.lineTo(-termSize/8, -termSize/4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Right ear
    ctx.beginPath();
    ctx.moveTo(termSize/4, -termSize/6);
    ctx.lineTo(termSize/2.5, -termSize/2);
    ctx.lineTo(termSize/8, -termSize/4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Glowing RED EYE (the iconic feature!)
    const eyePulse = 0.7 + Math.sin(time * (isCharging ? 20 : 5)) * 0.3;
    
    // Eye socket
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -termSize/20, termSize/8, termSize/12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Glowing red eye
    ctx.fillStyle = `rgba(255, 0, 0, ${eyePulse})`;
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 20 * eyePulse;
    ctx.beginPath();
    ctx.ellipse(0, -termSize/20, termSize/10, termSize/16, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye slit (terminator style)
    ctx.fillStyle = '#FF4500';
    ctx.shadowBlur = 10;
    ctx.fillRect(-termSize/12, -termSize/25, termSize/6, termSize/30);
    
    ctx.shadowBlur = 0;
    
    // Laser charging effect
    if (isCharging) {
      // Laser beam building up
      const beamWidth = 4 + Math.sin(time * 30) * 2;
      ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(time * 25) * 0.3})`;
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 15;
      ctx.fillRect(-beamWidth/2, termSize/3, beamWidth, termSize);
      ctx.shadowBlur = 0;
      
      // Charging particles
      for (let i = 0; i < 5; i++) {
        const px = (Math.random() - 0.5) * termSize/2;
        const py = termSize/3 + Math.random() * termSize/2;
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(px, py, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Mechanical jaw
    ctx.fillStyle = '#696969';
    ctx.fillRect(-termSize/5, termSize/8, termSize/2.5, termSize/8);
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.strokeRect(-termSize/5, termSize/8, termSize/2.5, termSize/8);
    
    // Metal teeth
    ctx.fillStyle = '#C0C0C0';
    for (let i = -2; i <= 2; i++) {
      ctx.fillRect(i * termSize/12 - termSize/30, termSize/6, termSize/15, termSize/12);
    }
    
    ctx.restore();
    
    // Mechanical arms
    ctx.fillStyle = '#696969';
    // Left arm
    ctx.fillRect(-termSize/0.7, -termSize/6, termSize/3, termSize/8);
    // Right arm
    ctx.fillRect(termSize/0.9, -termSize/6, termSize/3, termSize/8);
    
    // Arm joints
    ctx.fillStyle = '#404040';
    ctx.beginPath();
    ctx.arc(-termSize/0.8, -termSize/10, 6, 0, Math.PI * 2);
    ctx.arc(termSize/0.8, -termSize/10, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Laser cannon on right arm
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(termSize/0.6, -termSize/4, termSize/4, termSize/6);
    
    // Cannon glow
    ctx.fillStyle = isCharging ? '#FF0000' : '#FF4500';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = isCharging ? 15 : 8;
    ctx.beginPath();
    ctx.arc(termSize/0.55, -termSize/5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Electric sparks around boss
    if (isCharging) {
      for (let i = 0; i < 8; i++) {
        const sparkAngle = (i / 8) * Math.PI * 2 + time * 5;
        const sparkDist = termSize/1.2 + Math.sin(time * 10 + i) * 10;
        const sx = Math.cos(sparkAngle) * sparkDist;
        const sy = Math.sin(sparkAngle) * sparkDist * 0.5;
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (Math.random() - 0.5) * 15, sy + (Math.random() - 0.5) * 15);
        ctx.stroke();
      }
    }
    
    // Floating red particles
    for (let i = 0; i < 6; i++) {
      const px = (Math.random() - 0.5) * termSize * 2;
      const py = (Math.random() - 0.5) * termSize;
      const alpha = 0.3 + Math.sin(time * 3 + i) * 0.2;
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
  }
  
  // JOKER CAT BOSS - Card master with playing card attacks
  if (config.isJoker) {
    const jokerSize = size * 1.2;
    
    // Rainbow glow
    const rainbowHue = (time * 100) % 360;
    ctx.shadowColor = `hsl(${rainbowHue}, 100%, 50%)`;
    ctx.shadowBlur = 25 + Math.sin(time * 5) * 10;
    
    // Joker body (purple with diamond pattern)
    const bodyGrad = ctx.createLinearGradient(-jokerSize/2, -jokerSize/3, jokerSize/2, jokerSize/3);
    bodyGrad.addColorStop(0, '#4B0082');
    bodyGrad.addColorStop(0.5, '#9400D3');
    bodyGrad.addColorStop(1, '#4B0082');
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(-jokerSize/2, -jokerSize/3, jokerSize, jokerSize/1.5);
    
    // Diamond pattern on body
    ctx.fillStyle = '#FFD700';
    ctx.globalAlpha = 0.3;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        ctx.save();
        ctx.translate(i * jokerSize/3, j * jokerSize/6);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-8, -8, 16, 16);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    
    ctx.shadowBlur = 0;
    
    // Joker head
    ctx.save();
    ctx.translate(0, -jokerSize/0.85);
    
    // Head glow
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 15;
    
    // Head (white with joker makeup)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, jokerSize/3.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Joker hat (three points)
    ctx.fillStyle = '#9400D3';
    ctx.beginPath();
    ctx.moveTo(-jokerSize/3, -jokerSize/6);
    ctx.lineTo(-jokerSize/4, -jokerSize/1.5);
    ctx.lineTo(0, -jokerSize/2);
    ctx.lineTo(jokerSize/4, -jokerSize/1.5);
    ctx.lineTo(jokerSize/3, -jokerSize/6);
    ctx.closePath();
    ctx.fill();
    
    // Hat bells
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(-jokerSize/4, -jokerSize/1.5, 5, 0, Math.PI * 2);
    ctx.arc(jokerSize/4, -jokerSize/1.5, 5, 0, Math.PI * 2);
    ctx.arc(0, -jokerSize/2, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Crazy joker eyes
    ctx.fillStyle = '#FF1493';
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 10;
    
    // Left eye (star shape)
    ctx.save();
    ctx.translate(-jokerSize/8, -jokerSize/30);
    ctx.rotate(time * 3);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const x = Math.cos(angle) * 8;
      const y = Math.sin(angle) * 8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Right eye (diamond shape)
    ctx.save();
    ctx.translate(jokerSize/8, -jokerSize/30);
    ctx.rotate(-time * 3);
    ctx.fillStyle = '#00FF00';
    ctx.shadowColor = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    ctx.shadowBlur = 0;
    
    // Joker smile
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, jokerSize/12, jokerSize/8, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    // Playing card symbols around head
    const suits = ['♥', '♦', '♣', '♠'];
    const suitColors = ['#FF0000', '#FF0000', '#000000', '#000000'];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + time * 2;
      const dist = jokerSize/1.8 + Math.sin(time * 4 + i) * 5;
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist * 0.5;
      
      ctx.fillStyle = suitColors[i];
      ctx.shadowColor = suitColors[i];
      ctx.shadowBlur = 8;
      ctx.font = `bold ${18 + Math.sin(time * 5 + i) * 4}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(suits[i], sx, sy);
    }
    
    ctx.restore();
    
    // Floating playing cards around boss
    const cards = ['A', 'K', 'Q', 'J', 'JOKER'];
    for (let i = 0; i < 5; i++) {
      const cardAngle = (i / 5) * Math.PI * 2 + time * 1.5;
      const cardDist = jokerSize * 1.3 + Math.sin(time * 3 + i) * 10;
      const cx = Math.cos(cardAngle) * cardDist;
      const cy = Math.sin(cardAngle) * cardDist * 0.4 + Math.sin(time * 5 + i) * 8;
      
      // Card background
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 10;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(cardAngle * 0.3);
      ctx.fillRect(-12, -16, 24, 32);
      
      // Card border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(-12, -16, 24, 32);
      
      // Card value
      ctx.fillStyle = i === 4 ? '#9400D3' : (i % 2 === 0 ? '#FF0000' : '#000000');
      ctx.shadowBlur = 0;
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cards[i], 0, 4);
      
      ctx.restore();
    }
    
    // Confetti particles
    for (let i = 0; i < 8; i++) {
      const px = (Math.random() - 0.5) * jokerSize * 2.5;
      const py = (Math.random() - 0.5) * jokerSize;
      const hue = (time * 50 + i * 45) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.fillRect(px, py, 4, 4);
    }
    
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
  
  // Health bar (outside translate)
  const barWidth = 160;
  const barHeight = 10;
  const barX = (BASE_WIDTH - barWidth) / 2;
  const barY = 12;
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
  ctx.strokeStyle = THEME.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
  
  const healthPercent = Math.max(0, health / maxHealth);
  const healthGradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
  healthGradient.addColorStop(0, '#FF0000');
  healthGradient.addColorStop(0.5, '#FF7F00');
  healthGradient.addColorStop(1, '#FFFF00');
  ctx.fillStyle = healthGradient;
  ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
  
  // Boss label with boss name
  ctx.fillStyle = config.color;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${config.name} #${Math.floor(bossesDefeated / BOSS_CONFIGS.length) + 1}`, BASE_WIDTH / 2, barY + 22);
};

// ============================================================================
// MAIN GAME COMPONENT
// ============================================================================

export function ImportedKimiGame() {
  const [pvpMatchId, setPvpMatchId] = useState<string | null>(null);
  const [pvpPlayerId, setPvpPlayerId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const entityIdRef = useRef<number>(0);
  const particleIdRef = useRef<number>(0);
  const textIdRef = useRef<number>(0);
  const bulletIdRef = useRef<number>(0);
  const {
    weapons: storeWeapons,
    currentSkinId,
    currentWeaponIndex: storeCurrentWeaponIndex,
    selectWeapon: storeSelectWeapon,
    unlockWeapon: storeUnlockWeapon,
    defeatBoss: storeDefeatBoss,
    addCoins: addStoreCoins,
    selectedMusicTrack,
    walletAddress,
    userId,
    multiplier,
  } = useGameStore();
  
  const [gameState, setGameState] = useState<GameState>('playing');
  const [score, setScore] = useState(0);
  const [meters, setMeters] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [weapon, setWeapon] = useState<WeaponType>('standard');
  const [sliderValue, setSliderValue] = useState(50);
  const [bossHealth, setBossHealth] = useState(0);
  const [powerUpActive, setPowerUpActive] = useState(false);
  const [powerUpTime, setPowerUpTime] = useState(0);
  const [beerMugActive, setBeerMugActive] = useState(false);
  const [beerMugTime, setBeerMugTime] = useState(0);
  const [nextBossScore, setNextBossScore] = useState(BOSS_APPEAR_SCORE);
  const [playerWobble, setPlayerWobble] = useState(0);
  const [bossesDefeated, setBossesDefeated] = useState(0);
  const [godMode, setGodMode] = useState(false);
  const [difficulty, setDifficulty] = useState(3);
  const [activeSkill, setActiveSkill] = useState<SkillType | null>(null);
  const [skillTimeLeft, setSkillTimeLeft] = useState(0);
  const [bgColor, setBgColor] = useState('#facc1530');
  const [showRunIntro, setShowRunIntro] = useState(true);
  const [ultimateChargeSeconds, setUltimateChargeSeconds] = useState(0);
  const [ultimateReady, setUltimateReady] = useState(false);
  const [ultimateActive, setUltimateActive] = useState(false);
  const [ultimateTimeLeft, setUltimateTimeLeft] = useState(0);
  const [pvpSummary, setPvpSummary] = useState<PvpUiSummary | null>(null);
  
  // Weapon unlock system synced with main store/shop
  const [unlockedWeapons, setUnlockedWeapons] = useState<Set<WeaponType>>(() => {
    const unlockedFromStore = (storeWeapons ?? [])
      .filter((entry) => entry.unlocked && WEAPON_TYPES.includes(entry.id as WeaponType))
      .map((entry) => entry.id as WeaponType);
    const unlockedFromRun = readPersistedRunUnlockedWeapons();
    const merged = new Set<WeaponType>([...unlockedFromStore, ...unlockedFromRun, 'standard']);
    return merged;
  });
  const selectedWeaponFromStore = (() => {
    const selected = storeWeapons?.[storeCurrentWeaponIndex];
    if (!selected?.unlocked) return null;
    if (!WEAPON_TYPES.includes(selected.id as WeaponType)) return null;
    return selected.id as WeaponType;
  })();
  
  const playerXRef = useRef(BASE_WIDTH / 2 - PLAYER_WIDTH / 2);
  const lastPlayerXRef = useRef(BASE_WIDTH / 2 - PLAYER_WIDTH / 2);
  const playerVelocityRef = useRef(0);
  const shieldActiveRef = useRef(false);
  const ultimateShieldActiveRef = useRef(false);
  const slowMoActiveRef = useRef(false);
  const doubleShotActiveRef = useRef(false);
  const magnetActiveRef = useRef(false);
  const reflectActiveRef = useRef(false);
  const krakenActiveRef = useRef(false);
  const skillEndTimesRef = useRef<Record<SkillType, number>>({
    magnet: 0,
    reflect: 0,
    double: 0,
    slowmo: 0,
    shield: 0,
    kraken: 0,
  });
  const entitiesRef = useRef<Entity[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const sparkRingsRef = useRef<SparkRing[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const musicNotesRef = useRef<MusicNote[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const bossRef = useRef<Boss | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const spawnTimerRef = useRef(0);
  const currentSpawnRateRef = useRef(BASE_SPAWN_RATE);
  const lastBulletTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const metersRef = useRef(0);
  const levelRef = useRef(1);
  const livesRef = useRef(3);
  const gameStateRef = useRef<GameState>('playing');
  const weaponRef = useRef<WeaponType>('standard');
  const currentSkinIdRef = useRef(currentSkinId);
  const powerUpEndTimeRef = useRef(0);
  const beerMugEndTimeRef = useRef(0);
  const nextBossScoreRef = useRef(BOSS_APPEAR_SCORE);
  const globalTimeRef = useRef(0);
  const sparkRingIdRef = useRef(0);
  const bossesDefeatedRef = useRef(0);
  const bossCooldownRef = useRef(0); // Cooldown after boss defeat (in ms)
  const projectileInterceptAttemptRef = useRef(0);
  const iceShotCounterRef = useRef(0);
  const bossFreezeUntilRef = useRef(0);
  const collectedUpgradeTypesRef = useRef<Set<EntityType>>(new Set());
  const ultimateChargeMsRef = useRef(0);
  const ultimateActiveUntilRef = useRef(0);
  const ultimateChargeDisplayRef = useRef(-1);
  const ultimateLeftDisplayRef = useRef(-1);
  const autoStartedRef = useRef(false);
  const pausedFromRef = useRef<'playing' | 'boss'>('playing');
  const wasAnySkillActiveRef = useRef(false);
  const introTimeoutRef = useRef<number | null>(null);
  const pvpSubmittingRef = useRef(false);
  const pvpSubmittedRef = useRef(false);
  const pvpRewardAppliedRef = useRef(false);
  const pvpResolvedUserIdRef = useRef<string | null>(null);
  const scoreSubmittedRef = useRef(false);
  const lastAppliedStoreWeaponRef = useRef<WeaponType | null>(null);
  
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { metersRef.current = meters; }, [meters]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { weaponRef.current = weapon; }, [weapon]);
  useEffect(() => { currentSkinIdRef.current = currentSkinId; }, [currentSkinId]);
  useEffect(() => { nextBossScoreRef.current = nextBossScore; }, [nextBossScore]);
  useEffect(() => { bossesDefeatedRef.current = bossesDefeated; }, [bossesDefeated]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('pvp');
    setPvpMatchId(id?.trim() || null);
  }, []);
  useEffect(() => {
    if (walletAddress) {
      setPvpPlayerId(walletAddress);
      return;
    }
    if (userId) {
      setPvpPlayerId(userId);
      return;
    }
    if (typeof window === 'undefined') return;
    setPvpPlayerId(getOrCreateLocalPvpPlayerId());
  }, [walletAddress, userId]);
  useEffect(() => {
    pvpSubmittingRef.current = false;
    pvpSubmittedRef.current = false;
    pvpRewardAppliedRef.current = false;
    pvpResolvedUserIdRef.current = null;
    scoreSubmittedRef.current = false;
    setPvpSummary(null);
  }, [pvpMatchId]);
  
  useEffect(() => {
    const saved = localStorage.getItem('napiwas-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (introTimeoutRef.current !== null) {
        window.clearTimeout(introTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedMusicTrack) {
      soundManager.setMusicTrack(selectedMusicTrack);
    }
  }, [selectedMusicTrack]);

  useEffect(() => {
    const unlockedFromStore = (storeWeapons ?? [])
      .filter((entry) => entry.unlocked && WEAPON_TYPES.includes(entry.id as WeaponType))
      .map((entry) => entry.id as WeaponType);
    const unlockedFromRun = readPersistedRunUnlockedWeapons();
    const merged = new Set<WeaponType>([...unlockedFromStore, ...unlockedFromRun, 'standard']);
    setUnlockedWeapons(merged);
  }, [storeWeapons]);

  useEffect(() => {
    const unlockedFromRun = readPersistedRunUnlockedWeapons();
    if (!unlockedFromRun.length) return;
    const unlockedInStore = new Set(
      (storeWeapons ?? [])
        .filter((entry) => entry.unlocked && WEAPON_TYPES.includes(entry.id as WeaponType))
        .map((entry) => entry.id as WeaponType)
    );
    unlockedFromRun.forEach((weaponType) => {
      if (!unlockedInStore.has(weaponType)) {
        storeUnlockWeapon(weaponType);
      }
    });
  }, [storeWeapons, storeUnlockWeapon]);

  useEffect(() => {
    if (!selectedWeaponFromStore) return;
    if (lastAppliedStoreWeaponRef.current === selectedWeaponFromStore) return;
    setWeapon(selectedWeaponFromStore);
    weaponRef.current = selectedWeaponFromStore;
    lastAppliedStoreWeaponRef.current = selectedWeaponFromStore;
  }, [selectedWeaponFromStore]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === 'q' || e.key === 'Q') cycleWeapon();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [weapon]);
  
  const cycleWeapon = () => {
    // Only cycle through unlocked weapons - include ALL weapon types
    const allWeapons: WeaponType[] = ['standard', 'spread', 'laser', 'chainsaw', 'missile', 'paw', 'beer', 'ice'];
    const unlockedList = allWeapons.filter(w => unlockedWeapons.has(w));
    if (unlockedList.length <= 1) return; // No other weapons to switch to
    
    const idx = unlockedList.indexOf(weaponRef.current);
    const next = unlockedList[(idx + 1) % unlockedList.length];
    setWeapon(next);
    const storeWeaponIndex = storeWeapons.findIndex((entry) => entry.id === next);
    if (storeWeaponIndex >= 0) {
      storeSelectWeapon(storeWeaponIndex);
    }
    soundManager.playPowerUp();
  };
  
  const unlockWeapon = (weaponType: WeaponType) => {
    if (unlockedWeapons.has(weaponType)) return false; // Already unlocked
    
    setUnlockedWeapons(prev => {
      const newSet = new Set(prev);
      newSet.add(weaponType);
      return newSet;
    });
    persistRunUnlockedWeapon(weaponType);
    storeUnlockWeapon(weaponType);
    
    // Don't switch to new weapon - let player decide
    spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 3, `${WEAPONS[weaponType].name} UNLOCKED!`, WEAPONS[weaponType].color);
    spawnSparkRing(BASE_WIDTH / 2, BASE_HEIGHT / 3, WEAPONS[weaponType].color, 60);
    soundManager.playPowerUp();
    return true;
  };
  
  const toggleSfx = () => {
    const newState = soundManager.toggleSfx();
    setSfxEnabled(newState);
    return newState;
  };
  
  const toggleMusic = async () => {
    const newState = await soundManager.toggleMusic();
    setMusicEnabled(newState);
    return newState;
  };

  const togglePauseSound = useCallback(() => {
    const shouldEnableAll = !(musicEnabled || sfxEnabled);
    if (shouldEnableAll) {
      if (!musicEnabled) void toggleMusic();
      if (!sfxEnabled) toggleSfx();
      return;
    }
    if (musicEnabled) void toggleMusic();
    if (sfxEnabled) toggleSfx();
  }, [musicEnabled, sfxEnabled]);
  
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number = 8) => {
    if (particlesRef.current.length > 60) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 3;
      const shapes: Array<'circle' | 'star' | 'square'> = ['circle', 'star', 'square'];
      particlesRef.current.push({
        id: particleIdRef.current++,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
        maxLife: 30,
        color,
        size: 2 + Math.random() * 3,
        shape: shapes[Math.floor(Math.random() * 3)],
      });
    }
  }, []);
  
  const spawnSparkRing = useCallback((x: number, y: number, color: string, maxRadius: number = 40) => {
    sparkRingsRef.current.push({
      id: sparkRingIdRef.current++,
      x, y,
      radius: 5,
      maxRadius,
      life: 25,
      maxLife: 25,
      color,
      width: 3,
    });
  }, []);
  
  const spawnSparks = useCallback((x: number, y: number, color: string, count: number = 12) => {
    if (particlesRef.current.length > 80) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 3 + Math.random() * 4;
      particlesRef.current.push({
        id: particleIdRef.current++,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20 + Math.random() * 10,
        maxLife: 30,
        color,
        size: 1 + Math.random() * 2,
        shape: 'spark',
      });
    }
  }, []);
  
  const spawnFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    if (floatingTextsRef.current.length > 12) floatingTextsRef.current.shift();
    floatingTextsRef.current.push({
      id: textIdRef.current++,
      x, y, text,
      life: 40,
      maxLife: 40,
      color,
      scale: 1,
      rotation: (Math.random() - 0.5) * 0.3,
    });
  }, []);

  const awardBossDailyReward = useCallback(
    async (bossLevel: number) => {
      const payoutWallet = walletAddress?.trim();
      if (!payoutWallet) return;
      if (!Number.isFinite(bossLevel) || bossLevel <= 0) return;

      try {
        const response = await fetch('/api/rewards', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            action: 'award_boss',
            wallet_address: payoutWallet,
            boss_level: Math.floor(bossLevel),
          }),
        });

        if (!response.ok) return;
        const payload = await response.json().catch(() => null);
        const awarded = Number(payload?.awarded ?? 0);
        if (awarded > 0) {
          spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 3 + 46, `+${awarded} NAPIWAS`, '#F59E0B');
        }
      } catch {
        // Do not block gameplay on payout API failures.
      }
    },
    [walletAddress, spawnFloatingText]
  );

  const isUpgradeEntity = (type: EntityType) => UPGRADE_ENTITY_TYPES.includes(type);
  const hasVisibleUpgradeDrop = () => entitiesRef.current.some((entry) => !entry.caught && isUpgradeEntity(entry.type));
  const markUpgradeCollected = (type: EntityType) => {
    if (!isUpgradeEntity(type)) return;
    collectedUpgradeTypesRef.current.add(type);
  };
  
  const spawnBullet = useCallback(() => {
    if (bulletsRef.current.length > 35) return;
    
    const now = Date.now();
    const w = WEAPONS[weaponRef.current];
    if (now - lastBulletTimeRef.current < w.cooldown) return;
    
    lastBulletTimeRef.current = now;
    const baseX = playerXRef.current + PLAYER_WIDTH / 2;
    const baseY = BASE_HEIGHT - PLAYER_HEIGHT - 10;
    
    // DOUBLE SHOT skill: fires two bullets
    const bulletCount = doubleShotActiveRef.current ? 2 : 1;
    const xOffset = doubleShotActiveRef.current ? 8 : 0;
    
    for (let b = 0; b < bulletCount; b++) {
      const bx = baseX + (b === 0 ? -xOffset : xOffset);
      
      switch (weaponRef.current) {
        case 'standard':
          bulletsRef.current.push({
            id: bulletIdRef.current++,
            x: bx, y: baseY,
            vx: 0, vy: -w.speed,
            life: 45, type: 'standard'
          });
          break;
        case 'spread':
          for (let i = -1; i <= 1; i++) {
            bulletsRef.current.push({
              id: bulletIdRef.current++,
              x: bx, y: baseY,
              vx: i * 4, vy: -w.speed,
              life: 40, type: 'spread'
            });
          }
          break;
        case 'laser':
          bulletsRef.current.push({
            id: bulletIdRef.current++,
            x: bx, y: baseY,
            vx: 0, vy: -w.speed,
            life: 30, type: 'laser'
          });
          break;
        case 'chainsaw':
          bulletsRef.current.push({
            id: bulletIdRef.current++,
            x: bx, y: baseY,
            vx: 0, vy: -w.speed,
            life: 25, type: 'chainsaw',
            rotation: 0
          });
          break;
        case 'missile':
          bulletsRef.current.push({
            id: bulletIdRef.current++,
            x: bx, y: baseY,
            vx: 0, vy: -w.speed,
            life: 80, type: 'missile',
            homingTarget: null,
            rotation: 0
          });
          break;
        case 'paw':
          bulletsRef.current.push({
            id: bulletIdRef.current++,
            x: bx, y: baseY,
            vx: (Math.random() - 0.5) * 3, vy: -w.speed,
            life: 50, type: 'paw',
            rotation: (Math.random() - 0.5) * 0.5
          });
          break;
        case 'beer':
          bulletsRef.current.push({
            id: bulletIdRef.current++,
            x: bx, y: baseY,
            vx: 0, vy: -w.speed * 0.8,
            life: 60, type: 'beer',
            explosionRadius: 50,
            rotation: 0
          });
          break;
        case 'ice':
          iceShotCounterRef.current += 1;
          const isFrostProc = iceShotCounterRef.current % 20 === 0;
          bulletsRef.current.push({
            id: bulletIdRef.current++,
            x: bx, y: baseY,
            vx: 0, vy: -w.speed,
            life: 45, type: 'ice',
            freezeDuration: isFrostProc ? 1000 : 0,
            isFrostProc,
            rotation: 0
          });
          break;
      }
    }
    
    // Visual effects
    if (doubleShotActiveRef.current) {
      spawnSparkRing(baseX - xOffset, baseY + 10, w.color, 20);
      spawnSparkRing(baseX + xOffset, baseY + 10, w.color, 20);
      spawnSparks(baseX, baseY + 10, w.color, 12);
    } else {
      spawnSparkRing(baseX, baseY + 10, w.color, 25);
      spawnSparks(baseX, baseY + 10, w.color, 8);
    }
    
    soundManager.playShoot(weaponRef.current);
  }, [spawnSparkRing, spawnSparks]);
  
  const spawnEntity = useCallback(() => {
    if (entitiesRef.current.length > 20) return;
    
    const rand = Math.random();
    let type: EntityType;
    let value = 10;
    const hasUpgradeOnField = hasVisibleUpgradeDrop();
    
    // Spawn distribution - increased cats, foxes, raccoons, skills, and mini Nyan Cats
    if (rand < 0.04) {
      type = 'bomb';
    } else if (rand < 0.08) {
      if (!hasUpgradeOnField && !collectedUpgradeTypesRef.current.has('beerMug')) {
        type = 'beerMug';
      } else {
        type = 'cat';
      }
    } else if (rand < 0.16) {
      type = 'fox';
      value = 30;
    } else if (rand < 0.22) {
      type = 'wolf';
      value = 40;
    } else if (rand < 0.30) {
      type = 'raccoon';
      value = 50;
    } else if (rand < 0.30) {
      type = 'tetris';
      value = 35;
    } else if (rand < 0.50) {
      // Life - 20% chance (4x more than before)
      type = 'life';
    } else if (rand < 0.55) {
      type = 'goldCat';
      value = 25;
    } else if (rand < 0.60) {
      // Skills: one at a time, no respawn after pickup in this run
      if (!hasUpgradeOnField) {
        const availableSkills: EntityType[] = [
          'skillMagnet',
          'skillReflect',
          'skillDouble',
          'skillSlowmo',
          'skillShield',
          'skillKraken',
        ];
        const skillPool = availableSkills.filter((entry) => !collectedUpgradeTypesRef.current.has(entry));
        if (skillPool.length > 0) {
          type = skillPool[Math.floor(Math.random() * skillPool.length)];
          value = 50;
        } else {
          type = 'cat';
        }
      } else {
        type = 'cat';
      }
    } else if (rand < 0.68) {
      // Weapon pickups: one at a time, no duplicates after pickup in this run
      if (!hasUpgradeOnField) {
        const allUnlockableWeapons: WeaponType[] = ['spread', 'laser', 'chainsaw', 'missile', 'paw', 'beer', 'ice'];
        const weaponMap: Record<WeaponType, EntityType> = {
          spread: 'weaponSpread',
          laser: 'weaponLaser',
          chainsaw: 'weaponChainsaw',
          missile: 'weaponMissile',
          paw: 'weaponPaw',
          beer: 'weaponBeer',
          ice: 'weaponIce',
          standard: 'weaponSpread',
        };
        const lockedWeapons = allUnlockableWeapons.filter((w) => {
          if (unlockedWeapons.has(w)) return false;
          const pickupType = weaponMap[w];
          return !collectedUpgradeTypesRef.current.has(pickupType);
        });
        if (lockedWeapons.length > 0) {
          const weaponType = lockedWeapons[Math.floor(Math.random() * lockedWeapons.length)];
          type = weaponMap[weaponType];
          value = 150;
        } else {
          type = 'cat';
        }
      } else {
        type = 'cat';
      }
    } else if (rand < 0.78) {
      // Guitar - 3% chance, dangerous obstacle
      type = 'guitar';
      value = 0; // No score for guitar
    } else if (rand < 0.81) {
      // Piano - 3% chance, dangerous obstacle
      type = 'piano';
      value = 0; // No score for piano
    } else if (rand < 0.88) {
      // Mini Nyan Cat - 7% chance, attacks with glowing spikes
      type = 'miniNyan';
      value = 15;
    } else {
      type = 'cat'; // 12% chance for regular cats
    }
    
    const isSkill = type?.startsWith('skill');
    const isWeapon = type?.startsWith('weapon');
    const speed = (type === 'goldCat' || isSkill || isWeapon) ? CAT_FALL_SPEED * 1.3 : 
                  (type === 'guitar' || type === 'piano') ? CAT_FALL_SPEED * 1.1 : CAT_FALL_SPEED;
    
    entitiesRef.current.push({
      id: entityIdRef.current++,
      type,
      x: 20 + Math.random() * (BASE_WIDTH - 40 - CAT_SIZE),
      y: -CAT_SIZE,
      speed,
      vx: 0,
      rotation: 0,
      caught: false,
      value,
      wobble: Math.random() * Math.PI * 2,
    });
  }, [unlockedWeapons]);
  
  // Spawn spikes falling from top (left or right side)
  const spawnSpike = useCallback(() => {
    const isLeft = Math.random() < 0.5;
    const spikeSize = 40;
    const xPos = isLeft 
      ? 20 + Math.random() * (BASE_WIDTH / 2 - 60) // Left half
      : BASE_WIDTH / 2 + 20 + Math.random() * (BASE_WIDTH / 2 - 60); // Right half
    
    entitiesRef.current.push({
      id: entityIdRef.current++,
      type: isLeft ? 'spikeLeft' : 'spikeRight',
      x: xPos,
      y: -spikeSize,
      speed: CAT_FALL_SPEED * 1.5, // Faster than normal entities
      vx: 0,
      rotation: 0,
      caught: false,
      value: 0,
      wobble: Math.random() * Math.PI * 2,
    });
  }, []);
  
  // Spawn tunnel (left and right walls with gap in middle, falling down)
  const spawnTunnel = useCallback(() => {
    const gapX = 80 + Math.random() * (BASE_WIDTH - 200); // Gap horizontal position
    const gapWidth = 90; // Width of the gap player must fit through
    const wallHeight = BASE_HEIGHT + 100; // Tall walls
    const wallSpeed = CAT_FALL_SPEED * 1.3;
    
    // Left wall
    entitiesRef.current.push({
      id: entityIdRef.current++,
      type: 'tunnelTop', // Using tunnelTop as left wall
      x: 0,
      y: -wallHeight,
      speed: wallSpeed,
      vx: 0,
      rotation: 0,
      caught: false,
      value: 0,
      wobble: 0,
    });
    
    // Right wall
    entitiesRef.current.push({
      id: entityIdRef.current++,
      type: 'tunnelBottom', // Using tunnelBottom as right wall
      x: gapX + gapWidth,
      y: -wallHeight,
      speed: wallSpeed,
      vx: 0,
      rotation: 0,
      caught: false,
      value: 0,
      wobble: 0,
    });
  }, []);
  
  // Spawn only skills during boss fight
  const spawnSkillOnly = useCallback(() => {
    if (entitiesRef.current.length > 15) return;
    if (hasVisibleUpgradeDrop()) return;

    const availableSkills: EntityType[] = [
      'skillMagnet',
      'skillReflect',
      'skillDouble',
      'skillSlowmo',
      'skillShield',
      'skillKraken',
    ];
    const skillPool = availableSkills.filter((entry) => !collectedUpgradeTypesRef.current.has(entry));
    if (skillPool.length === 0) return;
    const type = skillPool[Math.floor(Math.random() * skillPool.length)];
    
    entitiesRef.current.push({
      id: entityIdRef.current++,
      type,
      x: 20 + Math.random() * (BASE_WIDTH - 40 - CAT_SIZE),
      y: -CAT_SIZE,
      speed: CAT_FALL_SPEED * 1.2,
      vx: 0,
      rotation: 0,
      caught: false,
      value: 50,
      wobble: Math.random() * Math.PI * 2,
    });
  }, []);
  
  // NYAN CAT BOSS - Atari Style with scaling difficulty
  const initBoss = useCallback(() => {
    const defeated = bossesDefeatedRef.current;
    // Boss HP scaling (restored baseline)
    const difficultyMultiplier = Math.pow(1.1, defeated);
    
    const baseHealth = 30;
    let bossHealth = Math.floor(baseHealth * difficultyMultiplier);
    
    // Select boss type based on defeated count (cycles through 6 types)
    const bossTypeIndex = defeated % BOSS_CONFIGS.length;
    const bossType = BOSS_CONFIGS[bossTypeIndex];
    
    // Galactic Boss bonus
    if (bossTypeIndex === 5) {
      bossHealth = Math.floor(bossHealth * 1.3);
    }
    
    bossRef.current = {
      x: BASE_WIDTH / 2,
      y: 80,
      health: bossHealth,
      maxHealth: bossHealth,
      direction: 1,
      shootTimer: 0,
      moveTimer: 0,
      attackPattern: 0,
      invulnerable: false,
      hitFlash: 0,
      type: bossTypeIndex,
      color: bossType.color,
      weaponType: bossType.weapon as Boss['weaponType'],
    };
    
    setBossHealth(bossHealth);
    setGameState('boss');
    spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 3, `${bossType.name} #${defeated + 1}!`, bossType.color);
    entitiesRef.current = [];
  }, [spawnFloatingText]);
  
  const gameOver = useCallback(() => {
    soundManager.playGameOver();
    soundManager.pauseMusic();
    setGameState('gameover');
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem('napiwas-highscore', scoreRef.current.toString());
    }
  }, [highScore]);

  const submitRunScore = useCallback(async () => {
    if (scoreSubmittedRef.current) return;

    const finalScore = Math.max(0, Math.floor(scoreRef.current));
    if (finalScore <= 0) return;

    const identity =
      walletAddress?.trim() ||
      pvpPlayerId?.trim() ||
      userId?.trim() ||
      (typeof window !== 'undefined' ? getOrCreateLocalPvpPlayerId() : '');

    if (!identity) return;

    scoreSubmittedRef.current = true;

    try {
      await fetch('/api/score', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: identity,
          username: identity.startsWith('guest-') ? `Guest_${identity.slice(-6)}` : `Player_${identity.slice(-6)}`,
          score: finalScore,
          level: Math.max(1, Math.floor(levelRef.current)),
          meters: Math.max(0, Math.floor(metersRef.current)),
          bosses_defeated: Math.max(0, Math.floor(bossesDefeatedRef.current)),
          multiplier_used: Math.max(1, Number(multiplier || 1)),
        }),
      });
    } catch {
      scoreSubmittedRef.current = false;
    }
  }, [multiplier, pvpPlayerId, userId, walletAddress]);

  const postPvp = useCallback(async <T,>(payload: Record<string, unknown>): Promise<T> => {
    const response = await fetch('/api/pvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok || (json && typeof json.error === 'string')) {
      throw new Error((json && json.error) || 'PvP request failed');
    }

    return json as T;
  }, []);

  const resolveRemotePvpUserId = useCallback(async (): Promise<string | null> => {
    if (!pvpPlayerId) return null;
    if (pvpResolvedUserIdRef.current) return pvpResolvedUserIdRef.current;

    try {
      const response = await postPvp<{ userId: string }>({
        action: 'upsert_user',
        identity: pvpPlayerId,
      });
      if (!response.userId) return null;
      pvpResolvedUserIdRef.current = response.userId;
      return response.userId;
    } catch {
      return null;
    }
  }, [postPvp, pvpPlayerId]);

  const updatePvpSummaryFromMatch = useCallback(
    (
      match: PvpMatchSnapshot,
      currentPlayerId: string,
      fallbackScore: number,
      fallbackBosses: number
    ) => {
      const matchType: PvpUiMatchType = match.match_type === 'bosses' ? 'bosses' : 'score';
      const isCreator = match.creator_id === currentPlayerId;
      const isOpponent = match.opponent_id === currentPlayerId;
      if (!isCreator && !isOpponent) return;

      const rawMyMetric = isCreator ? match.creator_score : match.opponent_score;
      const rawOpponentMetric = isCreator ? match.opponent_score : match.creator_score;
      const fallbackMetric = matchType === 'bosses' ? fallbackBosses : fallbackScore;
      const myMetric = rawMyMetric === null ? fallbackMetric : Math.max(0, Math.floor(Number(rawMyMetric)));
      const opponentMetric = rawOpponentMetric === null ? null : Math.max(0, Math.floor(Number(rawOpponentMetric)));
      const winnerId = typeof match.winner_id === 'string' ? match.winner_id : null;

      setPvpSummary({
        status: typeof match.status === 'string' ? match.status : 'in_progress',
        matchType,
        myMetric,
        opponentMetric,
        didWin: winnerId ? winnerId === currentPlayerId : null,
      });
    },
    []
  );

  const applyPvpPayoutOnce = useCallback(
    (winnerId: string | null, currentPlayerId: string, betAmount: number) => {
      if (!winnerId || pvpRewardAppliedRef.current) return;
      const bet = Math.max(0, Number.isFinite(betAmount) ? betAmount : 0);
      const payout = Math.max(0, Math.floor(bet * 2 * 0.95));
      if (winnerId === currentPlayerId) {
        addStoreCoins(payout);
      } else if (bet > 0) {
        addStoreCoins(-bet);
      }
      pvpRewardAppliedRef.current = true;
    },
    [addStoreCoins]
  );

  const submitPvpResult = useCallback(async () => {
    if (!pvpMatchId || !pvpPlayerId) return;
    if (pvpSubmittingRef.current || pvpSubmittedRef.current) return;
    pvpSubmittingRef.current = true;

    try {
      const finalScore = Math.max(0, Math.floor(scoreRef.current));
      const finalBosses = Math.max(0, Math.floor(bossesDefeatedRef.current));
      const isLocalMatch = pvpMatchId.startsWith('local-');

      if (isLocalMatch) {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem(LOCAL_PVP_MATCHES_KEY);
          const localMatches = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
          const index = localMatches.findIndex((entry) => entry?.id === pvpMatchId);
          if (index >= 0) {
            const match = localMatches[index];
            const isCreator = match.creator_id === pvpPlayerId;
            const isOpponent = match.opponent_id === pvpPlayerId;
            if (isCreator || isOpponent) {
              const matchType = (match.match_type as string) ?? 'score';
              if (matchType === 'score' && match.status === 'completed') {
                pvpSubmittedRef.current = true;
                return;
              }
              const submittedMetric = matchType === 'bosses' ? finalBosses : finalScore;
              const creatorScore = isCreator ? submittedMetric : (match.creator_score as number | null);
              const opponentScore = isOpponent ? submittedMetric : (match.opponent_score as number | null);
              const bothSubmitted = creatorScore !== null && opponentScore !== null;

              let status: 'waiting' | 'in_progress' | 'completed' = match.opponent_id ? 'in_progress' : 'waiting';
              let winnerId: string | null = null;

              if (matchType === 'score' && match.opponent_id) {
                // Score mode = survival duel: first dead player loses immediately.
                status = 'completed';
                winnerId = isCreator ? (match.opponent_id as string) : (match.creator_id as string);
              } else if (bothSubmitted) {
                status = 'completed';
                winnerId = Number(creatorScore) >= Number(opponentScore)
                  ? (match.creator_id as string)
                  : (match.opponent_id as string);
              }

              localMatches[index] = {
                ...match,
                creator_score: creatorScore,
                opponent_score: opponentScore,
                status,
                winner_id: winnerId,
              };

              updatePvpSummaryFromMatch(
                localMatches[index] as unknown as PvpMatchSnapshot,
                pvpPlayerId,
                finalScore,
                finalBosses
              );

              localStorage.setItem(LOCAL_PVP_MATCHES_KEY, JSON.stringify(localMatches));

              applyPvpPayoutOnce(winnerId, pvpPlayerId, Number(match.bet_amount ?? 0));

              pvpSubmittedRef.current = true;
            }
          }
        }
        return;
      }

      const currentUserId = await resolveRemotePvpUserId();
      if (!currentUserId) return;

      const response = await postPvp<{
        status: string
        winnerId: string | null
        betAmount: number
      }>({
        action: 'submit',
        matchId: pvpMatchId,
        userId: currentUserId,
        score: finalScore,
        bosses: finalBosses,
      });

      if (response.status === 'completed' && response.winnerId) {
        applyPvpPayoutOnce(response.winnerId, currentUserId, Number(response.betAmount ?? 0));
      }

      const matchSnapshot = await postPvp<{ match: PvpMatchSnapshot }>({
        action: 'match',
        matchId: pvpMatchId,
      }).catch(() => null);

      if (matchSnapshot?.match) {
        updatePvpSummaryFromMatch(matchSnapshot.match, currentUserId, finalScore, finalBosses);
      }

      pvpSubmittedRef.current = true;
    } catch {
      // No-op: failure should not block game over flow
    } finally {
      pvpSubmittingRef.current = false;
    }
  }, [applyPvpPayoutOnce, postPvp, pvpMatchId, pvpPlayerId, resolveRemotePvpUserId, updatePvpSummaryFromMatch]);

  useEffect(() => {
    if (gameState !== 'gameover') return;
    void submitRunScore();
  }, [gameState, submitRunScore]);

  useEffect(() => {
    if (gameState !== 'gameover') return;
    void submitPvpResult();
  }, [gameState, submitPvpResult]);

  useEffect(() => {
    if (!pvpMatchId || !pvpPlayerId) return;
    if (gameState !== 'playing' && gameState !== 'boss' && gameState !== 'paused') return;

    let cancelled = false;

    const finalizeForCurrentPlayer = (
      winnerId: string | null,
      currentPlayerId: string,
      betAmount: number,
      myScoreSubmitted: boolean
    ) => {
      applyPvpPayoutOnce(winnerId, currentPlayerId, betAmount);
      if (gameStateRef.current !== 'gameover') {
        if (!myScoreSubmitted) {
          // Opponent already finished and match is closed: do not resubmit score.
          pvpSubmittedRef.current = true;
        }
        setGameState('gameover');
      }
    };

    const checkLocalMatchCompletion = () => {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(LOCAL_PVP_MATCHES_KEY);
      if (!raw) return;

      const localMatches = JSON.parse(raw) as Array<Record<string, unknown>>;
      const match = localMatches.find((entry) => entry?.id === pvpMatchId);
      if (!match) return;
      if (match.status !== 'completed') return;

      const isCreator = match.creator_id === pvpPlayerId;
      const isOpponent = match.opponent_id === pvpPlayerId;
      if (!isCreator && !isOpponent) return;

      updatePvpSummaryFromMatch(
        match as unknown as PvpMatchSnapshot,
        pvpPlayerId,
        Math.max(0, Math.floor(scoreRef.current)),
        Math.max(0, Math.floor(bossesDefeatedRef.current))
      );

      const myScoreSubmitted = isCreator
        ? match.creator_score !== null
        : match.opponent_score !== null;

      finalizeForCurrentPlayer(
        typeof match.winner_id === 'string' ? match.winner_id : null,
        pvpPlayerId,
        Number(match.bet_amount ?? 0),
        myScoreSubmitted
      );
    };

    const checkRemoteMatchCompletion = async () => {
      const currentUserId = await resolveRemotePvpUserId();
      if (!currentUserId) return;

      const response = await postPvp<{
        match: {
          id: string
          status: string
          match_type: string | null
          winner_id: string | null
          bet_amount: number | null
          creator_id: string | null
          opponent_id: string | null
          creator_score: number | null
          opponent_score: number | null
        }
      }>({
        action: 'match',
        matchId: pvpMatchId,
      });

      const match = response.match;
      if (!match || match.status !== 'completed') return;

      const isCreator = match.creator_id === currentUserId;
      const isOpponent = match.opponent_id === currentUserId;
      if (!isCreator && !isOpponent) return;

      updatePvpSummaryFromMatch(
        match as unknown as PvpMatchSnapshot,
        currentUserId,
        Math.max(0, Math.floor(scoreRef.current)),
        Math.max(0, Math.floor(bossesDefeatedRef.current))
      );

      const myScoreSubmitted = isCreator
        ? match.creator_score !== null
        : match.opponent_score !== null;

      finalizeForCurrentPlayer(
        typeof match.winner_id === 'string' ? match.winner_id : null,
        currentUserId,
        Number(match.bet_amount ?? 0),
        myScoreSubmitted
      );
    };

    const checkCompletion = async () => {
      if (cancelled) return;
      try {
        if (pvpMatchId.startsWith('local-')) {
          checkLocalMatchCompletion();
          return;
        }
        await checkRemoteMatchCompletion();
      } catch {
        // Ignore polling errors and keep gameplay running.
      }
    };

    void checkCompletion();
    const intervalId = window.setInterval(() => {
      void checkCompletion();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [applyPvpPayoutOnce, gameState, postPvp, pvpMatchId, pvpPlayerId, resolveRemotePvpUserId, updatePvpSummaryFromMatch]);

  useEffect(() => {
    if (!pvpMatchId || !pvpPlayerId) return;
    if (gameState !== 'gameover') return;

    let cancelled = false;

    const pollLocalGameoverResult = () => {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(LOCAL_PVP_MATCHES_KEY);
      if (!raw) return;
      const localMatches = JSON.parse(raw) as Array<Record<string, unknown>>;
      const match = localMatches.find((entry) => entry?.id === pvpMatchId);
      if (!match) return;
      updatePvpSummaryFromMatch(
        match as unknown as PvpMatchSnapshot,
        pvpPlayerId,
        Math.max(0, Math.floor(scoreRef.current)),
        Math.max(0, Math.floor(bossesDefeatedRef.current))
      );
    };

    const pollRemoteGameoverResult = async () => {
      const currentUserId = await resolveRemotePvpUserId();
      if (!currentUserId) return;
      const response = await postPvp<{ match: PvpMatchSnapshot }>({
        action: 'match',
        matchId: pvpMatchId,
      });
      if (!response?.match) return;
      updatePvpSummaryFromMatch(
        response.match,
        currentUserId,
        Math.max(0, Math.floor(scoreRef.current)),
        Math.max(0, Math.floor(bossesDefeatedRef.current))
      );
    };

    const tick = async () => {
      if (cancelled) return;
      try {
        if (pvpMatchId.startsWith('local-')) {
          pollLocalGameoverResult();
          return;
        }
        await pollRemoteGameoverResult();
      } catch {
        // Ignore polling errors and keep game-over screen stable.
      }
    };

    void tick();
    const intervalId = window.setInterval(() => {
      void tick();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [gameState, pvpMatchId, pvpPlayerId, postPvp, resolveRemotePvpUserId, updatePvpSummaryFromMatch]);
  
  // Activate skill when collected
  const activateSkill = useCallback((skillType: SkillType | null) => {
    if (!skillType) return;
    
    const skill = SKILLS[skillType];
    skillEndTimesRef.current[skillType] = Date.now() + skill.duration;
    wasAnySkillActiveRef.current = true;
    setActiveSkill(skillType);
    
    // Activate the specific skill effect
    switch (skillType) {
      case 'magnet':
        magnetActiveRef.current = true;
        break;
      case 'reflect':
        reflectActiveRef.current = true;
        break;
      case 'double':
        doubleShotActiveRef.current = true;
        break;
      case 'slowmo':
        slowMoActiveRef.current = true;
        break;
      case 'shield':
        shieldActiveRef.current = true;
        break;
      case 'kraken':
        krakenActiveRef.current = true;
        break;
    }

    const maxRemainingMs = Math.max(
      ...SKILL_TYPES.map((entry) => Math.max(0, skillEndTimesRef.current[entry] - Date.now()))
    );
    setSkillTimeLeft(Math.ceil(maxRemainingMs / 1000));
    
    spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 3, skill.name + '!', skill.color);
    spawnSparkRing(BASE_WIDTH / 2, BASE_HEIGHT / 3, skill.color, 50);
    soundManager.playPowerUp();
  }, [spawnFloatingText, spawnSparkRing]);
  
  const startGame = useCallback(() => {
    soundManager.init();
    soundManager.playMusic();
    setShowRunIntro(true);
    if (introTimeoutRef.current !== null) {
      window.clearTimeout(introTimeoutRef.current);
    }
    introTimeoutRef.current = window.setTimeout(() => {
      setShowRunIntro(false);
      introTimeoutRef.current = null;
    }, 900);
    setGameState('playing');
    setScore(0);
    setMeters(0);
    setLevel(1);
    const startingLives = godMode ? 100 : 3;
    setLives(startingLives);
    const startWeapon: WeaponType = selectedWeaponFromStore ?? weaponRef.current ?? 'standard';
    setWeapon(startWeapon);
    weaponRef.current = startWeapon;
    lastAppliedStoreWeaponRef.current = startWeapon;
    setPowerUpActive(false);
    setBeerMugActive(false);
    setActiveSkill(null);
    setSkillTimeLeft(0);
    setUltimateChargeSeconds(0);
    setUltimateReady(false);
    setUltimateActive(false);
    setUltimateTimeLeft(0);
    setPvpSummary(null);
    scoreSubmittedRef.current = false;
    setSliderValue(50);
    setNextBossScore(BOSS_APPEAR_SCORE);
    setBossesDefeated(0);
    const unlockedFromStore = (storeWeapons ?? [])
      .filter((entry) => entry.unlocked && WEAPON_TYPES.includes(entry.id as WeaponType))
      .map((entry) => entry.id as WeaponType);
    const unlockedFromRun = readPersistedRunUnlockedWeapons();
    const merged = new Set<WeaponType>([...unlockedFromStore, ...unlockedFromRun, 'standard']);
    setUnlockedWeapons(merged);
    
    scoreRef.current = 0;
    metersRef.current = 0;
    levelRef.current = 1;
    livesRef.current = startingLives;
    nextBossScoreRef.current = BOSS_APPEAR_SCORE;
    bossesDefeatedRef.current = 0;
    
    entitiesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    bulletsRef.current = [];
    bossRef.current = null;
    
    playerXRef.current = BASE_WIDTH / 2 - PLAYER_WIDTH / 2;
    lastPlayerXRef.current = BASE_WIDTH / 2 - PLAYER_WIDTH / 2;
    playerVelocityRef.current = 0;
    shieldActiveRef.current = false;
    ultimateShieldActiveRef.current = false;
    slowMoActiveRef.current = false;
    doubleShotActiveRef.current = false;
    magnetActiveRef.current = false;
    reflectActiveRef.current = false;
    wasAnySkillActiveRef.current = false;
    skillEndTimesRef.current = {
      magnet: 0,
      reflect: 0,
      double: 0,
      slowmo: 0,
      shield: 0,
      kraken: 0,
    };
    spawnTimerRef.current = 0;
    currentSpawnRateRef.current = BASE_SPAWN_RATE;
    lastBulletTimeRef.current = 0;
    powerUpEndTimeRef.current = 0;
    beerMugEndTimeRef.current = 0;
    projectileInterceptAttemptRef.current = 0;
    iceShotCounterRef.current = 0;
    bossFreezeUntilRef.current = 0;
    collectedUpgradeTypesRef.current = new Set();
    ultimateChargeMsRef.current = 0;
    ultimateActiveUntilRef.current = 0;
    ultimateChargeDisplayRef.current = -1;
    ultimateLeftDisplayRef.current = -1;
    lastTimeRef.current = 0;
    globalTimeRef.current = 0;
  }, [godMode, storeWeapons, selectedWeaponFromStore]);

  const activateUltimate = useCallback(() => {
    if (gameStateRef.current !== 'playing' && gameStateRef.current !== 'boss') return;
    if (ultimateChargeMsRef.current < ULTIMATE_CHARGE_MS) return;
    if (Date.now() < ultimateActiveUntilRef.current) return;

    const endAt = Date.now() + ULTIMATE_DURATION_MS;
    ultimateActiveUntilRef.current = endAt;
    ultimateShieldActiveRef.current = true;
    ultimateChargeMsRef.current = 0;
    ultimateChargeDisplayRef.current = 0;
    ultimateLeftDisplayRef.current = Math.ceil(ULTIMATE_DURATION_MS / 1000);

    setUltimateReady(false);
    setUltimateChargeSeconds(0);
    setUltimateActive(true);
    setUltimateTimeLeft(Math.ceil(ULTIMATE_DURATION_MS / 1000));

    const cx = playerXRef.current + PLAYER_WIDTH / 2;
    const cy = BASE_HEIGHT - PLAYER_HEIGHT + 20;
    spawnFloatingText(cx, cy - 42, 'ULT +200% DMG', '#F59E0B');
    spawnSparkRing(cx, cy, '#F59E0B', 56);
    spawnParticles(cx, cy, '#FBBF24', 18);
    soundManager.playPowerUp();
  }, [spawnFloatingText, spawnSparkRing, spawnParticles]);

  const pauseRun = useCallback(() => {
    if (gameStateRef.current !== 'playing' && gameStateRef.current !== 'boss') return;
    pausedFromRef.current = gameStateRef.current;
    setGameState('paused');
    soundManager.pauseMusic();
  }, []);

  const resumeRun = useCallback(() => {
    if (gameStateRef.current !== 'paused') return;
    setGameState(pausedFromRef.current);
    if (musicEnabled && soundManager.musicElement) {
      void soundManager.musicElement.play().catch(() => {});
    }
  }, [musicEnabled]);

  // Run gameplay once on mount. Do not restart run when store state changes.
  useEffect(() => {
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;
    startGame();
  }, [startGame]);

  // Update NYAN CAT BOSS - Atari Style Movement with scaling difficulty
  const updateBoss = useCallback((deltaTime: number) => {
    const boss = bossRef.current;
    if (!boss) return;
    
    const defeated = bossesDefeatedRef.current;
    const difficultyMultiplier = Math.pow(1.1, defeated);
    const nowMs = Date.now();
    const isBossFrozen = nowMs < bossFreezeUntilRef.current;
    
    // Decrease hit flash
    if (boss.hitFlash > 0) boss.hitFlash--;
    
    // Classic Space Invaders style movement
    if (!isBossFrozen) {
      boss.moveTimer += deltaTime;
      
      // Move side to side - base speed, increases with boss level
      const moveSpeed = 0.98 * difficultyMultiplier;
      boss.x += boss.direction * moveSpeed;
      
      // Bounce off walls
      if (boss.x > BASE_WIDTH - 70) {
        boss.x = BASE_WIDTH - 70;
        boss.direction = -1;
        boss.y += 8; // Move down when hitting wall
      } else if (boss.x < 70) {
        boss.x = 70;
        boss.direction = 1;
        boss.y += 8;
      }
      
      // Cap Y position
      boss.y = Math.min(boss.y, 160);
    }
    
    // Invulnerability toggle - faster toggle at higher difficulty
    if (!isBossFrozen) {
      const invulnerableTime = Math.max(2600, 3800 / difficultyMultiplier);
      boss.shootTimer += deltaTime;
      if (boss.shootTimer > invulnerableTime) {
        boss.invulnerable = !boss.invulnerable;
        boss.shootTimer = 0;
        if (boss.invulnerable) {
          spawnFloatingText(boss.x, boss.y - 60, 'SHIELD!', '#FF4757');
        }
      }
    }
    
    // Boss shoots at player - difficulty affects bullet count, not speed
    const isGalacticBoss = boss.type === 5;
    const baseShootInterval = boss.invulnerable ? 920 : 640;
    // Galactic Boss shoots slower but still dangerous
    const shootInterval = isGalacticBoss 
      ? Math.max(680, (baseShootInterval * 1.45) / difficultyMultiplier)
      : Math.max(360, baseShootInterval / difficultyMultiplier);
    if (!isBossFrozen && boss.shootTimer % shootInterval < 20) {
      const playerX = playerXRef.current + PLAYER_WIDTH / 2;
      const dx = playerX - boss.x;
      const dy = (BASE_HEIGHT - PLAYER_HEIGHT) - boss.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 4.8 * difficultyMultiplier;
      
      if (dist > 0) {
        const bulletsBefore = bulletsRef.current.length;
        // Different weapon patterns based on boss type
        switch (boss.weaponType) {
          case 'spread':
            // Spread shot - difficulty affects bullet count (difficulty 1-5)
            // difficulty 1 = 1 bullet, difficulty 5 = 5 bullets
            const spreadCount = Math.min(5, Math.max(1, difficulty));
            const angleStep = 0.15;
            const startAngle = -((spreadCount - 1) * angleStep) / 2;
            for (let i = 0; i < spreadCount; i++) {
              const angle = Math.atan2(dy, dx) + startAngle + i * angleStep;
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x, y: boss.y + 35,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 100,
                type: 'standard',
                isEnemy: true,
              });
            }
            break;
            
          case 'laser':
            // Laser - fast straight shot with side bullets
            bulletsRef.current.push({
              id: bulletIdRef.current++,
              x: boss.x, y: boss.y + 35,
              vx: (dx / dist) * speed * 1.5,
              vy: (dy / dist) * speed * 1.5,
              life: 100,
              type: 'laser',
              isEnemy: true,
            });
            if (!boss.invulnerable) {
              // Side lasers
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x - 30, y: boss.y + 20,
                vx: 0,
                vy: speed * 1.3,
                life: 100,
                type: 'laser',
                isEnemy: true,
              });
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + 30, y: boss.y + 20,
                vx: 0,
                vy: speed * 1.3,
                life: 100,
                type: 'laser',
                isEnemy: true,
              });
            }
            break;
            
          case 'rapid':
            // Rapid fire - difficulty affects bullet count
            const rapidCount = Math.min(5, Math.max(2, difficulty));
            for (let i = 0; i < rapidCount; i++) {
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + (Math.random() - 0.5) * 40, y: boss.y + 35,
                vx: (dx / dist) * speed * (0.8 + Math.random() * 0.4),
                vy: (dy / dist) * speed * (0.8 + Math.random() * 0.4),
                life: 80,
                type: 'standard',
                isEnemy: true,
              });
            }
            break;
            
          case 'homing':
            // Homing - difficulty affects bullet count
            const homingCount = Math.min(4, Math.max(1, difficulty - 1));
            for (let i = 0; i < homingCount; i++) {
              const offsetX = (i - (homingCount - 1) / 2) * 20;
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + offsetX, y: boss.y + 30 + Math.abs(offsetX) * 0.3,
                vx: (dx / dist) * speed * (0.7 + i * 0.1),
                vy: (dy / dist) * speed * (0.7 + i * 0.1),
                life: 120,
                type: 'standard',
                isEnemy: true,
              });
            }
            break;
            
          case 'wave':
            // Wave pattern - difficulty affects wave count
            const waveCount = Math.min(5, Math.max(1, difficulty));
            const waveStep = 25;
            const startOffset = -((waveCount - 1) * waveStep) / 2;
            for (let i = 0; i < waveCount; i++) {
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + startOffset + i * waveStep, y: boss.y + 35,
                vx: (i - (waveCount - 1) / 2) * 2,
                vy: speed,
                life: 100,
                type: 'standard',
                isEnemy: true,
              });
            }
            // Center aimed shot
            bulletsRef.current.push({
              id: bulletIdRef.current++,
              x: boss.x, y: boss.y + 35,
              vx: (dx / dist) * speed,
              vy: (dy / dist) * speed,
              life: 100,
              type: 'standard',
              isEnemy: true,
            });
            break;
            
          case 'chainsaw':
            // CHAINSAW - Galactic Boss special attack
            // Shoots spinning blade projectiles from both sides
            // Galactic Boss has 2x fewer bullets
            const chainsawCount = Math.min(3, Math.max(2, Math.floor(difficulty / 2)));
            const bladeSpeed = speed * 1.2;
            
            for (let i = 0; i < chainsawCount; i++) {
              const angleOffset = (i / chainsawCount) * Math.PI * 0.5 - Math.PI * 0.25;
              const angle = Math.atan2(dy, dx) + angleOffset;
              
              // Left blade
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x - 50, y: boss.y + 20,
                vx: Math.cos(angle) * bladeSpeed,
                vy: Math.sin(angle) * bladeSpeed,
                life: 150,
                type: 'laser', // Use laser type for visual
                isEnemy: true,
              });
              
              // Right blade
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + 50, y: boss.y + 20,
                vx: Math.cos(angle + 0.1) * bladeSpeed,
                vy: Math.sin(angle + 0.1) * bladeSpeed,
                life: 150,
                type: 'laser',
                isEnemy: true,
              });
            }
            
            // Additional center burst
            bulletsRef.current.push({
              id: bulletIdRef.current++,
              x: boss.x, y: boss.y + 40,
              vx: (dx / dist) * speed * 1.5,
              vy: (dy / dist) * speed * 1.5,
              life: 100,
              type: 'laser',
              isEnemy: true,
            });
            break;
            
          case 'furball':
            // MEGA GRAND MASTER - Furball attack with sparks
            // Shoots bouncing fur clumps that split
            const furballCount = Math.min(4, Math.max(2, difficulty));
            const furballSpeed = speed * 0.9;
            
            for (let i = 0; i < furballCount; i++) {
              const spreadAngle = ((i - (furballCount - 1) / 2) * 0.3);
              const angle = Math.atan2(dy, dx) + spreadAngle;
              
              // Main furball
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + (Math.random() - 0.5) * 30, 
                y: boss.y + 40,
                vx: Math.cos(angle) * furballSpeed,
                vy: Math.sin(angle) * furballSpeed,
                life: 200,
                type: 'spread', // Use spread type for visual
                isEnemy: true,
              });
              
              // Mini spark projectiles
              if (i % 2 === 0) {
                const sparkAngle = angle + (Math.random() - 0.5) * 0.5;
                bulletsRef.current.push({
                  id: bulletIdRef.current++,
                  x: boss.x, 
                  y: boss.y + 35,
                  vx: Math.cos(sparkAngle) * furballSpeed * 1.3,
                  vy: Math.sin(sparkAngle) * furballSpeed * 1.3,
                  life: 60,
                  type: 'laser',
                  isEnemy: true,
                });
              }
            }
            
            // Paw swipe attack - horizontal wave
            const pawCount = 3;
            for (let i = 0; i < pawCount; i++) {
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x - 40 + i * 40, 
                y: boss.y + 50,
                vx: (i - 1) * 3,
                vy: speed * 0.8,
                life: 120,
                type: 'standard',
                isEnemy: true,
              });
            }
            break;
            
          case 'notes':
            // SUPER GUITAR BOSS CAT - Musical note attack
            // Shoots colorful musical notes
            const noteCount = Math.min(6, Math.max(3, difficulty));
            
            for (let i = 0; i < noteCount; i++) {
              const spreadAngle = ((i - (noteCount - 1) / 2) * 0.25);
              const angle = Math.atan2(dy, dx) + spreadAngle;
              const noteSpeed = speed * (0.8 + Math.random() * 0.4);
              
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + (Math.random() - 0.5) * 40, 
                y: boss.y + 45,
                vx: Math.cos(angle) * noteSpeed,
                vy: Math.sin(angle) * noteSpeed,
                life: 150,
                type: 'spread',
                isEnemy: true,
              });
            }
            
            // Additional spiral notes
            const spiralTime = Date.now() / 1000;
            for (let i = 0; i < 4; i++) {
              const spiralAngle = (i / 4) * Math.PI * 2 + spiralTime * 3;
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + Math.cos(spiralAngle) * 30, 
                y: boss.y + 40 + Math.sin(spiralAngle) * 10,
                vx: Math.cos(spiralAngle) * speed * 0.7,
                vy: speed,
                life: 120,
                type: 'laser',
                isEnemy: true,
              });
            }
            break;
            
          case 'strings':
            // Guitar strings attack - shoots strings in all directions when angry
            const stringCount = 8;
            for (let i = 0; i < stringCount; i++) {
              const stringAngle = (i / stringCount) * Math.PI * 2;
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x, 
                y: boss.y + 35,
                vx: Math.cos(stringAngle) * speed * 1.2,
                vy: Math.sin(stringAngle) * speed * 1.2,
                life: 100,
                type: 'laser',
                isEnemy: true,
              });
            }
            break;
            
          case 'pianoStrings':
            // GRAND PIANO CAT BOSS - Piano string attack
            // Shoots piano strings in wave pattern
            const pianoStringCount = Math.min(7, Math.max(4, difficulty));
            
            for (let i = 0; i < pianoStringCount; i++) {
              const spreadAngle = ((i - (pianoStringCount - 1) / 2) * 0.2);
              const angle = Math.atan2(dy, dx) + spreadAngle;
              
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + (Math.random() - 0.5) * 50, 
                y: boss.y + 50,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 140,
                type: 'laser',
                isEnemy: true,
              });
            }
            
            // Side piano key projectiles
            if (!boss.invulnerable) {
              for (let i = 0; i < 5; i++) {
                const keyAngle = (i / 5) * Math.PI * 0.6 - Math.PI * 0.3;
                bulletsRef.current.push({
                  id: bulletIdRef.current++,
                  x: boss.x - 40, 
                  y: boss.y + 30,
                  vx: Math.sin(keyAngle) * speed * 0.8,
                  vy: Math.cos(keyAngle) * speed,
                  life: 100,
                  type: 'spread',
                  isEnemy: true,
                });
                bulletsRef.current.push({
                  id: bulletIdRef.current++,
                  x: boss.x + 40, 
                  y: boss.y + 30,
                  vx: -Math.sin(keyAngle) * speed * 0.8,
                  vy: Math.cos(keyAngle) * speed,
                  life: 100,
                  type: 'spread',
                  isEnemy: true,
                });
              }
            }
            break;
            
          case 'pianoLid':
            // GRAND PIANO CAT BOSS - Lid slam attack
            // Creates shockwave when lid slams
            const lidWaveCount = Math.min(12, Math.max(8, difficulty * 2));
            for (let i = 0; i < lidWaveCount; i++) {
              const waveAngle = (i / lidWaveCount) * Math.PI * 2;
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + Math.cos(waveAngle) * 20, 
                y: boss.y + 40,
                vx: Math.cos(waveAngle) * speed * 1.3,
                vy: Math.sin(waveAngle) * speed * 1.3,
                life: 80,
                type: 'laser',
                isEnemy: true,
              });
            }
            break;
            
          case 'terminatorLaser':
            // TERMINATOR BOSS - Single powerful laser pulse
            // Charges up then fires a devastating laser beam
            const laserPulseCount = Math.min(3, Math.max(1, Math.floor(difficulty / 2)));
            
            for (let i = 0; i < laserPulseCount; i++) {
              // Main laser beam - fast and deadly
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + (i - (laserPulseCount - 1) / 2) * 30, 
                y: boss.y + 50,
                vx: (Math.random() - 0.5) * 2,
                vy: speed * 1.5, // Faster than normal
                life: 120,
                type: 'laser',
                isEnemy: true,
              });
              
              // Side laser pulses
              if (i === 0) {
                bulletsRef.current.push({
                  id: bulletIdRef.current++,
                  x: boss.x - 40, 
                  y: boss.y + 40,
                  vx: -2,
                  vy: speed * 1.2,
                  life: 100,
                  type: 'laser',
                  isEnemy: true,
                });
              }
              if (i === laserPulseCount - 1) {
                bulletsRef.current.push({
                  id: bulletIdRef.current++,
                  x: boss.x + 40, 
                  y: boss.y + 40,
                  vx: 2,
                  vy: speed * 1.2,
                  life: 100,
                  type: 'laser',
                  isEnemy: true,
                });
              }
            }
            
            // Electric spark projectiles
            for (let i = 0; i < 4; i++) {
              const sparkAngle = (i / 4) * Math.PI * 2 + Date.now() / 500;
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + Math.cos(sparkAngle) * 35, 
                y: boss.y + 35,
                vx: Math.cos(sparkAngle) * speed * 0.8,
                vy: Math.sin(sparkAngle) * speed * 0.8 + speed * 0.5,
                life: 90,
                type: 'spread',
                isEnemy: true,
              });
            }
            break;
            
          case 'cards':
            // JOKER CAT BOSS - Card suit attack
            // Shoots card suits (hearts, diamonds, clubs, spades) and playing cards
            const cardCount = Math.min(6, Math.max(4, difficulty));
            
            // Card suit projectiles
            for (let i = 0; i < cardCount; i++) {
              const spreadAngle = ((i - (cardCount - 1) / 2) * 0.25);
              const angle = Math.atan2(dy, dx) + spreadAngle;
              
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: boss.x + (Math.random() - 0.5) * 40, 
                y: boss.y + 45,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 140,
                type: 'spread',
                isEnemy: true,
              });
            }
            
            // Playing card rain - cards falling from above
            const cardRainCount = Math.min(5, Math.max(3, difficulty - 1));
            for (let i = 0; i < cardRainCount; i++) {
              const cardX = 30 + (i / (cardRainCount - 1)) * (BASE_WIDTH - 60);
              bulletsRef.current.push({
                id: bulletIdRef.current++,
                x: cardX + (Math.random() - 0.5) * 30, 
                y: boss.y - 20,
                vx: (Math.random() - 0.5) * 2,
                vy: speed * 1.2,
                life: 160,
                type: 'laser',
                isEnemy: true,
              });
            }
            
            // Joker wild card - unpredictable bouncing card
            bulletsRef.current.push({
              id: bulletIdRef.current++,
              x: boss.x, 
              y: boss.y + 40,
              vx: (Math.random() - 0.5) * 6,
              vy: speed,
              life: 200,
              type: 'spread',
              isEnemy: true,
            });
            break;
        }

        // Global volley cap so attacks stay fair/playable.
        const spawnedNow = bulletsRef.current.length - bulletsBefore;
        const maxSpawnPerVolley = Math.max(2, Math.min(5, 2 + Math.floor(difficulty / 2)));
        if (spawnedNow > maxSpawnPerVolley) {
          const trimCount = spawnedNow - maxSpawnPerVolley;
          bulletsRef.current.splice(bulletsRef.current.length - trimCount, trimCount);
        }
      }
    }
    
    // Check boss hit by bullets
    bulletsRef.current.forEach(bullet => {
      if (bullet.isEnemy) return;
      
      const dx = bullet.x - boss.x;
      const dy = bullet.y - boss.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 45) {
        bullet.life = 0;
        
        if (bullet.type === 'ice' && bullet.isFrostProc) {
          const freezeMs = bullet.freezeDuration ?? 1000;
          bossFreezeUntilRef.current = Math.max(bossFreezeUntilRef.current, Date.now() + freezeMs);
          spawnSparkRing(boss.x, boss.y, '#93C5FD', 42);
          spawnFloatingText(boss.x, boss.y - 72, 'FREEZE 1S', '#93C5FD');
        }

        if (boss.invulnerable) {
          return;
        }

        const damageBoost = Date.now() < ultimateActiveUntilRef.current ? ULTIMATE_DAMAGE_MULTIPLIER : 1;
        const damage = WEAPONS[bullet.type].damage * damageBoost;
        boss.health -= damage;
        boss.hitFlash = 5;
        setBossHealth(boss.health);
        const bossColor = BOSS_CONFIGS[boss.type % BOSS_CONFIGS.length].color;
        spawnParticles(bullet.x, bullet.y, bossColor, 6);
        spawnSparkRing(bullet.x, bullet.y, bossColor, 25);
        spawnSparks(bullet.x, bullet.y, bossColor, 8);
        soundManager.playBossHit();
        
        // SUPER GUITAR BOSS CAT - Counter-attack when hit
        // Shoots guitar strings in all directions
        const isGuitarBoss = boss.type === 7; // Guitar boss is type 7
        if (isGuitarBoss) {
          const stringCount = 6;
          const speed = 5;
          for (let i = 0; i < stringCount; i++) {
            const stringAngle = (i / stringCount) * Math.PI * 2;
            bulletsRef.current.push({
              id: bulletIdRef.current++,
              x: boss.x, 
              y: boss.y + 35,
              vx: Math.cos(stringAngle) * speed,
              vy: Math.sin(stringAngle) * speed,
              life: 80,
              type: 'laser',
              isEnemy: true,
            });
          }
          // Visual effect for string attack
          spawnSparkRing(boss.x, boss.y + 35, '#FF6B00', 40);
        }
        
        if (boss.health <= 0) {
          soundManager.playBossDefeat();
          spawnParticles(boss.x, boss.y, '#FFD93D', 40);
          spawnSparkRing(boss.x, boss.y, '#FFD93D', 60);
          spawnSparkRing(boss.x, boss.y, bossColor, 80);
          spawnSparks(boss.x, boss.y, '#FFD93D', 20);
          spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 3, 'VICTORY!', '#FFD93D');
          
          const bonus = 500;
          scoreRef.current += bonus;
          setScore(scoreRef.current);
          addStoreCoins(bonus);
          spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 3 + 22, `+${bonus}🍺`, '#FFD93D');
          
          // Add 2 lives after boss defeat, but don't reduce if already above MAX_LIVES (God Mode)
          const newLives = livesRef.current > MAX_LIVES ? livesRef.current + 2 : Math.min(MAX_LIVES, livesRef.current + 2);
          livesRef.current = newLives;
          setLives(newLives);
          
          // Increment bosses defeated
          const newBossesDefeated = bossesDefeatedRef.current + 1;
          bossesDefeatedRef.current = newBossesDefeated;
          setBossesDefeated(newBossesDefeated);
          storeDefeatBoss();
          void awardBossDailyReward(newBossesDefeated);
          
          // Change background color to match the next boss
          setBgColor('#facc1530');
          
          // Next boss at 500 more points: 500, 1000, 1500, 2000...
          const newNextBoss = (newBossesDefeated + 1) * BOSS_APPEAR_SCORE;
          nextBossScoreRef.current = newNextBoss;
          setNextBossScore(newNextBoss);
          
          // Set cooldown for 30 seconds of normal gameplay after boss
          bossCooldownRef.current = BOSS_COOLDOWN;
          
          // Unlock weapon based on defeated boss type
          const defeatedBossType = boss.type % BOSS_CONFIGS.length;
          const weaponUnlocks: Record<number, WeaponType> = {
            0: 'spread',   // Nyan Cat unlocks Spread
            1: 'laser',    // Demon Cat unlocks Laser
            2: 'spread',   // Cyber Cat unlocks Spread
            3: 'laser',    // Phantom Cat unlocks Laser
            4: 'chainsaw', // Gold Cat unlocks Chainsaw
            5: 'chainsaw', // Galactic Cat unlocks Chainsaw
            6: 'chainsaw', // Mega Grand Master unlocks Chainsaw
          };
          
          const weaponToUnlock = weaponUnlocks[defeatedBossType];
          if (weaponToUnlock && !unlockedWeapons.has(weaponToUnlock)) {
            setTimeout(() => {
              unlockWeapon(weaponToUnlock);
            }, 500);
          }
          
          levelRef.current += 1;
          setLevel(levelRef.current);
          
          bossRef.current = null;
          // Return to normal gameplay
          setGameState('playing');
          bulletsRef.current = [];
          // Reset spawn timer to start spawning entities immediately
          spawnTimerRef.current = 0;
          // Clear any remaining enemy bullets
          bulletsRef.current = bulletsRef.current.filter(b => !b.isEnemy);
          return; // Exit updateBoss immediately
        }
      }
    });
    
    // Boss collision with player
    const playerCenterX = playerXRef.current + PLAYER_WIDTH / 2;
    const playerCenterY = BASE_HEIGHT - PLAYER_HEIGHT + 20;
    const dx = playerCenterX - boss.x;
    const dy = playerCenterY - boss.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 60 && !powerUpActive && !shieldActiveRef.current && !ultimateShieldActiveRef.current) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) gameOver();
        return newLives;
      });
      spawnSparkRing(playerCenterX, playerCenterY, '#FF4757', 30);
      spawnSparks(playerCenterX, playerCenterY, '#FF4757', 10);
      spawnFloatingText(playerCenterX, playerCenterY - 30, '-1', '#FF4757');
      soundManager.playHit();
    }
  }, [gameOver, powerUpActive, spawnFloatingText, spawnParticles, spawnSparkRing, spawnSparks, addStoreCoins, storeDefeatBoss, awardBossDailyReward]);
  
  const update = useCallback((deltaTime: number) => {
    globalTimeRef.current += deltaTime * 0.005;
    setPlayerWobble(globalTimeRef.current);
    
    if (gameStateRef.current === 'boss' && bossRef.current) {
      updateBoss(deltaTime);
    }
    
    if (gameStateRef.current !== 'playing' && gameStateRef.current !== 'boss') return; // Also handles 'paused' state
    const now = Date.now();

    if (now < ultimateActiveUntilRef.current) {
      const leftMs = ultimateActiveUntilRef.current - now;
      const leftSec = Math.ceil(leftMs / 1000);
      ultimateShieldActiveRef.current = true;
      if (!ultimateActive) setUltimateActive(true);
      if (ultimateLeftDisplayRef.current !== leftSec) {
        ultimateLeftDisplayRef.current = leftSec;
        setUltimateTimeLeft(leftSec);
      }
    } else {
      if (ultimateActiveUntilRef.current !== 0 || ultimateShieldActiveRef.current || ultimateActive) {
        ultimateActiveUntilRef.current = 0;
        ultimateShieldActiveRef.current = false;
        ultimateLeftDisplayRef.current = 0;
        setUltimateActive(false);
        setUltimateTimeLeft(0);
      }

      if (ultimateChargeMsRef.current < ULTIMATE_CHARGE_MS) {
        ultimateChargeMsRef.current = Math.min(ULTIMATE_CHARGE_MS, ultimateChargeMsRef.current + deltaTime);
        const chargeSec = Math.floor(ultimateChargeMsRef.current / 1000);
        if (ultimateChargeDisplayRef.current !== chargeSec) {
          ultimateChargeDisplayRef.current = chargeSec;
          setUltimateChargeSeconds(chargeSec);
        }
        if (ultimateChargeMsRef.current >= ULTIMATE_CHARGE_MS) {
          setUltimateReady(true);
          spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT - 80, 'ULT READY', '#F59E0B');
          spawnSparkRing(BASE_WIDTH / 2, BASE_HEIGHT - 80, '#F59E0B', 28);
        }
      }
    }

    // 1 meter = 0.05 second of survival
    metersRef.current += deltaTime / 50;
    setMeters(Math.floor(metersRef.current));
    
    // Player movement
    const prevX = playerXRef.current;
    if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
      playerXRef.current = Math.max(0, playerXRef.current - PLAYER_SPEED);
      setSliderValue(Math.round((playerXRef.current / (BASE_WIDTH - PLAYER_WIDTH)) * 100));
    }
    if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
      playerXRef.current = Math.min(BASE_WIDTH - PLAYER_WIDTH, playerXRef.current + PLAYER_SPEED);
      setSliderValue(Math.round((playerXRef.current / (BASE_WIDTH - PLAYER_WIDTH)) * 100));
    }
    
    // Calculate player velocity for REFLECTOR skill
    playerVelocityRef.current = Math.abs(playerXRef.current - prevX);
    lastPlayerXRef.current = prevX;
    
    // GUARDIAN: Stand Shield - update shield state based on movement
    if (shieldActiveRef.current) {
      const isStandingStill = playerVelocityRef.current < 0.5;
      if (!isStandingStill) {
        // Shield breaks when moving
        shieldActiveRef.current = false;
      }
    }
    
    // Power up timer
    if (powerUpActive) {
      const timeLeft = Math.max(0, powerUpEndTimeRef.current - Date.now());
      setPowerUpTime(Math.ceil(timeLeft / 1000));
      if (timeLeft <= 0) setPowerUpActive(false);
    }
    
    // Beer mug timer
    if (beerMugActive) {
      const timeLeft = Math.max(0, beerMugEndTimeRef.current - Date.now());
      setBeerMugTime(Math.ceil(timeLeft / 1000));
      if (timeLeft <= 0) {
        setBeerMugActive(false);
        spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 4, 'BOOST ENDED', '#FFD93D');
      }
    }
    
    // Skill timers - allow multiple active skills simultaneously
    let maxRemainingMs = 0;
    let maxSkill: SkillType | null = null;
    let anySkillStillActive = false;

    for (const skillType of SKILL_TYPES) {
      const endAt = skillEndTimesRef.current[skillType];
      if (endAt <= 0) continue;

      const timeLeftMs = endAt - now;
      if (timeLeftMs <= 0) {
        skillEndTimesRef.current[skillType] = 0;
        switch (skillType) {
          case 'magnet':
            magnetActiveRef.current = false;
            break;
          case 'reflect':
            reflectActiveRef.current = false;
            break;
          case 'double':
            doubleShotActiveRef.current = false;
            break;
          case 'slowmo':
            slowMoActiveRef.current = false;
            break;
          case 'shield':
            shieldActiveRef.current = false;
            break;
          case 'kraken':
            krakenActiveRef.current = false;
            break;
        }
        continue;
      }

      if (timeLeftMs > maxRemainingMs) {
        maxRemainingMs = timeLeftMs;
        maxSkill = skillType;
      }
      anySkillStillActive = true;
    }

    if (maxSkill) {
      setActiveSkill(maxSkill);
      setSkillTimeLeft(Math.ceil(maxRemainingMs / 1000));
      wasAnySkillActiveRef.current = true;
    } else {
      if (wasAnySkillActiveRef.current && !anySkillStillActive) {
        spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 4, 'SKILL ENDED!', '#FFD93D');
      }
      wasAnySkillActiveRef.current = false;
      setActiveSkill(null);
      setSkillTimeLeft(0);
    }
    
    // Decrease boss cooldown
    if (bossCooldownRef.current > 0) {
      bossCooldownRef.current = Math.max(0, bossCooldownRef.current - deltaTime);
    }
    
    spawnBullet();
    
    // Spawn entities during normal gameplay
    if (gameStateRef.current === 'playing') {
      spawnTimerRef.current += deltaTime;
      if (spawnTimerRef.current >= currentSpawnRateRef.current) {
        spawnEntity();
        spawnTimerRef.current = 0;
        currentSpawnRateRef.current = Math.max(
          MIN_SPAWN_RATE,
          BASE_SPAWN_RATE - (levelRef.current - 1) * 70
        );
      }
      
      // Spawn spikes periodically (5% chance per second)
      if (Math.random() < 0.05 * (deltaTime / 1000)) {
        spawnSpike();
      }
      
      // Spawn tunnel occasionally (2% chance per second)
      if (Math.random() < 0.02 * (deltaTime / 1000)) {
        spawnTunnel();
      }
      
      // Check for boss spawn at 500 points (only if cooldown is over)
      if (scoreRef.current >= nextBossScoreRef.current && !bossRef.current && bossCooldownRef.current <= 0) {
        initBoss();
      }
    }
    
    // Spawn skills during boss fight (only skills, no other entities)
    if (gameStateRef.current === 'boss') {
      spawnTimerRef.current += deltaTime;
      
      // Check if it's Galactic Boss (type 5)
      const isGalacticBoss = bossRef.current?.type === 5;
      const spawnRate = isGalacticBoss 
        ? currentSpawnRateRef.current * 0.75  // 2x faster spawn for Galactic Boss
        : currentSpawnRateRef.current * 1.5;  // Normal slower spawn for other bosses
      
      if (spawnTimerRef.current >= spawnRate) {
        if (isGalacticBoss) {
          // Galactic Boss: spawn 2x skills AND mini Nyan Cats
          spawnSkillOnly();
          // Spawn a second skill (2x skills)
          setTimeout(() => spawnSkillOnly(), 100);
          // 50% chance to also spawn a mini Nyan Cat
          if (Math.random() < 0.5) {
            entitiesRef.current.push({
              id: entityIdRef.current++,
              type: 'miniNyan',
              x: 20 + Math.random() * (BASE_WIDTH - 40 - CAT_SIZE),
              y: -CAT_SIZE,
              speed: CAT_FALL_SPEED * 1.2,
              vx: 0,
              rotation: 0,
              caught: false,
              value: 15,
              wobble: Math.random() * Math.PI * 2,
            });
          }
        } else {
          // Other bosses: only skills
          spawnSkillOnly();
        }
        spawnTimerRef.current = 0;
      }
    }
    
    // Update bullets
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      // TIME LORD: Time Warp - slows enemy bullets
      const timeScale = slowMoActiveRef.current && bullet.isEnemy ? 0.6 : 1;
      
      bullet.x += bullet.vx * timeScale;
      bullet.y += bullet.vy * timeScale;
      bullet.life--;
      
      if (bullet.isEnemy) {
        // Immediate intercept by any player bullet (order-independent).
        let interceptedBy: WeaponType | null = null;
        let interceptingBullet: Bullet | null = null;
        for (const playerBullet of bulletsRef.current) {
          if (playerBullet.isEnemy || playerBullet.life <= 0) continue;
          const radius = PROJECTILE_INTERCEPT_RADIUS[playerBullet.type] ?? 30;
          const px = bullet.x - playerBullet.x;
          const py = bullet.y - playerBullet.y;
          const pd = Math.sqrt(px * px + py * py);
          if (pd <= radius) {
            interceptedBy = playerBullet.type;
            interceptingBullet = playerBullet;
            break;
          }
        }

        if (interceptedBy) {
          projectileInterceptAttemptRef.current += 1;
          const shouldDestroy = projectileInterceptAttemptRef.current % PROJECTILE_INTERCEPT_EVERY === 0;
          if (shouldDestroy) {
            bullet.life = 0;
            if (interceptingBullet) {
              interceptingBullet.life = Math.min(interceptingBullet.life, 6);
            }
            spawnParticles(bullet.x, bullet.y, WEAPONS[interceptedBy].color, 4);
            spawnSparkRing(bullet.x, bullet.y, WEAPONS[interceptedBy].color, 18);
            return false;
          }
        }

        const playerCenterX = playerXRef.current + PLAYER_WIDTH / 2;
        const playerCenterY = BASE_HEIGHT - PLAYER_HEIGHT + 20;
        const dx = bullet.x - playerCenterX;
        const dy = bullet.y - playerCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // KRAKEN: Reflect bullets back at boss and deal damage
        if (krakenActiveRef.current && dist < 35) {
          // Reflect bullet back at boss
          if (bossRef.current) {
            const bossX = bossRef.current.x;
            const bossY = bossRef.current.y;
            const dxToBoss = bossX - bullet.x;
            const dyToBoss = bossY - bullet.y;
            const distToBoss = Math.sqrt(dxToBoss * dxToBoss + dyToBoss * dyToBoss);
            
            if (distToBoss > 0) {
              bullet.vx = (dxToBoss / distToBoss) * 12; // Fast return shot
              bullet.vy = (dyToBoss / distToBoss) * 12;
              bullet.isEnemy = false; // Now it's player's bullet
              
              // Damage boss
              const krakenDamageBoost = Date.now() < ultimateActiveUntilRef.current ? ULTIMATE_DAMAGE_MULTIPLIER : 1;
              bossRef.current.health -= 2 * krakenDamageBoost;
              bossRef.current.hitFlash = 5;
              setBossHealth(bossRef.current.health);
              
              spawnSparkRing(bullet.x, bullet.y, '#FF1493', 40);
              spawnFloatingText(bullet.x, bullet.y - 20, 'KRAKEN!', '#FF1493');
              soundManager.playBossHit();
              
              // Check if boss defeated
              if (bossRef.current.health <= 0) {
                soundManager.playBossDefeat();
                spawnParticles(bossRef.current.x, bossRef.current.y, '#FFD93D', 40);
                spawnSparkRing(bossRef.current.x, bossRef.current.y, '#FFD93D', 60);
                spawnSparkRing(bossRef.current.x, bossRef.current.y, '#FF1493', 80);
                spawnSparks(bossRef.current.x, bossRef.current.y, '#FFD93D', 20);
                spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 3, 'VICTORY!', '#FFD93D');
                
                bossRef.current = null;
                setGameState('playing');
                
                const bonus = 500;
                scoreRef.current += bonus;
                setScore(scoreRef.current);
                addStoreCoins(bonus);
                spawnFloatingText(BASE_WIDTH / 2, BASE_HEIGHT / 3 + 22, `+${bonus}🍺`, '#FFD93D');
                
                const newLives = livesRef.current > MAX_LIVES ? livesRef.current + 2 : Math.min(MAX_LIVES, livesRef.current + 2);
                livesRef.current = newLives;
                setLives(newLives);
                
                const newBossesDefeated = bossesDefeatedRef.current + 1;
                bossesDefeatedRef.current = newBossesDefeated;
                setBossesDefeated(newBossesDefeated);
                storeDefeatBoss();
                void awardBossDailyReward(newBossesDefeated);
                
                setBgColor('#facc1530');
                
                const newNextBoss = (newBossesDefeated + 1) * BOSS_APPEAR_SCORE;
                nextBossScoreRef.current = newNextBoss;
                setNextBossScore(newNextBoss);
                
                bossCooldownRef.current = BOSS_COOLDOWN;
              }
            }
          }
          return true;
        }
        
        // REFLECTOR: Bullet Deflect - quick movement reflects bullets
        const isReflecting = reflectActiveRef.current && playerVelocityRef.current > 8;
        if (isReflecting && dist < 50) {
          // Deflect bullet away from player
          bullet.vx = -bullet.vx * 1.5;
          bullet.vy = -bullet.vy * 0.5;
          bullet.isEnemy = false; // Now it's player's bullet
          spawnSparkRing(bullet.x, bullet.y, '#3742FA', 30);
          spawnFloatingText(bullet.x, bullet.y - 20, 'DEFLECT!', '#3742FA');
          return true;
        }
        
        // GUARDIAN: Stand Shield - invincible when standing still
        if (dist < 22 && !powerUpActive && !shieldActiveRef.current && !ultimateShieldActiveRef.current) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) gameOver();
            return newLives;
          });
          spawnSparkRing(playerCenterX, playerCenterY, '#FF4757', 25);
          spawnSparks(playerCenterX, playerCenterY, '#FF4757', 8);
          spawnFloatingText(playerCenterX, playerCenterY - 30, '-1', '#FF4757');
          soundManager.playHit();
          return false;
        }
        
        // Shield blocked the bullet
        if (dist < 22 && (shieldActiveRef.current || ultimateShieldActiveRef.current)) {
          const blockColor = ultimateShieldActiveRef.current ? '#F59E0B' : '#2ED573';
          spawnSparkRing(playerCenterX, playerCenterY, blockColor, 25);
          spawnFloatingText(playerCenterX, playerCenterY - 30, 'BLOCK!', blockColor);
          return false;
        }
      } else {
        // PLAYER BULLET SPECIAL BEHAVIORS
        
        // MISSILE: Homing towards boss
        if (bullet.type === 'missile' && bossRef.current) {
          const bossX = bossRef.current.x;
          const bossY = bossRef.current.y;
          const dx = bossX - bullet.x;
          const dy = bossY - bullet.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0) {
            // Gradually turn towards boss
            const targetVx = (dx / dist) * WEAPONS.missile.speed;
            const targetVy = (dy / dist) * WEAPONS.missile.speed;
            bullet.vx += (targetVx - bullet.vx) * 0.08;
            bullet.vy += (targetVy - bullet.vy) * 0.08;
            // Update rotation based on velocity
            bullet.rotation = Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2;
          }
        }
        
        // CHAINSAW: Spinning rotation
        if (bullet.type === 'chainsaw') {
          bullet.rotation = (bullet.rotation || 0) + 0.3;
        }
        
        // BEER BOTTLE: Explosion on contact with enemy bullets
        if (bullet.type === 'beer') {
          // Check for nearby enemy bullets
          bulletsRef.current.forEach(otherBullet => {
            if (otherBullet.isEnemy && otherBullet.id !== bullet.id) {
              const dx = bullet.x - otherBullet.x;
              const dy = bullet.y - otherBullet.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < (bullet.explosionRadius || 50)) {
                // Destroy enemy bullet
                otherBullet.life = 0;
                // Create explosion effect
                spawnParticles(otherBullet.x, otherBullet.y, '#00AA00', 8);
                spawnSparkRing(otherBullet.x, otherBullet.y, '#00AA00', 30);
              }
            }
          });
        }
        
        // ICE SHARD: Freeze enemy bullets in radius
        if (bullet.type === 'ice') {
          const freezeRadius = 40;
          bulletsRef.current.forEach(otherBullet => {
            if (otherBullet.isEnemy && otherBullet.id !== bullet.id) {
              const dx = bullet.x - otherBullet.x;
              const dy = bullet.y - otherBullet.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < freezeRadius) {
                // Freeze the enemy bullet (slow it down significantly)
                otherBullet.vx *= 0.3;
                otherBullet.vy *= 0.3;
                // Visual freeze effect
                if (Math.random() < 0.1) {
                  spawnParticles(otherBullet.x, otherBullet.y, '#00D2D3', 2);
                }
              }
            }
          });
        }

      }
      
      return bullet.life > 0 && bullet.y > -20 && bullet.y < BASE_HEIGHT + 20;
    });
    
    // Update entities
    entitiesRef.current = entitiesRef.current.filter(entity => {
      if (entity.caught) return false;
      
      // MAGNET: Life Magnet - attracts lives and bonuses
      const isAttractable = entity.type === 'life' || entity.type === 'goldCat' || entity.type === 'beerMug' || entity.type?.startsWith('skill');
      const pCenterX = playerXRef.current + PLAYER_WIDTH / 2;
      const eCenterX = entity.x + CAT_SIZE / 2;
      const eCenterY = entity.y + CAT_SIZE / 2;
      const distToPlayer = Math.abs(pCenterX - eCenterX);
      
      if (magnetActiveRef.current && isAttractable && distToPlayer < 100 && eCenterY < BASE_HEIGHT - 50) {
        // Pull entity towards player
        const pullStrength = 0.15;
        entity.x += (pCenterX - eCenterX) * pullStrength;
        entity.y += 2; // Slight downward pull
        
        // Visual effect for magnet pull
        if (Math.random() < 0.1) {
          spawnParticles(eCenterX, eCenterY, '#00D2D3', 2);
        }
      }
      
      // TIME LORD: Time Warp - slows falling objects
      const timeScale = slowMoActiveRef.current ? 0.6 : 1;
      
      // Handle different entity movement types
      if (entity.type === 'spikeLeft' || entity.type === 'spikeRight' || 
          entity.type === 'tunnelTop' || entity.type === 'tunnelBottom') {
        // Spikes and tunnels fall down from top
        entity.y += entity.speed * timeScale;
      } else {
        // Normal entities fall down
        entity.y += entity.speed * timeScale;
      }
      
      entity.wobble += 0.08;
      
      // Mini Nyan Cat attack - shoots rare glowing spikes
      if (entity.type === 'miniNyan' && !entity.caught) {
        // Rare attack chance (about once every 2-3 seconds)
        if (Math.random() < 0.008) {
          const playerCenterX = playerXRef.current + PLAYER_WIDTH / 2;
          const playerCenterY = BASE_HEIGHT - PLAYER_HEIGHT + 20;
          const miniNyanCenterX = entity.x + CAT_SIZE / 2;
          const miniNyanCenterY = entity.y + CAT_SIZE / 2;
          
          const dx = playerCenterX - miniNyanCenterX;
          const dy = playerCenterY - miniNyanCenterY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0) {
            // Shoot glowing spike
            bulletsRef.current.push({
              id: bulletIdRef.current++,
              x: miniNyanCenterX,
              y: miniNyanCenterY + 15,
              vx: (dx / dist) * 3, // Slow speed
              vy: (dy / dist) * 3,
              life: 150,
              type: 'laser',
              isEnemy: true,
            });
            
            // Visual effect for spike shot
            spawnSparkRing(miniNyanCenterX, miniNyanCenterY + 15, '#FF6B9D', 20);
          }
        }
      }
      
      // Bullet hits
      bulletsRef.current.forEach(bullet => {
        if (bullet.isEnemy) return;
        
        const size = entity.type === 'goldCat' ? GOLD_CAT_SIZE : CAT_SIZE;
        const dx = bullet.x - (entity.x + size / 2);
        const dy = bullet.y - (entity.y + size / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < size / 2 + 8) {
          // Skills are invulnerable during boss fight
          const isSkill = entity.type?.startsWith('skill');
          if (isSkill && gameStateRef.current === 'boss' && bullet.type !== 'paw') {
            // Skills can't be destroyed by bullets during boss
            return;
          }
          
          const isHardObstacle =
            entity.type === 'spikeLeft' || entity.type === 'spikeRight' ||
            entity.type === 'tunnelTop' || entity.type === 'tunnelBottom';
          const isMusicObstacle = entity.type === 'guitar' || entity.type === 'piano';

          // LASER can destroy all obstacle types
          if (bullet.type === 'laser' && (isHardObstacle || isMusicObstacle)) {
            entity.caught = true;
            bullet.life = 0;

            const obstacleReward = entity.type === 'guitar' || entity.type === 'piano' ? 100 : 35;
            scoreRef.current += obstacleReward;
            setScore(scoreRef.current);

            const hitX = entity.x + size / 2;
            const hitY = entity.y + size / 2;
            spawnParticles(hitX, hitY, '#F59E0B', 12);
            spawnSparkRing(hitX, hitY, '#F59E0B', 36);
            spawnSparks(hitX, hitY, '#FBBF24', 12);
            spawnFloatingText(hitX, hitY - 18, `+${obstacleReward}🍺`, '#FBBF24');
            soundManager.playBossHit();
            return;
          }

          // Non-laser bullets still pass through hard obstacles
          if (isHardObstacle) {
            return;
          }

          const isUpgradeDrop =
            entity.type === 'life' ||
            entity.type === 'beerMug' ||
            entity.type.startsWith('skill') ||
            entity.type.startsWith('weapon');

          // PAW auto-collects upgrades and pickups on hit
          if (bullet.type === 'paw' && isUpgradeDrop) {
            const hitX = entity.x + size / 2;
            const hitY = entity.y + size / 2;
            entity.caught = true;
            bullet.life = 0;
            markUpgradeCollected(entity.type);

            switch (entity.type) {
              case 'life': {
                const newLives = livesRef.current > MAX_LIVES ? livesRef.current + 1 : Math.min(MAX_LIVES, livesRef.current + 1);
                livesRef.current = newLives;
                setLives(newLives);
                spawnFloatingText(hitX, hitY - 24, '+❤️', '#FF4757');
                break;
              }
              case 'beerMug':
                setBeerMugActive(true);
                beerMugEndTimeRef.current = Date.now() + BEER_MUG_DURATION;
                spawnFloatingText(hitX, hitY - 24, 'BOOST!', '#FFD93D');
                break;
              case 'skillMagnet':
                activateSkill('magnet');
                break;
              case 'skillReflect':
                activateSkill('reflect');
                break;
              case 'skillDouble':
                activateSkill('double');
                break;
              case 'skillSlowmo':
                activateSkill('slowmo');
                break;
              case 'skillShield':
                activateSkill('shield');
                break;
              case 'skillKraken':
                activateSkill('kraken');
                break;
              case 'weaponSpread':
                unlockWeapon('spread');
                break;
              case 'weaponLaser':
                unlockWeapon('laser');
                break;
              case 'weaponChainsaw':
                unlockWeapon('chainsaw');
                break;
              case 'weaponMissile':
                unlockWeapon('missile');
                break;
              case 'weaponPaw':
                unlockWeapon('paw');
                break;
              case 'weaponBeer':
                unlockWeapon('beer');
                break;
              case 'weaponIce':
                unlockWeapon('ice');
                break;
            }

            spawnParticles(hitX, hitY, '#FF69B4', 10);
            spawnSparkRing(hitX, hitY, '#FF69B4', 30);
            spawnSparks(hitX, hitY, '#FBBF24', 8);
            soundManager.playPowerUp();
            return;
          }
          
          // GUITAR: Bullet hits guitar - guitar bounces away with ringing sound
          if (entity.type === 'guitar') {
            const nowHit = Date.now();
            if (entity.lastHitAt && nowHit - entity.lastHitAt < 140) {
              return;
            }
            entity.lastHitAt = nowHit;
            const entityCenterX = entity.x + size / 2;
            const entityCenterY = entity.y + size / 2;
            bullet.life = 0;
            
            // Add 100 points for hitting guitar
            scoreRef.current += 100;
            setScore(scoreRef.current);
            spawnFloatingText(entityCenterX, entityCenterY - 30, '+100🍺', '#FFD93D');
            
            // Bounce guitar away
            entity.vx = (Math.random() - 0.5) * 8;
            entity.vy = -entity.speed * 0.8;
            entity.rotation = (entity.rotation || 0) + (Math.random() - 0.5) * 1;
            
            // Spawn animated music notes
            const notes = ['♪', '♫', '♬', '♩'];
            const noteColors = ['#FF6B00', '#FFD93D', '#FF4757', '#00D2D3'];
            for (let i = 0; i < 3; i++) {
              musicNotesRef.current.push({
                x: entityCenterX + (Math.random() - 0.5) * 40,
                y: entityCenterY + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 3,
                vy: -2 - Math.random() * 2,
                life: 30 + Math.random() * 15,
                maxLife: 45,
                note: notes[Math.floor(Math.random() * notes.length)],
                color: noteColors[Math.floor(Math.random() * noteColors.length)]
              });
            }
            
            // Visual effects
            spawnSparkRing(entityCenterX, entityCenterY, '#FF6B00', 35);
            spawnParticles(entityCenterX, entityCenterY, '#FFD93D', 6);
            
            // Ringing sound effect
            soundManager.playPowerUp();
            
            // Bullet is consumed to prevent repetitive multi-hit lag
            return;
          }
          
          // PIANO: Bullet hits piano - piano bounces away with sound and scattering keys
          if (entity.type === 'piano') {
            const nowHit = Date.now();
            if (entity.lastHitAt && nowHit - entity.lastHitAt < 140) {
              return;
            }
            entity.lastHitAt = nowHit;
            const entityCenterX = entity.x + size / 2;
            const entityCenterY = entity.y + size / 2;
            bullet.life = 0;
            
            // Add 100 points for hitting piano
            scoreRef.current += 100;
            setScore(scoreRef.current);
            spawnFloatingText(entityCenterX, entityCenterY - 30, '+100🍺', '#FFD93D');
            
            // Bounce piano away
            entity.vx = (Math.random() - 0.5) * 8;
            entity.vy = -entity.speed * 0.8;
            entity.rotation = (entity.rotation || 0) + (Math.random() - 0.5) * 1;
            
            // Spawn scattering piano keys
            const keyTypes = ['🎹', '⚫', '⚪', '▪', '▫'];
            const keyColors = ['#FFFFFF', '#000000', '#333333', '#FFD93D', '#FF6B00'];
            for (let i = 0; i < 3; i++) {
              const angle = (i / 3) * Math.PI * 2;
              const speed = 3 + Math.random() * 3;
              musicNotesRef.current.push({
                x: entityCenterX,
                y: entityCenterY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                life: 30 + Math.random() * 15,
                maxLife: 45,
                note: keyTypes[Math.floor(Math.random() * keyTypes.length)],
                color: keyColors[Math.floor(Math.random() * keyColors.length)]
              });
            }
            
            // Visual effects
            spawnSparkRing(entityCenterX, entityCenterY, '#FF4757', 40);
            spawnParticles(entityCenterX, entityCenterY, '#FFFFFF', 8);
            
            // Piano sound effect
            soundManager.playPowerUp();
            
            // Bullet is consumed to prevent repetitive multi-hit lag
            return;
          }
          
          entity.caught = true;
          bullet.life = 0;
          
          const points = entity.value * levelRef.current;
          scoreRef.current += points;
          setScore(scoreRef.current);
          
          let color = '#C4A35A';
          if (entity.type === 'goldCat') color = '#FFD93D';
          if (entity.type === 'fox') color = '#FF7F50';
          if (entity.type === 'wolf') color = '#A0A0A0';
          if (entity.type === 'raccoon') color = '#808080';
          if (entity.type === 'tetris') color = '#00D2D3';
          
          const hitX = entity.x + size / 2;
          const hitY = entity.y + size / 2;
          
          spawnParticles(hitX, hitY, color, 8);
          spawnSparkRing(hitX, hitY, color, 30);
          spawnSparks(hitX, hitY, color, 10);
          spawnFloatingText(hitX, hitY - 20, `+${points}🍺`, '#FFD93D');
          
          if (entity.type === 'goldCat' || entity.type === 'fox' || entity.type === 'wolf' || entity.type === 'raccoon' || entity.type === 'tetris') {
            soundManager.playGoldCatch();
          } else {
            soundManager.playCatch();
          }
        }
      });
      
      if (entity.caught) return false;
      
      // Player collision
      const size = entity.type === 'goldCat' ? GOLD_CAT_SIZE : CAT_SIZE;
      const playerCenterX = playerXRef.current + PLAYER_WIDTH / 2;
      const playerCenterY = BASE_HEIGHT - PLAYER_HEIGHT + 20;
      const entityCenterX = entity.x + size / 2;
      const entityCenterY = entity.y + size / 2;
      
      const dx = playerCenterX - entityCenterX;
      const dy = playerCenterY - entityCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < (PLAYER_WIDTH / 2 + size / 2) * 0.7) {
        entity.caught = true;
        markUpgradeCollected(entity.type);
        
        switch (entity.type) {
          case 'cat':
          case 'goldCat':
          case 'fox':
          case 'wolf':
          case 'raccoon':
          case 'tetris':
            if (!powerUpActive && !ultimateShieldActiveRef.current) {
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) gameOver();
                return newLives;
              });
              spawnFloatingText(playerCenterX, playerCenterY - 30, '-1', '#FF4757');
              soundManager.playHit();
            } else {
              const points = entity.value * levelRef.current;
              scoreRef.current += points;
              setScore(scoreRef.current);
              spawnFloatingText(playerCenterX, playerCenterY - 30, `+${points}🍺`, '#FFD93D');
            }
            break;
            
          case 'life':
            // Add 1 life, but don't reduce if already above MAX_LIVES (God Mode)
            const newLives = livesRef.current > MAX_LIVES ? livesRef.current + 1 : Math.min(MAX_LIVES, livesRef.current + 1);
            livesRef.current = newLives;
            setLives(newLives);
            spawnParticles(entityCenterX, entityCenterY, '#FF4757', 10);
            spawnSparkRing(entityCenterX, entityCenterY, '#FF4757', 35);
            spawnSparks(entityCenterX, entityCenterY, '#FF4757', 12);
            spawnFloatingText(entityCenterX, entityCenterY - 30, '+❤️', '#FF4757');
            soundManager.playLifeUp();
            break;
            
          case 'bomb':
            scoreRef.current = Math.max(0, scoreRef.current - BOMB_PENALTY);
            setScore(scoreRef.current);
            spawnParticles(entityCenterX, entityCenterY, '#FF4757', 15);
            spawnSparkRing(entityCenterX, entityCenterY, '#FF0000', 40);
            spawnSparks(entityCenterX, entityCenterY, '#FF0000', 15);
            spawnFloatingText(entityCenterX, entityCenterY - 30, '-100', '#FF4757');
            soundManager.playHit();
            break;
            
          case 'guitar':
            // Guitar hits player - lose 1 life
            if (!ultimateShieldActiveRef.current) {
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) gameOver();
                return newLives;
              });
              spawnParticles(entityCenterX, entityCenterY, '#FF6B00', 12);
              spawnSparkRing(entityCenterX, entityCenterY, '#FF6B00', 40);
              spawnFloatingText(playerCenterX, playerCenterY - 30, '-1', '#FF4757');
              soundManager.playHit();
            } else {
              spawnSparkRing(playerCenterX, playerCenterY, '#F59E0B', 25);
              spawnFloatingText(playerCenterX, playerCenterY - 30, 'BLOCK!', '#F59E0B');
            }
            break;
            
          case 'piano':
            // Piano hits player - lose 1 life
            if (!ultimateShieldActiveRef.current) {
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) gameOver();
                return newLives;
              });
              spawnParticles(entityCenterX, entityCenterY, '#FF4757', 15);
              spawnSparkRing(entityCenterX, entityCenterY, '#FF4757', 45);
              spawnFloatingText(playerCenterX, playerCenterY - 30, '-1', '#FF4757');
              soundManager.playHit();
            } else {
              spawnSparkRing(playerCenterX, playerCenterY, '#F59E0B', 25);
              spawnFloatingText(playerCenterX, playerCenterY - 30, 'BLOCK!', '#F59E0B');
            }
            break;
            
          case 'spikeLeft':
          case 'spikeRight':
            // Spike hits player - lose 1 life
            if (!ultimateShieldActiveRef.current) {
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) gameOver();
                return newLives;
              });
              spawnParticles(entityCenterX, entityCenterY, '#FF0000', 15);
              spawnSparkRing(entityCenterX, entityCenterY, '#FF0000', 50);
              spawnFloatingText(playerCenterX, playerCenterY - 30, '-1', '#FF4757');
              soundManager.playHit();
            } else {
              spawnSparkRing(playerCenterX, playerCenterY, '#F59E0B', 25);
              spawnFloatingText(playerCenterX, playerCenterY - 30, 'BLOCK!', '#F59E0B');
            }
            break;
            
          case 'tunnelTop':
          case 'tunnelBottom':
            // Tunnel wall hits player - lose 1 life
            if (!ultimateShieldActiveRef.current) {
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) gameOver();
                return newLives;
              });
              spawnParticles(entityCenterX, entityCenterY, '#9D00FF', 15);
              spawnSparkRing(entityCenterX, entityCenterY, '#9D00FF', 50);
              spawnFloatingText(playerCenterX, playerCenterY - 30, '-1', '#FF4757');
              soundManager.playHit();
            } else {
              spawnSparkRing(playerCenterX, playerCenterY, '#F59E0B', 25);
              spawnFloatingText(playerCenterX, playerCenterY - 30, 'BLOCK!', '#F59E0B');
            }
            break;
            
          case 'beerMug':
            setBeerMugActive(true);
            beerMugEndTimeRef.current = Date.now() + BEER_MUG_DURATION;
            spawnParticles(entityCenterX, entityCenterY, '#FFD93D', 12);
            spawnSparkRing(entityCenterX, entityCenterY, '#FFD93D', 35);
            spawnSparks(entityCenterX, entityCenterY, '#FFD93D', 12);
            spawnFloatingText(entityCenterX, entityCenterY - 30, 'BEER BOOST!', '#FFD93D');
            soundManager.playPowerUp();
            break;
            
          case 'skillMagnet':
            activateSkill('magnet');
            break;
          case 'skillReflect':
            activateSkill('reflect');
            break;
          case 'skillDouble':
            activateSkill('double');
            break;
          case 'skillSlowmo':
            activateSkill('slowmo');
            break;
          case 'skillShield':
            activateSkill('shield');
            break;
          case 'skillKraken':
            activateSkill('kraken');
            break;
            
          case 'weaponSpread':
            unlockWeapon('spread');
            break;
          case 'weaponLaser':
            unlockWeapon('laser');
            break;
          case 'weaponChainsaw':
            unlockWeapon('chainsaw');
            break;
          case 'weaponMissile':
            unlockWeapon('missile');
            break;
          case 'weaponPaw':
            unlockWeapon('paw');
            break;
          case 'weaponBeer':
            unlockWeapon('beer');
            break;
          case 'weaponIce':
            unlockWeapon('ice');
            break;
        }
        
        return false;
      }
      
      // Off screen checks for different entity types
      if (entity.type === 'spikeLeft' || entity.type === 'spikeRight' || 
          entity.type === 'tunnelTop' || entity.type === 'tunnelBottom') {
        // Spikes and tunnels fall off bottom of screen
        if (entity.y > BASE_HEIGHT + 100) {
          return false;
        }
      } else if (entity.y > BASE_HEIGHT) {
        // Normal falling entities
        if (
          (entity.type === 'cat' || entity.type === 'fox' || entity.type === 'wolf' || entity.type === 'raccoon' || entity.type === 'tetris') &&
          !powerUpActive &&
          !ultimateShieldActiveRef.current
        ) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) gameOver();
            return newLives;
          });
          spawnFloatingText(playerCenterX, BASE_HEIGHT - 50, '-1', '#FF4757');
          soundManager.playHit();
        }
        return false;
      }
      
      return true;
    });
    
    // Update particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.life--;
      return p.life > 0;
    });
    
    // Update floating texts
    floatingTextsRef.current = floatingTextsRef.current.filter(t => {
      t.y -= 0.8;
      t.life--;
      return t.life > 0;
    });
    
    // Update music notes
    musicNotesRef.current = musicNotesRef.current.filter(note => {
      note.x += note.vx;
      note.y += note.vy;
      note.life--;
      return note.life > 0;
    });
  }, [gameOver, initBoss, powerUpActive, beerMugActive, spawnBullet, spawnEntity, spawnSkillOnly, spawnFloatingText, spawnParticles, spawnSparkRing, spawnSparks, ultimateActive]);
  
  const render = useCallback((ctx: CanvasRenderingContext2D) => {
    const time = globalTimeRef.current;
    
    // Arena background in main menu palette (amber + obsidian)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, BASE_HEIGHT);
    bgGrad.addColorStop(0, '#120d08');
    bgGrad.addColorStop(0.5, '#070707');
    bgGrad.addColorStop(1, '#0f0b07');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    // Soft boss-tint overlay without hard horizontal split
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
    ctx.globalAlpha = 1;
    
    // Subtle yellow grid
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= BASE_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, BASE_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= BASE_HEIGHT; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(BASE_WIDTH, i);
      ctx.stroke();
    }
    
    // Draw entities
    entitiesRef.current.forEach(entity => {
      const size = entity.type === 'goldCat' ? GOLD_CAT_SIZE : CAT_SIZE;
      const x = entity.x + size / 2;
      const y = entity.y + size / 2;
      
      switch (entity.type) {
        case 'life':
          drawHeart(ctx, x, y, size, entity.wobble);
          break;
        case 'bomb':
          drawBomb(ctx, x, y, size, entity.wobble);
          break;
        case 'beerMug':
          drawBeerMugItem(ctx, x, y, size, entity.wobble);
          break;
        case 'fox':
          drawFox(ctx, x, y, size, entity.wobble);
          break;
        case 'wolf':
          drawWolf(ctx, x, y, size, entity.wobble);
          break;
        case 'raccoon':
          drawRaccoon(ctx, x, y, size, entity.wobble);
          break;
        case 'tetris':
          drawTetris(ctx, x, y, size, entity.wobble);
          break;
        case 'goldCat':
          drawCat(ctx, x, y, size, true, entity.wobble);
          break;
        case 'skillMagnet':
          drawSkillItem(ctx, x, y, size, '🧲', '#00D2D3', entity.wobble);
          break;
        case 'skillReflect':
          drawSkillItem(ctx, x, y, size, '🛡️', '#3742FA', entity.wobble);
          break;
        case 'skillDouble':
          drawSkillItem(ctx, x, y, size, '🔫', '#FF4757', entity.wobble);
          break;
        case 'skillSlowmo':
          drawSkillItem(ctx, x, y, size, '⏱️', '#A55EEA', entity.wobble);
          break;
        case 'skillShield':
          drawSkillItem(ctx, x, y, size, '⛨', '#2ED573', entity.wobble);
          break;
        case 'skillKraken':
          drawSkillItem(ctx, x, y, size, '🦑', '#FF1493', entity.wobble);
          break;
        case 'miniNyan':
          drawMiniNyanCat(ctx, x, y, size, entity.wobble);
          break;
        case 'guitar':
          drawGuitar(ctx, x, y, size, entity.wobble, entity.rotation || 0);
          break;
        case 'piano':
          drawPiano(ctx, x, y, size, entity.wobble, entity.rotation || 0);
          break;
        case 'weaponSpread':
          drawWeaponPickup(ctx, x, y, size, 'spread', entity.wobble);
          break;
        case 'weaponLaser':
          drawWeaponPickup(ctx, x, y, size, 'laser', entity.wobble);
          break;
        case 'weaponChainsaw':
          drawWeaponPickup(ctx, x, y, size, 'chainsaw', entity.wobble);
          break;
        case 'weaponMissile':
          drawWeaponPickup(ctx, x, y, size, 'missile', entity.wobble);
          break;
        case 'weaponPaw':
          drawWeaponPickup(ctx, x, y, size, 'paw', entity.wobble);
          break;
        case 'weaponBeer':
          drawWeaponPickup(ctx, x, y, size, 'beer', entity.wobble);
          break;
        case 'weaponIce':
          drawWeaponPickup(ctx, x, y, size, 'ice', entity.wobble);
          break;
        case 'spikeLeft':
          drawSpike(ctx, x, y, size * 1.2, true, entity.wobble);
          break;
        case 'spikeRight':
          drawSpike(ctx, x, y, size * 1.2, false, entity.wobble);
          break;
        case 'tunnelTop':
          // Left wall of tunnel - extends from left edge to gap start
          drawTunnelWall(ctx, 0, entity.y, entity.x, 80, true, entity.wobble);
          break;
        case 'tunnelBottom':
          // Right wall of tunnel - extends from gap end to right edge
          const rightWallX = entity.x;
          const rightWallWidth = BASE_WIDTH - rightWallX;
          drawTunnelWall(ctx, rightWallX, entity.y, rightWallWidth, 80, false, entity.wobble);
          break;
        default:
          drawCat(ctx, x, y, size, false, entity.wobble);
      }
    });
    
    // Draw bullets
    bulletsRef.current.forEach(bullet => {
      const w = WEAPONS[bullet.type];
      
      if (bullet.isEnemy) {
        // Enemy bullets - different colors and shapes based on type
        if (bullet.type === 'laser') {
          // Enemy laser - red glowing beam
          ctx.fillStyle = '#FF0000';
          ctx.shadowColor = '#FF0000';
          ctx.shadowBlur = 10;
          ctx.fillRect(bullet.x - 3, bullet.y - 15, 6, 30);
          ctx.shadowBlur = 0;
        } else {
          // Standard enemy bullet
          ctx.fillStyle = '#FF4757';
          ctx.beginPath();
          ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Player bullets
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        if (bullet.rotation) ctx.rotate(bullet.rotation);
        
        ctx.fillStyle = w.color;
        
        if (bullet.type === 'laser') {
          ctx.shadowColor = w.color;
          ctx.shadowBlur = 12;
          ctx.fillRect(-2, -12, 4, 24);
          ctx.shadowBlur = 0;
        } else if (bullet.type === 'spread') {
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (bullet.type === 'missile') {
          // Rocket shape with flame
          ctx.shadowColor = '#FF6B00';
          ctx.shadowBlur = 15;
          // Rocket body
          ctx.fillStyle = '#FF6B00';
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(-4, 8);
          ctx.lineTo(0, 5);
          ctx.lineTo(4, 8);
          ctx.closePath();
          ctx.fill();
          // Flame trail
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.moveTo(-3, 8);
          ctx.lineTo(0, 16 + Math.sin(Date.now() / 50) * 4);
          ctx.lineTo(3, 8);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (bullet.type === 'paw') {
          // Cat paw shape
          ctx.shadowColor = '#FF69B4';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#FF69B4';
          // Main pad
          ctx.beginPath();
          ctx.ellipse(0, 2, 6, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Toe beans
          ctx.fillStyle = '#FFB6C1';
          for (let i = 0; i < 3; i++) {
            const angle = ((i - 1) * 0.5);
            ctx.beginPath();
            ctx.arc(Math.sin(angle) * 4, -4 + Math.cos(angle) * 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        } else if (bullet.type === 'beer') {
          // Beer bottle shape
          ctx.shadowColor = '#00AA00';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#00AA00';
          // Bottle body
          ctx.fillRect(-4, -8, 8, 14);
          // Bottle neck
          ctx.fillRect(-2, -14, 4, 6);
          // Cork
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(-2.5, -16, 5, 3);
          // Bubbles
          ctx.fillStyle = '#90EE90';
          ctx.beginPath();
          ctx.arc(-1, -4, 1.5, 0, Math.PI * 2);
          ctx.arc(2, 0, 1, 0, Math.PI * 2);
          ctx.arc(-2, 4, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (bullet.type === 'ice') {
          if (bullet.isFrostProc) {
            // Every 20th ICE shot is a snowflake freeze proc
            ctx.shadowColor = '#93C5FD';
            ctx.shadowBlur = 18;
            ctx.strokeStyle = '#E0F2FE';
            ctx.lineWidth = 2.1;
            for (let i = 0; i < 3; i++) {
              ctx.rotate(Math.PI / 3);
              ctx.beginPath();
              ctx.moveTo(0, -10);
              ctx.lineTo(0, 10);
              ctx.moveTo(0, -5);
              ctx.lineTo(3, -7.5);
              ctx.moveTo(0, -5);
              ctx.lineTo(-3, -7.5);
              ctx.moveTo(0, 5);
              ctx.lineTo(3, 7.5);
              ctx.moveTo(0, 5);
              ctx.lineTo(-3, 7.5);
              ctx.stroke();
            }
            ctx.shadowBlur = 0;
          } else {
            // Regular ice shard with glow
            ctx.shadowColor = '#00D2D3';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#00D2D3';
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(-5, -2);
            ctx.lineTo(-3, 8);
            ctx.lineTo(0, 5);
            ctx.lineTo(3, 8);
            ctx.lineTo(5, -2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#E0FFFF';
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(-2, -1);
            ctx.lineTo(0, 3);
            ctx.lineTo(2, -1);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        } else {
          // Standard
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });
    
    // Draw spark rings
    sparkRingsRef.current = sparkRingsRef.current.filter(ring => {
      ring.radius += (ring.maxRadius - ring.radius) * 0.15;
      ring.life--;
      
      const alpha = ring.life / ring.maxLife;
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.width * alpha;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      
      return ring.life > 0;
    });
    
    // Draw player (Cat Coin Image)
    drawCatCoinPlayer(
      ctx,
      playerXRef.current,
      BASE_HEIGHT - PLAYER_HEIGHT,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      weaponRef.current,
      playerWobble,
      currentSkinIdRef.current
    );
    
    // GUARDIAN: Stand Shield visual
    if (shieldActiveRef.current) {
      const shieldPulse = 0.4 + Math.sin(time * 8) * 0.2;
      ctx.strokeStyle = `rgba(46, 213, 115, ${0.8 + Math.sin(time * 8) * 0.2})`;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#2ED573';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(
        playerXRef.current + PLAYER_WIDTH / 2,
        BASE_HEIGHT - PLAYER_HEIGHT + 20,
        45,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = `rgba(46, 213, 115, ${shieldPulse * 0.3})`;
      ctx.fill();
      
      // Shield icon
      ctx.fillStyle = '#2ED573';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⛨', playerXRef.current + PLAYER_WIDTH / 2, BASE_HEIGHT - PLAYER_HEIGHT - 30);
    }
    
    // KRAKEN: Reflect aura visual
    if (krakenActiveRef.current) {
      ctx.strokeStyle = `rgba(255, 20, 147, ${0.9 + Math.sin(time * 10) * 0.1})`;
      ctx.lineWidth = 5;
      ctx.shadowColor = '#FF1493';
      ctx.shadowBlur = 25;
      
      // Outer pulsating ring
      const ringRadius = 50 + Math.sin(time * 6) * 5;
      ctx.beginPath();
      ctx.arc(
        playerXRef.current + PLAYER_WIDTH / 2,
        BASE_HEIGHT - PLAYER_HEIGHT + 20,
        ringRadius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      
      // Inner rotating tentacles effect
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time * 3;
        const tentacleLength = 35 + Math.sin(time * 8 + i) * 8;
        const tx = playerXRef.current + PLAYER_WIDTH / 2 + Math.cos(angle) * tentacleLength;
        const ty = BASE_HEIGHT - PLAYER_HEIGHT + 20 + Math.sin(angle) * tentacleLength;
        
        ctx.strokeStyle = `rgba(255, 20, 147, ${0.6 + Math.sin(time * 10 + i) * 0.3})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(playerXRef.current + PLAYER_WIDTH / 2, BASE_HEIGHT - PLAYER_HEIGHT + 20);
        ctx.quadraticCurveTo(
          playerXRef.current + PLAYER_WIDTH / 2 + Math.cos(angle) * (tentacleLength * 0.6),
          BASE_HEIGHT - PLAYER_HEIGHT + 20 + Math.sin(angle) * (tentacleLength * 0.6),
          tx, ty
        );
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;
      
      // Kraken icon
      ctx.fillStyle = '#FF1493';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🦑', playerXRef.current + PLAYER_WIDTH / 2, BASE_HEIGHT - PLAYER_HEIGHT - 35);
    }
    
    // Power up shield
    if (powerUpActive) {
      const shieldAlpha = 0.3 + Math.sin(time * 5) * 0.2;
      ctx.strokeStyle = `rgba(55, 66, 250, ${0.6 + Math.sin(time * 5) * 0.3})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        playerXRef.current + PLAYER_WIDTH / 2,
        BASE_HEIGHT - PLAYER_HEIGHT + 20,
        40,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      
      ctx.fillStyle = `rgba(55, 66, 250, ${shieldAlpha})`;
      ctx.fill();
    }

    if (ultimateShieldActiveRef.current) {
      const pulse = 0.5 + Math.sin(time * 9) * 0.2;
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.75 + Math.sin(time * 10) * 0.2})`;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(
        playerXRef.current + PLAYER_WIDTH / 2,
        BASE_HEIGHT - PLAYER_HEIGHT + 20,
        48,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = `rgba(250, 204, 21, ${pulse * 0.22})`;
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', playerXRef.current + PLAYER_WIDTH / 2, BASE_HEIGHT - PLAYER_HEIGHT - 32);
    }
    
    // Draw boss
    if (bossRef.current) {
      drawNyanCatBoss(ctx, bossRef.current, bossesDefeatedRef.current);
    }
    
    // Draw particles
    particlesRef.current.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      
      if (p.shape === 'star') {
        drawStar(ctx, p.x, p.y, p.size * alpha * 2, 5);
      } else if (p.shape === 'square') {
        ctx.fillRect(p.x - p.size * alpha / 2, p.y - p.size * alpha / 2, p.size * alpha, p.size * alpha);
      } else if (p.shape === 'spark') {
        // Spark shape - elongated with glow
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.atan2(p.vy, p.vx));
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(-p.size * alpha * 2, -p.size * alpha / 2, p.size * alpha * 4, p.size * alpha);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
    
    // Draw floating texts
    floatingTextsRef.current.forEach(t => {
      const alpha = t.life / t.maxLife;
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.rotation);
      ctx.fillStyle = t.color;
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(t.text, 0, 0);
      ctx.restore();
    });
    
    // Draw music notes (from guitar hits)
    musicNotesRef.current.forEach(note => {
      const progress = 1 - note.life / note.maxLife;
      const alpha = note.life / note.maxLife;
      
      ctx.save();
      ctx.translate(note.x, note.y);
      
      // Note bounces up and down
      const bounceY = Math.sin(progress * Math.PI * 4) * 5;
      ctx.translate(0, bounceY);
      
      // Glow
      ctx.shadowColor = note.color;
      ctx.shadowBlur = 10;
      
      // Draw note
      ctx.fillStyle = note.color;
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(note.note, 0, 0);
      
      ctx.shadowBlur = 0;
      ctx.restore();
    });
  }, [powerUpActive, playerWobble, bgColor]);
  
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, points: number) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? size : size / 2;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      update(deltaTime);
      render(ctx);
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [update, render]);
  
  const moveLeft = () => {
    playerXRef.current = Math.max(0, playerXRef.current - PLAYER_SPEED * 2);
    setSliderValue(Math.round((playerXRef.current / (BASE_WIDTH - PLAYER_WIDTH)) * 100));
  };
  
  const moveRight = () => {
    playerXRef.current = Math.min(BASE_WIDTH - PLAYER_WIDTH, playerXRef.current + PLAYER_SPEED * 2);
    setSliderValue(Math.round((playerXRef.current / (BASE_WIDTH - PLAYER_WIDTH)) * 100));
  };

  const moveByPointer = useCallback((clientX: number, element: HTMLCanvasElement) => {
    const rect = element.getBoundingClientRect();
    const relative = (clientX - rect.left) / rect.width;
    const nextX = relative * BASE_WIDTH - PLAYER_WIDTH / 2;
    playerXRef.current = Math.max(0, Math.min(BASE_WIDTH - PLAYER_WIDTH, nextX));
  }, []);

  const weaponDock = WEAPON_TYPES.filter((weaponType) => unlockedWeapons.has(weaponType));
  const maxVisibleLives = godMode ? 100 : MAX_LIVES;
  const livesPercent = Math.max(0, Math.min(100, (lives / maxVisibleLives) * 100));
  const healthFill =
    livesPercent > 65
      ? '#facc15'
      : livesPercent > 35
      ? '#eab308'
      : '#dc2626';
  const gameFrameWidth = 'min(calc(100vw - 12px), calc((100vh - 250px) * 0.7619))';
  const ultimateChargePercent = Math.max(0, Math.min(100, (ultimateChargeMsRef.current / ULTIMATE_CHARGE_MS) * 100));
  const ultimateLabel = ultimateActive
    ? `ULT ${ultimateTimeLeft}s`
    : ultimateReady
    ? 'ULT READY'
    : `ULT ${ultimateChargeSeconds}s / 60s`;
  const weaponIconMap: Record<WeaponType, typeof Crosshair> = {
    standard: Crosshair,
    spread: Target,
    laser: Zap,
    chainsaw: Orbit,
    missile: Flame,
    paw: Sparkles,
    beer: Crosshair,
    ice: Snowflake,
  };
  const isPvpRun = Boolean(pvpMatchId && pvpPlayerId);
  const pvpMetricType: PvpUiMatchType = pvpSummary?.matchType ?? 'score';
  const pvpMetricValue =
    pvpSummary?.myMetric ??
    (pvpMetricType === 'bosses' ? Math.max(0, Math.floor(bossesDefeated)) : Math.max(0, Math.floor(score)));
  const pvpOpponentMetric = pvpSummary?.opponentMetric ?? null;
  const pvpResultResolved = pvpSummary?.status === 'completed' && pvpSummary.didWin !== null;
  const pvpResultTitle = pvpResultResolved ? (pvpSummary?.didWin ? 'VICTORY' : 'DEFEAT') : 'WAIT...';
  const pvpResultDescription = pvpResultResolved
    ? pvpSummary?.didWin
      ? 'You survived longer'
      : 'Opponent survived longer'
    : 'Checking result...';
  const pvpMetricLabel = pvpMetricType === 'bosses' ? 'Bosses killed' : 'Score';
  
  return (
    <div 
      className="flex flex-col items-center justify-start overflow-hidden bg-[rgb(var(--background))] p-2 pt-3" 
      style={{ 
        width: '100vw', 
        height: '100vh',
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        overscrollBehavior: 'none'
      }}
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Imported top stats hidden: outer app keeps its own HUD */}
      <div className="hidden" style={{ maxWidth: `${BASE_WIDTH}px`, touchAction: 'none' }}>
        <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#FFD93D]/50">
          <Trophy className="w-3.5 h-3.5 text-[#FFD93D]" />
          <span className="text-[#FFD93D] font-bold text-xs">{score}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#FFD93D]/50">
          <span className="text-[#FFD93D] font-bold text-xs">LV.{level}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#FFD93D]/50">
          <Heart className="w-3.5 h-3.5 text-[#FF4757]" />
          <span className="text-[#FFD93D] font-bold text-xs">{lives}</span>
        </div>
        {gameState === 'boss' && (
          <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#FF6B9D]">
            <Flame className="w-3.5 h-3.5 text-[#FF6B9D]" />
            <span className="text-[#FF6B9D] font-bold text-xs">{bossHealth}</span>
          </div>
        )}
        <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#FFD93D]/50">
          {weapon === 'laser' && <Zap className="w-3.5 h-3.5 text-[#FF4757]" />}
          {weapon === 'spread' && <Target className="w-3.5 h-3.5 text-[#FF7F50]" />}
          <span className="text-[#FFD93D] font-bold text-xs">{WEAPONS[weapon].name}</span>
        </div>
        {powerUpActive && (
          <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#3742FA]">
            <span className="text-[#3742FA] font-bold text-xs">{powerUpTime}s</span>
          </div>
        )}
        {beerMugActive && (
          <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#FFD93D]">
            <span className="text-[#FFD93D] font-bold text-xs">{beerMugTime}s</span>
          </div>
        )}
        {gameState === 'playing' && (
          <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#FF6B9D]/50">
            <Star className="w-3.5 h-3.5 text-[#FF6B9D]" />
            <span className="text-[#FFD93D] font-bold text-[10px]">BOSS#{bossesDefeated + 1}@{nextBossScore}</span>
          </div>
        )}
        {/* Active Skill & Difficulty Display */}
        <div className="flex items-center gap-1 bg-[#1E1E2E] px-2 py-1 rounded-lg border border-[#FFD93D]/50">
          <span className="text-xs">{activeSkill ? SKILLS[activeSkill].emoji : '⚪'}</span>
          <span className="text-[10px] font-bold text-[#FFD93D]">D{difficulty}</span>
          {activeSkill && skillTimeLeft > 0 && (
            <span className="text-[8px] text-white/70 ml-1">{skillTimeLeft}s</span>
          )}
        </div>
        {/* Sound Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleMusic} 
            className={`p-1.5 rounded-lg border transition-all ${musicEnabled ? 'bg-[#1E1E2E] border-[#FF6B9D]/50' : 'bg-[#1E1E2E]/50 border-[#FFD93D]/20'}`}
            title="Music"
          >
            {musicEnabled ? <span className="text-[10px] font-bold text-[#FF6B9D]">♪</span> : <span className="text-[10px] font-bold text-[#FFD93D]/40">♪</span>}
          </button>
          <button 
            onClick={toggleSfx} 
            className={`p-1.5 rounded-lg border transition-all ${sfxEnabled ? 'bg-[#1E1E2E] border-[#FFD93D]/50' : 'bg-[#1E1E2E]/50 border-[#FFD93D]/20'}`}
            title="Sound Effects"
          >
            {sfxEnabled ? <Volume2 className="w-3 h-3 text-[#FFD93D]" /> : <VolumeX className="w-3 h-3 text-[#FFD93D]/40" />}
          </button>
          
          {/* Pause Button */}
          {(gameState === 'playing' || gameState === 'boss') && (
            <button 
              onClick={() => setGameState('paused')}
              className="p-1.5 rounded-lg border border-[#FFD93D]/50 bg-[#1E1E2E] hover:bg-[#FFD93D]/20 transition-all"
              title="Pause"
            >
              <span className="text-[10px] font-bold text-[#FFD93D]">⏸</span>
            </button>
          )}
          {(gameState === 'paused') && (
            <button 
              onClick={() => setGameState('playing')}
              className="p-1.5 rounded-lg border border-[#00D2D3]/50 bg-[#00D2D3]/20 hover:bg-[#00D2D3]/40 transition-all"
              title="Resume"
            >
              <span className="text-[10px] font-bold text-[#00D2D3]">▶</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Top HUD */}
      <div className="hidden w-[320px] mb-2 rounded-xl border border-[#FFD93D]/30 bg-[#11131a]/80 px-3 py-2">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-lg bg-black/40 py-1.5">
            <div className="text-[9px] uppercase tracking-wide text-white/60">Hull</div>
            <div className="text-sm font-bold text-[#FF6B6B]">❤ {lives}</div>
          </div>
          <div className="rounded-lg bg-black/40 py-1.5">
            <div className="text-[9px] uppercase tracking-wide text-white/60">Meters</div>
            <div className="text-sm font-bold text-[#FFD93D]">{meters}m</div>
          </div>
          <div className="rounded-lg bg-black/40 py-1.5">
            <div className="text-[9px] uppercase tracking-wide text-white/60">Level</div>
            <div className="text-sm font-bold text-[#00D2D3]">{level}</div>
          </div>
          <div className="rounded-lg bg-black/40 py-1.5">
            <div className="text-[9px] uppercase tracking-wide text-white/60">Mugs</div>
            <div className="text-sm font-bold text-[#FFD93D]">🍺 {score}</div>
          </div>
        </div>
      </div>

      {/* Top HUD (synced to game canvas width) */}
      <div className="mb-2" style={{ width: gameFrameWidth }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl bg-[rgb(var(--card))]/90 px-2 py-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 min-w-0">
            <Heart className="w-4 h-4 shrink-0 text-[#facc15]" />
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${livesPercent}%`,
                  background: healthFill,
                  boxShadow: '0 0 12px rgba(250, 204, 21, 0.35)',
                }}
              />
            </div>
            <span className="shrink-0 text-[11px] font-bold text-[rgb(var(--foreground))]">{lives}</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 px-1">
            <Beer className="h-4 w-4 text-amber-400" />
            <span className="text-xl font-black leading-none text-amber-400">{score}</span>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="text-right leading-none">
              <div className="text-[10px] uppercase text-[rgb(var(--muted-foreground))]">Lvl</div>
              <div className="text-sm font-bold text-amber-400">{level}</div>
            </div>
            <button
              onClick={pauseRun}
              disabled={gameState === 'paused'}
              className="flex h-8 min-w-8 items-center justify-center rounded-lg gold-gradient px-2 font-black text-[0px] text-[#1a1a1a] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              title="Pause"
            >
              <Pause className="h-4 w-4 text-[#1a1a1a]" />
              {'⏸'}
            </button>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-[rgb(var(--muted-foreground))]">
          <span>{meters} m</span>
          {gameState === 'boss' ? (
            <span className="font-semibold text-[#facc15]">BOSS HP {Math.max(0, bossHealth)}</span>
          ) : (
            <span>NEXT @ {nextBossScore}</span>
          )}
        </div>
      </div>

      {/* Game Canvas - Fixed size for stability */}
      <div
        className="relative touch-none"
        style={{ width: gameFrameWidth, aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}`, touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={BASE_WIDTH}
          height={BASE_HEIGHT}
          className="block touch-none box-border"
          style={{ width: '100%', height: '100%', touchAction: 'none' }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            if (!touch) return;
            moveByPointer(touch.clientX, e.currentTarget);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            if (!touch) return;
            moveByPointer(touch.clientX, e.currentTarget);
          }}
          onMouseMove={(e) => {
            if (e.buttons === 1) {
              moveByPointer(e.clientX, e.currentTarget);
            }
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 88%, rgba(250, 204, 21, 0.16) 0%, rgba(250, 204, 21, 0.05) 28%, transparent 58%)',
          }}
        />

        {showRunIntro && (
          <div className="absolute inset-0 z-[35] flex items-center justify-center rounded-xl bg-black/92 animate-fade-in">
            <div className="animate-fadeInScale text-center">
              <div className="mb-3 inline-flex items-center rounded-full bg-[#facc15]/20 px-4 py-1.5 text-[11px] font-black tracking-[0.18em] text-[#fde047]">
                NAPIWAS RUN
              </div>
              <h3 className="text-3xl font-black text-[#ffedd5]">START</h3>
              <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-[#fde047]/85">
                CAT FOR BEER
              </p>
            </div>
          </div>
        )}
        
        {/* Donor menu disabled: keep only gameplay layer */}
        {false && gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0D0D12] via-[#1a1a2e] to-[#0D0D12] rounded-xl p-6 z-20">
            {/* Title */}
            <div className="text-6xl mb-2">🪙🐱</div>
            <h1 className="text-3xl font-black text-[#FFD93D] mb-1 text-center tracking-wider" style={{textShadow: '0 0 20px rgba(255, 217, 61, 0.5)'}}>
              CAT CATCHER
            </h1>
            <p className="text-[#FFD93D]/60 text-sm mb-8 text-center">Shoot • Collect • Survive</p>
            
            {/* High Score */}
            {highScore > 0 && (
              <div className="flex items-center gap-2 mb-6 bg-[#FFD93D]/10 px-4 py-2 rounded-full border border-[#FFD93D]/30">
                <Trophy className="w-4 h-4 text-[#FFD93D]" />
                <span className="text-[#FFD93D] text-sm font-bold">{highScore}</span>
              </div>
            )}
            
            {/* Main Play Button - Centered */}
            <Button 
              onClick={startGame} 
              className="bg-gradient-to-r from-[#FFD93D] to-[#FFAA00] text-black hover:from-[#FFAA00] hover:to-[#FFD93D] font-black px-12 py-4 text-xl rounded-2xl shadow-xl shadow-[#FFD93D]/40 transition-all hover:scale-110 active:scale-95 mb-6"
            >
              <Play className="w-6 h-6 mr-3" fill="currentColor" />
              PLAY
            </Button>
            
            {/* Bottom Row: Info + Settings */}
            <div className="flex items-center gap-4">
              {/* Info Button */}
              <button
                onClick={() => setGameState('info')}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E1E2E] border border-[#FFD93D]/30 rounded-xl hover:border-[#FFD93D]/60 hover:bg-[#1E1E2E]/80 transition-all"
              >
                <Info className="w-4 h-4 text-[#FFD93D]" />
                <span className="text-[#FFD93D] text-xs font-bold">INFO</span>
              </button>
              
              {/* Settings */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleMusic}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${musicEnabled ? 'bg-[#FF6B9D]/20 border-[#FF6B9D]/50 text-[#FF6B9D]' : 'bg-[#1E1E2E] border-[#FFD93D]/30 text-[#FFD93D]/40'}`}
                  title="Music"
                >
                  <span className="text-lg">♪</span>
                </button>
                <button 
                  onClick={toggleSfx}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${sfxEnabled ? 'bg-[#FFD93D]/20 border-[#FFD93D]/50 text-[#FFD93D]' : 'bg-[#1E1E2E] border-[#FFD93D]/30 text-[#FFD93D]/40'}`}
                  title="Sound"
                >
                  {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
              
              {/* God Mode */}
              <button
                onClick={() => setGodMode(!godMode)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${godMode ? 'bg-[#FF4757]/30 border-[#FF4757] text-[#FF4757]' : 'bg-[#1E1E2E] border-[#FFD93D]/30 text-[#FFD93D]/60'}`}
                title={godMode ? '100 Lives' : 'Normal Mode'}
              >
                <span className="text-lg">{godMode ? '❤️' : '🖤'}</span>
              </button>
            </div>
            
            {/* Difficulty */}
            <div className="mt-6 flex items-center gap-2">
              <span className="text-[10px] text-[#FFD93D]/50 uppercase">Difficulty:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                      difficulty === level
                        ? 'bg-[#FFD93D] text-black'
                        : 'bg-[#1E1E2E] text-[#FFD93D]/50 border border-[#FFD93D]/30'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Made by NAPIWAS */}
            <div className="mt-8 text-[10px] text-[#FFD93D]/40 tracking-widest uppercase">
              Made by <span className="text-[#FFD93D]/60 font-bold">NAPIWAS</span>
            </div>
          </div>
        )}
        
        {/* Pause overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85">
            <div className="pause-card-enter w-[82%] max-w-[320px] rounded-2xl bg-[#121212]/95 px-5 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
              <div className="mb-5 flex items-center justify-center">
                <div className="rounded-full bg-[#facc15]/20 px-4 py-1.5 text-[11px] font-black tracking-[0.16em] text-[#fde047]">
                  NAPIWAS PAUSE
                </div>
              </div>

              <h2 className="mb-6 text-center text-2xl font-black text-[#ffedd5]">
                PAUSED
              </h2>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={resumeRun}
                  className="rounded-xl gold-gradient py-3 text-base font-black text-black transition-all hover:brightness-110"
                >
                  <Play className="mr-2 h-5 w-5" fill="currentColor" />
                  RESUME RUN
                </Button>

                <Button
                  onClick={togglePauseSound}
                  className="rounded-xl border-0 bg-[#1f1f1f] py-3 text-sm font-bold text-[#fde047] transition-all hover:text-[#fef08a]"
                >
                  {(musicEnabled || sfxEnabled) ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                  {(musicEnabled || sfxEnabled) ? 'SOUND ON' : 'SOUND OFF'}
                </Button>

                <Button
                  onClick={() => {
                    soundManager.pauseMusic();
                    if (typeof window !== 'undefined') {
                      window.location.href = '/';
                    }
                  }}
                  className="rounded-xl border-0 bg-[#1f1f1f] py-3 text-sm font-bold text-[#fef9c3] transition-all hover:text-[#fde047]"
                >
                  BACK TO MENU
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Donor info overlay disabled */}
        {false && gameState === 'info' && (
          <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#0D0D12] via-[#1a1a2e] to-[#0D0D12] rounded-xl p-4 z-30 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFAA00] flex items-center justify-center shadow-lg shadow-[#FFD93D]/30">
                  <span className="text-xl">📖</span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#FFD93D]">GAME INFO</h2>
                  <p className="text-[10px] text-[#FFD93D]/60">Everything you need to know!</p>
                </div>
              </div>
              <button 
                onClick={() => setGameState('menu')}
                className="w-10 h-10 rounded-xl bg-[#1E1E2E] border-2 border-[#FFD93D]/30 flex items-center justify-center text-[#FFD93D] hover:border-[#FFD93D] hover:bg-[#FFD93D]/10 transition-all"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              
              {/* Controls Section */}
              <div className="bg-gradient-to-r from-[#1E1E2E] to-[#252538] rounded-xl p-3 border border-[#FFD93D]/20">
                <h3 className="text-[#FFD93D] text-xs font-bold mb-2 uppercase flex items-center gap-2">
                  <span>🎮</span> Controls
                </h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 bg-[#0D0D12] px-2 py-1 rounded-lg border border-[#FFD93D]/20">
                    <span className="px-1.5 py-0.5 bg-[#FFD93D]/20 rounded text-[9px] text-[#FFD93D] font-bold">← →</span>
                    <span className="text-[10px] text-white/70">Move</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0D0D12] px-2 py-1 rounded-lg border border-[#FFD93D]/20">
                    <span className="px-1.5 py-0.5 bg-[#FFD93D]/20 rounded text-[9px] text-[#FFD93D] font-bold">Q</span>
                    <span className="text-[10px] text-white/70">Switch Weapon</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0D0D12] px-2 py-1 rounded-lg border border-[#FFD93D]/20">
                    <span className="text-[9px]">🖱️</span>
                    <span className="text-[10px] text-white/70">Touch/Click</span>
                  </div>
                </div>
              </div>
              
              {/* Collectibles Grid */}
              <div className="bg-gradient-to-r from-[#1E1E2E] to-[#252538] rounded-xl p-3 border border-[#FFD93D]/20">
                <h3 className="text-[#FFD93D] text-xs font-bold mb-2 uppercase flex items-center gap-2">
                  <span>🎯</span> Collectibles
                </h3>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
                  <div className="flex items-center gap-2 bg-[#0D0D12]/50 px-2 py-1.5 rounded-lg">
                    <span className="text-base">🐱</span>
                    <span className="text-white/70">Cat <span className="text-[#FFD93D]">+10</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0D0D12]/50 px-2 py-1.5 rounded-lg">
                    <span className="text-base">🌟</span>
                    <span className="text-[#FFD93D]">Gold Cat <span className="text-[#FFD93D]">+25</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0D0D12]/50 px-2 py-1.5 rounded-lg">
                    <span className="text-base">🦊</span>
                    <span className="text-[#FF7F50]">Fox <span className="text-[#FFD93D]">+30</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0D0D12]/50 px-2 py-1.5 rounded-lg">
                    <span className="text-base">🐺</span>
                    <span className="text-[#A0A0A0]">Wolf <span className="text-[#FFD93D]">+40</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0D0D12]/50 px-2 py-1.5 rounded-lg">
                    <span className="text-base">🦝</span>
                    <span className="text-[#808080]">Raccoon <span className="text-[#FFD93D]">+50</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0D0D12]/50 px-2 py-1.5 rounded-lg">
                    <span className="text-base">❤️</span>
                    <span className="text-[#FF4757]">Extra Life</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0D0D12]/50 px-2 py-1.5 rounded-lg">
                    <span className="text-base">💀</span>
                    <span className="text-[#FF4757]">Bomb <span className="text-[#FF4757]">-100</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0D0D12]/50 px-2 py-1.5 rounded-lg">
                    <span className="text-base">🍺</span>
                    <span className="text-[#FFD93D]">Random Gun</span>
                  </div>
                </div>
              </div>
              
              {/* Obstacles - Farm for Points! */}
              <div className="bg-gradient-to-r from-[#1E1E2E] to-[#252538] rounded-xl p-3 border-2 border-[#FF6B00]/40">
                <h3 className="text-[#FF6B00] text-xs font-bold mb-2 uppercase flex items-center gap-2">
                  <span>⚠️</span> Obstacles <span className="text-[10px] normal-case text-white/50">- Shoot for +100pts!</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-[#FF6B00]/10 px-2 py-2 rounded-lg border border-[#FF6B00]/30">
                    <span className="text-lg">🎸</span>
                    <div>
                      <span className="text-[10px] text-[#FF6B00] font-bold block">Guitar</span>
                      <span className="text-[9px] text-white/50">Hit = +100pts, Touch = -1❤️</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FF4757]/10 px-2 py-2 rounded-lg border border-[#FF4757]/30">
                    <span className="text-lg">🎹</span>
                    <div>
                      <span className="text-[10px] text-[#FF4757] font-bold block">Piano</span>
                      <span className="text-[9px] text-white/50">Hit = +100pts, Touch = -1❤️</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="bg-gradient-to-r from-[#1E1E2E] to-[#252538] rounded-xl p-3 border border-[#FFD93D]/20">
                <h3 className="text-[#FFD93D] text-xs font-bold mb-2 uppercase flex items-center gap-2">
                  <span>✨</span> Skills <span className="text-[10px] normal-case text-white/50">(10 seconds)</span>
                </h3>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="flex items-center gap-2 bg-[#00D2D3]/10 px-2 py-1.5 rounded-lg border border-[#00D2D3]/30">
                    <span>🧲</span><span className="text-[#00D2D3] font-bold">Magnet</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#3742FA]/10 px-2 py-1.5 rounded-lg border border-[#3742FA]/30">
                    <span>🛡️</span><span className="text-[#3742FA] font-bold">Reflector</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FF4757]/10 px-2 py-1.5 rounded-lg border border-[#FF4757]/30">
                    <span>🔫</span><span className="text-[#FF4757] font-bold">Double Shot</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#A55EEA]/10 px-2 py-1.5 rounded-lg border border-[#A55EEA]/30">
                    <span>⏱️</span><span className="text-[#A55EEA] font-bold">Time Warp</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#2ED573]/10 px-2 py-1.5 rounded-lg border border-[#2ED573]/30">
                    <span>⛨</span><span className="text-[#2ED573] font-bold">Guardian</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FF1493]/10 px-2 py-1.5 rounded-lg border border-[#FF1493]/30">
                    <span>🦑</span><span className="text-[#FF1493] font-bold">Kraken</span>
                  </div>
                </div>
              </div>
              
              {/* Weapons */}
              <div className="bg-gradient-to-r from-[#1E1E2E] to-[#252538] rounded-xl p-3 border border-[#FFD93D]/20">
                <h3 className="text-[#FFD93D] text-xs font-bold mb-2 uppercase flex items-center gap-2">
                  <span>🔫</span> Weapons <span className="text-[10px] normal-case text-white/50">(Unlock by defeating bosses!)</span>
                </h3>
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="flex flex-col items-center bg-[#FFD93D]/10 px-1 py-2 rounded-lg border border-[#FFD93D]/30">
                    <span className="text-lg">🔫</span>
                    <span className="text-[8px] text-[#FFD93D] font-bold">BEER</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#FF7F50]/10 px-1 py-2 rounded-lg border border-[#FF7F50]/30">
                    <span className="text-lg">☁️</span>
                    <span className="text-[8px] text-[#FF7F50] font-bold">FOAM</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#FF4757]/10 px-1 py-2 rounded-lg border border-[#FF4757]/30">
                    <span className="text-lg">⚡</span>
                    <span className="text-[8px] text-[#FF4757] font-bold">LASER</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#FF0000]/10 px-1 py-2 rounded-lg border border-[#FF0000]/30">
                    <span className="text-lg">🪚</span>
                    <span className="text-[8px] text-[#FF0000] font-bold">SAW</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#FF6B00]/10 px-1 py-2 rounded-lg border border-[#FF6B00]/30">
                    <span className="text-lg">🚀</span>
                    <span className="text-[8px] text-[#FF6B00] font-bold">MISSILE</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#FF69B4]/10 px-1 py-2 rounded-lg border border-[#FF69B4]/30">
                    <span className="text-lg">🐾</span>
                    <span className="text-[8px] text-[#FF69B4] font-bold">PAW</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#00AA00]/10 px-1 py-2 rounded-lg border border-[#00AA00]/30">
                    <span className="text-lg">🍺</span>
                    <span className="text-[8px] text-[#00AA00] font-bold">BOTTLE</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#00D2D3]/10 px-1 py-2 rounded-lg border border-[#00D2D3]/30">
                    <span className="text-lg">🧊</span>
                    <span className="text-[8px] text-[#00D2D3] font-bold">ICE</span>
                  </div>
                </div>
              </div>
              
              {/* Bosses */}
              <div className="bg-gradient-to-r from-[#1E1E2E] to-[#252538] rounded-xl p-3 border border-[#FFD93D]/20">
                <h3 className="text-[#FFD93D] text-xs font-bold mb-2 uppercase flex items-center gap-2">
                  <span>👑</span> Bosses <span className="text-[10px] normal-case text-white/50">(Appear every 500pts!)</span>
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 bg-[#FF6B9D]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#FF6B9D]">
                    <span className="text-base">🌈</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#FF6B9D] font-bold">Nyan Cat</span>
                      <span className="text-[9px] text-white/50 ml-2">Spread shot</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FF4757]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#FF4757]">
                    <span className="text-base">😈</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#FF4757] font-bold">Demon Cat</span>
                      <span className="text-[9px] text-white/50 ml-2">Laser beams</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#00D2D3]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#00D2D3]">
                    <span className="text-base">🤖</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#00D2D3] font-bold">Cyber Cat</span>
                      <span className="text-[9px] text-white/50 ml-2">Rapid fire</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#A55EEA]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#A55EEA]">
                    <span className="text-base">👻</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#A55EEA] font-bold">Phantom Cat</span>
                      <span className="text-[9px] text-white/50 ml-2">Homing bullets</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFD93D]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#FFD93D]">
                    <span className="text-base">👑</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#FFD93D] font-bold">Gold Cat</span>
                      <span className="text-[9px] text-white/50 ml-2">Wave pattern</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#9D00FF]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#9D00FF]">
                    <span className="text-base">🌌</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#9D00FF] font-bold">Galactic Cat</span>
                      <span className="text-[9px] text-white/50 ml-2">Chainsaws!</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FF1493]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#FF1493]">
                    <span className="text-base">🐾</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#FF1493] font-bold">Mega Grand Master</span>
                      <span className="text-[9px] text-white/50 ml-2">Furballs & Paws!</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FF6B00]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#FF6B00]">
                    <span className="text-base">🎸</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#FF6B00] font-bold">Super Guitar Cat</span>
                      <span className="text-[9px] text-white/50 ml-2">Musical notes!</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FF4757]/10 px-2 py-1.5 rounded-lg border-l-4 border-[#FF4757]">
                    <span className="text-base">🎹</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-[#FF4757] font-bold">Grand Piano Cat</span>
                      <span className="text-[9px] text-white/50 ml-2">Piano strings & Lid slam!</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tips */}
              <div className="bg-gradient-to-r from-[#1E1E2E] to-[#252538] rounded-xl p-3 border border-[#FFD93D]/20">
                <h3 className="text-[#FFD93D] text-xs font-bold mb-2 uppercase flex items-center gap-2">
                  <span>💡</span> Pro Tips
                </h3>
                <ul className="text-[10px] text-white/60 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFD93D]">•</span>
                    <span>Skills drop during boss fights too!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFD93D]">•</span>
                    <span>Use Kraken to damage boss with his own bullets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFD93D]">•</span>
                    <span>Farm guitars & pianos for extra points (+100 each hit!)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFD93D]">•</span>
                    <span>Difficulty affects boss bullet count</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFD93D]">•</span>
                    <span>Background changes color after each boss</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Back Button */}
            <button 
              onClick={() => setGameState('menu')}
              className="mt-4 w-full py-3 bg-gradient-to-r from-[#FFD93D]/20 to-[#FFAA00]/20 border-2 border-[#FFD93D]/50 rounded-xl text-[#FFD93D] font-bold text-sm hover:from-[#FFD93D]/30 hover:to-[#FFAA00]/30 hover:border-[#FFD93D] transition-all flex items-center justify-center gap-2"
            >
              <span>←</span> BACK TO MENU
            </button>
          </div>
        )}
        
        {/* Game-over overlay */}
        {false && gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0D0D12] via-[#1a1a2e] to-[#0D0D12] rounded-xl p-4 z-20">
            <div className="text-5xl mb-3">💀</div>
            <h2 className="text-2xl font-black text-[#FF4757] mb-2" style={{textShadow: '0 0 20px rgba(255, 71, 87, 0.5)'}}>GAME OVER</h2>
            
            {/* Score Display */}
            <div className="bg-[#1E1E2E]/80 rounded-xl px-6 py-3 mb-3 border border-[#FFD93D]/30">
              <p className="text-[#FFD93D]/60 text-xs uppercase tracking-wider mb-1">Beer Mugs</p>
              <p className="text-[#FFD93D] text-3xl font-black text-center">🍺 {score}</p>
            </div>
            
            {/* High Score Badge */}
            {score === highScore && score > 0 && (
              <div className="flex items-center gap-2 mb-4 bg-gradient-to-r from-[#FFD93D]/20 to-[#FFAA00]/20 px-4 py-2 rounded-full border border-[#FFD93D]">
                <Star className="w-5 h-5 text-[#FFD93D]" fill="currentColor" />
                <span className="text-[#FFD93D] text-sm font-black">NEW HIGH SCORE!</span>
              </div>
            )}
            
            {/* Sound Controls */}
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={toggleMusic}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all ${musicEnabled ? 'bg-[#FF6B9D]/20 border-[#FF6B9D]/50' : 'bg-[#1E1E2E]/50 border-[#FFD93D]/20'}`}
              >
                <span className="text-lg">{musicEnabled ? '♪' : '♪'}</span>
                <span className={`text-xs font-bold ${musicEnabled ? 'text-[#FF6B9D]' : 'text-[#FFD93D]/40'}`}>Music</span>
              </button>
              <button 
                onClick={toggleSfx}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all ${sfxEnabled ? 'bg-[#FFD93D]/20 border-[#FFD93D]/50' : 'bg-[#1E1E2E]/50 border-[#FFD93D]/20'}`}
              >
                {sfxEnabled ? <Volume2 className="w-4 h-4 text-[#FFD93D]" /> : <VolumeX className="w-4 h-4 text-[#FFD93D]/40" />}
                <span className={`text-xs font-bold ${sfxEnabled ? 'text-[#FFD93D]' : 'text-[#FFD93D]/40'}`}>SFX</span>
              </button>
            </div>
            
            {/* Try Again Button */}
            <Button 
              onClick={startGame} 
              className="bg-gradient-to-r from-[#FFD93D] to-[#FFAA00] text-black hover:from-[#FFAA00] hover:to-[#FFD93D] font-black px-8 py-3 text-lg rounded-xl shadow-lg shadow-[#FFD93D]/30 transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              TRY AGAIN
            </Button>
            
            {/* Back to Menu Button */}
            <Button 
              onClick={startGame}
              variant="outline"
              className="mt-4 bg-[#1E1E2E] border-2 border-[#FFD93D]/50 text-[#FFD93D] hover:bg-[#FFD93D]/20 hover:border-[#FFD93D] font-bold px-6 py-2 text-sm rounded-xl transition-all"
            >
              PLAY AGAIN
            </Button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#11131a] p-6 shadow-2xl shadow-black/60">
              {isPvpRun ? (
                <>
                  <div className="text-center mb-6">
                    <h2
                      className={`text-2xl font-bold ${
                        pvpResultResolved
                          ? pvpSummary?.didWin
                            ? 'text-[#2ED573]'
                            : 'text-[#FF6B6B]'
                          : 'text-[#FFD93D]'
                      }`}
                    >
                      {pvpResultTitle}
                    </h2>
                    <p className="text-xs text-white/70 mt-2">{pvpResultDescription}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-black/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-white/60">{pvpMetricLabel}</p>
                      <p className="text-xl font-bold text-[#FFD93D]">{pvpMetricValue}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-white/60">Opponent</p>
                      <p className="text-xl font-bold text-white">{pvpOpponentMetric === null ? '--' : pvpOpponentMetric}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = '/pvp';
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD93D] to-[#FFAA00] text-black font-bold hover:from-[#FFAA00] hover:to-[#FFD93D]"
                    >
                      BACK TO PVP
                    </Button>
                    <Button
                      onClick={startGame}
                      className="w-full py-3 rounded-xl border-0 bg-[#1E1E2E] text-[#FFD93D] hover:bg-[#FFD93D]/10"
                    >
                      PLAY AGAIN
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    {score === highScore && score > 0 && (
                      <div className="flex items-center justify-center gap-1 text-[#FFD93D] text-sm font-bold mb-2">
                        <Star className="w-4 h-4 fill-current" />
                        NEW RECORD
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-[#FF6B6B]">GAME OVER</h2>
                  </div>

                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40">
                      <Trophy className="w-5 h-5 text-[#FFD93D]" />
                      <span className="text-3xl font-black text-[#FFD93D]">{score}</span>
                    </div>
                    <p className="text-xs text-white/60 mt-2">Beer Mugs</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-black/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-white/60">Level</p>
                      <p className="text-lg font-bold text-white">{level}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-white/60">Meters</p>
                      <p className="text-lg font-bold text-white">{Math.floor(meters)}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-white/60">Reward</p>
                      <p className="text-lg font-bold text-[#FFD93D]">+{Math.floor(score / 10)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={startGame}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FFD93D] to-[#FFAA00] text-black font-bold hover:from-[#FFAA00] hover:to-[#FFD93D]"
                    >
                      <RotateCcw className="w-5 h-5" />
                      PLAY AGAIN
                    </Button>

                    <Button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = '/';
                        }
                      }}
                      className="w-full py-3 rounded-xl border-0 bg-[#1E1E2E] text-[#FFD93D] hover:bg-[#FFD93D]/10"
                    >
                      MAIN MENU
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Controls - Fixed position and larger */}
      <div className="mt-3 self-center flex-shrink-0" style={{ width: gameFrameWidth }}>
        {/* Custom Slider with Finger Control */}
        <div 
          className="hidden relative w-full h-16 bg-[#1E1E2E] rounded-2xl border-2 border-[#FFD93D]/30 overflow-hidden cursor-pointer select-none touch-none"
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderValue(percent);
            playerXRef.current = (percent / 100) * (BASE_WIDTH - PLAYER_WIDTH);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderValue(percent);
            playerXRef.current = (percent / 100) * (BASE_WIDTH - PLAYER_WIDTH);
          }}
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderValue(percent);
            playerXRef.current = (percent / 100) * (BASE_WIDTH - PLAYER_WIDTH);
          }}
          onMouseMove={(e) => {
            if (e.buttons === 1) {
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
              setSliderValue(percent);
              playerXRef.current = (percent / 100) * (BASE_WIDTH - PLAYER_WIDTH);
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
          }}
        >
          {/* Track background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E] via-[#2a2a3e] to-[#1E1E2E]" />
          
          {/* Center marker */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#FFD93D]/20" />
          
          {/* Left/Right indicators */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD93D]/40">
            <ChevronLeft className="w-6 h-6" />
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFD93D]/40">
            <ChevronRight className="w-6 h-6" />
          </div>
          
          {/* Progress fill */}
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#FFD93D]/20 to-[#FFD93D]/40 transition-all duration-75"
            style={{ width: `${sliderValue}%` }}
          />
          
          {/* Finger/Knob */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-75"
            style={{ left: `${sliderValue}%` }}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-12 h-12 -m-6 rounded-full bg-[#FFD93D]/30 animate-pulse" />
            
            {/* Main knob */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FFAA00] shadow-lg shadow-[#FFD93D]/50 border-2 border-white flex items-center justify-center">
              {/* Inner detail */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFAA00] to-[#FFD93D] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/80" />
              </div>
            </div>
            
            {/* Position indicator text */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#FFD93D]/60 whitespace-nowrap">
              {Math.round(sliderValue)}%
            </div>
          </div>
        </div>
        {/* Weapon Selector - Between slider and buttons */}
        {(gameState === 'playing' || gameState === 'boss') && (
          <div className="hidden items-center justify-center gap-1.5 mt-1 bg-[#141821]/90 backdrop-blur-sm px-2 py-2 rounded-xl border border-[#FFD93D]/30">
            {(['standard', 'spread', 'laser', 'chainsaw', 'missile', 'paw', 'beer', 'ice'] as WeaponType[]).map((w) => {
              const isUnlocked = unlockedWeapons.has(w);
              const isActive = weapon === w;
              const weaponInfo = WEAPONS[w];
              const iconMap: Record<WeaponType, string> = {
                standard: '🔫', spread: '☁️', laser: '⚡', chainsaw: '🪚',
                missile: '🚀', paw: '🐾', beer: '🍺', ice: '🧊'
              };
              return (
                  <button
                    key={w}
                    onClick={() => {
                      if (!isUnlocked) return;
                      setWeapon(w);
                      const storeWeaponIndex = storeWeapons.findIndex((entry) => entry.id === w);
                      if (storeWeaponIndex >= 0) {
                        storeSelectWeapon(storeWeaponIndex);
                      }
                    }}
                  disabled={!isUnlocked}
                  className={`
                    relative w-7 h-7 rounded-full flex items-center justify-center text-[11px] transition-all
                    ${isActive 
                      ? 'bg-gradient-to-br from-[#FFD93D] to-[#FFAA00] shadow-md shadow-[#FFD93D]/50 scale-110 ring-2 ring-[#FFD93D]' 
                      : isUnlocked 
                        ? 'bg-[#2a2a3e] hover:bg-[#3a3a4e] border border-[#FFD93D]/30' 
                        : 'bg-[#1a1a2e] opacity-25 cursor-not-allowed grayscale'
                    }
                  `}
                  title={isUnlocked ? weaponInfo.name : 'Locked'}
                >
                  {iconMap[w]}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FFD93D] rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        )}
        
        {(gameState === 'playing' || gameState === 'boss') && (
          <div className="mt-2 w-full rounded-2xl bg-[rgb(var(--card))]/85 px-2 py-1.5 backdrop-blur-xl">
            <div className="hidden mb-1 items-center justify-between px-1 text-[10px] uppercase tracking-wide text-white/60">
              <span>Weapons</span>
              <span>{weaponDock.length}</span>
            </div>
            <div
              className="grid w-full items-center gap-1.5"
              style={{ gridTemplateColumns: `repeat(${Math.max(weaponDock.length, 1)}, minmax(0, 1fr))` }}
            >
              {weaponDock.map((w) => {
                const isActive = weapon === w;
                const WeaponIcon = weaponIconMap[w] ?? Crosshair;
                /*
                  standard: '◎',
                  spread: '◉',
                  laser: '✦',
                  chainsaw: '✸',
                  missile: '▲',
                  paw: '✹',
                  beer: '◍',
                  ice: '❄'
                };
                /*
                  standard: '🔫', spread: '☁️', laser: '⚡', chainsaw: '🪚',
                  missile: '🚀', paw: '🐾', beer: '🍺', ice: '🧊'
                };
                */
                return (
                  <button
                    key={w}
                    onClick={() => {
                      setWeapon(w);
                      const storeWeaponIndex = storeWeapons.findIndex((entry) => entry.id === w);
                      if (storeWeaponIndex >= 0) {
                        storeSelectWeapon(storeWeaponIndex);
                      }
                    }}
                    className={`mx-auto flex h-10 w-10 min-w-0 items-center justify-center rounded-full text-center transition-all ${
                      isActive
                        ? 'bg-[#facc15]/18 shadow-[0_6px_18px_rgba(250,204,21,0.35)]'
                        : 'bg-black/35 hover:bg-black/45'
                    }`}
                    title={WEAPONS[w].name}
                  >
                    <WeaponIcon className={`h-4 w-4 ${isActive ? 'text-[#fde047]' : 'text-[#facc15]'}`} strokeWidth={2.2} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'boss') && (
          <button
            onClick={activateUltimate}
            disabled={!ultimateReady || ultimateActive}
            className={`mt-2 w-full overflow-hidden rounded-2xl px-3 py-2 text-left transition-all ${
              ultimateActive
                ? 'bg-[#facc15]/20 shadow-[0_8px_22px_rgba(250,204,21,0.38)]'
                : ultimateReady
                ? 'bg-[#facc15]/14 shadow-[0_8px_20px_rgba(250,204,21,0.28)] hover:brightness-110'
                : 'bg-black/30'
            }`}
            title="Activate Ultimate"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${ultimateReady ? 'bg-[#facc15]/25' : 'bg-black/20'}`}>
                  <Zap className={`h-4 w-4 ${ultimateReady ? 'text-[#fde047]' : 'text-[#facc15]'}`} />
                </span>
                <div className="leading-tight">
                  <div className="text-[11px] font-black tracking-[0.08em] text-[#fde047]">ULTIMATE</div>
                  <div className="text-[11px] font-semibold text-[rgb(var(--foreground))]">{ultimateLabel}</div>
                </div>
              </div>
              <div className="text-[10px] font-bold text-[rgb(var(--muted-foreground))]">
                +200% DMG / 5s SHIELD
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/35">
              <div
                className={`h-full rounded-full transition-all duration-300 ${ultimateReady ? 'bg-[#fde047]' : 'bg-[#facc15]'}`}
                style={{ width: `${ultimateActive ? 100 : ultimateChargePercent}%` }}
              />
            </div>
          </button>
        )}

        {/* Control Buttons - Compact */}
        <div className="hidden flex justify-between mt-2 gap-2" style={{ width: '380px' }}>
          <button
            onTouchStart={(e) => { e.preventDefault(); moveLeft(); }}
            onMouseDown={moveLeft}
            className="flex-1 py-4 bg-[#1E1E2E] border-2 border-[#FFD93D]/50 rounded-xl active:bg-[#FFD93D]/20 active:border-[#FFD93D] touch-none"
            style={{ minWidth: '100px', touchAction: 'none' }}
          >
            <ChevronLeft className="w-8 h-8 mx-auto text-[#FFD93D]" />
          </button>
          <button
            onClick={cycleWeapon}
            className="px-5 py-4 bg-[#1E1E2E] border-2 border-[#FFD93D]/50 rounded-xl active:bg-[#FFD93D]/20 active:border-[#FFD93D] touch-none"
            style={{ minWidth: '80px', touchAction: 'none' }}
          >
            <span className="text-[#FFD93D] font-bold text-xs">{WEAPONS[weapon].name}</span>
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); moveRight(); }}
            onMouseDown={moveRight}
            className="flex-1 py-4 bg-[#1E1E2E] border-2 border-[#FFD93D]/50 rounded-xl active:bg-[#FFD93D]/20 active:border-[#FFD93D] touch-none"
            style={{ minWidth: '100px', touchAction: 'none' }}
          >
            <ChevronRight className="w-8 h-8 mx-auto text-[#FFD93D]" />
          </button>
        </div>
      </div>
    </div>
  );
}

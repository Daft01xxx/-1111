'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGameStore } from '@/lib/store'

interface Vec2 { x: number; y: number }
interface Entity extends Vec2 { w: number; h: number }
interface Projectile extends Entity {
  vx: number
  vy: number
  dmg: number
  enemy: boolean
  color: string
  projectileType?: 'orb' | 'lager' | 'stout' | 'plasma'
  playerType?: string
  rotation?: number
  life?: number
  justSpawned?: boolean
  pierceLeft?: number
}
interface Enemy extends Entity { hp: number; maxHp: number; pts: number; type: number; frame: number }
interface PowerUp extends Entity { type: 'shield' | 'double' | 'slowmo' | 'magnet' | 'reflect' | 'kraken' | 'health' | 'weapon' | 'fish' }
interface Boss extends Entity { hp: number; maxHp: number; frame: number; phase: number; level: number; attackTimer: number; attackMode: 0 | 1 | 2; name: string; nameRu: string; bottleType: 'lager' | 'stout' | 'plasma'; textureIndex?: number }
interface ExplosionParticle { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number; color: string }
interface AudioTrackPreset { id: string; tempo: number; bass: Array<number | null>; lead: Array<number | null>; arp: Array<number | null>; punch: number }
interface SpriteCrop { sx: number; sy: number; sw: number; sh: number }
interface FloatingText { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; text: string; color: string }
interface MuzzleFlash { x: number; y: number; size: number; life: number; maxLife: number; color: string }

const C = {
  bg: '#0A0A0B',
  cat: '#F97316',
  catLight: '#FB923C',
  catDark: '#C2410C',
  beer: '#F59E0B',
  beerLight: '#FCD34D',
  beerDark: '#B45309',
  foam: '#FEF3C7',
  gold: '#D4AF37',
  shield: '#3B82F6',
  health: '#22C55E',
  red: '#EF4444',
}

const BOSS_INTERVAL = 60000 // Boss every 60 seconds (1 minute)
const WEAPON_DROP_CHANCE = 0.01 // 1% from enemies
const BOSS_WEAPON_DROP_CHANCE = 0.30 // 30% from boss
const MUSIC_TRACK_SWITCH_MS = 22000
const AUDIO_TRACK_COUNT = 100
const SYNTH_AUDIO_ENABLED = false
const PLAYER_SPRITE_SCALE = 2
const GAME_SPEED_MULTIPLIER = 1.5
const BEER_MUG_SIZE_MULTIPLIER = 1 / 1.5
const POWER_UP_SIZE_MULTIPLIER = 1.5
const PLAYER_ANCHOR_X = 30
const PLAYER_ANCHOR_Y = 46
const PLAYER_CORE_X = PLAYER_ANCHOR_X
const PLAYER_CORE_Y = PLAYER_ANCHOR_Y
const PLAYER_SHIELD_RADIUS_SPRITE = 46
const PLAYER_SHIELD_RADIUS_FALLBACK = 42
const PLAYER_HITBOX_W = 46
const PLAYER_HITBOX_H = 56
const BOSS_HP_MULTIPLIER = 3.8
const BOSS_DAMAGE_MULTIPLIER = 1.8
const BOSS_ATTACK_SPEED_MULTIPLIER = 1.25

const BOSS_VARIANTS: Array<Pick<Boss, 'name' | 'nameRu' | 'bottleType' | 'textureIndex'>> = [
  { name: 'Lager Cat', nameRu: 'Кот Лагер', bottleType: 'lager' },
  { name: 'Stout Cat', nameRu: 'Кот Стаут', bottleType: 'stout' },
  { name: 'Plasma Cat', nameRu: 'Плазма Кот', bottleType: 'plasma' },
]

const BOSS_VARIANTS_KIMI: Array<Pick<Boss, 'name' | 'nameRu' | 'bottleType' | 'textureIndex'>> = [
  { name: 'Nyan Cat', nameRu: 'Нян Кот', bottleType: 'lager', textureIndex: 0 },
  { name: 'Demon Cat', nameRu: 'Демон Кот', bottleType: 'stout', textureIndex: 1 },
  { name: 'Cyber Cat', nameRu: 'Кибер Кот', bottleType: 'plasma', textureIndex: 2 },
  { name: 'Phantom Cat', nameRu: 'Фантом Кот', bottleType: 'stout', textureIndex: 3 },
  { name: 'Gold Cat', nameRu: 'Золотой Кот', bottleType: 'lager', textureIndex: 4 },
]

const BOSS_VARIANTS_KIMI_FULL: Array<Pick<Boss, 'name' | 'nameRu' | 'bottleType' | 'textureIndex'>> = [
  { name: 'Nyan Cat', nameRu: 'Nyan Cat', bottleType: 'lager', textureIndex: 0 },
  { name: 'Demon Cat', nameRu: 'Demon Cat', bottleType: 'stout', textureIndex: 1 },
  { name: 'Cyber Cat', nameRu: 'Cyber Cat', bottleType: 'plasma', textureIndex: 2 },
  { name: 'Phantom Cat', nameRu: 'Phantom Cat', bottleType: 'stout', textureIndex: 3 },
  { name: 'Gold Cat', nameRu: 'Gold Cat', bottleType: 'lager', textureIndex: 4 },
  { name: 'Galactic Cat', nameRu: 'Galactic Cat', bottleType: 'plasma', textureIndex: 0 },
  { name: 'Mega Grand Master', nameRu: 'Mega Grand Master', bottleType: 'stout', textureIndex: 1 },
  { name: 'Super Guitar Cat', nameRu: 'Super Guitar Cat', bottleType: 'lager', textureIndex: 2 },
  { name: 'Grand Piano Cat', nameRu: 'Grand Piano Cat', bottleType: 'stout', textureIndex: 3 },
  { name: 'Terminator Cat', nameRu: 'Terminator Cat', bottleType: 'plasma', textureIndex: 4 },
  { name: 'Joker Cat', nameRu: 'Joker Cat', bottleType: 'lager', textureIndex: 0 },
]

function midiToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12)
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function buildLane(
  rng: () => number,
  steps: number,
  root: number,
  scale: number[],
  octaveChance: number,
  restChance: number
): Array<number | null> {
  const lane: Array<number | null> = []
  let prev: number | null = null
  for (let i = 0; i < steps; i++) {
    if (rng() < restChance) {
      lane.push(null)
      continue
    }
    const intervalA = scale[Math.floor(rng() * scale.length)]
    const intervalB = scale[Math.floor(rng() * scale.length)]
    const interval = rng() < 0.68 ? intervalA : intervalB
    const octave = rng() < octaveChance ? 12 : 0
    let note = root + interval + octave
    if (prev !== null && note === prev) {
      const fallback = scale[(scale.indexOf(interval) + 2) % scale.length]
      note = root + fallback + octave
    }
    lane.push(note)
    prev = note
  }
  return lane
}

function create8BitTrack(index: number, generation: number): AudioTrackPreset {
  const seed = (index + 1) * 2654435761 ^ (generation + 1) * 1013904223
  const rng = mulberry32(seed)
  const scales = [
    [0, 2, 3, 5, 7, 8, 10], // minor
    [0, 2, 4, 7, 9], // major pent
    [0, 3, 5, 6, 7, 10], // blues
    [0, 2, 4, 5, 7, 9, 11], // major
  ]
  const scale = scales[Math.floor(rng() * scales.length)]
  const root = 34 + Math.floor(rng() * 10)
  const tempo = 140 + Math.floor(rng() * 42)
  const steps = 16

  return {
    id: `chip-${generation}-${index}`,
    tempo,
    punch: 1 + rng() * 0.6,
    bass: buildLane(rng, steps, root - 12, scale, 0.2, 0.42),
    lead: buildLane(rng, steps, root + 12, scale, 0.35, 0.24),
    arp: buildLane(rng, steps, root + 19, scale, 0.6, 0.18),
  }
}

function generateAudioTracks(generation: number): AudioTrackPreset[] {
  const tracks: AudioTrackPreset[] = Array.from({ length: AUDIO_TRACK_COUNT }, (_, i) => create8BitTrack(i, generation))
  const rng = mulberry32((generation + 1) * 2246822519)
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const temp = tracks[i]
    tracks[i] = tracks[j]
    tracks[j] = temp
  }
  return tracks
}

export function GameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const lastFireRef = useRef<number>(0)
  const touchRef = useRef<number | null>(null)
  const bossSpawnTimeRef = useRef<number>(0)
  const explosionsRef = useRef<ExplosionParticle[]>([])
  const floatingTextsRef = useRef<FloatingText[]>([])
  const muzzleFlashesRef = useRef<MuzzleFlash[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioMasterRef = useRef<GainNode | null>(null)
  const audioCompressorRef = useRef<DynamicsCompressorNode | null>(null)
  const audioTickTimerRef = useRef<number | null>(null)
  const audioStepRef = useRef(0)
  const audioTrackIndexRef = useRef(0)
  const audioNextTimeRef = useRef(0)
  const audioLastSwitchRef = useRef(0)
  const audioUnlockedRef = useRef(false)
  const audioTrackGenerationRef = useRef(0)
  const audioTracksRef = useRef<AudioTrackPreset[]>(generateAudioTracks(0))
  
  const [size, setSize] = useState({ w: 0, h: 0 })
  
  const store = useGameStore()
  const {
    isPlaying, isPaused, health, addScore, addMeters, checkLevelUp,
    takeDamage, heal, hasShield, hasDoubleShot, hasTripleShot, hasSpeedBoost,
    hasMagnet, hasReflector, hasTimeWarp, hasKraken, activatePowerUp, updatePowerUpTimers, weapons, currentWeaponIndex,
    endGame, skins, currentSkinId, defeatBoss, dropWeapon, language, musicVolume, addCoins
  } = store

  const playerRef = useRef({ x: 0, y: 0, frame: 0 })
  const projectilesRef = useRef<Projectile[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const bossRef = useRef<Boss | null>(null)
  const spawnTimerRef = useRef(0.81)
  const metersRef = useRef(0)
  const starsRef = useRef<{x: number; y: number; size: number; speed: number}[]>([])
  const playerSpriteRef = useRef<HTMLCanvasElement | null>(null)
  const playerSpriteCropRef = useRef<SpriteCrop | null>(null)
  const bossTextureRefs = useRef<Array<HTMLImageElement | null>>([])

  const skin = skins.find(s => s.id === currentSkinId) || skins[0]
  const weapon = weapons[currentWeaponIndex] ?? weapons.find((entry) => entry.unlocked) ?? weapons[0]

  // Initialize stars
  useEffect(() => {
    starsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 80 + 40
    }))
  }, [])

  const createMaskedSprite = useCallback((sprite: HTMLImageElement): { canvas: HTMLCanvasElement; crop: SpriteCrop } | null => {
    const width = sprite.naturalWidth || sprite.width
    const height = sprite.naturalHeight || sprite.height
    if (!width || !height) return null

    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = width
    maskCanvas.height = height
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true })
    if (!maskCtx) return null
    maskCtx.drawImage(sprite, 0, 0, width, height)

    const imageData = maskCtx.getImageData(0, 0, width, height)
    const pixels = imageData.data
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const isNearBlack = r < 22 && g < 22 && b < 22
      if (isNearBlack) {
        pixels[i + 3] = 0
      }
    }
    maskCtx.putImageData(imageData, 0, 0)

    const processed = imageData.data
    let minX = width
    let minY = height
    let maxX = -1
    let maxY = -1
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        if (processed[idx + 3] > 12) {
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }

    if (maxX < minX || maxY < minY) {
      return {
        canvas: maskCanvas,
        crop: { sx: 0, sy: 0, sw: width, sh: height },
      }
    }

    const padding = 3
    const sx = Math.max(0, minX - padding)
    const sy = Math.max(0, minY - padding)
    const sw = Math.min(width - sx, maxX - minX + padding * 2 + 1)
    const sh = Math.min(height - sy, maxY - minY + padding * 2 + 1)
    return {
      canvas: maskCanvas,
      crop: { sx, sy, sw, sh },
    }
  }, [])

  useEffect(() => {
    let canceled = false
    const candidateSources = ['/images/player-cape-cat.jpg', '/images/player-cape-cat.webp', '/images/player-cape-cat.png', '/images/napiwas-logo.jpg']

    const loadSprite = (sourceIndex: number) => {
      if (sourceIndex >= candidateSources.length || canceled) {
        playerSpriteRef.current = null
        playerSpriteCropRef.current = null
        return
      }

      const sprite = new window.Image()
      sprite.decoding = 'async'
      sprite.src = candidateSources[sourceIndex]
      sprite.onload = () => {
        if (canceled) return
        const masked = createMaskedSprite(sprite)
        if (masked) {
          playerSpriteRef.current = masked.canvas
          playerSpriteCropRef.current = masked.crop
        } else {
          playerSpriteRef.current = null
          playerSpriteCropRef.current = null
        }
      }
      sprite.onerror = () => {
        if (canceled) return
        loadSprite(sourceIndex + 1)
      }
    }

    loadSprite(0)
    return () => {
      canceled = true
    }
  }, [createMaskedSprite])

  useEffect(() => {
    const sources = ['/images/boss1.jpg', '/images/boss2.jpg', '/images/boss3.jpg', '/images/boss4.jpg', '/images/boss5.jpg']
    bossTextureRefs.current = Array(sources.length).fill(null)
    sources.forEach((src, index) => {
      const img = new window.Image()
      img.decoding = 'async'
      img.src = src
      img.onload = () => {
        bossTextureRefs.current[index] = img
      }
      img.onerror = () => {
        bossTextureRefs.current[index] = null
      }
    })
  }, [])

  // Resize handler - make player higher to not be covered by controls
  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setSize({ w, h })
      playerRef.current.x = w / 2 - PLAYER_ANCHOR_X
      const playerBottomSafeOffset =
        w < 768
          ? Math.min(470, Math.max(390, Math.round(h * 0.56)))
          : Math.min(360, Math.max(310, Math.round(h * 0.45)))
      playerRef.current.y = h - playerBottomSafeOffset
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Draw the in-game player character (cute cat pilot + small ship body)
  const drawCat = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, shielded: boolean) => {
    const hover = 0
    const tailSwing = Math.sin(frame * 0.17) * 7
    const jetPulse = 0.8 + (Math.sin(frame * 0.4) + 1) * 0.2
    const hull = skin.color || C.cat
    const catSprite = playerSpriteRef.current
    const catSpriteCrop = playerSpriteCropRef.current
    const shieldCx = PLAYER_CORE_X
    const shieldCy = PLAYER_CORE_Y
    const shieldRadius = catSprite ? PLAYER_SHIELD_RADIUS_SPRITE : PLAYER_SHIELD_RADIUS_FALLBACK

    ctx.save()
    ctx.translate(x, y + hover)

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.32)'
    ctx.beginPath()
    ctx.ellipse(30, 62, 24, 9, 0, 0, Math.PI * 2)
    ctx.fill()

    if (shielded) {
      ctx.beginPath()
      ctx.arc(shieldCx, shieldCy, shieldRadius, 0, Math.PI * 2)
      const shieldGrad = ctx.createRadialGradient(
        shieldCx,
        shieldCy,
        12,
        shieldCx,
        shieldCy,
        shieldRadius
      )
      shieldGrad.addColorStop(0, 'rgba(59,130,246,0)')
      shieldGrad.addColorStop(0.7, 'rgba(59,130,246,0.22)')
      shieldGrad.addColorStop(1, 'rgba(59,130,246,0.52)')
      ctx.fillStyle = shieldGrad
      ctx.fill()
    }

    if (catSprite && catSpriteCrop) {
      const flameGrad = ctx.createLinearGradient(30, 52, 30, 105)
      flameGrad.addColorStop(0, 'rgba(255,255,255,0.9)')
      flameGrad.addColorStop(0.28, '#FDE68A')
      flameGrad.addColorStop(0.6, '#FB923C')
      flameGrad.addColorStop(1, 'rgba(251,146,60,0)')
      ctx.fillStyle = flameGrad
      ctx.beginPath()
      ctx.moveTo(22, 54)
      ctx.quadraticCurveTo(30, 89 + jetPulse * 8, 38, 54)
      ctx.closePath()
      ctx.fill()

      const spriteWidth = 54 * PLAYER_SPRITE_SCALE
      const spriteHeight = 86 * PLAYER_SPRITE_SCALE
      const spriteX = PLAYER_ANCHOR_X - spriteWidth / 2
      const spriteY = PLAYER_ANCHOR_Y - spriteHeight / 2

      ctx.drawImage(
        catSprite,
        catSpriteCrop.sx,
        catSpriteCrop.sy,
        catSpriteCrop.sw,
        catSpriteCrop.sh,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight
      )
      ctx.restore()
      return
    }

    // Tail thruster
    ctx.strokeStyle = '#7C2D12'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(30, 45)
    ctx.quadraticCurveTo(30 + tailSwing, 63, 23 + tailSwing * 0.45, 78)
    ctx.stroke()

    // Thruster flame
    const flameGrad = ctx.createLinearGradient(30, 48, 30, 92)
    flameGrad.addColorStop(0, 'rgba(255,255,255,0.9)')
    flameGrad.addColorStop(0.3, '#FDE68A')
    flameGrad.addColorStop(0.65, '#FB923C')
    flameGrad.addColorStop(1, 'rgba(251,146,60,0)')
    ctx.fillStyle = flameGrad
    ctx.beginPath()
    ctx.moveTo(23, 45)
    ctx.quadraticCurveTo(30, 77 + jetPulse * 6, 37, 45)
    ctx.closePath()
    ctx.fill()

    // Body
    ctx.beginPath()
    ctx.ellipse(30, 34, 22, 14, 0, 0, Math.PI * 2)
    const bodyGrad = ctx.createRadialGradient(23, 29, 0, 30, 34, 23)
    bodyGrad.addColorStop(0, '#FFD8B1')
    bodyGrad.addColorStop(0.42, C.catLight)
    bodyGrad.addColorStop(1, hull)
    ctx.fillStyle = bodyGrad
    ctx.fill()
    ctx.strokeStyle = C.catDark
    ctx.lineWidth = 1.8
    ctx.stroke()
    if (catSprite && catSpriteCrop) {
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(30, 34, 20, 12, 0, 0, Math.PI * 2)
      ctx.clip()
      ctx.globalAlpha = 0.34
      ctx.drawImage(
        catSprite,
        catSpriteCrop.sx,
        catSpriteCrop.sy,
        catSpriteCrop.sw,
        catSpriteCrop.sh,
        8,
        17,
        44,
        34
      )
      ctx.globalAlpha = 1
      ctx.restore()
    }

    // Side fins
    ctx.fillStyle = '#FB923C'
    ctx.beginPath()
    ctx.moveTo(11, 33)
    ctx.lineTo(3, 41)
    ctx.lineTo(13, 43)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(49, 33)
    ctx.lineTo(57, 41)
    ctx.lineTo(47, 43)
    ctx.closePath()
    ctx.fill()

    // Cockpit glow
    const cockpitGlow = ctx.createRadialGradient(30, 28, 2, 30, 28, 18)
    cockpitGlow.addColorStop(0, 'rgba(255,255,255,0.45)')
    cockpitGlow.addColorStop(1, 'rgba(96,165,250,0)')
    ctx.fillStyle = cockpitGlow
    ctx.beginPath()
    ctx.ellipse(30, 28, 14, 9, 0, 0, Math.PI * 2)
    ctx.fill()

    // Paws
    ctx.fillStyle = hull
    ctx.beginPath()
    ctx.ellipse(16, 48, 5.2, 4.2, -0.2, 0, Math.PI * 2)
    ctx.ellipse(44, 48, 5.2, 4.2, 0.2, 0, Math.PI * 2)
    ctx.fill()

    // Head frame
    ctx.beginPath()
    ctx.ellipse(30, 11, 16, 13, 0, 0, Math.PI * 2)
    const headFrameGrad = ctx.createLinearGradient(16, -2, 44, 23)
    headFrameGrad.addColorStop(0, '#FFE7CC')
    headFrameGrad.addColorStop(0.55, '#FBBF24')
    headFrameGrad.addColorStop(1, '#D97706')
    ctx.fillStyle = headFrameGrad
    ctx.fill()
    ctx.strokeStyle = C.catDark
    ctx.lineWidth = 1.6
    ctx.stroke()

    // Cat portrait inside cockpit (only in gameplay)
    if (catSprite && catSpriteCrop) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(30, 11, 12.6, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(
        catSprite,
        catSpriteCrop.sx,
        catSpriteCrop.sy,
        catSpriteCrop.sw,
        catSpriteCrop.sh,
        16,
        -2,
        28,
        28
      )
      ctx.restore()
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(30, 11, 12.2, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Ears
    const drawEar = (mx: number, dir: -1 | 1) => {
      ctx.beginPath()
      ctx.moveTo(mx, 2)
      ctx.lineTo(mx + dir * 4, -10)
      ctx.lineTo(mx + dir * 12, 1)
      ctx.closePath()
      ctx.fillStyle = hull
      ctx.fill()
      ctx.strokeStyle = C.catDark
      ctx.lineWidth = 1.4
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(mx + dir * 2, 2)
      ctx.lineTo(mx + dir * 4, -5)
      ctx.lineTo(mx + dir * 9, 1)
      ctx.closePath()
      ctx.fillStyle = '#FCA5A5'
      ctx.fill()
    }
    drawEar(20, -1)
    drawEar(40, 1)

    // Backup face if image is unavailable
    if (!catSprite || !catSpriteCrop) {
      const blink = frame % 160 < 6
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.ellipse(24, 10, 5, blink ? 0.5 : 4.3, 0, 0, Math.PI * 2)
      ctx.ellipse(36, 10, 5, blink ? 0.5 : 4.3, 0, 0, Math.PI * 2)
      ctx.fill()
      if (!blink) {
        ctx.fillStyle = '#22D3EE'
        ctx.beginPath()
        ctx.ellipse(24, 10, 3, 3.6, 0, 0, Math.PI * 2)
        ctx.ellipse(36, 10, 3, 3.6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#0F172A'
        ctx.beginPath()
        ctx.ellipse(24, 10.2, 1.4, 2.4, 0, 0, Math.PI * 2)
        ctx.ellipse(36, 10.2, 1.4, 2.4, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#FB7185'
      ctx.beginPath()
      ctx.ellipse(30, 15, 2.2, 1.8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#7C2D12'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(30, 16.5)
      ctx.lineTo(30, 19)
      ctx.moveTo(30, 19)
      ctx.quadraticCurveTo(27, 21, 24.5, 19.2)
      ctx.moveTo(30, 19)
      ctx.quadraticCurveTo(33, 21, 35.5, 19.2)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 0.6
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(20, 14 + i * 2.2)
        ctx.lineTo(8, 12 + i * 2.6)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(40, 14 + i * 2.2)
        ctx.lineTo(52, 12 + i * 2.6)
        ctx.stroke()
      }
    }

    // Cockpit glass
    ctx.beginPath()
    ctx.ellipse(30, 29, 11, 7, 0, 0, Math.PI * 2)
    const glassGrad = ctx.createLinearGradient(20, 22, 40, 36)
    glassGrad.addColorStop(0, 'rgba(255,255,255,0.45)')
    glassGrad.addColorStop(1, 'rgba(147,197,253,0.12)')
    ctx.fillStyle = glassGrad
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.restore()
  }, [skin.color])

  // Draw enemy
  const drawBeerMug = useCallback((ctx: CanvasRenderingContext2D, e: Enemy) => {
    const wobble = Math.sin(e.frame * 0.12) * 2
    const { x, y, w, h, hp, maxHp } = e
    const scale = 1
    
    ctx.save()
    ctx.translate(x + w/2, y + h/2)
    ctx.rotate(Math.sin(e.frame * 0.06) * 0.08)
    ctx.scale(scale, scale)
    ctx.translate(-w/2, -h/2)
    
    // Handle
    ctx.beginPath()
    ctx.moveTo(w - 2, h * 0.28)
    ctx.quadraticCurveTo(w + 12, h * 0.38, w + 12, h * 0.52)
    ctx.quadraticCurveTo(w + 12, h * 0.66, w - 2, h * 0.72)
    ctx.strokeStyle = C.beerDark
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.strokeStyle = C.beer
    ctx.lineWidth = 4
    ctx.stroke()
    
    // Mug body
    ctx.beginPath()
    ctx.roundRect(4, h * 0.2, w - 8, h * 0.76, 4)
    const mugGrad = ctx.createLinearGradient(0, 0, w, 0)
    mugGrad.addColorStop(0, '#FCD34D')
    mugGrad.addColorStop(0.4, '#F59E0B')
    mugGrad.addColorStop(0.8, '#D97706')
    ctx.fillStyle = mugGrad
    ctx.fill()
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Beer liquid
    ctx.beginPath()
    ctx.roundRect(7, h * 0.35, w - 14, h * 0.58, 3)
    const beerGrad = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.93)
    beerGrad.addColorStop(0, '#FCD34D')
    beerGrad.addColorStop(0.4, '#F59E0B')
    beerGrad.addColorStop(1, '#B45309')
    ctx.fillStyle = beerGrad
    ctx.fill()
    
    // Foam
    ctx.fillStyle = C.foam
    const foamY = h * 0.18 + wobble
    ctx.beginPath()
    ctx.ellipse(10, foamY, 8, 6, 0, 0, Math.PI * 2)
    ctx.ellipse(w/2, foamY - 3, 9, 7, 0, 0, Math.PI * 2)
    ctx.ellipse(w - 10, foamY, 8, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Glass shine
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.beginPath()
    ctx.roundRect(10, h * 0.28, 7, h * 0.48, 3)
    ctx.fill()

    // Foam bubbles
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.beginPath()
    ctx.arc(w * 0.34, h * 0.17, 2.2, 0, Math.PI * 2)
    ctx.arc(w * 0.52, h * 0.12, 2.5, 0, Math.PI * 2)
    ctx.arc(w * 0.68, h * 0.17, 2, 0, Math.PI * 2)
    ctx.fill()
    
    // HP bar
    if (hp < maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(4, h + 3, w - 8, 4)
      ctx.fillStyle = hp/maxHp > 0.5 ? C.health : hp/maxHp > 0.25 ? C.beer : C.red
      ctx.fillRect(4, h + 3, (w - 8) * (hp/maxHp), 4)
    }
    
    ctx.restore()
  }, [])

  // Draw boss as a sharp star-monster core
  const drawBossLegacy = useCallback((ctx: CanvasRenderingContext2D, b: Boss) => {
    const { x, y, w, h, frame, hp, maxHp, level, attackMode } = b
    const centerX = x + w / 2
    const centerY = y + h / 2
    const hpPct = hp / maxHp
    const enraged = hpPct < 0.35
    const pulse = 1 + Math.sin(frame * 0.1) * 0.06
    const spin = frame * 0.01 + attackMode * 0.04
    const radiusOuter = Math.min(w, h) * 0.46
    const radiusInner = radiusOuter * 0.68
    const spikes = 14
    const bossTextures = bossTextureRefs.current.filter(Boolean) as HTMLImageElement[]
    const bossTexture = bossTextures.length > 0 ? bossTextures[(level - 1) % bossTextures.length] : null
    const drawStarPath = () => {
      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (Math.PI * i) / spikes - Math.PI / 2
        const radius = i % 2 === 0 ? radiusOuter * pulse : radiusInner * pulse
        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    ctx.save()

    // Main star body
    ctx.translate(centerX, centerY)
    ctx.rotate(spin)
    drawStarPath()
    if (bossTexture?.complete) {
      ctx.save()
      drawStarPath()
      ctx.clip()
      const textureScale = radiusOuter * 2.34
      ctx.drawImage(bossTexture, -textureScale / 2, -textureScale / 2, textureScale, textureScale)
      const darkMask = ctx.createRadialGradient(0, 0, radiusOuter * 0.1, 0, 0, radiusOuter * 1.1)
      darkMask.addColorStop(0, 'rgba(0,0,0,0.08)')
      darkMask.addColorStop(0.64, 'rgba(0,0,0,0.24)')
      darkMask.addColorStop(1, 'rgba(0,0,0,0.52)')
      ctx.fillStyle = darkMask
      ctx.fillRect(-radiusOuter * 1.3, -radiusOuter * 1.3, radiusOuter * 2.6, radiusOuter * 2.6)
      ctx.restore()
    } else {
      const bodyGrad = ctx.createRadialGradient(-radiusOuter * 0.15, -radiusOuter * 0.2, 0, 0, 0, radiusOuter * 1.1)
      bodyGrad.addColorStop(0, '#070A12')
      bodyGrad.addColorStop(0.75, '#020308')
      bodyGrad.addColorStop(1, '#000000')
      ctx.fillStyle = bodyGrad
      ctx.fill()
    }
    ctx.strokeStyle = enraged ? '#FECACA' : '#DBEAFE'
    ctx.lineWidth = 2.2
    ctx.shadowColor = enraged ? 'rgba(248,113,113,0.45)' : 'rgba(191,219,254,0.35)'
    ctx.shadowBlur = 14
    drawStarPath()
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.restore()

    // Inner face plate
    ctx.beginPath()
    ctx.ellipse(centerX, centerY + h * 0.02, w * 0.22, h * 0.18, 0, 0, Math.PI * 2)
    const plateGrad = ctx.createLinearGradient(centerX - w * 0.22, centerY - h * 0.14, centerX + w * 0.22, centerY + h * 0.18)
    plateGrad.addColorStop(0, 'rgba(8,12,20,0.96)')
    plateGrad.addColorStop(1, 'rgba(0,0,0,0.98)')
    ctx.fillStyle = plateGrad
    ctx.fill()
    ctx.strokeStyle = 'rgba(191,212,255,0.5)'
    ctx.lineWidth = 1.6
    ctx.stroke()

    // Eyes
    ctx.fillStyle = '#F7FAFF'
    ctx.beginPath()
    ctx.ellipse(centerX - w * 0.085, centerY - h * 0.03, 13, 8, -0.52, 0, Math.PI * 2)
    ctx.ellipse(centerX + w * 0.085, centerY - h * 0.03, 13, 8, 0.52, 0, Math.PI * 2)
    ctx.fill()

    // Teeth
    ctx.fillStyle = '#F8FAFC'
    ctx.beginPath()
    ctx.moveTo(centerX - w * 0.13, centerY + h * 0.12)
    ctx.lineTo(centerX - w * 0.08, centerY + h * 0.2)
    ctx.lineTo(centerX - w * 0.03, centerY + h * 0.12)
    ctx.lineTo(centerX + w * 0.01, centerY + h * 0.2)
    ctx.lineTo(centerX + w * 0.06, centerY + h * 0.12)
    ctx.lineTo(centerX + w * 0.11, centerY + h * 0.2)
    ctx.lineTo(centerX + w * 0.15, centerY + h * 0.12)
    ctx.closePath()
    ctx.fill()

    // Attack mode indicator
    const modeColors = ['#38BDF8', '#F59E0B', '#EF4444']
    ctx.fillStyle = modeColors[attackMode]
    ctx.beginPath()
    ctx.arc(centerX, y - 10, 6, 0, Math.PI * 2)
    ctx.fill()

    // HP and title
    ctx.fillStyle = C.gold
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(language === 'ru' ? `БОСС ${level}` : `BOSS ${level}`, centerX, y - 30)
    ctx.fillText(language === 'ru' ? `БОСС ${level}` : `BOSS ${level}`, centerX, y - 30)

    ctx.fillStyle = 'rgba(0,0,0,0.78)'
    ctx.fillRect(centerX - 62, y - 42, 124, 18)
    ctx.fillStyle = C.gold
    ctx.fillText(`BOSS ${level}`, centerX, y - 30)
    ctx.fillStyle = 'rgba(0,0,0,0.72)'
    ctx.fillRect(x + 8, y - 20, w - 16, 14)
    ctx.fillStyle = hpPct > 0.5 ? C.health : hpPct > 0.25 ? C.beer : C.red
    ctx.fillRect(x + 10, y - 18, (w - 20) * hpPct, 10)
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 10px sans-serif'
    ctx.fillText(`${Math.ceil(hp)}/${maxHp}`, centerX, y - 10)

    ctx.restore()
  }, [language])

  const drawBoss = useCallback((ctx: CanvasRenderingContext2D, b: Boss) => {
    const { x, y, w, h, frame, hp, maxHp, attackMode, name, nameRu, bottleType, textureIndex } = b
    const centerX = x + w / 2
    const centerY = y + h / 2
    const hpPct = hp / maxHp
    const pulse = 1 + Math.sin(frame * 0.09) * 0.05
    const accent = bottleType === 'lager' ? '#FDE68A' : bottleType === 'stout' ? '#F87171' : '#67E8F9'
    const texturePool = bossTextureRefs.current
    const texture = texturePool.length > 0
      ? texturePool[((textureIndex ?? 0) + texturePool.length) % texturePool.length]
      : null
    const radiusOuter = Math.min(w, h) * 0.44
    const radiusInner = radiusOuter * 0.68
    const spikes = 11
    const spin = frame * 0.012 + attackMode * 0.08

    const buildStarPath = () => {
      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (Math.PI * i) / spikes - Math.PI / 2
        const radius = i % 2 === 0 ? radiusOuter : radiusInner
        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(spin)
    ctx.scale(pulse, pulse)
    buildStarPath()
    if (texture) {
      ctx.save()
      buildStarPath()
      ctx.clip()
      const textureSize = radiusOuter * 2.5
      ctx.drawImage(texture, -textureSize / 2, -textureSize / 2, textureSize, textureSize)
      ctx.restore()
    } else {
      ctx.fillStyle = '#020202'
      ctx.fill()
    }
    ctx.strokeStyle = '#F8FAFC'
    ctx.lineWidth = 2
    ctx.shadowColor = `${accent}99`
    ctx.shadowBlur = 14
    buildStarPath()
    ctx.stroke()
    ctx.shadowBlur = 0

    // Face overlay to keep silhouette readable on every texture.
    ctx.fillStyle = '#F8FAFC'
    ctx.beginPath()
    ctx.ellipse(-radiusOuter * 0.28, -radiusOuter * 0.05, radiusOuter * 0.16, radiusOuter * 0.1, -0.42, 0, Math.PI * 2)
    ctx.ellipse(radiusOuter * 0.28, -radiusOuter * 0.05, radiusOuter * 0.16, radiusOuter * 0.1, 0.42, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(-radiusOuter * 0.42, radiusOuter * 0.25)
    ctx.lineTo(-radiusOuter * 0.3, radiusOuter * 0.42)
    ctx.lineTo(-radiusOuter * 0.15, radiusOuter * 0.24)
    ctx.lineTo(0, radiusOuter * 0.42)
    ctx.lineTo(radiusOuter * 0.15, radiusOuter * 0.24)
    ctx.lineTo(radiusOuter * 0.3, radiusOuter * 0.42)
    ctx.lineTo(radiusOuter * 0.42, radiusOuter * 0.24)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    const modeColors = ['#38BDF8', '#F59E0B', '#EF4444'] as const
    ctx.fillStyle = modeColors[attackMode]
    ctx.beginPath()
    ctx.arc(centerX, y - 10, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = C.gold
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(language === 'ru' ? nameRu : name, centerX, y - 30)

    ctx.fillStyle = 'rgba(0,0,0,0.72)'
    ctx.fillRect(x + 8, y - 20, w - 16, 14)
    ctx.fillStyle = hpPct > 0.5 ? C.health : hpPct > 0.25 ? C.beer : C.red
    ctx.fillRect(x + 10, y - 18, (w - 20) * hpPct, 10)
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 10px sans-serif'
    ctx.fillText(`${Math.ceil(hp)}/${maxHp}`, centerX, y - 10)
  }, [language])

  // Draw projectile
  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, p: Projectile, frame: number) => {
    ctx.save()
    
    if (p.enemy) {
      const cx = p.x + p.w / 2
      const cy = p.y + p.h / 2
      const bottleType = p.projectileType ?? 'orb'
      if (bottleType === 'orb') {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.w / 2)
        grad.addColorStop(0, '#FFF')
        grad.addColorStop(1, '#F59E0B')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(cx, cy, p.w / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        const bottleBody =
          bottleType === 'lager' ? '#F59E0B' : bottleType === 'stout' ? '#7C2D12' : '#22D3EE'
        const bottleNeck =
          bottleType === 'lager' ? '#FBBF24' : bottleType === 'stout' ? '#B45309' : '#67E8F9'
        const glass = 'rgba(255,255,255,0.88)'
        const bottleW = p.w
        const bottleH = p.h * 1.22
        const bx = cx - bottleW / 2
        const by = cy - bottleH / 2

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(frame * 0.06)
        ctx.translate(-cx, -cy)

        ctx.fillStyle = bottleBody
        ctx.beginPath()
        ctx.roundRect(bx, by + bottleH * 0.22, bottleW, bottleH * 0.78, 3)
        ctx.fill()

        ctx.fillStyle = bottleNeck
        ctx.beginPath()
        ctx.roundRect(bx + bottleW * 0.28, by, bottleW * 0.44, bottleH * 0.3, 2.5)
        ctx.fill()

        ctx.fillStyle = glass
        ctx.beginPath()
        ctx.roundRect(bx + bottleW * 0.16, by + bottleH * 0.3, bottleW * 0.16, bottleH * 0.48, 1.5)
        ctx.fill()
        ctx.restore()
      }
    } else {
      // Player projectile visuals by weapon type
      const rot = p.rotation ?? frame * 0.3
      const half = p.w / 2
      ctx.translate(p.x + half, p.y + p.h / 2)
      ctx.rotate(rot)
      ctx.shadowColor = p.color
      ctx.shadowBlur = 10

      if (p.playerType === 'laser') {
        const laserHalfWidth = Math.max(3, half * 0.35)
        const laserLength = Math.max(16, p.h * 2.4)
        ctx.fillStyle = p.color
        ctx.fillRect(-laserHalfWidth, -laserLength / 2, laserHalfWidth * 2, laserLength)
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(-1, -laserLength / 2 + 2, 2, laserLength - 4)
      } else if (p.playerType === 'missile') {
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.moveTo(0, -10)
        ctx.lineTo(6, 7)
        ctx.lineTo(-6, 7)
        ctx.closePath()
        ctx.fill()
      } else if (p.playerType === 'chainsaw') {
        ctx.strokeStyle = p.color
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.arc(0, 0, half, 0, Math.PI * 2)
        ctx.stroke()
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI * 2 * i) / 6
          ctx.beginPath()
          ctx.moveTo(Math.cos(a) * (half - 1), Math.sin(a) * (half - 1))
          ctx.lineTo(Math.cos(a) * (half + 2), Math.sin(a) * (half + 2))
          ctx.stroke()
        }
      } else {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, half + 2)
        grad.addColorStop(0, '#FFF')
        grad.addColorStop(0.5, p.color)
        grad.addColorStop(1, p.color)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(0, 0, half, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    ctx.restore()
  }, [])

  // Draw power-up
  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, p: PowerUp, frame: number) => {
    const cx = p.x + p.w / 2
    const cy = p.y + p.h / 2
    const pulse = 1 + Math.sin(frame * 0.1) * 0.08
    const colors: Record<PowerUp['type'], string> = {
      shield: '#60A5FA',
      double: '#F59E0B',
      slowmo: '#A78BFA',
      magnet: '#22D3EE',
      reflect: '#7DD3FC',
      kraken: '#F472B6',
      health: '#F87171',
      weapon: '#FBBF24',
      fish: '#38BDF8',
    }
    const color = colors[p.type]

    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(pulse, pulse)

    // Minimal coin-like base
    ctx.beginPath()
    ctx.arc(0, 0, p.w * 0.52, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(5,5,5,0.88)'
    ctx.fill()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.strokeStyle = '#F8FAFC'
    ctx.fillStyle = 'rgba(248,250,252,0.95)'
    ctx.lineWidth = 2.4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    switch (p.type) {
      case 'shield':
        ctx.beginPath()
        ctx.moveTo(0, -8)
        ctx.lineTo(7, -4)
        ctx.lineTo(5, 6)
        ctx.lineTo(0, 10)
        ctx.lineTo(-5, 6)
        ctx.lineTo(-7, -4)
        ctx.closePath()
        ctx.stroke()
        break
      case 'double':
        ctx.beginPath()
        ctx.moveTo(-6, -6)
        ctx.lineTo(-1, -2)
        ctx.moveTo(-6, 3)
        ctx.lineTo(-1, 7)
        ctx.moveTo(2, -6)
        ctx.lineTo(7, -2)
        ctx.moveTo(2, 3)
        ctx.lineTo(7, 7)
        ctx.stroke()
        break
      case 'slowmo':
        ctx.beginPath()
        ctx.moveTo(-7, 0)
        ctx.lineTo(3, 0)
        ctx.lineTo(-1, -4)
        ctx.moveTo(3, 0)
        ctx.lineTo(-1, 4)
        ctx.stroke()
        break
      case 'magnet':
        ctx.beginPath()
        ctx.moveTo(-7, -6)
        ctx.lineTo(-7, 4)
        ctx.quadraticCurveTo(-7, 8, -3, 8)
        ctx.lineTo(-1, 8)
        ctx.moveTo(7, -6)
        ctx.lineTo(7, 4)
        ctx.quadraticCurveTo(7, 8, 3, 8)
        ctx.lineTo(1, 8)
        ctx.stroke()
        break
      case 'reflect':
        ctx.beginPath()
        ctx.moveTo(0, -8)
        ctx.lineTo(7, -3)
        ctx.lineTo(5, 6)
        ctx.lineTo(0, 10)
        ctx.lineTo(-5, 6)
        ctx.lineTo(-7, -3)
        ctx.closePath()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-3, 2)
        ctx.lineTo(0, -2)
        ctx.lineTo(3, 2)
        ctx.stroke()
        break
      case 'kraken':
        ctx.beginPath()
        ctx.arc(0, -2, 4, 0, Math.PI * 2)
        ctx.stroke()
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath()
          ctx.moveTo(i * 2.5, 2)
          ctx.quadraticCurveTo(i * 3, 7, i * 2, 9)
          ctx.stroke()
        }
        break
      case 'health':
        ctx.beginPath()
        ctx.moveTo(0, -7)
        ctx.lineTo(0, 7)
        ctx.moveTo(-7, 0)
        ctx.lineTo(7, 0)
        ctx.stroke()
        break
      case 'weapon':
        ctx.beginPath()
        ctx.arc(0, 0, 6, 0, Math.PI * 2)
        ctx.moveTo(-9, 0)
        ctx.lineTo(-4, 0)
        ctx.moveTo(4, 0)
        ctx.lineTo(9, 0)
        ctx.moveTo(0, -9)
        ctx.lineTo(0, -4)
        ctx.moveTo(0, 4)
        ctx.lineTo(0, 9)
        ctx.stroke()
        break
      case 'fish':
        ctx.beginPath()
        ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2)
        ctx.moveTo(6, 0)
        ctx.lineTo(10, -3)
        ctx.lineTo(10, 3)
        ctx.closePath()
        ctx.fill()
        break
    }

    ctx.restore()
  }, [])

  const spawnExplosion = useCallback((x: number, y: number, color: string, intensity: number) => {
    const particles: ExplosionParticle[] = []
    const count = Math.max(10, Math.floor(intensity))
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 50 + Math.random() * (120 + intensity * 2)
      const life = 0.25 + Math.random() * 0.45
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: 2 + Math.random() * 4,
        life,
        maxLife: life,
        color,
      })
    }
    explosionsRef.current.push(...particles)
  }, [])

  const updateAndDrawExplosions = useCallback((ctx: CanvasRenderingContext2D, dt: number) => {
    explosionsRef.current = explosionsRef.current.filter((p) => {
      p.life -= dt
      if (p.life <= 0) return false
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vx *= 0.97
      p.vy = p.vy * 0.97 + 44 * dt
      return true
    })

    explosionsRef.current.forEach((p) => {
      const alpha = p.life / p.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * alpha + 0.6, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
  }, [])

  const spawnFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    floatingTextsRef.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 18,
      vy: -35 - Math.random() * 28,
      life: 0.85,
      maxLife: 0.85,
      text,
      color,
    })
  }, [])

  const spawnMuzzleFlash = useCallback((x: number, y: number, color: string) => {
    muzzleFlashesRef.current.push({
      x,
      y,
      size: 16 + Math.random() * 10,
      life: 0.12,
      maxLife: 0.12,
      color,
    })
  }, [])

  const updateAndDrawFeedback = useCallback((ctx: CanvasRenderingContext2D, dt: number) => {
    muzzleFlashesRef.current = muzzleFlashesRef.current.filter((flash) => {
      flash.life -= dt
      if (flash.life <= 0) return false
      const alpha = flash.life / flash.maxLife
      const radius = flash.size * (1 + (1 - alpha) * 0.35)
      const grad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, radius)
      grad.addColorStop(0, 'rgba(255,255,255,0.95)')
      grad.addColorStop(0.5, flash.color)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.globalAlpha = alpha
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(flash.x, flash.y, radius, 0, Math.PI * 2)
      ctx.fill()
      return true
    })

    floatingTextsRef.current = floatingTextsRef.current.filter((item) => {
      item.life -= dt
      if (item.life <= 0) return false
      item.x += item.vx * dt
      item.y += item.vy * dt
      item.vx *= 0.96
      return true
    })

    floatingTextsRef.current.forEach((item) => {
      const alpha = item.life / item.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = item.color
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(item.text, item.x, item.y)
    })

    ctx.globalAlpha = 1
  }, [])

  const resolveMugOverlaps = useCallback(() => {
      const enemies = enemiesRef.current
      for (let i = 0; i < enemies.length; i++) {
        const a = enemies[i]
        for (let j = i + 1; j < enemies.length; j++) {
          const b = enemies[j]
        const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
        const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
        if (overlapX > 0 && overlapY > 0) {
          if (overlapX < overlapY) {
            const push = overlapX / 2 + 0.5
            if (a.x < b.x) {
              a.x -= push
              b.x += push
            } else {
              a.x += push
              b.x -= push
            }
          } else {
            const push = overlapY / 2 + 0.5
            if (a.y < b.y) {
              a.y -= push
              b.y += push
            } else {
              a.y += push
              b.y -= push
            }
          }
        }
      }
    }
  }, [])

  const playSynthNote = useCallback((
    ctx: AudioContext,
    destination: GainNode,
    frequency: number,
    waveform: OscillatorType,
    startTime: number,
    duration: number,
    gainValue: number
  ) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = waveform
    osc.frequency.setValueAtTime(frequency, startTime)
    gain.gain.setValueAtTime(0.0001, startTime)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue), startTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
    osc.connect(gain)
    gain.connect(destination)
    osc.start(startTime)
    osc.stop(startTime + duration + 0.02)
  }, [])

  const scheduleMusic = useCallback(() => {
    const ctx = audioContextRef.current
    const master = audioMasterRef.current
    if (!ctx || !master) return

    const horizon = ctx.currentTime + 0.25
    while (audioNextTimeRef.current < horizon) {
      const nowMs = Date.now()
      if (audioLastSwitchRef.current === 0) audioLastSwitchRef.current = nowMs
      if (nowMs - audioLastSwitchRef.current > MUSIC_TRACK_SWITCH_MS) {
        const nextIndex = audioTrackIndexRef.current + 1
        if (nextIndex >= audioTracksRef.current.length) {
          audioTrackGenerationRef.current += 1
          audioTracksRef.current = generateAudioTracks(audioTrackGenerationRef.current)
          audioTrackIndexRef.current = 0
        } else {
          audioTrackIndexRef.current = nextIndex
        }
        audioStepRef.current = 0
        audioLastSwitchRef.current = nowMs
      }

      const track = audioTracksRef.current[audioTrackIndexRef.current]
      const step = audioStepRef.current
      const beatDuration = 60 / track.tempo / 2
      const bassNote = track.bass[step % track.bass.length]
      const leadNote = track.lead[step % track.lead.length]
      const arpNote = track.arp[step % track.arp.length]
      const barPulse = step % 8 === 0 ? track.punch : 1

      if (bassNote !== null) {
        playSynthNote(ctx, master, midiToFrequency(bassNote), 'triangle', audioNextTimeRef.current, beatDuration * 0.95, 0.07 * barPulse)
      }
      if (leadNote !== null && step % 2 === 0) {
        playSynthNote(ctx, master, midiToFrequency(leadNote), 'sawtooth', audioNextTimeRef.current, beatDuration * 0.85, 0.045 * barPulse)
      }
      if (arpNote !== null) {
        playSynthNote(ctx, master, midiToFrequency(arpNote), 'square', audioNextTimeRef.current, beatDuration * 0.7, 0.026 * barPulse)
      }
      if (step % 4 === 0) {
        playSynthNote(ctx, master, 62, 'sine', audioNextTimeRef.current, beatDuration * 0.32, 0.075 * barPulse)
      }

      audioStepRef.current += 1
      audioNextTimeRef.current += beatDuration
    }
  }, [playSynthNote])

  // Spawn enemies and check boss timer
  const spawnEnemies = useCallback((dt: number) => {
    spawnTimerRef.current += dt
    if (spawnTimerRef.current > 0.8) { // Spawn every 0.8 seconds
      spawnTimerRef.current = 0
      const { w } = size
      const roll = Math.random()
      const type = roll < 0.34 ? 2 : roll < 0.67 ? 1 : 0
      const ew = Math.max(24, Math.round(42 * BEER_MUG_SIZE_MULTIPLIER))
      const eh = Math.max(30, Math.round(52 * BEER_MUG_SIZE_MULTIPLIER))
      const hp = 1
      const pts = 10 + type * 10
      let placed = false
      for (let attempts = 0; attempts < 12; attempts++) {
        const spawnX = Math.random() * (w - ew - 20) + 10
        const spawnY = -eh - 10 - attempts * 8
        const hasOverlap = enemiesRef.current.some((existing) => {
          const pad = 8
          return (
            spawnX < existing.x + existing.w + pad &&
            spawnX + ew + pad > existing.x &&
            spawnY < existing.y + existing.h + pad &&
            spawnY + eh + pad > existing.y
          )
        })
        if (!hasOverlap) {
          enemiesRef.current.push({
            x: spawnX,
            y: spawnY,
            w: ew,
            h: eh,
            hp,
            maxHp: hp,
            pts,
            type,
            frame: 0
          })
          placed = true
          break
        }
      }
      if (!placed) {
        enemiesRef.current.push({
          x: Math.random() * (w - ew - 20) + 10,
          y: -eh - 16,
          w: ew,
          h: eh,
          hp,
          maxHp: hp,
          pts,
          type,
          frame: 0
        })
      }
    }
    
    // Check boss spawn (every 60 seconds)
    const now = Date.now()
    if (!bossRef.current && now - bossSpawnTimeRef.current > BOSS_INTERVAL) {
      bossSpawnTimeRef.current = now
      const bossLevel = Math.floor(metersRef.current / 5000) + 1
      const bossVariantPool = BOSS_VARIANTS_KIMI_FULL.length > 0 ? BOSS_VARIANTS_KIMI_FULL : BOSS_VARIANTS
      const bossVariant = bossVariantPool[(bossLevel - 1) % bossVariantPool.length]
      const bw = 120 + bossLevel * 10
      const bh = 140 + bossLevel * 10
      const baseBossHp = 300 + bossLevel * 150
      const scaledBossHp = Math.floor(baseBossHp * BOSS_HP_MULTIPLIER)
      bossRef.current = {
        x: size.w / 2 - bw / 2,
        y: -bh - 20,
        w: bw,
        h: bh,
        hp: scaledBossHp,
        maxHp: scaledBossHp,
        frame: 0,
        phase: 1,
        level: bossLevel,
        attackTimer: 0,
        attackMode: 0,
        name: bossVariant.name,
        nameRu: bossVariant.nameRu,
        bottleType: bossVariant.bottleType,
        textureIndex: bossVariant.textureIndex,
      }
    }
  }, [size])

  // Try to drop weapon from enemy/boss
  const tryDropWeapon = useCallback((isBoss: boolean) => {
    const chance = isBoss ? BOSS_WEAPON_DROP_CHANCE : WEAPON_DROP_CHANCE
    if (Math.random() > chance) return
    
    const lockedWeapons = weapons.filter(w => !w.unlocked)
    if (lockedWeapons.length === 0) return
    
    const randomWeapon = lockedWeapons[Math.floor(Math.random() * lockedWeapons.length)]
    dropWeapon(randomWeapon.id)
  }, [weapons, dropWeapon])

  const ensureAudioGraph = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!audioContextRef.current) {
      const ctx = new window.AudioContext()
      const master = ctx.createGain()
      const compressor = ctx.createDynamicsCompressor()
      compressor.threshold.value = -22
      compressor.knee.value = 18
      compressor.ratio.value = 4
      compressor.attack.value = 0.003
      compressor.release.value = 0.22
      master.gain.value = 0.0001
      master.connect(compressor)
      compressor.connect(ctx.destination)
      audioContextRef.current = ctx
      audioMasterRef.current = master
      audioCompressorRef.current = compressor
      audioNextTimeRef.current = ctx.currentTime + 0.1
      audioStepRef.current = 0
      audioTrackIndexRef.current = 0
      audioTrackGenerationRef.current = 0
      audioTracksRef.current = generateAudioTracks(0)
      audioLastSwitchRef.current = Date.now()
    }
    if (!audioContextRef.current || !audioMasterRef.current) return null
    return {
      context: audioContextRef.current,
      master: audioMasterRef.current
    }
  }, [])

  const unlockAudio = useCallback(() => {
    if (!SYNTH_AUDIO_ENABLED) return
    if (audioUnlockedRef.current) return
    const graph = ensureAudioGraph()
    if (!graph) return
    void graph.context.resume().then(() => {
      audioUnlockedRef.current = graph.context.state === 'running'
    }).catch(() => {
      // Ignore resume errors from browsers that block autoplay.
    })
  }, [ensureAudioGraph])

  useEffect(() => {
    if (!SYNTH_AUDIO_ENABLED) return
    const handleFirstInteraction = () => {
      unlockAudio()
    }
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true })
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true })
    window.addEventListener('keydown', handleFirstInteraction)
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [unlockAudio])

  useEffect(() => {
    if (!SYNTH_AUDIO_ENABLED) return
    if (!isPlaying) {
      if (audioTickTimerRef.current !== null) {
        window.clearInterval(audioTickTimerRef.current)
        audioTickTimerRef.current = null
      }
      return
    }
    if (!audioUnlockedRef.current) return

    const graph = ensureAudioGraph()
    if (!graph) return
    const audioContext = graph.context
    const master = graph.master

    if (!isPaused) {
      void audioContext.resume()
      audioUnlockedRef.current = audioContext.state === 'running'
      const gain = Math.max(0, Math.min(1, musicVolume)) * 0.22
      master.gain.setTargetAtTime(gain, audioContext.currentTime, 0.08)
      if (audioTickTimerRef.current === null) {
        audioTickTimerRef.current = window.setInterval(() => {
          scheduleMusic()
        }, 70)
      }
    } else {
      master.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.06)
      if (audioTickTimerRef.current !== null) {
        window.clearInterval(audioTickTimerRef.current)
        audioTickTimerRef.current = null
      }
    }
  }, [isPlaying, isPaused, musicVolume, scheduleMusic, ensureAudioGraph])

  useEffect(() => {
    return () => {
      if (audioTickTimerRef.current !== null) {
        window.clearInterval(audioTickTimerRef.current)
        audioTickTimerRef.current = null
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close()
      }
      audioContextRef.current = null
      audioMasterRef.current = null
      audioCompressorRef.current = null
      audioUnlockedRef.current = false
    }
  }, [])

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Reset timers when game starts
    if (isPlaying && !isPaused) {
      if (bossSpawnTimeRef.current === 0) {
        bossSpawnTimeRef.current = Date.now()
      }
    }
    
    const gameLoop = (timestamp: number) => {
      // Still render background when paused/not playing
      const { w, h } = size
      if (w === 0 || h === 0) {
        frameRef.current = requestAnimationFrame(gameLoop)
        return
      }
      
      // Clear and draw background
      ctx.fillStyle = C.bg
      ctx.fillRect(0, 0, w, h)
      
      // Always draw stars
      starsRef.current.forEach(star => {
        if (isPlaying && !isPaused) {
          star.y += star.speed * 0.016
          if (star.y > h) { star.y = 0; star.x = Math.random() * w }
        }
        ctx.fillStyle = `rgba(255,255,255,${0.3 + star.size * 0.2})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      const player = playerRef.current
      
      // Only run game logic when playing and not paused
      if (!isPlaying || isPaused) {
        // Just draw the cat even when paused
        player.frame++
        updateAndDrawExplosions(ctx, 0)
        updateAndDrawFeedback(ctx, 0)
        drawCat(ctx, player.x, player.y, player.frame, hasShield)
        frameRef.current = requestAnimationFrame(gameLoop)
        return
      }
      
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
      const simDt = dt * GAME_SPEED_MULTIPLIER
      const enemyTimeFactor = hasTimeWarp ? 0.64 : 1
      lastTimeRef.current = timestamp
      player.frame++
      
      // Update meters
      const metersGained = 50 * simDt * (hasSpeedBoost ? 1.5 : 1)
      metersRef.current += metersGained
      addMeters(metersGained)
      checkLevelUp()
      
      // Spawn enemies
      spawnEnemies(simDt)
      
      // Update player position (touch)
      if (touchRef.current !== null) {
        const targetX = touchRef.current - PLAYER_ANCHOR_X
        const followLerp = Math.min(0.32, 0.15 * GAME_SPEED_MULTIPLIER)
        player.x += (targetX - player.x) * followLerp
      }
      let playerCenterX = player.x + PLAYER_CORE_X
      const minCenterX = PLAYER_HITBOX_W / 2 + 8
      const maxCenterX = w - PLAYER_HITBOX_W / 2 - 8
      playerCenterX = Math.max(minCenterX, Math.min(maxCenterX, playerCenterX))
      player.x = playerCenterX - PLAYER_CORE_X
      
      // Fire projectiles
      const weaponFireRateBase = weapon.id === 'beer' ? weapon.fireRate : weapon.fireRate * GAME_SPEED_MULTIPLIER
      const fireRate = weaponFireRateBase * (hasSpeedBoost ? 1.5 : 1)
      const fireInterval = 1000 / fireRate
      if (timestamp - lastFireRef.current > fireInterval) {
        lastFireRef.current = timestamp
        const hasPlayerSprite = Boolean(playerSpriteRef.current)
        const visualFireY = hasPlayerSprite ? PLAYER_ANCHOR_Y + 18 : PLAYER_CORE_Y + 8
        const fireOriginX = player.x + PLAYER_CORE_X
        const fireOriginY = player.y + visualFireY
        const barrelAngleOffsets = hasDoubleShot ? [-0.05, 0.05] : [0]
        const krakenBonusProjectiles = hasKraken ? 1 : 0

        const spawnPlayerProjectile = (
          originX: number,
          originY: number,
          angle: number,
          speed: number,
          damage: number,
          size: number,
          playerType: string,
          rotation = 0,
          pierceLeft = 0
        ) => {
          projectilesRef.current.push({
            x: originX - size / 2,
            y: originY - size / 2,
            w: size,
            h: size,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            dmg: damage,
            enemy: false,
            color: weapon.color,
            playerType,
            rotation,
            life: 1,
            justSpawned: true,
            pierceLeft,
          })
        }

        barrelAngleOffsets.forEach((barrelAngle) => {
          const originX = fireOriginX
          const originY = fireOriginY

          switch (weapon.id) {
            case 'spread': {
              const spreadAngles = [-0.22, 0, 0.22]
              spreadAngles.forEach((off) => {
                spawnPlayerProjectile(originX, originY, -Math.PI / 2 + off + barrelAngle, weapon.projectileSpeed * 0.95, weapon.damage, 12, 'spread')
              })
              if (krakenBonusProjectiles > 0) {
                spawnPlayerProjectile(originX, originY, -Math.PI / 2 + barrelAngle, weapon.projectileSpeed, weapon.damage * 1.1, 13, 'spread')
              }
              break
            }
            case 'laser': {
              spawnPlayerProjectile(originX, originY, -Math.PI / 2 + barrelAngle, weapon.projectileSpeed * 1.35, weapon.damage * 1.35, 12, 'laser')
              break
            }
            case 'chainsaw': {
              spawnPlayerProjectile(originX, originY, -Math.PI / 2 + barrelAngle, weapon.projectileSpeed * 1.12, weapon.damage, 14, 'chainsaw', 0, 2)
              break
            }
            case 'missile': {
              spawnPlayerProjectile(originX, originY, -Math.PI / 2 + barrelAngle, weapon.projectileSpeed * 0.95, weapon.damage * 1.15, 14, 'missile')
              break
            }
            case 'paw': {
              const chaosOffset = (Math.random() - 0.5) * 0.22
              spawnPlayerProjectile(originX, originY, -Math.PI / 2 + chaosOffset + barrelAngle, weapon.projectileSpeed, weapon.damage, 13, 'paw', (Math.random() - 0.5) * 0.7)
              if (krakenBonusProjectiles > 0) {
                spawnPlayerProjectile(originX, originY, -Math.PI / 2 - chaosOffset + barrelAngle, weapon.projectileSpeed * 0.92, weapon.damage * 0.9, 11, 'paw')
              }
              break
            }
            case 'beer': {
              spawnPlayerProjectile(originX, originY, -Math.PI / 2 + barrelAngle, weapon.projectileSpeed * 0.82, weapon.damage, 16, 'beer')
              break
            }
            case 'ice': {
              spawnPlayerProjectile(originX, originY, -Math.PI / 2 + barrelAngle, weapon.projectileSpeed, weapon.damage, 13, 'ice')
              break
            }
            case 'standard':
            default: {
              const count = 1 + krakenBonusProjectiles
              for (let i = 0; i < count; i++) {
                const off = (i - (count - 1) / 2) * 0.08
                spawnPlayerProjectile(originX, originY, -Math.PI / 2 + off + barrelAngle, weapon.projectileSpeed, weapon.damage, 13, 'standard')
              }
              break
            }
          }
        })

        spawnMuzzleFlash(fireOriginX, fireOriginY, weapon.color)
      }
      
      // Update projectiles
      projectilesRef.current = projectilesRef.current.filter(p => {
        if (p.life !== undefined && p.life <= 0) return false

        if (p.justSpawned) {
          p.justSpawned = false
          return true
        }

        if (!p.enemy) {
          if (p.playerType === 'missile' && bossRef.current) {
            const targetX = bossRef.current.x + bossRef.current.w / 2
            const targetY = bossRef.current.y + bossRef.current.h * 0.55
            const dx = targetX - (p.x + p.w / 2)
            const dy = targetY - (p.y + p.h / 2)
            const dist = Math.hypot(dx, dy)
            if (dist > 0.0001) {
              const targetSpeed = weapon.projectileSpeed
              const tvx = (dx / dist) * targetSpeed
              const tvy = (dy / dist) * targetSpeed
              p.vx += (tvx - p.vx) * 0.08
              p.vy += (tvy - p.vy) * 0.08
              p.rotation = Math.atan2(p.vy, p.vx)
            }
          }

          if (p.playerType === 'chainsaw') {
            p.rotation = (p.rotation ?? 0) + 0.25
          }

          if (p.playerType === 'beer') {
            let cleared = 0
            projectilesRef.current.forEach((other) => {
              if (!other.enemy || other === p) return
              if (cleared >= 2) return
              const dx = (p.x + p.w / 2) - (other.x + other.w / 2)
              const dy = (p.y + p.h / 2) - (other.y + other.h / 2)
              const dist = Math.hypot(dx, dy)
              if (dist < 56) {
                other.life = 0
                cleared += 1
              }
            })
            if (cleared > 0 && frameRef.current % 3 === 0) {
              spawnExplosion(p.x + p.w / 2, p.y + p.h / 2, '#00AA00', 12)
            }
          }

          if (p.playerType === 'ice') {
            projectilesRef.current.forEach((other) => {
              if (!other.enemy || other === p) return
              const dx = (p.x + p.w / 2) - (other.x + other.w / 2)
              const dy = (p.y + p.h / 2) - (other.y + other.h / 2)
              const dist = Math.hypot(dx, dy)
              if (dist < 48) {
                other.vx *= 0.35
                other.vy *= 0.35
              }
            })
          }
        }

        const projectileTimeFactor = p.enemy ? enemyTimeFactor : 1
        p.x += p.vx * simDt * projectileTimeFactor
        p.y += p.vy * simDt * projectileTimeFactor
        return p.y > -20 && p.y < h + 20 && p.x > -20 && p.x < w + 20
      })
      
      // Update enemies
      enemiesRef.current = enemiesRef.current.filter(e => {
        const fallSpeed = (100 + e.type * 30) * enemyTimeFactor
        e.y += fallSpeed * simDt
        e.frame++

        return e.y < h + 50 && e.hp > 0
      })
      resolveMugOverlaps()
      
      // Update boss
      const boss = bossRef.current
        if (boss) {
          boss.frame++
          if (boss.y < 50) {
          boss.y += 80 * simDt * enemyTimeFactor
          } else {
            // Boss movement with soft bounds
          boss.x += Math.sin(boss.frame * 0.022 + boss.level) * (2.4 + boss.phase * 0.35) * enemyTimeFactor
          boss.x = Math.max(12, Math.min(w - boss.w - 12, boss.x))
          boss.attackTimer += simDt * enemyTimeFactor

          const attackInterval = (boss.phase > 1 ? 1.18 : 1.65) / BOSS_ATTACK_SPEED_MULTIPLIER
          if (boss.attackTimer >= attackInterval) {
            boss.attackTimer = 0
            boss.attackMode = ((boss.attackMode + 1) % 3) as 0 | 1 | 2
            const bottleProjectileColor =
              boss.bottleType === 'lager' ? '#F59E0B' : boss.bottleType === 'stout' ? '#7C2D12' : '#22D3EE'

            if (boss.attackMode === 0) {
              const count = boss.phase > 1 ? 7 : 5
              for (let i = 0; i < count; i++) {
                const spread = (i - (count - 1) / 2) * 0.18
                projectilesRef.current.push({
                  x: boss.x + boss.w / 2 - 7,
                  y: boss.y + boss.h * 0.55,
                  w: 14,
                  h: 14,
                  vx: Math.sin(spread) * 190,
                  vy: 230 + Math.cos(spread) * 20,
                  dmg: Math.ceil((12 + boss.level * 3) * BOSS_DAMAGE_MULTIPLIER),
                  enemy: true,
                  color: bottleProjectileColor,
                  projectileType: boss.bottleType,
                })
              }
            } else if (boss.attackMode === 1) {
              const ringCount = boss.phase > 1 ? 10 : 8
              for (let i = 0; i < ringCount; i++) {
                const angle = (Math.PI * 2 * i) / ringCount
                projectilesRef.current.push({
                  x: boss.x + boss.w / 2 - 6,
                  y: boss.y + boss.h / 2 - 6,
                  w: 12,
                  h: 12,
                  vx: Math.cos(angle) * 165,
                  vy: Math.sin(angle) * 165 + 110,
                  dmg: Math.ceil((11 + boss.level * 2) * BOSS_DAMAGE_MULTIPLIER),
                  enemy: true,
                  color: bottleProjectileColor,
                  projectileType: boss.bottleType,
                })
              }
            } else {
              const playerCenterX = player.x + PLAYER_CORE_X
              const playerCenterY = player.y + PLAYER_CORE_Y
              const bossCenterX = boss.x + boss.w / 2
              const bossCenterY = boss.y + boss.h * 0.6
              const baseAngle = Math.atan2(playerCenterY - bossCenterY, playerCenterX - bossCenterX)
              const offsets = [-0.12, 0, 0.12]
              offsets.forEach((off) => {
                const ang = baseAngle + off
                projectilesRef.current.push({
                  x: bossCenterX - 6,
                  y: bossCenterY - 6,
                  w: 12,
                  h: 12,
                  vx: Math.cos(ang) * 280,
                  vy: Math.sin(ang) * 280,
                  dmg: Math.ceil((14 + boss.level * 3) * BOSS_DAMAGE_MULTIPLIER),
                  enemy: true,
                  color: bottleProjectileColor,
                  projectileType: boss.bottleType,
                })
              })
            }
          }
        }
        if (boss.hp < boss.maxHp * 0.5 && boss.phase === 1) {
          boss.phase = 2
        }
      }
      
      const clearEnemyProjectilesInRadius = (x: number, y: number, radius: number, maxClear = Number.POSITIVE_INFINITY) => {
        let cleared = 0
        const radiusSq = radius * radius
        projectilesRef.current.forEach((other) => {
          if (!other.enemy) return
          if (cleared >= maxClear) return
          if ((other.life ?? 1) <= 0) return
          const dx = x - (other.x + other.w / 2)
          const dy = y - (other.y + other.h / 2)
          if (dx * dx + dy * dy <= radiusSq) {
            other.life = 0
            cleared += 1
          }
        })
        return cleared
      }

      const applyFoamPulse = (x: number, y: number) => {
        const radiusSq = 74 * 74
        let slowed = 0
        projectilesRef.current.forEach((other) => {
          if (!other.enemy) return
          const dx = x - (other.x + other.w / 2)
          const dy = y - (other.y + other.h / 2)
          if (dx * dx + dy * dy <= radiusSq) {
            other.vx *= 0.62
            other.vy *= 0.62
            slowed += 1
          }
        })
        if (slowed > 0) {
          spawnExplosion(x, y, '#FDE68A', 14)
        }
      }

      const applyChainsawHit = (x: number, y: number) => {
        const cleared = clearEnemyProjectilesInRadius(x, y, 54, 2)
        if (cleared > 0) {
          spawnExplosion(x, y, '#F59E0B', 12)
        }
      }

      const applyBeerImpact = (x: number, y: number) => {
        const cleared = clearEnemyProjectilesInRadius(x, y, 90)
        if (cleared > 0) {
          spawnExplosion(x, y, '#F59E0B', 22)
        }
      }

      // Collision: player projectiles vs enemies
      projectilesRef.current = projectilesRef.current.filter(p => {
        if (p.enemy) return true
        
        for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
          const e = enemiesRef.current[i]
          if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
            const hitX = e.x + e.w / 2
            const hitY = e.y + e.h / 2

            if (p.playerType === 'spread') {
              applyFoamPulse(hitX, hitY)
            } else if (p.playerType === 'chainsaw') {
              applyChainsawHit(hitX, hitY)
            } else if (p.playerType === 'beer') {
              applyBeerImpact(hitX, hitY)
            }

            e.hp -= p.dmg
            if (e.hp <= 0) {
              addScore(e.pts)
              addCoins(1)
              spawnFloatingText(e.x + e.w / 2, e.y + e.h / 2 - 8, '+1', '#FCD34D')
              spawnExplosion(e.x + e.w / 2, e.y + e.h / 2, '#F59E0B', 18)
              tryDropWeapon(false)
              // Power-up drop
              if (Math.random() < 0.2) {
                const types: PowerUp['type'][] = ['shield', 'double', 'slowmo', 'magnet', 'reflect', 'kraken', 'health', 'fish']
                const powerUpSize = Math.max(24, Math.round(24 * POWER_UP_SIZE_MULTIPLIER))
                powerUpsRef.current.push({
                  x: e.x + e.w / 2 - powerUpSize / 2,
                  y: e.y,
                  w: powerUpSize,
                  h: powerUpSize,
                  type: types[Math.floor(Math.random() * types.length)]
                })
              }
              enemiesRef.current.splice(i, 1)
            }

            if (p.playerType === 'chainsaw' && (p.pierceLeft ?? 0) > 0) {
              p.pierceLeft = (p.pierceLeft ?? 0) - 1
              p.y = e.y - p.h - 2
              p.x += p.vx * simDt * 0.25
              return true
            }

            return false
          }
        }
        
        // Check boss hit
        if (boss && p.x < boss.x + boss.w && p.x + p.w > boss.x && p.y < boss.y + boss.h && p.y + p.h > boss.y) {
          const hitX = p.x + p.w / 2
          const hitY = p.y + p.h / 2
          if (p.playerType === 'spread') {
            applyFoamPulse(hitX, hitY)
          } else if (p.playerType === 'chainsaw') {
            applyChainsawHit(hitX, hitY)
          } else if (p.playerType === 'beer') {
            applyBeerImpact(hitX, hitY)
          }

          const bossDamageMultiplier = hasKraken ? 1.6 : 1
          boss.hp -= p.dmg * bossDamageMultiplier
          if (boss.hp <= 0) {
            const bossScore = 500 + boss.level * 200
            const bossCoins = 10 + boss.level * 2
            addScore(bossScore)
            addCoins(bossCoins)
            spawnFloatingText(boss.x + boss.w / 2, boss.y + boss.h / 2 - 12, `+${bossCoins}`, '#FBBF24')
            defeatBoss()
            tryDropWeapon(true)
            spawnExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#EF4444', 72)
            bossRef.current = null
          }

          if (bossRef.current && p.playerType === 'chainsaw' && (p.pierceLeft ?? 0) > 0) {
            p.pierceLeft = (p.pierceLeft ?? 0) - 1
            p.y = boss.y - p.h - 2
            p.x += p.vx * simDt * 0.25
            return true
          }

          return false
        }
        
        return true
      })
      
      // Collision: enemy projectiles vs player
      const px = player.x, py = player.y
      const playerHitX = px + PLAYER_CORE_X - PLAYER_HITBOX_W / 2
      const playerHitY = py + PLAYER_CORE_Y - PLAYER_HITBOX_H / 2
      projectilesRef.current = projectilesRef.current.filter(p => {
        if (!p.enemy) return true
        if (hasReflector) {
          const playerCenterX = px + PLAYER_CORE_X
          const playerCenterY = py + PLAYER_CORE_Y
          const projectileCenterX = p.x + p.w / 2
          const projectileCenterY = p.y + p.h / 2
          const dist = Math.hypot(projectileCenterX - playerCenterX, projectileCenterY - playerCenterY)
          if (dist < 52) {
            p.enemy = false
            p.vx *= -0.35
            p.vy = -Math.abs(p.vy) - 80
            p.color = '#93C5FD'
            return true
          }
        }
        if (
          p.x < playerHitX + PLAYER_HITBOX_W &&
          p.x + p.w > playerHitX &&
          p.y < playerHitY + PLAYER_HITBOX_H &&
          p.y + p.h > playerHitY
        ) {
          takeDamage(p.dmg)
          return false
        }
        return true
      })
      
      // Collision: enemies vs player
      enemiesRef.current.forEach(e => {
        if (
          e.x < playerHitX + PLAYER_HITBOX_W - 6 &&
          e.x + e.w > playerHitX + 6 &&
          e.y < playerHitY + PLAYER_HITBOX_H - 6 &&
          e.y + e.h > playerHitY + 6
        ) {
          takeDamage(20)
          spawnExplosion(e.x + e.w / 2, e.y + e.h / 2, '#F59E0B', 14)
          e.hp = 0
        }
      })
      
      // Collision: power-ups vs player
      powerUpsRef.current = powerUpsRef.current.filter(p => {
        if (hasMagnet) {
          const playerCenterX = px + PLAYER_CORE_X
          const playerCenterY = py + PLAYER_CORE_Y
          const pickupCenterX = p.x + p.w / 2
          const pickupCenterY = p.y + p.h / 2
          const dx = playerCenterX - pickupCenterX
          const dy = playerCenterY - pickupCenterY
          const dist = Math.hypot(dx, dy)
          if (dist > 0.0001 && dist < 240) {
            const pull = Math.max(90, 460 - dist * 1.2)
            p.x += (dx / dist) * pull * simDt
            p.y += (dy / dist) * pull * simDt
          }
        }
        p.y += 120 * simDt
        if (p.y > h + 30) return false
        
        if (
          p.x < playerHitX + PLAYER_HITBOX_W - 4 &&
          p.x + p.w > playerHitX + 4 &&
          p.y < playerHitY + PLAYER_HITBOX_H - 2 &&
          p.y + p.h > playerHitY + 2
        ) {
          if (p.type === 'health') {
            heal(25)
          } else if (p.type === 'shield') {
            activatePowerUp('shield')
          } else if (p.type === 'double') {
            activatePowerUp('double')
          } else if (p.type === 'slowmo') {
            activatePowerUp('slowmo')
          } else if (p.type === 'magnet') {
            activatePowerUp('magnet')
          } else if (p.type === 'reflect') {
            activatePowerUp('reflect')
          } else if (p.type === 'kraken') {
            activatePowerUp('kraken')
          } else if (p.type === 'fish') {
            addScore(40)
            heal(5)
          }
          return false
        }
        return true
      })
      
      // Update power-up timers
      updatePowerUpTimers(dt)
      
      // Check game over
      if (health <= 0) {
        endGame()
        return
      }
      
      // Draw everything
      // Power-ups
      powerUpsRef.current.forEach(p => drawPowerUp(ctx, p, frameRef.current))
      
      // Enemies
      enemiesRef.current.forEach(e => drawBeerMug(ctx, e))
      
      // Boss
      if (boss) drawBoss(ctx, boss)
      
      // Projectiles
      projectilesRef.current.forEach(p => drawProjectile(ctx, p, frameRef.current))

      // Destroy animations
      updateAndDrawExplosions(ctx, simDt)
      updateAndDrawFeedback(ctx, simDt)
      
      // Player
      drawCat(ctx, player.x, player.y, player.frame, hasShield)
      
      frameRef.current = requestAnimationFrame(gameLoop)
    }
    
    frameRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [isPlaying, isPaused, size, weapon, hasShield, hasDoubleShot, hasTripleShot, hasSpeedBoost, hasMagnet, hasReflector, hasTimeWarp, hasKraken,
      addScore, addMeters, checkLevelUp, takeDamage, heal, activatePowerUp, updatePowerUpTimers, addCoins,
      endGame, defeatBoss, health, spawnEnemies, drawCat, drawBeerMug, drawBoss, drawProjectile,
      drawPowerUp, tryDropWeapon, resolveMugOverlaps, spawnExplosion, updateAndDrawExplosions,
      spawnFloatingText, spawnMuzzleFlash, updateAndDrawFeedback])

  // Touch handlers
  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    unlockAudio()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    touchRef.current = clientX
  }, [unlockAudio])

  const handleTouchEnd = useCallback(() => {
    touchRef.current = null
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={size.w}
      height={size.h}
      className="absolute inset-0 touch-none"
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    />
  )
}

'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGameStore } from '@/lib/store'

// Types
interface Vec2 { x: number; y: number }
interface Entity extends Vec2 { w: number; h: number }
interface Projectile extends Entity { vx: number; vy: number; dmg: number; enemy: boolean }
interface Enemy extends Entity { hp: number; maxHp: number; pts: number; type: number; frame: number }
interface PowerUp extends Entity { type: 'shield' | 'double' | 'speed' | 'health' }
interface Boss extends Entity { hp: number; maxHp: number; frame: number; phase: number; atk: number; level: number }

// Premium color palette
const C = {
  bg: '#0A0A0B',
  bgGrad: '#141416',
  cat: '#F97316',
  catLight: '#FB923C',
  catDark: '#C2410C',
  beer: '#F59E0B',
  beerLight: '#FCD34D',
  beerDark: '#B45309',
  foam: '#FEF3C7',
  gold: '#D4AF37',
  goldLight: '#FFD700',
  shield: '#3B82F6',
  health: '#22C55E',
  pink: '#EC4899',
  pinkLight: '#F472B6',
  red: '#EF4444',
  star: 'rgba(255,255,255,0.4)',
}

// Boss spawn interval - every 5000 meters (about 1 minute)
const BOSS_SPAWN_METERS = 5000

export function GameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const lastFireRef = useRef<number>(0)
  const touchRef = useRef<Vec2 | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastBossMetersRef = useRef(0)
  
  const [size, setSize] = useState({ w: 0, h: 0 })
  
  const store = useGameStore()
  const {
    isPlaying, isPaused, health, addScore, addMeters, checkLevelUp,
    takeDamage, heal, hasShield, hasDoubleShot, hasTripleShot, hasSpeedBoost,
    activatePowerUp, updatePowerUpTimers, weapons, currentWeaponIndex,
    endGame, skins, currentSkinId, musicVolume
  } = store

  // Game state refs
  const playerRef = useRef({ x: 0, y: 0, frame: 0 })
  const projectilesRef = useRef<Projectile[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const bossRef = useRef<Boss | null>(null)
  const spawnTimerRef = useRef(0)
  const metersRef = useRef(0)
  const starsRef = useRef<{x: number; y: number; size: number; speed: number}[]>([])

  const skin = skins.find(s => s.id === currentSkinId) || skins[0]
  const weapon = weapons[currentWeaponIndex]

  // Initialize stars
  useEffect(() => {
    starsRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 100 + 50
    }))
  }, [])

  // Setup audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio/game-music.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = musicVolume
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume
    }
  }, [musicVolume])

  useEffect(() => {
    if (isPlaying && !isPaused && audioRef.current) {
      audioRef.current.play().catch(() => {})
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [isPlaying, isPaused])

  // Resize handler
  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setSize({ w, h })
      playerRef.current.x = w / 2 - 25
      playerRef.current.y = h - 140
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Draw animated cat player
  const drawCat = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, shielded: boolean) => {
    const bounce = Math.sin(frame * 0.12) * 2
    const tailWag = Math.sin(frame * 0.2) * 15
    const earTwitch = Math.sin(frame * 0.15) * 2
    const color = skin.color || C.cat
    const colorLight = color === C.cat ? C.catLight : color
    
    ctx.save()
    
    // Shield effect
    if (shielded) {
      ctx.beginPath()
      ctx.arc(x + 25, y + 28, 45, 0, Math.PI * 2)
      const shieldGrad = ctx.createRadialGradient(x + 25, y + 28, 20, x + 25, y + 28, 45)
      shieldGrad.addColorStop(0, 'rgba(59,130,246,0)')
      shieldGrad.addColorStop(0.7, 'rgba(59,130,246,0.2)')
      shieldGrad.addColorStop(1, 'rgba(59,130,246,0.5)')
      ctx.fillStyle = shieldGrad
      ctx.fill()
      
      // Shield particles
      for (let i = 0; i < 6; i++) {
        const angle = (frame * 0.05 + i * Math.PI / 3) % (Math.PI * 2)
        const px = x + 25 + Math.cos(angle) * 40
        const py = y + 28 + Math.sin(angle) * 40
        ctx.fillStyle = `rgba(147,197,253,${0.5 + Math.sin(frame * 0.1 + i) * 0.3})`
        ctx.beginPath()
        ctx.arc(px, py, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Tail with gradient
    ctx.beginPath()
    ctx.moveTo(x + 25, y + 48)
    ctx.quadraticCurveTo(x + 20 + tailWag, y + 65, x + 15 + tailWag * 0.7, y + 75)
    ctx.strokeStyle = color
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.strokeStyle = colorLight
    ctx.lineWidth = 4
    ctx.stroke()
    
    // Body shadow
    ctx.beginPath()
    ctx.ellipse(x + 27, y + 36 + bounce, 18, 13, 0.1, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fill()
    
    // Body
    ctx.beginPath()
    ctx.ellipse(x + 25, y + 34 + bounce, 18, 14, 0, 0, Math.PI * 2)
    const bodyGrad = ctx.createRadialGradient(x + 20, y + 28 + bounce, 0, x + 25, y + 34 + bounce, 20)
    bodyGrad.addColorStop(0, colorLight)
    bodyGrad.addColorStop(1, color)
    ctx.fillStyle = bodyGrad
    ctx.fill()
    ctx.strokeStyle = C.catDark
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Belly
    ctx.beginPath()
    ctx.ellipse(x + 25, y + 38 + bounce, 10, 8, 0, 0, Math.PI * 2)
    ctx.fillStyle = C.foam
    ctx.fill()
    
    // Head
    ctx.beginPath()
    ctx.ellipse(x + 25, y + 14 + bounce, 15, 12, 0, 0, Math.PI * 2)
    const headGrad = ctx.createRadialGradient(x + 20, y + 10 + bounce, 0, x + 25, y + 14 + bounce, 16)
    headGrad.addColorStop(0, colorLight)
    headGrad.addColorStop(1, color)
    ctx.fillStyle = headGrad
    ctx.fill()
    ctx.strokeStyle = C.catDark
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Ears with animation
    const drawEar = (ex: number, flip: number, twitch: number) => {
      ctx.beginPath()
      ctx.moveTo(ex, y + 10 + bounce)
      ctx.lineTo(ex + flip * 5, y - 4 + bounce + twitch)
      ctx.lineTo(ex + flip * 14, y + 6 + bounce)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = C.catDark
      ctx.lineWidth = 1
      ctx.stroke()
      // Inner ear
      ctx.beginPath()
      ctx.moveTo(ex + flip * 3, y + 8 + bounce)
      ctx.lineTo(ex + flip * 5, y + bounce + twitch)
      ctx.lineTo(ex + flip * 11, y + 6 + bounce)
      ctx.closePath()
      ctx.fillStyle = '#FFB6C1'
      ctx.fill()
    }
    drawEar(x + 12, -1, earTwitch)
    drawEar(x + 38, 1, -earTwitch)
    
    // Eyes with blinking
    const blink = frame % 120 < 5
    const eyeH = blink ? 0.5 : 4
    
    // Eye whites
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.ellipse(x + 18, y + 12 + bounce, 5, eyeH + 1, 0, 0, Math.PI * 2)
    ctx.ellipse(x + 32, y + 12 + bounce, 5, eyeH + 1, 0, 0, Math.PI * 2)
    ctx.fill()
    
    if (!blink) {
      // Iris
      ctx.fillStyle = '#22C55E'
      ctx.beginPath()
      ctx.ellipse(x + 18, y + 12 + bounce, 3, 4, 0, 0, Math.PI * 2)
      ctx.ellipse(x + 32, y + 12 + bounce, 3, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      // Pupil
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.ellipse(x + 18, y + 12 + bounce, 1.5, 3, 0, 0, Math.PI * 2)
      ctx.ellipse(x + 32, y + 12 + bounce, 1.5, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      // Eye shine
      ctx.fillStyle = '#FFF'
      ctx.beginPath()
      ctx.arc(x + 16, y + 10 + bounce, 1.5, 0, Math.PI * 2)
      ctx.arc(x + 30, y + 10 + bounce, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Nose
    ctx.fillStyle = '#FF69B4'
    ctx.beginPath()
    ctx.ellipse(x + 25, y + 18 + bounce, 2.5, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Mouth
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x + 25, y + 20 + bounce)
    ctx.lineTo(x + 25, y + 22 + bounce)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x + 22, y + 23 + bounce, 4, -0.3, Math.PI * 0.4)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x + 28, y + 23 + bounce, 4, Math.PI * 0.6, Math.PI + 0.3)
    ctx.stroke()
    
    // Whiskers
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 3; i++) {
      const wy = y + 17 + i * 2.5 + bounce
      ctx.beginPath()
      ctx.moveTo(x + 10, wy)
      ctx.lineTo(x - 2, wy - 2 + i * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x + 40, wy)
      ctx.lineTo(x + 52, wy - 2 + i * 2)
      ctx.stroke()
    }
    
    // Front paws
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(x + 15, y + 48 + bounce, 5, 4, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(x + 35, y + 48 + bounce, 5, 4, 0.3, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }, [skin.color])

  // Draw beer mug enemy
  const drawBeerMug = useCallback((ctx: CanvasRenderingContext2D, e: Enemy) => {
    const wobble = Math.sin(e.frame * 0.15) * 3
    const { x, y, w, h, type, hp, maxHp } = e
    const scale = 0.85 + type * 0.12
    
    ctx.save()
    ctx.translate(x + w/2, y + h/2)
    ctx.rotate(Math.sin(e.frame * 0.08) * 0.1)
    ctx.scale(scale, scale)
    ctx.translate(-w/2, -h/2)
    
    // Evil aura
    ctx.beginPath()
    ctx.arc(w/2, h/2, w * 0.7, 0, Math.PI * 2)
    const auraGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.7)
    auraGrad.addColorStop(0, 'rgba(239,68,68,0)')
    auraGrad.addColorStop(0.7, `rgba(239,68,68,${0.1 + type * 0.05})`)
    auraGrad.addColorStop(1, 'rgba(239,68,68,0)')
    ctx.fillStyle = auraGrad
    ctx.fill()
    
    // Handle
    ctx.beginPath()
    ctx.moveTo(w - 3, h * 0.25)
    ctx.quadraticCurveTo(w + 14, h * 0.35, w + 14, h * 0.5)
    ctx.quadraticCurveTo(w + 14, h * 0.65, w - 3, h * 0.75)
    ctx.strokeStyle = C.beerDark
    ctx.lineWidth = 7
    ctx.stroke()
    ctx.strokeStyle = C.beer
    ctx.lineWidth = 5
    ctx.stroke()
    
    // Mug body with gradient
    ctx.beginPath()
    ctx.roundRect(3, h * 0.18, w - 8, h * 0.78, 5)
    const mugGrad = ctx.createLinearGradient(0, 0, w, 0)
    mugGrad.addColorStop(0, '#FCD34D')
    mugGrad.addColorStop(0.3, '#F59E0B')
    mugGrad.addColorStop(0.7, '#F59E0B')
    mugGrad.addColorStop(1, '#D97706')
    ctx.fillStyle = mugGrad
    ctx.fill()
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Beer liquid with gradient
    ctx.beginPath()
    ctx.roundRect(6, h * 0.32, w - 14, h * 0.6, 3)
    const beerGrad = ctx.createLinearGradient(0, h * 0.32, 0, h * 0.92)
    beerGrad.addColorStop(0, '#FCD34D')
    beerGrad.addColorStop(0.3, '#F59E0B')
    beerGrad.addColorStop(1, '#B45309')
    ctx.fillStyle = beerGrad
    ctx.fill()
    
    // Foam bubbles
    ctx.fillStyle = C.foam
    const foamPositions = [[8, 0.2], [16, 0.18], [24, 0.2], [w/2, 0.12]]
    foamPositions.forEach(([fx, fy]) => {
      ctx.beginPath()
      ctx.ellipse(fx as number, h * (fy as number) + wobble, 7, 6, 0, 0, Math.PI * 2)
      ctx.fill()
    })
    
    // Evil face
    // Eyes
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(w * 0.3, h * 0.48, 4, 5, 0, 0, Math.PI * 2)
    ctx.ellipse(w * 0.65, h * 0.48, 4, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Red eye glow
    ctx.fillStyle = '#EF4444'
    ctx.beginPath()
    ctx.ellipse(w * 0.3, h * 0.48, 2, 2, 0, 0, Math.PI * 2)
    ctx.ellipse(w * 0.65, h * 0.48, 2, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Evil eyebrows
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(w * 0.18, h * 0.4)
    ctx.lineTo(w * 0.4, h * 0.36)
    ctx.moveTo(w * 0.78, h * 0.4)
    ctx.lineTo(w * 0.55, h * 0.36)
    ctx.stroke()
    
    // Evil grin
    ctx.beginPath()
    ctx.moveTo(w * 0.25, h * 0.65)
    ctx.quadraticCurveTo(w * 0.47, h * 0.78, w * 0.7, h * 0.65)
    ctx.stroke()
    
    // HP indicator (small bar)
    if (hp < maxHp) {
      const hpPercent = hp / maxHp
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(5, h + 4, w - 10, 4)
      ctx.fillStyle = hpPercent > 0.5 ? C.health : hpPercent > 0.25 ? C.beer : C.red
      ctx.fillRect(5, h + 4, (w - 10) * hpPercent, 4)
    }
    
    ctx.restore()
  }, [])

  // Draw boss cat
  const drawBoss = useCallback((ctx: CanvasRenderingContext2D, b: Boss) => {
    const { x, y, w, h, frame, hp, maxHp, phase, level } = b
    const pulse = Math.sin(frame * 0.08) * 8
    const breathe = Math.sin(frame * 0.05) * 3
    const isEnraged = phase > 1
    const color = isEnraged ? '#DC2626' : C.cat
    const colorLight = isEnraged ? '#F87171' : C.catLight
    
    ctx.save()
    
    // Epic aura
    ctx.beginPath()
    ctx.arc(x + w/2, y + h/2, w * 0.75 + pulse, 0, Math.PI * 2)
    const auraGrad = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, w * 0.75 + pulse)
    auraGrad.addColorStop(0, 'rgba(220,38,38,0)')
    auraGrad.addColorStop(0.5, `rgba(220,38,38,${0.15 + phase * 0.1})`)
    auraGrad.addColorStop(0.8, `rgba(220,38,38,${0.3 + phase * 0.15})`)
    auraGrad.addColorStop(1, 'rgba(220,38,38,0)')
    ctx.fillStyle = auraGrad
    ctx.fill()
    
    // Floating particles
    for (let i = 0; i < 8; i++) {
      const angle = (frame * 0.03 + i * Math.PI / 4) % (Math.PI * 2)
      const dist = w * 0.6 + Math.sin(frame * 0.1 + i) * 10
      const px = x + w/2 + Math.cos(angle) * dist
      const py = y + h/2 + Math.sin(angle) * dist
      ctx.fillStyle = `rgba(255,${isEnraged ? 100 : 200},100,${0.4 + Math.sin(frame * 0.1 + i) * 0.3})`
      ctx.beginPath()
      ctx.arc(px, py, 4 + Math.sin(frame * 0.15 + i) * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Tail
    const tailWag = Math.sin(frame * 0.15) * 20
    ctx.beginPath()
    ctx.moveTo(x + w/2, y + h * 0.85)
    ctx.quadraticCurveTo(x + w/2 + tailWag, y + h + 20, x + w/2 + tailWag * 0.6, y + h + 35)
    ctx.strokeStyle = color
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.stroke()
    
    // Body
    ctx.beginPath()
    ctx.ellipse(x + w/2, y + h * 0.62 + breathe, w * 0.38, h * 0.32, 0, 0, Math.PI * 2)
    const bodyGrad = ctx.createRadialGradient(x + w * 0.4, y + h * 0.5, 0, x + w/2, y + h * 0.62, w * 0.4)
    bodyGrad.addColorStop(0, colorLight)
    bodyGrad.addColorStop(1, color)
    ctx.fillStyle = bodyGrad
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Belly
    ctx.beginPath()
    ctx.ellipse(x + w/2, y + h * 0.68 + breathe, w * 0.2, h * 0.18, 0, 0, Math.PI * 2)
    ctx.fillStyle = C.foam
    ctx.fill()
    
    // Head
    ctx.beginPath()
    ctx.ellipse(x + w/2, y + h * 0.3 + breathe, w * 0.32, h * 0.22, 0, 0, Math.PI * 2)
    const headGrad = ctx.createRadialGradient(x + w * 0.4, y + h * 0.22, 0, x + w/2, y + h * 0.3, w * 0.35)
    headGrad.addColorStop(0, colorLight)
    headGrad.addColorStop(1, color)
    ctx.fillStyle = headGrad
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Crown
    const crownY = y + h * 0.08 + breathe
    ctx.fillStyle = C.gold
    ctx.beginPath()
    ctx.moveTo(x + w * 0.25, crownY + 15)
    ctx.lineTo(x + w * 0.28, crownY)
    ctx.lineTo(x + w * 0.38, crownY + 10)
    ctx.lineTo(x + w * 0.5, crownY - 5)
    ctx.lineTo(x + w * 0.62, crownY + 10)
    ctx.lineTo(x + w * 0.72, crownY)
    ctx.lineTo(x + w * 0.75, crownY + 15)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Crown jewels
    ctx.fillStyle = C.red
    ctx.beginPath()
    ctx.arc(x + w * 0.5, crownY + 5, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = C.shield
    ctx.beginPath()
    ctx.arc(x + w * 0.35, crownY + 8, 3, 0, Math.PI * 2)
    ctx.arc(x + w * 0.65, crownY + 8, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // Ears
    const drawBossEar = (ex: number, flip: number) => {
      ctx.beginPath()
      ctx.moveTo(ex, y + h * 0.18 + breathe)
      ctx.lineTo(ex + flip * 8, y + breathe)
      ctx.lineTo(ex + flip * 22, y + h * 0.12 + breathe)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ex + flip * 4, y + h * 0.16 + breathe)
      ctx.lineTo(ex + flip * 8, y + h * 0.05 + breathe)
      ctx.lineTo(ex + flip * 16, y + h * 0.12 + breathe)
      ctx.closePath()
      ctx.fillStyle = '#FFB6C1'
      ctx.fill()
    }
    drawBossEar(x + w * 0.22, -1)
    drawBossEar(x + w * 0.78, 1)
    
    // Evil glowing eyes
    const eyeGlow = Math.sin(frame * 0.15) * 0.3 + 0.7
    ctx.shadowColor = isEnraged ? '#FF0000' : '#DC2626'
    ctx.shadowBlur = 15 + pulse / 2
    ctx.fillStyle = `rgba(${isEnraged ? '255,50,50' : '220,38,38'},${eyeGlow})`
    ctx.beginPath()
    ctx.ellipse(x + w * 0.38, y + h * 0.28 + breathe, 10, 12, 0, 0, Math.PI * 2)
    ctx.ellipse(x + w * 0.62, y + h * 0.28 + breathe, 10, 12, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Pupils
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(x + w * 0.38, y + h * 0.28 + breathe, 4, 8, 0, 0, Math.PI * 2)
    ctx.ellipse(x + w * 0.62, y + h * 0.28 + breathe, 4, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Fangs
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.moveTo(x + w * 0.4, y + h * 0.42 + breathe)
    ctx.lineTo(x + w * 0.38, y + h * 0.52 + breathe)
    ctx.lineTo(x + w * 0.42, y + h * 0.42 + breathe)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x + w * 0.6, y + h * 0.42 + breathe)
    ctx.lineTo(x + w * 0.62, y + h * 0.52 + breathe)
    ctx.lineTo(x + w * 0.58, y + h * 0.42 + breathe)
    ctx.fill()
    
    // Mouth
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + w * 0.35, y + h * 0.4 + breathe)
    ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.48 + breathe, x + w * 0.65, y + h * 0.4 + breathe)
    ctx.stroke()
    
    // Front paws
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(x + w * 0.32, y + h * 0.88, 12, 8, -0.3, 0, Math.PI * 2)
    ctx.ellipse(x + w * 0.68, y + h * 0.88, 12, 8, 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Boss level indicator
    ctx.fillStyle = C.gold
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`LVL ${level}`, x + w/2, y - 30)
    
    // HP bar with glow
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 5
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(x + 10, y - 20, w - 20, 14)
    ctx.shadowBlur = 0
    
    const hpPercent = hp / maxHp
    const hpColor = hpPercent > 0.5 ? C.health : hpPercent > 0.25 ? C.beer : C.red
    const hpGrad = ctx.createLinearGradient(x + 12, 0, x + 12 + (w - 24) * hpPercent, 0)
    hpGrad.addColorStop(0, hpColor)
    hpGrad.addColorStop(1, hpColor === C.health ? '#4ADE80' : hpColor === C.beer ? '#FBBF24' : '#F87171')
    ctx.fillStyle = hpGrad
    ctx.fillRect(x + 12, y - 18, (w - 24) * hpPercent, 10)
    
    // HP text
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 9px sans-serif'
    ctx.fillText(`${Math.ceil(hp)}/${maxHp}`, x + w/2, y - 11)
    
    ctx.restore()
  }, [])

  // Draw projectile
  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, p: Projectile, frame: number) => {
    ctx.save()
    
    if (p.enemy) {
      // Enemy projectile - foam ball
      const grad = ctx.createRadialGradient(p.x + p.w/2, p.y + p.h/2, 0, p.x + p.w/2, p.y + p.h/2, p.w/2)
      grad.addColorStop(0, '#FEF3C7')
      grad.addColorStop(1, '#FDE68A')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#D97706'
      ctx.lineWidth = 1
      ctx.stroke()
    } else {
      // Player projectile - yarn ball with spin
      const spin = frame * 0.3
      ctx.translate(p.x + p.w/2, p.y + p.h/2)
      ctx.rotate(spin)
      
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.w/2)
      grad.addColorStop(0, C.pinkLight)
      grad.addColorStop(1, C.pink)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, p.w/2, 0, Math.PI * 2)
      ctx.fill()
      
      // Yarn pattern
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'
      ctx.lineWidth = 1.5
      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.arc(0, 0, p.w/3, i * Math.PI/2, i * Math.PI/2 + Math.PI/3)
        ctx.stroke()
      }
      
      // Trail effect
      ctx.shadowColor = C.pink
      ctx.shadowBlur = 10
    }
    
    ctx.restore()
  }, [])

  // Draw power-up
  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, pu: PowerUp, frame: number) => {
    const pulse = Math.sin(frame * 0.12) * 4
    const rotate = frame * 0.05
    const { x, y, w, h, type } = pu
    
    ctx.save()
    ctx.translate(x + w/2, y + h/2)
    
    // Glow
    const color = type === 'shield' ? C.shield : type === 'health' ? C.health : type === 'speed' ? '#8B5CF6' : C.gold
    ctx.shadowColor = color
    ctx.shadowBlur = 15 + pulse
    
    // Outer ring
    ctx.beginPath()
    ctx.arc(0, 0, w/2 + pulse, 0, Math.PI * 2)
    const ringGrad = ctx.createRadialGradient(0, 0, w/3, 0, 0, w/2 + pulse)
    ringGrad.addColorStop(0, color)
    ringGrad.addColorStop(1, 'rgba(255,255,255,0.3)')
    ctx.fillStyle = ringGrad
    ctx.fill()
    
    // Inner circle
    ctx.beginPath()
    ctx.arc(0, 0, w/3, 0, Math.PI * 2)
    ctx.fillStyle = '#FFF'
    ctx.fill()
    
    // Icon
    ctx.fillStyle = color
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const icons: Record<string, string> = { shield: 'S', double: '2x', speed: 'F', health: '+' }
    ctx.fillText(icons[type] || '?', 0, 1)
    
    ctx.restore()
  }, [])

  // Main game loop
  const gameLoop = useCallback((time: number) => {
    if (!canvasRef.current || !isPlaying) {
      frameRef.current = requestAnimationFrame(gameLoop)
      return
    }

    if (isPaused) {
      frameRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05)
    lastTimeRef.current = time
    
    const { w, h } = size
    const player = playerRef.current
    
    // Clear with gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
    bgGrad.addColorStop(0, C.bg)
    bgGrad.addColorStop(1, C.bgGrad)
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)
    
    // Animated stars
    ctx.fillStyle = C.star
    starsRef.current.forEach(star => {
      star.y += star.speed * dt
      if (star.y > h) {
        star.y = -5
        star.x = Math.random() * w
      }
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    })
    
    // Update player frame
    player.frame++
    
    // Touch input - faster movement
    if (touchRef.current) {
      const targetX = touchRef.current.x - 25
      const speed = hasSpeedBoost ? 600 : 400
      player.x += Math.sign(targetX - player.x) * Math.min(Math.abs(targetX - player.x), speed * dt)
      player.x = Math.max(0, Math.min(w - 50, player.x))
    }
    
    // Auto fire - faster rate
    const fireRate = (weapon?.fireRate || 5) * 1.5
    const fireInterval = 1000 / fireRate
    if (time - lastFireRef.current > fireInterval) {
      const shots = hasTripleShot ? 3 : hasDoubleShot ? 2 : 1
      const baseSpeed = (weapon?.projectileSpeed || 400) * 1.5 // 50% faster projectiles
      
      for (let i = 0; i < shots; i++) {
        const offset = (i - (shots - 1) / 2) * 18
        const angle = (i - (shots - 1) / 2) * 0.15
        projectilesRef.current.push({
          x: player.x + 20 + offset, y: player.y - 8,
          w: 12, h: 12, 
          vx: Math.sin(angle) * baseSpeed * 0.3, 
          vy: -baseSpeed,
          dmg: weapon?.damage || 10, enemy: false
        })
      }
      lastFireRef.current = time
    }
    
    // Update projectiles
    projectilesRef.current = projectilesRef.current.filter(p => {
      p.x += p.vx * dt
      p.y += p.vy * dt
      return p.y > -30 && p.y < h + 30 && p.x > -30 && p.x < w + 30
    })
    
    // Calculate difficulty
    const difficulty = 1 + metersRef.current / 3000
    
    // Spawn enemies - faster spawning
    spawnTimerRef.current += dt
    const spawnRate = Math.max(0.5, 1.2 / difficulty)
    if (spawnTimerRef.current > spawnRate) {
      spawnTimerRef.current = 0
      const type = Math.min(2, Math.floor(Math.random() * (1 + difficulty / 2)))
      enemiesRef.current.push({
        x: Math.random() * (w - 45), y: -60,
        w: 40, h: 50, 
        hp: 25 + type * 20 + Math.floor(difficulty) * 5, 
        maxHp: 25 + type * 20 + Math.floor(difficulty) * 5,
        pts: 15 + type * 15, type, frame: 0
      })
    }
    
    // Update enemies
    enemiesRef.current = enemiesRef.current.filter(e => {
      e.y += (100 + e.type * 25 + difficulty * 10) * dt
      e.frame++
      
      // Collision with player projectiles
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i]
        if (!p.enemy && p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
          e.hp -= p.dmg
          projectilesRef.current.splice(i, 1)
          if (e.hp <= 0) {
            addScore(e.pts)
            // Power-up drop chance
            if (Math.random() < 0.18) {
              const types: PowerUp['type'][] = ['shield', 'double', 'speed', 'health']
              powerUpsRef.current.push({
                x: e.x + e.w/2 - 15, y: e.y, w: 30, h: 30,
                type: types[Math.floor(Math.random() * types.length)]
              })
            }
            return false
          }
        }
      }
      
      // Collision with player
      if (e.x < player.x + 45 && e.x + e.w > player.x + 5 && e.y < player.y + 50 && e.y + e.h > player.y) {
        if (!hasShield) takeDamage(25)
        return false
      }
      
      return e.y < h + 60
    })
    
    // Update power-ups
    powerUpsRef.current = powerUpsRef.current.filter(pu => {
      pu.y += 120 * dt
      
      if (pu.x < player.x + 45 && pu.x + pu.w > player.x + 5 && pu.y < player.y + 50 && pu.y + pu.h > player.y) {
        if (pu.type === 'health') heal(30)
        else activatePowerUp(pu.type === 'double' ? 'double_shot' : pu.type === 'speed' ? 'speed_boost' : pu.type)
        return false
      }
      
      return pu.y < h + 40
    })
    
    // Boss logic - spawn every BOSS_SPAWN_METERS
    const boss = bossRef.current
    if (boss) {
      boss.frame++
      boss.atk -= dt
      
      // Boss movement pattern
      const movePattern = Math.sin(boss.frame * 0.02) * (w * 0.3)
      boss.x = w/2 - boss.w/2 + movePattern
      
      // Boss attack - faster in phase 2
      const attackRate = boss.phase > 1 ? 1.0 : 1.5
      if (boss.atk <= 0) {
        boss.atk = attackRate
        
        // Different attack patterns
        if (boss.phase > 1) {
          // Triple spread shot
          for (let i = -1; i <= 1; i++) {
            projectilesRef.current.push({
              x: boss.x + boss.w/2 - 10, y: boss.y + boss.h,
              w: 18, h: 18, 
              vx: i * 100, 
              vy: 280 + boss.level * 20,
              dmg: 20, enemy: true
            })
          }
        } else {
          projectilesRef.current.push({
            x: boss.x + boss.w/2 - 10, y: boss.y + boss.h,
            w: 18, h: 18, vx: 0, vy: 250 + boss.level * 15,
            dmg: 18, enemy: true
          })
        }
      }
      
      // Boss damage
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i]
        if (!p.enemy && p.x < boss.x + boss.w && p.x + p.w > boss.x && p.y < boss.y + boss.h && p.y + p.h > boss.y) {
          boss.hp -= p.dmg
          projectilesRef.current.splice(i, 1)
          
          // Phase transition
          if (boss.hp <= boss.maxHp * 0.5 && boss.phase === 1) {
            boss.phase = 2
          }
          
          // Boss defeated
          if (boss.hp <= 0) {
            addScore(boss.maxHp * 5)
            // Bonus coins handled by defeatBoss
            bossRef.current = null
          }
        }
      }
    }
    
    // Enemy projectile collision with player
    for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
      const p = projectilesRef.current[i]
      if (p.enemy && p.x < player.x + 45 && p.x + p.w > player.x + 5 && p.y < player.y + 50 && p.y + p.h > player.y) {
        if (!hasShield) takeDamage(p.dmg)
        projectilesRef.current.splice(i, 1)
      }
    }
    
    // Update meters & spawn boss
    const meterGain = dt * 80
    metersRef.current += meterGain
    addMeters(meterGain)
    checkLevelUp()
    
    // Spawn boss every BOSS_SPAWN_METERS
    if (!bossRef.current && metersRef.current - lastBossMetersRef.current >= BOSS_SPAWN_METERS) {
      lastBossMetersRef.current = Math.floor(metersRef.current / BOSS_SPAWN_METERS) * BOSS_SPAWN_METERS
      const bossLevel = Math.floor(metersRef.current / BOSS_SPAWN_METERS)
      bossRef.current = {
        x: w/2 - 60, y: 60, w: 120, h: 120,
        hp: 400 + bossLevel * 150, 
        maxHp: 400 + bossLevel * 150,
        frame: 0, phase: 1, atk: 1.5, level: bossLevel
      }
    }
    
    // Update power-up timers
    updatePowerUpTimers(dt)
    
    // Check game over
    if (health <= 0) {
      endGame()
      return
    }
    
    // --- RENDER ---
    
    // Draw enemies
    enemiesRef.current.forEach(e => drawBeerMug(ctx, e))
    
    // Draw power-ups
    powerUpsRef.current.forEach(pu => drawPowerUp(ctx, pu, player.frame))
    
    // Draw projectiles
    projectilesRef.current.forEach(p => drawProjectile(ctx, p, player.frame))
    
    // Draw boss
    if (bossRef.current) drawBoss(ctx, bossRef.current)
    
    // Draw player
    drawCat(ctx, player.x, player.y, player.frame, hasShield)
    
    frameRef.current = requestAnimationFrame(gameLoop)
  }, [isPlaying, isPaused, size, hasShield, hasDoubleShot, hasTripleShot, hasSpeedBoost, weapon, health, 
      addScore, addMeters, checkLevelUp, takeDamage, heal, activatePowerUp, updatePowerUpTimers, endGame,
      drawCat, drawBeerMug, drawBoss, drawProjectile, drawPowerUp])

  // Start/stop game loop
  useEffect(() => {
    if (isPlaying) {
      projectilesRef.current = []
      enemiesRef.current = []
      powerUpsRef.current = []
      bossRef.current = null
      spawnTimerRef.current = 0
      metersRef.current = 0
      lastBossMetersRef.current = 0
      lastTimeRef.current = performance.now()
      lastFireRef.current = 0
      
      frameRef.current = requestAnimationFrame(gameLoop)
    }
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [isPlaying, gameLoop])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    touchRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(() => {
    touchRef.current = null
  }, [])

  // Mouse handlers (for desktop)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (e.buttons === 1) {
      touchRef.current = { x: e.clientX, y: e.clientY }
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    touchRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => {
    touchRef.current = null
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={size.w}
      height={size.h}
      className="fixed inset-0 touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  )
}

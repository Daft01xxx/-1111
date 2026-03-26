'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGameStore } from '@/lib/store'

interface Vec2 { x: number; y: number }
interface Entity extends Vec2 { w: number; h: number }
interface Projectile extends Entity { vx: number; vy: number; dmg: number; enemy: boolean; color: string }
interface Enemy extends Entity { hp: number; maxHp: number; pts: number; type: number; frame: number }
interface PowerUp extends Entity { type: 'shield' | 'double' | 'speed' | 'health' | 'weapon' }
interface Boss extends Entity { hp: number; maxHp: number; frame: number; phase: number; level: number }

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

export function GameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const lastFireRef = useRef<number>(0)
  const touchRef = useRef<number | null>(null)
  const bossSpawnTimeRef = useRef<number>(0)
  
  const [size, setSize] = useState({ w: 0, h: 0 })
  
  const store = useGameStore()
  const {
    isPlaying, isPaused, health, addScore, addMeters, checkLevelUp,
    takeDamage, heal, hasShield, hasDoubleShot, hasTripleShot, hasSpeedBoost,
    activatePowerUp, updatePowerUpTimers, weapons, currentWeaponIndex,
    endGame, skins, currentSkinId, defeatBoss, lastBossTime, dropWeapon, language
  } = store

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
    starsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 80 + 40
    }))
  }, [])

  // Resize handler - make player higher to not be covered by controls
  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setSize({ w, h })
      playerRef.current.x = w / 2 - 30
      playerRef.current.y = h - 280 // Much higher position - well above weapon panel and controls
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Draw cat flying like Superman (belly down, paws stretched forward)
  const drawCat = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, shielded: boolean) => {
    const glide = Math.sin(frame * 0.1) * 3
    const pawMove = Math.sin(frame * 0.15) * 5
    const color = skin.color || C.cat
    const colorLight = color === C.cat ? C.catLight : color
    
    ctx.save()
    
    // Shield effect
    if (shielded) {
      ctx.beginPath()
      ctx.arc(x + 30, y + 25, 50, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(x + 30, y + 25, 20, x + 30, y + 25, 50)
      grad.addColorStop(0, 'rgba(59,130,246,0)')
      grad.addColorStop(0.7, 'rgba(59,130,246,0.25)')
      grad.addColorStop(1, 'rgba(59,130,246,0.6)')
      ctx.fillStyle = grad
      ctx.fill()
    }
    
    // Cape flowing behind (like Superman!)
    ctx.fillStyle = '#DC2626'
    ctx.beginPath()
    ctx.moveTo(x + 15, y + 20)
    ctx.quadraticCurveTo(x + 30, y + 60 + glide, x + 10, y + 70 + glide * 2)
    ctx.quadraticCurveTo(x + 30, y + 65 + glide, x + 50, y + 70 + glide * 2)
    ctx.quadraticCurveTo(x + 30, y + 60 + glide, x + 45, y + 20)
    ctx.fill()
    
    // Tail pointing up-back
    ctx.beginPath()
    ctx.moveTo(x + 30, y + 45)
    ctx.quadraticCurveTo(x + 30 + Math.sin(frame * 0.2) * 10, y + 65, x + 25 + Math.sin(frame * 0.15) * 8, y + 75)
    ctx.strokeStyle = color
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()
    
    // Body (horizontal, flying position - belly down)
    ctx.beginPath()
    ctx.ellipse(x + 30, y + 30 + glide, 22, 12, 0, 0, Math.PI * 2)
    const bodyGrad = ctx.createRadialGradient(x + 25, y + 25 + glide, 0, x + 30, y + 30 + glide, 24)
    bodyGrad.addColorStop(0, colorLight)
    bodyGrad.addColorStop(1, color)
    ctx.fillStyle = bodyGrad
    ctx.fill()
    ctx.strokeStyle = C.catDark
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Belly (visible from below since flying)
    ctx.beginPath()
    ctx.ellipse(x + 30, y + 35 + glide, 14, 7, 0, 0, Math.PI * 2)
    ctx.fillStyle = C.foam
    ctx.fill()
    
    // Front paws stretched forward like Superman!
    ctx.fillStyle = color
    // Left paw
    ctx.beginPath()
    ctx.ellipse(x + 8 - pawMove, y + 15 + glide, 6, 4, -0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x + 15, y + 25 + glide)
    ctx.quadraticCurveTo(x + 5, y + 20 + glide, x + 8 - pawMove, y + 15 + glide)
    ctx.strokeStyle = color
    ctx.lineWidth = 8
    ctx.stroke()
    
    // Right paw
    ctx.beginPath()
    ctx.ellipse(x + 52 + pawMove, y + 15 + glide, 6, 4, 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x + 45, y + 25 + glide)
    ctx.quadraticCurveTo(x + 55, y + 20 + glide, x + 52 + pawMove, y + 15 + glide)
    ctx.strokeStyle = color
    ctx.lineWidth = 8
    ctx.stroke()
    
    // Back paws (stretched back)
    ctx.beginPath()
    ctx.ellipse(x + 15, y + 48 + glide, 5, 4, -0.3, 0, Math.PI * 2)
    ctx.ellipse(x + 45, y + 48 + glide, 5, 4, 0.3, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    
    // Head
    ctx.beginPath()
    ctx.ellipse(x + 30, y + 8 + glide, 14, 11, 0, 0, Math.PI * 2)
    const headGrad = ctx.createRadialGradient(x + 25, y + 4 + glide, 0, x + 30, y + 8 + glide, 15)
    headGrad.addColorStop(0, colorLight)
    headGrad.addColorStop(1, color)
    ctx.fillStyle = headGrad
    ctx.fill()
    ctx.strokeStyle = C.catDark
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Ears
    const drawEar = (ex: number, flip: number) => {
      ctx.beginPath()
      ctx.moveTo(ex, y + 4 + glide)
      ctx.lineTo(ex + flip * 4, y - 10 + glide)
      ctx.lineTo(ex + flip * 12, y + 2 + glide)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      // Inner ear
      ctx.beginPath()
      ctx.moveTo(ex + flip * 2, y + 2 + glide)
      ctx.lineTo(ex + flip * 4, y - 6 + glide)
      ctx.lineTo(ex + flip * 10, y + 1 + glide)
      ctx.closePath()
      ctx.fillStyle = '#FFB6C1'
      ctx.fill()
    }
    drawEar(x + 18, -1)
    drawEar(x + 42, 1)
    
    // Eyes (determined, looking forward)
    const blink = frame % 150 < 5
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.ellipse(x + 23, y + 6 + glide, 5, blink ? 0.5 : 4, 0, 0, Math.PI * 2)
    ctx.ellipse(x + 37, y + 6 + glide, 5, blink ? 0.5 : 4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    if (!blink) {
      ctx.fillStyle = '#22C55E'
      ctx.beginPath()
      ctx.ellipse(x + 23, y + 6 + glide, 3, 3.5, 0, 0, Math.PI * 2)
      ctx.ellipse(x + 37, y + 6 + glide, 3, 3.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.ellipse(x + 23, y + 6 + glide, 1.5, 2.5, 0, 0, Math.PI * 2)
      ctx.ellipse(x + 37, y + 6 + glide, 1.5, 2.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#FFF'
      ctx.beginPath()
      ctx.arc(x + 21, y + 4 + glide, 1.5, 0, Math.PI * 2)
      ctx.arc(x + 35, y + 4 + glide, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Nose
    ctx.fillStyle = '#FF69B4'
    ctx.beginPath()
    ctx.ellipse(x + 30, y + 13 + glide, 2.5, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Whiskers
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(x + 15, y + 12 + i * 2 + glide)
      ctx.lineTo(x + 2, y + 10 + i * 3 + glide)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x + 45, y + 12 + i * 2 + glide)
      ctx.lineTo(x + 58, y + 10 + i * 3 + glide)
      ctx.stroke()
    }
    
    ctx.restore()
  }, [skin.color])

  // Draw beer mug WITHOUT smile (just evil eyes)
  const drawBeerMug = useCallback((ctx: CanvasRenderingContext2D, e: Enemy) => {
    const wobble = Math.sin(e.frame * 0.12) * 2
    const { x, y, w, h, type, hp, maxHp } = e
    const scale = 0.9 + type * 0.1
    
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
    
    // Evil eyes ONLY (NO SMILE!)
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(w * 0.32, h * 0.5, 4, 5, 0, 0, Math.PI * 2)
    ctx.ellipse(w * 0.68, h * 0.5, 4, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Red glow in eyes
    ctx.fillStyle = '#EF4444'
    ctx.beginPath()
    ctx.ellipse(w * 0.32, h * 0.5, 2, 2, 0, 0, Math.PI * 2)
    ctx.ellipse(w * 0.68, h * 0.5, 2, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Angry eyebrows
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(w * 0.2, h * 0.42)
    ctx.lineTo(w * 0.42, h * 0.38)
    ctx.moveTo(w * 0.8, h * 0.42)
    ctx.lineTo(w * 0.58, h * 0.38)
    ctx.stroke()
    
    // HP bar
    if (hp < maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(4, h + 3, w - 8, 4)
      ctx.fillStyle = hp/maxHp > 0.5 ? C.health : hp/maxHp > 0.25 ? C.beer : C.red
      ctx.fillRect(4, h + 3, (w - 8) * (hp/maxHp), 4)
    }
    
    ctx.restore()
  }, [])

  // Draw Boss Cat (appears every minute!)
  const drawBoss = useCallback((ctx: CanvasRenderingContext2D, b: Boss) => {
    const { x, y, w, h, frame, hp, maxHp, phase, level } = b
    const pulse = Math.sin(frame * 0.06) * 6
    const breathe = Math.sin(frame * 0.04) * 4
    const isEnraged = hp < maxHp * 0.3
    const color = isEnraged ? '#DC2626' : '#F97316'
    
    ctx.save()
    
    // Epic aura
    ctx.beginPath()
    ctx.arc(x + w/2, y + h/2, w * 0.7 + pulse, 0, Math.PI * 2)
    const auraGrad = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, w * 0.7 + pulse)
    auraGrad.addColorStop(0, 'rgba(239,68,68,0)')
    auraGrad.addColorStop(0.6, `rgba(239,68,68,${isEnraged ? 0.4 : 0.2})`)
    auraGrad.addColorStop(1, 'rgba(239,68,68,0)')
    ctx.fillStyle = auraGrad
    ctx.fill()
    
    // Particles
    for (let i = 0; i < 6; i++) {
      const angle = (frame * 0.02 + i * Math.PI / 3) % (Math.PI * 2)
      const dist = w * 0.55 + Math.sin(frame * 0.08 + i) * 8
      const px = x + w/2 + Math.cos(angle) * dist
      const py = y + h/2 + Math.sin(angle) * dist
      ctx.fillStyle = `rgba(255,150,50,${0.5 + Math.sin(frame * 0.1 + i) * 0.3})`
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Body
    ctx.beginPath()
    ctx.ellipse(x + w/2, y + h * 0.6 + breathe, w * 0.35, h * 0.28, 0, 0, Math.PI * 2)
    const bodyGrad = ctx.createRadialGradient(x + w * 0.4, y + h * 0.5, 0, x + w/2, y + h * 0.6, w * 0.4)
    bodyGrad.addColorStop(0, isEnraged ? '#F87171' : '#FB923C')
    bodyGrad.addColorStop(1, color)
    ctx.fillStyle = bodyGrad
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Belly
    ctx.beginPath()
    ctx.ellipse(x + w/2, y + h * 0.65 + breathe, w * 0.18, h * 0.15, 0, 0, Math.PI * 2)
    ctx.fillStyle = C.foam
    ctx.fill()
    
    // Head
    ctx.beginPath()
    ctx.ellipse(x + w/2, y + h * 0.28 + breathe, w * 0.28, h * 0.2, 0, 0, Math.PI * 2)
    ctx.fillStyle = bodyGrad
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Crown
    ctx.fillStyle = C.gold
    ctx.beginPath()
    ctx.moveTo(x + w * 0.28, y + h * 0.15 + breathe)
    ctx.lineTo(x + w * 0.32, y + breathe)
    ctx.lineTo(x + w * 0.42, y + h * 0.1 + breathe)
    ctx.lineTo(x + w * 0.5, y - h * 0.02 + breathe)
    ctx.lineTo(x + w * 0.58, y + h * 0.1 + breathe)
    ctx.lineTo(x + w * 0.68, y + breathe)
    ctx.lineTo(x + w * 0.72, y + h * 0.15 + breathe)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Crown jewel
    ctx.fillStyle = '#EF4444'
    ctx.beginPath()
    ctx.arc(x + w * 0.5, y + h * 0.06 + breathe, 6, 0, Math.PI * 2)
    ctx.fill()
    
    // Ears
    const drawEar = (ex: number, flip: number) => {
      ctx.beginPath()
      ctx.moveTo(ex, y + h * 0.18 + breathe)
      ctx.lineTo(ex + flip * 6, y + breathe)
      ctx.lineTo(ex + flip * 20, y + h * 0.12 + breathe)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.stroke()
    }
    drawEar(x + w * 0.25, -1)
    drawEar(x + w * 0.75, 1)
    
    // Evil glowing eyes
    ctx.shadowColor = isEnraged ? '#FF0000' : '#EF4444'
    ctx.shadowBlur = 15
    ctx.fillStyle = `rgba(${isEnraged ? '255,0,0' : '239,68,68'},${0.7 + Math.sin(frame * 0.1) * 0.3})`
    ctx.beginPath()
    ctx.ellipse(x + w * 0.38, y + h * 0.26 + breathe, 10, 12, 0, 0, Math.PI * 2)
    ctx.ellipse(x + w * 0.62, y + h * 0.26 + breathe, 10, 12, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Pupils
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(x + w * 0.38, y + h * 0.26 + breathe, 4, 8, 0, 0, Math.PI * 2)
    ctx.ellipse(x + w * 0.62, y + h * 0.26 + breathe, 4, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Fangs
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.moveTo(x + w * 0.42, y + h * 0.38 + breathe)
    ctx.lineTo(x + w * 0.4, y + h * 0.48 + breathe)
    ctx.lineTo(x + w * 0.44, y + h * 0.38 + breathe)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x + w * 0.58, y + h * 0.38 + breathe)
    ctx.lineTo(x + w * 0.6, y + h * 0.48 + breathe)
    ctx.lineTo(x + w * 0.56, y + h * 0.38 + breathe)
    ctx.fill()
    
    // Paws
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(x + w * 0.35, y + h * 0.85, 12, 8, -0.3, 0, Math.PI * 2)
    ctx.ellipse(x + w * 0.65, y + h * 0.85, 12, 8, 0.3, 0, Math.PI * 2)
    ctx.fill()
    
    // Boss level text
    ctx.fillStyle = C.gold
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(language === 'ru' ? `БОСС УР.${level}` : `BOSS LVL ${level}`, x + w/2, y - 35)
    
    // HP bar
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(x + 10, y - 22, w - 20, 14)
    const hpPct = hp / maxHp
    ctx.fillStyle = hpPct > 0.5 ? C.health : hpPct > 0.25 ? C.beer : C.red
    ctx.fillRect(x + 12, y - 20, (w - 24) * hpPct, 10)
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 10px sans-serif'
    ctx.fillText(`${Math.ceil(hp)}/${maxHp}`, x + w/2, y - 12)
    
    ctx.restore()
  }, [language])

  // Draw projectile
  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, p: Projectile, frame: number) => {
    ctx.save()
    
    if (p.enemy) {
      // Enemy projectile - foam ball
      const grad = ctx.createRadialGradient(p.x + p.w/2, p.y + p.h/2, 0, p.x + p.w/2, p.y + p.h/2, p.w/2)
      grad.addColorStop(0, '#FFF')
      grad.addColorStop(1, '#F59E0B')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Player projectile with weapon color
      const rot = frame * 0.3
      ctx.translate(p.x + p.w/2, p.y + p.h/2)
      ctx.rotate(rot)
      
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.w/2 + 2)
      grad.addColorStop(0, '#FFF')
      grad.addColorStop(0.5, p.color)
      grad.addColorStop(1, p.color)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, p.w/2, 0, Math.PI * 2)
      ctx.fill()
      
      // Glow
      ctx.shadowColor = p.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(0, 0, p.w/2 - 2, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.restore()
  }, [])

  // Draw power-up
  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, p: PowerUp, frame: number) => {
    const pulse = Math.sin(frame * 0.1) * 3
    const colors: Record<string, string> = {
      shield: C.shield,
      double: '#F59E0B',
      speed: '#22C55E',
      health: '#EF4444',
      weapon: '#9333EA'
    }
    const color = colors[p.type]
    
    ctx.save()
    
    // Glow
    ctx.beginPath()
    ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2 + pulse + 5, 0, Math.PI * 2)
    const glowGrad = ctx.createRadialGradient(p.x + p.w/2, p.y + p.h/2, 0, p.x + p.w/2, p.y + p.h/2, p.w/2 + pulse + 5)
    glowGrad.addColorStop(0, `${color}40`)
    glowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGrad
    ctx.fill()
    
    // Main circle
    ctx.beginPath()
    ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2 + pulse, 0, Math.PI * 2)
    const mainGrad = ctx.createRadialGradient(p.x + p.w/2 - 5, p.y + p.h/2 - 5, 0, p.x + p.w/2, p.y + p.h/2, p.w/2 + pulse)
    mainGrad.addColorStop(0, '#FFF')
    mainGrad.addColorStop(0.3, color)
    mainGrad.addColorStop(1, color)
    ctx.fillStyle = mainGrad
    ctx.fill()
    
    // Icon
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const icons: Record<string, string> = { shield: 'S', double: '2x', speed: '>', health: '+', weapon: 'W' }
    ctx.fillText(icons[p.type], p.x + p.w/2, p.y + p.h/2)
    
    ctx.restore()
  }, [])

  // Spawn enemies and check boss timer
  const spawnEnemies = useCallback((dt: number) => {
    spawnTimerRef.current += dt
    if (spawnTimerRef.current > 0.8) { // Spawn every 0.8 seconds
      spawnTimerRef.current = 0
      const { w, h } = size
      const type = Math.random() < 0.2 ? 2 : Math.random() < 0.5 ? 1 : 0
      const ew = 36 + type * 6
      const eh = 44 + type * 8
      enemiesRef.current.push({
        x: Math.random() * (w - ew - 20) + 10,
        y: -eh - 10,
        w: ew,
        h: eh,
        hp: 20 + type * 15,
        maxHp: 20 + type * 15,
        pts: 10 + type * 10,
        type,
        frame: 0
      })
    }
    
    // Check boss spawn (every 60 seconds)
    const now = Date.now()
    if (!bossRef.current && now - bossSpawnTimeRef.current > BOSS_INTERVAL) {
      bossSpawnTimeRef.current = now
      const bossLevel = Math.floor(metersRef.current / 5000) + 1
      const bw = 120 + bossLevel * 10
      const bh = 140 + bossLevel * 10
      bossRef.current = {
        x: size.w / 2 - bw / 2,
        y: -bh - 20,
        w: bw,
        h: bh,
        hp: 300 + bossLevel * 150,
        maxHp: 300 + bossLevel * 150,
        frame: 0,
        phase: 1,
        level: bossLevel
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

  // Main game loop
  useEffect(() => {
    if (!isPlaying || isPaused) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    bossSpawnTimeRef.current = Date.now()
    
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = timestamp
      frameRef.current++
      
      const { w, h } = size
      if (w === 0 || h === 0) {
        frameRef.current = requestAnimationFrame(gameLoop)
        return
      }
      
      // Clear
      ctx.fillStyle = C.bg
      ctx.fillRect(0, 0, w, h)
      
      // Stars
      starsRef.current.forEach(star => {
        star.y += star.speed * dt
        if (star.y > h) { star.y = 0; star.x = Math.random() * w }
        ctx.fillStyle = `rgba(255,255,255,${0.3 + star.size * 0.2})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Update meters
      const metersGained = 50 * dt * (hasSpeedBoost ? 1.5 : 1)
      metersRef.current += metersGained
      addMeters(metersGained)
      checkLevelUp()
      
      // Spawn enemies
      spawnEnemies(dt)
      
      // Update player position (touch)
      const player = playerRef.current
      if (touchRef.current !== null) {
        const targetX = touchRef.current - 30
        player.x += (targetX - player.x) * 0.15
      }
      player.x = Math.max(5, Math.min(w - 65, player.x))
      player.frame++
      
      // Fire projectiles
      const fireRate = weapon.fireRate * (hasSpeedBoost ? 1.5 : 1)
      const fireInterval = 1000 / fireRate
      if (timestamp - lastFireRef.current > fireInterval) {
        lastFireRef.current = timestamp
        const projCount = weapon.projectileCount + (hasDoubleShot ? 1 : 0) + (hasTripleShot ? 2 : 0)
        const spread = projCount > 1 ? 30 : 0
        for (let i = 0; i < projCount; i++) {
          const angle = -Math.PI/2 + (i - (projCount-1)/2) * (spread * Math.PI/180)
          projectilesRef.current.push({
            x: player.x + 25,
            y: player.y,
            w: 10 + weapon.damage / 10,
            h: 10 + weapon.damage / 10,
            vx: Math.cos(angle) * weapon.projectileSpeed,
            vy: Math.sin(angle) * weapon.projectileSpeed,
            dmg: weapon.damage,
            enemy: false,
            color: weapon.color
          })
        }
      }
      
      // Update projectiles
      projectilesRef.current = projectilesRef.current.filter(p => {
        p.x += p.vx * dt
        p.y += p.vy * dt
        return p.y > -20 && p.y < h + 20 && p.x > -20 && p.x < w + 20
      })
      
      // Update enemies
      enemiesRef.current = enemiesRef.current.filter(e => {
        e.y += (100 + e.type * 30) * dt
        e.frame++
        
        // Enemy shooting
        if (Math.random() < 0.003) {
          projectilesRef.current.push({
            x: e.x + e.w/2 - 5,
            y: e.y + e.h,
            w: 10,
            h: 10,
            vx: 0,
            vy: 300,
            dmg: 10 + e.type * 5,
            enemy: true,
            color: C.beer
          })
        }
        
        return e.y < h + 50 && e.hp > 0
      })
      
      // Update boss
      const boss = bossRef.current
      if (boss) {
        boss.frame++
        if (boss.y < 50) {
          boss.y += 80 * dt
        } else {
          // Boss movement
          boss.x += Math.sin(boss.frame * 0.02) * 2
          // Boss shooting
          if (boss.frame % 40 === 0) {
            const angles = boss.phase > 1 ? [-0.3, 0, 0.3] : [0]
            angles.forEach(a => {
              projectilesRef.current.push({
                x: boss.x + boss.w/2 - 8,
                y: boss.y + boss.h,
                w: 16,
                h: 16,
                vx: Math.sin(a) * 150,
                vy: 250,
                dmg: 20 + boss.level * 5,
                enemy: true,
                color: '#EF4444'
              })
            })
          }
        }
        if (boss.hp < boss.maxHp * 0.5 && boss.phase === 1) {
          boss.phase = 2
        }
      }
      
      // Collision: player projectiles vs enemies
      projectilesRef.current = projectilesRef.current.filter(p => {
        if (p.enemy) return true
        
        for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
          const e = enemiesRef.current[i]
          if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
            e.hp -= p.dmg
            if (e.hp <= 0) {
              addScore(e.pts)
              tryDropWeapon(false)
              // Power-up drop
              if (Math.random() < 0.15) {
                const types: PowerUp['type'][] = ['shield', 'double', 'speed', 'health']
                powerUpsRef.current.push({
                  x: e.x + e.w/2 - 12,
                  y: e.y,
                  w: 24,
                  h: 24,
                  type: types[Math.floor(Math.random() * types.length)]
                })
              }
              enemiesRef.current.splice(i, 1)
            }
            return false
          }
        }
        
        // Check boss hit
        if (boss && p.x < boss.x + boss.w && p.x + p.w > boss.x && p.y < boss.y + boss.h && p.y + p.h > boss.y) {
          boss.hp -= p.dmg
          if (boss.hp <= 0) {
            addScore(500 + boss.level * 200)
            defeatBoss()
            tryDropWeapon(true)
            bossRef.current = null
          }
          return false
        }
        
        return true
      })
      
      // Collision: enemy projectiles vs player
      const px = player.x, py = player.y
      projectilesRef.current = projectilesRef.current.filter(p => {
        if (!p.enemy) return true
        if (p.x < px + 60 && p.x + p.w > px && p.y < py + 50 && p.y + p.h > py) {
          takeDamage(p.dmg)
          return false
        }
        return true
      })
      
      // Collision: enemies vs player
      enemiesRef.current.forEach(e => {
        if (e.x < px + 50 && e.x + e.w > px + 10 && e.y < py + 45 && e.y + e.h > py + 5) {
          takeDamage(20)
          e.hp = 0
        }
      })
      
      // Collision: power-ups vs player
      powerUpsRef.current = powerUpsRef.current.filter(p => {
        p.y += 120 * dt
        if (p.y > h + 30) return false
        
        if (p.x < px + 55 && p.x + p.w > px + 5 && p.y < py + 50 && p.y + p.h > py) {
          if (p.type === 'health') {
            heal(25)
          } else if (p.type === 'shield') {
            activatePowerUp('shield')
          } else if (p.type === 'double') {
            activatePowerUp('double_shot')
          } else if (p.type === 'speed') {
            activatePowerUp('speed_boost')
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
      
      // Player
      drawCat(ctx, player.x, player.y, player.frame, hasShield)
      
      frameRef.current = requestAnimationFrame(gameLoop)
    }
    
    frameRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [isPlaying, isPaused, size, weapon, hasShield, hasDoubleShot, hasTripleShot, hasSpeedBoost,
      addScore, addMeters, checkLevelUp, takeDamage, heal, activatePowerUp, updatePowerUpTimers,
      endGame, defeatBoss, health, spawnEnemies, drawCat, drawBeerMug, drawBoss, drawProjectile,
      drawPowerUp, tryDropWeapon])

  // Touch handlers
  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    touchRef.current = clientX
  }, [])

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

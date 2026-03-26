'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGameStore } from '@/lib/store'

// Game types
interface Vec2 { x: number; y: number }
interface Entity extends Vec2 { w: number; h: number }
interface Projectile extends Entity { vx: number; vy: number; dmg: number; enemy: boolean }
interface Enemy extends Entity { hp: number; maxHp: number; pts: number; type: number; frame: number }
interface PowerUp extends Entity { type: 'shield' | 'double' | 'speed' | 'health' }
interface Boss extends Entity { hp: number; maxHp: number; frame: number; phase: number; atk: number }

// Colors
const COLORS = {
  bg: '#0c0c0e',
  cat: '#F97316',
  catDark: '#C2410C',
  beer: '#F59E0B',
  beerDark: '#B45309',
  foam: '#FEF3C7',
  gold: '#D4AF37',
  shield: '#3B82F6',
  health: '#22C55E',
}

export function GameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const touchRef = useRef<Vec2 | null>(null)
  
  const [size, setSize] = useState({ w: 0, h: 0 })
  
  const {
    isPlaying, isPaused, health, addScore, addMeters, checkLevelUp,
    takeDamage, heal, hasShield, hasDoubleShot, hasTripleShot, hasSpeedBoost,
    activatePowerUp, updatePowerUpTimers, weapons, currentWeaponIndex,
    multiplier, endGame, skins, currentSkinId, spawnBoss, defeatBoss
  } = useGameStore()

  // Game state refs (avoid re-renders)
  const playerRef = useRef({ x: 0, y: 0, frame: 0 })
  const projectilesRef = useRef<Projectile[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const bossRef = useRef<Boss | null>(null)
  const spawnTimerRef = useRef(0)
  const metersRef = useRef(0)
  const difficultyRef = useRef(1)

  const skin = skins.find(s => s.id === currentSkinId) || skins[0]
  const weapon = weapons[currentWeaponIndex]

  // Resize handler
  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setSize({ w, h })
      playerRef.current.x = w / 2 - 25
      playerRef.current.y = h - 120
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Draw cat player
  const drawCat = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, shielded: boolean) => {
    const bounce = Math.sin(frame * 0.15) * 3
    const tailWag = Math.sin(frame * 0.25) * 12
    const color = skin.color || COLORS.cat
    
    ctx.save()
    
    // Shield glow
    if (shielded) {
      ctx.beginPath()
      ctx.arc(x + 25, y + 25, 40, 0, Math.PI * 2)
      const g = ctx.createRadialGradient(x + 25, y + 25, 0, x + 25, y + 25, 40)
      g.addColorStop(0, 'rgba(59,130,246,0)')
      g.addColorStop(0.6, 'rgba(59,130,246,0.15)')
      g.addColorStop(1, 'rgba(59,130,246,0.4)')
      ctx.fillStyle = g
      ctx.fill()
    }
    
    // Tail
    ctx.beginPath()
    ctx.moveTo(x + 25, y + 45)
    ctx.quadraticCurveTo(x + 25 + tailWag, y + 60, x + 25 + tailWag * 0.6, y + 70)
    ctx.strokeStyle = color
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.stroke()
    
    // Body
    ctx.beginPath()
    ctx.ellipse(x + 25, y + 32 + bounce, 20, 16, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Head
    ctx.beginPath()
    ctx.ellipse(x + 25, y + 12 + bounce, 16, 12, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
    
    // Ears
    const drawEar = (ex: number, flip: number) => {
      ctx.beginPath()
      ctx.moveTo(ex, y + 8 + bounce)
      ctx.lineTo(ex + flip * 4, y - 6 + bounce)
      ctx.lineTo(ex + flip * 12, y + 4 + bounce)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      ctx.stroke()
      // Inner ear
      ctx.beginPath()
      ctx.moveTo(ex + flip * 2, y + 6 + bounce)
      ctx.lineTo(ex + flip * 4, y - 2 + bounce)
      ctx.lineTo(ex + flip * 9, y + 4 + bounce)
      ctx.closePath()
      ctx.fillStyle = '#FFB6C1'
      ctx.fill()
    }
    drawEar(x + 12, -1)
    drawEar(x + 38, 1)
    
    // Eyes
    const blink = frame % 80 < 4
    const eyeH = blink ? 1 : 4
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.ellipse(x + 19, y + 11 + bounce, 4, eyeH, 0, 0, Math.PI * 2)
    ctx.ellipse(x + 31, y + 11 + bounce, 4, eyeH, 0, 0, Math.PI * 2)
    ctx.fill()
    if (!blink) {
      ctx.fillStyle = '#22C55E'
      ctx.beginPath()
      ctx.ellipse(x + 19, y + 11 + bounce, 2, 3, 0, 0, Math.PI * 2)
      ctx.ellipse(x + 31, y + 11 + bounce, 2, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.ellipse(x + 19, y + 11 + bounce, 1, 2, 0, 0, Math.PI * 2)
      ctx.ellipse(x + 31, y + 11 + bounce, 1, 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Nose & mouth
    ctx.fillStyle = '#FF69B4'
    ctx.beginPath()
    ctx.ellipse(x + 25, y + 17 + bounce, 2, 1.5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x + 25, y + 18 + bounce)
    ctx.lineTo(x + 25, y + 20 + bounce)
    ctx.moveTo(x + 22, y + 21 + bounce)
    ctx.quadraticCurveTo(x + 25, y + 23 + bounce, x + 28, y + 21 + bounce)
    ctx.stroke()
    
    // Whiskers
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(x + 12, y + 16 + i * 2 + bounce)
      ctx.lineTo(x + 2, y + 14 + i * 3 + bounce)
      ctx.moveTo(x + 38, y + 16 + i * 2 + bounce)
      ctx.lineTo(x + 48, y + 14 + i * 3 + bounce)
      ctx.stroke()
    }
    
    ctx.restore()
  }, [skin.color])

  // Draw beer mug enemy
  const drawBeerMug = useCallback((ctx: CanvasRenderingContext2D, e: Enemy) => {
    const wobble = Math.sin(e.frame * 0.2) * 2
    const { x, y, w, h, type } = e
    const scale = 0.8 + type * 0.15
    
    ctx.save()
    ctx.translate(x + w/2, y + h/2)
    ctx.scale(scale, scale)
    ctx.translate(-w/2, -h/2)
    
    // Handle
    ctx.beginPath()
    ctx.moveTo(w - 5, h * 0.25)
    ctx.quadraticCurveTo(w + 12, h * 0.35, w + 12, h * 0.5)
    ctx.quadraticCurveTo(w + 12, h * 0.65, w - 5, h * 0.75)
    ctx.strokeStyle = COLORS.beerDark
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.strokeStyle = COLORS.beer
    ctx.lineWidth = 4
    ctx.stroke()
    
    // Mug body
    ctx.beginPath()
    ctx.roundRect(2, h * 0.2, w - 8, h * 0.75, 4)
    const mugGrad = ctx.createLinearGradient(0, 0, w, 0)
    mugGrad.addColorStop(0, '#FCD34D')
    mugGrad.addColorStop(0.5, '#F59E0B')
    mugGrad.addColorStop(1, '#D97706')
    ctx.fillStyle = mugGrad
    ctx.fill()
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Beer liquid
    ctx.beginPath()
    ctx.roundRect(5, h * 0.35, w - 14, h * 0.55, 2)
    const beerGrad = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.9)
    beerGrad.addColorStop(0, '#FCD34D')
    beerGrad.addColorStop(1, '#B45309')
    ctx.fillStyle = beerGrad
    ctx.fill()
    
    // Foam
    ctx.fillStyle = COLORS.foam
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.ellipse(8 + i * 8, h * 0.22 + wobble, 6, 5, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.ellipse(w/2 - 2, h * 0.15 + wobble, 10, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Evil face
    ctx.fillStyle = '#000'
    // Eyes
    ctx.beginPath()
    ctx.ellipse(w * 0.3, h * 0.5, 3, 4, 0, 0, Math.PI * 2)
    ctx.ellipse(w * 0.6, h * 0.5, 3, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    // Evil eyebrows
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.2, h * 0.42)
    ctx.lineTo(w * 0.38, h * 0.38)
    ctx.moveTo(w * 0.7, h * 0.42)
    ctx.lineTo(w * 0.52, h * 0.38)
    ctx.stroke()
    // Evil grin
    ctx.beginPath()
    ctx.moveTo(w * 0.25, h * 0.65)
    ctx.quadraticCurveTo(w * 0.45, h * 0.75, w * 0.65, h * 0.65)
    ctx.stroke()
    
    ctx.restore()
  }, [])

  // Draw boss cat
  const drawBoss = useCallback((ctx: CanvasRenderingContext2D, b: Boss) => {
    const { x, y, w, h, frame, hp, maxHp, phase } = b
    const pulse = Math.sin(frame * 0.1) * 5
    const color = phase > 1 ? '#DC2626' : COLORS.cat
    
    ctx.save()
    
    // Aura
    ctx.beginPath()
    ctx.arc(x + w/2, y + h/2, w * 0.7 + pulse, 0, Math.PI * 2)
    const auraGrad = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, w * 0.7 + pulse)
    auraGrad.addColorStop(0, 'rgba(220,38,38,0)')
    auraGrad.addColorStop(0.7, `rgba(220,38,38,${0.1 + phase * 0.1})`)
    auraGrad.addColorStop(1, `rgba(220,38,38,${0.3 + phase * 0.15})`)
    ctx.fillStyle = auraGrad
    ctx.fill()
    
    // Body (big cat)
    ctx.beginPath()
    ctx.ellipse(x + w/2, y + h * 0.6, w * 0.4, h * 0.35, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Head
    ctx.beginPath()
    ctx.ellipse(x + w/2, y + h * 0.3, w * 0.35, h * 0.25, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
    
    // Crown
    ctx.fillStyle = COLORS.gold
    ctx.beginPath()
    ctx.moveTo(x + w * 0.25, y + h * 0.12)
    ctx.lineTo(x + w * 0.3, y - 5)
    ctx.lineTo(x + w * 0.4, y + h * 0.08)
    ctx.lineTo(x + w * 0.5, y - 10)
    ctx.lineTo(x + w * 0.6, y + h * 0.08)
    ctx.lineTo(x + w * 0.7, y - 5)
    ctx.lineTo(x + w * 0.75, y + h * 0.12)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Evil eyes
    const eyeGlow = Math.sin(frame * 0.2) * 0.3 + 0.7
    ctx.fillStyle = `rgba(220,38,38,${eyeGlow})`
    ctx.shadowColor = '#DC2626'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.ellipse(x + w * 0.38, y + h * 0.28, 8, 10, 0, 0, Math.PI * 2)
    ctx.ellipse(x + w * 0.62, y + h * 0.28, 8, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Fangs
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.moveTo(x + w * 0.4, y + h * 0.42)
    ctx.lineTo(x + w * 0.38, y + h * 0.52)
    ctx.lineTo(x + w * 0.42, y + h * 0.42)
    ctx.moveTo(x + w * 0.6, y + h * 0.42)
    ctx.lineTo(x + w * 0.62, y + h * 0.52)
    ctx.lineTo(x + w * 0.58, y + h * 0.42)
    ctx.fill()
    
    // HP bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(x + 10, y - 20, w - 20, 12)
    const hpPercent = hp / maxHp
    ctx.fillStyle = hpPercent > 0.5 ? '#22C55E' : hpPercent > 0.25 ? '#F59E0B' : '#DC2626'
    ctx.fillRect(x + 12, y - 18, (w - 24) * hpPercent, 8)
    
    ctx.restore()
  }, [])

  // Draw projectile
  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, p: Projectile) => {
    ctx.save()
    if (p.enemy) {
      // Enemy projectile (foam ball)
      ctx.fillStyle = COLORS.foam
      ctx.beginPath()
      ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Player projectile (yarn ball)
      const grad = ctx.createRadialGradient(p.x + p.w/2, p.y + p.h/2, 0, p.x + p.w/2, p.y + p.h/2, p.w/2)
      grad.addColorStop(0, '#FF69B4')
      grad.addColorStop(1, '#DB2777')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2, 0, Math.PI * 2)
      ctx.fill()
      // Yarn lines
      ctx.strokeStyle = '#FDF2F8'
      ctx.lineWidth = 1
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/3, i * 1.2, i * 1.2 + 1)
        ctx.stroke()
      }
    }
    ctx.restore()
  }, [])

  // Draw power-up
  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, pu: PowerUp, frame: number) => {
    const pulse = Math.sin(frame * 0.15) * 3
    const { x, y, w, h, type } = pu
    
    ctx.save()
    
    // Glow
    const color = type === 'shield' ? COLORS.shield : type === 'health' ? COLORS.health : COLORS.gold
    ctx.shadowColor = color
    ctx.shadowBlur = 15
    
    ctx.beginPath()
    ctx.arc(x + w/2, y + h/2, w/2 + pulse, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    
    // Icon
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const icons = { shield: '🛡️', double: '⚡', speed: '💨', health: '❤️' }
    ctx.fillText(icons[type] || '?', x + w/2, y + h/2)
    
    ctx.restore()
  }, [])

  // Game loop
  const gameLoop = useCallback((time: number) => {
    if (!canvasRef.current || !isPlaying || isPaused) {
      frameRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1)
    lastTimeRef.current = time
    
    const { w, h } = size
    const player = playerRef.current
    
    // Clear
    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, w, h)
    
    // Stars background
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    for (let i = 0; i < 50; i++) {
      const sx = (i * 73 + player.frame * 0.5) % w
      const sy = (i * 47 + player.frame * 2) % h
      ctx.fillRect(sx, sy, 1, 1)
    }
    
    // Update player frame
    player.frame++
    
    // Touch input
    if (touchRef.current) {
      const targetX = touchRef.current.x - 25
      const speed = hasSpeedBoost ? 450 : 300
      player.x += Math.sign(targetX - player.x) * Math.min(Math.abs(targetX - player.x), speed * dt)
      player.x = Math.max(0, Math.min(w - 50, player.x))
    }
    
    // Auto fire
    const fireInterval = 1 / (weapon?.fireRate || 5)
    if (time - lastFireTimeRef.current > fireInterval * 1000) {
      const shots = hasTripleShot ? 3 : hasDoubleShot ? 2 : 1
      for (let i = 0; i < shots; i++) {
        const offset = (i - (shots - 1) / 2) * 15
        projectilesRef.current.push({
          x: player.x + 20 + offset, y: player.y - 10,
          w: 10, h: 10, vx: 0, vy: -500,
          dmg: weapon?.damage || 10, enemy: false
        })
      }
      lastFireTimeRef.current = time
    }
    
    // Update projectiles
    projectilesRef.current = projectilesRef.current.filter(p => {
      p.x += p.vx * dt
      p.y += p.vy * dt
      return p.y > -20 && p.y < h + 20 && p.x > -20 && p.x < w + 20
    })
    
    // Spawn enemies
    spawnTimerRef.current += dt
    if (spawnTimerRef.current > 1.5 / difficultyRef.current) {
      spawnTimerRef.current = 0
      const type = Math.floor(Math.random() * 3)
      enemiesRef.current.push({
        x: Math.random() * (w - 40), y: -50,
        w: 35, h: 45, hp: 20 + type * 15, maxHp: 20 + type * 15,
        pts: 10 + type * 10, type, frame: 0
      })
    }
    
    // Update enemies
    enemiesRef.current = enemiesRef.current.filter(e => {
      e.y += (80 + e.type * 20) * dt
      e.frame++
      
      // Collision with projectiles
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i]
        if (!p.enemy && p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
          e.hp -= p.dmg
          projectilesRef.current.splice(i, 1)
          if (e.hp <= 0) {
            addScore(e.pts)
            // Random power-up drop
            if (Math.random() < 0.15) {
              const types: PowerUp['type'][] = ['shield', 'double', 'speed', 'health']
              powerUpsRef.current.push({
                x: e.x, y: e.y, w: 25, h: 25,
                type: types[Math.floor(Math.random() * types.length)]
              })
            }
            return false
          }
        }
      }
      
      // Collision with player
      if (e.x < player.x + 50 && e.x + e.w > player.x && e.y < player.y + 50 && e.y + e.h > player.y) {
        takeDamage(20)
        return false
      }
      
      return e.y < h + 50
    })
    
    // Update power-ups
    powerUpsRef.current = powerUpsRef.current.filter(pu => {
      pu.y += 100 * dt
      
      // Collision with player
      if (pu.x < player.x + 50 && pu.x + pu.w > player.x && pu.y < player.y + 50 && pu.y + pu.h > player.y) {
        if (pu.type === 'health') heal(25)
        else activatePowerUp(pu.type === 'double' ? 'double_shot' : pu.type === 'speed' ? 'speed_boost' : pu.type)
        return false
      }
      
      return pu.y < h + 30
    })
    
    // Boss logic
    const boss = bossRef.current
    if (boss) {
      boss.frame++
      boss.atk -= dt
      
      // Boss movement
      boss.x += Math.sin(boss.frame * 0.03) * 2
      
      // Boss attack
      if (boss.atk <= 0) {
        boss.atk = 2 - boss.phase * 0.3
        projectilesRef.current.push({
          x: boss.x + boss.w/2 - 8, y: boss.y + boss.h,
          w: 16, h: 16, vx: 0, vy: 200 + boss.phase * 50,
          dmg: 15, enemy: true
        })
      }
      
      // Boss damage from projectiles
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i]
        if (!p.enemy && p.x < boss.x + boss.w && p.x + p.w > boss.x && p.y < boss.y + boss.h && p.y + p.h > boss.y) {
          boss.hp -= p.dmg
          projectilesRef.current.splice(i, 1)
          
          if (boss.hp <= boss.maxHp * 0.5 && boss.phase === 1) boss.phase = 2
          
          if (boss.hp <= 0) {
            addScore(boss.maxHp * 10)
            defeatBoss('current')
            bossRef.current = null
          }
        }
      }
    }
    
    // Enemy projectile collision with player
    for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
      const p = projectilesRef.current[i]
      if (p.enemy && p.x < player.x + 50 && p.x + p.w > player.x && p.y < player.y + 50 && p.y + p.h > player.y) {
        takeDamage(p.dmg)
        projectilesRef.current.splice(i, 1)
      }
    }
    
    // Update meters & difficulty
    metersRef.current += dt * 50
    addMeters(dt * 50)
    checkLevelUp()
    difficultyRef.current = 1 + metersRef.current / 5000
    
    // Spawn boss at intervals
    if (metersRef.current > 0 && Math.floor(metersRef.current / 10000) > Math.floor((metersRef.current - dt * 50) / 10000) && !bossRef.current) {
      const bossLevel = Math.floor(metersRef.current / 10000)
      bossRef.current = {
        x: w/2 - 50, y: 50, w: 100, h: 100,
        hp: 300 + bossLevel * 200, maxHp: 300 + bossLevel * 200,
        frame: 0, phase: 1, atk: 2
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
    projectilesRef.current.forEach(p => drawProjectile(ctx, p))
    
    // Draw boss
    if (bossRef.current) drawBoss(ctx, bossRef.current)
    
    // Draw player
    drawCat(ctx, player.x, player.y, player.frame, hasShield)
    
    frameRef.current = requestAnimationFrame(gameLoop)
  }, [isPlaying, isPaused, size, hasShield, hasDoubleShot, hasTripleShot, hasSpeedBoost, weapon, health, addScore, addMeters, checkLevelUp, takeDamage, heal, activatePowerUp, updatePowerUpTimers, endGame, defeatBoss, drawCat, drawBeerMug, drawBoss, drawProjectile, drawPowerUp])

  // Start/stop game loop
  useEffect(() => {
    if (isPlaying) {
      // Reset on new game
      projectilesRef.current = []
      enemiesRef.current = []
      powerUpsRef.current = []
      bossRef.current = null
      spawnTimerRef.current = 0
      metersRef.current = 0
      difficultyRef.current = 1
      lastTimeRef.current = performance.now()
      
      frameRef.current = requestAnimationFrame(gameLoop)
    }
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [isPlaying, gameLoop])

  // Touch handlers
  const handleTouch = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY
    
    if (clientX !== undefined && clientY !== undefined) {
      touchRef.current = { x: clientX - rect.left, y: clientY - rect.top }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    touchRef.current = null
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={size.w}
      height={size.h}
      className="touch-none"
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouch}
      onMouseMove={(e) => e.buttons && handleTouch(e)}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    />
  )
}

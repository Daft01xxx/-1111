'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGameStore } from '@/lib/store'

interface Entity {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
}

interface Projectile extends Entity {
  damage: number
  isEnemy: boolean
}

interface Enemy extends Entity {
  health: number
  maxHealth: number
  points: number
  type: 'small' | 'medium' | 'large' | 'boss'
  animFrame: number
}

interface PowerUpItem extends Entity {
  type: 'shield' | 'double_shot' | 'speed_boost' | 'triple_shot' | 'health'
}

interface Player extends Entity {
  baseSpeed: number
  animFrame: number
  animTimer: number
}

interface BossEntity extends Entity {
  health: number
  maxHealth: number
  points: number
  animFrame: number
  animTimer: number
  attackTimer: number
  phase: number
}

export function GameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  
  const {
    isPlaying,
    isPaused,
    gameOver,
    health,
    score,
    meters,
    addScore,
    addMeters,
    checkLevelUp,
    takeDamage,
    heal,
    hasShield,
    hasDoubleShot,
    hasTripleShot,
    hasSpeedBoost,
    activatePowerUp,
    updatePowerUpTimers,
    weapons,
    currentWeaponIndex,
    multiplier,
    endGame,
    skins,
    currentSkinId,
    activeBoss,
    spawnBoss,
    defeatBoss,
    clearActiveBoss,
  } = useGameStore()

  const currentSkin = skins.find(s => s.id === currentSkinId) || skins[0]

  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    baseSpeed: 300,
    animFrame: 0,
    animTimer: 0,
  })
  
  const projectilesRef = useRef<Projectile[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const powerUpsRef = useRef<PowerUpItem[]>([])
  const lastFireTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const difficultyRef = useRef<number>(1)
  const bossRef = useRef<BossEntity | null>(null)
  const gameTimeRef = useRef<number>(0)
  
  // Draw animated cat (player)
  const drawCat = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, hasShieldActive: boolean, color: string, animFrame: number) => {
    ctx.save()
    
    const bounce = Math.sin(animFrame * 0.2) * 2
    const tailWag = Math.sin(animFrame * 0.3) * 15
    
    // Shield effect
    if (hasShieldActive) {
      ctx.beginPath()
      ctx.arc(x + width / 2, y + height / 2, width * 0.8, 0, Math.PI * 2)
      const gradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, 0,
        x + width / 2, y + height / 2, width * 0.8
      )
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0)')
      gradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.2)')
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)')
      ctx.fillStyle = gradient
      ctx.fill()
    }
    
    // Tail
    ctx.beginPath()
    ctx.moveTo(x + width / 2, y + height - 5)
    ctx.quadraticCurveTo(
      x + width / 2 + tailWag, y + height + 15,
      x + width / 2 + tailWag * 0.5, y + height + 25
    )
    ctx.strokeStyle = color
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()
    
    // Body
    ctx.beginPath()
    ctx.ellipse(x + width / 2, y + height / 2 + 5 + bounce, width / 2 - 3, height / 2 - 8, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Head
    ctx.beginPath()
    ctx.ellipse(x + width / 2, y + 12 + bounce, 18, 14, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
    
    // Ears
    ctx.beginPath()
    ctx.moveTo(x + 12, y + 8 + bounce)
    ctx.lineTo(x + 8, y - 8 + bounce)
    ctx.lineTo(x + 22, y + 4 + bounce)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(x + width - 12, y + 8 + bounce)
    ctx.lineTo(x + width - 8, y - 8 + bounce)
    ctx.lineTo(x + width - 22, y + 4 + bounce)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Inner ears
    ctx.beginPath()
    ctx.moveTo(x + 14, y + 6 + bounce)
    ctx.lineTo(x + 11, y - 3 + bounce)
    ctx.lineTo(x + 20, y + 4 + bounce)
    ctx.closePath()
    ctx.fillStyle = '#FFB6C1'
    ctx.fill()
    
    ctx.beginPath()
    ctx.moveTo(x + width - 14, y + 6 + bounce)
    ctx.lineTo(x + width - 11, y - 3 + bounce)
    ctx.lineTo(x + width - 20, y + 4 + bounce)
    ctx.closePath()
    ctx.fill()
    
    // Eyes
    const blinkMod = animFrame % 60
    const eyeHeight = blinkMod < 3 ? 1 : 5
    
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.ellipse(x + 18, y + 12 + bounce, 5, eyeHeight, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(x + width - 18, y + 12 + bounce, 5, eyeHeight, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Pupils
    if (eyeHeight > 1) {
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.ellipse(x + 18, y + 13 + bounce, 2.5, 3.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + width - 18, y + 13 + bounce, 2.5, 3.5, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Nose
    ctx.fillStyle = '#FFB6C1'
    ctx.beginPath()
    ctx.moveTo(x + width / 2, y + 18 + bounce)
    ctx.lineTo(x + width / 2 - 3, y + 15 + bounce)
    ctx.lineTo(x + width / 2 + 3, y + 15 + bounce)
    ctx.closePath()
    ctx.fill()
    
    // Whiskers
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(x + 8, y + 16 + i * 3 + bounce)
      ctx.lineTo(x - 5, y + 14 + i * 4 + bounce)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x + width - 8, y + 16 + i * 3 + bounce)
      ctx.lineTo(x + width + 5, y + 14 + i * 4 + bounce)
      ctx.stroke()
    }
    
    ctx.restore()
  }, [])
  
  // Draw foam/yarn projectile
  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, time: number) => {
    ctx.save()
    
    // Yarn ball projectile
    const gradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, width/2)
    gradient.addColorStop(0, '#FFD700')
    gradient.addColorStop(0.5, '#FFA500')
    gradient.addColorStop(1, '#FF8C00')
    
    ctx.beginPath()
    ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Yarn lines
    ctx.strokeStyle = '#FFE4B5'
    ctx.lineWidth = 1.5
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(x + width/2, y + height/2, width/2 - 2 - i * 2, (time * 0.01 + i) % (Math.PI * 2), (time * 0.01 + i + 1) % (Math.PI * 2))
      ctx.stroke()
    }
    
    ctx.shadowColor = '#FFA500'
    ctx.shadowBlur = 8
    ctx.fill()
    
    ctx.restore()
  }, [])
  
  // Draw beer mug enemy
  const drawBeerMugEnemy = useCallback((ctx: CanvasRenderingContext2D, enemy: Enemy, time: number) => {
    ctx.save()
    
    const { x, y, width, height, type, animFrame } = enemy
    const wobble = Math.sin(animFrame * 0.1) * 3
    
    // Scale based on type
    const scale = type === 'small' ? 0.7 : type === 'medium' ? 1 : 1.3
    const w = width * scale
    const h = height * scale
    const offsetX = (width - w) / 2
    const offsetY = (height - h) / 2
    
    // Evil aura
    ctx.beginPath()
    ctx.arc(x + width/2, y + height/2, w * 0.6, 0, Math.PI * 2)
    const auraGradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, w * 0.6)
    auraGradient.addColorStop(0, 'rgba(220, 38, 38, 0)')
    auraGradient.addColorStop(1, 'rgba(220, 38, 38, 0.3)')
    ctx.fillStyle = auraGradient
    ctx.fill()
    
    // Mug body
    ctx.beginPath()
    ctx.roundRect(x + offsetX + 5, y + offsetY + 15 + wobble, w - 20, h - 20, 6)
    const beerGradient = ctx.createLinearGradient(x, y, x, y + h)
    beerGradient.addColorStop(0, '#FFD78A')
    beerGradient.addColorStop(0.3, '#FFA724')
    beerGradient.addColorStop(1, '#DD6102')
    ctx.fillStyle = beerGradient
    ctx.fill()
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Foam
    ctx.beginPath()
    ctx.ellipse(x + width/2, y + offsetY + 12 + wobble, w/2 - 8, 8, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#FAF9F6'
    ctx.fill()
    
    // Foam bubbles
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.arc(x + offsetX + 12 + i * 10, y + offsetY + 8 + wobble + Math.sin(time * 0.005 + i) * 2, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#FFF'
      ctx.fill()
    }
    
    // Handle
    ctx.beginPath()
    ctx.moveTo(x + offsetX + w - 10, y + offsetY + 20 + wobble)
    ctx.quadraticCurveTo(x + offsetX + w + 8, y + height/2, x + offsetX + w - 10, y + offsetY + h - 10 + wobble)
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.strokeStyle = '#A0522D'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Evil eyes
    ctx.fillStyle = '#DC2626'
    ctx.beginPath()
    ctx.arc(x + width/2 - 8, y + height/2 - 5 + wobble, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + width/2 + 8, y + height/2 - 5 + wobble, 4, 0, Math.PI * 2)
    ctx.fill()
    
    // Evil pupils
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(x + width/2 - 8, y + height/2 - 5 + wobble, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + width/2 + 8, y + height/2 - 5 + wobble, 2, 0, Math.PI * 2)
    ctx.fill()
    
    // Evil smile
    ctx.beginPath()
    ctx.arc(x + width/2, y + height/2 + 8 + wobble, 8, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.strokeStyle = '#DC2626'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Health bar
    const healthPercent = enemy.health / enemy.maxHealth
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(x, y + height + 5, width, 6)
    ctx.fillStyle = healthPercent > 0.5 ? '#22C55E' : healthPercent > 0.25 ? '#F59E0B' : '#EF4444'
    ctx.fillRect(x + 1, y + height + 6, (width - 2) * healthPercent, 4)
    
    ctx.restore()
  }, [])
  
  // Draw boss (evil cat)
  const drawBoss = useCallback((ctx: CanvasRenderingContext2D, boss: BossEntity, time: number) => {
    ctx.save()
    
    const { x, y, width, height, animFrame, phase } = boss
    const bounce = Math.sin(animFrame * 0.15) * 5
    const breathe = Math.sin(time * 0.003) * 3
    
    // Boss aura
    ctx.beginPath()
    ctx.arc(x + width/2, y + height/2, width * 0.8, 0, Math.PI * 2)
    const auraGradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, width * 0.8)
    auraGradient.addColorStop(0, 'rgba(220, 38, 38, 0)')
    auraGradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.2)')
    auraGradient.addColorStop(1, 'rgba(220, 38, 38, 0.5)')
    ctx.fillStyle = auraGradient
    ctx.fill()
    
    // Body (larger, more menacing)
    ctx.beginPath()
    ctx.ellipse(x + width/2, y + height/2 + 10 + bounce, width/2 - 10 + breathe, height/2 - 15 + breathe, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#1F2937'
    ctx.fill()
    ctx.strokeStyle = '#DC2626'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Head
    ctx.beginPath()
    ctx.ellipse(x + width/2, y + 25 + bounce, 30, 24, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#1F2937'
    ctx.fill()
    ctx.stroke()
    
    // Crown
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.moveTo(x + width/2 - 25, y + 10 + bounce)
    ctx.lineTo(x + width/2 - 20, y - 15 + bounce)
    ctx.lineTo(x + width/2 - 10, y + bounce)
    ctx.lineTo(x + width/2, y - 20 + bounce)
    ctx.lineTo(x + width/2 + 10, y + bounce)
    ctx.lineTo(x + width/2 + 20, y - 15 + bounce)
    ctx.lineTo(x + width/2 + 25, y + 10 + bounce)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#B8860B'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Crown jewels
    ctx.fillStyle = '#DC2626'
    ctx.beginPath()
    ctx.arc(x + width/2, y - 12 + bounce, 4, 0, Math.PI * 2)
    ctx.fill()
    
    // Evil ears
    ctx.fillStyle = '#1F2937'
    ctx.beginPath()
    ctx.moveTo(x + width/2 - 25, y + 15 + bounce)
    ctx.lineTo(x + width/2 - 35, y - 15 + bounce)
    ctx.lineTo(x + width/2 - 10, y + 10 + bounce)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(x + width/2 + 25, y + 15 + bounce)
    ctx.lineTo(x + width/2 + 35, y - 15 + bounce)
    ctx.lineTo(x + width/2 + 10, y + 10 + bounce)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Glowing evil eyes
    const eyeGlow = Math.sin(time * 0.01) * 0.3 + 0.7
    ctx.fillStyle = `rgba(220, 38, 38, ${eyeGlow})`
    ctx.shadowColor = '#DC2626'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.ellipse(x + width/2 - 12, y + 22 + bounce, 8, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(x + width/2 + 12, y + 22 + bounce, 8, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Slit pupils
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(x + width/2 - 12, y + 22 + bounce, 2, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(x + width/2 + 12, y + 22 + bounce, 2, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Evil grin
    ctx.strokeStyle = '#DC2626'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(x + width/2, y + 38 + bounce, 12, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()
    
    // Fangs
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.moveTo(x + width/2 - 8, y + 42 + bounce)
    ctx.lineTo(x + width/2 - 5, y + 50 + bounce)
    ctx.lineTo(x + width/2 - 2, y + 42 + bounce)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x + width/2 + 8, y + 42 + bounce)
    ctx.lineTo(x + width/2 + 5, y + 50 + bounce)
    ctx.lineTo(x + width/2 + 2, y + 42 + bounce)
    ctx.closePath()
    ctx.fill()
    
    // Tail (menacing)
    ctx.beginPath()
    ctx.moveTo(x + width/2, y + height - 10)
    ctx.bezierCurveTo(
      x + width/2 + 30 + Math.sin(time * 0.005) * 20, y + height,
      x + width/2 + 50 + Math.sin(time * 0.005) * 30, y + height + 20,
      x + width/2 + 40 + Math.sin(time * 0.005) * 25, y + height + 40
    )
    ctx.strokeStyle = '#1F2937'
    ctx.lineWidth = 8
    ctx.stroke()
    ctx.strokeStyle = '#DC2626'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Health bar (larger for boss)
    const healthPercent = boss.health / boss.maxHealth
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(x, y - 25, width, 12)
    
    const healthGradient = ctx.createLinearGradient(x, 0, x + width * healthPercent, 0)
    healthGradient.addColorStop(0, '#DC2626')
    healthGradient.addColorStop(1, '#7F1D1D')
    ctx.fillStyle = healthGradient
    ctx.fillRect(x + 2, y - 23, (width - 4) * healthPercent, 8)
    
    // Boss name
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('BOSS', x + width/2, y - 30)
    
    ctx.restore()
  }, [])
  
  // Draw power-up
  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, powerUp: PowerUpItem, time: number) => {
    ctx.save()
    
    const { x, y, width, height, type } = powerUp
    const pulse = Math.sin(time * 0.008) * 0.2 + 1
    
    ctx.shadowBlur = 15
    
    const colors = {
      shield: { bg: '#3B82F6', glow: '#60A5FA' },
      double_shot: { bg: '#F59E0B', glow: '#FBBF24' },
      speed_boost: { bg: '#8B5CF6', glow: '#A78BFA' },
      triple_shot: { bg: '#EF4444', glow: '#F87171' },
      health: { bg: '#22C55E', glow: '#4ADE80' },
    }
    
    const color = colors[type]
    ctx.shadowColor = color.glow
    
    ctx.beginPath()
    ctx.arc(x + width/2, y + height/2, (width/2) * pulse, 0, Math.PI * 2)
    ctx.fillStyle = color.bg
    ctx.fill()
    
    ctx.font = `${18 * pulse}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const icons = {
      shield: '🛡️',
      double_shot: '🎯',
      speed_boost: '⚡',
      triple_shot: '🔥',
      health: '❤️',
    }
    ctx.fillText(icons[type], x + width/2, y + height/2)
    
    ctx.restore()
  }, [])

  // Initialize canvas
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const width = container.clientWidth
        const height = container.clientHeight
        setCanvasSize({ width, height })
        
        playerRef.current.x = width / 2 - playerRef.current.width / 2
        playerRef.current.y = height - 130
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Touch controls
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      touchStartRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!touchStartRef.current || !isPlaying || isPaused) return
      
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const touchX = touch.clientX - rect.left
      
      const targetX = touchX - playerRef.current.width / 2
      playerRef.current.x = Math.max(0, Math.min(canvasSize.width - playerRef.current.width, targetX))
    }
    
    const handleTouchEnd = () => {
      touchStartRef.current = null
    }
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [canvasSize.width, isPlaying, isPaused])

  // Mouse controls
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPlaying || isPaused) return
      
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      
      const targetX = mouseX - playerRef.current.width / 2
      playerRef.current.x = Math.max(0, Math.min(canvasSize.width - playerRef.current.width, targetX))
    }
    
    canvas.addEventListener('mousemove', handleMouseMove)
    return () => canvas.removeEventListener('mousemove', handleMouseMove)
  }, [canvasSize.width, isPlaying, isPaused])

  // Spawn enemies
  const spawnEnemy = useCallback(() => {
    const types: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
    const typeIndex = Math.min(Math.floor(Math.random() * (1 + difficultyRef.current / 3)), 2)
    const type = types[typeIndex]
    
    const sizes = {
      small: { width: 40, height: 50, health: 20, points: 10, speed: 100 },
      medium: { width: 50, height: 60, health: 40, points: 25, speed: 80 },
      large: { width: 60, height: 70, health: 80, points: 50, speed: 60 },
    }
    
    const size = sizes[type]
    
    const enemy: Enemy = {
      x: Math.random() * (canvasSize.width - size.width),
      y: -size.height,
      width: size.width,
      height: size.height,
      velocityX: (Math.random() - 0.5) * 50,
      velocityY: size.speed + difficultyRef.current * 10,
      health: size.health * (1 + difficultyRef.current * 0.1),
      maxHealth: size.health * (1 + difficultyRef.current * 0.1),
      points: size.points,
      type,
      animFrame: 0,
    }
    
    enemiesRef.current.push(enemy)
  }, [canvasSize.width])

  // Spawn power-up
  const spawnPowerUp = useCallback(() => {
    const types: PowerUpItem['type'][] = ['shield', 'double_shot', 'speed_boost', 'triple_shot', 'health']
    const type = types[Math.floor(Math.random() * types.length)]
    
    const powerUp: PowerUpItem = {
      x: Math.random() * (canvasSize.width - 30),
      y: -30,
      width: 30,
      height: 30,
      velocityX: 0,
      velocityY: 80,
      type,
    }
    
    powerUpsRef.current.push(powerUp)
  }, [canvasSize.width])

  // Fire projectile
  const fireProjectile = useCallback(() => {
    const weapon = weapons[currentWeaponIndex]
    if (!weapon) return
    
    const now = Date.now()
    const fireInterval = 1000 / weapon.fireRate
    
    if (now - lastFireTimeRef.current < fireInterval) return
    lastFireTimeRef.current = now
    
    const player = playerRef.current
    let projectileCount = weapon.projectileCount
    
    if (hasDoubleShot) projectileCount *= 2
    if (hasTripleShot) projectileCount *= 3
    
    const spreadAngle = projectileCount > 1 ? 30 : 0
    const angleStep = projectileCount > 1 ? spreadAngle / (projectileCount - 1) : 0
    const startAngle = -spreadAngle / 2
    
    for (let i = 0; i < projectileCount; i++) {
      const angle = (startAngle + angleStep * i) * (Math.PI / 180)
      const velocityX = Math.sin(angle) * weapon.projectileSpeed * 0.3
      const velocityY = -weapon.projectileSpeed
      
      const projectile: Projectile = {
        x: player.x + player.width / 2 - 6,
        y: player.y,
        width: 12,
        height: 12,
        velocityX,
        velocityY,
        damage: weapon.damage,
        isEnemy: false,
      }
      
      projectilesRef.current.push(projectile)
    }
  }, [weapons, currentWeaponIndex, hasDoubleShot, hasTripleShot])

  // Collision detection
  const checkCollision = useCallback((a: Entity, b: Entity): boolean => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    )
  }, [])

  // Game loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    
    const gameLoop = (timestamp: number) => {
      const deltaTime = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp
      gameTimeRef.current = timestamp
      
      // Add meters based on time
      addMeters(deltaTime * 100)
      checkLevelUp()
      
      // Check for boss spawn
      const newBoss = spawnBoss()
      if (newBoss && !bossRef.current) {
        bossRef.current = {
          x: canvasSize.width / 2 - 50,
          y: 50,
          width: 100,
          height: 120,
          velocityX: 50,
          velocityY: 0,
          health: newBoss.health,
          maxHealth: newBoss.maxHealth,
          points: newBoss.points,
          animFrame: 0,
          animTimer: 0,
          attackTimer: 0,
          phase: 1,
        }
      }
      
      // Clear canvas
      ctx.fillStyle = '#0d0d0d'
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)
      
      // Draw starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      for (let i = 0; i < 50; i++) {
        const x = (i * 73 + timestamp * 0.02) % canvasSize.width
        const y = (i * 37 + timestamp * 0.05) % canvasSize.height
        ctx.beginPath()
        ctx.arc(x, y, 1 + Math.sin(timestamp * 0.001 + i) * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Auto-fire
      fireProjectile()
      
      // Spawn enemies (less if boss is active)
      spawnTimerRef.current += deltaTime
      const spawnRate = bossRef.current ? 3 : 1.5 / (1 + difficultyRef.current * 0.1)
      if (spawnTimerRef.current > spawnRate) {
        spawnEnemy()
        spawnTimerRef.current = 0
        
        if (Math.random() < 0.15) {
          spawnPowerUp()
        }
      }
      
      difficultyRef.current = 1 + score / 500
      
      updatePowerUpTimers(deltaTime)
      
      // Update player animation
      playerRef.current.animFrame++
      
      // Update and draw projectiles
      projectilesRef.current = projectilesRef.current.filter(proj => {
        proj.x += proj.velocityX * deltaTime
        proj.y += proj.velocityY * deltaTime
        
        if (proj.y < -20 || proj.y > canvasSize.height + 20) return false
        
        if (!proj.isEnemy) {
          drawProjectile(ctx, proj.x, proj.y, proj.width, proj.height, timestamp)
        } else {
          ctx.fillStyle = '#DC2626'
          ctx.beginPath()
          ctx.arc(proj.x + proj.width/2, proj.y + proj.height/2, proj.width/2, 0, Math.PI * 2)
          ctx.fill()
        }
        
        return true
      })
      
      // Update and draw boss
      if (bossRef.current) {
        const boss = bossRef.current
        boss.animFrame++
        boss.x += boss.velocityX * deltaTime
        
        // Bounce off walls
        if (boss.x <= 0 || boss.x >= canvasSize.width - boss.width) {
          boss.velocityX *= -1
        }
        
        // Boss attacks
        boss.attackTimer += deltaTime
        if (boss.attackTimer > 2) {
          boss.attackTimer = 0
          // Fire projectiles at player
          for (let i = 0; i < 3; i++) {
            const angle = (Math.random() - 0.5) * 0.5
            projectilesRef.current.push({
              x: boss.x + boss.width / 2,
              y: boss.y + boss.height,
              width: 15,
              height: 15,
              velocityX: Math.sin(angle) * 100,
              velocityY: 200,
              damage: 15,
              isEnemy: true,
            })
          }
        }
        
        // Check projectile hits
        for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
          const proj = projectilesRef.current[i]
          if (!proj.isEnemy && checkCollision(proj, boss)) {
            boss.health -= proj.damage
            projectilesRef.current.splice(i, 1)
            
            if (boss.health <= 0) {
              addScore(boss.points)
              if (activeBoss) {
                defeatBoss(activeBoss.id)
              }
              bossRef.current = null
            }
          }
        }
        
        if (bossRef.current) {
          drawBoss(ctx, boss, timestamp)
        }
      }
      
      // Update and draw enemies
      enemiesRef.current = enemiesRef.current.filter(enemy => {
        enemy.x += enemy.velocityX * deltaTime
        enemy.y += enemy.velocityY * deltaTime
        enemy.animFrame++
        
        if (enemy.x <= 0 || enemy.x >= canvasSize.width - enemy.width) {
          enemy.velocityX *= -1
        }
        
        if (enemy.y > canvasSize.height + 50) {
          return false
        }
        
        for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
          const proj = projectilesRef.current[i]
          if (!proj.isEnemy && checkCollision(proj, enemy)) {
            enemy.health -= proj.damage
            projectilesRef.current.splice(i, 1)
            
            if (enemy.health <= 0) {
              addScore(enemy.points)
              return false
            }
          }
        }
        
        if (checkCollision(enemy, playerRef.current)) {
          takeDamage(20)
          return false
        }
        
        drawBeerMugEnemy(ctx, enemy, timestamp)
        return true
      })
      
      // Check enemy projectile hits on player
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const proj = projectilesRef.current[i]
        if (proj.isEnemy && checkCollision(proj, playerRef.current)) {
          takeDamage(proj.damage)
          projectilesRef.current.splice(i, 1)
        }
      }
      
      // Update and draw power-ups
      powerUpsRef.current = powerUpsRef.current.filter(powerUp => {
        powerUp.y += powerUp.velocityY * deltaTime
        
        if (powerUp.y > canvasSize.height + 50) return false
        
        if (checkCollision(powerUp, playerRef.current)) {
          if (powerUp.type === 'health') {
            heal(25)
          } else {
            activatePowerUp(powerUp.type)
          }
          return false
        }
        
        drawPowerUp(ctx, powerUp, timestamp)
        return true
      })
      
      // Draw player (cat)
      drawCat(ctx, playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height, hasShield, currentSkin.color, playerRef.current.animFrame)
      
      // Draw meters counter
      ctx.fillStyle = '#FFF'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${Math.floor(meters)}m`, canvasSize.width - 10, 20)
      
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    
    lastTimeRef.current = performance.now()
    gameLoopRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [
    isPlaying, isPaused, gameOver, canvasSize, score, meters,
    fireProjectile, spawnEnemy, spawnPowerUp, checkCollision,
    drawCat, drawProjectile, drawBeerMugEnemy, drawBoss, drawPowerUp,
    addScore, addMeters, checkLevelUp, takeDamage, heal, activatePowerUp, updatePowerUpTimers,
    hasShield, currentSkin, activeBoss, spawnBoss, defeatBoss,
  ])

  // Check game over
  useEffect(() => {
    if (health <= 0 && isPlaying) {
      endGame()
    }
  }, [health, isPlaying, endGame])

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="game-canvas touch-none w-full h-full"
      style={{ display: 'block' }}
    />
  )
}

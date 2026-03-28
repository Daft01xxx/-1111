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
  type: 'shield' | 'double_shot' | 'speed_boost' | 'triple_shot' | 'health' | 'coin'
}

interface Player extends Entity {
  baseSpeed: number
  animFrame: number
  animTimer: number
}

interface Particle {
  x: number
  y: number
  velocityX: number
  velocityY: number
  life: number
  maxLife: number
  color: string
  size: number
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
    score,
    addScore,
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
    endGame,
    currentSkin,
    incrementKills,
    addCoins,
    setGamePhase,
  } = useGameStore()

  // Game state refs (not reactive, for performance)
  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    baseSpeed: 450, // Increased from 300
    animFrame: 0,
    animTimer: 0,
  })
  
  const projectilesRef = useRef<Projectile[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const powerUpsRef = useRef<PowerUpItem[]>([])
  const particlesRef = useRef<Particle[]>([])
  const lastFireTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const difficultyRef = useRef<number>(1)
  const screenShakeRef = useRef<number>(0)
  const bossSpawnScoreRef = useRef<number>(500) // First boss at 500 points
  const bossActiveRef = useRef<boolean>(false)
  
  // Draw cute orange cat player - enhanced visuals
  const drawOrangeCat = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, hasShieldActive: boolean, skin: string, animFrame: number) => {
    ctx.save()
    
    const centerX = x + width / 2
    const centerY = y + height / 2
    const bounce = Math.sin(animFrame * 0.15) * 2
    const breathe = Math.sin(animFrame * 0.08) * 0.02 + 1 // Subtle breathing effect
    
    // Get colors based on skin
    const skinColors = getSkinColors(skin)
    
    // Outer glow effect (always visible, color based on skin)
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 1.2)
    glowGradient.addColorStop(0, skinColors.body + '20')
    glowGradient.addColorStop(0.5, skinColors.body + '10')
    glowGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, width * 1.2, 0, Math.PI * 2)
    ctx.fill()
    
    // Shield effect
    if (hasShieldActive) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, width * 0.9, 0, Math.PI * 2)
      const shieldGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.9)
      shieldGradient.addColorStop(0, 'rgba(100, 200, 255, 0)')
      shieldGradient.addColorStop(0.6, 'rgba(100, 200, 255, 0.15)')
      shieldGradient.addColorStop(0.85, 'rgba(100, 200, 255, 0.4)')
      shieldGradient.addColorStop(1, 'rgba(150, 220, 255, 0.6)')
      ctx.fillStyle = shieldGradient
      ctx.fill()
      
      // Shield ring
      ctx.strokeStyle = 'rgba(150, 220, 255, 0.8)'
      ctx.lineWidth = 2
      ctx.stroke()
    }
    
    // Cat body (oval)
    ctx.beginPath()
    ctx.ellipse(centerX, centerY + bounce, width * 0.35, height * 0.4, 0, 0, Math.PI * 2)
    ctx.fillStyle = skinColors.body
    ctx.fill()
    ctx.strokeStyle = skinColors.outline
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Cat head
    ctx.beginPath()
    ctx.arc(centerX, y + height * 0.3 + bounce, width * 0.32, 0, Math.PI * 2)
    ctx.fillStyle = skinColors.body
    ctx.fill()
    ctx.strokeStyle = skinColors.outline
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Ears
    const earSize = width * 0.15
    // Left ear
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.22, y + height * 0.15 + bounce)
    ctx.lineTo(centerX - width * 0.35, y - height * 0.05 + bounce)
    ctx.lineTo(centerX - width * 0.08, y + height * 0.12 + bounce)
    ctx.closePath()
    ctx.fillStyle = skinColors.body
    ctx.fill()
    ctx.strokeStyle = skinColors.outline
    ctx.stroke()
    // Inner ear
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.2, y + height * 0.15 + bounce)
    ctx.lineTo(centerX - width * 0.28, y + height * 0.02 + bounce)
    ctx.lineTo(centerX - width * 0.12, y + height * 0.13 + bounce)
    ctx.closePath()
    ctx.fillStyle = skinColors.innerEar
    ctx.fill()
    
    // Right ear
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.22, y + height * 0.15 + bounce)
    ctx.lineTo(centerX + width * 0.35, y - height * 0.05 + bounce)
    ctx.lineTo(centerX + width * 0.08, y + height * 0.12 + bounce)
    ctx.closePath()
    ctx.fillStyle = skinColors.body
    ctx.fill()
    ctx.strokeStyle = skinColors.outline
    ctx.stroke()
    // Inner ear
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.2, y + height * 0.15 + bounce)
    ctx.lineTo(centerX + width * 0.28, y + height * 0.02 + bounce)
    ctx.lineTo(centerX + width * 0.12, y + height * 0.13 + bounce)
    ctx.closePath()
    ctx.fillStyle = skinColors.innerEar
    ctx.fill()
    
    // Eyes
    const eyeY = y + height * 0.28 + bounce
    const eyeSpacing = width * 0.12
    
    // Left eye
    ctx.beginPath()
    ctx.ellipse(centerX - eyeSpacing, eyeY, width * 0.08, height * 0.1, 0, 0, Math.PI * 2)
    ctx.fillStyle = skinColors.eyes
    ctx.fill()
    // Pupil
    ctx.beginPath()
    ctx.ellipse(centerX - eyeSpacing, eyeY + 1, width * 0.04, height * 0.06, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#111'
    ctx.fill()
    // Eye shine
    ctx.beginPath()
    ctx.arc(centerX - eyeSpacing - 2, eyeY - 2, width * 0.02, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    
    // Right eye
    ctx.beginPath()
    ctx.ellipse(centerX + eyeSpacing, eyeY, width * 0.08, height * 0.1, 0, 0, Math.PI * 2)
    ctx.fillStyle = skinColors.eyes
    ctx.fill()
    // Pupil
    ctx.beginPath()
    ctx.ellipse(centerX + eyeSpacing, eyeY + 1, width * 0.04, height * 0.06, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#111'
    ctx.fill()
    // Eye shine
    ctx.beginPath()
    ctx.arc(centerX + eyeSpacing - 2, eyeY - 2, width * 0.02, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    
    // Nose
    ctx.beginPath()
    ctx.moveTo(centerX, y + height * 0.38 + bounce)
    ctx.lineTo(centerX - width * 0.04, y + height * 0.42 + bounce)
    ctx.lineTo(centerX + width * 0.04, y + height * 0.42 + bounce)
    ctx.closePath()
    ctx.fillStyle = skinColors.nose
    ctx.fill()
    
    // Mouth
    ctx.beginPath()
    ctx.moveTo(centerX, y + height * 0.42 + bounce)
    ctx.lineTo(centerX, y + height * 0.46 + bounce)
    ctx.quadraticCurveTo(centerX - width * 0.08, y + height * 0.5 + bounce, centerX - width * 0.12, y + height * 0.46 + bounce)
    ctx.strokeStyle = skinColors.outline
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX, y + height * 0.46 + bounce)
    ctx.quadraticCurveTo(centerX + width * 0.08, y + height * 0.5 + bounce, centerX + width * 0.12, y + height * 0.46 + bounce)
    ctx.stroke()
    
    // Whiskers
    ctx.strokeStyle = skinColors.whiskers
    ctx.lineWidth = 1
    // Left whiskers
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.15, y + height * 0.4 + bounce)
    ctx.lineTo(centerX - width * 0.4, y + height * 0.35 + bounce)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.15, y + height * 0.43 + bounce)
    ctx.lineTo(centerX - width * 0.4, y + height * 0.43 + bounce)
    ctx.stroke()
    // Right whiskers
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.15, y + height * 0.4 + bounce)
    ctx.lineTo(centerX + width * 0.4, y + height * 0.35 + bounce)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.15, y + height * 0.43 + bounce)
    ctx.lineTo(centerX + width * 0.4, y + height * 0.43 + bounce)
    ctx.stroke()
    
    // Tail (animated)
    const tailWag = Math.sin(animFrame * 0.2) * 15
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.25, centerY + height * 0.25 + bounce)
    ctx.quadraticCurveTo(
      centerX + width * 0.5 + tailWag * 0.5, centerY + height * 0.1 + bounce,
      centerX + width * 0.4 + tailWag, centerY - height * 0.2 + bounce
    )
    ctx.strokeStyle = skinColors.body
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.strokeStyle = skinColors.outline
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Speed boost trail effect
    if (hasSpeedBoost) {
      ctx.globalAlpha = 0.3
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath()
        ctx.ellipse(centerX, centerY + i * 15 + bounce, width * 0.3 - i * 3, height * 0.35 - i * 3, 0, 0, Math.PI * 2)
        ctx.fillStyle = skinColors.body
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    
    ctx.restore()
  }, [])
  
  // Get skin colors
  const getSkinColors = (skin: string) => {
    switch (skin) {
      case 'space_suit':
        return {
          body: '#E8E8E8',
          outline: '#666',
          innerEar: '#FFB6C1',
          eyes: '#87CEEB',
          nose: '#FF6B6B',
          whiskers: '#888',
        }
      case 'neon_glow':
        return {
          body: '#1a1a2e',
          outline: '#00ff88',
          innerEar: '#ff00ff',
          eyes: '#00ffff',
          nose: '#ff00ff',
          whiskers: '#00ff88',
        }
      case 'golden_cat':
        return {
          body: '#FFD700',
          outline: '#B8860B',
          innerEar: '#FFF8DC',
          eyes: '#4169E1',
          nose: '#CD853F',
          whiskers: '#B8860B',
        }
      case 'shadow_hunter':
        return {
          body: '#2d2d2d',
          outline: '#111',
          innerEar: '#444',
          eyes: '#ff3333',
          nose: '#333',
          whiskers: '#555',
        }
      case 'cosmic_avatar':
        return {
          body: 'linear-gradient(#1a0033, #330066)',
          outline: '#9933ff',
          innerEar: '#ff66cc',
          eyes: '#ffffff',
          nose: '#cc33ff',
          whiskers: '#9933ff',
        }
      default: // orange_default
        return {
          body: '#FF8C42',
          outline: '#CC6B2E',
          innerEar: '#FFB6C1',
          eyes: '#90EE90',
          nose: '#FF6B6B',
          whiskers: '#8B4513',
        }
    }
  }
  
  // Draw projectile (paw-shaped)
  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save()
    
    const centerX = x + width / 2
    const centerY = y + height / 2
    
    // Glow effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width)
    gradient.addColorStop(0, '#FFE66D')
    gradient.addColorStop(0.5, '#FF8C42')
    gradient.addColorStop(1, 'rgba(255, 140, 66, 0)')
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, width * 0.8, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Core
    ctx.beginPath()
    ctx.arc(centerX, centerY, width * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = '#FFF'
    ctx.fill()
    
    ctx.restore()
  }, [])
  
  // Draw alien cat enemy
  const drawAlienCatEnemy = useCallback((ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    ctx.save()
    
    const { x, y, width, height, type, animFrame } = enemy
    const centerX = x + width / 2
    const centerY = y + height / 2
    const hover = Math.sin(animFrame * 0.1) * 3
    
    // Colors based on enemy type
    const colors = {
      small: { body: '#7B68EE', glow: '#9370DB', eyes: '#FF4444' },
      medium: { body: '#20B2AA', glow: '#48D1CC', eyes: '#FFD700' },
      large: { body: '#DC143C', glow: '#FF6B6B', eyes: '#00FF00' },
      boss: { body: '#8B008B', glow: '#DA70D6', eyes: '#FFFFFF' },
    }
    
    const color = colors[type]
    
    // Alien glow
    ctx.beginPath()
    ctx.arc(centerX, centerY + hover, width * 0.6, 0, Math.PI * 2)
    const glowGradient = ctx.createRadialGradient(centerX, centerY + hover, 0, centerX, centerY + hover, width * 0.6)
    glowGradient.addColorStop(0, color.glow + '40')
    glowGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGradient
    ctx.fill()
    
    // Body
    ctx.beginPath()
    ctx.ellipse(centerX, centerY + hover, width * 0.4, height * 0.35, 0, 0, Math.PI * 2)
    ctx.fillStyle = color.body
    ctx.fill()
    ctx.strokeStyle = color.glow
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Alien ears (pointed and angular)
    // Left ear
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.25, centerY - height * 0.1 + hover)
    ctx.lineTo(centerX - width * 0.4, centerY - height * 0.5 + hover)
    ctx.lineTo(centerX - width * 0.1, centerY - height * 0.15 + hover)
    ctx.closePath()
    ctx.fillStyle = color.body
    ctx.fill()
    ctx.stroke()
    
    // Right ear
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.25, centerY - height * 0.1 + hover)
    ctx.lineTo(centerX + width * 0.4, centerY - height * 0.5 + hover)
    ctx.lineTo(centerX + width * 0.1, centerY - height * 0.15 + hover)
    ctx.closePath()
    ctx.fillStyle = color.body
    ctx.fill()
    ctx.stroke()
    
    // Alien eyes (large, glowing)
    const eyeY = centerY - height * 0.05 + hover
    
    // Left eye
    ctx.beginPath()
    ctx.ellipse(centerX - width * 0.15, eyeY, width * 0.12, height * 0.15, 0, 0, Math.PI * 2)
    ctx.fillStyle = color.eyes
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(centerX - width * 0.15, eyeY, width * 0.06, height * 0.08, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#000'
    ctx.fill()
    
    // Right eye
    ctx.beginPath()
    ctx.ellipse(centerX + width * 0.15, eyeY, width * 0.12, height * 0.15, 0, 0, Math.PI * 2)
    ctx.fillStyle = color.eyes
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(centerX + width * 0.15, eyeY, width * 0.06, height * 0.08, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#000'
    ctx.fill()
    
    // Antenna (for small enemies)
    if (type === 'small') {
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - height * 0.3 + hover)
      ctx.lineTo(centerX, centerY - height * 0.5 + hover)
      ctx.strokeStyle = color.glow
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(centerX, centerY - height * 0.5 + hover, 4, 0, Math.PI * 2)
      ctx.fillStyle = color.glow
      ctx.fill()
    }
    
    // Health bar
    const healthPercent = enemy.health / enemy.maxHealth
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(x, y + height + 5, width, 5)
    ctx.fillStyle = healthPercent > 0.5 ? '#22C55E' : healthPercent > 0.25 ? '#F59E0B' : '#EF4444'
    ctx.fillRect(x + 1, y + height + 6, (width - 2) * healthPercent, 3)
    
    ctx.restore()
  }, [])
  
  // Draw power-up
  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, powerUp: PowerUpItem) => {
    ctx.save()
    
    const { x, y, width, height, type } = powerUp
    const time = Date.now() / 1000
    const pulse = Math.sin(time * 4) * 0.2 + 1
    const centerX = x + width / 2
    const centerY = y + height / 2
    
    // Glow effect
    ctx.shadowBlur = 15
    
    const colors: Record<string, { bg: string; glow: string; icon: string }> = {
      shield: { bg: '#3B82F6', glow: '#60A5FA', icon: 'S' },
      double_shot: { bg: '#F59E0B', glow: '#FBBF24', icon: 'D' },
      speed_boost: { bg: '#8B5CF6', glow: '#A78BFA', icon: 'Z' },
      triple_shot: { bg: '#EF4444', glow: '#F87171', icon: 'T' },
      health: { bg: '#22C55E', glow: '#4ADE80', icon: '+' },
      coin: { bg: '#FFD700', glow: '#FFF8DC', icon: 'C' },
    }
    
    const color = colors[type]
    ctx.shadowColor = color.glow
    
    // Circle background
    ctx.beginPath()
    ctx.arc(centerX, centerY, (width / 2) * pulse, 0, Math.PI * 2)
    ctx.fillStyle = color.bg
    ctx.fill()
    
    // Inner circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, (width / 3) * pulse, 0, Math.PI * 2)
    ctx.fillStyle = color.glow
    ctx.fill()
    
    // Icon text
    ctx.font = `bold ${14 * pulse}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    ctx.fillText(color.icon, centerX, centerY)
    
    ctx.restore()
  }, [])
  
  // Draw particle
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    const alpha = particle.life / particle.maxLife
    ctx.globalAlpha = alpha
    ctx.fillStyle = particle.color
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }, [])
  
  // Spawn particle burst
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5
      const speed = 50 + Math.random() * 100
      particlesRef.current.push({
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color,
        size: 3 + Math.random() * 4,
      })
    }
  }, [])

  // Initialize canvas
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const width = container.clientWidth
        const height = container.clientHeight
        setCanvasSize({ width, height })
        
        // Initialize player position
        playerRef.current.x = width / 2 - playerRef.current.width / 2
        playerRef.current.y = height - 120
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

  // Mouse controls for desktop
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

  // Spawn boss enemy
  const spawnBoss = useCallback(() => {
    if (bossActiveRef.current) return
    
    bossActiveRef.current = true
    setGamePhase('boss')
    
    const boss: Enemy = {
      x: canvasSize.width / 2 - 50,
      y: -100,
      width: 80,
      height: 100,
      velocityX: 60,
      velocityY: 40,
      health: 200 + difficultyRef.current * 50,
      maxHealth: 200 + difficultyRef.current * 50,
      points: 200,
      type: 'boss',
      animFrame: 0,
    }
    
    enemiesRef.current.push(boss)
  }, [canvasSize.width, setGamePhase])
  
  // Spawn enemies
  const spawnEnemy = useCallback(() => {
    // Check if boss should spawn
    if (score >= bossSpawnScoreRef.current && !bossActiveRef.current) {
      spawnBoss()
      bossSpawnScoreRef.current += 500 // Next boss every 500 points
      return
    }
    
    const types: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
    const typeIndex = Math.min(Math.floor(Math.random() * (1 + difficultyRef.current / 3)), 2)
    const type = types[typeIndex]
    
    const sizes = {
      small: { width: 35, height: 45, health: 25, points: 15, speed: 120 },
      medium: { width: 45, height: 55, health: 50, points: 30, speed: 100 },
      large: { width: 55, height: 70, health: 100, points: 60, speed: 80 },
    }
    
    const size = sizes[type]
    
    const enemy: Enemy = {
      x: Math.random() * (canvasSize.width - size.width),
      y: -size.height,
      width: size.width,
      height: size.height,
      velocityX: (Math.random() - 0.5) * 80,
      velocityY: size.speed + difficultyRef.current * 15,
      health: size.health * (1 + difficultyRef.current * 0.1),
      maxHealth: size.health * (1 + difficultyRef.current * 0.1),
      points: size.points,
      type,
      animFrame: Math.random() * 100,
    }
    
    enemiesRef.current.push(enemy)
  }, [canvasSize.width])

  // Spawn power-up
  const spawnPowerUp = useCallback(() => {
    const types: PowerUpItem['type'][] = ['shield', 'double_shot', 'speed_boost', 'triple_shot', 'health', 'coin']
    const weights = [1, 1, 1, 1, 2, 3] // Coins more common
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight
    let typeIndex = 0
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        typeIndex = i
        break
      }
    }
    const type = types[typeIndex]
    
    const powerUp: PowerUpItem = {
      x: Math.random() * (canvasSize.width - 30),
      y: -30,
      width: 30,
      height: 30,
      velocityX: 0,
      velocityY: 100,
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
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = timestamp
      
      // Update player animation
      playerRef.current.animFrame++
      playerRef.current.animTimer += deltaTime
      
      // Screen shake decay
      screenShakeRef.current *= 0.9
      const shakeX = (Math.random() - 0.5) * screenShakeRef.current
      const shakeY = (Math.random() - 0.5) * screenShakeRef.current
      
      // Clear canvas
      ctx.save()
      ctx.translate(shakeX, shakeY)
      
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height)
      bgGradient.addColorStop(0, '#0a0a1a')
      bgGradient.addColorStop(0.5, '#0d0d20')
      bgGradient.addColorStop(1, '#0a0a1a')
      ctx.fillStyle = bgGradient
      ctx.fillRect(-10, -10, canvasSize.width + 20, canvasSize.height + 20)
      
      // Draw starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      for (let i = 0; i < 60; i++) {
        const x = (i * 73 + timestamp * 0.02) % canvasSize.width
        const y = (i * 37 + timestamp * 0.015) % canvasSize.height
        const size = (i % 3 === 0) ? 2 : 1
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Colorful nebula effects
      ctx.globalAlpha = 0.1
      ctx.fillStyle = '#8B5CF6'
      ctx.beginPath()
      ctx.arc(canvasSize.width * 0.2, canvasSize.height * 0.3, 100, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#3B82F6'
      ctx.beginPath()
      ctx.arc(canvasSize.width * 0.8, canvasSize.height * 0.6, 80, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      
      // Auto-fire
      fireProjectile()
      
      // Spawn enemies (faster spawn rate for more frequent encounters)
      spawnTimerRef.current += deltaTime
      const spawnInterval = 0.7 / (1 + difficultyRef.current * 0.25) // Much faster spawning
      if (spawnTimerRef.current > spawnInterval) {
        spawnEnemy()
        spawnTimerRef.current = 0
        
        // Spawn additional enemy at higher difficulties
        if (difficultyRef.current > 2 && Math.random() < 0.3) {
          spawnEnemy()
        }
        
        if (Math.random() < 0.25) {
          spawnPowerUp()
        }
      }
      
      // Increase difficulty over time (faster scaling)
      difficultyRef.current = 1 + score / 300
      
      // Update power-up timers
      updatePowerUpTimers(deltaTime)
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.velocityX * deltaTime
        particle.y += particle.velocityY * deltaTime
        particle.life -= deltaTime * 2
        
        if (particle.life <= 0) return false
        
        drawParticle(ctx, particle)
        return true
      })
      
      // Update and draw projectiles
      projectilesRef.current = projectilesRef.current.filter(proj => {
        proj.x += proj.velocityX * deltaTime
        proj.y += proj.velocityY * deltaTime
        
        if (proj.y < -20 || proj.y > canvasSize.height + 20) return false
        
        if (!proj.isEnemy) {
          drawProjectile(ctx, proj.x, proj.y, proj.width, proj.height)
        } else {
          ctx.fillStyle = '#EF4444'
          ctx.beginPath()
          ctx.arc(proj.x + proj.width/2, proj.y + proj.height/2, proj.width/2, 0, Math.PI * 2)
          ctx.fill()
        }
        
        return true
      })
      
      // Update and draw enemies
      enemiesRef.current = enemiesRef.current.filter(enemy => {
        enemy.x += enemy.velocityX * deltaTime
        enemy.y += enemy.velocityY * deltaTime
        enemy.animFrame++
        
        // Bounce off walls
        if (enemy.x <= 0 || enemy.x >= canvasSize.width - enemy.width) {
          enemy.velocityX *= -1
        }
        
        if (enemy.y > canvasSize.height + 50) {
          return false
        }
        
        // Check collision with player projectiles
        for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
          const proj = projectilesRef.current[i]
          if (!proj.isEnemy && checkCollision(proj, enemy)) {
            enemy.health -= proj.damage
            projectilesRef.current.splice(i, 1)
            
            // Hit particles
            spawnParticles(proj.x, proj.y, '#FFE66D', 5)
            
if (enemy.health <= 0) {
                              addScore(enemy.points)
                              incrementKills()
                              
                              // Handle boss defeat
                              if (enemy.type === 'boss') {
                                bossActiveRef.current = false
                                setGamePhase('gameplay')
                                addCoins(50) // Bonus coins for boss defeat
                                spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#FFD700', 25)
                                screenShakeRef.current = 20
                              } else {
                                spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#FF6B6B', 12)
                                screenShakeRef.current = 5
                              }
                              
                              return false
                            }
          }
        }
        
        // Check collision with player
        if (checkCollision(enemy, playerRef.current)) {
          takeDamage(20)
          screenShakeRef.current = 10
          spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#EF4444', 8)
          return false
        }
        
        drawAlienCatEnemy(ctx, enemy)
        return true
      })
      
      // Update and draw power-ups
      powerUpsRef.current = powerUpsRef.current.filter(powerUp => {
        powerUp.y += powerUp.velocityY * deltaTime
        
        if (powerUp.y > canvasSize.height + 50) return false
        
        // Check collision with player
        if (checkCollision(powerUp, playerRef.current)) {
          if (powerUp.type === 'health') {
            heal(25)
            spawnParticles(powerUp.x, powerUp.y, '#22C55E', 8)
          } else if (powerUp.type === 'coin') {
            addCoins(5)
            spawnParticles(powerUp.x, powerUp.y, '#FFD700', 8)
          } else {
            activatePowerUp(powerUp.type)
            spawnParticles(powerUp.x, powerUp.y, '#60A5FA', 8)
          }
          return false
        }
        
        drawPowerUp(ctx, powerUp)
        return true
      })
      
      // Draw player
      drawOrangeCat(
        ctx, 
        playerRef.current.x, 
        playerRef.current.y, 
        playerRef.current.width, 
        playerRef.current.height, 
        hasShield,
        currentSkin,
        playerRef.current.animFrame
      )
      
      ctx.restore()
      
      // Continue loop
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
    isPlaying, isPaused, gameOver, canvasSize, score,
    fireProjectile, spawnEnemy, spawnPowerUp, spawnBoss, checkCollision,
    drawOrangeCat, drawProjectile, drawAlienCatEnemy, drawPowerUp, drawParticle,
    addScore, takeDamage, heal, activatePowerUp, updatePowerUpTimers,
    hasShield, currentSkin, incrementKills, addCoins, spawnParticles, setGamePhase,
  ])

  // Check game over
  useEffect(() => {
    if (useGameStore.getState().health <= 0 && isPlaying) {
      endGame()
    }
  }, [isPlaying, endGame])

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

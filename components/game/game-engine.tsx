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
}

interface PowerUpItem extends Entity {
  type: 'shield' | 'double_shot' | 'speed_boost' | 'triple_shot' | 'health'
}

interface Player extends Entity {
  baseSpeed: number
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
    multiplier,
    endGame,
  } = useGameStore()

  // Game state refs (not reactive, for performance)
  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    width: 50,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    baseSpeed: 300,
  })
  
  const projectilesRef = useRef<Projectile[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const powerUpsRef = useRef<PowerUpItem[]>([])
  const lastFireTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const difficultyRef = useRef<number>(1)
  
  // Beer mug drawing function
  const drawBeerMug = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, hasShieldActive: boolean) => {
    ctx.save()
    
    // Shield effect
    if (hasShieldActive) {
      ctx.beginPath()
      ctx.arc(x + width / 2, y + height / 2, width * 0.8, 0, Math.PI * 2)
      const gradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, 0,
        x + width / 2, y + height / 2, width * 0.8
      )
      gradient.addColorStop(0, 'rgba(249, 132, 7, 0)')
      gradient.addColorStop(0.7, 'rgba(249, 132, 7, 0.2)')
      gradient.addColorStop(1, 'rgba(249, 132, 7, 0.5)')
      ctx.fillStyle = gradient
      ctx.fill()
    }
    
    // Mug body (amber beer)
    ctx.beginPath()
    ctx.roundRect(x + 5, y + 15, width - 20, height - 20, 8)
    const beerGradient = ctx.createLinearGradient(x, y, x, y + height)
    beerGradient.addColorStop(0, '#FFD78A')
    beerGradient.addColorStop(0.3, '#FFA724')
    beerGradient.addColorStop(1, '#DD6102')
    ctx.fillStyle = beerGradient
    ctx.fill()
    ctx.strokeStyle = '#B74206'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Foam on top
    ctx.beginPath()
    ctx.ellipse(x + width / 2 - 2, y + 12, width / 2 - 8, 10, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#FAF9F6'
    ctx.fill()
    
    // Foam bubbles
    const bubblePositions = [
      { x: x + 12, y: y + 8 },
      { x: x + 22, y: y + 6 },
      { x: x + 32, y: y + 9 },
      { x: x + 17, y: y + 14 },
      { x: x + 27, y: y + 12 },
    ]
    bubblePositions.forEach(pos => {
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 3 + Math.random() * 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fill()
    })
    
    // Handle
    ctx.beginPath()
    ctx.moveTo(x + width - 15, y + 20)
    ctx.quadraticCurveTo(x + width + 5, y + height / 2, x + width - 15, y + height - 10)
    ctx.strokeStyle = '#B74206'
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.strokeStyle = '#DD6102'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Highlight
    ctx.beginPath()
    ctx.moveTo(x + 10, y + 25)
    ctx.lineTo(x + 10, y + height - 15)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 3
    ctx.stroke()
    
    ctx.restore()
  }, [])
  
  // Draw foam projectile
  const drawFoamProjectile = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save()
    
    // Foam ball
    const gradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, width/2)
    gradient.addColorStop(0, '#FFFFFF')
    gradient.addColorStop(0.5, '#FAF9F6')
    gradient.addColorStop(1, '#EBE7DC')
    
    ctx.beginPath()
    ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Glow
    ctx.shadowColor = '#FFA724'
    ctx.shadowBlur = 10
    ctx.fill()
    
    ctx.restore()
  }, [])
  
  // Draw enemy (bottles of various alcohol)
  const drawEnemy = useCallback((ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    ctx.save()
    
    const { x, y, width, height, type } = enemy
    
    // Different colors based on enemy type
    const colors = {
      small: { body: '#4A5568', cap: '#2D3748', label: '#E53E3E' }, // Vodka bottle
      medium: { body: '#92400E', cap: '#78350F', label: '#F59E0B' }, // Whiskey bottle
      large: { body: '#7C3AED', cap: '#5B21B6', label: '#A78BFA' }, // Wine bottle
      boss: { body: '#059669', cap: '#047857', label: '#34D399' }, // Absinthe
    }
    
    const color = colors[type]
    
    // Bottle body
    ctx.beginPath()
    ctx.roundRect(x + width * 0.2, y + height * 0.3, width * 0.6, height * 0.65, 5)
    ctx.fillStyle = color.body
    ctx.fill()
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Bottle neck
    ctx.beginPath()
    ctx.roundRect(x + width * 0.35, y + height * 0.1, width * 0.3, height * 0.25, 3)
    ctx.fillStyle = color.body
    ctx.fill()
    ctx.stroke()
    
    // Cap
    ctx.beginPath()
    ctx.roundRect(x + width * 0.32, y, width * 0.36, height * 0.12, 2)
    ctx.fillStyle = color.cap
    ctx.fill()
    
    // Label
    ctx.beginPath()
    ctx.roundRect(x + width * 0.25, y + height * 0.45, width * 0.5, height * 0.3, 3)
    ctx.fillStyle = color.label
    ctx.fill()
    
    // Health bar
    const healthPercent = enemy.health / enemy.maxHealth
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(x, y + height + 5, width, 6)
    ctx.fillStyle = healthPercent > 0.5 ? '#22C55E' : healthPercent > 0.25 ? '#F59E0B' : '#EF4444'
    ctx.fillRect(x + 1, y + height + 6, (width - 2) * healthPercent, 4)
    
    ctx.restore()
  }, [])
  
  // Draw power-up
  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, powerUp: PowerUpItem) => {
    ctx.save()
    
    const { x, y, width, height, type } = powerUp
    const time = Date.now() / 1000
    const pulse = Math.sin(time * 4) * 0.2 + 1
    
    // Glow effect
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
    
    // Circle background
    ctx.beginPath()
    ctx.arc(x + width/2, y + height/2, (width/2) * pulse, 0, Math.PI * 2)
    ctx.fillStyle = color.bg
    ctx.fill()
    
    // Icon (emoji rendered as text)
    ctx.font = `${20 * pulse}px Arial`
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
        
        // Initialize player position
        playerRef.current.x = width / 2 - playerRef.current.width / 2
        playerRef.current.y = height - 120 // Higher position above controls
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
      
      // Move player based on touch position
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

  // Spawn enemies
  const spawnEnemy = useCallback(() => {
    const types: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
    const typeIndex = Math.min(Math.floor(Math.random() * (1 + difficultyRef.current / 3)), 2)
    const type = types[typeIndex]
    
    const sizes = {
      small: { width: 30, height: 50, health: 20, points: 10, speed: 100 },
      medium: { width: 40, height: 65, health: 40, points: 25, speed: 80 },
      large: { width: 50, height: 80, health: 80, points: 50, speed: 60 },
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
    
    // Stackable power-ups affect projectile count
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
      
      // Clear canvas
      ctx.fillStyle = '#0d0d0d'
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)
      
      // Draw starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      for (let i = 0; i < 50; i++) {
        const x = (i * 73 + timestamp * 0.02) % canvasSize.width
        const y = (i * 37 + timestamp * 0.01) % canvasSize.height
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Auto-fire
      fireProjectile()
      
      // Spawn enemies
      spawnTimerRef.current += deltaTime
      if (spawnTimerRef.current > 1.5 / (1 + difficultyRef.current * 0.1)) {
        spawnEnemy()
        spawnTimerRef.current = 0
        
        // Occasionally spawn power-up
        if (Math.random() < 0.15) {
          spawnPowerUp()
        }
      }
      
      // Increase difficulty over time
      difficultyRef.current = 1 + score / 500
      
      // Update power-up timers
      updatePowerUpTimers(deltaTime)
      
      // Update and draw projectiles
      projectilesRef.current = projectilesRef.current.filter(proj => {
        proj.x += proj.velocityX * deltaTime
        proj.y += proj.velocityY * deltaTime
        
        // Remove if off screen
        if (proj.y < -20 || proj.y > canvasSize.height + 20) return false
        
        // Draw
        if (!proj.isEnemy) {
          drawFoamProjectile(ctx, proj.x, proj.y, proj.width, proj.height)
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
        
        // Bounce off walls
        if (enemy.x <= 0 || enemy.x >= canvasSize.width - enemy.width) {
          enemy.velocityX *= -1
        }
        
        // Remove if off screen bottom
        if (enemy.y > canvasSize.height + 50) {
          return false
        }
        
        // Check collision with player projectiles
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
        
        // Check collision with player
        if (checkCollision(enemy, playerRef.current)) {
          takeDamage(20)
          return false
        }
        
        drawEnemy(ctx, enemy)
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
          } else {
            activatePowerUp(powerUp.type)
          }
          return false
        }
        
        drawPowerUp(ctx, powerUp)
        return true
      })
      
      // Draw player
      drawBeerMug(ctx, playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height, hasShield)
      
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
    fireProjectile, spawnEnemy, spawnPowerUp, checkCollision,
    drawBeerMug, drawFoamProjectile, drawEnemy, drawPowerUp,
    addScore, takeDamage, heal, activatePowerUp, updatePowerUpTimers,
    hasShield,
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

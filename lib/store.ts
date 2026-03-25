import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PowerUp {
  id: string
  name: string
  icon: string
  duration: number
  active: boolean
  timeLeft: number
}

export interface Boss {
  id: string
  name: string
  nameRu: string
  description: string
  health: number
  maxHealth: number
  damage: number
  points: number
  image: string
  defeated: boolean
}

export interface Weapon {
  id: string
  name: string
  damage: number
  fireRate: number
  projectileSpeed: number
  projectileCount: number
  unlocked: boolean
  selected: boolean
}

interface GameState {
  // Player
  score: number
  highScore: number
  health: number
  maxHealth: number
  level: number
  experience: number
  
  // Wallet
  walletAddress: string | null
  napiwasBalance: number
  multiplier: number
  
  // Game state
  isPlaying: boolean
  isPaused: boolean
  gameOver: boolean
  
  // Power-ups (stackable)
  powerUps: PowerUp[]
  hasShield: boolean
  hasDoubleShot: boolean
  hasSpeedBoost: boolean
  hasTripleShot: boolean
  
  // Weapons
  weapons: Weapon[]
  currentWeaponIndex: number
  
  // Bosses
  bosses: Boss[]
  currentBossIndex: number
  bossesDefeated: number
  
  // Audio
  musicVolume: number
  sfxVolume: number
  currentTrack: string | null
  
  // Actions
  setScore: (score: number) => void
  addScore: (points: number) => void
  setHealth: (health: number) => void
  takeDamage: (damage: number) => void
  heal: (amount: number) => void
  setLevel: (level: number) => void
  addExperience: (exp: number) => void
  
  setWallet: (address: string | null, balance: number) => void
  setMultiplier: (multiplier: number) => void
  
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  resetGame: () => void
  
  activatePowerUp: (powerUpId: string) => void
  deactivatePowerUp: (powerUpId: string) => void
  updatePowerUpTimers: (deltaTime: number) => void
  
  selectWeapon: (index: number) => void
  unlockWeapon: (weaponId: string) => void
  
  defeatBoss: (bossId: string) => void
  setCurrentBoss: (index: number) => void
  
  setMusicVolume: (volume: number) => void
  setSfxVolume: (volume: number) => void
  setCurrentTrack: (track: string | null) => void
}

const defaultWeapons: Weapon[] = [
  {
    id: 'foam_cannon',
    name: 'Foam Cannon',
    damage: 10,
    fireRate: 5,
    projectileSpeed: 400,
    projectileCount: 1,
    unlocked: true,
    selected: true,
  },
  {
    id: 'hop_blaster',
    name: 'Hop Blaster',
    damage: 15,
    fireRate: 4,
    projectileSpeed: 500,
    projectileCount: 2,
    unlocked: false,
    selected: false,
  },
  {
    id: 'malt_missile',
    name: 'Malt Missile',
    damage: 30,
    fireRate: 2,
    projectileSpeed: 300,
    projectileCount: 1,
    unlocked: false,
    selected: false,
  },
  {
    id: 'barley_beam',
    name: 'Barley Beam',
    damage: 5,
    fireRate: 15,
    projectileSpeed: 800,
    projectileCount: 1,
    unlocked: false,
    selected: false,
  },
  {
    id: 'lager_laser',
    name: 'Lager Laser',
    damage: 25,
    fireRate: 3,
    projectileSpeed: 600,
    projectileCount: 3,
    unlocked: false,
    selected: false,
  },
]

const defaultBosses: Boss[] = [
  {
    id: 'vodka_king',
    name: 'Vodka King',
    nameRu: 'Водочный Король',
    description: 'The cold-hearted ruler of hard liquor. Shoots ice shards and freezes everything in sight.',
    health: 500,
    maxHealth: 500,
    damage: 20,
    points: 1000,
    image: '/bosses/vodka-king.png',
    defeated: false,
  },
  {
    id: 'whiskey_wizard',
    name: 'Whiskey Wizard',
    nameRu: 'Виски Волшебник',
    description: 'An ancient sorcerer powered by oak barrels. Casts fiery amber spells.',
    health: 750,
    maxHealth: 750,
    damage: 25,
    points: 2000,
    image: '/bosses/whiskey-wizard.png',
    defeated: false,
  },
  {
    id: 'wine_witch',
    name: 'Wine Witch',
    nameRu: 'Винная Ведьма',
    description: 'A seductive sorceress from the vineyards. Her grape projectiles cause dizziness.',
    health: 1000,
    maxHealth: 1000,
    damage: 30,
    points: 3000,
    image: '/bosses/wine-witch.png',
    defeated: false,
  },
  {
    id: 'tequila_titan',
    name: 'Tequila Titan',
    nameRu: 'Текила Титан',
    description: 'A massive cactus warrior from Mexico. Slams the ground with agave power.',
    health: 1500,
    maxHealth: 1500,
    damage: 40,
    points: 5000,
    image: '/bosses/tequila-titan.png',
    defeated: false,
  },
  {
    id: 'absinthe_overlord',
    name: 'Absinthe Overlord',
    nameRu: 'Абсент Повелитель',
    description: 'The final boss. A hallucinogenic nightmare that warps reality itself.',
    health: 2500,
    maxHealth: 2500,
    damage: 50,
    points: 10000,
    image: '/bosses/absinthe-overlord.png',
    defeated: false,
  },
]

const defaultPowerUps: PowerUp[] = [
  { id: 'shield', name: 'Beer Shield', icon: '🛡️', duration: 10, active: false, timeLeft: 0 },
  { id: 'double_shot', name: 'Double Shot', icon: '🎯', duration: 15, active: false, timeLeft: 0 },
  { id: 'speed_boost', name: 'Speed Boost', icon: '⚡', duration: 8, active: false, timeLeft: 0 },
  { id: 'triple_shot', name: 'Triple Shot', icon: '🔥', duration: 12, active: false, timeLeft: 0 },
]

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      score: 0,
      highScore: 0,
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      
      walletAddress: null,
      napiwasBalance: 0,
      multiplier: 1.0,
      
      isPlaying: false,
      isPaused: false,
      gameOver: false,
      
      powerUps: [...defaultPowerUps],
      hasShield: false,
      hasDoubleShot: false,
      hasSpeedBoost: false,
      hasTripleShot: false,
      
      weapons: [...defaultWeapons],
      currentWeaponIndex: 0,
      
      bosses: [...defaultBosses],
      currentBossIndex: 0,
      bossesDefeated: 0,
      
      musicVolume: 0.5,
      sfxVolume: 0.7,
      currentTrack: null,
      
      // Actions
      setScore: (score) => set({ score, highScore: Math.max(score, get().highScore) }),
      addScore: (points) => {
        const multipliedPoints = Math.floor(points * get().multiplier)
        const newScore = get().score + multipliedPoints
        set({ score: newScore, highScore: Math.max(newScore, get().highScore) })
      },
      
      setHealth: (health) => set({ health: Math.min(health, get().maxHealth) }),
      takeDamage: (damage) => {
        const state = get()
        if (state.hasShield) return // Shield blocks damage
        const newHealth = Math.max(0, state.health - damage)
        if (newHealth <= 0) {
          set({ health: 0, gameOver: true, isPlaying: false })
        } else {
          set({ health: newHealth })
        }
      },
      heal: (amount) => set((state) => ({ health: Math.min(state.health + amount, state.maxHealth) })),
      
      setLevel: (level) => set({ level }),
      addExperience: (exp) => {
        const state = get()
        const newExp = state.experience + exp
        const expToLevel = state.level * 100
        if (newExp >= expToLevel) {
          set({ 
            experience: newExp - expToLevel, 
            level: state.level + 1,
            maxHealth: state.maxHealth + 10,
            health: state.health + 10,
          })
        } else {
          set({ experience: newExp })
        }
      },
      
      setWallet: (address, balance) => set({ walletAddress: address, napiwasBalance: balance }),
      setMultiplier: (multiplier) => set({ multiplier }),
      
      startGame: () => set({ 
        isPlaying: true, 
        isPaused: false, 
        gameOver: false,
        score: 0,
        health: get().maxHealth,
        powerUps: defaultPowerUps.map(p => ({ ...p, active: false, timeLeft: 0 })),
        hasShield: false,
        hasDoubleShot: false,
        hasSpeedBoost: false,
        hasTripleShot: false,
      }),
      pauseGame: () => set({ isPaused: true }),
      resumeGame: () => set({ isPaused: false }),
      endGame: () => set({ isPlaying: false, gameOver: true }),
      resetGame: () => set({ 
        score: 0,
        health: get().maxHealth,
        isPlaying: false, 
        isPaused: false, 
        gameOver: false,
        powerUps: defaultPowerUps.map(p => ({ ...p, active: false, timeLeft: 0 })),
        hasShield: false,
        hasDoubleShot: false,
        hasSpeedBoost: false,
        hasTripleShot: false,
        currentBossIndex: 0,
      }),
      
      activatePowerUp: (powerUpId) => {
        const powerUps = get().powerUps.map(p => 
          p.id === powerUpId ? { ...p, active: true, timeLeft: p.duration } : p
        )
        const updates: Partial<GameState> = { powerUps }
        
        // Set individual flags for stackable power-ups
        if (powerUpId === 'shield') updates.hasShield = true
        if (powerUpId === 'double_shot') updates.hasDoubleShot = true
        if (powerUpId === 'speed_boost') updates.hasSpeedBoost = true
        if (powerUpId === 'triple_shot') updates.hasTripleShot = true
        
        set(updates)
      },
      
      deactivatePowerUp: (powerUpId) => {
        const powerUps = get().powerUps.map(p => 
          p.id === powerUpId ? { ...p, active: false, timeLeft: 0 } : p
        )
        const updates: Partial<GameState> = { powerUps }
        
        if (powerUpId === 'shield') updates.hasShield = false
        if (powerUpId === 'double_shot') updates.hasDoubleShot = false
        if (powerUpId === 'speed_boost') updates.hasSpeedBoost = false
        if (powerUpId === 'triple_shot') updates.hasTripleShot = false
        
        set(updates)
      },
      
      updatePowerUpTimers: (deltaTime) => {
        const state = get()
        const powerUps = state.powerUps.map(p => {
          if (!p.active) return p
          const newTimeLeft = p.timeLeft - deltaTime
          if (newTimeLeft <= 0) {
            // Deactivate on next tick
            setTimeout(() => get().deactivatePowerUp(p.id), 0)
            return { ...p, timeLeft: 0 }
          }
          return { ...p, timeLeft: newTimeLeft }
        })
        set({ powerUps })
      },
      
      selectWeapon: (index) => {
        const weapons = get().weapons.map((w, i) => ({ ...w, selected: i === index }))
        set({ weapons, currentWeaponIndex: index })
      },
      
      unlockWeapon: (weaponId) => {
        const weapons = get().weapons.map(w => 
          w.id === weaponId ? { ...w, unlocked: true } : w
        )
        set({ weapons })
      },
      
      defeatBoss: (bossId) => {
        const bosses = get().bosses.map(b => 
          b.id === bossId ? { ...b, defeated: true } : b
        )
        const bossesDefeated = bosses.filter(b => b.defeated).length
        set({ bosses, bossesDefeated })
      },
      
      setCurrentBoss: (index) => set({ currentBossIndex: index }),
      
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setSfxVolume: (volume) => set({ sfxVolume: volume }),
      setCurrentTrack: (track) => set({ currentTrack: track }),
    }),
    {
      name: 'napiwas-game-storage',
      partialize: (state) => ({
        highScore: state.highScore,
        level: state.level,
        experience: state.experience,
        weapons: state.weapons,
        bosses: state.bosses,
        bossesDefeated: state.bossesDefeated,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
      }),
    }
  )
)

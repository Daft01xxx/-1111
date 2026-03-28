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
  theme: 'nebula' | 'plasma' | 'void' | 'gravity' | 'cosmic'
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
  price: number
  icon: string
}

export interface Skin {
  id: string
  name: string
  price: number
  description: string
  unlocked: boolean
}

export interface MusicTrackPurchase {
  id: string
  title: string
  price: number
  unlocked: boolean
}

interface GameState {
  // Player
  score: number
  highScore: number
  health: number
  maxHealth: number
  level: number
  experience: number
  
  // Coins & Shop
  coins: number
  totalCoinsEarned: number
  purchasedSkins: string[]
  purchasedMusic: string[]
  currentSkin: string
  skins: Skin[]
  
  // Game session tracking (for coin rewards)
  sessionStartTime: number
  sessionKills: number
  killStreak: number
  maxKillStreak: number
  
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
  gamePhase: 'menu' | 'gameplay' | 'boss' | 'gameover'
  
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
  setGamePhase: (phase: 'menu' | 'gameplay' | 'boss' | 'gameover') => void
  
  // Coin actions
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  purchaseSkin: (skinId: string) => boolean
  purchaseMusic: (trackId: string) => boolean
  purchaseWeapon: (weaponId: string) => boolean
  selectSkin: (skinId: string) => void
  
  // Session tracking
  incrementKills: () => void
  resetSession: () => void
  calculateSessionRewards: () => { scoreCoins: number; timeCoins: number; streakBonus: number; total: number }
}

const defaultWeapons: Weapon[] = [
  {
    id: 'paw_cannon',
    name: 'Paw Cannon',
    damage: 10,
    fireRate: 5,
    projectileSpeed: 600,
    projectileCount: 1,
    unlocked: true,
    selected: true,
    price: 0,
    icon: 'paw',
  },
  {
    id: 'claw_strike',
    name: 'Claw Strike',
    damage: 15,
    fireRate: 6,
    projectileSpeed: 700,
    projectileCount: 2,
    unlocked: false,
    selected: false,
    price: 500,
    icon: 'claw',
  },
  {
    id: 'whisker_missile',
    name: 'Whisker Missile',
    damage: 35,
    fireRate: 2,
    projectileSpeed: 500,
    projectileCount: 1,
    unlocked: false,
    selected: false,
    price: 1000,
    icon: 'missile',
  },
  {
    id: 'laser_beam',
    name: 'Laser Beam',
    damage: 8,
    fireRate: 18,
    projectileSpeed: 1000,
    projectileCount: 1,
    unlocked: false,
    selected: false,
    price: 1500,
    icon: 'laser',
  },
  {
    id: 'cosmic_blast',
    name: 'Cosmic Blast',
    damage: 30,
    fireRate: 4,
    projectileSpeed: 800,
    projectileCount: 3,
    unlocked: false,
    selected: false,
    price: 2500,
    icon: 'cosmic',
  },
]

const defaultBosses: Boss[] = [
  {
    id: 'nebula_prowler',
    name: 'Nebula Prowler',
    nameRu: 'Небесный Охотник',
    description: 'A cosmic feline hunter with starfield fur. Fires plasma orbs and teleports through space.',
    health: 500,
    maxHealth: 500,
    damage: 20,
    points: 1000,
    image: '/bosses/nebula-prowler.png',
    defeated: false,
    theme: 'nebula',
  },
  {
    id: 'plasma_whisker',
    name: 'Plasma Whisker',
    nameRu: 'Плазменный Усач',
    description: 'A fiery alien cat with a mane of pure plasma. Burns everything in its path with solar flames.',
    health: 750,
    maxHealth: 750,
    damage: 25,
    points: 2000,
    image: '/bosses/plasma-whisker.png',
    defeated: false,
    theme: 'plasma',
  },
  {
    id: 'void_stalker',
    name: 'Void Stalker',
    nameRu: 'Пустотный Охотник',
    description: 'A shadowy cat from the dark dimensions. Creates rifts in reality and summons void minions.',
    health: 1000,
    maxHealth: 1000,
    damage: 30,
    points: 3000,
    image: '/bosses/void-stalker.png',
    defeated: false,
    theme: 'void',
  },
  {
    id: 'gravity_crusher',
    name: 'Gravity Crusher',
    nameRu: 'Гравитационный Разрушитель',
    description: 'A massive metallic cat with cybernetic enhancements. Manipulates gravity and crushes enemies.',
    health: 1500,
    maxHealth: 1500,
    damage: 40,
    points: 5000,
    image: '/bosses/gravity-crusher.png',
    defeated: false,
    theme: 'gravity',
  },
  {
    id: 'cosmic_emperor',
    name: 'Cosmic Emperor',
    nameRu: 'Космический Император',
    description: 'The ultimate alien cat boss. A reality-warping entity with power over space and time.',
    health: 2500,
    maxHealth: 2500,
    damage: 50,
    points: 10000,
    image: '/bosses/cosmic-emperor.png',
    defeated: false,
    theme: 'cosmic',
  },
]

const defaultPowerUps: PowerUp[] = [
  { id: 'shield', name: 'Cosmic Shield', icon: 'shield', duration: 10, active: false, timeLeft: 0 },
  { id: 'double_shot', name: 'Double Claw', icon: 'target', duration: 15, active: false, timeLeft: 0 },
  { id: 'speed_boost', name: 'Hyperdrive', icon: 'zap', duration: 8, active: false, timeLeft: 0 },
  { id: 'triple_shot', name: 'Triple Strike', icon: 'flame', duration: 12, active: false, timeLeft: 0 },
]

const defaultSkins: Skin[] = [
  { id: 'orange_default', name: 'Classic Orange', price: 0, description: 'The original cute orange tabby cat', unlocked: true },
  { id: 'space_suit', name: 'Space Cadet', price: 500, description: 'A brave kitty in an astronaut suit', unlocked: false },
  { id: 'neon_glow', name: 'Neon Runner', price: 750, description: 'Cyberpunk cat with glowing neon outline', unlocked: false },
  { id: 'golden_cat', name: 'Golden Guardian', price: 1000, description: 'Luxurious cat with shimmering gold fur', unlocked: false },
  { id: 'shadow_hunter', name: 'Shadow Hunter', price: 1500, description: 'Mysterious dark ninja cat', unlocked: false },
  { id: 'cosmic_avatar', name: 'Cosmic Avatar', price: 2500, description: 'Rare galaxy-themed cat with starfield fur', unlocked: false },
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
      
      // Coins & Shop
      coins: 0,
      totalCoinsEarned: 0,
      purchasedSkins: ['orange_default'],
      purchasedMusic: [],
      currentSkin: 'orange_default',
      skins: [...defaultSkins],
      
      // Session tracking
      sessionStartTime: 0,
      sessionKills: 0,
      killStreak: 0,
      maxKillStreak: 0,
      
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
      gamePhase: 'menu' as const,
      
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
        sessionStartTime: Date.now(),
        sessionKills: 0,
        killStreak: 0,
        maxKillStreak: 0,
        gamePhase: 'gameplay' as const,
      }),
      pauseGame: () => set({ isPaused: true }),
      resumeGame: () => set({ isPaused: false }),
      endGame: () => set({ isPlaying: false, gameOver: true, gamePhase: 'gameover' as const }),
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
        gamePhase: 'menu' as const,
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
      setGamePhase: (phase) => set({ gamePhase: phase }),
      
      // Coin actions
      addCoins: (amount) => {
        const state = get()
        set({ 
          coins: state.coins + amount, 
          totalCoinsEarned: state.totalCoinsEarned + amount 
        })
      },
      
      spendCoins: (amount) => {
        const state = get()
        if (state.coins >= amount) {
          set({ coins: state.coins - amount })
          return true
        }
        return false
      },
      
      purchaseSkin: (skinId) => {
        const state = get()
        const skin = state.skins.find(s => s.id === skinId)
        if (!skin || skin.unlocked || state.coins < skin.price) return false
        
        const skins = state.skins.map(s => 
          s.id === skinId ? { ...s, unlocked: true } : s
        )
        set({ 
          skins, 
          coins: state.coins - skin.price,
          purchasedSkins: [...state.purchasedSkins, skinId]
        })
        return true
      },
      
      purchaseMusic: (trackId) => {
        const state = get()
        if (state.purchasedMusic.includes(trackId)) return false
        set({ purchasedMusic: [...state.purchasedMusic, trackId] })
        return true
      },
      
      purchaseWeapon: (weaponId) => {
        const state = get()
        const weapon = state.weapons.find(w => w.id === weaponId)
        if (!weapon || weapon.unlocked || state.coins < weapon.price) return false
        
        const weapons = state.weapons.map(w => 
          w.id === weaponId ? { ...w, unlocked: true } : w
        )
        set({ weapons, coins: state.coins - weapon.price })
        return true
      },
      
      selectSkin: (skinId) => {
        const state = get()
        const skin = state.skins.find(s => s.id === skinId)
        if (skin?.unlocked) {
          set({ currentSkin: skinId })
        }
      },
      
      // Session tracking
      incrementKills: () => {
        const state = get()
        const newKillStreak = state.killStreak + 1
        set({ 
          sessionKills: state.sessionKills + 1,
          killStreak: newKillStreak,
          maxKillStreak: Math.max(newKillStreak, state.maxKillStreak)
        })
      },
      
      resetSession: () => set({
        sessionStartTime: 0,
        sessionKills: 0,
        killStreak: 0,
        maxKillStreak: 0,
      }),
      
      calculateSessionRewards: () => {
        const state = get()
        const sessionDuration = (Date.now() - state.sessionStartTime) / 1000
        
        // Score-based: 1 coin per 100 points
        const scoreCoins = Math.floor(state.score / 100)
        
        // Time-based: 1 coin per 10 seconds survived
        const timeCoins = Math.floor(sessionDuration / 10)
        
        // Streak bonus: bonus for kill streaks
        let streakBonus = 0
        if (state.maxKillStreak >= 10) streakBonus += 50
        if (state.maxKillStreak >= 20) streakBonus += 100
        if (state.maxKillStreak >= 50) streakBonus += 250
        
        // Boss defeat bonus
        const bossBonus = state.bossesDefeated * 100
        
        const total = scoreCoins + timeCoins + streakBonus + bossBonus
        
        return { scoreCoins, timeCoins, streakBonus: streakBonus + bossBonus, total }
      },
    }),
    {
      name: 'catgame-storage',
      partialize: (state) => ({
        highScore: state.highScore,
        level: state.level,
        experience: state.experience,
        weapons: state.weapons,
        bosses: state.bosses,
        bossesDefeated: state.bossesDefeated,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
        coins: state.coins,
        totalCoinsEarned: state.totalCoinsEarned,
        purchasedSkins: state.purchasedSkins,
        purchasedMusic: state.purchasedMusic,
        currentSkin: state.currentSkin,
        skins: state.skins,
      }),
    }
  )
)

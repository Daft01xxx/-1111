import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PowerUp {
  id: string
  name: string
  nameRu: string
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
  descriptionRu: string
  health: number
  maxHealth: number
  damage: number
  points: number
  image: string
  defeated: boolean
  metersToAppear: number
}

export interface Weapon {
  id: string
  name: string
  nameRu: string
  damage: number
  fireRate: number
  projectileSpeed: number
  projectileCount: number
  unlocked: boolean
  selected: boolean
  price: number
}

export interface Skin {
  id: string
  name: string
  nameRu: string
  description: string
  unlocked: boolean
  price: number
  color: string
}

export interface MusicTrack {
  id: string
  name: string
  unlocked: boolean
  requiredLevel: number
  url: string
}

interface GameState {
  // Player
  score: number
  highScore: number
  health: number
  maxHealth: number
  level: number
  meters: number
  totalMeters: number
  
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
  
  // Weapons & Skins
  weapons: Weapon[]
  currentWeaponIndex: number
  skins: Skin[]
  currentSkinId: string
  coins: number
  
  // Bosses
  bosses: Boss[]
  currentBossIndex: number
  bossesDefeated: number
  activeBoss: Boss | null
  
  // Audio
  musicVolume: number
  sfxVolume: number
  currentTrack: string | null
  unlockedTracks: string[]
  
  // Settings
  theme: 'dark' | 'light'
  language: 'en' | 'ru'
  
  // Actions
  setScore: (score: number) => void
  addScore: (points: number) => void
  addMeters: (meters: number) => void
  setHealth: (health: number) => void
  takeDamage: (damage: number) => void
  heal: (amount: number) => void
  checkLevelUp: () => boolean
  
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
  purchaseWeapon: (weaponId: string) => boolean
  
  selectSkin: (skinId: string) => void
  purchaseSkin: (skinId: string) => boolean
  
  defeatBoss: (bossId: string) => void
  setCurrentBoss: (index: number) => void
  spawnBoss: () => Boss | null
  clearActiveBoss: () => void
  
  setMusicVolume: (volume: number) => void
  setSfxVolume: (volume: number) => void
  setCurrentTrack: (track: string | null) => void
  unlockTrack: (trackId: string) => void
  
  setTheme: (theme: 'dark' | 'light') => void
  setLanguage: (language: 'en' | 'ru') => void
  
  addCoins: (amount: number) => void
}

const defaultWeapons: Weapon[] = [
  {
    id: 'foam_cannon',
    name: 'Foam Cannon',
    nameRu: 'Пенная Пушка',
    damage: 10,
    fireRate: 5,
    projectileSpeed: 400,
    projectileCount: 1,
    unlocked: true,
    selected: true,
    price: 0,
  },
  {
    id: 'hop_blaster',
    name: 'Hop Blaster',
    nameRu: 'Хмельной Бластер',
    damage: 15,
    fireRate: 4,
    projectileSpeed: 500,
    projectileCount: 2,
    unlocked: false,
    selected: false,
    price: 500,
  },
  {
    id: 'malt_missile',
    name: 'Malt Missile',
    nameRu: 'Солодовая Ракета',
    damage: 30,
    fireRate: 2,
    projectileSpeed: 300,
    projectileCount: 1,
    unlocked: false,
    selected: false,
    price: 1000,
  },
  {
    id: 'barley_beam',
    name: 'Barley Beam',
    nameRu: 'Ячменный Луч',
    damage: 5,
    fireRate: 15,
    projectileSpeed: 800,
    projectileCount: 1,
    unlocked: false,
    selected: false,
    price: 1500,
  },
  {
    id: 'lager_laser',
    name: 'Lager Laser',
    nameRu: 'Лагерный Лазер',
    damage: 25,
    fireRate: 3,
    projectileSpeed: 600,
    projectileCount: 3,
    unlocked: false,
    selected: false,
    price: 2500,
  },
]

const defaultSkins: Skin[] = [
  {
    id: 'orange_cat',
    name: 'Orange Cat',
    nameRu: 'Рыжий Кот',
    description: 'Classic orange tabby cat',
    unlocked: true,
    price: 0,
    color: '#F97316',
  },
  {
    id: 'black_cat',
    name: 'Shadow Cat',
    nameRu: 'Тёмный Кот',
    description: 'Sleek black cat with golden eyes',
    unlocked: false,
    price: 300,
    color: '#1F2937',
  },
  {
    id: 'white_cat',
    name: 'Snow Cat',
    nameRu: 'Снежный Кот',
    description: 'Pure white fluffy cat',
    unlocked: false,
    price: 500,
    color: '#F9FAFB',
  },
  {
    id: 'golden_cat',
    name: 'Golden Cat',
    nameRu: 'Золотой Кот',
    description: 'Legendary golden cat',
    unlocked: false,
    price: 2000,
    color: '#F59E0B',
  },
  {
    id: 'neon_cat',
    name: 'Neon Cat',
    nameRu: 'Неоновый Кот',
    description: 'Cyberpunk neon cat',
    unlocked: false,
    price: 3000,
    color: '#06B6D4',
  },
]

const defaultBosses: Boss[] = [
  {
    id: 'beer_baron',
    name: 'Beer Baron',
    nameRu: 'Пивной Барон',
    description: 'A giant evil cat ruling the beer empire. Throws massive beer mugs!',
    descriptionRu: 'Гигантский злой кот, правящий пивной империей. Кидает огромные кружки пива!',
    health: 500,
    maxHealth: 500,
    damage: 20,
    points: 1000,
    image: '/images/boss1.jpg',
    defeated: false,
    metersToAppear: 10000,
  },
  {
    id: 'foam_fury',
    name: 'Foam Fury',
    nameRu: 'Пенная Ярость',
    description: 'A furious cat covered in magical foam. Creates foam tornados!',
    descriptionRu: 'Яростный кот, покрытый магической пеной. Создаёт пенные торнадо!',
    health: 750,
    maxHealth: 750,
    damage: 25,
    points: 2000,
    image: '/images/boss2.jpg',
    defeated: false,
    metersToAppear: 25000,
  },
  {
    id: 'hop_hunter',
    name: 'Hop Hunter',
    nameRu: 'Хмельной Охотник',
    description: 'A stealthy cat that hunts with hop projectiles. Fast and deadly!',
    descriptionRu: 'Скрытный кот, охотящийся хмельными снарядами. Быстрый и смертоносный!',
    health: 1000,
    maxHealth: 1000,
    damage: 30,
    points: 3000,
    image: '/images/boss3.jpg',
    defeated: false,
    metersToAppear: 50000,
  },
  {
    id: 'malt_master',
    name: 'Malt Master',
    nameRu: 'Солодовый Мастер',
    description: 'Ancient cat wizard who controls malt magic. Summons malt minions!',
    descriptionRu: 'Древний кот-волшебник, управляющий солодовой магией. Призывает солодовых миньонов!',
    health: 1500,
    maxHealth: 1500,
    damage: 40,
    points: 5000,
    image: '/images/boss4.jpg',
    defeated: false,
    metersToAppear: 80000,
  },
  {
    id: 'napiwas_emperor',
    name: 'NAPIWAS Emperor',
    nameRu: 'Император NAPIWAS',
    description: 'The ultimate boss! A godlike cat emperor with all powers combined!',
    descriptionRu: 'Финальный босс! Богоподобный император-кот с объединёнными силами!',
    health: 2500,
    maxHealth: 2500,
    damage: 50,
    points: 10000,
    image: '/images/boss5.jpg',
    defeated: false,
    metersToAppear: 100000,
  },
]

const defaultPowerUps: PowerUp[] = [
  { id: 'shield', name: 'Cat Shield', nameRu: 'Кошачий Щит', icon: '🛡️', duration: 10, active: false, timeLeft: 0 },
  { id: 'double_shot', name: 'Double Shot', nameRu: 'Двойной Выстрел', icon: '🎯', duration: 15, active: false, timeLeft: 0 },
  { id: 'speed_boost', name: 'Speed Boost', nameRu: 'Ускорение', icon: '⚡', duration: 8, active: false, timeLeft: 0 },
  { id: 'triple_shot', name: 'Triple Shot', nameRu: 'Тройной Выстрел', icon: '🔥', duration: 12, active: false, timeLeft: 0 },
]

const METERS_PER_LEVEL = 10000

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      score: 0,
      highScore: 0,
      health: 100,
      maxHealth: 100,
      level: 1,
      meters: 0,
      totalMeters: 0,
      
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
      skins: [...defaultSkins],
      currentSkinId: 'orange_cat',
      coins: 0,
      
      bosses: [...defaultBosses],
      currentBossIndex: 0,
      bossesDefeated: 0,
      activeBoss: null,
      
      musicVolume: 0.5,
      sfxVolume: 0.7,
      currentTrack: null,
      unlockedTracks: ['default'],
      
      theme: 'dark',
      language: 'ru',
      
      // Actions
      setScore: (score) => set({ score, highScore: Math.max(score, get().highScore) }),
      addScore: (points) => {
        const multipliedPoints = Math.floor(points * get().multiplier)
        const newScore = get().score + multipliedPoints
        set({ score: newScore, highScore: Math.max(newScore, get().highScore) })
      },
      
      addMeters: (meters) => {
        const state = get()
        const newMeters = state.meters + meters
        const newTotalMeters = state.totalMeters + meters
        set({ meters: newMeters, totalMeters: newTotalMeters })
      },
      
      checkLevelUp: () => {
        const state = get()
        if (state.meters >= METERS_PER_LEVEL) {
          const newLevel = state.level + 1
          const newMeters = state.meters - METERS_PER_LEVEL
          const bonusCoins = newLevel * 50
          set({ 
            level: newLevel, 
            meters: newMeters,
            maxHealth: state.maxHealth + 10,
            health: Math.min(state.health + 10, state.maxHealth + 10),
            coins: state.coins + bonusCoins,
          })
          return true
        }
        return false
      },
      
      setHealth: (health) => set({ health: Math.min(health, get().maxHealth) }),
      takeDamage: (damage) => {
        const state = get()
        if (state.hasShield) return
        const newHealth = Math.max(0, state.health - damage)
        if (newHealth <= 0) {
          set({ health: 0, gameOver: true, isPlaying: false })
        } else {
          set({ health: newHealth })
        }
      },
      heal: (amount) => set((state) => ({ health: Math.min(state.health + amount, state.maxHealth) })),
      
      setWallet: (address, balance) => set({ walletAddress: address, napiwasBalance: balance }),
      setMultiplier: (multiplier) => set({ multiplier }),
      
      startGame: () => set({ 
        isPlaying: true, 
        isPaused: false, 
        gameOver: false,
        score: 0,
        meters: 0,
        health: get().maxHealth,
        activeBoss: null,
        powerUps: defaultPowerUps.map(p => ({ ...p, active: false, timeLeft: 0 })),
        hasShield: false,
        hasDoubleShot: false,
        hasSpeedBoost: false,
        hasTripleShot: false,
      }),
      pauseGame: () => set({ isPaused: true }),
      resumeGame: () => set({ isPaused: false }),
      endGame: () => {
        const state = get()
        const earnedCoins = Math.floor(state.score / 10)
        set({ isPlaying: false, gameOver: true, coins: state.coins + earnedCoins })
      },
      resetGame: () => set({ 
        score: 0,
        meters: 0,
        health: get().maxHealth,
        isPlaying: false, 
        isPaused: false, 
        gameOver: false,
        activeBoss: null,
        powerUps: defaultPowerUps.map(p => ({ ...p, active: false, timeLeft: 0 })),
        hasShield: false,
        hasDoubleShot: false,
        hasSpeedBoost: false,
        hasTripleShot: false,
      }),
      
      activatePowerUp: (powerUpId) => {
        const powerUps = get().powerUps.map(p => 
          p.id === powerUpId ? { ...p, active: true, timeLeft: p.duration } : p
        )
        const updates: Partial<GameState> = { powerUps }
        
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
      
      selectSkin: (skinId) => set({ currentSkinId: skinId }),
      
      purchaseSkin: (skinId) => {
        const state = get()
        const skin = state.skins.find(s => s.id === skinId)
        if (!skin || skin.unlocked || state.coins < skin.price) return false
        
        const skins = state.skins.map(s => 
          s.id === skinId ? { ...s, unlocked: true } : s
        )
        set({ skins, coins: state.coins - skin.price })
        return true
      },
      
      defeatBoss: (bossId) => {
        const state = get()
        const bosses = state.bosses.map(b => 
          b.id === bossId ? { ...b, defeated: true } : b
        )
        const boss = state.bosses.find(b => b.id === bossId)
        const bossesDefeated = bosses.filter(b => b.defeated).length
        
        if (boss) {
          set({ 
            bosses, 
            bossesDefeated, 
            activeBoss: null,
            coins: state.coins + boss.points,
          })
        }
      },
      
      setCurrentBoss: (index) => set({ currentBossIndex: index }),
      
      spawnBoss: () => {
        const state = get()
        const nextBoss = state.bosses.find(b => !b.defeated && state.totalMeters >= b.metersToAppear)
        if (nextBoss && !state.activeBoss) {
          const bossInstance = { ...nextBoss, health: nextBoss.maxHealth }
          set({ activeBoss: bossInstance })
          return bossInstance
        }
        return null
      },
      
      clearActiveBoss: () => set({ activeBoss: null }),
      
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setSfxVolume: (volume) => set({ sfxVolume: volume }),
      setCurrentTrack: (track) => set({ currentTrack: track }),
      unlockTrack: (trackId) => {
        const state = get()
        if (!state.unlockedTracks.includes(trackId)) {
          set({ unlockedTracks: [...state.unlockedTracks, trackId] })
        }
      },
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    }),
    {
      name: 'napiwas-game-storage',
      partialize: (state) => ({
        highScore: state.highScore,
        level: state.level,
        totalMeters: state.totalMeters,
        weapons: state.weapons,
        skins: state.skins,
        currentSkinId: state.currentSkinId,
        bosses: state.bosses,
        bossesDefeated: state.bossesDefeated,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
        unlockedTracks: state.unlockedTracks,
        theme: state.theme,
        language: state.language,
        coins: state.coins,
      }),
    }
  )
)

// Translations
export const translations = {
  en: {
    play: 'Play',
    leaderboard: 'Leaderboard',
    daily: 'Daily',
    pvp: 'PvP Battle',
    bosses: 'Bosses',
    music: 'Music',
    shop: 'Shop',
    partners: 'Partners',
    guide: 'How to Play',
    connect: 'Connect',
    disconnect: 'Disconnect',
    highScore: 'High Score',
    level: 'Level',
    meters: 'Meters',
    coins: 'Coins',
    multiplier: 'Multiplier',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    dark: 'Dark',
    light: 'Light',
  },
  ru: {
    play: 'Играть',
    leaderboard: 'Рейтинг',
    daily: 'Ежедневно',
    pvp: 'PvP Битва',
    bosses: 'Боссы',
    music: 'Музыка',
    shop: 'Магазин',
    partners: 'Партнёры',
    guide: 'Как играть',
    connect: 'Подключить',
    disconnect: 'Отключить',
    highScore: 'Рекорд',
    level: 'Уровень',
    meters: 'Метры',
    coins: 'Монеты',
    multiplier: 'Множитель',
    settings: 'Настройки',
    theme: 'Тема',
    language: 'Язык',
    dark: 'Тёмная',
    light: 'Светлая',
  },
}

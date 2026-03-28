import { create } from 'zustand'
import { persist, type PersistStorage, type StorageValue } from 'zustand/middleware'

// NAPIWAS Token Contract Address
export const NAPIWAS_CONTRACT = 'EQDOCUp_pDBvOmGRyEDE2bnCl2cjGmAWjPsTWRt_veSsfGSn'

export interface PowerUp {
  id: string
  name: string
  nameRu: string
  icon: string
  duration: number
  active: boolean
  timeLeft: number
}

export interface Weapon {
  id: string
  name: string
  nameRu: string
  description: string
  descriptionRu: string
  damage: number
  fireRate: number
  projectileSpeed: number
  projectileCount: number
  unlocked: boolean
  price: number
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  color: string
}

export interface Skin {
  id: string
  name: string
  nameRu: string
  description: string
  descriptionRu: string
  unlocked: boolean
  price: number
  color: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
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
  
  // Wallet - uses NAPIWAS tokens as currency
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
  coins: number // In-game earned coins for small purchases
  droppedWeapons: string[] // Weapons dropped from enemies this run
  
  // Boss tracking
  bossesDefeated: number
  lastBossTime: number
  
  // Audio
  musicVolume: number
  sfxVolume: number
  
  // Settings
  theme: 'dark' | 'light'
  language: 'en' | 'ru'
  
  // Actions
  addScore: (points: number) => void
  addMeters: (meters: number) => void
  takeDamage: (damage: number) => void
  heal: (amount: number) => void
  checkLevelUp: () => boolean
  
  setWallet: (address: string | null, balance: number) => void
  setMultiplier: (multiplier: number) => void
  
  startGame: () => void
  resetGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  
  activatePowerUp: (powerUpId: string) => void
  updatePowerUpTimers: (deltaTime: number) => void
  
  selectWeapon: (index: number) => void
  unlockWeapon: (weaponId: string) => void
  purchaseWeapon: (weaponId: string) => boolean
  dropWeapon: (weaponId: string) => boolean
  
  selectSkin: (skinId: string) => void
  purchaseSkin: (skinId: string) => boolean
  
  defeatBoss: () => void
  setLastBossTime: (time: number) => void
  
  setMusicVolume: (volume: number) => void
  setSfxVolume: (volume: number) => void
  setTheme: (theme: 'dark' | 'light') => void
  setLanguage: (language: 'en' | 'ru') => void
  addCoins: (amount: number) => void
}

type PersistedGameState = Pick<
  GameState,
  | 'highScore'
  | 'level'
  | 'totalMeters'
  | 'weapons'
  | 'skins'
  | 'currentSkinId'
  | 'bossesDefeated'
  | 'musicVolume'
  | 'sfxVolume'
  | 'theme'
  | 'language'
  | 'coins'
>

// 10 Unique Weapons with varied stats
const defaultWeapons: Weapon[] = [
  {
    id: 'yarn_ball',
    name: 'Yarn Ball',
    nameRu: 'Клубок Ниток',
    description: 'Basic cat weapon. Reliable and cute!',
    descriptionRu: 'Базовое кошачье оружие. Надежное и милое!',
    damage: 10,
    fireRate: 5,
    projectileSpeed: 600,
    projectileCount: 1,
    unlocked: true,
    price: 0,
    rarity: 'common',
    color: '#FF6B6B',
  },
  {
    id: 'fish_bone',
    name: 'Fish Bone',
    nameRu: 'Рыбная Кость',
    description: 'Sharp fish bones. Double the trouble!',
    descriptionRu: 'Острые рыбные кости. Двойные неприятности!',
    damage: 8,
    fireRate: 6,
    projectileSpeed: 700,
    projectileCount: 2,
    unlocked: false,
    price: 500,
    rarity: 'common',
    color: '#E8E8E8',
  },
  {
    id: 'milk_splash',
    name: 'Milk Splash',
    nameRu: 'Молочный Всплеск',
    description: 'Rapid fire milk drops!',
    descriptionRu: 'Скорострельные капли молока!',
    damage: 5,
    fireRate: 12,
    projectileSpeed: 800,
    projectileCount: 1,
    unlocked: false,
    price: 1000,
    rarity: 'uncommon',
    color: '#FEFEFE',
  },
  {
    id: 'catnip_bomb',
    name: 'Catnip Bomb',
    nameRu: 'Кошачья Мятная Бомба',
    description: 'Explosive catnip! High damage, slow fire.',
    descriptionRu: 'Взрывная кошачья мята! Высокий урон, медленный огонь.',
    damage: 35,
    fireRate: 2,
    projectileSpeed: 400,
    projectileCount: 1,
    unlocked: false,
    price: 2000,
    rarity: 'uncommon',
    color: '#90EE90',
  },
  {
    id: 'whisker_laser',
    name: 'Whisker Laser',
    nameRu: 'Усиный Лазер',
    description: 'Pew pew! Fast laser beams from whiskers.',
    descriptionRu: 'Пиу пиу! Быстрые лазерные лучи из усов.',
    damage: 15,
    fireRate: 8,
    projectileSpeed: 1000,
    projectileCount: 1,
    unlocked: false,
    price: 3500,
    rarity: 'rare',
    color: '#FF1493',
  },
  {
    id: 'paw_punch',
    name: 'Paw Punch',
    nameRu: 'Удар Лапой',
    description: 'Triple paw strike! Wide coverage.',
    descriptionRu: 'Тройной удар лапой! Широкое покрытие.',
    damage: 12,
    fireRate: 5,
    projectileSpeed: 650,
    projectileCount: 3,
    unlocked: false,
    price: 5000,
    rarity: 'rare',
    color: '#FFA500',
  },
  {
    id: 'fur_tornado',
    name: 'Fur Tornado',
    nameRu: 'Меховое Торнадо',
    description: 'Spinning fur attack! Hits everything.',
    descriptionRu: 'Вращающаяся меховая атака! Бьет всё вокруг.',
    damage: 8,
    fireRate: 10,
    projectileSpeed: 500,
    projectileCount: 5,
    unlocked: false,
    price: 8000,
    rarity: 'epic',
    color: '#DEB887',
  },
  {
    id: 'golden_scratch',
    name: 'Golden Scratch',
    nameRu: 'Золотая Царапина',
    description: 'Legendary golden claws! Massive damage.',
    descriptionRu: 'Легендарные золотые когти! Массивный урон.',
    damage: 50,
    fireRate: 3,
    projectileSpeed: 750,
    projectileCount: 2,
    unlocked: false,
    price: 15000,
    rarity: 'epic',
    color: '#FFD700',
  },
  {
    id: 'nine_lives',
    name: 'Nine Lives',
    nameRu: 'Девять Жизней',
    description: 'Mystical attack! Nine projectiles of doom.',
    descriptionRu: 'Мистическая атака! Девять снарядов судьбы.',
    damage: 20,
    fireRate: 4,
    projectileSpeed: 600,
    projectileCount: 9,
    unlocked: false,
    price: 30000,
    rarity: 'legendary',
    color: '#9400D3',
  },
  {
    id: 'napiwas_beam',
    name: 'NAPIWAS Beam',
    nameRu: 'Луч NAPIWAS',
    description: 'ULTIMATE! The power of NAPIWAS token!',
    descriptionRu: 'УЛЬТИМАТИВНОЕ! Сила токена NAPIWAS!',
    damage: 100,
    fireRate: 2,
    projectileSpeed: 1200,
    projectileCount: 3,
    unlocked: false,
    price: 100000,
    rarity: 'legendary',
    color: '#F97316',
  },
]

// 10 Unique Cat Skins with varied prices
const defaultSkins: Skin[] = [
  {
    id: 'orange_cat',
    name: 'Orange Tabby',
    nameRu: 'Рыжий Котик',
    description: 'Classic orange tabby cat. The original NAPIWAS hero!',
    descriptionRu: 'Классический рыжий котик. Оригинальный герой NAPIWAS!',
    unlocked: true,
    price: 0,
    color: '#F97316',
    rarity: 'common',
  },
  {
    id: 'gray_cat',
    name: 'Gray Kitty',
    nameRu: 'Серый Котёнок',
    description: 'Sleek gray fur with silver highlights.',
    descriptionRu: 'Гладкая серая шерсть с серебряными бликами.',
    unlocked: false,
    price: 200,
    color: '#6B7280',
    rarity: 'common',
  },
  {
    id: 'black_cat',
    name: 'Shadow Cat',
    nameRu: 'Теневой Кот',
    description: 'Mysterious black cat with golden eyes.',
    descriptionRu: 'Загадочный черный кот с золотыми глазами.',
    unlocked: false,
    price: 500,
    color: '#1F2937',
    rarity: 'common',
  },
  {
    id: 'white_cat',
    name: 'Snow Paw',
    nameRu: 'Снежная Лапка',
    description: 'Pure white fluffy cat. So soft!',
    descriptionRu: 'Чисто белый пушистый кот. Такой мягкий!',
    unlocked: false,
    price: 1000,
    color: '#F9FAFB',
    rarity: 'uncommon',
  },
  {
    id: 'calico_cat',
    name: 'Calico Queen',
    nameRu: 'Трехцветная Королева',
    description: 'Beautiful calico pattern. Rare and majestic!',
    descriptionRu: 'Красивый трехцветный окрас. Редкий и величественный!',
    unlocked: false,
    price: 2500,
    color: '#F59E0B',
    rarity: 'uncommon',
  },
  {
    id: 'siamese_cat',
    name: 'Siamese Prince',
    nameRu: 'Сиамский Принц',
    description: 'Elegant Siamese with blue eyes.',
    descriptionRu: 'Элегантный сиамский с голубыми глазами.',
    unlocked: false,
    price: 5000,
    color: '#D4A574',
    rarity: 'rare',
  },
  {
    id: 'ginger_ninja',
    name: 'Ginger Ninja',
    nameRu: 'Рыжий Ниндзя',
    description: 'Silent and deadly! Ninja style.',
    descriptionRu: 'Тихий и смертоносный! Стиль ниндзя.',
    unlocked: false,
    price: 10000,
    color: '#DC2626',
    rarity: 'rare',
  },
  {
    id: 'cosmic_cat',
    name: 'Cosmic Cat',
    nameRu: 'Космический Кот',
    description: 'From the stars! Galaxy fur pattern.',
    descriptionRu: 'Из звезд! Галактический узор шерсти.',
    unlocked: false,
    price: 25000,
    color: '#8B5CF6',
    rarity: 'epic',
  },
  {
    id: 'golden_emperor',
    name: 'Golden Emperor',
    nameRu: 'Золотой Император',
    description: 'Legendary golden fur. True royalty!',
    descriptionRu: 'Легендарная золотая шерсть. Истинная королевская особа!',
    unlocked: false,
    price: 50000,
    color: '#FFD700',
    rarity: 'epic',
  },
  {
    id: 'napiwas_legend',
    name: 'NAPIWAS Legend',
    nameRu: 'Легенда NAPIWAS',
    description: 'ULTIMATE! The legendary NAPIWAS cat!',
    descriptionRu: 'УЛЬТИМАТИВНЫЙ! Легендарный кот NAPIWAS!',
    unlocked: false,
    price: 150000,
    color: '#F97316',
    rarity: 'legendary',
  },
]

const defaultPowerUps: PowerUp[] = [
  { id: 'shield', name: 'Cat Shield', nameRu: 'Кошачий Щит', icon: 'shield', duration: 10, active: false, timeLeft: 0 },
  { id: 'double_shot', name: 'Double Shot', nameRu: 'Двойной Выстрел', icon: 'target', duration: 15, active: false, timeLeft: 0 },
  { id: 'speed_boost', name: 'Speed Boost', nameRu: 'Ускорение', icon: 'zap', duration: 8, active: false, timeLeft: 0 },
  { id: 'triple_shot', name: 'Triple Shot', nameRu: 'Тройной Выстрел', icon: 'flame', duration: 12, active: false, timeLeft: 0 },
]

const METERS_PER_LEVEL = 10000
const BOSS_INTERVAL_MS = 60000 // 60 seconds = 1 minute

function sanitizeNumber(value: unknown, fallback: number, min = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.max(min, value)
}

function sanitizeInteger(value: unknown, fallback: number, min = 0) {
  return Math.floor(sanitizeNumber(value, fallback, min))
}

function sanitizeVolume(value: unknown, fallback: number) {
  return Math.min(1, sanitizeNumber(value, fallback, 0))
}

function sanitizeTheme(value: unknown): GameState['theme'] {
  return value === 'light' ? 'light' : 'dark'
}

function sanitizeLanguage(value: unknown): GameState['language'] {
  return value === 'en' ? 'en' : 'ru'
}

function sanitizeWeapons(value: unknown) {
  const unlockedIds = new Set(
    Array.isArray(value)
      ? value
          .filter(
            (entry): entry is Partial<Weapon> & { id: string } =>
              typeof entry === 'object' &&
              entry !== null &&
              typeof (entry as Weapon).id === 'string' &&
              (entry as Weapon).unlocked === true
          )
          .map((entry) => entry.id)
      : []
  )

  return defaultWeapons.map((weapon) =>
    unlockedIds.has(weapon.id) ? { ...weapon, unlocked: true } : { ...weapon }
  )
}

function sanitizeSkins(value: unknown) {
  const unlockedIds = new Set(
    Array.isArray(value)
      ? value
          .filter(
            (entry): entry is Partial<Skin> & { id: string } =>
              typeof entry === 'object' &&
              entry !== null &&
              typeof (entry as Skin).id === 'string' &&
              (entry as Skin).unlocked === true
          )
          .map((entry) => entry.id)
      : []
  )

  return defaultSkins.map((skin) =>
    unlockedIds.has(skin.id) ? { ...skin, unlocked: true } : { ...skin }
  )
}

function sanitizeCurrentSkinId(value: unknown, skins: Skin[]) {
  if (typeof value === 'string' && skins.some((skin) => skin.id === value && skin.unlocked)) {
    return value
  }

  return skins.find((skin) => skin.unlocked)?.id ?? defaultSkins[0].id
}

function sanitizePersistedState(persistedState: unknown, currentState: GameState): GameState {
  const persisted =
    typeof persistedState === 'object' && persistedState !== null
      ? (persistedState as Partial<PersistedGameState>)
      : {}

  const weapons = sanitizeWeapons(persisted.weapons)
  const skins = sanitizeSkins(persisted.skins)

  return {
    ...currentState,
    highScore: sanitizeInteger(persisted.highScore, currentState.highScore),
    level: sanitizeInteger(persisted.level, currentState.level, 1),
    totalMeters: sanitizeInteger(persisted.totalMeters, currentState.totalMeters),
    weapons,
    skins,
    currentSkinId: sanitizeCurrentSkinId(persisted.currentSkinId, skins),
    bossesDefeated: sanitizeInteger(persisted.bossesDefeated, currentState.bossesDefeated),
    musicVolume: sanitizeVolume(persisted.musicVolume, currentState.musicVolume),
    sfxVolume: sanitizeVolume(persisted.sfxVolume, currentState.sfxVolume),
    theme: sanitizeTheme(persisted.theme),
    language: sanitizeLanguage(persisted.language),
    coins: sanitizeInteger(persisted.coins, currentState.coins),
  }
}

const safePersistStorage: PersistStorage<PersistedGameState> | undefined =
  typeof window === 'undefined'
    ? undefined
    : {
        getItem: (name) => {
          try {
            const rawValue = window.localStorage.getItem(name)
            if (!rawValue) return null

            const parsed = JSON.parse(rawValue) as StorageValue<PersistedGameState>
            if (!parsed || typeof parsed !== 'object' || !('state' in parsed)) {
              window.localStorage.removeItem(name)
              return null
            }

            return parsed
          } catch {
            window.localStorage.removeItem(name)
            return null
          }
        },
        setItem: (name, value) => window.localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => window.localStorage.removeItem(name),
      }

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
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
      droppedWeapons: [],
      
      bossesDefeated: 0,
      lastBossTime: 0,
      
      musicVolume: 0.5,
      sfxVolume: 0.7,
      
      theme: 'dark',
      language: 'ru',
      
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
          const bonusCoins = newLevel * 100
          set({ 
            level: newLevel, 
            meters: newMeters,
            maxHealth: state.maxHealth + 10,
            health: Math.min(state.health + 20, state.maxHealth + 10),
            coins: state.coins + bonusCoins,
          })
          return true
        }
        return false
      },
      
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
      
      setWallet: (address, balance) => {
        // Calculate multiplier based on NAPIWAS balance
        let multiplier = 1.0
        if (balance >= 1000000) multiplier = 2.0
        else if (balance >= 500000) multiplier = 1.75
        else if (balance >= 100000) multiplier = 1.5
        else if (balance >= 50000) multiplier = 1.35
        else if (balance >= 10000) multiplier = 1.2
        else if (balance >= 1000) multiplier = 1.1
        
        set({ walletAddress: address, napiwasBalance: balance, multiplier })
      },
      setMultiplier: (multiplier) => set({ multiplier }),
      
      startGame: () => set({ 
        isPlaying: true, 
        isPaused: false, 
        gameOver: false,
        score: 0,
        meters: 0,
        health: get().maxHealth,
        lastBossTime: Date.now(),
        droppedWeapons: [],
        powerUps: defaultPowerUps.map(p => ({ ...p, active: false, timeLeft: 0 })),
        hasShield: false,
        hasDoubleShot: false,
        hasSpeedBoost: false,
        hasTripleShot: false,
      }),
      resetGame: () => set((state) => ({
        score: 0,
        health: state.maxHealth,
        meters: 0,
        isPlaying: false,
        isPaused: false,
        gameOver: false,
        currentWeaponIndex: 0,
        lastBossTime: 0,
        droppedWeapons: [],
        powerUps: defaultPowerUps.map((powerUp) => ({ ...powerUp, active: false, timeLeft: 0 })),
        hasShield: false,
        hasDoubleShot: false,
        hasSpeedBoost: false,
        hasTripleShot: false,
      })),
      
      pauseGame: () => set({ isPaused: true }),
      resumeGame: () => set({ isPaused: false }),
      
      endGame: () => {
        const state = get()
        const earnedCoins = Math.floor(state.score / 10)
        set({ isPlaying: false, gameOver: true, coins: state.coins + earnedCoins })
      },
      
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
      
      updatePowerUpTimers: (deltaTime) => {
        const state = get()
        let hasShield = state.hasShield
        let hasDoubleShot = state.hasDoubleShot
        let hasSpeedBoost = state.hasSpeedBoost
        let hasTripleShot = state.hasTripleShot
        
        const powerUps = state.powerUps.map(p => {
          if (!p.active) return p
          const newTimeLeft = p.timeLeft - deltaTime
          if (newTimeLeft <= 0) {
            if (p.id === 'shield') hasShield = false
            if (p.id === 'double_shot') hasDoubleShot = false
            if (p.id === 'speed_boost') hasSpeedBoost = false
            if (p.id === 'triple_shot') hasTripleShot = false
            return { ...p, active: false, timeLeft: 0 }
          }
          return { ...p, timeLeft: newTimeLeft }
        })
        
        set({ powerUps, hasShield, hasDoubleShot, hasSpeedBoost, hasTripleShot })
      },
      
      selectWeapon: (index) => {
        const weapons = get().weapons
        if (index >= 0 && index < weapons.length && weapons[index].unlocked) {
          set({ currentWeaponIndex: index })
        }
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
        if (!weapon || weapon.unlocked) return false
        
        // Check NAPIWAS balance from wallet
        if (state.napiwasBalance < weapon.price) return false
        
        const weapons = state.weapons.map(w => 
          w.id === weaponId ? { ...w, unlocked: true } : w
        )
        set({ weapons, napiwasBalance: state.napiwasBalance - weapon.price })
        return true
      },
      
      dropWeapon: (weaponId) => {
        const state = get()
        // Don't drop if already dropped this run or already unlocked
        if (state.droppedWeapons.includes(weaponId)) return false
        const weapon = state.weapons.find(w => w.id === weaponId)
        if (!weapon || weapon.unlocked) return false
        
        const weapons = state.weapons.map(w => 
          w.id === weaponId ? { ...w, unlocked: true } : w
        )
        set({ 
          weapons, 
          droppedWeapons: [...state.droppedWeapons, weaponId]
        })
        return true
      },
      
      selectSkin: (skinId) => {
        const skin = get().skins.find(s => s.id === skinId)
        if (skin?.unlocked) {
          set({ currentSkinId: skinId })
        }
      },
      
      purchaseSkin: (skinId) => {
        const state = get()
        const skin = state.skins.find(s => s.id === skinId)
        if (!skin || skin.unlocked) return false
        
        // Check NAPIWAS balance from wallet
        if (state.napiwasBalance < skin.price) return false
        
        const skins = state.skins.map(s => 
          s.id === skinId ? { ...s, unlocked: true } : s
        )
        set({ skins, napiwasBalance: state.napiwasBalance - skin.price })
        return true
      },
      
      defeatBoss: () => {
        const state = get()
        const bonusCoins = 500 + state.bossesDefeated * 100
        set({ 
          bossesDefeated: state.bossesDefeated + 1,
          coins: state.coins + bonusCoins,
          lastBossTime: Date.now()
        })
      },
      
      setLastBossTime: (time) => set({ lastBossTime: time }),
      
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setSfxVolume: (volume) => set({ sfxVolume: volume }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    }),
    {
      name: 'napiwas-game-storage',
      storage: safePersistStorage,
      partialize: (state) => ({
        highScore: state.highScore,
        level: state.level,
        totalMeters: state.totalMeters,
        weapons: state.weapons,
        skins: state.skins,
        currentSkinId: state.currentSkinId,
        bossesDefeated: state.bossesDefeated,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
        theme: state.theme,
        language: state.language,
        coins: state.coins,
      }),
      merge: (persistedState, currentState) => sanitizePersistedState(persistedState, currentState),
    }
  )
)

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
  },
}

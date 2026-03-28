'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Coins, Check, Lock, Sparkles, Sword, Music, Palette } from 'lucide-react'
import Link from 'next/link'

type TabType = 'skins' | 'weapons' | 'music'

const MUSIC_TRACKS = [
  { id: 'neon_nights', title: 'Neon Nights', artist: 'SynthCat', price: 200, style: 'Synthwave' },
  { id: 'galactic_groove', title: 'Galactic Groove', artist: 'CosmicBeat', price: 300, style: 'Electronic' },
  { id: 'cosmic_drift', title: 'Cosmic Drift', artist: 'SpaceAmbient', price: 400, style: 'Chill Ambient' },
  { id: 'battle_cry', title: 'Battle Cry', artist: 'EpicOrch', price: 500, style: 'Epic Orchestral' },
  { id: 'stardust_rush', title: 'Stardust Rush', artist: 'EDMaster', price: 600, style: 'Fast EDM' },
  { id: 'void_walker', title: 'Void Walker', artist: 'DarkAtmos', price: 800, style: 'Dark Atmospheric' },
  { id: 'victory_anthem', title: 'Victory Anthem', artist: 'Triumphant', price: 1000, style: 'Triumphant Theme' },
]

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<TabType>('skins')
  const { 
    coins, 
    skins, 
    weapons, 
    currentSkin,
    purchasedMusic,
    purchaseSkin, 
    purchaseWeapon,
    purchaseMusic,
    selectSkin,
    spendCoins,
  } = useGameStore()

  const tabs: { id: TabType; label: string; icon: typeof Palette }[] = [
    { id: 'skins', label: 'Skins', icon: Palette },
    { id: 'weapons', label: 'Weapons', icon: Sword },
    { id: 'music', label: 'Music', icon: Music },
  ]

  const handlePurchaseMusic = (trackId: string, price: number) => {
    if (spendCoins(price)) {
      purchaseMusic(trackId)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-foam-100" />
          </Link>
          <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Shop
          </h1>
          {/* Coin balance - prominent display */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl px-4 py-2 border border-amber-500/30">
            <div className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center">
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{coins.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[65px] z-10 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 px-4 py-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-dark-950' 
                  : 'bg-dark-800 text-foam-400 hover:bg-dark-700'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'skins' && (
            <motion.div
              key="skins"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-sm text-foam-500 mb-4">Customize your cat with unique skins</p>
              {skins.map((skin) => (
                <SkinCard
                  key={skin.id}
                  skin={skin}
                  isSelected={currentSkin === skin.id}
                  onPurchase={() => purchaseSkin(skin.id)}
                  onSelect={() => selectSkin(skin.id)}
                  canAfford={coins >= skin.price}
                  currentCoins={coins}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'weapons' && (
            <motion.div
              key="weapons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-sm text-foam-500 mb-4">Upgrade your arsenal with powerful weapons</p>
              {weapons.map((weapon) => (
                <WeaponCard
                  key={weapon.id}
                  weapon={weapon}
                  onPurchase={() => purchaseWeapon(weapon.id)}
                  canAfford={coins >= weapon.price}
                  currentCoins={coins}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-sm text-foam-500 mb-4">Unlock premium tracks for your gameplay</p>
              {MUSIC_TRACKS.map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  isOwned={purchasedMusic.includes(track.id)}
                  onPurchase={() => handlePurchaseMusic(track.id, track.price)}
                  canAfford={coins >= track.price}
                  currentCoins={coins}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SkinCard({ 
  skin, 
  isSelected, 
  onPurchase, 
  onSelect,
  canAfford,
  currentCoins
}: { 
  skin: { id: string; name: string; price: number; description: string; unlocked: boolean }
  isSelected: boolean
  onPurchase: () => void
  onSelect: () => void
  canAfford: boolean
  currentCoins: number
}) {
  const coinsNeeded = skin.price - currentCoins
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        relative overflow-hidden rounded-xl border p-4
        ${isSelected 
          ? 'bg-amber-500/10 border-amber-500/50' 
          : skin.unlocked 
            ? 'bg-dark-900 border-dark-700' 
            : canAfford 
              ? 'bg-dark-900/50 border-green-500/30'
              : 'bg-dark-900/50 border-dark-800'
        }
      `}
    >
      {/* Affordability indicator */}
      {!skin.unlocked && canAfford && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400">
            CAN BUY
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {/* Skin preview with coin indicator */}
        <div className="relative">
          <div className={`
            w-16 h-16 rounded-xl flex items-center justify-center
            ${skin.unlocked ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-dark-800'}
          `}>
            <CatSkinIcon skinId={skin.id} />
          </div>
          {/* Coin icon badge for premium skins */}
          {skin.price > 0 && !skin.unlocked && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
              <Coins className="w-3 h-3 text-dark-950" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foam-100">{skin.name}</h3>
            {isSelected && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                EQUIPPED
              </span>
            )}
            {skin.price === 0 && !skin.unlocked && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400">
                FREE
              </span>
            )}
          </div>
          <p className="text-xs text-foam-500 mt-0.5">{skin.description}</p>
          {/* Show coins needed if can't afford */}
          {!skin.unlocked && !canAfford && skin.price > 0 && (
            <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
              <Coins className="w-3 h-3" />
              Need {coinsNeeded.toLocaleString()} more coins
            </p>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {skin.unlocked ? (
            isSelected ? (
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-amber-400" />
              </div>
            ) : (
              <button
                onClick={onSelect}
                className="px-4 py-2 rounded-lg bg-dark-700 text-foam-100 text-sm font-medium hover:bg-dark-600 transition-colors"
              >
                Equip
              </button>
            )
          ) : (
            <button
              onClick={onPurchase}
              disabled={!canAfford}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all
                ${canAfford 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-dark-950 hover:brightness-110 hover:scale-105' 
                  : 'bg-dark-700 text-foam-500 cursor-not-allowed opacity-60'
                }
              `}
            >
              <Coins className="w-4 h-4" />
              {skin.price}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function WeaponCard({ 
  weapon, 
  onPurchase, 
  canAfford,
  currentCoins
}: { 
  weapon: { id: string; name: string; price: number; damage: number; fireRate: number; unlocked: boolean; icon: string }
  onPurchase: () => void
  canAfford: boolean
  currentCoins: number
}) {
  const coinsNeeded = weapon.price - currentCoins
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        relative overflow-hidden rounded-xl border p-4
        ${weapon.unlocked 
          ? 'bg-dark-900 border-green-500/30' 
          : canAfford && weapon.price > 0
            ? 'bg-dark-900/50 border-amber-500/30'
            : 'bg-dark-900/50 border-dark-800'
        }
      `}
    >
      {/* Affordability indicator */}
      {!weapon.unlocked && canAfford && weapon.price > 0 && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400">
            CAN BUY
          </span>
        </div>
      )}
      <div className="flex items-center gap-4">
        {/* Weapon icon */}
        <div className={`
          w-16 h-16 rounded-xl flex items-center justify-center
          ${weapon.unlocked ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-dark-800'}
        `}>
          <WeaponIcon iconType={weapon.icon} unlocked={weapon.unlocked} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foam-100">{weapon.name}</h3>
            {weapon.unlocked && (
              <Check className="w-4 h-4 text-green-400" />
            )}
          </div>
          <div className="flex gap-4 mt-1">
            <span className="text-xs text-foam-500">DMG: <span className="text-foam-300">{weapon.damage}</span></span>
            <span className="text-xs text-foam-500">RATE: <span className="text-foam-300">{weapon.fireRate}/s</span></span>
          </div>
          {/* Show coins needed if can't afford */}
          {!weapon.unlocked && !canAfford && weapon.price > 0 && (
            <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
              <Coins className="w-3 h-3" />
              Need {coinsNeeded.toLocaleString()} more coins
            </p>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {weapon.unlocked ? (
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
          ) : weapon.price === 0 ? (
            <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-bold">Free</span>
          ) : (
            <button
              onClick={onPurchase}
              disabled={!canAfford}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all
                ${canAfford 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-dark-950 hover:brightness-110 hover:scale-105' 
                  : 'bg-dark-700 text-foam-500 cursor-not-allowed opacity-60'
                }
              `}
            >
              <Coins className="w-4 h-4" />
              {weapon.price}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function MusicCard({ 
  track, 
  isOwned, 
  onPurchase, 
  canAfford,
  currentCoins
}: { 
  track: { id: string; title: string; artist: string; price: number; style: string }
  isOwned: boolean
  onPurchase: () => void
  canAfford: boolean
  currentCoins: number
}) {
  const coinsNeeded = track.price - currentCoins
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        relative overflow-hidden rounded-xl border p-4
        ${isOwned 
          ? 'bg-dark-900 border-purple-500/30' 
          : canAfford
            ? 'bg-dark-900/50 border-amber-500/30'
            : 'bg-dark-900/50 border-dark-800'
        }
      `}
    >
      {/* Affordability indicator */}
      {!isOwned && canAfford && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400">
            CAN BUY
          </span>
        </div>
      )}
      <div className="flex items-center gap-4">
        {/* Music icon */}
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center
          ${isOwned ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : 'bg-dark-800'}
        `}>
          <Music className={`w-7 h-7 ${isOwned ? 'text-purple-400' : 'text-foam-600'}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foam-100">{track.title}</h3>
            {isOwned && (
              <Check className="w-4 h-4 text-purple-400" />
            )}
          </div>
          <p className="text-xs text-foam-500">{track.artist}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-dark-700 text-foam-400">
            {track.style}
          </span>
          {/* Show coins needed if can't afford */}
          {!isOwned && !canAfford && (
            <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
              <Coins className="w-3 h-3" />
              Need {coinsNeeded.toLocaleString()} more coins
            </p>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {isOwned ? (
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-purple-400" />
            </div>
          ) : (
            <button
              onClick={onPurchase}
              disabled={!canAfford}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all
                ${canAfford 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-dark-950 hover:brightness-110 hover:scale-105' 
                  : 'bg-dark-700 text-foam-500 cursor-not-allowed opacity-60'
                }
              `}
            >
              <Coins className="w-4 h-4" />
              {track.price}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CatSkinIcon({ skinId }: { skinId: string }) {
  const colors: Record<string, { body: string; accent: string }> = {
    orange_default: { body: '#FF8C42', accent: '#CC6B2E' },
    space_suit: { body: '#E8E8E8', accent: '#87CEEB' },
    neon_glow: { body: '#1a1a2e', accent: '#00ff88' },
    golden_cat: { body: '#FFD700', accent: '#B8860B' },
    shadow_hunter: { body: '#2d2d2d', accent: '#ff3333' },
    cosmic_avatar: { body: '#330066', accent: '#9933ff' },
  }
  
  const color = colors[skinId] || colors.orange_default
  
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Head */}
      <circle cx="20" cy="18" r="10" fill={color.body} />
      {/* Ears */}
      <path d="M10 14 L8 4 L16 10 Z" fill={color.body} />
      <path d="M30 14 L32 4 L24 10 Z" fill={color.body} />
      {/* Eyes */}
      <ellipse cx="16" cy="17" rx="2.5" ry="3" fill={color.accent} />
      <ellipse cx="24" cy="17" rx="2.5" ry="3" fill={color.accent} />
      <circle cx="16" cy="17.5" r="1.5" fill="#111" />
      <circle cx="24" cy="17.5" r="1.5" fill="#111" />
      {/* Nose */}
      <path d="M20 21 L18 24 L22 24 Z" fill="#FF6B6B" />
      {/* Body */}
      <ellipse cx="20" cy="32" rx="8" ry="6" fill={color.body} />
    </svg>
  )
}

function WeaponIcon({ iconType, unlocked }: { iconType: string; unlocked: boolean }) {
  const color = unlocked ? '#22C55E' : '#666'
  
  switch (iconType) {
    case 'paw':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="20" r="8" fill={color} />
          <circle cx="8" cy="12" r="4" fill={color} />
          <circle cx="16" cy="8" r="4" fill={color} />
          <circle cx="24" cy="12" r="4" fill={color} />
        </svg>
      )
    case 'claw':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 28 L12 8 L14 28" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <path d="M14 28 L16 4 L18 28" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <path d="M18 28 L20 8 L24 28" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'missile':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 4 L20 12 L20 24 L16 28 L12 24 L12 12 Z" fill={color} />
          <path d="M12 24 L8 28" stroke={color} strokeWidth="2" />
          <path d="M20 24 L24 28" stroke={color} strokeWidth="2" />
        </svg>
      )
    case 'laser':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="14" y="4" width="4" height="24" fill={color} />
          <rect x="6" y="12" width="20" height="4" fill={color} opacity="0.5" />
          <circle cx="16" cy="8" r="3" fill={color} />
        </svg>
      )
    case 'cosmic':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="2" fill="none" />
          <circle cx="16" cy="16" r="5" fill={color} />
          <circle cx="16" cy="4" r="2" fill={color} />
          <circle cx="16" cy="28" r="2" fill={color} />
          <circle cx="4" cy="16" r="2" fill={color} />
          <circle cx="28" cy="16" r="2" fill={color} />
        </svg>
      )
    default:
      return <Sword className="w-8 h-8" style={{ color }} />
  }
}

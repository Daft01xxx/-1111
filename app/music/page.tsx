'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Music, Play, Pause, Lock, Volume2, ArrowLeft, SkipBack, SkipForward, Coins, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

// Free background tracks (auto-play based on game phase)
const FREE_TRACKS = [
  { id: 'calm_cosmos', title: 'Calm Cosmos', artist: 'Ambient Space', style: 'Menu/Calm', isFree: true, phase: 'menu' },
  { id: 'stellar_pursuit', title: 'Stellar Pursuit', artist: 'Cosmic Beat', style: 'Gameplay', isFree: true, phase: 'gameplay' },
  { id: 'boss_fury', title: 'Boss Fury', artist: 'Battle Core', style: 'Boss Fight', isFree: true, phase: 'boss' },
]

// Premium purchasable tracks
const PREMIUM_TRACKS = [
  { id: 'neon_nights', title: 'Neon Nights', artist: 'SynthCat', price: 200, style: 'Synthwave' },
  { id: 'galactic_groove', title: 'Galactic Groove', artist: 'CosmicBeat', price: 300, style: 'Electronic' },
  { id: 'cosmic_drift', title: 'Cosmic Drift', artist: 'SpaceAmbient', price: 400, style: 'Chill Ambient' },
  { id: 'battle_cry', title: 'Battle Cry', artist: 'EpicOrch', price: 500, style: 'Epic Orchestral' },
  { id: 'stardust_rush', title: 'Stardust Rush', artist: 'EDMaster', price: 600, style: 'Fast EDM' },
  { id: 'void_walker', title: 'Void Walker', artist: 'DarkAtmos', price: 800, style: 'Dark Atmospheric' },
  { id: 'victory_anthem', title: 'Victory Anthem', artist: 'Triumphant', price: 1000, style: 'Triumphant Theme' },
]

export default function MusicPage() {
  const { coins, musicVolume, setMusicVolume, purchasedMusic, purchaseMusic, spendCoins } = useGameStore()
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)

  const handlePurchase = (trackId: string, price: number) => {
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
          <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-400" />
            Music
          </h1>
          {/* Coin balance */}
          <Link href="/shop" className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg px-3 py-1.5 border border-amber-500/30 hover:border-amber-500/50 transition-colors">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-400">{coins.toLocaleString()}</span>
          </Link>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Volume control */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-foam-400" />
            <span className="text-sm text-foam-400">Music Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-sm text-foam-300 w-8">{Math.round(musicVolume * 100)}%</span>
          </div>
        </div>

        {/* Free tracks section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold text-foam-100">Free Background Tracks</h2>
          </div>
          <p className="text-xs text-foam-500 mb-3">These tracks auto-play based on your game phase</p>
          
          <div className="space-y-2">
            {FREE_TRACKS.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark-900 border border-green-500/20"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Music className="w-6 h-6 text-green-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foam-100">{track.title}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400">
                      FREE
                    </span>
                  </div>
                  <p className="text-xs text-foam-500">{track.artist}</p>
                  <span className="text-[10px] text-foam-600">{track.style}</span>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Premium tracks section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Coins className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-foam-100">Premium Tracks</h2>
          </div>
          <p className="text-xs text-foam-500 mb-3">Purchase with coins to unlock alternative gameplay music</p>
          
          <div className="space-y-2">
            {PREMIUM_TRACKS.map((track, index) => {
              const isOwned = purchasedMusic.includes(track.id)
              const canAfford = coins >= track.price
              const coinsNeeded = track.price - coins
              
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative flex items-center gap-3 p-3 rounded-xl border transition-all
                    ${isOwned 
                      ? 'bg-dark-900 border-purple-500/30' 
                      : canAfford 
                        ? 'bg-dark-900/50 border-amber-500/30'
                        : 'bg-dark-900/50 border-dark-800'
                    }
                  `}
                >
                  {/* Can buy indicator */}
                  {!isOwned && canAfford && (
                    <div className="absolute top-2 right-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400">
                        CAN BUY
                      </span>
                    </div>
                  )}
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${isOwned 
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                      : 'bg-dark-800'
                    }
                  `}>
                    {isOwned ? (
                      <Music className="w-6 h-6 text-purple-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-foam-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${isOwned ? 'text-foam-100' : 'text-foam-400'}`}>
                        {track.title}
                      </h3>
                      {isOwned && (
                        <Check className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <p className="text-xs text-foam-500">{track.artist}</p>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-dark-700 text-foam-500">
                      {track.style}
                    </span>
                    {/* Show coins needed */}
                    {!isOwned && !canAfford && (
                      <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        Need {coinsNeeded.toLocaleString()} more
                      </p>
                    )}
                  </div>
                  
                  {isOwned ? (
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-purple-400" />
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(track.id, track.price)}
                      disabled={!canAfford}
                      className={`
                        flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all
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
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Info section */}
        <div className="bg-dark-900 rounded-xl border border-purple-500/20 p-4">
          <h3 className="text-sm font-bold text-foam-100 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            How Music Works
          </h3>
          <ul className="text-xs text-foam-500 space-y-1">
            <li>- Free tracks auto-switch based on game phase (menu, gameplay, boss)</li>
            <li>- Premium tracks can be set as your preferred gameplay music</li>
            <li>- Earn coins by playing to unlock new tracks</li>
            <li>- All music loops seamlessly during gameplay</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useGameStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Play, Home, Volume2, VolumeX, Music } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PauseMenu() {
  const router = useRouter()
  const { 
    isPaused, 
    resumeGame, 
    resetGame,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
  } = useGameStore()

  if (!isPaused) return null

  const handleResume = () => {
    resumeGame()
  }

  const handleQuit = () => {
    resetGame()
    router.push('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xs bg-dark-900 rounded-2xl border border-dark-700 p-6 space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold beer-text">PAUSED</h2>
        </div>

        {/* Volume controls */}
        <div className="space-y-4">
          {/* Music */}
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-foam-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-beer-500"
            />
            <span className="text-xs text-foam-400 w-8">{Math.round(musicVolume * 100)}%</span>
          </div>

          {/* SFX */}
          <div className="flex items-center gap-3">
            {sfxVolume > 0 ? (
              <Volume2 className="w-5 h-5 text-foam-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-foam-400" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-beer-500"
            />
            <span className="text-xs text-foam-400 w-8">{Math.round(sfxVolume * 100)}%</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResume}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl beer-gradient text-dark-950 font-bold hover:brightness-110 transition-all"
          >
            <Play className="w-5 h-5" />
            Resume
          </button>
          
          <button
            onClick={handleQuit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-800 text-foam-100 font-bold hover:bg-dark-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Quit to Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

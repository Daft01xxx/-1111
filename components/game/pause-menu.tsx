'use client'

import { useGameStore, translations } from '@/lib/store'
import { Play, Home, Volume2, VolumeX, Music } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PauseMenu() {
  const router = useRouter()
  const { 
    isPaused, resumeGame, resetGame, language,
    musicVolume, sfxVolume, setMusicVolume, setSfxVolume
  } = useGameStore()

  if (!isPaused) return null

  const handleResume = () => resumeGame()
  
  const handleQuit = () => {
    resetGame()
    router.push('/')
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xs bg-[rgb(var(--card))] rounded-2xl border border-[rgb(var(--border))] p-6 space-y-6 animate-slide-up">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold gold-text">
            {language === 'ru' ? 'ПАУЗА' : 'PAUSED'}
          </h2>
        </div>

        {/* Volume Controls */}
        <div className="space-y-4">
          {/* Music */}
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-[rgb(var(--muted-foreground))]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-[rgb(var(--muted))] rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-xs text-[rgb(var(--muted-foreground))] w-8">
              {Math.round(musicVolume * 100)}%
            </span>
          </div>

          {/* SFX */}
          <div className="flex items-center gap-3">
            {sfxVolume > 0 ? (
              <Volume2 className="w-5 h-5 text-[rgb(var(--muted-foreground))]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[rgb(var(--muted-foreground))]" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-[rgb(var(--muted))] rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-xs text-[rgb(var(--muted-foreground))] w-8">
              {Math.round(sfxVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleResume}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gold-gradient text-[#1a1a1a] font-bold active:scale-[0.98] transition-transform"
          >
            <Play className="w-5 h-5" />
            {language === 'ru' ? 'Продолжить' : 'Resume'}
          </button>
          
          <button
            onClick={handleQuit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgb(var(--muted))] font-medium active:scale-[0.98] transition-transform"
          >
            <Home className="w-5 h-5" />
            {language === 'ru' ? 'Выйти в меню' : 'Quit to Menu'}
          </button>
        </div>
      </div>
    </div>
  )
}

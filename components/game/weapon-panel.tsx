'use client'

import { useGameStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WeaponPanel() {
  const { weapons, currentWeaponIndex, selectWeapon, isPlaying } = useGameStore()

  if (!isPlaying) return null

  const currentWeapon = weapons[currentWeaponIndex]
  const unlockedWeapons = weapons.filter(w => w.unlocked)

  const nextWeapon = () => {
    const nextIndex = weapons.findIndex((w, i) => i > currentWeaponIndex && w.unlocked)
    if (nextIndex !== -1) {
      selectWeapon(nextIndex)
    } else {
      // Loop to first unlocked
      const firstUnlocked = weapons.findIndex(w => w.unlocked)
      if (firstUnlocked !== -1) selectWeapon(firstUnlocked)
    }
  }

  const prevWeapon = () => {
    let prevIndex = -1
    for (let i = currentWeaponIndex - 1; i >= 0; i--) {
      if (weapons[i].unlocked) {
        prevIndex = i
        break
      }
    }
    if (prevIndex !== -1) {
      selectWeapon(prevIndex)
    } else {
      // Loop to last unlocked
      for (let i = weapons.length - 1; i >= 0; i--) {
        if (weapons[i].unlocked) {
          selectWeapon(i)
          break
        }
      }
    }
  }

  return (
    <div className="absolute bottom-32 left-0 right-0 z-20 px-4 pointer-events-none">
      <div className="flex items-center justify-center gap-2">
        {/* Previous button */}
        <button
          onClick={prevWeapon}
          disabled={unlockedWeapons.length <= 1}
          className="pointer-events-auto w-8 h-8 rounded-lg bg-dark-900/80 backdrop-blur-sm flex items-center justify-center hover:bg-dark-800 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-foam-100" />
        </button>

        {/* Weapon display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWeapon.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto flex items-center gap-3 bg-dark-900/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-beer-500/30"
          >
            {/* Weapon icon */}
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-beer-500/20 to-beer-600/20 flex items-center justify-center">
              <WeaponIcon weaponId={currentWeapon.id} />
              {!currentWeapon.unlocked && (
                <div className="absolute inset-0 bg-dark-900/80 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-foam-400" />
                </div>
              )}
            </div>

            {/* Weapon info */}
            <div className="flex flex-col min-w-[100px]">
              <span className="text-sm font-bold text-foam-100">{currentWeapon.name}</span>
              <div className="flex items-center gap-2 text-[10px] text-foam-400">
                <span>DMG: {currentWeapon.damage}</span>
                <span>|</span>
                <span>SPD: {currentWeapon.fireRate}/s</span>
              </div>
            </div>

            {/* Weapon index indicator */}
            <div className="flex gap-1">
              {weapons.map((w, i) => (
                <div
                  key={w.id}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    i === currentWeaponIndex
                      ? "bg-beer-500"
                      : w.unlocked
                        ? "bg-foam-400/50"
                        : "bg-dark-600"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <button
          onClick={nextWeapon}
          disabled={unlockedWeapons.length <= 1}
          className="pointer-events-auto w-8 h-8 rounded-lg bg-dark-900/80 backdrop-blur-sm flex items-center justify-center hover:bg-dark-800 disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-4 h-4 text-foam-100" />
        </button>
      </div>

      {/* Swipe hint */}
      {unlockedWeapons.length > 1 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-[10px] text-foam-500 mt-1"
        >
          Tap arrows to switch weapon
        </motion.p>
      )}
    </div>
  )
}

function WeaponIcon({ weaponId }: { weaponId: string }) {
  // SVG icons for each weapon
  switch (weaponId) {
    case 'foam_cannon':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-beer-400">
          <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
          <circle cx="8" cy="12" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="16" cy="12" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="12" cy="16" r="4" fill="currentColor" />
        </svg>
      )
    case 'hop_blaster':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-400">
          <ellipse cx="12" cy="12" rx="6" ry="8" fill="currentColor" opacity="0.8" />
          <ellipse cx="12" cy="12" rx="3" ry="4" fill="currentColor" />
        </svg>
      )
    case 'malt_missile':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-500">
          <path d="M12 4L16 20H8L12 4Z" fill="currentColor" />
          <circle cx="12" cy="18" r="2" fill="currentColor" opacity="0.5" />
        </svg>
      )
    case 'barley_beam':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
          <rect x="10" y="4" width="4" height="16" fill="currentColor" />
          <rect x="8" y="8" width="8" height="2" fill="currentColor" opacity="0.5" />
          <rect x="8" y="14" width="8" height="2" fill="currentColor" opacity="0.5" />
        </svg>
      )
    case 'lager_laser':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-400">
          <path d="M12 2L14 10H10L12 2Z" fill="currentColor" />
          <path d="M8 12L10 20H6L8 12Z" fill="currentColor" opacity="0.7" />
          <path d="M16 12L18 20H14L16 12Z" fill="currentColor" opacity="0.7" />
        </svg>
      )
    default:
      return null
  }
}

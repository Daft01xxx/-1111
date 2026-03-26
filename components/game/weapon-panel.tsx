'use client'

import { useGameStore, translations } from '@/lib/store'
import { ChevronLeft, ChevronRight, Crosshair } from 'lucide-react'

export function WeaponPanel() {
  const { weapons, currentWeaponIndex, selectWeapon, isPlaying, language } = useGameStore()

  if (!isPlaying) return null

  const currentWeapon = weapons[currentWeaponIndex]
  const unlockedWeapons = weapons.filter(w => w.unlocked)
  
  const canSwitch = unlockedWeapons.length > 1

  const nextWeapon = () => {
    if (!canSwitch) return
    for (let i = currentWeaponIndex + 1; i < weapons.length; i++) {
      if (weapons[i].unlocked) { selectWeapon(i); return }
    }
    // Loop
    for (let i = 0; i < currentWeaponIndex; i++) {
      if (weapons[i].unlocked) { selectWeapon(i); return }
    }
  }

  const prevWeapon = () => {
    if (!canSwitch) return
    for (let i = currentWeaponIndex - 1; i >= 0; i--) {
      if (weapons[i].unlocked) { selectWeapon(i); return }
    }
    // Loop
    for (let i = weapons.length - 1; i > currentWeaponIndex; i--) {
      if (weapons[i].unlocked) { selectWeapon(i); return }
    }
  }

  const weaponName = language === 'ru' ? currentWeapon.nameRu : currentWeapon.name

  return (
    <div className="absolute bottom-6 left-0 right-0 z-20 px-4 pointer-events-none safe-bottom">
      <div className="flex items-center justify-center gap-2">
        {/* Prev */}
        <button
          onClick={prevWeapon}
          disabled={!canSwitch}
          className="pointer-events-auto w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center active:scale-95 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Weapon Display */}
        <div className="pointer-events-auto flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-amber-500/30 min-w-[180px]">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{weaponName}</span>
            <div className="flex items-center gap-2 text-[10px] text-white/60">
              <span>DMG {currentWeapon.damage}</span>
              <span>|</span>
              <span>SPD {currentWeapon.fireRate}/s</span>
            </div>
          </div>
        </div>

        {/* Next */}
        <button
          onClick={nextWeapon}
          disabled={!canSwitch}
          className="pointer-events-auto w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center active:scale-95 disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Dots indicator */}
      {canSwitch && (
        <div className="flex justify-center gap-1.5 mt-2">
          {weapons.map((w, i) => (
            <div
              key={w.id}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentWeaponIndex ? 'bg-amber-500' : w.unlocked ? 'bg-white/40' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

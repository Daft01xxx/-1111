'use client'

import { useGameStore } from '@/lib/store'
import { CircleDot, Flame, Orbit, Snowflake, Sparkles, Target, Zap } from 'lucide-react'
import type { ComponentType } from 'react'

const weaponIcons: Record<string, ComponentType<{ className?: string }>> = {
  standard: CircleDot,
  spread: Target,
  laser: Zap,
  chainsaw: Orbit,
  missile: Flame,
  paw: Sparkles,
  beer: CircleDot,
  ice: Snowflake,
}

export function WeaponPanel() {
  const { weapons, currentWeaponIndex, selectWeapon, isPlaying, language } = useGameStore()

  if (!isPlaying) return null

  const unlockedWeapons = weapons
    .map((weapon, index) => ({ weapon, index }))
    .filter(({ weapon }) => weapon.unlocked)

  const activeWeapon = weapons[currentWeaponIndex] ?? unlockedWeapons[0]?.weapon
  const ActiveIcon = activeWeapon ? weaponIcons[activeWeapon.id] ?? Target : Target

  return (
    <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 z-20 w-[min(94vw,560px)] pointer-events-none safe-bottom">
      <div className="pointer-events-auto rounded-xl bg-black/55 backdrop-blur-sm border border-amber-500/25 px-2 py-1.5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-6 w-6 shrink-0 rounded-md border border-white/10 bg-black/45 flex items-center justify-center">
              <ActiveIcon className="h-3.5 w-3.5 text-amber-300" />
            </span>
            <div className="truncate text-[10px] font-semibold text-white/90">
              {activeWeapon ? (language === 'ru' ? activeWeapon.nameRu : activeWeapon.name) : '-'}
            </div>
          </div>
          <span className="shrink-0 text-[9px] text-white/60">
            {language === 'ru' ? 'Оружий' : 'Weapons'}: {unlockedWeapons.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {unlockedWeapons.map(({ weapon, index }) => {
            const Icon = weaponIcons[weapon.id] ?? Target
            const selected = index === currentWeaponIndex
            return (
              <button
                key={weapon.id}
                onClick={() => selectWeapon(index)}
                title={language === 'ru' ? weapon.nameRu : weapon.name}
                className={`h-8 w-8 shrink-0 rounded-lg border transition-colors flex items-center justify-center ${
                  selected
                    ? 'border-amber-400 bg-amber-500/25'
                    : 'border-white/10 bg-black/45 hover:bg-white/10'
                }`}
              >
                <Icon className={`h-4 w-4 ${selected ? 'text-amber-300' : 'text-white/90'}`} />
                <span className="sr-only">{language === 'ru' ? weapon.nameRu : weapon.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}


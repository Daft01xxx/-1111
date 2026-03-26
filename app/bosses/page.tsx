'use client'

import { useGameStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Skull, Lock, Check, ArrowLeft, Heart, Swords, Star } from 'lucide-react'
import Link from 'next/link'

const BOSS_ROSTER = [
  {
    id: 'vodka_king',
    name: 'Vodka King',
    nameRu: 'Водочный Король',
    description: 'A brutal bottle tyrant who floods the arena with freezing bursts.',
    maxHealth: 300,
    damage: 20,
    points: 500,
  },
  {
    id: 'whiskey_wizard',
    name: 'Whiskey Wizard',
    nameRu: 'Виски Маг',
    description: 'Throws amber fireballs and punishes greedy positioning.',
    maxHealth: 420,
    damage: 26,
    points: 800,
  },
  {
    id: 'wine_witch',
    name: 'Wine Witch',
    nameRu: 'Винная Ведьма',
    description: 'Casts spiral volleys and traps careless pilots in cursed arcs.',
    maxHealth: 560,
    damage: 34,
    points: 1200,
  },
  {
    id: 'tequila_titan',
    name: 'Tequila Titan',
    nameRu: 'Текила Титан',
    description: 'A heavy bruiser with wide cone blasts and punishing rushes.',
    maxHealth: 760,
    damage: 42,
    points: 1700,
  },
  {
    id: 'absinthe_overlord',
    name: 'Absinthe Overlord',
    nameRu: 'Повелитель Абсента',
    description: 'Final ruler of the anti-beer alliance. Dense patterns, brutal damage.',
    maxHealth: 1000,
    damage: 55,
    points: 2500,
  },
] as const

export default function BossesPage() {
  const { bossesDefeated } = useGameStore()
  const bosses = BOSS_ROSTER.map((boss, index) => ({
    ...boss,
    defeated: index < bossesDefeated,
  }))

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-foam-100" />
          </Link>
          <h1 className="text-xl font-display font-bold beer-text flex items-center gap-2">
            <Skull className="w-5 h-5 text-beer-400" />
            Boss Roster
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Progress */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-foam-400">Bosses Defeated</span>
            <span className="text-lg font-bold beer-text">{bossesDefeated}/{bosses.length}</span>
          </div>
          <div className="flex gap-1">
            {bosses.map((boss) => (
              <div
                key={boss.id}
                className={`
                  flex-1 h-2 rounded-full
                  ${boss.defeated ? 'bg-beer-500' : 'bg-dark-700'}
                `}
              />
            ))}
          </div>
        </div>

        {/* Boss cards */}
        <div className="space-y-4">
          {bosses.map((boss, index) => {
            const isUnlocked = index === 0 || bosses[index - 1]?.defeated
            
            return (
              <motion.div
                key={boss.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative overflow-hidden rounded-2xl border
                  ${boss.defeated 
                    ? 'bg-dark-900 border-green-500/30' 
                    : isUnlocked 
                      ? 'bg-dark-900 border-dark-700' 
                      : 'bg-dark-900/50 border-dark-800'
                  }
                `}
              >
                {/* Status badge */}
                <div className={`
                  absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold
                  ${boss.defeated 
                    ? 'bg-green-500/20 text-green-400' 
                    : isUnlocked 
                      ? 'bg-beer-500/20 text-beer-400' 
                      : 'bg-dark-700 text-foam-500'
                  }
                `}>
                  {boss.defeated ? 'DEFEATED' : isUnlocked ? 'AVAILABLE' : 'LOCKED'}
                </div>

                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Boss image placeholder */}
                    <div className={`
                      w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0
                      ${boss.defeated 
                        ? 'bg-green-500/10' 
                        : isUnlocked 
                          ? 'bg-beer-500/10' 
                          : 'bg-dark-800'
                      }
                    `}>
                      {isUnlocked ? (
                        <BossIcon bossId={boss.id} />
                      ) : (
                        <Lock className="w-10 h-10 text-foam-600" />
                      )}
                    </div>

                    {/* Boss info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold ${isUnlocked ? 'text-foam-100' : 'text-foam-500'}`}>
                        {boss.name}
                      </h3>
                      <p className="text-sm text-beer-400 mb-2">{boss.nameRu}</p>
                      
                      {isUnlocked && (
                        <p className="text-xs text-foam-500 line-clamp-2">
                          {boss.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  {isUnlocked && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-dark-700">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-foam-300">{boss.maxHealth} HP</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Swords className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-foam-300">{boss.damage} DMG</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-foam-300">{boss.points} PTS</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Defeated overlay */}
                {boss.defeated && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Lore section */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4 mt-6">
          <h3 className="text-lg font-bold text-foam-100 mb-3">The Enemy Alliance</h3>
          <p className="text-sm text-foam-400 leading-relaxed">
            The forces of hard liquor have united against NAPIWAS! Led by the infamous 
            Absinthe Overlord, these villains seek to destroy the beer culture. Only you, 
            piloting the legendary Beer Mug spaceship, can stop them. Defeat all five 
            bosses to save the brew!
          </p>
        </div>
      </div>
    </div>
  )
}

function BossIcon({ bossId }: { bossId: string }) {
  const iconClass = "w-12 h-12"
  
  switch (bossId) {
    case 'vodka_king':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none">
          <rect x="14" y="8" width="20" height="32" rx="4" fill="#94A3B8" />
          <rect x="18" y="4" width="12" height="8" rx="2" fill="#64748B" />
          <rect x="17" y="20" width="14" height="10" rx="2" fill="#E2E8F0" />
          <text x="24" y="28" textAnchor="middle" fontSize="6" fill="#475569">V</text>
        </svg>
      )
    case 'whiskey_wizard':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none">
          <rect x="12" y="12" width="24" height="28" rx="4" fill="#92400E" />
          <rect x="16" y="6" width="16" height="10" rx="3" fill="#78350F" />
          <rect x="15" y="22" width="18" height="12" rx="2" fill="#FCD34D" />
          <text x="24" y="31" textAnchor="middle" fontSize="6" fill="#78350F">W</text>
        </svg>
      )
    case 'wine_witch':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none">
          <path d="M18 44 L24 16 L30 44 Z" fill="#7C3AED" />
          <circle cx="24" cy="12" r="8" fill="#7C3AED" />
          <rect x="22" y="4" width="4" height="4" rx="1" fill="#5B21B6" />
          <circle cx="24" cy="12" r="5" fill="#A78BFA" />
        </svg>
      )
    case 'tequila_titan':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none">
          <rect x="14" y="10" width="20" height="30" rx="4" fill="#059669" />
          <rect x="18" y="5" width="12" height="8" rx="2" fill="#047857" />
          <rect x="16" y="20" width="16" height="14" rx="2" fill="#34D399" />
          <path d="M8 20 L14 18 L14 28 L8 26 Z" fill="#059669" />
          <path d="M40 20 L34 18 L34 28 L40 26 Z" fill="#059669" />
        </svg>
      )
    case 'absinthe_overlord':
      return (
        <svg className={iconClass} viewBox="0 0 48 48" fill="none">
          <path d="M14 44 L20 14 L28 14 L34 44 Z" fill="#059669" />
          <ellipse cx="24" cy="12" rx="10" ry="6" fill="#10B981" />
          <rect x="22" y="4" width="4" height="4" rx="1" fill="#047857" />
          <circle cx="20" cy="10" r="2" fill="#6EE7B7" opacity="0.8" />
          <circle cx="28" cy="10" r="2" fill="#6EE7B7" opacity="0.8" />
          {/* Crown */}
          <path d="M16 6 L18 2 L24 5 L30 2 L32 6 Z" fill="#FFD700" />
        </svg>
      )
    default:
      return <Skull className={`${iconClass} text-foam-500`} />
  }
}

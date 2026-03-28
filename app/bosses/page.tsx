'use client'

import { useGameStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, Heart, Swords, Star, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function BossesPage() {
  const { bosses, bossesDefeated } = useGameStore()

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-foam-100" />
          </Link>
          <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Alien Cat Bosses
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Progress */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-foam-400">Bosses Defeated</span>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{bossesDefeated}/{bosses.length}</span>
          </div>
          <div className="flex gap-1">
            {bosses.map((boss) => (
              <div
                key={boss.id}
                className={`
                  flex-1 h-2 rounded-full transition-all
                  ${boss.defeated ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-dark-700'}
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
                      ? 'bg-dark-900 border-purple-500/30' 
                      : 'bg-dark-900/50 border-dark-800'
                  }
                `}
              >
                {/* Glow effect for unlocked */}
                {isUnlocked && !boss.defeated && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
                )}
                
                {/* Status badge */}
                <div className={`
                  absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold
                  ${boss.defeated 
                    ? 'bg-green-500/20 text-green-400' 
                    : isUnlocked 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-dark-700 text-foam-500'
                  }
                `}>
                  {boss.defeated ? 'DEFEATED' : isUnlocked ? 'AVAILABLE' : 'LOCKED'}
                </div>

                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Boss image */}
                    <div className={`
                      w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden
                      ${boss.defeated 
                        ? 'bg-green-500/10' 
                        : isUnlocked 
                          ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                          : 'bg-dark-800'
                      }
                    `}>
                      {isUnlocked ? (
                        <AlienCatBossIcon theme={boss.theme} />
                      ) : (
                        <Lock className="w-10 h-10 text-foam-600" />
                      )}
                    </div>

                    {/* Boss info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold ${isUnlocked ? 'text-foam-100' : 'text-foam-500'}`}>
                        {boss.name}
                      </h3>
                      <p className="text-sm text-purple-400 mb-2">{boss.nameRu}</p>
                      
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
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Lore section */}
        <div className="bg-dark-900 rounded-xl border border-purple-500/20 p-4 mt-6">
          <h3 className="text-lg font-bold text-foam-100 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            The Cosmic Invasion
          </h3>
          <p className="text-sm text-foam-400 leading-relaxed">
            From the darkest reaches of the galaxy, five powerful alien cat overlords have 
            descended upon Earth. Each possesses unique cosmic powers and commands legions 
            of feline minions. Only you, piloting the legendary Orange Cat fighter, can 
            defeat them and save the planet from their cosmic domination!
          </p>
        </div>
      </div>
    </div>
  )
}

function AlienCatBossIcon({ theme }: { theme: 'nebula' | 'plasma' | 'void' | 'gravity' | 'cosmic' }) {
  const iconClass = "w-16 h-16"
  
  const colors = {
    nebula: { primary: '#7B68EE', secondary: '#9370DB', accent: '#E6E6FA' },
    plasma: { primary: '#FF6B35', secondary: '#FF8C42', accent: '#FFD700' },
    void: { primary: '#4B0082', secondary: '#8B008B', accent: '#9400D3' },
    gravity: { primary: '#708090', secondary: '#A9A9A9', accent: '#00CED1' },
    cosmic: { primary: '#FF1493', secondary: '#9400D3', accent: '#00FFFF' },
  }
  
  const color = colors[theme]
  
  return (
    <svg className={iconClass} viewBox="0 0 64 64" fill="none">
      {/* Glow effect */}
      <defs>
        <radialGradient id={`glow-${theme}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.secondary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color.primary} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.primary} />
          <stop offset="100%" stopColor={color.secondary} />
        </linearGradient>
      </defs>
      
      {/* Outer glow */}
      <circle cx="32" cy="32" r="28" fill={`url(#glow-${theme})`} />
      
      {/* Body */}
      <ellipse cx="32" cy="36" rx="14" ry="12" fill={`url(#body-${theme})`} />
      
      {/* Head */}
      <circle cx="32" cy="24" r="12" fill={`url(#body-${theme})`} />
      
      {/* Ears */}
      <path d="M20 18 L16 6 L26 14 Z" fill={color.primary} />
      <path d="M44 18 L48 6 L38 14 Z" fill={color.primary} />
      <path d="M21 16 L18 8 L25 14 Z" fill={color.secondary} />
      <path d="M43 16 L46 8 L39 14 Z" fill={color.secondary} />
      
      {/* Eyes */}
      <ellipse cx="27" cy="23" rx="4" ry="5" fill={color.accent} />
      <ellipse cx="37" cy="23" rx="4" ry="5" fill={color.accent} />
      <ellipse cx="27" cy="24" rx="2" ry="3" fill="#111" />
      <ellipse cx="37" cy="24" rx="2" ry="3" fill="#111" />
      
      {/* Nose */}
      <path d="M32 28 L30 31 L34 31 Z" fill={color.accent} />
      
      {/* Crown/horns for cosmic emperor */}
      {theme === 'cosmic' && (
        <>
          <path d="M24 10 L26 4 L28 10" stroke={color.accent} strokeWidth="2" fill="none" />
          <path d="M30 8 L32 2 L34 8" stroke={color.accent} strokeWidth="2" fill="none" />
          <path d="M36 10 L38 4 L40 10" stroke={color.accent} strokeWidth="2" fill="none" />
        </>
      )}
      
      {/* Circuit lines for gravity */}
      {theme === 'gravity' && (
        <>
          <circle cx="32" cy="36" r="8" stroke={color.accent} strokeWidth="1" fill="none" strokeDasharray="2 2" />
          <circle cx="32" cy="36" r="12" stroke={color.accent} strokeWidth="1" fill="none" strokeDasharray="3 3" />
        </>
      )}
      
      {/* Flame mane for plasma */}
      {theme === 'plasma' && (
        <path 
          d="M20 20 Q18 14 22 12 Q20 16 24 14 Q22 18 26 16 Q24 20 28 18 Q26 22 30 20" 
          stroke={color.accent} 
          strokeWidth="2" 
          fill="none"
        />
      )}
    </svg>
  )
}

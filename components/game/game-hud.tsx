'use client'

import { useGameStore } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { Heart, Pause, Zap, Shield, Target, Flame, Coins } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function GameHUD() {
  const {
    score,
    health,
    maxHealth,
    level,
    experience,
    multiplier,
    napiwasBalance,
    powerUps,
    pauseGame,
    isPlaying,
    coins,
    killStreak,
  } = useGameStore()

  const healthPercent = (health / maxHealth) * 100
  const expPercent = (experience / (level * 100)) * 100
  const tier = getMultiplierTier(napiwasBalance)

  const activePowerUps = powerUps.filter(p => p.active)

  if (!isPlaying) return null

  return (
    <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
      {/* Top bar */}
      <div className="flex items-start justify-between p-3 gap-3">
        {/* Left side - Health & Level */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Health bar */}
          <div className="flex items-center gap-2 bg-dark-900/80 backdrop-blur-sm rounded-xl px-3 py-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <div className="w-24 h-3 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: healthPercent > 50 
                    ? 'linear-gradient(90deg, #22C55E, #4ADE80)' 
                    : healthPercent > 25 
                      ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                      : 'linear-gradient(90deg, #EF4444, #F87171)',
                }}
                initial={{ width: '100%' }}
                animate={{ width: `${healthPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-bold text-foam-100">{health}</span>
          </div>

          {/* Level & XP */}
          <div className="flex items-center gap-2 bg-dark-900/80 backdrop-blur-sm rounded-xl px-3 py-2">
            <div className="w-7 h-7 rounded-lg bg-beer-500 flex items-center justify-center">
              <span className="text-xs font-bold text-dark-950">{level}</span>
            </div>
            <div className="w-20 h-2 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-beer-500 to-beer-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center - Score */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="bg-dark-900/80 backdrop-blur-sm rounded-xl px-4 py-2"
          >
            <div className="text-2xl font-display font-bold beer-text">
              {formatNumber(score)}
            </div>
          </motion.div>
          
          {/* Multiplier badge */}
          {multiplier > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ 
                backgroundColor: tier.color + '20', 
                color: tier.color,
                border: `1px solid ${tier.color}50`
              }}
            >
              x{multiplier.toFixed(2)} {tier.tier}
            </motion.div>
          )}
          
          {/* Kill streak */}
          {killStreak >= 5 && (
            <motion.div
              key={killStreak}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/50"
            >
              {killStreak}x STREAK!
            </motion.div>
          )}
        </div>

        {/* Right side - Pause */}
        <button
          onClick={pauseGame}
          className="pointer-events-auto w-10 h-10 rounded-xl bg-dark-900/80 backdrop-blur-sm flex items-center justify-center hover:bg-dark-800 transition-colors"
        >
          <Pause className="w-5 h-5 text-foam-100" />
        </button>
      </div>

      {/* Active power-ups */}
      <AnimatePresence>
        {activePowerUps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-3 top-28 flex flex-col gap-2"
          >
            {activePowerUps.map(powerUp => (
              <motion.div
                key={powerUp.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 bg-dark-900/80 backdrop-blur-sm rounded-lg px-2 py-1.5"
              >
                <PowerUpIcon type={powerUp.id} />
                <div className="w-12 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-beer-500 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(powerUp.timeLeft / powerUp.duration) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-foam-300 w-4">
                  {Math.ceil(powerUp.timeLeft)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PowerUpIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4"
  
  switch (type) {
    case 'shield':
      return <Shield className={`${iconClass} text-blue-400`} />
    case 'double_shot':
      return <Target className={`${iconClass} text-amber-400`} />
    case 'speed_boost':
      return <Zap className={`${iconClass} text-purple-400`} />
    case 'triple_shot':
      return <Flame className={`${iconClass} text-red-400`} />
    default:
      return null
  }
}

'use client'

import { useGameStore } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { Heart, Pause, Zap, Shield, Target, Flame } from 'lucide-react'

export function GameHUD() {
  const {
    score, health, maxHealth, level, meters, multiplier,
    napiwasBalance, powerUps, pauseGame, isPlaying
  } = useGameStore()

  if (!isPlaying) return null

  const healthPercent = (health / maxHealth) * 100
  const expPercent = Math.min((meters / 10000) * 100, 100)
  const tier = getMultiplierTier(napiwasBalance)
  const activePowerUps = powerUps.filter(p => p.active)

  const healthColor = healthPercent > 50 ? '#22C55E' : healthPercent > 25 ? '#F59E0B' : '#EF4444'

  return (
    <div className="absolute inset-x-0 top-0 z-20 pointer-events-none safe-top px-3 pt-3">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-2">
        {/* Left - Health & Level */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Health */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />
            <div className="w-20 h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${healthPercent}%`, backgroundColor: healthColor }}
              />
            </div>
            <span className="text-xs font-bold text-white w-6">{health}</span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
            <div className="w-6 h-6 rounded-md gold-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-black">{level}</span>
            </div>
            <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center - Score */}
        <div className="flex flex-col items-center gap-1 min-w-0">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2">
            <div className="text-xl font-bold gold-text">{formatNumber(score)}</div>
          </div>
          {multiplier > 1 && (
            <div 
              className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
              style={{ 
                backgroundColor: tier.color + '20', 
                color: tier.color,
                borderColor: tier.color + '50'
              }}
            >
              x{multiplier.toFixed(1)}
            </div>
          )}
        </div>

        {/* Right - Pause */}
        <button
          onClick={pauseGame}
          className="pointer-events-auto w-10 h-10 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <Pause className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Active Power-ups */}
      {activePowerUps.length > 0 && (
        <div className="absolute left-3 top-24 flex flex-col gap-1.5">
          {activePowerUps.map(pu => (
            <div key={pu.id} className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
              <PowerUpIcon type={pu.id} />
              <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${(pu.timeLeft / pu.duration) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-white/70 w-3">{Math.ceil(pu.timeLeft)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Meters indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-xs text-white/80 font-medium">{formatNumber(Math.floor(meters))}m</span>
      </div>
    </div>
  )
}

function PowerUpIcon({ type }: { type: string }) {
  const size = "w-3.5 h-3.5"
  switch (type) {
    case 'shield': return <Shield className={`${size} text-blue-400`} />
    case 'double_shot': return <Target className={`${size} text-amber-400`} />
    case 'speed_boost': return <Zap className={`${size} text-purple-400`} />
    case 'triple_shot': return <Flame className={`${size} text-red-400`} />
    default: return null
  }
}

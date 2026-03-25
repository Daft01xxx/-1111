'use client'

import { useGameStore } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Home, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function GameOver() {
  const router = useRouter()
  const { gameOver, score, highScore, level, bossesDefeated, multiplier, napiwasBalance, walletAddress, resetGame, startGame } = useGameStore()
  const [rank, setRank] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const tier = getMultiplierTier(napiwasBalance)
  const isNewHighScore = score === highScore && score > 0

  // Save score to leaderboard
  useEffect(() => {
    if (!gameOver || !walletAddress || score === 0) return

    const saveScore = async () => {
      setSaving(true)
      const supabase = createClient()

      // Check if user exists, if not create
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single()

      let userId = existingUser?.id

      if (!userId) {
        const { data: newUser } = await supabase
          .from('users')
          .insert({ wallet_address: walletAddress, napiwas_balance: napiwasBalance })
          .select('id')
          .single()
        userId = newUser?.id
      }

      if (userId) {
        // Save to leaderboard
        await supabase.from('leaderboard').insert({
          user_id: userId,
          score,
          level,
          bosses_defeated: bossesDefeated,
          multiplier,
        })

        // Get rank
        const { count } = await supabase
          .from('leaderboard')
          .select('*', { count: 'exact', head: true })
          .gt('score', score)

        setRank((count || 0) + 1)
      }

      setSaving(false)
    }

    saveScore()
  }, [gameOver, walletAddress, score, level, bossesDefeated, multiplier, napiwasBalance])

  if (!gameOver) return null

  const handlePlayAgain = () => {
    resetGame()
    startGame()
  }

  const handleGoHome = () => {
    resetGame()
    router.push('/')
  }

  const handleShare = () => {
    const text = `I scored ${formatNumber(score)} points in NAPIWAS Beer Shooter! Can you beat my score?`
    if (navigator.share) {
      navigator.share({ title: 'NAPIWAS Score', text, url: window.location.origin })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-dark-950/90 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-full max-w-sm bg-dark-900 rounded-3xl border border-dark-700 overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-32 beer-gradient flex items-center justify-center overflow-hidden">
          {/* Animated bubbles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-white/20"
              initial={{ y: 100, x: Math.random() * 200 - 100 }}
              animate={{ y: -100, opacity: [0, 1, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
              }}
            />
          ))}
          
          <div className="text-center z-10">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-display font-bold text-dark-950"
            >
              GAME OVER
            </motion.h2>
            {isNewHighScore && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="flex items-center gap-1 justify-center mt-1"
              >
                <Trophy className="w-4 h-4 text-dark-950" />
                <span className="text-sm font-bold text-dark-950">NEW HIGH SCORE!</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          {/* Score */}
          <div className="text-center">
            <p className="text-sm text-foam-400 mb-1">Final Score</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-5xl font-display font-bold beer-text"
            >
              {formatNumber(score)}
            </motion.p>
            {multiplier > 1 && (
              <p 
                className="text-sm mt-1 font-bold"
                style={{ color: tier.color }}
              >
                x{multiplier.toFixed(2)} {tier.tier} bonus applied
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-dark-800 rounded-xl p-3 text-center">
              <p className="text-xs text-foam-400">Level</p>
              <p className="text-xl font-bold text-foam-100">{level}</p>
            </div>
            <div className="bg-dark-800 rounded-xl p-3 text-center">
              <p className="text-xs text-foam-400">Bosses</p>
              <p className="text-xl font-bold text-foam-100">{bossesDefeated}</p>
            </div>
            <div className="bg-dark-800 rounded-xl p-3 text-center">
              <p className="text-xs text-foam-400">Rank</p>
              <p className="text-xl font-bold text-foam-100">
                {saving ? '...' : rank ? `#${rank}` : '-'}
              </p>
            </div>
          </div>

          {/* Best score */}
          <div className="flex items-center justify-between bg-dark-800 rounded-xl p-3">
            <span className="text-sm text-foam-400">Best Score</span>
            <span className="text-lg font-bold text-beer-400">{formatNumber(highScore)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-800 text-foam-100 font-bold hover:bg-dark-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Menu
            </button>
            <button
              onClick={handleShare}
              className="w-12 flex items-center justify-center rounded-xl bg-dark-800 text-foam-100 hover:bg-dark-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayAgain}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl beer-gradient text-dark-950 font-bold hover:brightness-110 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Again
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

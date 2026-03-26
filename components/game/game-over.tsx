'use client'

import { useGameStore, translations } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { Trophy, RotateCcw, Home, Share2, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function GameOver() {
  const router = useRouter()
  const { 
    gameOver, score, highScore, level, meters, bossesDefeated, 
    multiplier, napiwasBalance, walletAddress, language,
    resetGame, startGame, coins 
  } = useGameStore()
  const [saving, setSaving] = useState(false)
  const t = translations[language]

  const tier = getMultiplierTier(napiwasBalance)
  const isNewHighScore = score === highScore && score > 0
  const earnedCoins = Math.floor(score / 10)

  // Save score
  useEffect(() => {
    if (!gameOver || !walletAddress || score === 0) return

    const saveScore = async () => {
      setSaving(true)
      try {
        const supabase = createClient()
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', walletAddress)
          .single()

        let userId = user?.id
        if (!userId) {
          const { data: newUser } = await supabase
            .from('users')
            .insert({ wallet_address: walletAddress, napiwas_balance: napiwasBalance })
            .select('id')
            .single()
          userId = newUser?.id
        }

        if (userId) {
          await supabase.from('leaderboard').insert({
            user_id: userId, score, level,
            bosses_defeated: bossesDefeated, multiplier_used: multiplier
          })
        }
      } catch (e) {
        console.error('Failed to save score', e)
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
    const text = `I scored ${formatNumber(score)} points in NAPIWAS! Can you beat me?`
    if (navigator.share) {
      navigator.share({ title: 'NAPIWAS', text, url: window.location.origin })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[rgb(var(--card))] rounded-2xl border border-[rgb(var(--border))] p-6 animate-slide-up">
        {/* Title */}
        <div className="text-center mb-6">
          {isNewHighScore && (
            <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-bold mb-2">
              <Star className="w-4 h-4 fill-current" />
              NEW RECORD!
              <Star className="w-4 h-4 fill-current" />
            </div>
          )}
          <h2 className="text-2xl font-bold gold-text">GAME OVER</h2>
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-3xl font-bold gold-text">{formatNumber(score)}</span>
          </div>
          {multiplier > 1 && (
            <p className="text-xs mt-2" style={{ color: tier.color }}>
              x{multiplier.toFixed(1)} Multiplier Applied
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-black/20 rounded-xl p-3 text-center">
            <p className="text-xs text-[rgb(var(--muted-foreground))]">Level</p>
            <p className="text-lg font-bold">{level}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-3 text-center">
            <p className="text-xs text-[rgb(var(--muted-foreground))]">Meters</p>
            <p className="text-lg font-bold">{formatNumber(Math.floor(meters))}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-3 text-center">
            <p className="text-xs text-[rgb(var(--muted-foreground))]">Coins</p>
            <p className="text-lg font-bold text-amber-400">+{earnedCoins}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handlePlayAgain}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gold-gradient text-[#1a1a1a] font-bold active:scale-[0.98] transition-transform"
          >
            <RotateCcw className="w-5 h-5" />
            {language === 'ru' ? 'Ещё раз' : 'Play Again'}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgb(var(--muted))] font-medium active:scale-[0.98] transition-transform"
            >
              <Home className="w-5 h-5" />
              {language === 'ru' ? 'Меню' : 'Menu'}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgb(var(--muted))] font-medium active:scale-[0.98] transition-transform"
            >
              <Share2 className="w-5 h-5" />
              {language === 'ru' ? 'Поделиться' : 'Share'}
            </button>
          </div>
        </div>

        {saving && (
          <p className="text-center text-xs text-[rgb(var(--muted-foreground))] mt-4">
            Saving score...
          </p>
        )}
      </div>
    </div>
  )
}

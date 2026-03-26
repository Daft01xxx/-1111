'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatNumber } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

interface LeaderboardEntry {
  id: string
  wallet_address: string
  username: string | null
  score: number
  level: number
  meters: number
  bosses_defeated: number
  multiplier_used: number
  created_at: string
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'all' | 'today' | 'week'>('all')
  const { walletAddress, language } = useGameStore()

  const t = {
    title: language === 'ru' ? 'Лидеры' : 'Leaderboard',
    allTime: language === 'ru' ? 'Все время' : 'All Time',
    today: language === 'ru' ? 'Сегодня' : 'Today',
    week: language === 'ru' ? 'Неделя' : 'This Week',
    noScores: language === 'ru' ? 'Пока нет результатов!' : 'No scores yet!',
    beFirst: language === 'ru' ? 'Стань первым в таблице лидеров.' : 'Be the first to play and claim the top spot.',
    playNow: language === 'ru' ? 'Играть' : 'Play Now',
    level: language === 'ru' ? 'Ур' : 'Lvl',
    bosses: language === 'ru' ? 'боссов' : 'bosses',
    you: language === 'ru' ? 'ВЫ' : 'YOU',
  }

  const fetchLeaderboard = async () => {
    setLoading(true)
    const supabase = createClient()
    
    let query = supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(100)

    if (timeframe === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte('created_at', today.toISOString())
    } else if (timeframe === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      query = query.gte('created_at', weekAgo.toISOString())
    }

    const { data, error } = await query

    if (!error && data) {
      setEntries(data as LeaderboardEntry[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [timeframe])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 text-center font-bold text-foam-400">{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/30'
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30'
      default:
        return 'bg-dark-800 border-dark-600'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-muted transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <h1 className="text-xl font-display font-bold beer-text flex items-center gap-2">
            <Trophy className="w-5 h-5 text-beer-400" />
            {t.title}
          </h1>
          <button 
            onClick={fetchLeaderboard}
            className="p-2 -m-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
          >
            <RefreshCw className={`w-5 h-5 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Timeframe tabs */}
        <div className="flex gap-2 px-4 pb-3">
          {(['all', 'today', 'week'] as const).map((tf) => (
            <motion.button
              key={tf}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeframe(tf)}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                ${timeframe === tf 
                  ? 'bg-beer-500 text-dark-950' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {tf === 'all' ? t.allTime : tf === 'today' ? t.today : t.week}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Leaderboard list */}
      <div className="p-4 space-y-2">
        {loading ? (
          // Skeleton loading
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground">{t.noScores}</p>
            <p className="text-sm text-muted-foreground">{t.beFirst}</p>
            <Link href="/play">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-3 bg-beer-500 text-dark-950 font-bold rounded-xl"
              >
                {t.playNow}
              </motion.button>
            </Link>
          </div>
        ) : (
          entries.map((entry, index) => {
            const rank = index + 1
            const isCurrentUser = walletAddress === entry.wallet_address
            const displayName = entry.username || 
              `${entry.wallet_address.slice(0, 6)}...${entry.wallet_address.slice(-4)}`

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border transition-colors
                  ${getRankBg(rank)}
                  ${isCurrentUser ? 'ring-2 ring-beer-500' : ''}
                `}
              >
                {/* Rank */}
                <div className="w-8 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${isCurrentUser ? 'text-beer-400' : 'text-foreground'}`}>
                      {displayName}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-beer-500/20 text-beer-400">
                        {t.you}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t.level} {entry.level}</span>
                    <span>|</span>
                    <span>{entry.bosses_defeated} {t.bosses}</span>
                    {entry.multiplier_used > 1 && (
                      <>
                        <span>|</span>
                        <span className="text-beer-400">x{entry.multiplier_used.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className={`text-lg font-bold ${rank <= 3 ? 'beer-text' : 'text-foreground'}`}>
                    {formatNumber(entry.score)}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatNumber } from '@/lib/utils'
import { Trophy, Medal, Crown, ArrowLeft, RefreshCw, MapPin } from 'lucide-react'
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
  const [sortBy, setSortBy] = useState<'meters' | 'score'>('meters')
  const { walletAddress, language, theme, totalMeters, highScore, level, bossesDefeated } = useGameStore()

  const t = {
    title: language === 'ru' ? 'Рейтинг' : 'Leaderboard',
    byMeters: language === 'ru' ? 'По метрам' : 'By Meters',
    byScore: language === 'ru' ? 'По очкам' : 'By Score',
    level: language === 'ru' ? 'Ур' : 'Lvl',
    bosses: language === 'ru' ? 'боссов' : 'bosses',
    you: language === 'ru' ? 'ВЫ' : 'YOU',
    meters: language === 'ru' ? 'м' : 'm',
    yourStats: language === 'ru' ? 'Ваша статистика' : 'Your Stats',
    noData: language === 'ru' ? 'Данные загружаются...' : 'Loading data...',
  }

  const fetchLeaderboard = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order(sortBy === 'meters' ? 'meters' : 'score', { ascending: false })
      .limit(100)

    if (!error && data) {
      setEntries(data as LeaderboardEntry[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [sortBy])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />
      case 2: return <Medal className="w-6 h-6 text-gray-300" />
      case 3: return <Medal className="w-6 h-6 text-amber-600" />
      default: return <span className="w-6 text-center font-bold text-gray-400">{rank}</span>
    }
  }

  const isDark = theme === 'dark'

  // Create a combined list - always show user's stats even if not in DB
  const displayEntries = entries.length > 0 ? entries : []
  const userInList = displayEntries.some(e => walletAddress && e.wallet_address === walletAddress)

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#fefefe]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 pt-[env(safe-area-inset-top)] pb-3 ${
        isDark ? 'bg-[#0a0a0b]/95 border-[#222]' : 'bg-[#fefefe]/95 border-[#e5e5e5]'
      }`}>
        <div className="flex items-center justify-between pt-3">
          <Link 
            href="/"
            className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform ${
              isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
          </Link>
          
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            {t.title}
          </h1>
          
          <button 
            onClick={fetchLeaderboard}
            className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform ${
              isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''} ${isDark ? 'text-white' : 'text-black'}`} />
          </button>
        </div>

        {/* Sort tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setSortBy('meters')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] ${
              sortBy === 'meters'
                ? 'bg-amber-500 text-black'
                : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-[#f0f0f0] text-gray-600'
            }`}
          >
            <MapPin className="w-4 h-4" />
            {t.byMeters}
          </button>
          <button
            onClick={() => setSortBy('score')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] ${
              sortBy === 'score'
                ? 'bg-amber-500 text-black'
                : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-[#f0f0f0] text-gray-600'
            }`}
          >
            <Trophy className="w-4 h-4" />
            {t.byScore}
          </button>
        </div>
      </header>

      {/* Your Stats Card - ALWAYS SHOW */}
      <div className="p-4">
        <div className={`p-4 rounded-2xl border-2 border-amber-500/50 ${
          isDark ? 'bg-amber-500/10' : 'bg-amber-50'
        }`}>
          <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
            {t.yourStats}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-amber-500">
                {formatNumber(Math.floor(totalMeters))} {t.meters}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.level} {level} | {formatNumber(highScore)} {language === 'ru' ? 'очков' : 'pts'} | {bossesDefeated} {t.bosses}
              </p>
            </div>
            <Trophy className="w-10 h-10 text-amber-500/50" />
          </div>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="px-4 pb-4 space-y-2">
        {loading ? (
          [...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`h-16 rounded-xl animate-pulse ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'}`}
            />
          ))
        ) : displayEntries.length === 0 ? (
          // Even with no data, show encouraging message
          <div className={`p-6 rounded-2xl text-center ${isDark ? 'bg-[#111] border border-[#222]' : 'bg-white border border-[#e5e5e5]'}`}>
            <Trophy className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={isDark ? 'text-white' : 'text-black'}>
              {language === 'ru' ? 'Будь первым в рейтинге!' : 'Be the first on the leaderboard!'}
            </p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {language === 'ru' ? 'Играй и набирай метры!' : 'Play and earn meters!'}
            </p>
            <Link href="/play">
              <button className="mt-4 px-6 py-3 bg-amber-500 text-black font-bold rounded-xl active:scale-95 transition-transform">
                {language === 'ru' ? 'Играть' : 'Play Now'}
              </button>
            </Link>
          </div>
        ) : (
          displayEntries.map((entry, index) => {
            const rank = index + 1
            const isCurrentUser = walletAddress === entry.wallet_address
            const displayName = entry.username || 
              `${entry.wallet_address.slice(0, 6)}...${entry.wallet_address.slice(-4)}`
            const mainValue = sortBy === 'meters' ? entry.meters : entry.score

            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  rank <= 3 
                    ? rank === 1 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
                      : rank === 2
                        ? 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/30'
                        : 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30'
                    : isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5e5]'
                } ${isCurrentUser ? 'ring-2 ring-amber-500' : ''}`}
                style={{
                  animationDelay: `${index * 30}ms`,
                  animation: 'fadeInUp 0.3s ease forwards',
                  opacity: 0
                }}
              >
                {/* Rank */}
                <div className="w-8 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${isCurrentUser ? 'text-amber-400' : isDark ? 'text-white' : 'text-black'}`}>
                      {displayName}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">
                        {t.you}
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span>{t.level} {entry.level}</span>
                    <span>|</span>
                    <span>{entry.bosses_defeated} {t.bosses}</span>
                    {entry.multiplier_used > 1 && (
                      <>
                        <span>|</span>
                        <span className="text-amber-500">x{entry.multiplier_used.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Score/Meters */}
                <div className="text-right">
                  <p className={`text-lg font-bold ${rank <= 3 ? 'text-amber-500' : isDark ? 'text-white' : 'text-black'}`}>
                    {formatNumber(mainValue)}
                    {sortBy === 'meters' && <span className="text-sm">{t.meters}</span>}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

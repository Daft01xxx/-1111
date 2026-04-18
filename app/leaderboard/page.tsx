'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTonWallet } from '@tonconnect/ui-react'
import { Crown, Medal, RefreshCw, Trophy, Beer } from 'lucide-react'
import { useGameStore } from '@/lib/store'
import { formatNumber, shortWalletAddress } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { AppPageHeader } from '@/components/ui/app-page-header'

interface LeaderboardEntry {
  id: string
  wallet_address: string | null
  username: string | null
  score: number | null
  level: number | null
  bosses_defeated: number | null
}

function normalizeAddress(address: string | null | undefined): string {
  return (address ?? '').trim().toLowerCase()
}

export default function LeaderboardPage() {
  const tonWallet = useTonWallet()
  const { language, theme, walletAddress, coins, level, bossesDefeated, userId } = useGameStore()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const isDark = theme === 'dark'
  const effectiveWalletAddress = tonWallet?.account?.address || walletAddress || null

  const t = useMemo(
    () =>
      language === 'ru'
        ? {
            title: 'Р›РёРґРµСЂР±РѕСЂРґ',
            subtitle: 'РўРѕРї 20 РїРѕ РєСЂСѓР¶РєР°Рј РїРёРІР°',
            mugs: 'РљСЂСѓР¶РєРё',
            yourMugs: 'Р’Р°С€Рё РєСЂСѓР¶РєРё',
            noData: 'РџРѕРєР° РЅРµС‚ РґР°РЅРЅС‹С… СЂРµР№С‚РёРЅРіР°',
            you: 'Р’С‹',
            level: 'РЈСЂ.',
            bosses: 'Р±РѕСЃСЃРѕРІ',
          }
        : {
            title: 'Leaderboard',
            subtitle: 'Top 20 by beer mugs',
            mugs: 'Mugs',
            yourMugs: 'Your mugs',
            noData: 'No ranking data yet',
            you: 'You',
            level: 'Lvl',
            bosses: 'bosses',
          },
    [language]
  )

  const fetchLeaderboard = async () => {
    setLoading(true)

    try {
      const apiRes = await fetch('/api/leaderboard?period=all_time&limit=20', { cache: 'no-store' })
      if (apiRes.ok) {
        const payload = (await apiRes.json()) as { leaderboard?: LeaderboardEntry[] }
        const rows = Array.isArray(payload?.leaderboard) ? payload.leaderboard : []
        if (rows.length > 0) {
          const sorted = rows
            .slice()
            .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
            .slice(0, 20)
          setEntries(sorted)
          setLoading(false)
          return
        }
      }
    } catch {
      // fallback below
    }

    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('leaderboard')
        .select('id,wallet_address,username,score,level,bosses_defeated')
        .order('score', { ascending: false })
        .limit(20)

      setEntries(Array.isArray(data) ? (data as LeaderboardEntry[]) : [])
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-orange-400" />
    if (rank === 2) return <Medal className="h-5 w-5 text-zinc-300" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />
    return <span className="text-sm font-bold text-orange-500">{rank}</span>
  }

  const visibleEntries = useMemo(() => {
    if (entries.length > 0) return entries
    if (!effectiveWalletAddress) return []
    return [
      {
        id: userId,
        wallet_address: effectiveWalletAddress,
        username: language === 'ru' ? 'Р’С‹' : 'You',
        score: coins,
        level,
        bosses_defeated: bossesDefeated,
      } as LeaderboardEntry,
    ]
  }, [entries, effectiveWalletAddress, language, coins, level, bossesDefeated, userId])

  return (
    <div className={`min-h-screen pb-[calc(108px+env(safe-area-inset-bottom))] ${isDark ? 'bg-[#070708]' : 'bg-[#f8f4ea]'}`}>
      <AppPageHeader
        title={t.title}
        icon={<Trophy className="h-5 w-5 text-orange-500" />}
        rightSlot={
          <button
            onClick={fetchLeaderboard}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 ${
              isDark
                ? 'border-orange-500/35 bg-black/45 backdrop-blur-md'
                : 'border-orange-400/45 bg-white/75 backdrop-blur-md'
            }`}
            aria-label="Refresh leaderboard"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <div className="px-4 pt-3">
        <div className={`rounded-2xl border p-3 backdrop-blur-lg ${isDark ? 'border-orange-500/25 bg-black/45' : 'border-orange-400/35 bg-white/75'}`}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-orange-500">{t.subtitle}</p>
          <div className="mt-2 flex justify-center">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-orange-500/35">
              <Image src="/images/kitten-named-woof.gif" alt="Leaderboard mascot" fill className="object-cover" unoptimized />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <Beer className="h-4 w-4 text-orange-500" />
            <span className={isDark ? 'text-white/75' : 'text-[#433822]'}>
              {t.yourMugs}: <strong className="text-orange-500">{formatNumber(coins)}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-2">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className={`h-16 animate-pulse rounded-xl ${isDark ? 'bg-[#121212]' : 'bg-[#ece5d6]'}`} />
          ))
        ) : visibleEntries.length === 0 ? (
          <div className={`rounded-2xl border p-6 text-center ${isDark ? 'border-orange-500/20 bg-black/45 text-white/70' : 'border-orange-400/35 bg-white/75 text-[#5a4b32]'}`}>
            {t.noData}
          </div>
        ) : (
          visibleEntries.slice(0, 20).map((entry, idx) => {
            const rank = idx + 1
            const isMe =
              normalizeAddress(effectiveWalletAddress) !== '' &&
              normalizeAddress(entry.wallet_address) === normalizeAddress(effectiveWalletAddress)
            const mugs = Math.max(0, Number(entry.score || 0))
            const displayName = entry.username?.trim() || shortWalletAddress(entry.wallet_address, 7, 5)
            const lvl = Math.max(1, Number(entry.level || 1))
            const bosses = Math.max(0, Number(entry.bosses_defeated || 0))

            return (
              <div
                key={entry.id ?? `${entry.wallet_address}-${rank}`}
                className={`rounded-xl border px-3 py-2.5 backdrop-blur-lg transition-all ${
                  isDark ? 'border-orange-500/20 bg-black/45' : 'border-orange-400/30 bg-white/75'
                } ${isMe ? 'ring-1 ring-orange-500/55' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/35">{getRankIcon(rank)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1f1a12]'}`}>{displayName}</p>
                      {isMe && <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-500">{t.you}</span>}
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-white/55' : 'text-[#6f6147]'}`}>
                      {t.level} {lvl} В· {bosses} {t.bosses}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-orange-500">{formatNumber(mugs)}</p>
                    <p className={`text-[10px] uppercase ${isDark ? 'text-white/50' : 'text-[#7a6c53]'}`}>{t.mugs}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

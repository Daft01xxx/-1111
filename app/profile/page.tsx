'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTonAddress, useTonWallet } from '@tonconnect/ui-react'
import { Beer, Check, Copy, Crown, Trophy, UserRound, Wallet } from 'lucide-react'
import { AppPageHeader } from '@/components/ui/app-page-header'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/lib/store'
import { formatNumber, shortWalletAddress } from '@/lib/utils'

interface LeaderboardEntry {
  id: string
  wallet_address: string | null
  username: string | null
  meters: number | null
  score: number | null
  level: number | null
}

function normalizeAddress(address: string | null | undefined): string {
  return (address ?? '').trim().toLowerCase()
}

export default function ProfilePage() {
  const wallet = useTonWallet()
  const walletFriendlyAddress = useTonAddress()
  const { language, coins, napiwasBalance, walletAddress, level, highScore, totalMeters, theme, userId } = useGameStore()

  const effectiveWalletAddress = wallet?.account?.address || walletAddress || null
  const friendlyWalletAddress = walletFriendlyAddress || effectiveWalletAddress || ''
  const normalizedWalletCandidates = [
    normalizeAddress(wallet?.account?.address),
    normalizeAddress(walletFriendlyAddress),
    normalizeAddress(walletAddress),
  ].filter(Boolean)

  const [tab, setTab] = useState<'profile' | 'leaderboard'>('profile')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [walletCopied, setWalletCopied] = useState(false)

  const isDark = theme === 'dark'

  const t = useMemo(
    () =>
      language === 'ru'
        ? {
            title: 'РџСЂРѕС„РёР»СЊ',
            myProfile: 'РњРѕР№ РїСЂРѕС„РёР»СЊ',
            leaderboard: 'Р РµР№С‚РёРЅРі',
            beerMugs: 'РљСЂСѓР¶РєРё РїРёРІР°',
            tokenBalance: 'РўРѕРєРµРЅС‹ NAPIWAS',
            level: 'РЈСЂРѕРІРµРЅСЊ',
            score: 'Р РµРєРѕСЂРґ',
            meters: 'РњРµС‚СЂС‹',
            wallet: 'РљРѕС€РµР»С‘Рє',
            notConnected: 'РќРµ РїРѕРґРєР»СЋС‡РµРЅ',
            fetchError: 'Р РµР№С‚РёРЅРі РІСЂРµРјРµРЅРЅРѕ РЅРµРґРѕСЃС‚СѓРїРµРЅ',
          }
        : {
            title: 'Profile',
            myProfile: 'My profile',
            leaderboard: 'Leaderboard',
            beerMugs: 'Beer mugs',
            tokenBalance: 'NAPIWAS tokens',
            level: 'Level',
            score: 'High score',
            meters: 'Meters',
            wallet: 'Wallet',
            notConnected: 'Not connected',
            fetchError: 'Leaderboard is temporarily unavailable',
          },
    [language]
  )
  const copyWalletLabel = language === 'ru' ? 'РљРѕРїРёСЂРѕРІР°С‚СЊ' : 'Copy'

  const visibleEntries = useMemo(() => {
    if (entries.length > 0) return entries
    if (!effectiveWalletAddress) return []
    return [
      {
        id: userId,
        wallet_address: effectiveWalletAddress,
        username: language === 'ru' ? 'Р’С‹' : 'You',
        meters: totalMeters,
        score: coins,
        level,
      } satisfies LeaderboardEntry,
    ]
  }, [entries, effectiveWalletAddress, language, totalMeters, coins, level, userId])

  const handleCopyWallet = async () => {
    if (!friendlyWalletAddress) return
    try {
      await navigator.clipboard.writeText(friendlyWalletAddress)
      setWalletCopied(true)
      window.setTimeout(() => setWalletCopied(false), 1600)
    } catch {
      setWalletCopied(false)
    }
  }

  useEffect(() => {
    if (tab !== 'leaderboard') return

    let mounted = true
    setLoading(true)

    const run = async () => {
      try {
        const res = await fetch('/api/leaderboard?period=all_time&limit=20', { cache: 'no-store' })
        if (res.ok) {
          const payload = (await res.json()) as { leaderboard?: LeaderboardEntry[] }
          const apiRows = Array.isArray(payload?.leaderboard) ? payload.leaderboard : []
          if (!mounted) return
          setEntries(apiRows)
          setLoading(false)
          return
        }
      } catch {
        // fall through to supabase fallback
      }

      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('leaderboard')
          .select('id,wallet_address,username,meters,score,level')
          .order('score', { ascending: false })
          .limit(20)

        if (!mounted) return
        setEntries(Array.isArray(data) ? (data as LeaderboardEntry[]) : [])
      } catch {
        if (!mounted) return
        setEntries([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void run()
    return () => {
      mounted = false
    }
  }, [tab])

  return (
    <div className={`min-h-screen pb-[calc(108px+env(safe-area-inset-bottom))] ${isDark ? 'bg-[#060606]' : 'bg-[#f7f4ec]'}`}>
      <AppPageHeader title={t.title} icon={<UserRound className="h-5 w-5 text-orange-500" />} />

      <div className="px-4 pt-4">
        <div className={`grid grid-cols-2 gap-2 rounded-2xl p-2 ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
          <button
            onClick={() => setTab('profile')}
            className={`h-10 rounded-xl text-sm font-semibold transition-colors ${
              tab === 'profile'
                ? 'bg-orange-500 text-black'
                : isDark
                  ? 'bg-[#1a1a1a] text-white/75 hover:text-white'
                  : 'bg-[#f1ebdb] text-[#5f5134]'
            }`}
          >
            {t.myProfile}
          </button>
          <button
            onClick={() => setTab('leaderboard')}
            className={`h-10 rounded-xl text-sm font-semibold transition-colors ${
              tab === 'leaderboard'
                ? 'bg-orange-500 text-black'
                : isDark
                  ? 'bg-[#1a1a1a] text-white/75 hover:text-white'
                  : 'bg-[#f1ebdb] text-[#5f5134]'
            }`}
          >
            {t.leaderboard}
          </button>
        </div>
      </div>

      {tab === 'profile' ? (
        <div className="space-y-3 p-4">
          <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-orange-500/35 bg-black">
                <Image src="/images/kitten-reading.gif" alt="Kitten avatar" fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.wallet}</p>
                <p className={`mt-1 break-all text-[12px] font-semibold leading-snug ${isDark ? 'text-white' : 'text-[#222]'}`}>
                  {friendlyWalletAddress || t.notConnected}
                </p>
              </div>
              <button
                onClick={handleCopyWallet}
                disabled={!friendlyWalletAddress}
                className={`inline-flex h-9 items-center justify-center gap-1 rounded-lg border px-2 text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-orange-500/35 bg-black/45 text-orange-300 hover:bg-black/70 disabled:opacity-45'
                    : 'border-[#e2c98f] bg-[#f7ecd0] text-[#7a5a1d] hover:bg-[#f2e2ba] disabled:opacity-45'
                }`}
                title={copyWalletLabel}
                aria-label={copyWalletLabel}
              >
                {walletCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{walletCopied ? 'OK' : copyWalletLabel}</span>
              </button>
            </div>
          </div>

          <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.beerMugs}</p>
                <p className="text-3xl font-black text-orange-500">{formatNumber(coins)}</p>
              </div>
              <Beer className="h-7 w-7 text-orange-500" />
            </div>
          </div>

          <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.tokenBalance}</p>
                <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-[#222]'}`}>{formatNumber(Math.floor(napiwasBalance))}</p>
              </div>
              <Wallet className="h-7 w-7 text-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-xl p-3 text-center ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
              <p className={`text-xs ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.level}</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#222]'}`}>{level}</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
              <p className={`text-xs ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.score}</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#222]'}`}>{formatNumber(highScore)}</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
              <p className={`text-xs ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.meters}</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#222]'}`}>{formatNumber(Math.floor(totalMeters))}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 p-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className={`h-16 animate-pulse rounded-xl ${isDark ? 'bg-[#111111]' : 'bg-[#ece6d8]'}`} />
            ))
          ) : visibleEntries.length === 0 ? (
            <div className={`rounded-2xl p-8 text-center text-sm ${isDark ? 'bg-[#111111] text-white/60' : 'bg-white border border-[#e9e2d1] text-[#7a6a4b]'}`}>
              {t.fetchError}
            </div>
          ) : (
            visibleEntries.map((entry, index) => {
              const rowWallet = entry.wallet_address || ''
              const isMe = normalizedWalletCandidates.includes(normalizeAddress(rowWallet))
              const safeMeters = Math.max(0, Number(entry.meters || 0))
              const safeScore = Math.max(0, Number(entry.score || 0))
              const displayName = entry.username?.trim() || shortWalletAddress(rowWallet, 7, 5)

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                    isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'
                  } ${isMe ? 'ring-1 ring-orange-500/50' : ''}`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${isDark ? 'bg-black/55 text-orange-500' : 'bg-[#f3eddd] text-orange-700'}`}>
                    {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-[#222]'}`}>{displayName}</p>
                    <p className={`text-xs ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>
                      {formatNumber(safeMeters)} m В· {formatNumber(safeScore)}
                    </p>
                  </div>
                  <Trophy className="h-4 w-4 text-orange-500" />
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

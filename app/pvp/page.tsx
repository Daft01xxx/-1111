'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Plus, Users, Trophy, Clock, Coins, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store'
import { useTonWallet } from '@tonconnect/ui-react'
import { AppPageHeader } from '@/components/ui/app-page-header'
import { formatNumber } from '@/lib/utils'

interface PvPMatch {
  id: string
  creator_id: string | null
  opponent_id: string | null
  bet_amount: number
  match_type: string
  target_value: number | null
  status: string
  creator_score: number | null
  opponent_score: number | null
  winner_id: string | null
  created_at: string
}

const LOCAL_PVP_MATCHES_KEY = 'napiwas-local-pvp-matches-v1'
const LOCAL_PVP_GUEST_ID_KEY = 'napiwas-pvp-guest-id-v1'
const OPEN_MATCH_STATUSES = ['waiting', 'pending', 'active', 'in_progress'] as const

function readLocalPvpMatches(): PvPMatch[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_PVP_MATCHES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PvPMatch[]) : []
  } catch {
    return []
  }
}

function writeLocalPvpMatches(matches: PvPMatch[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCAL_PVP_MATCHES_KEY, JSON.stringify(matches))
}

function getOrCreateGuestPlayerId(): string {
  if (typeof window === 'undefined') return ''
  const existing = localStorage.getItem(LOCAL_PVP_GUEST_ID_KEY)
  if (existing) return existing
  const created = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  localStorage.setItem(LOCAL_PVP_GUEST_ID_KEY, created)
  return created
}

function buildLocalMatch(params: {
  creatorWallet: string
  betAmount: number
  matchType: 'score' | 'bosses'
}): PvPMatch {
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    creator_id: params.creatorWallet,
    opponent_id: null,
    bet_amount: params.betAmount,
    match_type: params.matchType,
    target_value: null,
    status: 'waiting',
    creator_score: null,
    opponent_score: null,
    winner_id: null,
    created_at: new Date().toISOString(),
  }
}

async function postPvp<T>(payload: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/pvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok || (json && typeof json.error === 'string')) {
    throw new Error((json && json.error) || 'PvP request failed')
  }
  return json as T
}

export default function PvPPage() {
  const router = useRouter()
  const wallet = useTonWallet()
  const { walletAddress, language, theme } = useGameStore()

  const connectedWalletAddress = wallet?.account?.address ?? walletAddress ?? null
  const [guestPlayerId, setGuestPlayerId] = useState<string | null>(null)
  const playerAddress = connectedWalletAddress ?? guestPlayerId
  const isDark = theme === 'dark'

  const [matches, setMatches] = useState<PvPMatch[]>([])
  const [myMatches, setMyMatches] = useState<PvPMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [betAmount, setBetAmount] = useState(100)
  const [matchType, setMatchType] = useState<'score' | 'bosses'>('score')
  const [creating, setCreating] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [pvpMode, setPvpMode] = useState<'remote' | 'local'>('local')
  const [pvpError, setPvpError] = useState<string | null>(null)
  const autoLaunchMatchRef = useRef<string | null>(null)
  const hasLoadedMatchesRef = useRef(false)

  useEffect(() => {
    if (connectedWalletAddress) {
      setGuestPlayerId(null)
      return
    }
    setGuestPlayerId(getOrCreateGuestPlayerId())
  }, [connectedWalletAddress])

  const t = {
    title: language === 'ru' ? 'PvP Р‘РёС‚РІР°' : 'PvP Battle',
    createMatch: language === 'ru' ? 'РЎРѕР·РґР°С‚СЊ РјР°С‚С‡' : 'Create Match',
    myMatches: language === 'ru' ? 'РњРѕРё РјР°С‚С‡Рё' : 'My Matches',
    available: language === 'ru' ? 'Р”РѕСЃС‚СѓРїРЅС‹Рµ РјР°С‚С‡Рё' : 'Available Matches',
    noMatches: language === 'ru' ? 'РќРµС‚ РґРѕСЃС‚СѓРїРЅС‹С… РјР°С‚С‡РµР№' : 'No matches available',
    createOrWait: language === 'ru' ? 'РЎРѕР·РґР°Р№С‚Рµ РјР°С‚С‡ РёР»Рё РїРѕРґРѕР¶РґРёС‚Рµ СЃРѕРїРµСЂРЅРёРєР°' : 'Create a match or wait for opponents',
    scoreBattle: language === 'ru' ? 'Р‘РёС‚РІР° РѕС‡РєРѕРІ' : 'Score Battle',
    bossRush: language === 'ru' ? 'РћС…РѕС‚Р° РЅР° Р±РѕСЃСЃРѕРІ' : 'Boss Rush',
    highestScore: language === 'ru' ? 'РџРѕР±РµР¶РґР°РµС‚ Р±РѕР»СЊС€РёР№ СЃС‡С‘С‚' : 'Highest score wins',
    mostBosses: language === 'ru' ? 'РџРѕР±РµР¶РґР°РµС‚ Р±РѕР»СЊС€Рµ Р±РѕСЃСЃРѕРІ' : 'Most bosses wins',
    matchType: language === 'ru' ? 'РўРёРї РјР°С‚С‡Р°' : 'Match Type',
    betAmount: language === 'ru' ? 'РЎС‚Р°РІРєР° (РєСЂСѓР¶РєРё)' : 'Bet Amount (Mugs)',
    winnerTakes: language === 'ru' ? 'РџРѕР±РµРґРёС‚РµР»СЊ РїРѕР»СѓС‡Р°РµС‚' : 'Winner takes',
    points: language === 'ru' ? 'РєСЂСѓР¶РµРє' : 'mugs',
    joinMatch: language === 'ru' ? 'РџСЂРёСЃРѕРµРґРёРЅРёС‚СЊСЃСЏ' : 'Join Match',
    playNow: language === 'ru' ? 'РРіСЂР°С‚СЊ' : 'Play Now',
    victory: language === 'ru' ? 'РџРѕР±РµРґР°' : 'Victory',
    defeat: language === 'ru' ? 'РџРѕСЂР°Р¶РµРЅРёРµ' : 'Defeat',
    yourScore: language === 'ru' ? 'Р’Р°С€ СЃС‡С‘С‚' : 'Your score',
    opponent: language === 'ru' ? 'РџСЂРѕС‚РёРІРЅРёРє' : 'Opponent',
    creating: language === 'ru' ? 'РЎРѕР·РґР°РЅРёРµ...' : 'Creating...',
    pending: language === 'ru' ? 'РћР¶РёРґР°РЅРёРµ' : 'PENDING',
    active: language === 'ru' ? 'РђРєС‚РёРІРµРЅ' : 'ACTIVE',
    completed: language === 'ru' ? 'Р—Р°РІРµСЂС€С‘РЅ' : 'COMPLETED',
    youCreated: language === 'ru' ? 'Р’С‹ СЃРѕР·РґР°Р»Рё' : 'You created',
    youJoined: language === 'ru' ? 'Р’С‹ РїСЂРёСЃРѕРµРґРёРЅРёР»РёСЃСЊ' : 'You joined',
    result: language === 'ru' ? 'Р РµР·СѓР»СЊС‚Р°С‚' : 'Result',
    runSaved: language === 'ru' ? 'Р Р°РЅ СЃРѕС…СЂР°РЅС‘РЅ' : 'Run submitted',
    checking: language === 'ru' ? 'РџСЂРѕРІРµСЂРєР°вЂ¦' : 'CheckingвЂ¦',
    loading: language === 'ru' ? 'Р—Р°РіСЂСѓР·РєР° PvPвЂ¦' : 'Loading PvPвЂ¦',
    modeRemote: language === 'ru' ? 'РћРЅР»Р°Р№РЅ PvP Р°РєС‚РёРІРµРЅ' : 'Online PvP is active',
    modeLocal: language === 'ru' ? 'Р›РѕРєР°Р»СЊРЅС‹Р№ С‚РµСЃС‚РѕРІС‹Р№ СЂРµР¶РёРј PvP' : 'Local PvP test mode',
  }

  const cardBorderClass = isDark ? 'border-[#8a4e12]/70' : 'border-border'
  const cardTopBorderClass = isDark ? 'border-[#8a4e12]/55' : 'border-border'
  const mutedCardClass = isDark ? 'bg-[#0f0f0f] border-[#8a4e12]/70' : 'bg-card border-border'

  const hasOpenMatch = useCallback((items: PvPMatch[], participantId: string) => {
    return items.some((match) =>
      (match.creator_id === participantId || match.opponent_id === participantId) &&
      OPEN_MATCH_STATUSES.includes(match.status as (typeof OPEN_MATCH_STATUSES)[number])
    )
  }, [])

  const loadLocalMatches = useCallback(() => {
    if (!playerAddress) {
      setMatches([])
      setMyMatches([])
      setLoading(false)
      return
    }

    const allMatches = readLocalPvpMatches()
    const availableMatches = allMatches
      .filter((match) => (match.status === 'waiting' || match.status === 'pending') && match.creator_id !== playerAddress)
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      .slice(0, 20)

    const ownMatches = allMatches
      .filter((match) => match.creator_id === playerAddress || match.opponent_id === playerAddress)
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      .slice(0, 20)

    setMatches(availableMatches)
    setMyMatches(ownMatches)
    setLoading(false)
  }, [playerAddress])

  useEffect(() => {
    const identity = playerAddress?.trim()
    if (!identity) {
      setUserId(null)
      setPvpMode('local')
      setPvpError(null)
      return
    }

    const syncUser = async () => {
      try {
        const response = await postPvp<{ userId: string }>({
          action: 'upsert_user',
          identity,
        })
        setUserId(response.userId)
        setPvpMode('remote')
        setPvpError(null)
      } catch (error) {
        setUserId(null)
        setPvpMode('local')
        setPvpError(error instanceof Error ? error.message : 'Failed to initialize PvP user')
      }
    }

    void syncUser()
  }, [playerAddress])

  const fetchMatches = useCallback(async () => {
    if (!playerAddress) {
      setMatches([])
      setMyMatches([])
      setLoading(false)
      return
    }

    if (!userId) {
      loadLocalMatches()
      return
    }

    if (!hasLoadedMatchesRef.current) {
      setLoading(true)
    }
    try {
      const response = await postPvp<{ matches: PvPMatch[]; myMatches: PvPMatch[] }>({
        action: 'list',
        userId,
      })
      setMatches(response.matches ?? [])
      setMyMatches(response.myMatches ?? [])
      hasLoadedMatchesRef.current = true
      setPvpMode('remote')
      setPvpError(null)
      setLoading(false)
    } catch (error) {
      // Keep online mode and retry on next poll; do not permanently fall back
      // to local mode after transient API/network errors.
      setPvpError(error instanceof Error ? error.message : 'Failed to load online matches')
    } finally {
      if (!hasLoadedMatchesRef.current) {
        setLoading(false)
      }
    }
  }, [loadLocalMatches, playerAddress, userId])

  useEffect(() => {
    if (!playerAddress) return
    hasLoadedMatchesRef.current = false
    setLoading(true)
    void fetchMatches()
  }, [fetchMatches, playerAddress])

  useEffect(() => {
    if (!playerAddress) return
    const intervalId = window.setInterval(() => {
      void fetchMatches()
    }, 2500)
    return () => window.clearInterval(intervalId)
  }, [fetchMatches, playerAddress])

  const handleCreateMatch = async () => {
    if (!playerAddress || creating) return
    const normalizedBet = Math.max(0, Math.floor(Number.isFinite(betAmount) ? betAmount : 0))

    const participantId = userId ?? playerAddress
    if (participantId && hasOpenMatch(myMatches, participantId)) {
      setPvpError(language === 'ru' ? 'РЎРЅР°С‡Р°Р»Р° Р·Р°РІРµСЂС€РёС‚Рµ С‚РµРєСѓС‰РёР№ РјР°С‚С‡' : 'Finish your current match first')
      return
    }

    setCreating(true)
    setPvpError(null)

    if (!userId) {
      const localMatches = readLocalPvpMatches()
      const hasAnyOpenLocalMatch = localMatches.some((entry) =>
        OPEN_MATCH_STATUSES.includes(entry.status as (typeof OPEN_MATCH_STATUSES)[number])
      )
      if (hasAnyOpenLocalMatch) {
        setPvpError(language === 'ru' ? 'РЎРµР№С‡Р°СЃ СѓР¶Рµ РµСЃС‚СЊ Р°РєС‚РёРІРЅС‹Р№ РјР°С‚С‡' : 'There is already an active match')
        setCreating(false)
        return
      }

      localMatches.unshift(
        buildLocalMatch({
          creatorWallet: playerAddress,
          betAmount: normalizedBet,
          matchType,
        })
      )
      writeLocalPvpMatches(localMatches)
      setShowCreateModal(false)
      loadLocalMatches()
      setCreating(false)
      return
    }

    try {
      await postPvp<{ match: PvPMatch }>({
        action: 'create',
        userId,
        betAmount: normalizedBet,
        matchType,
      })
      setShowCreateModal(false)
      await fetchMatches()
    } catch (error) {
      setPvpError(error instanceof Error ? error.message : 'Failed to create match')
    } finally {
      setCreating(false)
    }
  }

  const handleJoinMatch = async (match: PvPMatch) => {
    if (!playerAddress || (match.status !== 'waiting' && match.status !== 'pending')) return

    const participantId = userId ?? playerAddress
    if (participantId && hasOpenMatch(myMatches, participantId)) {
      setPvpError(language === 'ru' ? 'РЎРЅР°С‡Р°Р»Р° Р·Р°РІРµСЂС€РёС‚Рµ С‚РµРєСѓС‰РёР№ РјР°С‚С‡' : 'Finish your current match first')
      return
    }

    if (!userId || match.id.startsWith('local-')) {
      const localMatches = readLocalPvpMatches()
      const updated = localMatches.map((entry) =>
        entry.id === match.id
          ? { ...entry, opponent_id: playerAddress, status: 'active' }
          : entry
      )
      writeLocalPvpMatches(updated)
      loadLocalMatches()
      router.push(`/play?pvp=${match.id}`)
      return
    }

    try {
      await postPvp<{ match: PvPMatch }>({
        action: 'join',
        userId,
        matchId: match.id,
      })
      await fetchMatches()
      router.push(`/play?pvp=${match.id}`)
    } catch (error) {
      setPvpError(error instanceof Error ? error.message : 'Failed to join match')
      await fetchMatches()
    }
  }

  useEffect(() => {
    const participantId = userId ?? playerAddress
    if (!participantId) return

    const readyMatch = myMatches.find((match) => {
      if (!(match.status === 'active' || match.status === 'in_progress')) return false
      if (!match.creator_id || !match.opponent_id) return false
      if (match.creator_id === participantId) return match.creator_score === null
      if (match.opponent_id === participantId) return match.opponent_score === null
      return false
    })

    if (!readyMatch) {
      autoLaunchMatchRef.current = null
      return
    }

    if (autoLaunchMatchRef.current === readyMatch.id) return
    autoLaunchMatchRef.current = readyMatch.id
    router.push(`/play?pvp=${readyMatch.id}`)
  }, [myMatches, playerAddress, router, userId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
      case 'pending':
        return 'text-orange-400 bg-orange-400/20'
      case 'active':
      case 'in_progress':
        return 'text-blue-400 bg-blue-400/20'
      case 'completed':
        return 'text-green-400 bg-green-400/20'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
      case 'pending':
        return t.pending
      case 'active':
      case 'in_progress':
        return t.active
      case 'completed':
        return t.completed
      default:
        return status.toUpperCase()
    }
  }

  const renderMetric = (value: number | null) => {
    if (value === null || value === undefined) return 'вЂ”'
    return String(value)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[rgb(var(--background))] pb-[calc(108px+env(safe-area-inset-bottom))]">
      <AppPageHeader
        title={t.title}
        icon={<Swords className="h-5 w-5 text-orange-500" />}
      />

      <div className="p-4 space-y-6">
        {!playerAddress ? (
          <div className="text-center py-12">
            <Swords className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        ) : (
          <>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              disabled={creating || ((userId ?? playerAddress) ? hasOpenMatch(myMatches, (userId ?? playerAddress) as string) : false)}
              className="w-full p-4 rounded-2xl bg-orange-500 hover:bg-orange-400 border border-orange-300 flex items-center justify-center gap-3 font-bold text-black shadow-[0_10px_30px_rgba(245,158,11,0.35)] transition-colors disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Plus className="w-6 h-6" />
              {t.createMatch}
            </motion.button>

            <div className="rounded-xl border border-orange-300/40 bg-orange-500/10 px-3 py-2 text-xs text-orange-300">
              {pvpError ? pvpError : pvpMode === 'local' ? t.modeLocal : t.modeRemote}
            </div>

            {myMatches.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  {t.myMatches}
                </h2>
                <div className="space-y-3">
                  {myMatches.map((match) => {
                    const currentParticipantId = userId ?? playerAddress
                    const isCreator = match.creator_id === currentParticipantId
                    const isWinner = match.winner_id === currentParticipantId
                    const myScoreSubmitted = isCreator ? match.creator_score !== null : match.opponent_score !== null
                    const hasBothPlayers = Boolean(match.creator_id && match.opponent_id)
                    const canStartRun =
                      hasBothPlayers &&
                      (match.status === 'active' || match.status === 'in_progress') &&
                      !myScoreSubmitted

                    return (
                      <motion.div
                        key={match.id}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border bg-card ${match.status === 'completed' && isWinner ? 'border-green-500/30 bg-green-500/5' : cardBorderClass}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(match.status)}`}>
                            {getStatusText(match.status)}
                          </span>
                          <div className="flex items-center gap-1 text-orange-500">
                            <Coins className="w-4 h-4" />
                            <span className="font-bold">{formatNumber(match.bet_amount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{isCreator ? t.youCreated : t.youJoined}</p>
                            <p className="font-medium text-foreground">{match.match_type === 'score' ? t.scoreBattle : t.bossRush}</p>
                          </div>

                          {canStartRun && (
                            <Link href={`/play?pvp=${match.id}`}>
                              <motion.span whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-lg beer-gradient text-dark-950 font-bold text-sm inline-block">
                                {t.playNow}
                              </motion.span>
                            </Link>
                          )}

                          {!canStartRun && myScoreSubmitted && match.status !== 'completed' && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t.checking}</p>
                              <p className="text-xs font-semibold text-orange-400">{t.runSaved}</p>
                            </div>
                          )}

                          {match.status === 'completed' && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t.result}</p>
                              <p className={`font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
                                {isWinner ? t.victory : t.defeat}
                              </p>
                            </div>
                          )}
                        </div>

                        {match.status === 'completed' && (
                          <div className={`flex items-center justify-between mt-3 pt-3 border-t text-sm ${cardTopBorderClass}`}>
                            <span className="text-muted-foreground">
                                {t.yourScore}:{' '}
                                <span className="text-foreground font-bold">
                                  {renderMetric(isCreator ? match.creator_score : match.opponent_score)}
                                </span>
                              </span>
                              <span className="text-muted-foreground">
                                {t.opponent}:{' '}
                                <span className="text-foreground font-bold">
                                  {renderMetric(isCreator ? match.opponent_score : match.creator_score)}
                                </span>
                              </span>
                            </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                {t.available}
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : matches.length === 0 ? (
                <div className={`text-center py-8 rounded-xl border ${mutedCardClass}`}>
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground">{t.noMatches}</p>
                  <p className="text-sm text-muted-foreground">{t.createOrWait}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match) => (
                    <motion.div
                      key={match.id}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl bg-card border ${cardBorderClass}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-foreground">
                          {match.match_type === 'score' ? t.scoreBattle : t.bossRush}
                        </p>
                        <div className="flex items-center gap-1 text-orange-500">
                          <Coins className="w-5 h-5" />
                          <span className="text-lg font-bold">{formatNumber(match.bet_amount)}</span>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleJoinMatch(match)}
                        className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-400 border border-orange-300 text-black font-bold transition-colors shadow-[0_8px_22px_rgba(245,158,11,0.3)]"
                      >
                        {t.joinMatch}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/70 p-4 pb-28 sm:pb-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className={`w-full max-w-md max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border bg-[rgb(var(--card))] shadow-[0_24px_60px_rgba(0,0,0,0.55)] ${cardBorderClass}`}
            >
              <div className={`flex items-center justify-between p-4 border-b ${cardTopBorderClass}`}>
                <h3 className="text-lg font-bold text-foreground">{t.createMatch}</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 -m-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.matchType}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMatchType('score')}
                      className={`p-3 rounded-xl border-2 transition-colors text-left ${matchType === 'score' ? 'border-beer-500 bg-beer-500/10' : `${cardBorderClass} bg-muted hover:border-orange-500/55`}`}
                    >
                      <p className="font-bold text-foreground">{t.scoreBattle}</p>
                      <p className="text-xs text-muted-foreground">{t.highestScore}</p>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMatchType('bosses')}
                      className={`p-3 rounded-xl border-2 transition-colors text-left ${matchType === 'bosses' ? 'border-beer-500 bg-beer-500/10' : `${cardBorderClass} bg-muted hover:border-orange-500/55`}`}
                    >
                      <p className="font-bold text-foreground">{t.bossRush}</p>
                      <p className="text-xs text-muted-foreground">{t.mostBosses}</p>
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.betAmount}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 250, 500, 1000].map((amount) => (
                      <motion.button
                        key={amount}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setBetAmount(amount)}
                        className={`py-2 px-3 rounded-lg font-bold text-sm transition-colors ${betAmount === amount ? 'bg-beer-500 text-dark-950' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                      >
                        {amount}
                      </motion.button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={Number.isFinite(betAmount) ? betAmount : 0}
                      onChange={(event) => {
                        const raw = event.target.value
                        if (raw === '') {
                          setBetAmount(0)
                          return
                        }
                        const next = Math.max(0, Math.floor(Number(raw)))
                        if (Number.isFinite(next)) setBetAmount(next)
                      }}
                      className={`w-full rounded-lg border px-3 py-2 text-sm bg-[rgb(var(--card))] text-foreground ${cardBorderClass}`}
                      placeholder={language === 'ru' ? 'РЎРІРѕСЏ СЃС‚Р°РІРєР°' : 'Custom bet'}
                    />
                  </div>
                </div>

                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">
                    {t.winnerTakes} {Math.floor(betAmount * 2 * 0.95)} {t.points} (95%)
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateMatch}
                  disabled={creating}
                  className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-400 border border-orange-300 text-black font-bold disabled:opacity-50 transition-colors"
                >
                  {creating ? t.creating : t.createMatch}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

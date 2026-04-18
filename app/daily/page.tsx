'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTonWallet } from '@tonconnect/ui-react'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/lib/store'
import { AppPageHeader } from '@/components/ui/app-page-header'
import {
  Beer,
  Calendar,
  Check,
  Flame,
  Gift,
  Globe,
  Hammer,
  Image as ImageIcon,
  Megaphone,
  MessageCircle,
  Rocket,
  Route,
  Swords,
  Trophy,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

interface DexTask {
  id: string
  name: string
  description: string
  url: string
  reward_points: number
}

interface GameQuest {
  id: string
  name: string
  description: string
  reward_points: number
  metric: 'bosses' | 'meters' | 'score' | 'level'
  target: number
}

const DEX_TASK_ICONS: Record<string, LucideIcon> = {
  'napiwas-site': Globe,
  'napiwas-channel': Megaphone,
  'napiwas-chat': MessageCircle,
  'tokenmystery-bot': Hammer,
  'blum-memepad-1': Rocket,
  'dexscreener-ton': Rocket,
  'dyor-token': Globe,
  'geckoterminal-pool': Rocket,
  'blum-memepad-2': Rocket,
  'stonfi-swap': Route,
  'nft-collection-arni': ImageIcon,
  'nft-collection-jsi': ImageIcon,
}

const DEX_TASK_LOGOS: Partial<Record<DexTask['id'], string>> = {
  'napiwas-channel': '/icons/dex/telegram.svg',
  'napiwas-chat': '/icons/dex/telegram.svg',
  'tokenmystery-bot': '/icons/dex/telegram.svg',
  'dexscreener-ton': '/icons/dex/dexscreener.svg',
  'dyor-token': '/icons/dex/dyor.svg',
  'geckoterminal-pool': '/icons/dex/geckoterminal.svg',
  'stonfi-swap': '/icons/dex/stonfi.svg',
}

const QUEST_ICONS: Record<GameQuest['metric'], LucideIcon> = {
  bosses: Swords,
  meters: Route,
  score: Trophy,
  level: Flame,
}

const EXACT_DEX_TASKS: DexTask[] = [
  {
    id: 'napiwas-site',
    name: 'NaPiwas - СЃР°Р№С‚',
    description: 'РћС‚РєСЂС‹С‚СЊ napiwas.com',
    url: 'https://napiwas.com/',
    reward_points: 100,
  },
  {
    id: 'napiwas-channel',
    name: 'NaPiwas - РєР°РЅР°Р»',
    description: 'РћС‚РєСЂС‹С‚СЊ РѕС„РёС†РёР°Р»СЊРЅС‹Р№ РєР°РЅР°Р»',
    url: 'https://t.me/NAPIWASofficial',
    reward_points: 120,
  },
  {
    id: 'napiwas-chat',
    name: 'NaPiwas - С‡Р°С‚',
    description: 'РћС‚РєСЂС‹С‚СЊ С‡Р°С‚ СЃРѕРѕР±С‰РµСЃС‚РІР°',
    url: 'https://t.me/napiwas',
    reward_points: 120,
  },
  {
    id: 'tokenmystery-bot',
    name: 'tokenmystery_bot',
    description: 'РџРµСЂРµР№С‚Рё РІ tokenmystery_bot',
    url: 'https://t.me/tokenmystery_bot?startapp=ref_335984221',
    reward_points: 130,
  },
  {
    id: 'blum-memepad-1',
    name: 'Blum Memepad',
    description: 'РћС‚РєСЂС‹С‚СЊ Blum memepad',
    url: 'https://t.me/blum/app?startapp=memepadjetton_NAPIWAS_wlN45-ref_',
    reward_points: 150,
  },
  {
    id: 'dexscreener-ton',
    name: 'DexScreener',
    description: 'РћС‚РєСЂС‹С‚СЊ РїР°СЂСѓ NAPIWAS РЅР° DexScreener',
    url: 'https://dexscreener.com/ton/eqax24y9iugryybpwxgogtvz05k_xfgn70-jakrlngoyen6p',
    reward_points: 140,
  },
  {
    id: 'dyor-token',
    name: 'DYOR',
    description: 'РћС‚РєСЂС‹С‚СЊ СЃС‚СЂР°РЅРёС†Сѓ С‚РѕРєРµРЅР° РЅР° DYOR',
    url: 'https://dyor.io/ru/token/EQDOCUp_pDBvOmGRyEDE2bnCl2cjGmAWjPsTWRt_veSsfGSn',
    reward_points: 140,
  },
  {
    id: 'geckoterminal-pool',
    name: 'GeckoTerminal',
    description: 'РћС‚РєСЂС‹С‚СЊ РїСѓР» РЅР° GeckoTerminal',
    url: 'https://www.geckoterminal.com/ru/ton/pools/EQAx24y9IUgryyBpWxgOgTVz05k_xfgn70-JakrLngoyEN6P',
    reward_points: 140,
  },
  {
    id: 'blum-memepad-2',
    name: 'Blum Memepad (ref)',
    description: 'РћС‚РєСЂС‹С‚СЊ Blum memepad (ref)',
    url: 'https://t.me/blum/app?startapp=memepadjetton_NAPIWAS_wlN45-ref_VV7ujr1qAH',
    reward_points: 150,
  },
  {
    id: 'stonfi-swap',
    name: 'STON.fi Swap',
    description: 'РћС‚РєСЂС‹С‚СЊ swap TON -> NAPIWAS',
    url: 'https://app.ston.fi/swap?chartVisible=false&chartInterval=1w&ft=TON&tt=EQDOCUp_pDBvOmGRyEDE2bnCl2cjGmAWjPsTWRt_veSsfGSn',
    reward_points: 160,
  },
  {
    id: 'nft-collection-arni',
    name: 'NFT NAPIWAS & ARNI',
    description: 'РћС‚РєСЂС‹С‚СЊ РєРѕР»Р»РµРєС†РёСЋ NFT',
    url: 'https://getgems.io/collection/EQBxyfZWx6VK4CQw7m0CpC6g3g23QZnHD0q5t0ZjUdagYjKb',
    reward_points: 170,
  },
  {
    id: 'nft-collection-jsi',
    name: 'NFT NAPIWAS & JSI',
    description: 'РћС‚РєСЂС‹С‚СЊ РєРѕР»Р»РµРєС†РёСЋ NFT',
    url: 'https://getgems.io/collection/EQA3rkcoahIFvfRY4LKsPfdgjUyvWOp-D3S2Qlc-QiqGn1fU',
    reward_points: 170,
  },
]

const GAME_QUESTS: GameQuest[] = [
  {
    id: 'quest-boss-10',
    name: 'Boss Hunter',
    description: 'Defeat 10 bosses',
    reward_points: 1500,
    metric: 'bosses',
    target: 10,
  },
  {
    id: 'quest-meters-10000',
    name: 'Long Run',
    description: 'Travel 10,000 meters total',
    reward_points: 1200,
    metric: 'meters',
    target: 10000,
  },
  {
    id: 'quest-score-5000',
    name: 'Score Burst',
    description: 'Reach high score 5,000+',
    reward_points: 900,
    metric: 'score',
    target: 5000,
  },
  {
    id: 'quest-level-10',
    name: 'Captain Rank',
    description: 'Reach level 10',
    reward_points: 1000,
    metric: 'level',
    target: 10,
  },
]

const STREAK_REWARDS = [
  { days: 1, points: 100 },
  { days: 3, points: 150 },
  { days: 7, points: 300 },
  { days: 14, points: 500 },
  { days: 30, points: 1000 },
] as const

const DEX_COMPLETED_STORAGE_KEY = 'napiwas-dex-tasks-completed-v1'
const QUEST_CLAIMED_STORAGE_KEY = 'napiwas-game-quests-claimed-v1'
const LOCAL_CHECKIN_STATE_KEY = 'napiwas-local-checkin-v1'

const getDexCompletedStorageKey = (walletKey: string | null) =>
  walletKey ? `${DEX_COMPLETED_STORAGE_KEY}:${walletKey}` : DEX_COMPLETED_STORAGE_KEY

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayString() {
  return new Date(Date.now() - 86400000).toISOString().split('T')[0]
}

export default function DailyPage() {
  const wallet = useTonWallet()
  const { walletAddress, addScore, theme, language, addCoins, bossesDefeated, totalMeters, highScore, level } = useGameStore()
  const effectiveWalletAddress = walletAddress || wallet?.account?.address || null

  const [streak, setStreak] = useState(0)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [dexTasks, setDexTasks] = useState<DexTask[]>([])
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [checkingTaskIds, setCheckingTaskIds] = useState<Set<string>>(new Set())
  const [claimedGameQuests, setClaimedGameQuests] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'daily' | 'dex' | 'quests'>('daily')
  const [actionError, setActionError] = useState<string | null>(null)
  const [claimingQuestId, setClaimingQuestId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const taskDelayTimeoutsRef = useRef<Record<string, number>>({})
  const completedTasksRef = useRef<Set<string>>(new Set())

  const t = {
    title: language === 'ru' ? 'РќР°РіСЂР°РґС‹' : 'Daily Rewards',
    checkin: language === 'ru' ? 'Р‘РѕРЅСѓСЃ' : 'Bonus',
    checkinDesc: language === 'ru' ? 'Р—Р°С…РѕРґРёС‚Рµ РєР°Р¶РґС‹Р№ РґРµРЅСЊ Р·Р° РЅР°РіСЂР°РґРѕР№!' : 'Come back every day for rewards!',
    streak: language === 'ru' ? 'РЎРµСЂРёСЏ' : 'Streak',
    checkIn: language === 'ru' ? 'РџРѕР»СѓС‡РёС‚СЊ' : 'Check in',
    checkedIn: language === 'ru' ? 'РџРѕР»СѓС‡РµРЅРѕ СЃРµРіРѕРґРЅСЏ!' : 'Checked in today!',
    checking: language === 'ru' ? 'РџСЂРѕРІРµСЂРєР°...' : 'Checking...',
    streakBonuses: language === 'ru' ? 'Р‘РѕРЅСѓСЃС‹ Р·Р° СЃРµСЂРёСЋ' : 'Streak Bonuses',
    dexTasks: language === 'ru' ? 'Р—Р°РґР°РЅРёСЏ DEX' : 'DEX Tasks',
    dexTasksDesc: language === 'ru' ? 'Р’С‹РїРѕР»РЅСЏР№С‚Рµ Р·Р°РґР°РЅРёСЏ РґР»СЏ Р±РѕРЅСѓСЃРѕРІ!' : 'Complete tasks for bonus points!',
    noTasks: language === 'ru' ? 'РџРѕРєР° РЅРµС‚ Р·Р°РґР°РЅРёР№' : 'No tasks available',
    quests: language === 'ru' ? 'Р—Р°РґР°РЅРёСЏ' : 'Quests',
    questsDesc: language === 'ru' ? 'РРіСЂРѕРІС‹Рµ С†РµР»Рё СЃ РЅР°РіСЂР°РґР°РјРё Р·Р° РїСЂРѕРіСЂРµСЃСЃ' : 'Game goals with reward claims',
    claim: language === 'ru' ? 'Р—Р°Р±СЂР°С‚СЊ' : 'Claim',
    claimed: language === 'ru' ? 'Р—Р°Р±СЂР°РЅРѕ' : 'Claimed',
    open: language === 'ru' ? 'РћС‚РєСЂС‹С‚СЊ' : 'Open',
    wait: language === 'ru' ? 'РџСЂРѕРІРµСЂРєР°...' : 'Wait...',
    notReady: language === 'ru' ? 'Р¦РµР»СЊ РµС‰С‘ РЅРµ РІС‹РїРѕР»РЅРµРЅР°' : 'Goal is not completed yet',
    rewardClaimFailed: language === 'ru' ? 'РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°Р±СЂР°С‚СЊ РЅР°РіСЂР°РґСѓ, РїРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ СЂР°Р·' : 'Could not claim reward, please retry',
    connectWallet: language === 'ru' ? 'РџРѕРґРєР»СЋС‡РёС‚Рµ РєРѕС€РµР»РµРє' : 'Connect wallet',
    connectWalletDesc: language === 'ru' ? 'Р”Р»СЏ РїРѕР»СѓС‡РµРЅРёСЏ РЅР°РіСЂР°Рґ РїРѕРґРєР»СЋС‡РёС‚Рµ TON РєРѕС€РµР»РµРє' : 'Connect your TON wallet to access daily rewards',
    goToMenu: language === 'ru' ? 'Рљ РјРµРЅСЋ' : 'Go to Menu',
    days: language === 'ru' ? 'РґРЅРµР№' : 'days',
    day: language === 'ru' ? 'РґРµРЅСЊ' : 'day',
  }

  const isDark = theme === 'dark'

  const readLocalCheckIn = (walletKey: string) => {
    try {
      const raw = localStorage.getItem(`${LOCAL_CHECKIN_STATE_KEY}:${walletKey}`)
      if (!raw) return null
      const parsed = JSON.parse(raw) as { date?: string; streak?: number }
      if (!parsed?.date || typeof parsed?.streak !== 'number') return null
      return { date: parsed.date, streak: parsed.streak }
    } catch {
      return null
    }
  }

  const writeLocalCheckIn = (walletKey: string, date: string, streakCount: number) => {
    localStorage.setItem(
      `${LOCAL_CHECKIN_STATE_KEY}:${walletKey}`,
      JSON.stringify({ date, streak: streakCount })
    )
  }

  const questProgress = useMemo(() => {
    const progressMap = new Map<string, { current: number; target: number; done: boolean; percent: number }>()
    for (const quest of GAME_QUESTS) {
      const current =
        quest.metric === 'bosses'
          ? bossesDefeated
          : quest.metric === 'meters'
            ? totalMeters
            : quest.metric === 'score'
              ? highScore
              : level

      const percent = Math.max(0, Math.min(100, Math.floor((current / quest.target) * 100)))
      progressMap.set(quest.id, {
        current,
        target: quest.target,
        done: current >= quest.target,
        percent,
      })
    }
    return progressMap
  }, [bossesDefeated, totalMeters, highScore, level])

  const getStreakMilestoneBonus = (previousStreak: number, nextStreak: number) => {
    return STREAK_REWARDS
      .filter((reward) => reward.days > previousStreak && reward.days <= nextStreak)
      .reduce((sum, reward) => sum + reward.points, 0)
  }

  useEffect(() => {
    try {
      const rawDexTasks = localStorage.getItem(getDexCompletedStorageKey(effectiveWalletAddress))
      const rawClaimedQuests = localStorage.getItem(QUEST_CLAIMED_STORAGE_KEY)

      if (rawDexTasks) {
        const parsed = JSON.parse(rawDexTasks) as string[]
        setCompletedTasks(new Set(parsed))
      } else {
        setCompletedTasks(new Set())
      }

      if (rawClaimedQuests) {
        const parsed = JSON.parse(rawClaimedQuests) as string[]
        setClaimedGameQuests(new Set(parsed))
      }
    } catch {
      // ignore malformed local storage
    }
  }, [effectiveWalletAddress])

  useEffect(() => {
    completedTasksRef.current = completedTasks
  }, [completedTasks])

  useEffect(() => {
    return () => {
      Object.values(taskDelayTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      taskDelayTimeoutsRef.current = {}
    }
  }, [])

  useEffect(() => {
    if (!effectiveWalletAddress) {
      setLoading(false)
      return
    }

    const localCheckIn = readLocalCheckIn(effectiveWalletAddress)
    if (localCheckIn) {
      const today = getTodayString()
      setStreak(localCheckIn.streak)
      setCheckedInToday(localCheckIn.date === today)
    }

    const fetchData = async () => {
      try {
        const supabase = createClient()

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', effectiveWalletAddress)
          .single()

        if (!user) {
          setDexTasks(EXACT_DEX_TASKS)
          setLoading(false)
          return
        }

        const { data: checkins } = await supabase
          .from('daily_checkins')
          .select('checkin_date, streak_count')
          .eq('wallet_address', effectiveWalletAddress)
          .order('checkin_date', { ascending: false })
          .limit(30)

        if (checkins && checkins.length > 0) {
          const today = getTodayString()
          const lastCheckin = checkins[0]
          setCheckedInToday(lastCheckin.checkin_date === today)
          setStreak(Number(lastCheckin.streak_count || 0))
        }

        setDexTasks(EXACT_DEX_TASKS)

        const { data: userTasks } = await supabase
          .from('user_tasks')
          .select('task_id')
          .eq('user_id', user.id)

        if (userTasks) {
          const localCompleted = (() => {
            try {
              const parsed = JSON.parse(
                localStorage.getItem(getDexCompletedStorageKey(effectiveWalletAddress)) || '[]'
              ) as string[]
              return new Set(parsed)
            } catch {
              return new Set<string>()
            }
          })()

          const merged = new Set<string>([
            ...localCompleted,
            ...userTasks.map((task) => task.task_id),
          ])
          setCompletedTasks(merged)
        }
      } catch {
        setDexTasks(EXACT_DEX_TASKS)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [effectiveWalletAddress])

  const applyDailyReward = (previousStreak: number, nextStreak: number, baseBonus: number) => {
    if (!effectiveWalletAddress) return
    const milestoneBonus = getStreakMilestoneBonus(previousStreak, nextStreak)
    const totalBonus = baseBonus + milestoneBonus

    setStreak(nextStreak)
    setCheckedInToday(true)
    addScore(totalBonus)
    addCoins(totalBonus)
    writeLocalCheckIn(effectiveWalletAddress, getTodayString(), nextStreak)
  }

  const handleCheckIn = async () => {
    if (!effectiveWalletAddress || checkedInToday || checkingIn) return

    setCheckingIn(true)
    setActionError(null)

    const previousStreak = streak

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: effectiveWalletAddress }),
      })
      const payload = await response.json().catch(() => null)

      if (response.ok && payload?.success) {
        const nextStreak = Number(payload.streak || 1)
        const baseBonus = Number(payload.bonus || 100)
        applyDailyReward(previousStreak, nextStreak, baseBonus)
        return
      }

      if (payload?.alreadyCheckedIn) {
        setCheckedInToday(true)
        return
      }
    } catch {
      // fallback to local reward below
    }

    try {
      const localState = readLocalCheckIn(effectiveWalletAddress)
      const today = getTodayString()
      const yesterday = getYesterdayString()
      let nextStreak = 1

      if (localState) {
        if (localState.date === yesterday) {
          nextStreak = localState.streak + 1
        } else if (localState.date === today) {
          setCheckedInToday(true)
          setStreak(localState.streak)
          return
        }
      }

      const baseBonus = Math.min(100 + (nextStreak - 1) * 25, 500)
      applyDailyReward(previousStreak, nextStreak, baseBonus)
    } catch {
      setActionError(t.rewardClaimFailed)
    } finally {
      setCheckingIn(false)
    }
  }

  const handleTaskComplete = async (task: DexTask) => {
    if (!effectiveWalletAddress || completedTasks.has(task.id) || checkingTaskIds.has(task.id)) return

    setActionError(null)
    window.open(task.url, '_blank')
    setCheckingTaskIds((prev) => new Set([...prev, task.id]))

    const timeoutId = window.setTimeout(async () => {
      setCheckingTaskIds((prev) => {
        const next = new Set(prev)
        next.delete(task.id)
        return next
      })
      delete taskDelayTimeoutsRef.current[task.id]

      if (completedTasksRef.current.has(task.id)) return

      const updatedCompleted = new Set([...completedTasksRef.current, task.id])
      setCompletedTasks(updatedCompleted)
      localStorage.setItem(getDexCompletedStorageKey(effectiveWalletAddress), JSON.stringify(Array.from(updatedCompleted)))
      addScore(task.reward_points)
      addCoins(task.reward_points)

      const supabase = createClient()
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', effectiveWalletAddress)
        .single()

      if (!user) return

      const { error } = await supabase.from('user_tasks').insert({
        user_id: user.id,
        task_id: task.id,
      })

      if (error) {
        setActionError(t.rewardClaimFailed)
      }
    }, 30000)

    taskDelayTimeoutsRef.current[task.id] = timeoutId
  }

  const handleGameQuestClaim = async (quest: GameQuest) => {
    if (!effectiveWalletAddress || claimedGameQuests.has(quest.id)) return
    setActionError(null)
    setClaimingQuestId(quest.id)

    try {
      const progress = questProgress.get(quest.id)
      if (!progress?.done) {
        setActionError(t.notReady)
        return
      }

      addScore(quest.reward_points)
      addCoins(quest.reward_points)

      const updatedClaims = new Set([...claimedGameQuests, quest.id])
      setClaimedGameQuests(updatedClaims)
      localStorage.setItem(QUEST_CLAIMED_STORAGE_KEY, JSON.stringify(Array.from(updatedClaims)))

      const supabase = createClient()
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', effectiveWalletAddress)
        .single()

      if (user) {
        const { error } = await supabase.from('user_tasks').insert({
          user_id: user.id,
          task_id: quest.id,
        })
        if (error) {
          setActionError(t.rewardClaimFailed)
        }
      }
    } finally {
      setClaimingQuestId(null)
    }
  }

  const completedDaysInCycle = checkedInToday ? (streak % 7 || 7) : streak % 7
  const giftDayInCycle = completedDaysInCycle >= 7 ? 1 : completedDaysInCycle + 1

  const renderDexTaskIcon = (task: DexTask, isCompleted: boolean, isChecking: boolean) => {
    if (isCompleted) {
      return <Check className="w-4 h-4 text-green-500" />
    }
    if (isChecking) {
      return <Calendar className="w-4 h-4 text-orange-500 animate-pulse" />
    }

    const logo = DEX_TASK_LOGOS[task.id]
    if (logo) {
      return (
        <Image
          src={logo}
          alt={task.name}
          width={18}
          height={18}
          className="w-[18px] h-[18px] object-contain"
          unoptimized
        />
      )
    }

    const Icon = DEX_TASK_ICONS[task.id] ?? ExternalLinkFallback
    return <Icon className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[rgb(var(--background))] pb-[calc(108px+env(safe-area-inset-bottom))]">
      <AppPageHeader title={t.title} icon={<Calendar className="w-5 h-5 text-orange-500" />} />

      <div className="p-4 space-y-4">
        {!wallet ? (
          <div
            className="text-center py-12 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]"
            style={{ animation: 'fadeInUp 0.3s ease' }}
          >
            <Wallet className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
            <h3 className="font-bold text-lg mb-2 text-[rgb(var(--foreground))]">{t.connectWallet}</h3>
            <p className="text-sm mb-4 text-[rgb(var(--muted-foreground))]">{t.connectWalletDesc}</p>
            <Link href="/" className="menu-play-button inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-[#1a1a1a]">
              {t.goToMenu}
            </Link>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="h-40 rounded-2xl animate-pulse bg-[rgb(var(--card))]" />
            <div className="h-48 rounded-2xl animate-pulse bg-[rgb(var(--card))]" />
          </div>
        ) : (
          <>
            <div
              className="rounded-2xl p-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))]"
              style={{ animation: 'fadeInUp 0.3s ease' }}
            >
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`h-11 rounded-xl font-semibold transition-all ${
                    activeTab === 'daily'
                      ? 'menu-play-button text-[#1a1a1a]'
                      : isDark
                        ? 'bg-[#0f0f11] text-white/80'
                        : 'bg-[#f0e8d9] text-[#2f2617]'
                  }`}
                >
                  {t.checkin}
                </button>
                <button
                  onClick={() => setActiveTab('dex')}
                  className={`h-11 rounded-xl font-semibold transition-all ${
                    activeTab === 'dex'
                      ? 'menu-play-button text-[#1a1a1a]'
                      : isDark
                        ? 'bg-[#0f0f11] text-white/80'
                        : 'bg-[#f0e8d9] text-[#2f2617]'
                  }`}
                >
                  {t.dexTasks}
                </button>
                <button
                  onClick={() => setActiveTab('quests')}
                  className={`h-11 rounded-xl font-semibold transition-all ${
                    activeTab === 'quests'
                      ? 'menu-play-button text-[#1a1a1a]'
                      : isDark
                        ? 'bg-[#0f0f11] text-white/80'
                        : 'bg-[#f0e8d9] text-[#2f2617]'
                  }`}
                >
                  {t.quests}
                </button>
              </div>
            </div>

            {actionError && (
              <div className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {actionError}
              </div>
            )}

            {activeTab === 'daily' && (
              <>
                <div
                  className="rounded-2xl p-5 bg-[rgb(var(--card))] border border-[rgb(var(--border))]"
                  style={{ animation: 'fadeInUp 0.3s ease' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-[rgb(var(--foreground))]">{t.checkin}</h2>
                      <p className="text-sm text-[rgb(var(--muted-foreground))]">{t.checkinDesc}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-orange-500">{streak}</span>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-7 gap-1.5">
                    {[...Array(7)].map((_, index) => {
                      const dayNum = index + 1
                      const isCompleted = completedDaysInCycle > 0 && dayNum <= completedDaysInCycle
                      const showGift = !checkedInToday && dayNum === giftDayInCycle

                      return (
                        <div
                          key={dayNum}
                          className={`relative h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                            isCompleted
                              ? 'bg-orange-500 text-black'
                              : showGift
                                ? 'bg-orange-500/20 text-orange-500 border border-orange-500/60'
                                : isDark
                                  ? 'bg-[#1a1a1a] text-gray-500'
                                  : 'bg-[#efe7d7] text-[#9a8f79]'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : showGift ? (
                            <Gift className="w-5 h-5" />
                          ) : (
                            dayNum
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <button
                    onClick={handleCheckIn}
                    disabled={checkedInToday || checkingIn}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      checkedInToday
                        ? isDark
                          ? 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                          : 'bg-[#efe7d7] text-[#8e8167] cursor-not-allowed'
                        : 'menu-play-button text-[#1a1a1a]'
                    }`}
                  >
                    {checkingIn ? (
                      t.checking
                    ) : checkedInToday ? (
                      <>
                        <Check className="w-5 h-5" />
                        {t.checkedIn}
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        {t.checkIn} (+{Math.min(100 + streak * 25, 500)})
                      </>
                    )}
                  </button>
                </div>

                <div
                  className="rounded-2xl p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))]"
                  style={{ animation: 'fadeInUp 0.3s ease 0.1s forwards', opacity: 0 }}
                >
                  <h3 className="text-lg font-bold mb-3 text-[rgb(var(--foreground))]">{t.streakBonuses}</h3>
                  <div className="space-y-2">
                    {STREAK_REWARDS.map((reward) => (
                      <div
                        key={reward.days}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                          streak >= reward.days
                            ? isDark
                              ? 'bg-orange-500/10 border border-orange-500/20'
                              : 'bg-orange-100/60 border border-orange-300/50'
                            : isDark
                              ? 'bg-[#0f0f11]'
                              : 'bg-[#f3ecdf]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              streak >= reward.days
                                ? 'bg-orange-500 text-black'
                                : isDark
                                  ? 'bg-[#1a1a1a] text-gray-600'
                                  : 'bg-[#e8deca] text-[#9a8f79]'
                            }`}
                          >
                            {streak >= reward.days ? <Check className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                          </div>
                          <span className={`font-medium ${streak >= reward.days ? 'text-orange-500' : 'text-[rgb(var(--muted-foreground))]'}`}>
                            {reward.days} {reward.days === 1 ? t.day : t.days}
                          </span>
                        </div>
                        <span className={`font-bold ${streak >= reward.days ? 'text-orange-500' : 'text-[rgb(var(--muted-foreground))]'}`}>
                          +{reward.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(activeTab === 'dex' || activeTab === 'quests') && (
              <div
                className="rounded-2xl p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))]"
                style={{ animation: 'fadeInUp 0.3s ease' }}
              >
                <h3 className="text-lg font-bold mb-1 text-[rgb(var(--foreground))]">
                  {activeTab === 'dex' ? t.dexTasks : t.quests}
                </h3>
                <p className="text-sm mb-4 text-[rgb(var(--muted-foreground))]">
                  {activeTab === 'dex' ? t.dexTasksDesc : t.questsDesc}
                </p>

                {activeTab === 'dex' && dexTasks.length === 0 ? (
                  <div className="text-center py-6 text-[rgb(var(--muted-foreground))]">
                    <p>{t.noTasks}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTab === 'dex'
                      ? dexTasks.map((task) => {
                          const isCompleted = completedTasks.has(task.id)
                          const isChecking = checkingTaskIds.has(task.id)
                          const percent = isCompleted ? 100 : isChecking ? 55 : 0

                          return (
                            <div key={task.id} className="rounded-xl bg-[rgb(var(--background))] p-3 border border-[rgb(var(--border))]">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex items-start gap-2.5">
                                  <div
                                    className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                      isCompleted
                                        ? isDark
                                          ? 'bg-green-500/20'
                                          : 'bg-green-100'
                                        : isChecking
                                          ? isDark
                                            ? 'bg-orange-500/20'
                                            : 'bg-orange-100'
                                          : isDark
                                            ? 'bg-orange-500/20'
                                            : 'bg-orange-100'
                                    }`}
                                  >
                                    {renderDexTaskIcon(task, isCompleted, isChecking)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-black'}`}>{task.name}</p>
                                    <p className={`text-xs ${isChecking ? (isDark ? 'text-orange-400' : 'text-orange-700') : 'text-[rgb(var(--muted-foreground))]'}`}>
                                      {isChecking ? t.wait : task.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <p className={`font-bold ${isCompleted ? 'text-[rgb(var(--muted-foreground))]' : 'text-orange-500'}`}>
                                    +{task.reward_points}
                                  </p>
                                  <div className="mt-0.5 flex justify-end">
                                    <Beer className={`w-3.5 h-3.5 ${isCompleted ? 'text-[rgb(var(--muted-foreground))]' : 'text-orange-500'}`} />
                                  </div>
                                </div>
                              </div>

                              <div className={`mt-3 h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#e8dfcf]'}`}>
                                <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${percent}%` }} />
                              </div>

                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-[rgb(var(--muted-foreground))]">
                                  {isCompleted ? '100 / 100' : isChecking ? '55 / 100' : '0 / 100'}
                                </span>
                                <button
                                  onClick={() => handleTaskComplete(task)}
                                  disabled={isCompleted || isChecking}
                                  className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${
                                    isCompleted
                                      ? isDark
                                        ? 'bg-green-500/20 text-green-300'
                                        : 'bg-green-100 text-green-700'
                                      : isChecking
                                        ? isDark
                                          ? 'bg-orange-500/20 text-orange-300'
                                          : 'bg-orange-100 text-orange-700'
                                        : 'menu-play-button text-[#1a1a1a]'
                                  }`}
                                >
                                  {isCompleted ? t.claimed : isChecking ? t.wait : t.open}
                                </button>
                              </div>
                            </div>
                          )
                        })
                      : GAME_QUESTS.map((quest) => {
                          const progress = questProgress.get(quest.id)
                          const isClaimed = claimedGameQuests.has(quest.id)
                          const isDone = !!progress?.done
                          const progressText = `${Math.min(progress?.current ?? 0, quest.target)} / ${quest.target}`
                          const QuestIcon = QUEST_ICONS[quest.metric] ?? Trophy

                          return (
                            <div key={quest.id} className="rounded-xl bg-[rgb(var(--background))] p-3 border border-[rgb(var(--border))]">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex items-start gap-2.5">
                                  <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                                    <QuestIcon className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-black'}`}>{quest.name}</p>
                                    <p className="text-xs text-[rgb(var(--muted-foreground))]">{quest.description}</p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-orange-500 font-bold">+{quest.reward_points}</p>
                                  <div className="mt-0.5 flex justify-end">
                                    <Beer className="w-3.5 h-3.5 text-orange-500" />
                                  </div>
                                </div>
                              </div>

                              <div className={`mt-3 h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#e8dfcf]'}`}>
                                <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progress?.percent ?? 0}%` }} />
                              </div>

                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-[rgb(var(--muted-foreground))]">{progressText}</span>
                                <button
                                  onClick={() => handleGameQuestClaim(quest)}
                                  disabled={isClaimed || !isDone || claimingQuestId === quest.id}
                                  className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${
                                    isClaimed
                                      ? isDark
                                        ? 'bg-green-500/20 text-green-300'
                                        : 'bg-green-100 text-green-700'
                                      : isDone
                                        ? 'menu-play-button text-[#1a1a1a]'
                                        : isDark
                                          ? 'bg-[#1a1a1a] text-gray-500'
                                          : 'bg-[#efe7d7] text-[#8e8167]'
                                  }`}
                                >
                                  {isClaimed ? t.claimed : claimingQuestId === quest.id ? '...' : isDone ? t.claim : t.notReady}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function ExternalLinkFallback(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M14 4h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

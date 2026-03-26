'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Gift, Flame, Check, ExternalLink, ArrowLeft, Wallet } from 'lucide-react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { useTonWallet } from '@tonconnect/ui-react'

interface DexTask {
  id: string
  name: string
  description: string
  url: string
  reward_points: number
  icon: string
}

export default function DailyPage() {
  const wallet = useTonWallet()
  const { walletAddress, addScore, theme, language, addCoins } = useGameStore()
  
  const [streak, setStreak] = useState(0)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [dexTasks, setDexTasks] = useState<DexTask[]>([])
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const t = {
    title: language === 'ru' ? 'Награды' : 'Daily Rewards',
    checkin: language === 'ru' ? 'Ежедневный бонус' : 'Daily Check-in',
    checkinDesc: language === 'ru' ? 'Заходите каждый день за наградой!' : 'Come back every day for rewards!',
    streak: language === 'ru' ? 'Серия' : 'Streak',
    checkIn: language === 'ru' ? 'Получить' : 'Check in',
    checkedIn: language === 'ru' ? 'Получено сегодня!' : 'Checked in today!',
    checking: language === 'ru' ? 'Загрузка...' : 'Checking...',
    streakBonuses: language === 'ru' ? 'Бонусы за серию' : 'Streak Bonuses',
    dexTasks: language === 'ru' ? 'Задания DEX' : 'DEX Tasks',
    dexTasksDesc: language === 'ru' ? 'Выполняйте задания для бонусов!' : 'Complete tasks for bonus points!',
    noTasks: language === 'ru' ? 'Пока нет заданий' : 'No tasks available',
    connectWallet: language === 'ru' ? 'Подключите кошелек' : 'Connect wallet',
    connectWalletDesc: language === 'ru' ? 'Для получения наград подключите TON кошелек' : 'Connect your TON wallet to access daily rewards',
    goToMenu: language === 'ru' ? 'К меню' : 'Go to Menu',
    days: language === 'ru' ? 'дней' : 'days',
    day: language === 'ru' ? 'день' : 'day',
  }

  const isDark = theme === 'dark'

  useEffect(() => {
    if (!walletAddress) {
      setLoading(false)
      return
    }
    
    const fetchData = async () => {
      const supabase = createClient()
      
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single()

      if (!user) {
        setLoading(false)
        return
      }

      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('check_in_date', { ascending: false })
        .limit(30)

      if (checkins && checkins.length > 0) {
        const today = new Date().toISOString().split('T')[0]
        const lastCheckin = checkins[0]
        setCheckedInToday(lastCheckin.check_in_date === today)
        setStreak(lastCheckin.streak_count)
      }

      const { data: tasks } = await supabase
        .from('dex_tasks')
        .select('*')
        .eq('is_active', true)

      if (tasks) {
        setDexTasks(tasks)
      }

      const { data: userTasks } = await supabase
        .from('user_tasks')
        .select('task_id')
        .eq('user_id', user.id)

      if (userTasks) {
        setCompletedTasks(new Set(userTasks.map(t => t.task_id)))
      }

      setLoading(false)
    }

    fetchData()
  }, [walletAddress])

  const handleCheckIn = async () => {
    if (!walletAddress || checkedInToday || checkingIn) return
    
    setCheckingIn(true)
    const supabase = createClient()

    let { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single()

    if (!user) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({ wallet_address: walletAddress })
        .select('id')
        .single()
      user = newUser
    }

    if (!user) {
      setCheckingIn(false)
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const { data: lastCheckin } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('check_in_date', { ascending: false })
      .limit(1)
      .single()

    let newStreak = 1
    if (lastCheckin && lastCheckin.check_in_date === yesterday) {
      newStreak = lastCheckin.streak_count + 1
    }

    const bonusPoints = Math.min(100 + (newStreak - 1) * 25, 500)
    
    await supabase.from('daily_checkins').insert({
      user_id: user.id,
      check_in_date: today,
      streak_count: newStreak,
      bonus_points: bonusPoints,
    })

    setStreak(newStreak)
    setCheckedInToday(true)
    addScore(bonusPoints)
    addCoins(bonusPoints)
    setCheckingIn(false)
  }

  const handleTaskComplete = async (task: DexTask) => {
    if (!walletAddress || completedTasks.has(task.id)) return

    window.open(task.url, '_blank')

    const supabase = createClient()

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single()

    if (!user) return

    await supabase.from('user_tasks').insert({
      user_id: user.id,
      task_id: task.id,
    })

    setCompletedTasks(prev => new Set([...prev, task.id]))
    addScore(task.reward_points)
    addCoins(task.reward_points)
  }

  const streakRewards = [
    { days: 1, points: 100 },
    { days: 3, points: 150 },
    { days: 7, points: 300 },
    { days: 14, points: 500 },
    { days: 30, points: 1000 },
  ]

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#faf9f7]'}`}>
      {/* Header */}
      <header 
        className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3 ${
          isDark ? 'bg-[#0a0a0b]/95 border-[#1a1a1a]' : 'bg-[#faf9f7]/95 border-[#e5e5e5]'
        }`}
        style={{ animation: 'fadeInDown 0.3s ease' }}
      >
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
              isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
          </Link>
          <h1 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
            <Calendar className="w-5 h-5 text-amber-500" />
            {t.title}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-4">
        {!wallet ? (
          <div 
            className={`text-center py-12 rounded-2xl ${isDark ? 'bg-[#111] border border-[#1a1a1a]' : 'bg-white border border-[#e5e5e5]'}`}
            style={{ animation: 'fadeInUp 0.3s ease' }}
          >
            <Wallet className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-black'}`}>{t.connectWallet}</h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.connectWalletDesc}</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-amber-500 text-black font-bold rounded-xl active:scale-95 transition-all"
            >
              {t.goToMenu}
            </Link>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className={`h-40 rounded-2xl animate-pulse ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`} />
            <div className={`h-48 rounded-2xl animate-pulse ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`} />
          </div>
        ) : (
          <>
            {/* Check-in card */}
            <div
              className={`rounded-2xl p-5 ${isDark ? 'bg-[#111] border border-[#1a1a1a]' : 'bg-white border border-[#e5e5e5]'}`}
              style={{ animation: 'fadeInUp 0.3s ease' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>{t.checkin}</h2>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.checkinDesc}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  isDark ? 'bg-orange-500/20' : 'bg-orange-100'
                }`}>
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-orange-500">{streak}</span>
                </div>
              </div>

              {/* Streak days */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[...Array(7)].map((_, i) => {
                  const dayNum = i + 1
                  const currentDay = streak % 7 || 7
                  const isCompleted = dayNum < currentDay || (streak > 0 && dayNum <= currentDay)
                  const isCurrent = dayNum === (currentDay % 7) + 1 && !checkedInToday

                  return (
                    <div
                      key={i}
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                        isCompleted 
                          ? 'bg-amber-500 text-black' 
                          : isCurrent 
                            ? 'bg-amber-500/30 text-amber-500 border-2 border-amber-500' 
                            : isDark ? 'bg-[#1a1a1a] text-gray-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : dayNum}
                    </div>
                  )
                })}
              </div>

              {/* Check-in button */}
              <button
                onClick={handleCheckIn}
                disabled={checkedInToday || checkingIn}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  checkedInToday 
                    ? isDark ? 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
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

            {/* Streak rewards */}
            <div
              className={`rounded-2xl p-4 ${isDark ? 'bg-[#111] border border-[#1a1a1a]' : 'bg-white border border-[#e5e5e5]'}`}
              style={{ animation: 'fadeInUp 0.3s ease 0.1s forwards', opacity: 0 }}
            >
              <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>{t.streakBonuses}</h3>
              <div className="space-y-2">
                {streakRewards.map((reward) => (
                  <div
                    key={reward.days}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      streak >= reward.days 
                        ? isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                        : isDark ? 'bg-[#0a0a0b]' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        streak >= reward.days 
                          ? 'bg-amber-500 text-black' 
                          : isDark ? 'bg-[#1a1a1a] text-gray-600' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {streak >= reward.days ? <Check className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                      </div>
                      <span className={`font-medium ${
                        streak >= reward.days 
                          ? 'text-amber-500' 
                          : isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {reward.days} {reward.days === 1 ? t.day : t.days}
                      </span>
                    </div>
                    <span className={`font-bold ${
                      streak >= reward.days ? 'text-amber-500' : isDark ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      +{reward.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DEX Tasks */}
            <div
              className={`rounded-2xl p-4 ${isDark ? 'bg-[#111] border border-[#1a1a1a]' : 'bg-white border border-[#e5e5e5]'}`}
              style={{ animation: 'fadeInUp 0.3s ease 0.2s forwards', opacity: 0 }}
            >
              <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t.dexTasks}</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.dexTasksDesc}</p>
              
              {dexTasks.length === 0 ? (
                <div className={`text-center py-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  <p>{t.noTasks}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dexTasks.map((task) => {
                    const isCompleted = completedTasks.has(task.id)
                    
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleTaskComplete(task)}
                        disabled={isCompleted}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                          isCompleted 
                            ? isDark ? 'bg-[#0a0a0b] opacity-60' : 'bg-gray-50 opacity-60'
                            : isDark ? 'bg-[#0a0a0b] hover:bg-[#151515]' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                          isCompleted 
                            ? 'bg-green-500/20' 
                            : isDark ? 'bg-amber-500/20' : 'bg-amber-100'
                        }`}>
                          {isCompleted ? <Check className="w-5 h-5 text-green-500" /> : task.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            isCompleted 
                              ? isDark ? 'text-gray-600' : 'text-gray-400'
                              : isDark ? 'text-white' : 'text-black'
                          }`}>
                            {task.name}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{task.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`font-bold ${
                            isCompleted ? isDark ? 'text-gray-600' : 'text-gray-400' : 'text-amber-500'
                          }`}>
                            +{task.reward_points}
                          </span>
                          {!isCompleted && <ExternalLink className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

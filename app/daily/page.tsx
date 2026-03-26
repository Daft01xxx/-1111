'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Calendar, Gift, Flame, Check, ExternalLink, ArrowLeft } from 'lucide-react'
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

interface UserTask {
  task_id: string
  completed_at: string
}

export default function DailyPage() {
  const wallet = useTonWallet()
  const { walletAddress, addScore } = useGameStore()
  
  const [streak, setStreak] = useState(0)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [dexTasks, setDexTasks] = useState<DexTask[]>([])
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!walletAddress) {
      setLoading(false)
      return
    }
    
    const fetchData = async () => {
      const supabase = createClient()
      
      // Get user ID
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single()

      if (!user) {
        setLoading(false)
        return
      }

      // Get check-in data
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

      // Get DEX tasks
      const { data: tasks } = await supabase
        .from('dex_tasks')
        .select('*')
        .eq('is_active', true)

      if (tasks) {
        setDexTasks(tasks)
      }

      // Get completed tasks
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

    // Get or create user
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

    // Calculate new streak
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

    // Insert check-in
    const bonusPoints = Math.min(100 + (newStreak - 1) * 25, 500) // Max 500 bonus
    
    await supabase.from('daily_checkins').insert({
      user_id: user.id,
      check_in_date: today,
      streak_count: newStreak,
      bonus_points: bonusPoints,
    })

    setStreak(newStreak)
    setCheckedInToday(true)
    addScore(bonusPoints)
    setCheckingIn(false)
  }

  const handleTaskComplete = async (task: DexTask) => {
    if (!walletAddress || completedTasks.has(task.id)) return

    // Open URL in new tab
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
  }

  const streakRewards = [
    { days: 1, points: 100 },
    { days: 3, points: 150 },
    { days: 7, points: 300 },
    { days: 14, points: 500 },
    { days: 30, points: 1000 },
  ]

  const { theme, language } = useGameStore()
  
  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === 'light' ? 'bg-foam-100' : 'bg-dark-950'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-sm border-b px-3 py-3 safe-area-inset ${
        theme === 'light' ? 'bg-foam-100/90 border-dark-200' : 'bg-dark-950/90 border-dark-800'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className={`p-2 -m-2 rounded-lg transition-colors active:scale-95 ${
            theme === 'light' ? 'active:bg-dark-200' : 'active:bg-dark-800'
          }`}>
            <ArrowLeft className={`w-6 h-6 ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`} />
          </Link>
          <h1 className="text-lg font-display font-bold beer-text flex items-center gap-2">
            <Calendar className="w-5 h-5 text-beer-400" />
            {language === 'ru' ? 'Награды' : 'Daily'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {!wallet ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <p className="text-foam-400">Connect your wallet to access daily rewards!</p>
            <Link href="/" className="inline-block mt-4 btn-secondary">
              Go to Menu
            </Link>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="h-32 bg-dark-800 rounded-2xl animate-pulse" />
            <div className="h-48 bg-dark-800 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <>
            {/* Check-in card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-900 rounded-2xl border border-dark-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foam-100">Daily Check-in</h2>
                  <p className="text-sm text-foam-400">Come back every day for more rewards!</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold">{streak}</span>
                </div>
              </div>

              {/* Streak progress */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[...Array(7)].map((_, i) => {
                  const dayNum = i + 1
                  const isCompleted = dayNum <= streak % 7 || (streak >= 7 && dayNum === 7)
                  const isCurrent = dayNum === (streak % 7) + 1

                  return (
                    <div
                      key={i}
                      className={`
                        flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                        ${isCompleted 
                          ? 'bg-beer-500 text-dark-950' 
                          : isCurrent 
                            ? 'bg-beer-500/30 text-beer-400 border-2 border-beer-500' 
                            : 'bg-dark-800 text-foam-500'
                        }
                      `}
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
                className={`
                  w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                  ${checkedInToday 
                    ? 'bg-dark-800 text-foam-500 cursor-not-allowed' 
                    : 'beer-gradient text-dark-950 hover:brightness-110'
                  }
                `}
              >
                {checkingIn ? (
                  'Checking in...'
                ) : checkedInToday ? (
                  <>
                    <Check className="w-5 h-5" />
                    Checked in today!
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Check in (+{Math.min(100 + streak * 25, 500)} pts)
                  </>
                )}
              </button>
            </motion.div>

            {/* Streak rewards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-900 rounded-2xl border border-dark-700 p-4"
            >
              <h3 className="text-lg font-bold text-foam-100 mb-3">Streak Bonuses</h3>
              <div className="space-y-2">
                {streakRewards.map((reward) => (
                  <div
                    key={reward.days}
                    className={`
                      flex items-center justify-between p-3 rounded-xl
                      ${streak >= reward.days 
                        ? 'bg-beer-500/20 border border-beer-500/30' 
                        : 'bg-dark-800'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${streak >= reward.days ? 'bg-beer-500 text-dark-950' : 'bg-dark-700 text-foam-500'}
                      `}>
                        {streak >= reward.days ? <Check className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                      </div>
                      <span className={`font-medium ${streak >= reward.days ? 'text-beer-400' : 'text-foam-300'}`}>
                        {reward.days} day{reward.days > 1 ? 's' : ''} streak
                      </span>
                    </div>
                    <span className={`font-bold ${streak >= reward.days ? 'text-beer-400' : 'text-foam-500'}`}>
                      +{reward.points}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* DEX Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-900 rounded-2xl border border-dark-700 p-4"
            >
              <h3 className="text-lg font-bold text-foam-100 mb-1">DEX Tasks</h3>
              <p className="text-sm text-foam-400 mb-4">Complete tasks for bonus points!</p>
              
              {dexTasks.length === 0 ? (
                <div className="text-center py-6 text-foam-500">
                  <p>No tasks available yet.</p>
                  <p className="text-sm">Check back later!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dexTasks.map((task) => {
                    const isCompleted = completedTasks.has(task.id)
                    
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleTaskComplete(task)}
                        disabled={isCompleted}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                          ${isCompleted 
                            ? 'bg-dark-800 opacity-60' 
                            : 'bg-dark-800 hover:bg-dark-700 hover:border-beer-500/30 border border-transparent'
                          }
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center text-xl
                          ${isCompleted ? 'bg-green-500/20' : 'bg-beer-500/20'}
                        `}>
                          {isCompleted ? <Check className="w-5 h-5 text-green-400" /> : task.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isCompleted ? 'text-foam-500' : 'text-foam-100'}`}>
                            {task.name}
                          </p>
                          <p className="text-xs text-foam-500">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`font-bold ${isCompleted ? 'text-foam-500' : 'text-beer-400'}`}>
                            +{task.reward_points}
                          </span>
                          {!isCompleted && <ExternalLink className="w-4 h-4 text-foam-400" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

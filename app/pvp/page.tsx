'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatNumber } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Plus, Users, Trophy, Clock, ArrowLeft, Coins, X } from 'lucide-react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { useTonWallet } from '@tonconnect/ui-react'

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
  creator_wallet?: string
  opponent_wallet?: string
}

export default function PvPPage() {
  const wallet = useTonWallet()
  const { walletAddress, language } = useGameStore()
  
  const [matches, setMatches] = useState<PvPMatch[]>([])
  const [myMatches, setMyMatches] = useState<PvPMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [betAmount, setBetAmount] = useState(100)
  const [matchType, setMatchType] = useState<'score' | 'bosses'>('score')
  const [creating, setCreating] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const t = {
    title: language === 'ru' ? 'PvP Арена' : 'PvP Arena',
    connectWallet: language === 'ru' ? 'Подключите кошелек для участия в PvP!' : 'Connect your wallet to participate in PvP matches!',
    goToMenu: language === 'ru' ? 'В меню' : 'Go to Menu',
    createMatch: language === 'ru' ? 'Создать матч' : 'Create Match',
    myMatches: language === 'ru' ? 'Мои матчи' : 'My Matches',
    available: language === 'ru' ? 'Доступные матчи' : 'Available Matches',
    noMatches: language === 'ru' ? 'Нет доступных матчей' : 'No matches available',
    createOrWait: language === 'ru' ? 'Создайте свой или подождите!' : 'Create one or check back later!',
    scoreBattle: language === 'ru' ? 'Битва очков' : 'Score Battle',
    bossRush: language === 'ru' ? 'Охота на боссов' : 'Boss Rush',
    highestScore: language === 'ru' ? 'Побеждает больший счет' : 'Highest score wins',
    mostBosses: language === 'ru' ? 'Побеждает больше боссов' : 'Most bosses wins',
    matchType: language === 'ru' ? 'Тип матча' : 'Match Type',
    betAmount: language === 'ru' ? 'Ставка (очки)' : 'Bet Amount (Points)',
    winnerTakes: language === 'ru' ? 'Победитель получает' : 'Winner takes',
    points: language === 'ru' ? 'очков' : 'points',
    joinMatch: language === 'ru' ? 'Присоединиться' : 'Join Match',
    playNow: language === 'ru' ? 'Играть' : 'Play Now',
    victory: language === 'ru' ? 'Победа!' : 'Victory!',
    defeat: language === 'ru' ? 'Поражение' : 'Defeat',
    yourScore: language === 'ru' ? 'Ваш счет' : 'Your score',
    opponent: language === 'ru' ? 'Противник' : 'Opponent',
    creating: language === 'ru' ? 'Создание...' : 'Creating...',
    pending: language === 'ru' ? 'ОЖИДАНИЕ' : 'PENDING',
    active: language === 'ru' ? 'АКТИВЕН' : 'ACTIVE',
    completed: language === 'ru' ? 'ЗАВЕРШЕН' : 'COMPLETED',
    youCreated: language === 'ru' ? 'Вы создали' : 'You created',
    youJoined: language === 'ru' ? 'Вы присоединились' : 'You joined',
    result: language === 'ru' ? 'Результат' : 'Result',
    by: language === 'ru' ? 'от' : 'by',
  }

  // Get or create user ID
  useEffect(() => {
    const getUserId = async () => {
      if (!walletAddress) return
      
      const supabase = createClient()
      
      // Try to find existing user
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single()
      
      if (existingUser) {
        setUserId(existingUser.id)
      } else {
        // Create new user
        const { data: newUser } = await supabase
          .from('users')
          .insert({ wallet_address: walletAddress })
          .select('id')
          .single()
        
        if (newUser) setUserId(newUser.id)
      }
    }
    
    getUserId()
  }, [walletAddress])

  const fetchMatches = async () => {
    if (!userId) return
    
    setLoading(true)
    const supabase = createClient()

    // Get pending matches (available to join)
    const { data: pendingMatches } = await supabase
      .from('pvp_matches')
      .select('*')
      .eq('status', 'pending')
      .neq('creator_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (pendingMatches) {
      setMatches(pendingMatches)
    }

    // Get my matches
    const { data: userMatches } = await supabase
      .from('pvp_matches')
      .select('*')
      .or(`creator_id.eq.${userId},opponent_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (userMatches) {
      setMyMatches(userMatches)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (userId) {
      fetchMatches()
    }
  }, [userId])

  const handleCreateMatch = async () => {
    if (!userId || creating) return
    
    setCreating(true)
    const supabase = createClient()

    const { error } = await supabase.from('pvp_matches').insert({
      creator_id: userId,
      bet_amount: betAmount,
      match_type: matchType,
      status: 'pending',
    })

    if (!error) {
      setShowCreateModal(false)
      fetchMatches()
    }
    setCreating(false)
  }

  const handleJoinMatch = async (match: PvPMatch) => {
    if (!userId || match.status !== 'pending') return
    
    const supabase = createClient()

    await supabase
      .from('pvp_matches')
      .update({ 
        opponent_id: userId,
        status: 'active',
      })
      .eq('id', match.id)

    fetchMatches()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20'
      case 'active': return 'text-blue-400 bg-blue-400/20'
      case 'completed': return 'text-green-400 bg-green-400/20'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t.pending
      case 'active': return t.active
      case 'completed': return t.completed
      default: return status.toUpperCase()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </Link>
          </motion.div>
          <h1 className="text-xl font-display font-bold beer-text flex items-center gap-2">
            <Swords className="w-5 h-5 text-beer-400" />
            {t.title}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {!wallet ? (
          <div className="text-center py-12">
            <Swords className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.connectWallet}</p>
            <Link href="/">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-3 bg-muted text-foreground font-bold rounded-xl"
              >
                {t.goToMenu}
              </motion.button>
            </Link>
          </div>
        ) : (
          <>
            {/* Create match button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="w-full p-4 rounded-2xl beer-gradient flex items-center justify-center gap-3 font-bold text-dark-950"
            >
              <Plus className="w-6 h-6" />
              {t.createMatch}
            </motion.button>

            {/* My matches */}
            {myMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-beer-400" />
                  {t.myMatches}
                </h2>
                <div className="space-y-3">
                  {myMatches.map((match) => {
                    const isCreator = match.creator_id === userId
                    const isWinner = match.winner_id === userId
                    
                    return (
                      <motion.div
                        key={match.id}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          p-4 rounded-xl border bg-card
                          ${match.status === 'completed' && isWinner 
                            ? 'border-green-500/30 bg-green-500/5' 
                            : 'border-border'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(match.status)}`}>
                            {getStatusText(match.status)}
                          </span>
                          <div className="flex items-center gap-1 text-beer-400">
                            <Coins className="w-4 h-4" />
                            <span className="font-bold">{match.bet_amount}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">
                              {isCreator ? t.youCreated : t.youJoined}
                            </p>
                            <p className="font-medium text-foreground">
                              {match.match_type === 'score' ? t.scoreBattle : t.bossRush}
                            </p>
                          </div>
                          
                          {match.status === 'active' && (
                            <Link href={`/play?pvp=${match.id}`}>
                              <motion.span
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 rounded-lg beer-gradient text-dark-950 font-bold text-sm inline-block"
                              >
                                {t.playNow}
                              </motion.span>
                            </Link>
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
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-sm">
                            <span className="text-muted-foreground">
                              {t.yourScore}: <span className="text-foreground font-bold">
                                {isCreator ? match.creator_score : match.opponent_score}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              {t.opponent}: <span className="text-foreground font-bold">
                                {isCreator ? match.opponent_score : match.creator_score}
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

            {/* Available matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-beer-400" />
                {t.available}
              </h2>
              
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-8 bg-card rounded-xl border border-border">
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
                      className="p-4 rounded-xl bg-card border border-border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {match.match_type === 'score' ? t.scoreBattle : t.bossRush}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-beer-400">
                          <Coins className="w-5 h-5" />
                          <span className="text-lg font-bold">{match.bet_amount}</span>
                        </div>
                      </div>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleJoinMatch(match)}
                        className="w-full py-3 rounded-lg bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors"
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

      {/* Create match modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
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
                {/* Match type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.matchType}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMatchType('score')}
                      className={`
                        p-3 rounded-xl border-2 transition-colors text-left
                        ${matchType === 'score' 
                          ? 'border-beer-500 bg-beer-500/10' 
                          : 'border-border bg-muted hover:border-muted-foreground'
                        }
                      `}
                    >
                      <p className="font-bold text-foreground">{t.scoreBattle}</p>
                      <p className="text-xs text-muted-foreground">{t.highestScore}</p>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMatchType('bosses')}
                      className={`
                        p-3 rounded-xl border-2 transition-colors text-left
                        ${matchType === 'bosses' 
                          ? 'border-beer-500 bg-beer-500/10' 
                          : 'border-border bg-muted hover:border-muted-foreground'
                        }
                      `}
                    >
                      <p className="font-bold text-foreground">{t.bossRush}</p>
                      <p className="text-xs text-muted-foreground">{t.mostBosses}</p>
                    </motion.button>
                  </div>
                </div>

                {/* Bet amount */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.betAmount}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 250, 500, 1000].map((amount) => (
                      <motion.button
                        key={amount}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setBetAmount(amount)}
                        className={`
                          py-2 px-3 rounded-lg font-bold text-sm transition-colors
                          ${betAmount === amount 
                            ? 'bg-beer-500 text-dark-950' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }
                        `}
                      >
                        {amount}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">
                    {t.winnerTakes} {Math.floor(betAmount * 2 * 0.95)} {t.points} (95%).
                  </p>
                </div>

                {/* Create button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateMatch}
                  disabled={creating}
                  className="w-full py-4 rounded-xl beer-gradient text-dark-950 font-bold disabled:opacity-50"
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

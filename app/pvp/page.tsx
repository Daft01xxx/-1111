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
  creator_wallet: string
  opponent_wallet: string | null
  bet_amount: number
  match_type: 'score' | 'bosses'
  status: 'pending' | 'active' | 'completed'
  creator_score: number | null
  opponent_score: number | null
  winner_wallet: string | null
  created_at: string
}

export default function PvPPage() {
  const wallet = useTonWallet()
  const { walletAddress } = useGameStore()
  
  const [matches, setMatches] = useState<PvPMatch[]>([])
  const [myMatches, setMyMatches] = useState<PvPMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [betAmount, setBetAmount] = useState(100)
  const [matchType, setMatchType] = useState<'score' | 'bosses'>('score')
  const [creating, setCreating] = useState(false)

  const fetchMatches = async () => {
    setLoading(true)
    const supabase = createClient()

    // Get pending matches (available to join)
    const { data: pendingMatches } = await supabase
      .from('pvp_matches')
      .select('*')
      .eq('status', 'pending')
      .neq('creator_wallet', walletAddress || '')
      .order('created_at', { ascending: false })
      .limit(20)

    if (pendingMatches) {
      setMatches(pendingMatches)
    }

    // Get my matches
    if (walletAddress) {
      const { data: userMatches } = await supabase
        .from('pvp_matches')
        .select('*')
        .or(`creator_wallet.eq.${walletAddress},opponent_wallet.eq.${walletAddress}`)
        .order('created_at', { ascending: false })
        .limit(20)

      if (userMatches) {
        setMyMatches(userMatches)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchMatches()
  }, [walletAddress])

  const handleCreateMatch = async () => {
    if (!walletAddress || creating) return
    
    setCreating(true)
    const supabase = createClient()

    const { error } = await supabase.from('pvp_matches').insert({
      creator_wallet: walletAddress,
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
    if (!walletAddress || match.status !== 'pending') return
    
    const supabase = createClient()

    await supabase
      .from('pvp_matches')
      .update({ 
        opponent_wallet: walletAddress,
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
      default: return 'text-foam-400 bg-dark-700'
    }
  }

  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-foam-100" />
          </Link>
          <h1 className="text-xl font-display font-bold beer-text flex items-center gap-2">
            <Swords className="w-5 h-5 text-beer-400" />
            PvP Arena
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {!wallet ? (
          <div className="text-center py-12">
            <Swords className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <p className="text-foam-400">Connect your wallet to participate in PvP matches!</p>
            <Link href="/" className="inline-block mt-4 btn-secondary">
              Go to Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Create match button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowCreateModal(true)}
              className="w-full p-4 rounded-2xl beer-gradient flex items-center justify-center gap-3 font-bold text-dark-950 hover:brightness-110 transition-all"
            >
              <Plus className="w-6 h-6" />
              Create Match
            </motion.button>

            {/* My matches */}
            {myMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-lg font-bold text-foam-100 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-beer-400" />
                  My Matches
                </h2>
                <div className="space-y-3">
                  {myMatches.map((match) => {
                    const isCreator = match.creator_wallet === walletAddress
                    const isWinner = match.winner_wallet === walletAddress
                    
                    return (
                      <div
                        key={match.id}
                        className={`
                          p-4 rounded-xl border bg-dark-900
                          ${match.status === 'completed' && isWinner 
                            ? 'border-green-500/30 bg-green-500/5' 
                            : 'border-dark-700'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(match.status)}`}>
                            {match.status.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1 text-beer-400">
                            <Coins className="w-4 h-4" />
                            <span className="font-bold">{match.bet_amount}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-foam-500">
                              {isCreator ? 'You created' : 'You joined'}
                            </p>
                            <p className="font-medium text-foam-100">
                              {match.match_type === 'score' ? 'Score Battle' : 'Boss Rush'}
                            </p>
                          </div>
                          
                          {match.status === 'active' && (
                            <Link
                              href={`/play?pvp=${match.id}`}
                              className="px-4 py-2 rounded-lg beer-gradient text-dark-950 font-bold text-sm"
                            >
                              Play Now
                            </Link>
                          )}
                          
                          {match.status === 'completed' && (
                            <div className="text-right">
                              <p className="text-xs text-foam-500">Result</p>
                              <p className={`font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
                                {isWinner ? 'Victory!' : 'Defeat'}
                              </p>
                            </div>
                          )}
                        </div>

                        {match.status === 'completed' && (
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700 text-sm">
                            <span className="text-foam-500">
                              Your score: <span className="text-foam-100 font-bold">
                                {isCreator ? match.creator_score : match.opponent_score}
                              </span>
                            </span>
                            <span className="text-foam-500">
                              Opponent: <span className="text-foam-100 font-bold">
                                {isCreator ? match.opponent_score : match.creator_score}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
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
              <h2 className="text-lg font-bold text-foam-100 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-beer-400" />
                Available Matches
              </h2>
              
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-dark-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-8 bg-dark-900 rounded-xl border border-dark-700">
                  <Clock className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                  <p className="text-foam-400">No matches available</p>
                  <p className="text-sm text-foam-500">Create one or check back later!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 rounded-xl bg-dark-900 border border-dark-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-foam-100">
                            {match.match_type === 'score' ? 'Score Battle' : 'Boss Rush'}
                          </p>
                          <p className="text-xs text-foam-500">
                            by {formatAddress(match.creator_wallet)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-beer-400">
                          <Coins className="w-5 h-5" />
                          <span className="text-lg font-bold">{match.bet_amount}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleJoinMatch(match)}
                        className="w-full py-3 rounded-lg bg-dark-800 text-foam-100 font-bold hover:bg-dark-700 transition-colors"
                      >
                        Join Match
                      </button>
                    </div>
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-dark-950/80 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-dark-900 rounded-2xl border border-dark-700 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-dark-700">
                <h3 className="text-lg font-bold text-foam-100">Create Match</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors"
                >
                  <X className="w-5 h-5 text-foam-400" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Match type */}
                <div>
                  <label className="block text-sm font-medium text-foam-300 mb-2">
                    Match Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMatchType('score')}
                      className={`
                        p-3 rounded-xl border-2 transition-colors text-left
                        ${matchType === 'score' 
                          ? 'border-beer-500 bg-beer-500/10' 
                          : 'border-dark-600 bg-dark-800 hover:border-dark-500'
                        }
                      `}
                    >
                      <p className="font-bold text-foam-100">Score Battle</p>
                      <p className="text-xs text-foam-500">Highest score wins</p>
                    </button>
                    <button
                      onClick={() => setMatchType('bosses')}
                      className={`
                        p-3 rounded-xl border-2 transition-colors text-left
                        ${matchType === 'bosses' 
                          ? 'border-beer-500 bg-beer-500/10' 
                          : 'border-dark-600 bg-dark-800 hover:border-dark-500'
                        }
                      `}
                    >
                      <p className="font-bold text-foam-100">Boss Rush</p>
                      <p className="text-xs text-foam-500">Most bosses wins</p>
                    </button>
                  </div>
                </div>

                {/* Bet amount */}
                <div>
                  <label className="block text-sm font-medium text-foam-300 mb-2">
                    Bet Amount (Points)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 250, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(amount)}
                        className={`
                          py-2 px-3 rounded-lg font-bold text-sm transition-colors
                          ${betAmount === amount 
                            ? 'bg-beer-500 text-dark-950' 
                            : 'bg-dark-800 text-foam-400 hover:bg-dark-700'
                          }
                        `}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-dark-800 rounded-xl p-3">
                  <p className="text-xs text-foam-500">
                    Winner takes {betAmount * 2 * 0.95} points (95% of pool).
                    5% goes to the house.
                  </p>
                </div>

                {/* Create button */}
                <button
                  onClick={handleCreateMatch}
                  disabled={creating}
                  className="w-full py-4 rounded-xl beer-gradient text-dark-950 font-bold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Match'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

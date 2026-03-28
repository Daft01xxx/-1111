'use client'

import { useGameStore } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
  Play, Trophy, Calendar, Swords, Music, Users, 
  Skull, Wallet, Crown, Info, ShoppingBag, Coins
} from 'lucide-react'
import Link from 'next/link'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useEffect } from 'react'

export function MainMenu() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const { highScore, level, bossesDefeated, napiwasBalance, coins, setWallet, setMultiplier } = useGameStore()

  // Update wallet state when connected
  useEffect(() => {
    if (wallet) {
      const address = wallet.account.address
      const mockBalance = Math.floor(Math.random() * 50000) + 1000
      setWallet(address, mockBalance)
      
      const tier = getMultiplierTier(mockBalance)
      setMultiplier(tier.multiplier)
    } else {
      setWallet(null, 0)
      setMultiplier(1.0)
    }
  }, [wallet, setWallet, setMultiplier])

  const tier = getMultiplierTier(napiwasBalance)

  const menuItems = [
    { icon: Play, label: 'Play', href: '/play', primary: true },
    { icon: ShoppingBag, label: 'Shop', href: '/shop' },
    { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
    { icon: Calendar, label: 'Daily', href: '/daily' },
    { icon: Swords, label: 'PvP', href: '/pvp' },
    { icon: Skull, label: 'Bosses', href: '/bosses' },
    { icon: Music, label: 'Music', href: '/music' },
    { icon: Info, label: 'How to Play', href: '/guide' },
  ]

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header with wallet */}
      <header className="p-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <CatIcon />
            </div>
            <span className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">COSMIC CATS</span>
          </motion.div>

          {/* Wallet button */}
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => wallet ? tonConnectUI.disconnect() : tonConnectUI.openModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-600 hover:border-amber-500/50 transition-colors"
          >
            <Wallet className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-foam-100">
              {wallet 
                ? `${wallet.account.address.slice(0, 4)}...${wallet.account.address.slice(-4)}`
                : 'Connect'
              }
            </span>
          </motion.button>
        </div>
      </header>

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-6"
      >
        {/* Cat hero animation */}
        <div className="relative h-40 flex items-center justify-center mb-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-orange-500/30 rounded-full scale-150" />
            
            {/* Orange Cat SVG */}
            <svg width="120" height="140" viewBox="0 0 120 140" className="relative z-10">
              {/* Body */}
              <ellipse cx="60" cy="95" rx="35" ry="30" fill="#FF8C42" stroke="#CC6B2E" strokeWidth="3"/>
              
              {/* Head */}
              <circle cx="60" cy="50" r="32" fill="#FF8C42" stroke="#CC6B2E" strokeWidth="3"/>
              
              {/* Ears */}
              <path d="M30 40 L20 10 L45 30 Z" fill="#FF8C42" stroke="#CC6B2E" strokeWidth="2"/>
              <path d="M90 40 L100 10 L75 30 Z" fill="#FF8C42" stroke="#CC6B2E" strokeWidth="2"/>
              <path d="M33 38 L26 15 L43 32 Z" fill="#FFB6C1"/>
              <path d="M87 38 L94 15 L77 32 Z" fill="#FFB6C1"/>
              
              {/* Eyes */}
              <ellipse cx="45" cy="48" rx="8" ry="10" fill="#90EE90"/>
              <ellipse cx="75" cy="48" rx="8" ry="10" fill="#90EE90"/>
              <ellipse cx="45" cy="50" rx="4" ry="6" fill="#111"/>
              <ellipse cx="75" cy="50" rx="4" ry="6" fill="#111"/>
              <circle cx="43" cy="46" r="2" fill="#fff"/>
              <circle cx="73" cy="46" r="2" fill="#fff"/>
              
              {/* Nose */}
              <path d="M60 58 L55 65 L65 65 Z" fill="#FF6B6B"/>
              
              {/* Mouth */}
              <path d="M60 65 L60 72" stroke="#CC6B2E" strokeWidth="2"/>
              <path d="M60 72 Q50 78 45 74" stroke="#CC6B2E" strokeWidth="2" fill="none"/>
              <path d="M60 72 Q70 78 75 74" stroke="#CC6B2E" strokeWidth="2" fill="none"/>
              
              {/* Whiskers */}
              <line x1="40" y1="60" x2="15" y2="55" stroke="#8B4513" strokeWidth="1.5"/>
              <line x1="40" y1="65" x2="15" y2="65" stroke="#8B4513" strokeWidth="1.5"/>
              <line x1="80" y1="60" x2="105" y2="55" stroke="#8B4513" strokeWidth="1.5"/>
              <line x1="80" y1="65" x2="105" y2="65" stroke="#8B4513" strokeWidth="1.5"/>
              
              {/* Tail */}
              <path d="M95 95 Q115 80 110 60 Q108 50 100 55" stroke="#FF8C42" strokeWidth="8" fill="none" strokeLinecap="round">
                <animate attributeName="d" 
                  values="M95 95 Q115 80 110 60 Q108 50 100 55;M95 95 Q120 85 115 65 Q112 55 105 60;M95 95 Q115 80 110 60 Q108 50 100 55" 
                  dur="2s" repeatCount="indefinite"/>
              </path>
              <path d="M95 95 Q115 80 110 60 Q108 50 100 55" stroke="#CC6B2E" strokeWidth="3" fill="none" strokeLinecap="round">
                <animate attributeName="d" 
                  values="M95 95 Q115 80 110 60 Q108 50 100 55;M95 95 Q120 85 115 65 Q112 55 105 60;M95 95 Q115 80 110 60 Q108 50 100 55" 
                  dur="2s" repeatCount="indefinite"/>
              </path>
              
              {/* Sparkles */}
              <circle cx="25" cy="35" r="3" fill="#FFD700">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="95" cy="30" r="2" fill="#FFD700">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="110" cy="90" r="2.5" fill="#FFD700">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </motion.div>
        </div>

        {/* Stats card */}
        <div className="bg-dark-900/80 rounded-2xl border border-dark-700 p-4 space-y-3">
          {/* Coin balance */}
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-500/20">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-foam-400">Coins</span>
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{formatNumber(coins)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-foam-400">High Score</span>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">{formatNumber(highScore)}</span>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1 bg-dark-800 rounded-xl p-3 text-center">
              <p className="text-xs text-foam-400">Level</p>
              <p className="text-lg font-bold text-foam-100">{level}</p>
            </div>
            <div className="flex-1 bg-dark-800 rounded-xl p-3 text-center">
              <p className="text-xs text-foam-400">Bosses</p>
              <p className="text-lg font-bold text-foam-100">{bossesDefeated}/5</p>
            </div>
            <div className="flex-1 bg-dark-800 rounded-xl p-3 text-center">
              <p className="text-xs text-foam-400">Multiplier</p>
              <p className="text-lg font-bold" style={{ color: tier.color }}>x{tier.multiplier}</p>
            </div>
          </div>

          {/* Tier progress */}
          {wallet && (
            <div className="pt-2 border-t border-dark-700">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4" style={{ color: tier.color }} />
                  <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.tier}</span>
                </div>
                <span className="text-xs text-foam-400">{formatNumber(napiwasBalance)} tokens</span>
              </div>
              <p className="text-[10px] text-foam-500">
                Hold more tokens for higher score multipliers!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Menu grid */}
      <div className="flex-1 px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 p-4 rounded-xl transition-all
                  ${item.primary 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-dark-950 font-bold col-span-2 justify-center py-5 shadow-lg shadow-orange-500/30'
                    : item.label === 'Shop'
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-foam-100 border border-amber-500/30 hover:border-amber-500/50'
                      : 'bg-dark-800 text-foam-100 hover:bg-dark-700 border border-dark-600 hover:border-amber-500/50'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${item.primary ? '' : item.label === 'Shop' ? 'text-amber-400' : 'text-amber-400'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Admin link (hidden) */}
        <Link 
          href="/admin"
          className="block mt-4 text-center text-xs text-dark-600 hover:text-foam-400 transition-colors"
        >
          Admin Access
        </Link>
      </div>
    </div>
  )
}

function CatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="7" fill="#0d0d0d"/>
      <path d="M6 10 L4 4 L9 8 Z" fill="#0d0d0d"/>
      <path d="M18 10 L20 4 L15 8 Z" fill="#0d0d0d"/>
      <circle cx="9" cy="12" r="1.5" fill="#90EE90"/>
      <circle cx="15" cy="12" r="1.5" fill="#90EE90"/>
      <path d="M12 14 L11 16 L13 16 Z" fill="#FF6B6B"/>
    </svg>
  )
}

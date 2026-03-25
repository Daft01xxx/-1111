'use client'

import { useGameStore } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
  Play, Trophy, Calendar, Swords, Music, Users, 
  Settings, Skull, Wallet, Crown, Info
} from 'lucide-react'
import Link from 'next/link'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useEffect } from 'react'

export function MainMenu() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const { highScore, level, bossesDefeated, napiwasBalance, setWallet, setMultiplier } = useGameStore()

  // Update wallet state when connected
  useEffect(() => {
    if (wallet) {
      const address = wallet.account.address
      // In a real app, you'd fetch the NAPIWAS token balance from the blockchain
      // For demo, we'll use a mock balance
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
    { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
    { icon: Calendar, label: 'Daily', href: '/daily' },
    { icon: Swords, label: 'PvP', href: '/pvp' },
    { icon: Skull, label: 'Bosses', href: '/bosses' },
    { icon: Music, label: 'Music', href: '/music' },
    { icon: Users, label: 'Partners', href: '/partners' },
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
            <div className="w-10 h-10 rounded-xl beer-gradient flex items-center justify-center">
              <span className="text-xl">🍺</span>
            </div>
            <span className="text-xl font-display font-bold beer-text">NAPIWAS</span>
          </motion.div>

          {/* Wallet button */}
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => wallet ? tonConnectUI.disconnect() : tonConnectUI.openModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-600 hover:border-beer-500/50 transition-colors"
          >
            <Wallet className="w-4 h-4 text-beer-400" />
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
        {/* Beer mug animation */}
        <div className="relative h-40 flex items-center justify-center mb-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-beer-500/30 rounded-full scale-150" />
            
            {/* Beer mug SVG */}
            <svg width="120" height="140" viewBox="0 0 120 140" className="relative z-10">
              {/* Mug body */}
              <rect x="15" y="35" width="70" height="95" rx="10" fill="url(#beerGradient)" stroke="#B74206" strokeWidth="3"/>
              
              {/* Foam */}
              <ellipse cx="50" cy="35" rx="35" ry="12" fill="#FAF9F6"/>
              <circle cx="30" cy="28" r="8" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="50" cy="25" r="10" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="70" cy="28" r="8" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="40" cy="35" r="6" fill="#FFFFFF" opacity="0.7"/>
              <circle cx="60" cy="33" r="7" fill="#FFFFFF" opacity="0.7"/>
              
              {/* Handle */}
              <path d="M85 50 Q110 70 85 110" fill="none" stroke="#B74206" strokeWidth="8" strokeLinecap="round"/>
              <path d="M85 50 Q105 70 85 110" fill="none" stroke="#DD6102" strokeWidth="4" strokeLinecap="round"/>
              
              {/* Highlight */}
              <rect x="22" y="45" width="4" height="75" rx="2" fill="rgba(255,255,255,0.3)"/>
              
              {/* Bubbles inside */}
              <circle cx="35" cy="80" r="3" fill="rgba(255,255,255,0.4)">
                <animate attributeName="cy" values="100;60;100" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="55" cy="90" r="2" fill="rgba(255,255,255,0.4)">
                <animate attributeName="cy" values="110;50;110" dur="4s" repeatCount="indefinite"/>
              </circle>
              <circle cx="70" cy="85" r="2.5" fill="rgba(255,255,255,0.4)">
                <animate attributeName="cy" values="105;55;105" dur="3.5s" repeatCount="indefinite"/>
              </circle>
              
              <defs>
                <linearGradient id="beerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFD78A"/>
                  <stop offset="30%" stopColor="#FFA724"/>
                  <stop offset="100%" stopColor="#DD6102"/>
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Stats card */}
        <div className="bg-dark-900/80 rounded-2xl border border-dark-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foam-400">High Score</span>
            <span className="text-xl font-bold beer-text">{formatNumber(highScore)}</span>
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
                <span className="text-xs text-foam-400">{formatNumber(napiwasBalance)} NAPIWAS</span>
              </div>
              <p className="text-[10px] text-foam-500">
                Hold more NAPIWAS tokens for higher score multipliers!
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
                    ? 'beer-gradient text-dark-950 font-bold col-span-2 justify-center py-5 beer-glow'
                    : 'bg-dark-800 text-foam-100 hover:bg-dark-700 border border-dark-600 hover:border-beer-500/50'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${item.primary ? '' : 'text-beer-400'}`} />
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

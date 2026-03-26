'use client'

import { useGameStore, translations } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Trophy, Calendar, Swords, Music, Users, 
  Skull, Wallet, Crown, Info, ShoppingBag, Sun, Moon, Languages
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useEffect, useState } from 'react'

export function MainMenu() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const { 
    highScore, level, bossesDefeated, napiwasBalance, coins,
    setWallet, setMultiplier, theme, setTheme, language, setLanguage
  } = useGameStore()
  
  const [mounted, setMounted] = useState(false)
  const [pressedButton, setPressedButton] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('light', theme === 'light')
    }
  }, [theme, mounted])

  const tier = getMultiplierTier(napiwasBalance)
  const t = translations[language]

  const menuItems = [
    { icon: Play, label: t.play, href: '/play', primary: true },
    { icon: Trophy, label: t.leaderboard, href: '/leaderboard' },
    { icon: Calendar, label: t.daily, href: '/daily' },
    { icon: Swords, label: t.pvp, href: '/pvp' },
    { icon: Skull, label: t.bosses, href: '/bosses' },
    { icon: ShoppingBag, label: t.shop, href: '/shop' },
    { icon: Music, label: t.music, href: '/music' },
    { icon: Users, label: t.partners, href: '/partners' },
    { icon: Info, label: t.guide, href: '/guide' },
  ]

  const handleButtonPress = (label: string) => {
    setPressedButton(label)
    setTimeout(() => setPressedButton(null), 150)
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-foam-100' : 'bg-dark-950'} flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-12 h-12 relative rounded-full overflow-hidden shadow-lg">
              <Image 
                src="/images/coin-logo.jpg" 
                alt="NAPIWAS" 
                width={48} 
                height={48}
                className="object-cover"
              />
            </div>
            <span className={`text-xl font-display font-bold ${theme === 'light' ? 'text-dark-900' : 'beer-text'}`}>
              NAPIWAS
            </span>
          </motion.div>

          {/* Top controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'light' 
                  ? 'bg-dark-200 text-dark-800' 
                  : 'bg-dark-800 text-foam-100'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            {/* Language toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${
                theme === 'light' 
                  ? 'bg-dark-200 text-dark-800' 
                  : 'bg-dark-800 text-foam-100'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span className="text-xs font-bold">{language.toUpperCase()}</span>
            </motion.button>

            {/* Wallet */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => wallet ? tonConnectUI.disconnect() : tonConnectUI.openModal()}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                theme === 'light'
                  ? 'bg-white border-dark-300 hover:border-beer-500'
                  : 'bg-dark-800 border-dark-600 hover:border-beer-500/50'
              }`}
            >
              <Wallet className="w-4 h-4 text-beer-500" />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>
                {wallet 
                  ? `${wallet.account.address.slice(0, 4)}...${wallet.account.address.slice(-4)}`
                  : t.connect
                }
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-4"
      >
        {/* Animated Cat */}
        <div className="relative h-36 flex items-center justify-center mb-4">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="relative"
          >
            {/* Cat SVG */}
            <svg width="100" height="100" viewBox="0 0 100 100" className="relative z-10 drop-shadow-2xl">
              {/* Body */}
              <ellipse cx="50" cy="60" rx="30" ry="25" fill="#F97316"/>
              <ellipse cx="50" cy="60" rx="30" ry="25" fill="url(#catBodyGradient)" stroke="#EA580C" strokeWidth="2"/>
              
              {/* Head */}
              <ellipse cx="50" cy="30" rx="25" ry="20" fill="#F97316"/>
              <ellipse cx="50" cy="30" rx="25" ry="20" fill="url(#catHeadGradient)" stroke="#EA580C" strokeWidth="2"/>
              
              {/* Ears */}
              <path d="M30 20 L22 2 L38 15 Z" fill="#F97316" stroke="#EA580C" strokeWidth="2"/>
              <path d="M70 20 L78 2 L62 15 Z" fill="#F97316" stroke="#EA580C" strokeWidth="2"/>
              <path d="M32 18 L26 6 L36 15 Z" fill="#FFB6C1"/>
              <path d="M68 18 L74 6 L64 15 Z" fill="#FFB6C1"/>
              
              {/* Eyes */}
              <ellipse cx="40" cy="28" rx="6" ry="7" fill="white"/>
              <ellipse cx="60" cy="28" rx="6" ry="7" fill="white"/>
              <ellipse cx="40" cy="29" rx="3" ry="4" fill="#000"/>
              <ellipse cx="60" cy="29" rx="3" ry="4" fill="#000"/>
              <circle cx="41" cy="27" r="1.5" fill="white"/>
              <circle cx="61" cy="27" r="1.5" fill="white"/>
              
              {/* Nose */}
              <path d="M50 36 L47 33 L53 33 Z" fill="#FFB6C1"/>
              
              {/* Mouth */}
              <path d="M50 36 L50 40 M50 40 Q45 44 42 40 M50 40 Q55 44 58 40" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              
              {/* Whiskers */}
              <line x1="35" y1="35" x2="18" y2="32" stroke="#333" strokeWidth="1"/>
              <line x1="35" y1="38" x2="18" y2="38" stroke="#333" strokeWidth="1"/>
              <line x1="35" y1="41" x2="18" y2="44" stroke="#333" strokeWidth="1"/>
              <line x1="65" y1="35" x2="82" y2="32" stroke="#333" strokeWidth="1"/>
              <line x1="65" y1="38" x2="82" y2="38" stroke="#333" strokeWidth="1"/>
              <line x1="65" y1="41" x2="82" y2="44" stroke="#333" strokeWidth="1"/>
              
              {/* Tail */}
              <path d="M75 70 Q90 60 85 45" stroke="#F97316" strokeWidth="8" fill="none" strokeLinecap="round">
                <animate attributeName="d" values="M75 70 Q90 60 85 45;M75 70 Q95 55 80 45;M75 70 Q90 60 85 45" dur="1s" repeatCount="indefinite"/>
              </path>
              
              {/* Paws */}
              <ellipse cx="35" cy="82" rx="8" ry="5" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
              <ellipse cx="65" cy="82" rx="8" ry="5" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
              
              <defs>
                <linearGradient id="catBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FB923C"/>
                  <stop offset="100%" stopColor="#EA580C"/>
                </linearGradient>
                <linearGradient id="catHeadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FB923C"/>
                  <stop offset="100%" stopColor="#F97316"/>
                </linearGradient>
              </defs>
            </svg>
            
            {/* Glow */}
            <div className="absolute inset-0 blur-3xl bg-beer-500/30 rounded-full scale-150 -z-10" />
          </motion.div>
        </div>

        {/* Stats card */}
        <div className={`rounded-2xl border p-4 space-y-3 ${
          theme === 'light' 
            ? 'bg-white border-dark-200' 
            : 'bg-dark-900/80 border-dark-700'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${theme === 'light' ? 'text-dark-500' : 'text-foam-400'}`}>
              {t.highScore}
            </span>
            <span className="text-xl font-bold beer-text">{formatNumber(highScore)}</span>
          </div>
          
          <div className="flex gap-3">
            <div className={`flex-1 rounded-xl p-3 text-center ${theme === 'light' ? 'bg-dark-100' : 'bg-dark-800'}`}>
              <p className={`text-xs ${theme === 'light' ? 'text-dark-500' : 'text-foam-400'}`}>{t.level}</p>
              <p className={`text-lg font-bold ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>{level}</p>
            </div>
            <div className={`flex-1 rounded-xl p-3 text-center ${theme === 'light' ? 'bg-dark-100' : 'bg-dark-800'}`}>
              <p className={`text-xs ${theme === 'light' ? 'text-dark-500' : 'text-foam-400'}`}>{t.coins}</p>
              <p className={`text-lg font-bold ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>{formatNumber(coins)}</p>
            </div>
            <div className={`flex-1 rounded-xl p-3 text-center ${theme === 'light' ? 'bg-dark-100' : 'bg-dark-800'}`}>
              <p className={`text-xs ${theme === 'light' ? 'text-dark-500' : 'text-foam-400'}`}>{t.multiplier}</p>
              <p className="text-lg font-bold" style={{ color: tier.color }}>x{tier.multiplier}</p>
            </div>
          </div>

          {wallet && (
            <div className={`pt-2 border-t ${theme === 'light' ? 'border-dark-200' : 'border-dark-700'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4" style={{ color: tier.color }} />
                  <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.tier}</span>
                </div>
                <span className={`text-xs ${theme === 'light' ? 'text-dark-500' : 'text-foam-400'}`}>
                  {formatNumber(napiwasBalance)} NAPIWAS
                </span>
              </div>
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
              transition={{ delay: 0.15 + index * 0.04 }}
              className={item.primary ? 'col-span-2' : ''}
            >
              <Link
                href={item.href}
                onClick={() => handleButtonPress(item.label)}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl transition-all
                    ${item.primary 
                      ? 'beer-gradient text-dark-950 font-bold justify-center py-5 shadow-lg shadow-beer-500/30'
                      : theme === 'light'
                        ? 'bg-white text-dark-900 border border-dark-200 hover:border-beer-500/50'
                        : 'bg-dark-800 text-foam-100 border border-dark-600 hover:border-beer-500/50'
                    }
                    ${pressedButton === item.label ? 'scale-95' : ''}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${item.primary ? '' : 'text-beer-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link 
          href="/admin"
          className={`block mt-4 text-center text-xs transition-colors ${
            theme === 'light' ? 'text-dark-400 hover:text-dark-600' : 'text-dark-600 hover:text-foam-400'
          }`}
        >
          Admin Access
        </Link>
      </div>
    </div>
  )
}

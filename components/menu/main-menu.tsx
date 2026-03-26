'use client'

import { useGameStore, translations } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
  Play, Trophy, Calendar, Swords, Music, Users, 
  Skull, Wallet, Crown, Info, ShoppingBag, Sun, Moon, Globe
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useEffect, useState, useCallback, memo } from 'react'

// Memoized menu button for better performance
const MenuButton = memo(function MenuButton({ 
  item, 
  index, 
  theme 
}: { 
  item: { icon: React.ElementType; label: string; href: string; primary?: boolean }
  index: number
  theme: string
}) {
  const Icon = item.icon
  
  return (
    <Link
      href={item.href}
      className={item.primary ? 'col-span-2' : ''}
    >
      <div
        className={`
          flex items-center gap-3 rounded-xl transition-all duration-150 active:scale-[0.97]
          ${item.primary 
            ? 'beer-gradient text-dark-950 font-bold justify-center p-4 shadow-lg shadow-beer-500/25'
            : theme === 'light'
              ? 'bg-white text-dark-900 border border-dark-200 active:bg-dark-100 p-3'
              : 'bg-dark-800/80 text-foam-100 border border-dark-700 active:bg-dark-700 p-3'
          }
        `}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${item.primary ? '' : 'text-beer-500'}`} />
        <span className={`font-medium ${item.primary ? 'text-base' : 'text-sm'}`}>{item.label}</span>
      </div>
    </Link>
  )
})

export function MainMenu() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const { 
    highScore, level, bossesDefeated, napiwasBalance, coins,
    setWallet, setMultiplier, theme, setTheme, language, setLanguage
  } = useGameStore()
  
  const [mounted, setMounted] = useState(false)

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

  const handleWalletClick = useCallback(() => {
    if (wallet) {
      tonConnectUI.disconnect()
    } else {
      tonConnectUI.openModal()
    }
  }, [wallet, tonConnectUI])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full beer-gradient animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden ${theme === 'light' ? 'bg-foam-100' : 'bg-dark-950'}`}>
      {/* Header - fixed height, no overflow */}
      <header className="flex-shrink-0 px-3 py-3 safe-area-inset">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10 relative rounded-full overflow-hidden shadow-lg flex-shrink-0 ring-2 ring-beer-500/30">
              <Image 
                src="/images/napiwas-logo.jpg" 
                alt="NAPIWAS" 
                width={40} 
                height={40}
                className="object-cover"
                priority
              />
            </div>
            <span className={`text-lg font-display font-bold truncate ${theme === 'light' ? 'text-dark-900' : 'beer-text'}`}>
              NAPIWAS
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Theme */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-colors active:scale-95 ${
                theme === 'light' ? 'bg-dark-200 text-dark-800' : 'bg-dark-800 text-foam-100'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Language */}
            <button
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className={`px-2 py-2 rounded-lg flex items-center gap-1 transition-colors active:scale-95 ${
                theme === 'light' ? 'bg-dark-200 text-dark-800' : 'bg-dark-800 text-foam-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold">{language.toUpperCase()}</span>
            </button>

            {/* Wallet */}
            <button
              onClick={handleWalletClick}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border transition-all active:scale-95 ${
                theme === 'light'
                  ? 'bg-white border-dark-200 active:bg-dark-100'
                  : 'bg-dark-800 border-dark-600 active:bg-dark-700'
              }`}
            >
              <Wallet className="w-4 h-4 text-beer-500 flex-shrink-0" />
              <span className={`text-xs font-medium truncate max-w-[60px] ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>
                {wallet 
                  ? `${wallet.account.address.slice(0, 4)}...${wallet.account.address.slice(-3)}`
                  : t.connect
                }
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4">
        {/* Hero with Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-4"
        >
          {/* Logo Circle with Glow */}
          <div className="relative flex items-center justify-center mb-4">
            <div className="relative">
              {/* Glow effect - simplified for performance */}
              <div className="absolute inset-0 blur-2xl bg-beer-500/40 rounded-full scale-125" />
              
              {/* Logo */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-beer-500/50 shadow-2xl">
                <Image 
                  src="/images/napiwas-logo.jpg" 
                  alt="NAPIWAS Cat" 
                  width={112} 
                  height={112}
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 bg-beer-500 text-dark-950 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                LVL {level}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className={`rounded-2xl border p-3 ${
            theme === 'light' ? 'bg-white border-dark-200' : 'bg-dark-900/90 border-dark-700'
          }`}>
            {/* High Score */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm ${theme === 'light' ? 'text-dark-500' : 'text-foam-400'}`}>
                {t.highScore}
              </span>
              <span className="text-xl font-bold beer-text">{formatNumber(highScore)}</span>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`rounded-xl p-2.5 text-center ${theme === 'light' ? 'bg-dark-100' : 'bg-dark-800'}`}>
                <p className={`text-[10px] uppercase tracking-wide ${theme === 'light' ? 'text-dark-500' : 'text-foam-500'}`}>{t.level}</p>
                <p className={`text-lg font-bold ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>{level}</p>
              </div>
              <div className={`rounded-xl p-2.5 text-center ${theme === 'light' ? 'bg-dark-100' : 'bg-dark-800'}`}>
                <p className={`text-[10px] uppercase tracking-wide ${theme === 'light' ? 'text-dark-500' : 'text-foam-500'}`}>{t.coins}</p>
                <p className={`text-lg font-bold ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>{formatNumber(coins)}</p>
              </div>
              <div className={`rounded-xl p-2.5 text-center ${theme === 'light' ? 'bg-dark-100' : 'bg-dark-800'}`}>
                <p className={`text-[10px] uppercase tracking-wide ${theme === 'light' ? 'text-dark-500' : 'text-foam-500'}`}>{t.multiplier}</p>
                <p className="text-lg font-bold" style={{ color: tier.color }}>x{tier.multiplier}</p>
              </div>
            </div>

            {/* Wallet Tier */}
            {wallet && (
              <div className={`mt-3 pt-3 border-t ${theme === 'light' ? 'border-dark-200' : 'border-dark-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
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

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-2">
          {menuItems.map((item, index) => (
            <MenuButton key={item.href} item={item} index={index} theme={theme} />
          ))}
        </div>

        {/* Admin Link */}
        <Link 
          href="/admin"
          className={`block mt-4 text-center text-xs py-2 transition-colors ${
            theme === 'light' ? 'text-dark-400 active:text-dark-600' : 'text-dark-600 active:text-foam-400'
          }`}
        >
          Admin Access
        </Link>
      </main>
    </div>
  )
}

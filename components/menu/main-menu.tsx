'use client'

import { useGameStore, translations } from '@/lib/store'
import { formatNumber, getMultiplierTier } from '@/lib/utils'
import { 
  Play, Trophy, Calendar, Swords, Music, Users, 
  Skull, Wallet, Crown, Info, ShoppingBag, Sun, Moon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useEffect, useState, useCallback } from 'react'

export function MainMenu() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const { 
    highScore, level, napiwasBalance, coins,
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
  const isDark = theme === 'dark'

  const handleWalletClick = useCallback(() => {
    if (wallet) {
      tonConnectUI.disconnect()
    } else {
      tonConnectUI.openModal()
    }
  }, [wallet, tonConnectUI])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full gold-gradient animate-pulse-subtle" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--background))] safe-top overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-10 h-10 rounded-xl bg-[rgb(var(--muted))] flex items-center justify-center active:scale-95 transition-transform"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Coins */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgb(var(--muted))]">
            <span className="text-amber-400 font-bold">{formatNumber(coins)}</span>
            <span className="text-xs text-[rgb(var(--muted-foreground))]">{language === 'ru' ? 'монет' : 'coins'}</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
            className="w-10 h-10 rounded-xl bg-[rgb(var(--muted))] flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="font-bold text-sm">{language.toUpperCase()}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 pb-4 overflow-y-auto no-scrollbar">
        {/* Hero Logo */}
        <div className="flex flex-col items-center py-6">
          <div className="relative mb-4">
            {/* Glow */}
            <div className="absolute inset-0 blur-3xl bg-amber-500/30 rounded-full scale-150" />
            
            {/* Logo */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-amber-500/50 shadow-2xl animate-float">
              <Image 
                src="/images/napiwas-logo.jpg" 
                alt="NAPIWAS" 
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Level Badge */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 gold-gradient text-[#1a1a1a] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              LVL {level}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold gold-text mb-1">NAPIWAS</h1>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">{language === 'ru' ? 'Кот против Пива' : 'Cat vs Beer'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[rgb(var(--card))] rounded-xl p-3 text-center border border-[rgb(var(--border))]">
            <p className="text-xs text-[rgb(var(--muted-foreground))] mb-1">{t.highScore}</p>
            <p className="text-lg font-bold gold-text">{formatNumber(highScore)}</p>
          </div>
          <div className="bg-[rgb(var(--card))] rounded-xl p-3 text-center border border-[rgb(var(--border))]">
            <p className="text-xs text-[rgb(var(--muted-foreground))] mb-1">{t.level}</p>
            <p className="text-lg font-bold">{level}</p>
          </div>
          <div className="bg-[rgb(var(--card))] rounded-xl p-3 text-center border border-[rgb(var(--border))]">
            <p className="text-xs text-[rgb(var(--muted-foreground))] mb-1">{t.multiplier}</p>
            <p className="text-lg font-bold" style={{ color: tier.color }}>x{tier.multiplier}</p>
          </div>
        </div>

        {/* Play Button */}
        <Link 
          href="/play"
          className="w-full py-4 rounded-2xl gold-gradient text-[#1a1a1a] font-bold text-lg flex items-center justify-center gap-2 mb-4 active:scale-[0.98] transition-transform glow-gold"
        >
          <Play className="w-6 h-6" />
          {t.play}
        </Link>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MenuLink href="/leaderboard" icon={Trophy} label={t.leaderboard} delay={50} />
          <MenuLink href="/daily" icon={Calendar} label={t.daily} delay={100} />
          <MenuLink href="/pvp" icon={Swords} label={t.pvp} delay={150} />
          <MenuLink href="/bosses" icon={Skull} label={t.bosses} delay={200} />
          <MenuLink href="/shop" icon={ShoppingBag} label={t.shop} delay={250} />
          <MenuLink href="/music" icon={Music} label={t.music} delay={300} />
        </div>

        {/* Secondary Links */}
        <div className="grid grid-cols-2 gap-2">
          <MenuLink href="/partners" icon={Users} label={t.partners} small delay={350} />
          <MenuLink href="/guide" icon={Info} label={t.guide} small delay={400} />
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-4" />

        {/* Wallet Section */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleWalletClick}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgb(var(--muted))] border border-[rgb(var(--border))] active:scale-[0.98] transition-transform"
          >
            <Wallet className="w-5 h-5 text-amber-500" />
            <span className="font-medium">
              {wallet 
                ? `${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}`
                : t.connect
              }
            </span>
          </button>

          {wallet && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" style={{ color: tier.color }} />
                <span className="text-sm font-medium" style={{ color: tier.color }}>{tier.tier}</span>
              </div>
              <span className="text-sm text-[rgb(var(--muted-foreground))]">
                {formatNumber(napiwasBalance)} NAPIWAS
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function MenuLink({ 
  href, 
  icon: Icon, 
  label, 
  small,
  delay = 0
}: { 
  href: string
  icon: React.ElementType
  label: string
  small?: boolean
  delay?: number
}) {
  return (
    <Link
      href={href}
      style={{ animationDelay: `${delay}ms` }}
      className={`flex items-center gap-2 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] active:scale-[0.97] transition-transform opacity-0 animate-fadeInUp ${
        small ? 'py-2.5 px-3' : 'py-3.5 px-4'
      }`}
    >
      <Icon className={`text-amber-500 flex-shrink-0 ${small ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <span className={`font-medium truncate ${small ? 'text-sm' : ''}`}>{label}</span>
    </Link>
  )
}

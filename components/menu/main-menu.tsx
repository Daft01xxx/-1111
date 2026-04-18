'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import {
  Calendar,
  Info,
  Languages,
  Moon,
  Music,
  Play,
  ShoppingBag,
  Skull,
  Sun,
  Swords,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react'
import { NAPIWAS_CONTRACT, translations, useGameStore } from '@/lib/store'
import { formatNumber, getMultiplierTier, shortWalletAddress } from '@/lib/utils'

export function MainMenu() {
  const wallet = useTonWallet()
  const walletFriendlyAddress = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()
  const {
    highScore,
    level,
    napiwasBalance,
    setWallet,
    setMultiplier,
    theme,
    setTheme,
    language,
    setLanguage,
    musicVolume,
  } = useGameStore()

  const [mounted, setMounted] = useState(false)
  const menuAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const audio = new Audio('/audio/napiwas-menu.mp3')
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = Math.max(0, Math.min(1, musicVolume)) * 0.65
    menuAudioRef.current = audio

    const tryPlay = () => {
      if (audio.volume <= 0) return
      void audio.play().catch(() => undefined)
    }

    tryPlay()
    window.addEventListener('pointerdown', tryPlay, { passive: true })
    window.addEventListener('keydown', tryPlay)

    return () => {
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
      audio.pause()
      audio.currentTime = 0
      menuAudioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = menuAudioRef.current
    if (!audio) return
    const normalizedVolume = Math.max(0, Math.min(1, musicVolume)) * 0.65
    audio.volume = normalizedVolume
    if (normalizedVolume <= 0) {
      audio.pause()
      return
    }
    if (audio.paused) {
      void audio.play().catch(() => undefined)
    }
  }, [musicVolume])

  useEffect(() => {
    let cancelled = false

    const parseJettonBalance = (raw: string, decimals: number) => {
      const normalizedRaw = /^\d+$/.test(raw) ? raw : '0'
      const safeDecimals = Number.isFinite(decimals) ? Math.max(0, decimals) : 9
      const padded = normalizedRaw.padStart(safeDecimals + 1, '0')
      const intPart = padded.slice(0, -safeDecimals) || '0'
      const fracPart = safeDecimals > 0 ? padded.slice(-safeDecimals, -Math.max(0, safeDecimals - 4)) : ''
      return Number(fracPart ? `${intPart}.${fracPart}` : intPart)
    }

    const fetchNapiwasBalance = async (address: string) => {
      try {
        const response = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(address)}/jettons`, {
          cache: 'no-store',
        })
        if (!response.ok) return 0
        const data = await response.json()
        const balances = Array.isArray(data?.balances) ? data.balances : []
        const targetContract = NAPIWAS_CONTRACT.toUpperCase()

        const entry = balances.find((item: any) => {
          const symbol = String(item?.jetton?.symbol ?? item?.jetton?.metadata?.symbol ?? '').toUpperCase()
          const jettonAddress = String(item?.jetton?.address ?? '').toUpperCase()
          const jettonName = String(item?.jetton?.name ?? '').toUpperCase()
          return symbol === 'NAPIWAS' || jettonName.includes('NAPIWAS') || jettonAddress === targetContract
        })

        if (!entry) return 0
        return parseJettonBalance(String(entry?.balance ?? '0'), Number(entry?.jetton?.decimals ?? 9))
      } catch {
        return 0
      }
    }

    const syncWallet = async () => {
      if (!wallet) {
        setWallet(null, 0)
        setMultiplier(1.0)
        return
      }

      const address = wallet.account.address
      const balance = await fetchNapiwasBalance(address)
      if (cancelled) return
      setWallet(address, balance)
      setMultiplier(getMultiplierTier(balance).multiplier)

      // Keep users table warm so leaderboard can list connected wallets on a fresh DB.
      try {
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            wallet_address: address,
            username: `Player_${address.slice(-6)}`,
          }),
        })
      } catch {
        // Non-blocking best-effort sync.
      }
    }

    void syncWallet()

    return () => {
      cancelled = true
    }
  }, [wallet, setWallet, setMultiplier])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme, mounted])

  const tier = getMultiplierTier(napiwasBalance)
  const t = translations[language]
  const isDark = theme === 'dark'
  const effectiveWalletAddress = walletFriendlyAddress || wallet?.account.address || ''
  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

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
    <div className="min-h-screen flex flex-col bg-[rgb(var(--background))] safe-top overflow-x-hidden pb-[calc(92px+env(safe-area-inset-bottom))]">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-[calc(env(safe-area-inset-top)+10px)] pb-2 pointer-events-none">
        <div
          className={`pointer-events-auto rounded-[28px] backdrop-blur-xl px-3 py-2 ${
            isDark
              ? 'bg-[#060912]/92'
              : 'bg-[#faf4e8]/94'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <div className={`relative h-11 w-11 overflow-hidden rounded-full ${isDark ? 'bg-black/30' : 'bg-white/80'}`}>
                <Image src="/images/token-logo-coin.png" alt="NAPIWAS token" fill className="object-cover" sizes="44px" priority />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Theme switch"
                aria-pressed={!isDark}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 active:scale-[0.97] ${
                  isDark
                    ? 'bg-[#111827] text-white/90'
                    : 'bg-[#f0e7d2] text-[#3a2c14]'
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                className={`h-11 min-w-[52px] rounded-full px-3 text-xs font-bold tracking-wide transition-colors inline-flex items-center justify-center gap-1.5 ${
                  isDark
                    ? 'bg-[#111827] text-white/90'
                    : 'bg-[#f0e7d2] text-[#2f2617]'
                }`}
                aria-label="Language switch"
              >
                <Languages className="h-3.5 w-3.5" />
                {language.toUpperCase()}
              </button>

              <button
                onClick={handleWalletClick}
                className="h-11 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-4 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] inline-flex items-center gap-2"
                aria-label="Connect wallet"
              >
                <Wallet className="h-4 w-4" />
                {wallet ? shortWalletAddress(effectiveWalletAddress, 5, 4) : (language === 'ru' ? 'Подключить' : 'Connect Wallet')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div aria-hidden className="h-[calc(env(safe-area-inset-top)+76px)] flex-shrink-0" />

      <main className="flex-1 flex flex-col px-4 pb-4">
        <div className="flex flex-col items-center py-6 animate-menu-hero">
          <div className="relative mb-4">
            <div className="relative w-32 h-32 overflow-hidden">
              <Image
                src="/images/tagay-shot.webp"
                alt="NAPIWAS"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 gold-gradient text-[#1a1a1a] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              LVL {level}
            </div>
          </div>

          <h1 className="text-3xl font-bold gold-text mb-1">NAPIWAS</h1>
          <p className={`text-sm font-bold ${isDark ? 'text-orange-300/95' : 'text-orange-700'}`}>
            {formatNumber(Math.floor(napiwasBalance))} NAPIWAS
          </p>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">{language === 'ru' ? 'РљРѕС‚ Р·Р° РїРёРІРѕРј' : 'Cat for Beer'}</p>
        </div>

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
            <p className="text-lg font-bold" style={{ color: tier.color }}>
              x{tier.multiplier}
            </p>
          </div>
        </div>

        <Link
          href="/play"
          style={{ animationDelay: '220ms' }}
          className="w-full py-4 rounded-2xl gold-gradient text-[#1a1a1a] font-bold text-lg flex items-center justify-center gap-2 mb-4 active:scale-[0.965] active:translate-y-[1px] transition-all duration-200 hover:brightness-110 hover:shadow-[0_12px_24px_rgba(245,158,11,0.35)] active:shadow-[inset_0_8px_18px_rgba(0,0,0,0.2)] glow-gold animate-menu-section"
        >
          <Play className="w-6 h-6" />
          {t.play}
        </Link>

        <div className="grid grid-cols-2 gap-2 mb-4 animate-menu-section" style={{ animationDelay: '260ms' }}>
          <MenuLink href="/leaderboard" icon={Trophy} label={t.leaderboard} delay={50} />
          <MenuLink href="/daily" icon={Calendar} label={t.daily} delay={100} />
          <MenuLink href="/pvp" icon={Swords} label={t.pvp} delay={150} />
          <MenuLink href="/bosses" icon={Skull} label={t.bosses} delay={200} />
          <MenuLink href="/shop" icon={ShoppingBag} label={t.shop} delay={250} />
          <MenuLink href="/music" icon={Music} label={t.music} delay={300} />
        </div>

        <div className="grid grid-cols-2 gap-2 animate-menu-section" style={{ animationDelay: '300ms' }}>
          <MenuLink href="/partners" icon={Users} label={t.partners} delay={350} />
          <MenuLink href="/guide" icon={Info} label={t.guide} delay={400} />
        </div>

        <div className="flex-1 min-h-4" />

        <div className="mt-4 space-y-2 animate-menu-section" style={{ animationDelay: '340ms' }} />
      </main>
    </div>
  )
}

function MenuLink({
  href,
  icon: Icon,
  label,
  delay = 0,
}: {
  href: string
  icon: React.ElementType
  label: string
  delay?: number
}) {
  return (
    <Link
      href={href}
      style={{ animationDelay: `${delay}ms` }}
      className="flex h-14 items-center gap-2 rounded-xl bg-[rgb(var(--card))] px-4 active:scale-[0.965] active:translate-y-[1px] transition-all duration-200 hover:bg-[rgb(var(--muted))] hover:shadow-[0_8px_14px_rgba(0,0,0,0.2)] active:shadow-[inset_0_8px_16px_rgba(0,0,0,0.18)] animate-fadeInUp"
    >
      <Icon className="h-5 w-5 text-orange-500 flex-shrink-0" />
      <span className="font-medium truncate">{label}</span>
    </Link>
  )
}

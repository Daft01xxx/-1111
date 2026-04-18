'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowDownToLine, Compass, ListChecks, Rocket, ShoppingBag, UserRound } from 'lucide-react'
import { useGameStore } from '@/lib/store'

const navItems = [
  { key: 'main', href: '/', icon: Compass },
  { key: 'game', href: '/play', icon: Rocket },
  { key: 'tasks', href: '/daily', icon: ListChecks },
  { key: 'withdraw', href: '/withdraw', icon: ArrowDownToLine },
  { key: 'shop', href: '/shop', icon: ShoppingBag },
  { key: 'profile', href: '/profile', icon: UserRound },
] as const

export function AppBottomNav() {
  const pathname = usePathname()
  const { language, theme } = useGameStore()
  const isDark = theme === 'dark'

  if (pathname.startsWith('/admin') || pathname.startsWith('/play')) return null

  const labels =
    language === 'ru'
      ? {
          main: 'Главная',
          game: 'Игра',
          tasks: 'Задания',
          withdraw: 'Вывод',
          shop: 'Магазин',
          profile: 'Профиль',
        }
      : {
          main: 'Main',
          game: 'Game',
          tasks: 'Tasks',
          withdraw: 'Withdraw',
          shop: 'Shop',
          profile: 'Profile',
        }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href === '/profile') return pathname.startsWith('/profile') || pathname.startsWith('/leaderboard')
    return pathname.startsWith(href)
  }

  return (
    <>
      <div aria-hidden className="h-[90px]" />
      <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
        <div
          className={`mx-auto grid grid-cols-6 gap-1 rounded-2xl border px-2 py-1.5 ${
            isDark
              ? 'border-amber-400/30 bg-[#121214]/95'
              : 'border-amber-500/30 bg-[#fff9ee]/95'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors ${
                  active
                    ? isDark
                      ? 'bg-amber-500/22 text-amber-200'
                      : 'bg-amber-500/26 text-amber-700'
                    : isDark
                      ? 'text-white/60 hover:bg-white/8 hover:text-white'
                      : 'text-[#786a4d] hover:bg-black/5 hover:text-[#2b2416]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-semibold tracking-wide">{labels[item.key]}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

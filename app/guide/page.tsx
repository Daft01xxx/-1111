'use client'

import { 
  Info, ArrowLeft, Gamepad2, Target, Shield, Zap, 
  Trophy, Wallet, Flame, Music, Swords, Gift
} from 'lucide-react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

export default function GuidePage() {
  const { theme, language } = useGameStore()
  const isDark = theme === 'dark'

  const t = {
    title: language === 'ru' ? 'Как играть' : 'How to Play',
    welcome: language === 'ru' ? 'Добро пожаловать в NAPIWAS!' : 'Welcome to NAPIWAS!',
    welcomeDesc: language === 'ru' 
      ? 'Космический шутер с котиком против пивных кружек. Побеждай врагов, собирай бонусы и стань чемпионом!'
      : 'The ultimate cat vs beer space shooter. Defeat enemies, collect power-ups, and become the champion!',
    startPlaying: language === 'ru' ? 'Начать играть' : 'Start Playing',
  }

  const sections = language === 'ru' ? [
    {
      icon: Gamepad2,
      title: 'Управление',
      content: 'Проведите пальцем влево или вправо для перемещения котика. Корабль стреляет автоматически. Уклоняйтесь от пивных снарядов!',
    },
    {
      icon: Target,
      title: 'Оружие',
      content: 'Начните с базовой пушки. Открывайте мощное оружие побеждая боссов или покупая в магазине. 10 видов оружия с уникальными характеристиками!',
    },
    {
      icon: Shield,
      title: 'Бонусы',
      content: 'Собирайте бонусы с побежденных врагов: Щит (блокирует урон), Двойной выстрел, Скорострельность, Лечение. Бонусы складываются!',
    },
    {
      icon: Trophy,
      title: 'Очки',
      content: 'Побеждайте врагов чтобы заработать очки. Большие враги дают больше очков. За боссов дают огромные бонусы. Множитель увеличивает заработок!',
    },
    {
      icon: Wallet,
      title: 'Токены NAPIWAS',
      content: 'Подключите TON кошелек с токенами NAPIWAS для множителей: 1000+ = 1.25x, 10000+ = 1.5x, 50000+ = 1.75x, 100000+ = 2.0x!',
    },
    {
      icon: Flame,
      title: 'Ежедневные награды',
      content: 'Заходите каждый день для бонусных очков. Создавайте серию для больших наград! Выполняйте задания DEX для дополнительных бонусов.',
    },
    {
      icon: Swords,
      title: 'PvP Битвы',
      content: 'Бросьте вызов другим игрокам в битве за очки. Создайте матч со ставкой - победитель забирает всё (минус 5% комиссии).',
    },
    {
      icon: Music,
      title: 'Музыка',
      content: 'Открывайте новые треки достигая определенного количества очков. Слушайте любимую музыку во время игры!',
    },
    {
      icon: Gift,
      title: 'Боссы',
      content: 'Каждую минуту появляется босс-кот! С каждым разом босс становится сильнее. За победу над боссом можно получить оружие (шанс 30%)!',
    },
  ] : [
    {
      icon: Gamepad2,
      title: 'Basic Controls',
      content: 'Slide your finger left and right to move your cat. The ship auto-fires at enemies. Avoid getting hit by beer projectiles!',
    },
    {
      icon: Target,
      title: 'Weapons',
      content: 'Start with basic yarn ball. Unlock powerful weapons by defeating bosses or buying in shop. 10 unique weapons with different stats!',
    },
    {
      icon: Shield,
      title: 'Power-Ups',
      content: 'Collect power-ups from defeated enemies: Shield (blocks damage), Double Shot, Speed Boost, Health packs. Power-ups can stack!',
    },
    {
      icon: Trophy,
      title: 'Scoring',
      content: 'Defeat enemies to earn points. Larger enemies give more points. Boss battles award massive bonuses. Multiplier boosts your earnings!',
    },
    {
      icon: Wallet,
      title: 'NAPIWAS Tokens',
      content: 'Connect your TON wallet with NAPIWAS tokens for multipliers: 1000+ = 1.25x, 10000+ = 1.5x, 50000+ = 1.75x, 100000+ = 2.0x!',
    },
    {
      icon: Flame,
      title: 'Daily Rewards',
      content: 'Check in daily to earn bonus points. Build a streak for bigger rewards! Complete DEX tasks for additional bonuses.',
    },
    {
      icon: Swords,
      title: 'PvP Battles',
      content: 'Challenge other players to score battles. Create a match with a bet - winner takes the pot (minus 5% house fee).',
    },
    {
      icon: Music,
      title: 'Jukebox',
      content: 'Unlock new music tracks by reaching score milestones. Listen to your favorite tracks while playing!',
    },
    {
      icon: Gift,
      title: 'Boss Rush',
      content: 'Every minute a boss cat appears! Each boss is stronger than the last. Defeat bosses for weapon drops (30% chance)!',
    },
  ]

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#faf9f7]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-sm border-b p-4 pt-[calc(1rem+env(safe-area-inset-top))] ${
        isDark ? 'bg-[#0a0a0b]/90 border-[#1a1a1a]' : 'bg-[#faf9f7]/90 border-[#e5e5e5]'
      }`}>
        <div className="flex items-center justify-between">
          <Link href="/" className={`p-2 -m-2 rounded-lg active:scale-95 transition-all ${
            isDark ? 'active:bg-[#1a1a1a]' : 'active:bg-[#e5e5e5]'
          }`}>
            <ArrowLeft className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
          </Link>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
            <Info className="w-5 h-5 text-amber-500" />
            {t.title}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-4 pb-8">
        {/* Hero */}
        <div
          className={`rounded-2xl border p-6 text-center animate-fadeInUp ${
            isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#e5e5e5]'
          }`}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <span className="text-4xl">🐱</span>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            {t.welcome}
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.welcomeDesc}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className={`rounded-xl border p-4 animate-fadeInUp ${
                isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#e5e5e5]'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{section.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Multiplier tiers */}
        <div
          className={`rounded-xl border p-4 animate-fadeInUp ${
            isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#e5e5e5]'
          }`}
          style={{ animationDelay: '500ms' }}
        >
          <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {language === 'ru' ? 'Уровни токенов NAPIWAS' : 'NAPIWAS Token Tiers'}
          </h3>
          <div className="space-y-2">
            {[
              { tier: language === 'ru' ? 'ОБЫЧНЫЙ' : 'COMMON', balance: '0+', mult: '1.0x', color: '#9CA3AF' },
              { tier: language === 'ru' ? 'НЕОБЫЧНЫЙ' : 'UNCOMMON', balance: '1,000+', mult: '1.25x', color: '#22C55E' },
              { tier: language === 'ru' ? 'РЕДКИЙ' : 'RARE', balance: '10,000+', mult: '1.5x', color: '#3B82F6' },
              { tier: language === 'ru' ? 'ЭПИЧЕСКИЙ' : 'EPIC', balance: '50,000+', mult: '1.75x', color: '#A855F7' },
              { tier: language === 'ru' ? 'ЛЕГЕНДАРНЫЙ' : 'LEGENDARY', balance: '100,000+', mult: '2.0x', color: '#FFD700' },
            ].map((item) => (
              <div
                key={item.tier}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isDark ? 'bg-[#0a0a0b]' : 'bg-[#f5f5f5]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{item.tier}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{item.balance}</span>
                  <span className="font-bold" style={{ color: item.color }}>{item.mult}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Play button */}
        <Link
          href="/play"
          className="block w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-center text-lg active:scale-[0.98] transition-all shadow-lg shadow-amber-500/30"
        >
          {t.startPlaying}
        </Link>
      </div>
    </div>
  )
}

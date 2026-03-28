'use client'

import { useGameStore } from '@/lib/store'
import { Skull, Lock, Check, ArrowLeft, Heart, Swords, Star, Crown } from 'lucide-react'
import Link from 'next/link'

export default function BossesPage() {
  const { bossesDefeated, theme, language } = useGameStore()

  const t = {
    title: language === 'ru' ? 'Боссы' : 'Bosses',
    defeated: language === 'ru' ? 'Побеждено' : 'Defeated',
    available: language === 'ru' ? 'Доступен' : 'Available',
    locked: language === 'ru' ? 'Закрыт' : 'Locked',
    hp: language === 'ru' ? 'Здоровье' : 'HP',
    dmg: language === 'ru' ? 'Урон' : 'DMG',
    pts: language === 'ru' ? 'Очки' : 'PTS',
    loreTitle: language === 'ru' ? 'История Противостояния' : 'The Story',
    loreText:
      language === 'ru'
        ? 'Силы пьяного хаоса объединились против NAPIWAS. Эти боссы появляются каждую минуту, чтобы остановить твой полет. Победи их всех и забери небо себе.'
        : 'The forces of drunk chaos have united against NAPIWAS. These bosses appear every minute to stop your flight. Defeat them all and claim the sky.',
    bossAppears: language === 'ru' ? 'Появляется каждые 60 секунд' : 'Appears every 60 seconds',
  }

  const bosses = [
    {
      id: 'beer_baron',
      name: 'Beer Baron',
      nameRu: 'Пивной Барон',
      description: 'A giant beer mug with a golden crown. Shoots foam bubbles.',
      descriptionRu: 'Гигантская пивная кружка с золотой короной. Стреляет пенными пузырями.',
      health: 100,
      damage: 10,
      points: 500,
      color: '#F59E0B',
    },
    {
      id: 'whiskey_wizard',
      name: 'Whiskey Wizard',
      nameRu: 'Виски Волшебник',
      description: 'Magical whiskey bottle wielding fire spells.',
      descriptionRu: 'Магическая бутылка виски, владеющая огненными заклинаниями.',
      health: 200,
      damage: 15,
      points: 1000,
      color: '#92400E',
    },
    {
      id: 'vodka_vampire',
      name: 'Vodka Vampire',
      nameRu: 'Водочный Вампир',
      description: 'Cold as ice, fast as lightning. Drains your health.',
      descriptionRu: 'Холодный как лёд, быстрый как молния. Высасывает здоровье.',
      health: 300,
      damage: 20,
      points: 1500,
      color: '#60A5FA',
    },
    {
      id: 'wine_witch',
      name: 'Wine Witch',
      nameRu: 'Винная Ведьма',
      description: 'Elegant but deadly. Casts curses and summons minions.',
      descriptionRu: 'Элегантная, но смертельная. Накладывает проклятия и призывает прислужников.',
      health: 400,
      damage: 25,
      points: 2000,
      color: '#7C3AED',
    },
    {
      id: 'cat_emperor',
      name: 'Cat Emperor',
      nameRu: 'Кот-Император',
      description: 'The ultimate boss. A giant evil cat with a crown and every attack pattern.',
      descriptionRu: 'Финальный босс. Гигантский злой кот с короной и полным набором атак.',
      health: 500,
      damage: 30,
      points: 5000,
      color: '#EF4444',
    },
  ]

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#faf9f7]'}`}>
      <header
        className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3 ${
          isDark ? 'bg-[#0a0a0b]/95 border-[#1a1a1a]' : 'bg-[#faf9f7]/95 border-[#e5e5e5]'
        }`}
        style={{ animation: 'fadeInDown 0.3s ease' }}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
              isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
          </Link>
          <h1 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
            <Skull className="w-5 h-5 text-red-500" />
            {t.title}
          </h1>
          <div
            className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
              isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
            }`}
          >
            {bossesDefeated}/{bosses.length}
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div
          className={`rounded-2xl p-4 ${isDark ? 'bg-[#111] border border-[#1a1a1a]' : 'bg-white border border-[#e5e5e5]'}`}
          style={{ animation: 'fadeInUp 0.3s ease 0.1s forwards', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.bossAppears}</span>
            <span className="text-lg font-bold text-amber-500">
              {bossesDefeated}/{bosses.length}
            </span>
          </div>
          <div className="flex gap-1.5">
            {bosses.map((boss, i) => (
              <div
                key={boss.id}
                className={`flex-1 h-2.5 rounded-full transition-all ${
                  i < bossesDefeated ? 'bg-amber-500' : isDark ? 'bg-[#1a1a1a]' : 'bg-[#e5e5e5]'
                }`}
              />
            ))}
          </div>
        </div>

        {bosses.map((boss, index) => {
          const isDefeated = index < bossesDefeated
          const isUnlocked = index <= bossesDefeated

          return (
            <div
              key={boss.id}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                isDefeated
                  ? isDark
                    ? 'bg-green-500/5 border-green-500/30'
                    : 'bg-green-50 border-green-200'
                  : isUnlocked
                    ? isDark
                      ? 'bg-[#111] border-amber-500/30'
                      : 'bg-white border-amber-200'
                    : isDark
                      ? 'bg-[#0a0a0b] border-[#1a1a1a] opacity-50'
                      : 'bg-gray-50 border-[#e5e5e5] opacity-50'
              }`}
              style={{
                animation: `fadeInUp 0.4s ease ${index * 80}ms forwards`,
                opacity: 0,
              }}
            >
              <div
                className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  isDefeated
                    ? 'bg-green-500/20 text-green-500'
                    : isUnlocked
                      ? 'bg-amber-500/20 text-amber-500'
                      : isDark
                        ? 'bg-[#1a1a1a] text-gray-600'
                        : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isDefeated ? t.defeated : isUnlocked ? t.available : t.locked}
              </div>

              <div className="p-4">
                <div className="flex gap-4">
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 relative"
                    style={{
                      backgroundColor: isUnlocked ? `${boss.color}15` : isDark ? '#1a1a1a' : '#f0f0f0',
                    }}
                  >
                    {isUnlocked ? (
                      <>
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: boss.color,
                            boxShadow: `0 4px 20px ${boss.color}40`,
                          }}
                        >
                          {boss.id === 'cat_emperor' ? (
                            <Crown className="w-6 h-6 text-white" />
                          ) : (
                            <Skull className="w-6 h-6 text-white" />
                          )}
                        </div>
                        {isDefeated && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </>
                    ) : (
                      <Lock className={`w-8 h-8 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg font-bold ${
                        isUnlocked ? (isDark ? 'text-white' : 'text-black') : isDark ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {language === 'ru' ? boss.nameRu : boss.name}
                    </h3>

                    {isUnlocked && (
                      <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {language === 'ru' ? boss.descriptionRu : boss.description}
                      </p>
                    )}
                  </div>
                </div>

                {isUnlocked && (
                  <div className="flex gap-3 mt-4 pt-3 border-t" style={{ borderColor: isDark ? '#1a1a1a' : '#e5e5e5' }}>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
                        isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      {boss.health} {t.hp}
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
                        isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-500'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5" />
                      {boss.damage} {t.dmg}
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
                        isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      {boss.points} {t.pts}
                    </div>
                  </div>
                )}
              </div>

              {isDefeated && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />}
            </div>
          )
        })}

        <div
          className={`rounded-2xl p-4 mt-6 ${isDark ? 'bg-[#111] border border-[#1a1a1a]' : 'bg-white border border-[#e5e5e5]'}`}
          style={{ animation: 'fadeInUp 0.4s ease 0.4s forwards', opacity: 0 }}
        >
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>{t.loreTitle}</h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.loreText}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

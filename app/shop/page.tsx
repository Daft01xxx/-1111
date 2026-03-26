'use client'

import { useState } from 'react'
import { useGameStore, translations } from '@/lib/store'
import { formatNumber } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Cat, Zap, Coins, Check, Lock } from 'lucide-react'
import Link from 'next/link'

export default function ShopPage() {
  const [tab, setTab] = useState<'skins' | 'weapons'>('skins')
  const { 
    coins, skins, weapons, currentSkinId,
    purchaseSkin, purchaseWeapon, selectSkin, selectWeapon,
    theme, language
  } = useGameStore()

  const t = translations[language]

  const handlePurchaseSkin = (skinId: string) => {
    if (purchaseSkin(skinId)) {
      selectSkin(skinId)
    }
  }

  const handlePurchaseWeapon = (weaponId: string, index: number) => {
    if (purchaseWeapon(weaponId)) {
      selectWeapon(index)
    }
  }

  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === 'light' ? 'bg-foam-100' : 'bg-dark-950'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-sm border-b px-3 py-3 safe-area-inset ${
        theme === 'light' 
          ? 'bg-foam-100/90 border-dark-200' 
          : 'bg-dark-950/90 border-dark-800'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className={`p-2 -m-2 rounded-lg transition-colors active:scale-95 flex-shrink-0 ${
            theme === 'light' ? 'active:bg-dark-200' : 'active:bg-dark-800'
          }`}>
            <ArrowLeft className={`w-6 h-6 ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`} />
          </Link>
          <h1 className="text-lg font-display font-bold beer-text flex items-center gap-2 truncate">
            <ShoppingBag className="w-5 h-5 text-beer-500 flex-shrink-0" />
            {language === 'ru' ? 'Магазин' : 'Shop'}
          </h1>
          <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg flex-shrink-0 ${
            theme === 'light' ? 'bg-dark-200' : 'bg-dark-800'
          }`}>
            <Coins className="w-4 h-4 text-beer-500" />
            <span className={`font-bold text-sm ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>
              {formatNumber(coins)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTab('skins')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all active:scale-[0.98] ${
              tab === 'skins'
                ? 'bg-beer-500 text-dark-950'
                : theme === 'light'
                  ? 'bg-dark-200 text-dark-600'
                  : 'bg-dark-800 text-foam-400'
            }`}
          >
            <Cat className="w-4 h-4" />
            {language === 'ru' ? 'Скины' : 'Skins'}
          </button>
          <button
            onClick={() => setTab('weapons')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all active:scale-[0.98] ${
              tab === 'weapons'
                ? 'bg-beer-500 text-dark-950'
                : theme === 'light'
                  ? 'bg-dark-200 text-dark-600'
                  : 'bg-dark-800 text-foam-400'
            }`}
          >
            <Zap className="w-4 h-4" />
            {language === 'ru' ? 'Оружие' : 'Weapons'}
          </button>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {tab === 'skins' ? (
          <>
            {skins.map((skin, index) => {
              const isSelected = currentSkinId === skin.id
              const canAfford = coins >= skin.price

              return (
                <motion.div
                  key={skin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-beer-500 ring-2 ring-beer-500/30'
                      : theme === 'light'
                        ? 'bg-white border-dark-200'
                        : 'bg-dark-900 border-dark-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: skin.color + '20' }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: skin.color }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>
                          {language === 'ru' ? skin.nameRu : skin.name}
                        </h3>
                        {isSelected && (
                          <span className="text-xs px-2 py-0.5 rounded bg-beer-500/20 text-beer-500 font-medium">
                            {language === 'ru' ? 'Выбран' : 'Selected'}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${theme === 'light' ? 'text-dark-500' : 'text-foam-500'}`}>
                        {skin.description}
                      </p>
                    </div>

                    {/* Action */}
                    <div>
                      {skin.unlocked ? (
                        isSelected ? (
                          <div className="w-10 h-10 rounded-full bg-beer-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-dark-950" />
                          </div>
                        ) : (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => selectSkin(skin.id)}
                            className="px-4 py-2 rounded-lg bg-beer-500 text-dark-950 font-bold text-sm"
                          >
                            {language === 'ru' ? 'Выбрать' : 'Select'}
                          </motion.button>
                        )
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePurchaseSkin(skin.id)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 ${
                            canAfford
                              ? 'bg-beer-500 text-dark-950'
                              : theme === 'light'
                                ? 'bg-dark-200 text-dark-400'
                                : 'bg-dark-700 text-dark-500'
                          }`}
                        >
                          {canAfford ? (
                            <>
                              <Coins className="w-4 h-4" />
                              {skin.price}
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              {skin.price}
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </>
        ) : (
          <>
            {weapons.map((weapon, index) => {
              const isSelected = weapon.selected
              const canAfford = coins >= weapon.price

              return (
                <motion.div
                  key={weapon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-beer-500 ring-2 ring-beer-500/30'
                      : theme === 'light'
                        ? 'bg-white border-dark-200'
                        : 'bg-dark-900 border-dark-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-beer-500/20 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-beer-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${theme === 'light' ? 'text-dark-900' : 'text-foam-100'}`}>
                          {language === 'ru' ? weapon.nameRu : weapon.name}
                        </h3>
                        {isSelected && (
                          <span className="text-xs px-2 py-0.5 rounded bg-beer-500/20 text-beer-500 font-medium">
                            {language === 'ru' ? 'Активно' : 'Active'}
                          </span>
                        )}
                      </div>
                      <div className={`flex gap-3 text-xs mt-1 ${theme === 'light' ? 'text-dark-500' : 'text-foam-500'}`}>
                        <span>{language === 'ru' ? 'Урон' : 'DMG'}: {weapon.damage}</span>
                        <span>{language === 'ru' ? 'Скор.' : 'Rate'}: {weapon.fireRate}/s</span>
                        <span>{language === 'ru' ? 'Снаряды' : 'Proj'}: {weapon.projectileCount}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div>
                      {weapon.unlocked ? (
                        isSelected ? (
                          <div className="w-10 h-10 rounded-full bg-beer-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-dark-950" />
                          </div>
                        ) : (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => selectWeapon(index)}
                            className="px-4 py-2 rounded-lg bg-beer-500 text-dark-950 font-bold text-sm"
                          >
                            {language === 'ru' ? 'Выбрать' : 'Select'}
                          </motion.button>
                        )
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePurchaseWeapon(weapon.id, index)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 ${
                            canAfford
                              ? 'bg-beer-500 text-dark-950'
                              : theme === 'light'
                                ? 'bg-dark-200 text-dark-400'
                                : 'bg-dark-700 text-dark-500'
                          }`}
                        >
                          {canAfford ? (
                            <>
                              <Coins className="w-4 h-4" />
                              {weapon.price}
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              {weapon.price}
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </>
        )}

        {/* Info */}
        <div className={`p-4 rounded-xl text-center ${
          theme === 'light' ? 'bg-dark-100' : 'bg-dark-800/50'
        }`}>
          <p className={`text-sm ${theme === 'light' ? 'text-dark-500' : 'text-foam-500'}`}>
            {language === 'ru' 
              ? 'Зарабатывай монеты играя и побеждая боссов!' 
              : 'Earn coins by playing and defeating bosses!'}
          </p>
        </div>
      </div>
    </div>
  )
}

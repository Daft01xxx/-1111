'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTonAddress, useTonWallet } from '@tonconnect/ui-react'
import { ArrowDownToLine, Beer, Check, Copy, RefreshCcw, Sparkles, Wallet } from 'lucide-react'
import { AppPageHeader } from '@/components/ui/app-page-header'
import { useGameStore } from '@/lib/store'
import { formatNumber } from '@/lib/utils'

interface RewardSummary {
  conversion: {
    mugsPerNapiwas: number
  }
  withdraw: {
    minNapiwas: number
  }
}

function formatNapiwasValue(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '0'
  return value.toFixed(3).replace(/\.?0+$/, '')
}

export default function WithdrawPage() {
  const wallet = useTonWallet()
  const walletFriendlyAddress = useTonAddress()
  const { language, coins, walletAddress, theme, addCoins } = useGameStore()
  const isDark = theme === 'dark'

  const effectiveWalletAddress = wallet?.account?.address || walletAddress || null
  const friendlyWalletAddress = walletFriendlyAddress || effectiveWalletAddress || ''

  const [rewardSummary, setRewardSummary] = useState<RewardSummary | null>(null)
  const [rewardLoading, setRewardLoading] = useState(false)
  const [rewardActionLoading, setRewardActionLoading] = useState<'withdraw' | null>(null)
  const [rewardActionError, setRewardActionError] = useState<string | null>(null)
  const [rewardActionSuccess, setRewardActionSuccess] = useState<string | null>(null)
  const [withdrawRecipient, setWithdrawRecipient] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [lastCheckUrl, setLastCheckUrl] = useState<string | null>(null)
  const [walletCopied, setWalletCopied] = useState(false)

  const t = useMemo(
    () =>
      language === 'ru'
        ? {
            title: 'Р’С‹РІРѕРґ',
            wallet: 'РљРѕС€РµР»С‘Рє',
            notConnected: 'РќРµ РїРѕРґРєР»СЋС‡РµРЅ',
            rewards: 'Р’С‹РІРѕРґ NAPIWAS',
            prepare: 'РљРѕРЅРІРµСЂС‚РёСЂРѕРІР°С‚СЊ РєСЂСѓР¶РєРё',
            withdraw: 'Р’С‹РІРµСЃС‚Рё',
            refresh: 'РћР±РЅРѕРІРёС‚СЊ',
            withdrawHint: 'РњРёРЅ. РІС‹РІРѕРґ',
            loadingRewards: 'Р—Р°РіСЂСѓР·РєР°...',
            withdrawAmount: 'РЎСѓРјРјР° РІС‹РІРѕРґР° (NAPIWAS)',
            recipient: 'РђРґСЂРµСЃ РїРѕР»СѓС‡Р°С‚РµР»СЏ TON',
            openCheck: 'РћС‚РєСЂС‹С‚СЊ С‚СЂР°РЅР·Р°РєС†РёСЋ',
            mugsBalance: 'Р‘Р°Р»Р°РЅСЃ РєСЂСѓР¶РµРє',
            maxAvailable: 'Р”РѕСЃС‚СѓРїРЅРѕ Рє РІС‹РІРѕРґСѓ',
            checkMugs: 'РџСЂРѕРІРµСЂРєР° РєСЂСѓР¶РµРє РІС‹РїРѕР»РЅРёС‚СЃСЏ РїРµСЂРµРґ РІС‹РІРѕРґРѕРј',
          }
        : {
            title: 'Withdraw',
            wallet: 'Wallet',
            notConnected: 'Not connected',
            rewards: 'NAPIWAS Withdraw',
            prepare: 'Convert mugs',
            withdraw: 'Withdraw',
            refresh: 'Refresh',
            withdrawHint: 'Min withdraw',
            loadingRewards: 'Loading...',
            withdrawAmount: 'Withdraw amount (NAPIWAS)',
            recipient: 'TON recipient address',
            openCheck: 'Open transaction',
            mugsBalance: 'Mugs balance',
            maxAvailable: 'Available to withdraw',
            checkMugs: 'Mugs availability will be checked before payout',
          },
    [language]
  )

  const loadRewards = useCallback(async () => {
    if (!effectiveWalletAddress) {
      setRewardSummary(null)
      return
    }

    setRewardLoading(true)
    setRewardActionError(null)

    try {
      const response = await fetch(`/api/rewards?wallet=${encodeURIComponent(effectiveWalletAddress)}`, { cache: 'no-store' })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        const message = typeof payload?.error === 'string' ? payload.error : 'Failed to load rewards'
        setRewardActionError(message)
        setRewardSummary(null)
        return
      }

      setRewardSummary({
        conversion: {
          mugsPerNapiwas: Number(payload?.conversion?.mugsPerNapiwas || 1000),
        },
        withdraw: {
          minNapiwas: Number(payload?.withdraw?.minNapiwas || 0.001),
        },
      })
    } catch {
      setRewardActionError('Failed to load rewards')
      setRewardSummary(null)
    } finally {
      setRewardLoading(false)
    }
  }, [effectiveWalletAddress])

  useEffect(() => {
    void loadRewards()
  }, [loadRewards])

  const mugsPerToken = rewardSummary?.conversion?.mugsPerNapiwas || 1000
  const maxAvailableTokens = coins / mugsPerToken

  const handlePrepareFromMugs = useCallback(() => {
    setRewardActionError(null)
    setRewardActionSuccess(null)
    setLastCheckUrl(null)
    setWithdrawAmount(formatNapiwasValue(maxAvailableTokens))
  }, [maxAvailableTokens])

  const handleCopyWallet = useCallback(async () => {
    if (!friendlyWalletAddress) return
    try {
      await navigator.clipboard.writeText(friendlyWalletAddress)
      setWalletCopied(true)
      window.setTimeout(() => setWalletCopied(false), 1600)
    } catch {
      setWalletCopied(false)
    }
  }, [friendlyWalletAddress])

  const handleWithdraw = useCallback(async () => {
    if (!effectiveWalletAddress) {
      setRewardActionError('Connect TON wallet first')
      return
    }
    if (!rewardSummary) {
      setRewardActionError('Withdraw settings are not loaded yet')
      return
    }

    const normalizedAmount = withdrawAmount.trim()
    const parsedAmount = normalizedAmount ? Number(normalizedAmount) : NaN
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setRewardActionError('Enter a valid amount')
      return
    }

    if (parsedAmount < rewardSummary.withdraw.minNapiwas) {
      setRewardActionError(`Minimum withdraw is ${rewardSummary.withdraw.minNapiwas} NAPIWAS`)
      return
    }

    setRewardActionLoading('withdraw')
    setRewardActionError(null)
    setRewardActionSuccess(null)
    setLastCheckUrl(null)

    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'withdraw',
          wallet_address: effectiveWalletAddress,
          amount_napiwas: parsedAmount,
          recipient_address: withdrawRecipient.trim(),
          mugs_balance: coins,
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok || payload?.success === false) {
        const message = typeof payload?.error === 'string' ? payload.error : 'Withdraw failed'
        setRewardActionError(message)
        return
      }

      const paidAmount = Math.max(0, Number(payload?.paidAmount || 0))
      const deductedMugs = Math.max(0, Number(payload?.deductMugs || 0))
      const checkUrl = typeof payload?.checkUrl === 'string' ? payload.checkUrl : null
      const payoutMessage = typeof payload?.payoutMessage === 'string' ? payload.payoutMessage : null

      if (deductedMugs > 0) {
        addCoins(-deductedMugs)
      }
      if (checkUrl) {
        setLastCheckUrl(checkUrl)
      }

      setRewardActionSuccess(
        payoutMessage ? payoutMessage : paidAmount > 0 ? `-${formatNapiwasValue(paidAmount)} NAPIWAS` : 'Request sent'
      )
      setWithdrawAmount('')
      await loadRewards()
    } catch {
      setRewardActionError('Withdraw failed')
    } finally {
      setRewardActionLoading(null)
    }
  }, [addCoins, coins, effectiveWalletAddress, loadRewards, rewardSummary, withdrawAmount, withdrawRecipient])

  return (
    <div className={`min-h-screen pb-[calc(108px+env(safe-area-inset-bottom))] ${isDark ? 'bg-[#060606]' : 'bg-[#f7f4ec]'}`}>
      <AppPageHeader title={t.title} icon={<ArrowDownToLine className="h-5 w-5 text-orange-500" />} />

      <div className="space-y-3 p-4">
        <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-orange-500/35 bg-black">
              <Image src="/images/kitten-reading.gif" alt="Kitten avatar" fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.wallet}</p>
              <p className={`mt-1 break-all text-[12px] font-semibold leading-snug ${isDark ? 'text-white' : 'text-[#222]'}`}>
                {friendlyWalletAddress || t.notConnected}
              </p>
            </div>
            <button
              onClick={() => void handleCopyWallet()}
              disabled={!friendlyWalletAddress}
              className={`inline-flex h-9 items-center justify-center gap-1 rounded-lg border px-2 text-xs font-semibold transition-colors ${
                isDark
                  ? 'border-orange-500/35 bg-black/45 text-orange-300 hover:bg-black/70 disabled:opacity-45'
                  : 'border-[#e2c98f] bg-[#f7ecd0] text-[#7a5a1d] hover:bg-[#f2e2ba] disabled:opacity-45'
              }`}
              title={language === 'ru' ? 'РљРѕРїРёСЂРѕРІР°С‚СЊ' : 'Copy'}
              aria-label={language === 'ru' ? 'РљРѕРїРёСЂРѕРІР°С‚СЊ' : 'Copy'}
            >
              {walletCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{walletCopied ? 'OK' : language === 'ru' ? 'РљРѕРїРёСЂРѕРІР°С‚СЊ' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.mugsBalance}</p>
              <p className="text-3xl font-black text-orange-500">{formatNumber(coins)}</p>
            </div>
            <Beer className="h-7 w-7 text-orange-500" />
          </div>
          <p className={`mt-2 text-xs ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>
            {t.maxAvailable}: <span className="font-bold text-orange-500">{formatNapiwasValue(maxAvailableTokens)} NAPIWAS</span>
          </p>
        </div>

        <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#111111]' : 'bg-white border border-[#e9e2d1]'}`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className={`text-sm ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.rewards}</p>
              <p className={`text-xs ${isDark ? 'text-white/45' : 'text-[#8f7a50]'}`}>
                {t.withdrawHint}: {formatNapiwasValue(rewardSummary?.withdraw?.minNapiwas || 0.001)} NAPIWAS
              </p>
            </div>
            <button
              onClick={() => void loadRewards()}
              disabled={rewardLoading}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                isDark ? 'bg-black/45 text-orange-400 hover:bg-black/70' : 'bg-[#f1ebdb] text-orange-600 hover:bg-[#e8ddc5]'
              }`}
              aria-label={t.refresh}
              title={t.refresh}
            >
              <RefreshCcw className={`h-4 w-4 ${rewardLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {rewardLoading ? (
            <p className={`text-sm ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.loadingRewards}</p>
          ) : (
            <>
              <div className="mt-2">
                <label className={`mb-1 block text-[11px] ${isDark ? 'text-white/45' : 'text-[#8f7a50]'}`}>{t.recipient}</label>
                <input
                  type="text"
                  value={withdrawRecipient}
                  onChange={(event) => setWithdrawRecipient(event.target.value)}
                  placeholder="UQ..."
                  className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors ${
                    isDark
                      ? 'border-orange-500/35 bg-black/45 text-white placeholder:text-white/35 focus:border-orange-500/70'
                      : 'border-[#e9d8af] bg-[#fff9ea] text-[#222] placeholder:text-[#a48a56] focus:border-orange-500/70'
                  }`}
                />
              </div>

              <div className="mt-2">
                <label className={`mb-1 block text-[11px] ${isDark ? 'text-white/45' : 'text-[#8f7a50]'}`}>{t.withdrawAmount}</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={withdrawAmount}
                  onChange={(event) => setWithdrawAmount(event.target.value)}
                  placeholder="0.001"
                  className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors ${
                    isDark
                      ? 'border-orange-500/35 bg-black/45 text-white placeholder:text-white/35 focus:border-orange-500/70'
                      : 'border-[#e9d8af] bg-[#fff9ea] text-[#222] placeholder:text-[#a48a56] focus:border-orange-500/70'
                  }`}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrepareFromMugs}
                  className={`h-11 rounded-xl text-sm font-semibold transition-colors ${
                    isDark
                      ? 'bg-[#f59e0b] text-black enabled:hover:bg-[#fbbf24]'
                      : 'bg-[#f59e0b] text-black enabled:hover:bg-[#d68a0b]'
                  }`}
                >
                  {t.prepare}
                </button>
                <button
                  onClick={() => void handleWithdraw()}
                  disabled={rewardActionLoading !== null}
                  className={`flex h-11 items-center justify-center gap-1 rounded-xl text-sm font-semibold transition-colors ${
                    isDark
                      ? 'bg-[#1a1a1a] text-orange-400 border border-orange-500/55 enabled:hover:bg-black disabled:opacity-45'
                      : 'bg-[#fff6de] text-orange-700 border border-orange-500/55 enabled:hover:bg-[#ffe8b1] disabled:opacity-45'
                  }`}
                >
                  <Wallet className="h-4 w-4" />
                  <span>{rewardActionLoading === 'withdraw' ? '...' : t.withdraw}</span>
                </button>
              </div>

              <p className={`mt-2 text-[11px] ${isDark ? 'text-white/45' : 'text-[#8f7a50]'}`}>{t.checkMugs}</p>

              {rewardActionError && <p className={`mt-2 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{rewardActionError}</p>}
              {rewardActionSuccess && (
                <p className={`mt-2 flex items-center gap-1 text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{rewardActionSuccess}</span>
                </p>
              )}
              {lastCheckUrl && (
                <a
                  href={lastCheckUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-2 inline-block text-xs font-semibold underline ${isDark ? 'text-orange-300' : 'text-orange-700'}`}
                >
                  {t.openCheck}
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

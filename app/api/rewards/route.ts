import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

type RewardWalletRow = {
  wallet_address: string
  pending_napiwas: number | null
  total_earned_napiwas: number | null
  total_withdrawn_napiwas: number | null
}

type DailyBossRewardRow = {
  boss_level: number
  reward_napiwas: number
}

type PayoutResult = {
  payoutStatus: 'completed' | 'processing'
  checkId: string | null
  checkUrl: string | null
  providerRaw: unknown
  providerEndpoint: string
  providerMessage?: string
}

const BOSS_REWARD_STEP = parsePositiveNumber(process.env.NAPIWAS_BOSS_REWARD_STEP, 10)
const MUGS_PER_NAPIWAS = parsePositiveNumber(process.env.NAPIWAS_MUGS_PER_TOKEN, 1000)
const MIN_MUGS_FOR_CONVERSION = parsePositiveNumber(process.env.NAPIWAS_MIN_MUGS_CONVERSION, 1000)
const MIN_WITHDRAW_NAPIWAS = 0.001
const PAYOUT_ASSET = (process.env.ICRYPTOCHECK_ASSET || 'NAPIWAS').trim()
const PAYOUT_NETWORK = (process.env.ICRYPTOCHECK_NETWORK || 'TON').trim().toUpperCase()
const ICRYPTOCHECK_API_BASE_URL = (process.env.ICRYPTOCHECK_API_BASE_URL || 'https://api.icryptocheck.com/api/v1').trim()
const API_KEY = (process.env.ICRYPTOCHECK_API_KEY || '').trim()

function parsePositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return parsed
}

function parseOptionalPositiveNumber(value: unknown) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function normalizeWalletAddress(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function normalizeRecipientAddress(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function isLikelyTonAddress(value: string) {
  const candidate = value.trim()
  if (!candidate) return false
  if (candidate.length < 30 || candidate.length > 128) return false
  return /^[A-Za-z0-9_-]+$/.test(candidate)
}

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10)
}

function getSupabaseServerClientOrNull(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim()
  if (!url || !key) return null
  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function isMissingTableError(message: string) {
  const text = message.toLowerCase()
  return text.includes('does not exist') || text.includes('relation') || text.includes('42p01')
}

async function ensureRewardWallet(supabase: SupabaseClient, walletAddress: string): Promise<RewardWalletRow> {
  const { data: existing, error: existingError } = await supabase
    .from('reward_wallets')
    .select('wallet_address,pending_napiwas,total_earned_napiwas,total_withdrawn_napiwas')
    .eq('wallet_address', walletAddress)
    .maybeSingle()
  if (existingError) throw new Error(existingError.message)
  if (existing) return existing as RewardWalletRow

  const { data: inserted, error: insertError } = await supabase
    .from('reward_wallets')
    .insert({
      wallet_address: walletAddress,
      pending_napiwas: 0,
      total_earned_napiwas: 0,
      total_withdrawn_napiwas: 0,
    })
    .select('wallet_address,pending_napiwas,total_earned_napiwas,total_withdrawn_napiwas')
    .single()
  if (insertError) throw new Error(insertError.message)
  return inserted as RewardWalletRow
}

async function updateRewardWallet(
  supabase: SupabaseClient,
  walletAddress: string,
  deltaPending: number,
  deltaEarned: number,
  deltaWithdrawn: number
) {
  const wallet = await ensureRewardWallet(supabase, walletAddress)
  const pending = Math.max(0, Number(wallet.pending_napiwas || 0) + deltaPending)
  const earned = Math.max(0, Number(wallet.total_earned_napiwas || 0) + deltaEarned)
  const withdrawn = Math.max(0, Number(wallet.total_withdrawn_napiwas || 0) + deltaWithdrawn)

  const { data: updated, error } = await supabase
    .from('reward_wallets')
    .update({
      pending_napiwas: pending,
      total_earned_napiwas: earned,
      total_withdrawn_napiwas: withdrawn,
      updated_at: new Date().toISOString(),
    })
    .eq('wallet_address', walletAddress)
    .select('wallet_address,pending_napiwas,total_earned_napiwas,total_withdrawn_napiwas')
    .single()
  if (error) throw new Error(error.message)
  return updated as RewardWalletRow
}

async function getSummary(supabase: SupabaseClient, walletAddress: string) {
  const wallet = await ensureRewardWallet(supabase, walletAddress)
  const today = getTodayDateString()

  const { data: dailyRows, error: dailyError } = await supabase
    .from('daily_boss_rewards')
    .select('boss_level,reward_napiwas')
    .eq('wallet_address', walletAddress)
    .eq('reward_date', today)
    .order('boss_level', { ascending: true })
  if (dailyError) throw new Error(dailyError.message)

  const rows = (dailyRows || []) as DailyBossRewardRow[]
  const earnedToday = rows.reduce((acc, row) => acc + Number(row.reward_napiwas || 0), 0)
  const maxBossRewardedToday = rows.reduce((acc, row) => Math.max(acc, Number(row.boss_level || 0)), 0)

  return {
    walletAddress,
    pendingNapiwas: Number(wallet.pending_napiwas || 0),
    totalEarnedNapiwas: Number(wallet.total_earned_napiwas || 0),
    totalWithdrawnNapiwas: Number(wallet.total_withdrawn_napiwas || 0),
    earnedToday,
    maxBossRewardedToday,
    conversion: {
      mugsPerNapiwas: MUGS_PER_NAPIWAS,
      minMugsForConversion: MIN_MUGS_FOR_CONVERSION,
    },
    withdraw: {
      minNapiwas: MIN_WITHDRAW_NAPIWAS,
    },
  }
}

async function awardBossProgress(supabase: SupabaseClient, walletAddress: string, bossLevel: number) {
  const safeLevel = Math.max(1, Math.min(500, Math.floor(bossLevel)))
  const today = getTodayDateString()

  const { data: existingRows, error: existingError } = await supabase
    .from('daily_boss_rewards')
    .select('boss_level')
    .eq('wallet_address', walletAddress)
    .eq('reward_date', today)
    .lte('boss_level', safeLevel)
  if (existingError) throw new Error(existingError.message)

  const existingLevels = new Set((existingRows || []).map((row) => Number((row as { boss_level?: number }).boss_level || 0)))
  const missingRows = Array.from({ length: safeLevel }, (_, i) => i + 1)
    .filter((level) => !existingLevels.has(level))
    .map((level) => ({
      wallet_address: walletAddress,
      reward_date: today,
      boss_level: level,
      reward_napiwas: level * BOSS_REWARD_STEP,
    }))

  let awarded = 0
  if (missingRows.length > 0) {
    const { data: insertedRows, error: insertError } = await supabase
      .from('daily_boss_rewards')
      .insert(missingRows)
      .select('reward_napiwas')
    if (insertError) throw new Error(insertError.message)
    awarded = Math.max(
      0,
      (insertedRows || []).reduce((acc, row) => acc + Number((row as { reward_napiwas?: number }).reward_napiwas || 0), 0)
    )
  }

  if (awarded > 0) {
    await updateRewardWallet(supabase, walletAddress, awarded, awarded, 0)
  } else {
    await ensureRewardWallet(supabase, walletAddress)
  }

  return { awarded, ...(await getSummary(supabase, walletAddress)) }
}

async function convertMugsToNapiwas(supabase: SupabaseClient, walletAddress: string, mugsRaw: unknown) {
  const mugs = Math.max(0, Math.floor(Number(mugsRaw || 0)))
  if (mugs < MIN_MUGS_FOR_CONVERSION) {
    return {
      success: false,
      error: `Need at least ${MIN_MUGS_FOR_CONVERSION} mugs for conversion`,
      spentMugs: 0,
      earnedNapiwas: 0,
      ...(await getSummary(supabase, walletAddress)),
    }
  }

  const earnedNapiwas = Math.floor(mugs / MUGS_PER_NAPIWAS)
  if (earnedNapiwas <= 0) {
    return {
      success: false,
      error: 'Conversion amount is too low',
      spentMugs: 0,
      earnedNapiwas: 0,
      ...(await getSummary(supabase, walletAddress)),
    }
  }

  const spentMugs = earnedNapiwas * MUGS_PER_NAPIWAS
  const { error: eventError } = await supabase.from('reward_conversions').insert({
    wallet_address: walletAddress,
    mugs_spent: spentMugs,
    napiwas_earned: earnedNapiwas,
  })
  if (eventError) throw new Error(eventError.message)

  await updateRewardWallet(supabase, walletAddress, earnedNapiwas, earnedNapiwas, 0)
  return {
    success: true,
    spentMugs,
    earnedNapiwas,
    ...(await getSummary(supabase, walletAddress)),
  }
}

function buildPayoutCandidateUrls() {
  const fromFull = process.env.ICRYPTOCHECK_CREATE_CHECK_URL?.trim() || null
  const configuredBase = ICRYPTOCHECK_API_BASE_URL.replace(/\/+$/, '')
  const fallbackIcryptoBase = 'https://api.icryptocheck.com/api/v1'
  const safeBase = configuredBase.toLowerCase().includes('crypt.bot') ? fallbackIcryptoBase : configuredBase
  const urls = [
    fromFull,
    `${safeBase}/app/withdrawal`,
    `${fallbackIcryptoBase}/app/withdrawal`,
    'https://pay.crypt.bot/api/createCheck',
  ].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  )
  return Array.from(new Set(urls))
}

function tryExtractCheckPayload(payload: unknown) {
  const root = payload as Record<string, unknown> | null
  const result = (root?.result as Record<string, unknown> | undefined) ?? (root?.data as Record<string, unknown> | undefined) ?? root
  if (!result || typeof result !== 'object') return null

  const checkUrlCandidate =
    result.bot_check_url ??
    result.check_url ??
    result.url ??
    result.link ??
    result.pay_url ??
    result.invoice_url
  const checkIdCandidate = result.check_id ?? result.id ?? result.uuid
  if (typeof checkUrlCandidate !== 'string' || !checkUrlCandidate.trim()) return null

  return {
    checkId: typeof checkIdCandidate === 'string' || typeof checkIdCandidate === 'number' ? String(checkIdCandidate) : null,
    checkUrl: checkUrlCandidate.trim(),
  }
}

function parseProviderError(payload: unknown, fallbackStatus: number) {
  const raw = payload as Record<string, unknown> | null
  const message = typeof raw?.message === 'string' ? raw.message : null
  const description = typeof raw?.description === 'string' ? raw.description : null
  const errorString = typeof raw?.error === 'string' ? raw.error : null
  const errorObject =
    raw?.error && typeof raw.error === 'object'
      ? (raw.error as { name?: unknown; description?: unknown; code?: unknown })
      : null
  const details = Array.isArray(raw?.errors)
    ? (raw.errors as Array<{ property?: unknown; error?: unknown }>)
        .map((entry) => {
          const property = typeof entry?.property === 'string' ? entry.property : ''
          const err = typeof entry?.error === 'string' ? entry.error : ''
          return [property, err].filter(Boolean).join(': ')
        })
        .filter(Boolean)
    : []

  const candidates = [
    message,
    description,
    errorString,
    errorObject
      ? [errorObject.name, errorObject.description, errorObject.code]
          .map((value) => (typeof value === 'string' || typeof value === 'number' ? String(value) : ''))
          .filter(Boolean)
          .join(' ')
      : '',
    details.join('; '),
  ]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)

  return candidates[0] || `HTTP ${fallbackStatus}`
}

function isInsufficientTonFeeError(messageRaw: string) {
  return /insufficient\s+ton\s+balance\s+for\s+withdrawal\s+fee/i.test(messageRaw)
}

function stripAttemptsSuffix(messageRaw: string) {
  return String(messageRaw || '').replace(/;\s*attempts:\s*.+$/i, '').trim()
}

function formatPayoutError(messageRaw: string) {
  const normalized = stripAttemptsSuffix(messageRaw)
    .replace(/^Payout API error:\s*/i, '')
    .trim()

  if (isInsufficientTonFeeError(normalized)) {
    return 'Payout API error: Insufficient TON balance for withdrawal fee. Top up TON on iCryptoCheck app balance and retry.'
  }

  if (!normalized) return 'Payout API error: Unknown provider error'
  return `Payout API error: ${normalized}`
}

function isWithdrawalFinalStatus(statusRaw: unknown) {
  const status = typeof statusRaw === 'string' ? statusRaw.trim().toUpperCase() : ''
  if (!status) return false
  return ['SUCCESS', 'COMPLETED', 'DONE', 'PAID', 'CONFIRMED', 'SENT'].includes(status)
}

function normalizeUrlString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function extractIcryptoWithdrawalPayload(payload: unknown) {
  const root = payload as Record<string, unknown> | null
  const success = typeof root?.success === 'boolean' ? root.success : true
  if (!success) return null
  const data = (root?.data as Record<string, unknown> | undefined) ?? (root?.result as Record<string, unknown> | undefined) ?? root
  if (!data || typeof data !== 'object') return null

  const withdrawalId =
    typeof data.withdrawalId === 'string'
      ? data.withdrawalId
      : typeof data.id === 'string' || typeof data.id === 'number'
        ? String(data.id)
        : null

  const txLink = normalizeUrlString(data.txLink) ?? normalizeUrlString(data.explorerUrl) ?? normalizeUrlString(data.url)
  const txHash = normalizeUrlString(data.txHash) ?? normalizeUrlString(data.hash)
  const status = typeof data.status === 'string' ? data.status : ''

  return {
    withdrawalId,
    txLink,
    txHash,
    status,
    message: typeof root?.message === 'string' ? root.message : null,
  }
}

async function createExternalPayoutCheck(amount: number, walletAddress: string, recipientAddress: string): Promise<PayoutResult> {
  if (!API_KEY) throw new Error('ICRYPTOCHECK_API_KEY is not configured')

  let lastError = 'Payout endpoint is unavailable'
  const attempts: string[] = []
  const seenAttempts = new Set<string>()
  const addAttempt = (endpoint: string, reasonRaw: string) => {
    const reason = String(reasonRaw || '')
      .replace(/^Payout API error:\s*/i, '')
      .trim()
    const entry = `[${endpoint}] ${reason || 'Unknown payout network error'}`
    if (seenAttempts.has(entry)) return
    seenAttempts.add(entry)
    attempts.push(entry)
  }

  for (const endpoint of buildPayoutCandidateUrls()) {
    try {
      const isCryptBotEndpoint = endpoint.toLowerCase().includes('crypt.bot')
      if (isCryptBotEndpoint) {
        const payload = {
          asset: PAYOUT_ASSET,
          amount: Number(amount.toFixed(8)).toString(),
          description: `NAPIWAS reward payout for ${walletAddress}`,
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'crypto-pay-api-token': API_KEY,
            'x-api-key': API_KEY,
            authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(payload),
        })

        const rawPayload = await response.json().catch(() => null)
        const extracted = tryExtractCheckPayload(rawPayload)
        const okFlag = typeof (rawPayload as { ok?: unknown } | null)?.ok === 'boolean' ? Boolean((rawPayload as { ok?: boolean }).ok) : true
        const successFlag =
          typeof (rawPayload as { success?: unknown } | null)?.success === 'boolean'
            ? Boolean((rawPayload as { success?: boolean }).success)
            : true

        if (response.ok && okFlag && successFlag && extracted) {
          return {
            payoutStatus: 'completed',
            checkId: extracted.checkId,
            checkUrl: extracted.checkUrl,
            providerRaw: rawPayload,
            providerEndpoint: endpoint,
          }
        }

        const reason = parseProviderError(rawPayload, response.status)
        addAttempt(endpoint, reason)
        lastError = formatPayoutError(reason)
        continue
      }

      const withdrawalId = `napiwas-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      const payload = {
        network: PAYOUT_NETWORK,
        address: recipientAddress,
        currency: PAYOUT_ASSET,
        amount: Number(amount.toFixed(8)),
        withdrawalId,
        comment: `NAPIWAS reward payout for ${walletAddress}`,
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'iCryptoCheck-Key': API_KEY,
          'iCriptoCheck-Key': API_KEY,
          'x-api-key': API_KEY,
          authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(payload),
      })

      const rawPayload = await response.json().catch(() => null)
      const extracted = extractIcryptoWithdrawalPayload(rawPayload)
      if (!response.ok || !extracted) {
        const reason = parseProviderError(rawPayload, response.status)
        const isAuthError = /unauthorized|401/i.test(reason)
        if (!isAuthError) {
          throw new Error(formatPayoutError(reason))
        }
        addAttempt(endpoint, reason)
        lastError = formatPayoutError(reason)
        continue
      }

      const immediateCompleted = isWithdrawalFinalStatus(extracted.status) || Boolean(extracted.txHash || extracted.txLink)
      if (immediateCompleted) {
        return {
          payoutStatus: 'completed',
          checkId: extracted.withdrawalId,
          checkUrl: extracted.txLink,
          providerRaw: rawPayload,
          providerEndpoint: endpoint,
          providerMessage: extracted.message || undefined,
        }
      }

      const statusBase = endpoint.replace(/\/+$/, '').replace(/\/app\/withdrawal$/i, '').replace(/\/withdrawal$/i, '')
      const statusEndpoint = `${statusBase}/app/withdrawal/status/${encodeURIComponent(extracted.withdrawalId || withdrawalId)}`
      const statusResponse = await fetch(statusEndpoint, {
        method: 'GET',
        headers: {
          'iCryptoCheck-Key': API_KEY,
          'iCriptoCheck-Key': API_KEY,
          'x-api-key': API_KEY,
          authorization: `Bearer ${API_KEY}`,
        },
      })

      const statusPayload = await statusResponse.json().catch(() => null)
      const extractedStatus = extractIcryptoWithdrawalPayload(statusPayload)
      const finalCompleted =
        statusResponse.ok &&
        extractedStatus &&
        (isWithdrawalFinalStatus(extractedStatus.status) || Boolean(extractedStatus.txHash || extractedStatus.txLink))

      if (finalCompleted) {
        return {
          payoutStatus: 'completed',
          checkId: extractedStatus.withdrawalId || extracted.withdrawalId,
          checkUrl: extractedStatus.txLink || extracted.txLink,
          providerRaw: { initial: rawPayload, status: statusPayload },
          providerEndpoint: `${endpoint} -> ${statusEndpoint}`,
          providerMessage: extractedStatus.message || extracted.message || undefined,
        }
      }

      return {
        payoutStatus: 'processing',
        checkId: extractedStatus?.withdrawalId || extracted.withdrawalId,
        checkUrl: extractedStatus?.txLink || extracted.txLink,
        providerRaw: { initial: rawPayload, status: statusPayload },
        providerEndpoint: `${endpoint} -> ${statusEndpoint}`,
        providerMessage: extractedStatus?.message || extracted.message || 'Withdrawal is processing',
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown payout network error'
      addAttempt(endpoint, message)
      const formattedMessage = formatPayoutError(message)
      if (!/unauthorized|401/i.test(message)) {
        throw new Error(`${formattedMessage}; attempts: ${attempts.join(' | ')}`)
      }
      lastError = formattedMessage
    }
  }
  if (attempts.length > 0) {
    throw new Error(`${formatPayoutError(lastError)}; attempts: ${attempts.join(' | ')}`)
  }
  throw new Error(formatPayoutError(lastError))
}

type PayoutInsertInput = {
  walletAddress: string
  amountNapiwas: number
  status: string
  providerCheckId: string | null
  providerCheckUrl: string | null
  providerEndpoint: string
  providerPayload: Record<string, unknown>
  recipientAddress: string
  payoutMode: 'provider_check' | 'manual_queue'
}

async function insertPayoutRecord(supabase: SupabaseClient, input: PayoutInsertInput) {
  const fullRow = {
    wallet_address: input.walletAddress,
    amount_napiwas: input.amountNapiwas,
    status: input.status,
    provider_check_id: input.providerCheckId,
    provider_check_url: input.providerCheckUrl,
    provider_endpoint: input.providerEndpoint,
    provider_payload: input.providerPayload,
    recipient_address: input.recipientAddress,
    payout_mode: input.payoutMode,
  }

  const { error } = await supabase.from('reward_payouts').insert(fullRow)
  if (!error) return

  const message = error.message.toLowerCase()
  const missingRecipientColumn = message.includes('recipient_address')
  const missingModeColumn = message.includes('payout_mode')
  const columnMismatch = message.includes('column') && (missingRecipientColumn || missingModeColumn)
  if (!columnMismatch) throw new Error(error.message)

  const fallbackRow = {
    wallet_address: input.walletAddress,
    amount_napiwas: input.amountNapiwas,
    status: input.status,
    provider_check_id: input.providerCheckId,
    provider_check_url: input.providerCheckUrl,
    provider_endpoint: input.providerEndpoint,
    provider_payload: {
      ...input.providerPayload,
      recipient_address: input.recipientAddress,
      payout_mode: input.payoutMode,
    },
  }
  const retry = await supabase.from('reward_payouts').insert(fallbackRow)
  if (retry.error) throw new Error(retry.error.message)
}

async function withdrawNapiwas(
  supabase: SupabaseClient,
  walletAddress: string,
  amountRaw: unknown,
  recipientRaw: unknown,
  mugsRaw: unknown
) {
  await ensureRewardWallet(supabase, walletAddress)
  const mugsBalance = Math.max(0, Math.floor(Number(mugsRaw || 0)))
  const maxAvailableByMugs = mugsBalance / MUGS_PER_NAPIWAS
  const requested = parseOptionalPositiveNumber(amountRaw)
  const amount = requested ? requested : maxAvailableByMugs
  const recipientAddress = normalizeRecipientAddress(recipientRaw) || walletAddress

  if (!isLikelyTonAddress(recipientAddress)) {
    return {
      success: false,
      error: 'Recipient TON address is invalid',
      ...(await getSummary(supabase, walletAddress)),
    }
  }

  if (amount < MIN_WITHDRAW_NAPIWAS) {
    return {
      success: false,
      error: `Minimum withdraw is ${MIN_WITHDRAW_NAPIWAS} ${PAYOUT_ASSET}`,
      ...(await getSummary(supabase, walletAddress)),
    }
  }

  if (amount > maxAvailableByMugs + Number.EPSILON) {
    return {
      success: false,
      error: `Not enough beer mugs. Required: ${Math.ceil(amount * MUGS_PER_NAPIWAS)} mugs`,
      ...(await getSummary(supabase, walletAddress)),
    }
  }

  const deductMugs = Math.ceil(amount * MUGS_PER_NAPIWAS)
  if (deductMugs > mugsBalance) {
    return {
      success: false,
      error: `Not enough beer mugs. Required: ${deductMugs} mugs`,
      ...(await getSummary(supabase, walletAddress)),
    }
  }

  try {
    const payout = await createExternalPayoutCheck(amount, walletAddress, recipientAddress)

    if (payout.payoutStatus !== 'completed') {
      await insertPayoutRecord(supabase, {
        walletAddress,
        amountNapiwas: amount,
        status: 'processing',
        providerCheckId: payout.checkId,
        providerCheckUrl: payout.checkUrl,
        providerEndpoint: payout.providerEndpoint,
        providerPayload: {
          payout_provider_response: payout.providerRaw as Record<string, unknown>,
          payout_message: payout.providerMessage || null,
        },
        recipientAddress,
        payoutMode: 'provider_check',
      })

      return {
        success: true,
        paidAmount: 0,
        deductMugs,
        checkId: payout.checkId,
        checkUrl: payout.checkUrl,
        recipientAddress,
        payoutStatus: 'processing',
        payoutMessage: payout.providerMessage || 'Withdrawal created and is processing',
        ...(await getSummary(supabase, walletAddress)),
      }
    }

    await insertPayoutRecord(supabase, {
      walletAddress,
      amountNapiwas: amount,
      status: 'completed',
      providerCheckId: payout.checkId,
      providerCheckUrl: payout.checkUrl,
      providerEndpoint: payout.providerEndpoint,
      providerPayload: {
        payout_provider_response: payout.providerRaw as Record<string, unknown>,
      },
      recipientAddress,
      payoutMode: 'provider_check',
    })

    await updateRewardWallet(supabase, walletAddress, 0, 0, amount)
    return {
      success: true,
      paidAmount: amount,
      deductMugs,
      checkId: payout.checkId,
      checkUrl: payout.checkUrl,
      recipientAddress,
      payoutStatus: 'completed',
      payoutMessage: payout.providerMessage || null,
      ...(await getSummary(supabase, walletAddress)),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown payout error'
    const clientErrorMessage = formatPayoutError(errorMessage)

    await insertPayoutRecord(supabase, {
      walletAddress,
      amountNapiwas: amount,
      status: 'failed',
      providerCheckId: null,
      providerCheckUrl: null,
      providerEndpoint: 'provider-failed',
      providerPayload: { error: errorMessage, client_error: clientErrorMessage },
      recipientAddress,
      payoutMode: 'provider_check',
    })

    return {
      success: false,
      paidAmount: 0,
      deductMugs: 0,
      checkId: null,
      checkUrl: null,
      recipientAddress,
      payoutStatus: 'failed',
      error: clientErrorMessage,
      ...(await getSummary(supabase, walletAddress)),
    }
  }
}

export async function GET(request: NextRequest) {
  const walletAddress = normalizeWalletAddress(request.nextUrl.searchParams.get('wallet'))
  if (!walletAddress) {
    return NextResponse.json({ error: 'wallet is required' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServerClientOrNull()
    if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
    const summary = await getSummary(supabase, walletAddress)
    return NextResponse.json({ success: true, ...summary, source: 'supabase' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected rewards error'
    const status = isMissingTableError(message) ? 428 : 500
    return NextResponse.json(
      { error: status === 428 ? 'Rewards tables are not initialized. Run scripts/005-rewards-payouts.sql in Supabase.' : message },
      { status }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    const action = typeof body?.action === 'string' ? body.action.trim() : ''
    const walletAddress = normalizeWalletAddress(body?.wallet_address)

    if (!walletAddress) {
      return NextResponse.json({ error: 'wallet_address is required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClientOrNull()
    if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })

    if (action === 'award_boss') {
      const bossLevel = Math.max(1, Math.floor(Number(body?.boss_level || 1)))
      const result = await awardBossProgress(supabase, walletAddress, bossLevel)
      return NextResponse.json({ success: true, ...result, source: 'supabase' })
    }

    if (action === 'convert_balance') {
      const result = await convertMugsToNapiwas(supabase, walletAddress, body?.mugs)
      return NextResponse.json({ ...result, source: 'supabase' }, { status: result.success ? 200 : 400 })
    }

    if (action === 'withdraw') {
      const result = await withdrawNapiwas(supabase, walletAddress, body?.amount_napiwas, body?.recipient_address, body?.mugs_balance)
      return NextResponse.json({ ...result, source: 'supabase' }, { status: result.success ? 200 : 400 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected rewards error'
    const status = isMissingTableError(message) ? 428 : 500
    return NextResponse.json(
      { error: status === 428 ? 'Rewards tables are not initialized. Run scripts/005-rewards-payouts.sql in Supabase.' : message },
      { status }
    )
  }
}

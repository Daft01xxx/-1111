# Rewards API (NAPIWAS)

## What is implemented

- Daily boss rewards:
  - Boss 1 = `10` NAPIWAS
  - Boss 2 = `20` NAPIWAS
  - Boss 3 = `30` NAPIWAS
  - ... (`boss_level * NAPIWAS_BOSS_REWARD_STEP`)
- Conversion from beer mugs to NAPIWAS.
- Withdraw flow through external payout API (`icriptoceck` / CryptoBot-style check API).

## Endpoints

### `GET /api/rewards?wallet=<WALLET>`
Returns current reward summary:

- `pendingNapiwas`
- `totalEarnedNapiwas`
- `totalWithdrawnNapiwas`
- `earnedToday`
- `maxBossRewardedToday`
- conversion/withdraw config

### `POST /api/rewards`

`action: "award_boss"`
```json
{
  "action": "award_boss",
  "wallet_address": "UQ...",
  "boss_level": 2
}
```

`action: "convert_balance"`
```json
{
  "action": "convert_balance",
  "wallet_address": "UQ...",
  "mugs": 100000
}
```

`action: "withdraw"`
```json
{
  "action": "withdraw",
  "wallet_address": "UQ...",
  "amount_napiwas": 150000
}
```

If `amount_napiwas` is not provided, withdraw uses full pending balance.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended for server writes)
- `ICRYPTOCHECK_API_KEY`
- `ICRYPTOCHECK_CREATE_CHECK_URL` (optional explicit endpoint)
- `ICRYPTOCHECK_API_BASE_URL` (optional; default `https://pay.crypt.bot/api`)
- `ICRYPTOCHECK_ASSET` (default `NAPIWAS`)
- `NAPIWAS_BOSS_REWARD_STEP` (default `10`)
- `NAPIWAS_MUGS_PER_TOKEN` (default `1000`)
- `NAPIWAS_MIN_MUGS_CONVERSION` (default `100000`)
- `NAPIWAS_MIN_WITHDRAW` (default `100`)

## Required DB setup

Run SQL script in Supabase:

- `scripts/005-rewards-payouts.sql`

If Supabase is not configured, the API falls back to in-memory storage mode for local/dev checks.

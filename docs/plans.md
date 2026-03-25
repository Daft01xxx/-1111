# Mobile Premium UI Pass

## Scope
- Rework the phone-first shell so gameplay, controls, and navigation fit on one screen with minimal scrolling.
- Compress non-play panels (`Inventory`, `Wallet`, `Token`) into compact mobile surfaces.
- Improve the in-game arena backdrop and control arrangement without changing core combat rules.
- Revalidate mobile UX on short and tall phone viewports, then publish to Vercel.

## Invariants
- The battle loop, wallet flow, inventory flow, and bottom navigation must remain functional.
- No body scrolling on supported mobile viewports.
- The play screen must keep the arena as the dominant visual region.
- The fix should stay CSS-first unless a JS change is required for a visual/runtime defect.

## Milestones

### [x] M1. Mobile shell compression
- Goal: Remove wasted vertical space from menu pages and reduce visual clutter.
- Tasks:
  - Compact `overlay-card-menu` headings and view-specific sections.
  - Make `Token Info` usable without long scrolling on 390px and 320px widths.
  - Keep close button fixed and unobtrusive.
- Done when:
  - `Inventory`, `Wallet`, and `Token` are readable on phone without oversized headers.
  - Relevant actions stay within their page and the bottom nav remains visible.
- Validation:
  - Manual mobile screenshots at `390x844` and `320x568`.
  - Browser snapshot check for overflow/body scroll.
- Stop-and-fix rule:
  - If any page needs body scrolling or clips its primary action row, stop and rework before moving on.

### [x] M2. Battle cockpit refinement
- Goal: Make the phone battle UI feel premium and spatially efficient.
- Tasks:
  - Collapse control surfaces into a compact single-row cockpit.
  - Keep joystick compact and preserve weapon/action access.
  - Avoid overlaying large HUD cards on the arena.
- Done when:
  - Arena remains dominant and the control strip no longer costs multiple stacked rows.
  - Buttons stay thumb-reachable and visually distinct.
- Validation:
  - Mobile play screenshot review at `390x844`, `375x667`, `320x568`.
  - Manual gameplay smoke via Playwright.
- Stop-and-fix rule:
  - If controls overlap the nav or occlude too much of the arena, stop and re-balance layout.

### [x] M3. Visual premium pass
- Goal: Improve the arena mood and panel polish without introducing lag.
- Tasks:
  - Tune backdrop treatment toward a cleaner premium sci-fi look.
  - Refine mobile button surfaces, motion, and chip styling.
  - Keep low-end mode safe.
- Done when:
  - Arena background reads intentional and premium.
  - Button states feel coherent across menu and battle.
- Validation:
  - Screenshot inspection plus console/no-error checks.
  - Node syntax checks for touched JS.
- Stop-and-fix rule:
  - If effects reduce readability or add runtime errors, revert/simplify the visual layer.

### [x] M4. Final validation and release
- Goal: Prove the mobile pass works end-to-end and publish it.
- Tasks:
  - Run targeted local syntax checks.
  - Run Playwright mobile smoke scenarios and inspect screenshots.
  - Update `progress.md`.
  - Deploy to Vercel production.
- Done when:
  - Validation artifacts are present.
  - Vercel production is updated and recorded.
- Validation:
  - `node --check game.js`
  - `node --check server.mjs`
  - `node --check api/coop.js`
  - Playwright mobile flows and screenshots
  - Vercel production deploy

### [x] M5. Quests + wallet page hardening
- Goal: Turn the new `Quests` and `Wallet` tabs into phone-ready product pages and remove the bottom-nav interception defect.
- Tasks:
  - Add the quest contracts page and wallet showcase layout to the shell.
  - Fix the real geometry bug where the menu card overlapped the bottom nav on phone widths.
  - Localize the new page chrome so RU mode does not leave mixed English labels in the main mobile surfaces.
- Done when:
  - `Quests`, `Wallet`, and `Play` all fit on a phone viewport without body scroll.
  - Bottom nav remains clickable while the menu is open.
  - Wallet hero card shows NAPIWAS balance prominently with beer mugs below it.
- Validation:
  - `node --check game.js`
  - `node --check server.mjs`
  - `node --check api/coop.js`
  - Playwright mobile clicks: `Inventory -> Quests -> Wallet -> Play`
  - `curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:8080/`
  - `develop-web-game` Playwright client run with screenshot/state artifacts
- Stop-and-fix rule:
  - If any bottom-nav tap is intercepted by menu content again, stop and fix the layout before shipping.

### [x] M6. Phone tab density cleanup
- Goal: Remove the remaining “everything sticks together” defects on phone tab pages without regressing play mode.
- Tasks:
  - Convert focused phone tabs from stretched `height: 100%` shells to content-height cards.
  - Shorten mobile RU CTA labels so buttons no longer clip or stack awkwardly.
  - Remove unrelated inventory settings/actions from the phone inventory page.
- Done when:
  - `Inventory / Quests / Wallet / Token` render as compact cards above the bottom nav.
  - Phone buttons no longer show visible text clipping.
  - No body scroll is introduced by the cleanup.
- Validation:
  - `node --check game.js`
  - Playwright `390x844` tab smoke with overflow probes
  - Screenshot review of inventory / quests / wallet / token phone states
  - `develop-web-game` Playwright client run with screenshot/state artifacts
- Stop-and-fix rule:
  - If a phone page regains the stretched blank lower panel or clipped CTA text, stop and fix before release.

### [x] M7. Live ops visibility + quests tap hardening
- Goal: Close the remaining product gaps in the live systems and fix the last mobile quest interaction defect.
- Tasks:
  - Render a live activity feed so the wallet page shows who entered and what they did, not only counters.
  - Add lightweight live polling on `Wallet / Quests / Shop` so analytics, challenges, leaderboard, and partners refresh without manual reload.
  - Fix the mobile `Quests` layout so contract claim buttons are not intercepted by the `Daily / PvP` cards.
- Done when:
  - Wallet shows recent player actions with timestamps.
  - Mobile quest reward buttons are tappable and complete their claim flow.
  - No new console errors or mobile overlap regressions are introduced.
- Validation:
  - `node --check game.js`
  - Playwright mobile flow: `Wallet -> verify activity feed -> Quests -> claim contract -> Wallet -> verify new activity entry`
  - Screenshot review of mobile wallet and quests states
- Stop-and-fix rule:
  - If phone quest actions are still intercepted by menu geometry, stop and fix before release.

## Risks
- Mobile CSS already has many overrides; broad edits can create a new overlap/regression elsewhere.
- The token page is the most likely view to reintroduce scrolling.
- Visual enhancements must not reintroduce mobile performance regressions.

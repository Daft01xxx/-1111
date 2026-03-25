# Test Plan

## Objective
Verify that the phone-first redesign improves usability without breaking battle flow, navigation, wallet/token/inventory access, or viewport fit.

## Critical scenarios
- Start a run on mobile and confirm the arena remains the primary surface.
- Open `Inventory`, `Wallet`, and `Token` from the bottom nav and confirm each page fits without oversized dead space.
- Open `Quests` from the bottom nav and confirm contract cards, reward chips, and claim states fit without clipping.
- Claim at least one quest contract on phone and confirm the tap is not intercepted by the upper quest cards.
- Confirm focused phone tabs collapse to content height instead of stretching to the bottom of the viewport with an empty slab.
- Verify close button placement and that bottom nav is not obstructed.
- Verify bottom-nav taps still work while the menu is open.
- Verify the wallet hero card shows the large NAPIWAS balance and the beer bank remains below the hero card.
- Verify the wallet page shows a recent live activity feed with timestamps and action labels.
- Confirm no body scrolling on key phone sizes.

## Target viewports
- `390x844`
- `375x667`
- `320x568`

## Validation ladder
1. Syntax
   - `node --check game.js`
   - `node --check server.mjs`
   - `node --check api/coop.js`
2. Mobile flow smoke
   - Start run
   - Open quests page
   - Claim a ready quest reward
   - Open wallet page
   - Verify the claim appears in the activity feed
   - Open token page
   - Open inventory page
   - Return to play from bottom nav
3. Screenshot review
   - Inspect battle, quests, and wallet screenshots for overlap, excess chrome, clipping, or wrapped bottom-nav tabs.
4. Release
   - Vercel production deployment and alias verification.

## Acceptance gates
- No console/runtime errors in smoke scenarios.
- No body scroll on tested phone sizes.
- No oversized mobile header blocks dominating non-play pages.
- Bottom navigation remains visible and usable.
- Bottom navigation remains a single row on phone widths.
- No visible button text clipping on phone tab pages.
- No forced empty lower panel on focused phone pages.
- No tap interception on ready quest reward buttons.
- Wallet activity feed renders at least one event row or the explicit empty state.
- Arena remains visually dominant during play.

## Known residual risks
- The CSS override surface is large, so desktop should still be spot-checked after mobile edits.
- Token info content may still need secondary trimming if 320px devices show clipped text after the redesign.
- Real TON wallet connection still needs manual human approval in-wallet during a live session; automated validation covers the client shell and state wiring, not wallet approval UX.

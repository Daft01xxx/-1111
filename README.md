# Napiwas game

Browser game project for `Napiwas game`.

## Stack

- Static `HTML + CSS + JavaScript`
- Local server: `server.mjs`
- Vercel deployment via `vercel.json`

## Project structure

- `index.html` - app shell and UI markup
- `game.js` - main game loop, gameplay systems, bosses, wallet, quests, PvP hooks
- `styles.css` - base styles
- `theme-final.css` - current main UI theme
- `mobile-hotfix.css` - legacy mobile fixes
- `mobile-final.css` - current mobile layout fixes
- `assets/` - images, audio, textures
- `api/` - serverless endpoints used by deployment/runtime
- `docs/` - project notes and status logs

## Local run

```powershell
pwsh ./start-localhost.ps1
```

Then open:

```text
http://127.0.0.1:8080
```

## Deploy

```powershell
 $env:VERCEL_TOKEN="your_vercel_token"
 pwsh ./deploy-vercel.ps1
```

## Notes for UI editing

If the goal is to edit interface/layout first, start with:

1. `index.html`
2. `theme-final.css`
3. `mobile-final.css`

Gameplay logic lives mainly in:

1. `game.js`

## GitHub import guidance

This repo is prepared to be pushed to GitHub.
After adding a remote:

```powershell
git remote add origin <YOUR_GITHUB_REPO_URL>
git add .
git commit -m "Initial import of Napiwas game"
git push -u origin main
```

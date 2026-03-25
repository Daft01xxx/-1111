const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true }) || canvas.getContext('2d');

const ui = {
  playButton: document.getElementById('play-button'),
  languageButton: document.getElementById('language-button'),
  soundButton: document.getElementById('sound-button'),
  walletConnectButton: document.getElementById('wallet-connect-button'),
  fullscreenButton: document.getElementById('fullscreen-button'),
  pauseButton: document.getElementById('pause-button'),
  pauseClose: document.getElementById('pause-close'),
  resumeButton: document.getElementById('resume-button'),
  retryButton: document.getElementById('retry-button'),
  menuStart: document.getElementById('menu-start'),
  menuClose: document.getElementById('menu-close'),
  menuLanguage: document.getElementById('menu-language'),
  menuDifficulty: document.getElementById('menu-difficulty'),
  menuGodMode: document.getElementById('menu-god-mode'),
  menuLoadout: document.getElementById('menu-loadout'),
  menuSkin: document.getElementById('menu-skin'),
  menuFinish: document.getElementById('menu-finish'),
  menuSound: document.getElementById('menu-sound'),
  menuFullscreen: document.getElementById('menu-fullscreen'),
  pauseHome: document.getElementById('pause-home'),
  gameoverClose: document.getElementById('gameover-close'),
  gameoverHome: document.getElementById('gameover-home'),
  questButton: document.getElementById('quest-button'),
  questCloseTop: document.getElementById('quest-close-top'),
  questClose: document.getElementById('quest-close'),
  difficultyButton: document.getElementById('difficulty-button'),
  bossTimerPill: document.getElementById('boss-timer-pill'),
  boostButton: document.getElementById('boost-button'),
  moveLeft: document.getElementById('move-left'),
  moveUp: document.getElementById('move-up'),
  moveRight: document.getElementById('move-right'),
  weaponButton: document.getElementById('weapon-button'),
  navPlay: document.getElementById('nav-play'),
  navInventory: document.getElementById('nav-inventory'),
  navQuest: document.getElementById('nav-quests'),
  navWallet: document.getElementById('nav-wallet'),
  navShop: document.getElementById('nav-shop'),
  navCoop: document.getElementById('nav-coop'),
  sliderTrack: document.getElementById('slider-track'),
  sliderFill: document.getElementById('slider-fill'),
  sliderKnob: document.getElementById('slider-knob'),
  sliderReadout: document.getElementById('slider-readout'),
  phoneShell: document.querySelector('.phone-shell'),
  controlsCard: document.querySelector('.controls-card'),
  arenaStage: document.getElementById('arena-stage'),
  arenaFrame: document.getElementById('arena-frame'),
  weaponDock: document.getElementById('weapon-dock'),
  scoreValue: document.getElementById('score-value'),
  metersValue: document.getElementById('meters-value'),
  metersRecordValue: document.getElementById('meters-record-value'),
  livesValue: document.getElementById('lives-value'),
  weaponValue: document.getElementById('weapon-value'),
  levelValue: document.getElementById('level-value'),
  bossName: document.getElementById('boss-name'),
  bossMode: document.getElementById('boss-mode'),
  bossProgressFill: document.getElementById('boss-progress-fill'),
  bossPodState: document.getElementById('boss-pod-state'),
  bossPodHp: document.getElementById('boss-pod-hp'),
  bossPodPattern: document.getElementById('boss-pod-pattern'),
  phaseChip: document.getElementById('phase-chip'),
  headerSubtitle: document.getElementById('header-subtitle'),
  activeBuffs: document.getElementById('active-buffs'),
  tempWeaponStatus: document.getElementById('temp-weapon-status'),
  runPhaseDetail: document.getElementById('run-phase-detail'),
  unlockedCount: document.getElementById('unlocked-count'),
  nextBossThreshold: document.getElementById('next-boss-threshold'),
  bossEtaValue: document.getElementById('boss-eta-value'),
  comboValue: document.getElementById('combo-value'),
  dangerValue: document.getElementById('danger-value'),
  threatCountValue: document.getElementById('threat-count-value'),
  dropScanValue: document.getElementById('drop-scan-value'),
  controlMode: document.getElementById('control-mode'),
  contextNote: document.getElementById('context-note'),
  combatFeed: document.getElementById('combat-feed'),
  menuCard: document.getElementById('menu-card'),
  menuBossPreview: document.getElementById('menu-boss-preview'),
  menuBossPattern: document.getElementById('menu-boss-pattern'),
  menuDifficultyNote: document.getElementById('menu-difficulty-note'),
  menuSkinPreview: document.getElementById('menu-skin-preview'),
  menuSoundValue: document.getElementById('menu-sound-value'),
  rewardCodex: document.getElementById('reward-codex'),
  menuArsenal: document.getElementById('menu-arsenal'),
  inventorySection: document.getElementById('inventory-section'),
  skinInventoryGrid: document.getElementById('skin-inventory-grid'),
  questsSection: document.getElementById('quests-section'),
  questsPanelTitle: document.getElementById('quests-panel-title'),
  questsClaimedLabel: document.getElementById('quests-claimed-label'),
  questsClaimedNote: document.getElementById('quests-claimed-note'),
  questsReadyLabel: document.getElementById('quests-ready-label'),
  questsReadyNote: document.getElementById('quests-ready-note'),
  questsPoolLabel: document.getElementById('quests-pool-label'),
  questsPoolNote: document.getElementById('quests-pool-note'),
  questBoardMeta: document.getElementById('quest-board-meta'),
  questsClaimedValue: document.getElementById('quests-claimed-value'),
  questsReadyValue: document.getElementById('quests-ready-value'),
  questsPoolValue: document.getElementById('quests-pool-value'),
  questBoard: document.getElementById('quest-board'),
  dailyPanelTitle: document.getElementById('daily-panel-title'),
  dailyStatus: document.getElementById('daily-status'),
  dailyStreakLabel: document.getElementById('daily-streak-label'),
  dailyStreakValue: document.getElementById('daily-streak-value'),
  dailyRewardLabel: document.getElementById('daily-reward-label'),
  dailyRewardValue: document.getElementById('daily-reward-value'),
  dailyLastLabel: document.getElementById('daily-last-label'),
  dailyLastClaim: document.getElementById('daily-last-claim'),
  dailyClaimButton: document.getElementById('daily-claim-button'),
  dailyDexLink: document.getElementById('daily-dex-link'),
  dailyGeckoLink: document.getElementById('daily-gecko-link'),
  dailyBuyLink: document.getElementById('daily-buy-link'),
  challengePanelTitle: document.getElementById('challenge-panel-title'),
  challengeStatus: document.getElementById('challenge-status'),
  createScoreChallenge: document.getElementById('create-score-challenge'),
  createBossChallenge: document.getElementById('create-boss-challenge'),
  challengeActiveNote: document.getElementById('challenge-active-note'),
  challengeList: document.getElementById('challenge-list'),
  walletSection: document.getElementById('wallet-section'),
  shopSection: document.getElementById('shop-section'),
  shopSkinGrid: document.getElementById('shop-skin-grid'),
  shopBalanceMeta: document.getElementById('shop-balance-meta'),
  walletPanelTitle: document.getElementById('wallet-panel-title'),
  walletStatus: document.getElementById('wallet-status'),
  walletBalanceKicker: document.getElementById('wallet-balance-kicker'),
  walletTokenBalance: document.getElementById('wallet-token-balance'),
  walletBeerLabel: document.getElementById('wallet-beer-label'),
  walletBeerBalance: document.getElementById('wallet-beer-balance'),
  walletAddress: document.getElementById('wallet-address'),
  walletAccessLabel: document.getElementById('wallet-access-label'),
  walletAccessState: document.getElementById('wallet-access-state'),
  walletHolderState: document.getElementById('wallet-holder-state'),
  walletAccessCopy: document.getElementById('wallet-access-copy'),
  walletNeedLabel: document.getElementById('wallet-need-label'),
  walletAccessGap: document.getElementById('wallet-access-gap'),
  walletStoryBeer: document.getElementById('wallet-story-beer'),
  walletSyncNote: document.getElementById('wallet-sync-note'),
  walletCopyAddress: document.getElementById('wallet-copy-address'),
  buyTokenLink: document.getElementById('buy-token-link'),
  walletHolderRouteLabel: document.getElementById('wallet-holder-route-label'),
  walletMugBankLabel: document.getElementById('wallet-mug-bank-label'),
  walletRealtimeLabel: document.getElementById('wallet-realtime-label'),
  walletHolderProgressRing: document.getElementById('wallet-holder-progress-ring'),
  walletHolderProgressValue: document.getElementById('wallet-holder-progress-value'),
  walletHolderProgressNote: document.getElementById('wallet-holder-progress-note'),
  walletBonusTitle: document.getElementById('wallet-bonus-title'),
  walletBonusMeta: document.getElementById('wallet-bonus-meta'),
  walletBonusTierLabel: document.getElementById('wallet-bonus-tier-label'),
  walletBonusTier: document.getElementById('wallet-bonus-tier'),
  walletBossBonusLabel: document.getElementById('wallet-boss-bonus-label'),
  walletBossBonus: document.getElementById('wallet-boss-bonus'),
  walletScoreBonusLabel: document.getElementById('wallet-score-bonus-label'),
  walletScoreBonus: document.getElementById('wallet-score-bonus'),
  leaderboardTitle: document.getElementById('leaderboard-title'),
  leaderboardMeta: document.getElementById('leaderboard-meta'),
  leaderboardList: document.getElementById('leaderboard-list'),
  livePanelTitle: document.getElementById('live-panel-title'),
  livePanelMeta: document.getElementById('live-panel-meta'),
  liveOnlineLabel: document.getElementById('live-online-label'),
  liveOnlineValue: document.getElementById('live-online-value'),
  liveRunsLabel: document.getElementById('live-runs-label'),
  liveRunsValue: document.getElementById('live-runs-value'),
  liveBossKillsLabel: document.getElementById('live-boss-kills-label'),
  liveBossKillsValue: document.getElementById('live-boss-kills-value'),
  liveWalletLinksLabel: document.getElementById('live-wallet-links-label'),
  liveWalletLinksValue: document.getElementById('live-wallet-links-value'),
  liveActivityTitle: document.getElementById('live-activity-title'),
  liveActivityMeta: document.getElementById('live-activity-meta'),
  liveActivityList: document.getElementById('live-activity-list'),
  partnerPanelTitle: document.getElementById('partner-panel-title'),
  partnerPanelMeta: document.getElementById('partner-panel-meta'),
  partnerGrid: document.getElementById('partner-grid'),
  walletConnectMenu: document.getElementById('wallet-connect-menu'),
  walletDisconnectMenu: document.getElementById('wallet-disconnect-menu'),
  walletRefresh: document.getElementById('wallet-refresh'),
  menuWalletConnect: document.getElementById('menu-wallet-connect'),
  musicPanelTitle: document.getElementById('music-panel-title'),
  musicPanelMeta: document.getElementById('music-panel-meta'),
  musicTrackList: document.getElementById('music-track-list'),
  musicAdminTitle: document.getElementById('music-admin-title'),
  musicAdminMeta: document.getElementById('music-admin-meta'),
  adminTrackName: document.getElementById('admin-track-name'),
  adminTrackUrl: document.getElementById('admin-track-url'),
  adminAddTrack: document.getElementById('admin-add-track'),
  adminPartnerName: document.getElementById('admin-partner-name'),
  adminPartnerUrl: document.getElementById('admin-partner-url'),
  adminAddPartner: document.getElementById('admin-add-partner'),
  tokenInfoSection: document.getElementById('token-info-section'),
  tokenCaText: document.getElementById('token-ca-text'),
  tokenCopyCa: document.getElementById('token-copy-ca'),
  tokenWalletAction: document.getElementById('token-wallet-action'),
  tokenAccessValue: document.getElementById('token-access-value'),
  tokenBeerBankValue: document.getElementById('token-beer-bank-value'),
  tokenWalletStateValue: document.getElementById('token-wallet-state-value'),
  tokenWalletDetail: document.getElementById('token-wallet-detail'),
  tokenHolderProgressRing: document.getElementById('token-holder-progress-ring'),
  tokenHolderProgressValue: document.getElementById('token-holder-progress-value'),
  tokenHolderProgressNote: document.getElementById('token-holder-progress-note'),
  tokenStoryTabs: document.getElementById('token-story-tabs'),
  tokenStoryPanels: document.getElementById('token-story-panels'),
  coopSection: document.getElementById('coop-section'),
  coopFindTab: document.getElementById('coop-find-tab'),
  coopHostTab: document.getElementById('coop-host-tab'),
  coopFindPanel: document.getElementById('coop-find-panel'),
  coopHostPanel: document.getElementById('coop-host-panel'),
  coopLobbyList: document.getElementById('coop-lobby-list'),
  coopEmptyState: document.getElementById('coop-empty-state'),
  hostCreateButton: document.getElementById('host-create-button'),
  hostStatus: document.getElementById('host-status'),
  bossRoster: document.getElementById('boss-roster'),
  arenaDistanceChip: document.getElementById('arena-distance-chip'),
  arenaChipSkill: document.getElementById('arena-chip-skill'),
  arenaChipWeapon: document.getElementById('arena-chip-weapon'),
  playerHealthText: document.getElementById('player-health-text'),
  playerHealthFill: document.getElementById('player-health-fill'),
  topHealthFill: document.getElementById('top-health-fill'),
  topHealthValue: document.getElementById('top-health-value'),
  beerBalanceValue: document.getElementById('beer-balance-value'),
  weaponIcon: document.getElementById('weapon-icon'),
  weaponHudName: document.getElementById('weapon-hud-name'),
  bossPodTimer: document.getElementById('boss-pod-timer'),
  menuOverlay: document.getElementById('menu-overlay'),
  pauseOverlay: document.getElementById('pause-overlay'),
  questOverlay: document.getElementById('quest-overlay'),
  gameoverOverlay: document.getElementById('gameover-overlay'),
  highScoreValue: document.getElementById('high-score-value'),
  menuDifficultyValue: document.getElementById('menu-difficulty-value'),
  godModeValue: document.getElementById('god-mode-value'),
  shipSkinValue: document.getElementById('ship-skin-value'),
  weaponFinishValue: document.getElementById('weapon-finish-value'),
  hangarWeaponValue: document.getElementById('hangar-weapon-value'),
  hangarFinishValue: document.getElementById('hangar-finish-value'),
  inventoryHeroSkin: document.getElementById('inventory-hero-skin'),
  inventoryHeroWeapon: document.getElementById('inventory-hero-weapon'),
  inventoryHeroFinish: document.getElementById('inventory-hero-finish'),
  metaRunsValue: document.getElementById('meta-runs-value'),
  metaBossesValue: document.getElementById('meta-bosses-value'),
  metaTargetsValue: document.getElementById('meta-targets-value'),
  metaComboValue: document.getElementById('meta-combo-value'),
  metaMetersValue: document.getElementById('meta-meters-value'),
  briefWeaponName: document.getElementById('brief-weapon-name'),
  briefWeaponDetail: document.getElementById('brief-weapon-detail'),
  briefWeaponNote: document.getElementById('brief-weapon-note'),
  briefBossName: document.getElementById('brief-boss-name'),
  briefBossDetail: document.getElementById('brief-boss-detail'),
  briefBossNote: document.getElementById('brief-boss-note'),
  pauseScore: document.getElementById('pause-score'),
  pauseLevel: document.getElementById('pause-level'),
  pauseLives: document.getElementById('pause-lives'),
  pauseBoss: document.getElementById('pause-boss'),
  gameoverScore: document.getElementById('gameover-score'),
  gameoverMeters: document.getElementById('gameover-meters'),
  gameoverBestMeters: document.getElementById('gameover-best-meters'),
  gameoverHighScore: document.getElementById('gameover-high-score'),
  gameoverRankCard: document.getElementById('gameover-rank-card'),
  gameoverRank: document.getElementById('gameover-rank'),
  gameoverRankNote: document.getElementById('gameover-rank-note'),
  gameoverSummary: document.getElementById('gameover-summary'),
  questList: document.getElementById('quest-list'),
};

const WIDTH = 360;
const HEIGHT = 420;
const ARENA_ASPECT = WIDTH / HEIGHT;
const FRAME_MS = 1000 / 60;
const BASE_PLAYER_WIDTH = 44;
const BASE_PLAYER_HEIGHT = 50;
const PLAYER_WIDTH = 52;
const PLAYER_HEIGHT = 62;
const PLAYER_Y = HEIGHT - 58;
const PLAYER_MIN_Y = Math.floor(HEIGHT * 0.46);
const PLAYER_MAX_Y = HEIGHT - PLAYER_HEIGHT - 8;
const MOBILE_CONTROLS_RESERVED_MIN = 92;
const STORAGE_KEY = 'napiwas-scratch-high-score';
const SETTINGS_KEY = 'napiwas-scratch-settings';
const META_KEY = 'napiwas-scratch-meta-stats';
const COOP_CLIENT_KEY = 'napiwas-scratch-coop-client-id';
const BOSS_COOLDOWN_MS = 30000;
const NAPIWAS_CA = 'EQDOCUp_pDBvOmGRyEDE2bnCl2cjGmAWjPsTWRt_veSsfGSn';
const PREMIUM_NAPIWAS_THRESHOLD = 20000;
const TON_API_BASE = 'https://tonapi.io/v2';
const TON_CONNECT_SDK_URL = 'https://esm.sh/@tonconnect/ui@2.0.0';
const TON_CONNECT_MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`;
const COOP_API_URL = './api/coop';
const COOP_POLL_MS = 3000;
const LIVE_POLL_MS = 12000;
const SCORE_MILESTONE_STEP = 1000;
const DAILY_REWARD_STEPS = [35, 50, 70, 95, 130, 180, 240];
const NAPIWAS_BONUS_TIERS = [
  { id: 'base', min: 0, label: { en: 'BASE', ru: 'БАЗА' }, bossMultiplier: 1, scoreMultiplier: 1, bossMugBonus: 0, milestoneMugBonus: 0 },
  { id: 'holder', min: 2500, label: { en: 'HOLDER', ru: 'ХОЛДЕР' }, bossMultiplier: 1.03, scoreMultiplier: 1.02, bossMugBonus: 4, milestoneMugBonus: 2 },
  { id: 'vault', min: 10000, label: { en: 'VAULT', ru: 'РЕЗЕРВ' }, bossMultiplier: 1.06, scoreMultiplier: 1.04, bossMugBonus: 8, milestoneMugBonus: 5 },
  { id: 'premium', min: 20000, label: { en: 'PREMIUM', ru: 'ПРЕМИУМ' }, bossMultiplier: 1.1, scoreMultiplier: 1.07, bossMugBonus: 14, milestoneMugBonus: 8 },
  { id: 'whale', min: 50000, label: { en: 'WHALE', ru: 'КИТ' }, bossMultiplier: 1.14, scoreMultiplier: 1.1, bossMugBonus: 20, milestoneMugBonus: 12 },
];
const BONUS_TRACK_DEFS = [
  { id: 'taproom', title: { en: 'Taproom Loop', ru: 'Тапрум луп' }, unlockType: 'default', source: './assets/audio/battle-theme.wav' },
  { id: 'afterboss', title: { en: 'Afterboss Drive', ru: 'После-босс драйв' }, unlockType: 'bosses', target: 2, source: './assets/audio/epic-theme.wav' },
  { id: 'blackfoam', title: { en: 'Black Foam', ru: 'Черная пена' }, unlockType: 'score', target: 3000, source: './assets/audio/boss-epic-theme.wav' },
];
const ROCKET_LINKS = {
  dex: `https://dexscreener.com/search?q=${encodeURIComponent(NAPIWAS_CA)}`,
  gecko: `https://www.geckoterminal.com/search?query=${encodeURIComponent(NAPIWAS_CA)}`,
  buy: 'https://t.me/devpool_trading_bot?start=token_EQDOCUp_pDBvOmGRyEDE2bnCl2cjGmAWjPsTWRt_veSsfGSn',
};
const ENEMY_CAP_START = 2;
const ENEMY_CAP_BOSS_STEP = 2;
const ENEMY_CAP_MAX = 14;
const JOYSTICK_INPUT_BOOST = 1.4;
const PLAYER_STEERING_RESPONSE = 0.22;
const TOKEN_INFO_PANES = ['overview', 'economy', 'utility'];
const PLAYER_STEERING_FRICTION = 0.12;
const VOLLEY_LEVEL_MAX = 4;
const ENTITY_SEPARATION_PADDING = 10;
const CP1251_EXTENDED_CHARS = 'ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя';
const CP1251_BYTE_BY_CHAR = new Map(Array.from(CP1251_EXTENDED_CHARS, (char, index) => [char, index + 128]));
const MOJIBAKE_SENTINEL_RE = /[ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—™љ›њќћџЎўЈ¤Ґ¦§©Є«¬®Ї°±Ііґµ¶·№є»јЅѕї]/u;
const MOJIBAKE_SENTINEL_GLOBAL_RE = /[ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—™љ›њќћџЎўЈ¤Ґ¦§©Є«¬®Ї°±Ііґµ¶·№є»јЅѕї]/gu;
const UTF8_DECODER = new TextDecoder('utf-8');
const renderResolution = {
  scaleX: 1,
  scaleY: 1,
  pixelRatio: 1,
};

canvas.width = WIDTH;
canvas.height = HEIGHT;
ctx.imageSmoothingEnabled = true;
if ('imageSmoothingQuality' in ctx) {
  ctx.imageSmoothingQuality = 'high';
}

const BEER_REWARD_TABLE = {
  beerLite: 1,
  beerGold: 3,
  beerDark: 4,
  beerNeon: 6,
  beerMega: 10,
};

const SPRITE_SOURCES = {
  meteor: './assets/sprites/meteor.svg',
  heart: './assets/sprites/heart.svg',
  shield: './assets/sprites/shield.svg',
  bossVoid: './assets/sprites/boss-void.svg',
  drone: './assets/sprites/drone.svg',
  raider: './assets/sprites/raider.svg',
  weaponDefault: './assets/sprites/weapon-default.svg',
  weaponSpread: './assets/sprites/weapon-spread.svg',
  weaponLaser: './assets/sprites/weapon-laser.svg',
  weaponChainsaw: './assets/sprites/weapon-chainsaw.svg',
  weaponMissile: './assets/sprites/weapon-missile.svg',
  weaponPaw: './assets/sprites/weapon-paw.svg',
  weaponBottle: './assets/sprites/weapon-bottle.svg',
  weaponIce: './assets/sprites/weapon-ice.svg',
};

const MUSIC_TRACKS = {
  menu: './assets/audio/menu-theme.wav',
  battle: './assets/audio/battle-theme.wav',
  epic: './assets/audio/epic-theme.wav',
  boss: './assets/audio/boss-theme.wav',
  bossEpic: './assets/audio/boss-epic-theme.wav',
};

const PALETTES = [
  { top: '#050505', bottom: '#0f0f0f', grid: 'rgba(255,214,143,0.08)' },
  { top: '#070707', bottom: '#121212', grid: 'rgba(255,255,255,0.06)' },
  { top: '#0b0b0b', bottom: '#161616', grid: 'rgba(255,214,143,0.12)' },
  { top: '#090909', bottom: '#15100a', grid: 'rgba(255,191,87,0.1)' },
];
const STRICT_UI_COLORS = {
  black: '#000000',
  white: '#ffffff',
  cream: '#f2e6d5',
  creamDark: '#cdb99a',
  orange: '#f28a1a',
  orangeSoft: '#ffb15c',
};

const WEAPONS = {
  standard: { label: 'BEER', cadence: 50, damage: 10, speed: 20, color: '#ffd053' },
  spread: { label: 'FOAM', cadence: 80, damage: 8, speed: 18, color: '#ffb85c' },
  laser: { label: 'LASER', cadence: 90, damage: 22, speed: 28, color: '#ff6f7d' },
  chainsaw: { label: 'CHAINSAW', cadence: 85, damage: 18, speed: 18, color: '#ff8a42' },
  missile: { label: 'MISSILE', cadence: 120, damage: 24, speed: 20, color: '#ff7542' },
  paw: { label: 'PAW', cadence: 75, damage: 14, speed: 20, color: '#f39ac0' },
  bottle: { label: 'BOTTLE', cadence: 110, damage: 18, speed: 18, color: '#79d4b3' },
  ice: { label: 'ICE', cadence: 100, damage: 16, speed: 20, color: '#86d1f2' },
  superLaser: { label: 'SUN', cadence: 30, damage: 50, speed: 35, color: '#ff5f52' },
};

const WEAPON_ORDER = ['standard', 'spread', 'laser', 'chainsaw', 'missile', 'paw', 'bottle', 'ice'];
const WEAPON_TITLES = {
  standard: { en: 'BEER', ru: 'РџРР’Рћ' },
  spread: { en: 'FOAM', ru: 'РџР•РќРђ' },
  laser: { en: 'LASER', ru: 'Р›РђР—Р•Р ' },
  chainsaw: { en: 'CHAIN', ru: 'РџРР›Рђ' },
  missile: { en: 'MISSILE', ru: 'Р РђРљР•РўРђ' },
  paw: { en: 'PAW', ru: 'Р›РђРџРђ' },
  bottle: { en: 'BOTTLE', ru: 'Р‘РЈРўР«Р›РљРђ' },
  ice: { en: 'ICE', ru: 'Р›Р•Р”' },
  superLaser: { en: 'SUN', ru: 'РЎРћР›РќР¦Р•' },
};
const WEAPON_BRIEFS = {
  standard: { en: 'Fast baseline stream for early lane control.', ru: 'Р‘С‹СЃС‚СЂС‹Р№ Р±Р°Р·РѕРІС‹Р№ РїРѕС‚РѕРє РґР»СЏ РєРѕРЅС‚СЂРѕР»СЏ РїРѕР»РѕСЃС‹.' },
  spread: { en: 'Three-shot foam fan for wider cleanup.', ru: 'РўСЂРѕР№РЅРѕР№ РІРµРµСЂ РґР»СЏ С€РёСЂРѕРєРѕР№ Р·Р°С‡РёСЃС‚РєРё.' },
  laser: { en: 'Thin beam with heavier burst damage.', ru: 'РўРѕРЅРєРёР№ Р»СѓС‡ СЃ РїРѕРІС‹С€РµРЅРЅС‹Рј СѓСЂРѕРЅРѕРј.' },
  chainsaw: { en: 'Rotating blade pressure for tight spaces.', ru: 'Р’СЂР°С‰Р°СЋС‰Р°СЏСЃСЏ РїРёР»Р° РґР»СЏ С‚РµСЃРЅС‹С… РєРѕСЂРёРґРѕСЂРѕРІ.' },
  missile: { en: 'Twin rockets with raw punch and no auto-targeting.', ru: 'Две мощные ракеты без самонаводки.' },
  paw: { en: 'Chaotic pink spread that bends lanes.', ru: 'РҐР°РѕС‚РёС‡РЅС‹Р№ СЂРѕР·РѕРІС‹Р№ Р·Р°Р»Рї СЃ РєСЂРёРІРѕР№ С‚СЂР°РµРєС‚РѕСЂРёРµР№.' },
  bottle: { en: 'Explosive bottle that clears nearby shots.', ru: 'Р’Р·СЂС‹РІРЅР°СЏ Р±СѓС‚С‹Р»РєР°, СЃС‡РёС‰Р°СЋС‰Р°СЏ Р±Р»РёР¶РЅРёРµ РїСѓР»Рё.' },
  ice: { en: 'Freezes bullet flow and slows pressure spikes.', ru: 'Р—Р°РјРµРґР»СЏРµС‚ Рё Р·Р°РјРѕСЂР°Р¶РёРІР°РµС‚ РїРѕС‚РѕРє РІСЂР°РіР°.' },
  superLaser: { en: 'Ten-second boss melter that shreds buildings too.', ru: '10 СЃРµРєСѓРЅРґ СЃСѓРїРµСЂ-Р»Р°Р·РµСЂР°, РєРѕС‚РѕСЂС‹Р№ Р»РѕРјР°РµС‚ Рё СЃС‚РµРЅС‹.' },
};
const SHIP_SKINS = [
  {
    id: 'classic',
    label: { en: 'CLASSIC', ru: 'РљР›РђРЎРЎРРљ' },
    hull: '#ffd053',
    accent: '#f28a1a',
    face: '#fff6e5',
    stripe: '#fff4cf',
    eye: '#241713',
    glow: '#ffd053',
    mask: false,
    crown: false,
    angularEyes: false,
    premium: false,
  },
  {
    id: 'nebula',
    label: { en: 'NEBULA', ru: 'РўРЈРњРђРќ' },
    hull: '#86d1f2',
    accent: '#4d95ff',
    face: '#f5fbff',
    stripe: '#d7f4ff',
    eye: '#13253b',
    glow: '#86d1f2',
    mask: true,
    crown: false,
    angularEyes: false,
    premium: false,
  },
  {
    id: 'royal',
    label: { en: 'ROYAL', ru: 'Р РћРЇР›' },
    hull: '#ffe38a',
    accent: '#ff7aa6',
    face: '#fff9ef',
    stripe: '#fff1b8',
    eye: '#27190e',
    glow: '#ffb85c',
    mask: false,
    crown: true,
    angularEyes: false,
    premium: false,
  },
  {
    id: 'obsidian',
    label: { en: 'OBSIDIAN', ru: 'РћР‘РЎРР”РРђРќ' },
    hull: '#6f6279',
    accent: '#b49eff',
    face: '#f2eef7',
    stripe: '#d3c8f0',
    eye: '#100d17',
    glow: '#b49eff',
    mask: true,
    crown: false,
    angularEyes: true,
    premium: false,
  },
  {
    id: 'afterglow',
    label: { en: 'AFTERGLOW', ru: 'ПОСЛЕСВЕТ' },
    hull: '#ffd27a',
    accent: '#ff7a4d',
    face: '#fff7ef',
    stripe: '#ffe3bc',
    eye: '#2e140a',
    glow: '#ffad59',
    mask: false,
    crown: true,
    angularEyes: true,
    premium: false,
    questReward: true,
  },
  {
    id: 'northstar',
    label: { en: 'NORTHSTAR', ru: 'СЕВЕРНАЯ' },
    hull: '#9dd8ff',
    accent: '#5c9fff',
    face: '#f7fbff',
    stripe: '#d7ebff',
    eye: '#13263d',
    glow: '#89cfff',
    mask: true,
    crown: false,
    angularEyes: false,
    premium: false,
    questReward: true,
  },
  {
    id: 'solaris',
    label: { en: 'SOLARIS', ru: 'SOLARIS' },
    hull: '#ffbf63',
    accent: '#ff6f4f',
    face: '#fff5e8',
    stripe: '#ffe1b0',
    eye: '#35190f',
    glow: '#ff9d4d',
    mask: false,
    crown: true,
    angularEyes: true,
    premium: true,
    requiredTokens: PREMIUM_NAPIWAS_THRESHOLD,
  },
  {
    id: 'jade',
    label: { en: 'JADE', ru: 'JADE' },
    hull: '#7be4c0',
    accent: '#29b889',
    face: '#f3fff8',
    stripe: '#c6ffe8',
    eye: '#103329',
    glow: '#6ff3c8',
    mask: true,
    crown: false,
    angularEyes: false,
    premium: true,
    requiredTokens: PREMIUM_NAPIWAS_THRESHOLD,
  },
  {
    id: 'inferno',
    label: { en: 'INFERNO', ru: 'INFERNO' },
    hull: '#ff8665',
    accent: '#ff4f4f',
    face: '#fff0e8',
    stripe: '#ffc8b6',
    eye: '#2c0f0f',
    glow: '#ff7357',
    mask: true,
    crown: false,
    angularEyes: true,
    premium: true,
    requiredTokens: PREMIUM_NAPIWAS_THRESHOLD,
  },
  {
    id: 'chrome',
    label: { en: 'CHROME', ru: 'CHROME' },
    hull: '#d9e4f2',
    accent: '#7f96c9',
    face: '#ffffff',
    stripe: '#f6fbff',
    eye: '#1d2430',
    glow: '#c6d7ff',
    mask: false,
    crown: false,
    angularEyes: false,
    premium: true,
    requiredTokens: PREMIUM_NAPIWAS_THRESHOLD,
  },
];
const SHOP_SKIN_PRICES = {
  nebula: 320,
  royal: 480,
  obsidian: 760,
  afterglow: 980,
  northstar: 1240,
  solaris: 1800,
  jade: 2200,
  inferno: 2800,
  chrome: 3500,
};
const WEAPON_FINISHES = [
  { id: 'brass', label: { en: 'BRASS', ru: 'Р›РђРўРЈРќР¬' }, tint: '#ffd053', mix: 0.1 },
  { id: 'neon', label: { en: 'NEON', ru: 'РќР•РћРќ' }, tint: '#86d1f2', mix: 0.24 },
  { id: 'ember', label: { en: 'EMBER', ru: 'РЈР“Р›Р' }, tint: '#ff7a5c', mix: 0.22 },
  { id: 'void', label: { en: 'VOID', ru: 'Р’РђРљРЈРЈРњ' }, tint: '#b49eff', mix: 0.22 },
];
const BOSS_PATTERN_BRIEFS = {
  spread: 'Stay under the seams when the fan opens.',
  laser: 'Short sidesteps beat greedy late dodges.',
  rapid: 'Hold calm micro-movements and avoid oversteer.',
  homing: 'Lead missiles away, then cut back under them.',
  wave: 'Read the sinus curve, not single bullets.',
  chains: 'Respect chain drift and donвЂ™t hug walls.',
  burst: 'Prepare for sudden dense packets near center.',
  notes: 'Music volleys arrive in clustered rhythm bursts.',
  strings: 'Play between narrow lanes like piano keys.',
};
const REWARD_CODEX = [
  { kind: 'heart', tag: 'HP', title: 'Heart', note: '+1 life. Highest clutch value.', color: '#ff8ea3' },
  { kind: 'shieldPickup', tag: 'SAFE', title: 'Shield', note: 'Ignores damage for 10 seconds.', color: '#91d87f' },
  { kind: 'doubleShotPickup', tag: 'DUO', title: 'Double Shot', note: 'Stacks with shield and doubles the lane pressure.', color: '#ffd053' },
  { kind: 'superLaserPickup', tag: 'SUN', title: 'Super Laser', note: 'Ten seconds of arena-clearing fire.', color: '#ff6f7d' },
  { kind: 'volleyUpgrade', tag: 'RPM', title: 'Volley Upgrade', note: 'Raises fire rate and adds more barrels.', color: '#86d1f2' },
  { kind: 'weaponCrate', tag: 'WPN', title: 'Weapon Crate', note: 'Unlocks or refreshes a weapon drop.', color: '#79d4b3' },
];

const TARGET_DEFS = {
  beerLite: { value: 10, radius: 10, color: '#ffbb55', label: 'BEER' },
  beerGold: { value: 25, radius: 10, color: '#ffd053', label: 'GOLD' },
  beerDark: { value: 35, radius: 11, color: '#b26a3b', label: 'DARK' },
  beerNeon: { value: 45, radius: 11, color: '#ff8a5b', label: 'NEON' },
  beerMega: { value: 60, radius: 12, color: '#86d1f2', label: 'MEGA' },
};

const ENEMY_DEFS = {
  droneCat: { radius: 16, color: '#f5bf55', label: 'DRONE', hp: 18, cadence: 600 },
  raiderCat: { radius: 18, color: '#f5bf55', label: 'RAIDER', hp: 30, cadence: 760 },
};

const METEOR_DEFS = {
  meteorSmall: { radius: 18, hp: 12, color: '#5a5f71', accent: '#dbe0ef', speedMin: 2.5, speedMax: 3.15, drift: 0.62, spin: 0.044 },
  meteorLarge: { radius: 26, hp: 22, color: '#4e5467', accent: '#cfd8ea', speedMin: 2.05, speedMax: 2.7, drift: 0.44, spin: 0.03 },
  meteorShard: { radius: 15, hp: 10, color: '#666d82', accent: '#e4ebf5', speedMin: 2.9, speedMax: 3.6, drift: 0.78, spin: 0.056 },
  meteorTwin: { radius: 22, hp: 16, color: '#596176', accent: '#d4dced', speedMin: 2.25, speedMax: 2.95, drift: 0.64, spin: 0.046 },
  meteorFlankLeft: { radius: 20, hp: 14, color: '#515a70', accent: '#d8e0f0', speedMin: 2.55, speedMax: 3.15, drift: 1.08, spin: 0.056 },
  meteorFlankRight: { radius: 20, hp: 14, color: '#515a70', accent: '#d8e0f0', speedMin: 2.55, speedMax: 3.15, drift: 1.08, spin: 0.056 },
};

const PICKUP_COLORS = {
  heart: '#ff758f',
  shieldPickup: '#91d87f',
  doubleShotPickup: '#ffd053',
  superLaserPickup: '#ff6f7d',
  volleyUpgrade: '#86d1f2',
  weaponSpread: '#ffb85c',
  weaponLaser: '#ff6f7d',
  weaponChainsaw: '#ff8a42',
  weaponMissile: '#ff7542',
  weaponPaw: '#f39ac0',
  weaponBottle: '#79d4b3',
  weaponIce: '#86d1f2',
};

const BOSSES = [
  {
    name: 'NYAN CAT',
    pattern: 'spread',
    attackStyle: 'spread',
    signatureWeapon: 'spread',
    texture: 'prism',
    color: '#ff6b9d',
    accent: '#ffb5cf',
    bodyColor: '#ff69b4',
    headColor: '#a0a0a0',
    earColor: '#ffb6c1',
    eye: '#000000',
    glowColor: '#ff6b9d',
    trail: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00d2d3', '#9400d3'],
    lore: {
      en: 'Classic rainbow rush. Wide fan shots reward clean lane reads.',
      ru: 'Классический радужный рывок. Широкий веер наказывает за грязную линию.',
    },
  },
  {
    name: 'DEMON CAT',
    pattern: 'laser',
    attackStyle: 'laser',
    signatureWeapon: 'laser',
    texture: 'ember',
    color: '#ff4757',
    accent: '#ff9d73',
    bodyColor: '#8b0000',
    headColor: '#4a0000',
    earColor: '#ff0000',
    eye: '#ff0000',
    glowColor: '#ff0000',
    trail: ['#ff0000', '#8b0000', '#ff4500', '#8b0000', '#ff0000', '#8b0000'],
    hasHorn: true,
    hasWings: true,
    wingColor: '#4a0000',
    lore: {
      en: 'Beam pressure and hot side lanes. Late dodges get clipped.',
      ru: 'Лучевой прессинг и горячие боковые линии. Поздние уводы не прощает.',
    },
  },
  {
    name: 'CYBER CAT',
    pattern: 'rapid',
    attackStyle: 'rapid',
    signatureWeapon: 'spread',
    texture: 'circuit',
    color: '#00d2d3',
    accent: '#7effe8',
    bodyColor: '#008b8b',
    headColor: '#00ffff',
    earColor: '#00ced1',
    eye: '#00ff66',
    glowColor: '#00ffff',
    trail: ['#00ffff', '#00d2d3', '#008b8b', '#00ffff', '#00d2d3', '#008b8b'],
    hasCircuitLines: true,
    lore: {
      en: 'Digital bursts arrive in clipped packets. Micro-corrections win here.',
      ru: 'Цифровые очереди приходят короткими пакетами. Работают только микроправки.',
    },
  },
  {
    name: 'PHANTOM CAT',
    pattern: 'homing',
    attackStyle: 'homing',
    signatureWeapon: 'laser',
    texture: 'mist',
    color: '#a55eea',
    accent: '#dcc2ff',
    bodyColor: '#4b0082',
    headColor: '#8a2be2',
    earColor: '#da70d6',
    eye: '#00ffff',
    glowColor: '#a55eea',
    trail: ['#a55eea', '#8a2be2', '#4b0082', '#a55eea', '#8a2be2', '#4b0082'],
    hasHorn: true,
    hasWings: true,
    wingColor: '#2d004d',
    isGhostly: true,
    lore: {
      en: 'Tracks your movement line. Pull missiles wide, then cut back under them.',
      ru: 'Следит за траекторией. Уводи самонаводку в сторону и возвращайся в окно.',
    },
  },
  {
    name: 'GOLD CAT',
    pattern: 'wave',
    attackStyle: 'wave',
    signatureWeapon: 'chainsaw',
    texture: 'royal',
    color: '#ffd93d',
    accent: '#fff0a3',
    bodyColor: '#d4ac0d',
    headColor: '#ffd700',
    earColor: '#ffa500',
    eye: '#ff8c00',
    glowColor: '#ffd93d',
    trail: ['#ffd93d', '#ffa500', '#ff8c00', '#ffd700', '#ffa500', '#ff8c00'],
    hasWings: true,
    wingColor: '#b8860b',
    hasCrown: true,
    lore: {
      en: 'Regal wave volleys. Read the whole rhythm instead of one bullet at a time.',
      ru: 'Королевские волны. Читай общий ритм, а не отдельные пули.',
    },
  },
  {
    name: 'GALACTIC CAT',
    pattern: 'chains',
    attackStyle: 'chainsaw',
    signatureWeapon: 'chainsaw',
    texture: 'cosmos',
    color: '#9d00ff',
    accent: '#ff7bff',
    bodyColor: '#2d004d',
    headColor: '#4b0082',
    earColor: '#9400d3',
    eye: '#ff00ff',
    glowColor: '#ff00ff',
    trail: ['#ff00ff', '#9d00ff', '#4b0082', '#ff00ff', '#9d00ff', '#4b0082'],
    hasHorn: true,
    hasWings: true,
    wingColor: '#1a0033',
    isGalactic: true,
    lore: {
      en: 'Chaotic chain blades and cosmic pressure. Wall hugging is lethal.',
      ru: 'Хаотичные цепные лезвия и космический прессинг. У стен играть смертельно.',
    },
  },
  {
    name: 'MEGA GRAND MASTER',
    pattern: 'burst',
    attackStyle: 'furball',
    signatureWeapon: 'missile',
    texture: 'armor',
    color: '#ff1493',
    accent: '#ff9cd0',
    bodyColor: '#ff69b4',
    headColor: '#ffb6c1',
    earColor: '#ffc0cb',
    eye: '#00ffff',
    glowColor: '#ff1493',
    trail: ['#ff1493', '#ff69b4', '#ffb6c1', '#ff1493', '#ff69b4', '#ffb6c1'],
    isMegaMaster: true,
    lore: {
      en: 'Furball packets and paw swipes overload the center lane.',
      ru: 'Пачки furball-снарядов и взмахи лапой забивают центр арены.',
    },
  },
  {
    name: 'SUPER GUITAR CAT',
    pattern: 'notes',
    attackStyle: 'notes',
    signatureWeapon: 'bottle',
    texture: 'vinyl',
    color: '#ff6b00',
    accent: '#ffd36f',
    bodyColor: '#8b4513',
    headColor: '#d2691e',
    earColor: '#cd853f',
    eye: '#ff4500',
    glowColor: '#ff6b00',
    trail: ['#ff6b00', '#ffd93d', '#ff8c00', '#ff6b00', '#ffd93d', '#ff8c00'],
    isGuitarBoss: true,
    lore: {
      en: 'Musical note clusters and spiral riffs force tempo discipline.',
      ru: 'Музыкальные ноты и спиральные риффы требуют ритма и дисциплины.',
    },
  },
  {
    name: 'GRAND PIANO CAT',
    pattern: 'strings',
    attackStyle: 'pianoStrings',
    signatureWeapon: 'ice',
    texture: 'ivory',
    color: '#ff4757',
    accent: '#fff1bf',
    bodyColor: '#1a1a1a',
    headColor: '#2a2a2a',
    earColor: '#ffd93d',
    eye: '#ff0000',
    glowColor: '#ff4757',
    trail: ['#ff4757', '#ffd93d', '#ffffff', '#ff4757', '#ffd93d', '#ffffff'],
    isPianoBoss: true,
    lore: {
      en: 'String volleys and piano-key side fire create tight keyboard lanes.',
      ru: 'Струнные залпы и боковые клавиши создают очень узкие коридоры.',
    },
  },
  {
    name: 'TERMINATOR',
    pattern: 'laser',
    attackStyle: 'terminatorLaser',
    signatureWeapon: 'laser',
    texture: 'armor',
    color: '#c0c0c0',
    accent: '#ff5a5a',
    bodyColor: '#4a4a4a',
    headColor: '#808080',
    earColor: '#696969',
    eye: '#ff0000',
    glowColor: '#ff0000',
    trail: ['#ff0000', '#c0c0c0', '#696969', '#ff0000', '#c0c0c0', '#696969'],
    isTerminator: true,
    lore: {
      en: 'Cold laser pulses with hot follow-up sparks. Do not overstay center.',
      ru: 'Холодные лазерные импульсы и горячие добивающие искры. Центр долго не держи.',
    },
  },
  {
    name: 'JOKER CAT',
    pattern: 'spread',
    attackStyle: 'cards',
    signatureWeapon: 'paw',
    texture: 'prism',
    color: '#9400d3',
    accent: '#ffd053',
    bodyColor: '#4b0082',
    headColor: '#8a2be2',
    earColor: '#ffd700',
    eye: '#ff1493',
    glowColor: '#ffd700',
    trail: ['#ff0000', '#ff1493', '#ffd700', '#00ff00', '#0000ff', '#9400d3'],
    isJoker: true,
    lore: {
      en: 'Card spreads and falling wild cards create deceptive fake-safe gaps.',
      ru: 'Карточные вееры и падающие wild-карты создают обманчивые безопасные окна.',
    },
  },
];

const EXTENDED_BOSS_COLORS = BOSSES.flatMap((boss) => [
  boss.color,
  boss.accent,
  boss.bodyColor,
  boss.headColor,
  boss.earColor,
  boss.eye,
  boss.glowColor,
  ...(boss.trail || []),
]);

const STRICT_COLOR_ROTATION = [
  STRICT_UI_COLORS.orange,
  STRICT_UI_COLORS.orangeSoft,
  STRICT_UI_COLORS.cream,
  STRICT_UI_COLORS.white,
];

function enforceStrictPalette() {
  const weaponKeys = Object.keys(WEAPONS);
  weaponKeys.forEach((weaponId, index) => {
    WEAPONS[weaponId].color = STRICT_COLOR_ROTATION[index % STRICT_COLOR_ROTATION.length];
  });

  SHIP_SKINS.forEach((skin, index) => {
    const isDark = index % 2 === 1;
    skin.hull = isDark ? STRICT_UI_COLORS.orangeSoft : STRICT_UI_COLORS.cream;
    skin.accent = index % 3 === 0 ? STRICT_UI_COLORS.orange : STRICT_UI_COLORS.white;
    skin.face = STRICT_UI_COLORS.cream;
    skin.stripe = STRICT_UI_COLORS.white;
    skin.eye = STRICT_UI_COLORS.black;
    skin.glow = index % 3 === 0 ? STRICT_UI_COLORS.orangeSoft : STRICT_UI_COLORS.creamDark;
  });

  WEAPON_FINISHES.forEach((finish, index) => {
    finish.tint = STRICT_COLOR_ROTATION[index % STRICT_COLOR_ROTATION.length];
  });

  REWARD_CODEX.forEach((reward, index) => {
    reward.color = STRICT_COLOR_ROTATION[index % STRICT_COLOR_ROTATION.length];
  });

  Object.keys(TARGET_DEFS).forEach((targetId, index) => {
    TARGET_DEFS[targetId].color = STRICT_COLOR_ROTATION[index % STRICT_COLOR_ROTATION.length];
  });

  Object.keys(ENEMY_DEFS).forEach((enemyId, index) => {
    ENEMY_DEFS[enemyId].color = index % 2 === 0 ? STRICT_UI_COLORS.orange : STRICT_UI_COLORS.cream;
  });

  Object.keys(METEOR_DEFS).forEach((meteorId, index) => {
    METEOR_DEFS[meteorId].color = index % 2 === 0 ? '#171717' : '#232323';
    METEOR_DEFS[meteorId].accent = index % 2 === 0 ? STRICT_UI_COLORS.cream : STRICT_UI_COLORS.white;
  });

  Object.keys(PICKUP_COLORS).forEach((pickupId, index) => {
    PICKUP_COLORS[pickupId] = STRICT_COLOR_ROTATION[index % STRICT_COLOR_ROTATION.length];
  });

  BOSSES.forEach((boss, index) => {
    boss.uiAccent = index % 2 === 0 ? STRICT_UI_COLORS.orange : STRICT_UI_COLORS.cream;
  });
}

enforceStrictPalette();

const QUEST_ITEMS = [
  'Start the match with PLAY. Score resets, level goes to 1, lives go to 3 or 100 with God Mode.',
  'Auto-fire never stops. You survive by moving, reading lanes and collecting safely.',
  'Beer mugs are score targets. They no longer drain hull on contact or on escape.',
  'Heart gives +1 life, Shield blocks damage, Super Laser clears lanes, Volley Upgrade boosts auto-fire.',
  'Weapon crates unlock FOAM, LASER, CHAINSAW, MISSILE, PAW, BOTTLE and ICE for the current run.',
  'Bosses appear from 500 score onward. Beat them for +500 score, +2 lives and a level-up.',
];

const QUEST_ITEMS_I18N = {
  en: [
    'Press PLAY to start. Score resets, lives become 3 or 100 with God Mode.',
    'Every second survived equals 1 meter and also adds +1 score.',
    'Only beer mugs give score. Missing them or brushing them no longer costs hull.',
    'Positive drops only: heart, shield for 10s, super laser for 10s, and weapon crates.',
    'Bosses always drop a weapon. Collecting weapons upgrades the cat ship visually.',
    'Meteor fields and giant planets shape the lane. Meteors break when they hit planets.',
  ],
  ru: [
    'РќР°Р¶РјРё PLAY РґР»СЏ СЃС‚Р°СЂС‚Р°. РЎС‡РµС‚ СЃР±СЂР°СЃС‹РІР°РµС‚СЃСЏ, Р¶РёР·РЅРµР№ 3 РёР»Рё 100 РІ God Mode.',
    'РљР°Р¶РґР°СЏ СЃРµРєСѓРЅРґР° РІС‹Р¶РёРІР°РЅРёСЏ СЂР°РІРЅР° 1 РјРµС‚СЂСѓ Рё РґР°РµС‚ +1 Рє СЃС‡РµС‚Сѓ.',
    'РћС‡РєРё РґР°СЋС‚ С‚РѕР»СЊРєРѕ РєСЂСѓР¶РєРё РїРёРІР°. РљР°СЃР°РЅРёРµ РёР»Рё СѓС…РѕРґ РІРЅРёР· Р±РѕР»СЊС€Рµ РЅРµ РѕС‚РЅРёРјР°СЋС‚ РєРѕСЂРїСѓСЃ.',
    'РўРѕР»СЊРєРѕ РїРѕР»РµР·РЅС‹Рµ РґСЂРѕРїС‹: СЃРµСЂРґС†Рµ, С‰РёС‚ РЅР° 10 СЃРµРєСѓРЅРґ, СЃСѓРїРµСЂ-Р»Р°Р·РµСЂ РЅР° 10 СЃРµРєСѓРЅРґ Рё СЏС‰РёРєРё РѕСЂСѓР¶РёСЏ.',
    'РЎ Р±РѕСЃСЃР° РІСЃРµРіРґР° РїР°РґР°РµС‚ РѕСЂСѓР¶РёРµ. РџРѕРґР±РѕСЂ РѕСЂСѓР¶РёСЏ РІРёР·СѓР°Р»СЊРЅРѕ СѓР»СѓС‡С€Р°РµС‚ РєРѕСЂР°Р±Р»СЊ РєРѕС‚РёРєР°.',
    'РњРµС‚РµРѕСЂРЅС‹Рµ РІРѕР»РЅС‹ С„РѕСЂРјРёСЂСѓСЋС‚ Р»РёРЅРёСЋ. РС‰Рё С‡РёСЃС‚С‹Рµ РєР°СЂРјР°РЅС‹ Рё РЅРµ Р·Р°СЃС‚СЂРµРІР°Р№.',
  ],
};

const QUEST_DEFS = [
  {
    id: 'range-120',
    title: { en: 'Long Pour', ru: 'Длинный забег' },
    body: { en: 'Reach 120 meters in one run to secure a beer reserve for the hangar.', ru: 'Пройди 120 метров за один забег и получи запас кружек для ангара.' },
    metric: 'bestMeters',
    target: 120,
    reward: { kind: 'beer', amount: 160 },
  },
  {
    id: 'boss-laser',
    title: { en: 'Void Breaker', ru: 'Ломатель пустоты' },
    body: { en: 'Defeat your first boss. The contract unlocks LASER permanently.', ru: 'Победи первого босса. Контракт открывает LASER навсегда.' },
    metric: 'bossesDefeated',
    target: 1,
    reward: { kind: 'weapon', weaponId: 'laser' },
  },
  {
    id: 'pickup-skin',
    title: { en: 'Recovery Route', ru: 'Маршрут снабжения' },
    body: { en: 'Collect 6 support drops to unlock the AFTERGLOW hull skin.', ru: 'Собери 6 полезных дропов и открой скин AFTERGLOW.' },
    metric: 'pickupsCollected',
    target: 6,
    reward: { kind: 'skin', skinId: 'afterglow' },
  },
  {
    id: 'targets-60',
    title: { en: 'Foam Economy', ru: 'Пивная экономика' },
    body: { en: 'Destroy 60 beer mugs across runs to earn a bigger mug payout.', ru: 'Уничтожь 60 пивных кружек суммарно и получи крупную выплату кружек.' },
    metric: 'targetsDestroyed',
    target: 60,
    reward: { kind: 'beer', amount: 420 },
  },
  {
    id: 'boss-missile',
    title: { en: 'Boss Tax', ru: 'Налог на боссов' },
    body: { en: 'Defeat 3 bosses to unlock MISSILE permanently for future runs.', ru: 'Победи 3 боссов, чтобы открыть MISSILE для будущих забегов.' },
    metric: 'bossesDefeated',
    target: 3,
    reward: { kind: 'weapon', weaponId: 'missile' },
  },
  {
    id: 'range-skin',
    title: { en: 'Northern Signal', ru: 'Северный сигнал' },
    body: { en: 'Push your record to 260 meters to unlock the NORTHSTAR skin.', ru: 'Подними рекорд до 260 метров и открой скин NORTHSTAR.' },
    metric: 'bestMeters',
    target: 260,
    reward: { kind: 'skin', skinId: 'northstar' },
  },
];

const TARGET_TITLES = {
  beerLite: { en: 'BEER', ru: 'РџРР’Рћ' },
  beerGold: { en: 'GOLD', ru: 'Р“РћР›Р”' },
  beerDark: { en: 'DARK', ru: 'РўР•РњРќРћР•' },
  beerNeon: { en: 'NEON', ru: 'РќР•РћРќ' },
  beerMega: { en: 'MEGA', ru: 'РњР•Р“Рђ' },
};

const ENEMY_TITLES = {
  droneCat: { en: 'DRONE', ru: 'Р”Р РћРќ' },
  raiderCat: { en: 'RAIDER', ru: 'Р Р•Р™Р”Р•Р ' },
};

const I18N = {
  en: {
    battleTitle: 'Battle',
    playCta: 'PLAY',
    scoreLabel: 'Score',
    metersLabel: 'Meters',
    recordLabel: 'Record',
    livesLabel: 'Lives',
    pauseButton: 'PAUSE',
    activeBuffsTitle: 'Active buffs',
    runIntelTitle: 'Run intel',
    unlockedLabel: 'Unlocked',
    weaponLabel: 'Weapon',
    hullLabel: 'Hull',
    levelLabel: 'Level',
    nextBossLabel: 'Next boss',
    bossEtaLabel: 'Boss eta',
    comboLabel: 'Combo',
    dangerLabel: 'Danger',
    threatsLabel: 'Threats',
    dropScanLabel: 'Drop scan',
    autoFireChip: 'AUTO-FIRE',
    bossLabel: 'Boss',
    thumbSliderLabel: 'Thumb Slider',
    joystickLabel: 'Joystick',
    leftButton: 'LEFT',
    forwardButton: 'FORWARD',
    rightButton: 'RIGHT',
    boostButton: 'BOOST',
    questButton: 'QUEST',
    combatFeedTitle: 'Combat feed',
    latestCallouts: 'Latest callouts',
    navHome: 'HOME',
    navPlay: 'PLAY',
    navCoop: 'TEAM',
    navQuest: 'QUEST',
    navHangar: 'HANGAR',
    battleArenaTitle: 'Battle Arena',
    battleArenaBody: 'Auto-fire survival shooter. Move, dodge, collect, unlock weapons and burn down boss phases.',
    menuHeroKicker: 'Premium casual auto-shooter',
    autoFireFeature: 'Auto-fire',
    bossRushFeature: 'Boss rush',
    weaponUnlocksFeature: 'Weapon unlocks',
    dangerTierLabel: 'Danger tier',
    shipSkinLabel: 'Ship skin',
    weaponFinishLabel: 'Weapon finish',
    audioLabel: 'Audio',
    bossLineupLabel: 'Boss line-up',
    highScoreLabel: 'High score',
    difficultyLabel: 'Difficulty',
    godModeLabel: 'God mode',
    controlsLabel: 'Controls',
    pilotRecordTitle: 'Pilot record',
    storedLocallyLabel: 'Stored locally',
    hangarTitle: 'Hangar',
    customizeRunLabel: 'Customize the run',
    runsLabel: 'Runs',
    bossesLabel: 'Bosses',
    targetsLabel: 'Targets',
    bestComboLabel: 'Best combo',
    bestMetersLabel: 'Best meters',
    tacticalBriefTitle: 'Tactical brief',
    liveRunIntelLabel: 'Live run intel',
    loadoutLabel: 'Loadout',
    nextThreatLabel: 'Next threat',
    rewardCodexTitle: 'Reward codex',
    pickupValueLabel: 'Pickup value',
    arsenalFloorTitle: 'Arsenal floor',
    dropToUnlockLabel: 'Drop to unlock',
    startRunButton: 'START RUN',
    pausedEyebrow: 'Paused',
    runFrozenTitle: 'Run frozen',
    pauseBody: 'Take a breath, then jump straight back into the arena.',
    threatLabel: 'Threat',
    resumeButton: 'RESUME',
    exitToMenuButton: 'EXIT TO MENU',
    runNotesTitle: 'Run Notes',
    closeButton: 'CLOSE',
    gameOverEyebrow: 'Game Over',
    runCompleteTitle: 'Run complete',
    runRankLabel: 'Run rank',
    finalScoreLabel: 'Final score',
    tryAgainButton: 'TRY AGAIN',
    backToMenuButton: 'BACK TO MENU',
    teamPlayTitle: 'Team Play',
    teamPlayMeta: 'Up to 3 players',
    findGameLabel: 'Find game',
    hostGameLabel: 'Host game',
    hostGameHint: 'Create a lobby and wait for allies.',
    noLobbyNow: 'No lobbies found at the moment.',
    hostOffline: 'Host offline',
    hostOnline: 'Host online. Waiting for players...',
    joinLobbyLabel: 'JOIN',
    leaveLobbyLabel: 'LEAVE',
    lobbyFullLabel: 'FULL',
    lobbyHostedLabel: 'HOST',
    joinedLobbyLabel: 'Joined lobby',
    onLabel: 'ON',
    offLabel: 'OFF',
    safeLabel: 'SAFE',
    bossActiveLabel: 'BOSS',
  },
  ru: {
    battleTitle: 'Р‘РѕР№',
    playCta: 'РР“Р РђРўР¬',
    scoreLabel: 'РЎС‡РµС‚',
    metersLabel: 'РњРµС‚СЂС‹',
    recordLabel: 'Р РµРєРѕСЂРґ',
    livesLabel: 'Р–РёР·РЅРё',
    pauseButton: 'РџРђРЈР—Рђ',
    activeBuffsTitle: 'Р‘Р°С„С„С‹',
    runIntelTitle: 'РРЅС„Рѕ СЂР°РЅР°',
    unlockedLabel: 'РћС‚РєСЂС‹С‚Рѕ',
    weaponLabel: 'РћСЂСѓР¶РёРµ',
    levelLabel: 'РЈСЂРѕРІРµРЅСЊ',
    nextBossLabel: 'Р‘РѕСЃСЃ',
    comboLabel: 'РљРѕРјР±Рѕ',
    dangerLabel: 'Р РёСЃРє',
    threatsLabel: 'РЈРіСЂРѕР·С‹',
    dropScanLabel: 'Р”СЂРѕРї',
    autoFireChip: 'РђР’РўРћ-РћР“РћРќР¬',
    bossLabel: 'Р‘РѕСЃСЃ',
    thumbSliderLabel: 'РЎР»Р°Р№РґРµСЂ',
    joystickLabel: '\u0414\u0436\u043e\u0439\u0441\u0442\u0438\u043a',
    leftButton: 'Р’Р›Р•Р’Рћ',
    forwardButton: '\u0412\u041f\u0415\u0420\u0415\u0414',
    rightButton: 'Р’РџР РђР’Рћ',
    boostButton: 'Р‘РЈРЎРў',
    questButton: 'Р—РђРњР•РўРљР',
    combatFeedTitle: 'Р›РµРЅС‚Р° Р±РѕСЏ',
    latestCallouts: 'РџРѕСЃР»РµРґРЅРёРµ СЃРѕР±С‹С‚РёСЏ',
    navHome: 'Р”РћРњ',
    navPlay: 'РР“Р Рђ',
    navCoop: '\u041a\u041e\u041e\u041f',
    navQuest: 'РљР’Р•РЎРў',
    battleArenaTitle: 'РђСЂРµРЅР° Р±РѕСЏ',
    battleArenaBody: 'РђРІС‚Рѕ-С€СѓС‚РµСЂ РЅР° РІС‹Р¶РёРІР°РЅРёРµ. Р”РІРёРіР°Р№СЃСЏ, СѓРєР»РѕРЅСЏР№СЃСЏ, СЃРѕР±РёСЂР°Р№ РґСЂРѕРї Рё РїСЂРѕР¶РёРіР°Р№ С„Р°Р·С‹ Р±РѕСЃСЃРѕРІ.',
    menuHeroKicker: 'РџСЂРµРјРёР°Р»СЊРЅС‹Р№ РјРѕР±РёР»СЊРЅС‹Р№ Р°РІС‚Рѕ-С€СѓС‚РµСЂ',
    autoFireFeature: 'РђРІС‚Рѕ-РѕРіРѕРЅСЊ',
    bossRushFeature: 'Р‘РѕСЃСЃС‹',
    weaponUnlocksFeature: 'РћСЂСѓР¶РёРµ',
    dangerTierLabel: 'РќР°РїСЂСЏР¶РµРЅРёРµ',
    aimAssistLabel: 'РќР°РІРѕРґРєР°',
    audioLabel: 'Р—РІСѓРє',
    bossLineupLabel: 'Р›РёРЅРёСЏ Р±РѕСЃСЃРѕРІ',
    highScoreLabel: 'Р РµРєРѕСЂРґ',
    difficultyLabel: 'РЎР»РѕР¶РЅРѕСЃС‚СЊ',
    godModeLabel: 'God Mode',
    controlsLabel: 'РЈРїСЂР°РІР»РµРЅРёРµ',
    pilotRecordTitle: 'Р РµРєРѕСЂРґС‹ РїРёР»РѕС‚Р°',
    storedLocallyLabel: 'РЎРѕС…СЂР°РЅСЏРµС‚СЃСЏ Р»РѕРєР°Р»СЊРЅРѕ',
    runsLabel: 'Р Р°РЅС‹',
    bossesLabel: 'Р‘РѕСЃСЃС‹',
    targetsLabel: 'Р¦РµР»Рё',
    bestComboLabel: 'Р›СѓС‡С€РµРµ РєРѕРјР±Рѕ',
    bestMetersLabel: 'Р›СѓС‡С€РёРµ РјРµС‚СЂС‹',
    tacticalBriefTitle: 'РўР°РєС‚РёРєР°',
    liveRunIntelLabel: 'РРЅС„Рѕ РїРµСЂРµРґ СЃС‚Р°СЂС‚РѕРј',
    loadoutLabel: 'РћСЂСѓР¶РёРµ',
    nextThreatLabel: 'РЎР»РµРґСѓСЋС‰Р°СЏ СѓРіСЂРѕР·Р°',
    rewardCodexTitle: 'РљРѕРґРµРєСЃ РґСЂРѕРїР°',
    pickupValueLabel: 'РџРѕР»РµР·РЅРѕСЃС‚СЊ',
    arsenalFloorTitle: 'РђСЂСЃРµРЅР°Р»',
    dropToUnlockLabel: 'РџРѕРґР±РµСЂРё Рё РѕС‚РєСЂРѕР№',
    startRunButton: 'РЎРўРђР Рў',
    pausedEyebrow: 'РџР°СѓР·Р°',
    runFrozenTitle: 'Р Р°РЅ Р·Р°РјРѕСЂРѕР¶РµРЅ',
    pauseBody: 'РџРµСЂРµРґРѕС…РЅРё Рё СЃСЂР°Р·Сѓ РІРѕР·РІСЂР°С‰Р°Р№СЃСЏ РІ Р±РѕР№.',
    threatLabel: 'РЈРіСЂРѕР·Р°',
    resumeButton: 'РџР РћР”РћР›Р–РРўР¬',
    exitToMenuButton: 'Р’ РњР•РќР®',
    runNotesTitle: 'Р—Р°РјРµС‚РєРё',
    closeButton: 'Р—РђРљР Р«РўР¬',
    gameOverEyebrow: 'РљРѕРЅРµС† РёРіСЂС‹',
    runCompleteTitle: 'Р Р°РЅ Р·Р°РІРµСЂС€РµРЅ',
    runRankLabel: 'Р Р°РЅРі СЂР°РЅР°',
    finalScoreLabel: 'Р¤РёРЅР°Р»СЊРЅС‹Р№ СЃС‡РµС‚',
    tryAgainButton: 'Р•Р©Р• Р РђР—',
    backToMenuButton: 'РќРђР—РђР” Р’ РњР•РќР®',
    teamPlayTitle: '\u041a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u0438\u0433\u0440\u0430',
    teamPlayMeta: '\u0414\u043e 3 \u0438\u0433\u0440\u043e\u043a\u043e\u0432',
    findGameLabel: '\u041d\u0430\u0439\u0442\u0438 \u0438\u0433\u0440\u0443',
    hostGameLabel: '\u0421\u0442\u0430\u0442\u044c \u0445\u043e\u0441\u0442\u043e\u043c',
    hostGameHint: '\u0421\u043e\u0437\u0434\u0430\u0439 \u043b\u043e\u0431\u0431\u0438 \u0438 \u0436\u0434\u0438 \u0441\u043e\u044e\u0437\u043d\u0438\u043a\u043e\u0432.',
    noLobbyNow: '\u0412 \u0434\u0430\u043d\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 \u043b\u043e\u0431\u0431\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e.',
    hostOffline: '\u0425\u043e\u0441\u0442 \u043e\u0444\u043b\u0430\u0439\u043d',
    hostOnline: '\u0425\u043e\u0441\u0442 \u043e\u043d\u043b\u0430\u0439\u043d. \u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435 \u0438\u0433\u0440\u043e\u043a\u043e\u0432...',
    joinLobbyLabel: '\u0412\u041e\u0419\u0422\u0418',
    leaveLobbyLabel: '\u0412\u042b\u0419\u0422\u0418',
    lobbyFullLabel: '\u041f\u041e\u041b\u041d\u041e',
    lobbyHostedLabel: '\u0425\u041e\u0421\u0422',
    joinedLobbyLabel: '\u0412 \u043b\u043e\u0431\u0431\u0438',
    onLabel: 'Р’РљР›',
    offLabel: 'Р’Р«РљР›',
    safeLabel: 'РЎРџРћРљРћР™РќРћ',
    bossActiveLabel: 'Р‘РћРЎРЎ',
  },
};

const input = {
  left: false,
  up: false,
  right: false,
  down: false,
  sliderActive: false,
  stickX: 0,
  stickY: 0,
  stickTargetX: 0,
  stickTargetY: 0,
};

const audio = {
  ctx: null,
  musicProfile: 'menu',
  musicElements: {},
  activeMusicKey: '',
  musicFadeTimer: null,
  musicUnlocked: false,
  ensureCtx() {
    if (this.ctx) return this.ctx;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      this.ctx = null;
    }
    return this.ctx;
  },
  tone(freq, duration, type = 'square', gainValue = 0.03) {
    if (typeof state !== 'undefined' && !state.audioEnabled) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
    if (!this.musicUnlocked) {
      this.musicUnlocked = true;
      this.updateMusicProfile();
    }
  },
  markInteraction() {
    if (!this.musicUnlocked) {
      this.musicUnlocked = true;
    }
    this.updateMusicProfile();
  },
  initMusicElements() {
    const allSources = {
      ...MUSIC_TRACKS,
      ...(typeof getCustomMusicSources === 'function' ? getCustomMusicSources() : {}),
    };
    Object.entries(allSources).forEach(([key, source]) => {
      const existing = this.musicElements[key];
      if (existing && existing.dataset?.source === source) {
        return;
      }
      const track = new Audio(source);
      track.loop = true;
      track.preload = 'auto';
      track.volume = 0;
      track.dataset.source = source;
      this.musicElements[key] = track;
    });
  },
  getTrackConfig(profile) {
    const selectedOverride = typeof getSelectedMusicTrackConfig === 'function'
      ? getSelectedMusicTrackConfig(profile)
      : null;
    if (selectedOverride) {
      return selectedOverride;
    }
    switch (profile) {
      case 'menu':
        return { key: 'menu', volume: 0.22, rate: 0.92 };
      case 'battle':
        return { key: 'battle', volume: 0.34, rate: 1.0 };
      case 'epic':
        return { key: 'epic', volume: 0.42, rate: 1.04 };
      case 'boss':
        return { key: 'boss', volume: 0.44, rate: 1.0 };
      case 'bossEpic':
        return { key: 'bossEpic', volume: 0.5, rate: 1.06 };
      default:
        return { key: 'battle', volume: 0.34, rate: 1.0 };
    }
  },
  clearFadeTimer() {
    if (this.musicFadeTimer) {
      window.clearInterval(this.musicFadeTimer);
      this.musicFadeTimer = null;
    }
  },
  fadeMusicTo(activeTrack, targetVolume) {
    this.clearFadeTimer();
    this.musicFadeTimer = window.setInterval(() => {
      let pending = false;
      Object.values(this.musicElements).forEach((track) => {
        const isActive = track === activeTrack;
        const goal = isActive ? targetVolume : 0;
        if (Math.abs(track.volume - goal) < 0.01) {
          track.volume = goal;
          if (!isActive && !track.paused) track.pause();
          return;
        }
        const step = isActive ? 0.02 : 0.03;
        if (track.volume < goal) track.volume = Math.min(goal, track.volume + step);
        else track.volume = Math.max(goal, track.volume - step);
        pending = true;
      });
      if (!pending) this.clearFadeTimer();
    }, 60);
  },
  playMusicProfile(profile) {
    this.initMusicElements();
    const config = this.getTrackConfig(profile);
    const targetTrack = this.musicElements[config.key];
    if (!targetTrack) return;
    targetTrack.playbackRate = config.rate;
    if (this.activeMusicKey !== config.key) {
      this.activeMusicKey = config.key;
      targetTrack.currentTime = targetTrack.currentTime % Math.max(1, targetTrack.duration || 1);
      const playPromise = targetTrack.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } else if (targetTrack.paused) {
      const playPromise = targetTrack.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
    this.fadeMusicTo(targetTrack, config.volume);
  },
  stopMusic() {
    this.clearFadeTimer();
    this.activeMusicKey = '';
    Object.values(this.musicElements).forEach((track) => {
      track.volume = 0;
      if (!track.paused) {
        track.pause();
      }
      track.currentTime = 0;
    });
  },
  silenceMusic() {
    this.clearFadeTimer();
    this.activeMusicKey = '';
    Object.values(this.musicElements).forEach((track) => {
      track.volume = 0;
      if (!track.paused) {
        track.pause();
      }
    });
  },
  getTargetMusicProfile() {
    if (typeof state === 'undefined' || !state.run) return 'menu';
    if (!state.audioEnabled) return 'silent';
    if (state.mode !== 'playing') return 'menu';
    if (state.run.phase === 'boss') return state.run.bossesDefeated > 0 ? 'bossEpic' : 'boss';
    if (state.run.bossesDefeated > 0) return 'epic';
    return 'battle';
  },
  updateMusicProfile() {
    const target = this.getTargetMusicProfile();
    if (target === 'silent') {
      this.silenceMusic();
      return;
    }
    if (!this.musicUnlocked) return;
    if (this.musicProfile !== target) {
      this.musicProfile = target;
    }
    this.playMusicProfile(this.musicProfile);
  },
  shoot() { this.tone(520, 0.05, 'square', 0.02); },
  pickup() { this.tone(760, 0.09, 'sine', 0.03); },
  hit() { this.tone(160, 0.14, 'sawtooth', 0.035); },
  bossHit() { this.tone(210, 0.08, 'triangle', 0.03); },
  bossDefeat() {
    [420, 520, 640, 820].forEach((freq, index) => {
      window.setTimeout(() => this.tone(freq, 0.14, 'square', 0.03), index * 80);
    });
    [880, 1040, 1320].forEach((freq, index) => {
      window.setTimeout(() => this.tone(freq, 0.18, 'triangle', 0.028), 320 + index * 110);
    });
  },
  bossScream() {
    if (typeof state !== 'undefined' && !state.audioEnabled) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    const start = ctx.currentTime;
    const osc = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const gain = ctx.createGain();
    const modGain = ctx.createGain();
    osc.type = 'sawtooth';
    mod.type = 'triangle';
    osc.frequency.setValueAtTime(340, start);
    osc.frequency.exponentialRampToValueAtTime(130, start + 1.05);
    mod.frequency.setValueAtTime(11, start);
    mod.frequency.exponentialRampToValueAtTime(3.5, start + 1.05);
    modGain.gain.setValueAtTime(18, start);
    modGain.gain.exponentialRampToValueAtTime(2.5, start + 1.05);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.055, start + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(ctx.destination);
    mod.start(start);
    osc.start(start);
    mod.stop(start + 1.2);
    osc.stop(start + 1.2);
  },
};

Object.assign(I18N.en, {
  hullLabel: 'Hull',
  bossEtaLabel: 'Boss eta',
  navHangar: 'HANGAR',
  shipSkinLabel: 'Ship skin',
  weaponFinishLabel: 'Weapon finish',
  hangarTitle: 'Hangar',
  customizeRunLabel: 'Customize the run',
});

Object.assign(I18N.ru, {
  hullLabel: 'РљРћР РџРЈРЎ',
  bossEtaLabel: 'Р”Рћ Р‘РћРЎРЎРђ',
  navHangar: 'РђРќР“РђР ',
  shipSkinLabel: 'РЎРљРРќ',
  weaponFinishLabel: 'Р¤РРќРРЁ',
  hangarTitle: 'РђРќР“РђР ',
  customizeRunLabel: 'РќРђРЎРўР РћР™ РљРћР РђР‘Р›Р¬ Р РћР РЈР–РР•',
});

Object.assign(I18N.en, {
  menuLoadoutLabel: 'Loadout',
});

Object.assign(I18N.ru, {
  menuLoadoutLabel: 'РћР РЈР–РР•',
});

Object.assign(I18N.en, {
  navInventory: 'INVENTORY',
  navWallet: 'WALLET',
  navShop: 'SHOP',
  navCoop: 'TEAM',
});

Object.assign(I18N.ru, {
  navInventory: '\u0418\u041d\u0412\u0415\u041d\u0422\u0410\u0420\u042c',
  navWallet: '\u041a\u041e\u0428\u0415\u041b\u0415\u041a',
  navShop: '\u041c\u0410\u0413\u0410\u0417\u0418\u041d',
  navCoop: '\u041a\u041e\u041e\u041f',
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const STRICT_PALETTE_RGB = [
  { hex: STRICT_UI_COLORS.black, rgb: { r: 0, g: 0, b: 0 } },
  { hex: STRICT_UI_COLORS.white, rgb: { r: 255, g: 255, b: 255 } },
  { hex: STRICT_UI_COLORS.cream, rgb: { r: 242, g: 230, b: 213 } },
  { hex: STRICT_UI_COLORS.orange, rgb: { r: 242, g: 138, b: 26 } },
];

function toRgb(color) {
  if (!color) return null;
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const normalized = hex.length === 3
      ? hex.split('').map((char) => char + char).join('')
      : hex.length === 8
        ? hex.slice(0, 6)
        : hex;
    if (normalized.length !== 6) return null;
    const value = Number.parseInt(normalized, 16);
    if (Number.isNaN(value)) return null;
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }
  const rgbMatch = color.match(/rgba?\(([^)]+)\)/i);
  if (!rgbMatch) return null;
  const [r, g, b] = rgbMatch[1].split(',').map((part) => Number.parseFloat(part.trim()));
  if (![r, g, b].every((entry) => Number.isFinite(entry))) return null;
  return { r, g, b };
}

function extendStrictCanvasPalette(colors) {
  colors.forEach((color) => {
    if (typeof color !== 'string' || !color) return;
    const normalized = color.startsWith('#') ? color.slice(0, 7).toLowerCase() : color.toLowerCase();
    if (STRICT_PALETTE_RGB.some((entry) => entry.hex.toLowerCase() === normalized)) return;
    const rgb = toRgb(color);
    if (!rgb) return;
    STRICT_PALETTE_RGB.push({ hex: normalized, rgb });
  });
}

extendStrictCanvasPalette(EXTENDED_BOSS_COLORS);

function constrainPaletteColor(color) {
  const rgb = toRgb(color);
  if (!rgb) return color;
  let nearest = STRICT_PALETTE_RGB[0].hex;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const candidate of STRICT_PALETTE_RGB) {
    const dr = rgb.r - candidate.rgb.r;
    const dg = rgb.g - candidate.rgb.g;
    const db = rgb.b - candidate.rgb.b;
    const distance = dr * dr + dg * dg + db * db;
    if (distance < nearestDistance) {
      nearest = candidate.hex;
      nearestDistance = distance;
    }
  }
  return nearest;
}

function withAlpha(color, alpha) {
  const constrained = constrainPaletteColor(color);
  if (constrained.startsWith('#')) {
    const hex = constrained.slice(1);
    const normalized = hex.length === 3
      ? hex.split('').map((char) => char + char).join('')
      : hex;
    const value = Number.parseInt(normalized, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (constrained.startsWith('rgb(')) {
    return constrained.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
  if (constrained.startsWith('rgba(')) {
    const parts = constrained.slice(5, -1).split(',').map((entry) => entry.trim());
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }
  return constrained;
}

const COLOR_STYLE_PROPERTY_RE = /(color|fill|stroke)$/i;

function extractRgbaAlpha(color) {
  if (typeof color !== 'string') return null;
  const match = color.match(/rgba\(\s*[\d.\s]+,\s*[\d.\s]+,\s*[\d.\s]+,\s*([\d.]+)\s*\)/i);
  if (!match) return null;
  const alpha = Number.parseFloat(match[1]);
  return Number.isFinite(alpha) ? clamp(alpha, 0, 1) : null;
}

function isStrictMobilePaletteMode() {
  return typeof window !== 'undefined' && (window.innerWidth || 0) <= 760;
}

function normalizeStyleForPalette(property, value) {
  const raw = value == null ? '' : String(value);
  if (!raw || !isStrictMobilePaletteMode()) return raw;

  if (property === 'background' || property === 'backgroundImage') {
    return '#000000';
  }

  if (/gradient\(/i.test(raw)) {
    return '#000000';
  }

  if (property.startsWith('--')) {
    if (/^#|rgba?\(/i.test(raw.trim())) {
      const alpha = extractRgbaAlpha(raw);
      return alpha == null ? constrainPaletteColor(raw) : withAlpha(raw, alpha);
    }
    return raw;
  }

  if (
    COLOR_STYLE_PROPERTY_RE.test(property)
    || property === 'borderColor'
    || property === 'outlineColor'
    || property === 'caretColor'
  ) {
    const alpha = extractRgbaAlpha(raw);
    return alpha == null ? constrainPaletteColor(raw) : withAlpha(raw, alpha);
  }

  return raw;
}

function setTextContent(element, value) {
  if (!element) return;
  const normalized = normalizeUiText(value);
  if (element.textContent !== normalized) {
    element.textContent = normalized;
    if (element.classList.contains('value-anim') || element.dataset.animate === 'value') {
      element.classList.remove('premium-value-pulse');
      void element.offsetWidth;
      element.classList.add('premium-value-pulse');
    }
  }
}

function setStyleValue(element, property, value) {
  if (!element || !property) return;
  const normalizedValue = normalizeStyleForPalette(property, value ?? '');
  if (property.startsWith('--')) {
    if (element.style.getPropertyValue(property) !== normalizedValue) {
      element.style.setProperty(property, normalizedValue);
    }
    return;
  }
  if (element.style[property] !== normalizedValue) {
    element.style[property] = normalizedValue;
  }
}

function triggerPremiumPressFeedback(target, clientX, clientY) {
  if (!target || !(target instanceof HTMLElement)) return;
  target.classList.add('premium-interactive-target');
  target.classList.remove('premium-press');
  void target.offsetWidth;
  target.classList.add('premium-press');
  window.setTimeout(() => {
    target.classList.remove('premium-press');
  }, 170);

  const rect = target.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'premium-ripple-wave';
  const x = typeof clientX === 'number' ? clientX - rect.left : rect.width / 2;
  const y = typeof clientY === 'number' ? clientY - rect.top : rect.height / 2;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.addEventListener('animationend', () => ripple.remove());
  target.appendChild(ripple);

  const now = performance.now();
  if (!triggerPremiumPressFeedback.lastHapticAt || now - triggerPremiumPressFeedback.lastHapticAt > 70) {
    triggerPremiumPressFeedback.lastHapticAt = now;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigator.vibrate(7);
      }
    } catch (_) {
      // Vibration is optional enhancement and should never interrupt interaction feedback.
    }
  }
}

function enablePremiumMotionFx() {
  if (document.body.dataset.premiumFxBound === '1') return;
  document.body.dataset.premiumFxBound = '1';
  const targetSelector = 'button, .buy-token-link';

  document.addEventListener('pointerdown', (event) => {
    const target = event.target instanceof Element ? event.target.closest(targetSelector) : null;
    if (!target || !(target instanceof HTMLElement)) return;
    if (target.closest('#game-canvas')) return;
    triggerPremiumPressFeedback(target, event.clientX, event.clientY);
  }, { capture: true });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const active = document.activeElement;
    if (!active || !(active instanceof HTMLElement) || !active.matches(targetSelector)) return;
    triggerPremiumPressFeedback(active);
  }, true);
}

function localizedText(value) {
  if (value && typeof value === 'object' && ('en' in value || 'ru' in value)) {
    return normalizeUiText(value[state.language] || value.en || '');
  }
  return normalizeUiText(value);
}

function t(key) {
  return normalizeUiText(I18N[state.language]?.[key] || I18N.en[key] || key);
}

function countSuspiciousMojibakeChars(value) {
  return (value.match(MOJIBAKE_SENTINEL_GLOBAL_RE) || []).length;
}

function countMojibakeLeadChars(value) {
  return (value.match(/[РС]/g) || []).length;
}

function countCyrillicChars(value) {
  return (value.match(/[А-Яа-яЁё]/g) || []).length;
}

function looksLikeUtf8DecodedAsCp1251(value) {
  if (typeof value !== 'string' || !value) return false;
  const cyrCount = countCyrillicChars(value);
  if (cyrCount < 4) return false;
  const leadRatio = countMojibakeLeadChars(value) / cyrCount;
  return leadRatio > 0.34 && /[РС][А-Яа-яЁё]/u.test(value);
}

function normalizeUiText(value) {
  if (typeof value !== 'string' || !value) {
    return value;
  }

  const hasMojibakeSentinel = MOJIBAKE_SENTINEL_RE.test(value);
  const hasUtf8Cp1251Pattern = looksLikeUtf8DecodedAsCp1251(value);
  if (!hasMojibakeSentinel && !hasUtf8Cp1251Pattern) {
    return value;
  }

  const bytes = [];
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code <= 0x7f) {
      bytes.push(code);
      continue;
    }

    const mappedByte = CP1251_BYTE_BY_CHAR.get(char);
    if (mappedByte === undefined) {
      return value;
    }
    bytes.push(mappedByte);
  }

  try {
    const repaired = UTF8_DECODER.decode(new Uint8Array(bytes));
    const originalScore = countSuspiciousMojibakeChars(value);
    const repairedScore = countSuspiciousMojibakeChars(repaired);
    const originalLeadRatio = countCyrillicChars(value) > 0
      ? countMojibakeLeadChars(value) / countCyrillicChars(value)
      : 1;
    const repairedLeadRatio = countCyrillicChars(repaired) > 0
      ? countMojibakeLeadChars(repaired) / countCyrillicChars(repaired)
      : 1;
    const repairedLooksLegible = /[А-Яа-яЁё]{2,}|[A-Za-z]{4,}/.test(repaired);
    const scoreImproved = repairedScore < originalScore;
    const ratioImproved = repairedLeadRatio + 0.06 < originalLeadRatio;
    return repairedLooksLegible && (scoreImproved || ratioImproved) ? repaired : value;
  } catch {
    return value;
  }
}

function hexToRgb(color) {
  if (!color || !color.startsWith('#')) return null;
  const hex = color.slice(1);
  const normalized = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex;
  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function blendColor(base, tint, amount = 0.2) {
  const from = hexToRgb(base);
  const to = hexToRgb(tint);
  if (!from || !to) return base;
  const mix = clamp(amount, 0, 1);
  const r = Math.round(from.r + (to.r - from.r) * mix);
  const g = Math.round(from.g + (to.g - from.g) * mix);
  const b = Math.round(from.b + (to.b - from.b) * mix);
  return `rgb(${r}, ${g}, ${b})`;
}

function getWeaponName(weaponId) {
  return localizedText(WEAPON_TITLES[weaponId]) || WEAPONS[weaponId]?.label || weaponId.toUpperCase();
}

function getShipSkin() {
  return SHIP_SKINS.find((skin) => skin.id === state.shipSkin) || SHIP_SKINS[0];
}

function getShipSkinName() {
  return localizedText(getShipSkin().label);
}

function isPremiumAccessActive() {
  return state.walletConnected && state.napiwasBalance >= PREMIUM_NAPIWAS_THRESHOLD;
}

function getPremiumAccessPercent() {
  if (PREMIUM_NAPIWAS_THRESHOLD <= 0) return 100;
  return clamp((state.napiwasBalance / PREMIUM_NAPIWAS_THRESHOLD) * 100, 0, 100);
}

function setProgressRing(element, percent, accentColor) {
  if (!element) return;
  const safePercent = clamp(percent, 0, 100);
  setStyleValue(element, '--progress-angle', `${safePercent * 3.6}deg`);
  setStyleValue(element, '--ring-accent', accentColor);
}

function formatUiInteger(value) {
  const safeValue = Number.isFinite(Number(value)) ? Math.max(0, Math.trunc(Number(value))) : 0;
  return new Intl.NumberFormat(state.language === 'ru' ? 'ru-RU' : 'en-US').format(safeValue);
}

function normalizeStringArray(values, allowedValues) {
  const allowed = new Set(allowedValues);
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => String(value || '').trim())
    .filter((value, index, source) => value && allowed.has(value) && source.indexOf(value) === index);
}

function canUseSkin(skinId) {
  const skin = SHIP_SKINS.find((entry) => entry.id === skinId);
  if (!skin) return false;
  if (state.purchasedSkins.has(skinId)) return true;
  if (skin.questReward) {
    return state.questSkinUnlocks.has(skinId);
  }
  if (!skin.premium) return true;
  return isPremiumAccessActive();
}

function getSkinShopPrice(skinId) {
  return Math.max(0, Number(SHOP_SKIN_PRICES[skinId] || 0));
}

function isSkinPurchasable(skinId) {
  const skin = SHIP_SKINS.find((entry) => entry.id === skinId);
  if (!skin) return false;
  if (skin.id === 'classic') return false;
  if (canUseSkin(skinId)) return false;
  return getSkinShopPrice(skinId) > 0;
}

function purchaseSkin(skinId) {
  if (!isSkinPurchasable(skinId)) {
    selectSkin(skinId);
    return;
  }
  const skin = SHIP_SKINS.find((entry) => entry.id === skinId);
  if (!skin) return;
  const price = getSkinShopPrice(skinId);
  if (state.beerBalance < price) {
    const missing = price - state.beerBalance;
    pushEvent(
      'SHOP',
      state.language === 'ru' ? `Не хватает ${missing} кружек.` : `Need ${missing} more mugs.`,
      '#ff9d7f',
    );
    return;
  }
  state.beerBalance -= price;
  state.purchasedSkins.add(skinId);
  state.shipSkin = skinId;
  saveSettings();
  pushEvent(
    'SHOP',
    state.language === 'ru'
      ? `Куплен скин ${localizedText(skin.label)}.`
      : `${localizedText(skin.label)} skin purchased.`,
    skin.accent,
  );
  syncUI();
}

function ensureSkinAccess() {
  if (!canUseSkin(state.shipSkin)) {
    state.shipSkin = 'classic';
  }
}

function getLiveMetaValue(metric) {
  const currentRunValue = state.run?.metaCommitted ? 0 : Number(state.run?.[metric]) || 0;
  if (metric === 'bestMeters') {
    return Math.max(Number(state.metaStats.bestMeters) || 0, Number(state.run?.meters) || 0);
  }
  if (metric === 'bestCombo') {
    return Math.max(Number(state.metaStats.bestCombo) || 1, Number(state.run?.comboMultiplier) || 1);
  }
  return Math.max(0, Number(state.metaStats[metric]) || 0) + Math.max(0, currentRunValue);
}

function getQuestProgress(quest) {
  const current = getLiveMetaValue(quest.metric);
  const target = Math.max(1, Number(quest.target) || 1);
  const claimed = state.questClaimed.has(quest.id);
  const ready = !claimed && current >= target;
  return {
    current,
    target,
    claimed,
    ready,
    percent: clamp((current / target) * 100, 0, 100),
  };
}

function getQuestRewardLabel(reward) {
  if (!reward || typeof reward !== 'object') return '';
  if (reward.kind === 'beer') {
    return state.language === 'ru' ? `+${reward.amount} кружек` : `+${reward.amount} mugs`;
  }
  if (reward.kind === 'weapon') {
    return state.language === 'ru'
      ? `Оружие ${getWeaponName(reward.weaponId)}`
      : `${getWeaponName(reward.weaponId)} weapon`;
  }
  if (reward.kind === 'skin') {
    const skin = SHIP_SKINS.find((entry) => entry.id === reward.skinId);
    return state.language === 'ru'
      ? `Скин ${localizedText(skin?.label || reward.skinId)}`
      : `${localizedText(skin?.label || reward.skinId)} skin`;
  }
  return '';
}

function getQuestRewardKindLabel(reward) {
  if (!reward || typeof reward !== 'object') return '';
  if (reward.kind === 'beer') return state.language === 'ru' ? 'ПИВО' : 'BEER';
  if (reward.kind === 'weapon') return state.language === 'ru' ? 'ОРУЖИЕ' : 'WEAPON';
  if (reward.kind === 'skin') return state.language === 'ru' ? 'СКИН' : 'SKIN';
  return '';
}

function claimQuestReward(questId) {
  const quest = QUEST_DEFS.find((entry) => entry.id === questId);
  if (!quest) return;
  const progress = getQuestProgress(quest);
  if (progress.claimed) return;
  if (!progress.ready) {
    pushEvent('QUEST', state.language === 'ru' ? 'Контракт еще не выполнен.' : 'Contract is not complete yet.', '#ff9d7f');
    return;
  }

  state.questClaimed.add(quest.id);
  const reward = quest.reward || {};
  if (reward.kind === 'beer') {
    state.beerBalance += Math.max(0, Number(reward.amount) || 0);
    pushEvent('QUEST', state.language === 'ru' ? `Награда: +${reward.amount} кружек.` : `Reward: +${reward.amount} mugs.`, '#f0a544');
  } else if (reward.kind === 'weapon' && WEAPONS[reward.weaponId]) {
    state.permanentWeaponUnlocks.add(reward.weaponId);
    state.preferredWeapon = reward.weaponId;
    if (state.run?.unlockedWeapons) {
      state.run.unlockedWeapons.add(reward.weaponId);
      state.run.weapon = reward.weaponId;
    }
    pushEvent('QUEST', state.language === 'ru' ? `${getWeaponName(reward.weaponId)} открыт навсегда.` : `${getWeaponName(reward.weaponId)} unlocked permanently.`, WEAPONS[reward.weaponId].color);
  } else if (reward.kind === 'skin' && SHIP_SKINS.some((entry) => entry.id === reward.skinId)) {
    state.questSkinUnlocks.add(reward.skinId);
    state.shipSkin = reward.skinId;
    pushEvent('QUEST', state.language === 'ru' ? `Скин ${getShipSkinName()} получен.` : `${getShipSkinName()} skin unlocked.`, getShipSkin().accent);
  }

  ensureSkinAccess();
  void postLiveEvent('questClaim', quest.id);
  saveSettings();
  syncUI();
}

function getBeerReward(kind) {
  return BEER_REWARD_TABLE[kind] || 1;
}

function rewardBeerCurrency(kind, x, y) {
  const reward = getBeerReward(kind);
  state.beerBalance += reward;
  addFloatingText(x, y - 14, `+${reward} MUG`, '#ffb85c');
  pushEvent(state.language === 'ru' ? 'РљР РЈР–РљР' : 'MUGS', `+${reward} ${state.language === 'ru' ? 'Р·Р°' : 'for'} ${getTargetTitle(kind)}`, '#ffb85c');
  saveSettings();
}

function initSpriteAssets() {
  if (spriteAssets.loaded) return;
  spriteAssets.loaded = true;
  Object.entries(SPRITE_SOURCES).forEach(([key, source]) => {
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => {
      uiCache.weaponDockKey = '';
      syncUI();
      render();
    });
    image.src = source;
    spriteAssets.images[key] = image;
  });
}

function getSprite(key) {
  const image = spriteAssets.images[key];
  if (!image) return null;
  if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) return null;
  return image;
}

function formatWalletAddress(address) {
  if (!address) return state.language === 'ru' ? 'Не подключен' : 'Not connected';
  if (address.length < 16) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function parseBigInt(value, fallback = 0n) {
  try {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(Math.trunc(value));
    if (typeof value === 'string') return BigInt(value);
    return fallback;
  } catch {
    return fallback;
  }
}

function toWholeJettonBalance(rawBalance, decimals) {
  const raw = parseBigInt(rawBalance, 0n);
  const precision = Math.max(0, Math.floor(Number(decimals) || 0));
  const divider = 10n ** BigInt(precision);
  return raw / divider;
}

function normalizeWholeBalance(balance) {
  const safeMax = BigInt(Number.MAX_SAFE_INTEGER);
  return Number(balance > safeMax ? safeMax : balance);
}

function applyWalletDisconnected(announce = false) {
  const wasConnected = state.walletConnected || Boolean(state.walletAddress);
  state.walletConnected = false;
  state.walletAddress = '';
  state.napiwasBalance = 0;
  ensureSkinAccess();
  saveSettings();
  syncUI();
  if (announce && wasConnected) {
    pushEvent('TON', state.language === 'ru' ? 'TON кошелек отключен.' : 'TON wallet disconnected.', '#ff9d7f');
  }
}

async function ensureTonWalletClient() {
  if (tonWallet.initPromise) return tonWallet.initPromise;
  tonWallet.initPromise = (async () => {
    const module = await import(TON_CONNECT_SDK_URL);
    const TonConnectUI = module.TonConnectUI || module.default?.TonConnectUI || module.default;
    if (!TonConnectUI) throw new Error('TON Connect SDK failed to load.');
    if (typeof tonWallet.statusUnsubscribe === 'function') {
      tonWallet.statusUnsubscribe();
      tonWallet.statusUnsubscribe = null;
    }
    tonWallet.ui = new TonConnectUI({ manifestUrl: TON_CONNECT_MANIFEST_URL });
    tonWallet.statusUnsubscribe = tonWallet.ui.onStatusChange(
      (wallet) => {
        if (!wallet?.account?.address) {
          applyWalletDisconnected(false);
          return;
        }
        state.walletConnected = true;
        state.walletAddress = wallet.account.address;
        saveSettings();
        syncUI();
        void refreshTonBalance({ silent: true, skipConnectedCheck: true });
      },
      () => {},
    );
    if (typeof tonWallet.ui.restoreConnection === 'function') {
      await tonWallet.ui.restoreConnection();
    }
    tonWallet.isReady = true;
    if (tonWallet.ui.connected && tonWallet.ui.account?.address) {
      state.walletConnected = true;
      state.walletAddress = tonWallet.ui.account.address;
      saveSettings();
      syncUI();
      void refreshTonBalance({ silent: true, skipConnectedCheck: true });
    }
    return true;
  })();
  try {
    return await tonWallet.initPromise;
  } catch (error) {
    tonWallet.initPromise = null;
    tonWallet.isReady = false;
    throw error;
  }
}

async function readJsonResponseSafe(response) {
  const raw = await response.text();
  if (!raw) return { raw: '', json: null };
  try {
    return { raw, json: JSON.parse(raw) };
  } catch {
    return { raw, json: null };
  }
}

function createTonApiError(response, payload) {
  const detail = typeof payload?.json?.detail === 'string' ? payload.json.detail : '';
  const errorText = typeof payload?.json?.error === 'string' ? payload.json.error : '';
  const message = normalizeUiText(detail || errorText || payload?.raw || `TON API ${response.status}`);
  const error = new Error(message);
  error.statusCode = response.status;
  return error;
}

function normalizeJettonAddress(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeTonAddressInput(value) {
  return String(value || '').trim();
}

function isRawTonAddress(address) {
  return /^-?\d+:[0-9a-f]{64}$/i.test(address);
}

function isFriendlyTonAddress(address) {
  return /^[A-Za-z0-9_-]{48,64}$/.test(address);
}

function isTruncatedTonAddress(address) {
  return address.includes('...');
}

function createTonAddressError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = 'TON_ADDRESS_INVALID';
  return error;
}

async function resolveTonAccountAddress(walletAddress) {
  const normalizedInput = normalizeTonAddressInput(walletAddress);
  if (!normalizedInput || isTruncatedTonAddress(normalizedInput)) {
    throw createTonAddressError('Wallet address is invalid.');
  }

  const parseEndpoint = `${TON_API_BASE}/address/${encodeURIComponent(normalizedInput)}/parse`;
  const parseResponse = await fetch(parseEndpoint, {
    headers: { Accept: 'application/json' },
  });
  const parsePayload = await readJsonResponseSafe(parseResponse);
  if (parseResponse.ok) {
    const parsedAddress = normalizeTonAddressInput(
      parsePayload?.json?.bounceable?.b64url
      || parsePayload?.json?.raw_form
      || parsePayload?.json?.bounceable?.b64
      || normalizedInput,
    );
    if (parsedAddress) {
      return parsedAddress;
    }
  }

  const parseMessage = normalizeUiText(
    String(
      parsePayload?.json?.error
      || parsePayload?.json?.detail
      || parsePayload?.raw
      || '',
    ),
  );
  const likelyInvalid = /bad request|invalid|decode|address|format/i.test(parseMessage);
  const looksPlausible = isRawTonAddress(normalizedInput) || isFriendlyTonAddress(normalizedInput);
  if (!looksPlausible || likelyInvalid) {
    throw createTonAddressError(parseMessage || 'Wallet address is invalid.', parseResponse.status || 400);
  }

  return normalizedInput;
}

async function fetchNapiwasBalance(walletAddress) {
  const accountAddress = await resolveTonAccountAddress(walletAddress);
  const accountId = encodeURIComponent(accountAddress);
  const directEndpoint = `${TON_API_BASE}/accounts/${accountId}/jettons/${encodeURIComponent(NAPIWAS_CA)}`;
  const directResponse = await fetch(directEndpoint, {
    headers: { Accept: 'application/json' },
  });
  const directPayload = await readJsonResponseSafe(directResponse);
  if (directResponse.ok) {
    const payload = directPayload.json || {};
    const decimals = Number(payload?.jetton?.decimals ?? 9);
    const rawBalance = parseBigInt(payload?.balance ?? '0', 0n);
    const symbol = payload?.jetton?.symbol || 'NAPIWAS';
    return { rawBalance, decimals, symbol };
  }
  if (directResponse.status === 404) {
    return { rawBalance: 0n, decimals: 9, symbol: 'NAPIWAS' };
  }

  // Fallback endpoint for wallets/addresses that fail on direct jetton lookup.
  const listEndpoint = `${TON_API_BASE}/accounts/${accountId}/jettons`;
  const listResponse = await fetch(listEndpoint, {
    headers: { Accept: 'application/json' },
  });
  const listPayload = await readJsonResponseSafe(listResponse);
  if (listResponse.ok) {
    const balances = Array.isArray(listPayload?.json?.balances)
      ? listPayload.json.balances
      : Array.isArray(listPayload?.json?.jetton_balances)
        ? listPayload.json.jetton_balances
        : [];
    const targetAddress = normalizeJettonAddress(NAPIWAS_CA);
    const matched = balances.find((entry) => {
      const jettonAddress = normalizeJettonAddress(
        entry?.jetton?.address || entry?.jetton?.master || entry?.jetton_address || entry?.address,
      );
      return jettonAddress === targetAddress;
    });
    if (!matched) {
      return { rawBalance: 0n, decimals: 9, symbol: 'NAPIWAS' };
    }
    const decimals = Number(matched?.jetton?.decimals ?? matched?.decimals ?? 9);
    const rawBalance = parseBigInt(matched?.balance ?? matched?.amount ?? '0', 0n);
    const symbol = matched?.jetton?.symbol || matched?.symbol || 'NAPIWAS';
    return { rawBalance, decimals, symbol };
  }
  if (listResponse.status === 404) {
    return { rawBalance: 0n, decimals: 9, symbol: 'NAPIWAS' };
  }
  throw createTonApiError(listResponse, listPayload);
}

async function connectTonWallet() {
  if (tonWallet.isConnecting) return;
  tonWallet.isConnecting = true;
  audio.markInteraction();
  try {
    await ensureTonWalletClient();
    const wallet = await tonWallet.ui.connectWallet();
    if (wallet?.account?.address) {
      state.walletConnected = true;
      state.walletAddress = wallet.account.address;
      pushEvent('TON', state.language === 'ru' ? 'TON кошелек подключен.' : 'TON wallet connected.', '#86d1f2');
      void postLiveEvent('walletConnect', 'wallet connected');
      saveSettings();
      syncUI();
      await refreshTonBalance({ silent: true, skipConnectedCheck: true });
      return;
    }
    pushEvent('TON', state.language === 'ru' ? 'Подключение отменено.' : 'Connection cancelled.', '#ff9d7f');
  } catch {
    pushEvent('TON', state.language === 'ru' ? 'Не удалось подключить TON кошелек.' : 'Failed to connect TON wallet.', '#ff9d7f');
  } finally {
    tonWallet.isConnecting = false;
  }
}

async function disconnectTonWallet() {
  try {
    if (tonWallet.ui?.connected) {
      await tonWallet.ui.disconnect();
    }
  } catch {}
  applyWalletDisconnected(true);
}

async function refreshTonBalance(options = {}) {
  const { silent = false, skipConnectedCheck = false } = options;
  if (!skipConnectedCheck && !state.walletConnected) {
    if (!silent) {
      pushEvent('TON', state.language === 'ru' ? 'Сначала подключи TON кошелек.' : 'Connect TON wallet first.', '#ff9d7f');
    }
    return;
  }
  if (!state.walletAddress) {
    applyWalletDisconnected(false);
    return;
  }
  try {
    const latestWalletAddress = normalizeTonAddressInput(tonWallet.ui?.account?.address || state.walletAddress);
    if (!latestWalletAddress) {
      applyWalletDisconnected(false);
      return;
    }
    if (latestWalletAddress !== state.walletAddress) {
      state.walletAddress = latestWalletAddress;
    }

    const { rawBalance, decimals, symbol } = await fetchNapiwasBalance(state.walletAddress);
    const wholeBalance = toWholeJettonBalance(rawBalance, decimals);
    state.napiwasBalance = normalizeWholeBalance(wholeBalance);
    ensureSkinAccess();
    if (!silent) {
      pushEvent('TON', `${state.language === 'ru' ? 'Баланс обновлен:' : 'Balance synced:'} ${state.napiwasBalance} ${symbol}`, '#79d4b3');
    }
  } catch (error) {
    if (!silent) {
      const message = normalizeUiText(String(error?.message || ''));
      const likelyBadRequest = /bad request|invalid|decode|address/i.test(message);
      pushEvent(
        'TON',
        likelyBadRequest
          ? (state.language === 'ru' ? 'TON API отклонил адрес. Переподключи кошелек.' : 'TON API rejected wallet address. Reconnect wallet.')
          : (state.language === 'ru' ? 'Ошибка запроса баланса TON.' : 'Failed to sync TON balance.'),
        '#ff9d7f',
      );
    }
  }
  saveSettings();
  syncUI();
}

function getPlayerAlias() {
  if (state.walletConnected && state.walletAddress) {
    return formatWalletAddress(state.walletAddress).toUpperCase();
  }
  const suffix = (state.coop.clientId || 'pilot').slice(-4).toUpperCase();
  return `PILOT-${suffix}`;
}

function normalizePlayerAlias(alias, fallback = 'Pilot') {
  const trimmed = typeof alias === 'string' ? alias.trim() : '';
  return trimmed ? trimmed.slice(0, 24) : fallback;
}

function getMoscowDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function getRelativeMoscowDateKey(offsetDays) {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + offsetDays);
  return getMoscowDateKey(nextDate);
}

function getDailyRewardAmount(streak) {
  const index = Math.max(0, (Math.max(1, streak) - 1) % DAILY_REWARD_STEPS.length);
  return DAILY_REWARD_STEPS[index];
}

function canClaimDailyCheckin() {
  return state.daily.lastClaimDate !== getMoscowDateKey();
}

function getNapiwasBonusTier() {
  let activeTier = NAPIWAS_BONUS_TIERS[0];
  NAPIWAS_BONUS_TIERS.forEach((tier) => {
    if (state.napiwasBalance >= tier.min) activeTier = tier;
  });
  return activeTier;
}

function getBossBonusMugs() {
  const tier = getNapiwasBonusTier();
  const baseReward = 30 + state.run.level * 4;
  return Math.max(0, Math.round(baseReward * tier.bossMultiplier + tier.bossMugBonus));
}

function getScoreMilestoneMugs() {
  const tier = getNapiwasBonusTier();
  const baseReward = 16 + state.run.level * 2;
  return Math.max(0, Math.round(baseReward * tier.scoreMultiplier + tier.milestoneMugBonus));
}

function claimDailyCheckin() {
  if (!canClaimDailyCheckin()) {
    pushEvent('DAILY', state.language === 'ru' ? 'Чек-ин уже забран сегодня.' : 'Daily check-in already claimed today.', '#ffb85c');
    return;
  }
  const todayKey = getMoscowDateKey();
  const yesterdayKey = getRelativeMoscowDateKey(-1);
  state.daily.streak = state.daily.lastClaimDate === yesterdayKey ? state.daily.streak + 1 : 1;
  state.daily.totalClaims += 1;
  state.daily.lastClaimDate = todayKey;
  const reward = getDailyRewardAmount(state.daily.streak);
  state.beerBalance += reward;
  if (state.daily.streak >= 3) unlockMusicTrack('afterboss', false);
  if (state.daily.streak >= 7) unlockMusicTrack('blackfoam', false);
  pushEvent(
    'DAILY',
    state.language === 'ru'
      ? `Чек-ин ${state.daily.streak}. +${reward} кружек.`
      : `Check-in ${state.daily.streak}. +${reward} mugs.`,
    '#f28a1a',
  );
  void postLiveEvent('dailyCheckin', `streak ${state.daily.streak}`);
  saveSettings();
  syncUI();
}

function getMusicLibrary() {
  const builtIn = BONUS_TRACK_DEFS.map((track) => ({
    id: track.id,
    title: localizedText(track.title),
    source: track.source,
    custom: false,
    unlocked: state.unlockedTracks.has(track.id),
    unlockType: track.unlockType,
    target: track.target || 0,
  }));
  const custom = state.customTracks.map((track) => ({
    id: track.id,
    title: track.title,
    source: track.source,
    custom: true,
    unlocked: true,
    unlockType: 'custom',
    target: 0,
  }));
  return builtIn.concat(custom);
}

function findMusicTrack(trackId) {
  return getMusicLibrary().find((track) => track.id === trackId) || null;
}

function unlockMusicTrack(trackId, announce = true) {
  const track = BONUS_TRACK_DEFS.find((entry) => entry.id === trackId);
  if (!track || state.unlockedTracks.has(trackId)) return false;
  state.unlockedTracks.add(trackId);
  if (announce) {
    pushEvent('MUSIC', state.language === 'ru' ? `${localizedText(track.title)} открыт.` : `${localizedText(track.title)} unlocked.`, '#ffd053');
  }
  saveSettings();
  return true;
}

function syncUnlockedMusicTracks() {
  BONUS_TRACK_DEFS.forEach((track) => {
    if (track.unlockType === 'default') {
      state.unlockedTracks.add(track.id);
      return;
    }
    if (track.unlockType === 'bosses' && state.metaStats.bossesDefeated >= (track.target || 0)) {
      unlockMusicTrack(track.id, false);
      return;
    }
    if (track.unlockType === 'score' && state.highScore >= (track.target || 0)) {
      unlockMusicTrack(track.id, false);
    }
  });
  if (state.musicSelection !== 'auto') {
    const selectedTrack = findMusicTrack(state.musicSelection);
    if (!selectedTrack || !selectedTrack.unlocked) {
      state.musicSelection = 'auto';
    }
  }
}

function selectMusicTrack(trackId) {
  if (trackId !== 'auto') {
    const track = findMusicTrack(trackId);
    if (!track || !track.unlocked) return;
  }
  state.musicSelection = trackId;
  audio.activeMusicKey = '';
  audio.updateMusicProfile();
  saveSettings();
  syncUI();
}

function addAdminTrack() {
  const title = ui.adminTrackName?.value?.trim() || '';
  const source = ui.adminTrackUrl?.value?.trim() || '';
  if (!title || !/^https?:\/\//i.test(source)) {
    pushEvent('ADMIN', state.language === 'ru' ? 'Нужны title и https:// URL трека.' : 'Track title and https:// URL are required.', '#ff9d7f');
    return;
  }
  const nextTrack = {
    id: `custom-${Date.now()}`,
    title: title.slice(0, 40),
    source,
  };
  state.customTracks = [nextTrack, ...state.customTracks].slice(0, 8);
  state.unlockedTracks.add(nextTrack.id);
  ui.adminTrackName.value = '';
  ui.adminTrackUrl.value = '';
  saveSettings();
  audio.activeMusicKey = '';
  audio.updateMusicProfile();
  pushEvent('ADMIN', state.language === 'ru' ? `Трек ${nextTrack.title} добавлен.` : `Track ${nextTrack.title} added.`, '#79d4b3');
  syncUI();
}

function addAdminPartner() {
  const name = ui.adminPartnerName?.value?.trim() || '';
  const href = ui.adminPartnerUrl?.value?.trim() || '';
  if (!name || !/^https?:\/\//i.test(href)) {
    pushEvent('ADMIN', state.language === 'ru' ? 'Нужны имя и https:// URL партнера.' : 'Partner name and https:// URL are required.', '#ff9d7f');
    return;
  }
  state.customPartners = [
    { id: `partner-${Date.now()}`, name: name.slice(0, 24), href, note: state.language === 'ru' ? 'Партнерская ссылка' : 'Partner link' },
    ...state.customPartners,
  ].slice(0, 8);
  ui.adminPartnerName.value = '';
  ui.adminPartnerUrl.value = '';
  saveSettings();
  pushEvent('ADMIN', state.language === 'ru' ? `Партнер ${name} добавлен.` : `Partner ${name} added.`, '#79d4b3');
  syncUI();
}

function getSelectedMusicTrackConfig(profile) {
  if (state.musicSelection === 'auto') return null;
  if (profile === 'boss' || profile === 'bossEpic') return null;
  const selectedTrack = findMusicTrack(state.musicSelection);
  if (!selectedTrack || !selectedTrack.unlocked) return null;
  return {
    key: selectedTrack.id,
    volume: profile === 'menu' ? 0.2 : 0.34,
    rate: profile === 'epic' ? 1.03 : 1,
  };
}

function getCustomMusicSources() {
  return getMusicLibrary().reduce((accumulator, track) => {
    accumulator[track.id] = track.source;
    return accumulator;
  }, {});
}

function normalizeLeaderboardEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  return {
    rank: Math.max(1, Number(entry.rank) || 1),
    alias: normalizePlayerAlias(entry.alias || '', 'Pilot'),
    score: Math.max(0, Number(entry.score) || 0),
    meters: Math.max(0, Number(entry.meters) || 0),
    bosses: Math.max(0, Number(entry.bosses) || 0),
    walletTag: typeof entry.walletTag === 'string' ? entry.walletTag : '',
  };
}

function normalizeChallengeEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  return {
    id: typeof entry.id === 'string' ? entry.id : '',
    type: entry.type === 'bosses' ? 'bosses' : 'score',
    metricLabel: typeof entry.metricLabel === 'string' ? entry.metricLabel : 'Highest score',
    stake: Math.max(0, Number(entry.stake) || 0),
    status: typeof entry.status === 'string' ? entry.status : 'open',
    hostId: typeof entry.hostId === 'string' ? entry.hostId : '',
    hostAlias: normalizePlayerAlias(entry.hostAlias || '', 'Host'),
    guestId: typeof entry.guestId === 'string' ? entry.guestId : '',
    guestAlias: normalizePlayerAlias(entry.guestAlias || '', ''),
    winnerId: typeof entry.winnerId === 'string' ? entry.winnerId : '',
    createdAt: Number(entry.createdAt) || 0,
    updatedAt: Number(entry.updatedAt) || 0,
    results: entry.results && typeof entry.results === 'object' ? entry.results : {},
  };
}

function applyLivePayload(payload) {
  if (!payload || typeof payload !== 'object') return;
  if (Array.isArray(payload.leaderboard)) {
    state.live.leaderboard = payload.leaderboard.map(normalizeLeaderboardEntry).filter(Boolean);
  }
  if (Array.isArray(payload.challenges)) {
    state.live.challenges = payload.challenges.map(normalizeChallengeEntry).filter(Boolean);
  }
  if (payload.analytics && typeof payload.analytics === 'object') {
    state.live.analytics = {
      playersOnline: Math.max(0, Number(payload.analytics.playersOnline) || 0),
      counters: payload.analytics.counters && typeof payload.analytics.counters === 'object' ? payload.analytics.counters : {},
      recentEvents: Array.isArray(payload.analytics.recentEvents) ? payload.analytics.recentEvents.slice(0, 8) : [],
    };
  }
  if (Array.isArray(payload.partners)) {
    state.live.partners = payload.partners
      .filter((partner) => partner && typeof partner === 'object')
      .map((partner) => ({
        id: typeof partner.id === 'string' ? partner.id : `partner-${Math.random()}`,
        name: typeof partner.name === 'string' ? partner.name : 'Partner',
        href: typeof partner.href === 'string' ? partner.href : '#',
        note: typeof partner.note === 'string' ? partner.note : '',
      }));
  }
  state.live.lastSyncedAt = Date.now();
}

function shouldPollLiveData() {
  return state.mode === 'menu' && ['wallet', 'quests', 'shop'].includes(state.menuView);
}

function stopLivePolling() {
  if (state.live.pollTimerId) {
    window.clearInterval(state.live.pollTimerId);
    state.live.pollTimerId = 0;
  }
}

function ensureLivePolling() {
  if (!shouldPollLiveData()) {
    stopLivePolling();
    return;
  }
  if (!state.live.pollTimerId) {
    state.live.pollTimerId = window.setInterval(() => {
      void refreshLiveData({ silent: true });
    }, LIVE_POLL_MS);
  }
  if (!state.live.lastSyncedAt || Date.now() - state.live.lastSyncedAt > LIVE_POLL_MS / 2) {
    void refreshLiveData({ silent: true });
  }
}

async function refreshLiveData(options = {}) {
  if (state.live.requestPending) return;
  state.live.requestPending = true;
  try {
    const payload = await requestCoopApi('GET');
    applyLivePayload(payload);
  } catch (error) {
    if (!options.silent) {
      pushEvent('LIVE', state.language === 'ru' ? 'Live board временно недоступен.' : 'Live board is temporarily unavailable.', '#ff9d7f');
    }
  } finally {
    state.live.requestPending = false;
    syncUI();
  }
}

async function postLiveAction(action, extra = {}) {
  try {
    const payload = await requestCoopApi('POST', {
      action,
      clientId: state.coop.clientId,
      alias: getPlayerAlias(),
      ...extra,
    });
    applyLivePayload(payload);
    syncUI();
    return payload;
  } catch {
    return null;
  }
}

function postLiveEvent(type, detail) {
  return postLiveAction('analyticsEvent', { type, detail });
}

function submitLeaderboardRun() {
  return postLiveAction('leaderboardSubmit', {
    score: state.run.score,
    meters: state.run.meters,
    bosses: state.run.bossesDefeated,
    walletAddress: state.walletAddress,
    napiwasBalance: state.napiwasBalance,
  });
}

function getActiveChallenge() {
  return state.live.challenges.find((challenge) => {
    return challenge.hostId === state.coop.clientId || challenge.guestId === state.coop.clientId;
  }) || null;
}

function createPvpChallenge(type) {
  const normalizedType = type === 'bosses' ? 'bosses' : 'score';
  const stake = normalizedType === 'bosses' ? 180 : 120;
  if (state.beerBalance < stake) {
    pushEvent('PVP', state.language === 'ru' ? 'Не хватает кружек для ставки.' : 'Not enough mugs for that stake.', '#ff9d7f');
    return;
  }
  state.beerBalance -= stake;
  saveSettings();
  void postLiveAction('challengeCreate', { type: normalizedType, stake }).then((payload) => {
    if (!payload) {
      state.beerBalance += stake;
      saveSettings();
      syncUI();
      return;
    }
    pushEvent('PVP', state.language === 'ru' ? 'Ставка создана.' : 'Challenge created.', '#ffd053');
  });
}

function acceptPvpChallenge(challengeId) {
  const challenge = state.live.challenges.find((entry) => entry.id === challengeId);
  if (!challenge) return;
  if (state.beerBalance < challenge.stake) {
    pushEvent('PVP', state.language === 'ru' ? 'Не хватает кружек для принятия ставки.' : 'Not enough mugs to accept the duel.', '#ff9d7f');
    return;
  }
  state.beerBalance -= challenge.stake;
  saveSettings();
  void postLiveAction('challengeAccept', { challengeId }).then((payload) => {
    if (!payload) {
      state.beerBalance += challenge.stake;
      saveSettings();
      syncUI();
      return;
    }
    pushEvent('PVP', state.language === 'ru' ? 'Ставка принята.' : 'Challenge accepted.', '#79d4b3');
  });
}

function settleResolvedChallengeRewards() {
  const challenge = getActiveChallenge();
  if (!challenge || challenge.status !== 'resolved' || !challenge.winnerId) return;
  if (state.claimedChallengeRewards.has(challenge.id)) return;
  const playerWon = challenge.winnerId === state.coop.clientId;
  state.claimedChallengeRewards.add(challenge.id);
  if (playerWon) {
    const prize = challenge.stake * 2;
    state.beerBalance += prize;
    pushEvent('PVP', state.language === 'ru' ? `Победа в дуэли. +${prize} кружек.` : `Duel won. +${prize} mugs.`, '#ffd053');
  } else {
    pushEvent('PVP', state.language === 'ru' ? 'Дуэль завершена. Победил соперник.' : 'Duel resolved. Rival won.', '#ff9d7f');
  }
  saveSettings();
}

function submitChallengeRunIfNeeded() {
  const challenge = getActiveChallenge();
  if (!challenge || challenge.status !== 'live') return Promise.resolve(null);
  const alreadySubmitted = challenge.results && challenge.results[state.coop.clientId];
  if (alreadySubmitted) return Promise.resolve(null);
  return postLiveAction('challengeSubmit', {
    challengeId: challenge.id,
    score: state.run.score,
    meters: state.run.meters,
    bosses: state.run.bossesDefeated,
  });
}
function getWeaponFinish() {
  return WEAPON_FINISHES.find((finish) => finish.id === state.weaponFinish) || WEAPON_FINISHES[0];
}

function getWeaponFinishName() {
  return localizedText(getWeaponFinish().label);
}

function getWeaponColor(weaponId) {
  const finish = getWeaponFinish();
  return blendColor(WEAPONS[weaponId]?.color || '#ffd053', finish.tint, finish.mix);
}

function getWeaponGlyph(weaponId) {
  const glyphs = {
    standard: 'BR',
    spread: 'FM',
    laser: 'LZ',
    chainsaw: 'SW',
    missile: 'RK',
    paw: 'PW',
    bottle: 'BT',
    ice: 'IC',
    superLaser: 'XL',
  };
  return glyphs[weaponId] || getWeaponName(weaponId).slice(0, 2);
}

function getWeaponSpriteKey(weaponId) {
  const mapping = {
    standard: 'weaponDefault',
    spread: 'weaponSpread',
    laser: 'weaponLaser',
    chainsaw: 'weaponChainsaw',
    missile: 'weaponMissile',
    paw: 'weaponPaw',
    bottle: 'weaponBottle',
    ice: 'weaponIce',
  };
  return mapping[weaponId] || 'weaponDefault';
}

function getWeaponSpriteKeyByPickupKind(kind) {
  const mapping = {
    weaponSpread: 'weaponSpread',
    weaponLaser: 'weaponLaser',
    weaponChainsaw: 'weaponChainsaw',
    weaponMissile: 'weaponMissile',
    weaponPaw: 'weaponPaw',
    weaponBottle: 'weaponBottle',
    weaponIce: 'weaponIce',
  };
  return mapping[kind] || null;
}

function getTargetTitle(kind) {
  return localizedText(TARGET_TITLES[kind]) || TARGET_DEFS[kind]?.label || kind.toUpperCase();
}

function getEnemyTitle(kind) {
  return localizedText(ENEMY_TITLES[kind]) || ENEMY_DEFS[kind]?.label || kind.toUpperCase();
}

function applyLanguage() {
  document.documentElement.lang = state.language === 'ru' ? 'ru' : 'en';
  document.title = normalizeUiText('Napiwas game');
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (key) {
      setTextContent(element, t(key));
    }
  });
}

function formatSeconds(ms) {
  return `${Math.max(0, Math.ceil(ms / 1000))}s`;
}

function getDifficultyMeta(level) {
  const table = {
    1: { label: state.language === 'ru' ? 'РЎРїРѕРєРѕР№РЅРѕ' : 'Chill lanes', accent: '#79d4b3' },
    2: { label: state.language === 'ru' ? 'РђСЂРєР°РґРЅРѕ' : 'Arcade pressure', accent: '#86d1f2' },
    3: { label: state.language === 'ru' ? 'Р‘РѕСЃСЃ-СЂРµР¶РёРј' : 'Boss-ready', accent: '#ffd053' },
    4: { label: state.language === 'ru' ? 'РџР»РѕС‚РЅРѕ' : 'Crowded hail', accent: '#ffb85c' },
    5: { label: state.language === 'ru' ? 'РЁС‚РѕСЂРј' : 'Bullet storm', accent: '#ff7aa6' },
  };
  return table[level] || table[3];
}

function getWeaponBrief(weaponId) {
  const weapon = WEAPONS[weaponId];
  return {
    name: getWeaponName(weaponId),
    detail: state.language === 'ru'
      ? `РЈР РћРќ ${weapon.damage} | ${(1000 / weapon.cadence).toFixed(1)} РІС‹СЃС‚СЂ./СЃ`
      : `DMG ${weapon.damage} | ${(1000 / weapon.cadence).toFixed(1)} shots/s`,
    note: localizedText(WEAPON_BRIEFS[weaponId]) || (state.language === 'ru' ? 'РЎР±Р°Р»Р°РЅСЃРёСЂРѕРІР°РЅРЅС‹Р№ РєРѕРЅС‚СЂРѕР»СЊ РїРѕР»РѕСЃС‹.' : 'Balanced lane control.'),
  };
}

function getBossPatternBrief(pattern) {
  const localized = {
    spread: { en: 'Stay under the seams when the fan opens.', ru: 'Р”РµСЂР¶РёСЃСЊ РїРѕРґ С‰РµР»СЏРјРё, РєРѕРіРґР° РІРµРµСЂ СЂР°СЃРєСЂС‹РІР°РµС‚СЃСЏ.' },
    laser: { en: 'Short sidesteps beat greedy late dodges.', ru: 'РљРѕСЂРѕС‚РєРёРµ С€Р°РіРё Р»СѓС‡С€Рµ РїРѕР·РґРЅРёС… СЂС‹РІРєРѕРІ.' },
    rapid: { en: 'Hold calm micro-movements and avoid oversteer.', ru: 'РЎРїРѕРєРѕР№РЅС‹Рµ РјРёРєСЂРѕ-РґРІРёР¶РµРЅРёСЏ Р»СѓС‡С€Рµ РїР°РЅРёРєРё.' },
    homing: { en: 'Lead missiles away, then cut back under them.', ru: 'РЈРІРѕРґРё СЃР°РјРѕРЅР°РІРѕРґРєСѓ Рё РІРѕР·РІСЂР°С‰Р°Р№СЃСЏ РїРѕРґ РЅРµРµ.' },
    wave: { en: 'Read the sinus curve, not single bullets.', ru: 'Р§РёС‚Р°Р№ РІРѕР»РЅСѓ С†РµР»РёРєРѕРј, Р° РЅРµ РѕРґРЅСѓ РїСѓР»СЋ.' },
    chains: { en: 'Respect chain drift and do not hug walls.', ru: 'РЈС‡РёС‚С‹РІР°Р№ РґСЂРµР№С„ С†РµРїРµР№ Рё РЅРµ Р»РёРїРЅРё Рє СЃС‚РµРЅР°Рј.' },
    burst: { en: 'Prepare for sudden dense packets near center.', ru: 'Р–РґРё СЂРµР·РєРёРµ РїР»РѕС‚РЅС‹Рµ РїР°С‡РєРё РІРѕР·Р»Рµ С†РµРЅС‚СЂР°.' },
    notes: { en: 'Music volleys arrive in clustered rhythm bursts.', ru: 'РњСѓР·С‹РєР°Р»СЊРЅС‹Рµ Р·Р°Р»РїС‹ РёРґСѓС‚ СЂРёС‚РјРёС‡РЅС‹РјРё РїР°С‡РєР°РјРё.' },
    strings: { en: 'Play between narrow lanes like piano keys.', ru: 'РРґРё РјРµР¶РґСѓ СѓР·РєРёРјРё РїРѕР»РѕСЃР°РјРё РєР°Рє РјРµР¶РґСѓ РєР»Р°РІРёС€Р°РјРё.' },
  };
  return localizedText(localized[pattern]) || localizedText(BOSS_PATTERN_BRIEFS[pattern]) || (state.language === 'ru' ? 'РЎРјРѕС‚СЂРё РЅР° РїРѕР»РѕСЃСѓ Рё РѕС‚РІРµС‡Р°Р№ РґРІРёР¶РµРЅРёРµРј.' : 'Watch the lane, then counter-rotate.');
}

function getRunRank() {
  const rankScore =
    state.run.score +
    state.run.bossesDefeated * 260 +
    state.run.lives * 40 +
    state.run.pickupsCollected * 18 +
    Math.round(state.run.comboMultiplier * 30);

  if (rankScore >= 1700) return { label: normalizeUiText(state.language === 'ru' ? 'РњРР¤РРљ' : 'MYTHIC'), note: normalizeUiText(state.language === 'ru' ? 'РўРµРјРї СѓР±РёР№С†С‹ Р±РѕСЃСЃРѕРІ Рё РёРґРµР°Р»СЊРЅС‹Р№ РєРѕРЅС‚СЂРѕР»СЊ.' : 'Boss-slayer pace with premium control.'), color: '#ff7aa6' };
  if (rankScore >= 1050) return { label: 'ACE', note: normalizeUiText(state.language === 'ru' ? 'Р§РµС‚РєРѕРµ С‡С‚РµРЅРёРµ РїРѕР»РѕСЃ Рё СЃРёР»СЊРЅС‹Р№ РєРѕРЅС‚СЂРѕР»СЊ СѓРіСЂРѕР·.' : 'Sharp lane reads and strong threat control.'), color: '#ffd053' };
  if (rankScore >= 650) return { label: normalizeUiText(state.language === 'ru' ? 'Р“РћР›Р”' : 'GOLD'), note: normalizeUiText(state.language === 'ru' ? 'РќР°РґРµР¶РЅР°СЏ РґРёСЃС†РёРїР»РёРЅР° Рё С…РѕСЂРѕС€РёР№ С‚РµРјРї.' : 'Solid arena discipline and tempo.'), color: '#ffb85c' };
  if (rankScore >= 320) return { label: normalizeUiText(state.language === 'ru' ? 'РЎРР›Р¬Р’Р•Р ' : 'SILVER'), note: normalizeUiText(state.language === 'ru' ? 'РҐРѕСЂРѕС€Р°СЏ Р±Р°Р·Р° РґР»СЏ СЃР»РµРґСѓСЋС‰РµРіРѕ СЂР°РЅР°.' : 'Clean enough to build the next run.'), color: '#86d1f2' };
  return { label: normalizeUiText(state.language === 'ru' ? 'Р‘Р РћРќР—Рђ' : 'BRONZE'), note: normalizeUiText(state.language === 'ru' ? 'РџРµСЂРІС‹Р№ С‡РёСЃС‚С‹Р№ СЂРёС‚Рј. Р”РµСЂР¶Рё С‚РµРјРї.' : 'First clear lane. Keep the rhythm going.'), color: '#caa57b' };
}

function getPickupLabel(kind) {
  const pickupMap = {
    heart: state.language === 'ru' ? 'РЎР•Р Р”Р¦Р•' : 'HEART',
    shieldPickup: state.language === 'ru' ? 'Р©РРў' : 'SHIELD',
    doubleShotPickup: state.language === 'ru' ? 'ДВОЙНОЙ' : 'DOUBLE',
    superLaserPickup: state.language === 'ru' ? 'РЎРЈРџР•Р ' : 'SUN',
    volleyUpgrade: state.language === 'ru' ? 'ОЧЕРЕДЬ' : 'RPM',
  };
  if (kind.startsWith('weapon')) {
    const weaponId = kind.slice('weapon'.length);
    const normalized = weaponId.charAt(0).toLowerCase() + weaponId.slice(1);
    return normalizeUiText(getWeaponName(normalized) || (state.language === 'ru' ? 'РЇР©РРљ' : 'CRATE'));
  }
  return normalizeUiText(pickupMap[kind] || kind.toUpperCase());
}

function getNearestPickupInfo() {
  const pickups = state.run.entities.filter((entity) => entity.category === 'pickup');
  if (!pickups.length) {
    return {
      label: normalizeUiText(state.language === 'ru' ? 'РќР•Рў' : 'NONE'),
      detail: normalizeUiText(state.language === 'ru' ? 'С‡РёСЃС‚Рѕ' : 'clear'),
    };
  }
  const px = state.run.player.x + state.run.player.width / 2;
  const py = state.run.player.y + state.run.player.height / 2;
  let nearest = pickups[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  pickups.forEach((entity) => {
    const distance = Math.hypot(entity.x - px, entity.y - py);
    if (distance < bestDistance) {
      bestDistance = distance;
      nearest = entity;
    }
  });
  return {
    label: getPickupLabel(nearest.kind),
    detail: `${Math.round(bestDistance)} px`,
  };
}

function getThreatSummary() {
  const hostileEntities = state.run.entities.filter((entity) => entity.category === 'target' || entity.category === 'hazard' || entity.category === 'enemy').length;
  const bulletCount = state.run.enemyBullets.length;
  const bossCount = state.run.boss ? 1 : 0;
  const total = hostileEntities + bulletCount + bossCount;
  return {
    total,
    detail: total === 0 ? 'clear' : `${total} live`,
  };
}

function computeDangerLevel() {
  const bossPressure = state.run.boss ? 34 : 0;
  const bulletPressure = state.run.enemyBullets.length * 11;
  const entityPressure = Math.max(0, state.run.entities.length - 1) * 4;
  const lowLifePressure = state.run.lives <= 1 ? 18 : state.run.lives === 2 ? 8 : 0;
  return clamp(Math.round(bossPressure + bulletPressure + entityPressure + lowLifePressure), 0, 100);
}

function toggleAudio() {
  state.audioEnabled = !state.audioEnabled;
  if (state.audioEnabled) {
    if (audio.ctx?.state === 'suspended') {
      audio.ctx.resume().catch(() => {});
    }
    audio.markInteraction();
  }
  if (!state.audioEnabled) {
    audio.stopMusic();
  }
  saveSettings();
  syncUI();
}

function toggleLanguage() {
  state.language = state.language === 'ru' ? 'en' : 'ru';
  saveSettings();
  uiCache.questReady = false;
  uiCache.rewardCodexKey = '';
  uiCache.weaponDockKey = '';
  uiCache.menuArsenalKey = '';
  uiCache.bossRosterKey = '';
  uiCache.combatFeedKey = '';
  uiCache.activeBuffKey = '';
  applyLanguage();
  syncUI();
}

function nudgeCamera(durationMs, power) {
  state.run.cameraShakeMs = Math.max(state.run.cameraShakeMs, durationMs);
  state.run.cameraShakePower = Math.max(state.run.cameraShakePower, power);
}

function pushEvent(title, detail, color = '#f28a1a') {
  state.run.eventFeed.unshift({
    id: nextId(),
    title: normalizeUiText(title),
    detail: normalizeUiText(detail),
    color: constrainPaletteColor(color),
  });
  state.run.eventFeed = state.run.eventFeed.slice(0, 4);
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function choose(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function weightedChoice(choices) {
  const total = choices.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of choices) {
    roll -= item.weight;
    if (roll <= 0) return item.value;
  }
  return choices[choices.length - 1].value;
}

function loadHighScore() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? Number(raw) || 0 : 0;
}

function saveHighScore(value) {
  window.localStorage.setItem(STORAGE_KEY, String(value));
}

function loadMetaStats() {
  try {
    const raw = window.localStorage.getItem(META_KEY);
    if (!raw) {
      return { runs: 0, bossesDefeated: 0, targetsDestroyed: 0, pickupsCollected: 0, bestCombo: 1, bestMeters: 0 };
    }
    const parsed = JSON.parse(raw);
    return {
      runs: Math.max(0, Number(parsed.runs) || 0),
      bossesDefeated: Math.max(0, Number(parsed.bossesDefeated) || 0),
      targetsDestroyed: Math.max(0, Number(parsed.targetsDestroyed) || 0),
      pickupsCollected: Math.max(0, Number(parsed.pickupsCollected) || 0),
      bestCombo: Math.max(1, Number(parsed.bestCombo) || 1),
      bestMeters: Math.max(0, Number(parsed.bestMeters) || 0),
    };
  } catch {
    return { runs: 0, bossesDefeated: 0, targetsDestroyed: 0, pickupsCollected: 0, bestCombo: 1, bestMeters: 0 };
  }
}

function saveMetaStats() {
  window.localStorage.setItem(META_KEY, JSON.stringify(state.metaStats));
}

function loadDailyState(rawDaily) {
  const source = rawDaily && typeof rawDaily === 'object' ? rawDaily : {};
  return {
    streak: Math.max(0, Number(source.streak) || 0),
    totalClaims: Math.max(0, Number(source.totalClaims) || 0),
    lastClaimDate: typeof source.lastClaimDate === 'string' ? source.lastClaimDate : '',
  };
}

function normalizeCustomTracks(rawTracks) {
  if (!Array.isArray(rawTracks)) return [];
  return rawTracks
    .map((track, index) => {
      if (!track || typeof track !== 'object') return null;
      const title = typeof track.title === 'string' ? track.title.trim().slice(0, 40) : '';
      const source = typeof track.source === 'string' ? track.source.trim() : '';
      if (!title || !/^https?:\/\//i.test(source)) return null;
      return {
        id: typeof track.id === 'string' && track.id.trim() ? track.id.trim() : `custom-${index + 1}`,
        title,
        source,
      };
    })
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeCustomPartners(rawPartners) {
  if (!Array.isArray(rawPartners)) return [];
  return rawPartners
    .map((partner, index) => {
      if (!partner || typeof partner !== 'object') return null;
      const nameSource = typeof partner.name === 'string' ? partner.name : partner.title;
      const hrefSource = typeof partner.href === 'string' ? partner.href : partner.source;
      const noteSource = typeof partner.note === 'string' ? partner.note : '';
      const name = typeof nameSource === 'string' ? nameSource.trim().slice(0, 24) : '';
      const href = typeof hrefSource === 'string' ? hrefSource.trim() : '';
      if (!name || !/^https?:\/\//i.test(href)) return null;
      return {
        id: typeof partner.id === 'string' && partner.id.trim() ? partner.id.trim() : `partner-${index + 1}`,
        name,
        href,
        note: noteSource.trim().slice(0, 52),
      };
    })
    .filter(Boolean)
    .slice(0, 8);
}

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveSettings() {
  const payload = {
    difficulty: state.difficulty,
    godMode: state.godMode,
    audioEnabled: state.audioEnabled,
    language: state.language,
    shipSkin: state.shipSkin,
    weaponFinish: state.weaponFinish,
    preferredWeapon: state.preferredWeapon,
    beerBalance: state.beerBalance,
    walletConnected: state.walletConnected,
    walletAddress: state.walletAddress,
    napiwasBalance: state.napiwasBalance,
    questClaimed: Array.from(state.questClaimed),
    permanentWeaponUnlocks: Array.from(state.permanentWeaponUnlocks),
    questSkinUnlocks: Array.from(state.questSkinUnlocks),
    purchasedSkins: Array.from(state.purchasedSkins),
    daily: state.daily,
    musicSelection: state.musicSelection,
    unlockedTracks: Array.from(state.unlockedTracks),
    customTracks: state.customTracks,
    customPartners: normalizeCustomPartners(state.customPartners),
    claimedChallengeRewards: Array.from(state.claimedChallengeRewards),
  };
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
}

function loadCoopClientId() {
  const existingId = window.localStorage.getItem(COOP_CLIENT_KEY);
  if (existingId) return existingId;
  const generatedId = typeof window.crypto?.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : `coop-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  window.localStorage.setItem(COOP_CLIENT_KEY, generatedId);
  return generatedId;
}

function createRunState() {
  const lives = state.godMode ? 100 : 3;
  const preferredWeapon = WEAPONS[state.preferredWeapon] ? state.preferredWeapon : 'standard';
  const unlockedWeapons = new Set(['standard']);
  unlockedWeapons.add(preferredWeapon);
  state.permanentWeaponUnlocks.forEach((weaponId) => {
    if (WEAPONS[weaponId]) unlockedWeapons.add(weaponId);
  });
  return {
    phase: 'normal',
    score: 0,
    meters: 0,
    level: 1,
    lives,
    maxLivesSeen: lives,
    player: {
      x: WIDTH / 2 - PLAYER_WIDTH / 2,
      y: clamp(PLAYER_Y, PLAYER_MIN_Y, PLAYER_MAX_Y),
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      targetX: WIDTH / 2 - PLAYER_WIDTH / 2,
      targetY: clamp(PLAYER_Y, PLAYER_MIN_Y, PLAYER_MAX_Y),
      invulnerableMs: 0,
      boostMs: 0,
      moveVelocity: 0,
      velocityX: 0,
      velocityY: 0,
    },
    weapon: preferredWeapon,
    unlockedWeapons,
    weaponCooldownMs: 0,
    volleyLevel: 0,
    tempWeapon: null,
    tempWeaponMs: 0,
    beerMugMs: 0,
    lastPickupLabel: state.language === 'ru' ? 'Р‘Р°Р·РѕРІС‹Р№ РєРѕРјРїР»РµРєС‚' : 'Base loadout',
    entities: [],
    bullets: [],
    enemyBullets: [],
    particles: [],
    floatingTexts: [],
    spawnTimerMs: 700,
    skillTimers: { magnet: 0, reflect: 0, double: 0, slowmo: 0, guardian: 0, kraken: 0 },
    nextBossScore: 500,
    bossCooldownMs: 0,
    bossIntroMs: 0,
    bossIndex: 0,
    boss: null,
    pickupsCollected: 0,
    targetsDestroyed: 0,
    bossesDefeated: 0,
    comboCount: 0,
    comboTimerMs: 0,
    comboMultiplier: 1,
    cameraShakeMs: 0,
    cameraShakePower: 0,
    bossDarkPulseMs: 0,
    gameOverReason: '',
    metaCommitted: false,
    eventFeed: [],
    runSpeedMultiplier: 1,
    bossFrenzyMs: 0,
    nextScoreMilestone: SCORE_MILESTONE_STEP,
    idCounter: 1,
    elapsedMs: 0,
    arenaPaletteIndex: 0,
  };
}

const state = {
  mode: 'menu',
  difficulty: 3,
  highScore: loadHighScore(),
  godMode: false,
  audioEnabled: true,
  language: 'en',
  beerBalance: 0,
  walletConnected: false,
  walletAddress: '',
  napiwasBalance: 0,
  questClaimed: new Set(),
  permanentWeaponUnlocks: new Set(),
  questSkinUnlocks: new Set(),
  purchasedSkins: new Set(['classic']),
  shipSkin: 'classic',
  weaponFinish: 'brass',
  preferredWeapon: 'standard',
  menuView: 'inventory',
  tokenInfoPane: 'overview',
  menuReturnMode: null,
  questReturnMode: 'menu',
  metaStats: loadMetaStats(),
  daily: loadDailyState(),
  musicSelection: 'auto',
  unlockedTracks: new Set(['taproom']),
  customTracks: [],
  customPartners: [],
  claimedChallengeRewards: new Set(),
  live: {
    leaderboard: [],
    challenges: [],
    analytics: {
      playersOnline: 0,
      counters: { runStart: 0, bossDefeat: 0, walletConnect: 0, leaderboardSubmit: 0 },
      recentEvents: [],
    },
    partners: [],
    requestPending: false,
    lastSyncedAt: 0,
    pollTimerId: 0,
  },
  sliderPercent: 50,
  sliderPercentY: 50,
  coop: {
    tab: 'find',
    lobbies: [],
    hostLobby: null,
    joinedLobby: null,
    clientId: '',
    lastSyncedAt: 0,
    pollTimerId: 0,
    requestPending: false,
  },
  run: null,
  lastTimestamp: performance.now(),
  accumulatorMs: 0,
};

const savedSettings = loadSettings();
state.difficulty = clamp(Number(savedSettings.difficulty) || state.difficulty, 1, 5);
state.godMode = Boolean(savedSettings.godMode);
state.audioEnabled = savedSettings.audioEnabled === undefined ? true : Boolean(savedSettings.audioEnabled);
state.language = savedSettings.language === 'ru' ? 'ru' : 'en';
state.questClaimed = new Set(normalizeStringArray(savedSettings.questClaimed, QUEST_DEFS.map((entry) => entry.id)));
state.permanentWeaponUnlocks = new Set(normalizeStringArray(savedSettings.permanentWeaponUnlocks, WEAPON_ORDER));
state.questSkinUnlocks = new Set(normalizeStringArray(savedSettings.questSkinUnlocks, SHIP_SKINS.filter((skin) => skin.questReward).map((skin) => skin.id)));
state.purchasedSkins = new Set([
  'classic',
  ...normalizeStringArray(savedSettings.purchasedSkins, SHIP_SKINS.map((skin) => skin.id)),
]);
state.shipSkin = SHIP_SKINS.some((skin) => skin.id === savedSettings.shipSkin) ? savedSettings.shipSkin : 'classic';
state.weaponFinish = WEAPON_FINISHES.some((finish) => finish.id === savedSettings.weaponFinish) ? savedSettings.weaponFinish : 'brass';
state.preferredWeapon = WEAPONS[savedSettings.preferredWeapon] ? savedSettings.preferredWeapon : 'standard';
state.beerBalance = Math.max(0, Number(savedSettings.beerBalance) || 0);
state.daily = loadDailyState(savedSettings.daily);
state.musicSelection = typeof savedSettings.musicSelection === 'string' ? savedSettings.musicSelection : 'auto';
state.customTracks = normalizeCustomTracks(savedSettings.customTracks);
state.customPartners = normalizeCustomPartners(savedSettings.customPartners);
state.unlockedTracks = new Set([
  'taproom',
  ...normalizeStringArray(
    savedSettings.unlockedTracks,
    BONUS_TRACK_DEFS.map((track) => track.id).concat(state.customTracks.map((track) => track.id)),
  ),
]);
state.claimedChallengeRewards = new Set(normalizeStringArray(savedSettings.claimedChallengeRewards, []));
const restoredWalletAddress = normalizeTonAddressInput(savedSettings.walletAddress);
state.walletAddress = restoredWalletAddress;
state.walletConnected = Boolean(savedSettings.walletConnected && restoredWalletAddress);
state.napiwasBalance = Math.max(0, Number(savedSettings.napiwasBalance) || 0);
state.coop.clientId = loadCoopClientId();
ensureSkinAccess();

state.run = createRunState();

const uiCache = {
  activeBuffKey: '',
  activeNav: '',
  bossRosterKey: '',
  combatFeedKey: '',
  menuCloseAt: 0,
  questReady: false,
  rewardCodexKey: '',
  weaponDockKey: '',
  menuArsenalKey: '',
  skinInventoryKey: '',
  shopCatalogKey: '',
  questBoardKey: '',
  leaderboardKey: '',
  partnerKey: '',
  challengeKey: '',
  musicTrackKey: '',
};

const spriteAssets = {
  loaded: false,
  images: {},
};

const tonWallet = {
  initPromise: null,
  ui: null,
  statusUnsubscribe: null,
  isReady: false,
  isConnecting: false,
  hasPromptedAutoload: false,
};

function nextId() {
  const id = state.run.idCounter;
  state.run.idCounter += 1;
  return id;
}

function getCurrentWeapon() {
  return state.run.tempWeapon || state.run.weapon;
}

function getPreferredWeapon() {
  return WEAPONS[state.preferredWeapon] ? state.preferredWeapon : 'standard';
}

function isSkillActive(skillName) {
  return state.run.skillTimers[skillName] > 0;
}

function getPlayerYBounds() {
  let minY = PLAYER_MIN_Y;
  let maxY = PLAYER_MAX_Y;
  if (!document.body.classList.contains('mobile-clean-play')) {
    return { minY, maxY };
  }

  const arenaRect = ui.arenaFrame?.getBoundingClientRect?.();
  const controlsRect = ui.controlsCard?.getBoundingClientRect?.();
  if (!arenaRect || !controlsRect || arenaRect.height <= 0) {
    return { minY, maxY: Math.max(minY, PLAYER_MAX_Y - MOBILE_CONTROLS_RESERVED_MIN) };
  }

  const overlapPx = Math.max(0, arenaRect.bottom - controlsRect.top);
  if (overlapPx <= 0) {
    return { minY, maxY };
  }
  const overlapRatio = clamp(overlapPx / arenaRect.height, 0, 0.58);
  const overlapUnits = overlapRatio * HEIGHT;
  const dynamicReserve = Math.max(MOBILE_CONTROLS_RESERVED_MIN, overlapUnits + 4);
  maxY = Math.max(minY, HEIGHT - PLAYER_HEIGHT - dynamicReserve);
  return { minY, maxY };
}

function setSliderPercent(percentX, percentY = 50) {
  const nextX = clamp(percentX, 0, 100);
  const nextY = clamp(percentY, 0, 100);
  const toStickAxis = (percent) => {
    const axis = clamp((percent - 50) / 50, -1, 1);
    const absAxis = Math.abs(axis);
    if (absAxis < 0.03) return 0;
    return Math.sign(axis) * Math.pow(absAxis, 0.95);
  };
  state.sliderPercent = nextX;
  state.sliderPercentY = nextY;
  const bounds = getPlayerYBounds();
  state.run.player.targetX = (nextX / 100) * (WIDTH - PLAYER_WIDTH);
  state.run.player.targetY = bounds.minY + (nextY / 100) * (bounds.maxY - bounds.minY);
  input.stickTargetX = toStickAxis(nextX);
  input.stickTargetY = toStickAxis(nextY);
}

function syncSliderFromPlayer() {
  state.sliderPercent = clamp(50 + input.stickX * 50, 0, 100);
  state.sliderPercentY = clamp(50 + input.stickY * 50, 0, 100);
  return { xPercent: clamp(state.sliderPercent, 0, 100), yPercent: state.sliderPercentY };
}

function syncSliderFromInput() {
  state.sliderPercent = clamp(50 + input.stickX * 50, 0, 100);
  state.sliderPercentY = clamp(50 + input.stickY * 50, 0, 100);
  return { xPercent: state.sliderPercent, yPercent: state.sliderPercentY };
}

function resizeArenaFrame() {
  if (!ui.arenaStage || !ui.arenaFrame) return;
  const liveViewportHeight = Math.max(
    320,
    Math.round(window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 0),
  );
  setStyleValue(document.documentElement, '--app-viewport-height', `${liveViewportHeight}px`);
  setStyleValue(document.body, '--app-viewport-height', `${liveViewportHeight}px`);
  const bounds = ui.arenaStage.getBoundingClientRect();
  const availableWidth = Math.max(0, bounds.width);
  const availableHeight = Math.max(0, bounds.height);
  if (!availableWidth || !availableHeight) return;
  setStyleValue(ui.arenaFrame, 'width', `${Math.floor(availableWidth)}px`);
  setStyleValue(ui.arenaFrame, 'height', `${Math.floor(availableHeight)}px`);
  const pointerIsCoarse = Boolean(window.matchMedia?.('(pointer: coarse)').matches);
  const mobileViewport = window.innerWidth <= 760;
  const lowPowerHint =
    (Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 6)
    || (Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4);
  const lowLagMode = pointerIsCoarse && mobileViewport;
  const pixelRatioCap = pointerIsCoarse && mobileViewport ? (lowPowerHint ? 1 : 1.15) : 2;
  const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, pixelRatioCap));
  const backingWidth = Math.max(WIDTH, Math.round(availableWidth * pixelRatio));
  const backingHeight = Math.max(HEIGHT, Math.round(availableHeight * pixelRatio));
  if (canvas.width !== backingWidth) {
    canvas.width = backingWidth;
  }
  if (canvas.height !== backingHeight) {
    canvas.height = backingHeight;
  }
  renderResolution.pixelRatio = pixelRatio;
  renderResolution.scaleX = backingWidth / WIDTH;
  renderResolution.scaleY = backingHeight / HEIGHT;
  ctx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in ctx) {
    ctx.imageSmoothingQuality = lowLagMode ? 'medium' : 'high';
  }
}

function getBossEtaMs() {
  if (state.run.boss) return 0;
  if (state.run.bossCooldownMs > 0) return state.run.bossCooldownMs;
  const remaining = Math.max(0, state.run.nextBossScore - state.run.score);
  const pace = Math.max(8, state.run.meters > 0 ? state.run.score / Math.max(1, state.run.meters) : 14 + state.run.level * 2);
  return Math.ceil((remaining / pace) * 1000);
}

function formatBossEta() {
  if (state.run.boss) {
    return normalizeUiText(state.language === 'ru' ? 'В БОЮ' : 'LIVE');
  }
  return formatSeconds(getBossEtaMs());
}

function cycleDifficulty() {
  state.difficulty = state.difficulty >= 5 ? 1 : state.difficulty + 1;
  saveSettings();
}

function toggleGodMode() {
  state.godMode = !state.godMode;
  saveSettings();
}

function cycleShipSkin() {
  const index = SHIP_SKINS.findIndex((skin) => skin.id === state.shipSkin);
  for (let step = 1; step <= SHIP_SKINS.length; step += 1) {
    const candidate = SHIP_SKINS[(index + step) % SHIP_SKINS.length];
    if (canUseSkin(candidate.id)) {
      state.shipSkin = candidate.id;
      break;
    }
  }
  saveSettings();
  syncUI();
}

function selectSkin(skinId) {
  if (!canUseSkin(skinId)) {
    const skin = SHIP_SKINS.find((entry) => entry.id === skinId);
    const message = isSkinPurchasable(skinId)
      ? (state.language === 'ru' ? 'Купи этот скин во вкладке SHOP.' : 'Buy this skin in the SHOP tab.')
      : skin?.questReward
      ? (state.language === 'ru' ? 'Сначала закрой контракт для этого скина.' : 'Complete the contract for this skin first.')
      : (state.language === 'ru' ? 'Нужен TON и 20000 NAPIWAS.' : 'Need TON + 20000 NAPIWAS.');
    pushEvent('SKIN', message, '#ff9d7f');
    return;
  }
  state.shipSkin = skinId;
  saveSettings();
  syncUI();
}

function cycleWeaponFinish() {
  const index = WEAPON_FINISHES.findIndex((finish) => finish.id === state.weaponFinish);
  state.weaponFinish = WEAPON_FINISHES[(index + 1) % WEAPON_FINISHES.length].id;
  saveSettings();
  syncUI();
}

function cyclePreferredWeapon() {
  const index = WEAPON_ORDER.indexOf(getPreferredWeapon());
  state.preferredWeapon = WEAPON_ORDER[(index + 1) % WEAPON_ORDER.length];
  saveSettings();
  syncUI();
}

function hasActiveRunToResume() {
  return Boolean(state.run && state.run.lives > 0 && state.mode !== 'gameover');
}

function closeMenuOverlay() {
  if (state.menuReturnMode === 'playing' && hasActiveRunToResume()) {
    state.mode = 'playing';
    state.menuReturnMode = null;
    stopCoopPolling();
    syncUI();
    return;
  }
  if (state.mode === 'menu') startRun();
}

function requestMenuCloseOverlay() {
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  if (now - uiCache.menuCloseAt < 110) return;
  uiCache.menuCloseAt = now;
  closeMenuOverlay();
}

function closeQuestOverlay() {
  state.mode = state.questReturnMode || 'menu';
  state.questReturnMode = 'menu';
  syncUI();
}

function closeGameoverOverlay() {
  state.menuReturnMode = null;
  state.mode = 'menu';
  state.menuView = 'inventory';
  syncUI();
}

function normalizeMenuView(view) {
  return view === 'wallet' || view === 'shop' || view === 'quests' ? view : 'inventory';
}

function normalizeTokenInfoPane(pane) {
  return TOKEN_INFO_PANES.includes(pane) ? pane : 'overview';
}

function setTokenInfoPane(nextPane, options = {}) {
  const pane = normalizeTokenInfoPane(nextPane);
  state.tokenInfoPane = pane;
  const tabButtons = ui.tokenStoryTabs?.querySelectorAll?.('[data-token-panel]');
  tabButtons?.forEach((button) => {
    const active = button.dataset.tokenPanel === pane;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  const panels = ui.tokenStoryPanels?.querySelectorAll?.('.token-story-panel');
  panels?.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.tokenPanel === pane);
  });
  if (!options.skipSync) syncUI();
}

async function copyTokenContract() {
  if (!ui.tokenCaText) return;
  const contractAddress = ui.tokenCaText.textContent?.trim() || NAPIWAS_CA;
  try {
    await navigator.clipboard.writeText(contractAddress);
    pushEvent('TOKEN', 'CA copied', '#79d4b3');
  } catch {
    pushEvent('TOKEN', 'Copy failed', '#ff847f');
  }
}

async function copyWalletAddress() {
  const address = normalizeTonAddressInput(state.walletAddress);
  if (!address) {
    pushEvent('TON', state.language === 'ru' ? 'Кошелек еще не подключен.' : 'Wallet is not connected yet.', '#ff9d7f');
    return;
  }
  try {
    await navigator.clipboard.writeText(address);
    pushEvent('TON', state.language === 'ru' ? 'Адрес кошелька скопирован.' : 'Wallet address copied.', '#79d4b3');
  } catch {
    pushEvent('TON', state.language === 'ru' ? 'Не удалось скопировать адрес.' : 'Failed to copy wallet address.', '#ff847f');
  }
}

function triggerMenuTransition(view) {
  if (!ui.menuCard) return;
  ui.menuCard.dataset.view = view;
  ui.menuCard.classList.remove('tab-transition');
  void ui.menuCard.offsetWidth;
  ui.menuCard.classList.add('tab-transition');
}

function startRun() {
  stopCoopPolling();
  state.run = createRunState();
  state.mode = 'playing';
  state.menuView = 'inventory';
  state.menuReturnMode = null;
  state.questReturnMode = 'menu';
  setSliderPercent(50, 50);
  syncUnlockedMusicTracks();
  void postLiveEvent('runStart', `difficulty ${state.difficulty}`);
  pushEvent(state.language === 'ru' ? 'Р РђРќ' : 'RUN LIVE', state.language === 'ru' ? 'Р‘РѕР№ РЅР°С‡Р°Р»СЃСЏ! Р§РёС‚Р°Р№ Р»РёРЅРёСЋ.' : 'Battle started! Read the lane.', '#f28a1a');
  nudgeCamera(180, 2);
  resizeArenaFrame();
  syncUI();
}

function openMenu(view = 'inventory') {
  if (state.mode !== 'menu') {
    const fallbackMode = state.mode === 'quest' ? state.questReturnMode : state.mode;
    state.menuReturnMode = fallbackMode === 'playing' || fallbackMode === 'paused' ? 'playing' : null;
  }
  const nextView = normalizeMenuView(view);
  state.mode = 'menu';
  if (state.menuView !== nextView) {
    triggerMenuTransition(nextView);
  }
  state.menuView = nextView;
  stopCoopPolling();
  void refreshLiveData({ silent: true });
  syncUI();
}

function setCoopTab(tab) {
  state.coop.tab = tab === 'host' ? 'host' : 'find';
  ensureCoopPolling();
  syncUI();
}

function normalizeLobby(lobby) {
  if (!lobby || typeof lobby !== 'object') return null;
  const players = clamp(Number(lobby.players) || 1, 1, 3);
  const maxPlayers = clamp(Number(lobby.maxPlayers) || 3, players, 3);
  return {
    id: typeof lobby.id === 'string' ? lobby.id : `NAPI-${Math.floor(1000 + Math.random() * 9000)}`,
    hostId: typeof lobby.hostId === 'string' ? lobby.hostId : '',
    players,
    maxPlayers,
    map: typeof lobby.map === 'string' && lobby.map ? lobby.map : 'Battle Arena',
    createdAt: Number(lobby.createdAt) || Date.now(),
    updatedAt: Number(lobby.updatedAt) || Date.now(),
  };
}

async function requestCoopApi(method = 'GET', body = null) {
  const endpoint = method === 'GET'
    ? `${COOP_API_URL}?clientId=${encodeURIComponent(state.coop.clientId)}&alias=${encodeURIComponent(getPlayerAlias())}`
    : COOP_API_URL;
  const response = await fetch(endpoint, {
    method,
    headers: body ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!response.ok) {
    const rawMessage = await response.text();
    let message = rawMessage;
    try {
      const parsed = rawMessage ? JSON.parse(rawMessage) : null;
      if (parsed?.error) {
        message = parsed.error;
      }
    } catch {
      // keep raw message
    }
    throw new Error(message || `CO-OP API ${response.status}`);
  }
  return response.json();
}

function applyCoopPayload(payload) {
  const hasHostLobby = Boolean(payload) && Object.prototype.hasOwnProperty.call(payload, 'hostLobby');
  const hasJoinedLobby = Boolean(payload) && Object.prototype.hasOwnProperty.call(payload, 'joinedLobby');
  const currentJoinedLobbyId = state.coop.joinedLobby?.id || '';
  const lobbies = Array.isArray(payload?.lobbies) ? payload.lobbies.map(normalizeLobby).filter(Boolean) : [];
  state.coop.lobbies = lobbies;
  const hostedLobby = lobbies.find((lobby) => lobby.hostId === state.coop.clientId) || null;
  if (hasHostLobby) {
    state.coop.hostLobby = normalizeLobby(payload.hostLobby);
  } else {
    state.coop.hostLobby = hostedLobby;
  }
  if (state.coop.hostLobby) {
    state.coop.joinedLobby = null;
    return;
  }
  if (hasJoinedLobby) {
    state.coop.joinedLobby = normalizeLobby(payload.joinedLobby);
    return;
  }
  state.coop.joinedLobby = currentJoinedLobbyId
    ? lobbies.find((lobby) => lobby.id === currentJoinedLobbyId) || null
    : null;
}

async function refreshCoopLobbies(options = {}) {
  try {
    const payload = await requestCoopApi('GET');
    applyCoopPayload(payload);
    state.coop.lastSyncedAt = Date.now();
  } catch (error) {
    if (!options.silent) {
      pushEvent('CO-OP', state.language === 'ru' ? 'Не удалось обновить лобби.' : 'Unable to refresh lobbies.', '#ff8a7a');
    }
  }
  syncUI();
}

async function createHostLobby() {
  if (state.coop.joinedLobby && !state.coop.hostLobby) {
    pushEvent('CO-OP', state.language === 'ru' ? 'Сначала выйди из текущего лобби.' : 'Leave the current lobby first.', '#ff8a7a');
    return;
  }
  if (state.coop.requestPending) return;
  state.coop.requestPending = true;
  try {
    const payload = await requestCoopApi('POST', {
      action: 'host',
      hostId: state.coop.clientId,
      map: state.run.boss ? state.run.boss.name : 'Battle Arena',
    });
    applyCoopPayload(payload);
    state.coop.lastSyncedAt = Date.now();
    state.coop.tab = 'host';
    if (state.coop.hostLobby?.id) {
      pushEvent(
        state.language === 'ru' ? 'КО-ОП' : 'CO-OP',
        state.language === 'ru' ? `Лобби ${state.coop.hostLobby.id} создано.` : `Lobby ${state.coop.hostLobby.id} hosted.`,
        '#ffd053',
      );
    }
  } catch (error) {
    pushEvent('CO-OP', state.language === 'ru' ? 'Создать лобби не удалось.' : 'Failed to host lobby.', '#ff8a7a');
  } finally {
    state.coop.requestPending = false;
    ensureCoopPolling();
    syncUI();
  }
}

async function joinCoopLobby(lobbyId) {
  if (!lobbyId || state.coop.requestPending) return;
  if (state.coop.hostLobby) {
    pushEvent('CO-OP', state.language === 'ru' ? 'Хост сначала должен закрыть своё лобби.' : 'Close your hosted lobby first.', '#ff8a7a');
    return;
  }
  state.coop.requestPending = true;
  try {
    const payload = await requestCoopApi('POST', {
      action: 'join',
      clientId: state.coop.clientId,
      lobbyId,
    });
    applyCoopPayload(payload);
    state.coop.lastSyncedAt = Date.now();
    if (state.coop.joinedLobby?.id) {
      pushEvent(
        state.language === 'ru' ? 'КО-ОП' : 'CO-OP',
        state.language === 'ru' ? `Подключение к ${state.coop.joinedLobby.id}.` : `Joined ${state.coop.joinedLobby.id}.`,
        '#79d3b3',
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const detail = /full/i.test(message)
      ? (state.language === 'ru' ? 'Лобби уже заполнено.' : 'Lobby is already full.')
      : /not found/i.test(message)
        ? (state.language === 'ru' ? 'Лобби уже недоступно.' : 'Lobby is no longer available.')
        : (state.language === 'ru' ? 'Подключиться к лобби не удалось.' : 'Failed to join lobby.');
    pushEvent('CO-OP', detail, '#ff8a7a');
  } finally {
    state.coop.requestPending = false;
    ensureCoopPolling();
    syncUI();
  }
}

async function leaveCoopLobby(options = {}) {
  if (!state.coop.joinedLobby) return;
  if (state.coop.requestPending && !options.force) return;
  if (!options.force) {
    state.coop.requestPending = true;
  }
  const lobbyId = state.coop.joinedLobby.id;
  try {
    const payload = await requestCoopApi('POST', {
      action: 'leave',
      clientId: state.coop.clientId,
      lobbyId,
    });
    applyCoopPayload(payload);
    state.coop.lastSyncedAt = Date.now();
    if (!options.silent) {
      pushEvent(
        state.language === 'ru' ? 'КО-ОП' : 'CO-OP',
        state.language === 'ru' ? `Выход из ${lobbyId}.` : `Left ${lobbyId}.`,
        '#ffd053',
      );
    }
  } catch (error) {
    if (!options.silent) {
      pushEvent('CO-OP', state.language === 'ru' ? 'Выйти из лобби не удалось.' : 'Failed to leave lobby.', '#ff8a7a');
    }
  } finally {
    if (!options.force) {
      state.coop.requestPending = false;
    }
    ensureCoopPolling();
    syncUI();
  }
}

async function heartbeatHostedLobby(options = {}) {
  if (!state.coop.hostLobby) {
    if (!options.silent) {
      await refreshCoopLobbies({ silent: false });
    }
    return;
  }
  try {
    const payload = await requestCoopApi('POST', {
      action: 'heartbeat',
      hostId: state.coop.clientId,
    });
    applyCoopPayload(payload);
    state.coop.lastSyncedAt = Date.now();
  } catch (error) {
    if (!options.silent) {
      pushEvent('CO-OP', state.language === 'ru' ? 'Хост временно недоступен.' : 'Host heartbeat failed.', '#ff8a7a');
    }
  }
  syncUI();
}

async function heartbeatJoinedLobby(options = {}) {
  if (!state.coop.joinedLobby) {
    if (!options.silent) {
      await refreshCoopLobbies({ silent: false });
    }
    return;
  }
  const joinedLobbyId = state.coop.joinedLobby.id;
  try {
    const payload = await requestCoopApi('POST', {
      action: 'memberHeartbeat',
      clientId: state.coop.clientId,
      lobbyId: joinedLobbyId,
    });
    applyCoopPayload(payload);
    state.coop.lastSyncedAt = Date.now();
    if (!state.coop.joinedLobby && !options.silent) {
      pushEvent('CO-OP', state.language === 'ru' ? 'Лобби закрыто или уже недоступно.' : 'Lobby closed or no longer available.', '#ff8a7a');
    }
  } catch (error) {
    if (!options.silent) {
      pushEvent('CO-OP', state.language === 'ru' ? 'Связь с лобби потеряна.' : 'Lobby heartbeat failed.', '#ff8a7a');
    }
  }
  syncUI();
}

function syncCoopLoop(options = {}) {
  if (state.coop.hostLobby) {
    return heartbeatHostedLobby(options);
  }
  if (state.coop.joinedLobby) {
    return heartbeatJoinedLobby(options);
  }
  return refreshCoopLobbies(options);
}

function stopCoopPolling() {
  if (state.coop.pollTimerId) {
    window.clearInterval(state.coop.pollTimerId);
    state.coop.pollTimerId = 0;
  }
}

function ensureCoopPolling() {
  const shouldPoll = state.mode === 'menu' && state.menuView === 'coop';
  if (!shouldPoll) {
    stopCoopPolling();
    return;
  }
  if (!state.coop.pollTimerId) {
    state.coop.pollTimerId = window.setInterval(() => {
      if (state.coop.requestPending) return;
      state.coop.requestPending = true;
      const task = syncCoopLoop({ silent: true });
      void task.finally(() => {
        state.coop.requestPending = false;
      });
    }, COOP_POLL_MS);
  }
  if (!state.coop.requestPending) {
    state.coop.requestPending = true;
    const task = syncCoopLoop({ silent: true });
    void task.finally(() => {
      state.coop.requestPending = false;
    });
  }
}

function closeHostedLobbyOnUnload() {
  let payload = null;
  if (state.coop.hostLobby) {
    payload = JSON.stringify({
      action: 'close',
      hostId: state.coop.clientId,
    });
  } else if (state.coop.joinedLobby) {
    payload = JSON.stringify({
      action: 'leave',
      clientId: state.coop.clientId,
      lobbyId: state.coop.joinedLobby.id,
    });
  }
  if (!payload) return;
  try {
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(COOP_API_URL, blob);
      return;
    }
  } catch {
    // fall through to fetch keepalive
  }
  void fetch(COOP_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: payload,
    keepalive: true,
  });
}

function renderCoopLobbies() {
  if (!ui.coopLobbyList || !ui.coopEmptyState) return;
  ui.coopLobbyList.innerHTML = '';
  const lobbies = state.coop.lobbies.filter((lobby) => lobby && Number.isFinite(lobby.players) && Number.isFinite(lobby.maxPlayers));
  if (!lobbies.length) {
    setStyleValue(ui.coopEmptyState, 'display', 'block');
    setTextContent(ui.coopEmptyState, t('noLobbyNow'));
    return;
  }
  setStyleValue(ui.coopEmptyState, 'display', 'none');
  lobbies.forEach((lobby) => {
    const row = document.createElement('div');
    row.className = 'coop-lobby-item';
    const copy = document.createElement('div');
    copy.className = 'coop-lobby-copy';
    const label = document.createElement('strong');
    const meta = document.createElement('span');
    setTextContent(label, lobby.id);
    setTextContent(meta, lobby.map);
    copy.append(label, meta);
    const players = document.createElement('span');
    setTextContent(players, `${lobby.players}/${lobby.maxPlayers}`);
    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.className = 'ghost-button coop-lobby-action';
    const isHosted = lobby.hostId === state.coop.clientId;
    const isJoined = state.coop.joinedLobby?.id === lobby.id;
    const isFull = lobby.players >= lobby.maxPlayers && !isJoined;
    if (isHosted) {
      actionButton.disabled = true;
      setTextContent(actionButton, t('lobbyHostedLabel'));
    } else if (isJoined) {
      actionButton.classList.add('active');
      setTextContent(actionButton, t('leaveLobbyLabel'));
      actionButton.addEventListener('click', () => {
        void leaveCoopLobby();
      });
    } else if (isFull) {
      actionButton.disabled = true;
      setTextContent(actionButton, t('lobbyFullLabel'));
    } else {
      setTextContent(actionButton, t('joinLobbyLabel'));
      actionButton.addEventListener('click', () => {
        void joinCoopLobby(lobby.id);
      });
    }
    row.append(copy, players, actionButton);
    ui.coopLobbyList.appendChild(row);
  });
}

function openQuest() {
  state.questReturnMode = state.mode;
  state.mode = 'quest';
  syncUI();
}

function togglePause() {
  if (state.mode === 'playing') {
    state.mode = 'paused';
  } else if (state.mode === 'paused') {
    state.mode = 'playing';
  }
  syncUI();
}

function setGameOver(reason) {
  state.mode = 'gameover';
  state.menuReturnMode = null;
  state.questReturnMode = 'menu';
  state.run.gameOverReason = normalizeUiText(reason || (state.language === 'ru' ? 'РђСЂРµРЅР° СЃС…Р»РѕРїРЅСѓР»Р°СЃСЊ РІРѕРєСЂСѓРі С‚РµР±СЏ.' : 'The arena collapsed around you.'));
  if (!state.run.metaCommitted) {
    state.metaStats.runs += 1;
    state.metaStats.bossesDefeated += state.run.bossesDefeated;
    state.metaStats.targetsDestroyed += state.run.targetsDestroyed;
    state.metaStats.pickupsCollected += state.run.pickupsCollected;
    state.metaStats.bestCombo = Math.max(state.metaStats.bestCombo, state.run.comboMultiplier);
    state.metaStats.bestMeters = Math.max(state.metaStats.bestMeters, state.run.meters);
    state.run.metaCommitted = true;
    saveMetaStats();
  }
  setTextContent(ui.gameoverSummary, state.run.gameOverReason);
  nudgeCamera(320, 5);
  if (state.run.score > state.highScore) {
    state.highScore = state.run.score;
    saveHighScore(state.highScore);
  }
  syncUnlockedMusicTracks();
  void submitChallengeRunIfNeeded();
  void submitLeaderboardRun();
  void refreshLiveData({ silent: true });
  syncUI();
}

function addFloatingText(x, y, text, color = '#fff8ea') {
  state.run.floatingTexts.push({
    id: nextId(),
    x,
    y,
    text: normalizeUiText(text),
    color: constrainPaletteColor(color),
    lifeMs: 750,
    maxLifeMs: 750,
  });
}

function spawnParticles(x, y, color, amount = 8) {
  const paletteColor = constrainPaletteColor(color);
  for (let index = 0; index < amount; index += 1) {
    state.run.particles.push({
      id: nextId(),
      x,
      y,
      vx: randomRange(-2.6, 2.6),
      vy: randomRange(-2.6, 2.6),
      size: randomRange(2, 4),
      color: paletteColor,
      lifeMs: randomRange(240, 520),
      maxLifeMs: randomRange(240, 520),
    });
  }
}

function loseLife(reason, x = state.run.player.x, y = state.run.player.y) {
  if (state.run.player.invulnerableMs > 0) return;
  const normalizedReason = normalizeUiText(reason);
  const safeReason = normalizedReason.includes('\uFFFD')
    ? (state.language === 'ru' ? 'Цель ушла вниз.' : 'Target escaped.')
    : normalizedReason;
  state.run.lives -= 1;
  resetCombo();
  state.run.player.invulnerableMs = 1200;
  pushEvent('HIT', safeReason.replace(/\.$/, ''), '#ff6d6d');
  spawnParticles(x, y, '#ff6d6d', 14);
  addFloatingText(x, y, '-1 LIFE', '#ff9aa6');
  nudgeCamera(220, 4);
  audio.hit();
  if (state.run.lives <= 0) {
    setGameOver(safeReason);
  }
}

function rewardScore(amount, x, y, color = '#ffd053') {
  state.run.score += amount;
  addFloatingText(x, y, `+${amount}`, color);
}

function processScoreMilestones() {
  while (state.run.score >= state.run.nextScoreMilestone) {
    const reward = getScoreMilestoneMugs();
    const tier = getNapiwasBonusTier();
    state.beerBalance += reward;
    pushEvent(
      'MILESTONE',
      state.language === 'ru'
        ? `${formatUiInteger(state.run.nextScoreMilestone)} очков. +${reward} кружек • ${localizedText(tier.label)}`
        : `${formatUiInteger(state.run.nextScoreMilestone)} score. +${reward} mugs • ${localizedText(tier.label)}`,
      '#ffd053',
    );
    state.run.nextScoreMilestone += SCORE_MILESTONE_STEP;
  }
}

function resetCombo() {
  state.run.comboCount = 0;
  state.run.comboTimerMs = 0;
  state.run.comboMultiplier = 1;
}

function registerComboKill() {
  state.run.comboCount += 1;
  state.run.comboTimerMs = 2200;
  const multiplier = 1 + Math.min(2, (state.run.comboCount - 1) * 0.15);
  state.run.comboMultiplier = Math.round(multiplier * 10) / 10;
}

function rewardCombatScore(baseAmount, x, y, color = '#ffd053') {
  registerComboKill();
  const total = Math.round(baseAmount * state.run.comboMultiplier);
  rewardScore(total, x, y, color);
  if (state.run.comboMultiplier > 1) {
    addFloatingText(x, y - 15, `x${state.run.comboMultiplier.toFixed(1)}`, '#ffb85c');
  }
}

function unlockWeapon(weaponId) {
  if (state.run.unlockedWeapons.has(weaponId)) return;
  state.run.unlockedWeapons.add(weaponId);
  state.run.weapon = weaponId;
  state.run.lastPickupLabel = state.language === 'ru' ? `${getWeaponName(weaponId)} РѕС‚РєСЂС‹С‚Рѕ` : `${getWeaponName(weaponId)} unlocked`;
  pushEvent(state.language === 'ru' ? 'РћР РЈР–РР•' : 'UNLOCK', state.language === 'ru' ? `${getWeaponName(weaponId)} РіРѕС‚РѕРІРѕ Рє Р±РѕСЋ.` : `${getWeaponName(weaponId)} ready for this run.`, getWeaponColor(weaponId));
  addFloatingText(WIDTH / 2, HEIGHT / 2, `${getWeaponName(weaponId)} +`, '#79d4b3');
}

function getWeaponPickupKind(weaponId) {
  return `weapon${weaponId.charAt(0).toUpperCase()}${weaponId.slice(1)}`;
}

function pickBossWeaponDrop() {
  const activeBossConfig = state.run.boss ? BOSSES.find((boss) => boss.name === state.run.boss.name) : null;
  const preferredDrop = activeBossConfig?.signatureWeapon;
  if (preferredDrop && preferredDrop !== 'standard' && !state.run.unlockedWeapons.has(preferredDrop)) {
    return preferredDrop;
  }
  const locked = WEAPON_ORDER.filter((weaponId) => weaponId !== 'standard' && !state.run.unlockedWeapons.has(weaponId));
  if (locked.length) return choose(locked);
  const unlocked = WEAPON_ORDER.filter((weaponId) => weaponId !== 'standard' && state.run.unlockedWeapons.has(weaponId));
  if (preferredDrop && unlocked.includes(preferredDrop)) {
    return preferredDrop;
  }
  return choose(unlocked.length ? unlocked : ['spread']);
}

function applyPickup(entity) {
  state.run.pickupsCollected += 1;
  switch (entity.kind) {
    case 'heart':
      state.run.lives += 1;
      state.run.maxLivesSeen = Math.max(state.run.maxLivesSeen, state.run.lives);
      state.run.lastPickupLabel = state.language === 'ru' ? 'РЎРµСЂРґС†Рµ РІРѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРѕ' : 'Heart recovered';
      pushEvent(state.language === 'ru' ? 'РҐРР›' : 'RECOVER', state.language === 'ru' ? '+1 Р¶РёР·РЅСЊ Рє СЂР°РЅy.' : '+1 life added to the run.', '#ff8ea3');
      addFloatingText(entity.x, entity.y, state.language === 'ru' ? '+1 Р–РР—РќР¬' : '+1 LIFE', '#ff8ea3');
      break;
    case 'shieldPickup':
      state.run.skillTimers.guardian = 10000;
      state.run.lastPickupLabel = state.language === 'ru' ? 'Р©РёС‚ Р°РєС‚РёРІРёСЂРѕРІР°РЅ' : 'Shield online';
      pushEvent(state.language === 'ru' ? 'Р©РРў' : 'SHIELD', state.language === 'ru' ? '10 СЃРµРєСѓРЅРґ РїРѕР»РЅРѕРіРѕ РёРіРЅРѕСЂР° СѓСЂРѕРЅР°.' : '10 seconds of full damage ignore.', '#91d87f');
      addFloatingText(entity.x, entity.y, state.language === 'ru' ? 'Р©РРў 10СЃ' : 'SHIELD 10s', '#91d87f');
      break;
    case 'doubleShotPickup':
      state.run.skillTimers.double = 10000;
      state.run.lastPickupLabel = state.language === 'ru' ? 'Двойной залп активирован' : 'Double shot online';
      pushEvent(
        state.language === 'ru' ? 'ДУО' : 'DUO',
        state.language === 'ru' ? '10 секунд удвоенного авто-огня. Сочетается с щитом.' : '10 seconds of doubled auto-fire. Stacks with shield.',
        '#ffd053',
      );
      addFloatingText(entity.x, entity.y, state.language === 'ru' ? 'ДУО 10с' : 'DUO 10s', '#ffd053');
      break;
    case 'superLaserPickup':
      state.run.tempWeapon = 'superLaser';
      state.run.tempWeaponMs = 10000;
      state.run.lastPickupLabel = state.language === 'ru' ? 'РЎСѓРїРµСЂ-Р»Р°Р·РµСЂ Р°РєС‚РёРІРёСЂРѕРІР°РЅ' : 'Super laser online';
      pushEvent(state.language === 'ru' ? 'РЎРћР›РќР¦Р•' : 'SUN', state.language === 'ru' ? '10 СЃРµРєСѓРЅРґ С‚РѕС‚Р°Р»СЊРЅРѕР№ Р·Р°С‡РёСЃС‚РєРё.' : '10 seconds of total arena melt.', '#ff6f7d');
      addFloatingText(entity.x, entity.y, state.language === 'ru' ? 'Р›РђР—Р•Р  10СЃ' : 'LASER 10s', '#ff6f7d');
      break;
    case 'volleyUpgrade':
      state.run.volleyLevel = clamp(state.run.volleyLevel + 1, 0, VOLLEY_LEVEL_MAX);
      state.run.lastPickupLabel = state.language === 'ru' ? `ОЧЕРЕДЬ ${state.run.volleyLevel}` : `Volley ${state.run.volleyLevel}`;
      pushEvent(
        state.language === 'ru' ? 'ОЧЕРЕДЬ' : 'VOLLEY',
        state.language === 'ru'
          ? `Темп огня поднят до ${state.run.volleyLevel}.`
          : `Fire queue raised to level ${state.run.volleyLevel}.`,
        '#86d1f2',
      );
      addFloatingText(entity.x, entity.y, state.language === 'ru' ? `ОЧЕРЕДЬ ${state.run.volleyLevel}` : `VOLLEY ${state.run.volleyLevel}`, '#86d1f2');
      break;
    case 'weaponSpread':
    case 'weaponLaser':
    case 'weaponChainsaw':
    case 'weaponMissile':
    case 'weaponPaw':
    case 'weaponBottle':
    case 'weaponIce':
      {
        const weaponId = entity.kind.slice('weapon'.length);
        const normalized = weaponId.charAt(0).toLowerCase() + weaponId.slice(1);
        unlockWeapon(normalized);
        state.run.weapon = normalized;
      }
      break;
    default:
      break;
  }
  audio.pickup();
}

function createEntity(kind, x = randomRange(26, WIDTH - 26), y = -20) {
  if (TARGET_DEFS[kind]) {
    const def = TARGET_DEFS[kind];
    return {
      id: nextId(),
      category: 'target',
      kind,
      x,
      y,
      radius: def.radius,
      vx: 0,
      vy: randomRange(1.18, 1.74),
      hp: kind === 'beerMega' ? 2 : 1,
      scoreValue: def.value,
      rotation: randomRange(0, Math.PI * 2),
      spin: randomRange(-0.02, 0.02),
      separationRadius: def.radius + 5,
    };
  }

  if (ENEMY_DEFS[kind]) {
    const def = ENEMY_DEFS[kind];
    return {
      id: nextId(),
      category: 'enemy',
      kind,
      x,
      y,
      radius: def.radius,
      vx: randomRange(-1.35, 1.35),
      vy: randomRange(1.55, 2.35) + state.run.level * 0.08,
      hp: def.hp,
      cadence: def.cadence,
      shootCooldownMs: randomRange(500, def.cadence),
      scoreValue: 0,
      separationRadius: def.radius + 6,
    };
  }

  if (METEOR_DEFS[kind]) {
    const def = METEOR_DEFS[kind];
    const flankLeft = kind === 'meteorFlankLeft';
    const flankRight = kind === 'meteorFlankRight';
    return {
      id: nextId(),
      category: 'hazard',
      kind,
      x: flankLeft ? -def.radius - 10 : flankRight ? WIDTH + def.radius + 10 : x,
      y: flankLeft || flankRight ? randomRange(40, 170) : y,
      radius: def.radius,
      vx: flankLeft ? randomRange(def.drift, def.drift + 0.7) : flankRight ? -randomRange(def.drift, def.drift + 0.7) : randomRange(-def.drift, def.drift),
      vy: randomRange(def.speedMin, def.speedMax) + state.run.level * 0.03,
      hp: def.hp,
      color: def.color,
      accent: def.accent,
      spin: randomRange(def.spin * 0.6, def.spin) * (Math.random() < 0.5 ? -1 : 1),
      rotation: randomRange(0, Math.PI * 2),
      separationRadius: def.radius + 7,
    };
  }

  if (kind === 'guitar' || kind === 'piano') {
    return {
      id: nextId(),
      category: 'farm',
      kind,
      x,
      y,
      radius: kind === 'guitar' ? 18 : 20,
      vx: randomRange(-0.4, 0.4),
      vy: randomRange(1.4, 2.0),
      hp: 999,
    };
  }

  return {
    id: nextId(),
    category: 'pickup',
    kind,
    x,
    y,
    radius: kind === 'heart' ? 14 : kind === 'volleyUpgrade' || kind === 'doubleShotPickup' ? 16 : 15,
    vx: 0,
    vy: randomRange(1.2, 1.8),
    rotation: randomRange(0, Math.PI * 2),
    spin: randomRange(-0.018, 0.018),
    separationRadius: (kind === 'heart' ? 14 : kind === 'volleyUpgrade' || kind === 'doubleShotPickup' ? 16 : 15) + 6,
  };
}

function getEntitySeparationRadius(entityOrKind) {
  if (!entityOrKind) return 0;
  if (typeof entityOrKind === 'string') {
    if (TARGET_DEFS[entityOrKind]) return TARGET_DEFS[entityOrKind].radius + 5;
    if (METEOR_DEFS[entityOrKind]) return METEOR_DEFS[entityOrKind].radius + 7;
    if (ENEMY_DEFS[entityOrKind]) return ENEMY_DEFS[entityOrKind].radius + 6;
    if (entityOrKind === 'heart') return 20;
    if (entityOrKind === 'volleyUpgrade' || entityOrKind === 'doubleShotPickup') return 22;
    return 21;
  }
  return entityOrKind.separationRadius || entityOrKind.radius || 0;
}

function canPlaceSpawnAt(kind, x, y) {
  const radius = getEntitySeparationRadius(kind);
  return !state.run.entities.some((entity) => {
    if (!entity?.radius) return false;
    if (!['target', 'pickup', 'hazard'].includes(entity.category)) return false;
    const minDistance = radius + getEntitySeparationRadius(entity) + ENTITY_SEPARATION_PADDING;
    return Math.hypot(entity.x - x, entity.y - y) < minDistance;
  });
}

function chooseSpawnPosition(kind, fallbackY) {
  const radius = getEntitySeparationRadius(kind);
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const x = randomRange(radius + 6, WIDTH - radius - 6);
    if (canPlaceSpawnAt(kind, x, fallbackY)) {
      return x;
    }
  }
  return clamp(randomRange(radius + 6, WIDTH - radius - 6), radius + 6, WIDTH - radius - 6);
}

function separateActiveEntities() {
  const collidables = state.run.entities.filter(
    (entity) => entity?.radius && ['target', 'pickup', 'hazard'].includes(entity.category),
  );
  for (let index = 0; index < collidables.length; index += 1) {
    const entityA = collidables[index];
    for (let inner = index + 1; inner < collidables.length; inner += 1) {
      const entityB = collidables[inner];
      const minDistance = getEntitySeparationRadius(entityA) + getEntitySeparationRadius(entityB) + ENTITY_SEPARATION_PADDING;
      const deltaX = entityB.x - entityA.x;
      const deltaY = entityB.y - entityA.y;
      const distance = Math.hypot(deltaX, deltaY) || 0.0001;
      if (distance >= minDistance) continue;
      const overlap = (minDistance - distance) * 0.5;
      const normalX = deltaX / distance;
      const normalY = deltaY / distance;
      entityA.x -= normalX * overlap;
      entityB.x += normalX * overlap;
      entityA.y -= normalY * overlap * 0.4;
      entityB.y += normalY * overlap * 0.4;
      entityA.x = clamp(entityA.x, entityA.radius + 4, WIDTH - entityA.radius - 4);
      entityB.x = clamp(entityB.x, entityB.radius + 4, WIDTH - entityB.radius - 4);
      entityA.y = Math.max(-entityA.radius - 18, entityA.y);
      entityB.y = Math.max(-entityB.radius - 18, entityB.y);
      if (entityA.category === 'target' || entityA.category === 'pickup') entityA.vx = 0;
      if (entityB.category === 'target' || entityB.category === 'pickup') entityB.vx = 0;
    }
  }
}

function spawnNormalEntity() {
  const pool = [
    { value: 'beerLite', weight: 20 },
    { value: 'beerGold', weight: 8 },
    { value: 'beerDark', weight: 8 },
    { value: 'beerNeon', weight: 6 },
    { value: 'beerMega', weight: 4 },
    { value: 'heart', weight: 1.8 },
    { value: 'shieldPickup', weight: 1.2 },
    { value: 'doubleShotPickup', weight: 1.0 },
    { value: 'superLaserPickup', weight: 0.9 },
    { value: 'volleyUpgrade', weight: 0.95 },
    { value: 'weaponSpread', weight: 0.8 },
    { value: 'weaponLaser', weight: 0.75 },
    { value: 'weaponChainsaw', weight: 0.7 },
    { value: 'weaponMissile', weight: 0.65 },
    { value: 'weaponPaw', weight: 0.6 },
    { value: 'weaponBottle', weight: 0.55 },
    { value: 'weaponIce', weight: 0.5 },
    { value: 'meteorSmall', weight: 3.8 },
    { value: 'meteorLarge', weight: 2.8 },
    { value: 'meteorShard', weight: 2.3 },
    { value: 'meteorTwin', weight: 2.1 },
    { value: 'meteorFlankLeft', weight: 1.8 },
    { value: 'meteorFlankRight', weight: 1.8 },
  ];
  const pick = weightedChoice(pool);

  const y = pick === 'meteorFlankLeft' || pick === 'meteorFlankRight' ? -40 : -24;
  const x = chooseSpawnPosition(pick, y);
  state.run.entities.push(createEntity(pick, x, y));
}

function countEntitiesByCategory(category) {
  return state.run.entities.filter((entity) => entity.category === category).length;
}

function hasLivePlanet() {
  return false;
}

function spawnPlanet() {
  return null;
}

function countLiveEnemies() {
  return state.run.entities.filter((entity) => entity.category === 'enemy').length;
}

function getEnemyCap() {
  return 0;
}

function getEnemySpawnSlots() {
  return 0;
}

function spawnEnemyGroup(groupSize) {
  return 0;
}

function spawnBoss() {
  const config = BOSSES[state.run.bossIndex % BOSSES.length];
  const hpBase = 250 + state.run.bossesDefeated * 120;
  const spinDirection = Math.random() < 0.5 ? -1 : 1;
  state.run.boss = {
    id: nextId(),
    name: config.name,
    pattern: config.pattern,
    attackStyle: config.attackStyle || config.pattern,
    x: WIDTH / 2,
    y: 72,
    width: config.width || (config.isGuitarBoss ? 104 : config.isPianoBoss ? 108 : config.isMegaMaster ? 102 : 96),
    height: config.height || (config.isTerminator ? 72 : 68),
    maxHp: hpBase,
    hp: hpBase,
    direction: 1,
    shieldMs: 0,
    shieldCooldownMs: 2800,
    attackCooldownMs: config.baseCooldownMs || 1320,
    movePhase: 0,
    rotation: randomRange(0, Math.PI * 2),
    rotationSpeed: randomRange(0.005, 0.016) * spinDirection,
    scale: 1,
    pulseMs: 0,
    enraged: false,
    laserBurstMs: randomRange(3200, 4800),
    color: config.color,
    accent: config.accent,
    texture: config.texture,
    eye: config.eye,
    bodyColor: config.bodyColor,
    headColor: config.headColor,
    earColor: config.earColor,
    glowColor: config.glowColor || config.accent,
    wingColor: config.wingColor || config.bodyColor,
    trail: Array.isArray(config.trail) ? config.trail.slice() : [],
    hasHorn: Boolean(config.hasHorn),
    hasWings: Boolean(config.hasWings),
    hasCrown: Boolean(config.hasCrown),
    hasCircuitLines: Boolean(config.hasCircuitLines),
    isGhostly: Boolean(config.isGhostly),
    isGalactic: Boolean(config.isGalactic),
    isMegaMaster: Boolean(config.isMegaMaster),
    isGuitarBoss: Boolean(config.isGuitarBoss),
    isPianoBoss: Boolean(config.isPianoBoss),
    isTerminator: Boolean(config.isTerminator),
    isJoker: Boolean(config.isJoker),
  };
  state.run.phase = 'boss';
  state.run.bossIntroMs = 2600;
  state.run.bossDarkPulseMs = 1100;
  state.run.lastPickupLabel = state.language === 'ru' ? `${config.name} РїРѕСЏРІРёР»СЃСЏ` : `${config.name} entered`;
  pushEvent(state.language === 'ru' ? 'РЈР“Р РћР—Рђ' : 'THREAT', state.language === 'ru' ? `${config.name} РІРѕС€РµР» РІ С„Р°Р·Сѓ ${config.pattern}.` : `${config.name} entered with ${config.pattern} pressure.`, config.accent);
  state.run.bossIndex += 1;
  nudgeCamera(320, 5);
  addFloatingText(WIDTH / 2 - 40, 70, `${config.name}!`, config.accent);
  audio.bossScream();
}

function defeatBoss() {
  if (!state.run.boss) return;
  const boss = state.run.boss;
  const droppedWeapon = pickBossWeaponDrop();
  const tier = getNapiwasBonusTier();
  const mugReward = getBossBonusMugs();
  rewardScore(500, state.run.boss.x, state.run.boss.y, '#ffd053');
  state.beerBalance += mugReward;
  state.run.lives += 2;
  state.run.maxLivesSeen = Math.max(state.run.maxLivesSeen, state.run.lives);
  state.run.level += 1;
  state.run.bossesDefeated += 1;
  state.run.runSpeedMultiplier = clamp(state.run.runSpeedMultiplier * 1.25, 1, 3.2);
  state.run.bossFrenzyMs = Math.max(state.run.bossFrenzyMs, 18000);
  state.run.bossIntroMs = 1600;
  const speedTag = `x${state.run.runSpeedMultiplier.toFixed(2)}`;
  state.run.lastPickupLabel = state.language === 'ru' ? 'Р‘РѕСЃСЃ РїРѕРІРµСЂР¶РµРЅ' : 'Boss down';
  pushEvent(
    state.language === 'ru' ? 'Р‘РћРЎРЎ РџРђР›' : 'BOSS DOWN',
    state.language === 'ru'
      ? `${boss.name} уничтожен. +500, +2 жизни, +${mugReward} кружек, дроп ${getWeaponName(droppedWeapon)} • ${localizedText(tier.label)}.`
      : `${boss.name} collapsed. +500, +2 lives, +${mugReward} mugs, ${getWeaponName(droppedWeapon)} drop • ${localizedText(tier.label)}.`,
    '#ffd053',
  );
  state.run.phase = 'normal';
  state.run.boss = null;
  state.run.bossDarkPulseMs = 0;
  state.run.nextBossScore += 500;
  state.run.bossCooldownMs = BOSS_COOLDOWN_MS;
  state.run.arenaPaletteIndex = (state.run.arenaPaletteIndex + 1) % PALETTES.length;
  state.run.entities.push(createEntity(getWeaponPickupKind(droppedWeapon), boss.x, boss.y + 18));
  nudgeCamera(420, 6);
  unlockMusicTrack('afterboss');
  void postLiveEvent('bossDefeat', boss.name);
  audio.bossDefeat();
}

function canSpawnBoss() {
  return (
    state.run.phase !== 'boss' &&
    !state.run.boss &&
    state.run.bossCooldownMs <= 0 &&
    state.run.score >= state.run.nextBossScore
  );
}

function nearestTarget(x, y) {
  const candidates = state.run.entities.filter((entity) => entity.category === 'target');
  if (getCurrentWeapon() === 'superLaser') {
    candidates.push(...state.run.entities.filter((entity) => entity.category === 'hazard'));
  }
  if (state.run.boss) {
    candidates.push({ x: state.run.boss.x, y: state.run.boss.y });
  }
  let best = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const entity of candidates) {
    const dx = entity.x - x;
    const dy = entity.y - y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      best = entity;
    }
  }
  return best;
}

function firePlayerWeapon() {
  const weaponId = getCurrentWeapon();
  const weapon = WEAPONS[weaponId];
  const weaponColor = getWeaponColor(weaponId);
  const originX = state.run.player.x + state.run.player.width / 2;
  const originY = state.run.player.y + 8;
  const trackDelta = 0;
  const bullets = [];
  const volleyLevel = state.run.volleyLevel || 0;
  const addBullet = (bullet) => bullets.push(bullet);

  if (weaponId === 'spread') {
    const baseSpread = [-4.4, -2.2, 0, 2.2, 4.4];
    if (volleyLevel >= 1) baseSpread.unshift(-6);
    if (volleyLevel >= 2) baseSpread.push(6);
    if (volleyLevel >= 3) baseSpread.unshift(-7.6);
    if (volleyLevel >= 4) baseSpread.push(7.6);
    baseSpread.forEach((vx) => addBullet({ vx: vx + trackDelta, vy: -weapon.speed, radius: 4 }));
  } else if (weaponId === 'laser') {
    addBullet({ vx: trackDelta * 0.25, vy: -weapon.speed, radius: 3, width: 5, height: 24 });
    if (volleyLevel >= 2) {
      addBullet({ vx: -0.9, vy: -weapon.speed * 0.96, radius: 3, width: 4, height: 20, xOffset: -7 });
      addBullet({ vx: 0.9, vy: -weapon.speed * 0.96, radius: 3, width: 4, height: 20, xOffset: 7 });
    }
    if (volleyLevel >= 4) {
      addBullet({ vx: -1.5, vy: -weapon.speed * 0.92, radius: 3, width: 4, height: 18, xOffset: -12 });
      addBullet({ vx: 1.5, vy: -weapon.speed * 0.92, radius: 3, width: 4, height: 18, xOffset: 12 });
    }
  } else if (weaponId === 'chainsaw') {
    addBullet({ vx: trackDelta - 0.8, vy: -weapon.speed, radius: 8, spin: 0, chainsaw: true });
    addBullet({ vx: trackDelta + 0.8, vy: -weapon.speed * 0.96, radius: 7, spin: Math.PI / 4, chainsaw: true });
    if (volleyLevel >= 3) {
      addBullet({ vx: trackDelta, vy: -weapon.speed * 1.02, radius: 7, spin: Math.PI / 2, chainsaw: true });
    }
  } else if (weaponId === 'missile') {
    addBullet({ vx: -1.3, vy: -weapon.speed, radius: 6, xOffset: -8 });
    addBullet({ vx: 1.3, vy: -weapon.speed, radius: 6, xOffset: 8 });
    if (volleyLevel >= 2) {
      addBullet({ vx: -0.7, vy: -weapon.speed * 0.94, radius: 5, xOffset: -16 });
      addBullet({ vx: 0.7, vy: -weapon.speed * 0.94, radius: 5, xOffset: 16 });
    }
  } else if (weaponId === 'paw') {
    addBullet({ vx: trackDelta - 1.2, vy: -weapon.speed, radius: 5, wobble: Math.random() * Math.PI * 2, xOffset: -5 });
    addBullet({ vx: trackDelta + 1.2, vy: -weapon.speed * 0.96, radius: 5, wobble: Math.random() * Math.PI * 2, xOffset: 5 });
    if (volleyLevel >= 2) {
      addBullet({ vx: trackDelta, vy: -weapon.speed * 0.98, radius: 5, wobble: Math.random() * Math.PI * 2 });
    }
    if (volleyLevel >= 4) {
      addBullet({ vx: trackDelta - 2.2, vy: -weapon.speed * 0.94, radius: 4.5, wobble: Math.random() * Math.PI * 2, xOffset: -10 });
      addBullet({ vx: trackDelta + 2.2, vy: -weapon.speed * 0.94, radius: 4.5, wobble: Math.random() * Math.PI * 2, xOffset: 10 });
    }
  } else if (weaponId === 'bottle') {
    addBullet({ vx: trackDelta, vy: -weapon.speed * 0.9, radius: 6, explosive: true });
    if (volleyLevel >= 3) {
      addBullet({ vx: -1.1, vy: -weapon.speed * 0.86, radius: 5, explosive: true, xOffset: -7 });
      addBullet({ vx: 1.1, vy: -weapon.speed * 0.86, radius: 5, explosive: true, xOffset: 7 });
    }
  } else if (weaponId === 'ice') {
    addBullet({ vx: trackDelta - 0.7, vy: -weapon.speed * 0.84, radius: 5, freeze: true });
    addBullet({ vx: trackDelta + 0.7, vy: -weapon.speed * 0.84, radius: 5, freeze: true });
    if (volleyLevel >= 2) {
      addBullet({ vx: trackDelta - 1.8, vy: -weapon.speed * 0.8, radius: 4.5, freeze: true, xOffset: -6 });
      addBullet({ vx: trackDelta + 1.8, vy: -weapon.speed * 0.8, radius: 4.5, freeze: true, xOffset: 6 });
    }
  } else if (weaponId === 'superLaser') {
    addBullet({ vx: 0, vy: -weapon.speed, radius: 6, width: 16, height: 36, laserBeam: true, pierce: true });
    if (volleyLevel >= 2) {
      addBullet({ vx: -1.1, vy: -weapon.speed * 0.95, radius: 5, width: 10, height: 28, laserBeam: true, pierce: true, xOffset: -9 });
      addBullet({ vx: 1.1, vy: -weapon.speed * 0.95, radius: 5, width: 10, height: 28, laserBeam: true, pierce: true, xOffset: 9 });
    }
  } else {
    addBullet({ vx: trackDelta - 0.45, vy: -weapon.speed, radius: 4 });
    addBullet({ vx: trackDelta + 0.45, vy: -weapon.speed, radius: 4 });
    if (volleyLevel >= 1) addBullet({ vx: trackDelta, vy: -weapon.speed * 1.02, radius: 4 });
    if (volleyLevel >= 2) {
      addBullet({ vx: trackDelta - 1.35, vy: -weapon.speed * 0.98, radius: 3.6, xOffset: -7 });
      addBullet({ vx: trackDelta + 1.35, vy: -weapon.speed * 0.98, radius: 3.6, xOffset: 7 });
    }
    if (volleyLevel >= 4) {
      addBullet({ vx: trackDelta - 2.1, vy: -weapon.speed * 0.94, radius: 3.4, xOffset: -12 });
      addBullet({ vx: trackDelta + 2.1, vy: -weapon.speed * 0.94, radius: 3.4, xOffset: 12 });
    }
  }

  if (isSkillActive('double')) {
    const duplicateWave = bullets.map((bullet) => ({
      ...bullet,
      xOffset: (bullet.xOffset || 0) + ((bullet.xOffset || 0) >= 0 ? 10 : -10),
      vx: (bullet.vx || 0) + ((bullet.vx || 0) >= 0 ? 0.28 : -0.28),
    }));
    bullets.push(...duplicateWave);
  }

  bullets.forEach((bullet) => {
    const xOffset = bullet.xOffset || 0;
    state.run.bullets.push({
      id: nextId(),
      source: 'player',
      weaponId,
      x: originX + xOffset,
      y: originY,
      vx: bullet.vx,
      vy: bullet.vy,
      radius: bullet.radius,
      width: bullet.width || bullet.radius * 2,
      height: bullet.height || bullet.radius * 2,
      color: weaponColor,
      damage: weapon.damage,
      lifeMs: 1400,
      homing: Boolean(bullet.homing),
      wobble: bullet.wobble || 0,
      spin: bullet.spin || 0,
      chainsaw: Boolean(bullet.chainsaw),
      explosive: Boolean(bullet.explosive),
      freeze: Boolean(bullet.freeze),
      laserBeam: Boolean(bullet.laserBeam),
      pierce: Boolean(bullet.pierce),
    });
  });

  const cadenceScale = clamp(1 - volleyLevel * 0.12, 0.45, 1);
  state.run.weaponCooldownMs = Math.max(24, Math.round(weapon.cadence * cadenceScale));
  audio.shoot();
}

function pushBossBullet(vx, vy, radius, color, extra = {}) {
  if (!state.run.boss) return;
  const boss = state.run.boss;
  const originX = extra.x ?? boss.x;
  const originY = extra.y ?? (boss.y + boss.height / 2);
  state.run.enemyBullets.push({
    id: nextId(),
    x: originX,
    y: originY,
    vx,
    vy,
    radius,
    color,
    lifeMs: 3200,
    pattern: extra.pattern || boss.pattern,
    ...extra,
  });
}

function fireBossRadialLaserBurst() {
  if (!state.run.boss) return;
  const boss = state.run.boss;
  const count = boss.enraged ? 8 : 6;
  const speed = boss.enraged ? 4.2 : 3.5;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count + boss.rotation;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const isHeavy = boss.enraged && index % 3 === 0;
    pushBossBullet(vx, vy, isHeavy ? 6.5 : 4.5, isHeavy ? boss.accent : boss.color, {
      laser: true,
      beam: isHeavy,
      radial: true,
      pattern: boss.pattern === 'notes' ? 'notes' : boss.pattern === 'strings' ? 'strings' : 'laser',
      lifeMs: isHeavy ? 2100 : 1700,
    });
  }
  pushEvent(
    state.language === 'ru' ? 'ЛАЗЕР' : 'LASER',
    state.language === 'ru' ? 'Босс выпустил круговой залп.' : 'Boss released a radial laser burst.',
    '#ff4848',
  );
}

function fireBossAttack() {
  if (!state.run.boss) return;
  const boss = state.run.boss;
  const density = 2 + Math.floor((state.difficulty - 1) / 2) + Math.min(2, Math.floor(state.run.bossesDefeated / 3));
  const aggression = 1 + state.run.bossesDefeated * 0.05;
  const playerCenterX = state.run.player.x + state.run.player.width / 2;
  const playerCenterY = state.run.player.y + state.run.player.height / 2;
  const attackStyle = boss.attackStyle || boss.pattern;
  const aimedVelocity = (speedMultiplier = 1, spreadX = 0, spreadY = 0) => {
    const dx = playerCenterX - boss.x + spreadX;
    const dy = playerCenterY - boss.y + spreadY;
    const mag = Math.max(1, Math.hypot(dx, dy));
    return {
      vx: (dx / mag) * speedMultiplier * aggression,
      vy: (dy / mag) * speedMultiplier * aggression,
    };
  };

  if (boss.enraged && Math.random() < 0.22) {
    const { vx, vy } = aimedVelocity(4.4);
    pushBossBullet(vx, vy, 7, '#ff4848', { laser: true, beam: true, lifeMs: 1900 });
    return;
  }

  switch (attackStyle) {
    case 'spread': {
      const spreadCount = clamp(density + 1, 3, 6);
      const angleStep = 0.15;
      const baseAngle = Math.atan2(playerCenterY - boss.y, playerCenterX - boss.x);
      const startAngle = baseAngle - ((spreadCount - 1) * angleStep) / 2;
      for (let i = 0; i < spreadCount; i += 1) {
        const angle = startAngle + i * angleStep;
        pushBossBullet(Math.cos(angle) * 3.8 * aggression, Math.sin(angle) * 3.8 * aggression, 4.6, boss.color, {
          pattern: 'spread',
        });
      }
      break;
    }
    case 'laser': {
      const center = aimedVelocity(4.9);
      pushBossBullet(center.vx, center.vy, 5.4, boss.accent, {
        laser: true,
        beam: true,
        pattern: 'laser',
        lifeMs: 1800,
      });
      if (!boss.shieldMs) {
        [-34, 34].forEach((offsetX) => {
          pushBossBullet(0, 4.2 * aggression, 4.2, boss.color, {
            x: boss.x + offsetX,
            y: boss.y + boss.height * 0.1,
            laser: true,
            pattern: 'laser',
            lifeMs: 1450,
          });
        });
      }
      break;
    }
    case 'rapid': {
      const rapidCount = clamp(density + 1, 3, 6);
      for (let i = 0; i < rapidCount; i += 1) {
        const jitter = aimedVelocity(3.7 + Math.random() * 0.5, randomRange(-28, 28), randomRange(-20, 20));
        pushBossBullet(jitter.vx, jitter.vy, 4.1, boss.color, { pattern: 'rapid', lifeMs: 1300 });
      }
      break;
    }
    case 'homing': {
      const homingCount = clamp(density, 2, 4);
      for (let i = 0; i < homingCount; i += 1) {
        const offset = (i - (homingCount - 1) / 2) * 18;
        const homing = aimedVelocity(3.2 + i * 0.22, offset, Math.abs(offset) * 0.18);
        pushBossBullet(homing.vx, homing.vy, 5.1, boss.accent, {
          pattern: 'homing',
          homing: true,
          x: boss.x + offset,
          y: boss.y + boss.height * 0.2,
          lifeMs: 1800,
        });
      }
      break;
    }
    case 'wave': {
      const waveCount = clamp(density + 2, 4, 7);
      for (let i = 0; i < waveCount; i += 1) {
        pushBossBullet((i - (waveCount - 1) / 2) * 0.95 * aggression, 3.1 * aggression, 4.25, boss.color, {
          wave: true,
          phase: i * 0.68,
          pattern: 'wave',
        });
      }
      const center = aimedVelocity(3.7);
      pushBossBullet(center.vx, center.vy, 4.8, boss.accent, { pattern: 'wave' });
      break;
    }
    case 'chainsaw': {
      const chainsawCount = clamp(Math.floor((density + 1) / 2), 2, 3);
      for (let i = 0; i < chainsawCount; i += 1) {
        const angleOffset = (i / chainsawCount) * Math.PI * 0.52 - Math.PI * 0.26;
        const baseAngle = Math.atan2(playerCenterY - boss.y, playerCenterX - boss.x) + angleOffset;
        const bladeSpeed = 4.1 * aggression;
        [-46, 46].forEach((offsetX, sideIndex) => {
          pushBossBullet(Math.cos(baseAngle + sideIndex * 0.08) * bladeSpeed, Math.sin(baseAngle + sideIndex * 0.08) * bladeSpeed, 5.8, boss.accent, {
            x: boss.x + offsetX,
            y: boss.y + boss.height * 0.1,
            pattern: 'chains',
            laser: true,
            lifeMs: 1700,
          });
        });
      }
      const center = aimedVelocity(4.8);
      pushBossBullet(center.vx, center.vy, 5.2, boss.color, { pattern: 'chains', laser: true, lifeMs: 1600 });
      break;
    }
    case 'furball': {
      const furballCount = clamp(density + 1, 3, 5);
      for (let i = 0; i < furballCount; i += 1) {
        const burst = aimedVelocity(3.1 + i * 0.16, (i - (furballCount - 1) / 2) * 14, randomRange(-18, 18));
        pushBossBullet(burst.vx, burst.vy, 5.5, boss.color, {
          pattern: 'rapid',
          lifeMs: 1850,
        });
        if (i % 2 === 0) {
          const spark = aimedVelocity(3.9, randomRange(-22, 22), randomRange(-16, 16));
          pushBossBullet(spark.vx, spark.vy, 3.8, boss.accent, {
            laser: true,
            pattern: 'rapid',
            lifeMs: 1200,
          });
        }
      }
      [-1, 0, 1].forEach((lane) => {
        pushBossBullet(lane * 1.5 * aggression, 2.9 * aggression, 4.5, boss.accent, {
          pattern: 'rapid',
          lifeMs: 1450,
        });
      });
      break;
    }
    case 'notes': {
      const noteCount = clamp(density + 2, 4, 6);
      for (let i = 0; i < noteCount; i += 1) {
        const riff = aimedVelocity(3.4 + Math.random() * 0.55, (i - (noteCount - 1) / 2) * 12, 0);
        pushBossBullet(riff.vx, riff.vy, 4.4, boss.color, {
          pattern: 'notes',
          lifeMs: 1750,
        });
      }
      for (let i = 0; i < 4; i += 1) {
        const spiralAngle = boss.rotation + (i / 4) * Math.PI * 2;
        pushBossBullet(Math.cos(spiralAngle) * 2.4 * aggression, Math.sin(spiralAngle) * 2.4 * aggression + 2.2, 3.8, boss.accent, {
          pattern: 'notes',
          laser: true,
          lifeMs: 1500,
        });
      }
      break;
    }
    case 'pianoStrings': {
      const pianoCount = clamp(density + 3, 5, 7);
      for (let i = 0; i < pianoCount; i += 1) {
        const offset = (i - (pianoCount - 1) / 2) * 0.28;
        const angle = Math.atan2(playerCenterY - boss.y, playerCenterX - boss.x) + offset;
        pushBossBullet(Math.cos(angle) * 3.8 * aggression, Math.sin(angle) * 3.8 * aggression, 4.5, boss.color, {
          pattern: 'strings',
          laser: true,
          lifeMs: 1700,
        });
      }
      if (!boss.shieldMs) {
        for (let i = 0; i < 4; i += 1) {
          const sideAngle = -0.34 + i * 0.22;
          pushBossBullet(Math.sin(sideAngle) * 2.4 * aggression, Math.cos(sideAngle) * 3.5 * aggression, 4.1, boss.accent, {
            x: boss.x - 34,
            y: boss.y + boss.height * 0.18,
            pattern: 'strings',
            lifeMs: 1450,
          });
          pushBossBullet(-Math.sin(sideAngle) * 2.4 * aggression, Math.cos(sideAngle) * 3.5 * aggression, 4.1, boss.accent, {
            x: boss.x + 34,
            y: boss.y + boss.height * 0.18,
            pattern: 'strings',
            lifeMs: 1450,
          });
        }
      }
      break;
    }
    case 'terminatorLaser': {
      const pulseCount = clamp(Math.floor((density + 1) / 2), 2, 3);
      for (let i = 0; i < pulseCount; i += 1) {
        pushBossBullet((i - (pulseCount - 1) / 2) * 0.85, 5.2 * aggression, 5.5, '#ff3434', {
          x: boss.x + (i - (pulseCount - 1) / 2) * 24,
          y: boss.y + boss.height * 0.22,
          laser: true,
          beam: true,
          pattern: 'laser',
          lifeMs: 1650,
        });
      }
      for (let i = 0; i < 4; i += 1) {
        const sparkAngle = boss.rotation + (i / 4) * Math.PI * 2;
        pushBossBullet(Math.cos(sparkAngle) * 2.2 * aggression, Math.sin(sparkAngle) * 2.2 * aggression + 1.6, 3.7, boss.accent, {
          pattern: 'rapid',
          lifeMs: 1200,
        });
      }
      break;
    }
    case 'cards': {
      const cardCount = clamp(density + 2, 4, 6);
      for (let i = 0; i < cardCount; i += 1) {
        const card = aimedVelocity(3.6, (i - (cardCount - 1) / 2) * 14, 0);
        pushBossBullet(card.vx, card.vy, 4.7, boss.color, {
          pattern: 'spread',
          card: true,
          lifeMs: 1700,
        });
      }
      const rainCount = clamp(density, 3, 5);
      for (let i = 0; i < rainCount; i += 1) {
        const rainX = 30 + (i / Math.max(1, rainCount - 1)) * (WIDTH - 60) + randomRange(-12, 12);
        pushBossBullet(randomRange(-0.5, 0.5), 4 * aggression, 4.1, boss.accent, {
          x: rainX,
          y: boss.y - 18,
          pattern: 'spread',
          card: true,
          lifeMs: 1900,
        });
      }
      break;
    }
    default: {
      const defaultCount = clamp(density + 1, 3, 5);
      for (let i = 0; i < defaultCount; i += 1) {
        pushBossBullet((i - defaultCount / 2) * 0.95 * aggression, 3 * aggression, 4.25, boss.color, {
          wave: true,
          phase: i * 0.68,
          pattern: 'wave',
        });
      }
      break;
    }
  }
}

function cycleWeapon() {
  const unlocked = WEAPON_ORDER.filter((weaponId) => state.run.unlockedWeapons.has(weaponId));
  const current = state.run.weapon;
  const index = unlocked.indexOf(current);
  if (index === -1) {
    state.run.weapon = unlocked[0] || 'standard';
    pushEvent(state.language === 'ru' ? 'РћР РЈР–РР•' : 'LOADOUT', `${getWeaponName(state.run.weapon)} ${state.language === 'ru' ? 'РІС‹Р±СЂР°РЅРѕ.' : 'selected.'}`, getWeaponColor(state.run.weapon));
    return;
  }
  state.run.weapon = unlocked[(index + 1) % unlocked.length];
  pushEvent(state.language === 'ru' ? 'РћР РЈР–РР•' : 'LOADOUT', `${getWeaponName(state.run.weapon)} ${state.language === 'ru' ? 'РІС‹Р±СЂР°РЅРѕ.' : 'selected.'}`, getWeaponColor(state.run.weapon));
}

function activateBoost() {
  if (state.run.player.boostMs > 0 || state.mode !== 'playing') return;
  state.run.player.boostMs = 2800;
  addFloatingText(state.run.player.x, state.run.player.y - 10, state.language === 'ru' ? 'Р‘РЈРЎРў' : 'BOOST', '#79d4b3');
  pushEvent(state.language === 'ru' ? 'Р‘РЈРЎРў' : 'BOOST', state.language === 'ru' ? 'РљРѕСЂРѕС‚РєРёР№ СЂС‹РІРѕРє СЃРєРѕСЂРѕСЃС‚Рё Р°РєС‚РёРІРёСЂРѕРІР°РЅ.' : 'Short burst of speed engaged.', '#79d4b3');
  nudgeCamera(120, 2);
}

function entityPlayerCollision(entity) {
  const px = state.run.player.x + state.run.player.width / 2;
  const py = state.run.player.y + state.run.player.height / 2;

  if (entity.radius) {
    const distance = Math.hypot(px - entity.x, py - entity.y);
    return distance < entity.radius + 18;
  }

  const left = entity.x - entity.width / 2;
  const right = entity.x + entity.width / 2;
  const top = entity.y - entity.height / 2;
  const bottom = entity.y + entity.height / 2;

  return (
    state.run.player.x < right &&
    state.run.player.x + state.run.player.width > left &&
    state.run.player.y < bottom &&
    state.run.player.y + state.run.player.height > top
  );
}

function bulletHitsCircle(bullet, entity) {
  const dx = bullet.x - entity.x;
  const dy = bullet.y - entity.y;
  return Math.hypot(dx, dy) <= bullet.radius + entity.radius;
}

function bulletHitsRect(bullet, entity) {
  const left = entity.x - entity.width / 2;
  const right = entity.x + entity.width / 2;
  const top = entity.y - entity.height / 2;
  const bottom = entity.y + entity.height / 2;
  return bullet.x + bullet.radius > left && bullet.x - bullet.radius < right && bullet.y + bullet.radius > top && bullet.y - bullet.radius < bottom;
}

function bossHitByBullet(bullet) {
  const boss = state.run.boss;
  if (!boss) return false;
  const dx = bullet.x - boss.x;
  const dy = bullet.y - boss.y;
  const hit = Math.abs(dx) < boss.width / 2 + bullet.radius && Math.abs(dy) < boss.height / 2 + bullet.radius;
  if (!hit) return false;
  if (boss.shieldMs > 0) {
    spawnParticles(bullet.x, bullet.y, '#fff1d6', 5);
    nudgeCamera(80, 1.5);
    return true;
  }
  boss.hp -= 1;
  audio.bossHit();
  spawnParticles(bullet.x, bullet.y, boss.accent, 6);
  nudgeCamera(90, 1.6);
  if (bullet.freeze) {
    state.run.enemyBullets.forEach((enemyBullet) => {
      enemyBullet.slowMs = Math.max(enemyBullet.slowMs || 0, 1400);
    });
  }
  if (bullet.explosive) {
    state.run.enemyBullets = state.run.enemyBullets.filter((enemyBullet) => {
      const distance = Math.hypot(enemyBullet.x - bullet.x, enemyBullet.y - bullet.y);
      return distance > 44;
    });
  }
  if (boss.hp <= 0) {
    defeatBoss();
  }
  return true;
}

function updateWorld(deltaMs) {
  if (state.mode !== 'playing') return;
  const worldSpeed = Math.max(1, state.run.runSpeedMultiplier || 1);
  const worldDeltaMs = deltaMs * worldSpeed;
  const scale = worldDeltaMs / FRAME_MS;
  const baseScale = deltaMs / FRAME_MS;
  const slowFactor = 1;
  state.run.elapsedMs += deltaMs;
  const meterDelta = Math.floor(state.run.elapsedMs / 50) - state.run.meters;
  if (meterDelta > 0) {
    state.run.meters += meterDelta;
    state.run.score += meterDelta;
    if (state.run.meters > 0 && state.run.meters % 100 === 0) {
      pushEvent(
        state.language === 'ru' ? 'РњР•РўР Р«' : 'METERS',
        state.language === 'ru' ? `${state.run.meters} Рј РїСЂРѕР№РґРµРЅРѕ.` : `${state.run.meters} m survived.`,
        '#86d1f2',
      );
    }
  }
  processScoreMilestones();
  state.run.weaponCooldownMs -= worldDeltaMs;
  state.run.player.invulnerableMs = Math.max(0, state.run.player.invulnerableMs - worldDeltaMs);
  state.run.player.boostMs = Math.max(0, state.run.player.boostMs - worldDeltaMs);
  state.run.comboTimerMs = Math.max(0, state.run.comboTimerMs - worldDeltaMs);
  state.run.bossCooldownMs = Math.max(0, state.run.bossCooldownMs - worldDeltaMs);
  state.run.bossIntroMs = Math.max(0, state.run.bossIntroMs - worldDeltaMs);
  state.run.bossDarkPulseMs = Math.max(0, state.run.bossDarkPulseMs - worldDeltaMs);
  state.run.cameraShakeMs = Math.max(0, state.run.cameraShakeMs - worldDeltaMs);
  state.run.bossFrenzyMs = Math.max(0, state.run.bossFrenzyMs - worldDeltaMs);
  if (state.run.cameraShakeMs <= 0) {
    state.run.cameraShakePower = 0;
  }
  state.run.tempWeaponMs = Math.max(0, state.run.tempWeaponMs - worldDeltaMs);
  state.run.beerMugMs = Math.max(0, state.run.beerMugMs - worldDeltaMs);

  if (state.run.tempWeaponMs <= 0) {
    state.run.tempWeapon = null;
  }

  if (state.run.comboTimerMs <= 0 && state.run.comboCount > 0) {
    resetCombo();
  }

  Object.keys(state.run.skillTimers).forEach((skillName) => {
    state.run.skillTimers[skillName] = Math.max(0, state.run.skillTimers[skillName] - worldDeltaMs);
  });

  const stickSmoothing = input.sliderActive ? 0.4 : 0.22;
  input.stickX += (input.stickTargetX - input.stickX) * Math.min(1, stickSmoothing * scale);
  input.stickY += (input.stickTargetY - input.stickY) * Math.min(1, stickSmoothing * scale);
  if (!input.sliderActive) {
    input.stickX *= Math.max(0, 1 - PLAYER_STEERING_FRICTION * scale);
    input.stickY *= Math.max(0, 1 - PLAYER_STEERING_FRICTION * scale);
  }

  const moveSpeedX = (state.run.player.boostMs > 0 ? 6.5 : 4.2) * scale;
  const moveSpeedY = (state.run.player.boostMs > 0 ? 5.4 : 3.4) * scale;
  let axisX = 0;
  let axisY = 0;
  if (input.left) axisX -= 1;
  if (input.right) axisX += 1;
  if (input.up) axisY -= 1;
  if (input.down) axisY += 1;
  const stickBoost = input.sliderActive ? JOYSTICK_INPUT_BOOST : 1;
  axisX += input.stickX * stickBoost;
  axisY += input.stickY * stickBoost;
  axisX = clamp(axisX, -1, 1);
  axisY = clamp(axisY, -1, 1);

  const desiredVelocityX = Math.abs(axisX) > 0.03 ? axisX * moveSpeedX : 0;
  const desiredVelocityY = Math.abs(axisY) > 0.03 ? axisY * moveSpeedY : 0;
  const steeringResponse = Math.min(1, PLAYER_STEERING_RESPONSE * scale);
  state.run.player.velocityX += (desiredVelocityX - state.run.player.velocityX) * steeringResponse;
  state.run.player.velocityY += (desiredVelocityY - state.run.player.velocityY) * steeringResponse;
  if (Math.abs(axisX) <= 0.03) {
    state.run.player.velocityX *= Math.max(0, 1 - PLAYER_STEERING_FRICTION * scale);
  }
  if (Math.abs(axisY) <= 0.03) {
    state.run.player.velocityY *= Math.max(0, 1 - PLAYER_STEERING_FRICTION * scale);
  }

  state.run.player.x += state.run.player.velocityX;
  state.run.player.y += state.run.player.velocityY;
  state.run.player.targetX = state.run.player.x;
  state.run.player.targetY = state.run.player.y;
  state.run.player.moveVelocity = state.run.player.velocityX;
  const yBounds = getPlayerYBounds();

  state.run.player.x = clamp(state.run.player.x, 0, WIDTH - PLAYER_WIDTH);
  state.run.player.y = clamp(state.run.player.y, yBounds.minY, yBounds.maxY);
  if (state.run.player.x === 0 || state.run.player.x === WIDTH - PLAYER_WIDTH) {
    state.run.player.velocityX = 0;
  }
  if (state.run.player.y === yBounds.minY || state.run.player.y === yBounds.maxY) {
    state.run.player.velocityY = 0;
  }
  if (input.sliderActive) syncSliderFromInput();
  else syncSliderFromPlayer();

  if (state.run.weaponCooldownMs <= 0) {
    firePlayerWeapon();
  }

  state.run.spawnTimerMs -= worldDeltaMs;
  if (state.run.phase !== 'boss' && state.run.spawnTimerMs <= 0) {
    spawnNormalEntity();
    if (Math.random() < 0.22 + state.run.level * 0.03) {
      spawnNormalEntity();
    }
    state.run.spawnTimerMs = clamp((980 - state.run.level * 42) / Math.max(1, worldSpeed * 0.92), 160, 980);
  }

  if (canSpawnBoss()) {
    spawnBoss();
  }

  if (state.run.boss) {
    const boss = state.run.boss;
    boss.movePhase += 0.014 * scale;
    boss.rotation += boss.rotationSpeed * scale;
    boss.x += boss.direction * (1.8 + state.difficulty * 0.25) * scale;
    if (boss.x < 58 || boss.x > WIDTH - 58) {
      boss.direction *= -1;
      boss.y = clamp(boss.y + 10, 58, 118);
    }
    boss.y += Math.sin(boss.movePhase) * 0.25 * scale;
    if (Math.random() < 0.0026 * scale && boss.pulseMs <= 0) {
      boss.pulseMs = 820;
      state.run.bossDarkPulseMs = Math.max(state.run.bossDarkPulseMs, 620);
      nudgeCamera(180, 3.2);
    }
    boss.pulseMs = Math.max(0, boss.pulseMs - worldDeltaMs);
    const pulsePhase = boss.pulseMs > 0 ? Math.sin((boss.pulseMs / 820) * Math.PI) : 0;
    boss.scale = 1 + pulsePhase * 0.28;

    if (!boss.enraged && boss.hp <= Math.floor((boss.maxHp * 2) / 3)) {
      boss.enraged = true;
      boss.laserBurstMs = 320;
      state.run.bossDarkPulseMs = Math.max(state.run.bossDarkPulseMs, 780);
      pushEvent(
        state.language === 'ru' ? 'ЯРОСТЬ' : 'RAGE',
        state.language === 'ru' ? `${boss.name} вошел в ярость.` : `${boss.name} entered rage mode.`,
        '#f28a1a',
      );
      nudgeCamera(260, 4);
    }

    boss.shieldCooldownMs -= worldDeltaMs;
    if (boss.shieldCooldownMs <= 0 && boss.shieldMs <= 0) {
      boss.shieldMs = 1200;
      boss.shieldCooldownMs = 3800;
      pushEvent(state.language === 'ru' ? 'Р©РРў' : 'SHIELD', state.language === 'ru' ? `${boss.name} РїРѕРґРЅСЏР» С‰РёС‚. РЎРјРµС‰Р°Р№СЃСЏ.` : `${boss.name} is shielded. Reposition now.`, '#fff1d6');
    }
    boss.shieldMs = Math.max(0, boss.shieldMs - worldDeltaMs);
    boss.laserBurstMs -= worldDeltaMs;
    if (boss.laserBurstMs <= 0) {
      fireBossRadialLaserBurst();
      boss.laserBurstMs = boss.enraged ? randomRange(2500, 3600) : randomRange(3800, 5600);
    }
    boss.attackCooldownMs -= worldDeltaMs;
    if (boss.attackCooldownMs <= 0) {
      fireBossAttack();
      boss.attackCooldownMs = clamp((boss.enraged ? 1180 : 1580) - state.difficulty * 70, 900, 1680);
    }
  }

  state.run.entities.forEach((entity) => {
    const factor = entity.category === 'pickup' ? slowFactor * 0.9 : slowFactor;
    const entityScale = entity.category === 'hazard' ? baseScale : scale;
    entity.x += entity.vx * entityScale;
    entity.y += entity.vy * factor * entityScale;
    if (entity.category === 'hazard' && entity.spin) {
      entity.rotation += entity.spin * scale;
    }
    if ((entity.category === 'target' || entity.category === 'pickup') && entity.spin) {
      entity.rotation += entity.spin * scale;
    }
  });
  separateActiveEntities();

  state.run.bullets.forEach((bullet) => {
    bullet.lifeMs -= worldDeltaMs;
    if (bullet.weaponId === 'paw') {
      bullet.wobble += 0.18 * scale;
      bullet.x += Math.sin(bullet.wobble) * 1.8 * scale;
    }
    if (bullet.chainsaw) {
      bullet.spin += 0.22 * scale;
    }
    bullet.x += bullet.vx * scale;
    bullet.y += bullet.vy * scale;
  });

  state.run.enemyBullets.forEach((bullet) => {
    bullet.lifeMs -= worldDeltaMs;
    bullet.slowMs = Math.max(0, (bullet.slowMs || 0) - worldDeltaMs);
    const bulletScale = bullet.slowMs > 0 ? 0.55 : slowFactor;
    if (bullet.wave) {
      bullet.phase = (bullet.phase || 0) + 0.1 * scale;
      bullet.x += Math.sin(bullet.phase) * 1.8 * scale;
    }
    bullet.x += bullet.vx * bulletScale * scale;
    bullet.y += bullet.vy * bulletScale * scale;
  });

  state.run.particles.forEach((particle) => {
    particle.lifeMs -= worldDeltaMs;
    particle.x += particle.vx * scale;
    particle.y += particle.vy * scale;
    particle.vy += 0.03 * scale;
  });

  state.run.floatingTexts.forEach((text) => {
    text.lifeMs -= worldDeltaMs;
    text.y -= 0.5 * scale;
  });

  const remainingEntities = [];
  for (const entity of state.run.entities) {
    if (entityPlayerCollision(entity)) {
      if (entity.category === 'pickup') {
        applyPickup(entity);
      } else if (entity.category === 'target') {
        spawnParticles(entity.x, entity.y, TARGET_DEFS[entity.kind]?.color || '#ffd053', 8);
      } else if (isSkillActive('guardian')) {
        addFloatingText(entity.x, entity.y, state.language === 'ru' ? 'Р©РРў' : 'SHIELD', '#91d87f');
      } else {
        loseLife(`${entity.kind} clipped you.`, entity.x, entity.y);
      }
      continue;
    }

    const outBottom = entity.y - (entity.radius || entity.height / 2) > HEIGHT + 24;
    const outSide = entity.radius ? (entity.x < -entity.radius - 40 || entity.x > WIDTH + entity.radius + 40) : false;
    if (outBottom || outSide) {
      continue;
    }

    remainingEntities.push(entity);
  }
  state.run.entities = remainingEntities;

  const nextBullets = [];
  for (const bullet of state.run.bullets) {
    if (bullet.lifeMs <= 0 || bullet.y < -40 || bullet.x < -40 || bullet.x > WIDTH + 40) {
      continue;
    }

    let consumed = false;
    if (state.run.boss && bossHitByBullet(bullet)) {
      consumed = true;
    }

    if (!consumed) {
      for (const entity of state.run.entities) {
        const hit = entity.radius ? bulletHitsCircle(bullet, entity) : bulletHitsRect(bullet, entity);
        if (!hit) continue;

        if (entity.category === 'pickup') {
          spawnParticles(entity.x, entity.y, PICKUP_COLORS[entity.kind] || '#fff8ea', 6);
          addFloatingText(entity.x, entity.y, 'MISS', '#c9b39c');
          state.run.entities = state.run.entities.filter((item) => item.id !== entity.id);
        } else if (entity.category === 'hazard') {
          if (bullet.weaponId === 'superLaser') {
            entity.hp -= bullet.damage;
            spawnParticles(entity.x, entity.y, '#ff875f', 8);
            if (entity.hp <= 0) {
              state.run.entities = state.run.entities.filter((item) => item.id !== entity.id);
              addFloatingText(entity.x, entity.y, state.language === 'ru' ? 'РџР РћР‘РРўРР•' : 'BREACH', '#ff875f');
            }
          } else {
            spawnParticles(bullet.x, bullet.y, '#fff1d6', 4);
          }
          } else {
            entity.hp -= bullet.damage;
            spawnParticles(entity.x, entity.y, bullet.color, 6);
            if (bullet.freeze) {
              entity.vy *= 0.6;
            }
            if (entity.hp <= 0) {
              if (entity.category === 'target') {
                state.run.targetsDestroyed += 1;
                rewardCombatScore(entity.scoreValue * state.run.level, entity.x, entity.y, '#ffd053');
                rewardBeerCurrency(entity.kind, entity.x, entity.y);
              } else {
                addFloatingText(entity.x, entity.y, state.language === 'ru' ? 'Р§РРЎРўРћ' : 'CLEAR', '#b4c5ff');
              }
              state.run.entities = state.run.entities.filter((item) => item.id !== entity.id);
            }
          }

        if (bullet.explosive) {
          state.run.entities = state.run.entities.filter((entityItem) => {
            const distance = Math.hypot(entityItem.x - bullet.x, entityItem.y - bullet.y);
            if ((entityItem.category === 'target' || entityItem.category === 'enemy') && distance < 54) {
              if (entityItem.category === 'target' && entityItem.scoreValue > 0) {
                state.run.targetsDestroyed += 1;
                rewardCombatScore(entityItem.scoreValue * state.run.level, entityItem.x, entityItem.y, '#ffd053');
                rewardBeerCurrency(entityItem.kind, entityItem.x, entityItem.y);
              }
              return false;
            }
            return true;
          });
        }

        consumed = true;
        break;
      }
    }

    if (!consumed) {
      nextBullets.push(bullet);
    }
  }
  state.run.bullets = nextBullets;

  const nextEnemyBullets = [];
  for (const bullet of state.run.enemyBullets) {
    if (bullet.lifeMs <= 0 || bullet.y > HEIGHT + 40 || bullet.x < -40 || bullet.x > WIDTH + 40) {
      continue;
    }

    const playerCenterX = state.run.player.x + state.run.player.width / 2;
    const playerCenterY = state.run.player.y + state.run.player.height / 2;
    const hitPlayer = Math.hypot(playerCenterX - bullet.x, playerCenterY - bullet.y) <= bullet.radius + 18;

    if (hitPlayer) {
      if (isSkillActive('guardian')) {
        addFloatingText(bullet.x, bullet.y, state.language === 'ru' ? 'Р©РРў' : 'BLOCK', '#9ddf85');
      } else {
        loseLife(state.language === 'ru' ? 'РџРѕРїР°РґР°РЅРёРµ РїРѕ РєРѕСЂР°Р±Р»СЋ.' : 'Boss fire hit you.', bullet.x, bullet.y);
      }
      continue;
    }

    nextEnemyBullets.push(bullet);
  }
  state.run.enemyBullets = nextEnemyBullets;

  state.run.particles = state.run.particles.filter((particle) => particle.lifeMs > 0);
  state.run.floatingTexts = state.run.floatingTexts.filter((text) => text.lifeMs > 0);
}

function drawGrid(palette) {
  return;
}

function drawArenaBackdrop(palette) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawSparkle(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(size, 0);
  ctx.moveTo(0, -size);
  ctx.lineTo(0, size);
  ctx.stroke();
  ctx.restore();
}

function drawCatToken(radius, baseColor, accentColor, options = {}) {
  const faceColor = options.faceColor || '#fff7ea';
  const maskColor = options.maskColor || withAlpha('#2b2220', 0.16);
  const stripeColor = options.stripeColor || withAlpha('#fff4cf', 0.85);
  const eyeColor = options.eyeColor || '#241713';
  const glowColor = options.glowColor || accentColor;
  const angularEyes = Boolean(options.angularEyes);

  ctx.save();
  ctx.shadowColor = withAlpha(glowColor, 0.55);
  ctx.shadowBlur = radius * 0.95;

  const shell = ctx.createRadialGradient(-radius * 0.3, -radius * 0.45, radius * 0.15, 0, 0, radius * 1.1);
  shell.addColorStop(0, '#fffdf6');
  shell.addColorStop(0.32, baseColor);
  shell.addColorStop(1, accentColor);
  ctx.fillStyle = shell;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = withAlpha('#fff8ea', 0.72);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 1.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = withAlpha('#ffffff', 0.22);
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.78, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.72, -radius * 0.12);
  ctx.lineTo(-radius * 0.48, -radius * 0.98);
  ctx.lineTo(-radius * 0.12, -radius * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(radius * 0.72, -radius * 0.12);
  ctx.lineTo(radius * 0.48, -radius * 0.98);
  ctx.lineTo(radius * 0.12, -radius * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = withAlpha(faceColor, 0.72);
  ctx.beginPath();
  ctx.moveTo(-radius * 0.48, -radius * 0.28);
  ctx.lineTo(-radius * 0.4, -radius * 0.74);
  ctx.lineTo(-radius * 0.12, -radius * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(radius * 0.48, -radius * 0.28);
  ctx.lineTo(radius * 0.4, -radius * 0.74);
  ctx.lineTo(radius * 0.12, -radius * 0.3);
  ctx.closePath();
  ctx.fill();

  if (options.mask) {
    ctx.fillStyle = maskColor;
    ctx.beginPath();
    ctx.ellipse(0, -2, radius * 0.68, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = faceColor;
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.18, radius * 0.48, radius * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = stripeColor;
  ctx.beginPath();
  ctx.roundRect(-radius * 0.13, -radius * 0.62, radius * 0.26, radius * 0.4, radius * 0.14);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(-radius * 0.44, -radius * 0.38, radius * 0.17, radius * 0.24, radius * 0.08);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(radius * 0.27, -radius * 0.38, radius * 0.17, radius * 0.24, radius * 0.08);
  ctx.fill();

  ctx.fillStyle = eyeColor;
  if (angularEyes) {
    ctx.beginPath();
    ctx.moveTo(-radius * 0.48, -radius * 0.08);
    ctx.lineTo(-radius * 0.16, -radius * 0.18);
    ctx.lineTo(-radius * 0.22, radius * 0.02);
    ctx.lineTo(-radius * 0.5, radius * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(radius * 0.48, -radius * 0.08);
    ctx.lineTo(radius * 0.16, -radius * 0.18);
    ctx.lineTo(radius * 0.22, radius * 0.02);
    ctx.lineTo(radius * 0.5, radius * 0.05);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(-radius * 0.3, -radius * 0.05, radius * 0.1, radius * 0.16, 0, 0, Math.PI * 2);
    ctx.ellipse(radius * 0.3, -radius * 0.05, radius * 0.1, radius * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = withAlpha('#fff8ea', 0.72);
  ctx.beginPath();
  ctx.arc(-radius * 0.34, -radius * 0.1, radius * 0.025 + 0.6, 0, Math.PI * 2);
  ctx.arc(radius * 0.26, -radius * 0.1, radius * 0.025 + 0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff9db5';
  ctx.beginPath();
  ctx.moveTo(-radius * 0.12, radius * 0.12);
  ctx.lineTo(0, 0);
  ctx.lineTo(radius * 0.12, radius * 0.12);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = withAlpha('#2f241e', 0.85);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.08, radius * 0.16);
  ctx.quadraticCurveTo(0, radius * 0.3, radius * 0.08, radius * 0.16);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-radius * 0.22, radius * 0.18);
  ctx.lineTo(-radius * 0.54, radius * 0.12);
  ctx.moveTo(-radius * 0.22, radius * 0.26);
  ctx.lineTo(-radius * 0.54, radius * 0.32);
  ctx.moveTo(radius * 0.22, radius * 0.18);
  ctx.lineTo(radius * 0.54, radius * 0.12);
  ctx.moveTo(radius * 0.22, radius * 0.26);
  ctx.lineTo(radius * 0.54, radius * 0.32);
  ctx.stroke();
  ctx.fillStyle = withAlpha('#ffb7c5', 0.26);
  ctx.beginPath();
  ctx.arc(-radius * 0.42, radius * 0.18, radius * 0.11, 0, Math.PI * 2);
  ctx.arc(radius * 0.42, radius * 0.18, radius * 0.11, 0, Math.PI * 2);
  ctx.fill();
  const lowerShine = ctx.createLinearGradient(0, radius * 0.14, 0, radius * 0.9);
  lowerShine.addColorStop(0, withAlpha(faceColor, 0));
  lowerShine.addColorStop(1, withAlpha(faceColor, 0.18));
  ctx.fillStyle = lowerShine;
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.5, radius * 0.56, radius * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  if (options.crown) {
    ctx.fillStyle = '#ffe38a';
    ctx.beginPath();
    ctx.moveTo(-radius * 0.44, -radius * 0.88);
    ctx.lineTo(-radius * 0.24, -radius * 0.58);
    ctx.lineTo(0, -radius * 0.92);
    ctx.lineTo(radius * 0.24, -radius * 0.58);
    ctx.lineTo(radius * 0.44, -radius * 0.88);
    ctx.lineTo(radius * 0.48, -radius * 0.46);
    ctx.lineTo(-radius * 0.48, -radius * 0.46);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawTarget(entity) {
  const def = TARGET_DEFS[entity.kind];
  ctx.save();
  ctx.translate(entity.x, entity.y);
  if (entity.rotation) {
    ctx.rotate(entity.rotation);
  }
  ctx.translate(0, Math.sin(state.run.elapsedMs * 0.006 + entity.id) * 1.2);
  ctx.rotate(Math.sin(state.run.elapsedMs * 0.0026 + entity.id * 0.2) * 0.04);
  const auraRadius = entity.radius + 7;
  const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, auraRadius);
  aura.addColorStop(0, withAlpha(def.color, 0.3));
  aura.addColorStop(1, withAlpha(def.color, 0));
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
  ctx.fill();
  const mugColor = ctx.createLinearGradient(-entity.radius, -entity.radius, entity.radius, entity.radius);
  mugColor.addColorStop(0, '#fff4d8');
  mugColor.addColorStop(0.42, def.color);
  mugColor.addColorStop(1, withAlpha('#5c3017', 0.96));
  ctx.shadowColor = withAlpha(def.color, 0.46);
  ctx.shadowBlur = 14;
  ctx.fillStyle = mugColor;
  ctx.beginPath();
  ctx.roundRect(-entity.radius * 0.7, -entity.radius * 0.8, entity.radius * 1.18, entity.radius * 1.46, 6);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = withAlpha('#fff8ea', 0.65);
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.strokeStyle = withAlpha('#fff8ea', 0.72);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(entity.radius * 0.62, -1, entity.radius * 0.33, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = withAlpha('#fff8ea', 0.88);
  [-0.42, -0.08, 0.22].forEach((offset, index) => {
    ctx.beginPath();
    ctx.arc(entity.radius * offset, -entity.radius * (0.94 - index * 0.08), 2.8 - index * 0.45, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#fff8ea';
  ctx.beginPath();
  ctx.roundRect(-entity.radius * 0.82, -entity.radius, entity.radius * 1.36, entity.radius * 0.46, 5);
  ctx.fill();
  ctx.fillStyle = withAlpha(def.color, 0.28);
  ctx.beginPath();
  ctx.roundRect(-entity.radius * 0.72, entity.radius * 0.02, entity.radius * 0.98, entity.radius * 0.3, 4);
  ctx.fill();
  ctx.fillStyle = withAlpha('#ffe7a7', 0.46);
  ctx.fillRect(-entity.radius * 0.5, -entity.radius * 0.42, entity.radius * 0.62, entity.radius * 0.8);
  ctx.fillStyle = withAlpha('#fff8ea', 0.22);
  ctx.beginPath();
  ctx.ellipse(-entity.radius * 0.2, -entity.radius * 0.2, entity.radius * 0.22, entity.radius * 0.12, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = withAlpha('#fffef8', 0.18);
  ctx.beginPath();
  ctx.roundRect(-entity.radius * 0.58, entity.radius * 0.34, entity.radius * 0.7, entity.radius * 0.12, 5);
  ctx.fill();
  if (entity.kind === 'beerGold' || entity.kind === 'beerMega') {
    drawSparkle(entity.radius * 0.8, -entity.radius * 0.8, 4, '#fff4c2');
  }
  if (entity.kind === 'beerDark') {
    ctx.fillStyle = withAlpha('#2f241e', 0.2);
    ctx.beginPath();
    ctx.arc(-entity.radius * 0.12, entity.radius * 0.1, entity.radius * 0.22, 0, Math.PI * 2);
    ctx.arc(entity.radius * 0.16, entity.radius * 0.08, entity.radius * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }
  if (entity.kind === 'beerNeon' || entity.kind === 'beerMega') {
    ctx.strokeStyle = withAlpha('#fff9ef', 0.68);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-entity.radius * 0.36, entity.radius * 0.24);
    ctx.lineTo(entity.radius * 0.32, -entity.radius * 0.12);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBossTextureLayer(boss, radiusOuter, radiusInner) {
  ctx.save();
  switch (boss.texture) {
    case 'prism': {
      ctx.strokeStyle = withAlpha('#7a0f1c', 0.44);
      ctx.lineWidth = 1.6;
      for (let index = 0; index < 7; index += 1) {
        const angle = (Math.PI * 2 * index) / 7;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * radiusInner * 0.28, Math.sin(angle) * radiusInner * 0.28);
        ctx.lineTo(Math.cos(angle) * radiusOuter * 0.82, Math.sin(angle) * radiusOuter * 0.82);
        ctx.stroke();
      }
      break;
    }
    case 'ember':
      ctx.strokeStyle = withAlpha('#a20d22', 0.48);
      ctx.lineWidth = 1.8;
      [-0.46, -0.12, 0.2].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(radiusOuter * offset, -radiusOuter * 0.52);
        ctx.lineTo(radiusOuter * (offset + 0.18), -radiusOuter * 0.04);
        ctx.lineTo(radiusOuter * (offset - 0.06), radiusOuter * 0.42);
        ctx.stroke();
      });
      break;
    case 'circuit':
      ctx.strokeStyle = withAlpha('#5f0a16', 0.45);
      ctx.lineWidth = 1.4;
      [-0.42, 0, 0.42].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(radiusOuter * offset, -radiusOuter * 0.56);
        ctx.lineTo(radiusOuter * offset, radiusOuter * 0.5);
        ctx.lineTo(radiusOuter * (offset > 0 ? 0.18 : -0.18), radiusOuter * 0.5);
        ctx.stroke();
      });
      [-0.36, 0.36].forEach((offset) => {
        ctx.fillStyle = withAlpha('#d63045', 0.55);
        ctx.beginPath();
        ctx.roundRect(radiusOuter * offset - 4, -4, 8, 8, 2);
        ctx.fill();
      });
      break;
    case 'mist':
      ctx.strokeStyle = withAlpha('#7f101d', 0.34);
      ctx.lineWidth = 1.6;
      [0.54, 0.76, 0.92].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(0, 0, radiusOuter * scale, Math.PI * 0.1, Math.PI * 1.9);
        ctx.stroke();
      });
      break;
    case 'royal':
      ctx.strokeStyle = withAlpha('#a90f22', 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radiusOuter * 0.54, 0, Math.PI * 2);
      ctx.stroke();
      for (let index = 0; index < 7; index += 1) {
        const angle = (Math.PI * 2 * index) / 7;
        drawSparkle(Math.cos(angle) * radiusInner * 0.86, Math.sin(angle) * radiusInner * 0.86, 2.6, withAlpha('#c0182e', 0.7));
      }
      break;
    case 'cosmos':
      for (let index = 0; index < 12; index += 1) {
        const angle = (Math.PI * 2 * index) / 12 + boss.rotation * 0.35;
        const distance = radiusInner * 0.26 + (index % 4) * radiusInner * 0.14;
        ctx.fillStyle = index % 3 === 0 ? withAlpha('#d72a3f', 0.72) : withAlpha('#6f0b17', 0.72);
        ctx.fillRect(Math.cos(angle) * distance - 1.1, Math.sin(angle) * distance - 1.1, 2.2, 2.2);
      }
      ctx.strokeStyle = withAlpha('#7d111d', 0.38);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, radiusOuter * 0.44, Math.PI * 0.12, Math.PI * 1.66);
      ctx.stroke();
      break;
    case 'armor':
      ctx.strokeStyle = withAlpha('#611017', 0.42);
      ctx.lineWidth = 1.6;
      for (let row = -1; row <= 1; row += 1) {
        ctx.beginPath();
        ctx.moveTo(-radiusOuter * 0.54, row * radiusOuter * 0.22);
        ctx.lineTo(radiusOuter * 0.54, row * radiusOuter * 0.22);
        ctx.stroke();
      }
      [-0.34, 0, 0.34].forEach((offset) => {
        ctx.fillStyle = withAlpha('#cf2236', 0.38);
        ctx.beginPath();
        ctx.arc(radiusOuter * offset, -radiusOuter * 0.12, 2.2, 0, Math.PI * 2);
        ctx.arc(radiusOuter * offset, radiusOuter * 0.24, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    case 'vinyl':
      ctx.strokeStyle = withAlpha('#6d0d18', 0.3);
      ctx.lineWidth = 1.2;
      [0.22, 0.38, 0.54, 0.7].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(0, 0, radiusOuter * scale, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.fillStyle = withAlpha('#c71d32', 0.56);
      ctx.beginPath();
      ctx.arc(0, 0, radiusOuter * 0.12, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'ivory':
      for (let index = -3; index <= 3; index += 1) {
        const stripeWidth = radiusOuter * 0.16;
        const x = index * stripeWidth;
        ctx.fillStyle = index % 2 === 0 ? withAlpha('#6c111a', 0.34) : withAlpha('#0f0f0f', 0.24);
        ctx.beginPath();
        ctx.roundRect(x - stripeWidth * 0.42, -radiusOuter * 0.54, stripeWidth * 0.84, radiusOuter * 1.08, 3);
        ctx.fill();
      }
      break;
    default:
      break;
  }
  ctx.restore();
}

function drawEnemyCreature(entity) {
  const def = ENEMY_DEFS[entity.kind];
  ctx.save();
  ctx.translate(entity.x, entity.y);
  ctx.translate(0, Math.sin(state.run.elapsedMs * 0.005 + entity.id) * 1.6);
  ctx.rotate(Math.sin(state.run.elapsedMs * 0.003 + entity.id * 0.4) * 0.03);
  const spriteKey = entity.kind === 'droneCat' ? 'drone' : entity.kind === 'raiderCat' ? 'raider' : null;
  const sprite = spriteKey ? getSprite(spriteKey) : null;
  if (sprite) {
    const size = entity.radius * 2.6;
    ctx.globalAlpha = 0.22;
    ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    ctx.globalAlpha = 1;
  }
  const shell = ctx.createRadialGradient(-5, -7, 2, 0, 0, entity.radius + 6);
  shell.addColorStop(0, '#2d2d2d');
  shell.addColorStop(0.4, '#101010');
  shell.addColorStop(1, '#000000');
  ctx.shadowColor = withAlpha('#000000', 0.64);
  ctx.shadowBlur = 16;
  ctx.fillStyle = shell;
  ctx.beginPath();
  ctx.arc(0, 0, entity.radius, 0, Math.PI * 2);
  ctx.fill();
  const thruster = ctx.createLinearGradient(0, entity.radius * 0.2, 0, entity.radius * 1.5);
  thruster.addColorStop(0, withAlpha('#ffd053', 0.48));
  thruster.addColorStop(1, withAlpha('#ffd053', 0));
  ctx.fillStyle = thruster;
  [-entity.radius * 0.36, entity.radius * 0.36].forEach((offset) => {
    ctx.beginPath();
    ctx.moveTo(offset - 3, entity.radius * 0.64);
    ctx.lineTo(offset, entity.radius * 1.36);
    ctx.lineTo(offset + 3, entity.radius * 0.64);
    ctx.closePath();
    ctx.fill();
  });
  ctx.shadowBlur = 0;
  ctx.fillStyle = withAlpha('#151515', 0.92);
  ctx.beginPath();
  ctx.moveTo(-entity.radius * 0.9, -entity.radius * 0.1);
  ctx.lineTo(-entity.radius * 0.46, -entity.radius * 1.04);
  ctx.lineTo(-entity.radius * 0.08, -entity.radius * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(entity.radius * 0.9, -entity.radius * 0.1);
  ctx.lineTo(entity.radius * 0.46, -entity.radius * 1.04);
  ctx.lineTo(entity.radius * 0.08, -entity.radius * 0.18);
  ctx.closePath();
  ctx.fill();
  if (entity.kind === 'droneCat') {
    ctx.fillStyle = withAlpha('#191919', 0.94);
    ctx.beginPath();
    ctx.roundRect(-entity.radius * 0.82, -entity.radius * 0.22, entity.radius * 1.64, entity.radius * 0.58, 8);
    ctx.fill();
    ctx.strokeStyle = withAlpha('#fff8ea', 0.78);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-entity.radius * 0.5, -entity.radius * 0.06);
    ctx.lineTo(entity.radius * 0.5, -entity.radius * 0.06);
    ctx.stroke();
    ctx.fillStyle = withAlpha('#121212', 0.95);
    [-entity.radius * 0.92, entity.radius * 0.92].forEach((offset) => {
      ctx.beginPath();
      ctx.moveTo(offset, entity.radius * 0.08);
      ctx.lineTo(offset + Math.sign(offset) * 6, entity.radius * 0.42);
      ctx.lineTo(offset, entity.radius * 0.58);
      ctx.closePath();
      ctx.fill();
    });
    ctx.strokeStyle = withAlpha('#fff8ea', 0.48);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-entity.radius * 0.84, entity.radius * 0.18);
    ctx.lineTo(entity.radius * 0.84, entity.radius * 0.18);
    ctx.stroke();
  } else if (entity.kind === 'raiderCat') {
    ctx.fillStyle = withAlpha('#1d1d1d', 0.95);
    ctx.beginPath();
    ctx.roundRect(-entity.radius * 0.84, -entity.radius * 0.16, entity.radius * 1.68, entity.radius * 0.42, 8);
    ctx.fill();
    ctx.fillStyle = withAlpha('#303030', 0.8);
    ctx.beginPath();
    ctx.moveTo(-entity.radius * 0.58, -entity.radius * 0.42);
    ctx.lineTo(entity.radius * 0.46, entity.radius * 0.18);
    ctx.lineTo(entity.radius * 0.22, entity.radius * 0.42);
    ctx.lineTo(-entity.radius * 0.8, -entity.radius * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = withAlpha('#0e0e0e', 0.95);
    [-entity.radius * 0.3, -entity.radius * 0.08, entity.radius * 0.14].forEach((offset) => {
      ctx.beginPath();
      ctx.moveTo(offset, entity.radius * 0.46);
      ctx.lineTo(offset + 2, entity.radius * 0.78);
      ctx.lineTo(offset + 6, entity.radius * 0.48);
      ctx.closePath();
      ctx.fill();
    });
    ctx.fillStyle = withAlpha('#262626', 0.9);
    ctx.beginPath();
    ctx.moveTo(-entity.radius * 0.82, -entity.radius * 0.02);
    ctx.lineTo(-entity.radius * 1.12, entity.radius * 0.24);
    ctx.lineTo(-entity.radius * 0.78, entity.radius * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(entity.radius * 0.82, -entity.radius * 0.02);
    ctx.lineTo(entity.radius * 1.12, entity.radius * 0.24);
    ctx.lineTo(entity.radius * 0.78, entity.radius * 0.38);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = withAlpha('#181818', 0.96);
  ctx.beginPath();
  ctx.ellipse(0, entity.radius * 0.14, entity.radius * 0.44, entity.radius * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd053';
  ctx.beginPath();
  ctx.ellipse(-entity.radius * 0.28, -entity.radius * 0.02, entity.radius * 0.09, entity.radius * 0.14, 0, 0, Math.PI * 2);
  ctx.ellipse(entity.radius * 0.28, -entity.radius * 0.02, entity.radius * 0.09, entity.radius * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = withAlpha('#0a0a0a', 0.96);
  ctx.beginPath();
  ctx.arc(-entity.radius * 0.31, -entity.radius * 0.08, 1.2, 0, Math.PI * 2);
  ctx.arc(entity.radius * 0.25, -entity.radius * 0.08, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = withAlpha('#1a1a1a', 0.95);
  ctx.beginPath();
  ctx.roundRect(-entity.radius * 0.76, entity.radius * 0.82, entity.radius * 1.52, 8, 4);
  ctx.fill();
  ctx.restore();
}

function drawPickup(entity) {
  const color = PICKUP_COLORS[entity.kind] || '#fff8ea';
  const isWeaponPickup = entity.kind.startsWith('weapon');
  ctx.save();
  ctx.translate(entity.x, entity.y);
  if (entity.rotation) {
    ctx.rotate(entity.rotation);
  }
  const pulse = 0.78 + (Math.sin(state.run.elapsedMs * 0.01 + entity.id) + 1) * 0.14;
  const orbitAngle = state.run.elapsedMs * 0.004 + entity.id;
  const orbitRadius = entity.radius + 8;
  const beam = ctx.createLinearGradient(0, -entity.radius * 2.3, 0, entity.radius * 2.8);
  beam.addColorStop(0, withAlpha(color, 0));
  beam.addColorStop(0.5, withAlpha(color, 0.14 * pulse));
  beam.addColorStop(1, withAlpha(color, 0));
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.roundRect(-entity.radius * 0.4, -entity.radius * 2.1, entity.radius * 0.8, entity.radius * 4.2, entity.radius * 0.38);
  ctx.fill();
  ctx.strokeStyle = withAlpha(color, 0.32 * pulse);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, entity.radius + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = withAlpha(color, 0.26);
  for (let index = 0; index < 2; index += 1) {
    const angle = orbitAngle + index * Math.PI;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius * 0.72, 2.2 + index * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  drawSparkle(entity.radius + 6, -entity.radius * 0.4, 2.5, withAlpha('#fff8ea', 0.7));

  if (isWeaponPickup) {
    const crate = ctx.createLinearGradient(-18, -16, 18, 18);
    crate.addColorStop(0, withAlpha(color, 0.92));
    crate.addColorStop(1, '#2f241e');
    ctx.shadowColor = withAlpha(color, 0.45);
    ctx.shadowBlur = 16;
    ctx.fillStyle = crate;
    ctx.beginPath();
    ctx.roundRect(-18, -14, 36, 28, 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 248, 239, 0.2)';
    ctx.beginPath();
    ctx.roundRect(-16, -12, 32, 10, 8);
    ctx.fill();
    ctx.fillStyle = withAlpha('#fff8ea', 0.18);
    ctx.beginPath();
    ctx.roundRect(-15, 2, 30, 8, 6);
    ctx.fill();
    ctx.strokeStyle = withAlpha('#fff8ea', 0.55);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-5, -10, 10, 20);
    ctx.strokeStyle = withAlpha('#fff8ea', 0.34);
    ctx.beginPath();
    ctx.moveTo(-12, -2);
    ctx.lineTo(12, -2);
    ctx.moveTo(-12, 6);
    ctx.lineTo(12, 6);
    ctx.stroke();
  } else {
    const orb = ctx.createRadialGradient(-5, -6, 2, 0, 0, entity.radius * 1.05);
    orb.addColorStop(0, '#fffef8');
    orb.addColorStop(0.34, withAlpha(color, 0.96));
    orb.addColorStop(1, withAlpha('#2f241e', 0.92));
    ctx.shadowColor = withAlpha(color, 0.55);
    ctx.shadowBlur = 18;
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(0, 0, entity.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = withAlpha('#fff8ea', 0.7);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, entity.radius - 1.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.beginPath();
    ctx.ellipse(-4, -6, entity.radius * 0.42, entity.radius * 0.22, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = withAlpha(color, 0.3);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, entity.radius * 0.64, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (isWeaponPickup) {
    const sprite = getSprite(getWeaponSpriteKeyByPickupKind(entity.kind));
    if (sprite) {
      const size = 24;
      ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
      ctx.restore();
      return;
    }
  }
  if (entity.kind === 'heart') {
    const sprite = getSprite('heart');
    if (sprite) {
      const size = 24;
      ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
      ctx.restore();
      return;
    }
  }
  if (entity.kind === 'shieldPickup') {
    const sprite = getSprite('shield');
    if (sprite) {
      const size = 24;
      ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
      ctx.restore();
      return;
    }
  }

  ctx.fillStyle = '#2f241e';
  ctx.strokeStyle = withAlpha('#fff8ea', 0.4);
  ctx.lineWidth = 1.6;

  switch (entity.kind) {
    case 'heart':
      {
        const heartGrad = ctx.createLinearGradient(0, -14, 0, 12);
        heartGrad.addColorStop(0, '#ff7f95');
        heartGrad.addColorStop(0.45, '#ff384f');
        heartGrad.addColorStop(1, '#c81434');
        ctx.fillStyle = heartGrad;
      }
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.bezierCurveTo(-16, -2, -13, -20, 0, -9);
      ctx.bezierCurveTo(13, -20, 16, -2, 0, 10);
      ctx.fill();
      ctx.strokeStyle = withAlpha('#fff6f7', 0.52);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = withAlpha('#fff8ea', 0.84);
      ctx.beginPath();
      ctx.ellipse(-4, -7, 4.6, 3, -0.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'shieldPickup':
      {
        const rim = ctx.createLinearGradient(0, -13, 0, 13);
        rim.addColorStop(0, '#f1c98d');
        rim.addColorStop(0.45, '#c88a4a');
        rim.addColorStop(1, '#9a6535');
        ctx.fillStyle = rim;
      }
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(11, -7);
      ctx.lineTo(9, 9);
      ctx.lineTo(0, 13);
      ctx.lineTo(-9, 9);
      ctx.lineTo(-11, -7);
      ctx.closePath();
      ctx.fill();
      {
        const core = ctx.createLinearGradient(0, -9, 0, 11);
        core.addColorStop(0, '#dff2ff');
        core.addColorStop(0.42, '#9cd7ff');
        core.addColorStop(1, '#6ba7de');
        ctx.fillStyle = core;
      }
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(7, -4);
      ctx.lineTo(6, 6);
      ctx.lineTo(0, 10);
      ctx.lineTo(-6, 6);
      ctx.lineTo(-7, -4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = withAlpha('#fff8ea', 0.72);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = withAlpha('#ffffff', 0.52);
      ctx.beginPath();
      ctx.ellipse(-2, -5, 2.6, 1.8, -0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'doubleShotPickup':
      {
        const duo = ctx.createLinearGradient(0, -15, 0, 15);
        duo.addColorStop(0, '#fff8ea');
        duo.addColorStop(0.42, '#ffd053');
        duo.addColorStop(1, '#c86a14');
        ctx.fillStyle = duo;
      }
      ctx.beginPath();
      ctx.roundRect(-12, -12, 24, 24, 9);
      ctx.fill();
      ctx.strokeStyle = withAlpha('#fff8ea', 0.62);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = withAlpha('#0a0a0a', 0.92);
      ctx.beginPath();
      ctx.roundRect(-8, -7, 5, 14, 3);
      ctx.roundRect(3, -7, 5, 14, 3);
      ctx.fill();
      ctx.fillStyle = withAlpha('#fff8ea', 0.82);
      ctx.beginPath();
      ctx.arc(-5.5, -2, 1.4, 0, Math.PI * 2);
      ctx.arc(5.5, -2, 1.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'volleyUpgrade':
      {
        const core = ctx.createLinearGradient(0, -15, 0, 15);
        core.addColorStop(0, '#dff8ff');
        core.addColorStop(0.45, '#86d1f2');
        core.addColorStop(1, '#2f6b8a');
        ctx.fillStyle = core;
      }
      ctx.beginPath();
      ctx.roundRect(-12, -12, 24, 24, 8);
      ctx.fill();
      ctx.strokeStyle = withAlpha('#fff8ea', 0.64);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = withAlpha('#04121b', 0.92);
      [-6, 0, 6].forEach((x) => {
        ctx.beginPath();
        ctx.roundRect(x - 2.5, -8, 5, 16, 2.5);
        ctx.fill();
      });
      ctx.fillStyle = withAlpha('#fff8ea', 0.8);
      ctx.beginPath();
      ctx.roundRect(-8, -10, 16, 4, 2);
      ctx.fill();
      break;
    case 'superLaserPickup':
      ctx.fillStyle = '#fff8ea';
      ctx.beginPath();
      ctx.roundRect(-4, -12, 8, 24, 4);
      ctx.fill();
      ctx.fillStyle = '#2f241e';
      ctx.beginPath();
      ctx.moveTo(-11, 4);
      ctx.lineTo(0, -12);
      ctx.lineTo(11, 4);
      ctx.lineTo(2, 4);
      ctx.lineTo(7, 12);
      ctx.lineTo(-7, 12);
      ctx.lineTo(-2, 4);
      ctx.closePath();
      ctx.fill();
      drawSparkle(11, -12, 4, '#fff0c5');
      break;
    case 'weaponSpread':
      ctx.fillStyle = '#fff8ea';
      [-7, 0, 7].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, -8);
        ctx.lineTo(x + 3, 5);
        ctx.lineTo(x - 3, 5);
        ctx.closePath();
        ctx.fill();
      });
      break;
    case 'weaponLaser':
      ctx.fillStyle = '#fff8ea';
      ctx.beginPath();
      ctx.roundRect(-3, -10, 6, 20, 3);
      ctx.fill();
      break;
    case 'weaponChainsaw':
      ctx.fillStyle = '#fff8ea';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'weaponMissile':
      ctx.fillStyle = '#fff8ea';
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(7, 4);
      ctx.lineTo(0, 11);
      ctx.lineTo(-7, 4);
      ctx.closePath();
      ctx.fill();
      break;
    case 'weaponPaw':
      ctx.fillStyle = '#fff8ea';
      ctx.beginPath();
      ctx.arc(0, 2, 4, 0, Math.PI * 2);
      ctx.arc(-5, -5, 2, 0, Math.PI * 2);
      ctx.arc(0, -7, 2, 0, Math.PI * 2);
      ctx.arc(5, -5, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'weaponBottle':
      ctx.fillStyle = '#fff8ea';
      ctx.beginPath();
      ctx.roundRect(-4, -10, 8, 18, 3);
      ctx.fill();
      ctx.fillRect(-2, -13, 4, 5);
      break;
    case 'weaponIce':
      ctx.strokeStyle = '#fff8ea';
      ctx.lineWidth = 1.8;
      for (let rotation = 0; rotation < 3; rotation += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * rotation);
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.moveTo(0, -6);
        ctx.lineTo(-3, -2);
        ctx.moveTo(0, -6);
        ctx.lineTo(3, -2);
        ctx.moveTo(0, 6);
        ctx.lineTo(-3, 2);
        ctx.moveTo(0, 6);
        ctx.lineTo(3, 2);
        ctx.stroke();
        ctx.restore();
      }
      break;
    default:
      break;
  }
  ctx.restore();
}

function drawFarm(entity) {
  ctx.save();
  ctx.translate(entity.x, entity.y);
  ctx.rotate(Math.sin(state.run.elapsedMs * 0.003 + entity.id) * 0.05);
  if (entity.kind === 'guitar') {
    ctx.shadowColor = 'rgba(255, 184, 92, 0.4)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffb85c';
    ctx.beginPath();
    ctx.ellipse(-6, 2, 10, 8, 0.25, 0, Math.PI * 2);
    ctx.ellipse(6, 4, 9, 7, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#7a4926';
    ctx.fillRect(0, -16, 4, 24);
    ctx.strokeStyle = '#fff4d8';
    ctx.lineWidth = 1;
    for (let stringIndex = -1; stringIndex <= 1; stringIndex += 1) {
      ctx.beginPath();
      ctx.moveTo(-6 + stringIndex * 2, -6);
      ctx.lineTo(7 + stringIndex * 1.4, 11);
      ctx.stroke();
    }
  } else {
    ctx.shadowColor = 'rgba(217, 208, 194, 0.32)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#d9d0c2';
    ctx.beginPath();
    ctx.roundRect(-18, -11, 36, 22, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#2f241e';
    ctx.fillRect(-13, -9, 26, 16);
    ctx.fillStyle = '#fefaf0';
    for (let keyIndex = 0; keyIndex < 6; keyIndex += 1) {
      ctx.fillRect(-12 + keyIndex * 4.2, -8, 3, 15);
    }
  }
  ctx.restore();
}

function drawPlanet(entity) {
  ctx.save();
  ctx.translate(entity.x, entity.y);
  ctx.rotate(entity.rotation || 0);

  const glow = ctx.createRadialGradient(0, 0, entity.radius * 0.2, 0, 0, entity.radius * 1.24);
  glow.addColorStop(0, withAlpha(entity.glow || '#ffd053', 0.12));
  glow.addColorStop(1, withAlpha(entity.glow || '#ffd053', 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, entity.radius * 1.28, 0, Math.PI * 2);
  ctx.fill();

  const shell = ctx.createRadialGradient(-entity.radius * 0.34, -entity.radius * 0.42, entity.radius * 0.12, 0, 0, entity.radius * 1.08);
  shell.addColorStop(0, withAlpha(entity.accent || '#ffd053', 0.28));
  shell.addColorStop(0.18, '#161616');
  shell.addColorStop(0.62, entity.color || '#050505');
  shell.addColorStop(1, '#000000');
  ctx.fillStyle = shell;
  ctx.beginPath();
  ctx.arc(0, 0, entity.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = withAlpha(entity.ring || '#6d4d19', 0.56);
  ctx.lineWidth = Math.max(3, entity.radius * 0.12);
  ctx.beginPath();
  ctx.ellipse(0, 0, entity.radius * 1.18, entity.radius * 0.34, Math.PI * 0.2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = withAlpha(entity.accent || '#ffd053', 0.22);
  ctx.lineWidth = 2;
  for (let index = 0; index < 4; index += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, entity.radius * (0.28 + index * 0.16), Math.PI * (0.2 + index * 0.08), Math.PI * (1.2 + index * 0.08));
    ctx.stroke();
  }

  ctx.fillStyle = withAlpha('#ffffff', 0.08);
  ctx.beginPath();
  ctx.ellipse(-entity.radius * 0.22, -entity.radius * 0.34, entity.radius * 0.28, entity.radius * 0.13, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHazard(entity) {
  ctx.save();
  ctx.translate(entity.x, entity.y);
  if (entity.radius) {
    ctx.rotate(entity.rotation || 0);
    const meteorSprite = getSprite('meteor');
    if (meteorSprite) {
      const size = entity.radius * 2.72;
      ctx.globalAlpha = 1;
      ctx.drawImage(meteorSprite, -size / 2, -size / 2, size, size);
      const crustRim = ctx.createRadialGradient(-entity.radius * 0.18, -entity.radius * 0.24, entity.radius * 0.18, 0, 0, entity.radius * 1.08);
      crustRim.addColorStop(0, withAlpha('#ffffff', 0.28));
      crustRim.addColorStop(0.36, withAlpha(entity.accent || '#dbe0ef', 0.18));
      crustRim.addColorStop(1, withAlpha('#000000', 0));
      ctx.fillStyle = crustRim;
      ctx.beginPath();
      ctx.arc(0, 0, entity.radius * 1.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = withAlpha('#f0f3fa', 0.18);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, entity.radius * 0.88, Math.PI * 0.95, Math.PI * 1.82);
      ctx.stroke();
      if (entity.kind === 'meteorFlankLeft' || entity.kind === 'meteorFlankRight' || entity.kind === 'meteorShard') {
        const tail = ctx.createLinearGradient(0, entity.radius * 0.2, 0, entity.radius * 2.6);
        tail.addColorStop(0, withAlpha('#dce6f7', 0.28));
        tail.addColorStop(1, withAlpha('#d1cde9', 0));
        ctx.fillStyle = tail;
        ctx.beginPath();
        ctx.moveTo(-entity.radius * 0.34, entity.radius * 0.58);
        ctx.lineTo(0, entity.radius * 2.4);
        ctx.lineTo(entity.radius * 0.34, entity.radius * 0.58);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      return;
    }
    const crust = ctx.createRadialGradient(-entity.radius * 0.35, -entity.radius * 0.4, 2, 0, 0, entity.radius * 1.1);
    crust.addColorStop(0, withAlpha(entity.accent || '#d8d4ef', 0.96));
    crust.addColorStop(0.34, withAlpha(entity.color || '#6f6a87', 0.94));
    crust.addColorStop(0.7, '#585271');
    crust.addColorStop(1, '#2b273b');
    ctx.shadowColor = withAlpha(entity.accent || '#cfcbe9', 0.28);
    ctx.shadowBlur = 20;
    ctx.fillStyle = crust;
    ctx.beginPath();
    for (let step = 0; step < 12; step += 1) {
      const angle = (Math.PI * 2 * step) / 12;
      const variance = step % 2 === 0 ? entity.radius * 0.94 : entity.radius * 1.18;
      const x = Math.cos(angle) * variance;
      const y = Math.sin(angle) * variance;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = withAlpha('#f2efff', 0.28);
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.strokeStyle = withAlpha(entity.accent || '#b8b2d8', 0.68);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-entity.radius * 0.42, -entity.radius * 0.1);
    ctx.lineTo(entity.radius * 0.18, entity.radius * 0.08);
    ctx.lineTo(entity.radius * 0.4, entity.radius * 0.5);
    ctx.moveTo(-entity.radius * 0.16, -entity.radius * 0.58);
    ctx.lineTo(entity.radius * 0.12, -entity.radius * 0.22);
    ctx.lineTo(entity.radius * 0.54, -entity.radius * 0.28);
    ctx.stroke();

    ctx.fillStyle = withAlpha('#f2efff', 0.2);
    ctx.beginPath();
    ctx.ellipse(-entity.radius * 0.22, -entity.radius * 0.3, entity.radius * 0.22, entity.radius * 0.12, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = withAlpha('#2f2a44', 0.5);
    [-0.38, -0.02, 0.28].forEach((offset, index) => {
      ctx.beginPath();
      ctx.arc(entity.radius * offset, entity.radius * (-0.08 + index * 0.24), entity.radius * (0.12 + (index % 2) * 0.04), 0, Math.PI * 2);
      ctx.fill();
    });
    for (let shard = 0; shard < 3; shard += 1) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * shard) / 3 + (entity.rotation || 0) * 0.4);
      ctx.fillStyle = withAlpha(entity.accent || '#d9d5ef', 0.34);
      ctx.beginPath();
      ctx.moveTo(entity.radius * 0.32, -3);
      ctx.lineTo(entity.radius * 0.74, 0);
      ctx.lineTo(entity.radius * 0.32, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    if (entity.kind === 'meteorFlankLeft' || entity.kind === 'meteorFlankRight' || entity.kind === 'meteorShard') {
      const tail = ctx.createLinearGradient(0, entity.radius, 0, entity.radius * 2.6);
      tail.addColorStop(0, withAlpha(entity.accent || '#d1cde9', 0.35));
      tail.addColorStop(1, withAlpha(entity.accent || '#d1cde9', 0));
      ctx.fillStyle = tail;
      ctx.beginPath();
      ctx.moveTo(-entity.radius * 0.38, entity.radius * 0.6);
      ctx.lineTo(0, entity.radius * 2.5);
      ctx.lineTo(entity.radius * 0.38, entity.radius * 0.6);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    const wall = ctx.createLinearGradient(-entity.width / 2, 0, entity.width / 2, 0);
    wall.addColorStop(0, '#402b24');
    wall.addColorStop(0.5, '#70463a');
    wall.addColorStop(1, '#402b24');
    ctx.fillStyle = wall;
    ctx.beginPath();
    ctx.roundRect(-entity.width / 2, -entity.height / 2, entity.width, entity.height, 14);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlayerAccessory(weaponId, weaponColor) {
  switch (weaponId) {
    case 'superLaser':
      ctx.fillStyle = withAlpha(weaponColor, 0.9);
      ctx.beginPath();
      ctx.roundRect(-5, -24, 10, 16, 4);
      ctx.fill();
      ctx.fillStyle = '#fff8ea';
      ctx.beginPath();
      ctx.roundRect(-2, -28, 4, 10, 2);
      ctx.fill();
      break;
    case 'laser':
      ctx.fillStyle = withAlpha(weaponColor, 0.9);
      ctx.beginPath();
      ctx.roundRect(-13, -8, 26, 5, 3);
      ctx.fill();
      ctx.strokeStyle = '#fff8ea';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-9, -5.5);
      ctx.lineTo(9, -5.5);
      ctx.stroke();
      break;
    case 'spread':
      ctx.fillStyle = withAlpha(weaponColor, 0.88);
      [-9, 0, 9].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, -16);
        ctx.lineTo(x + 4, -8);
        ctx.lineTo(x - 4, -8);
        ctx.closePath();
        ctx.fill();
      });
      break;
    case 'chainsaw':
      ctx.strokeStyle = '#fff8ea';
      ctx.lineWidth = 1.6;
      for (let index = 0; index < 6; index += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * index);
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(2.6, -13);
        ctx.lineTo(-2.6, -13);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      break;
    case 'missile':
      ctx.fillStyle = withAlpha(weaponColor, 0.84);
      ctx.beginPath();
      ctx.moveTo(-18, 3);
      ctx.lineTo(-25, 10);
      ctx.lineTo(-18, 12);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(18, 3);
      ctx.lineTo(25, 10);
      ctx.lineTo(18, 12);
      ctx.closePath();
      ctx.fill();
      break;
    case 'paw':
      ctx.fillStyle = withAlpha(weaponColor, 0.78);
      ctx.beginPath();
      ctx.arc(0, -10, 4.5, 0, Math.PI * 2);
      ctx.arc(-5, -16, 2, 0, Math.PI * 2);
      ctx.arc(0, -18, 2, 0, Math.PI * 2);
      ctx.arc(5, -16, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'bottle':
      ctx.fillStyle = withAlpha(weaponColor, 0.86);
      ctx.beginPath();
      ctx.roundRect(-5, -19, 10, 9, 3);
      ctx.fill();
      ctx.fillStyle = '#fff8ea';
      ctx.fillRect(-2, -22, 4, 4);
      break;
    case 'ice':
      ctx.strokeStyle = '#fff8ea';
      ctx.lineWidth = 1.2;
      for (let rotation = 0; rotation < 3; rotation += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * rotation);
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(0, -10);
        ctx.moveTo(0, -17);
        ctx.lineTo(-3, -13);
        ctx.moveTo(0, -17);
        ctx.lineTo(3, -13);
        ctx.stroke();
        ctx.restore();
      }
      break;
    default:
      ctx.fillStyle = withAlpha(weaponColor, 0.72);
      ctx.beginPath();
      ctx.roundRect(-8, -18, 16, 6, 3);
      ctx.fill();
      ctx.fillStyle = '#fff8ea';
      ctx.beginPath();
      ctx.ellipse(0, -15, 4, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
}

function drawPlayerHullPanels(skin, weaponColor, upgradeTier) {
  const wingColor = blendColor(skin.accent, skin.hull, 0.55);
  const hullGlow = blendColor(wingColor, weaponColor, 0.2);
  ctx.fillStyle = withAlpha(hullGlow, 0.82);
  ctx.beginPath();
  ctx.moveTo(-18, 4);
  ctx.lineTo(-30 - upgradeTier * 2.1, 14);
  ctx.lineTo(-15, 18);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(18, 4);
  ctx.lineTo(30 + upgradeTier * 2.1, 14);
  ctx.lineTo(15, 18);
  ctx.closePath();
  ctx.fill();

  if (upgradeTier > 1) {
    ctx.fillStyle = withAlpha(wingColor, 0.72);
    ctx.beginPath();
    ctx.roundRect(-18, 8, 36, 8, 4);
    ctx.fill();
  }

  switch (skin.id) {
    case 'nebula':
      ctx.strokeStyle = withAlpha('#dff7ff', 0.72);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-26, -3);
      ctx.lineTo(-36, -12);
      ctx.moveTo(26, -3);
      ctx.lineTo(36, -12);
      ctx.stroke();
      break;
    case 'royal':
      ctx.fillStyle = withAlpha('#ffe38a', 0.84);
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(6, -18);
      ctx.lineTo(0, -14);
      ctx.lineTo(-6, -18);
      ctx.closePath();
      ctx.fill();
      break;
    case 'obsidian':
      ctx.fillStyle = withAlpha('#b49eff', 0.8);
      ctx.beginPath();
      ctx.moveTo(-15, -14);
      ctx.lineTo(-26, -8);
      ctx.lineTo(-17, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(15, -14);
      ctx.lineTo(26, -8);
      ctx.lineTo(17, 0);
      ctx.closePath();
      ctx.fill();
      break;
    case 'solaris':
      ctx.fillStyle = withAlpha('#ffb35d', 0.84);
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(8, -18);
      ctx.lineTo(0, -10);
      ctx.lineTo(-8, -18);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = withAlpha('#fff3da', 0.6);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, -20, 8, Math.PI, 0);
      ctx.stroke();
      break;
    case 'jade':
      ctx.strokeStyle = withAlpha('#d9fff1', 0.64);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-22, -5);
      ctx.quadraticCurveTo(-32, -14, -36, -4);
      ctx.moveTo(22, -5);
      ctx.quadraticCurveTo(32, -14, 36, -4);
      ctx.stroke();
      break;
    case 'inferno':
      ctx.fillStyle = withAlpha('#ff6f57', 0.84);
      ctx.beginPath();
      ctx.moveTo(-10, -22);
      ctx.lineTo(-2, -14);
      ctx.lineTo(-11, -8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(10, -22);
      ctx.lineTo(2, -14);
      ctx.lineTo(11, -8);
      ctx.closePath();
      ctx.fill();
      break;
    case 'chrome':
      ctx.fillStyle = withAlpha('#eff7ff', 0.38);
      ctx.beginPath();
      ctx.roundRect(-18, -10, 36, 8, 4);
      ctx.fill();
      ctx.strokeStyle = withAlpha('#bcd4ff', 0.58);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-14, -6);
      ctx.lineTo(14, -6);
      ctx.stroke();
      break;
    default:
      ctx.fillStyle = withAlpha('#fff8ea', 0.24);
      ctx.beginPath();
      ctx.roundRect(-7, -23, 14, 7, 3.5);
      ctx.fill();
      break;
  }
}

function drawPlayer() {
  const player = state.run.player;
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2 + Math.sin(state.run.elapsedMs * 0.005) * 1.6;
  const weaponId = getCurrentWeapon();
  const weaponColor = getWeaponColor(weaponId);
  const skin = getShipSkin();
  const upgradeTier = Math.max(0, state.run.unlockedWeapons.size - 1);
  const wingColor = blendColor(skin.accent, skin.hull, 0.58);
  const shipScale = player.width / BASE_PLAYER_WIDTH;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 30 * shipScale, 34 * shipScale, 10 * shipScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(shipScale, shipScale);
  const enginePower = clamp((player.boostMs > 0 ? 0.8 : 0.35) + (state.run.runSpeedMultiplier - 1) * 0.45, 0.28, 1.2);
  if (enginePower > 0.3) {
    const flame = ctx.createLinearGradient(0, 6, 0, 40);
    flame.addColorStop(0, withAlpha('#fff4c8', 0.7 * enginePower));
    flame.addColorStop(0.44, withAlpha('#ffb04c', 0.68 * enginePower));
    flame.addColorStop(1, withAlpha('#ff5f52', 0.1 * enginePower));
    ctx.fillStyle = flame;
    ctx.beginPath();
    ctx.moveTo(-10, 17);
    ctx.lineTo(0, 38 + Math.sin(state.run.elapsedMs * 0.024) * 5);
    ctx.lineTo(10, 17);
    ctx.closePath();
    ctx.fill();
  }

  const hull = ctx.createLinearGradient(0, -26, 0, 24);
  hull.addColorStop(0, blendColor(skin.hull, '#fff2cf', 0.3));
  hull.addColorStop(0.55, skin.hull);
  hull.addColorStop(1, blendColor(skin.accent, '#2c1b15', 0.24));
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(0, -30);
  ctx.bezierCurveTo(17, -17, 18, 14, 0, 26);
  ctx.bezierCurveTo(-18, 14, -17, -17, 0, -30);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = withAlpha('#fff8ea', 0.2);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(0, 18);
  ctx.stroke();

  ctx.fillStyle = withAlpha(wingColor, 0.88);
  ctx.beginPath();
  ctx.moveTo(-20, 8);
  ctx.lineTo(-30 - upgradeTier * 2, 16);
  ctx.lineTo(-11, 17);
  ctx.lineTo(-8, 10);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(20, 8);
  ctx.lineTo(30 + upgradeTier * 2, 16);
  ctx.lineTo(11, 17);
  ctx.lineTo(8, 10);
  ctx.closePath();
  ctx.fill();

  if (upgradeTier > 0) {
    ctx.fillStyle = withAlpha('#fff8ea', 0.66);
    ctx.beginPath();
    ctx.roundRect(-6, -28, 12, 7, 3.4);
    ctx.fill();
  }

  if (upgradeTier > 2) {
    ctx.fillStyle = withAlpha(wingColor, 0.74);
    ctx.beginPath();
    ctx.roundRect(-3, -36, 6, 12, 3);
    ctx.fill();
  }

  const cockpit = ctx.createLinearGradient(-1, -17, 1, 7);
  cockpit.addColorStop(0, withAlpha('#d7f4ff', 0.95));
  cockpit.addColorStop(1, withAlpha('#4ca0d1', 0.75));
  ctx.fillStyle = cockpit;
  ctx.beginPath();
  ctx.ellipse(0, -9, 8.5, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = withAlpha('#fff8ea', 0.82);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  drawPlayerHullPanels(skin, weaponColor, upgradeTier);

  ctx.save();
  ctx.translate(0, 2);
  drawCatToken(9, skin.hull, skin.accent, {
    faceColor: skin.face,
    stripeColor: withAlpha(skin.stripe, 0.9),
    eyeColor: skin.eye,
    glowColor: weaponColor,
    mask: skin.mask,
    crown: skin.crown,
    angularEyes: skin.angularEyes,
  });
  ctx.restore();

  if (upgradeTier >= 1) {
    ctx.fillStyle = withAlpha(wingColor, 0.9);
    ctx.beginPath();
    ctx.roundRect(-24, -3, 8, 16, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(16, -3, 8, 16, 4);
    ctx.fill();
  }

  drawPlayerAccessory(weaponId, weaponColor);

  ctx.fillStyle = withAlpha('#d7f4ff', 0.82);
  ctx.beginPath();
  ctx.roundRect(-3, 20, 6, 5, 2.5);
  ctx.fill();

  ctx.fillStyle = withAlpha(wingColor, 0.24);
  ctx.beginPath();
  ctx.ellipse(0, 22, 16, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (state.run.player.invulnerableMs > 0) {
    ctx.strokeStyle = withAlpha('#fff8ea', 0.85);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 28 + Math.sin(state.run.elapsedMs * 0.02) * 1.4, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBossTelegraph(boss) {
  const telegraph = ctx.createLinearGradient(0, boss.y, 0, HEIGHT);
  telegraph.addColorStop(0, withAlpha(boss.accent, 0.22));
  telegraph.addColorStop(1, withAlpha(boss.accent, 0));
  ctx.fillStyle = telegraph;

  switch (boss.pattern) {
    case 'laser':
      [-46, 0, 46].forEach((offset) => {
        ctx.fillRect(boss.x + offset - 11, boss.y, 22, HEIGHT - boss.y);
      });
      break;
    case 'spread':
      ctx.beginPath();
      ctx.moveTo(boss.x, boss.y);
      ctx.lineTo(boss.x - 96, HEIGHT);
      ctx.lineTo(boss.x + 96, HEIGHT);
      ctx.closePath();
      ctx.fill();
      break;
    case 'wave':
      ctx.strokeStyle = withAlpha(boss.accent, 0.18);
      ctx.lineWidth = 2;
      for (let radius = 34; radius <= 118; radius += 18) {
        ctx.beginPath();
        ctx.arc(boss.x, boss.y + 6, radius, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
      }
      break;
    case 'chains':
      ctx.strokeStyle = withAlpha(boss.accent, 0.18);
      ctx.lineWidth = 10;
      for (let x = boss.x - 120; x <= boss.x + 120; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, boss.y + 14);
        ctx.lineTo(x - 70, HEIGHT);
        ctx.stroke();
      }
      break;
    case 'notes':
      ctx.strokeStyle = withAlpha(boss.accent, 0.16);
      ctx.lineWidth = 2;
      for (let y = boss.y + 24; y < HEIGHT; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
      }
      break;
    case 'strings':
      ctx.fillStyle = withAlpha(boss.accent, 0.12);
      for (let x = 14; x < WIDTH; x += 32) {
        ctx.fillRect(x, boss.y + 10, 10, HEIGHT - boss.y);
      }
      break;
    default:
      ctx.fillRect(boss.x - 42, boss.y, 84, HEIGHT - boss.y);
      break;
  }

  ctx.fillStyle = withAlpha(boss.accent, 0.08);
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawBossAccessories(boss) {
  switch (boss.pattern) {
    case 'laser':
      ctx.fillStyle = withAlpha('#fff8ea', 0.22);
      ctx.fillRect(-boss.width * 0.38, -6, boss.width * 0.76, 10);
      ctx.strokeStyle = withAlpha(boss.accent, 0.9);
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-boss.width * 0.3, -2);
      ctx.lineTo(boss.width * 0.3, -2);
      ctx.stroke();
      break;
    case 'rapid':
      ctx.fillStyle = withAlpha('#fff8ea', 0.18);
      ctx.beginPath();
      ctx.moveTo(-boss.width * 0.46, -6);
      ctx.lineTo(-boss.width * 0.62, 0);
      ctx.lineTo(-boss.width * 0.46, 8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(boss.width * 0.46, -6);
      ctx.lineTo(boss.width * 0.62, 0);
      ctx.lineTo(boss.width * 0.46, 8);
      ctx.closePath();
      ctx.fill();
      break;
    case 'homing':
      ctx.strokeStyle = withAlpha(boss.accent, 0.45);
      ctx.lineWidth = 1.4;
      for (let index = 0; index < 3; index += 1) {
        ctx.beginPath();
        ctx.arc(0, 12, 18 + index * 8, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();
      }
      break;
    case 'wave':
      ctx.strokeStyle = withAlpha('#fff8ea', 0.44);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, -10, 12, Math.PI, 0);
      ctx.arc(0, -10, 24, Math.PI, 0);
      ctx.stroke();
      break;
    case 'chains':
      ctx.strokeStyle = withAlpha('#fff8ea', 0.42);
      ctx.lineWidth = 2;
      for (let offset = -1; offset <= 1; offset += 1) {
        ctx.beginPath();
        ctx.ellipse(offset * 11, -14 + Math.abs(offset) * 2, 8, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 'notes':
      ctx.fillStyle = withAlpha('#fff8ea', 0.52);
      ctx.beginPath();
      ctx.arc(boss.width * 0.24, -18, 4, 0, Math.PI * 2);
      ctx.arc(boss.width * 0.33, -12, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(boss.width * 0.22, -28, 2, 10);
      ctx.fillRect(boss.width * 0.31, -24, 2, 12);
      break;
    case 'strings':
      ctx.fillStyle = withAlpha('#fff8ea', 0.2);
      for (let key = -boss.width * 0.24; key <= boss.width * 0.12; key += 10) {
        ctx.fillRect(key, boss.height * 0.16, 7, 18);
      }
      break;
    case 'spread':
      ctx.fillStyle = withAlpha('#fff8ea', 0.18);
      ctx.beginPath();
      ctx.moveTo(-boss.width * 0.52, -2);
      ctx.lineTo(-boss.width * 0.8, 12);
      ctx.lineTo(-boss.width * 0.44, 10);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(boss.width * 0.52, -2);
      ctx.lineTo(boss.width * 0.8, 12);
      ctx.lineTo(boss.width * 0.44, 10);
      ctx.closePath();
      ctx.fill();
      break;
    default:
      ctx.strokeStyle = withAlpha('#fff8ea', 0.3);
      ctx.lineWidth = 1.4;
      for (let angle = -0.8; angle <= 0.8; angle += 0.4) {
        ctx.beginPath();
        ctx.moveTo(Math.sin(angle) * 10, -boss.height * 0.28);
        ctx.lineTo(Math.sin(angle) * 16, -boss.height * 0.48);
        ctx.stroke();
      }
      break;
  }
}

function drawBossTexture(boss) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-boss.width / 2, -boss.height / 2, boss.width, boss.height, 24);
  ctx.clip();

  ctx.lineWidth = 3;
  const hw = boss.width / 2;
  const hh = boss.height / 2;
  const t = (state.run?.elapsedMs || 0) * 0.001;
  switch (boss.texture || boss.pattern) {
    case 'prism':
      ['#ff7aa6', '#ffd053', '#79d4b3', '#86d1f2', '#ff9f62', '#c89dff'].forEach((c, i) => {
        ctx.fillStyle = withAlpha(c, 0.18 + Math.sin(t * 1.2 + i) * 0.06);
        ctx.fillRect(-hw, -hh + i * 11, boss.width, 8);
      });
      ctx.strokeStyle = 'rgba(255, 248, 239, 0.2)';
      ctx.lineWidth = 2;
      for (let x = -hw; x < hw + 24; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, hh);
        ctx.lineTo(x + 24, -hh);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.ellipse(-hw * 0.3, -hh * 0.4, 18, 10, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'ember':
      for (let i = 0; i < 8; i++) {
        const glow = ctx.createRadialGradient(
          -hw + i * 18, -hh * 0.4 + Math.sin(t + i * 1.1) * 12, 2,
          -hw + i * 18, -hh * 0.4 + Math.sin(t + i * 1.1) * 12, 16
        );
        glow.addColorStop(0, 'rgba(255, 180, 60, 0.28)');
        glow.addColorStop(1, 'rgba(255, 100, 30, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(-hw, -hh, boss.width, boss.height);
      }
      ctx.strokeStyle = 'rgba(255, 245, 220, 0.28)';
      ctx.lineWidth = 2.5;
      for (let x = -boss.width; x < boss.width; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, hh);
        ctx.lineTo(x + 40, -hh);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 200, 100, 0.15)';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(-20 + i * 12, 8 + Math.sin(t * 2 + i) * 6, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 'circuit':
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.5;
      for (let x = -hw + 8; x < hw; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, -hh);
        ctx.lineTo(x, hh);
        ctx.stroke();
      }
      for (let y = -hh + 8; y < hh; y += 14) {
        ctx.beginPath();
        ctx.moveTo(-hw, y);
        ctx.lineTo(hw, y);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(120, 255, 180, 0.35)';
      [-26, -8, 10, 28].forEach((x) => {
        [-14, 4, 22].forEach((y) => {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      ctx.strokeStyle = 'rgba(120, 255, 180, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-26, -14); ctx.lineTo(-8, -14); ctx.lineTo(-8, 4); ctx.lineTo(10, 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, -14); ctx.lineTo(28, -14); ctx.lineTo(28, 22);
      ctx.stroke();
      break;
    case 'mist':
      for (let i = 0; i < 7; i++) {
        const cx = -24 + i * 9;
        const cy = -6 + Math.sin(t * 0.8 + i * 0.7) * 12;
        const mist = ctx.createRadialGradient(cx, cy, 2, cx, cy, 16);
        mist.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
        mist.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = mist;
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let y = -hh + 6; y < hh; y += 10) {
        ctx.beginPath();
        ctx.moveTo(-hw, y + Math.sin(t + y * 0.1) * 3);
        ctx.bezierCurveTo(-hw * 0.3, y - 4, hw * 0.3, y + 4, hw, y + Math.sin(t + y * 0.1) * 3);
        ctx.stroke();
      }
      break;
    case 'royal':
      ctx.strokeStyle = 'rgba(255, 230, 160, 0.3)';
      ctx.lineWidth = 2;
      for (let r = 14; r <= 52; r += 10) {
        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI, 0);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 215, 100, 0.2)';
      [-20, 0, 20].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, -hh * 0.6);
        ctx.lineTo(x - 5, -hh * 0.3);
        ctx.lineTo(x + 5, -hh * 0.3);
        ctx.closePath();
        ctx.fill();
      });
      ctx.fillStyle = 'rgba(255, 248, 200, 0.22)';
      ctx.beginPath();
      ctx.ellipse(0, -hh * 0.15, 8, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 200, 60, 0.35)';
      ctx.beginPath();
      ctx.arc(0, -hh * 0.15, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'cosmos':
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      [-28, -14, 0, 14, 28].forEach((x, i) => {
        const y = (i % 2 === 0 ? -16 : 16) + Math.sin(t * 0.6 + i) * 3;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + Math.sin(t + i) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.strokeStyle = 'rgba(180, 160, 255, 0.2)';
      ctx.lineWidth = 1.5;
      for (let r = 10; r <= 40; r += 12) {
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.5, t * 0.15, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(200, 180, 255, 0.12)';
      ctx.beginPath();
      ctx.ellipse(-10, -5, 20, 8, -0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'vinyl':
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.5;
      for (let r = 6; r <= 36; r += 6) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 248, 239, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.ellipse(-hw * 0.4, -hh * 0.3, 12, 6, -0.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'ivory':
      ctx.fillStyle = 'rgba(255, 248, 239, 0.15)';
      for (let key = -hw; key < hw; key += 10) {
        ctx.fillRect(key, hh - 22, 7, 22);
      }
      ctx.fillStyle = 'rgba(40, 30, 20, 0.12)';
      for (let key = -hw + 6; key < hw; key += 20) {
        ctx.fillRect(key, hh - 22, 5, 14);
      }
      ctx.strokeStyle = 'rgba(255, 248, 239, 0.16)';
      ctx.lineWidth = 1;
      for (let x = -hw + 10; x < hw; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, -hh);
        ctx.lineTo(x, hh - 22);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 248, 239, 0.08)';
      ctx.beginPath();
      ctx.ellipse(0, -hh * 0.3, hw * 0.6, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'armor':
      ctx.lineWidth = 2;
      for (let y = -hh + 6; y < hh; y += 12) {
        const offset = Math.floor((y + hh) / 12) % 2 === 0 ? 0 : 8;
        ctx.strokeStyle = 'rgba(255, 248, 239, 0.14)';
        for (let x = -hw + offset; x < hw; x += 16) {
          ctx.beginPath();
          ctx.roundRect(x, y, 14, 10, 3);
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(255, 248, 239, 0.22)';
      [-24, 0, 24].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, -14, 3, 0, Math.PI * 2);
        ctx.arc(x, 16, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.strokeStyle = 'rgba(255, 248, 239, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-hw * 0.6, 0);
      ctx.lineTo(hw * 0.6, 0);
      ctx.stroke();
      break;
    default:
      ctx.strokeStyle = 'rgba(255, 248, 239, 0.2)';
      ctx.lineWidth = 2;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * boss.width * 0.7, Math.sin(angle) * boss.height * 0.7);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 248, 239, 0.1)';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

function drawBoss() {
  const boss = state.run.boss;
  if (!boss) return;
  const introWindow = 2400;
  const reveal = state.run.bossIntroMs > 0 ? clamp(1 - state.run.bossIntroMs / introWindow, 0, 1) : 1;
  const time = (state.run.elapsedMs || 0) * 0.001;
  const scale = boss.scale || 1;
  const auraRadius = Math.max(boss.width, boss.height) * 0.96 * scale;
  const headX = boss.width * 0.22;
  const headY = -boss.height * 0.14;

  ctx.save();
  ctx.globalAlpha = 0.22 + reveal * 0.46;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(boss.x, boss.y + boss.height / 2 + 18, auraRadius * 0.56, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(Math.round(boss.x), Math.round(boss.y));
  ctx.globalAlpha = 0.94 + reveal * 0.06;

  ctx.save();
  ctx.scale(scale, scale);

  if (Array.isArray(boss.trail) && boss.trail.length) {
    for (let i = 0; i < 8; i += 1) {
      const trailColor = boss.trail[i % boss.trail.length];
      const offset = i * 12;
      const waveY = Math.sin(time * 7 + i * 0.45) * 4;
      ctx.fillStyle = withAlpha(trailColor, 0.92 - i * 0.07);
      ctx.beginPath();
      ctx.roundRect(-boss.width * 0.78 - offset, -boss.height * 0.18 + waveY, 11, 9, 2.4);
      ctx.fill();
    }
  }

  const aura = ctx.createRadialGradient(0, 0, 8, 0, 0, auraRadius / scale);
  aura.addColorStop(0, withAlpha(boss.glowColor || boss.accent, boss.enraged ? 0.24 : 0.16));
  aura.addColorStop(0.6, withAlpha(boss.glowColor || boss.accent, 0.08));
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, auraRadius / scale, 0, Math.PI * 2);
  ctx.fill();

  if (boss.hasWings) {
    const wingFlap = Math.sin(time * 10) * 0.22;
    ctx.save();
    ctx.translate(-boss.width * 0.56, -boss.height * 0.08);
    ctx.rotate(wingFlap);
    ctx.fillStyle = withAlpha(boss.wingColor || boss.bodyColor || boss.color, 0.88);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-boss.width * 0.42, -boss.height * 0.26, -boss.width * 0.32, boss.height * 0.1);
    ctx.quadraticCurveTo(-boss.width * 0.12, boss.height * 0.18, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(boss.width * 0.56, -boss.height * 0.08);
    ctx.rotate(-wingFlap);
    ctx.fillStyle = withAlpha(boss.wingColor || boss.bodyColor || boss.color, 0.88);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(boss.width * 0.42, -boss.height * 0.26, boss.width * 0.32, boss.height * 0.1);
    ctx.quadraticCurveTo(boss.width * 0.12, boss.height * 0.18, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  if (boss.isGalactic) {
    for (let i = 0; i < 10; i += 1) {
      const angle = time * 0.9 + (i / 10) * Math.PI * 2;
      const distance = boss.width * 0.54 + Math.sin(time * 2 + i) * 4;
      ctx.fillStyle = withAlpha(i % 2 === 0 ? boss.accent : boss.color, 0.58);
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * distance, Math.sin(angle) * distance * 0.58, 2.2 + (i % 3) * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    [-1, 1].forEach((direction) => {
      ctx.save();
      ctx.translate(direction * boss.width * 0.76, Math.sin(time * 7 + direction) * 4);
      ctx.rotate(time * 4 * direction);
      ctx.fillStyle = '#d7d7d7';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = withAlpha('#ff2e48', 0.9);
      ctx.lineWidth = 2;
      ctx.stroke();
      for (let tooth = 0; tooth < 8; tooth += 1) {
        const angle = (Math.PI * 2 * tooth) / 8;
        ctx.fillStyle = '#ff2e48';
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
        ctx.lineTo(Math.cos(angle) * 17, Math.sin(angle) * 17);
        ctx.lineTo(Math.cos(angle + 0.18) * 13, Math.sin(angle + 0.18) * 13);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });
  }

  if (boss.isGuitarBoss) {
    ctx.save();
    ctx.translate(-boss.width * 0.1, boss.height * 0.18);
    ctx.rotate(-0.24);
    const guitar = ctx.createLinearGradient(-18, -22, 18, 22);
    guitar.addColorStop(0, '#7a3f14');
    guitar.addColorStop(1, '#d48a31');
    ctx.fillStyle = guitar;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 15, 0, 0, Math.PI * 2);
    ctx.ellipse(16, -2, 12, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = withAlpha('#20140d', 0.8);
    ctx.fillRect(10, -4, 28, 4);
    ctx.strokeStyle = withAlpha('#fff8ea', 0.6);
    ctx.lineWidth = 0.8;
    for (let stringIndex = 0; stringIndex < 4; stringIndex += 1) {
      const y = -6 + stringIndex * 4;
      ctx.beginPath();
      ctx.moveTo(8, y);
      ctx.lineTo(38, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (boss.isPianoBoss) {
    ctx.save();
    ctx.translate(0, boss.height * 0.18);
    ctx.fillStyle = withAlpha('#0a0a0a', 0.92);
    ctx.beginPath();
    ctx.roundRect(-boss.width * 0.38, -10, boss.width * 0.76, 20, 6);
    ctx.fill();
    ctx.fillStyle = withAlpha('#fff8ea', 0.82);
    for (let key = -boss.width * 0.32; key <= boss.width * 0.22; key += 10) {
      ctx.fillRect(key, -8, 7, 16);
    }
    ctx.fillStyle = withAlpha('#1b1b1b', 0.95);
    for (let key = -boss.width * 0.27; key <= boss.width * 0.17; key += 20) {
      ctx.fillRect(key, -8, 5, 10);
    }
    ctx.restore();
  }

  if (boss.isMegaMaster) {
    for (let ring = 0; ring < 2; ring += 1) {
      const radius = boss.width * (0.72 + ring * 0.16) + Math.sin(time * 3 + ring) * 2;
      ctx.strokeStyle = withAlpha(ring === 0 ? boss.color : boss.accent, 0.3 - ring * 0.1);
      ctx.lineWidth = 2 - ring * 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  if (boss.isJoker) {
    ctx.fillStyle = withAlpha('#ffd053', 0.72);
    for (let i = 0; i < 4; i += 1) {
      const x = -boss.width * 0.36 + i * 18;
      ctx.save();
      ctx.translate(x, -boss.height * 0.6 + Math.sin(time * 4 + i) * 3);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
    }
  }

  const body = ctx.createLinearGradient(-boss.width / 2, -boss.height / 2, boss.width / 2, boss.height / 2);
  body.addColorStop(0, boss.bodyColor || boss.color);
  body.addColorStop(1, boss.color);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.roundRect(-boss.width * 0.5, -boss.height * 0.4, boss.width, boss.height * 0.8, 12);
  ctx.fill();
  ctx.save();
  drawBossTexture(boss);
  ctx.restore();
  ctx.strokeStyle = withAlpha('#fff8ea', 0.84);
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-boss.width * 0.5, -boss.height * 0.4, boss.width, boss.height * 0.8, 12);
  ctx.stroke();

  drawBossAccessories(boss);

  const head = ctx.createRadialGradient(headX - 4, headY - 6, 2, headX, headY, boss.width * 0.34);
  head.addColorStop(0, boss.headColor || boss.color);
  head.addColorStop(1, boss.bodyColor || boss.color);
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.arc(headX, headY, boss.width * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = withAlpha('#2b2220', 0.72);
  ctx.lineWidth = 1.6;
  ctx.stroke();

  const earColor = boss.headColor || boss.color;
  ctx.fillStyle = earColor;
  ctx.beginPath();
  ctx.moveTo(headX - boss.width * 0.22, headY - boss.height * 0.12);
  ctx.lineTo(headX - boss.width * 0.28, headY - boss.height * 0.48);
  ctx.lineTo(headX - boss.width * 0.06, headY - boss.height * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(headX + boss.width * 0.08, headY - boss.height * 0.12);
  ctx.lineTo(headX + boss.width * 0.18, headY - boss.height * 0.48);
  ctx.lineTo(headX + boss.width * 0.14, headY - boss.height * 0.18);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = boss.earColor || boss.accent;
  ctx.beginPath();
  ctx.moveTo(headX - boss.width * 0.18, headY - boss.height * 0.16);
  ctx.lineTo(headX - boss.width * 0.22, headY - boss.height * 0.38);
  ctx.lineTo(headX - boss.width * 0.1, headY - boss.height * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(headX + boss.width * 0.1, headY - boss.height * 0.16);
  ctx.lineTo(headX + boss.width * 0.12, headY - boss.height * 0.38);
  ctx.lineTo(headX + boss.width * 0.04, headY - boss.height * 0.2);
  ctx.closePath();
  ctx.fill();

  if (boss.hasHorn) {
    ctx.fillStyle = withAlpha(boss.accent, 0.9);
    ctx.beginPath();
    ctx.moveTo(headX - boss.width * 0.18, headY - boss.height * 0.28);
    ctx.lineTo(headX - boss.width * 0.24, headY - boss.height * 0.58);
    ctx.lineTo(headX - boss.width * 0.11, headY - boss.height * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(headX + boss.width * 0.13, headY - boss.height * 0.28);
    ctx.lineTo(headX + boss.width * 0.18, headY - boss.height * 0.58);
    ctx.lineTo(headX + boss.width * 0.05, headY - boss.height * 0.34);
    ctx.closePath();
    ctx.fill();
  }

  const eyeY = headY - boss.height * 0.04;
  if (boss.isTerminator) {
    ctx.fillStyle = '#120d0d';
    ctx.beginPath();
    ctx.ellipse(headX - 8, eyeY, 5.2, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff2727';
    ctx.shadowColor = '#ff2e2e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(headX + 7, eyeY, 6.2, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (boss.pattern === 'laser' || boss.isJoker) {
    ctx.fillStyle = boss.eye || '#ffffff';
    ctx.beginPath();
    ctx.moveTo(headX - 14, eyeY - 4);
    ctx.lineTo(headX - 4, eyeY);
    ctx.lineTo(headX - 14, eyeY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(headX + 14, eyeY - 4);
    ctx.lineTo(headX + 4, eyeY);
    ctx.lineTo(headX + 14, eyeY + 4);
    ctx.closePath();
    ctx.fill();
  } else if (boss.pattern === 'rapid') {
    ctx.fillStyle = boss.eye || '#ffffff';
    ctx.fillRect(headX - 13, eyeY - 4, 8, 6);
    ctx.fillRect(headX + 5, eyeY - 4, 8, 6);
  } else {
    ctx.fillStyle = boss.eye || '#ffffff';
    ctx.beginPath();
    ctx.ellipse(headX - 8, eyeY, 4.2, 5.3, 0, 0, Math.PI * 2);
    ctx.ellipse(headX + 8, eyeY, 4.2, 5.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = withAlpha('#ffffff', 0.9);
    ctx.beginPath();
    ctx.arc(headX - 6.8, eyeY - 1.6, 1.2, 0, Math.PI * 2);
    ctx.arc(headX + 9.2, eyeY - 1.6, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = boss.earColor || boss.accent;
  ctx.beginPath();
  ctx.moveTo(headX, headY + 6);
  ctx.lineTo(headX - 3, headY + 10);
  ctx.lineTo(headX + 3, headY + 10);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = withAlpha('#241713', 0.85);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(headX, headY + 10);
  ctx.quadraticCurveTo(headX - 8, headY + 16, headX - 14, headY + 12);
  ctx.moveTo(headX, headY + 10);
  ctx.quadraticCurveTo(headX + 8, headY + 16, headX + 14, headY + 12);
  ctx.stroke();

  if (boss.hasCrown) {
    ctx.fillStyle = '#ffd053';
    ctx.beginPath();
    ctx.moveTo(headX - 14, headY - boss.height * 0.34);
    ctx.lineTo(headX - 8, headY - boss.height * 0.52);
    ctx.lineTo(headX, headY - boss.height * 0.38);
    ctx.lineTo(headX + 8, headY - boss.height * 0.54);
    ctx.lineTo(headX + 14, headY - boss.height * 0.34);
    ctx.closePath();
    ctx.fill();
  }

  if (boss.hasCircuitLines) {
    ctx.strokeStyle = withAlpha('#00ffff', 0.8);
    ctx.lineWidth = 1;
    for (let line = 0; line < 3; line += 1) {
      const y = -boss.height * 0.18 + line * 12;
      ctx.beginPath();
      ctx.moveTo(-boss.width * 0.36, y);
      ctx.lineTo(boss.width * 0.36, y);
      ctx.stroke();
    }
  }

  if (boss.isGhostly) {
    for (let i = 0; i < 5; i += 1) {
      const angle = time * 1.7 + i * 1.26;
      const radius = boss.width * 0.36 + i * 2;
      ctx.fillStyle = withAlpha(boss.color, 0.22);
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.44, 3 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (boss.enraged) {
    ctx.globalCompositeOperation = 'screen';
    const rageGlow = ctx.createRadialGradient(0, 0, auraRadius * 0.12 / scale, 0, 0, auraRadius * 0.9 / scale);
    rageGlow.addColorStop(0, withAlpha(boss.accent, 0.18));
    rageGlow.addColorStop(0.5, withAlpha(boss.color, 0.12));
    rageGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rageGlow;
    ctx.beginPath();
    ctx.arc(0, 0, auraRadius * 0.95 / scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  if (boss.shieldMs > 0) {
    ctx.strokeStyle = withAlpha('#ffffff', 0.9);
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, auraRadius * 0.94 / scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = withAlpha('#ffffff', 0.3);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, auraRadius * 1.08 / scale, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}

function drawPlayerBullet(bullet) {
  ctx.save();
  ctx.translate(bullet.x, bullet.y);
  const angle = Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2;
  ctx.rotate(angle);

  ctx.strokeStyle = withAlpha(bullet.color, 0.35);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.lineTo(0, 20);
  ctx.stroke();

  if (bullet.weaponId === 'superLaser') {
    ctx.shadowColor = withAlpha(bullet.color, 0.72);
    ctx.shadowBlur = 20;
    const beam = ctx.createLinearGradient(0, -20, 0, 20);
    beam.addColorStop(0, '#fff8ea');
    beam.addColorStop(0.45, bullet.color);
    beam.addColorStop(1, '#ff694f');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.roundRect(-5, -20, 10, 40, 5);
    ctx.fill();
    ctx.fillStyle = withAlpha('#fff8ea', 0.8);
    ctx.beginPath();
    ctx.roundRect(-1.5, -22, 3, 44, 2);
    ctx.fill();
  } else if (bullet.weaponId === 'laser') {
    ctx.shadowColor = withAlpha(bullet.color, 0.6);
    ctx.shadowBlur = 14;
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.roundRect(-2.5, -12, 5, 24, 3);
    ctx.fill();
  } else if (bullet.weaponId === 'chainsaw') {
    ctx.rotate(bullet.spin);
    ctx.fillStyle = '#fff8ea';
    for (let index = 0; index < 8; index += 1) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(2.5, -6.5);
      ctx.lineTo(-2.5, -6.5);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(0, 0, 6.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (bullet.weaponId === 'missile') {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.moveTo(0, -11);
    ctx.lineTo(6, 7);
    ctx.lineTo(0, 11);
    ctx.lineTo(-6, 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff8ea';
    ctx.fillRect(-2, -3, 4, 7);
  } else if (bullet.weaponId === 'paw') {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(0, 3, 4.5, 0, Math.PI * 2);
    ctx.arc(-5, -4, 2.2, 0, Math.PI * 2);
    ctx.arc(0, -6, 2.2, 0, Math.PI * 2);
    ctx.arc(5, -4, 2.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (bullet.weaponId === 'bottle') {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.roundRect(-4, -10, 8, 18, 3);
    ctx.fill();
    ctx.fillRect(-2, -13, 4, 5);
    ctx.fillStyle = '#fff8ea';
    ctx.fillRect(-2.3, -3, 4.6, 7);
  } else if (bullet.weaponId === 'ice') {
    ctx.strokeStyle = bullet.color;
    ctx.lineWidth = 1.6;
    for (let index = 0; index < 3; index += 1) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(0, 9);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(5, 5);
    ctx.lineTo(0, 9);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();
  }

  if (bullet.freeze || bullet.explosive) {
    ctx.strokeStyle = withAlpha('#fff8ea', 0.8);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, bullet.radius + 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEnemyBullet(bullet) {
  ctx.save();
  ctx.translate(bullet.x, bullet.y);
  const angle = Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2;
  ctx.rotate(angle);
  ctx.strokeStyle = withAlpha(bullet.color, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.lineTo(0, 15);
  ctx.stroke();

  ctx.shadowColor = withAlpha(bullet.color, 0.5);
  ctx.shadowBlur = 12;
  if (bullet.laser) {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.roundRect(-3, -12, 6, 22, 4);
    ctx.fill();
    if (bullet.beam) {
      ctx.fillStyle = withAlpha('#fff8ea', 0.85);
      ctx.beginPath();
      ctx.roundRect(-1.2, -11, 2.4, 20, 2);
      ctx.fill();
    }
  } else if (bullet.homing) {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(0, 0, bullet.radius + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff8ea';
    ctx.beginPath();
    ctx.arc(0, -1, 2.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (bullet.wave) {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = withAlpha('#fff8ea', 0.68);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, bullet.radius + 3, 0, Math.PI * 2);
    ctx.stroke();
  } else if (bullet.pattern === 'notes') {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(-3, 4, bullet.radius * 0.7, 0, Math.PI * 2);
    ctx.arc(3, 6, bullet.radius * 0.64, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-1.3, -9, 2.6, 13);
    ctx.fillRect(5, -12, 2.6, 16);
    ctx.fillStyle = withAlpha('#fff8ea', 0.78);
    ctx.beginPath();
    ctx.moveTo(-1, -9);
    ctx.lineTo(7.6, -12);
    ctx.lineTo(7.6, -8.8);
    ctx.lineTo(-1, -5.8);
    ctx.closePath();
    ctx.fill();
  } else if (bullet.pattern === 'chains') {
    ctx.strokeStyle = withAlpha(bullet.color, 0.88);
    ctx.lineWidth = 2.2;
    for (let index = -1; index <= 1; index += 1) {
      ctx.beginPath();
      ctx.ellipse(index * 4.6, index * 2.1, 4.2, 2.4, index * 0.18, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#fff8ea';
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(5, -2);
    ctx.lineTo(0, 7);
    ctx.lineTo(-5, -2);
    ctx.closePath();
    ctx.fill();
  } else if (bullet.pattern === 'strings') {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(6, -2);
    ctx.lineTo(3, 10);
    ctx.lineTo(-3, 10);
    ctx.lineTo(-6, -2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = withAlpha('#fff8ea', 0.75);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-1.5, -8);
    ctx.lineTo(-1.5, 8);
    ctx.moveTo(1.5, -8);
    ctx.lineTo(1.5, 8);
    ctx.stroke();
  } else if (bullet.card) {
    ctx.fillStyle = '#fff8ea';
    ctx.beginPath();
    ctx.roundRect(-6, -8.5, 12, 17, 2.8);
    ctx.fill();
    ctx.strokeStyle = withAlpha(bullet.color, 0.9);
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.moveTo(0, -4.5);
    ctx.lineTo(3.6, 0);
    ctx.lineTo(0, 4.5);
    ctx.lineTo(-3.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = withAlpha('#241713', 0.9);
    ctx.beginPath();
    ctx.arc(-2.6, -5.1, 0.9, 0, Math.PI * 2);
    ctx.arc(2.6, 5.1, 0.9, 0, Math.PI * 2);
    ctx.fill();
  } else if (bullet.pattern === 'spread') {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(7, 0);
    ctx.lineTo(0, 10);
    ctx.lineTo(-7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = withAlpha('#fff8ea', 0.55);
    ctx.beginPath();
    ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (bullet.pattern === 'rapid') {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.roundRect(-4, -8, 8, 16, 3.5);
    ctx.fill();
    ctx.fillStyle = withAlpha('#fff8ea', 0.74);
    ctx.fillRect(-1.2, -5, 2.4, 10);
  } else {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawBullets() {
  state.run.bullets.forEach(drawPlayerBullet);
  state.run.enemyBullets.forEach(drawEnemyBullet);
}

function drawParticles() {
  state.run.particles.forEach((particle) => {
    const alpha = particle.lifeMs / particle.maxLifeMs;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

}

function drawBossIntroBanner() {
  return;
}

function drawCombatRibbon() {
  return;
}

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  const pointerIsCoarse = Boolean(window.matchMedia?.('(pointer: coarse)').matches);
  const mobileViewport = window.innerWidth <= 760;
  const lowLagMode = document.body.classList.contains('mobile-low-lag');
  if ('imageSmoothingQuality' in ctx) {
    if (lowLagMode) ctx.imageSmoothingQuality = 'medium';
    else ctx.imageSmoothingQuality = 'high';
  }
  ctx.setTransform(renderResolution.scaleX, 0, 0, renderResolution.scaleY, 0, 0);
  const palette = PALETTES[state.run.arenaPaletteIndex];
  drawArenaBackdrop(palette);

  const shakeScale = state.run.cameraShakeMs > 0 ? state.run.cameraShakeMs / 420 : 0;
  const shakePower = state.run.cameraShakePower * shakeScale;
  const offsetX = shakePower > 0 ? randomRange(-shakePower, shakePower) : 0;
  const offsetY = shakePower > 0 ? randomRange(-shakePower, shakePower) : 0;

  ctx.save();
  ctx.translate(offsetX, offsetY);
  drawGrid(palette);

  if (state.run.phase === 'boss' && state.run.boss) {
    drawBossTelegraph(state.run.boss);
  }

  state.run.entities.forEach((entity) => {
    if (entity.category === 'target') drawTarget(entity);
    else if (entity.category === 'enemy') drawEnemyCreature(entity);
    else if (entity.category === 'pickup') drawPickup(entity);
    else if (entity.category === 'farm') drawFarm(entity);
    else drawHazard(entity);
  });

  drawBoss();
  drawBullets();
  drawPlayer();
  drawParticles();
  ctx.restore();

  drawBossIntroBanner();
  drawCombatRibbon();

  if (state.run.boss && state.run.bossIntroMs > 0) {
    const introAlpha = clamp(state.run.bossIntroMs / 2600, 0, 1);
    ctx.fillStyle = withAlpha('#000000', 0.2 + introAlpha * 0.6);
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  if (state.run.bossDarkPulseMs > 0) {
    const pulseAlpha = clamp(state.run.bossDarkPulseMs / 820, 0, 1) * 0.34;
    ctx.fillStyle = withAlpha('#050505', pulseAlpha);
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  const dangerLevel = computeDangerLevel();
  if (dangerLevel > 84) {
    ctx.fillStyle = withAlpha('#280208', ((dangerLevel - 84) / 16) * 0.08);
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  if (state.mode === 'paused') {
    ctx.fillStyle = 'rgba(19, 14, 10, 0.4)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
}

function syncWeaponDock() {
  if (!ui.weaponDock) return;
  const dockKey = `${state.run.weapon}|${state.run.tempWeapon || 'none'}|${WEAPON_ORDER.map((weaponId) => (state.run.unlockedWeapons.has(weaponId) ? '1' : '0')).join('')}`;
  if (uiCache.weaponDockKey === dockKey) return;
  uiCache.weaponDockKey = dockKey;
  ui.weaponDock.innerHTML = '';
  WEAPON_ORDER.forEach((weaponId) => {
    const weaponColor = getWeaponColor(weaponId);
    const unlocked = state.run.unlockedWeapons.has(weaponId);
    const tempActive = state.run.tempWeapon === weaponId;
    const selected = state.run.weapon === weaponId;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'weapon-chip';
    button.style.borderColor = withAlpha(weaponColor, unlocked ? 0.58 : 0.26);
    button.style.background = unlocked ? '#000000' : withAlpha('#000000', 0.9);
    if (unlocked) {
      if (selected || tempActive) {
        button.classList.add('active');
      }
      button.dataset.state = tempActive ? 'tmp' : selected ? 'live' : 'ready';
      button.innerHTML = `<span class="weapon-chip-badge"></span><strong>${getWeaponName(weaponId)}</strong><span class="weapon-chip-meta">${tempActive ? 'TMP' : selected ? 'LIVE' : 'READY'}</span>`;
      const badge = button.querySelector('.weapon-chip-badge');
      const weaponSprite = getSprite(getWeaponSpriteKey(weaponId));
      if (badge && weaponSprite) {
        badge.style.backgroundImage = `url(${weaponSprite.src})`;
        badge.style.backgroundRepeat = 'no-repeat';
        badge.style.backgroundPosition = 'center';
        badge.style.backgroundSize = '100% 100%';
        badge.textContent = '';
      } else if (badge) {
        badge.textContent = getWeaponGlyph(weaponId);
      }
      button.addEventListener('click', () => {
        state.run.weapon = weaponId;
        pushEvent(state.language === 'ru' ? 'РћР РЈР–РР•' : 'LOADOUT', `${getWeaponName(weaponId)} ${state.language === 'ru' ? 'РІС‹Р±СЂР°РЅРѕ.' : 'selected.'}`, weaponColor);
        syncUI();
      });
    } else {
      button.classList.add('locked');
      button.dataset.state = 'locked';
      button.innerHTML = `<span class="weapon-chip-badge">?</span><strong>${getWeaponName(weaponId)}</strong><span class="weapon-chip-meta">LOCKED</span>`;
    }
    ui.weaponDock.appendChild(button);
  });
}

function setOverlayVisibility(element, visible) {
  if (!element) return;
  element.classList.toggle('visible', visible);
}

function setActiveNav(id) {
  if (uiCache.activeNav === id) return;
  uiCache.activeNav = id;
  [ui.navPlay, ui.navInventory, ui.navQuest, ui.navWallet, ui.navShop].forEach((button) => button?.classList.remove('active'));
  if (id === 'play') ui.navPlay.classList.add('active');
  if (id === 'inventory') ui.navInventory?.classList.add('active');
  if (id === 'quests') ui.navQuest?.classList.add('active');
  if (id === 'wallet') ui.navWallet?.classList.add('active');
  if (id === 'shop') ui.navShop?.classList.add('active');
}

function ensureQuestList() {
  if (!ui.questList) return;
  if (uiCache.questReady) return;
  ui.questList.innerHTML = '';
  (QUEST_ITEMS_I18N[state.language] || QUEST_ITEMS).forEach((item) => {
    const li = document.createElement('li');
    setTextContent(li, item);
    ui.questList.appendChild(li);
  });
  uiCache.questReady = true;
}

function renderActiveBuffs(entries) {
  if (!ui.activeBuffs) return;
  const buffKey = entries.map((entry) => `${entry.label}:${entry.detail}`).join('|') || 'empty';
  if (uiCache.activeBuffKey === buffKey) return;
  uiCache.activeBuffKey = buffKey;
  ui.activeBuffs.innerHTML = '';

  if (!entries.length) {
    const chip = document.createElement('span');
    chip.className = 'buff-chip empty';
    setTextContent(chip, state.language === 'ru' ? 'РќР•Рў РђРљРўРР’РќР«РҐ Р‘РђР¤Р¤РћР’' : 'NO LIVE BUFFS');
    ui.activeBuffs.appendChild(chip);
    return;
  }

  entries.forEach((entry) => {
    const chip = document.createElement('span');
    chip.className = 'buff-chip';
    chip.style.borderColor = withAlpha(entry.color, 0.45);
    chip.style.boxShadow = `0 8px 14px ${withAlpha(entry.color, 0.16)}`;
    const label = document.createElement('span');
    const detail = document.createElement('strong');
    setTextContent(label, entry.label);
    setTextContent(detail, entry.detail);
    chip.append(label, detail);
    ui.activeBuffs.appendChild(chip);
  });
}

function renderCombatFeed() {
  if (!ui.combatFeed) return;
  const feed = state.run.eventFeed.length
    ? state.run.eventFeed
    : [{ id: 0, title: state.language === 'ru' ? 'Р“РћРўРћР’' : 'READY', detail: state.language === 'ru' ? 'РќР°Р¶РјРё PLAY, С‡С‚РѕР±С‹ РІРѕР№С‚Рё РІ Р°СЂРµРЅСѓ.' : 'Tap PLAY to enter the arena.', color: '#f28a1a' }];
  const feedKey = feed.map((entry) => `${entry.title}:${entry.detail}:${entry.color}`).join('|');
  if (uiCache.combatFeedKey === feedKey) return;
  uiCache.combatFeedKey = feedKey;
  ui.combatFeed.innerHTML = '';

  feed.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'combat-feed-item';
    item.style.borderColor = withAlpha(entry.color, 0.36);
    item.style.boxShadow = `0 8px 14px ${withAlpha('#000000', 0.4)}`;
    item.style.background = '#000000';
    const title = document.createElement('span');
    const detail = document.createElement('strong');
    setTextContent(title, entry.title);
    setTextContent(detail, entry.detail);
    item.append(title, detail);
    ui.combatFeed.appendChild(item);
  });
}

function populateRewardCodex() {
  if (!ui.rewardCodex) return;
  const liveKinds = state.run.entities
    .filter((entity) => entity.category === 'pickup')
    .map((entity) => entity.kind);
  const nearestPickup = getNearestPickupInfo();
  const codexKey = `${nearestPickup.label}|${liveKinds.sort().join('|')}`;
  if (uiCache.rewardCodexKey === codexKey) return;
  uiCache.rewardCodexKey = codexKey;
  ui.rewardCodex.innerHTML = '';

  REWARD_CODEX.forEach((entry) => {
    const localizedRewards = {
      heart: { title: state.language === 'ru' ? 'РЎРµСЂРґС†Рµ' : 'Heart', note: state.language === 'ru' ? '+1 Р¶РёР·РЅСЊ. РЎР°РјС‹Р№ С†РµРЅРЅС‹Р№ РґСЂРѕРї.' : '+1 life. Highest clutch value.' },
      shieldPickup: { title: state.language === 'ru' ? 'Р©РёС‚' : 'Shield', note: state.language === 'ru' ? 'РРіРЅРѕСЂРёСЂСѓРµС‚ СѓСЂРѕРЅ 10 СЃРµРєСѓРЅРґ.' : 'Ignores damage for 10 seconds.' },
      doubleShotPickup: { title: state.language === 'ru' ? 'Двойной залп' : 'Double Shot', note: state.language === 'ru' ? 'Стакается со щитом и усиливает авто-огонь 10 секунд.' : 'Stacks with shield and doubles lane pressure for 10 seconds.' },
      superLaserPickup: { title: state.language === 'ru' ? 'РЎСѓРїРµСЂ-Р»Р°Р·РµСЂ' : 'Super Laser', note: state.language === 'ru' ? '10 СЃРµРєСѓРЅРґ С‚РѕС‚Р°Р»СЊРЅРѕР№ Р·Р°С‡РёСЃС‚РєРё.' : 'Ten seconds of arena-clearing fire.' },
      volleyUpgrade: { title: state.language === 'ru' ? 'Апгрейд очереди' : 'Volley Upgrade', note: state.language === 'ru' ? 'Повышает темп и ширину автоматического огня.' : 'Raises automatic fire rate and barrel count.' },
      weaponCrate: { title: state.language === 'ru' ? 'РЇС‰РёРє РѕСЂСѓР¶РёСЏ' : 'Weapon Crate', note: state.language === 'ru' ? 'РћС‚РєСЂС‹РІР°РµС‚ РёР»Рё РѕР±РЅРѕРІР»СЏРµС‚ РїСѓС€РєСѓ.' : 'Unlocks or refreshes a weapon drop.' },
    };
    const isWeaponCrate = entry.kind === 'weaponCrate';
    const live = isWeaponCrate ? liveKinds.some((kind) => kind.startsWith('weapon')) : liveKinds.includes(entry.kind);
    const nearest = isWeaponCrate
      ? WEAPON_ORDER.some((weaponId) => WEAPONS[weaponId].label === nearestPickup.label)
      : nearestPickup.label === entry.tag || nearestPickup.label === entry.title.toUpperCase();
    const card = document.createElement('article');
    card.className = 'reward-card';
    if (live) card.classList.add('live');
    if (nearest) card.classList.add('nearest');
    card.style.borderColor = withAlpha(entry.color, live || nearest ? 0.48 : 0.24);
    card.style.background = '#000000';

    const badge = document.createElement('span');
    badge.className = 'reward-card-badge';
    badge.style.background = withAlpha(entry.color, live || nearest ? 0.84 : 0.34);
    setTextContent(badge, entry.tag);

    const title = document.createElement('strong');
    setTextContent(title, localizedRewards[entry.kind]?.title || localizedText(entry.title));

    const note = document.createElement('p');
    setTextContent(note, localizedRewards[entry.kind]?.note || localizedText(entry.note));

    const meta = document.createElement('span');
    meta.className = 'reward-card-meta';
    setTextContent(meta, nearest ? (state.language === 'ru' ? 'Р‘Р›РР–РђР™РЁРР™' : 'NEAREST') : live ? (state.language === 'ru' ? 'РќРђ РљРђР РўР•' : 'LIVE DROP') : (state.language === 'ru' ? 'РљРћР”Р•РљРЎ' : 'CODEX'));

    card.append(badge, title, note, meta);
    ui.rewardCodex.appendChild(card);
  });
}

function getActiveBuffEntries() {
  const entries = [];
  if (state.run.comboCount > 1 && state.run.comboTimerMs > 0) {
    entries.push({
      label: 'COMBO',
      detail: `x${state.run.comboMultiplier.toFixed(1)}`,
      color: '#ffb85c',
    });
  }
  if (state.run.player.boostMs > 0) {
    entries.push({
      label: 'BOOST',
      detail: formatSeconds(state.run.player.boostMs),
      color: '#79d4b3',
    });
  }
  if (state.run.tempWeapon && state.run.tempWeaponMs > 0) {
    entries.push({
      label: getWeaponName(state.run.tempWeapon),
      detail: formatSeconds(state.run.tempWeaponMs),
      color: WEAPONS[state.run.tempWeapon].color,
    });
  }

  const skillMap = [
    ['guardian', state.language === 'ru' ? 'Р©РРў' : 'SHIELD', '#9ddf85'],
    ['double', state.language === 'ru' ? 'ДУО' : 'DOUBLE', '#ffd053'],
  ];

  skillMap.forEach(([key, label, color]) => {
    const ms = state.run.skillTimers[key];
    if (ms > 0) {
      entries.push({ label, detail: formatSeconds(ms), color });
    }
  });
  return entries;
}

function populateBossRoster(activeName) {
  if (!ui.bossRoster) return;
  const rosterKey = `${activeName}|${state.run.bossIndex}|${state.run.phase}`;
  if (uiCache.bossRosterKey === rosterKey) return;
  uiCache.bossRosterKey = rosterKey;
  ui.bossRoster.innerHTML = '';
  BOSSES.forEach((boss) => {
    const card = document.createElement('div');
    card.className = 'boss-roster-card';
    if (boss.name === activeName) {
      card.classList.add('active');
    }
    card.style.background = '#000000';
    card.style.borderColor = withAlpha(boss.accent, 0.46);
    const name = document.createElement('strong');
    setTextContent(name, boss.name);
    name.style.color = boss.accent;
    const meta = document.createElement('span');
    setTextContent(meta, state.language === 'ru' ? `${boss.pattern} фаза` : `${boss.pattern} pattern`);
    const tier = document.createElement('span');
    setTextContent(tier, boss.name === activeName ? (state.language === 'ru' ? 'АКТИВНЫЙ/СЛЕДУЮЩИЙ' : 'ACTIVE / NEXT') : (state.language === 'ru' ? 'КОДЕКС БОССА' : 'BOSS CODEX'));
    const note = document.createElement('p');
    note.className = 'boss-roster-note';
    setTextContent(note, localizedText(boss.lore));
    card.append(name, meta, tier, note);
    ui.bossRoster.appendChild(card);
  });
}

function populateMenuArsenal() {
  if (!ui.menuArsenal) return;
  const currentWeapon = state.mode === 'menu' ? getPreferredWeapon() : getCurrentWeapon();
  const arsenalKey = `${currentWeapon}|${WEAPON_ORDER.map((weaponId) => (state.run.unlockedWeapons.has(weaponId) ? '1' : '0')).join('')}`;
  if (uiCache.menuArsenalKey === arsenalKey) return;
  uiCache.menuArsenalKey = arsenalKey;
  ui.menuArsenal.innerHTML = '';

  WEAPON_ORDER.forEach((weaponId) => {
    const weaponColor = getWeaponColor(weaponId);
    const card = document.createElement('div');
    const unlocked = state.run.unlockedWeapons.has(weaponId);
    card.className = 'arsenal-card';
    if (!unlocked) card.classList.add('locked');
    if (weaponId === currentWeapon) card.classList.add('active');
    card.style.borderColor = withAlpha(weaponColor, unlocked ? 0.42 : 0.22);
    card.style.background = '#000000';

    const badge = document.createElement('div');
    badge.className = 'arsenal-badge';
    badge.style.background = withAlpha(weaponColor, unlocked ? 0.82 : 0.36);
    const weaponSprite = getSprite(getWeaponSpriteKey(weaponId));
    if (weaponSprite) {
      badge.style.backgroundImage = `url(${weaponSprite.src})`;
      badge.style.backgroundSize = '78% 78%';
      badge.style.backgroundRepeat = 'no-repeat';
      badge.style.backgroundPosition = 'center';
      setTextContent(badge, '');
    } else {
      setTextContent(badge, getWeaponGlyph(weaponId));
    }

    const title = document.createElement('strong');
    setTextContent(title, getWeaponName(weaponId));

    const meta = document.createElement('span');
    setTextContent(meta, unlocked ? (weaponId === currentWeapon ? (state.language === 'ru' ? 'РђРљРўРР’РќРћ' : 'ACTIVE') : (state.language === 'ru' ? 'РћРўРљР Р«РўРћ' : 'UNLOCKED')) : (state.language === 'ru' ? 'Р—РђРљР Р«РўРћ' : 'LOCKED'));

    card.append(badge, title, meta);
    ui.menuArsenal.appendChild(card);
  });
}

function createSkinShipPreview(skin, variant = 'compact') {
  const preview = document.createElement('span');
  preview.className = `skin-ship-preview ${variant}`;
  preview.style.setProperty('--ship-preview-hull', constrainPaletteColor(skin.hull));
  preview.style.setProperty('--ship-preview-accent', constrainPaletteColor(skin.accent));
  preview.style.setProperty('--ship-preview-face', constrainPaletteColor(skin.face));
  preview.style.setProperty('--ship-preview-glow', withAlpha(constrainPaletteColor(skin.glow || skin.accent), variant === 'large' ? 0.42 : 0.28));

  const wingLeft = document.createElement('span');
  wingLeft.className = 'skin-ship-wing left';
  const wingRight = document.createElement('span');
  wingRight.className = 'skin-ship-wing right';
  const body = document.createElement('span');
  body.className = 'skin-ship-body';
  const cockpit = document.createElement('span');
  cockpit.className = 'skin-ship-cockpit';
  const engine = document.createElement('span');
  engine.className = 'skin-ship-engine';
  const flame = document.createElement('span');
  flame.className = 'skin-ship-flame';

  preview.append(wingLeft, wingRight, body, cockpit, engine, flame);
  return preview;
}

function renderSkinInventory() {
  if (!ui.skinInventoryGrid) return;
  const key = `${state.shipSkin}|${state.walletConnected ? 1 : 0}|${state.napiwasBalance}|${Array.from(state.questSkinUnlocks).sort().join(',')}|${state.language}`;
  if (uiCache.skinInventoryKey === key) return;
  uiCache.skinInventoryKey = key;
  ui.skinInventoryGrid.innerHTML = '';
  const premiumReady = isPremiumAccessActive();

  SHIP_SKINS.forEach((skin) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'skin-tile';
    const selectedSkin = skin.id === state.shipSkin;
    if (selectedSkin) tile.classList.add('selected-skin');
    const locked = !canUseSkin(skin.id);
    if (locked) tile.classList.add('locked');
    tile.style.borderColor = withAlpha(skin.accent, selectedSkin ? 0.84 : 0.34);
    tile.style.background = '#000000';
    if (selectedSkin) {
      tile.style.setProperty('background', '#090909', 'important');
      tile.style.setProperty('border-color', 'rgba(255, 213, 133, 0.62)', 'important');
      tile.style.setProperty('box-shadow', '0 0 0 1px rgba(255, 213, 133, 0.18), 0 16px 30px rgba(242, 138, 26, 0.2)', 'important');
    }

    const top = document.createElement('div');
    top.className = 'skin-tile-top';
    const preview = createSkinShipPreview(skin, 'compact');
    if (selectedSkin) {
      preview.style.setProperty('filter', `drop-shadow(0 0 14px ${withAlpha(constrainPaletteColor(skin.glow || skin.accent), 0.52)})`, 'important');
    }
    const name = document.createElement('strong');
    setTextContent(name, localizedText(skin.label));
    top.append(preview, name);

    const meta = document.createElement('span');
    meta.className = 'skin-meta';
    if (skin.premium) {
      setTextContent(meta, premiumReady
        ? (state.language === 'ru' ? 'PREMIUM РђРљРўРР’Р•Рќ' : 'PREMIUM READY')
        : `${state.language === 'ru' ? 'РќРЈР–РќРћ' : 'NEED'} ${PREMIUM_NAPIWAS_THRESHOLD} NAPIWAS`);
    } else if (skin.questReward) {
      setTextContent(meta, locked
        ? (state.language === 'ru' ? 'НАГРАДА ЗА ЗАДАНИЕ' : 'QUEST REWARD')
        : (state.language === 'ru' ? 'КОНТРАКТ ВЫПОЛНЕН' : 'CONTRACT UNLOCKED'));
    } else {
      setTextContent(meta, state.language === 'ru' ? 'BASE SKIN' : 'BASE SKIN');
    }

    if (skin.premium) {
      const badge = document.createElement('span');
      badge.className = 'premium-badge';
      setTextContent(badge, 'TON');
      tile.appendChild(badge);
    } else if (skin.questReward) {
      const badge = document.createElement('span');
      badge.className = 'premium-badge quest-badge';
      setTextContent(badge, state.language === 'ru' ? 'Q' : 'Q');
      tile.appendChild(badge);
    }

    tile.append(top, meta);
    tile.addEventListener('click', () => selectSkin(skin.id));
    ui.skinInventoryGrid.appendChild(tile);
  });
}

function renderShopCatalog() {
  if (!ui.shopSkinGrid) return;
  const key = `${state.shipSkin}|${state.beerBalance}|${Array.from(state.purchasedSkins).sort().join(',')}|${state.walletConnected ? 1 : 0}|${state.napiwasBalance}|${state.language}`;
  if (uiCache.shopCatalogKey === key) return;
  uiCache.shopCatalogKey = key;
  ui.shopSkinGrid.innerHTML = '';

  SHIP_SKINS.filter((skin) => skin.id !== 'classic').forEach((skin) => {
    const card = document.createElement('article');
    card.className = 'shop-skin-card';
    const selectedSkin = state.shipSkin === skin.id;
    if (selectedSkin) card.classList.add('selected-skin-card');
    const unlocked = canUseSkin(skin.id);
    const purchasable = isSkinPurchasable(skin.id);
    const price = getSkinShopPrice(skin.id);
    if (selectedSkin) {
      card.style.setProperty('background', '#090909', 'important');
      card.style.setProperty('border-color', 'rgba(255, 213, 133, 0.62)', 'important');
      card.style.setProperty('box-shadow', '0 0 0 1px rgba(255, 213, 133, 0.18), 0 16px 30px rgba(242, 138, 26, 0.2)', 'important');
    }

    const preview = document.createElement('div');
    preview.className = 'shop-skin-preview';
    preview.style.background = '#000000';
    preview.style.border = `1px solid ${withAlpha(skin.accent, 0.45)}`;
    if (selectedSkin) {
      preview.style.setProperty('border-color', 'rgba(255, 213, 133, 0.62)', 'important');
      preview.style.setProperty('box-shadow', '0 0 18px rgba(255, 207, 120, 0.12), 0 0 28px rgba(242, 138, 26, 0.22)', 'important');
    }
    const shipPreview = createSkinShipPreview(skin, 'large');
    if (selectedSkin) {
      shipPreview.style.setProperty('filter', `drop-shadow(0 0 16px ${withAlpha(constrainPaletteColor(skin.glow || skin.accent), 0.54)})`, 'important');
    }
    preview.appendChild(shipPreview);

    const title = document.createElement('strong');
    title.className = 'shop-skin-name';
    setTextContent(title, localizedText(skin.label));

    const meta = document.createElement('span');
    meta.className = 'shop-skin-meta';
    if (selectedSkin) {
      setTextContent(meta, state.language === 'ru' ? 'ЭКИПИРОВАН' : 'EQUIPPED');
    } else if (unlocked) {
      setTextContent(meta, state.language === 'ru' ? 'ДОСТУПЕН' : 'READY');
    } else if (purchasable) {
      setTextContent(meta, state.language === 'ru' ? `ЦЕНА ${formatUiInteger(price)} КРУЖЕК` : `${formatUiInteger(price)} MUGS`);
    } else {
      setTextContent(meta, state.language === 'ru' ? 'НЕДОСТУПЕН' : 'LOCKED');
    }

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'shop-buy-button';
    if (selectedSkin) {
      setTextContent(action, state.language === 'ru' ? 'АКТИВЕН' : 'ACTIVE');
      action.disabled = true;
    } else if (unlocked) {
      setTextContent(action, state.language === 'ru' ? 'ВЫБРАТЬ' : 'SELECT');
      action.addEventListener('click', () => selectSkin(skin.id));
    } else {
      const affordable = state.beerBalance >= price;
      setTextContent(
        action,
        state.language === 'ru'
          ? `КУПИТЬ - ${formatUiInteger(price)}`
          : `BUY - ${formatUiInteger(price)}`,
      );
      action.disabled = !affordable;
      action.addEventListener('click', () => purchaseSkin(skin.id));
    }

    card.append(preview, title, meta, action);
    ui.shopSkinGrid.appendChild(card);
  });
}

function populateQuestBoard() {
  if (!ui.questBoard) return;
  const snapshots = QUEST_DEFS.map((quest) => ({
    quest,
    progress: getQuestProgress(quest),
  }));
  const claimedCount = snapshots.filter((entry) => entry.progress.claimed).length;
  const readyCount = snapshots.filter((entry) => entry.progress.ready).length;
  const rewardPool = QUEST_DEFS.reduce((summary, quest) => {
    if (quest.reward?.kind === 'beer') summary.beer += Math.max(0, Number(quest.reward.amount) || 0);
    if (quest.reward?.kind === 'weapon') summary.weapons += 1;
    if (quest.reward?.kind === 'skin') summary.skins += 1;
    return summary;
  }, { beer: 0, weapons: 0, skins: 0 });
  const boardKey = snapshots
    .map((entry) => `${entry.quest.id}:${entry.progress.current}:${entry.progress.claimed ? 1 : 0}`)
    .join('|') + `|${state.language}`;

  setTextContent(
    ui.questBoardMeta,
    readyCount > 0
      ? (state.language === 'ru' ? `${readyCount} ГОТОВО К ВЫДАЧЕ` : `${readyCount} READY TO CLAIM`)
      : (state.language === 'ru' ? 'КОНТРАКТЫ В РАБОТЕ' : 'CONTRACTS LIVE'),
  );
  setTextContent(ui.questsClaimedValue, String(claimedCount));
  setTextContent(ui.questsReadyValue, String(readyCount));
  setTextContent(ui.questsPoolValue, `${rewardPool.weapons}W / ${rewardPool.skins}S / ${rewardPool.beer}`);

  if (uiCache.questBoardKey === boardKey) return;
  uiCache.questBoardKey = boardKey;
  ui.questBoard.innerHTML = '';

  snapshots.forEach(({ quest, progress }) => {
    const card = document.createElement('article');
    card.className = 'quest-contract';
    if (progress.ready) card.classList.add('ready');
    if (progress.claimed) card.classList.add('claimed');

    const head = document.createElement('div');
    head.className = 'quest-contract-head';
    const titleStack = document.createElement('div');
    titleStack.className = 'quest-contract-copy';
    const title = document.createElement('strong');
    title.className = 'quest-contract-title';
    setTextContent(title, localizedText(quest.title));
    const body = document.createElement('p');
    body.className = 'quest-contract-body';
    setTextContent(body, localizedText(quest.body));
    titleStack.append(title, body);

    const status = document.createElement('span');
    status.className = 'quest-contract-status';
    setTextContent(
      status,
      progress.claimed
        ? (state.language === 'ru' ? 'ПОЛУЧЕНО' : 'CLAIMED')
        : progress.ready
          ? (state.language === 'ru' ? 'ГОТОВО' : 'READY')
          : `${formatUiInteger(Math.min(progress.current, progress.target))}/${formatUiInteger(progress.target)}`,
    );
    head.append(titleStack, status);

    const progressRow = document.createElement('div');
    progressRow.className = 'quest-progress-row';
    const progressTrack = document.createElement('div');
    progressTrack.className = 'quest-progress-track';
    const progressFill = document.createElement('div');
    progressFill.className = 'quest-progress-fill';
    progressFill.style.width = `${progress.percent}%`;
    progressTrack.appendChild(progressFill);
    const progressText = document.createElement('span');
    progressText.className = 'quest-progress-text';
    setTextContent(
      progressText,
      state.language === 'ru'
        ? `Прогресс ${formatUiInteger(Math.min(progress.current, progress.target))} / ${formatUiInteger(progress.target)}`
        : `Progress ${formatUiInteger(Math.min(progress.current, progress.target))} / ${formatUiInteger(progress.target)}`,
    );
    progressRow.append(progressTrack, progressText);

    const footer = document.createElement('div');
    footer.className = 'quest-contract-footer';
    const rewardChip = document.createElement('span');
    rewardChip.className = 'quest-reward-chip';
    const rewardKind = document.createElement('small');
    setTextContent(rewardKind, getQuestRewardKindLabel(quest.reward));
    const rewardValue = document.createElement('strong');
    setTextContent(rewardValue, getQuestRewardLabel(quest.reward));
    rewardChip.append(rewardKind, rewardValue);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quest-claim-button';
    button.disabled = progress.claimed || !progress.ready;
    setTextContent(
      button,
      progress.claimed
        ? (state.language === 'ru' ? 'ПОЛУЧЕНО' : 'CLAIMED')
        : progress.ready
          ? (state.language === 'ru' ? 'ЗАБРАТЬ' : 'CLAIM')
          : (state.language === 'ru' ? 'В ПРОЦЕССЕ' : 'IN PROGRESS'),
    );
    button.addEventListener('click', () => claimQuestReward(quest.id));
    footer.append(rewardChip, button);

    card.append(head, progressRow, footer);
    ui.questBoard.appendChild(card);
  });
}

function renderLeaderboard() {
  if (!ui.leaderboardList) return;
  const boardKey = state.live.leaderboard
    .map((entry) => `${entry.rank}:${entry.alias}:${entry.score}:${entry.bosses}:${entry.meters}`)
    .join('|');
  if (uiCache.leaderboardKey === boardKey) return;
  uiCache.leaderboardKey = boardKey;
  ui.leaderboardList.innerHTML = '';

  const rows = state.live.leaderboard.length
    ? state.live.leaderboard
    : [{
      rank: 1,
      alias: state.language === 'ru' ? 'Пусто' : 'No runs yet',
      score: 0,
      bosses: 0,
      meters: 0,
      walletTag: '',
    }];

  rows.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'leaderboard-row';
    const left = document.createElement('div');
    left.className = 'leaderboard-row-main';
    const rank = document.createElement('span');
    rank.className = 'leaderboard-rank';
    setTextContent(rank, `#${entry.rank}`);
    const alias = document.createElement('strong');
    alias.className = 'leaderboard-alias';
    setTextContent(alias, entry.alias);
    const meta = document.createElement('span');
    meta.className = 'leaderboard-wallet';
    setTextContent(meta, entry.walletTag || `${entry.bosses}B | ${entry.meters}M`);
    left.append(rank, alias, meta);

    const right = document.createElement('div');
    right.className = 'leaderboard-row-score';
    const score = document.createElement('strong');
    setTextContent(score, formatUiInteger(entry.score));
    const sub = document.createElement('span');
    setTextContent(sub, `${entry.bosses}B | ${entry.meters}M`);
    right.append(score, sub);

    row.append(left, right);
    ui.leaderboardList.appendChild(row);
  });
}

function getLiveEventTypeLabel(type) {
  const normalizedType = typeof type === 'string' ? type : '';
  const dictionary = {
    pageView: { en: 'ENTERED', ru: 'ЗАШЕЛ' },
    runStart: { en: 'RUN', ru: 'ЗАБЕГ' },
    bossDefeat: { en: 'BOSS', ru: 'БОСС' },
    walletConnect: { en: 'WALLET', ru: 'КОШЕЛЕК' },
    questClaim: { en: 'QUEST', ru: 'КВЕСТ' },
    dailyCheckin: { en: 'DAILY', ru: 'ЧЕК-ИН' },
    challengeCreate: { en: 'PVP OPEN', ru: 'PVP ОТКРЫТ' },
    challengeAccept: { en: 'PVP JOIN', ru: 'PVP ПРИНЯТ' },
    leaderboardSubmit: { en: 'SCORE', ru: 'СЧЕТ' },
  };
  return localizedText(dictionary[normalizedType] || { en: 'LIVE', ru: 'ЛАЙВ' });
}

function formatLiveEventAge(createdAt) {
  const now = Date.now();
  const ageMs = Math.max(0, now - (Number(createdAt) || now));
  const ageSeconds = Math.floor(ageMs / 1000);
  if (ageSeconds < 15) return state.language === 'ru' ? 'сейчас' : 'now';
  if (ageSeconds < 60) return state.language === 'ru' ? `${ageSeconds}с назад` : `${ageSeconds}s ago`;
  const ageMinutes = Math.floor(ageSeconds / 60);
  if (ageMinutes < 60) return state.language === 'ru' ? `${ageMinutes}м назад` : `${ageMinutes}m ago`;
  const ageHours = Math.floor(ageMinutes / 60);
  if (ageHours < 24) return state.language === 'ru' ? `${ageHours}ч назад` : `${ageHours}h ago`;
  const ageDays = Math.floor(ageHours / 24);
  return state.language === 'ru' ? `${ageDays}д назад` : `${ageDays}d ago`;
}

function renderLiveActivity() {
  if (!ui.liveActivityList) return;
  const activity = Array.isArray(state.live.analytics.recentEvents) ? state.live.analytics.recentEvents : [];
  const activityKey = activity
    .map((entry) => `${entry.id || ''}:${entry.type || ''}:${entry.alias || ''}:${entry.detail || ''}:${entry.createdAt || 0}`)
    .join('|');
  if (uiCache.liveActivityKey === activityKey) return;
  uiCache.liveActivityKey = activityKey;
  ui.liveActivityList.innerHTML = '';

  if (!activity.length) {
    const empty = document.createElement('div');
    empty.className = 'live-activity-empty';
    setTextContent(empty, state.language === 'ru' ? 'Пока нет live-событий.' : 'No live activity yet.');
    ui.liveActivityList.appendChild(empty);
    return;
  }

  activity.forEach((entry) => {
    const row = document.createElement('article');
    row.className = 'live-activity-row';

    const head = document.createElement('div');
    head.className = 'live-activity-head';
    const badge = document.createElement('span');
    badge.className = 'live-activity-badge';
    setTextContent(badge, getLiveEventTypeLabel(entry.type));
    const age = document.createElement('span');
    age.className = 'live-activity-age';
    setTextContent(age, formatLiveEventAge(entry.createdAt));
    head.append(badge, age);

    const alias = document.createElement('strong');
    alias.className = 'live-activity-alias';
    setTextContent(alias, entry.alias || (state.language === 'ru' ? 'Пилот' : 'Pilot'));

    const detail = document.createElement('p');
    detail.className = 'live-activity-detail';
    setTextContent(
      detail,
      entry.detail || (state.language === 'ru' ? 'Действие зафиксировано в live-ленте.' : 'Action recorded in the live feed.'),
    );

    row.append(head, alias, detail);
    ui.liveActivityList.appendChild(row);
  });
}

function renderChallengeBoard() {
  if (!ui.challengeList) return;
  const activeChallenge = getActiveChallenge();
  const listKey = state.live.challenges
    .map((challenge) => `${challenge.id}:${challenge.status}:${challenge.hostAlias}:${challenge.guestAlias}:${challenge.winnerId}`)
    .join('|');
  if (uiCache.challengeKey === listKey) return;
  uiCache.challengeKey = listKey;
  ui.challengeList.innerHTML = '';
  setTextContent(
    ui.challengeActiveNote,
    activeChallenge
      ? activeChallenge.status === 'resolved'
        ? (state.language === 'ru'
          ? `Дуэль ${activeChallenge.id} завершена.`
          : `Duel ${activeChallenge.id} resolved.`)
        : (state.language === 'ru'
          ? `Активна дуэль ${activeChallenge.id} на ${activeChallenge.stake} кружек.`
          : `Live duel ${activeChallenge.id} for ${activeChallenge.stake} mugs.`)
      : (state.language === 'ru' ? 'Активной дуэли нет.' : 'No live duel.'),
  );

  if (!state.live.challenges.length) {
    const empty = document.createElement('div');
    empty.className = 'challenge-empty';
    setTextContent(empty, state.language === 'ru' ? 'Пока нет открытых ставок.' : 'No open bets yet.');
    ui.challengeList.appendChild(empty);
    return;
  }

  state.live.challenges.forEach((challenge) => {
    const card = document.createElement('article');
    card.className = 'challenge-card';
    const head = document.createElement('div');
    head.className = 'challenge-card-head';
    const title = document.createElement('strong');
    setTextContent(title, `${challenge.type === 'bosses' ? 'BOSS' : 'SCORE'} | ${challenge.stake}`);
    const status = document.createElement('span');
    status.className = 'challenge-card-status';
    setTextContent(status, challenge.status.toUpperCase());
    head.append(title, status);

    const body = document.createElement('p');
    const opponentLine = challenge.guestAlias
      ? `${challenge.hostAlias} vs ${challenge.guestAlias}`
      : `${challenge.hostAlias} ${state.language === 'ru' ? 'ждет соперника' : 'is waiting for a rival'}`;
    setTextContent(body, `${opponentLine} | ${challenge.metricLabel}`);

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'ghost-button compact-link';
    if (challenge.status === 'open' && challenge.hostId !== state.coop.clientId) {
      setTextContent(action, state.language === 'ru' ? 'ПРИНЯТЬ' : 'ACCEPT');
      action.addEventListener('click', () => acceptPvpChallenge(challenge.id));
    } else if (challenge.status === 'resolved') {
      const winnerAlias = challenge.winnerId === challenge.hostId ? challenge.hostAlias : challenge.guestAlias || (state.language === 'ru' ? 'ничья' : 'draw');
      setTextContent(action, challenge.winnerId ? winnerAlias : (state.language === 'ru' ? 'НИЧЬЯ' : 'DRAW'));
      action.disabled = true;
    } else {
      setTextContent(action, state.language === 'ru' ? 'В БОЮ' : 'LIVE');
      action.disabled = true;
    }

    card.append(head, body, action);
    ui.challengeList.appendChild(card);
  });
}

function renderPartnerBoard() {
  if (!ui.partnerGrid) return;
  const partners = [...state.live.partners, ...state.customPartners];
  const partnerKey = partners.map((partner) => `${partner.id}:${partner.name}:${partner.href}`).join('|');
  if (uiCache.partnerKey === partnerKey) return;
  uiCache.partnerKey = partnerKey;
  ui.partnerGrid.innerHTML = '';

  partners.forEach((partner) => {
    const card = document.createElement('a');
    card.className = 'partner-card';
    card.href = partner.href;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    const name = document.createElement('strong');
    setTextContent(name, partner.name);
    const note = document.createElement('span');
    setTextContent(note, partner.note || (state.language === 'ru' ? 'Партнер проекта' : 'Project partner'));
    card.append(name, note);
    ui.partnerGrid.appendChild(card);
  });
}

function renderMusicTracks() {
  if (!ui.musicTrackList) return;
  const trackKey = `${state.musicSelection}|${Array.from(state.unlockedTracks).sort().join(',')}|${state.customTracks.map((track) => track.id).join(',')}`;
  if (uiCache.musicTrackKey === trackKey) return;
  uiCache.musicTrackKey = trackKey;
  ui.musicTrackList.innerHTML = '';

  const autoButton = document.createElement('button');
  autoButton.type = 'button';
  autoButton.className = 'music-track-card';
  if (state.musicSelection === 'auto') autoButton.classList.add('active');
  autoButton.innerHTML = `<strong>AUTO MIX</strong><span>${state.language === 'ru' ? 'Динамический саундтрек по фазам боя.' : 'Dynamic soundtrack by run phase.'}</span>`;
  autoButton.addEventListener('click', () => selectMusicTrack('auto'));
  ui.musicTrackList.appendChild(autoButton);

  getMusicLibrary().forEach((track) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'music-track-card';
    if (state.musicSelection === track.id) button.classList.add('active');
    if (!track.unlocked) button.classList.add('locked');
    const unlockCopy = track.custom
      ? (state.language === 'ru' ? 'Пользовательский URL-трек.' : 'Custom URL track.')
      : track.unlockType === 'bosses'
        ? (state.language === 'ru' ? `Открывается после ${track.target} боссов.` : `Unlocks after ${track.target} boss kills.`)
        : track.unlockType === 'score'
          ? (state.language === 'ru' ? `Открывается после ${track.target} очков рекорда.` : `Unlocks after ${track.target} high score.`)
          : (state.language === 'ru' ? 'Доступен сразу.' : 'Available immediately.');
    button.innerHTML = `<strong>${track.title}</strong><span>${unlockCopy}</span>`;
    button.disabled = !track.unlocked;
    button.addEventListener('click', () => selectMusicTrack(track.id));
    ui.musicTrackList.appendChild(button);
  });
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  } catch {
    // Fullscreen may be unavailable in automation or restricted browser contexts.
  }
  resizeArenaFrame();
  syncUI();
}

function syncUI() {
  applyLanguage();
  state.menuView = normalizeMenuView(state.menuView);
  state.tokenInfoPane = normalizeTokenInfoPane(state.tokenInfoPane);
  syncUnlockedMusicTracks();
  settleResolvedChallengeRewards();
  const boss = state.run.boss;
  const currentWeapon = getCurrentWeapon();
  const preferredWeapon = getPreferredWeapon();
  const displayWeapon = state.mode === 'menu' ? preferredWeapon : currentWeapon;
  const bossProgress = boss ? (boss.hp / boss.maxHp) * 100 : 0;
  const nextBoss = BOSSES[state.run.bossIndex % BOSSES.length];
  const activeBuffs = getActiveBuffEntries();
  const unlockedCount = WEAPON_ORDER.filter((weaponId) => state.run.unlockedWeapons.has(weaponId)).length;
  const fullscreenActive = Boolean(document.fullscreenElement);
  const pointerIsCoarse = window.matchMedia?.('(pointer: coarse)').matches;
  const mobileViewport = window.innerWidth <= 760;
  const compactPhoneLabels = mobileViewport;
  const lowPowerHint =
    (Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 6)
    || (Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4);
  const difficultyMeta = getDifficultyMeta(state.difficulty);
  const dangerLevel = computeDangerLevel();
  const threatSummary = getThreatSummary();
  const nearestPickup = getNearestPickupInfo();
  const weaponBrief = getWeaponBrief(displayWeapon);
  const runRank = getRunRank();
  const phaseDetail = boss
    ? `${boss.pattern.toUpperCase()} ${state.language === 'ru' ? 'Р¤РђР—Рђ' : 'PRESSURE'}`
    : state.run.bossCooldownMs > 0
      ? `${state.language === 'ru' ? 'РџРђРЈР—Рђ' : 'COOLDOWN'} ${formatSeconds(state.run.bossCooldownMs)}`
      : state.language === 'ru' ? 'РћР‘Р«Р§РќР«Р™ РџРћРўРћРљ' : 'NORMAL FLOW';
  const nextBossLabel = boss
    ? `${boss.hp} HP`
    : state.run.bossCooldownMs > 0
      ? formatSeconds(state.run.bossCooldownMs)
      : `${Math.max(0, state.run.nextBossScore - state.run.score)} ${state.language === 'ru' ? 'РћР§Рљ.' : 'PTS'}`;
  const statusNote = activeBuffs[0]
    ? `${activeBuffs[0].label} ${activeBuffs[0].detail}`
    : state.run.lastPickupLabel.toUpperCase();
  const menuBossSource = boss || nextBoss;
  const menuBossPattern = boss
    ? `${boss.pattern.toUpperCase()} | ${boss.hp}/${boss.maxHp} HP`
    : `${nextBoss.pattern.toUpperCase()} | ${Math.max(0, state.run.nextBossScore - state.run.score)} ${state.language === 'ru' ? 'Р”Рћ' : 'TO GO'}`;
  const bossBriefDetail = boss
    ? `${boss.pattern.toUpperCase()} | ${boss.hp}/${boss.maxHp} HP`
    : `${nextBoss.pattern.toUpperCase()} | ${Math.max(0, state.run.nextBossScore - state.run.score)} ${state.language === 'ru' ? 'Р”Рћ' : 'TO GO'}`;
  const bossBriefNote = boss
    ? getBossPatternBrief(boss.pattern)
    : getBossPatternBrief(nextBoss.pattern);
  const bossEta = formatBossEta();
  const currentSkin = getShipSkin();
  const shipSkinName = getShipSkinName();
  const weaponFinishName = getWeaponFinishName();
  const hullMax = Math.max(state.run.maxLivesSeen, state.godMode ? 100 : 3);
  const hullPercent = clamp((state.run.lives / Math.max(1, hullMax)) * 100, 0, 100);
  const weaponHudColor = getWeaponColor(currentWeapon);
  const premiumAccess = isPremiumAccessActive();
  const premiumProgress = premiumAccess ? 100 : getPremiumAccessPercent();
  const premiumProgressLabel = `${Math.round(premiumProgress)}%`;
  const premiumProgressNote = state.napiwasBalance >= PREMIUM_NAPIWAS_THRESHOLD
    ? `${PREMIUM_NAPIWAS_THRESHOLD}+ / ${PREMIUM_NAPIWAS_THRESHOLD}`
    : `${Math.max(0, state.napiwasBalance)} / ${PREMIUM_NAPIWAS_THRESHOLD}`;
  const bonusTier = getNapiwasBonusTier();
  const canClaimDaily = canClaimDailyCheckin();
  const dailyReward = getDailyRewardAmount(state.daily.streak + (canClaimDaily ? 1 : 0));
  const activeChallenge = getActiveChallenge();
  const formattedBeerBalance = formatUiInteger(state.beerBalance);
  const formattedNapiwasBalance = formatUiInteger(state.napiwasBalance);
  const fullWalletAddress = state.walletConnected
    ? normalizeTonAddressInput(state.walletAddress)
    : (state.language === 'ru' ? 'TON кошелек не подключен' : 'TON wallet not connected');
  const menuAccent = STRICT_UI_COLORS.orange;
  const menuAccentSoft = STRICT_UI_COLORS.cream;
  const menuAccentGlow = STRICT_UI_COLORS.white;

  setTextContent(ui.scoreValue, String(state.run.score));
  setTextContent(ui.metersValue, String(state.run.meters));
  setTextContent(ui.metersRecordValue, String(state.metaStats.bestMeters));
  setTextContent(ui.livesValue, String(state.run.lives));
  setTextContent(ui.weaponValue, getWeaponName(displayWeapon));
  setTextContent(ui.levelValue, String(state.run.level));
  const weaponButtonLabel = compactPhoneLabels ? getWeaponGlyph(state.run.weapon) : getWeaponName(state.run.weapon);
  setTextContent(ui.weaponButton, weaponButtonLabel);
  if (ui.weaponButton) {
    ui.weaponButton.setAttribute('aria-label', getWeaponName(state.run.weapon));
    ui.weaponButton.setAttribute('title', getWeaponName(state.run.weapon));
  }
  setTextContent(ui.difficultyButton, `DIFF ${state.difficulty}`);
  setTextContent(ui.menuDifficultyValue, String(state.difficulty));
  setTextContent(ui.menuDifficultyNote, difficultyMeta.label);
  setTextContent(ui.menuSkinPreview, `${shipSkinName}${getShipSkin().premium ? (premiumAccess ? ' вЂў TON' : ' вЂў LOCKED') : ''}`);
  setTextContent(ui.menuSoundValue, state.audioEnabled ? t('onLabel') : t('offLabel'));
  setTextContent(ui.godModeValue, state.godMode ? t('onLabel') : t('offLabel'));
  setTextContent(ui.shipSkinValue, shipSkinName);
  setTextContent(ui.weaponFinishValue, weaponFinishName);
  setTextContent(ui.hangarWeaponValue, getWeaponName(preferredWeapon));
  setTextContent(ui.hangarFinishValue, weaponFinishName);
  setTextContent(ui.inventoryHeroSkin, shipSkinName);
  setTextContent(ui.inventoryHeroWeapon, getWeaponName(preferredWeapon));
  setTextContent(ui.inventoryHeroFinish, weaponFinishName);
  setTextContent(ui.bossEtaValue, bossEta);
  setTextContent(ui.bossTimerPill, boss ? (state.language === 'ru' ? 'Р‘РћРЎРЎ LIVE' : 'BOSS LIVE') : `${state.language === 'ru' ? 'Р‘РћРЎРЎ' : 'BOSS'} ${bossEta}`);
  setTextContent(ui.playerHealthText, `${state.run.lives} / ${hullMax}`);
  setStyleValue(ui.playerHealthFill, 'width', `${hullPercent}%`);
  setTextContent(ui.topHealthValue, `${state.run.lives} / ${hullMax}`);
  setStyleValue(ui.topHealthFill, 'width', `${hullPercent}%`);
  setTextContent(ui.beerBalanceValue, formattedBeerBalance);
  setTextContent(ui.weaponHudName, getWeaponName(currentWeapon));
  const weaponHudSprite = getSprite(getWeaponSpriteKey(currentWeapon));
  if (weaponHudSprite) {
    setTextContent(ui.weaponIcon, '');
    setStyleValue(ui.weaponIcon, 'background', '#000000');
    setStyleValue(ui.weaponIcon, 'backgroundImage', `url(${weaponHudSprite.src})`);
    setStyleValue(ui.weaponIcon, 'backgroundSize', '84% 84%');
    setStyleValue(ui.weaponIcon, 'backgroundRepeat', 'no-repeat');
    setStyleValue(ui.weaponIcon, 'backgroundPosition', 'center');
  } else {
    setTextContent(ui.weaponIcon, getWeaponGlyph(currentWeapon));
    setStyleValue(ui.weaponIcon, 'backgroundImage', 'none');
    setStyleValue(ui.weaponIcon, 'background', '#000000');
  }
  setStyleValue(ui.weaponIcon, 'borderColor', withAlpha('#f2e6d5', 0.4));
  const weaponButtonSprite = getSprite(getWeaponSpriteKey(state.run.weapon));
  if (weaponButtonSprite) {
    setStyleValue(ui.weaponButton, 'background', '#f28a1a');
    setStyleValue(ui.weaponButton, 'backgroundImage', `url(${weaponButtonSprite.src})`);
    setStyleValue(ui.weaponButton, 'backgroundRepeat', 'no-repeat');
    if (compactPhoneLabels) {
      setStyleValue(ui.weaponButton, 'backgroundSize', '20px 20px');
      setStyleValue(ui.weaponButton, 'backgroundPosition', 'center');
      setStyleValue(ui.weaponButton, 'paddingLeft', '0');
      setStyleValue(ui.weaponButton, 'textAlign', 'center');
      setStyleValue(ui.weaponButton, 'fontSize', '0');
      setStyleValue(ui.weaponButton, 'lineHeight', '0');
    } else {
      setStyleValue(ui.weaponButton, 'backgroundSize', '24px 24px');
      setStyleValue(ui.weaponButton, 'backgroundPosition', '12px center');
      setStyleValue(ui.weaponButton, 'paddingLeft', '46px');
      setStyleValue(ui.weaponButton, 'textAlign', 'left');
      setStyleValue(ui.weaponButton, 'fontSize', '12px');
      setStyleValue(ui.weaponButton, 'lineHeight', '');
    }
  } else {
    setStyleValue(ui.weaponButton, 'backgroundImage', 'none');
    setStyleValue(ui.weaponButton, 'background', '#f28a1a');
    setStyleValue(ui.weaponButton, 'paddingLeft', compactPhoneLabels ? '0' : '16px');
    setStyleValue(ui.weaponButton, 'textAlign', 'center');
    setStyleValue(ui.weaponButton, 'fontSize', compactPhoneLabels ? '11px' : '12px');
    setStyleValue(ui.weaponButton, 'lineHeight', '');
  }
  setTextContent(ui.arenaDistanceChip, `${state.run.meters}`);
  setTextContent(ui.metaRunsValue, String(state.metaStats.runs));
  setTextContent(ui.metaBossesValue, String(state.metaStats.bossesDefeated));
  setTextContent(ui.metaTargetsValue, String(state.metaStats.targetsDestroyed));
  setTextContent(ui.metaComboValue, `x${state.metaStats.bestCombo.toFixed(1)}`);
  setTextContent(ui.metaMetersValue, String(state.metaStats.bestMeters));
  setTextContent(ui.highScoreValue, String(state.highScore));
  setTextContent(ui.walletStatus, state.walletConnected ? (state.language === 'ru' ? 'РџРћР”РљР›Р®Р§Р•Рќ' : 'CONNECTED') : (state.language === 'ru' ? 'РћРўРљР›Р®Р§Р•Рќ' : 'DISCONNECTED'));
  setTextContent(ui.walletTokenBalance, formattedNapiwasBalance);
  setTextContent(ui.walletBeerBalance, formattedBeerBalance);
  setTextContent(ui.walletAddress, fullWalletAddress);
  setTextContent(ui.walletAccessState, premiumAccess ? (state.language === 'ru' ? 'АКТИВЕН' : 'LIVE') : (state.language === 'ru' ? 'ЗАКРЫТ' : 'LOCKED'));
  setTextContent(ui.walletHolderState, premiumAccess ? (state.language === 'ru' ? 'АКТИВЕН' : 'LIVE') : (state.language === 'ru' ? 'ЗАКРЫТ' : 'LOCKED'));
  setTextContent(ui.walletStoryBeer, formattedBeerBalance);
  setTextContent(ui.walletAccessGap, premiumAccess ? '0' : formatUiInteger(Math.max(0, PREMIUM_NAPIWAS_THRESHOLD - state.napiwasBalance)));
  setTextContent(ui.walletHolderProgressValue, premiumProgressLabel);
  setTextContent(ui.walletHolderProgressNote, premiumProgressNote);
  setTextContent(
    ui.walletSyncNote,
    state.walletConnected
      ? (state.language === 'ru' ? 'синхронизирован' : 'synced live')
      : (state.language === 'ru' ? 'ожидает TON' : 'waiting for TON'),
  );
  setTextContent(
    ui.walletAccessCopy,
    premiumAccess
      ? (state.language === 'ru' ? 'Премиальные скины уже открыты для этого кошелька.' : 'Premium skins are active for this wallet.')
      : state.walletConnected
        ? (state.language === 'ru' ? `Нужно еще ${Math.max(0, PREMIUM_NAPIWAS_THRESHOLD - state.napiwasBalance)} NAPIWAS для премиума.` : `${Math.max(0, PREMIUM_NAPIWAS_THRESHOLD - state.napiwasBalance)} more NAPIWAS needed for premium access.`)
        : (state.language === 'ru' ? 'Подключи TON, чтобы проверить холд и открыть премиальные скины.' : 'Connect TON to verify holdings and unlock premium skins.'),
  );
  setTextContent(ui.walletConnectButton, state.walletConnected ? 'TON ON' : 'TON');
  setTextContent(ui.tokenCaText, NAPIWAS_CA);
  setTextContent(ui.tokenAccessValue, premiumAccess ? (state.language === 'ru' ? 'АКТИВЕН' : 'LIVE') : (state.language === 'ru' ? 'ЗАКРЫТ' : 'LOCKED'));
  setTextContent(ui.tokenBeerBankValue, formattedBeerBalance);
  setTextContent(ui.tokenWalletStateValue, state.walletConnected ? (state.language === 'ru' ? 'ОНЛАЙН' : 'ONLINE') : (state.language === 'ru' ? 'ОФФ' : 'OFF'));
  setTextContent(ui.tokenHolderProgressValue, premiumProgressLabel);
  setTextContent(ui.tokenHolderProgressNote, `${premiumProgressNote} NAPIWAS`);
  setTextContent(
    ui.tokenWalletDetail,
    state.walletConnected ? formatWalletAddress(state.walletAddress) : (state.language === 'ru' ? 'Кошелек офлайн' : 'Wallet offline'),
  );
  setTextContent(
    ui.tokenWalletAction,
    state.walletConnected
      ? (compactPhoneLabels
        ? (state.language === 'ru' ? 'СИНХ' : 'SYNC')
        : (state.language === 'ru' ? 'СИНХ TON' : 'SYNC TON'))
      : (compactPhoneLabels
        ? 'TON'
        : (state.language === 'ru' ? 'ПОДКЛЮЧИТЬ TON' : 'CONNECT TON')),
  );
  setProgressRing(ui.walletHolderProgressRing, premiumProgress, STRICT_UI_COLORS.orange);
  setProgressRing(ui.tokenHolderProgressRing, premiumProgress, STRICT_UI_COLORS.orange);
  setStyleValue(ui.menuCard, '--mobile-view-accent', menuAccent);
  setStyleValue(ui.menuCard, '--mobile-view-soft', withAlpha(menuAccentSoft, 0.34));
  setStyleValue(ui.menuCard, '--mobile-view-glow', withAlpha(menuAccentGlow, 0.22));
  setStyleValue(ui.inventorySection, '--inventory-accent', currentSkin.accent);
  setStyleValue(ui.inventorySection, '--inventory-hull', currentSkin.hull);
  setStyleValue(ui.inventorySection, '--inventory-glow', currentSkin.glow);
  setStyleValue(ui.questsSection, '--quest-accent', STRICT_UI_COLORS.orange);
  setStyleValue(ui.questsSection, '--quest-glow', withAlpha(STRICT_UI_COLORS.cream, 0.18));
  setStyleValue(ui.walletSection, '--wallet-accent', STRICT_UI_COLORS.orange);
  setStyleValue(ui.walletSection, '--wallet-glow', withAlpha(STRICT_UI_COLORS.cream, 0.18));
  setStyleValue(ui.tokenInfoSection, '--token-accent', STRICT_UI_COLORS.orange);
  setStyleValue(ui.tokenInfoSection, '--token-glow', withAlpha(STRICT_UI_COLORS.cream, 0.18));
  setTextContent(ui.questsPanelTitle, state.language === 'ru' ? 'Задания' : 'Contracts');
  setTextContent(ui.questsClaimedLabel, state.language === 'ru' ? 'ЗАБРАНО' : 'CLAIMED');
  setTextContent(ui.questsClaimedNote, state.language === 'ru' ? 'Награды в инвентаре' : 'Rewards secured');
  setTextContent(ui.questsReadyLabel, state.language === 'ru' ? 'ГОТОВО СЕЙЧАС' : 'READY NOW');
  setTextContent(ui.questsReadyNote, state.language === 'ru' ? 'Контракты к выдаче' : 'Claimable contracts');
  setTextContent(ui.questsPoolLabel, state.language === 'ru' ? 'ПУЛ НАГРАД' : 'REWARD POOL');
  setTextContent(ui.questsPoolNote, state.language === 'ru' ? 'Оружие, скины и кружки' : 'Weapons, skins, beer');
  setTextContent(ui.walletPanelTitle, state.language === 'ru' ? 'TON кошелек' : 'TON Wallet');
  setTextContent(
    ui.walletBalanceKicker,
    state.walletConnected
      ? (compactPhoneLabels
        ? (state.language === 'ru' ? 'TON ОНЛАЙН' : 'TON ONLINE')
        : (state.language === 'ru' ? 'ПОДКЛЮЧЕННЫЙ TON КОШЕЛЕК' : 'CONNECTED TON WALLET'))
      : (compactPhoneLabels
        ? (state.language === 'ru' ? 'ПОДКЛЮЧИ TON' : 'CONNECT TON')
        : (state.language === 'ru' ? 'ПОДКЛЮЧИТЕ TON КОШЕЛЕК' : 'CONNECT TON WALLET')),
  );
  setTextContent(ui.walletBeerLabel, state.language === 'ru' ? 'Кружки пива' : 'Beer mugs');
  setTextContent(ui.walletAccessLabel, state.language === 'ru' ? 'Доступ' : 'Access');
  setTextContent(ui.walletNeedLabel, state.language === 'ru' ? 'Нужно' : 'Need');
  setTextContent(ui.walletCopyAddress, state.language === 'ru' ? 'КОПИЯ' : 'COPY');
  setTextContent(ui.buyTokenLink, compactPhoneLabels ? (state.language === 'ru' ? 'КУПИТЬ' : 'BUY') : (state.language === 'ru' ? 'КУПИТЬ NAPIWAS' : 'BUY NAPIWAS'));
  setTextContent(ui.walletHolderRouteLabel, state.language === 'ru' ? 'Путь холдера' : 'Holder route');
  setTextContent(ui.walletMugBankLabel, state.language === 'ru' ? 'БАНК КРУЖЕК' : 'MUG BANK');
  setTextContent(ui.walletRealtimeLabel, state.language === 'ru' ? 'РЕАЛЬНОЕ ВРЕМЯ' : 'REAL TIME');
  setTextContent(ui.walletBonusTitle, state.language === 'ru' ? 'Бонусы холдера' : 'Holder bonuses');
  setTextContent(ui.walletBonusMeta, state.language === 'ru' ? 'NAPIWAS множитель' : 'NAPIWAS multiplier');
  setTextContent(ui.walletBonusTierLabel, state.language === 'ru' ? 'Тир' : 'Tier');
  setTextContent(ui.walletBonusTier, localizedText(bonusTier.label));
  setTextContent(ui.walletBossBonusLabel, state.language === 'ru' ? 'За босса' : 'Boss reward');
  setTextContent(ui.walletBossBonus, `x${bonusTier.bossMultiplier.toFixed(2)}`);
  setTextContent(ui.walletScoreBonusLabel, state.language === 'ru' ? 'За очки' : 'Score reward');
  setTextContent(ui.walletScoreBonus, `x${bonusTier.scoreMultiplier.toFixed(2)}`);
  setTextContent(ui.leaderboardTitle, state.language === 'ru' ? 'Лидерборд' : 'Leaderboard');
  setTextContent(ui.leaderboardMeta, state.language === 'ru' ? 'Лучшие пилоты' : 'Top pilots');
  setTextContent(ui.livePanelTitle, state.language === 'ru' ? 'Live ops' : 'Live ops');
  setTextContent(ui.livePanelMeta, state.language === 'ru' ? 'В реальном времени' : 'Realtime');
  setTextContent(ui.liveOnlineLabel, state.language === 'ru' ? 'Онлайн' : 'Online');
  setTextContent(ui.liveRunsLabel, state.language === 'ru' ? 'Старты' : 'Runs');
  setTextContent(ui.liveBossKillsLabel, state.language === 'ru' ? 'Боссы' : 'Boss kills');
  setTextContent(ui.liveWalletLinksLabel, state.language === 'ru' ? 'Кошельки' : 'Wallet links');
  setTextContent(ui.liveOnlineValue, formatUiInteger(state.live.analytics.playersOnline));
  setTextContent(ui.liveRunsValue, formatUiInteger(Number(state.live.analytics.counters?.runStart) || 0));
  setTextContent(ui.liveBossKillsValue, formatUiInteger(Number(state.live.analytics.counters?.bossDefeat) || 0));
  setTextContent(ui.liveWalletLinksValue, formatUiInteger(Number(state.live.analytics.counters?.walletConnect) || 0));
  setTextContent(ui.liveActivityTitle, state.language === 'ru' ? 'Лента действий' : 'Activity feed');
  setTextContent(ui.liveActivityMeta, state.language === 'ru' ? 'Кто зашел и что сделал' : 'Who entered and what they did');
  setTextContent(ui.partnerPanelTitle, state.language === 'ru' ? 'Партнеры' : 'Partners');
  setTextContent(ui.partnerPanelMeta, state.language === 'ru' ? 'Промо-борд' : 'Promo board');
  setTextContent(ui.dailyPanelTitle, state.language === 'ru' ? 'Ежедневный налив' : 'Daily pour');
  setTextContent(ui.dailyStatus, canClaimDaily ? (state.language === 'ru' ? 'ГОТОВО' : 'READY') : (state.language === 'ru' ? 'ЗАБРАНО' : 'CLAIMED'));
  setTextContent(ui.dailyStreakLabel, state.language === 'ru' ? 'Серия' : 'Streak');
  setTextContent(ui.dailyStreakValue, formatUiInteger(state.daily.streak));
  setTextContent(ui.dailyRewardLabel, state.language === 'ru' ? 'Сегодня' : 'Today');
  setTextContent(ui.dailyRewardValue, `+${formatUiInteger(dailyReward)}`);
  setTextContent(ui.dailyLastLabel, state.language === 'ru' ? 'Последний' : 'Last');
  setTextContent(ui.dailyLastClaim, state.daily.lastClaimDate || (state.language === 'ru' ? 'никогда' : 'never'));
  setTextContent(ui.dailyClaimButton, canClaimDaily ? (state.language === 'ru' ? 'ЗАБРАТЬ' : 'CHECK IN') : (state.language === 'ru' ? 'УЖЕ СЕГОДНЯ' : 'ALREADY TODAY'));
  ui.dailyClaimButton?.toggleAttribute('disabled', !canClaimDaily);
  setTextContent(ui.challengePanelTitle, state.language === 'ru' ? 'PvP ставки' : 'PvP bets');
  setTextContent(ui.challengeStatus, activeChallenge ? activeChallenge.status.toUpperCase() : (state.language === 'ru' ? 'ОТКРЫТАЯ ДОСКА' : 'OPEN BOARD'));
  setTextContent(ui.createScoreChallenge, state.language === 'ru' ? 'ДУЭЛЬ ПО ОЧКАМ' : 'SCORE DUEL');
  setTextContent(ui.createBossChallenge, state.language === 'ru' ? 'ДУЭЛЬ ПО БОССАМ' : 'BOSS DUEL');
  setTextContent(ui.musicPanelTitle, state.language === 'ru' ? 'Джукбокс' : 'Jukebox');
  setTextContent(ui.musicPanelMeta, state.language === 'ru' ? 'Бонусные треки' : 'Unlockable tracks');
  setTextContent(ui.musicAdminTitle, state.language === 'ru' ? 'Админка' : 'Admin tools');
  setTextContent(ui.musicAdminMeta, state.language === 'ru' ? 'Добавить трек и партнера' : 'Add track and partner');
  if (ui.dailyDexLink) ui.dailyDexLink.href = ROCKET_LINKS.dex;
  if (ui.dailyGeckoLink) ui.dailyGeckoLink.href = ROCKET_LINKS.gecko;
  if (ui.dailyBuyLink) ui.dailyBuyLink.href = ROCKET_LINKS.buy;
  setTextContent(ui.pauseScore, String(state.run.score));
  setTextContent(ui.pauseLevel, String(state.run.meters));
  setTextContent(ui.pauseLives, String(state.run.lives));
  setTextContent(ui.pauseBoss, boss ? boss.name : t('safeLabel'));
  setTextContent(ui.gameoverScore, String(state.run.score));
  setTextContent(ui.gameoverMeters, String(state.run.meters));
  setTextContent(ui.gameoverBestMeters, String(state.metaStats.bestMeters));
  setTextContent(ui.gameoverHighScore, String(Math.max(state.highScore, state.run.score)));
  setTextContent(ui.gameoverRank, runRank.label);
  setTextContent(ui.gameoverRankNote, runRank.note);
  const stickX = Math.round((state.sliderPercent - 50) * 2);
  const stickY = Math.round((50 - state.sliderPercentY) * 2);
  setTextContent(ui.sliderReadout, `X${stickX} Y${stickY}`);
  setStyleValue(ui.sliderFill, 'width', '');
  setStyleValue(ui.sliderKnob, 'left', `${state.sliderPercent}%`);
  setStyleValue(ui.sliderKnob, 'top', `${state.sliderPercentY}%`);
  setTextContent(
    ui.headerSubtitle,
    state.mode === 'menu'
      ? state.language === 'ru' ? 'РЎРІРµС‚Р»С‹Р№ shell, С‚РµРјРЅР°СЏ Р°СЂРµРЅР°, Р±РѕР№ РіРѕС‚РѕРІ.' : 'Warm shell, dark arena, boss-ready run'
      : state.run.phase === 'boss'
        ? state.language === 'ru' ? 'Р‘РѕСЃСЃ Р°РєС‚РёРІРµРЅ. Р§РёС‚Р°Р№ РїР°С‚С‚РµСЂРЅ Рё Р¶РёРІРё.' : 'Boss active. Read the pattern, stay alive.'
        : state.language === 'ru' ? 'РђРІС‚Рѕ-РѕРіРѕРЅСЊ Р°РєС‚РёРІРµРЅ. Р’РµРґРё Р»РёРЅРёСЋ Рё СЃРѕР±РёСЂР°Р№ РґСЂРѕРї.' : 'Auto-fire live. Guide the lane, grab the drops.',
  );

  setTextContent(ui.phaseChip, state.run.phase === 'boss' ? (state.language === 'ru' ? 'Р‘РћРЎРЎ РђРљРўРР’Р•Рќ' : 'BOSS ACTIVE') : state.mode === 'playing' ? (state.language === 'ru' ? 'Р РђРќ РР”Р•Рў' : 'RUN LIVE') : (state.language === 'ru' ? 'Р“РћРўРћР’ Рљ Р‘РћР®' : 'BATTLE READY'));

  if (boss) {
    setTextContent(ui.bossName, boss.name);
    setTextContent(ui.bossMode, boss.shieldMs > 0 ? (state.language === 'ru' ? 'Р©РРў' : 'SHIELD') : t('bossActiveLabel'));
    setTextContent(ui.bossPodState, t('bossActiveLabel'));
    setTextContent(ui.bossPodHp, `${boss.hp}/${boss.maxHp} HP`);
    setTextContent(ui.bossPodTimer, bossEta);
    setStyleValue(ui.bossProgressFill, 'width', `${bossProgress}%`);
  } else {
    setTextContent(ui.bossName, `${state.language === 'ru' ? 'РЎР»РµРґСѓСЋС‰РёР№ Р±РѕСЃСЃ' : 'Next Boss'}: ${nextBoss.name}`);
    setTextContent(ui.bossMode, state.run.bossCooldownMs > 0 ? (state.language === 'ru' ? 'РџРђРЈР—Рђ' : 'COOLDOWN') : (state.language === 'ru' ? 'Р“РћРўРћР’' : 'READY'));
    setTextContent(ui.bossPodState, t('safeLabel'));
    setTextContent(ui.bossPodHp, state.run.bossCooldownMs > 0 ? formatSeconds(state.run.bossCooldownMs) : `${state.language === 'ru' ? 'РЎР»РµРґ.' : 'Next'} @ ${state.run.nextBossScore}`);
    setTextContent(ui.bossPodTimer, `${state.language === 'ru' ? 'ETA' : 'ETA'} ${bossEta}`);
    setStyleValue(ui.bossProgressFill, 'width', '0%');
  }

  ensureQuestList();
  renderActiveBuffs(activeBuffs);
  renderCombatFeed();
  populateRewardCodex();
  populateMenuArsenal();
  renderSkinInventory();
  renderShopCatalog();
  populateQuestBoard();
  renderLeaderboard();
  renderLiveActivity();
  renderChallengeBoard();
  renderPartnerBoard();
  renderMusicTracks();
  populateBossRoster(boss ? boss.name : nextBoss.name);
  syncWeaponDock();

  setTextContent(
    ui.tempWeaponStatus,
    state.run.tempWeapon ? `${getWeaponName(state.run.tempWeapon)} ${formatSeconds(state.run.tempWeaponMs)}` : state.run.lastPickupLabel.toUpperCase(),
  );
  setTextContent(ui.runPhaseDetail, phaseDetail);
  setTextContent(ui.unlockedCount, `${unlockedCount} / ${WEAPON_ORDER.length}`);
  setTextContent(ui.nextBossThreshold, nextBossLabel);
  setTextContent(ui.comboValue, `x${state.run.comboMultiplier.toFixed(1)}`);
  setTextContent(ui.dangerValue, `${dangerLevel}%`);
  setTextContent(ui.threatCountValue, threatSummary.detail);
  setTextContent(ui.dropScanValue, `${nearestPickup.label} ${nearestPickup.detail}`.trim());
  setStyleValue(ui.comboValue, 'color', state.run.comboMultiplier > 1 ? STRICT_UI_COLORS.orange : STRICT_UI_COLORS.cream);
  setStyleValue(ui.dangerValue, 'color', dangerLevel > 70 ? STRICT_UI_COLORS.white : dangerLevel > 40 ? STRICT_UI_COLORS.orange : STRICT_UI_COLORS.cream);
  setStyleValue(ui.threatCountValue, 'color', threatSummary.total > 10 ? STRICT_UI_COLORS.white : threatSummary.total > 5 ? STRICT_UI_COLORS.orange : STRICT_UI_COLORS.cream);
  setStyleValue(ui.dropScanValue, 'color', nearestPickup.label === 'NONE' ? withAlpha(STRICT_UI_COLORS.cream, 0.64) : STRICT_UI_COLORS.white);
  setStyleValue(ui.gameoverRank, 'color', constrainPaletteColor(runRank.color));
  setStyleValue(ui.gameoverRankCard, 'borderColor', withAlpha(runRank.color, 0.42));
  setStyleValue(ui.gameoverRankCard, 'background', '#000000');
  setTextContent(
    ui.controlMode,
    pointerIsCoarse
      ? (state.language === 'ru' ? '\u0422\u0410\u0427 | \u0414\u0416\u041e\u0419\u0421\u0422\u0418\u041a + \u0412\u041f\u0415\u0420\u0415\u0414 | Q \u0441\u043c\u0435\u043d\u0430 | F \u044d\u043a\u0440\u0430\u043d' : 'TOUCH | JOYSTICK + FORWARD | Q swaps | F fullscreen')
      : (state.language === 'ru' ? 'A/D + W/S \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0435 | Q \u0441\u043c\u0435\u043d\u0430 | F \u044d\u043a\u0440\u0430\u043d' : 'A/D + W/S move | Q swaps | F fullscreen'),
  );
  setTextContent(
    ui.contextNote,
    state.run.comboCount > 1 && state.run.comboTimerMs > 0
      ? state.language === 'ru' ? `РљРѕРјР±Рѕ Р°РєС‚РёРІРЅРѕ: x${state.run.comboMultiplier.toFixed(1)}. Р”РµСЂР¶Рё С‚РµРјРї.` : `Combo live: x${state.run.comboMultiplier.toFixed(1)}. Keep the lane hot.`
      : boss
        ? boss.shieldMs > 0
          ? state.language === 'ru' ? 'Р©РёС‚ Р±РѕСЃСЃР° РїРѕРґРЅСЏС‚. Р–РґРё РѕРєРЅРѕ Рё РґРµСЂР¶Рё Р»РёРЅРёСЋ.' : 'Boss shield is up. Bait the pattern and hold lane.'
          : state.language === 'ru' ? `${boss.name} РІ Р±РѕСЋ. Р§РёС‚Р°Р№ РїР°С‚С‚РµСЂРЅ Рё РґРµСЂР¶РёСЃСЊ РІ РїСЂРѕС…РѕРґР°С….` : `${boss.name} is live. Read the pattern and stay under gaps.`
        : `${statusNote}. ${state.language === 'ru' ? 'РђРІС‚Рѕ-РѕРіРѕРЅСЊ РЅРµ РѕСЃС‚Р°РЅР°РІР»РёРІР°РµС‚СЃСЏ.' : 'Auto-fire never stops.'}`,
  );
  setTextContent(ui.menuBossPreview, menuBossSource.name);
  setTextContent(ui.menuBossPattern, menuBossPattern);
  setTextContent(ui.briefWeaponName, weaponBrief.name);
  setTextContent(ui.briefWeaponDetail, weaponBrief.detail);
  setTextContent(ui.briefWeaponNote, weaponBrief.note);
  setTextContent(ui.briefBossName, menuBossSource.name);
  setTextContent(ui.briefBossDetail, bossBriefDetail);
  setTextContent(ui.briefBossNote, bossBriefNote);
  setTextContent(ui.bossPodPattern, boss ? boss.pattern.toUpperCase() : state.run.bossCooldownMs > 0 ? (state.language === 'ru' ? 'РїР°СѓР·Р°' : 'cooldown') : nextBoss.pattern.toUpperCase());
  setTextContent(ui.arenaChipSkill, activeBuffs[0] ? `${activeBuffs[0].label} ${activeBuffs[0].detail}` : (state.language === 'ru' ? 'РќР•Рў Р‘РђР¤Р¤Рђ' : 'NO BUFF'));
  setTextContent(ui.arenaChipWeapon, state.run.tempWeapon ? `${getWeaponName(currentWeapon)} TMP` : getWeaponName(currentWeapon));
  setTextContent(ui.navPlay?.querySelector('span'), t('navPlay'));
  setTextContent(ui.navInventory?.querySelector('span'), t('navInventory'));
  setTextContent(ui.navQuest?.querySelector('span'), t('navQuest'));
  setTextContent(ui.navWallet?.querySelector('span'), t('navWallet'));
  setTextContent(ui.navShop?.querySelector('span'), t('navShop'));
  setTextContent(ui.navCoop?.querySelector('span'), t('navCoop'));
  setTextContent(
    ui.shopBalanceMeta,
    state.language === 'ru'
      ? `Кружки пива: ${formattedBeerBalance}`
      : `Beer mugs: ${formattedBeerBalance}`,
  );
  setTextContent(ui.soundButton, state.audioEnabled ? 'SFX' : (state.language === 'ru' ? 'РўРРҐРћ' : 'MUTE'));
  setTextContent(ui.walletConnectButton, state.walletConnected ? 'TON ON' : 'TON');
  setTextContent(ui.languageButton, state.language === 'ru' ? 'EN' : 'RU');
  setTextContent(ui.fullscreenButton, fullscreenActive ? (state.language === 'ru' ? 'Р’Р«РҐ' : 'EXIT') : (state.language === 'ru' ? 'Р­РљР ' : 'FULL'));
  setTextContent(ui.menuLanguage, state.language === 'ru' ? 'EN / RU' : 'RU / EN');
  setTextContent(ui.menuDifficulty, state.language === 'ru' ? 'РЎР›РћР–РќРћРЎРўР¬' : 'DIFFICULTY');
  setTextContent(ui.menuGodMode, state.language === 'ru' ? 'GOD MODE' : 'GOD MODE');
  setTextContent(
    ui.menuLoadout,
    compactPhoneLabels
      ? `${state.language === 'ru' ? 'ОРУЖИЕ' : 'WEAPON'} - ${getWeaponName(preferredWeapon)}`
      : `${t('menuLoadoutLabel')} - ${getWeaponName(preferredWeapon)}`,
  );
  setTextContent(ui.menuSkin, compactPhoneLabels ? (state.language === 'ru' ? 'СКИН' : 'SKIN') : (state.language === 'ru' ? 'РЎРљРРќ РљРћР РђР‘Р›РЇ' : 'SHIP SKIN'));
  setTextContent(ui.menuFinish, compactPhoneLabels ? (state.language === 'ru' ? 'ФИНИШ' : 'FINISH') : (state.language === 'ru' ? 'Р¤РРќРРЁ РћР РЈР–РРЇ' : 'WEAPON FINISH'));
  setTextContent(ui.menuFullscreen, compactPhoneLabels ? (state.language === 'ru' ? 'ЭКРАН' : 'SCREEN') : (fullscreenActive ? (state.language === 'ru' ? 'Р’Р«РҐРћР” РР— Р­РљР РђРќРђ' : 'EXIT SCREEN') : (state.language === 'ru' ? 'Р­РљР РђРќ' : 'SCREEN')));
  setTextContent(ui.menuSound, state.audioEnabled ? (state.language === 'ru' ? 'Р—Р’РЈРљ: Р’Р«РљР›' : 'SOUND: OFF') : (state.language === 'ru' ? 'Р—Р’РЈРљ: Р’РљР›' : 'SOUND: ON'));
  setTextContent(
    ui.walletConnectMenu,
    state.walletConnected
      ? (compactPhoneLabels
        ? (state.language === 'ru' ? 'СИНХ' : 'SYNC')
        : (state.language === 'ru' ? 'СИНХ TON' : 'SYNC TON'))
      : (compactPhoneLabels
        ? 'TON'
        : (state.language === 'ru' ? 'ПОДКЛЮЧИТЬ TON' : 'CONNECT TON')),
  );
  setTextContent(ui.walletDisconnectMenu, compactPhoneLabels ? (state.language === 'ru' ? 'ОТКЛ' : 'OFF') : (state.language === 'ru' ? 'ОТКЛЮЧИТЬ' : 'DISCONNECT'));
  setTextContent(ui.walletRefresh, compactPhoneLabels ? (state.language === 'ru' ? 'БАЛАНС' : 'REFRESH') : (state.language === 'ru' ? 'ОБНОВИТЬ БАЛАНС' : 'SYNC BALANCE'));
  setTextContent(
    ui.menuWalletConnect,
    state.walletConnected
      ? (compactPhoneLabels
        ? (state.language === 'ru' ? 'TON СИНХ' : 'TON SYNC')
        : (state.language === 'ru' ? 'СИНХ TON КОШЕЛЕК' : 'SYNC TON WALLET'))
      : (compactPhoneLabels
        ? 'TON'
        : (state.language === 'ru' ? 'ПОДКЛЮЧИТЬ TON КОШЕЛЕК' : 'CONNECT TON WALLET')),
  );
  setTextContent(ui.menuStart, state.menuReturnMode === 'playing' ? (state.language === 'ru' ? 'Р’Р•Р РќРЈРўР¬РЎРЇ Р’ Р‘РћР™' : 'RESUME RUN') : t('startRunButton'));
  setTextContent(
    ui.playButton,
    state.mode === 'playing'
      ? (state.language === 'ru' ? 'ПАУЗА' : 'PAUSE')
      : state.mode === 'paused'
        ? (state.language === 'ru' ? 'В БОЙ' : 'RESUME')
        : t('playCta'),
  );
  setStyleValue(ui.menuDifficultyNote, 'color', constrainPaletteColor(difficultyMeta.accent));
  ui.soundButton.classList.toggle('muted', !state.audioEnabled);
  ui.walletConnectButton?.classList.toggle('active', state.walletConnected);
  ui.tokenWalletAction?.classList.toggle('active', state.walletConnected);
  ui.fullscreenButton.classList.toggle('active', fullscreenActive);
  ui.menuClose?.classList.toggle('hidden', false);
  ui.menuCard?.setAttribute('data-view', state.menuView);
  ui.menuCard?.classList.toggle('focus-inventory', state.menuView === 'inventory');
  ui.menuCard?.classList.toggle('focus-quests', state.menuView === 'quests');
  ui.menuCard?.classList.toggle('focus-wallet', state.menuView === 'wallet');
  ui.menuCard?.classList.toggle('focus-shop', state.menuView === 'shop');
  ui.menuCard?.classList.remove('focus-coop');
  stopCoopPolling();

  document.body.classList.toggle('mobile-clean-play', Boolean(mobileViewport && state.mode === 'playing'));
  document.body.classList.toggle('mobile-menu-open', Boolean(mobileViewport && state.mode === 'menu'));
  document.body.classList.toggle('mobile-low-lag', Boolean(mobileViewport));
  document.body.classList.toggle('mobile-premium-v2', Boolean(mobileViewport));
  document.body.classList.toggle('mobile-fullscreen-tabs', Boolean(mobileViewport && state.mode === 'menu'));
  let dynamicMenuBottomInset = 190;
  if (mobileViewport && state.mode === 'menu' && ui.menuOverlay) {
    const overlayRect = ui.menuOverlay.getBoundingClientRect();
    const navRect = ui.navPlay?.closest?.('.bottom-nav')?.getBoundingClientRect?.();
    if (overlayRect && navRect) {
      dynamicMenuBottomInset = Math.max(104, Math.ceil((overlayRect.bottom - navRect.top) + 8));
    }
  }
  setStyleValue(document.body, '--mobile-fullscreen-overlay-bottom', `${dynamicMenuBottomInset}px`);
  setTokenInfoPane(state.tokenInfoPane, { skipSync: true });
  ensureLivePolling();

  setOverlayVisibility(ui.menuOverlay, state.mode === 'menu');
  setOverlayVisibility(ui.pauseOverlay, state.mode === 'paused');
  setOverlayVisibility(ui.questOverlay, state.mode === 'quest');
  setOverlayVisibility(ui.gameoverOverlay, state.mode === 'gameover');
  audio.updateMusicProfile();

  ui.walletCopyAddress?.toggleAttribute('disabled', !state.walletConnected);

  if (state.mode === 'menu') setActiveNav(['inventory', 'quests', 'wallet', 'shop'].includes(state.menuView) ? state.menuView : 'inventory');
  else if (state.mode === 'quest') setActiveNav('play');
  else setActiveNav('play');
}

function renderStateToText() {
  const threatSummary = getThreatSummary();
  const nearestPickup = getNearestPickupInfo();
  const runRank = getRunRank();
  const bossEta = formatBossEta();
  const boss = state.run.boss
    ? {
        name: state.run.boss.name,
        hp: state.run.boss.hp,
        maxHp: state.run.boss.maxHp,
        x: Math.round(state.run.boss.x),
        y: Math.round(state.run.boss.y),
        shield: state.run.boss.shieldMs > 0,
      }
    : null;

  return JSON.stringify({
    coordinateSystem: { origin: 'top-left', x: 'right', y: 'down' },
    mode: state.mode,
    phase: state.run.phase,
    language: state.language,
    score: state.run.score,
    meters: state.run.meters,
    bestMeters: state.metaStats.bestMeters,
    level: state.run.level,
    volleyLevel: state.run.volleyLevel,
    lives: state.run.lives,
    weapon: getCurrentWeapon(),
    difficulty: state.difficulty,
    godMode: state.godMode,
    slider: { x: Math.round(state.sliderPercent), y: Math.round(state.sliderPercentY) },
    player: {
      x: Math.round(state.run.player.x),
      y: Math.round(state.run.player.y),
      width: state.run.player.width,
      height: state.run.player.height,
    },
    boss,
    nextBossScore: state.run.nextBossScore,
    entities: state.run.entities.slice(0, 12).map((entity) => ({
      kind: entity.kind,
      category: entity.category,
      x: Math.round(entity.x),
      y: Math.round(entity.y),
    })),
    planets: 0,
    meteorCount: state.run.entities.filter((entity) => entity.category === 'hazard').length,
    bullets: { player: state.run.bullets.length, enemy: state.run.enemyBullets.length },
    unlockedWeapons: WEAPON_ORDER.filter((weaponId) => state.run.unlockedWeapons.has(weaponId)),
    activeBuffs: getActiveBuffEntries().map((entry) => `${entry.label}:${entry.detail}`),
    skills: { ...state.run.skillTimers },
    audioEnabled: state.audioEnabled,
    bossEta,
    shipSkin: state.shipSkin,
    weaponFinish: state.weaponFinish,
    preferredWeapon: state.preferredWeapon,
    menuView: state.menuView,
    beerBalance: state.beerBalance,
    walletConnected: state.walletConnected,
    walletAddress: state.walletAddress,
    napiwasBalance: state.napiwasBalance,
    coopLobbies: state.coop.lobbies.length,
    hostedLobby: state.coop.hostLobby?.id || null,
    joinedLobby: state.coop.joinedLobby?.id || null,
    metaStats: state.metaStats,
    eventFeed: state.run.eventFeed.map((entry) => `${entry.title}:${entry.detail}`),
    pickupsCollected: state.run.pickupsCollected,
    targetsDestroyed: state.run.targetsDestroyed,
    bossesDefeated: state.run.bossesDefeated,
    comboCount: state.run.comboCount,
    comboMultiplier: state.run.comboMultiplier,
    comboTimerMs: state.run.comboTimerMs,
    dangerLevel: computeDangerLevel(),
    threatSummary,
    nearestPickup,
    runRank,
    gameOverReason: state.run.gameOverReason,
  });
}

function advanceTime(ms) {
  const steps = Math.max(1, Math.round(ms / FRAME_MS));
  for (let step = 0; step < steps; step += 1) {
    updateWorld(FRAME_MS);
  }
  render();
  syncUI();
}

function tick(timestamp) {
  const delta = Math.min(48, timestamp - state.lastTimestamp);
  state.lastTimestamp = timestamp;
  state.accumulatorMs += delta;
  while (state.accumulatorMs >= FRAME_MS) {
    updateWorld(FRAME_MS);
    state.accumulatorMs -= FRAME_MS;
  }
  render();
  syncUI();
  window.requestAnimationFrame(tick);
}

function debugForceBoss() {
  if (state.mode === 'menu' || state.mode === 'gameover') {
    startRun();
  }
  state.mode = 'playing';
  state.run.phase = 'normal';
  state.run.score = Math.max(state.run.score, state.run.nextBossScore);
  state.run.bossCooldownMs = 0;
  state.run.entities = [];
  state.run.enemyBullets = [];
  state.run.player.invulnerableMs = 0;
  state.run.lives = Math.max(state.run.lives, 3);
  spawnBoss();
  render();
  syncUI();
  return JSON.parse(renderStateToText());
}

function updateSliderFromPointer(clientX, clientY) {
  const rect = ui.sliderTrack.getBoundingClientRect();
  const radius = Math.min(rect.width, rect.height) / 2;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rawX = clientX - centerX;
  const rawY = clientY - centerY;
  const distance = Math.hypot(rawX, rawY);
  const maxDistance = Math.max(1, radius - 18);
  const scale = distance > maxDistance ? maxDistance / distance : 1;
  const clampedX = rawX * scale;
  const clampedY = rawY * scale;
  const percentX = ((clampedX + maxDistance) / (maxDistance * 2)) * 100;
  const percentY = ((clampedY + maxDistance) / (maxDistance * 2)) * 100;
  setSliderPercent(percentX, percentY);
}

ui.playButton.addEventListener('click', () => {
  if (state.mode === 'playing' || state.mode === 'paused') {
    togglePause();
    return;
  }
  startRun();
});
ui.languageButton.addEventListener('click', toggleLanguage);
ui.soundButton.addEventListener('click', toggleAudio);
ui.fullscreenButton.addEventListener('click', toggleFullscreen);
ui.menuStart.addEventListener('click', () => {
  if (state.menuReturnMode === 'playing' && hasActiveRunToResume()) {
    closeMenuOverlay();
    return;
  }
  startRun();
});
ui.menuClose?.addEventListener('click', requestMenuCloseOverlay);
ui.menuClose?.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  event.preventDefault();
  requestMenuCloseOverlay();
});
ui.menuClose?.addEventListener('pointerup', (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  event.preventDefault();
  requestMenuCloseOverlay();
});
ui.menuLanguage.addEventListener('click', toggleLanguage);
ui.menuSound.addEventListener('click', toggleAudio);
ui.menuFullscreen.addEventListener('click', toggleFullscreen);
ui.retryButton.addEventListener('click', startRun);
ui.pauseButton.addEventListener('click', togglePause);
ui.resumeButton.addEventListener('click', togglePause);
ui.pauseHome.addEventListener('click', openMenu);
ui.pauseClose?.addEventListener('click', togglePause);
ui.gameoverHome.addEventListener('click', closeGameoverOverlay);
ui.gameoverClose?.addEventListener('click', closeGameoverOverlay);
ui.menuDifficulty.addEventListener('click', () => {
  cycleDifficulty();
  syncUI();
});
ui.difficultyButton.addEventListener('click', () => {
  cycleDifficulty();
  syncUI();
});
ui.menuGodMode.addEventListener('click', () => {
  toggleGodMode();
  syncUI();
});
ui.menuLoadout.addEventListener('click', cyclePreferredWeapon);
ui.menuSkin.addEventListener('click', cycleShipSkin);
ui.menuFinish.addEventListener('click', cycleWeaponFinish);
ui.boostButton.addEventListener('click', activateBoost);
ui.questButton.addEventListener('click', openQuest);
ui.questClose.addEventListener('click', closeQuestOverlay);
ui.questCloseTop?.addEventListener('click', closeQuestOverlay);
ui.weaponButton.addEventListener('click', () => {
  cycleWeapon();
  syncUI();
});
ui.navPlay.addEventListener('click', () => {
  if (state.mode === 'menu') {
    if (state.menuReturnMode === 'playing' && hasActiveRunToResume()) closeMenuOverlay();
    else startRun();
  }
  else if (state.mode === 'gameover') startRun();
  else if (state.mode === 'paused') togglePause();
  else if (state.mode === 'quest') {
    closeQuestOverlay();
  }
});
ui.navInventory?.addEventListener('click', () => openMenu('inventory'));
ui.navQuest?.addEventListener('click', () => openMenu('quests'));
ui.navWallet?.addEventListener('click', () => openMenu('wallet'));
ui.navShop?.addEventListener('click', () => openMenu('shop'));
ui.navCoop?.addEventListener('click', () => openMenu('coop'));
ui.dailyClaimButton?.addEventListener('click', claimDailyCheckin);
ui.createScoreChallenge?.addEventListener('click', () => createPvpChallenge('score'));
ui.createBossChallenge?.addEventListener('click', () => createPvpChallenge('bosses'));
ui.adminAddTrack?.addEventListener('click', addAdminTrack);
ui.adminAddPartner?.addEventListener('click', addAdminPartner);
ui.coopFindTab?.addEventListener('click', () => setCoopTab('find'));
ui.coopHostTab?.addEventListener('click', () => setCoopTab('host'));
ui.hostCreateButton?.addEventListener('click', createHostLobby);
ui.walletConnectButton?.addEventListener('click', () => {
  if (state.walletConnected) void disconnectTonWallet();
  else void connectTonWallet();
});
ui.walletConnectMenu?.addEventListener('click', () => {
  if (state.walletConnected) void refreshTonBalance();
  else void connectTonWallet();
});
ui.walletDisconnectMenu?.addEventListener('click', () => {
  void disconnectTonWallet();
});
ui.walletRefresh?.addEventListener('click', () => {
  void refreshTonBalance();
});
ui.walletCopyAddress?.addEventListener('click', () => {
  void copyWalletAddress();
});
ui.menuWalletConnect?.addEventListener('click', () => {
  if (state.walletConnected) void refreshTonBalance();
  else void connectTonWallet();
});
ui.tokenWalletAction?.addEventListener('click', () => {
  if (state.walletConnected) void refreshTonBalance();
  else void connectTonWallet();
});
ui.tokenStoryTabs?.addEventListener('click', (event) => {
  const button = event.target.closest?.('[data-token-panel]');
  if (!button) return;
  const nextPane = button.getAttribute('data-token-panel');
  setTokenInfoPane(nextPane || 'overview');
});
ui.tokenCopyCa?.addEventListener('click', () => {
  void copyTokenContract();
});

ui.pauseOverlay?.addEventListener('click', (event) => {
  if (!event.target.closest('.overlay-card')) togglePause();
});

ui.questOverlay?.addEventListener('click', (event) => {
  if (!event.target.closest('.overlay-card')) closeQuestOverlay();
});

ui.gameoverOverlay?.addEventListener('click', (event) => {
  if (!event.target.closest('.overlay-card')) closeGameoverOverlay();
});

ui.phoneShell?.addEventListener('pointerdown', (event) => {
  if (!state.mode || state.mode === 'playing' || state.mode === 'menu') return;
  if (event.target.closest('.overlay-card')) return;
  if (state.mode === 'paused') {
    event.preventDefault();
    event.stopPropagation();
    togglePause();
    return;
  }
  if (state.mode === 'quest') {
    event.preventDefault();
    event.stopPropagation();
    closeQuestOverlay();
    return;
  }
  if (state.mode === 'gameover') {
    event.preventDefault();
    event.stopPropagation();
    closeGameoverOverlay();
  }
}, true);

function bindHoldButton(button, direction) {
  if (!button) return;
  const start = (event) => {
    event.preventDefault();
    if (direction === 'left') input.left = true;
    if (direction === 'right') input.right = true;
    if (direction === 'up') input.up = true;
  };
  const stop = () => {
    if (direction === 'left') input.left = false;
    if (direction === 'right') input.right = false;
    if (direction === 'up') input.up = false;
  };

  button.addEventListener('pointerdown', start);
  button.addEventListener('pointerup', stop);
  button.addEventListener('pointerleave', stop);
  button.addEventListener('pointercancel', stop);
}

bindHoldButton(ui.moveLeft, 'left');
bindHoldButton(ui.moveRight, 'right');
bindHoldButton(ui.moveUp, 'up');

ui.sliderTrack.addEventListener('pointerdown', (event) => {
  input.sliderActive = true;
  ui.sliderTrack.setPointerCapture(event.pointerId);
  updateSliderFromPointer(event.clientX, event.clientY);
});

ui.sliderTrack.addEventListener('pointermove', (event) => {
  if (!input.sliderActive) return;
  updateSliderFromPointer(event.clientX, event.clientY);
});

ui.sliderTrack.addEventListener('pointerup', (event) => {
  input.sliderActive = false;
  input.stickTargetX = 0;
  input.stickTargetY = 0;
  if (state.run?.player) {
    state.run.player.targetX = state.run.player.x;
    state.run.player.targetY = state.run.player.y;
    syncSliderFromPlayer();
    syncUI();
  }
  ui.sliderTrack.releasePointerCapture(event.pointerId);
});

ui.sliderTrack.addEventListener('pointercancel', (event) => {
  input.sliderActive = false;
  input.stickTargetX = 0;
  input.stickTargetY = 0;
  if (state.run?.player) {
    state.run.player.targetX = state.run.player.x;
    state.run.player.targetY = state.run.player.y;
    syncSliderFromPlayer();
    syncUI();
  }
  ui.sliderTrack.releasePointerCapture(event.pointerId);
});

if (ui.moveLeft) setTextContent(ui.moveLeft, '\u25c0');
if (ui.moveUp) setTextContent(ui.moveUp, '\u25b2');
if (ui.moveRight) setTextContent(ui.moveRight, '\u25b6');

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') input.left = true;
  if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') input.right = true;
  if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') input.up = true;
  if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') input.down = true;
  if (event.key === 'q' || event.key === 'Q') cycleWeapon();
  if (event.key === 'l' || event.key === 'L') toggleLanguage();
  if (event.key === 'f' || event.key === 'F') {
    event.preventDefault();
    toggleFullscreen();
  }
  if (event.key === 'Escape') {
    if (state.mode === 'playing' || state.mode === 'paused') togglePause();
    else if (state.mode === 'quest') closeQuestOverlay();
    else if (state.mode === 'menu') closeMenuOverlay();
    else if (state.mode === 'gameover') closeGameoverOverlay();
  }
  if ((event.key === 'Enter' || event.key === ' ') && state.mode === 'menu') startRun();
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') input.left = false;
  if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') input.right = false;
  if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') input.up = false;
  if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') input.down = false;
});

window.render_game_to_text = renderStateToText;
window.advanceTime = advanceTime;
window.debug_force_boss = debugForceBoss;

window.addEventListener('resize', resizeArenaFrame);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', resizeArenaFrame);
}
document.addEventListener('fullscreenchange', () => {
  resizeArenaFrame();
  syncUI();
});
window.addEventListener('pointerdown', () => audio.markInteraction(), { once: true });
window.addEventListener('keydown', () => audio.markInteraction(), { once: true });
enablePremiumMotionFx();
initSpriteAssets();
applyLanguage();
if (typeof ResizeObserver !== 'undefined') {
  const arenaResizeObserver = new ResizeObserver(() => {
    resizeArenaFrame();
  });
  if (ui.arenaStage) arenaResizeObserver.observe(ui.arenaStage);
  if (ui.phoneShell) arenaResizeObserver.observe(ui.phoneShell);
}
window.addEventListener('beforeunload', closeHostedLobbyOnUnload);
resizeArenaFrame();
void postLiveEvent('pageView', 'app open');
void refreshLiveData({ silent: true });
syncUI();
render();
window.requestAnimationFrame(() => {
  document.body.classList.add('ui-motion-ready');
});
window.requestAnimationFrame(tick);

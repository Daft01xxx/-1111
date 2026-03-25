const LOBBY_TTL_MS = 15000;
const MEMBER_TTL_MS = 15000;
const ACTIVE_PLAYER_TTL_MS = 120000;
const CHALLENGE_TTL_MS = 1000 * 60 * 90;
const RESOLVED_CHALLENGE_TTL_MS = 1000 * 60 * 60 * 6;
const MAX_EVENT_HISTORY = 24;
const MAX_LEADERBOARD_ENTRIES = 40;

const lobbyStore = global.__NAPIWAS_COOP_STORE__ || new Map();
global.__NAPIWAS_COOP_STORE__ = lobbyStore;
const leaderboardStore = global.__NAPIWAS_LIVE_LEADERBOARD__ || new Map();
global.__NAPIWAS_LIVE_LEADERBOARD__ = leaderboardStore;
const challengeStore = global.__NAPIWAS_CHALLENGE_STORE__ || new Map();
global.__NAPIWAS_CHALLENGE_STORE__ = challengeStore;
const analyticsStore = global.__NAPIWAS_ANALYTICS__ || {
  counters: {
    pageView: 0,
    runStart: 0,
    bossDefeat: 0,
    walletConnect: 0,
    questClaim: 0,
    dailyCheckin: 0,
    challengeCreate: 0,
    challengeAccept: 0,
    leaderboardSubmit: 0,
  },
  players: new Map(),
  events: [],
};
global.__NAPIWAS_ANALYTICS__ = analyticsStore;

const PARTNER_CARDS = [
  {
    id: 'momo',
    name: 'MOMO',
    href: 'https://t.me/devpool_trading_bot?start=token_EQDOCUp_pDBvOmGRyEDE2bnCl2cjGmAWjPsTWRt_veSsfGSn',
    note: 'Beer-style launch partner',
  },
  {
    id: 'arni',
    name: 'ARNI',
    href: 'https://t.me/devpool_trading_bot?start=token_EQDOCUp_pDBvOmGRyEDE2bnCl2cjGmAWjPsTWRt_veSsfGSn',
    note: 'Promotion slot ready',
  },
];

function createCoopError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeAlias(alias, fallback = 'Pilot') {
  const trimmed = typeof alias === 'string' ? alias.trim() : '';
  if (!trimmed) return fallback;
  return trimmed.slice(0, 24);
}

function summarizeWallet(walletAddress, napiwasBalance) {
  const address = typeof walletAddress === 'string' ? walletAddress.trim() : '';
  const balance = Math.max(0, Number(napiwasBalance) || 0);
  if (!address) {
    return balance > 0 ? `NAPIWAS ${balance}` : 'Offline';
  }
  if (address.length < 14) {
    return balance > 0 ? `${address} • ${balance}` : address;
  }
  const short = `${address.slice(0, 4)}…${address.slice(-4)}`;
  return balance > 0 ? `${short} • ${balance}` : short;
}

function formatWalletTag(walletAddress, napiwasBalance) {
  const address = typeof walletAddress === 'string' ? walletAddress.trim() : '';
  const balance = Math.max(0, Number(napiwasBalance) || 0);
  if (!address) {
    return balance > 0 ? `NAPIWAS ${balance}` : 'Offline';
  }
  if (address.length < 14) {
    return balance > 0 ? `${address} | ${balance}` : address;
  }
  const short = `${address.slice(0, 4)}...${address.slice(-4)}`;
  return balance > 0 ? `${short} | ${balance}` : short;
}

function touchActivePlayer(clientId, alias = '') {
  if (!clientId) return;
  analyticsStore.players.set(clientId, {
    alias: normalizeAlias(alias),
    lastSeenAt: Date.now(),
  });
}

function cleanupActivePlayers(now = Date.now()) {
  for (const [clientId, player] of analyticsStore.players.entries()) {
    if (!player || now - player.lastSeenAt > ACTIVE_PLAYER_TTL_MS) {
      analyticsStore.players.delete(clientId);
    }
  }
}

function pushAnalyticsEvent(type, detail, alias = 'Pilot') {
  const counterKey = typeof type === 'string' ? type : 'pageView';
  if (!Object.prototype.hasOwnProperty.call(analyticsStore.counters, counterKey)) {
    analyticsStore.counters[counterKey] = 0;
  }
  analyticsStore.counters[counterKey] += 1;
  analyticsStore.events.unshift({
    id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: counterKey,
    alias: normalizeAlias(alias),
    detail: typeof detail === 'string' && detail.trim() ? detail.trim().slice(0, 80) : '',
    createdAt: Date.now(),
  });
  analyticsStore.events = analyticsStore.events.slice(0, MAX_EVENT_HISTORY);
}

function listAnalyticsSummary() {
  cleanupActivePlayers();
  return {
    playersOnline: analyticsStore.players.size,
    counters: { ...analyticsStore.counters },
    recentEvents: analyticsStore.events.map((event) => ({ ...event })),
  };
}

function listPartners() {
  return PARTNER_CARDS.map((partner) => ({ ...partner }));
}

function cleanupLeaderboard() {
  const ranked = Array.from(leaderboardStore.values())
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (right.bosses !== left.bosses) return right.bosses - left.bosses;
      if (right.meters !== left.meters) return right.meters - left.meters;
      return right.updatedAt - left.updatedAt;
    })
    .slice(0, MAX_LEADERBOARD_ENTRIES);
  leaderboardStore.clear();
  ranked.forEach((entry) => {
    leaderboardStore.set(entry.clientId, entry);
  });
}

function listLeaderboard() {
  cleanupLeaderboard();
  return Array.from(leaderboardStore.values())
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (right.bosses !== left.bosses) return right.bosses - left.bosses;
      if (right.meters !== left.meters) return right.meters - left.meters;
      return right.updatedAt - left.updatedAt;
    })
    .slice(0, 12)
    .map((entry, index) => ({
      rank: index + 1,
      clientId: entry.clientId,
      alias: entry.alias,
      score: entry.score,
      meters: entry.meters,
      bosses: entry.bosses,
      walletTag: entry.walletTag,
      updatedAt: entry.updatedAt,
    }));
}

function submitLeaderboardEntry({ clientId, alias, score, meters, bosses, walletAddress, napiwasBalance }) {
  const normalizedClientId = typeof clientId === 'string' ? clientId.trim() : '';
  if (!normalizedClientId) {
    throw createCoopError('clientId is required', 400);
  }
  touchActivePlayer(normalizedClientId, alias);
  const nextEntry = {
    clientId: normalizedClientId,
    alias: normalizeAlias(alias),
    score: Math.max(0, Number(score) || 0),
    meters: Math.max(0, Number(meters) || 0),
    bosses: Math.max(0, Number(bosses) || 0),
    walletTag: formatWalletTag(walletAddress, napiwasBalance),
    updatedAt: Date.now(),
  };
  const previous = leaderboardStore.get(normalizedClientId);
  const shouldReplace =
    !previous
    || nextEntry.score > previous.score
    || (nextEntry.score === previous.score && nextEntry.bosses > previous.bosses)
    || (nextEntry.score === previous.score && nextEntry.bosses === previous.bosses && nextEntry.meters > previous.meters);

  if (shouldReplace) {
    leaderboardStore.set(normalizedClientId, nextEntry);
    cleanupLeaderboard();
  }
  pushAnalyticsEvent('leaderboardSubmit', `score ${nextEntry.score}`, alias);
  return buildResponse();
}

function cleanupChallenges(now = Date.now()) {
  for (const [challengeId, challenge] of challengeStore.entries()) {
    if (!challenge) {
      challengeStore.delete(challengeId);
      continue;
    }
    const ttl = challenge.status === 'resolved' ? RESOLVED_CHALLENGE_TTL_MS : CHALLENGE_TTL_MS;
    if (now - challenge.updatedAt > ttl) {
      challengeStore.delete(challengeId);
    }
  }
}

function cloneChallenge(challenge) {
  return {
    id: challenge.id,
    type: challenge.type,
    metricLabel: challenge.metricLabel,
    stake: challenge.stake,
    status: challenge.status,
    hostId: challenge.hostId,
    hostAlias: challenge.hostAlias,
    guestId: challenge.guestId,
    guestAlias: challenge.guestAlias,
    winnerId: challenge.winnerId,
    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt,
    results: challenge.results,
  };
}

function listChallenges() {
  cleanupChallenges();
  return Array.from(challengeStore.values())
    .sort((left, right) => right.updatedAt - left.updatedAt)
    .slice(0, 12)
    .map(cloneChallenge);
}

function createChallengeId() {
  return `DUEL-${Math.floor(1000 + Math.random() * 9000)}`;
}

function findChallenge(challengeId) {
  const normalized = typeof challengeId === 'string' ? challengeId.trim() : '';
  return normalized ? challengeStore.get(normalized) || null : null;
}

function createChallenge({ clientId, alias, type, stake }) {
  const normalizedClientId = typeof clientId === 'string' ? clientId.trim() : '';
  if (!normalizedClientId) {
    throw createCoopError('clientId is required', 400);
  }
  const normalizedType = type === 'bosses' ? 'bosses' : 'score';
  const challenge = {
    id: createChallengeId(),
    type: normalizedType,
    metricLabel: normalizedType === 'bosses' ? 'Bosses defeated' : 'Highest score',
    stake: clampNumber(stake, 25, 5000, 120),
    status: 'open',
    hostId: normalizedClientId,
    hostAlias: normalizeAlias(alias),
    guestId: '',
    guestAlias: '',
    winnerId: '',
    results: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  challengeStore.set(challenge.id, challenge);
  touchActivePlayer(normalizedClientId, alias);
  pushAnalyticsEvent('challengeCreate', challenge.metricLabel, alias);
  return buildResponse();
}

function acceptChallenge({ challengeId, clientId, alias }) {
  const challenge = findChallenge(challengeId);
  if (!challenge) {
    throw createCoopError('Challenge not found', 404);
  }
  if (challenge.status !== 'open') {
    throw createCoopError('Challenge is no longer open', 409);
  }
  const normalizedClientId = typeof clientId === 'string' ? clientId.trim() : '';
  if (!normalizedClientId || normalizedClientId === challenge.hostId) {
    throw createCoopError('Valid opponent clientId is required', 400);
  }
  challenge.guestId = normalizedClientId;
  challenge.guestAlias = normalizeAlias(alias, 'Guest');
  challenge.status = 'live';
  challenge.updatedAt = Date.now();
  challengeStore.set(challenge.id, challenge);
  touchActivePlayer(normalizedClientId, alias);
  pushAnalyticsEvent('challengeAccept', challenge.metricLabel, alias);
  return buildResponse();
}

function resolveChallengeWinner(challenge) {
  const hostResult = challenge.results[challenge.hostId];
  const guestResult = challenge.guestId ? challenge.results[challenge.guestId] : null;
  if (!hostResult || !guestResult) return;

  const primaryKey = challenge.type === 'bosses' ? 'bosses' : 'score';
  const hostPrimary = Number(hostResult[primaryKey]) || 0;
  const guestPrimary = Number(guestResult[primaryKey]) || 0;
  if (hostPrimary > guestPrimary) {
    challenge.winnerId = challenge.hostId;
  } else if (guestPrimary > hostPrimary) {
    challenge.winnerId = challenge.guestId;
  } else if ((Number(hostResult.score) || 0) !== (Number(guestResult.score) || 0)) {
    challenge.winnerId = (Number(hostResult.score) || 0) > (Number(guestResult.score) || 0) ? challenge.hostId : challenge.guestId;
  } else if ((Number(hostResult.meters) || 0) !== (Number(guestResult.meters) || 0)) {
    challenge.winnerId = (Number(hostResult.meters) || 0) > (Number(guestResult.meters) || 0) ? challenge.hostId : challenge.guestId;
  } else {
    challenge.winnerId = '';
  }
  challenge.status = 'resolved';
}

function submitChallengeRun({ challengeId, clientId, alias, score, meters, bosses }) {
  const challenge = findChallenge(challengeId);
  if (!challenge) {
    throw createCoopError('Challenge not found', 404);
  }
  const normalizedClientId = typeof clientId === 'string' ? clientId.trim() : '';
  const validParticipant = normalizedClientId === challenge.hostId || normalizedClientId === challenge.guestId;
  if (!validParticipant) {
    throw createCoopError('Client is not part of this challenge', 403);
  }
  challenge.results[normalizedClientId] = {
    alias: normalizeAlias(alias),
    score: Math.max(0, Number(score) || 0),
    meters: Math.max(0, Number(meters) || 0),
    bosses: Math.max(0, Number(bosses) || 0),
    submittedAt: Date.now(),
  };
  challenge.updatedAt = Date.now();
  resolveChallengeWinner(challenge);
  challengeStore.set(challenge.id, challenge);
  touchActivePlayer(normalizedClientId, alias);
  return buildResponse();
}

function clampNumber(value, min, max, fallback) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) return fallback;
  return Math.max(min, Math.min(max, Math.round(normalized)));
}

function recordAnalyticsEvent({ clientId, alias, type, detail }) {
  const normalizedClientId = typeof clientId === 'string' ? clientId.trim() : '';
  if (normalizedClientId) {
    touchActivePlayer(normalizedClientId, alias);
  }
  pushAnalyticsEvent(type, detail, alias);
  return buildResponse();
}

function cleanupLobbyMembers(lobby, now = Date.now()) {
  if (!lobby) return;
  if (!lobby.members || typeof lobby.members !== 'object') {
    lobby.members = {};
  }
  for (const [clientId, lastSeenAt] of Object.entries(lobby.members)) {
    const isExpired = !Number.isFinite(lastSeenAt) || now - lastSeenAt > MEMBER_TTL_MS;
    if (!clientId || clientId === lobby.hostId || isExpired) {
      delete lobby.members[clientId];
    }
  }
  lobby.players = 1 + Object.keys(lobby.members).length;
}

function cleanupExpiredLobbies(now = Date.now()) {
  for (const [hostId, lobby] of lobbyStore.entries()) {
    if (!lobby || now - lobby.updatedAt > LOBBY_TTL_MS) {
      lobbyStore.delete(hostId);
      continue;
    }
    cleanupLobbyMembers(lobby, now);
    lobbyStore.set(hostId, lobby);
  }
}

function cloneLobby(lobby) {
  cleanupLobbyMembers(lobby, Date.now());
  return {
    id: lobby.id,
    hostId: lobby.hostId,
    players: lobby.players,
    maxPlayers: lobby.maxPlayers,
    map: lobby.map,
    createdAt: lobby.createdAt,
    updatedAt: lobby.updatedAt,
  };
}

function listLobbies() {
  cleanupExpiredLobbies();
  return Array.from(lobbyStore.values())
    .sort((left, right) => right.updatedAt - left.updatedAt)
    .map(cloneLobby);
}

function createLobbyId() {
  return `NAPI-${Math.floor(1000 + Math.random() * 9000)}`;
}

function findLobbyById(lobbyId) {
  for (const [hostId, lobby] of lobbyStore.entries()) {
    if (lobby?.id === lobbyId) {
      return { hostId, lobby };
    }
  }
  return { hostId: '', lobby: null };
}

function buildResponse({ hostLobby = undefined, joinedLobby = undefined } = {}) {
  const payload = {
    lobbies: listLobbies(),
    leaderboard: listLeaderboard(),
    challenges: listChallenges(),
    analytics: listAnalyticsSummary(),
    partners: PARTNER_CARDS.map((partner) => ({ ...partner })),
  };
  if (hostLobby !== undefined) {
    payload.hostLobby = hostLobby ? cloneLobby(hostLobby) : null;
  }
  if (joinedLobby !== undefined) {
    payload.joinedLobby = joinedLobby ? cloneLobby(joinedLobby) : null;
  }
  return payload;
}

function upsertHostedLobby({ hostId, map }) {
  cleanupExpiredLobbies();
  const now = Date.now();
  const existing = lobbyStore.get(hostId);
  const lobby = {
    id: existing?.id || createLobbyId(),
    hostId,
    members: existing?.members && typeof existing.members === 'object' ? { ...existing.members } : {},
    players: 1,
    maxPlayers: 3,
    map: typeof map === 'string' && map ? map : existing?.map || 'Battle Arena',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  cleanupLobbyMembers(lobby, now);
  lobbyStore.set(hostId, lobby);
  return buildResponse({ hostLobby: lobby, joinedLobby: null });
}

function heartbeatLobby(hostId) {
  cleanupExpiredLobbies();
  const existing = lobbyStore.get(hostId);
  if (!existing) {
    return buildResponse({ hostLobby: null, joinedLobby: null });
  }
  existing.updatedAt = Date.now();
  cleanupLobbyMembers(existing, existing.updatedAt);
  lobbyStore.set(hostId, existing);
  return buildResponse({ hostLobby: existing, joinedLobby: null });
}

function closeLobby(hostId) {
  cleanupExpiredLobbies();
  lobbyStore.delete(hostId);
  return buildResponse({ hostLobby: null, joinedLobby: null });
}

function joinLobby({ lobbyId, clientId }) {
  cleanupExpiredLobbies();
  const entry = findLobbyById(lobbyId);
  if (!entry.lobby) {
    throw createCoopError('Lobby not found', 404);
  }
  const lobby = entry.lobby;
  const now = Date.now();
  cleanupLobbyMembers(lobby, now);
  if (clientId === lobby.hostId) {
    return buildResponse({ joinedLobby: null, hostLobby: lobby });
  }
  const currentGuestCount = Object.keys(lobby.members).length;
  const alreadyJoined = Object.prototype.hasOwnProperty.call(lobby.members, clientId);
  if (!alreadyJoined && 1 + currentGuestCount >= lobby.maxPlayers) {
    throw createCoopError('Lobby is full', 409);
  }
  lobby.members[clientId] = now;
  lobby.updatedAt = now;
  cleanupLobbyMembers(lobby, now);
  lobbyStore.set(entry.hostId, lobby);
  return buildResponse({ joinedLobby: lobby });
}

function heartbeatMember({ lobbyId, clientId }) {
  cleanupExpiredLobbies();
  const entry = findLobbyById(lobbyId);
  if (!entry.lobby) {
    return buildResponse({ joinedLobby: null });
  }
  const lobby = entry.lobby;
  const now = Date.now();
  cleanupLobbyMembers(lobby, now);
  if (!Object.prototype.hasOwnProperty.call(lobby.members, clientId)) {
    return buildResponse({ joinedLobby: null });
  }
  lobby.members[clientId] = now;
  lobby.updatedAt = now;
  cleanupLobbyMembers(lobby, now);
  lobbyStore.set(entry.hostId, lobby);
  return buildResponse({ joinedLobby: lobby });
}

function leaveLobby({ lobbyId, clientId }) {
  cleanupExpiredLobbies();
  const entry = findLobbyById(lobbyId);
  if (!entry.lobby) {
    return buildResponse({ joinedLobby: null });
  }
  const lobby = entry.lobby;
  if (Object.prototype.hasOwnProperty.call(lobby.members, clientId)) {
    delete lobby.members[clientId];
    lobby.updatedAt = Date.now();
    cleanupLobbyMembers(lobby, lobby.updatedAt);
    lobbyStore.set(entry.hostId, lobby);
  }
  return buildResponse({ joinedLobby: null });
}

function getLiveSnapshot({ clientId, alias } = {}) {
  const normalizedClientId = typeof clientId === 'string' ? clientId.trim() : '';
  if (normalizedClientId) {
    touchActivePlayer(normalizedClientId, alias);
  }
  return buildResponse();
}

module.exports = {
  acceptChallenge,
  closeLobby,
  createChallenge,
  getLiveSnapshot,
  heartbeatLobby,
  heartbeatMember,
  joinLobby,
  leaveLobby,
  listAnalyticsSummary,
  listChallenges,
  listLobbies,
  listLeaderboard,
  listPartners,
  recordAnalyticsEvent,
  submitChallengeRun,
  submitLeaderboardEntry,
  upsertHostedLobby,
};

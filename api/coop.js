const coopStore = require('../coop-store.cjs');

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body) {
    return JSON.parse(req.body);
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) {
    return {};
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET') {
    const requestUrl = new URL(req.url || '/', 'http://localhost');
    const clientId = requestUrl.searchParams.get('clientId') || '';
    const alias = requestUrl.searchParams.get('alias') || '';
    const snapshot = typeof coopStore.getLiveSnapshot === 'function'
      ? coopStore.getLiveSnapshot({ clientId, alias })
      : {
        lobbies: coopStore.listLobbies(),
        leaderboard: typeof coopStore.listLeaderboard === 'function' ? coopStore.listLeaderboard() : [],
        challenges: typeof coopStore.listChallenges === 'function' ? coopStore.listChallenges() : [],
        analytics: typeof coopStore.listAnalyticsSummary === 'function' ? coopStore.listAnalyticsSummary() : null,
        partners: typeof coopStore.listPartners === 'function' ? coopStore.listPartners() : [],
      };
    res.statusCode = 200;
    res.end(JSON.stringify(snapshot));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const payload = await readJsonBody(req);
    let result;
    if (payload.action === 'host') {
      const hostId = typeof payload.hostId === 'string' ? payload.hostId.trim() : '';
      if (!hostId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'hostId is required' }));
        return;
      }
      result = coopStore.upsertHostedLobby({ hostId, map: payload.map });
    } else if (payload.action === 'heartbeat') {
      const hostId = typeof payload.hostId === 'string' ? payload.hostId.trim() : '';
      if (!hostId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'hostId is required' }));
        return;
      }
      result = coopStore.heartbeatLobby(hostId);
    } else if (payload.action === 'close') {
      const hostId = typeof payload.hostId === 'string' ? payload.hostId.trim() : '';
      if (!hostId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'hostId is required' }));
        return;
      }
      result = coopStore.closeLobby(hostId);
    } else if (payload.action === 'join') {
      const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
      const lobbyId = typeof payload.lobbyId === 'string' ? payload.lobbyId.trim() : '';
      if (!clientId || !lobbyId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'clientId and lobbyId are required' }));
        return;
      }
      result = coopStore.joinLobby({ clientId, lobbyId });
    } else if (payload.action === 'memberHeartbeat') {
      const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
      const lobbyId = typeof payload.lobbyId === 'string' ? payload.lobbyId.trim() : '';
      if (!clientId || !lobbyId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'clientId and lobbyId are required' }));
        return;
      }
      result = coopStore.heartbeatMember({ clientId, lobbyId });
    } else if (payload.action === 'leave') {
      const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
      const lobbyId = typeof payload.lobbyId === 'string' ? payload.lobbyId.trim() : '';
      if (!clientId || !lobbyId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'clientId and lobbyId are required' }));
        return;
      }
      result = coopStore.leaveLobby({ clientId, lobbyId });
    } else if (payload.action === 'leaderboardSubmit') {
      const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
      if (!clientId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'clientId is required' }));
        return;
      }
      result = coopStore.submitLeaderboardEntry({
        clientId,
        alias: payload.alias,
        score: payload.score,
        meters: payload.meters,
        bosses: payload.bosses,
        walletAddress: payload.walletAddress,
        napiwasBalance: payload.napiwasBalance,
      });
    } else if (payload.action === 'analyticsEvent') {
      result = coopStore.recordAnalyticsEvent({
        clientId: payload.clientId,
        alias: payload.alias,
        type: payload.type,
        detail: payload.detail,
      });
    } else if (payload.action === 'challengeCreate') {
      const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
      if (!clientId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'clientId is required' }));
        return;
      }
      result = coopStore.createChallenge({
        clientId,
        alias: payload.alias,
        type: payload.type,
        stake: payload.stake,
      });
    } else if (payload.action === 'challengeAccept') {
      const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
      const challengeId = typeof payload.challengeId === 'string' ? payload.challengeId.trim() : '';
      if (!clientId || !challengeId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'clientId and challengeId are required' }));
        return;
      }
      result = coopStore.acceptChallenge({
        challengeId,
        clientId,
        alias: payload.alias,
      });
    } else if (payload.action === 'challengeSubmit') {
      const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
      const challengeId = typeof payload.challengeId === 'string' ? payload.challengeId.trim() : '';
      if (!clientId || !challengeId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'clientId and challengeId are required' }));
        return;
      }
      result = coopStore.submitChallengeRun({
        challengeId,
        clientId,
        alias: payload.alias,
        score: payload.score,
        meters: payload.meters,
        bosses: payload.bosses,
      });
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Unknown action' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = Number.isFinite(error?.statusCode) ? error.statusCode : 500;
    res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }));
  }
};

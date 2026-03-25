import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import coopStore from './coop-store.cjs';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || '8080');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFilePath(urlPath) {
  const safePath = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const localPath = join(rootDir, safePath);
  if (existsSync(localPath) && statSync(localPath).isFile()) {
    return localPath;
  }
  return join(rootDir, 'index.html');
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${host}:${port}`);
  if (requestUrl.pathname === '/api/coop') {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.method === 'GET') {
      const clientId = requestUrl.searchParams.get('clientId') || '';
      const alias = requestUrl.searchParams.get('alias') || '';
      const snapshot = typeof coopStore.getLiveSnapshot === 'function'
        ? coopStore.getLiveSnapshot({ clientId, alias })
        : { lobbies: coopStore.listLobbies() };
      res.writeHead(200);
      res.end(JSON.stringify(snapshot));
      return;
    }
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    try {
      const payload = await readJsonBody(req);
      let result;
      if (payload.action === 'host') {
        const hostId = typeof payload.hostId === 'string' ? payload.hostId.trim() : '';
        if (!hostId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'hostId is required' }));
          return;
        }
        result = coopStore.upsertHostedLobby({ hostId, map: payload.map });
      } else if (payload.action === 'heartbeat') {
        const hostId = typeof payload.hostId === 'string' ? payload.hostId.trim() : '';
        if (!hostId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'hostId is required' }));
          return;
        }
        result = coopStore.heartbeatLobby(hostId);
      } else if (payload.action === 'close') {
        const hostId = typeof payload.hostId === 'string' ? payload.hostId.trim() : '';
        if (!hostId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'hostId is required' }));
          return;
        }
        result = coopStore.closeLobby(hostId);
      } else if (payload.action === 'join') {
        const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
        const lobbyId = typeof payload.lobbyId === 'string' ? payload.lobbyId.trim() : '';
        if (!clientId || !lobbyId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'clientId and lobbyId are required' }));
          return;
        }
        result = coopStore.joinLobby({ clientId, lobbyId });
      } else if (payload.action === 'memberHeartbeat') {
        const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
        const lobbyId = typeof payload.lobbyId === 'string' ? payload.lobbyId.trim() : '';
        if (!clientId || !lobbyId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'clientId and lobbyId are required' }));
          return;
        }
        result = coopStore.heartbeatMember({ clientId, lobbyId });
      } else if (payload.action === 'leave') {
        const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
        const lobbyId = typeof payload.lobbyId === 'string' ? payload.lobbyId.trim() : '';
        if (!clientId || !lobbyId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'clientId and lobbyId are required' }));
          return;
        }
        result = coopStore.leaveLobby({ clientId, lobbyId });
      } else if (payload.action === 'leaderboardSubmit') {
        const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
        if (!clientId) {
          res.writeHead(400);
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
          res.writeHead(400);
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
          res.writeHead(400);
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
          res.writeHead(400);
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
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Unknown action' }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(Number.isFinite(error?.statusCode) ? error.statusCode : 500);
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }));
    }
    return;
  }
  const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const filePath = resolveFilePath(pathname);
  const extension = extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || 'application/octet-stream';

  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Content-Type': contentType,
  });

  createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`NaPiwas scratch build is live at http://${host}:${port}`);
});

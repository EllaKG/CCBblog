const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
const { DatabaseSync } = require('node:sqlite');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 8080);
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'site.db');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

fs.mkdirSync(DATA_DIR, { recursive: true });

const database = new DatabaseSync(DATABASE_PATH);
database.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const insertMessage = database.prepare(`
  INSERT INTO contact_messages (name, email, subject, message, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  response.end(body);
}

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        sendJson(response, 404, { error: 'File not found.' });
        return;
      }

      sendJson(response, 500, { error: 'Could not read the requested file.' });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'Content-Length': data.length
    });
    response.end(data);
  });
}

function getRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large.'));
        request.destroy();
      }
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function resolveStaticPath(urlPathname) {
  const requestedPath = urlPathname === '/' ? '/index.html' : urlPathname;
  const normalizedPath = path.normalize(decodeURIComponent(requestedPath)).replace(/^([.][.][/\\])+/, '');
  const absolutePath = path.join(ROOT_DIR, normalizedPath);

  if (!absolutePath.startsWith(ROOT_DIR)) {
    return null;
  }

  return absolutePath;
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);

  if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
    sendJson(response, 200, { status: 'ok' });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/contact') {
    try {
      const rawBody = await getRequestBody(request);
      const payload = JSON.parse(rawBody || '{}');
      const name = String(payload.name || '').trim();
      const email = String(payload.email || '').trim();
      const subject = String(payload.subject || '').trim();
      const message = String(payload.message || '').trim();

      if (!name || !email || !message) {
        sendJson(response, 400, { error: 'Name, email, and message are required.' });
        return;
      }

      if (!isValidEmail(email)) {
        sendJson(response, 400, { error: 'Please provide a valid email address.' });
        return;
      }

      const createdAt = new Date().toISOString();
      const result = insertMessage.run(name, email, subject, message, createdAt);

      sendJson(response, 201, {
        message: 'Thanks! Your message was saved to the database.',
        submission: {
          id: Number(result.lastInsertRowid),
          name,
          email,
          subject,
          message,
          created_at: createdAt
        }
      });
      return;
    } catch (error) {
      if (error instanceof SyntaxError) {
        sendJson(response, 400, { error: 'Invalid JSON payload.' });
        return;
      }

      sendJson(response, 500, { error: 'Could not save your message right now.' });
      return;
    }
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  const filePath = resolveStaticPath(requestUrl.pathname);
  if (!filePath) {
    sendJson(response, 403, { error: 'Forbidden.' });
    return;
  }

  sendFile(response, filePath);
});

server.listen(PORT, HOST, () => {
  console.log(`Serving site with SQLite API at http://${HOST}:${PORT}`);
});
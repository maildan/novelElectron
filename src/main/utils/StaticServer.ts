import http, { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Logger } from '../../shared/logger';

export interface StartedStaticServer {
  origin: string;
  close: () => void;
}

const MIME_TYPE_BY_EXT: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
};

function setSecurityHeaders(res: ServerResponse): void {
  // Baseline hardening
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), usb=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  // Strict CSP for packaged app static delivery
  const csp = [
    "default-src 'self'",
    // base policy without nonce; HTML responses will override with nonce
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    // Allow app to call our backend and same-origin loopback
    "connect-src 'self' https://loop-openai.onrender.com http://127.0.0.1:* http://localhost:*",
    "worker-src 'self' blob:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join('; ');
  res.setHeader('Content-Security-Policy', csp);
}

function sendFile(res: ServerResponse, filePath: string): void {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPE_BY_EXT[ext] || 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  fs.createReadStream(filePath).pipe(res);
}

function sendHtmlWithNonce(res: ServerResponse, filePath: string): void {
  try {
    const ext = path.extname(filePath);
    const contentType = MIME_TYPE_BY_EXT[ext] || 'text/html; charset=utf-8';
    const nonce = crypto.randomBytes(16).toString('base64');

    // Override CSP for HTML to allow nonce'd inline scripts only
    const cspWithNonce = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      `script-src-elem 'self' 'nonce-${nonce}'`,
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://loop-openai.onrender.com http://127.0.0.1:* http://localhost:*",
      "worker-src 'self' blob:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
    ].join('; ');

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Security-Policy', cspWithNonce);

    let html = fs.readFileSync(filePath, 'utf-8');

    // Add nonce to all <script> tags (with or without src)
    html = html.replace(/<script([^>]*)>/g, (m, attrs) => {
      if (/nonce=/.test(attrs)) return m; // already has nonce
      return `<script nonce="${nonce}"${attrs}>`;
    });

    res.end(html);
  } catch (error) {
    Logger.error('STATIC_SERVER', 'Failed to send HTML with nonce', error as Error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Internal Server Error');
  }
}

function notFound(res: ServerResponse, urlPath?: string): void {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (urlPath) {
    Logger.warn('STATIC_SERVER', '404 Not Found', { urlPath });
  }
  res.end('Not Found');
}

function existsSafe(candidatePath: string): boolean {
  try {
    return fs.existsSync(candidatePath);
  } catch {
    return false;
  }
}

function firstExisting(...candidates: string[]): string | undefined {
  for (const c of candidates) {
    if (existsSafe(c)) return c;
  }
  return undefined;
}

export async function startStaticServer(): Promise<StartedStaticServer> {
  // Prefer unpacked first to avoid streaming from ASAR for large assets
  const nextRootUnpacked = path.join(
    process.resourcesPath,
    'app.asar.unpacked',
    'dist',
    'renderer',
    '.next'
  );
  const nextRootPacked = path.join(
    process.resourcesPath,
    'app.asar',
    'dist',
    'renderer',
    '.next'
  );
  const publicRoot = path.join(process.resourcesPath, 'app.asar', 'public');
  // Dev roots (when running unpackaged)
  const nextRootDev = path.join(process.cwd(), 'dist', 'renderer', '.next');
  const publicRootDev = path.join(process.cwd(), 'src', 'renderer', 'public');
  const publicRootDevAlt = path.join(process.cwd(), 'public');

  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
      setSecurityHeaders(res);
      const rawUrl = typeof req.url === 'string' ? req.url : '/';
      const urlPath: string = rawUrl.split('?')[0] || '/';

      // No server APIs for now
      if (urlPath && urlPath.startsWith('/api/')) {
        return notFound(res);
      }

      // Next.js static files (chunks, media)
      if (urlPath && urlPath.startsWith('/_next/static/')) {
        const suffix = urlPath.replace('/_next/static/', '');
        const a = path.join(nextRootUnpacked, 'static', suffix);
        const b = path.join(nextRootPacked, 'static', suffix);
        const c = path.join(nextRootDev, 'static', suffix);
        const found = firstExisting(a, b, c);
        return found ? sendFile(res, found) : notFound(res, urlPath);
      }

      // Any other _next assets (e.g., /_next/<build-id>, /_next/image if ever used unoptimized=false)
      if (urlPath && urlPath.startsWith('/_next/')) {
        const suffix = urlPath.replace('/_next/', '');
        const a = path.join(nextRootUnpacked, suffix);
        const b = path.join(nextRootPacked, suffix);
        const c = path.join(nextRootDev, suffix);
        const found = firstExisting(a, b, c);
        if (found) return sendFile(res, found);
      }

      // Serve from public when available (prod and dev)
      const publicCandidates = [
        path.join(publicRoot, urlPath),
        path.join(publicRootDev, urlPath),
        path.join(publicRootDevAlt, urlPath),
      ];
      const publicFound = publicCandidates.find(p => existsSafe(p) && fs.statSync(p).isFile());
      if (publicFound) {
        return sendFile(res, publicFound);
      }

      // App Router prerendered HTML under server/app
      const cleanPath = (urlPath || '/').replace(/\/+$/, '') || '/';
      const directSeg = cleanPath === '/' ? '/index' : cleanPath; // e.g., '/projects' => '/projects.html'
      const indexSeg = cleanPath === '/' ? '/index' : `${cleanPath}/index`; // legacy '/projects/index.html'
      const directA = path.join(nextRootUnpacked, 'server', 'app', `${directSeg}.html`);
      const directB = path.join(nextRootPacked, 'server', 'app', `${directSeg}.html`);
      const directC = path.join(nextRootDev, 'server', 'app', `${directSeg}.html`);
      const indexA = path.join(nextRootUnpacked, 'server', 'app', `${indexSeg}.html`);
      const indexB = path.join(nextRootPacked, 'server', 'app', `${indexSeg}.html`);
      const indexC = path.join(nextRootDev, 'server', 'app', `${indexSeg}.html`);
      const fallbackA = path.join(nextRootUnpacked, 'server', 'app', 'index.html');
      const fallbackB = path.join(nextRootPacked, 'server', 'app', 'index.html');
      const fallbackC = path.join(nextRootDev, 'server', 'app', 'index.html');
      let page = firstExisting(directA, directB, directC, indexA, indexB, indexC, fallbackA, fallbackB, fallbackC);
      // SPA-style fallback: if path has no extension and page not found, serve root index
      if (!page && !path.extname(urlPath)) {
        page = firstExisting(fallbackA, fallbackB, fallbackC);
      }
      return page ? sendHtmlWithNonce(res, page) : notFound(res, urlPath);
    } catch {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Internal Server Error');
    }
  });

  // Bind host configurable; default to 127.0.0.1 for safety
  const host = process.env.STATIC_SERVER_HOST || '127.0.0.1';
  await new Promise<void>((resolve) => server.listen(0, host, () => resolve()));
  const addr = server.address();
  const port = typeof addr === 'object' && addr && 'port' in addr ? (addr.port as number) : 0;
  const origin = `http://${host}:${port}`;
  // Expose full origin string, not just port, to avoid mis-parsing in prod
  process.env.STATIC_SERVER_ORIGIN = origin;
  return { origin, close: () => server.close() };
}



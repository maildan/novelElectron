/**
 * 🔥 기가차드 정적 서버
 * Loop Typing Analytics - Static File Server
 * 
 * 프로덕션 모드에서 Next.js 빌드 파일을 서빙하는 HTTP 서버
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

export class StaticServer {
  private server: http.Server | null = null;
  private port: number = 0;

  constructor(private staticPath: string, private fallbackPort: number = 5500) {}

  async start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });

      // 사용 가능한 포트 찾기
      this.server.listen(0, 'localhost', () => {
        const address = this.server?.address();
        if (address && typeof address === 'object') {
          this.port = address.port;
          console.log(`🌐 기가차드 정적 서버 시작: http://localhost:${this.port}`);
          resolve(this.port);
        } else {
          reject(new Error('서버 주소를 가져올 수 없습니다'));
        }
      });

      this.server.on('error', (error) => {
        console.error('❌ 정적 서버 에러:', error);
        reject(error);
      });
    });
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      let filePath = req.url || '/';
      
      // URL에서 쿼리 파라미터 제거
      const urlParts = filePath.split('?');
      filePath = urlParts[0];

      // 루트 경로는 index.html로 리다이렉트
      if (filePath === '/') {
        filePath = '/index.html';
      }

      // API 요청 처리
      if (filePath.startsWith('/api/')) {
        this.handleApiRequest(filePath, res);
        return;
      }

      // Next.js 15 정적 리소스 처리
      if (filePath.startsWith('/_next/') || filePath.startsWith('/static/')) {
        this.handleNextJsAssets(filePath, res);
        return;
      }

      // 정적 파일 경로 생성
      const fullPath = path.join(this.staticPath, filePath);

      // 파일 존재 확인
      if (!fs.existsSync(fullPath)) {
        // SPA를 위해 존재하지 않는 경로는 index.html로 폴백
        const indexPath = path.join(this.staticPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          this.serveFile(indexPath, res, 'text/html');
        } else {
          this.send404(res);
        }
        return;
      }

      // MIME 타입 결정
      const mimeType = this.getMimeType(path.extname(fullPath));
      this.serveFile(fullPath, res, mimeType);

    } catch (error) {
      console.error('❌ 요청 처리 에러:', error);
      this.send500(res);
    }
  }

  private handleNextJsAssets(assetPath: string, res: http.ServerResponse): void {
    try {
      // Next.js 15 정적 리소스 경로 처리
      const fullPath = path.join(this.staticPath, assetPath);
      
      if (fs.existsSync(fullPath)) {
        const mimeType = this.getMimeType(path.extname(fullPath));
        this.serveFile(fullPath, res, mimeType);
      } else {
        // Next.js 빌드 디렉토리에서 찾아보기
        const buildPath = path.join(this.staticPath, '.next', assetPath.replace('/_next/', ''));
        if (fs.existsSync(buildPath)) {
          const mimeType = this.getMimeType(path.extname(buildPath));
          this.serveFile(buildPath, res, mimeType);
        } else {
          console.warn(`⚠️ Next.js 리소스를 찾을 수 없음: ${assetPath}`);
          this.send404(res);
        }
      }
    } catch (error) {
      console.error('❌ Next.js 리소스 처리 에러:', error);
      this.send500(res);
    }
  }

  private handleApiRequest(apiPath: string, res: http.ServerResponse): void {
    // 🔥 기가차드 API 응답들
    const apiResponses: { [key: string]: any } = {
      '/api/health': { 
        status: 'ok', 
        timestamp: Date.now(),
        gigachad: true,
        version: '1.0.0'
      },
      '/api/app/status': { 
        status: 'running', 
        keyboard: { monitoring: true },
        database: { connected: true }
      },
      '/api/system/info': { 
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      }
    };

    const response = apiResponses[apiPath] || { error: 'API not found', gigachad: false };
    
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    
    res.end(JSON.stringify(response));
  }

  private serveFile(filePath: string, res: http.ServerResponse, mimeType: string): void {
    try {
      const content = fs.readFileSync(filePath);
      
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Length': content.length,
        'Cache-Control': mimeType.includes('html') ? 'no-cache' : 'public, max-age=31536000'
      });
      
      res.end(content);
    } catch (error) {
      console.error('❌ 파일 서빙 에러:', error);
      this.send500(res);
    }
  }

  private getMimeType(ext: string): string {
    const mimeTypes: { [key: string]: string } = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.mjs': 'application/javascript',
      '.ts': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.map': 'application/json',
      '.txt': 'text/plain',
      '.md': 'text/markdown'
    };

    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  }

  private send404(res: http.ServerResponse): void {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>404 - 기가차드 Not Found</title></head>
        <body>
          <h1>🔥 기가차드 404</h1>
          <p>요청한 리소스를 찾을 수 없습니다.</p>
        </body>
      </html>
    `);
  }

  private send500(res: http.ServerResponse): void {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>500 - 기가차드 Server Error</title></head>
        <body>
          <h1>🔥 기가차드 500</h1>
          <p>서버 내부 오류가 발생했습니다.</p>
        </body>
      </html>
    `);
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 기가차드 정적 서버 중지');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  getPort(): number {
    return this.port;
  }
}

export default StaticServer;

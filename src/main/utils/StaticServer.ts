import { join } from 'path';
import { existsSync, statSync } from 'fs';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname } from 'path';
import { Logger } from '../../shared/logger';

/**
 * 🔥 정적 파일 서버 - 프로덕션 환경에서 로컬 HTTP 서버로 Next.js 빌드 결과물 제공
 * 개발 환경에서는 사용하지 않음 (Next.js 개발 서버 사용)
 */
export class StaticServer {
  private static instance: StaticServer;
  private readonly staticPath: string;
  private readonly indexPath: string;
  private server: import('http').Server | null = null;
  private port: number = 0;
  private readonly basePort = 35821;

  private constructor() {
    // dist/renderer/out 경로에서 정적 파일 제공
    this.staticPath = join(__dirname, '..', '..', 'renderer', 'out');
    this.indexPath = join(this.staticPath, 'index.html');
    
    Logger.debug('STATIC_SERVER', 'StaticServer 인스턴스 생성', {
      staticPath: this.staticPath,
      indexPath: this.indexPath
    });
  }

  public static getInstance(): StaticServer {
    if (!StaticServer.instance) {
      StaticServer.instance = new StaticServer();
    }
    return StaticServer.instance;
  }

  /**
   * 정적 파일이 존재하는지 확인하고 필요시 HTTP 서버 시작
   */
  public async checkHealth(): Promise<boolean> {
    try {
      const exists = existsSync(this.indexPath);
      Logger.debug('STATIC_SERVER', '정적 파일 상태 확인', {
        indexPath: this.indexPath,
        exists
      });

      if (exists && !this.server) {
        await this.startHttpServer();
      }

      return exists && this.port > 0;
    } catch (error) {
      Logger.error('STATIC_SERVER', '정적 파일 상태 확인 실패', error);
      return false;
    }
  }

  /**
   * 로컬 HTTP 서버 시작
   */
  private async startHttpServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = createServer((req, res) => {
        this.handleRequest(req, res);
      });

      // 포트 찾기 시도
      const tryPort = (port: number) => {
      this.server!.listen(port, 'localhost', () => {
          this.port = port;
          Logger.info('STATIC_SERVER', `🚀 로컬 HTTP 서버 시작됨`, { 
            port: this.port,
            url: `http://localhost:${this.port}`
          });
          resolve();
        });

      this.server!.on('error', (error: NodeJS.ErrnoException) => {
          if (error.code === 'EADDRINUSE' && port < this.basePort + 100) {
            tryPort(port + 1);
          } else {
            reject(error);
          }
        });
      };

      tryPort(this.basePort);
    });
  }

  /**
   * HTTP 요청 처리 (디렉토리 및 동적 라우팅 지원)
   */
  private handleRequest(req: import('http').IncomingMessage, res: import('http').ServerResponse): void {
    try {
      let filePath = req.url;
      
      // 쿼리 파라미터 제거
      const safePath = filePath ?? '/';
      const urlWithoutQuery = safePath.split('?')[0];
      
      // 🔥 URL 디코딩 (중요: &5Bid&5D → [id] 변환)
      let decodedPath = decodeURIComponent(urlWithoutQuery || '/');
      
      // 루트 경로는 index.html로 리다이렉트
      if (decodedPath === '/') {
        filePath = '/index.html';
      } else {
        filePath = decodedPath;
      }
      
      Logger.debug('STATIC_SERVER', 'Request path processing', { 
        original: req.url, 
        decoded: decodedPath, 
        final: filePath 
      });

      let fullPath = join(this.staticPath, filePath);
      
      // 보안: 디렉토리 트래버셜 방지
      if (!fullPath.startsWith(this.staticPath)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      // 파일/디렉토리 존재 확인 및 처리
      if (existsSync(fullPath)) {
        const stats = statSync(fullPath);
        
        if (stats.isDirectory()) {
          // 디렉토리인 경우 index.html 찾기
          const indexPath = join(fullPath, 'index.html');
          if (existsSync(indexPath)) {
            fullPath = indexPath;
          } else {
            // index.html이 없으면 404
            this.serve404(res);
            return;
          }
        }

        // 파일 제공
        this.serveFile(fullPath, res);
      } else {
        // 동적 라우팅 fallback 처리
        this.handleDynamicRoute(filePath, res);
      }
    } catch (error) {
      Logger.error('STATIC_SERVER', 'HTTP 요청 처리 실패', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }

  /**
   * 파일 제공
   */
  private serveFile(fullPath: string, res: import('http').ServerResponse): void {
    try {
      const ext = extname(fullPath);
      const mimeTypes: { [key: string]: string } = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'font/eot',
        '.ico': 'image/x-icon'
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
      });
      
      const content = readFileSync(fullPath);
      res.end(content);
    } catch (error) {
      Logger.error('STATIC_SERVER', '파일 제공 실패', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }

  /**
   * 동적 라우팅 처리 (Next.js App Router 지원)
   */
  private handleDynamicRoute(filePath: string, res: import('http').ServerResponse): void {
    try {
      // /projects/[id] 동적 라우팅 처리
      if (filePath.startsWith('/projects/')) {
        const segments = filePath.split('/');
        if (segments.length >= 3) {
          const projectId = segments[2];
          
          // projectId가 유효한 경우에만 처리
          if (projectId && projectId.trim()) {
            // 먼저 정확한 프로젝트 ID 디렉토리 확인
            const exactProjectPath = join(this.staticPath, 'projects', projectId, 'index.html');
            if (existsSync(exactProjectPath)) {
              this.serveFile(exactProjectPath, res);
              return;
            }
          }
          
          // 🔥 존재하지 않는 프리렌더 경로는 SPA 라우팅으로 위임 (루트 index.html)
          const spaIndexPath = join(this.staticPath, 'index.html');
          if (existsSync(spaIndexPath)) {
            Logger.debug('STATIC_SERVER', '동적 프로젝트 경로를 SPA로 위임', { 
              requestedId: projectId, 
              fallbackPath: spaIndexPath 
            });
            this.serveFile(spaIndexPath, res);
            return;
          }
        }
      }

      // 기타 SPA 라우팅은 root index.html로 fallback
      const rootIndexPath = join(this.staticPath, 'index.html');
      if (existsSync(rootIndexPath)) {
        Logger.debug('STATIC_SERVER', 'SPA 라우팅 fallback to root', { 
          requestedPath: filePath 
        }); 
        this.serveFile(rootIndexPath, res);
      } else {
        this.serve404(res);
      }
    } catch (error) {
      Logger.error('STATIC_SERVER', '동적 라우팅 처리 실패', error);
      this.serve404(res);
    }
  }

  /**
   * 404 에러 제공
   */
  private serve404(res: import('http').ServerResponse): void {
    const notFoundPath = join(this.staticPath, '404.html');
    if (existsSync(notFoundPath)) {
      res.writeHead(404, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      const content = readFileSync(notFoundPath);
      res.end(content);
    } else {
      res.writeHead(404, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      });
      res.end('404 - Page Not Found');
    }
  }

  /**
   * HTTP 서버 URL 반환
   */
  public getMainUrl(): string {
    const url = `http://localhost:${this.port}`;
    Logger.debug('STATIC_SERVER', '메인 URL 생성', { 
      url,
      port: this.port,
      staticPath: this.staticPath
    });
    return url;
  }

  /**
   * 서버 정리
   */
  public cleanup(): void {
    if (this.server) {
      this.server.close(() => {
        Logger.info('STATIC_SERVER', '로컬 HTTP 서버 종료됨');
      });
      this.server = null;
      this.port = 0;
    }
  }

  /**
   * 정적 파일 경로 반환
   */
  public getStaticPath(): string {
    return this.staticPath;
  }
}
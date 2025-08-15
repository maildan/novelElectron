import { join } from 'path';
import { existsSync, statSync } from 'fs';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname } from 'path';
import { Logger } from '../../shared/logger';
import { BrowserWindow, shell } from 'electron';

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

      // 🔥 OAuth 콜백 처리 - 브라우저에서 Electron 앱으로 포커스 전환
      if (decodedPath === '/oauth/callback') {
        this.handleOAuthCallback(req, res);
        return;
      }

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
        // 🔥 CSP 완화: Next.js 정적 빌드 + 워커/폰트/이미지 로드 허용
        'Content-Security-Policy': [
          "default-src 'self' data: blob:",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:*",
          "style-src 'self' 'unsafe-inline' http://localhost:* https://localhost:*",
          "img-src 'self' data: blob: http://localhost:* https://localhost:*",
          "font-src 'self' data: http://localhost:* https://localhost:*",
          "connect-src 'self' http://localhost:* https://localhost:* https://www.googleapis.com https://oauth2.googleapis.com",
          "frame-src 'self' https://accounts.google.com",
          "worker-src 'self' blob:",
        ].join('; ')
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
   * 🔥 OAuth 콜백 처리 - 브라우저에서 앱으로 전환
   */
  private async handleOAuthCallback(req: import('http').IncomingMessage, res: import('http').ServerResponse): Promise<void> {
    try {
      const url = new URL(req.url || '', `http://localhost:${this.port}`);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      Logger.info('STATIC_SERVER', '🔥 OAuth 콜백 수신', { 
        code: code ? code.substring(0, 10) + '...' : null,
        error,
        hasState: !!state
      });

      // 🔥 즉시 토큰 교환 처리 (응답 전에)
      if (code && !error) {
        Logger.info('STATIC_SERVER', '토큰 교환 시작...');
        await this.handleTokenExchange(code, state);
      }

      // HTML 응답으로 성공/실패 페이지와 앱 포커스 처리
      const htmlContent = this.generateOAuthCallbackHtml(code, error, state);
      
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      res.end(htmlContent);

      // 🔥 Electron 앱으로 포커스 전환 (즉시)
      setTimeout(() => {
        this.focusElectronApp();
      }, 500); // 0.5초 후 포커스 전환 (빠른 반응)

    } catch (err) {
      Logger.error('STATIC_SERVER', 'OAuth 콜백 처리 실패', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('OAuth callback processing failed');
    }
  }

  /**
   * 🔥 OAuth 콜백 HTML 페이지 생성
   */
  private generateOAuthCallbackHtml(code: string | null, error: string | null, state: string | null): string {
    if (error) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>인증 실패</title>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, sans-serif; padding: 40px; text-align: center; background: #f5f5f5; }
            .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .error { color: #e74c3c; }
            .icon { font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h1 class="error">인증 실패</h1>
            <p>Google 인증 중 오류가 발생했습니다.</p>
            <p class="error">오류: ${error}</p>
            <p>앱으로 돌아가서 다시 시도해주세요.</p>
          </div>
          <script>
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </body>
        </html>
      `;
    }

    if (code) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>인증 완료</title>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, sans-serif; padding: 40px; text-align: center; background: #f5f5f5; }
            .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { color: #27ae60; }
            .icon { font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1 class="success">인증 완료!</h1>
            <p>Google 계정 연결이 성공했습니다.</p>
            <p>곧 앱으로 돌아갑니다...</p>
          </div>
          <script>
            setTimeout(() => {
              window.close();
            }, 2000);
          </script>
        </body>
        </html>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>인증 처리 중</title>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, sans-serif; padding: 40px; text-align: center; background: #f5f5f5; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .loading { color: #3498db; }
          .icon { font-size: 48px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">⏳</div>
          <h1 class="loading">인증 처리 중...</h1>
          <p>잠시만 기다려주세요.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * 🔥 Electron 앱으로 포커스 전환
   */
  private focusElectronApp(): void {
    try {
      const windows = BrowserWindow.getAllWindows();
      if (windows.length > 0) {
        const mainWindow = windows[0];
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.moveTop();
          Logger.info('STATIC_SERVER', '✅ Electron 앱 포커스 전환 완료');
        } else {
          Logger.warn('STATIC_SERVER', 'Main window가 없거나 파괴됨');
        }
      } else {
        Logger.warn('STATIC_SERVER', '활성화된 Electron 창이 없음');
      }
    } catch (error) {
      Logger.error('STATIC_SERVER', 'Electron 앱 포커스 전환 실패', error);
    }
  }

  /**
   * 🔥 토큰 교환 처리 (기존 OAuth IPC 핸들러 직접 호출)
   */
  private async handleTokenExchange(code: string, state: string | null): Promise<void> {
    try {
      Logger.info('STATIC_SERVER', '🔥 토큰 교환 시작', { 
        code: code.substring(0, 10) + '...',
        hasState: !!state 
      });

      // 🔥 기존 OAuth IPC 핸들러 직접 호출 (code_verifier 보존)
      const result = await this.callOAuthIpcHandler(code);
      
      if (result && result.success) {
        Logger.info('STATIC_SERVER', '✅ OAuth 토큰 교환 완료', { 
          hasAccessToken: !!result.data?.accessToken,
          hasRefreshToken: !!result.data?.refreshToken
        });
        
        // 성공 시 앱으로 신호 전송
        this.notifyOAuthSuccess();
      } else {
        Logger.error('STATIC_SERVER', '❌ OAuth 토큰 교환 실패', result?.error || 'Unknown error');
      }
    } catch (error) {
      Logger.error('STATIC_SERVER', 'OAuth 토큰 교환 처리 중 오류', error);
    }
  }

  /**
   * 🔥 기존 OAuth IPC 핸들러 직접 호출
   */
  private async callOAuthIpcHandler(code: string): Promise<any> {
    try {
      // 🔥 메인 프로세스의 ipcMain을 통해 직접 호출
      const { ipcMain } = await import('electron');
      
      Logger.info('STATIC_SERVER', '기존 OAuth IPC 핸들러 직접 호출');
      
      // 가짜 이벤트 객체 생성
      const mockEvent = {
        sender: { send: () => {} },
        returnValue: undefined,
        preventDefault: () => {},
        reply: () => {}
      };
      
      // oauth:handle-callback 핸들러 직접 실행
      const handlers = (ipcMain as any).listeners('oauth:handle-callback');
      
      if (handlers && handlers.length > 0) {
        Logger.info('STATIC_SERVER', 'OAuth 핸들러 발견 - 직접 실행');
        
        // 첫 번째 핸들러 실행 (대부분 하나만 있음)
        const handler = handlers[0];
        const result = await handler(mockEvent, code);
        
        return result;
      } else {
        Logger.error('STATIC_SERVER', 'OAuth 핸들러를 찾을 수 없음');
        return { success: false, error: 'No OAuth handler found' };
      }
    } catch (error) {
      Logger.error('STATIC_SERVER', 'OAuth IPC 핸들러 호출 실패', error);
      return { success: false, error: 'IPC handler call failed' };
    }
  }

  /**
   * 🔥 OAuth 성공 알림 (렌더러 프로세스에 알림)
   */
  private notifyOAuthSuccess(): void {
    try {
      const windows = BrowserWindow.getAllWindows();
      if (windows.length > 0) {
        const mainWindow = windows[0];
        if (mainWindow && !mainWindow.isDestroyed()) {
          // 렌더러 프로세스에 OAuth 성공 이벤트 전송
          mainWindow.webContents.send('oauth-success');
          Logger.info('STATIC_SERVER', '✅ OAuth 성공 이벤트 전송 완료');
        }
      }
    } catch (error) {
      Logger.error('STATIC_SERVER', 'OAuth 성공 알림 실패', error);
    }
  }

  /**
   * 정적 파일 경로 반환
   */
  public getStaticPath(): string {
    return this.staticPath;
  }
}
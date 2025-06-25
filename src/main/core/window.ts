/**
 * 🔥 기가차드 윈도우 관리자
 * Loop Typing Analytics - Window Manager
 */

import { BrowserWindow, screen } from 'electron';
import { join } from 'path';
import { isDev } from '../utils/environment';
import { log } from '../../shared/logger';

/**
 * 메인 윈도우 생성
 */
export async function createMainWindow(): Promise<BrowserWindow> {
  log.gigachad('WindowManager', '메인 윈도우 생성 중...');

  // 화면 크기 정보 가져오기
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // 윈도우 기본 설정
  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    width: Math.min(1400, screenWidth * 0.9),
    height: Math.min(900, screenHeight * 0.9),
    minWidth: 800,
    minHeight: 600,
    show: false, // 준비되면 보이기
    
    // 웹 보안 설정
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },

    // UI 설정 - OS 네이티브 헤더바 사용
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: true, // OS 네이티브 프레임 사용
    autoHideMenuBar: false, // 메뉴바 표시
    icon: join(__dirname, '../../public/icon.png')
  };

  const mainWindow = new BrowserWindow(windowOptions);

  // 개발 환경에서는 Next.js dev 서버 (포트 5500), 프로덕션에서는 빌드된 파일
  const startUrl = isDev 
    ? 'http://localhost:5500' 
    : `file://${join(__dirname, '../renderer/out/index.html')}`;

  log.info('WindowManager', `로딩 URL: ${startUrl}`);

  try {
    await mainWindow.loadURL(startUrl);
    
    // 준비되면 윈도우 표시
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      mainWindow.focus();
      centerWindow(mainWindow);
      
      // 개발 환경에서 DevTools 별도 창으로 열기
      if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
      }
      
      log.success('WindowManager', '✅ 메인 윈도우 표시 완료');
    });

    // 더 짧은 Fallback으로 수정
    setTimeout(() => {
      if (!mainWindow.isVisible()) {
        log.warn('WindowManager', '🔧 윈도우 강제 표시 (Fallback)');
        mainWindow.show();
        mainWindow.focus();
        centerWindow(mainWindow);
        
        // DevTools도 함께 열기
        if (isDev) {
          mainWindow.webContents.openDevTools({ mode: 'detach' });
        }
      }
    }, 1500); // 3초에서 1.5초로 단축

  } catch (error) {
    log.error('WindowManager', '윈도우 로딩 실패', error);
    throw error;
  }

  // 윈도우 이벤트 핸들러
  mainWindow.on('closed', () => {
    log.info('WindowManager', '메인 윈도우 닫힘');
  });

  mainWindow.webContents.on('render-process-gone', () => {
    log.error('WindowManager', '렌더러 프로세스 크래시');
  });

  mainWindow.webContents.on('unresponsive', () => {
    log.warn('WindowManager', '렌더러 프로세스 응답 없음');
  });

  mainWindow.webContents.on('responsive', () => {
    log.success('WindowManager', '렌더러 프로세스 응답 복구');
  });

  // 보안: 새 윈도우 차단
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  return mainWindow;
}

/**
 * 윈도우 중앙 배치
 */
export function centerWindow(window: BrowserWindow): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const [windowWidth, windowHeight] = window.getSize();
  
  const x = Math.round((screenWidth - windowWidth) / 2);
  const y = Math.round((screenHeight - windowHeight) / 2);
  
  window.setPosition(x, y);
}

/**
 * 윈도우 최소화 방지
 */
export function preventMinimize(window: BrowserWindow): void {
  window.on('minimize', () => {
    window.hide();
  });
}

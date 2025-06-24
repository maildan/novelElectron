/**
 * 🔥 기가차드 윈도우 관리자
 * Loop Typing Analytics - Window Manager
 */

import { BrowserWindow, screen } from 'electron';
import { join } from 'path';
import { isDev } from '../utils/environment';

/**
 * 메인 윈도우 생성
 */
export async function createMainWindow(): Promise<BrowserWindow> {
  console.log('🪟 기가차드 메인 윈도우 생성 중...');

  // 화면 크기 정보 가져오기
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // 윈도우 기본 설정
  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    width: Math.min(1400, screenWidth * 0.9),
    height: Math.min(900, screenHeight * 0.9),
    minWidth: 800,
    minHeight: 600,
    show: false, // 준비될 때까지 숨김
    center: true, // 중앙 배치
    
    // 웹 보안 설정
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },

    // UI 설정 - OS 네이티브 타이틀바 사용
    titleBarStyle: 'default',
    frame: true,
    icon: join(__dirname, '../../public/icon.png')
  };

  const mainWindow = new BrowserWindow(windowOptions);

  // 개발 환경에서는 Next.js dev 서버 (포트 5500), 프로덕션에서는 빌드된 파일
  const startUrl = isDev 
    ? 'http://localhost:5500' 
    : `file://${join(__dirname, '../renderer/out/index.html')}`;

  console.log(`🌐 로딩 URL: ${startUrl}`);

  try {
    await mainWindow.loadURL(startUrl);
    
    // 준비되면 추가 설정
    mainWindow.once('ready-to-show', () => {
      console.log('🌐 웹 콘텐츠 로드 완료');
      
      // 윈도우 표시
      mainWindow.show();
      mainWindow.focus();
      console.log('✅ 콘텐츠 로드 성공');
      
      // 개발 환경에서 DevTools 자동 열기
      if (isDev) {
        mainWindow.webContents.openDevTools();
        console.log('🔥 개발 환경: DevTools 자동 열림!');
      }
      
      console.log('✅ 기가차드 메인 윈도우 생성 완료!');
    });

  } catch (error) {
    console.error('❌ 윈도우 로딩 실패:', error);
    throw error;
  }

  // 윈도우 이벤트 핸들러
  mainWindow.on('closed', () => {
    console.log('🪟 메인 윈도우 닫힘');
  });

  mainWindow.webContents.on('render-process-gone', () => {
    console.error('💥 렌더러 프로세스 크래시');
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.warn('⚠️ 렌더러 프로세스 응답 없음');
  });

  mainWindow.webContents.on('responsive', () => {
    console.log('✅ 렌더러 프로세스 응답 복구');
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

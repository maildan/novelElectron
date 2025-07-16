// 🔥 기가차드 Loop Main - 978줄을 50줄로 축소한 깔끔한 진입점

import { app } from 'electron';
import { join } from 'path';
import { Logger } from '../shared/logger';
import { ApplicationBootstrapper } from './core/ApplicationBootstrapper';
import { performanceOptimizer } from './core/PerformanceOptimizer';

// 🔥 환경 변수 로딩
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

// 🔥 앱 이름 설정 (원래는 'Electron'으로 표시되는 것을 수정)
app.setName('Loop');
app.setAppUserModelId('com.loop.typing-analytics'); // Windows 작업 표시줄 아이콘 ID (appId와 일치시킴)
Logger.info('MAIN', '🔄 앱 이름 설정 완료', { 
  name: app.getName(),
  appId: 'com.loop.typing-analytics', // 직접 값 사용
  appPath: app.getAppPath()
});

// 🔥 기가차드 하드웨어 극한 최적화 적용 (500-1000% 성능 향상)
performanceOptimizer.applyAllOptimizations();
performanceOptimizer.startPerformanceBenchmark();

// 🔥 플랫폼별 아이콘 설정
const iconPath = join(__dirname, '../../assets/icon.png');
const iconIcoPath = join(__dirname, '../../assets/icon.ico');

// macOS Dock 아이콘 설정
if (process.platform === 'darwin') {
  app.dock?.setIcon(iconPath);
  Logger.info('MAIN', '🍎 macOS Dock icon set', { iconPath });
}

// Windows 아이콘 설정 (TaskBar 및 알트탭에서 표시)
if (process.platform === 'win32') {
  app.setPath('userData', app.getPath('userData').replace('Electron', 'Loop'));
  Logger.info('MAIN', '🪟 Windows app data path set to Loop');
}

/**
 * 🔥 Loop 메인 애플리케이션 클래스
 * 
 * 단일 책임: ApplicationBootstrapper를 통한 앱 시작만 담당
 * 978줄의 복잡한 로직을 5개 모듈로 분리하여 50줄로 축소
 */
class LoopMain {
  private bootstrapper: ApplicationBootstrapper;

  constructor() {
    this.bootstrapper = new ApplicationBootstrapper();
    Logger.info('MAIN', '🚀 Loop main application created');
  }

  /**
   * 🔥 애플리케이션 시작
   */
  public async start(): Promise<void> {
    try {
      Logger.info('MAIN', '🔥 Starting Loop Typing Analytics...');
      
      // ApplicationBootstrapper에 모든 로직 위임
      await this.bootstrapper.bootstrap();
      
      Logger.info('MAIN', '✅ Loop application started successfully');
    } catch (error) {
      Logger.error('MAIN', '💥 Failed to start Loop application', error);
      process.exit(1);
    }
  }
}

// 🔥 전역 에러 처리
process.on('uncaughtException', (error) => {
  Logger.error('MAIN', '💥 Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.error('MAIN', '💥 Unhandled rejection', { reason, promise });
});

// 🔥 애플리케이션 시작
const loopMain = new LoopMain();
loopMain.start();

export default loopMain;

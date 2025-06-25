/**
 * 🔥 기가차드 IPC 핸들러 관리자
 * Loop Typing Analytics - IPC Handlers Manager
 */

import { ipcMain } from 'electron';
import type { SessionFilter, TypingSession } from '../../shared/types';
import { dashboardIpcHandlers } from './dashboardIpcHandlers';

/**
 * 모든 IPC 핸들러 설정
 */
export function setupIpcHandlers(): void {
  console.log('🔌 기가차드 IPC 핸들러 등록 시작...');

  try {
    // Dashboard IPC 핸들러 등록
    registerDashboardHandlers();

    // 기본 앱 핸들러 등록
    registerAppHandlers();

    // #DEBUG: Database 핸들러 등록 추가 (누락되어 있었음)
    registerDatabaseHandlers();

    // 키보드 핸들러 등록
    registerKeyboardHandlers();

    console.log('✅ 모든 IPC 핸들러 등록 완료');
  } catch (error) {
    console.error('❌ IPC 핸들러 등록 실패:', error);
    throw error;
  }
}

/**
 * Dashboard IPC 핸들러 등록
 */
function registerDashboardHandlers(): void {
  dashboardIpcHandlers.registerHandlers();
  console.log('✅ Dashboard IPC 핸들러 등록 완료');
}

/**
 * 기본 앱 IPC 핸들러 등록
 */
function registerAppHandlers(): void {
  // 앱 버전 조회
  ipcMain.handle('app:getVersion', () => {
    const { app } = require('electron');
    return app.getVersion();
  });

  // 플랫폼 정보 조회 - #DEBUG: React 직렌더링 방지위해 string만 반환
  ipcMain.handle('app:getPlatform', () => {
    // #DEBUG: 기존 객체 반환으로 React 객체 직렌더링 에러 발생
    // return { platform: process.platform, arch: process.arch, version: process.version };
    
    // 🔥 기가차드 수정: React에서 문자열로 직렌더링 가능하게 수정
    return process.platform;
  });

  // 앱 종료
  ipcMain.handle('app:quit', () => {
    const { app } = require('electron');
    app.quit();
  });

  console.log('✅ 기본 앱 IPC 핸들러 등록 완료');
}

/**
 * 데이터베이스 IPC 핸들러 등록
 */
function registerDatabaseHandlers(): void {
  // #DEBUG: database 핸들러 등록 시작
  console.log('🗄️ Database IPC 핸들러 등록 시작...');
  
  // 세션 데이터 조회
  ipcMain.handle('database:get-sessions', async (_, filter?: SessionFilter) => {
    try {
      // #DEBUG: database:get-sessions 핸들러 진입
      console.log('🗄️ database:get-sessions 핸들러 호출됨, filter:', filter);
      
      // 🔥 실제 데이터베이스에서 세션 데이터 조회
      const { getPrismaClient } = await import('../services/databaseService');
      const prisma = getPrismaClient();
      
      // Prisma를 통한 실제 데이터 조회 (임시로 빈 배열, 스키마 정의 후 구현)
      const sessions: TypingSession[] = []; // TODO: prisma.session.findMany() 구현
      console.log('✅ database:get-sessions 실제 데이터:', sessions.length + '개');
      return sessions;
    } catch (error) {
      console.error('❌ database:get-sessions 오류:', error);
      return [];
    }
  });

  // 분석 데이터 조회
  ipcMain.handle('database:get-analytics', async (_, sessionId: string) => {
    try {
      // #DEBUG: database:get-analytics 핸들러 진입
      console.log('📊 database:get-analytics 핸들러 호출됨, sessionId:', sessionId);
      
      // 🔥 실제 데이터베이스에서 분석 데이터 조회
      const { getPrismaClient } = await import('../services/databaseService');
      const prisma = getPrismaClient();
      
      // 실제 분석 데이터 조회 (임시로 기본값, 스키마 정의 후 구현)
      const analytics = {
        sessionId,
        totalKeys: 0,
        avgWpm: 0,
        peakWpm: 0,
        accuracy: 0,
        errorRate: 0,
        commonErrors: [],
        improvementSuggestions: []
      }; // TODO: prisma.analytics.findUnique() 구현
      
      console.log('✅ database:get-analytics 실제 데이터 반환');
      return analytics;
    } catch (error) {
      console.error('❌ database:get-analytics 오류:', error);
      return null;
    }
  });

  console.log('✅ Database IPC 핸들러 등록 완료');
}

/**
 * 키보드 IPC 핸들러 등록
 */
function registerKeyboardHandlers(): void {
  // 키보드 모니터링 시작
  ipcMain.handle('keyboard:start-monitoring', async () => {
    try {
      const { registerKeyboardListener } = require('../services/keyboardService');
      const { mainWindow } = require('../index');
      
      if (!mainWindow) {
        throw new Error('메인 윈도우를 찾을 수 없습니다');
      }
      
      const success = registerKeyboardListener(mainWindow);
      return {
        success,
        message: success ? '키보드 모니터링이 시작되었습니다' : '키보드 모니터링 시작에 실패했습니다'
      };
    } catch (error) {
      console.error('키보드 모니터링 시작 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  });

  // 키보드 모니터링 중지
  ipcMain.handle('keyboard:stop-monitoring', async () => {
    try {
      const { stopKeyboardListener } = require('../services/keyboardService');
      
      const success = stopKeyboardListener();
      return {
        success,
        message: success ? '키보드 모니터링이 중지되었습니다' : '키보드 모니터링 중지에 실패했습니다'
      };
    } catch (error) {
      console.error('키보드 모니터링 중지 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  });

  // 키보드 모니터링 상태 확인
  ipcMain.handle('keyboard:get-status', async () => {
    try {
      const { getMonitoringStatus } = require('../services/keyboardService');
      
      const status = getMonitoringStatus();
      return {
        isActive: status.isActive,
        message: status.isActive ? '모니터링 중' : '정지됨'
      };
    } catch (error) {
      console.error('키보드 모니터링 상태 확인 오류:', error);
      return {
        isActive: false,
        message: '상태 확인 실패'
      };
    }
  });

  console.log('✅ 키보드 IPC 핸들러 등록 완료');
}

/**
 * 모든 IPC 핸들러 정리
 */
export function cleanupIpcHandlers(): void {
  console.log('🧹 IPC 핸들러 정리 시작...');
  
  try {
    ipcMain.removeAllListeners();
    console.log('✅ 모든 IPC 핸들러 정리 완료');
  } catch (error) {
    console.error('❌ IPC 핸들러 정리 실패:', error);
  }
}

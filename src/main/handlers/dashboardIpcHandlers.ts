/**
 * 🔥 기가차드 IPC 핸들러 - Dashboard 백엔드 연결
 */

import { ipcMain, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '@shared/types';
import { getPrismaClient } from '../services/databaseService';
import { registerKeyboardListener, stopKeyboardListener } from '../services/keyboardService';

export class DashboardIpcHandlers {
  private static instance: DashboardIpcHandlers;
  private mainWindow: BrowserWindow | null = null;

  public static getInstance(): DashboardIpcHandlers {
    if (!DashboardIpcHandlers.instance) {
      DashboardIpcHandlers.instance = new DashboardIpcHandlers();
    }
    return DashboardIpcHandlers.instance;
  }

  public setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }

  private async ensureDefaultUser(): Promise<string> {
    try {
      const prisma = getPrismaClient();
      
      // 기본 사용자가 있는지 확인
      let user = await prisma.user.findFirst();
      
      if (!user) {
        // 기본 사용자 생성
        user = await prisma.user.create({
          data: {
            name: 'Default User',
            email: 'user@loop.app',
          }
        });
        console.log('🔥 기본 사용자 생성됨:', user.id);
      }
      
      return user.id;
    } catch (error) {
      console.error('기본 사용자 확인/생성 오류:', error);
      throw error;
    }
  }

  public registerHandlers(): void {
    // 키보드 모니터링 시작/중지
    ipcMain.handle('dashboard:start-monitoring', async () => {
      try {
        if (!this.mainWindow) throw new Error('Main window not available');
        
        const success = registerKeyboardListener(this.mainWindow);
        return { success, message: success ? '모니터링 시작됨' : '모니터링 시작 실패' };
      } catch (error) {
        console.error('모니터링 시작 오류:', error);
        return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' };
      }
    });

    ipcMain.handle('dashboard:stop-monitoring', async () => {
      try {
        const success = stopKeyboardListener();
        return { success, message: success ? '모니터링 중지됨' : '모니터링 중지 실패' };
      } catch (error) {
        console.error('모니터링 중지 오류:', error);
        return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' };
      }
    });

    // 최근 로그 데이터 가져오기
    ipcMain.handle('dashboard:get-recent-logs', async (_, limit = 10) => {
      try {
        const prisma = getPrismaClient();
        const sessions = await prisma.typingSession.findMany({
          take: limit,
          orderBy: { startTime: 'desc' },
          select: {
            id: true,
            appName: true,
            windowTitle: true,
            duration: true,
            totalKeys: true,
            totalWords: true,
            totalChars: true,
            wpm: true,
            accuracy: true,
            startTime: true,
            endTime: true,
          }
        });

        return {
          success: true,
          data: sessions.map((session: any) => ({
            id: session.id,
            content: session.windowTitle || session.appName,
            keyCount: session.totalKeys,
            typingTime: session.duration,
            timestamp: session.startTime.toISOString(),
            wpm: Math.round(session.wpm),
            accuracy: Math.round(session.accuracy),
            totalChars: session.totalChars,
          }))
        };
      } catch (error) {
        console.error('최근 로그 조회 오류:', error);
        return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' };
      }
    });

    // 타이핑 통계 가져오기
    ipcMain.handle('dashboard:get-stats', async () => {
      try {
        const prisma = getPrismaClient();
        
        // 오늘 통계
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayStats = await prisma.typingSession.aggregate({
          where: {
            startTime: { gte: today }
          },
          _sum: {
            totalKeys: true,
            duration: true,
          },
          _avg: {
            wpm: true,
            accuracy: true,
          },
          _count: {
            id: true,
          }
        });

        // 이번 주 통계
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);
        
        const weekStats = await prisma.typingSession.aggregate({
          where: {
            startTime: { gte: thisWeek }
          },
          _sum: {
            totalKeys: true,
            duration: true,
          },
          _avg: {
            wpm: true,
            accuracy: true,
          },
          _count: {
            id: true,
          }
        });

        return {
          success: true,
          data: {
            today: {
              keyCount: todayStats._sum.totalKeys || 0,
              typingTime: todayStats._sum.duration || 0,
              avgWpm: Math.round(todayStats._avg.wpm || 0),
              avgAccuracy: Math.round(todayStats._avg.accuracy || 0),
              sessions: todayStats._count.id || 0,
            },
            week: {
              keyCount: weekStats._sum.totalKeys || 0,
              typingTime: weekStats._sum.duration || 0,
              avgWpm: Math.round(weekStats._avg.wpm || 0),
              avgAccuracy: Math.round(weekStats._avg.accuracy || 0),
              sessions: weekStats._count.id || 0,
            }
          }
        };
      } catch (error) {
        console.error('통계 조회 오류:', error);
        return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' };
      }
    });

    // 타이핑 로그 저장
    ipcMain.handle('dashboard:save-typing-log', async (_, logData) => {
      try {
        const prisma = getPrismaClient();
        const { content, keyCount, typingTime, wpm, accuracy } = logData;
        
        // 기본 사용자 확인/생성
        const userId = await this.ensureDefaultUser();

        // TypingSession 생성
        const savedSession = await prisma.typingSession.create({
          data: {
            userId,
            appName: 'Loop App',
            windowTitle: content || 'Typing Practice',
            duration: Math.floor(typingTime / 1000), // 밀리초를 초로 변환
            totalKeys: keyCount,
            totalWords: content ? content.trim().split(/\s+/).length : 0,
            totalChars: content ? content.length : 0,
            wpm: wpm || Math.round((keyCount / (typingTime / 1000)) * 60),
            accuracy: accuracy || 100,
            platform: process.platform,
            endTime: new Date(),
          }
        });

        return {
          success: true,
          data: {
            id: savedSession.id,
            content: savedSession.windowTitle,
            keyCount: savedSession.totalKeys,
            typingTime: savedSession.duration * 1000, // 초를 밀리초로 변환
            timestamp: savedSession.startTime.toISOString(),
            wpm: savedSession.wpm,
            accuracy: savedSession.accuracy,
          }
        };
      } catch (error) {
        console.error('타이핑 로그 저장 오류:', error);
        return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' };
      }
    });

    console.log('🔥 Dashboard IPC 핸들러 등록 완료!');
  }

  public cleanup(): void {
    const channels = [
      'dashboard:start-monitoring',
      'dashboard:stop-monitoring', 
      'dashboard:get-recent-logs',
      'dashboard:get-stats',
      'dashboard:save-typing-log'
    ];

    channels.forEach(channel => {
      ipcMain.removeAllListeners(channel);
    });

    console.log('🛑 Dashboard IPC 핸들러 정리 완료');
  }
}

export const dashboardIpcHandlers = DashboardIpcHandlers.getInstance();

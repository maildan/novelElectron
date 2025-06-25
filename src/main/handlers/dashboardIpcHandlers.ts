import { Logger } from "../../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 IPC 핸들러 - Dashboard 백엔드 연결
 */

import { ipcMain, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '@shared/types';
import { getPrismaClient } from '../services/databaseService';
import { registerKeyboardListener, stopKeyboardListener } from '../services/keyboardService';
import { GigaChadLogger } from '../keyboard/logger';

const logger = GigaChadLogger.getInstance();

// 🔥 Prisma 세션 타입 정의 - any 박살내기
interface PrismaTypingSession {
  id: string;
  windowTitle?: string | null;
  appName?: string | null;
  totalKeys: number;
  duration: number;
  startTime: Date;
  wpm: number;
  accuracy: number;
  totalChars: number;
  endTime?: Date | null;
}

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
        GigaChadLogger.info('DashboardIPC', '🔥 기본 사용자 생성됨: ' + user.id);
      }
      
      return user.id;
    } catch (error) {
      GigaChadLogger.error('DashboardIPC', '기본 사용자 확인/생성 오류', error);
      throw error;
    }
  }

  public registerHandlers(): void {
    // 키보드 모니터링 시작/중지
    ipcMain.handle('dashboard:start-monitoring', async () => {
      try {
        if (!this.mainWindow) throw new Error('Main window not available');
        
        await registerKeyboardListener();
        return { success: true, message: '모니터링 시작됨' };
      } catch (error: unknown) {
        GigaChadLogger.error('모니터링 시작 오류', error instanceof Error ? error.message : String(error));
        return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' };
      }
    });

    ipcMain.handle('dashboard:stop-monitoring', async () => {
      try {
        await stopKeyboardListener();
        return { success: true, message: '모니터링 중지됨' };
      } catch (error: unknown) {
        GigaChadLogger.error('모니터링 중지 오류', error instanceof Error ? error.message : String(error));
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
          data: sessions.map((session: PrismaTypingSession) => ({
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
        GigaChadLogger.error('DashboardIPC', '최근 로그 조회 오류', error);
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
        GigaChadLogger.error('DashboardIPC', '통계 조회 오류', error);
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
        GigaChadLogger.error('DashboardIPC', '타이핑 로그 저장 오류', error);
        return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' };
      }
    });

    // 🔥 데이터베이스 세션 가져오기 - Dashboard에서 요청
    ipcMain.handle('database:get-sessions', async (_, limit = 50) => {
      try {
        const prisma = getPrismaClient();
        const sessions = await prisma.typingSession.findMany({
          take: limit,
          orderBy: { startTime: 'desc' },
          select: {
            id: true,
            windowTitle: true,
            appName: true,
            totalKeys: true,
            duration: true,
            startTime: true,
            endTime: true,
            wpm: true,
            accuracy: true,
            totalChars: true,
          }
        });

        // 🔥 타입 안전 변환 - any 박살!
        const convertedSessions = sessions.map(session => ({
          id: session.id,
          sessionId: session.id, // Dashboard 호환성
          windowTitle: session.windowTitle || '',
          appName: session.appName || '',
          totalKeys: session.totalKeys,
          duration: session.duration,
          timestamp: session.startTime.toISOString(),
          wpm: session.wpm,
          accuracy: session.accuracy,
          content: `${session.appName || 'Unknown'} - ${session.totalKeys} keys`,
        }));

        log.info('DashboardIPC', `데이터베이스에서 ${convertedSessions.length}개 세션 반환`);
        return convertedSessions;
      } catch (error: unknown) {
        log.error('DashboardIPC', '세션 데이터 조회 오류', error as unknown);
        return [];
      }
    });

    // 분석 데이터 가져오기
    ipcMain.handle('database:get-analytics', async () => {
      try {
        const prisma = getPrismaClient();
        
        // 기본 통계 수집
        const totalSessions = await prisma.typingSession.count();
        const avgWpm = await prisma.typingSession.aggregate({
          _avg: { wpm: true }
        });
        const avgAccuracy = await prisma.typingSession.aggregate({
          _avg: { accuracy: true }
        });
        const totalKeys = await prisma.typingSession.aggregate({
          _sum: { totalKeys: true }
        });
        
        // 최근 7일 데이터
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentSessions = await prisma.typingSession.findMany({
          where: {
            startTime: {
              gte: sevenDaysAgo
            }
          },
          select: {
            startTime: true,
            wpm: true,
            accuracy: true,
            totalKeys: true,
            appName: true
          },
          orderBy: { startTime: 'desc' }
        });

        // 앱별 통계
        const appStats = await prisma.typingSession.groupBy({
          by: ['appName'],
          _count: { appName: true },
          _avg: { wpm: true, accuracy: true },
          _sum: { totalKeys: true }
        });

        const analytics = {
          overview: {
            totalSessions,
            avgWpm: avgWpm._avg.wpm || 0,
            avgAccuracy: avgAccuracy._avg.accuracy || 0,
            totalKeys: totalKeys._sum.totalKeys || 0
          },
          recentActivity: recentSessions.map(session => ({
            date: session.startTime.toISOString(),
            wpm: session.wpm,
            accuracy: session.accuracy,
            keys: session.totalKeys,
            app: session.appName || 'Unknown'
          })),
          appBreakdown: appStats.map(stat => ({
            app: stat.appName || 'Unknown',
            sessions: stat._count.appName,
            avgWpm: stat._avg.wpm || 0,
            avgAccuracy: stat._avg.accuracy || 0,
            totalKeys: stat._sum.totalKeys || 0
          }))
        };

        log.info('DashboardIPC', `분석 데이터 반환: ${totalSessions} 세션`);
        return analytics;
      } catch (error: unknown) {
        log.error('DashboardIPC', '분석 데이터 조회 오류', error as unknown);
        return {
          overview: { totalSessions: 0, avgWpm: 0, avgAccuracy: 0, totalKeys: 0 },
          recentActivity: [],
          appBreakdown: []
        };
      }
    });

    log.info("Console", '🔥 Dashboard IPC 핸들러 등록 완료!');
  }

  public cleanup(): void {
    const channels = [
      'dashboard:start-monitoring',
      'dashboard:stop-monitoring', 
      'dashboard:get-recent-logs',
      'dashboard:get-stats',
      'dashboard:save-typing-log',
      'database:get-sessions',
      'database:get-analytics'
    ];

    channels.forEach(channel => {
      ipcMain.removeAllListeners(channel);
    });

    log.info("Console", '🛑 Dashboard IPC 핸들러 정리 완료');
  }
}

export const dashboardIpcHandlers = DashboardIpcHandlers.getInstance();

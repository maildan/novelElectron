/**
 * 🔥 기가차드 데이터베이스 매니저
 * Loop Typing Analytics - Database Manager
 */

import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { app } from 'electron';
import { DatabaseSession } from '@shared/types';
import { Logger } from '../../shared/logger';
import { trackPerformance, BenchmarkMetrics } from '@shared/common';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private prisma: PrismaClient | null = null;

  private constructor() {
    // #DEBUG: 데이터베이스 매니저 생성자
    Logger.debug('DatabaseManager', '🏗️ DatabaseManager 인스턴스 생성');
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      // #DEBUG: 싱글톤 인스턴스 생성
      Logger.debug('DatabaseManager', '새로운 DatabaseManager 인스턴스 생성');
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * 데이터베이스 초기화
   */
  async initialize(): Promise<void> {
    // #DEBUG: 데이터베이스 매니저 초기화 시작
    Logger.gigachad('DatabaseManager', '🗄️ 기가차드 데이터베이스 매니저: 초기화 시작...');

    try {
      // Prisma 클라이언트 생성
      // #DEBUG: Prisma 클라이언트 생성
      Logger.debug('DatabaseManager', 'Prisma 클라이언트 생성 중...');
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: `file:${join(app.getPath('userData'), 'loop.db')}`
          }
        },
        log: ['error', 'warn']
      });

      // 데이터베이스 연결 테스트
      // #DEBUG: 데이터베이스 연결 시도
      Logger.debug('DatabaseManager', '데이터베이스 연결 테스트 중...');
      await this.prisma.$connect();
      Logger.success('DatabaseManager', '✅ 데이터베이스 연결 성공');

      // 마이그레이션 실행 (필요한 경우)
      // #DEBUG: 마이그레이션 실행
      Logger.debug('DatabaseManager', '마이그레이션 실행 중...');
      await this.runMigrations();

      Logger.gigachad('DatabaseManager', '✅ 데이터베이스 매니저 초기화 완료');
    } catch (error) {
      // #DEBUG: 초기화 실패
      Logger.error('DatabaseManager', '❌ 데이터베이스 매니저 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 마이그레이션 실행
   */
  private async runMigrations(): Promise<void> {
    try {
      // 개발 환경에서는 push 사용 (자동 스키마 동기화)
      if (process.env.NODE_ENV === 'development') {
        Logger.info("Console", '🔄 개발 환경: 스키마 동기화 중...');
        // prisma db push 로직은 CLI에서 실행하므로 여기서는 생략
      }
      
      Logger.info("Console", '✅ 데이터베이스 마이그레이션 완료');
    } catch (error) {
      Logger.error("Console", '❌ 데이터베이스 마이그레이션 실패:', error);
      // 마이그레이션 실패는 치명적이지 않을 수 있음
    }
  }

  /**
   * Prisma 클라이언트 가져오기
   */
  getPrisma(): PrismaClient {
    if (!this.prisma) {
      throw new Error('데이터베이스가 초기화되지 않았습니다. initialize()를 먼저 호출하세요.');
    }
    return this.prisma;
  }

  /**
   * 타이핑 세션 생성
   */
  async createTypingSession(data: {
    userId: string;
    appName: string;
    windowTitle?: string;
    platform: string;
  }) {
    // #DEBUG: 타이핑 세션 생성 시작
    Logger.debug('DatabaseManager', '타이핑 세션 생성 중...', data);
    
    const prisma = this.getPrisma();
    
    const result = await prisma.typingSession.create({
      data: {
        userId: data.userId,
        appName: data.appName,
        windowTitle: data.windowTitle,
        platform: data.platform,
        totalKeys: 0,
        totalWords: 0,
        totalChars: 0
      }
    });

    // #DEBUG: 타이핑 세션 생성 완료
    Logger.success('DatabaseManager', '타이핑 세션 생성 완료', { sessionId: result.id });
    return result;
  }

  /**
   * 키 이벤트 생성
   */
  async createKeyEvent(data: {
    sessionId: string;
    keyCode: number;
    keyName: string;
    eventType: string;
    appName: string;
    windowTitle?: string;
  }) {
    const prisma = this.getPrisma();
    
    return await prisma.keyEvent.create({
      data: {
        sessionId: data.sessionId,
        keyCode: data.keyCode,
        keyName: data.keyName,
        eventType: data.eventType,
        appName: data.appName,
        windowTitle: data.windowTitle
      }
    });
  }

  /**
   * 타이핑 세션 업데이트
   */
  async updateTypingSession(id: string, data: {
    endTime?: Date;
    duration?: number;
    totalKeys?: number;
    totalWords?: number;
    totalChars?: number;
    wpm?: number;
    cpm?: number;
    accuracy?: number;
  }) {
    const prisma = this.getPrisma();
    
    return await prisma.typingSession.update({
      where: { id },
      data
    });
  }

  /**
   * 대시보드 데이터 가져오기
   */
  async getDashboardData() {
    const prisma = this.getPrisma();
    
    const [sessions, keyEvents, recentSessions] = await Promise.all([
      // 총 세션 수
      prisma.typingSession.count(),
      
      // 총 키 이벤트 수
      prisma.keyEvent.count(),
      
      // 최근 세션들
      prisma.typingSession.findMany({
        take: 10,
        orderBy: { startTime: 'desc' },
        include: {
          keyEvents: {
            take: 1
          }
        }
      })
    ]);

    return {
      totalSessions: sessions,
      totalKeyEvents: keyEvents,
      recentSessions
    };
  }

  /**
   * 통계 데이터 가져오기
   */
  async getStatistics(days: number = 7) {
    const prisma = this.getPrisma();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await prisma.typingSession.findMany({
      where: {
        startTime: {
          gte: startDate
        }
      },
      include: {
        keyEvents: true
      }
    });

    return {
      totalSessions: sessions.length,
      totalKeys: sessions.reduce((sum, session) => sum + session.totalKeys, 0),
      totalTime: sessions.reduce((sum, session) => sum + session.duration, 0),
      dailyStats: this.calculateDailyStats(sessions)
    };
  }

  /**
   * 일별 통계 계산
   */
  private calculateDailyStats(sessions: Array<{
    id: string;
    startTime: Date;
    endTime: Date | null;
    duration: number;
    totalKeys: number;
    keyEvents?: unknown[];
  }>) {
    const dailyStats = new Map();

    sessions.forEach(session => {
      const date = session.startTime.toDateString();
      if (!dailyStats.has(date)) {
        dailyStats.set(date, {
          date,
          sessions: 0,
          keys: 0,
          time: 0
        });
      }

      const stats = dailyStats.get(date);
      stats.sessions += 1;
      stats.keys += session.totalKeys;
      stats.time += session.duration;
    });

    return Array.from(dailyStats.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  /**
   * 특정 세션 조회
   */
  async getSession(sessionId: string) {
    const prisma = this.getPrisma();
    
    return await prisma.typingSession.findUnique({
      where: { id: sessionId },
      include: {
        keyEvents: true
      }
    });
  }

  /**
   * 세션별 분석 데이터 조회
   */
  async getSessionAnalytics(sessionId: string) {
    const session = await this.getSession(sessionId);
    if (!session) return null;

    // 타임라인 데이터 생성 (간단한 예시)
    const timeline = session.keyEvents
      .reduce((acc, event, index) => {
        if (index % 10 === 0) { // 10개마다 샘플링
          acc.push({
            time: index / 10,
            wpm: session.wpm || 0
          });
        }
        return acc;
      }, [] as Array<{ time: number; wpm: number }>);

    return {
      sessionId,
      wpm: session.wpm || 0,
      accuracy: session.accuracy || 0,
      keyCount: session.totalKeys || 0,
      errors: session.keyEvents.filter(e => e.eventType === 'error').length,
      timeline
    };
  }

  /**
   * 정리
   */
  async cleanup(): Promise<void> {
    Logger.info("Console", '🧹 데이터베이스 매니저 정리 중...');

    try {
      if (this.prisma) {
        await this.prisma.$disconnect();
        this.prisma = null;
        Logger.info("Console", '✅ 데이터베이스 연결 해제 완료');
      }

      Logger.info("Console", '✅ 데이터베이스 매니저 정리 완료');
    } catch (error) {
      Logger.error("Console", '❌ 데이터베이스 정리 실패:', error);
    }
  }
}

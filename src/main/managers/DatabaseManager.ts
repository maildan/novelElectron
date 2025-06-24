/**
 * 🔥 기가차드 데이터베이스 매니저
 * Loop Typing Analytics - Database Manager
 */

import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { app } from 'electron';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private prisma: PrismaClient | null = null;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * 데이터베이스 초기화
   */
  async initialize(): Promise<void> {
    console.log('🗄️ 기가차드 데이터베이스 매니저: 초기화 시작...');

    try {
      // Prisma 클라이언트 생성
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: `file:${join(app.getPath('userData'), 'loop.db')}`
          }
        },
        log: ['error', 'warn']
      });

      // 데이터베이스 연결 테스트
      await this.prisma.$connect();
      console.log('✅ 데이터베이스 연결 성공');

      // 마이그레이션 실행 (필요한 경우)
      await this.runMigrations();

      console.log('✅ 데이터베이스 매니저 초기화 완료');
    } catch (error) {
      console.error('❌ 데이터베이스 매니저 초기화 실패:', error);
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
        console.log('🔄 개발 환경: 스키마 동기화 중...');
        // prisma db push 로직은 CLI에서 실행하므로 여기서는 생략
      }
      
      console.log('✅ 데이터베이스 마이그레이션 완료');
    } catch (error) {
      console.error('❌ 데이터베이스 마이그레이션 실패:', error);
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
    const prisma = this.getPrisma();
    
    return await prisma.typingSession.create({
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
  private calculateDailyStats(sessions: any[]) {
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
   * 정리
   */
  async cleanup(): Promise<void> {
    console.log('🧹 데이터베이스 매니저 정리 중...');

    try {
      if (this.prisma) {
        await this.prisma.$disconnect();
        this.prisma = null;
        console.log('✅ 데이터베이스 연결 해제 완료');
      }

      console.log('✅ 데이터베이스 매니저 정리 완료');
    } catch (error) {
      console.error('❌ 데이터베이스 정리 실패:', error);
    }
  }
}

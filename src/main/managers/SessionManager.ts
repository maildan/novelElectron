// 🔥 기가차드 세션 관리자 - 타이핑 세션 관리

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result, TypingSession } from '../../shared/types';
import { EventEmitter } from 'events';

// #DEBUG: Session manager entry point
Logger.debug('SESSION_MANAGER', 'Session manager module loaded');

// 🔥 기가차드 세션 상태 열거형
export enum SessionState {
  IDLE = 'idle',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
}

// 🔥 기가차드 진행 중인 세션 정보
export interface ActiveSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  keyCount: number;
  content: string;
  language: string;
  windowTitle: string;
  state: SessionState;
  pausedDuration: number;
  errorCount: number;
  wordCount: number;
  characterCount: number;
}

// 🔥 기가차드 세션 통계
export interface SessionStats {
  wpm: number;
  accuracy: number;
  duration: number;
  keyRate: number;
  errorRate: number;
}

// 🔥 기가차드 세션 설정
export interface SessionConfig {
  minDuration: number; // 최소 세션 길이 (ms)
  maxIdleTime: number; // 최대 유휴 시간 (ms)
  autoSave: boolean;
  autoEndOnIdle: boolean;
  trackErrors: boolean;
  calculateWpmRealtime: boolean;
}

/**
 * 🔥 SessionManager - 타이핑 세션 라이프사이클 관리
 * 세션 시작, 일시정지, 종료, 통계 계산 등 관리
 */
export class SessionManager extends BaseManager {
  private readonly componentName = 'SESSION_MANAGER';
  private activeSessions: Map<string, ActiveSession> = new Map();
  private sessionConfig: SessionConfig;
  private idleCheckTimer: NodeJS.Timeout | null = null;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private sessionCounter = 0;

  constructor() {
    super({ name: 'SessionManager', autoStart: true });
    
    this.sessionConfig = {
      minDuration: 10000, // 10초
      maxIdleTime: 300000, // 5분
      autoSave: true,
      autoEndOnIdle: true,
      trackErrors: true,
      calculateWpmRealtime: true,
    };
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing session manager');
    
    this.startIdleCheck();
    
    if (this.sessionConfig.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting session manager');
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping session manager');
    
    // 진행 중인 모든 세션 종료
    await this.endAllSessions();
    
    if (this.idleCheckTimer) {
      clearInterval(this.idleCheckTimer);
      this.idleCheckTimer = null;
    }
    
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up session manager');
    
    this.activeSessions.clear();
  }

  /**
   * 새 세션 시작
   */
  public async startSession(windowTitle: string, language = 'auto'): Promise<Result<string>> {
    try {
      const sessionId = `session_${Date.now()}_${++this.sessionCounter}`;
      const now = new Date();
      
      const session: ActiveSession = {
        id: sessionId,
        startTime: now,
        lastActivity: now,
        keyCount: 0,
        content: '',
        language,
        windowTitle,
        state: SessionState.ACTIVE,
        pausedDuration: 0,
        errorCount: 0,
        wordCount: 0,
        characterCount: 0,
      };

      this.activeSessions.set(sessionId, session);
      
      Logger.info(this.componentName, 'Session started', {
        sessionId,
        windowTitle,
        language,
      });
      
      this.emit('sessionStarted', session);
      
      return { success: true, data: sessionId };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to start session', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 세션에 키 이벤트 추가
   */
  public async addKeyEvent(sessionId: string, key: string, isError = false): Promise<Result<boolean>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      if (session.state !== SessionState.ACTIVE) {
        return { success: false, error: 'Session not active' };
      }

      // 세션 업데이트
      session.lastActivity = new Date();
      session.keyCount++;
      session.content += key;
      
      if (isError && this.sessionConfig.trackErrors) {
        session.errorCount++;
      }

      // 단어와 문자 수 업데이트
      this.updateSessionCounts(session);
      
      // 실시간 WPM 계산
      if (this.sessionConfig.calculateWpmRealtime) {
        this.emit('sessionUpdated', {
          sessionId,
          stats: this.calculateSessionStats(session),
        });
      }

      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to add key event', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 세션 일시정지
   */
  public async pauseSession(sessionId: string): Promise<Result<boolean>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      if (session.state !== SessionState.ACTIVE) {
        return { success: false, error: 'Session not active' };
      }

      session.state = SessionState.PAUSED;
      
      Logger.info(this.componentName, 'Session paused', { sessionId });
      this.emit('sessionPaused', session);
      
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to pause session', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 세션 재개
   */
  public async resumeSession(sessionId: string): Promise<Result<boolean>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      if (session.state !== SessionState.PAUSED) {
        return { success: false, error: 'Session not paused' };
      }

      session.state = SessionState.ACTIVE;
      session.lastActivity = new Date();
      
      Logger.info(this.componentName, 'Session resumed', { sessionId });
      this.emit('sessionResumed', session);
      
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to resume session', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 세션 종료
   */
  public async endSession(sessionId: string, save = true): Promise<Result<TypingSession | null>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      session.state = SessionState.ENDED;
      const endTime = new Date();
      
      // 최소 지속 시간 확인
      const duration = endTime.getTime() - session.startTime.getTime();
      if (duration < this.sessionConfig.minDuration) {
        Logger.debug(this.componentName, 'Session too short, not saving', {
          sessionId,
          duration,
          minDuration: this.sessionConfig.minDuration,
        });
        
        this.activeSessions.delete(sessionId);
        return { success: true, data: null };
      }

      // 타이핑 세션 객체 생성
      const stats = this.calculateSessionStats(session);
      const typingSession: TypingSession = {
        id: sessionId,
        content: session.content,
        startTime: session.startTime,
        endTime,
        keyCount: session.keyCount,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        language: session.language,
        windowTitle: session.windowTitle,
        errors: session.errorCount,
      };

      this.activeSessions.delete(sessionId);
      
      Logger.info(this.componentName, 'Session ended', {
        sessionId,
        duration,
        keyCount: session.keyCount,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
      });
      
      this.emit('sessionEnded', typingSession);
      
      return { success: true, data: save ? typingSession : null };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to end session', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 모든 세션 종료
   */
  private async endAllSessions(): Promise<void> {
    const sessionIds = Array.from(this.activeSessions.keys());
    
    for (const sessionId of sessionIds) {
      await this.endSession(sessionId, true);
    }
  }

  /**
   * 유휴 세션 확인
   */
  private startIdleCheck(): void {
    this.idleCheckTimer = setInterval(() => {
      if (!this.sessionConfig.autoEndOnIdle) return;
      
      const now = Date.now();
      const sessionsToEnd: string[] = [];
      
      for (const [sessionId, session] of this.activeSessions) {
        if (session.state === SessionState.ACTIVE) {
          const idleTime = now - session.lastActivity.getTime();
          
          if (idleTime > this.sessionConfig.maxIdleTime) {
            sessionsToEnd.push(sessionId);
          }
        }
      }
      
      // 유휴 세션들 종료
      for (const sessionId of sessionsToEnd) {
        Logger.debug(this.componentName, 'Ending idle session', { sessionId });
        this.endSession(sessionId, true);
      }
    }, 30000); // 30초마다 확인
  }

  /**
   * 자동 저장
   */
  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      for (const session of this.activeSessions.values()) {
        if (session.state === SessionState.ACTIVE) {
          this.emit('sessionAutoSave', {
            sessionId: session.id,
            stats: this.calculateSessionStats(session),
          });
        }
      }
    }, 60000); // 1분마다
  }

  /**
   * 세션 통계 계산
   */
  private calculateSessionStats(session: ActiveSession): SessionStats {
    const now = Date.now();
    const duration = now - session.startTime.getTime() - session.pausedDuration;
    const durationMinutes = duration / 60000;
    
    // WPM 계산 (평균 5글자를 1단어로 계산)
    const wpm = durationMinutes > 0 ? Math.round((session.wordCount / durationMinutes)) : 0;
    
    // 정확도 계산
    const accuracy = session.keyCount > 0 ? 
      Math.round(((session.keyCount - session.errorCount) / session.keyCount) * 100) : 100;
    
    // 키 입력 속도 (키/분)
    const keyRate = durationMinutes > 0 ? Math.round(session.keyCount / durationMinutes) : 0;
    
    // 에러율
    const errorRate = session.keyCount > 0 ? 
      Math.round((session.errorCount / session.keyCount) * 100) : 0;

    return {
      wpm,
      accuracy,
      duration,
      keyRate,
      errorRate,
    };
  }

  /**
   * 세션의 단어 및 문자 수 업데이트
   */
  private updateSessionCounts(session: ActiveSession): void {
    // 단어 수 계산 (공백으로 구분)
    const words = session.content.trim().split(/\s+/);
    session.wordCount = words.length > 0 && words[0] !== '' ? words.length : 0;
    
    // 문자 수 계산 (공백 제외)
    session.characterCount = session.content.replace(/\s/g, '').length;
  }

  /**
   * 활성 세션 목록 조회
   */
  public getActiveSessions(): ActiveSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * 특정 세션 조회
   */
  public getSession(sessionId: string): ActiveSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * 세션 존재 여부 확인
   */
  public hasSession(sessionId: string): boolean {
    return this.activeSessions.has(sessionId);
  }

  /**
   * 활성 세션 수 조회
   */
  public getActiveSessionCount(): number {
    return this.activeSessions.size;
  }

  /**
   * 특정 윈도우의 활성 세션 찾기
   */
  public findSessionByWindow(windowTitle: string): ActiveSession | null {
    for (const session of this.activeSessions.values()) {
      if (session.windowTitle === windowTitle && session.state === SessionState.ACTIVE) {
        return session;
      }
    }
    return null;
  }

  /**
   * 세션 설정 업데이트
   */
  public updateSessionConfig(config: Partial<SessionConfig>): void {
    this.sessionConfig = { ...this.sessionConfig, ...config };
    
    Logger.info(this.componentName, 'Session config updated', config);
    this.emit('configUpdated', this.sessionConfig);
  }

  /**
   * 세션 설정 조회
   */
  public getSessionConfig(): SessionConfig {
    return { ...this.sessionConfig };
  }

  /**
   * 세션 통계 조회
   */
  public getSessionStats(sessionId: string): SessionStats | null {
    const session = this.activeSessions.get(sessionId);
    return session ? this.calculateSessionStats(session) : null;
  }
}

// 🔥 기가차드 전역 세션 관리자
export const sessionManager = new SessionManager();

// #DEBUG: Session manager exit point
Logger.debug('SESSION_MANAGER', 'Session manager module setup complete');

export default sessionManager;
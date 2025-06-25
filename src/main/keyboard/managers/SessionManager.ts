/**
 * 🔥 기가차드 세션 매니저
 * Loop Advanced Session Manager - 타이핑 세션 관리 & 통계
 */

import { EventEmitter } from 'events';
import { KEYBOARD_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { GigaChadLogger } from '../logger';
import { LoopKeyboardEvent as KeyEvent, SessionStats } from '@shared/types';

export interface SessionConfig {
  sessionTimeout: number; // minutes
  autoSave: boolean;
  trackApplications: boolean;
}

/**
 * 🔥 기가차드 세션 매니저
 */
export class SessionManager extends EventEmitter {
  private currentSession: SessionStats | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private config: SessionConfig;
  private keyPressCount = 0;
  private charactersTyped = 0;
  private wordsTyped = 0;

  constructor(config?: Partial<SessionConfig>) {
    super();
    this.config = {
      sessionTimeout: 30, // 30분
      autoSave: true,
      trackApplications: true,
      ...config
    };
    
    GigaChadLogger.info('SessionManager', '🔥 세션 매니저 생성됨');
  }

  /**
   * 새 세션 시작
   */
  public async startNewSession(appInfo?: { appName: string; windowTitle?: string }): Promise<void> {
    try {
      // 기존 세션 종료
      if (this.currentSession) {
        await this.endCurrentSession();
      }

      const now = Date.now();
      const sessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
      
      const appData = appInfo || { appName: 'Unknown', windowTitle: undefined };
      
      this.currentSession = {
        sessionId,
        startTime: now,
        lastActivity: now,
        keyCount: 0,
        totalKeys: 0,
        keystrokes: 0,
        charactersTyped: 0,
        characters: 0,
        wordsTyped: 0,
        wpm: 0,
        accuracy: KEYBOARD_CONSTANTS.DEFAULT_ACCURACY,
        activeTime: 0,
        appName: appData.appName,
        windowTitle: appData.windowTitle,
        hangulCount: 0,
        applications: new Set([appData.appName])
      };
      
      // 통계 초기화
      this.keyPressCount = 0;
      this.charactersTyped = 0;
      this.wordsTyped = 0;
      
      // 세션 타임아웃 설정
      this.resetSessionTimeout();
      
      GigaChadLogger.info('SessionManager', `🆕 새 타이핑 세션 시작: ${sessionId} (${appData.appName})`);
      this.emit('session-started', this.currentSession);
      
    } catch (error) {
      GigaChadLogger.error('SessionManager', '세션 시작 실패', error);
      throw error;
    }
  }

  /**
   * 현재 세션 종료
   */
  public async endCurrentSession(): Promise<void> {
    if (!this.currentSession) return;

    try {
      const session = this.currentSession;
      const now = Date.now();
      
      // 최종 통계 계산
      session.activeTime = now - session.startTime;
      const sessionDurationMinutes = session.activeTime / (1000 * 60);
      
      if (sessionDurationMinutes > 0 && session.characters) {
        session.wpm = Math.round(session.characters / sessionDurationMinutes);
      }

      GigaChadLogger.info('SessionManager', `📊 세션 종료: ${session.sessionId} - ${session.keyCount}키, ${session.wpm}WPM`);
      
      // 세션 저장 이벤트
      this.emit('session-ended', session);
      
      // 정리
      this.currentSession = null;
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = null;
      }
      
    } catch (error) {
      GigaChadLogger.error('SessionManager', '세션 종료 실패', error);
    }
  }

  /**
   * 키 이벤트로부터 통계 업데이트
   */
  public updateStatisticsFromEvent(event: KeyEvent): void {
    try {
      if (!this.currentSession) return;
      
      const now = Date.now();
      
      // 기본 통계 업데이트
      this.currentSession.totalKeys++;
      this.currentSession.lastActivity = now;
      
      // keydown 이벤트만 처리
      if (event.type === 'keydown') {
        if (this.currentSession.keystrokes !== undefined) {
          this.currentSession.keystrokes++;
        }
        this.keyPressCount++;
        
        // 문자 통계
        if (event.char && event.char.length === 1) {
          if (this.currentSession.characters !== undefined) {
            this.currentSession.characters++;
          }
          this.charactersTyped++;
          
          // 한글 문자 체크
          if (this.isHangulCharacter(event.char)) {
            if (this.currentSession.hangulCount !== undefined) {
              this.currentSession.hangulCount++;
            }
          }
        }
        
        // WPM 계산
        const sessionDuration = (now - this.currentSession.startTime) / 1000 / 60; // 분
        if (sessionDuration > 0 && this.currentSession.characters) {
          this.currentSession.wpm = Math.round(this.currentSession.characters / sessionDuration);
        }
        
        // 정확도는 기본값 유지 (실제 오타 감지 로직 필요)
        this.currentSession.accuracy = KEYBOARD_CONSTANTS.DEFAULT_ACCURACY;
      }
      
      // 앱별 통계
      if (event.appName && this.config.trackApplications) {
        if (!this.currentSession.applications) {
          this.currentSession.applications = new Set();
        }
        this.currentSession.applications.add(event.appName);
      }
      
      // 세션 타임아웃 재설정
      this.resetSessionTimeout();
      
    } catch (error) {
      GigaChadLogger.error('SessionManager', '통계 업데이트 실패', error);
    }
  }

  /**
   * 한글 문자 여부 확인
   */
  private isHangulCharacter(char: string): boolean {
    if (!char || char.length !== 1) return false;
    const code = char.charCodeAt(0);
    return (code >= KEYBOARD_CONSTANTS.HANGUL_RANGES.JAMO_START && code <= KEYBOARD_CONSTANTS.HANGUL_RANGES.JAMO_END) ||
           (code >= KEYBOARD_CONSTANTS.HANGUL_RANGES.COMPAT_JAMO_START && code <= KEYBOARD_CONSTANTS.HANGUL_RANGES.COMPAT_JAMO_END) ||
           (code >= KEYBOARD_CONSTANTS.HANGUL_RANGES.SYLLABLES_START && code <= KEYBOARD_CONSTANTS.HANGUL_RANGES.SYLLABLES_END);
  }

  /**
   * 세션 타임아웃 재설정
   */
  private resetSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    
    this.sessionTimeout = setTimeout(() => {
      GigaChadLogger.info('SessionManager', '⏰ 세션 타임아웃으로 인한 자동 종료');
      this.endCurrentSession();
    }, this.config.sessionTimeout * 60 * 1000);
  }

  /**
   * 현재 세션 통계 가져오기
   */
  public getSessionStats(): SessionStats | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  /**
   * 세션 상태 확인
   */
  public isSessionActive(): boolean {
    return this.currentSession !== null;
  }

  /**
   * 설정 업데이트
   */
  public updateConfig(newConfig: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    GigaChadLogger.info('SessionManager', '⚙️ 세션 설정 업데이트', newConfig);
  }

  /**
   * 정리
   */
  public cleanup(): void {
    if (this.currentSession) {
      this.endCurrentSession();
    }
    
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
    
    this.removeAllListeners();
    GigaChadLogger.info('SessionManager', '🧹 세션 매니저 정리 완료');
  }
}

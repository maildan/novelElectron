/**
 * 🔥 기가차드 키보드 통계 관리자
 * Advanced Keyboard Statistics Manager with real-time analytics
 */

import { EventEmitter } from 'events';
import { KeyEvent } from './KeyboardEngine';

export interface TypingStats {
  sessionId: string;
  startTime: number;
  endTime?: number;
  duration: number; // milliseconds
  
  // 기본 통계
  totalKeys: number;
  charactersTyped: number;
  wordsTyped: number;
  
  // 속도 통계
  wpm: number; // Words Per Minute
  cpm: number; // Characters Per Minute
  kps: number; // Keys Per Second
  
  // 정확도 통계
  accuracy: number; // 정확도 (%)
  errorCount: number;
  backspaceCount: number;
  
  // 리듬 통계
  averageKeyInterval: number; // 평균 키 간격 (ms)
  keyIntervalVariance: number; // 키 간격 분산
  burstTypingSegments: number; // 빠른 타이핑 구간 수
  pauseCount: number; // 일시정지 횟수 (500ms 이상)
  
  // 앱별 통계
  appName: string;
  windowTitle?: string;
  
  // 언어별 통계
  language: string;
  hangulCompositions?: number; // 한글 조합 횟수
  
  // 시간대별 분포
  hourlyDistribution: number[]; // 24시간 분포
}

export interface RealtimeStats {
  currentWPM: number;
  currentCPM: number;
  recentKeyInterval: number;
  consecutiveKeys: number;
  lastBurstStart?: number;
  isInBurst: boolean;
  recentAccuracy: number;
}

export interface GlobalStats {
  totalSessions: number;
  totalTypingTime: number; // milliseconds
  totalKeys: number;
  totalCharacters: number;
  totalWords: number;
  averageWPM: number;
  bestWPM: number;
  averageAccuracy: number;
  favoriteApps: Array<{ appName: string; usage: number }>;
  dailyStats: Array<{ date: string; keys: number; time: number }>;
}

export interface KeyFrequency {
  key: string;
  count: number;
  percentage: number;
  averageInterval: number;
}

export interface TypingPattern {
  commonBigrams: Array<{ bigram: string; count: number; averageInterval: number }>;
  commonTrigrams: Array<{ trigram: string; count: number; averageInterval: number }>;
  keyFrequencies: KeyFrequency[];
  fingersUsage: Array<{ finger: string; usage: number }>;
  rowDistribution: Array<{ row: string; usage: number }>;
}

/**
 * 키보드 통계 관리자
 */
export class KeyboardStatsManager extends EventEmitter {
  private static instance: KeyboardStatsManager;
  
  // 현재 세션
  private currentSession: TypingStats | null = null;
  private realtimeStats: RealtimeStats;
  
  // 키 이벤트 버퍼
  private keyEventBuffer: KeyEvent[] = [];
  private keyIntervals: number[] = [];
  private lastKeyTime: number = 0;
  
  // 통계 계산 설정
  private readonly maxBufferSize = 1000;
  private readonly burstThreshold = 80; // WPM
  private readonly pauseThreshold = 500; // ms
  private readonly accuracyWindowSize = 50; // 최근 키 개수
  
  // 패턴 분석
  private keySequence: string[] = [];
  private bigramCounts: Map<string, number> = new Map();
  private trigramCounts: Map<string, number> = new Map();
  private keyCounts: Map<string, number> = new Map();

  private constructor() {
    super();
    this.realtimeStats = this.getInitialRealtimeStats();
  }

  static getInstance(): KeyboardStatsManager {
    if (!KeyboardStatsManager.instance) {
      KeyboardStatsManager.instance = new KeyboardStatsManager();
    }
    return KeyboardStatsManager.instance;
  }

  /**
   * 초기 실시간 통계
   */
  private getInitialRealtimeStats(): RealtimeStats {
    return {
      currentWPM: 0,
      currentCPM: 0,
      recentKeyInterval: 0,
      consecutiveKeys: 0,
      isInBurst: false,
      recentAccuracy: 100
    };
  }

  /**
   * 새 세션 시작
   */
  startSession(sessionId: string, appName: string, windowTitle?: string, language: string = 'korean'): void {
    // 기존 세션 종료
    if (this.currentSession) {
      this.endSession();
    }

    const now = Date.now();
    this.currentSession = {
      sessionId,
      startTime: now,
      duration: 0,
      totalKeys: 0,
      charactersTyped: 0,
      wordsTyped: 0,
      wpm: 0,
      cpm: 0,
      kps: 0,
      accuracy: 100,
      errorCount: 0,
      backspaceCount: 0,
      averageKeyInterval: 0,
      keyIntervalVariance: 0,
      burstTypingSegments: 0,
      pauseCount: 0,
      appName,
      windowTitle,
      language,
      hourlyDistribution: new Array(24).fill(0)
    };

    // 버퍼 및 통계 초기화
    this.keyEventBuffer = [];
    this.keyIntervals = [];
    this.lastKeyTime = now;
    this.realtimeStats = this.getInitialRealtimeStats();
    
    // 패턴 분석 초기화
    this.keySequence = [];
    this.bigramCounts.clear();
    this.trigramCounts.clear();
    this.keyCounts.clear();

    console.log(`📊 새 타이핑 세션 시작: ${sessionId} (${appName})`);
    this.emit('session-started', this.currentSession);
  }

  /**
   * 현재 세션 종료
   */
  endSession(): TypingStats | null {
    if (!this.currentSession) return null;

    const now = Date.now();
    this.currentSession.endTime = now;
    this.currentSession.duration = now - this.currentSession.startTime;

    // 최종 통계 계산
    this.calculateFinalStats();

    const finalSession = { ...this.currentSession };
    
    console.log(`📈 타이핑 세션 종료: ${finalSession.sessionId}`, {
      duration: `${Math.round(finalSession.duration / 1000)}초`,
      totalKeys: finalSession.totalKeys,
      wpm: finalSession.wpm,
      accuracy: `${finalSession.accuracy.toFixed(1)}%`
    });

    this.emit('session-ended', finalSession);
    this.currentSession = null;
    
    return finalSession;
  }

  /**
   * 키 이벤트 처리
   */
  processKeyEvent(keyEvent: KeyEvent): void {
    if (!this.currentSession || keyEvent.type !== 'keydown') return;

    const now = keyEvent.timestamp;
    
    // 버퍼에 이벤트 추가
    this.keyEventBuffer.push(keyEvent);
    if (this.keyEventBuffer.length > this.maxBufferSize) {
      this.keyEventBuffer.shift();
    }

    // 키 간격 계산
    if (this.lastKeyTime > 0) {
      const interval = now - this.lastKeyTime;
      this.keyIntervals.push(interval);
      if (this.keyIntervals.length > this.maxBufferSize) {
        this.keyIntervals.shift();
      }
      
      // 일시정지 감지
      if (interval > this.pauseThreshold) {
        this.currentSession.pauseCount++;
      }
    }
    this.lastKeyTime = now;

    // 기본 카운터 업데이트
    this.currentSession.totalKeys++;
    
    // 문자 및 단어 카운트
    if (keyEvent.key && keyEvent.key.length === 1) {
      this.currentSession.charactersTyped++;
      this.addKeyToSequence(keyEvent.key);
      
      // 공백으로 단어 구분
      if (keyEvent.key === ' ') {
        this.currentSession.wordsTyped++;
      }
    }

    // Backspace 감지
    if (keyEvent.key === 'Backspace') {
      this.currentSession.backspaceCount++;
      this.currentSession.errorCount++; // 백스페이스를 오류로 간주
    }

    // 시간대별 분포 업데이트
    const hour = new Date(now).getHours();
    this.currentSession.hourlyDistribution[hour]++;

    // 실시간 통계 업데이트
    this.updateRealtimeStats();

    // 세션 통계 업데이트
    this.updateSessionStats();

    // 이벤트 발생
    this.emit('key-processed', {
      keyEvent,
      sessionStats: this.currentSession,
      realtimeStats: this.realtimeStats
    });
  }

  /**
   * 실시간 통계 업데이트
   */
  private updateRealtimeStats(): void {
    if (!this.currentSession || this.keyIntervals.length === 0) return;

    const now = Date.now();
    const sessionDuration = now - this.currentSession.startTime;
    
    // 현재 WPM/CPM 계산 (최근 1분 기준)
    const recentKeys = this.getRecentKeys(60000); // 1분
    const recentMinutes = Math.max(recentKeys.length > 0 ? 1 : 0, sessionDuration / 60000);
    
    this.realtimeStats.currentWPM = recentMinutes > 0 ? Math.round((recentKeys.length / 5) / recentMinutes) : 0;
    this.realtimeStats.currentCPM = recentMinutes > 0 ? Math.round(recentKeys.length / recentMinutes) : 0;

    // 최근 키 간격
    if (this.keyIntervals.length > 0) {
      const recentIntervals = this.keyIntervals.slice(-10); // 최근 10개
      this.realtimeStats.recentKeyInterval = recentIntervals.reduce((a, b) => a + b, 0) / recentIntervals.length;
    }

    // 연속 키 입력 감지
    this.realtimeStats.consecutiveKeys = this.getConsecutiveKeyCount();

    // 버스트 타이핑 감지
    const wasInBurst = this.realtimeStats.isInBurst;
    this.realtimeStats.isInBurst = this.realtimeStats.currentWPM > this.burstThreshold;
    
    if (!wasInBurst && this.realtimeStats.isInBurst) {
      this.realtimeStats.lastBurstStart = now;
      this.currentSession.burstTypingSegments++;
    }

    // 최근 정확도 계산
    this.realtimeStats.recentAccuracy = this.calculateRecentAccuracy();
  }

  /**
   * 세션 통계 업데이트
   */
  private updateSessionStats(): void {
    if (!this.currentSession) return;

    const now = Date.now();
    const sessionDurationMinutes = (now - this.currentSession.startTime) / 60000;
    
    // 기본 속도 통계
    if (sessionDurationMinutes > 0) {
      this.currentSession.wpm = Math.round((this.currentSession.charactersTyped / 5) / sessionDurationMinutes);
      this.currentSession.cpm = Math.round(this.currentSession.charactersTyped / sessionDurationMinutes);
      this.currentSession.kps = this.currentSession.totalKeys / (sessionDurationMinutes * 60);
    }

    // 정확도 계산
    const totalInputs = this.currentSession.totalKeys;
    if (totalInputs > 0) {
      this.currentSession.accuracy = Math.max(0, ((totalInputs - this.currentSession.errorCount) / totalInputs) * 100);
    }

    // 키 간격 통계
    if (this.keyIntervals.length > 0) {
      this.currentSession.averageKeyInterval = this.keyIntervals.reduce((a, b) => a + b, 0) / this.keyIntervals.length;
      
      // 분산 계산
      const mean = this.currentSession.averageKeyInterval;
      const variance = this.keyIntervals.reduce((acc, interval) => acc + Math.pow(interval - mean, 2), 0) / this.keyIntervals.length;
      this.currentSession.keyIntervalVariance = variance;
    }

    this.currentSession.duration = now - this.currentSession.startTime;
  }

  /**
   * 최종 통계 계산
   */
  private calculateFinalStats(): void {
    if (!this.currentSession) return;

    // 한글 조합 횟수 계산 (한국어인 경우)
    if (this.currentSession.language === 'korean') {
      this.currentSession.hangulCompositions = this.calculateHangulCompositions();
    }

    // 패턴 분석 완료
    this.finalizePatternAnalysis();
  }

  /**
   * 키 시퀀스에 추가
   */
  private addKeyToSequence(key: string): void {
    this.keySequence.push(key);
    
    // 키 빈도 업데이트
    this.keyCounts.set(key, (this.keyCounts.get(key) || 0) + 1);
    
    // 바이그램 분석
    if (this.keySequence.length >= 2) {
      const bigram = this.keySequence.slice(-2).join('');
      this.bigramCounts.set(bigram, (this.bigramCounts.get(bigram) || 0) + 1);
    }
    
    // 트라이그램 분석
    if (this.keySequence.length >= 3) {
      const trigram = this.keySequence.slice(-3).join('');
      this.trigramCounts.set(trigram, (this.trigramCounts.get(trigram) || 0) + 1);
    }
    
    // 시퀀스 크기 제한
    if (this.keySequence.length > this.maxBufferSize) {
      this.keySequence.shift();
    }
  }

  /**
   * 최근 키 이벤트 가져오기
   */
  private getRecentKeys(timeWindowMs: number): KeyEvent[] {
    const now = Date.now();
    return this.keyEventBuffer.filter(event => 
      now - event.timestamp <= timeWindowMs
    );
  }

  /**
   * 연속 키 입력 개수
   */
  private getConsecutiveKeyCount(): number {
    if (this.keyIntervals.length === 0) return 0;
    
    let consecutive = 1;
    for (let i = this.keyIntervals.length - 1; i >= 0; i--) {
      if (this.keyIntervals[i] < this.pauseThreshold) {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  }

  /**
   * 최근 정확도 계산
   */
  private calculateRecentAccuracy(): number {
    const recentEvents = this.keyEventBuffer.slice(-this.accuracyWindowSize);
    if (recentEvents.length === 0) return 100;
    
    const backspaces = recentEvents.filter(event => event.key === 'Backspace').length;
    return Math.max(0, ((recentEvents.length - backspaces) / recentEvents.length) * 100);
  }

  /**
   * 한글 조합 횟수 계산
   */
  private calculateHangulCompositions(): number {
    // 한글 완성 문자 개수 추정
    let compositions = 0;
    for (const char of this.keySequence.join('')) {
      const code = char.charCodeAt(0);
      if (code >= 0xAC00 && code <= 0xD7AF) { // 한글 음절
        compositions++;
      }
    }
    return compositions;
  }

  /**
   * 패턴 분석 완료
   */
  private finalizePatternAnalysis(): void {
    // 타이핑 패턴 분석 결과를 이벤트로 발생
    const patterns: TypingPattern = {
      commonBigrams: this.getTopBigrams(10),
      commonTrigrams: this.getTopTrigrams(10),
      keyFrequencies: this.getKeyFrequencies(),
      fingersUsage: this.calculateFingersUsage(),
      rowDistribution: this.calculateRowDistribution()
    };
    
    this.emit('pattern-analysis-completed', patterns);
  }

  /**
   * 상위 바이그램 가져오기
   */
  private getTopBigrams(count: number): Array<{ bigram: string; count: number; averageInterval: number }> {
    return Array.from(this.bigramCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([bigram, count]) => ({
        bigram,
        count,
        averageInterval: this.calculateBigramAverageInterval(bigram)
      }));
  }

  /**
   * 상위 트라이그램 가져오기
   */
  private getTopTrigrams(count: number): Array<{ trigram: string; count: number; averageInterval: number }> {
    return Array.from(this.trigramCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([trigram, count]) => ({
        trigram,
        count,
        averageInterval: this.calculateTrigramAverageInterval(trigram)
      }));
  }

  /**
   * 키 빈도 가져오기
   */
  private getKeyFrequencies(): KeyFrequency[] {
    const total = Array.from(this.keyCounts.values()).reduce((a, b) => a + b, 0);
    
    return Array.from(this.keyCounts.entries())
      .map(([key, count]) => ({
        key,
        count,
        percentage: (count / total) * 100,
        averageInterval: this.calculateKeyAverageInterval(key)
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * 손가락 사용률 계산
   */
  private calculateFingersUsage(): Array<{ finger: string; usage: number }> {
    // 간단한 QWERTY 키보드 기준 손가락 매핑
    const fingerMap: Record<string, string> = {
      'q': '왼손 새끼', 'w': '왼손 약지', 'e': '왼손 중지', 'r': '왼손 검지', 't': '왼손 검지',
      'y': '오른손 검지', 'u': '오른손 검지', 'i': '오른손 중지', 'o': '오른손 약지', 'p': '오른손 새끼',
      'a': '왼손 새끼', 's': '왼손 약지', 'd': '왼손 중지', 'f': '왼손 검지', 'g': '왼손 검지',
      'h': '오른손 검지', 'j': '오른손 검지', 'k': '오른손 중지', 'l': '오른손 약지',
      'z': '왼손 새끼', 'x': '왼손 약지', 'c': '왼손 중지', 'v': '왼손 검지', 'b': '왼손 검지',
      'n': '오른손 검지', 'm': '오른손 검지',
      ' ': '엄지'
    };

    const fingerCounts = new Map<string, number>();
    let total = 0;

    for (const [key, count] of this.keyCounts) {
      const finger = fingerMap[key.toLowerCase()] || '기타';
      fingerCounts.set(finger, (fingerCounts.get(finger) || 0) + count);
      total += count;
    }

    return Array.from(fingerCounts.entries())
      .map(([finger, count]) => ({
        finger,
        usage: (count / total) * 100
      }))
      .sort((a, b) => b.usage - a.usage);
  }

  /**
   * 키보드 행 분포 계산
   */
  private calculateRowDistribution(): Array<{ row: string; usage: number }> {
    const rowMap: Record<string, string> = {
      'q': '상단', 'w': '상단', 'e': '상단', 'r': '상단', 't': '상단', 'y': '상단', 'u': '상단', 'i': '상단', 'o': '상단', 'p': '상단',
      'a': '중간', 's': '중간', 'd': '중간', 'f': '중간', 'g': '중간', 'h': '중간', 'j': '중간', 'k': '중간', 'l': '중간',
      'z': '하단', 'x': '하단', 'c': '하단', 'v': '하단', 'b': '하단', 'n': '하단', 'm': '하단',
      ' ': '공백'
    };

    const rowCounts = new Map<string, number>();
    let total = 0;

    for (const [key, count] of this.keyCounts) {
      const row = rowMap[key.toLowerCase()] || '기타';
      rowCounts.set(row, (rowCounts.get(row) || 0) + count);
      total += count;
    }

    return Array.from(rowCounts.entries())
      .map(([row, count]) => ({
        row,
        usage: (count / total) * 100
      }))
      .sort((a, b) => b.usage - a.usage);
  }

  // Helper methods for interval calculations
  private calculateBigramAverageInterval(bigram: string): number {
    // 바이그램의 평균 타이핑 간격 계산 (복잡한 로직이므로 간단하게 처리)
    return this.realtimeStats.recentKeyInterval;
  }

  private calculateTrigramAverageInterval(trigram: string): number {
    // 트라이그램의 평균 타이핑 간격 계산
    return this.realtimeStats.recentKeyInterval;
  }

  private calculateKeyAverageInterval(key: string): number {
    // 특정 키의 평균 타이핑 간격 계산
    return this.realtimeStats.recentKeyInterval;
  }

  /**
   * 현재 세션 통계 반환
   */
  getCurrentSession(): TypingStats | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  /**
   * 실시간 통계 반환
   */
  getRealtimeStats(): RealtimeStats {
    return { ...this.realtimeStats };
  }

  /**
   * 통계 리셋
   */
  reset(): void {
    this.currentSession = null;
    this.keyEventBuffer = [];
    this.keyIntervals = [];
    this.lastKeyTime = 0;
    this.realtimeStats = this.getInitialRealtimeStats();
    this.keySequence = [];
    this.bigramCounts.clear();
    this.trigramCounts.clear();
    this.keyCounts.clear();
    
    console.log('📊 키보드 통계 리셋 완료');
    this.emit('stats-reset');
  }

  /**
   * 정리
   */
  cleanup(): void {
    if (this.currentSession) {
      this.endSession();
    }
    this.reset();
    this.removeAllListeners();
    console.log('🧹 키보드 통계 관리자 정리 완료');
  }
}

// Export singleton instance
export const keyboardStatsManager = KeyboardStatsManager.getInstance();

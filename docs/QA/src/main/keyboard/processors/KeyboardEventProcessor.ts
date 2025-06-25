/**
 * 🔥 기가차드 키보드 이벤트 프로세서
 * Loop Advanced Keyboard Event Processor - 키 이벤트 처리 & 배치 시스템
 */

import { EventEmitter } from 'events';
import { UiohookKeyboardEvent } from 'uiohook-napi';
import { KEYBOARD_CONSTANTS, ERROR_MESSAGES, INFO_MESSAGES } from '../constants';
import { GigaChadLogger } from '../logger';
import { HealthCheckManager } from '../HealthCheckManager';

export interface KeyEvent {
  keycode: number;
  key: string;
  type: 'keydown' | 'keyup';
  timestamp: number;
  char?: string;
  appName?: string;
  windowTitle?: string;
  modifiers?: {
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
}

export interface ProcessorStats {
  totalEvents: number;
  queueSize: number;
  batchSize: number;
  averageProcessingTime: number;
}

/**
 * 🔥 기가차드 키보드 이벤트 프로세서
 */
export class KeyboardEventProcessor extends EventEmitter {
  private keyEventQueue: KeyEvent[] = [];
  private keyEventBatch: KeyEvent[] = [];
  private keyEventProcessor: NodeJS.Timeout | null = null;
  private batchTimer: NodeJS.Timeout | null = null;
  private healthCheckManager: HealthCheckManager;
  private stats: ProcessorStats = {
    totalEvents: 0,
    queueSize: 0,
    batchSize: 0,
    averageProcessingTime: 0
  };

  constructor() {
    super();
    this.healthCheckManager = HealthCheckManager.getInstance();
    this.startKeyEventProcessor();
    GigaChadLogger.info('KeyboardEventProcessor', '🔥 키보드 이벤트 프로세서 생성됨');
  }

  /**
   * 키 이벤트 처리 (uIOhook에서 호출)
   */
  public processKeyEvent(event: UiohookKeyboardEvent, type: 'keydown' | 'keyup'): void {
    const startTime = Date.now();
    
    try {
      const keyEvent: KeyEvent = {
        keycode: event.keycode,
        key: this.getKeyName(event.keycode),
        type,
        timestamp: Date.now(),
        char: this.getKeyChar(event.keycode, event.shiftKey),
        modifiers: {
          shift: event.shiftKey,
          ctrl: event.ctrlKey,
          alt: event.altKey,
          meta: event.metaKey
        }
      };

      // 큐에 추가
      this.addKeyEventToQueue(keyEvent);
      
      // 통계 업데이트
      this.stats.totalEvents++;
      this.stats.queueSize = this.keyEventQueue.length;
      
      // 이벤트 발생
      this.emit('key-event', keyEvent);
      
    } catch (error) {
      GigaChadLogger.error('KeyboardEventProcessor', ERROR_MESSAGES.KEY_EVENT_PROCESS_FAILED, error);
      this.healthCheckManager.recordError('KeyboardEventProcessor', error as Error);
    } finally {
      const duration = Date.now() - startTime;
      this.healthCheckManager.recordPerformanceMetric('processKeyEvent', duration);
    }
  }

  /**
   * 키 이벤트를 큐에 추가
   */
  private addKeyEventToQueue(keyEvent: KeyEvent): void {
    // 큐 크기 제한
    if (this.keyEventQueue.length >= KEYBOARD_CONSTANTS.MAX_QUEUE_SIZE) {
      this.cleanupOldEvents();
    }
    
    this.keyEventQueue.push(keyEvent);
    
    // 배치에도 추가
    this.keyEventBatch.push(keyEvent);
    
    // 배치 크기 체크
    if (this.keyEventBatch.length >= KEYBOARD_CONSTANTS.BATCH_PROCESS_SIZE) {
      this.processBatchedKeyEvents();
    }
  }

  /**
   * 오래된 이벤트 정리
   */
  private cleanupOldEvents(): void {
    const threshold = KEYBOARD_CONSTANTS.MAX_QUEUE_SIZE * KEYBOARD_CONSTANTS.QUEUE_CLEANUP_THRESHOLD;
    const removeCount = Math.floor(threshold);
    
    if (removeCount > 0) {
      this.keyEventQueue.splice(0, removeCount);
      GigaChadLogger.debug('KeyboardEventProcessor', `${INFO_MESSAGES.QUEUE_CLEANUP}: ${removeCount}개 이벤트 제거`);
    }
  }

  /**
   * 키 이벤트 프로세서 시작
   */
  private startKeyEventProcessor(): void {
    if (this.keyEventProcessor) return;
    
    this.keyEventProcessor = setInterval(() => {
      this.processKeyEventQueue();
    }, KEYBOARD_CONSTANTS.DEBOUNCE_DELAY_MS);
  }

  /**
   * 배치 키 이벤트 처리
   */
  private processBatchedKeyEvents(): void {
    if (this.keyEventBatch.length === 0) return;
    
    const startTime = Date.now();
    const timerId = GigaChadLogger.startTimer('KeyboardEventProcessor', 'processBatchedKeyEvents');
    
    try {
      const batchToProcess = [...this.keyEventBatch];
      this.keyEventBatch.length = 0;
      
      GigaChadLogger.debug('KeyboardEventProcessor', `🔥 배치 처리 시작: ${batchToProcess.length}개 이벤트`);
      
      // 배치 이벤트 발생
      this.emit('batch-processed', {
        events: batchToProcess,
        timestamp: Date.now(),
        batchSize: batchToProcess.length
      });
      
      this.stats.batchSize = batchToProcess.length;
      
      GigaChadLogger.debug('KeyboardEventProcessor', `✅ 배치 처리 완료: ${batchToProcess.length}개 이벤트`);
    } catch (error) {
      GigaChadLogger.error('KeyboardEventProcessor', '배치 키 이벤트 처리 실패', error);
      this.healthCheckManager.recordError('KeyboardEventProcessor', error as Error);
    } finally {
      GigaChadLogger.endTimer(timerId);
      const duration = Date.now() - startTime;
      this.healthCheckManager.recordPerformanceMetric('processBatchedKeyEvents', duration);
      this.stats.averageProcessingTime = duration;
    }
  }

  /**
   * 키 이벤트 큐 처리
   */
  private processKeyEventQueue(): void {
    if (this.keyEventQueue.length === 0) return;
    
    try {
      const events = this.keyEventQueue.splice(0, KEYBOARD_CONSTANTS.BATCH_PROCESS_SIZE);
      
      for (const event of events) {
        this.emit('individual-event', event);
      }
      
      this.stats.queueSize = this.keyEventQueue.length;
      
    } catch (error) {
      GigaChadLogger.error('KeyboardEventProcessor', '키 이벤트 큐 처리 실패', error);
    }
  }

  /**
   * 키 이름 가져오기
   */
  private getKeyName(keycode: number): string {
    // 간단한 키 매핑
    const keyMap: { [key: number]: string } = {
      32: 'Space',
      13: 'Enter',
      9: 'Tab',
      8: 'Backspace',
      27: 'Escape'
    };
    
    return keyMap[keycode] || `Key${keycode}`;
  }

  /**
   * 키 문자 가져오기
   */
  private getKeyChar(keycode: number, isShift: boolean = false): string {
    // 영문자 처리
    if (keycode >= KEYBOARD_CONSTANTS.KEYCODE_RANGES.Q_TO_P_START && keycode <= KEYBOARD_CONSTANTS.KEYCODE_RANGES.Q_TO_P_END) {
      const char = String.fromCharCode(KEYBOARD_CONSTANTS.KEYCODE_RANGES.Q_CHAR_CODE + keycode - KEYBOARD_CONSTANTS.KEYCODE_RANGES.Q_TO_P_START);
      return isShift ? char : char.toLowerCase();
    }
    
    return '';
  }

  /**
   * 통계 가져오기
   */
  public getStats(): ProcessorStats {
    return { ...this.stats };
  }

  /**
   * 큐 크기 가져오기
   */
  public getQueueSize(): number {
    return this.keyEventQueue.length;
  }

  /**
   * 정리
   */
  public cleanup(): void {
    if (this.keyEventProcessor) {
      clearInterval(this.keyEventProcessor);
      this.keyEventProcessor = null;
    }
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    this.keyEventQueue.length = 0;
    this.keyEventBatch.length = 0;
    this.removeAllListeners();
    
    GigaChadLogger.info('KeyboardEventProcessor', '🧹 키보드 이벤트 프로세서 정리 완료');
  }
}

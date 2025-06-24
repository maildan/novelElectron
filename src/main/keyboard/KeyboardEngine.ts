/**
 * 🔥 기가차드 키보드 엔진 - 통합 키보드 모니터링 시스템
 * Loop Advanced Keyboard Engine - Unified Keyboard Monitoring System
 * 
 * Loop 6, Loop 7 베스트 프랙티스 적용:
 * - 고급 IME/한글 조합 처리
 * - 권한 관리 시스템
 * - 앱 감지 및 윈도우 추적
 * - 통합 세션 관리
 * - 실시간 통계 및 분석
 * - 글로벌 단축키 지원
 */

import { BrowserWindow, ipcMain, globalShortcut, shell, app } from 'electron';
import { uIOhook, UiohookKey, UiohookKeyboardEvent } from 'uiohook-napi';
import { EventEmitter } from 'events';

// Types and Interfaces
interface KeyboardConfig {
  language: 'korean' | 'japanese' | 'chinese' | 'english';
  enableIME: boolean;
  enableGlobalShortcuts: boolean;
  enableAppDetection: boolean;
  autoStartMonitoring: boolean;
  sessionTimeout: number; // minutes
  debugMode: boolean;
}

interface KeyEvent {
  keycode: number;
  key: string;
  type: 'keydown' | 'keyup';
  timestamp: number;
  appName?: string;
  windowTitle?: string;
  modifiers?: {
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
}

interface HangulComposerState {
  cho: string;
  jung: string;
  jong: string;
  result: string;
  isComposing: boolean;
}

interface SessionStats {
  sessionId: string;
  startTime: number;
  keyCount: number;
  charactersTyped: number;
  wordsTyped: number;
  wpm: number;
  accuracy: number;
  activeTime: number; // ms
  appName: string;
  windowTitle?: string;
}

interface PermissionStatus {
  accessibility: boolean | null;
  screenRecording: boolean | null;
  inputMonitoring: boolean | null;
}

interface MonitoringState {
  isInitialized: boolean;
  isListening: boolean;
  isMonitoring: boolean;
  currentSession: SessionStats | null;
  permissionStatus: PermissionStatus;
  queueSize: number;
  totalEvents: number;
}

/**
 * 기가차드 키보드 엔진
 * 모든 키보드 관련 기능을 통합 관리하는 핵심 엔진
 */
export class KeyboardEngine extends EventEmitter {
  private static instance: KeyboardEngine;
  private mainWindow: BrowserWindow | null = null;
  
  // Core State
  private config: KeyboardConfig;
  private state: MonitoringState;
  private keyEventQueue: KeyEvent[] = [];
  private keyEventProcessor: NodeJS.Timeout | null = null;
  
  // IME and Composition
  private hangulComposer: HangulComposerState;
  private imeBuffer: string = '';
  
  // Session Management
  private currentSession: SessionStats | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private lastActivityTime: number = 0;
  
  // App Detection
  private lastActiveApp: string = '';
  private lastWindowTitle: string = '';
  private activeAppCheckTimer: NodeJS.Timeout | null = null;
  
  // Statistics
  private keyPressCount: number = 0;
  private charactersTyped: number = 0;
  private wordsTyped: number = 0;
  private startTime: number = 0;

  private constructor() {
    super();
    this.config = this.getDefaultConfig();
    this.state = this.getInitialState();
    this.hangulComposer = this.getInitialHangulState();
    
    console.log('🔥 기가차드 키보드 엔진 생성됨');
  }

  static getInstance(): KeyboardEngine {
    if (!KeyboardEngine.instance) {
      KeyboardEngine.instance = new KeyboardEngine();
    }
    return KeyboardEngine.instance;
  }

  /**
   * 키보드 엔진 초기화
   */
  async initialize(mainWindow: BrowserWindow, config?: Partial<KeyboardConfig>): Promise<boolean> {
    console.log('⚡ 기가차드 키보드 엔진 초기화 시작...');
    
    try {
      this.mainWindow = mainWindow;
      
      // 설정 병합
      if (config) {
        this.config = { ...this.config, ...config };
      }
      
      // 권한 확인
      await this.checkSystemPermissions();
      
      // 이벤트 핸들러 설정
      this.setupEventHandlers();
      
      // IPC 핸들러 등록
      this.registerIpcHandlers();
      
      // 글로벌 단축키 등록
      if (this.config.enableGlobalShortcuts) {
        this.registerGlobalShortcuts();
      }
      
      // 앱 감지 시작
      if (this.config.enableAppDetection) {
        this.startAppDetection();
      }
      
      // 키 이벤트 프로세서 시작
      this.startKeyEventProcessor();
      
      this.state.isInitialized = true;
      
      // 자동 시작
      if (this.config.autoStartMonitoring) {
        await this.startMonitoring();
      }
      
      console.log('✅ 기가차드 키보드 엔진 초기화 완료');
      this.emit('initialized', this.state);
      
      return true;
    } catch (error) {
      console.error('❌ 키보드 엔진 초기화 실패:', error);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * 키보드 모니터링 시작
   */
  async startMonitoring(): Promise<boolean> {
    if (!this.state.isInitialized) {
      console.error('❌ 키보드 엔진이 초기화되지 않았습니다');
      return false;
    }
    
    if (this.state.isListening) {
      console.warn('⚠️ 키보드 모니터링이 이미 실행 중입니다');
      return true;
    }

    try {
      console.log('🎯 키보드 모니터링 시작...');
      
      // 권한 재확인
      const hasPermissions = await this.verifyPermissions();
      if (!hasPermissions) {
        throw new Error('필요한 시스템 권한이 없습니다');
      }
      
      // uIOhook 시작
      uIOhook.start();
      
      this.state.isListening = true;
      this.state.isMonitoring = true;
      this.startTime = Date.now();
      this.lastActivityTime = Date.now();
      
      // 새 세션 시작
      await this.startNewSession();
      
      console.log('✅ 키보드 모니터링 시작됨');
      this.emit('monitoring-started', this.getMonitoringStatus());
      
      // 렌더러에 상태 전송
      this.sendToRenderer('keyboard:monitoring-started', this.getMonitoringStatus());
      
      return true;
    } catch (error) {
      console.error('❌ 키보드 모니터링 시작 실패:', error);
      this.state.isListening = false;
      this.state.isMonitoring = false;
      this.emit('error', error);
      return false;
    }
  }

  /**
   * 키보드 모니터링 중지
   */
  async stopMonitoring(): Promise<boolean> {
    if (!this.state.isListening) {
      console.warn('⚠️ 키보드 모니터링이 실행 중이 아닙니다');
      return true;
    }

    try {
      console.log('🛑 키보드 모니터링 중지...');
      
      // uIOhook 중지
      uIOhook.stop();
      
      this.state.isListening = false;
      this.state.isMonitoring = false;
      
      // 현재 세션 종료
      if (this.currentSession) {
        await this.endCurrentSession();
      }
      
      // 큐 정리
      this.keyEventQueue.length = 0;
      
      console.log('✅ 키보드 모니터링 중지됨');
      this.emit('monitoring-stopped', this.getMonitoringStatus());
      
      // 렌더러에 상태 전송
      this.sendToRenderer('keyboard:monitoring-stopped', this.getMonitoringStatus());
      
      return true;
    } catch (error) {
      console.error('❌ 키보드 모니터링 중지 실패:', error);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * 모니터링 토글
   */
  async toggleMonitoring(): Promise<boolean> {
    if (this.state.isListening) {
      return await this.stopMonitoring();
    } else {
      return await this.startMonitoring();
    }
  }

  /**
   * 모니터링 상태 조회
   */
  getMonitoringStatus(): MonitoringState {
    return {
      ...this.state,
      queueSize: this.keyEventQueue.length,
      currentSession: this.currentSession
    };
  }

  /**
   * 현재 세션 통계 조회
   */
  getSessionStats(): SessionStats | null {
    if (!this.currentSession) return null;
    
    const now = Date.now();
    const elapsedMinutes = (now - this.currentSession.startTime) / 60000;
    const wpm = elapsedMinutes > 0 ? Math.round(this.charactersTyped / 5 / elapsedMinutes) : 0;
    
    return {
      ...this.currentSession,
      keyCount: this.keyPressCount,
      charactersTyped: this.charactersTyped,
      wordsTyped: this.wordsTyped,
      wpm,
      activeTime: now - this.currentSession.startTime
    };
  }

  /**
   * 현재 설정 조회
   */
  getConfig(): KeyboardConfig {
    return { ...this.config };
  }

  /**
   * 엔진 설정 업데이트
   */
  async updateConfig(newConfig: Partial<KeyboardConfig>): Promise<void> {
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...newConfig };
    
    console.log('⚙️ 키보드 엔진 설정 업데이트:', newConfig);
    
    // 설정 변경에 따른 재구성
    if (oldConfig.enableGlobalShortcuts !== this.config.enableGlobalShortcuts) {
      if (this.config.enableGlobalShortcuts) {
        this.registerGlobalShortcuts();
      } else {
        this.unregisterGlobalShortcuts();
      }
    }
    
    if (oldConfig.enableAppDetection !== this.config.enableAppDetection) {
      if (this.config.enableAppDetection) {
        this.startAppDetection();
      } else {
        this.stopAppDetection();
      }
    }
    
    this.emit('config-updated', this.config);
  }

  /**
   * 권한 상태 조회
   */
  getPermissionStatus(): PermissionStatus {
    return { ...this.state.permissionStatus };
  }

  /**
   * 시스템 권한 설정 열기
   */
  async openPermissionSettings(): Promise<void> {
    try {
      if (process.platform === 'darwin') {
        // macOS - 시스템 환경설정 > 보안 및 개인정보보호
        shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
      } else if (process.platform === 'win32') {
        // Windows - 설정 앱
        shell.openExternal('ms-settings:privacy-general');
      } else {
        // Linux - 시스템 설정
        shell.openExternal('gnome-control-center');
      }
    } catch (error) {
      console.error('❌ 권한 설정 열기 실패:', error);
      throw error;
    }
  }

  /**
   * 정리 및 종료
   */
  async cleanup(): Promise<void> {
    console.log('🧹 기가차드 키보드 엔진 정리 시작...');
    
    try {
      // 모니터링 중지
      if (this.state.isListening) {
        await this.stopMonitoring();
      }
      
      // 타이머들 정리
      if (this.keyEventProcessor) {
        clearInterval(this.keyEventProcessor);
        this.keyEventProcessor = null;
      }
      
      if (this.activeAppCheckTimer) {
        clearInterval(this.activeAppCheckTimer);
        this.activeAppCheckTimer = null;
      }
      
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = null;
      }
      
      // 글로벌 단축키 해제
      this.unregisterGlobalShortcuts();
      
      // IPC 핸들러 정리
      this.unregisterIpcHandlers();
      
      // 상태 초기화
      this.state = this.getInitialState();
      this.keyEventQueue.length = 0;
      this.mainWindow = null;
      this.currentSession = null;
      
      console.log('✅ 기가차드 키보드 엔진 정리 완료');
      this.emit('cleanup-completed');
    } catch (error) {
      console.error('❌ 키보드 엔진 정리 실패:', error);
      this.emit('error', error);
    }
  }

  // ==================== Private Methods ====================

  private getDefaultConfig(): KeyboardConfig {
    return {
      language: 'korean',
      enableIME: true,
      enableGlobalShortcuts: true,
      enableAppDetection: true,
      autoStartMonitoring: false,
      sessionTimeout: 30, // 30 minutes
      debugMode: process.env.NODE_ENV === 'development'
    };
  }

  private getInitialState(): MonitoringState {
    return {
      isInitialized: false,
      isListening: false,
      isMonitoring: false,
      currentSession: null,
      permissionStatus: {
        accessibility: null,
        screenRecording: null,
        inputMonitoring: null
      },
      queueSize: 0,
      totalEvents: 0
    };
  }

  private getInitialHangulState(): HangulComposerState {
    return {
      cho: '',
      jung: '',
      jong: '',
      result: '',
      isComposing: false
    };
  }

  /**
   * 시스템 권한 확인
   */
  private async checkSystemPermissions(): Promise<void> {
    console.log('🔒 시스템 권한 확인 중...');
    
    try {
      if (process.platform === 'darwin') {
        // macOS 권한 확인 (실제 구현은 네이티브 모듈 필요)
        this.state.permissionStatus.accessibility = true; // 임시
        this.state.permissionStatus.screenRecording = true; // 임시
        this.state.permissionStatus.inputMonitoring = true; // 임시
      } else {
        // 다른 플랫폼은 일반적으로 권한이 필요하지 않음
        this.state.permissionStatus.accessibility = true;
        this.state.permissionStatus.screenRecording = true;
        this.state.permissionStatus.inputMonitoring = true;
      }
      
      console.log('✅ 시스템 권한 확인 완료:', this.state.permissionStatus);
    } catch (error) {
      console.error('❌ 시스템 권한 확인 실패:', error);
      this.state.permissionStatus.accessibility = false;
      this.state.permissionStatus.screenRecording = false;
      this.state.permissionStatus.inputMonitoring = false;
    }
  }

  /**
   * 권한 검증
   */
  private async verifyPermissions(): Promise<boolean> {
    const { accessibility, inputMonitoring } = this.state.permissionStatus;
    return accessibility === true && inputMonitoring === true;
  }

  /**
   * 이벤트 핸들러 설정
   */
  private setupEventHandlers(): void {
    console.log('🔗 키보드 이벤트 핸들러 설정...');
    
    // 키 다운 이벤트
    uIOhook.on('keydown', (event: UiohookKeyboardEvent) => {
      this.handleKeyEvent(event, 'keydown');
    });
    
    // 키 업 이벤트
    uIOhook.on('keyup', (event: UiohookKeyboardEvent) => {
      this.handleKeyEvent(event, 'keyup');
    });
    
    console.log('✅ 키보드 이벤트 핸들러 설정 완료');
  }

  /**
   * 키 이벤트 처리
   */
  private async handleKeyEvent(event: UiohookKeyboardEvent, type: 'keydown' | 'keyup'): Promise<void> {
    if (!this.state.isMonitoring) return;
    
    try {
      const now = Date.now();
      this.state.totalEvents++;
      this.lastActivityTime = now;
      
      // 키 정보 추출
      const keyName = this.getKeyName(event.keycode);
      const keyChar = this.getKeyChar(event.keycode, event.shiftKey);
      
      // 현재 앱 정보 가져오기
      const appInfo = await this.getCurrentAppInfo();
      
      // 키 이벤트 객체 생성
      const keyEvent: KeyEvent = {
        keycode: event.keycode,
        key: keyChar || keyName,
        type,
        timestamp: now,
        appName: appInfo.appName,
        windowTitle: appInfo.windowTitle,
        modifiers: {
          shift: event.shiftKey,
          ctrl: event.ctrlKey,
          alt: event.altKey,
          meta: event.metaKey
        }
      };
      
      // 이벤트 큐에 추가
      this.addKeyEventToQueue(keyEvent);
      
      // keydown에서만 통계 업데이트
      if (type === 'keydown') {
        this.updateStatistics(keyEvent);
        
        // IME 처리
        if (this.config.enableIME && this.config.language === 'korean') {
          this.processHangulComposition(keyEvent);
        }
      }
      
      // 세션 타임아웃 재설정
      this.resetSessionTimeout();
      
    } catch (error) {
      console.error('❌ 키 이벤트 처리 실패:', error);
    }
  }

  /**
   * 키 이벤트를 큐에 추가
   */
  private addKeyEventToQueue(keyEvent: KeyEvent): void {
    this.keyEventQueue.push(keyEvent);
    
    // 큐 크기 제한 (메모리 보호)
    if (this.keyEventQueue.length > 1000) {
      this.keyEventQueue.shift();
    }
  }

  /**
   * 키 이벤트 프로세서 시작
   */
  private startKeyEventProcessor(): void {
    if (this.keyEventProcessor) return;
    
    this.keyEventProcessor = setInterval(() => {
      this.processKeyEventQueue();
    }, 100); // 100ms마다 처리
  }

  /**
   * 키 이벤트 큐 처리
   */
  private processKeyEventQueue(): void {
    if (this.keyEventQueue.length === 0) return;
    
    try {
      const events = this.keyEventQueue.splice(0, 10); // 한 번에 10개씩 처리
      
      for (const event of events) {
        // 이벤트 처리 로직
        this.processIndividualKeyEvent(event);
      }
      
      // 실시간 상태 업데이트
      this.sendRealtimeUpdate();
      
    } catch (error) {
      console.error('❌ 키 이벤트 큐 처리 실패:', error);
    }
  }

  /**
   * 개별 키 이벤트 처리
   */
  private processIndividualKeyEvent(event: KeyEvent): void {
    // 렌더러에 키 이벤트 전송
    this.sendToRenderer('keyboard:key-event', {
      key: event.key,
      keycode: event.keycode,
      type: event.type,
      timestamp: event.timestamp,
      appName: event.appName,
      windowTitle: event.windowTitle,
      modifiers: event.modifiers
    });
    
    // 이벤트 발생
    this.emit('key-event', event);
  }

  /**
   * 통계 업데이트
   */
  private updateStatistics(keyEvent: KeyEvent): void {
    this.keyPressCount++;
    
    // 문자 입력 카운트
    if (keyEvent.key && keyEvent.key.length === 1) {
      this.charactersTyped++;
      
      // 공백 문자로 단어 구분
      if (keyEvent.key === ' ') {
        this.wordsTyped++;
      }
    }
    
    // 세션 통계 업데이트
    if (this.currentSession) {
      this.currentSession.keyCount = this.keyPressCount;
      this.currentSession.charactersTyped = this.charactersTyped;
      this.currentSession.wordsTyped = this.wordsTyped;
      
      const elapsedMinutes = (Date.now() - this.currentSession.startTime) / 60000;
      this.currentSession.wpm = elapsedMinutes > 0 ? Math.round(this.charactersTyped / 5 / elapsedMinutes) : 0;
    }
  }

  /**
   * 한글 조합 처리
   */
  private processHangulComposition(keyEvent: KeyEvent): void {
    // 한글 자모 처리 로직 (loop_6에서 가져온 고급 로직)
    const char = keyEvent.key;
    
    if (this.isHangulJamo(char)) {
      const composed = this.composeHangul(char);
      if (composed.result) {
        // 조합 완료된 한글을 렌더러에 전송
        this.sendToRenderer('keyboard:hangul-composed', {
          result: composed.result,
          state: composed,
          timestamp: keyEvent.timestamp
        });
      }
    } else if (this.hangulComposer.isComposing) {
      // 한글 조합 중 다른 키가 입력되면 조합 완료
      this.finishHangulComposition();
    }
  }

  /**
   * 한글 자모 판별
   */
  private isHangulJamo(char: string): boolean {
    if (!char || char.length !== 1) return false;
    const code = char.charCodeAt(0);
    return (code >= 0x1100 && code <= 0x11FF) || // 한글 자모
           (code >= 0x3130 && code <= 0x318F) || // 한글 호환 자모
           (code >= 0xAC00 && code <= 0xD7AF);   // 한글 음절
  }

  /**
   * 한글 조합
   */
  private composeHangul(char: string): HangulComposerState {
    // 한글 조합 로직 (간단한 버전)
    // 완전한 구현은 loop_6의 hangul-composer를 참조
    
    const newState = { ...this.hangulComposer };
    
    // 자음/모음 분류 및 조합 로직
    if (this.isChosung(char)) {
      newState.cho = char;
      newState.isComposing = true;
    } else if (this.isJungsung(char)) {
      newState.jung = char;
    } else if (this.isJongsung(char)) {
      newState.jong = char;
    }
    
    // 조합 결과 생성
    if (newState.cho && newState.jung) {
      newState.result = this.combineHangul(newState.cho, newState.jung, newState.jong);
      if (!newState.jong) {
        newState.isComposing = false;
      }
    }
    
    this.hangulComposer = newState;
    return newState;
  }

  /**
   * 한글 조합 완료
   */
  private finishHangulComposition(): void {
    if (this.hangulComposer.isComposing && this.hangulComposer.result) {
      this.sendToRenderer('keyboard:hangul-composition-finished', {
        result: this.hangulComposer.result,
        timestamp: Date.now()
      });
    }
    
    this.hangulComposer = this.getInitialHangulState();
  }

  // Hangul Helper Methods (간단한 구현)
  private isChosung(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x1100 && code <= 0x1112;
  }

  private isJungsung(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x1161 && code <= 0x1175;
  }

  private isJongsung(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x11A8 && code <= 0x11C2;
  }

  private combineHangul(cho: string, jung: string, jong: string = ''): string {
    // 간단한 한글 조합 (완전한 구현은 별도 모듈 필요)
    const choCode = cho.charCodeAt(0) - 0x1100;
    const jungCode = jung.charCodeAt(0) - 0x1161;
    const jongCode = jong ? jong.charCodeAt(0) - 0x11A7 : 0;
    
    const syllable = 0xAC00 + (choCode * 21 + jungCode) * 28 + jongCode;
    return String.fromCharCode(syllable);
  }

  /**
   * 키 이름 가져오기
   */
  private getKeyName(keycode: number): string {
    // uIOhook 키코드를 키 이름으로 변환
    const keyMap: { [key: number]: string } = {
      [UiohookKey.Space]: 'Space',
      [UiohookKey.Enter]: 'Enter',
      [UiohookKey.Tab]: 'Tab',
      [UiohookKey.Backspace]: 'Backspace',
      [UiohookKey.Escape]: 'Escape',
      [UiohookKey.Shift]: 'Shift',
      [UiohookKey.Ctrl]: 'Ctrl',
      [UiohookKey.Alt]: 'Alt',
      [UiohookKey.Meta]: 'Meta',
      // 더 많은 키 매핑...
    };
    
    return keyMap[keycode] || `Key${keycode}`;
  }

  /**
   * 키 문자 가져오기
   */
  private getKeyChar(keycode: number, isShift: boolean = false): string {
    // 키코드를 실제 문자로 변환
    // 언어별 처리 로직 (간단한 버전)
    
    // 영문자
    if (keycode >= 30 && keycode <= 38) { // Q-P
      const char = String.fromCharCode(81 + keycode - 30);
      return isShift ? char : char.toLowerCase();
    }
    
    if (keycode >= 44 && keycode <= 53) { // A-L
      const char = String.fromCharCode(65 + keycode - 44);
      return isShift ? char : char.toLowerCase();
    }
    
    if (keycode >= 54 && keycode <= 61) { // Z-M
      const char = String.fromCharCode(90 + keycode - 54);
      return isShift ? char : char.toLowerCase();
    }
    
    // 숫자
    if (keycode >= 2 && keycode <= 11) {
      const nums = isShift ? '!@#$%^&*()' : '1234567890';
      return nums[keycode - 2];
    }
    
    // 공백
    if (keycode === UiohookKey.Space) return ' ';
    
    return '';
  }

  /**
   * 현재 앱 정보 가져오기
   */
  private async getCurrentAppInfo(): Promise<{ appName: string; windowTitle?: string }> {
    try {
      // get-windows 라이브러리 사용 (옵션)
      const getWindows = await import('get-windows');
      const activeWindow = await getWindows.activeWindow();
      
      if (activeWindow) {
        return {
          appName: activeWindow.owner?.name || 'Unknown',
          windowTitle: activeWindow.title || undefined
        };
      }
    } catch (error) {
      // 오류 시 캐시된 정보 사용
    }
    
    return {
      appName: this.lastActiveApp || 'Unknown',
      windowTitle: this.lastWindowTitle || undefined
    };
  }

  /**
   * 앱 감지 시작
   */
  private startAppDetection(): void {
    if (this.activeAppCheckTimer) return;
    
    this.activeAppCheckTimer = setInterval(async () => {
      const appInfo = await this.getCurrentAppInfo();
      
      if (appInfo.appName !== this.lastActiveApp || appInfo.windowTitle !== this.lastWindowTitle) {
        this.lastActiveApp = appInfo.appName;
        this.lastWindowTitle = appInfo.windowTitle || '';
        
        // 앱 변경 이벤트 발생
        this.emit('app-changed', appInfo);
        this.sendToRenderer('keyboard:app-changed', appInfo);
        
        // 새 세션 시작 (필요시)
        if (this.currentSession && this.currentSession.appName !== appInfo.appName) {
          await this.startNewSession(appInfo);
        }
      }
    }, 1000); // 1초마다 확인
  }

  /**
   * 앱 감지 중지
   */
  private stopAppDetection(): void {
    if (this.activeAppCheckTimer) {
      clearInterval(this.activeAppCheckTimer);
      this.activeAppCheckTimer = null;
    }
  }

  /**
   * 새 세션 시작
   */
  private async startNewSession(appInfo?: { appName: string; windowTitle?: string }): Promise<void> {
    // 기존 세션 종료
    if (this.currentSession) {
      await this.endCurrentSession();
    }
    
    const now = Date.now();
    const sessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
    
    const appData = appInfo || await this.getCurrentAppInfo();
    
    this.currentSession = {
      sessionId,
      startTime: now,
      keyCount: 0,
      charactersTyped: 0,
      wordsTyped: 0,
      wpm: 0,
      accuracy: 100,
      activeTime: 0,
      appName: appData.appName,
      windowTitle: appData.windowTitle
    };
    
    // 통계 초기화
    this.keyPressCount = 0;
    this.charactersTyped = 0;
    this.wordsTyped = 0;
    
    console.log(`🆕 새 타이핑 세션 시작: ${sessionId} (${appData.appName})`);
    this.emit('session-started', this.currentSession);
    this.sendToRenderer('keyboard:session-started', this.currentSession);
  }

  /**
   * 현재 세션 종료
   */
  private async endCurrentSession(): Promise<void> {
    if (!this.currentSession) return;
    
    const now = Date.now();
    const finalSession = {
      ...this.currentSession,
      activeTime: now - this.currentSession.startTime,
      keyCount: this.keyPressCount,
      charactersTyped: this.charactersTyped,
      wordsTyped: this.wordsTyped
    };
    
    console.log(`✅ 타이핑 세션 종료: ${finalSession.sessionId} (${finalSession.activeTime}ms, ${finalSession.keyCount}키)`);
    
    this.emit('session-ended', finalSession);
    this.sendToRenderer('keyboard:session-ended', finalSession);
    
    this.currentSession = null;
  }

  /**
   * 세션 타임아웃 재설정
   */
  private resetSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    
    const timeoutMs = this.config.sessionTimeout * 60 * 1000;
    this.sessionTimeout = setTimeout(async () => {
      if (this.currentSession) {
        console.log('⏰ 세션 타임아웃으로 인한 종료');
        await this.endCurrentSession();
      }
    }, timeoutMs);
  }

  /**
   * 글로벌 단축키 등록
   */
  private registerGlobalShortcuts(): void {
    try {
      // 모니터링 토글 단축키
      globalShortcut.register('CommandOrControl+Shift+Alt+K', () => {
        this.toggleMonitoring();
      });
      
      // 통계 표시 단축키
      globalShortcut.register('CommandOrControl+Shift+Alt+S', () => {
        this.sendToRenderer('keyboard:show-stats', this.getSessionStats());
      });
      
      console.log('⌨️ 글로벌 단축키 등록 완료');
    } catch (error) {
      console.error('❌ 글로벌 단축키 등록 실패:', error);
    }
  }

  /**
   * 글로벌 단축키 해제
   */
  private unregisterGlobalShortcuts(): void {
    try {
      globalShortcut.unregisterAll();
      console.log('🔓 글로벌 단축키 해제 완료');
    } catch (error) {
      console.error('❌ 글로벌 단축키 해제 실패:', error);
    }
  }

  /**
   * IPC 핸들러 등록
   */
  private registerIpcHandlers(): void {
    const handlers = {
      // 모니터링 제어
      'keyboard-engine:start-monitoring': () => this.startMonitoring(),
      'keyboard-engine:stop-monitoring': () => this.stopMonitoring(),
      'keyboard-engine:toggle-monitoring': () => this.toggleMonitoring(),
      
      // 상태 조회
      'keyboard-engine:get-status': () => this.getMonitoringStatus(),
      'keyboard-engine:get-session-stats': () => this.getSessionStats(),
      'keyboard-engine:get-permissions': () => this.getPermissionStatus(),
      
      // 설정 관리
      'keyboard-engine:update-config': (_event: any, config: Partial<KeyboardConfig>) => this.updateConfig(config),
      'keyboard-engine:get-config': () => this.config,
      
      // 권한 관리
      'keyboard-engine:open-permission-settings': () => this.openPermissionSettings(),
      'keyboard-engine:check-permissions': () => this.checkSystemPermissions(),
      
      // 세션 관리
      'keyboard-engine:start-new-session': () => this.startNewSession(),
      'keyboard-engine:end-current-session': () => this.endCurrentSession(),
      
      // 한글 조합
      'keyboard-engine:get-hangul-state': () => this.hangulComposer,
      'keyboard-engine:finish-composition': () => this.finishHangulComposition()
    };
    
    for (const [channel, handler] of Object.entries(handlers)) {
      ipcMain.handle(channel, handler);
    }
    
    console.log('📡 키보드 엔진 IPC 핸들러 등록 완료');
  }

  /**
   * IPC 핸들러 해제
   */
  private unregisterIpcHandlers(): void {
    const channels = [
      'keyboard-engine:start-monitoring',
      'keyboard-engine:stop-monitoring',
      'keyboard-engine:toggle-monitoring',
      'keyboard-engine:get-status',
      'keyboard-engine:get-session-stats',
      'keyboard-engine:get-permissions',
      'keyboard-engine:update-config',
      'keyboard-engine:get-config',
      'keyboard-engine:open-permission-settings',
      'keyboard-engine:check-permissions',
      'keyboard-engine:start-new-session',
      'keyboard-engine:end-current-session',
      'keyboard-engine:get-hangul-state',
      'keyboard-engine:finish-composition'
    ];
    
    for (const channel of channels) {
      ipcMain.removeHandler(channel);
    }
    
    console.log('🔌 키보드 엔진 IPC 핸들러 해제 완료');
  }

  /**
   * 실시간 업데이트 전송
   */
  private sendRealtimeUpdate(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return;
    
    const update = {
      timestamp: Date.now(),
      keyCount: this.keyPressCount,
      charactersTyped: this.charactersTyped,
      wordsTyped: this.wordsTyped,
      queueSize: this.keyEventQueue.length,
      isMonitoring: this.state.isMonitoring,
      currentApp: this.lastActiveApp,
      sessionStats: this.getSessionStats()
    };
    
    this.sendToRenderer('keyboard:realtime-update', update);
  }

  /**
   * 렌더러로 데이터 전송
   */
  private sendToRenderer(channel: string, data: any): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, data);
    }
  }
}

// Export singleton instance
export const keyboardEngine = KeyboardEngine.getInstance();

// Export types
export type {
  KeyboardConfig,
  KeyEvent,
  SessionStats,
  PermissionStatus,
  MonitoringState,
  HangulComposerState
};

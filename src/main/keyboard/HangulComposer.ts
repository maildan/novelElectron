// 🔥 기가차드 한글 조합기 - 완벽한 한글 입력 처리!

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { KeyboardEvent, Result } from '../../shared/types';
import KEYBOARD_CONSTANTS from './constants';

// #DEBUG: Hangul composer entry point
Logger.debug('HANGUL_COMPOSER', 'Hangul composer module loaded');

// 🔥 기가차드 한글 조합 상태
export interface HangulCompositionState {
  isComposing: boolean;
  initial: string; // 초성
  medial: string;  // 중성
  final: string;   // 종성
  composed: string; // 조합된 글자
}

// 🔥 기가차드 한글 조합 결과
export interface HangulCompositionResult {
  completed: string; // 완성된 문자
  composing: string; // 조합 중인 문자
}

// 🔥 기가차드 한글 유니코드 범위
const HANGUL_BASE = 0xAC00; // 가
const INITIAL_COUNT = 19;    // 초성 개수
const MEDIAL_COUNT = 21;     // 중성 개수
const FINAL_COUNT = 28;      // 종성 개수 (없음 포함)

// 🔥 기가차드 초성 배열
const INITIALS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// 🔥 기가차드 중성 배열
const MEDIALS = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

// 🔥 기가차드 종성 배열
const FINALS = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * 🔥 HangulComposer - 완벽한 한글 조합 시스템
 * 실시간 한글 입력 처리, 조합, 분해, 오토마타 기반 상태 관리
 */
export class HangulComposer extends BaseManager {
  private readonly componentName = 'HANGUL_COMPOSER';
  private compositionState: HangulCompositionState;
  private keyMap: Map<string, string>;
  private lastProcessedTime = 0;
  private compositionTimeout: NodeJS.Timeout | null = null;

  constructor() {
    super({
      name: 'HangulComposer',
      autoStart: false,
      retryOnError: false,
      maxRetries: 1,
      retryDelay: 500,
    });

    this.compositionState = this.createEmptyState();
    this.keyMap = new Map();
    this.setupKeyMapping();

    Logger.info(this.componentName, 'Hangul composer instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      this.setupKeyMapping();
      Logger.info(this.componentName, 'Hangul composer initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize hangul composer', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      this.compositionState = this.createEmptyState();
      Logger.info(this.componentName, 'Hangul composer started successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start hangul composer', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      this.finishComposition();
      if (this.compositionTimeout) {
        clearTimeout(this.compositionTimeout);
        this.compositionTimeout = null;
      }
      Logger.info(this.componentName, 'Hangul composer stopped successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop hangul composer', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    this.compositionState = this.createEmptyState();
    if (this.compositionTimeout) {
      clearTimeout(this.compositionTimeout);
      this.compositionTimeout = null;
    }
    Logger.info(this.componentName, 'Hangul composer cleaned up');
  }

  /**
   * 키 입력 처리 (메인 인터페이스)
   */
  public async processKey(event: KeyboardEvent): Promise<HangulCompositionResult> {
    try {
      this.lastProcessedTime = Date.now();
      
      // 백스페이스 처리
      if (event.key === 'backspace') {
        return this.handleBackspace();
      }
      
      // 스페이스나 엔터 처리
      if (event.key === 'space' || event.key === 'enter') {
        return this.finishComposition();
      }
      
      // 한글 키 확인
      const hangulChar = this.keyMap.get(event.key);
      if (!hangulChar) {
        // 한글이 아닌 경우 조합 완료
        return this.finishComposition();
      }
      
      // 한글 조합 처리
      return this.composeHangul(hangulChar);
      
    } catch (error) {
      Logger.error(this.componentName, 'Error processing key', error as Error);
      return { completed: '', composing: '' };
    }
  }

  /**
   * 직접 키 처리 (문자열 입력)
   */
  public processKeyString(key: string): HangulCompositionResult {
    try {
      // 백스페이스 처리
      if (key === 'backspace' || key === '\b') {
        return this.handleBackspace();
      }
      
      // 스페이스나 엔터 처리
      if (key === ' ' || key === '\n') {
        return this.finishComposition();
      }
      
      // 한글 키 확인
      const hangulChar = this.keyMap.get(key) || key;
      if (!this.isHangulChar(hangulChar)) {
        // 한글이 아닌 경우 조합 완료
        return this.finishComposition();
      }
      
      // 한글 조합 처리
      return this.composeHangul(hangulChar);
      
    } catch (error) {
      Logger.error(this.componentName, 'Error processing key string', error as Error);
      return { completed: '', composing: '' };
    }
  }

  /**
   * 한글 조합 처리
   */
  private composeHangul(char: string): HangulCompositionResult {
    const isInitial = this.isInitial(char);
    const isMedial = this.isMedial(char);
    const isFinal = this.isFinal(char);

    let completed = '';
    let composing = '';

    if (isInitial) {
      // 초성 처리
      if (!this.compositionState.isComposing) {
        // 새로운 조합 시작
        this.compositionState.isComposing = true;
        this.compositionState.initial = char;
        this.compositionState.medial = '';
        this.compositionState.final = '';
      } else if (this.compositionState.medial === '') {
        // 초성 다음에 초성이 온 경우 (이전 글자 완성)
        completed = this.buildCharacter();
        this.compositionState.initial = char;
        this.compositionState.medial = '';
        this.compositionState.final = '';
      } else {
        // 종성 자리에 초성이 온 경우
        if (this.compositionState.final === '') {
          this.compositionState.final = char;
        } else {
          // 이전 글자 완성하고 새 글자 시작
          completed = this.buildCharacter();
          this.compositionState.initial = char;
          this.compositionState.medial = '';
          this.compositionState.final = '';
        }
      }
    } else if (isMedial) {
      // 중성 처리
      if (this.compositionState.initial !== '') {
        if (this.compositionState.medial === '') {
          this.compositionState.medial = char;
        } else {
          // 복합 중성 시도
          const combined = this.combineMedials(this.compositionState.medial, char);
          if (combined) {
            this.compositionState.medial = combined;
          } else {
            // 조합 불가 - 이전 글자 완성
            completed = this.buildCharacter();
            this.compositionState.initial = '';
            this.compositionState.medial = char;
            this.compositionState.final = '';
          }
        }
      }
    } else if (isFinal) {
      // 종성 처리
      if (this.compositionState.initial !== '' && this.compositionState.medial !== '') {
        if (this.compositionState.final === '') {
          this.compositionState.final = char;
        } else {
          // 복합 종성 시도
          const combined = this.combineFinals(this.compositionState.final, char);
          if (combined) {
            this.compositionState.final = combined;
          } else {
            // 조합 불가 - 이전 글자 완성
            completed = this.buildCharacter();
            this.compositionState.initial = char;
            this.compositionState.medial = '';
            this.compositionState.final = '';
          }
        }
      }
    }

    // 현재 조합 중인 글자 생성
    if (this.compositionState.isComposing) {
      composing = this.buildCharacter();
      this.compositionState.composed = composing;
    }

    // 조합 타임아웃 설정
    this.setCompositionTimeout();

    return { completed, composing };
  }

  /**
   * 백스페이스 처리
   */
  private handleBackspace(): HangulCompositionResult {
    if (!this.compositionState.isComposing) {
      return { completed: '', composing: '' };
    }

    let completed = '';
    let composing = '';

    // 종성 → 중성 → 초성 순으로 제거
    if (this.compositionState.final !== '') {
      this.compositionState.final = '';
    } else if (this.compositionState.medial !== '') {
      this.compositionState.medial = '';
    } else if (this.compositionState.initial !== '') {
      this.compositionState.initial = '';
      this.compositionState.isComposing = false;
    }

    // 현재 조합 상태 업데이트
    if (this.compositionState.isComposing) {
      composing = this.buildCharacter();
      this.compositionState.composed = composing;
    }

    return { completed, composing };
  }

  /**
   * 조합 완료
   */
  private finishComposition(): HangulCompositionResult {
    let completed = '';
    
    if (this.compositionState.isComposing) {
      completed = this.buildCharacter();
      this.compositionState = this.createEmptyState();
    }

    return { completed, composing: '' };
  }

  /**
   * 한글 문자 조합
   */
  private buildCharacter(): string {
    if (!this.compositionState.initial || !this.compositionState.medial) {
      return this.compositionState.initial || this.compositionState.medial || '';
    }

    const initialIndex = INITIALS.indexOf(this.compositionState.initial);
    const medialIndex = MEDIALS.indexOf(this.compositionState.medial);
    const finalIndex = FINALS.indexOf(this.compositionState.final);

    if (initialIndex === -1 || medialIndex === -1 || finalIndex === -1) {
      return this.compositionState.initial + this.compositionState.medial + this.compositionState.final;
    }

    const code = HANGUL_BASE + (initialIndex * MEDIAL_COUNT * FINAL_COUNT) + (medialIndex * FINAL_COUNT) + finalIndex;
    return String.fromCharCode(code);
  }

  /**
   * 키 매핑 설정
   */
  private setupKeyMapping(): void {
    // KEYBOARD_CONSTANTS에서 한글 키 매핑 가져오기
    if (KEYBOARD_CONSTANTS.HANGUL_KEY_MAP) {
      Object.entries(KEYBOARD_CONSTANTS.HANGUL_KEY_MAP).forEach(([key, value]) => {
        this.keyMap.set(key, value as string);
      });
    } else {
      // 기본 키 매핑 (QWERTY → 한글)
      const defaultMapping: Record<string, string> = {
        'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
        'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
        'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
        'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
        'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ', 'b': 'ㅠ',
        'n': 'ㅜ', 'm': 'ㅡ'
      };

      Object.entries(defaultMapping).forEach(([key, value]) => {
        this.keyMap.set(key, value);
      });
    }

    Logger.debug(this.componentName, 'Key mapping setup completed', {
      mappingCount: this.keyMap.size,
    });
  }

  /**
   * 중성 조합
   */
  private combineMedials(first: string, second: string): string | null {
    const combinations: Record<string, Record<string, string>> = {
      'ㅗ': { 'ㅏ': 'ㅘ', 'ㅐ': 'ㅙ', 'ㅣ': 'ㅚ' },
      'ㅜ': { 'ㅓ': 'ㅝ', 'ㅔ': 'ㅞ', 'ㅣ': 'ㅟ' },
      'ㅡ': { 'ㅣ': 'ㅢ' }
    };

    return combinations[first]?.[second] || null;
  }

  /**
   * 종성 조합
   */
  private combineFinals(first: string, second: string): string | null {
    const combinations: Record<string, Record<string, string>> = {
      'ㄱ': { 'ㅅ': 'ㄳ' },
      'ㄴ': { 'ㅈ': 'ㄵ', 'ㅎ': 'ㄶ' },
      'ㄹ': { 'ㄱ': 'ㄺ', 'ㅁ': 'ㄻ', 'ㅂ': 'ㄼ', 'ㅅ': 'ㄽ', 'ㅌ': 'ㄾ', 'ㅍ': 'ㄿ', 'ㅎ': 'ㅀ' },
      'ㅂ': { 'ㅅ': 'ㅄ' }
    };

    return combinations[first]?.[second] || null;
  }

  /**
   * 문자 타입 확인 메서드들
   */
  private isHangulChar(char: string): boolean {
    const code = char.charCodeAt(0);
    return (code >= 0x1100 && code <= 0x11FF) || // 한글 자모
           (code >= 0x3130 && code <= 0x318F) || // 한글 호환 자모
           (code >= 0xAC00 && code <= 0xD7AF);   // 한글 음절
  }

  private isInitial(char: string): boolean {
    return INITIALS.includes(char);
  }

  private isMedial(char: string): boolean {
    return MEDIALS.includes(char);
  }

  private isFinal(char: string): boolean {
    return FINALS.includes(char);
  }

  /**
   * 빈 상태 생성
   */
  private createEmptyState(): HangulCompositionState {
    return {
      isComposing: false,
      initial: '',
      medial: '',
      final: '',
      composed: '',
    };
  }

  /**
   * 조합 타임아웃 설정 (일정 시간 후 자동 완료)
   */
  private setCompositionTimeout(): void {
    if (this.compositionTimeout) {
      clearTimeout(this.compositionTimeout);
    }

    this.compositionTimeout = setTimeout(() => {
      if (this.compositionState.isComposing) {
        this.finishComposition();
      }
    }, 2000); // 2초 후 자동 완료
  }

  /**
   * 현재 조합 상태 반환
   */
  public getCompositionState(): HangulCompositionState {
    return { ...this.compositionState };
  }

  /**
   * 조합 상태 리셋
   */
  public resetComposition(): void {
    this.compositionState = this.createEmptyState();
    if (this.compositionTimeout) {
      clearTimeout(this.compositionTimeout);
      this.compositionTimeout = null;
    }
    Logger.debug(this.componentName, 'Composition state reset');
  }

  /**
   * 헬스 체크 (BaseManager 오버라이드)
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    isComposing: boolean;
    keyMappingCount: number;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      isComposing: this.compositionState.isComposing,
      keyMappingCount: this.keyMap.size,
    };
  }
}

export const hangulComposer = new HangulComposer();
export default hangulComposer;

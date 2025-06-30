// 🔥 기가차드 keycode 기반 LanguageDetector - macOS IME 완전 우회!

import { Logger } from '../../../shared/logger';
import { BaseManager } from '../../common/BaseManager';
import { KEYBOARD_LANGUAGES } from '../../../shared/common';
import { UiohookKeyboardEvent } from '../../../shared/types';
import { exec } from 'child_process';

// 🔥 언어 감지 결과 인터페이스
export interface LanguageDetectionResult {
  language: 'ko' | 'en' | 'ja' | 'zh';
  confidence: number;
  method: 'keycode' | 'pattern' | 'fallback';
  isComposing: boolean;
  detectedChar?: string; // 🔥 감지된 문자 (한글 등)
  metadata?: Record<string, unknown>;
}

// 🔥 키 버퍼 이벤트
interface KeyBufferEvent {
  keycode: number;
  timestamp: number;
  language?: 'ko' | 'en' | 'ja' | 'zh';
}

/**
 * 🔥 기가차드 keycode 기반 LanguageDetector - IME 우회 버전!
 */
export class LanguageDetector extends BaseManager {
  private readonly componentName = 'LANGUAGE_DETECTOR';
  
  // 🔥 상태 관리 (시스템 기반 초기화)
  private currentLanguage: 'ko' | 'en' | 'ja' | 'zh' = 'en'; // 🔥 constructor에서 시스템 감지로 설정
  private keyBuffer: KeyBufferEvent[] = [];
  private readonly BUFFER_SIZE = 5;
  
  // 🔥 성능 카운터
  private detectionCount = 0;
  private totalProcessingTime = 0;
  
  // 🔥 기가차드 시스템 입력소스 감지 (macOS HIToolbox 우회!)
  private systemInputSourceCache: 'ko' | 'en' | null = null;
  private lastSystemCheck = 0;
  private readonly SYSTEM_CHECK_INTERVAL = 5000; // 5초
  private systemCheckInProgress = false;
  
  // 🔥 기가차드 물리적 keycode → 한글자모 매핑 (소문자 기준!)
  private readonly KEYCODE_TO_HANGUL: Map<number, string> = new Map([
    // 🔥 물리적 keycode 매핑 (macOS uiohook 기준)
    [12, 'ㅂ'],   // q키 물리적 keycode → ㅂ
    [13, 'ㅈ'],   // w키 물리적 keycode → ㅈ
    [14, 'ㄷ'],   // e키 물리적 keycode → ㄷ
    [15, 'ㄱ'],   // r키 물리적 keycode → ㄱ
    [17, 'ㅅ'],   // t키 물리적 keycode → ㅅ
    [16, 'ㅛ'],   // y키 물리적 keycode → ㅛ
    [32, 'ㅇ'],   // 🔥 d키 물리적 keycode → ㅇ (긴급 추가!)
    [33, 'ㄹ'],   // f키 물리적 keycode → ㄹ
    [34, 'ㅎ'],   // g키 물리적 keycode → ㅎ
    [35, 'ㅗ'],   // h키 물리적 keycode → ㅗ
    [38, 'ㅣ'],   // l키 물리적 keycode → ㅣ
    [37, 'ㅏ'],   // k키 물리적 keycode → ㅏ
    [31, 'ㄴ'],   // s키 물리적 keycode → ㄴ
    [0, 'ㅁ'],    // a키 물리적 keycode → ㅁ
    [46, 'ㅊ'],   // c키 물리적 keycode → ㅊ
    [50, 'ㅡ'],   // m키 물리적 keycode → ㅡ
    
    // 상단 행 문자코드 (기존 방식과 호환)
    [113, 'ㅂ'],  // q → ㅂ
    [119, 'ㅈ'],  // w → ㅈ  
    [101, 'ㄷ'],  // e → ㄷ
    [114, 'ㄱ'],  // r → ㄱ
    [116, 'ㅅ'],  // t → ㅅ
    [121, 'ㅛ'],  // y → ㅛ
    [117, 'ㅕ'],  // u → ㅕ
    [105, 'ㅑ'],  // i → ㅑ
    [111, 'ㅐ'],  // o → ㅐ
    [112, 'ㅔ'],  // p → ㅔ
    
    // 중단 행 (소문자)
    [97, 'ㅁ'],   // a → ㅁ
    [115, 'ㄴ'],  // s → ㄴ
    [100, 'ㅇ'],  // d → ㅇ
    [102, 'ㄹ'],  // f → ㄹ 
    [103, 'ㅎ'],  // g → ㅎ
    [104, 'ㅗ'],  // h → ㅗ
    [106, 'ㅓ'],  // j → ㅓ
    [107, 'ㅏ'],  // k → ㅏ
    [108, 'ㅣ'],  // l → ㅣ
    
    // 하단 행 (소문자)
    [122, 'ㅋ'],  // z → ㅋ
    [120, 'ㅌ'],  // x → ㅌ
    [99, 'ㅊ'],   // c → ㅊ
    [118, 'ㅍ'],  // v → ㅍ
    [98, 'ㅠ'],   // b → ㅠ
    [110, 'ㅜ'],  // n → ㅜ
    [109, 'ㅡ'],  // m → ㅡ
    
    // 대문자도 지원 (Shift 키 조합)
    [81, 'ㅂ'],   // Q → ㅂ
    [87, 'ㅈ'],   // W → ㅈ  
    [69, 'ㄷ'],   // E → ㄷ
    [82, 'ㄱ'],   // R → ㄱ
    [84, 'ㅅ'],   // T → ㅅ
    [89, 'ㅛ'],   // Y → ㅛ
    [85, 'ㅕ'],   // U → ㅕ
    [73, 'ㅑ'],   // I → ㅑ
    [79, 'ㅐ'],   // O → ㅐ
    [80, 'ㅔ'],   // P → ㅔ
    [65, 'ㅁ'],   // A → ㅁ
    [83, 'ㄴ'],   // S → ㄴ
    [68, 'ㅇ'],   // D → ㅇ
    [70, 'ㄹ'],   // F → ㄹ
    [71, 'ㅎ'],   // G → ㅎ
    [72, 'ㅗ'],   // H → ㅗ
    [74, 'ㅓ'],   // J → ㅓ
    [75, 'ㅏ'],   // K → ㅏ
    [76, 'ㅣ'],   // L → ㅣ
    [90, 'ㅋ'],   // Z → ㅋ
    [88, 'ㅌ'],   // X → ㅌ
    [67, 'ㅊ'],   // C → ㅊ
    [86, 'ㅍ'],   // V → ㅍ
    [66, 'ㅠ'],   // B → ㅠ
    [78, 'ㅜ'],   // N → ㅜ
    [77, 'ㅡ'],   // M → ㅡ
  ]);
  
  // 🔥 영어 키코드 범위 (A-Z, 숫자, 특수문자)
  private readonly ENGLISH_KEYCODES = new Set([
    // A-Z (65-90)
    ...Array.from({length: 26}, (_, i) => 65 + i),
    // 숫자 (48-57) 
    ...Array.from({length: 10}, (_, i) => 48 + i),
    // 특수문자 (자주 사용되는 것들)
    32, 188, 190, 191, 186, 222, 219, 221, 220, 192, 189, 187
  ]);

  // 🔥 올바른 한글 매핑 - 알파벳 keycode와 물리적 keycode 모두 허용!
  private readonly VALID_HANGUL_KEYCODES: Map<number, string> = new Map([
    // 🔥 물리적 keycode (macOS uiohook 실제 값) - 핵심!
    [32, 'ㅇ'],   // d키 물리적 keycode → ㅇ (긴급 추가!)
    [31, 'ㄴ'],   // s키 물리적 keycode → ㄴ
    [37, 'ㅏ'],   // k키 물리적 keycode → ㅏ
    [38, 'ㅣ'],   // l키 물리적 keycode → ㅣ
    [19, 'ㄱ'],   // r키 물리적 keycode → ㄱ
    [17, 'ㅈ'],   // w키 물리적 keycode → ㅈ
    [46, 'ㅊ'],   // c키 물리적 keycode → ㅊ
    
    // 🔥 완전한 두벌식 한글 매핑 (모든 키 포함!)
    [113, 'ㅂ'], // q → ㅂ
    [119, 'ㅈ'], // w → ㅈ  
    [101, 'ㄷ'], // e → ㄷ
    [114, 'ㄱ'], // r → ㄱ
    [116, 'ㅅ'], // t → ㅅ
    [121, 'ㅛ'], // y → ㅛ
    [117, 'ㅕ'], // u → ㅕ
    [105, 'ㅑ'], // i → ㅑ
    [111, 'ㅐ'], // o → ㅐ
    [112, 'ㅔ'], // p → ㅔ
    
    // 중단 행 (완전 매핑!)
    [97, 'ㅁ'],  // a → ㅁ
    [115, 'ㄴ'], // s → ㄴ
    [100, 'ㅇ'], // d → ㅇ  🔥 핵심 수정!
    [102, 'ㄹ'], // f → ㄹ
    [103, 'ㅎ'], // g → ㅎ
    [104, 'ㅗ'], // h → ㅗ
    [106, 'ㅓ'], // j → ㅓ
    [107, 'ㅏ'], // k → ㅏ
    [108, 'ㅣ'], // l → ㅣ
    
    // 하단 행 (완전 매핑!)
    [122, 'ㅋ'], // z → ㅋ
    [120, 'ㅌ'], // x → ㅌ
    [99, 'ㅊ'],  // c → ㅊ
    [118, 'ㅍ'], // v → ㅍ
    [98, 'ㅠ'],  // b → ㅠ
    [110, 'ㅜ'], // n → ㅜ
    [109, 'ㅡ'], // m → ㅡ  🔥 핵심 수정!
    
    // 🔥 대문자 매핑 (Shift+키 지원) + 복합모음
    [81, 'ㅃ'],  // Q → ㅃ (Shift+q = 쌍자음)
    [87, 'ㅉ'],  // W → ㅉ (Shift+w = 쌍자음)
    [69, 'ㄸ'],  // E → ㄸ (Shift+e = 쌍자음)
    [82, 'ㄲ'],  // R → ㄲ (Shift+r = 쌍자음)
    [84, 'ㅆ'],  // T → ㅆ (Shift+t = 쌍자음)
    [89, 'ㅛ'],  // Y → ㅛ
    [85, 'ㅕ'],  // U → ㅕ
    [73, 'ㅑ'],  // I → ㅑ
    [79, 'ㅒ'],  // O → ㅒ 🔥 Shift+o = ㅒ (복합모음)
    [80, 'ㅖ'],  // P → ㅖ 🔥 Shift+p = ㅖ (복합모음)
    [65, 'ㅁ'],  // A → ㅁ
    [83, 'ㄴ'],  // S → ㄴ
    [68, 'ㅇ'],  // D → ㅇ
    [70, 'ㄹ'],  // F → ㄹ
    [71, 'ㅎ'],  // G → ㅎ
    [72, 'ㅗ'],  // H → ㅗ
    [74, 'ㅓ'],  // J → ㅓ
    [75, 'ㅏ'],  // K → ㅏ
    [76, 'ㅣ'],  // L → ㅣ
    [90, 'ㅋ'],  // Z → ㅋ
    [88, 'ㅌ'],  // X → ㅌ
    [67, 'ㅊ'],  // C → ㅊ
    [86, 'ㅍ'],  // V → ㅍ
    [66, 'ㅠ'],  // B → ㅠ
    [78, 'ㅜ'],  // N → ㅜ
    [77, 'ㅡ']   // M → ㅡ  🔥 대문자도 추가!
  ]);

  // 🔥 더 이상 특수문자는 한글로 매핑하지 않음 - 완전히 비움
  private readonly SPECIAL_CHAR_TO_HANGUL: Map<number, string> = new Map([
    // ❌ 기존의 엉터리 매핑 완전 제거됨
    // ✅ 이제 빈 맵으로 시작 - 특수문자/제어문자/숫자는 한글로 매핑 안됨
  ]);

  // 🔥 제외할 특수 키들 정의 (macOS 키코드 기준)
  private readonly EXCLUDED_KEYS: Set<number> = new Set([
    8, 9, 13, 16, 17, 18, 19, 20, 27,      // Backspace, Tab, Enter, Shift, Ctrl, Alt, Pause, CapsLock, Escape
    33, 34, 35, 36, 37, 38, 39, 40,        // Page Up/Down, End, Home, Arrow keys
    45, 46,                                // Insert, Delete
    91, 92, 93,                            // Windows/Cmd keys
    112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, // F1-F12
    144, 145,                              // Num Lock, Scroll Lock
    21, 25, 28, 29                         // IME 관련 키들
  ]);


  constructor() {
    super({
      name: 'LanguageDetector',
      autoStart: false,
      retryOnError: false,
      maxRetries: 1,
      retryDelay: 100,
    });
    
    // 🔥 시스템 기본 언어 감지 (하드코딩 제거!)
    this.initializeSystemLanguage();
    
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 생성됨');
  }

  /**
   * 🔥 시스템 기본 언어 초기화 (하드코딩 'en' 대신 시스템 감지)
   */
  private async initializeSystemLanguage(): Promise<void> {
    try {
      // 🔥 더미 이벤트로 시스템 입력소스 확인
      const dummyEvent = { keycode: 0, keychar: 0 } as any;
      const systemResult = await this.detectBySystemInputSource(dummyEvent);
      
      if (systemResult && systemResult.language) {
        this.currentLanguage = systemResult.language;
        Logger.info(this.componentName, `🔥 시스템 기본 언어 감지됨: ${systemResult.language}`);
      } else {
        this.currentLanguage = 'en'; // 폴백
        Logger.debug(this.componentName, '⚠️ 시스템 언어 감지 실패, 기본값 영어 사용');
      }
    } catch (error) {
      this.currentLanguage = 'en'; // 폴백
      Logger.debug(this.componentName, '⚠️ 시스템 언어 감지 오류, 기본값 영어 사용', error);
    }
  }

  protected async doInitialize(): Promise<void> {
    this.resetState();
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 초기화됨');
  }

  protected async doStart(): Promise<void> {
    this.resetState();
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 시작됨');
  }

  protected async doStop(): Promise<void> {
    this.resetState();
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 중지됨');
  }

  protected async doCleanup(): Promise<void> {
    this.keyBuffer = [];
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 정리됨');
  }

  /**
   * 🔥 메인 언어 감지 메서드 - keycode 기반 3단계 알고리즘
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();
    
    try {
      // 극한 디버깅 + rawcode 추가!
      Logger.debug(this.componentName, '🔥🔥🔥 RAW INPUT DATA 🔥🔥🔥', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        rawcode: (rawEvent as any).rawcode, // 🔥 rawcode 확인!
        keycodeHex: `0x${rawEvent.keycode.toString(16)}`,
        keycharHex: rawEvent.keychar ? `0x${rawEvent.keychar.toString(16)}` : 'null',
        rawcodeHex: (rawEvent as any).rawcode ? `0x${(rawEvent as any).rawcode.toString(16)}` : 'null',
        keycharString: rawEvent.keychar ? String.fromCharCode(rawEvent.keychar) : 'null',
        keycharUnicode: rawEvent.keychar ? `U+${rawEvent.keychar.toString(16).padStart(4, '0')}` : 'null',
        isShift: rawEvent.shiftKey,
        currentLanguage: this.currentLanguage
      });
      
      // keychar 없으면 keycode만으로 처리 (macOS IME 우회!)
      if (!rawEvent.keychar || rawEvent.keychar === 0) {
        Logger.debug(this.componentName, '❌ NO KEYCHAR - keycode 기반 처리', { 
          keycode: rawEvent.keycode,
          rawcode: (rawEvent as any).rawcode,
          keycodeHex: `0x${rawEvent.keycode.toString(16)}`,
          rawcodeHex: (rawEvent as any).rawcode ? `0x${(rawEvent as any).rawcode.toString(16)}` : 'null',
          isHangulKey: this.KEYCODE_TO_HANGUL.has(rawEvent.keycode),
          isHangulKeyRawcode: (rawEvent as any).rawcode ? this.KEYCODE_TO_HANGUL.has((rawEvent as any).rawcode) : false,
          isEnglishKey: this.ENGLISH_KEYCODES.has(rawEvent.keycode)
        });
        return this.detectByKeycodeOnly(rawEvent, startTime);
      }
      
      // 키 버퍼에 추가
      this.addToBuffer(rawEvent);
      
      // 🔥 1단계: keycode 기반 즉시 감지
      const keycodeResult = this.detectByKeycode(rawEvent);
      if (keycodeResult.confidence >= 0.8) {
        return this.finalizeResult(keycodeResult, startTime);
      }
      
      // 🔥 1.5단계: 시스템 입력소스 기반 감지 (macOS HIToolbox)
      const systemResult = await this.detectBySystemInputSource(startTime);
      if (systemResult && systemResult.confidence >= 0.9) {
        return this.finalizeResult(systemResult, startTime);
      }
      
      // 🔥 2단계: 패턴 분석 기반 감지
      const patternResult = this.detectByPattern();
      if (patternResult.confidence >= 0.6) {
        return this.finalizeResult(patternResult, startTime);
      }
      
      // 🔥 3단계: 스마트 fallback
      const fallbackResult = this.detectByFallback(rawEvent);
      return this.finalizeResult(fallbackResult, startTime);
      
    } catch (error) {
      Logger.error(this.componentName, 'Error in language detection', error);
      return this.createFallbackResult(startTime);
    }
  }

  /**
   * 🔥 keycode만으로 감지 (알파벳 키만 한글 매핑 허용!)
   */
  private detectByKeycodeOnly(rawEvent: UiohookKeyboardEvent, startTime: number): LanguageDetectionResult {
    const { keycode } = rawEvent;
    
    // 🔥 제어문자와 특수키는 영어로 강제 분류 (한글 모드여도)
    if (keycode <= 31 || keycode === 127) {  // 제어문자들 (0x00-0x1F, DEL)
      Logger.debug(this.componentName, '🔥 제어문자 감지 - 영어로 강제 분류', {
        keycode,
        keycodeHex: `0x${keycode.toString(16)}`,
        keycharString: rawEvent.keychar ? String.fromCharCode(rawEvent.keychar) : 'null'
      });
      
      return {
        language: 'en',
        confidence: 0.95,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          keychar: rawEvent.keychar,
          reason: 'control-character-forced-english'
        }
      };
    }
    
    // 🔥 macOS IME 조합 결과 우선 확인
    if (process.platform === 'darwin' && rawEvent.keychar) {
      const char = String.fromCharCode(rawEvent.keychar);
      
      // 한글 완성형 문자 감지
      if (char.charCodeAt(0) >= 0xAC00 && char.charCodeAt(0) <= 0xD7AF) {
        Logger.debug(this.componentName, '🔥 macOS IME 한글 조합 감지', { char, charCode: char.charCodeAt(0).toString(16) });
        return {
          language: 'ko',
          confidence: 0.98, // 시스템이 조합했으니 확실함
          method: 'keycode',
          isComposing: false, // 이미 완성됨
          detectedChar: char
        };
      }
    }
    
    // 🔥 알파벳 키만 한글 매핑 허용
    const isValidAlphabetKey = (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122);
    
    if (isValidAlphabetKey) {
      // 대문자는 소문자로 변환
      const normalizedKeycode = keycode >= 65 && keycode <= 90 ? keycode + 32 : keycode;
      const hangulChar = this.VALID_HANGUL_KEYCODES.get(normalizedKeycode);
      
      if (hangulChar) {
        this.currentLanguage = 'ko';
        
        Logger.debug(this.componentName, '🔥🔥🔥 알파벳 키로 한글 감지! 🔥🔥🔥', {
          keycode,
          normalizedKeycode,
          keycodeHex: `0x${keycode.toString(16)}`,
          mappedHangul: hangulChar,
          confidence: 0.95
        });
        
        return { 
          language: 'ko', 
          confidence: 0.95, 
          method: 'keycode',
          isComposing: true,
          detectedChar: hangulChar,
          metadata: { 
            keycode,
            keychar: rawEvent.keychar,
            hangulChar,
            reason: 'alphabet-hangul-mapping'
          }
        };
      }
    }
    
    // 🔥 기가차드 개선: 숫자 키와 특수 키는 현재 언어 유지
    const isNumberKey = (keycode >= 48 && keycode <= 57);  // 0-9
    const isSpecialKey = this.EXCLUDED_KEYS.has(keycode);   // 특수키들
    
    if (isNumberKey || isSpecialKey) {
      Logger.debug(this.componentName, '🔥 숫자/특수키 감지 - 현재 언어 유지', {
        keycode,
        currentLanguage: this.currentLanguage,
        isNumber: isNumberKey,
        isSpecial: isSpecialKey
      });
      
      return {
        language: this.currentLanguage, // 🔥 현재 언어 그대로 유지
        confidence: 0.8,
        method: 'keycode',
        isComposing: false, // 숫자/특수키는 조합하지 않음
        metadata: { 
          keycode,
          keychar: rawEvent.keychar,
          reason: isNumberKey ? 'number-key-maintain-lang' : 'special-key-maintain-lang'
        }
      };
    }
    
    // 🔥 특수문자, 제어문자, 숫자는 영어 또는 other로 분류
    if (keycode >= 48 && keycode <= 57) {
      // 숫자는 영어로 분류
      this.currentLanguage = 'en';
      return { 
        language: 'en', 
        confidence: 0.85, 
        method: 'keycode',
        isComposing: false 
      };
    }
    
    if (keycode <= 31 || (keycode >= 32 && keycode <= 47) || (keycode >= 58 && keycode <= 64)) {
      // 제어문자, 특수문자는 영어로 분류
      this.currentLanguage = 'en';
      return { 
        language: 'en', 
        confidence: 0.95, 
        method: 'keycode',
        isComposing: false 
      };
    }
    
    // 🔥 rawcode 우선 사용 (물리적 키 감지)
    const rawcode = (rawEvent as any).rawcode;
    const physicalKeycode = rawcode || keycode; // rawcode 있으면 우선 사용
    
    Logger.debug(this.componentName, '🔥 물리적 키코드 체크', {
      keycode,
      rawcode,
      physicalKeycode,
      isHangulKey: this.KEYCODE_TO_HANGUL.has(physicalKeycode),
      hangulChar: this.KEYCODE_TO_HANGUL.get(physicalKeycode)
    });
    
    // 한글 키매핑 확인 (물리적 키코드로!)
    if (this.KEYCODE_TO_HANGUL.has(physicalKeycode)) {
      const hangulChar = this.KEYCODE_TO_HANGUL.get(physicalKeycode);
      this.currentLanguage = 'ko';
      
      Logger.debug(this.componentName, '🔥 물리적 키코드 기반 한글 감지!', {
        keycode,
        rawcode,
        physicalKeycode,
        hangulChar,
        keycodeHex: `0x${physicalKeycode.toString(16)}`
      });
      
      return this.finalizeResult({
        language: 'ko',
        confidence: 0.95, // 높은 신뢰도
        method: 'keycode', // rawcode 기반이지만 method는 keycode로 유지
        isComposing: true,
        detectedChar: hangulChar, // 🔥 감지된 한글 문자 추가
        metadata: { 
          keycode,
          rawcode,
          physicalKeycode,
          hangulChar,
          reason: 'rawcode-hangul-mapping'
        }
      }, startTime);
    }
    
    // 영어 키 확인
    if (this.ENGLISH_KEYCODES.has(keycode)) {
      return this.finalizeResult({
        language: 'en',
        confidence: 0.8,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          reason: 'keycode-english-key'
        }
      }, startTime);
    }
    
    // 특수 키들 (현재 언어 유지)
    return this.finalizeResult({
      language: this.currentLanguage,
      confidence: 0.7,
      method: 'fallback',
      isComposing: false,
      metadata: { 
        keycode,
        reason: 'keycode-special-key-maintain'
      }
    }, startTime);
  }

  /**
   * 🔥 1단계: keycode 기반 즉시 감지 (알파벳 키만 한글 매핑!)
   */
  private detectByKeycode(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;
    
    // 🔥 알파벳 키만 한글 매핑 허용
    const isValidAlphabetKey = (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122);
    
    if (isValidAlphabetKey) {
      // 대문자는 소문자로 변환
      const normalizedKeycode = keycode >= 65 && keycode <= 90 ? keycode + 32 : keycode;
      const hangulChar = this.VALID_HANGUL_KEYCODES.get(normalizedKeycode);
      
      if (hangulChar) {
        this.currentLanguage = 'ko';
        
        return {
          language: 'ko',
          confidence: 0.95,
          method: 'keycode',
          isComposing: true,
          detectedChar: hangulChar,
          metadata: { 
            keycode,
            keychar,
            hangulChar,
            reason: 'alphabet-hangul-mapping'
          }
        };
      }
    }
    
    // 기존 한글 키매핑 확인 (기존 KEYCODE_TO_HANGUL)
    if (this.KEYCODE_TO_HANGUL.has(keycode)) {
      const hangulChar = this.KEYCODE_TO_HANGUL.get(keycode);
      this.currentLanguage = 'ko';
      
      return {
        language: 'ko',
        confidence: 0.95,
        method: 'keycode',
        isComposing: true,
        detectedChar: hangulChar,
        metadata: { 
          keycode,
          keychar,
          hangulChar,
          reason: 'keycode-hangul-direct'
        }
      };
    }
    
    // 영어 키 확인
    if (this.ENGLISH_KEYCODES.has(keycode)) {
      return {
        language: 'en',
        confidence: 0.85,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          keychar,
          reason: 'keycode-english-direct'
        }
      };
    }
    
    // 🔥 알 수 없는 keycode는 영어로 분류 (fallback 수정!)
    // currentLanguage를 그대로 사용하면 이전 상태에 영향받음
    return {
      language: 'en', // 🔥 무조건 영어로! (currentLanguage 대신)
      confidence: 0.3, // 🔥 낮은 신뢰도
      method: 'keycode',
      isComposing: false,
      metadata: { reason: 'keycode-no-match' }
    };
  }

  /**
   * 🔥 2단계: 패턴 분석 기반 감지
   */
  private detectByPattern(): LanguageDetectionResult {
    if (this.keyBuffer.length < 2) {
      return {
        language: this.currentLanguage,
        confidence: 0.3,
        method: 'pattern',
        isComposing: false,
        metadata: { reason: 'insufficient-buffer', bufferSize: this.keyBuffer.length }
      };
    }
    
    // 최근 키들의 keycode 분석
    const recentKeycodes = this.keyBuffer
      .slice(-3)
      .map(event => event.keycode);
    
    if (recentKeycodes.length === 0) {
      return {
        language: this.currentLanguage,
        confidence: 0.3,
        method: 'pattern',
        isComposing: false,
        metadata: { reason: 'no-valid-keycodes' }
      };
    }
    
    // 한글 키 패턴 분석 (keycode 기반)
    let hangulKeyCount = 0;
    for (const keycode of recentKeycodes) {
      if (this.KEYCODE_TO_HANGUL.has(keycode)) {
        hangulKeyCount++;
      }
    }
    
    const hangulRatio = hangulKeyCount / recentKeycodes.length;
    
    if (hangulRatio >= 0.6) {
      this.currentLanguage = 'ko';
      return {
        language: 'ko',
        confidence: 0.8,
        method: 'pattern',
        isComposing: true,
        metadata: { 
          hangulKeyCount,
          totalKeys: recentKeycodes.length,
          hangulRatio,
          reason: 'hangul-pattern-strong'
        }
      };
    } else if (hangulRatio <= 0.3) {
      this.currentLanguage = 'en';
      return {
        language: 'en',
        confidence: 0.7,
        method: 'pattern',
        isComposing: false,
        metadata: { 
          hangulKeyCount,
          totalKeys: recentKeycodes.length,
          hangulRatio,
          reason: 'english-pattern-strong'
        }
      };
    }
    
    return {
      language: this.currentLanguage,
      confidence: 0.5,
      method: 'pattern',
      isComposing: false,
      metadata: { 
        hangulRatio,
        reason: 'pattern-mixed'
      }
    };
  }

  /**
   * 🔥 3단계: 스마트 fallback
   */
  private detectByFallback(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;
    
    // 🔥 정확한 특수 키 목록 (macOS 키코드 기준)
    const SPECIAL_KEYCODES = new Set([
      // 기능키
      8, 9, 13, 16, 17, 18, 19, 20, 27, // Backspace, Tab, Enter, Shift, Ctrl, Alt, Pause, CapsLock, Esc
      33, 34, 35, 36, 37, 38, 39, 40,  // PageUp, PageDown, End, Home, Arrow keys
      45, 46,                          // Insert, Delete
      91, 92, 93,                      // Windows/Cmd keys, Menu
      112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, // F1-F12
      144, 145,                        // NumLock, ScrollLock
      // 한/영, 한자 등 IME 관련 키
      21, 25, 28, 29                   // 한/영, 한자 등
    ]);
    
    // 특수 키들 - 현재 언어 유지
    if (SPECIAL_KEYCODES.has(keycode) || !keychar) {
      return {
        language: this.currentLanguage,
        confidence: 0.8, // 현재 언어 유지로 높은 신뢰도
        method: 'fallback',
        isComposing: false,
        metadata: { reason: 'special-key-maintain-current', keycode }
      };
    }
    
    // 숫자 키 (48-57)
    if (keycode >= 48 && keycode <= 57) {
      return {
        language: this.currentLanguage,
        confidence: 0.7,
        method: 'fallback',
        isComposing: false,
        metadata: { reason: 'number-key-maintain-current', keycode }
      };
    }
    
    // 기본값: 영어로 fallback (confidence 낮춤)
    return {
      language: 'en',
      confidence: 0.4,
      method: 'fallback',
      isComposing: false,
      metadata: { reason: 'default-english-fallback', keycode }
    };
  }

  /**
   * 키 버퍼에 추가
   */
  private addToBuffer(rawEvent: UiohookKeyboardEvent): void {
    // keycode 기반으로 버퍼에 추가
    const keyEvent: KeyBufferEvent = {
      keycode: rawEvent.keycode,
      timestamp: Date.now()
    };
    
    this.keyBuffer.push(keyEvent);
    
    // 버퍼 크기 제한
    if (this.keyBuffer.length > this.BUFFER_SIZE) {
      this.keyBuffer.shift();
    }
  }

  /**
   * 결과 최종화 및 성능 측정
   */
  private finalizeResult(result: LanguageDetectionResult, startTime: number): LanguageDetectionResult {
    const processingTime = performance.now() - startTime;
    
    this.detectionCount++;
    this.totalProcessingTime += processingTime;
    
    // 신뢰도 임계값 (0.6 이상일 때만 언어 변경)
    if (result.confidence >= 0.6) {
      this.currentLanguage = result.language;
    }
    
    Logger.debug(this.componentName, 'Language detection completed', {
      language: result.language,
      confidence: result.confidence,
      method: result.method,
      processingTime: `${processingTime.toFixed(3)}ms`,
      averageTime: `${(this.totalProcessingTime / this.detectionCount).toFixed(3)}ms`
    });
    
    return result;
  }

  private createFallbackResult(startTime: number): LanguageDetectionResult {
    return this.finalizeResult({
      language: this.currentLanguage,
      confidence: 0.3,
      method: 'fallback',
      isComposing: false,
      metadata: { reason: 'error-fallback' }
    }, startTime);
  }

  private resetState(): void {
    this.currentLanguage = 'en';
    this.keyBuffer = [];
    this.detectionCount = 0;
    this.totalProcessingTime = 0;
    Logger.debug(this.componentName, 'State reset completed');
  }

  // 🔥 기가차드 시스템 입력소스 감지 (macOS HIToolbox 우회!)
  private async getCurrentInputSourceFromSystem(): Promise<'ko' | 'en' | null> {
    try {
      // 캐시된 결과가 유효하면 반환
      const now = Date.now();
      if (this.systemInputSourceCache && 
          now - this.lastSystemCheck < this.SYSTEM_CHECK_INTERVAL) {
        return this.systemInputSourceCache;
      }

      // 이미 진행 중이면 캐시된 값 반환
      if (this.systemCheckInProgress) {
        return this.systemInputSourceCache;
      }

      this.systemCheckInProgress = true;

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve(null);
          this.systemCheckInProgress = false;
        }, 1000); // 1초 타임아웃

        exec('defaults read com.apple.HIToolbox AppleCurrentKeyboardLayoutInputSourceID', 
          (error, stdout) => {
            clearTimeout(timeout);
            this.systemCheckInProgress = false;
            
            if (error) {
              Logger.debug(this.componentName, 'System input source check failed', { error: error.message });
              resolve(null);
              return;
            }

            const inputSourceId = stdout.trim().toLowerCase();
            let detectedLanguage: 'ko' | 'en' = 'en';

            if (inputSourceId.includes('korean') || 
                inputSourceId.includes('2set') ||
                inputSourceId.includes('hangul')) {
              detectedLanguage = 'ko';
            }

            // 캐시 업데이트
            this.systemInputSourceCache = detectedLanguage;
            this.lastSystemCheck = now;

            Logger.debug(this.componentName, '🔥🔥🔥 시스템 입력소스 감지 성공! 🔥🔥🔥', {
              inputSourceId,
              detectedLanguage,
              confidence: 0.95
            });

            resolve(detectedLanguage);
          });
      });
    } catch (error) {
      Logger.error(this.componentName, 'System input source detection error', error);
      this.systemCheckInProgress = false;
      return null;
    }
  }

  /**
   * 🔥 시스템 기반 언어 감지 (HIToolbox 활용)
   */
  private async detectBySystemInputSource(startTime: number): Promise<LanguageDetectionResult | null> {
    const systemLanguage = await this.getCurrentInputSourceFromSystem();
    
    if (systemLanguage) {
      this.currentLanguage = systemLanguage;
      
      return {
        language: systemLanguage,
        confidence: 0.95, // 시스템 레벨이므로 높은 신뢰도
        method: 'keycode', // 기존 메서드와 동일하게 표시
        isComposing: systemLanguage === 'ko',
        metadata: {
          source: 'HIToolbox',
          processingTime: `${(Date.now() - startTime).toFixed(3)}ms`
        }
      };
    }
    
    return null;
  }

  public getCurrentLanguage(): 'ko' | 'en' | 'ja' | 'zh' {
    return this.currentLanguage;
  }

  public setLanguage(language: 'ko' | 'en' | 'ja' | 'zh'): void {
    this.currentLanguage = language;
    Logger.info(this.componentName, 'Language manually set', { language });
  }

  public getPerformanceStats(): {
    detectionCount: number;
    averageProcessingTime: number;
    bufferSize: number;
    currentLanguage: 'ko' | 'en' | 'ja' | 'zh';
  } {
    return {
      detectionCount: this.detectionCount,
      averageProcessingTime: this.detectionCount > 0 ? 
        this.totalProcessingTime / this.detectionCount : 0,
      bufferSize: this.keyBuffer.length,
      currentLanguage: this.currentLanguage
    };
  }
}

export const languageDetector = new LanguageDetector();
export default languageDetector;
/**
 * 🔥 기가차드 한글 조합 엔진
 * Advanced Hangul Composer Engine based on Loop 6 best practices
 */

// 한글 자모 상수
export const HANGUL_CONSTANTS = {
  // 초성 (19개)
  CHOSUNG: [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ],
  
  // 중성 (21개)
  JUNGSUNG: [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
  ],
  
  // 종성 (28개, 빈 문자 포함)
  JONGSUNG: [
    '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
    'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ],
  
  // 유니코드 범위
  UNICODE: {
    HANGUL_SYLLABLES_START: 0xAC00,
    HANGUL_SYLLABLES_END: 0xD7AF,
    HANGUL_JAMO_START: 0x1100,
    HANGUL_JAMO_END: 0x11FF,
    HANGUL_COMPAT_JAMO_START: 0x3130,
    HANGUL_COMPAT_JAMO_END: 0x318F
  }
};

// 복합 자모 매핑 (Loop 6에서 가져온 고급 매핑)
export const COMPLEX_JAMO_MAP = {
  // 복합 중성
  JUNGSUNG: {
    'ㅗㅏ': 'ㅘ',
    'ㅗㅐ': 'ㅙ',
    'ㅗㅣ': 'ㅚ',
    'ㅜㅓ': 'ㅝ',
    'ㅜㅔ': 'ㅞ',
    'ㅜㅣ': 'ㅟ',
    'ㅡㅣ': 'ㅢ'
  } as Record<string, string>,
  
  // 복합 종성
  JONGSUNG: {
    'ㄱㅅ': 'ㄳ',
    'ㄴㅈ': 'ㄵ',
    'ㄴㅎ': 'ㄶ',
    'ㄹㄱ': 'ㄺ',
    'ㄹㅁ': 'ㄻ',
    'ㄹㅂ': 'ㄼ',
    'ㄹㅅ': 'ㄽ',
    'ㄹㅌ': 'ㄾ',
    'ㄹㅍ': 'ㄿ',
    'ㄹㅎ': 'ㅀ',
    'ㅂㅅ': 'ㅄ'
  } as Record<string, string>
};

// 키보드 자모 매핑 (두벌식 기준)
export const KEYBOARD_JAMO_MAP: Record<string, string> = {
  // 자음
  'q': 'ㅂ', 'Q': 'ㅃ',
  'w': 'ㅈ', 'W': 'ㅉ',
  'e': 'ㄷ', 'E': 'ㄸ',
  'r': 'ㄱ', 'R': 'ㄲ',
  't': 'ㅅ', 'T': 'ㅆ',
  'y': 'ㅛ',
  'u': 'ㅕ',
  'i': 'ㅑ',
  'o': 'ㅐ', 'O': 'ㅒ',
  'p': 'ㅔ', 'P': 'ㅖ',
  
  'a': 'ㅁ',
  's': 'ㄴ',
  'd': 'ㅇ',
  'f': 'ㄹ',
  'g': 'ㅎ',
  'h': 'ㅗ',
  'j': 'ㅓ',
  'k': 'ㅏ',
  'l': 'ㅣ',
  
  'z': 'ㅋ',
  'x': 'ㅌ',
  'c': 'ㅊ',
  'v': 'ㅍ',
  'b': 'ㅠ',
  'n': 'ㅜ',
  'm': 'ㅡ'
};

// 한글 조합 상태 인터페이스
export interface HangulComposerState {
  cho: string;          // 초성
  jung: string;         // 중성
  jong: string;         // 종성
  result: string;       // 조합 결과
  isComposing: boolean; // 조합 중인지 여부
  buffer: string;       // 조합 버퍼
}

// 조합 결과 인터페이스
export interface CompositionResult {
  completed: boolean;   // 조합 완료 여부
  character: string;    // 완성된 문자
  state: HangulComposerState; // 현재 상태
  needsContinue: boolean; // 계속 조합이 필요한지
}

/**
 * 기가차드 한글 조합 엔진
 */
export class HangulComposer {
  private state: HangulComposerState;
  
  constructor() {
    this.state = this.getInitialState();
  }

  /**
   * 초기 상태 반환
   */
  private getInitialState(): HangulComposerState {
    return {
      cho: '',
      jung: '',
      jong: '',
      result: '',
      isComposing: false,
      buffer: ''
    };
  }

  /**
   * 현재 상태 반환
   */
  getState(): HangulComposerState {
    return { ...this.state };
  }

  /**
   * 상태 초기화
   */
  reset(): void {
    this.state = this.getInitialState();
  }

  /**
   * 키 입력 처리
   */
  processKey(key: string): CompositionResult {
    const jamo = this.keyToJamo(key);
    
    if (!jamo) {
      // 한글 자모가 아닌 경우 현재 조합 완료하고 리셋
      const result = this.finishComposition();
      return {
        completed: true,
        character: result,
        state: this.getState(),
        needsContinue: false
      };
    }

    return this.addJamo(jamo);
  }

  /**
   * 키를 자모로 변환
   */
  private keyToJamo(key: string): string | null {
    return KEYBOARD_JAMO_MAP[key] || null;
  }

  /**
   * 자모 추가
   */
  private addJamo(jamo: string): CompositionResult {
    if (this.isChosung(jamo)) {
      return this.addChosung(jamo);
    } else if (this.isJungsung(jamo)) {
      return this.addJungsung(jamo);
    } else {
      // 종성 처리는 추후 구현 (현재는 간단한 버전)
      return this.finishCompositionWithResult();
    }
  }

  /**
   * 초성 추가
   */
  private addChosung(cho: string): CompositionResult {
    if (!this.state.isComposing) {
      // 새로운 조합 시작
      this.state.cho = cho;
      this.state.jung = '';
      this.state.jong = '';
      this.state.isComposing = true;
      this.state.buffer = cho;
      
      return {
        completed: false,
        character: '',
        state: this.getState(),
        needsContinue: true
      };
    } else if (this.state.jung === '') {
      // 초성만 있는 상태에서 다른 초성 입력
      const prevResult = this.state.cho;
      this.state.cho = cho;
      this.state.buffer = cho;
      
      return {
        completed: true,
        character: prevResult,
        state: this.getState(),
        needsContinue: true
      };
    } else {
      // 중성이 있는 상태에서 초성 입력 - 현재 문자 완성하고 새 조합 시작
      const completedChar = this.composeHangul();
      this.state.cho = cho;
      this.state.jung = '';
      this.state.jong = '';
      this.state.buffer = cho;
      
      return {
        completed: true,
        character: completedChar,
        state: this.getState(),
        needsContinue: true
      };
    }
  }

  /**
   * 중성 추가
   */
  private addJungsung(jung: string): CompositionResult {
    if (!this.state.isComposing || this.state.cho === '') {
      // 초성 없이 중성이 오는 경우
      this.state.cho = 'ㅇ'; // 기본 초성
      this.state.jung = jung;
      this.state.jong = '';
      this.state.isComposing = true;
      this.state.buffer = this.state.cho + jung;
      
      const composed = this.composeHangul();
      this.state.result = composed;
      
      return {
        completed: false,
        character: composed,
        state: this.getState(),
        needsContinue: true
      };
    } else if (this.state.jung === '') {
      // 초성 다음에 중성
      this.state.jung = jung;
      this.state.buffer = this.state.cho + jung;
      
      const composed = this.composeHangul();
      this.state.result = composed;
      
      return {
        completed: false,
        character: composed,
        state: this.getState(),
        needsContinue: true
      };
    } else {
      // 이미 중성이 있는 경우 - 복합 중성 시도
      const complexJung = COMPLEX_JAMO_MAP.JUNGSUNG[this.state.jung + jung];
      if (complexJung) {
        this.state.jung = complexJung;
        const composed = this.composeHangul();
        this.state.result = composed;
        
        return {
          completed: false,
          character: composed,
          state: this.getState(),
          needsContinue: true
        };
      } else {
        // 복합 중성이 안 되는 경우 - 현재 문자 완성하고 새 조합
        const completedChar = this.composeHangul();
        this.state.cho = 'ㅇ';
        this.state.jung = jung;
        this.state.jong = '';
        
        const newComposed = this.composeHangul();
        this.state.result = newComposed;
        
        return {
          completed: true,
          character: completedChar,
          state: this.getState(),
          needsContinue: true
        };
      }
    }
  }

  /**
   * 한글 문자 조합
   */
  private composeHangul(): string {
    if (!this.state.cho || !this.state.jung) {
      return '';
    }

    const choIndex = HANGUL_CONSTANTS.CHOSUNG.indexOf(this.state.cho);
    const jungIndex = HANGUL_CONSTANTS.JUNGSUNG.indexOf(this.state.jung);
    const jongIndex = this.state.jong ? HANGUL_CONSTANTS.JONGSUNG.indexOf(this.state.jong) : 0;

    if (choIndex === -1 || jungIndex === -1) {
      return '';
    }

    const syllableCode = HANGUL_CONSTANTS.UNICODE.HANGUL_SYLLABLES_START + 
                        (choIndex * 21 + jungIndex) * 28 + jongIndex;
    
    return String.fromCharCode(syllableCode);
  }

  /**
   * 조합 완료
   */
  finishComposition(): string {
    const result = this.state.result;
    this.reset();
    return result;
  }

  /**
   * 조합 완료 후 결과 반환
   */
  private finishCompositionWithResult(): CompositionResult {
    const character = this.finishComposition();
    return {
      completed: true,
      character,
      state: this.getState(),
      needsContinue: false
    };
  }

  /**
   * 초성 판별
   */
  private isChosung(char: string): boolean {
    return HANGUL_CONSTANTS.CHOSUNG.includes(char);
  }

  /**
   * 중성 판별
   */
  private isJungsung(char: string): boolean {
    return HANGUL_CONSTANTS.JUNGSUNG.includes(char);
  }

  /**
   * 종성 판별
   */
  private isJongsung(char: string): boolean {
    return HANGUL_CONSTANTS.JONGSUNG.includes(char);
  }

  /**
   * 한글 문자 분해
   */
  static decomposeHangul(char: string): { cho: string; jung: string; jong: string } | null {
    const code = char.charCodeAt(0);
    
    if (code < HANGUL_CONSTANTS.UNICODE.HANGUL_SYLLABLES_START || 
        code > HANGUL_CONSTANTS.UNICODE.HANGUL_SYLLABLES_END) {
      return null;
    }

    const syllableIndex = code - HANGUL_CONSTANTS.UNICODE.HANGUL_SYLLABLES_START;
    
    const jongIndex = syllableIndex % 28;
    const jungIndex = (syllableIndex - jongIndex) / 28 % 21;
    const choIndex = ((syllableIndex - jongIndex) / 28 - jungIndex) / 21;

    return {
      cho: HANGUL_CONSTANTS.CHOSUNG[choIndex] || '',
      jung: HANGUL_CONSTANTS.JUNGSUNG[jungIndex] || '',
      jong: HANGUL_CONSTANTS.JONGSUNG[jongIndex] || ''
    };
  }

  /**
   * 한글 문자 여부 판별
   */
  static isHangul(char: string): boolean {
    if (!char || char.length !== 1) return false;
    
    const code = char.charCodeAt(0);
    return (code >= HANGUL_CONSTANTS.UNICODE.HANGUL_SYLLABLES_START && 
            code <= HANGUL_CONSTANTS.UNICODE.HANGUL_SYLLABLES_END) ||
           (code >= HANGUL_CONSTANTS.UNICODE.HANGUL_JAMO_START && 
            code <= HANGUL_CONSTANTS.UNICODE.HANGUL_JAMO_END) ||
           (code >= HANGUL_CONSTANTS.UNICODE.HANGUL_COMPAT_JAMO_START && 
            code <= HANGUL_CONSTANTS.UNICODE.HANGUL_COMPAT_JAMO_END);
  }

  /**
   * 자모 개수 계산
   */
  static getJamoCount(text: string): number {
    let count = 0;
    
    for (const char of text) {
      if (HangulComposer.isHangul(char)) {
        const decomposed = HangulComposer.decomposeHangul(char);
        if (decomposed) {
          count += decomposed.cho ? 1 : 0;
          count += decomposed.jung ? 1 : 0;
          count += decomposed.jong ? 1 : 0;
        } else {
          count += 1; // 단일 자모
        }
      }
    }
    
    return count;
  }
}

// Export 기본 인스턴스
export const hangulComposer = new HangulComposer();

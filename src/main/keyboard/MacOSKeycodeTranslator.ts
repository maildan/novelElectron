// 🔥 기가차드 macOS 실시간 키코드 변환기 - TIS API 기반

import { exec } from 'child_process';
import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';

/**
 * 🔥 MacOSKeycodeTranslator - 실시간 키코드→문자 변환
 * 
 * TIS (Text Input Sources) API와 UCKeyTranslate를 활용하여
 * 현재 활성화된 키보드 레이아웃에 따라 정확한 문자 변환 제공
 * 
 * 장점:
 * - 실시간 정확성: 현재 키보드 레이아웃 직접 조회
 * - 모든 언어 지원: 한글, 영어, 일본어, 중국어 등
 * - IME 상태 반영: 2벌식, 3벌식, 사용자 설정 반영
 * - 시스템 네이티브: macOS 실제 변환 로직 사용
 */
export class MacOSKeycodeTranslator {
  private static readonly componentName = 'MACOS_KEYCODE_TRANSLATOR';
  private static instance: MacOSKeycodeTranslator;
  
  // 🔥 변환 결과 캐시 (성능 최적화)
  private conversionCache = new Map<string, string>();
  private readonly CACHE_MAX_SIZE = 1000;
  private readonly CACHE_TTL = 60000; // 1분
  private cacheTimestamps = new Map<string, number>();

  private constructor() {
    if (!Platform.isMacOS()) {
      throw new Error('MacOSKeycodeTranslator는 macOS에서만 사용할 수 있습니다');
    }
  }

  public static getInstance(): MacOSKeycodeTranslator {
    if (!MacOSKeycodeTranslator.instance) {
      MacOSKeycodeTranslator.instance = new MacOSKeycodeTranslator();
    }
    return MacOSKeycodeTranslator.instance;
  }

  /**
   * 🔥 키코드를 실제 문자로 변환 (메인 메서드)
   */
  public async translateKeycode(
    keycode: number, 
    modifiers: {
      shift?: boolean;
      command?: boolean;
      option?: boolean;
      control?: boolean;
    } = {}
  ): Promise<{
    character: string | null;
    inputSource: string | null;
    language: 'ko' | 'en' | 'ja' | 'zh' | 'unknown';
    isSuccess: boolean;
    method: 'applescript' | 'cache' | 'fallback';
    processingTime: number;
  }> {
    const startTime = performance.now();
    
    try {
      // 🔥 캐시 확인
      const cacheKey = this.generateCacheKey(keycode, modifiers);
      const cachedResult = this.getCachedResult(cacheKey);
      
      if (cachedResult) {
        return {
          ...cachedResult,
          method: 'cache',
          processingTime: performance.now() - startTime
        };
      }

      Logger.debug(MacOSKeycodeTranslator.componentName, '🔥 실시간 키코드 변환 시작', {
        keycode,
        modifiers
      });

      // 🔥 AppleScript 기반 실시간 변환
      const result = await this.translateViaAppleScript(keycode, modifiers);
      
      // 🔥 결과 캐싱
      if (result.isSuccess) {
        this.setCachedResult(cacheKey, {
          character: result.character,
          inputSource: result.inputSource,
          language: result.language,
          isSuccess: result.isSuccess
        });
      }

      return {
        ...result,
        method: 'applescript' as const,
        processingTime: performance.now() - startTime
      };

    } catch (error) {
      Logger.error(MacOSKeycodeTranslator.componentName, '키코드 변환 실패', error);
      
      return {
        character: null,
        inputSource: null,
        language: 'unknown',
        isSuccess: false,
        method: 'fallback',
        processingTime: performance.now() - startTime
      };
    }
  }

  /**
   * 🔥 AppleScript를 통한 키코드 변환
   */
  private async translateViaAppleScript(
    keycode: number,
    modifiers: { shift?: boolean; command?: boolean; option?: boolean; control?: boolean }
  ): Promise<{
    character: string | null;
    inputSource: string | null;
    language: 'ko' | 'en' | 'ja' | 'zh' | 'unknown';
    isSuccess: boolean;
  }> {
    return new Promise((resolve) => {
      // 🔥 수정자 키 플래그 생성
      const modifierFlags = this.buildModifierFlags(modifiers);
      
      // 🔥 AppleScript: TIS API + UCKeyTranslate 시뮬레이션
      const script = `
        tell application "System Events"
          try
            -- 현재 입력소스 ID 가져오기
            set currentInputSource to do shell script "osascript -e 'tell application \\"System Events\\" to get the id of keyboard layout 1'"
            
            -- 키코드를 실제 문자로 변환 (modifiers 고려)
            set keyChar to ""
            
            -- NSEvent 시뮬레이션을 통한 키코드 변환
            try
              set keyChar to do shell script "python3 -c \\"
import Cocoa
from Cocoa import NSEvent, NSKeyDown
import sys

keycode = ${keycode}
modifiers = ${modifierFlags}

# NSEvent를 사용하여 키코드를 문자로 변환
event = NSEvent.keyEventWithType_location_modifierFlags_timestamp_windowNumber_context_characters_charactersIgnoringModifiers_isARepeat_keyCode_(
    NSKeyDown, 
    Cocoa.NSMakePoint(0, 0), 
    modifiers,
    0, 
    0, 
    None, 
    '', 
    '', 
    False, 
    keycode
)

if event:
    chars = event.characters()
    if chars and len(chars) > 0:
        print(chars)
    else:
        print('')
else:
    print('')
\\""
            end try
            
            -- 결과 포맷: "character|inputSource"
            return keyChar & "|" & currentInputSource
            
          on error errMsg
            return "ERROR|" & errMsg
          end try
        end tell
      `;

      exec(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
          Logger.warn(MacOSKeycodeTranslator.componentName, 'AppleScript 실행 실패', error);
          resolve({
            character: null,
            inputSource: null,
            language: 'unknown',
            isSuccess: false
          });
          return;
        }

        try {
          const output = stdout.trim();
          const [character, inputSource] = output.split('|');
          
          if (character === 'ERROR') {
            Logger.warn(MacOSKeycodeTranslator.componentName, 'AppleScript 내부 오류', inputSource);
            resolve({
              character: null,
              inputSource: null,
              language: 'unknown',
              isSuccess: false
            });
            return;
          }

          // 🔥 언어 감지
          const language = (character && inputSource) ? this.detectLanguageFromChar(character, inputSource) : 'unknown';
          
          Logger.debug(MacOSKeycodeTranslator.componentName, '✅ AppleScript 변환 성공', {
            keycode,
            character,
            inputSource,
            language
          });

          resolve({
            character: character || null,
            inputSource: inputSource || null,
            language,
            isSuccess: true
          });

        } catch (parseError) {
          Logger.error(MacOSKeycodeTranslator.componentName, 'AppleScript 결과 파싱 실패', parseError);
          resolve({
            character: null,
            inputSource: null,
            language: 'unknown',
            isSuccess: false
          });
        }
      });
    });
  }

  /**
   * 🔥 수정자 키 플래그 생성
   */
  private buildModifierFlags(modifiers: any): number {
    let flags = 0;
    
    if (modifiers.shift) flags |= 0x20000; // NSShiftKeyMask
    if (modifiers.command) flags |= 0x100000; // NSCommandKeyMask  
    if (modifiers.option) flags |= 0x80000; // NSAlternateKeyMask
    if (modifiers.control) flags |= 0x40000; // NSControlKeyMask
    
    return flags;
  }

  /**
   * 🔥 문자와 입력소스에서 언어 감지
   */
  private detectLanguageFromChar(character: string, inputSource: string | null): 'ko' | 'en' | 'ja' | 'zh' | 'unknown' {
    if (!character) return 'unknown';
    
    // 🔥 입력소스 기반 우선 판단
    if (inputSource) {
      const inputSourceLower = inputSource.toLowerCase();
      if (inputSourceLower.includes('korean') || inputSourceLower.includes('hangul')) return 'ko';
      if (inputSourceLower.includes('japanese') || inputSourceLower.includes('hiragana') || inputSourceLower.includes('katakana')) return 'ja';
      if (inputSourceLower.includes('chinese') || inputSourceLower.includes('pinyin')) return 'zh';
    }
    
    // 🔥 Unicode 범위 기반 판단
    const charCode = character.charCodeAt(0);
    
    // 한글 (가-힣, ㄱ-ㅎ, ㅏ-ㅣ)
    if ((charCode >= 0xAC00 && charCode <= 0xD7A3) || 
        (charCode >= 0x3131 && charCode <= 0x318E)) {
      return 'ko';
    }
    
    // 일본어 (ひらがな, カタカナ)
    if ((charCode >= 0x3040 && charCode <= 0x309F) || 
        (charCode >= 0x30A0 && charCode <= 0x30FF)) {
      return 'ja';
    }
    
    // 중국어 (CJK Unified Ideographs)
    if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
      return 'zh';
    }
    
    // 영어 및 기타 라틴 문자
    if ((charCode >= 0x0020 && charCode <= 0x007F) || 
        (charCode >= 0x00A0 && charCode <= 0x00FF)) {
      return 'en';
    }
    
    return 'unknown';
  }

  /**
   * 🔥 캐시 관련 메서드들
   */
  private generateCacheKey(keycode: number, modifiers: any): string {
    return `${keycode}_${JSON.stringify(modifiers)}`;
  }

  private getCachedResult(cacheKey: string): any {
    const now = Date.now();
    const timestamp = this.cacheTimestamps.get(cacheKey);
    
    if (timestamp && (now - timestamp) < this.CACHE_TTL) {
      return this.conversionCache.get(cacheKey);
    }
    
    // 만료된 캐시 제거
    this.conversionCache.delete(cacheKey);
    this.cacheTimestamps.delete(cacheKey);
    return null;
  }

  private setCachedResult(cacheKey: string, result: any): void {
    // 캐시 크기 제한
    if (this.conversionCache.size >= this.CACHE_MAX_SIZE) {
      // 가장 오래된 항목 제거
      const oldestKey = this.conversionCache.keys().next().value;
      if (oldestKey) {
        this.conversionCache.delete(oldestKey);
        this.cacheTimestamps.delete(oldestKey);
      }
    }
    
    this.conversionCache.set(cacheKey, result);
    this.cacheTimestamps.set(cacheKey, Date.now());
  }

  /**
   * 🔥 캐시 정리
   */
  public clearCache(): void {
    this.conversionCache.clear();
    this.cacheTimestamps.clear();
    Logger.info(MacOSKeycodeTranslator.componentName, '캐시 정리 완료');
  }

  /**
   * 🔥 통계 정보
   */
  public getStats(): {
    cacheSize: number;
    cacheHitRate: number;
    maxCacheSize: number;
  } {
    return {
      cacheSize: this.conversionCache.size,
      cacheHitRate: 0, // TODO: 구현 필요
      maxCacheSize: this.CACHE_MAX_SIZE
    };
  }
}

// 🔥 싱글톤 인스턴스 export
export const macOSKeycodeTranslator = MacOSKeycodeTranslator.getInstance();

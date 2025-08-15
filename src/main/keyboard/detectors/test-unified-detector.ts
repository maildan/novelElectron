// 🔥 기가차드 통합 언어 감지기 테스트 스크립트

import { UnifiedLanguageDetector } from './UnifiedLanguageDetector';
import { Platform } from '../../utils/platform';
import { Logger } from '../../../shared/logger';
import type { UiohookKeyboardEvent } from '../../../shared/types';

/**
 * 🔥 통합 언어 감지기 테스트 실행
 */
async function testUnifiedLanguageDetector(): Promise<void> {
  Logger.info('TEST_UNIFIED_DETECTOR', '통합 언어 감지기 테스트 시작');
  
  try {
    // 플랫폼 정보 출력
    const platformInfo = Platform.getSummary();
    Logger.info('TEST_UNIFIED_DETECTOR', '플랫폼 정보', platformInfo);
    
    // 통합 언어 감지기 초기화
    Logger.info('TEST_UNIFIED_DETECTOR', '언어 감지기 초기화 중');
    const detector = new UnifiedLanguageDetector();
    await detector.initialize();
    await detector.start();
    
    Logger.info('TEST_UNIFIED_DETECTOR', '언어 감지기 초기화 완료');
    
    // 테스트 키 이벤트들
    const testEvents: UiohookKeyboardEvent[] = [
      // 한글 키 테스트 (ㅂ, ㅈ, ㄷ)
      { keycode: 113, keychar: 113, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
      { keycode: 119, keychar: 119, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
      { keycode: 101, keychar: 101, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
      
      // 영어 키 테스트 (a, b, c)
      { keycode: 97, keychar: 97, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
      { keycode: 98, keychar: 98, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
      { keycode: 99, keychar: 99, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
      
      // 숫자 키 테스트 (1, 2, 3)
      { keycode: 49, keychar: 49, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
      { keycode: 50, keychar: 50, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
      { keycode: 51, keychar: 51, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
    ];
    
    Logger.info('TEST_UNIFIED_DETECTOR', '키 이벤트 테스트 실행');
    
    for (let i = 0; i < testEvents.length; i++) {
      const event = testEvents[i];
      if (!event) continue;
      
      const result = await detector.detectLanguage(event);
      
      Logger.info('TEST_UNIFIED_DETECTOR', '테스트 결과', {
        index: i + 1,
        keycode: event.keycode,
        char: String.fromCharCode(event.keychar || event.keycode),
        language: result.language,
        confidence: `${(result.confidence * 100).toFixed(1)}%`,
        method: result.method,
        isComposing: result.isComposing,
        detected: result.detectedChar || 'N/A'
      });
    }
    
    // 성능 통계 출력
    Logger.info('TEST_UNIFIED_DETECTOR', '성능 통계', detector.getPerformanceStats());
    
    // 헬스체크
    const health = await detector.healthCheck();
    Logger.info('TEST_UNIFIED_DETECTOR', '헬스체크', health);
    
    // 정리
    await detector.stop();
    await detector.cleanup();
    
    Logger.info('TEST_UNIFIED_DETECTOR', '테스트 완료');
    
  } catch (error) {
    Logger.error('TEST_UNIFIED_DETECTOR', '테스트 실패', error);
    process.exit(1);
  }
}

/**
 * 🔥 플랫폼별 감지기 직접 테스트
 */
async function testPlatformSpecificDetector(): Promise<void> {
  Logger.info('TEST_UNIFIED_DETECTOR', '플랫폼별 감지기 직접 테스트');
  
  try {
    const { LanguageDetectorFactory } = await import('./factory/LanguageDetectorFactory');
    
    // 팩토리 정보 출력
    Logger.info('TEST_UNIFIED_DETECTOR', '팩토리 정보', LanguageDetectorFactory.getInfo());
    
    // 플랫폼별 감지기 생성
    const detector = LanguageDetectorFactory.create();
    await detector.initialize();
    await detector.start();
    
    Logger.info('TEST_UNIFIED_DETECTOR', '감지기 생성 완료', { detector: detector.constructor.name });
    
    // 간단한 테스트
    const testEvent: UiohookKeyboardEvent = {
      keycode: 113, // ㅂ 키
      keychar: 113,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false
    };
    
    const result = await detector.detectLanguage(testEvent);
    Logger.info('TEST_UNIFIED_DETECTOR', '테스트 결과', result);
    
    // 성능 통계
    if (typeof detector.getPerformanceStats === 'function') {
      Logger.info('TEST_UNIFIED_DETECTOR', '성능 통계', detector.getPerformanceStats());
    }
    
    // 정리
    await detector.stop();
    await detector.cleanup();
    
    Logger.info('TEST_UNIFIED_DETECTOR', '플랫폼별 테스트 완료');
    
  } catch (error) {
    Logger.error('TEST_UNIFIED_DETECTOR', '플랫폼별 테스트 실패', error);
  }
}

// 메인 실행
if (require.main === module) {
  (async () => {
    await testUnifiedLanguageDetector();
    await testPlatformSpecificDetector();
    process.exit(0);
  })().catch(error => {
    console.error('❌ 메인 실행 실패:', error);
    process.exit(1);
  });
}

export { testUnifiedLanguageDetector, testPlatformSpecificDetector };
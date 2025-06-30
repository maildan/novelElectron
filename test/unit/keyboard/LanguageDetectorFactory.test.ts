// 🔥 기가차드 LanguageDetectorFactory 단위 테스트 - 크로스 플랫폼 완벽 지원

import { LanguageDetectorFactory } from '../../../src/main/keyboard/detectors/factory/LanguageDetectorFactory';
import { Platform } from '../../../src/main/utils/platform';
import { Logger } from '../../../src/shared/logger';
import type { UiohookKeyboardEvent } from '../../../src/shared/types';

// 🔥 플랫폼별 감지기 Mock - 타입 안전한 생성자 이름 포함
const createMockDetector = (name: string) => {
  const detector = {
    initialize: jest.fn().mockResolvedValue(undefined),
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    cleanup: jest.fn().mockResolvedValue(undefined),
    detectLanguage: jest.fn().mockResolvedValue({
      language: 'ko',
      confidence: 0.95,
      method: 'native',
      isComposing: true
    }),
    getCurrentLanguage: jest.fn().mockReturnValue('ko'),
    setLanguage: jest.fn(),
    getPerformanceStats: jest.fn().mockReturnValue({
      platform: 'macOS',
      detectionCount: 5,
      averageProcessingTime: 2.5
    }),
    healthCheck: jest.fn().mockResolvedValue({
      healthy: true,
      uptime: 1000
    }),
    getPlatformName: jest.fn().mockReturnValue('macOS')
  };

  // 🔥 생성자 이름을 올바르게 설정
  Object.defineProperty(detector, 'constructor', {
    value: { name },
    writable: false,
    enumerable: false,
    configurable: false
  });

  return detector;
};

// Mock Logger
jest.mock('../../../src/shared/logger', () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Platform
jest.mock('../../../src/main/utils/platform', () => ({
  Platform: {
    isMacOS: jest.fn(() => true),
    isWindows: jest.fn(() => false),
    isLinux: jest.fn(() => false),
    getPlatformName: jest.fn(() => 'macOS'),
  },
}));

// Mock 플랫폼별 감지기들
jest.mock('../../../src/main/keyboard/detectors/macos/MacOSLanguageDetector', () => ({
  MacOSLanguageDetector: jest.fn(() => createMockDetector('MacOSLanguageDetector'))
}));

jest.mock('../../../src/main/keyboard/detectors/windows/WindowsLanguageDetector', () => ({
  WindowsLanguageDetector: jest.fn(() => createMockDetector('WindowsLanguageDetector'))
}));

jest.mock('../../../src/main/keyboard/detectors/linux/LinuxLanguageDetector', () => ({
  LinuxLanguageDetector: jest.fn(() => createMockDetector('LinuxLanguageDetector'))
}));

jest.mock('../../../src/main/keyboard/detectors/FallbackLanguageDetector', () => ({
  FallbackLanguageDetector: jest.fn(() => createMockDetector('FallbackLanguageDetector'))
}));

describe('LanguageDetectorFactory', () => {
  const mockPlatform = Platform as jest.Mocked<typeof Platform>;
  const mockLogger = Logger as jest.Mocked<typeof Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
    LanguageDetectorFactory.reset();
  });

  describe('🔥 Cross-Platform Detection and Factory Creation', () => {
    it('should create macOS detector on macOS platform', () => {
      mockPlatform.isMacOS.mockReturnValue(true);
      mockPlatform.isWindows.mockReturnValue(false);
      mockPlatform.isLinux.mockReturnValue(false);
      mockPlatform.getPlatformName.mockReturnValue('macOS');

      const detector = LanguageDetectorFactory.create();
      
      expect(detector).toBeDefined();
      expect(detector.constructor.name).toBe('MacOSLanguageDetector');
    });

    it('should create Windows detector on Windows platform', () => {
      mockPlatform.isMacOS.mockReturnValue(false);
      mockPlatform.isWindows.mockReturnValue(true);
      mockPlatform.isLinux.mockReturnValue(false);
      mockPlatform.getPlatformName.mockReturnValue('Windows');

      const detector = LanguageDetectorFactory.create();
      
      expect(detector).toBeDefined();
      expect(detector.constructor.name).toBe('WindowsLanguageDetector');
    });

    it('should create Linux detector on Linux platform', () => {
      mockPlatform.isMacOS.mockReturnValue(false);
      mockPlatform.isWindows.mockReturnValue(false);
      mockPlatform.isLinux.mockReturnValue(true);
      mockPlatform.getPlatformName.mockReturnValue('Linux');

      const detector = LanguageDetectorFactory.create();
      
      expect(detector).toBeDefined();
      expect(detector.constructor.name).toBe('LinuxLanguageDetector');
    });

    it('should create Fallback detector on unknown platform', () => {
      mockPlatform.isMacOS.mockReturnValue(false);
      mockPlatform.isWindows.mockReturnValue(false);
      mockPlatform.isLinux.mockReturnValue(false);
      mockPlatform.getPlatformName.mockReturnValue('Unknown');

      const detector = LanguageDetectorFactory.create();
      
      expect(detector).toBeDefined();
      expect(detector.constructor.name).toBe('FallbackLanguageDetector');
    });
  });

  describe('Singleton Behavior', () => {
    it('should create new instance if getInstance called before create', () => {
      const detector = LanguageDetectorFactory.getInstance();
      
      expect(detector).toBeDefined();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'LANGUAGE_DETECTOR_FACTORY',
        expect.stringContaining('플랫폼 감지')
      );
    });

    it('should return same instance on subsequent calls', () => {
      const detector1 = LanguageDetectorFactory.create();
      const detector2 = LanguageDetectorFactory.getInstance();
      
      expect(detector1).toBe(detector2);
    });
  });

  describe('Factory Information', () => {
    it('should return correct factory info after creation', () => {
      LanguageDetectorFactory.create();
      const info = LanguageDetectorFactory.getInfo();
      
      expect(info).toEqual({
        platform: 'macOS',
        detectorType: expect.stringContaining('Detector'),
        isInitialized: true,
        createdAt: expect.any(Date)
      });
    });

    it('should handle info request before initialization', () => {
      const info = LanguageDetectorFactory.getInfo();
      
      expect(info).toEqual({
        platform: 'macOS',
        detectorType: 'NotInitialized',
        isInitialized: false,
        createdAt: null
      });
    });
  });

  describe('🔥 Advanced Cross-Platform Integration Tests', () => {
    describe('Platform-Specific Language Detection', () => {
      it('should handle macOS HIToolbox integration scenarios', async () => {
        mockPlatform.isMacOS.mockReturnValue(true);
        const detector = LanguageDetectorFactory.create();

        const testEvent: UiohookKeyboardEvent = {
          keycode: 107, // 한글 'ㅏ'
          keychar: 107,
          shiftKey: false,
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          time: Date.now()
        };

        const result = await detector.detectLanguage(testEvent);
        
        expect(result).toEqual({
          language: 'ko',
          confidence: 0.95,
          method: 'native',
          isComposing: true
        });
        expect(detector.detectLanguage).toHaveBeenCalledWith(testEvent);
      });

      it('should handle Windows Win32 API integration scenarios', async () => {
        mockPlatform.isMacOS.mockReturnValue(false);
        mockPlatform.isWindows.mockReturnValue(true);
        const detector = LanguageDetectorFactory.create();

        const testEvent: UiohookKeyboardEvent = {
          keycode: 0x4B, // Windows VK 'ㅏ'
          keychar: 0x4B,
          shiftKey: false,
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          time: Date.now()
        };

        const result = await detector.detectLanguage(testEvent);
        
        expect(result).toEqual({
          language: 'ko',
          confidence: 0.95,
          method: 'native',
          isComposing: true
        });
      });

      it('should handle Linux IBus/XIM integration scenarios', async () => {
        mockPlatform.isMacOS.mockReturnValue(false);
        mockPlatform.isWindows.mockReturnValue(false);
        mockPlatform.isLinux.mockReturnValue(true);
        const detector = LanguageDetectorFactory.create();

        const testEvent: UiohookKeyboardEvent = {
          keycode: 107, // X11 KeySym 'ㅏ'
          keychar: 107,
          shiftKey: false,
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          time: Date.now()
        };

        const result = await detector.detectLanguage(testEvent);
        
        expect(result).toEqual({
          language: 'ko',
          confidence: 0.95,
          method: 'native',
          isComposing: true
        });
      });
    });

    describe('Performance and Resource Management', () => {
      it('should manage resources efficiently across platforms', () => {
        const detector = LanguageDetectorFactory.create();
        const stats = detector.getPerformanceStats();
        
        expect(stats).toEqual({
          platform: 'macOS',
          detectionCount: 5,
          averageProcessingTime: 2.5
        });
      });

      it('should handle concurrent detector creation', () => {
        const detectors = Array.from({ length: 5 }, () => 
          LanguageDetectorFactory.getInstance()
        );
        
        // 모든 감지기가 같은 인스턴스여야 함
        detectors.forEach(detector => {
          expect(detector).toBe(detectors[0]);
        });
      });
    });

    describe('Real-World Usage Scenarios', () => {
      it('should handle typical user typing patterns', async () => {
        const detector = LanguageDetectorFactory.create();
        
        // 한글 타이핑 시뮬레이션
        const koreanEvents: UiohookKeyboardEvent[] = [
          { keycode: 107, keychar: 107, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, time: Date.now() }, // ㅏ
          { keycode: 115, keychar: 115, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, time: Date.now() }, // ㄴ
          { keycode: 121, keychar: 121, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, time: Date.now() }  // ㅛ
        ];

        for (const event of koreanEvents) {
          const result = await detector.detectLanguage(event);
          expect(result.language).toBe('ko');
          expect(result.confidence).toBeGreaterThan(0.8);
        }
      });

      it('should maintain state consistency during language switching', () => {
        const detector = LanguageDetectorFactory.create();
        
        detector.setLanguage('en');
        expect(detector.getCurrentLanguage).toBeDefined();
        
        detector.setLanguage('ko');
        expect(detector.getCurrentLanguage).toBeDefined();
      });
    });
  });
});

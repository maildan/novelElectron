/**
 * 🔥 기가차드 키보드 설정 매니저
 * Loop Advanced Keyboard Config Manager - 설정 관리
 */

import { EventEmitter } from 'events';
import { KEYBOARD_CONSTANTS } from '@main/keyboard/constants';
import { GigaChadLogger } from '@main/keyboard/logger';

export interface KeyboardConfig {
  language: 'korean' | 'japanese' | 'chinese' | 'english';
  enableIME: boolean;
  enableGlobalShortcuts: boolean;
  enableAppDetection: boolean;
  autoStartMonitoring: boolean;
  sessionTimeout: number; // minutes
  enableBatchProcessing: boolean;
  batchSize: number;
  debounceDelay: number;
  enableHealthCheck: boolean;
}

/**
 * 🔥 기가차드 키보드 설정 매니저
 */
export class KeyboardConfigManager extends EventEmitter {
  private config: KeyboardConfig;

  constructor(initialConfig?: Partial<KeyboardConfig>) {
    super();
    this.config = this.getDefaultConfig();
    
    if (initialConfig) {
      this.updateConfig(initialConfig);
    }
    
    GigaChadLogger.info('KeyboardConfigManager', '🔥 키보드 설정 매니저 생성됨');
  }

  /**
   * 기본 설정 가져오기
   */
  private getDefaultConfig(): KeyboardConfig {
    return {
      language: 'korean',
      enableIME: true,
      enableGlobalShortcuts: true,
      enableAppDetection: true,
      autoStartMonitoring: false,
      sessionTimeout: KEYBOARD_CONSTANTS.SESSION_TIMEOUT_MS / (60 * 1000), // 30분
      enableBatchProcessing: true,
      batchSize: KEYBOARD_CONSTANTS.BATCH_PROCESS_SIZE,
      debounceDelay: KEYBOARD_CONSTANTS.DEBOUNCE_DELAY_MS,
      enableHealthCheck: true
    };
  }

  /**
   * 설정 업데이트
   */
  public updateConfig(newConfig: Partial<KeyboardConfig>): void {
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...newConfig };
    
    // 검증
    this.validateConfig();
    
    GigaChadLogger.info('KeyboardConfigManager', '⚙️ 키보드 설정 업데이트', {
      old: oldConfig,
      new: this.config
    });
    
    this.emit('config-updated', this.config, oldConfig);
  }

  /**
   * 설정 검증
   */
  private validateConfig(): void {
    // 세션 타임아웃 검증
    if (this.config.sessionTimeout < 1 || this.config.sessionTimeout > 480) { // 1분~8시간
      GigaChadLogger.warn('KeyboardConfigManager', '⚠️ 세션 타임아웃이 범위를 벗어났습니다. 기본값으로 설정됩니다.');
      this.config.sessionTimeout = 30;
    }
    
    // 배치 크기 검증
    if (this.config.batchSize < 1 || this.config.batchSize > 1000) {
      GigaChadLogger.warn('KeyboardConfigManager', '⚠️ 배치 크기가 범위를 벗어났습니다. 기본값으로 설정됩니다.');
      this.config.batchSize = KEYBOARD_CONSTANTS.BATCH_PROCESS_SIZE;
    }
    
    // 디바운스 딜레이 검증
    if (this.config.debounceDelay < 10 || this.config.debounceDelay > 1000) {
      GigaChadLogger.warn('KeyboardConfigManager', '⚠️ 디바운스 딜레이가 범위를 벗어났습니다. 기본값으로 설정됩니다.');
      this.config.debounceDelay = KEYBOARD_CONSTANTS.DEBOUNCE_DELAY_MS;
    }
  }

  /**
   * 현재 설정 가져오기
   */
  public getConfig(): KeyboardConfig {
    return { ...this.config };
  }

  /**
   * 특정 설정값 가져오기
   */
  public getConfigValue<K extends keyof KeyboardConfig>(key: K): KeyboardConfig[K] {
    return this.config[key];
  }

  /**
   * 설정 리셋
   */
  public resetConfig(): void {
    const oldConfig = { ...this.config };
    this.config = this.getDefaultConfig();
    
    GigaChadLogger.info('KeyboardConfigManager', '🔄 키보드 설정 리셋됨');
    this.emit('config-reset', this.config, oldConfig);
  }

  /**
   * 설정을 JSON으로 내보내기
   */
  public exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * JSON에서 설정 가져오기
   */
  public importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      this.updateConfig(importedConfig);
      GigaChadLogger.info('KeyboardConfigManager', '📥 설정 가져오기 완료');
    } catch (error) {
      GigaChadLogger.error('KeyboardConfigManager', '설정 가져오기 실패', error);
      throw new Error('잘못된 설정 JSON 형식입니다.');
    }
  }

  /**
   * 언어 설정 변경
   */
  public setLanguage(language: KeyboardConfig['language']): void {
    this.updateConfig({ language });
  }

  /**
   * IME 활성화/비활성화
   */
  public setIMEEnabled(enabled: boolean): void {
    this.updateConfig({ enableIME: enabled });
  }

  /**
   * 글로벌 단축키 활성화/비활성화
   */
  public setGlobalShortcutsEnabled(enabled: boolean): void {
    this.updateConfig({ enableGlobalShortcuts: enabled });
  }

  /**
   * 앱 감지 활성화/비활성화
   */
  public setAppDetectionEnabled(enabled: boolean): void {
    this.updateConfig({ enableAppDetection: enabled });
  }

  /**
   * 배치 처리 활성화/비활성화
   */
  public setBatchProcessingEnabled(enabled: boolean): void {
    this.updateConfig({ enableBatchProcessing: enabled });
  }

  /**
   * 세션 타임아웃 설정
   */
  public setSessionTimeout(minutes: number): void {
    this.updateConfig({ sessionTimeout: minutes });
  }

  /**
   * 설정이 변경되었는지 확인
   */
  public hasConfigChanged(otherConfig: KeyboardConfig): boolean {
    return JSON.stringify(this.config) !== JSON.stringify(otherConfig);
  }

  /**
   * 정리
   */
  public cleanup(): void {
    this.removeAllListeners();
    GigaChadLogger.info('KeyboardConfigManager', '🧹 키보드 설정 매니저 정리 완료');
  }
}

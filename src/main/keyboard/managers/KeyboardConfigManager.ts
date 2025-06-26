/**
 * 🔥 기가차드 키보드 설정 매니저
 * Loop Advanced Keyboard Config Manager - 설정 관리
 */

import { EventEmitter } from 'events';
import { KEYBOARD_CONSTANTS } from '../constants';
import { Logger } from '../../../shared/logger';
import type { KeyboardConfig } from '../../../shared/types';

const logger = Logger;

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
    
    logger.info('KeyboardConfigManager', '초기화 완료');
  }

  /**
   * 기본 설정 가져오기
   */
  private getDefaultConfig(): KeyboardConfig {
    return {
      enabled: true,
      language: 'korean',
      enableIme: true,
      enableGlobalShortcuts: true,
      enableAppDetection: true,
      autoSaveInterval: 5,
      debugMode: false,
      autoStartMonitoring: false,
      sessionTimeout: 30,
      enableBatchProcessing: false,
      batchSize: 100,
      debounceDelay: 10,
      enableHealthCheck: true
    };
  }

  /**
   * 설정 업데이트
   */
  public updateConfig(newConfig: Partial<KeyboardConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('KeyboardConfigManager', '설정 업데이트', this.config);
  }

  /**
   * 현재 설정 가져오기
   */
  public getConfig(): KeyboardConfig {
    return this.config;
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
    this.config = this.getDefaultConfig();
    logger.info('KeyboardConfigManager', '설정 리셋');
  }

  /**
   * 설정을 JSON으로 내보내기
   */
  public exportConfig(): string {
    return JSON.stringify(this.config);
  }

  /**
   * JSON에서 설정 가져오기
   */
  public importConfig(configJson: string): void {
    try {
      const parsed = JSON.parse(configJson);
      this.updateConfig(parsed);
      logger.info('KeyboardConfigManager', '설정 임포트 성공');
    } catch (e) {
      logger.error('KeyboardConfigManager', '설정 임포트 실패', e);
    }
  }

  /**
   * 언어 설정 변경
   */
  public setLanguage(language: KeyboardConfig['language']): void {
    this.config.language = language;
    logger.info('KeyboardConfigManager', '언어 변경', language);
  }

  /**
   * IME 활성화/비활성화
   */
  public setIMEEnabled(enabled: boolean): void {
    this.config.enableIme = enabled;
    logger.info('KeyboardConfigManager', 'IME 사용여부 변경', enabled);
  }

  /**
   * 글로벌 단축키 활성화/비활성화
   */
  public setGlobalShortcutsEnabled(enabled: boolean): void {
    this.config.enableGlobalShortcuts = enabled;
    logger.info('KeyboardConfigManager', '글로벌 단축키 사용여부 변경', enabled);
  }

  /**
   * 앱 감지 활성화/비활성화
   */
  public setAppDetectionEnabled(enabled: boolean): void {
    this.config.enableAppDetection = enabled;
    logger.info('KeyboardConfigManager', '앱 감지 사용여부 변경', enabled);
  }

  /**
   * 배치 처리 활성화/비활성화
   */
  public setBatchProcessingEnabled(enabled: boolean): void {
    this.config.enableBatchProcessing = enabled;
    logger.info('KeyboardConfigManager', '배치 처리 사용여부 변경', enabled);
  }

  /**
   * 세션 타임아웃 설정
   */
  public setSessionTimeout(minutes: number): void {
    this.config.sessionTimeout = minutes;
    logger.info('KeyboardConfigManager', '세션 타임아웃 변경', minutes);
  }

  /**
   * 설정이 변경되었는지 확인
   */
  public hasConfigChanged(otherConfig: KeyboardConfig): boolean {
    return JSON.stringify(this.config) !== JSON.stringify(otherConfig);
  }
}

// 🔥 기가차드 Settings 모듈 통합 진입점

export * from './types';
export * from './defaults';
export * from './validation';
export { SettingsManager } from './SettingsManager';
export { FileStorage } from './storage/FileStorage';

// 🔥 기본 Settings 인스턴스 생성 팩토리
import { SettingsManager } from './SettingsManager';
import { FileStorage } from './storage/FileStorage';

/**
 * 🔥 기가차드 Settings 시스템 생성
 */
export function createSettingsManager(): SettingsManager {
  const storage = new FileStorage();
  return new SettingsManager(storage);
}

/**
 * 🔥 전역 Settings 인스턴스 (싱글톤)
 */
let globalSettingsManager: SettingsManager | null = null;

export function getSettingsManager(): SettingsManager {
  if (!globalSettingsManager) {
    globalSettingsManager = createSettingsManager();
  }
  return globalSettingsManager;
}

/**
 * 🔥 Settings 시스템 초기화
 */
export async function initializeSettings(): Promise<SettingsManager> {
  const settingsManager = getSettingsManager();
  await settingsManager.initialize();
  return settingsManager;
}

/**
 * 🔥 Settings 시스템 정리
 */
export async function cleanupSettings(): Promise<void> {
  if (globalSettingsManager) {
    await globalSettingsManager.cleanup();
    globalSettingsManager = null;
  }
}

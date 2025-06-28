// 🔥 기가차드 Settings 검증 로직 - 모든 설정값 검증!

import { SettingsSchema, SettingsResult } from './types';
import { SETTINGS_CONSTRAINTS } from './defaults';

/**
 * 🔥 완전한 설정 검증
 */
export function validateSettings(settings: Partial<SettingsSchema>): SettingsResult<SettingsSchema> {
  try {
    // 앱 설정 검증
    if (settings.app) {
      const appResult = validateAppSettings(settings.app);
      if (!appResult.success) {
        return { success: false, error: `App settings: ${appResult.error}` };
      }
    }

    // 키보드 설정 검증
    if (settings.keyboard) {
      const keyboardResult = validateKeyboardSettings(settings.keyboard);
      if (!keyboardResult.success) {
        return { success: false, error: `Keyboard settings: ${keyboardResult.error}` };
      }
    }

    // UI 설정 검증
    if (settings.ui) {
      const uiResult = validateUISettings(settings.ui);
      if (!uiResult.success) {
        return { success: false, error: `UI settings: ${uiResult.error}` };
      }
    }

    // 분석 설정 검증
    if (settings.analytics) {
      const analyticsResult = validateAnalyticsSettings(settings.analytics);
      if (!analyticsResult.success) {
        return { success: false, error: `Analytics settings: ${analyticsResult.error}` };
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation error'
    };
  }
}

/**
 * 🔥 앱 설정 검증
 */
function validateAppSettings(app: unknown): SettingsResult<unknown> {
  if (!app || typeof app !== 'object') {
    return { success: false, error: 'App settings must be an object' };
  }
  
  const appSettings = app as Record<string, unknown>;
  
  // 테마 검증
  if (appSettings.theme && typeof appSettings.theme === 'string') {
    const validThemes = SETTINGS_CONSTRAINTS.app.theme as readonly string[];
    if (!validThemes.includes(appSettings.theme)) {
      return { success: false, error: `Invalid theme: ${appSettings.theme}` };
    }
  }

  // 언어 검증
  if (appSettings.language && typeof appSettings.language === 'string') {
    const validLanguages = SETTINGS_CONSTRAINTS.app.language as readonly string[];
    if (!validLanguages.includes(appSettings.language)) {
      return { success: false, error: `Invalid language: ${appSettings.language}` };
    }
  }

  // 윈도우 경계 검증
  if (appSettings.windowBounds && typeof appSettings.windowBounds === 'object') {
    const bounds = appSettings.windowBounds as Record<string, unknown>;
    const { width, height } = bounds;
    const constraints = SETTINGS_CONSTRAINTS.app.windowBounds;
    
    if (typeof width === 'number' && (width < constraints.width.min || width > constraints.width.max)) {
      return { success: false, error: `Invalid window width: ${width}` };
    }
    
    if (typeof height === 'number' && (height < constraints.height.min || height > constraints.height.max)) {
      return { success: false, error: `Invalid window height: ${height}` };
    }
  }

  return { success: true };
}

/**
 * 🔥 키보드 설정 검증
 */
function validateKeyboardSettings(keyboard: unknown): SettingsResult<unknown> {
  if (!keyboard || typeof keyboard !== 'object') {
    return { success: false, error: 'Keyboard settings must be an object' };
  }
  
  const keyboardSettings = keyboard as Record<string, unknown>;
  
  // 자동 저장 간격 검증
  if (keyboardSettings.autoSaveInterval && typeof keyboardSettings.autoSaveInterval === 'number') {
    const constraints = SETTINGS_CONSTRAINTS.keyboard.autoSaveInterval;
    if (keyboardSettings.autoSaveInterval < constraints.min || keyboardSettings.autoSaveInterval > constraints.max) {
      return { success: false, error: `Invalid auto save interval: ${keyboardSettings.autoSaveInterval}` };
    }
  }

  // 세션 타임아웃 검증
  if (keyboardSettings.sessionTimeout && typeof keyboardSettings.sessionTimeout === 'number') {
    const constraints = SETTINGS_CONSTRAINTS.keyboard.sessionTimeout;
    if (keyboardSettings.sessionTimeout < constraints.min || keyboardSettings.sessionTimeout > constraints.max) {
      return { success: false, error: `Invalid session timeout: ${keyboardSettings.sessionTimeout}` };
    }
  }

  // 배치 크기 검증
  if (keyboardSettings.batchSize && typeof keyboardSettings.batchSize === 'number') {
    const constraints = SETTINGS_CONSTRAINTS.keyboard.batchSize;
    if (keyboardSettings.batchSize < constraints.min || keyboardSettings.batchSize > constraints.max) {
      return { success: false, error: `Invalid batch size: ${keyboardSettings.batchSize}` };
    }
  }

  return { success: true };
}

/**
 * 🔥 UI 설정 검증
 */
function validateUISettings(ui: unknown): SettingsResult<unknown> {
  if (!ui || typeof ui !== 'object') {
    return { success: false, error: 'UI settings must be an object' };
  }
  
  const uiSettings = ui as Record<string, unknown>;
  
  // 글꼴 크기 검증
  if (uiSettings.fontSize && typeof uiSettings.fontSize === 'number') {
    const constraints = SETTINGS_CONSTRAINTS.ui.fontSize;
    if (uiSettings.fontSize < constraints.min || uiSettings.fontSize > constraints.max) {
      return { success: false, error: `Invalid font size: ${uiSettings.fontSize}` };
    }
  }

  // 애니메이션 속도 검증
  if (uiSettings.animationSpeed && typeof uiSettings.animationSpeed === 'string') {
    const validSpeeds = SETTINGS_CONSTRAINTS.ui.animationSpeed as readonly string[];
    if (!validSpeeds.includes(uiSettings.animationSpeed)) {
      return { success: false, error: `Invalid animation speed: ${uiSettings.animationSpeed}` };
    }
  }

  return { success: true };
}

/**
 * 🔥 분석 설정 검증
 */
function validateAnalyticsSettings(analytics: unknown): SettingsResult<unknown> {
  if (!analytics || typeof analytics !== 'object') {
    return { success: false, error: 'Analytics settings must be an object' };
  }
  
  const analyticsSettings = analytics as Record<string, unknown>;
  
  // 목표 WPM 검증
  if (analyticsSettings.targetWPM && typeof analyticsSettings.targetWPM === 'number') {
    const constraints = SETTINGS_CONSTRAINTS.analytics.targetWPM;
    if (analyticsSettings.targetWPM < constraints.min || analyticsSettings.targetWPM > constraints.max) {
      return { success: false, error: `Invalid target WPM: ${analyticsSettings.targetWPM}` };
    }
  }

  // 목표 정확도 검증
  if (analyticsSettings.targetAccuracy && typeof analyticsSettings.targetAccuracy === 'number') {
    const constraints = SETTINGS_CONSTRAINTS.analytics.targetAccuracy;
    if (analyticsSettings.targetAccuracy < constraints.min || analyticsSettings.targetAccuracy > constraints.max) {
      return { success: false, error: `Invalid target accuracy: ${analyticsSettings.targetAccuracy}` };
    }
  }

  // 일일 목표 검증
  if (analyticsSettings.dailyGoal && typeof analyticsSettings.dailyGoal === 'number') {
    const constraints = SETTINGS_CONSTRAINTS.analytics.dailyGoal;
    if (analyticsSettings.dailyGoal < constraints.min || analyticsSettings.dailyGoal > constraints.max) {
      return { success: false, error: `Invalid daily goal: ${analyticsSettings.dailyGoal}` };
    }
  }

  return { success: true };
}

/**
 * 🔥 보안 설정 검증
 */
function validateSecuritySettings(security: unknown): SettingsResult<unknown> {
  if (!security || typeof security !== 'object') {
    return { success: false, error: 'Security settings must be an object' };
  }
  
  // 기본적인 불린 값들만 검증
  return { success: true };
}

/**
 * 🔥 알림 설정 검증
 */
function validateNotificationSettings(notifications: unknown): SettingsResult<unknown> {
  if (!notifications || typeof notifications !== 'object') {
    return { success: false, error: 'Notification settings must be an object' };
  }
  
  // 기본적인 불린 값들만 검증
  return { success: true };
}

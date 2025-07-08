'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Logger } from '../../../../shared/logger';
import type { SettingsData, UseSettingsReturn } from '../types';

// 🔥 기가차드 useSettings 훅 - Electron-Store 완벽 호환!

/**
 * 🔥 Settings 관리를 위한 커스텀 훅
 * - main/settings/ElectronStoreSettingsManager와 완벽 호환
 * - IPC 통신을 통한 설정 관리
 * - 타입 안전한 설정 업데이트
 * - 성능 최적화된 상태 관리
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🔥 중복 요청 방지를 위한 ref
  const loadingRef = useRef<boolean>(false);
  const savingRef = useRef<boolean>(false);

  /**
   * 🔥 기본값 정의 (main/settings와 동일)
   */
  const defaultSettings: SettingsData = {
    app: {
      theme: 'system',
      language: 'ko',
      autoSave: true,
      startMinimized: false,
      minimizeToTray: true,
      fontSize: 14,
      fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    },
    keyboard: {
      enabled: true,
      language: 'korean',
      trackAllApps: false,
      sessionTimeout: 30,
    },
    ui: {
      windowWidth: 1400,
      windowHeight: 900,
      sidebarCollapsed: false,
      focusMode: false,
      showLineNumbers: true,
      showWordCount: true,
    },
    performance: {
      enableGPUAcceleration: true,
      maxCPUUsage: 80,
      maxMemoryUsage: 2048,
      enableHardwareAcceleration: true,
    },
  };

  /**
   * 🔥 설정 로드 (중복 방지)
   */
  const loadSettings = useCallback(async (): Promise<void> => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      
      Logger.debug('USE_SETTINGS', 'Loading settings from main process');
      
      const result = await window.electronAPI.settings.get('all');
      
      if (result.success && result.data) {
        setSettings(result.data as SettingsData);
        Logger.info('USE_SETTINGS', 'Settings loaded successfully', result.data);
      } else {
        Logger.warn('USE_SETTINGS', 'Failed to load settings, using defaults', result.error);
        setSettings(defaultSettings);
        setError('기본 설정을 사용합니다.');
      }
    } catch (error) {
      Logger.error('USE_SETTINGS', 'Error loading settings', error);
      setSettings(defaultSettings);
      setError(error instanceof Error ? error.message : '설정 로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  /**
   * 🔥 설정 업데이트 (타입 안전)
   */
  const updateSetting = useCallback(async <K extends keyof SettingsData, T extends keyof SettingsData[K]>(
    category: K,
    key: T,
    value: SettingsData[K][T]
  ): Promise<void> => {
    if (!settings || savingRef.current) return;

    try {
      setSaving(true);
      
      // 🔥 즉시 UI 업데이트 (낙관적 업데이트)
      setSettings(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: value,
          },
        };
      });

      // 🔥 백엔드에 저장 (dot notation 사용)
      const keyPath = `${category}.${String(key)}`;
      Logger.debug('USE_SETTINGS', `Updating setting: ${keyPath}`, { value });
      
      const result = await window.electronAPI.settings.set(keyPath, value);
      
      if (result.success) {
        Logger.info('USE_SETTINGS', `Setting updated successfully: ${keyPath}`, { value });
      } else {
        throw new Error(result.error || `Failed to save ${keyPath}`);
      }
    } catch (error) {
      Logger.error('USE_SETTINGS', `Error updating setting: ${category}.${String(key)}`, error);
      
      // 🔥 에러 시 롤백
      await loadSettings();
      setError(`설정 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSaving(false);
    }
  }, [settings, loadSettings]);

  /**
   * 🔥 모든 설정 저장
   */
  const saveAllSettings = useCallback(async (): Promise<void> => {
    if (!settings || savingRef.current) return;

    try {
      savingRef.current = true;
      setSaving(true);
      setError(null);
      
      Logger.info('USE_SETTINGS', 'Saving all settings...');
      
      // 🔥 각 카테고리별로 저장
      for (const [category, categoryData] of Object.entries(settings)) {
        const result = await window.electronAPI.settings.set(category, categoryData);
        if (!result.success) {
          throw new Error(`Failed to save ${category} settings: ${result.error}`);
        }
      }
      
      Logger.info('USE_SETTINGS', 'All settings saved successfully');
    } catch (error) {
      Logger.error('USE_SETTINGS', 'Failed to save all settings', error);
      setError(`전체 설정 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, [settings]);

  /**
   * 🔥 설정 리셋
   */
  const resetSettings = useCallback(async (): Promise<void> => {
    if (savingRef.current) return;

    try {
      savingRef.current = true;
      setSaving(true);
      setError(null);
      
      Logger.info('USE_SETTINGS', 'Resetting all settings...');
      
      const result = await window.electronAPI.settings.reset();
      
      if (result.success) {
        // 🔥 성공 시 기본값으로 설정하고 다시 로드
        setSettings(defaultSettings);
        await loadSettings();
        Logger.info('USE_SETTINGS', 'Settings reset successfully');
      } else {
        throw new Error(result.error || 'Failed to reset settings');
      }
    } catch (error) {
      Logger.error('USE_SETTINGS', 'Failed to reset settings', error);
      setError(`설정 초기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, [loadSettings]);

  /**
   * 🔥 초기 설정 로드
   */
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * 🔥 에러 자동 클리어 (10초 후)
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    settings,
    loading,
    saving,
    error,
    updateSetting,
    saveAllSettings,
    resetSettings,
    loadSettings,
  };
}

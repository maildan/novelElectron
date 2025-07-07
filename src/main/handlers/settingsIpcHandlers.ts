// 🔥 기가차드 Settings IPC 핸들러 - electron-store 기반 완전 리팩토링

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';
import { getElectronStoreSettingsManager } from '../settings/ElectronStoreSettingsManager';

const componentName = 'SETTINGS_IPC';

/**
 * 🔥 Settings IPC 핸들러 설정 (electron-store 기반)
 */
export function setupSettingsIpcHandlers(): void {
  Logger.info(componentName, 'Setting up electron-store based Settings IPC handlers...');

  const settingsManager = getElectronStoreSettingsManager();

  // 🔥 모든 설정 가져오기
  ipcMain.handle('settings:get-all', async (): Promise<IpcResponse<unknown>> => {
    try {
      Logger.debug(componentName, 'Getting all settings');
      
      const allSettings = settingsManager.getAll();
      
      return {
        success: true,
        data: allSettings,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to get all settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 특정 설정 가져오기 (dot notation 지원)
  ipcMain.handle('settings:get', async (_event: IpcMainInvokeEvent, keyPath: string): Promise<IpcResponse<unknown>> => {
    try {
      Logger.debug(componentName, 'Getting setting', { keyPath });
      
      const value = settingsManager.getDeep(keyPath);
      
      return {
        success: true,
        data: value,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to get setting', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 설정 저장하기 (dot notation 지원)
  ipcMain.handle('settings:set', async (_event: IpcMainInvokeEvent, keyPath: string, value: unknown): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug(componentName, 'Setting value', { keyPath, value });
      
      const success = settingsManager.setDeep(keyPath, value);
      
      return {
        success: true,
        data: success,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to set setting', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 설정 리셋
  ipcMain.handle('settings:reset', async (_event: IpcMainInvokeEvent, category?: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.info(componentName, 'Resetting settings', { category });
      
      const success = settingsManager.reset(category as any);
      
      return {
        success: true,
        data: success,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to reset settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  Logger.info(componentName, '✅ electron-store based Settings IPC handlers setup complete');
}

/**
 * 🔥 Settings IPC 핸들러 정리
 */
export function cleanupSettingsIpcHandlers(): void {
  ipcMain.removeHandler('settings:get-all');
  ipcMain.removeHandler('settings:get');
  ipcMain.removeHandler('settings:set');
  ipcMain.removeHandler('settings:reset');

  Logger.info(componentName, '✅ Settings IPC handlers cleanup complete');
}

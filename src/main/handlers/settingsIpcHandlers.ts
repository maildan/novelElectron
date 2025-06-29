// 🔥 기가차드 Settings IPC 핸들러 - 프론트엔드와 연결!

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { getSettingsManager } from '../settings';
import { SettingsSchema } from '../settings/types';

const componentName = 'SETTINGS_IPC';

/**
 * 🔥 Settings IPC 핸들러 설정
 */
export function setupSettingsIpcHandlers(): void {
  Logger.info(componentName, 'Setting up Settings IPC handlers...');

  // 🔥 모든 설정 가져오기
  ipcMain.handle('settings:get-all', async () => {
    try {
      const settingsManager = getSettingsManager();
      const settings = settingsManager.getAll();
      
      Logger.debug(componentName, 'All settings retrieved');
      return {
        success: true,
        data: settings
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to get all settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 특정 카테고리 설정 가져오기
  ipcMain.handle('settings:get-category', async (_: IpcMainInvokeEvent, category: keyof SettingsSchema) => {
    try {
      const settingsManager = getSettingsManager();
      const categorySettings = settingsManager.get(category);
      
      Logger.debug(componentName, `Category '${category}' settings retrieved`);
      return {
        success: true,
        data: categorySettings
      };
    } catch (error) {
      Logger.error(componentName, `Failed to get '${category}' settings`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 특정 설정값 가져오기
  ipcMain.handle('settings:get-value', async (_: any, category: keyof SettingsSchema, key: string) => {
    try {
      const settingsManager = getSettingsManager();
      const value = settingsManager.getDeep(category, key);
      
      Logger.debug(componentName, `Setting '${category}.${key}' retrieved`);
      return {
        success: true,
        data: value
      };
    } catch (error) {
      Logger.error(componentName, `Failed to get '${category}.${key}'`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 전체 카테고리 설정 변경
  ipcMain.handle('settings:set-category', async (_: any, category: keyof SettingsSchema, value: unknown) => {
    try {
      const settingsManager = getSettingsManager();
      const result = await settingsManager.set(category, value as SettingsSchema[typeof category]);
      
      if (result.success) {
        Logger.debug(componentName, `Category '${category}' settings updated`);
      }
      
      return result;
    } catch (error) {
      Logger.error(componentName, `Failed to set '${category}' settings`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 특정 설정값 변경
  ipcMain.handle('settings:set-value', async (_: any, category: keyof SettingsSchema, key: string, value: unknown) => {
    try {
      const settingsManager = getSettingsManager();
      const result = await settingsManager.setDeep(category, key, value);
      
      if (result.success) {
        Logger.debug(componentName, `Setting '${category}.${key}' updated`);
      }
      
      return result;
    } catch (error) {
      Logger.error(componentName, `Failed to set '${category}.${key}'`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 설정 리셋
  ipcMain.handle('settings:reset', async () => {
    try {
      const settingsManager = getSettingsManager();
      const result = await settingsManager.reset();
      
      if (result.success) {
        Logger.info(componentName, 'Settings reset to defaults');
      }
      
      return result;
    } catch (error) {
      Logger.error(componentName, 'Failed to reset settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 설정 백업
  ipcMain.handle('settings:backup', async () => {
    try {
      const settingsManager = getSettingsManager();
      const result = await settingsManager.backup();
      
      if (result.success) {
        Logger.info(componentName, 'Settings backup created');
      }
      
      return result;
    } catch (error) {
      Logger.error(componentName, 'Failed to backup settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 설정 복원
  ipcMain.handle('settings:restore', async (_: any, backupData: string) => {
    try {
      const settingsManager = getSettingsManager();
      const result = await settingsManager.restore(backupData);
      
      if (result.success) {
        Logger.info(componentName, 'Settings restored from backup');
      }
      
      return result;
    } catch (error) {
      Logger.error(componentName, 'Failed to restore settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  Logger.info(componentName, 'Settings IPC handlers setup completed');
}

/**
 * 🔥 Settings IPC 핸들러 정리
 */
export function cleanupSettingsIpcHandlers(): void {
  Logger.info(componentName, 'Cleaning up Settings IPC handlers...');
  
  // 모든 settings 관련 IPC 핸들러 제거
  const settingsChannels = [
    'settings:get-all',
    'settings:get-category', 
    'settings:get-value',
    'settings:set-category',
    'settings:set-value',
    'settings:reset',
    'settings:backup',
    'settings:restore'
  ];
  
  settingsChannels.forEach(channel => {
    ipcMain.removeAllListeners(channel);
  });
  
  Logger.info(componentName, 'Settings IPC handlers cleanup completed');
}

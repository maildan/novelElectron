// 🔥 기가차드 IPC Handlers 단위 테스트

import { ipcMain } from 'electron';
import { Logger } from '../../../src/shared/logger';
import { IpcResponse, IPC_CHANNELS } from '../../../src/shared/types';
import { setupAllIpcHandlers, cleanupAllIpcHandlers } from '../../../src/main/ipc-handlers';

// Mock electron
jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn(),
    removeHandler: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
}));

// Mock Logger
jest.mock('../../../src/shared/logger', () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    time: jest.fn(),
    timeEnd: jest.fn(),
  },
}));

// Mock keyboard service and other dependencies
jest.mock('../../../src/main/keyboard/keyboardService', () => ({
  keyboardService: {
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
    getStatus: jest.fn(),
  },
}));

jest.mock('../../../src/main/handlers/keyboardIpcHandlers', () => ({
  setupKeyboardIpcHandlers: jest.fn(),
}));

jest.mock('../../../src/main/handlers/dashboardIpcHandlers', () => ({
  setupDashboardIpcHandlers: jest.fn(),
}));

describe('IPC Handlers', () => {
  let mockIpcMain: jest.Mocked<typeof ipcMain>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockIpcMain = ipcMain as jest.Mocked<typeof ipcMain>;
  });

  describe('Setup Functions', () => {
    it('should setup all IPC handlers without errors', () => {
      expect(() => setupAllIpcHandlers()).not.toThrow();
      
      expect(Logger.debug).toHaveBeenCalledWith('IPC_HANDLERS', 'Setting up all IPC handlers');
      expect(Logger.info).toHaveBeenCalledWith('IPC_HANDLERS', 'All IPC handlers setup complete');
    });

    it('should cleanup all IPC handlers without errors', () => {
      expect(() => cleanupAllIpcHandlers()).not.toThrow();
      
      expect(Logger.debug).toHaveBeenCalledWith('IPC_HANDLERS', 'Cleaning up all IPC handlers');
      expect(Logger.info).toHaveBeenCalledWith('IPC_HANDLERS', 'All IPC handlers cleanup completed');
      expect(mockIpcMain.removeHandler).toHaveBeenCalledWith(expect.any(String));
      expect(mockIpcMain.removeHandler).toHaveBeenCalledWith(expect.stringContaining('keyboard:'));
      expect(mockIpcMain.removeHandler).toHaveBeenCalledWith(expect.stringContaining('window:'));
      expect(mockIpcMain.removeHandler).toHaveBeenCalledWith(expect.stringContaining('database:'));
      expect(mockIpcMain.removeHandler).toHaveBeenCalledWith(expect.stringContaining('settings:'));
      expect(mockIpcMain.removeHandler).toHaveBeenCalledWith(expect.stringContaining('app:'));
    });
  });

  describe('IPC Channel Constants', () => {
    it('should have keyboard channels defined', () => {
      expect(IPC_CHANNELS.KEYBOARD).toBeDefined();
      expect(IPC_CHANNELS.KEYBOARD.START_MONITORING).toBe('keyboard:start-monitoring');
      expect(IPC_CHANNELS.KEYBOARD.STOP_MONITORING).toBe('keyboard:stop-monitoring');
      expect(IPC_CHANNELS.KEYBOARD.GET_STATUS).toBe('keyboard:get-status');
      expect(IPC_CHANNELS.KEYBOARD.EVENT).toBe('keyboard:event');
    });

    it('should have window channels defined', () => {
      expect(IPC_CHANNELS.WINDOW).toBeDefined();
      expect(IPC_CHANNELS.WINDOW.GET_ACTIVE).toBe('window:get-active');
      expect(IPC_CHANNELS.WINDOW.GET_LIST).toBe('window:get-list');
    });

    it('should have database channels defined', () => {
      expect(IPC_CHANNELS.DATABASE).toBeDefined();
      expect(IPC_CHANNELS.DATABASE.SAVE_SESSION).toBe('database:save-session');
      expect(IPC_CHANNELS.DATABASE.GET_SESSIONS).toBe('database:get-sessions');
      expect(IPC_CHANNELS.DATABASE.GET_STATS).toBe('database:get-stats');
    });

    it('should have settings channels defined', () => {
      expect(IPC_CHANNELS.SETTINGS).toBeDefined();
      expect(IPC_CHANNELS.SETTINGS.GET).toBe('settings:get');
      expect(IPC_CHANNELS.SETTINGS.SET).toBe('settings:set');
      expect(IPC_CHANNELS.SETTINGS.RESET).toBe('settings:reset');
    });

    it('should have app channels defined', () => {
      expect(IPC_CHANNELS.APP).toBeDefined();
      expect(IPC_CHANNELS.APP.GET_VERSION).toBe('app:get-version');
      expect(IPC_CHANNELS.APP.QUIT).toBe('app:quit');
      expect(IPC_CHANNELS.APP.MINIMIZE).toBe('app:minimize');
      expect(IPC_CHANNELS.APP.MAXIMIZE).toBe('app:maximize');
    });
  });

  describe('Error Handling', () => {
    it('should handle setup errors gracefully', () => {
      const originalSetupKeyboard = require('../../../src/main/handlers/keyboardIpcHandlers').setupKeyboardIpcHandlers;
      
      // Mock to throw error
      require('../../../src/main/handlers/keyboardIpcHandlers').setupKeyboardIpcHandlers = jest.fn(() => {
        throw new Error('Test setup error');
      });
      
      expect(() => setupAllIpcHandlers()).toThrow('Test setup error');
      
      expect(Logger.error).toHaveBeenCalledWith(
        'IPC_HANDLERS',
        'Failed to setup IPC handlers',
        expect.any(Error)
      );
      
      // Restore original
      require('../../../src/main/handlers/keyboardIpcHandlers').setupKeyboardIpcHandlers = originalSetupKeyboard;
    });

    it('should handle cleanup errors gracefully', () => {
      // Mock Logger.error to throw
      const originalError = Logger.error;
      Logger.error = jest.fn(() => {
        throw new Error('Logger error');
      });
      
      expect(() => cleanupAllIpcHandlers()).not.toThrow();
      
      // Restore original
      Logger.error = originalError;
    });
  });

  describe('Type Safety', () => {
    it('should define proper IpcResponse type', () => {
      // Test creating IpcResponse with data
      const successResponse: IpcResponse<string> = {
        success: true,
        data: 'test data',
        timestamp: new Date(),
      };
      
      expect(successResponse.success).toBe(true);
      expect(successResponse.data).toBe('test data');
      expect(successResponse.timestamp).toBeInstanceOf(Date);
      
      // Test creating IpcResponse with error
      const errorResponse: IpcResponse = {
        success: false,
        error: 'Test error message',
        timestamp: new Date(),
      };
      
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toBe('Test error message');
      expect(errorResponse.timestamp).toBeInstanceOf(Date);
    });

    it('should work with generic types', () => {
      interface TestData {
        id: number;
        name: string;
      }
      
      const typedResponse: IpcResponse<TestData> = {
        success: true,
        data: { id: 1, name: 'test' },
        timestamp: new Date(),
      };
      
      expect(typedResponse.data?.id).toBe(1);
      expect(typedResponse.data?.name).toBe('test');
    });
  });

  describe('Logger Integration', () => {
    it('should use proper logger methods', () => {
      setupAllIpcHandlers();
      
      expect(Logger.debug).toHaveBeenCalled();
      expect(Logger.info).toHaveBeenCalled();
      
      cleanupAllIpcHandlers();
      
      expect(Logger.debug).toHaveBeenCalledWith(
        'IPC_HANDLERS',
        'Cleaning up all IPC handlers'
      );
    });

    it('should handle logger methods being called', () => {
      expect(() => Logger.debug('TEST', 'Test message')).not.toThrow();
      expect(() => Logger.info('TEST', 'Test message')).not.toThrow();
      expect(() => Logger.warn('TEST', 'Test message')).not.toThrow();
      expect(() => Logger.error('TEST', 'Test message', new Error())).not.toThrow();
      expect(() => Logger.time('TEST')).not.toThrow();
      expect(() => Logger.timeEnd('TEST')).not.toThrow();
    });
  });
});

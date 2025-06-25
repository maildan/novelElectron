import { Logger } from "../../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 IPC 매니저
 * Loop Typing Analytics - IPC Manager
 */

import { ipcMain } from 'electron';

export class IpcManager {
  private static instance: IpcManager;
  private handlers: Map<string, Function>;

  private constructor() {
    this.handlers = new Map();
  }

  static getInstance(): IpcManager {
    if (!IpcManager.instance) {
      IpcManager.instance = new IpcManager();
    }
    return IpcManager.instance;
  }

  /**
   * IPC 매니저 초기화
   */
  initialize(): void {
    log.info("Console", '🔥 기가차드 IPC 매니저 초기화 시작...');
    
    // 기본 핸들러들 등록
    this.registerBasicHandlers();
    
    log.info("Console", '✅ IPC 매니저 초기화 완료');
    log.info("Console", '🎯 키보드 관련 IPC는 UnifiedKeyboardHandler에서 별도 관리됩니다');
  }

  /**
   * 기본 핸들러들 등록
   */
  private registerBasicHandlers(): void {
    // 앱 상태
    this.registerHandler('app:getVersion', () => {
      return process.env.npm_package_version || '0.1.0';
    });

    this.registerHandler('app:getPlatform', () => {
      return process.platform;
    });

    // 건강 체크
    this.registerHandler('app:health', () => {
      return { status: 'ok', timestamp: Date.now() };
    });

    log.info("Console", '✅ 기본 IPC 핸들러 등록 완료');
  }

  /**
   * 핸들러 등록
   */
  registerHandler(channel: string, handler: Function): void {
    if (this.handlers.has(channel)) {
      log.warn("Console", `⚠️ IPC 핸들러 덮어쓰기: ${channel}`);
    }

    this.handlers.set(channel, handler);
    ipcMain.handle(channel, async (event, ...args) => {
      try {
        log.info("Console", `📡 IPC 호출: ${channel}`, args.length > 0 ? args : '');
        const result = await handler(...args);
        return result;
      } catch (error) {
        log.error("Console", `❌ IPC 핸들러 에러 [${channel}]:`, error);
        throw error;
      }
    });
  }

  /**
   * 핸들러 제거
   */
  removeHandler(channel: string): void {
    if (this.handlers.has(channel)) {
      ipcMain.removeHandler(channel);
      this.handlers.delete(channel);
      log.info("Console", `🗑️ IPC 핸들러 제거: ${channel}`);
    }
  }

  /**
   * 모든 핸들러 목록 가져오기
   */
  getHandlers(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * 정리
   */
  cleanup(): void {
    log.info("Console", '🧹 IPC 매니저 정리 시작...');
    
    // 모든 핸들러 제거
    for (const channel of this.handlers.keys()) {
      ipcMain.removeHandler(channel);
    }
    
    this.handlers.clear();
    log.info("Console", '✅ IPC 매니저 정리 완료');
  }

  /**
   * 메시지 브로드캐스트 (모든 윈도우에)
   */
  broadcast(channel: string, data: unknown): void {
    const { BrowserWindow } = require('electron');
    const windows = BrowserWindow.getAllWindows();
    
    for (const window of windows) {
      if (!window.isDestroyed()) {
        window.webContents.send(channel, data);
      }
    }
    
    log.info("Console", `📢 브로드캐스트: ${channel}`, data);
  }
}

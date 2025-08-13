// 🔥 IPC 핸들러 유틸리티 - 중복 등록 방지

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';

/**
 * 🔥 안전한 IPC 핸들러 등록 - 중복 방지
 */
export function safeRegisterIpcHandler(
  channel: string, 
  handler: (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown
): void {
  try {
    // 기존 핸들러가 있다면 제거
    ipcMain.removeHandler(channel);
  } catch (error) {
    // 핸들러가 없는 경우는 무시
  }
  
  // 새 핸들러 등록
  ipcMain.handle(channel, handler);
  Logger.debug('IPC_HELPER', `Handler registered safely: ${channel}`);
}

/**
 * 🔥 여러 핸들러 일괄 정리
 */
export function removeMultipleHandlers(channels: string[]): void {
  for (const channel of channels) {
    try {
      ipcMain.removeHandler(channel);
    } catch (error) {
      // 핸들러가 없는 경우는 무시
    }
  }
  Logger.debug('IPC_HELPER', `Removed ${channels.length} handlers`);
}

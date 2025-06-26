import { useCallback } from 'react';
import { IpcResponse } from '../shared/types';
import { Logger } from '../shared/logger';

export function useIpc<TRequest = unknown, TResponse = unknown>(channel: string) {
  return useCallback(
    async (request: TRequest): Promise<IpcResponse<TResponse>> => {
      try {
        // @ts-ignore: Electron preload에서 window.electron.ipcRenderer 노출 필요
        const response = await window.electron?.ipcRenderer?.invoke(channel, request);
        Logger.info('useIpc', `IPC 요청: ${channel}`, { request, response });
        return response as IpcResponse<TResponse>;
      } catch (error) {
        Logger.error('useIpc', `IPC 에러: ${channel}`, error);
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date(),
        };
      }
    },
    [channel]
  );
} 
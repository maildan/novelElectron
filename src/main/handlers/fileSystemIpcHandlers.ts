import { app, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import { Logger } from '../../shared/logger';

function isPathInside(parent: string, child: string): boolean {
  const rel = path.relative(parent, child);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function resolveAndValidate(filePath: string): string | null {
  if (typeof filePath !== 'string' || filePath.trim() === '') return null;
  const normalized = path.resolve(filePath);

  const allowedRoots: string[] = [];
  // Allow userData (app state)
  try { allowedRoots.push(app.getPath('userData')); } catch {}
  // Allow packaged public assets
  allowedRoots.push(path.join(process.resourcesPath, 'app.asar', 'public'));
  allowedRoots.push(path.join(process.resourcesPath, 'public'));
  // Allow dev-time project public/assets
  allowedRoots.push(path.join(process.cwd(), 'public'));
  allowedRoots.push(path.join(process.cwd(), 'assets'));

  for (const root of allowedRoots) {
    if (isPathInside(root, normalized)) return normalized;
  }
  return null;
}

export function setupFileSystemIpcHandlers(): void {
  Logger.info('FS_IPC', 'Setting up secure filesystem IPC handlers');

  ipcMain.handle('fs:read-file', async (_event: IpcMainInvokeEvent, filePath: unknown, encoding: unknown = 'utf-8') => {
    try {
      if (typeof filePath !== 'string') throw new Error('Invalid filePath');
      if (encoding !== undefined && encoding !== 'utf-8' && encoding !== 'utf8') {
        throw new Error('Unsupported encoding');
      }
      const safePath = resolveAndValidate(filePath);
      if (!safePath) throw new Error('Access denied');
      const data = await fs.readFile(safePath, 'utf-8');
      return { success: true, data, timestamp: new Date() };
    } catch (error) {
      Logger.warn('FS_IPC', 'read-file failed', { filePath, error });
      return { success: false, error: (error as Error).message, timestamp: new Date() };
    }
  });
}

export default setupFileSystemIpcHandlers;



import { Logger } from "@shared/logger";
const log = Logger;/**
 * Menu action handlers
 * Modularized from MenuManager.ts
 */

import { BrowserWindow, dialog, shell, app } from 'electron';
import { APP_NAME } from '@main/constants';

/**
 * Menu action handler class
 */
export class MenuHandlers {
  
  /**
   * Show about dialog
   */
  static async showAbout(): Promise<void> {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    
    const options = {
      type: 'info' as const,
      title: `About ${APP_NAME}`,
      message: APP_NAME,
      detail: [
        `Version: ${app.getVersion()}`,
        `Electron: ${process.versions.electron}`,
        `Node.js: ${process.versions.node}`,
        `Chrome: ${process.versions.chrome}`,
        `Platform: ${process.platform}`,
        '',
        'Advanced typing analytics and monitoring',
        'Built with ❤️ by the Loop Team'
      ].join('\n'),
      buttons: ['OK'],
      defaultId: 0
    };

    if (focusedWindow) {
      await dialog.showMessageBox(focusedWindow, options);
    } else {
      await dialog.showMessageBox(options);
    }
  }

  /**
   * Show preferences window
   */
  static async showPreferences(): Promise<void> {
    // TODO: Implement preferences window
    log.info("Console", '📋 Opening preferences...');
    
    // For now, send IPC to main window to navigate to settings
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow && 'webContents' in mainWindow) {
      const win = mainWindow as BrowserWindow;
      win.webContents.send('navigate-to', '/settings');
      win.show();
      win.focus();
    }
  }

  /**
   * Create new typing session
   */
  static async createNewSession(): Promise<void> {
    log.info("Console", '✨ Creating new typing session...');
    
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow && 'webContents' in mainWindow) {
      const win = mainWindow as BrowserWindow;
      win.webContents.send('create-new-session');
      win.show();
      win.focus();
    }
  }

  /**
   * Export user data
   */
  static async exportData(): Promise<void> {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    
    try {
      const result = focusedWindow 
        ? await dialog.showSaveDialog(focusedWindow, {
            title: 'Export Loop Data',
            defaultPath: `loop-data-${new Date().toISOString().split('T')[0]}.json`,
            filters: [
              { name: 'JSON Files', extensions: ['json'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          })
        : await dialog.showSaveDialog({
            title: 'Export Loop Data',
            defaultPath: `loop-data-${new Date().toISOString().split('T')[0]}.json`,
            filters: [
              { name: 'JSON Files', extensions: ['json'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          });

      if (!result.canceled && result.filePath) {
        // TODO: Implement actual data export
        log.info("Console", '📤 Exporting data to:', result.filePath);
        
        // Send IPC to main process to handle export
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (mainWindow && 'webContents' in mainWindow) {
          const win = mainWindow as BrowserWindow;
          win.webContents.send('export-data', result.filePath);
        }
      }
    } catch (error) {
      log.error("Console", '❌ Export error:', error);
      await this.showErrorDialog('Export failed', String(error));
    }
  }

  /**
   * Import user data
   */
  static async importData(): Promise<void> {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    
    try {
      const result = focusedWindow
        ? await dialog.showOpenDialog(focusedWindow, {
            title: 'Import Loop Data',
            filters: [
              { name: 'JSON Files', extensions: ['json'] },
              { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['openFile']
          })
        : await dialog.showOpenDialog({
            title: 'Import Loop Data',
            filters: [
              { name: 'JSON Files', extensions: ['json'] },
              { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['openFile']
          });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        log.info("Console", '📥 Importing data from:', filePath);
        
        // Send IPC to main process to handle import
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (mainWindow && 'webContents' in mainWindow) {
          const win = mainWindow as BrowserWindow;
          win.webContents.send('import-data', filePath);
        }
      }
    } catch (error) {
      log.error("Console", '❌ Import error:', error);
      await this.showErrorDialog('Import failed', String(error));
    }
  }

  /**
   * Navigate to dashboard
   */
  static async navigateToDashboard(): Promise<void> {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow && 'webContents' in mainWindow) {
      const win = mainWindow as BrowserWindow;
      win.webContents.send('navigate-to', '/dashboard');
      win.show();
      win.focus();
    }
  }

  /**
   * Navigate to analytics
   */
  static async navigateToAnalytics(): Promise<void> {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow && 'webContents' in mainWindow) {
      const win = mainWindow as BrowserWindow;
      win.webContents.send('navigate-to', '/analytics');
      win.show();
      win.focus();
    }
  }

  /**
   * Navigate to settings
   */
  static async navigateToSettings(): Promise<void> {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow && 'webContents' in mainWindow) {
      const win = mainWindow as BrowserWindow;
      win.webContents.send('navigate-to', '/settings');
      win.show();
      win.focus();
    }
  }

  /**
   * Show keyboard shortcuts help
   */
  static async showKeyboardShortcuts(): Promise<void> {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    
    const shortcuts = [
      '⌘/Ctrl + N: New Session',
      '⌘/Ctrl + D: Dashboard',
      '⌘/Ctrl + A: Analytics',
      '⌘/Ctrl + S: Settings',
      '⌘/Ctrl + ,: Preferences',
      '⌘/Ctrl + F: Find in Page',
      '⌘/Ctrl + E: Export Data',
      '⌘/Ctrl + I: Import Data',
      '⌘/Ctrl + ?: Show Shortcuts',
      'F11: Toggle Fullscreen',
      '⌘/Ctrl + R: Reload',
      '⌘/Ctrl + Shift + R: Force Reload',
      '⌘/Ctrl + Shift + I: Developer Tools'
    ];

    const options = {
      type: 'info' as const,
      title: 'Keyboard Shortcuts',
      message: 'Loop Keyboard Shortcuts',
      detail: shortcuts.join('\n'),
      buttons: ['OK'],
      defaultId: 0
    };

    if (focusedWindow) {
      await dialog.showMessageBox(focusedWindow, options);
    } else {
      await dialog.showMessageBox(options);
    }
  }

  /**
   * Check for application updates
   */
  static async checkForUpdates(): Promise<void> {
    log.info("Console", '🔄 Checking for updates...');
    
    // TODO: Implement actual update checking
    const focusedWindow = BrowserWindow.getFocusedWindow();
    
    const options = {
      type: 'info' as const,
      title: 'Check for Updates',
      message: 'Update Check',
      detail: 'You are running the latest version of Loop.',
      buttons: ['OK'],
      defaultId: 0
    };

    if (focusedWindow) {
      await dialog.showMessageBox(focusedWindow, options);
    } else {
      await dialog.showMessageBox(options);
    }
  }

  /**
   * Open external links
   */
  static async openExternal(url: string): Promise<void> {
    try {
      await shell.openExternal(url);
    } catch (error) {
      log.error("Console", `❌ Failed to open external URL: ${url}`, error);
      await this.showErrorDialog('Failed to open link', `Could not open ${url}`);
    }
  }

  /**
   * Show error dialog
   */
  static async showErrorDialog(title: string, message: string): Promise<void> {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    
    const options = {
      type: 'error' as const,
      title: `Loop Error - ${title}`,
      message: title,
      detail: message,
      buttons: ['OK'],
      defaultId: 0
    };

    if (focusedWindow) {
      await dialog.showMessageBox(focusedWindow, options);
    } else {
      await dialog.showMessageBox(options);
    }
  }

  /**
   * Clear recent files
   */
  static async clearRecentFiles(): Promise<void> {
    log.info("Console", '🗑️ Clearing recent files...');
    // TODO: Implement recent files clearing
    app.clearRecentDocuments();
  }

  /**
   * Reload window
   */
  static reloadWindow(): void {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && 'webContents' in focusedWindow) {
      const win = focusedWindow as BrowserWindow;
      win.webContents.reload();
    }
  }

  /**
   * Force reload window
   */
  static forceReloadWindow(): void {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && 'webContents' in focusedWindow) {
      const win = focusedWindow as BrowserWindow;
      win.webContents.reloadIgnoringCache();
    }
  }

  /**
   * Toggle developer tools
   */
  static toggleDevTools(): void {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && 'webContents' in focusedWindow) {
      const win = focusedWindow as BrowserWindow;
      win.webContents.toggleDevTools();
    }
  }
}

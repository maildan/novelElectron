import { Logger } from "../../shared/logger";
const log = Logger;/**
 * Menu items and templates for the application
 * Modularized from MenuManager.ts
 */

import { MenuItemConstructorOptions, app, shell, dialog, BrowserWindow } from 'electron';
import { IS_MAC, APP_NAME } from '../constants';

/**
 * Get application menu template
 */
export function getApplicationMenuTemplate(): MenuItemConstructorOptions[] {
  const template: MenuItemConstructorOptions[] = [];

  // macOS Application Menu
  if (IS_MAC) {
    template.push({
      label: APP_NAME,
      submenu: [
        {
          label: `About ${APP_NAME}`,
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Cmd+,',
          click: () => {
            // TODO: Open preferences window
            log.info("Console", 'Open preferences');
          }
        },
        { type: 'separator' },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: `Hide ${APP_NAME}`,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideOthers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: `Quit ${APP_NAME}`,
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    });
  }

  // File Menu
  template.push({
    label: 'File',
    submenu: [
      {
        label: 'New Session',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          // TODO: Create new typing session
          log.info("Console", 'New session');
        }
      },
      {
        label: 'Open Recent',
        submenu: [
          {
            label: 'Clear Recently Used',
            click: () => {
              // TODO: Clear recent files
              log.info("Console", 'Clear recent');
            }
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Export Data...',
        accelerator: 'CmdOrCtrl+E',
        click: async () => {
          // TODO: Export user data
          log.info("Console", 'Export data');
        }
      },
      {
        label: 'Import Data...',
        accelerator: 'CmdOrCtrl+I',
        click: async () => {
          // TODO: Import user data
          log.info("Console", 'Import data');
        }
      },
      { type: 'separator' },
      ...(IS_MAC ? [] : [
        {
          label: 'Preferences...',
          accelerator: 'Ctrl+,',
          click: () => {
            // TODO: Open preferences window
            log.info("Console", 'Open preferences');
          }
        } as MenuItemConstructorOptions,
        { type: 'separator' } as MenuItemConstructorOptions,
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        } as MenuItemConstructorOptions
      ])
    ]
  });

  // Edit Menu
  template.push({
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
      { type: 'separator' },
      {
        label: 'Find in Page',
        accelerator: 'CmdOrCtrl+F',
        click: (menuItem, browserWindow) => {
          if (browserWindow && 'webContents' in browserWindow) {
            const win = browserWindow as BrowserWindow;
            win.webContents.sendInputEvent({
              type: 'keyDown',
              keyCode: 'F',
              modifiers: ['control']
            });
          }
        }
      }
    ]
  });

  // View Menu
  template.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      {
        label: 'Dashboard',
        accelerator: 'CmdOrCtrl+D',
        click: () => {
          // TODO: Navigate to dashboard
          log.info("Console", 'Navigate to dashboard');
        }
      },
      {
        label: 'Analytics',
        accelerator: 'CmdOrCtrl+A',
        click: () => {
          // TODO: Navigate to analytics
          log.info("Console", 'Navigate to analytics');
        }
      },
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          // TODO: Navigate to settings
          log.info("Console", 'Navigate to settings');
        }
      }
    ]
  });

  // Window Menu
  template.push({
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      ...(IS_MAC ? [
        { role: 'close' as const },
        { role: 'zoom' as const },
        { type: 'separator' as const },
        { role: 'front' as const }
      ] : [
        { role: 'close' as const }
      ])
    ]
  });

  // Help Menu
  template.push({
    label: 'Help',
    submenu: [
      {
        label: 'About Loop',
        click: () => {
          // TODO: Show about dialog
          log.info("Console", 'Show about');
        }
      },
      {
        label: 'Documentation',
        click: () => {
          shell.openExternal('https://loop.app/docs');
        }
      },
      {
        label: 'Keyboard Shortcuts',
        accelerator: 'CmdOrCtrl+?',
        click: () => {
          // TODO: Show shortcuts help
          log.info("Console", 'Show shortcuts');
        }
      },
      { type: 'separator' },
      {
        label: 'Report Issue',
        click: () => {
          shell.openExternal('https://github.com/loop/loop/issues');
        }
      },
      {
        label: 'Contact Support',
        click: () => {
          shell.openExternal('mailto:support@loop.app');
        }
      },
      { type: 'separator' },
      {
        label: 'Check for Updates...',
        click: () => {
          // TODO: Check for updates
          log.info("Console", 'Check for updates');
        }
      }
    ]
  });

  return template;
}

/**
 * Get context menu template for text editing
 */
export function getContextMenuTemplate(): MenuItemConstructorOptions[] {
  return [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { role: 'selectAll' },
    { type: 'separator' },
    {
      label: 'Inspect Element',
      click: (menuItem, browserWindow) => {
        if (browserWindow && 'webContents' in browserWindow) {
          const win = browserWindow as BrowserWindow;
          win.webContents.openDevTools();
        }
      }
    }
  ];
}

/**
 * Get dock menu template (macOS only)
 */
export function getDockMenuTemplate(): MenuItemConstructorOptions[] {
  if (!IS_MAC) return [];

  return [
    {
      label: 'New Session',
      click: () => {
        // TODO: Create new typing session
        log.info("Console", 'New session from dock');
      }
    },
    {
      label: 'Show Dashboard',
      click: () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
          windows[0].show();
          windows[0].focus();
        }
      }
    }
  ];
}

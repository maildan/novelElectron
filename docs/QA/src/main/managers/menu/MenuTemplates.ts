/**
 * 🔥 기가차드 메뉴 템플릿
 * Loop Typing Analytics - Menu Templates
 */

import { MenuItemConstructorOptions, app, shell } from 'electron';

/**
 * macOS 앱 메뉴 템플릿
 */
export function getMacAppMenuTemplate(): MenuItemConstructorOptions {
  return {
    label: app.getName(),
    submenu: [
      { label: `About ${app.getName()}`, role: 'about' },
      { type: 'separator' },
      { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => {} },
      { type: 'separator' },
      { label: `Hide ${app.getName()}`, accelerator: 'Command+H', role: 'hide' },
      { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideOthers' },
      { label: 'Show All', role: 'unhide' },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
    ]
  };
}

/**
 * File 메뉴 템플릿
 */
export function getFileMenuTemplate(): MenuItemConstructorOptions {
  return {
    label: 'File',
    submenu: [
      { label: 'New Session', accelerator: 'CmdOrCtrl+N', click: () => {} },
      { type: 'separator' },
      process.platform === 'darwin' 
        ? { label: 'Close', accelerator: 'Command+W', role: 'close' }
        : { label: 'Quit', accelerator: 'Ctrl+Q', click: () => app.quit() }
    ]
  };
}

/**
 * View 메뉴 템플릿
 */
export function getViewMenuTemplate(): MenuItemConstructorOptions {
  return {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
      { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
      { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
      { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
      { type: 'separator' },
      { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
    ]
  };
}

/**
 * Help 메뉴 템플릿
 */
export function getHelpMenuTemplate(): MenuItemConstructorOptions {
  return {
    label: 'Help',
    submenu: [
      {
        label: 'About Loop',
        click: () => {}
      },
      {
        label: 'Learn More',
        click: () => shell.openExternal('https://github.com/your-repo/loop')
      }
    ]
  };
}

/**
 * 컨텍스트 메뉴 템플릿
 */
export function getContextMenuTemplate(): MenuItemConstructorOptions[] {
  return [
    { label: 'Cut', role: 'cut' },
    { label: 'Copy', role: 'copy' },
    { label: 'Paste', role: 'paste' },
    { type: 'separator' },
    { label: 'Select All', role: 'selectAll' }
  ];
}

/**
 * 전체 애플리케이션 메뉴 템플릿
 */
export function getApplicationMenuTemplate(): MenuItemConstructorOptions[] {
  const template: MenuItemConstructorOptions[] = [];

  // macOS 전용 앱 메뉴
  if (process.platform === 'darwin') {
    template.push(getMacAppMenuTemplate());
  }

  // 공통 메뉴들
  template.push(getFileMenuTemplate());
  template.push(getViewMenuTemplate());
  template.push(getHelpMenuTemplate());

  return template;
}

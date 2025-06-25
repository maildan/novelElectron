import { Logger } from "@shared/logger";
const log = Logger;/**
 * 🔥 기가차드 메뉴 매니저 - 모듈화 버전
 * Loop Typing Analytics - Menu Manager
 */
import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { getApplicationMenuTemplate, getContextMenuTemplate } from './menu/MenuTemplates';
import { MenuHandlers } from './menu/MenuHandlers';

export interface MenuOptions {
  showPreferences?: boolean;
  showAbout?: boolean;
  showDevTools?: boolean;
  appName?: string;
}

export class MenuManager {
  private static instance: MenuManager;
  private isInitialized = false;
  private applicationMenu: Menu | null = null;
  private contextMenu: Menu | null = null;

  private constructor() {}

  static getInstance(): MenuManager {
    if (!MenuManager.instance) {
      MenuManager.instance = new MenuManager();
    }
    return MenuManager.instance;
  }

  /**
   * 🔥 기본 메뉴 설정 (AppLifecycle에서 호출)
   */
  setupDefaultMenu(): void {
    this.initialize();
  }

  /**
   * 메뉴 초기화
   */
  initialize(options: MenuOptions = {}): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.createApplicationMenu(options);
      this.createContextMenu();
      this.bindMenuHandlers();
      
      this.isInitialized = true;
      log.info("Console", '🔥 기가차드 메뉴 매니저 초기화 완료');
    } catch (error) {
      log.error("Console", '❌ 메뉴 매니저 초기화 실패:', error);
    }
  }

  /**
   * 애플리케이션 메뉴 생성
   */
  private createApplicationMenu(options: MenuOptions): void {
    try {
      const template = getApplicationMenuTemplate();
      
      // 핸들러 바인딩
      this.bindHandlersToTemplate(template);
      
      this.applicationMenu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(this.applicationMenu);
      
      log.info("Console", '✅ 애플리케이션 메뉴 생성 완료');
    } catch (error) {
      log.error("Console", '❌ 애플리케이션 메뉴 생성 실패:', error);
    }
  }

  /**
   * 컨텍스트 메뉴 생성
   */
  private createContextMenu(): void {
    try {
      const template = getContextMenuTemplate();
      this.contextMenu = Menu.buildFromTemplate(template);
      
      log.info("Console", '✅ 컨텍스트 메뉴 생성 완료');
    } catch (error) {
      log.error("Console", '❌ 컨텍스트 메뉴 생성 실패:', error);
    }
  }

  /**
   * 템플릿에 핸들러 바인딩
   */
  private bindHandlersToTemplate(template: MenuItemConstructorOptions[]): void {
    for (const item of template) {
      if (item.submenu && Array.isArray(item.submenu)) {
        this.bindHandlersToTemplate(item.submenu as MenuItemConstructorOptions[]);
      }
      
      // 특정 라벨에 따라 핸들러 바인딩
      if (item.label === 'About Loop') {
        item.click = MenuHandlers.showAbout;
      } else if (item.label === 'Preferences...') {
        item.click = MenuHandlers.openPreferences;
      } else if (item.label === 'New Session') {
        item.click = MenuHandlers.createNewSession;
      }
    }
  }

  /**
   * 메뉴 핸들러 바인딩
   */
  private bindMenuHandlers(): void {
    // IPC 이벤트 리스너 등록 (필요시)
    log.info("Console", '✅ 메뉴 핸들러 바인딩 완료');
  }

  /**
   * 컨텍스트 메뉴 표시
   */
  showContextMenu(window?: BrowserWindow): void {
    if (!this.contextMenu) {
      log.warn("Console", '⚠️ 컨텍스트 메뉴가 초기화되지 않았습니다');
      return;
    }

    try {
      const targetWindow = window || BrowserWindow.getFocusedWindow();
      if (targetWindow) {
        this.contextMenu.popup({ window: targetWindow });
      }
    } catch (error) {
      log.error("Console", '❌ 컨텍스트 메뉴 표시 실패:', error);
    }
  }

  /**
   * 정리
   */
  cleanup(): void {
    try {
      this.applicationMenu = null;
      this.contextMenu = null;
      this.isInitialized = false;
      
      log.info("Console", '✅ 메뉴 매니저 정리 완료');
    } catch (error) {
      log.error("Console", '❌ 메뉴 매니저 정리 실패:', error);
    }
  }
}
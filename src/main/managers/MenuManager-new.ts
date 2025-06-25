/**
 * Simplified and modularized MenuManager
 * Uses separate modules for menu items and handlers
 */

import { Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { getApplicationMenuTemplate, getContextMenuTemplate, getDockMenuTemplate } from '@main/menu/menu-items';
import { MenuHandlers } from '@main/menu/menu-handlers';
import { IS_MAC } from '@main/constants';

export interface MenuOptions {
  showPreferences?: boolean;
  showAbout?: boolean;
  showQuit?: boolean;
  showDevTools?: boolean;
  enableAutoUpdates?: boolean;
  appName?: string;
  recentFiles?: string[];
  items?: MenuItemConstructorOptions[];
}

export interface ContextMenuOptions {
  x?: number;
  y?: number;
  showInspect?: boolean;
  items?: MenuItemConstructorOptions[];
}

/**
 * MenuManager - Simplified and modular menu management
 */
export class MenuManager {
  private static instance: MenuManager;
  private applicationMenu: Menu | null = null;
  private contextMenu: Menu | null = null;
  private dockMenu: Menu | null = null;
  private initialized = false;

  /**
   * Get singleton instance
   */
  static getInstance(): MenuManager {
    if (!MenuManager.instance) {
      MenuManager.instance = new MenuManager();
    }
    return MenuManager.instance;
  }

  /**
   * Initialize menu system
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('⚠️ MenuManager already initialized');
      return;
    }

    try {
      console.log('🎯 Initializing MenuManager...');
      
      // Setup application menu
      await this.setupApplicationMenu();
      
      // Setup context menu
      this.setupContextMenu();
      
      // Setup dock menu (macOS only)
      if (IS_MAC) {
        this.setupDockMenu();
      }

      // Register menu handlers
      this.registerMenuHandlers();

      this.initialized = true;
      console.log('✅ MenuManager initialized successfully');
    } catch (error) {
      console.error('❌ MenuManager initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup default application menu
   */
  async setupDefaultMenu(): Promise<void> {
    await this.setupApplicationMenu();
  }

  /**
   * Setup application menu
   */
  private async setupApplicationMenu(): Promise<void> {
    try {
      const template = getApplicationMenuTemplate();
      this.applicationMenu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(this.applicationMenu);
      
      console.log('✅ Application menu set successfully');
    } catch (error) {
      console.error('❌ Failed to setup application menu:', error);
      throw error;
    }
  }

  /**
   * Setup context menu
   */
  private setupContextMenu(): void {
    try {
      const template = getContextMenuTemplate();
      this.contextMenu = Menu.buildFromTemplate(template);
      
      console.log('✅ Context menu setup successfully');
    } catch (error) {
      console.error('❌ Failed to setup context menu:', error);
    }
  }

  /**
   * Setup dock menu (macOS only)
   */
  private setupDockMenu(): void {
    if (!IS_MAC) return;

    try {
      const template = getDockMenuTemplate();
      this.dockMenu = Menu.buildFromTemplate(template);
      // Note: Dock menu is set when needed, not immediately
      
      console.log('✅ Dock menu setup successfully');
    } catch (error) {
      console.error('❌ Failed to setup dock menu:', error);
    }
  }

  /**
   * Register menu event handlers
   */
  private registerMenuHandlers(): void {
    // Menu handlers are integrated directly in menu-items.ts
    // This method can be used for additional global menu handling
    console.log('✅ Menu handlers registered');
  }

  /**
   * Show context menu
   */
  showContextMenu(window?: BrowserWindow, options?: ContextMenuOptions): void {
    if (!this.contextMenu) {
      console.warn('⚠️ Context menu not initialized');
      return;
    }

    try {
      const targetWindow = window || BrowserWindow.getFocusedWindow();
      if (targetWindow) {
        this.contextMenu.popup({
          window: targetWindow,
          x: options?.x,
          y: options?.y
        });
      }
    } catch (error) {
      console.error('❌ Failed to show context menu:', error);
    }
  }

  /**
   * Update application menu
   */
  updateApplicationMenu(template?: MenuItemConstructorOptions[]): void {
    try {
      const menuTemplate = template || getApplicationMenuTemplate();
      this.applicationMenu = Menu.buildFromTemplate(menuTemplate);
      Menu.setApplicationMenu(this.applicationMenu);
      
      console.log('✅ Application menu updated');
    } catch (error) {
      console.error('❌ Failed to update application menu:', error);
    }
  }

  /**
   * Set dock menu (macOS only)
   */
  setDockMenu(): void {
    if (!IS_MAC || !this.dockMenu) return;

    try {
      const { app } = require('electron');
      app.dock.setMenu(this.dockMenu);
      console.log('✅ Dock menu set');
    } catch (error) {
      console.error('❌ Failed to set dock menu:', error);
    }
  }

  /**
   * Add recent file to menu
   */
  addRecentFile(filePath: string): void {
    try {
      const { app } = require('electron');
      app.addRecentDocument(filePath);
      console.log('✅ Added recent file:', filePath);
    } catch (error) {
      console.error('❌ Failed to add recent file:', error);
    }
  }

  /**
   * Clear recent files
   */
  clearRecentFiles(): void {
    try {
      MenuHandlers.clearRecentFiles();
      console.log('✅ Recent files cleared');
    } catch (error) {
      console.error('❌ Failed to clear recent files:', error);
    }
  }

  /**
   * Get menu handlers for external use
   */
  getHandlers(): typeof MenuHandlers {
    return MenuHandlers;
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Cleanup menu resources
   */
  cleanup(): void {
    try {
      // Clear menu references
      this.applicationMenu = null;
      this.contextMenu = null;
      this.dockMenu = null;
      this.initialized = false;
      
      console.log('✅ MenuManager cleanup completed');
    } catch (error) {
      console.error('❌ MenuManager cleanup failed:', error);
    }
  }

  /**
   * Static method for quick setup (compatibility)
   */
  static async setupDefaultMenu(): Promise<void> {
    const manager = MenuManager.getInstance();
    await manager.setupDefaultMenu();
  }
}

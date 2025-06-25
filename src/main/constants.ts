/**
 * Application-wide constants
 * Centralized configuration values for the Loop application
 */

import { app } from 'electron';
import path from 'path';

// ========================
// APP METADATA
// ========================
export const APP_NAME = 'Loop';
export const APP_VERSION = app.getVersion();
export const APP_AUTHOR = 'Loop Team';
export const APP_DESCRIPTION = 'Loop - Advanced Typing Analytics';

// ========================
// DEVELOPMENT FLAGS
// ========================
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_PACKAGED = app.isPackaged;
export const IS_MAC = process.platform === 'darwin';
export const IS_WINDOWS = process.platform === 'win32';
export const IS_LINUX = process.platform === 'linux';

// ========================
// PATHS
// ========================
export const USER_DATA_PATH = app.getPath('userData');
export const LOGS_PATH = path.join(USER_DATA_PATH, 'logs');
export const CACHE_PATH = path.join(USER_DATA_PATH, 'cache');
export const DATABASE_PATH = path.join(USER_DATA_PATH, 'app.db');
export const SETTINGS_PATH = path.join(USER_DATA_PATH, 'settings.json');
export const PRELOAD_PATH = path.join(__dirname, '..', 'preload', 'index.js');

// ========================
// WINDOW CONFIGURATION
// ========================
export const WINDOW_CONFIG = {
  DEFAULT: {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: !IS_MAC, // Frameless on macOS for native feel
    titleBarStyle: IS_MAC ? 'hiddenInset' as const : 'default' as const,
    transparent: false,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    fullscreenable: true,
    alwaysOnTop: false,
    center: true,
    show: false, // Start hidden, show when ready
    focusable: true
  },
  SPLASH: {
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    center: true,
    show: false
  }
} as const;

// ========================
// KEYBOARD MONITORING
// ========================
export const KEYBOARD_CONFIG = {
  POLLING_RATE: 16, // ~60fps for smooth monitoring
  DEBOUNCE_DELAY: 50, // ms to debounce rapid key events
  SESSION_TIMEOUT: 30000, // 30 seconds of inactivity
  BATCH_SIZE: 100, // Number of events to batch before saving
  MAX_BUFFER_SIZE: 1000, // Maximum events in memory buffer
  CLEANUP_INTERVAL: 300000, // 5 minutes
  PERMISSION_CHECK_INTERVAL: 10000 // 10 seconds
} as const;

// ========================
// DATABASE CONFIGURATION
// ========================
export const DATABASE_CONFIG = {
  CONNECTION_TIMEOUT: 5000, // 5 seconds
  QUERY_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  VACUUM_INTERVAL: 86400000, // 24 hours
  BACKUP_INTERVAL: 604800000, // 1 week
  MAX_LOG_ENTRIES: 10000
} as const;

// ========================
// IPC CHANNELS
// ========================
export const IPC_CHANNELS = {
  // System
  GET_APP_VERSION: 'get-app-version',
  GET_PLATFORM_INFO: 'get-platform-info',
  APP_READY: 'app-ready',
  
  // Window Management
  WINDOW_MINIMIZE: 'window-minimize',
  WINDOW_MAXIMIZE: 'window-maximize',
  WINDOW_CLOSE: 'window-close',
  WINDOW_FULLSCREEN: 'window-fullscreen',
  
  // Database
  DATABASE_QUERY: 'database-query',
  DATABASE_EXECUTE: 'database-execute',
  GET_TYPING_STATS: 'get-typing-stats',
  SAVE_TYPING_SESSION: 'save-typing-session',
  
  // Keyboard
  START_KEYBOARD_MONITORING: 'start-keyboard-monitoring',
  STOP_KEYBOARD_MONITORING: 'stop-keyboard-monitoring',
  KEYBOARD_EVENT: 'keyboard-event',
  CHECK_PERMISSIONS: 'check-permissions',
  REQUEST_PERMISSIONS: 'request-permissions',
  
  // Settings
  GET_SETTINGS: 'get-settings',
  SET_SETTINGS: 'set-settings',
  RESET_SETTINGS: 'reset-settings',
  
  // Theme
  GET_THEME: 'get-theme',
  SET_THEME: 'set-theme',
  TOGGLE_THEME: 'toggle-theme',
  
  // Error Reporting
  REPORT_ERROR: 'report-error',
  GET_ERROR_LOG: 'get-error-log',
  CLEAR_ERROR_LOG: 'clear-error-log'
} as const;

// ========================
// ERROR TYPES
// ========================
export const ERROR_TYPES = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  KEYBOARD_ERROR: 'KEYBOARD_ERROR',
  WINDOW_ERROR: 'WINDOW_ERROR',
  IPC_ERROR: 'IPC_ERROR',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const;

// ========================
// LOG LEVELS
// ========================
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
} as const;

// ========================
// PERFORMANCE THRESHOLDS
// ========================
export const PERFORMANCE = {
  MEMORY_WARNING_MB: 500,
  MEMORY_CRITICAL_MB: 1000,
  CPU_WARNING_PERCENT: 80,
  CPU_CRITICAL_PERCENT: 95,
  RESPONSE_TIME_WARNING_MS: 100,
  RESPONSE_TIME_CRITICAL_MS: 1000
} as const;

// ========================
// FEATURE FLAGS
// ========================
export const FEATURES = {
  ANALYTICS_ENABLED: true,
  CRASH_REPORTING: !IS_DEV,
  AUTO_UPDATES: !IS_DEV,
  TELEMETRY: false, // Privacy-first approach
  SYSTEM_TRAY: true,
  STARTUP_ON_BOOT: false,
  HARDWARE_ACCELERATION: true,
  SPELL_CHECK: true
} as const;

// ========================
// URL CONFIGURATION
// ========================
export const URLS = {
  MAIN_WINDOW: IS_DEV 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../../renderer/index.html')}`,
  SPLASH_WINDOW: IS_DEV
    ? 'http://localhost:3000/splash'
    : `file://${path.join(__dirname, '../../renderer/splash.html')}`,
  HELP_URL: 'https://loop.app/help',
  PRIVACY_URL: 'https://loop.app/privacy',
  TERMS_URL: 'https://loop.app/terms'
} as const;

// ========================
// SECURITY CONFIGURATION
// ========================
export const SECURITY = {
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'"],
    IMG_SRC: ["'self'", "data:", "https:"],
    CONNECT_SRC: ["'self'"]
  },
  PERMISSIONS: {
    ACCESSIBILITY: 'accessibility',
    SCREEN_RECORDING: 'screen',
    INPUT_MONITORING: 'input-monitoring'
  }
} as const;

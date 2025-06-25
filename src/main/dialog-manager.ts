import { Logger } from "../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 다이얼로그 매니저 - 돌아가게 버전!
 * Loop Typing Analytics - Dialog Manager
 */
import { dialog, BrowserWindow, app, shell } from 'electron';
import { join } from 'path';

export enum DialogType {
  INFO = 'info',
  WARNING = 'warning', 
  ERROR = 'error',
  QUESTION = 'question'
}

export interface DialogResult {
  response: number;
  checkboxChecked?: boolean;
}

export class DialogManager {
  private static instance: DialogManager;

  private constructor() {}

  static getInstance(): DialogManager {
    if (!DialogManager.instance) {
      DialogManager.instance = new DialogManager();
    }
    return DialogManager.instance;
  }

  /**
   * 🔥 기가차드식 메시지 박스
   */
  async showMessageBox(
    title: string,
    message: string,
    type: DialogType = DialogType.INFO,
    buttons: string[] = ['확인']
  ): Promise<DialogResult> {
    try {
      const window = BrowserWindow.getFocusedWindow();
      
      const result = await dialog.showMessageBox(window || {
        // 🔥 기가차드식 해결법: window가 없으면 빈 옵션
      } as Electron.BrowserWindow, {
        type: type as Electron.MessageBoxOptions['type'],
        title,
        message,
        buttons,
        defaultId: 0,
        cancelId: buttons.length - 1
      });

      return {
        response: result.response,
        checkboxChecked: result.checkboxChecked
      };
    } catch (error) {
      log.error("Console", '🔥 기가차드 다이얼로그 에러:', error);
      throw error;
    }
  }

  /**
   * 🔥 파일 열기 다이얼로그
   */
  async showOpenDialog(options: {
    title?: string;
    filters?: { name: string; extensions: string[] }[];
    properties?: ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles')[];
  } = {}): Promise<string[]> {
    try {
      const window = BrowserWindow.getFocusedWindow();
      
      const result = await dialog.showOpenDialog(window || {
        // 🔥 기가차드식 해결법: window가 없으면 빈 옵션
      } as Electron.BrowserWindow, {
        title: options.title || '파일 선택',
        filters: options.filters || [
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: options.properties || ['openFile']
      });

      return result.canceled ? [] : result.filePaths;
    } catch (error) {
      log.error("Console", '🔥 기가차드 파일 열기 에러:', error);
      return [];
    }
  }

  /**
   * 🔥 파일 저장 다이얼로그
   */
  async showSaveDialog(options: {
    title?: string;
    defaultPath?: string;
    filters?: { name: string; extensions: string[] }[];
  } = {}): Promise<string | null> {
    try {
      const window = BrowserWindow.getFocusedWindow();
      
      const result = await dialog.showSaveDialog(window || {
        // 🔥 기가차드식 해결법: window가 없으면 빈 옵션
      } as Electron.BrowserWindow, {
        title: options.title || '파일 저장',
        defaultPath: options.defaultPath,
        filters: options.filters || [
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      return result.canceled ? null : result.filePath || null;
    } catch (error) {
      log.error("Console", '🔥 기가차드 파일 저장 에러:', error);
      return null;
    }
  }

  /**
   * 🔥 기가차드식 확인 다이얼로그
   */
  async confirm(
    title: string,
    message: string,
    okText: string = '확인',
    cancelText: string = '취소'
  ): Promise<boolean> {
    const result = await this.showMessageBox(
      title,
      message,
      DialogType.QUESTION,
      [okText, cancelText]
    );
    
    return result.response === 0;
  }

  /**
   * 🔥 기가차드식 경고 다이얼로그
   */
  async showWarning(title: string, message: string): Promise<void> {
    await this.showMessageBox(title, message, DialogType.WARNING);
  }

  /**
   * 🔥 기가차드식 에러 다이얼로그
   */
  async showError(title: string, message: string): Promise<void> {
    await this.showMessageBox(title, message, DialogType.ERROR);
  }

  /**
   * 🔥 기가차드식 정보 다이얼로그
   */
  async showInfo(title: string, message: string): Promise<void> {
    await this.showMessageBox(title, message, DialogType.INFO);
  }

  /**
   * 🔥 About 다이얼로그 (기가차드 스타일!)
   */
  async showAbout(): Promise<void> {
    const aboutMessage = [
      `🔥 기가차드 Loop ${app.getVersion()}`,
      '',
      '💪 타이핑 분석의 기가차드!',
      '⌨️ 키보드 모니터링 시스템',
      '📊 실시간 통계 분석',
      '',
      '🚀 Made by 기가차드팀'
    ].join('\n');

    await this.showInfo('🔥 기가차드 Loop 정보', aboutMessage);
  }

  /**
   * 🔥 외부 링크 열기
   */
  async openExternal(url: string): Promise<void> {
    try {
      await shell.openExternal(url);
    } catch (error) {
      log.error("Console", '🔥 기가차드 링크 열기 에러:', error);
      await this.showError('링크 열기 실패', `링크를 열 수 없습니다: ${url}`);
    }
  }

  /**
   * 🔥 폴더 열기
   */
  async openPath(path: string): Promise<void> {
    try {
      await shell.openPath(path);
    } catch (error) {
      log.error("Console", '🔥 기가차드 폴더 열기 에러:', error);
      await this.showError('폴더 열기 실패', `폴더를 열 수 없습니다: ${path}`);
    }
  }

  /**
   * 🔥 에러 리포트 다이얼로그
   */
  async showErrorReport(error: Error, context?: string): Promise<void> {
    const errorMessage = [
      '🔥 기가차드가 에러를 감지했습니다!',
      '',
      `❌ 에러: ${error.message}`,
      context ? `📍 상황: ${context}` : '',
      '',
      '💡 이 문제가 계속되면 개발팀에 연락해주세요.'
    ].filter(Boolean).join('\n');

    const result = await this.showMessageBox(
      '🔥 기가차드 에러 리포트',
      errorMessage,
      DialogType.ERROR,
      ['확인', '로그 폴더 열기']
    );

    if (result.response === 1) {
      // 로그 폴더 열기
      const logPath = join(app.getPath('userData'), 'logs');
      await this.openPath(logPath);
    }
  }
}

export default DialogManager;

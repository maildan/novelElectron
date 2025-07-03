// 🔥 노션 스타일 마크다운 자동 변환 유틸리티

import { Logger } from '../../../../shared/logger';

// CodeMirror 타입 정의
interface CodeMirrorInstance {
  setOption(option: string, value: unknown): void;
  getCursor(): { line: number; ch: number };
  getLine(line: number): string;
  replaceRange(replacement: string, from: { line: number; ch: number }, to?: { line: number; ch: number }): void;
  setCursor(pos: { line: number; ch: number }): void;
  getSelection(): string;
  replaceSelection(replacement: string): void;
  execCommand(command: string): void;
}

// 🔥 노션 스타일 키 이벤트 핸들러 설정
export const setupNotionStyleKeys = (cm: CodeMirrorInstance): void => {
  if (!cm) return;
  
  cm.setOption('extraKeys', {
    'Enter': function(cm: CodeMirrorInstance) {
      const cursor = cm.getCursor();
      const line = cm.getLine(cursor.line);
      
      // 불릿 리스트 자동 연장
      const listMatch = line.match(/^(\s*)([-*+])\s/);
      if (listMatch) {
        const indent = listMatch[1];
        const bullet = listMatch[2];
        
        // 현재 줄이 비어있으면 리스트 종료
        if (line.trim() === bullet) {
          cm.replaceRange('', { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
          cm.execCommand('newlineAndIndent');
          return;
        }
        
        // 새 리스트 아이템 생성
        cm.execCommand('newlineAndIndent');
        const newCursor = cm.getCursor();
        cm.replaceRange(`${indent}${bullet} `, { line: newCursor.line, ch: 0 });
        cm.setCursor({ line: newCursor.line, ch: `${indent}${bullet} `.length });
        return;
      }
      
      // 기본 Enter 동작
      cm.execCommand('newlineAndIndent');
    },
    
    'Space': function(cm: any) {
      const cursor = cm.getCursor();
      const line = cm.getLine(cursor.line);
      const beforeCursor = line.substring(0, cursor.ch);
      
      // # 헤딩 자동 변환
      if (beforeCursor === '#') {
        cm.replaceRange('# ', { line: cursor.line, ch: 0 }, { line: cursor.line, ch: cursor.ch });
        cm.setCursor({ line: cursor.line, ch: 2 });
        Logger.debug('MARKDOWN_UTILS', 'Auto-converted # to heading 1');
        return;
      }
      
      if (beforeCursor === '##') {
        cm.replaceRange('## ', { line: cursor.line, ch: 0 }, { line: cursor.line, ch: cursor.ch });
        cm.setCursor({ line: cursor.line, ch: 3 });
        Logger.debug('MARKDOWN_UTILS', 'Auto-converted ## to heading 2');
        return;
      }
      
      if (beforeCursor === '###') {
        cm.replaceRange('### ', { line: cursor.line, ch: 0 }, { line: cursor.line, ch: cursor.ch });
        cm.setCursor({ line: cursor.line, ch: 4 });
        Logger.debug('MARKDOWN_UTILS', 'Auto-converted ### to heading 3');
        return;
      }
      
      // - 불릿 리스트 자동 변환
      if (beforeCursor === '-') {
        cm.replaceRange('- ', { line: cursor.line, ch: 0 }, { line: cursor.line, ch: cursor.ch });
        cm.setCursor({ line: cursor.line, ch: 2 });
        Logger.debug('MARKDOWN_UTILS', 'Auto-converted - to bullet list');
        return;
      }
      
      // * 불릿 리스트 자동 변환
      if (beforeCursor === '*') {
        cm.replaceRange('* ', { line: cursor.line, ch: 0 }, { line: cursor.line, ch: cursor.ch });
        cm.setCursor({ line: cursor.line, ch: 2 });
        Logger.debug('MARKDOWN_UTILS', 'Auto-converted * to bullet list');
        return;
      }
      
      // 기본 스페이스 입력
      cm.replaceSelection(' ');
    },
    
    // 단축키들
    'Ctrl-1': function(cm: any) {
      const text = cm.getSelection();
      cm.replaceSelection('# ' + text);
      Logger.debug('MARKDOWN_UTILS', 'Applied heading 1 shortcut');
    },
    'Ctrl-2': function(cm: any) {
      const text = cm.getSelection();
      cm.replaceSelection('## ' + text);
      Logger.debug('MARKDOWN_UTILS', 'Applied heading 2 shortcut');
    },
    'Ctrl-3': function(cm: any) {
      const text = cm.getSelection();
      cm.replaceSelection('### ' + text);
      Logger.debug('MARKDOWN_UTILS', 'Applied heading 3 shortcut');
    },
    'Ctrl-U': function(cm: any) {
      const text = cm.getSelection();
      cm.replaceSelection('- ' + text);
      Logger.debug('MARKDOWN_UTILS', 'Applied unordered list shortcut');
    }
  });
  
  Logger.info('MARKDOWN_UTILS', 'Notion-style markdown shortcuts initialized');
};

// 🔥 마크다운 텍스트 분석
export const analyzeMarkdownText = (content: string) => {
  if (!content) return {
    wordCount: 0,
    charCount: 0,
    paragraphCount: 0,
    headingCount: 0,
    listItemCount: 0
  };
  
  const lines = content.split('\n');
  
  return {
    wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
    charCount: content.length,
    paragraphCount: content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
    headingCount: lines.filter(line => line.match(/^#{1,6}\s/)).length,
    listItemCount: lines.filter(line => line.match(/^[\s]*[-*+]\s/)).length
  };
};

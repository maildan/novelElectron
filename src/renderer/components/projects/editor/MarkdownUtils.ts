// 🔥 한글 입력 최적화 마크다운 유틸리티

import { Logger } from '../../../../shared/logger';

// CodeMirror 타입 정의 확장
interface CodeMirrorInstance {
  setOption(option: string, value: unknown): void;
  getCursor(): { line: number; ch: number };
  getLine(line: number): string;
  replaceRange(replacement: string, from: { line: number; ch: number }, to?: { line: number; ch: number }): void;
  setCursor(pos: { line: number; ch: number }): void;
  getSelection(): string;
  replaceSelection(replacement: string): void;
  execCommand(command: string): void;
  getWrapperElement?(): HTMLElement; // 🔥 CodeMirror wrapper 요소 접근
  getInputField?(): HTMLElement; // 🔥 입력 필드 접근
  focus?(): void; // 🔥 포커스 메서드 추가
}

// 🔥 한글 입력 최적화 설정 (2024-2025 IME 지원 강화)
export const setupKoreanInputOptimization = (cm: CodeMirrorInstance): void => {
  if (!cm) return;
  
  // 🔥 기본 IME 친화적 설정
  cm.setOption('inputStyle', 'contenteditable');
  cm.setOption('lineWrapping', true);
  cm.setOption('styleSelectedText', false); // 성능 향상
  cm.setOption('electricChars', false);
  cm.setOption('smartIndent', false);
  cm.setOption('autofocus', true);
  
  // 🔥 성능 최적화 추가 설정
  cm.setOption('workTime', 200);
  cm.setOption('workDelay', 300);
  cm.setOption('pollInterval', 100);
  
  // 🔥 IME Composition 이벤트 핸들러 추가 (최신 브라우저 지원)
  let isComposing = false;
  let compositionData = '';
  
  // Composition 시작 - 에디터 일시 정지
  const handleCompositionStart = (event: CompositionEvent) => {
    isComposing = true;
    compositionData = '';
    Logger.debug('IME', 'Composition started', { 
      data: event.data,
      target: event.target 
    });
    
    // CodeMirror의 키 이벤트 처리를 일시적으로 비활성화
    cm.setOption('readOnly', 'nocursor');
  };
  
  // Composition 진행 중 - 데이터 추적
  const handleCompositionUpdate = (event: CompositionEvent) => {
    if (event.data) {
      compositionData = event.data;
      Logger.debug('IME', 'Composition update:', { 
        data: event.data,
        length: event.data.length 
      });
    }
  };
  
  // Composition 완료 - 에디터 재활성화
  const handleCompositionEnd = (event: CompositionEvent) => {
    isComposing = false;
    Logger.debug('IME', 'Composition ended', { 
      finalData: event.data,
      compositionData 
    });
    
    // CodeMirror 재활성화
    cm.setOption('readOnly', false);
    
    // 포커스 복원
    setTimeout(() => {
      cm.focus?.();
    }, 0);
    
    compositionData = '';
  };
  
  // 키 이벤트에서 IME 상태 확인
  const handleKeyEvent = (event: KeyboardEvent) => {
    if (event.isComposing || isComposing) {
      // IME 조합 중이면 기본 동작 허용
      Logger.debug('IME', 'Key event during composition - allowing default', {
        key: event.key,
        isComposing: event.isComposing || isComposing
      });
      return true;
    }
    return false;
  };
  
  // 🔥 이벤트 리스너 등록 (안전한 방식으로 DOM 요소 접근)
  try {
    const wrapperElement = cm.getWrapperElement?.() || 
                          (cm as any).display?.wrapper ||
                          (cm as any).getWrapperElement?.();
    
    const inputElement = cm.getInputField?.() ||
                        wrapperElement?.querySelector('textarea') ||
                        wrapperElement?.querySelector('[contenteditable]') ||
                        (cm as any).display?.input?.getField?.();
    
    if (inputElement) {
      inputElement.addEventListener('compositionstart', handleCompositionStart);
      inputElement.addEventListener('compositionupdate', handleCompositionUpdate);
      inputElement.addEventListener('compositionend', handleCompositionEnd);
      inputElement.addEventListener('keydown', handleKeyEvent);
      inputElement.addEventListener('keyup', handleKeyEvent);
      
      Logger.info('IME', 'Composition event handlers registered successfully');
    } else {
      Logger.warn('IME', 'Could not find input element for composition events');
    }
  } catch (error) {
    Logger.error('IME', 'Failed to register composition event handlers', error);
  }
  
  Logger.info('MARKDOWN_UTILS', 'Korean IME optimization applied with composition events');
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
